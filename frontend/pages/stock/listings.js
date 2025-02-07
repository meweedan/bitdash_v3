// pages/stock/listings.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';
import {
  Box, Container, VStack, Text, Button, SimpleGrid, Flex,
  Input, Select, HStack, Badge, useToast, Image, Icon,
  useColorMode, Heading, InputGroup, InputLeftElement,
  Divider, IconButton, Skeleton, Stack, Progress
} from '@chakra-ui/react';
import {
  Package, Filter, Search, Warehouse, Calendar,
  Heart, Share2, TrendingUp, ArrowUpRight, ShoppingCart
} from 'lucide-react';
import Head from 'next/head';

const StockCard = ({ stock }) => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const isDark = colorMode === 'dark';

  if (!stock?.attributes) return null;
  const s = stock.attributes;

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
      <Box position="relative" h="200px">
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${s.images?.data?.[0]?.attributes?.url}`}
          alt={s.title}
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
          <IconButton
            icon={<Share2 size={20} />}
            rounded="full"
            size="sm"
            variant="solid"
            bg="white"
            color="gray.700"
            _hover={{ bg: 'gray.50' }}
          />
        </HStack>
        <Badge
          position="absolute"
          top={4}
          left={4}
          colorScheme={s.status === 'available' ? 'green' : 'red'}
          fontSize="sm"
          px={3}
          py={1}
          rounded="full"
        >
          {s.status.toUpperCase()}
        </Badge>
      </Box>

      <VStack p={6} align="stretch" spacing={4}>
        <Flex justify="space-between" align="start">
          <VStack align="start" spacing={1}>
            <Heading size="md" noOfLines={1}>{s.title}</Heading>
            <Text color="gray.500" fontSize="sm">
              {s.operator}
            </Text>
          </VStack>
          <VStack align="end" spacing={1}>
            <Text fontSize="xl" fontWeight="bold" color="blue.500">
              {new Intl.NumberFormat('en-US').format(s.price)} LYD
            </Text>
            <Text fontSize="sm" color={s.quantity > 10 ? "green.500" : "orange.500"}>
              {s.quantity} in stock
            </Text>
          </VStack>
        </Flex>

        <SimpleGrid columns={2} spacing={4}>
          <HStack>
            <Icon as={Warehouse} color="gray.500" />
            <Text fontSize="sm">{s.operator}</Text>
          </HStack>
          <HStack>
            <Icon as={TrendingUp} color="gray.500" />
            <Text fontSize="sm">{s.metadata?.trend || 'Stable'}</Text>
          </HStack>
          <HStack>
            <Icon as={Package} color="gray.500" />
            <Text fontSize="sm">{s.metadata?.category || 'General'}</Text>
          </HStack>
          <HStack>
            <Icon as={ArrowUpRight} color="gray.500" />
            <Text fontSize="sm">{s.metadata?.movement || 'Normal'}</Text>
          </HStack>
        </SimpleGrid>

        <Progress 
          value={(s.quantity / (s.metadata?.maxQuantity || 100)) * 100} 
          colorScheme={s.quantity > 10 ? "green" : "orange"}
          rounded="full"
        />

        <Button
          colorScheme="blue"
          w="full"
          leftIcon={<ShoppingCart size={20} />}
          onClick={() => router.push(`/stock/${stock.id}`)}
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
            placeholder={t('searchByTitle')}
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </InputGroup>
        
        <Select
          placeholder={t('operator')}
          value={filters.operator}
          onChange={(e) => setFilters(prev => ({ ...prev, operator: e.target.value }))}
        >
          {['Operator A', 'Operator B', 'Operator C'].map(op => (
            <option key={op} value={op}>{op}</option>
          ))}
        </Select>

        <Select
          placeholder={t('status')}
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
        >
          {['available', 'unavailable'].map(status => (
            <option key={status} value={status}>{status.toUpperCase()}</option>
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

const StockListings = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [stocks, setStocks] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    operator: '',
    status: '',
    minQuantity: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStocks();
  }, [filters]);

  const fetchStocks = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stocks?populate=*`
      );
      const data = await response.json();
      setStocks(data.data || []);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      toast({
        title: t('error'),
        description: t('failedToLoadStocks'),
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
        <title>BitStock - Listings</title>
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
              spacing={6} 
              textAlign="center" 
              mb={24}
            >
              <Icon as={Package} boxSize={16} />
              <Text fontSize="xl" maxW="2xl">
                {t('browseAvailableStock')}
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
          ) : stocks.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {stocks.map((stock) => (
                <StockCard key={stock.id} stock={stock} />
              ))}
            </SimpleGrid>
          ) : (
            <VStack py={12} spacing={4}>
              <Text fontSize="xl" color="gray.500">
                {t('noStocksFound')}
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

export default StockListings;