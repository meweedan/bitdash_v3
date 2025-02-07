import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Spinner,
  useToast,
  Flex,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorMode,
  Container,
  Icon,
  Collapse,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';
import {
  FiUser,
  FiClock,
  FiHeart,
  FiClipboard,
  FiAlertCircle,
  FiChevronUp,
  FiChevronDown,
} from 'react-icons/fi';
import Head from 'next/head';

// Constants for styling
const STYLE_CONSTANTS = {
  borderRadius: 'lg',
  cardBg: 'white',
  textColor: 'black',
  secondaryTextColor: 'gray.600',
  cardShadow: 'md',
};

const AutoCustomerDashboard = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const { colorMode } = useColorMode();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(true);
  const [isAllergiesOpen, setIsAllergiesOpen] = useState(true);
  const toast = useToast();

  const validateAndFetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (!token || !user.id) {
        router.replace('/login');
        return;
      }

      const profileResponse = await fetch(
        `${BASE_URL}/api/auto-customer-profiles?filters[users_permissions_user][id][$eq]=${user.id}&populate=*`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!profileResponse.ok) throw new Error('Failed to fetch customer profile');

      const profileData = await profileResponse.json();
      if (!profileData.data || profileData.data.length === 0) {
        toast({
          title: t('error'),
          description: t('noProfileFound'),
          status: 'error',
          duration: 5000,
          position: 'top',
        });
        return;
      }

      const profile = profileData.data[0];
      setProfileData(profile);
      setFavourites(profile?.attributes?.favourites?.data || []);

      // Fetch orders separately with proper population
      const ordersResponse = await fetch(
        `${BASE_URL}/api/auto-orders?filters[customer_profile][id][$eq]=${profile.id}&populate[auto_parts][populate][*]=*&sort[0]=createdAt:desc`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!ordersResponse.ok) throw new Error('Failed to fetch orders');

      const ordersData = await ordersResponse.json();
      setRecentOrders(ordersData.data || []);

    } catch (error) {
      console.error('Dashboard error:', error);
      toast({
        title: t('error'),
        description: t('failedToLoadProfile'),
        status: 'error',
        duration: 5000,
        position: 'top',
      });
      router.replace('/login');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    validateAndFetchData();
  }, [router, toast, t]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Spinner size="xl" />
        </Box>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>{t('autoCustomer')}</title>
      </Head>
      <Layout>
        <Box position="center" inset={0} py={8} mb={16}>
          <Container maxW="container.xl">
            <Box
              maxW="700px"
              mx="auto"
              p={8}
              borderRadius="xl"
              boxShadow="xl"
              backdropFilter="blur(20px)"
              bg="rgba(255, 255, 255, 0.05)"
              border="1px solid"
            >
              <VStack spacing={8} align="stretch">
                {/* Header */}
                <Flex justifyContent="space-between" alignItems="center">
                  <Heading as="h1" size="lg">
                    {t('dashboard')}
                  </Heading>
                  <Flex gap={{base: "8", md: "40"}} align="center">
                    <Button onClick={handleLogout} size="lg">
                      {t('logout')}
                    </Button>
                  </Flex>
                </Flex>

                {/* Tabs Section */}
                <Tabs variant="enclosed" mt={8} isFitted>
                  <TabList whiteSpace="nowrap">
                    <Tab>
                      <Icon as={FiUser} />
                      <Text display={{ base: 'none', md: 'block' }} ml={{ md: 2 }}>
                        {t('preferences', 'Preferences')}
                      </Text>
                    </Tab>
                    <Tab>
                      <Icon as={FiClock} />
                      <Text display={{ base: 'none', md: 'block' }} ml={{ md: 2 }}>
                        {t('orders', 'Orders')}
                      </Text>
                    </Tab>
                    <Tab>
                      <Icon as={FiHeart} />
                      <Text display={{ base: 'none', md: 'block' }} ml={{ md: 2 }}>
                        {t('favourites', 'Favourites')}
                      </Text>
                    </Tab>
                  </TabList>

                  <TabPanels>
                    {/* Merged Preferences Tab */}
                    <TabPanel>
                      <VStack spacing={6} align="stretch">
                        {/* Preferences Section */}
                        <Box>
                          <Button
                            onClick={() => setIsPreferencesOpen(!isPreferencesOpen)}
                            width="100%"
                            justifyContent="space-between"
                            variant="outline"
                            mb={4}
                            rightIcon={<Icon as={isPreferencesOpen ? FiChevronUp : FiChevronDown} />}
                          >
                            <HStack>
                              <Icon as={FiClipboard} />
                              <Text>{t('preferences', 'Preferences')}</Text>
                            </HStack>
                          </Button>

                          <Collapse in={isPreferencesOpen} animateOpacity>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                              {Array.isArray(profileData?.attributes?.preferences) &&
                              profileData?.attributes?.preferences?.length > 0 ? (
                                profileData?.attributes?.preferences?.map((preference, index) => (
                                  <Box
                                    key={index}
                                    p={4}
                                    borderWidth="1px"
                                    borderRadius={STYLE_CONSTANTS.borderRadius}
                                    bg={STYLE_CONSTANTS.cardBg}
                                    boxShadow={STYLE_CONSTANTS.cardShadow}
                                  >
                                    <Text
                                      fontWeight="bold"
                                      align={'center'}
                                      color={STYLE_CONSTANTS.textColor}
                                    >
                                      {preference}
                                    </Text>
                                  </Box>
                                ))
                              ) : (
                                <Text fontWeight="bold" color={STYLE_CONSTANTS.textColor}>
                                  {t('noPreferences')}
                                </Text>
                              )}
                            </SimpleGrid>
                          </Collapse>
                        </Box>

                        {/* Special Requirements Section */}
                        <Box>
                          <Button
                            onClick={() => setIsAllergiesOpen(!isAllergiesOpen)}
                            width="100%"
                            justifyContent="space-between"
                            variant="outline"
                            mb={4}
                            rightIcon={<Icon as={isAllergiesOpen ? FiChevronUp : FiChevronDown} />}
                          >
                            <HStack>
                              <Icon as={FiAlertCircle} />
                              <Text>{t('specialRequirements', 'Special Requirements')}</Text>
                            </HStack>
                          </Button>

                          <Collapse in={isAllergiesOpen} animateOpacity>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                              {Array.isArray(profileData?.attributes?.special_requirements) &&
                              profileData?.attributes?.special_requirements?.length > 0 ? (
                                profileData?.attributes?.special_requirements?.map((requirement, index) => (
                                  <Box
                                    key={index}
                                    p={4}
                                    borderWidth="1px"
                                    borderRadius={STYLE_CONSTANTS.borderRadius}
                                    bg={STYLE_CONSTANTS.cardBg}
                                    boxShadow={STYLE_CONSTANTS.cardShadow}
                                  >
                                    <Text
                                      fontWeight="bold"
                                      align={'center'}
                                      color={STYLE_CONSTANTS.textColor}
                                    >
                                      {requirement}
                                    </Text>
                                  </Box>
                                ))
                              ) : (
                                <Text fontWeight="bold" color={STYLE_CONSTANTS.textColor}>
                                  {t('noSpecialRequirements')}
                                </Text>
                              )}
                            </SimpleGrid>
                          </Collapse>
                        </Box>
                      </VStack>
                    </TabPanel>

                    {/* Orders Tab */}
                    <TabPanel>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        {recentOrders.length > 0 ? (
                          recentOrders.map((order) => (
                            <Box
                              key={order.id}
                              p={4}
                              borderWidth="1px"
                              borderRadius={STYLE_CONSTANTS.borderRadius}
                              bg={STYLE_CONSTANTS.cardBg}
                              boxShadow={STYLE_CONSTANTS.cardShadow}
                            >
                              <VStack align="start" spacing={2}>
                                {/* Auto Parts */}
                                <VStack align="start" spacing={1} width="100%">
                                  {order.auto_parts?.map((part) => (
                                    <Text key={part.id} color={STYLE_CONSTANTS.textColor}>
                                      {part.name} - ${part.price}
                                    </Text>
                                  ))}
                                </VStack>

                                {/* Order Details */}
                                <HStack justify="space-between" width="100%">
                                  <Text color={STYLE_CONSTANTS.secondaryTextColor}>
                                    Total: ${order.total}
                                  </Text>
                                  <Badge
                                    colorScheme={
                                      order.status === 'pending'
                                        ? 'yellow'
                                        : order.status === 'processing'
                                        ? 'blue'
                                        : order.status === 'shipped'
                                        ? 'orange'
                                        : order.status === 'delivered'
                                        ? 'green'
                                        : 'red'
                                    }
                                  >
                                    {order.status}
                                  </Badge>
                                </HStack>

                                {/* Time */}
                                <Text fontSize="sm" color={STYLE_CONSTANTS.secondaryTextColor}>
                                  {new Date(order.createdAt).toLocaleString()}
                                </Text>

                                {/* Notes if any */}
                                {order.notes && (
                                  <Text fontSize="sm" color={STYLE_CONSTANTS.secondaryTextColor}>
                                    Notes: {order.notes}
                                  </Text>
                                )}
                              </VStack>
                            </Box>
                          ))
                        ) : (
                          <Text fontWeight="bold" color={STYLE_CONSTANTS.textColor}>
                            {t('noOrders')}
                          </Text>
                        )}
                      </SimpleGrid>
                    </TabPanel>

                    {/* Favourites Tab */}
                    <TabPanel>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        {favourites.length > 0 ? (
                          favourites.map((favourite, index) => (
                            <Box
                              key={index}
                              p={4}
                              borderWidth="1px"
                              borderRadius={STYLE_CONSTANTS.borderRadius}
                              bg={STYLE_CONSTANTS.cardBg}
                              boxShadow={STYLE_CONSTANTS.cardShadow}
                            >
                              <VStack align="start" spacing={2}>
                                <Flex justify="space-between" width="100%" align="center">
                                  <Text fontWeight="bold" color={STYLE_CONSTANTS.textColor}>
                                    {favourite.attributes?.name}
                                  </Text>
                                  <Badge colorScheme="blue">
                                    {favourite.attributes?.category}
                                  </Badge>
                                </Flex>
                                {favourite.attributes?.description && (
                                  <Text
                                    fontSize="sm"
                                    color={STYLE_CONSTANTS.secondaryTextColor}
                                  >
                                    {favourite.attributes?.description}
                                  </Text>
                                )}
                                <Flex gap={2}>
                                  <Badge colorScheme="green">
                                    ${favourite.attributes?.price}
                                  </Badge>
                                  {favourite.attributes?.manufacturer && (
                                    <Badge colorScheme="purple">
                                      {favourite.attributes?.manufacturer}
                                    </Badge>
                                  )}
                                </Flex>
                              </VStack>
                            </Box>
                          ))
                        ) : (
                          <Text fontWeight="bold" color={STYLE_CONSTANTS.textColor}>
                            {t('noFavourites')}
                          </Text>
                        )}
                      </SimpleGrid>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </VStack>
            </Box>
          </Container>
        </Box>
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

export default AutoCustomerDashboard;