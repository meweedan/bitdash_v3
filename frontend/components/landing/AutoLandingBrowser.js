import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import {
  Box,
  Container,
  VStack,
  Text,
  Button,
  Heading,
  useColorMode,
  Grid,
  GridItem,
  SimpleGrid,
  HStack,
  useToast,
  Icon,
  Flex
} from '@chakra-ui/react';
import {
  Car,
  ArrowRight,
  CheckCircle,
  Settings,
  Warehouse,
  CarIcon,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import VehicleCard from '@/components/VehicleCard';
import AutoShowroomAnimation from '@/components/AutoShowroomAnimation';

const AutoLandingBrowser = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const toast = useToast();
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedVehicles();
  }, []);

  const fetchFeaturedVehicles = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicles?populate=*&filters[featured][$eq]=true`
      );
      const data = await response.json();
      setFeaturedVehicles(data.data || []);
    } catch (error) {
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
        <title>BitAuto | Redefining Automotive</title>
      </Head>
        <Container maxW="1500px" p={4}>
          {/* Hero Section */}
          <Box>
            <Container>
                <AutoShowroomAnimation />
              <Grid alignItems="center">
                <GridItem>
                  <VStack spacing={8}>
                    <Heading as="h1" size="2xl" lineHeight="shorter">
                      {t('titleBitAuto')}
                    </Heading>
                    <Text fontSize="xl" maxW="2xl">
                      {t('subheadingBitAuto')}
                    </Text>
                  </VStack>
                </GridItem>
              </Grid>
            </Container>
          </Box>

          {/* Features Section */}
          <Box py={20}>
            <Container maxW="7xl">
              <VStack spacing={16}>
                <VStack spacing={4} textAlign="center" maxW="2xl">
                  <Heading>{t('featurestitleBitAuto')}</Heading>
                  <Text fontSize="lg" color={isDark ? 'gray.400' : 'gray.600'}>
                    {t('whyChooseBitAuto')}
                  </Text>
                </VStack>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
                  <VStack align="start" spacing={4} p={6} rounded="xl" borderWidth="1px" borderColor={isDark ? 'gray.700' : 'gray.200'}>
                    <Icon as={Warehouse} size={24} className="text-blue-500" />
                    <Box>
                      <Text fontWeight="bold" mb={2}>{t('State-of-the-ArtHangar')}</Text>
                      <Text color={isDark ? 'gray.400' : 'gray.600'} fontSize="sm">
                        {t('360DegreeBitAuto')}
                      </Text>
                    </Box>
                  </VStack>
                  <VStack align="start" spacing={4} p={6} rounded="xl" borderWidth="1px" borderColor={isDark ? 'gray.700' : 'gray.200'}>
                    <Icon as={Settings} size={24} className="text-blue-500" />
                    <Box>
                      <Text fontWeight="bold" mb={2}>{t('ServiceTeam')}</Text>
                      <Text color={isDark ? 'gray.400' : 'gray.600'} fontSize="sm">
                        {t('expertBitAuto')}
                      </Text>
                    </Box>
                  </VStack>
                  <VStack align="start" spacing={4} p={6} rounded="xl" borderWidth="1px" borderColor={isDark ? 'gray.700' : 'gray.200'}>
                    <Icon as={CarIcon} size={24} className="text-blue-500" />
                    <Box>
                      <Text fontWeight="bold" mb={2}>{t('TransparentProcesses')}</Text>
                      <Text color={isDark ? 'gray.400' : 'gray.600'} fontSize="sm">
                        {t('CompleteTransparency')}
                      </Text>
                    </Box>
                  </VStack>
                  <VStack align="start" spacing={4} p={6} rounded="xl" borderWidth="1px" borderColor={isDark ? 'gray.700' : 'gray.200'}>
                    <Icon as={CheckCircle} size={24} className="text-blue-500" />
                    <Box>
                      <Text fontWeight="bold" mb={2}>{t('CentralizedAutoServices')}</Text>
                      <Text color={isDark ? 'gray.400' : 'gray.600'} fontSize="sm">
                        {t('OneStopShopBitAuto')}
                      </Text>
                    </Box>
                  </VStack>
                </SimpleGrid>
              </VStack>
            </Container>
          </Box>

          {/* Featured Vehicles Section */}
          {featuredVehicles.length > 0 && (
              <Container maxW="3xl">
                <VStack spacing={8} align="stretch">
                  <Heading size="lg">{t('FeaturedVehicles')}</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {featuredVehicles.map((vehicle) => (
                      <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                  </SimpleGrid>
                  <Box textAlign="center">
                    <Button
                      size="lg"
                      variant="ghost"
                      colorScheme="blue"
                      rightIcon={<ArrowRight />}
                      onClick={() => router.push('/auto/browse')}
                    >
                      {t('ViewAllVehicles')}
                    </Button>
                  </Box>
                </VStack>
              </Container>
          )}

           {/* CTA Section */}
          <Box py={24}>
            <Container maxX="3xl" textAlign="center">
              <VStack spacing={8}>
                <Heading>{t('CTABitAuto')}</Heading>
                <Text fontSize="lg" color={isDark ? 'gray.400' : 'gray.600'}>
                  {t('CTABitAutoParagraph')}
                </Text>
                <HStack spacing={8}>
                      <Button
                        size="lg"
                        colorScheme="blue"
                        rightIcon={<ArrowRight />}
                        onClick={() => router.push('/auto/browse')}
                      >
                        {t('learnMore')}
                      </Button>
                      <Button
                        leftIcon={<FaWhatsapp />}
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => {
                          window.open("https://api.whatsapp.com/send?phone=00447538636207", "_blank");
                        }}
                        size="lg"
                      >
                        {t("contactUs")}
                      </Button>
                    </HStack>
              </VStack>
            </Container>
          </Box>
        </Container>
    </>
  );
};

export default AutoLandingBrowser;