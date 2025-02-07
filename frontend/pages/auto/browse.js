// pages/auto/index.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';
import {
  Box, Container, VStack, Text, Button, SimpleGrid, Flex,
  Input, Select, HStack, Badge, useToast, Image, Icon,
  useColorMode, Heading, InputGroup, InputLeftElement,
  Divider, IconButton, Skeleton
} from '@chakra-ui/react';
import {
  Car, Filter, Search, MapPin, Calendar, Clock, 
  Heart, Share2, Zap, GitFork, Fuel
} from 'lucide-react';
import Head from 'next/head';

const VehicleCard = ({ vehicle }) => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const isDark = colorMode === 'dark';

  if (!vehicle?.attributes) return null;
  const v = vehicle.attributes;

  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      bg={isDark ? 'gray.800' : 'white'}
      _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
      transition="all 0.3s"
      position="relative"
    >
      <Box position="relative" h="240px">
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${v.mainImage?.data?.attributes?.url}`}
          alt={`${v.make} ${v.model}`}
          objectFit="cover"
          w="full"
          h="full"
          fallback={<Box w="full" h="full" bg="gray.200" />}
        />
        <HStack position="absolute" top={4} right={4} spacing={2}>
          <IconButton
            icon={<Heart size={20} />}
            rounded="full"
            size="sm"
            colorScheme="red"
            variant="solid"
            bg="white"
            color="gray.700"
            _hover={{ bg: 'red.50' }}
          />
        </HStack>
        <Badge
          position="absolute"
          top={4}
          left={4}
          colorScheme={v.dealRating === 'excellent' ? 'green' : 
                      v.dealRating === 'good' ? 'blue' : 'yellow'}
          fontSize="sm"
          px={3}
          py={1}
          rounded="full"
        >
          {v.dealRating.toUpperCase()} Deal
        </Badge>
      </Box>

      <VStack p={6} align="stretch" spacing={4}>
        <Flex justify="space-between" align="start">
          <VStack align="start" spacing={1}>
            <Heading size="md" noOfLines={1}>{v.make} {v.model}</Heading>
            <Text color="gray.500" fontSize="sm">
              {v.year} • {v.bodyType}
            </Text>
          </VStack>
          <VStack align="end" spacing={1}>
            <Text fontSize="xl" fontWeight="bold" color="blue.500">
              {new Intl.NumberFormat('en-US').format(v.price)} LYD
            </Text>
            {v.marketPrice > v.price && (
              <Text fontSize="sm" color="green.500">
                Save {new Intl.NumberFormat('en-US').format(v.marketPrice - v.price)} LYD
              </Text>
            )}
          </VStack>
        </Flex>

        <SimpleGrid columns={2} spacing={4}>
          <HStack>
            <Icon as={Clock} color="gray.500" />
            <Text fontSize="sm">{v.mileage?.toLocaleString()} km</Text>
          </HStack>
          <HStack>
            <Icon as={GitFork} color="gray.500" />
            <Text fontSize="sm">{v.transmission}</Text>
          </HStack>
          <HStack>
            <Icon as={Fuel} color="gray.500" />
            <Text fontSize="sm">{v.fuelType}</Text>
          </HStack>
          <HStack>
            <Icon as={Zap} color="gray.500" />
            <Text fontSize="sm">{v.enginePower} HP</Text>
          </HStack>
        </SimpleGrid>

        <Button
          colorScheme="blue"
          w="full"
          onClick={() => router.push(`/auto/${vehicle.id}`)}
        >
          View Details
        </Button>
      </VStack>
    </Box>
  );
};

const SearchFilters = ({ filters, setFilters }) => {
  const { t } = useTranslation('common');
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <Box
      bg={isDark ? 'gray.800' : 'white'}
      p={6}
      borderRadius="2xl"
      shadow="lg"
      mt={-20}
      position="relative"
      zIndex={2}
    >
      <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={4}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Search color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder={t('searchByMakeModel')}
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </InputGroup>
        
        <Select
          placeholder={t('make')}
          value={filters.make}
          onChange={(e) => setFilters(prev => ({ ...prev, make: e.target.value }))}
        >
          {['BMW', 'Mercedes', 'Toyota', 'Honda', 'Audi'].map(make => (
            <option key={make} value={make}>{make}</option>
          ))}
        </Select>

        <Select
          placeholder={t('bodyType')}
          value={filters.bodyType}
          onChange={(e) => setFilters(prev => ({ ...prev, bodyType: e.target.value }))}
        >
          {['sedan', 'suv', 'hatchback', 'coupe', 'wagon'].map(type => (
            <option key={type} value={type}>{type.toUpperCase()}</option>
          ))}
        </Select>

        <Button
          leftIcon={<Filter size={20} />}
          colorScheme="blue"
          w="full"
        >
          {t('moreFilters')}
        </Button>
      </SimpleGrid>
    </Box>
  );
};

const AutoMarketplace = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [vehicles, setVehicles] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    make: '',
    model: '',
    bodyType: '',
    status: 'available'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicles?populate=*`
      );
      const data = await response.json();
      setVehicles(data.data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast({
        title: t('error'),
        description: t('failedToLoadVehicles'),
        status: 'error',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Head>
        <title>BitAuto</title>
    </Head>
    <Layout>
      <Box>
        <Container maxW="8xl" py={20}>
          <VStack 
            bg={isDark ? 'gray.800' : '#67bdfd'}
            p={6}
            borderRadius="2xl"
            shadow="lg"
            mt={-20}
            position="relative"
            spacing={6} textAlign="center" mb={24}>
            <Icon as={Car} boxSize={16} />
            <Text fontSize="xl" maxW="2xl">
              {t('findYourNextCar')}
            </Text>
          </VStack>
          
          <SearchFilters filters={filters} setFilters={setFilters} />
        </Container>
      </Box>

      <Container maxW="8xl" py={12}>
        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {Array(6).fill(0).map((_, i) => (
              <Box key={i} h="500px">
                <Skeleton h="full" rounded="xl" />
              </Box>
            ))}
          </SimpleGrid>
        ) : vehicles.length > 0 ? (
          <>
            {/* Featured Vehicles */}
            {vehicles.some(v => v.attributes.featured) && (
              <Box mb={12}>
                <Heading size="lg" mb={6}>{t('featuredVehicles')}</Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {vehicles
                    .filter(v => v.attributes.featured)
                    .map((vehicle) => (
                      <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                </SimpleGrid>
              </Box>
            )}

            {/* All Vehicles */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {vehicles
                .filter(v => !v.attributes.featured)
                .map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
            </SimpleGrid>
          </>
        ) : (
          <VStack py={12} spacing={4}>
            <Text fontSize="xl" color="gray.500">
              {t('noVehiclesFound')}
            </Text>
          </VStack>
        )}
      </Container>
    </Layout>
    </>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default AutoMarketplace;