// frontend/pages/food/customer/dashboard.js
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
  Input,
  InputGroup,
  FormControl,
  ButtonGroup,
  IconButton,
  FormLabel,
  Collapse,
  Avatar,
  Badge,
  InputRightElement,
  useBreakpointValue,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Divider,
  Container,
  HStack,
  useColorMode,
  Center
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  FiDownload, 
  FiUser, 
  FiDollarSign, 
  FiGift, 
  FiClipboard, 
  FiHeart, 
  FiBook,
  FiStar,
  FiAward,
  FiThumbsUp,
  FiCreditCard,
  FiShoppingBag,
  FiChevronUp, 
  FiChevronDown, 
  FiAlertCircle,
  FiClock 
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { createContext, useContext } from 'react';
import Head from 'next/head';

const DashboardContext = createContext();

// Updated ButtonWithTranslation Component
const ButtonWithTranslation = ({ translationKey, leftIcon, ...props }) => {
  const { t } = useTranslation('common');
  const buttonContent = useBreakpointValue({
    base: null,
    md: t(translationKey),
  });

  return (
    <Button leftIcon={leftIcon} {...props}>
      {buttonContent}
    </Button>
  );
};

// Constants for styling
const STYLE_CONSTANTS = {
  // Brand Colors
  brand: {
    primary: '#1179be',
    secondary: '#245b84',
    accent: '#c4e6ff',
    dark: '#000000',
    light: '#ffffff',
  },
  // Dashboard Styles
  dashboard: {
    background: 'rgba(255, 255, 255, 0.05)',
    cardBg: 'white',
    borderRadius: 'lg',
    textColor: 'black',
    secondaryTextColor: 'gray.600',
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,0.12)',
      md: '0 4px 6px rgba(0,0,0,0.1)',
      lg: '0 10px 15px rgba(0,0,0,0.1)',
    },
  },
    responsiveCard: {
    width: {
      base: '160%',
      sm: '85.60mm',
    },
    height: {
      base: '100%',
      sm: '53.98mm',
    },
    borderRadius: '8px',
    background: {
      light: 'linear-gradient(110deg, #67bdfd 0%, #111111 100%)',
      dark: 'linear-gradient(110deg, #111111 0%, #67bdfd 100%)',
    },
  },
};

// BitWallet Card styling
const BitWalletCard = styled(motion.div)`
  width: ${STYLE_CONSTANTS.responsiveCard.width.base};
  height: ${STYLE_CONSTANTS.responsiveCard.height.base};
  border-radius: ${STYLE_CONSTANTS.responsiveCard.borderRadius};
  background: ${(props) => (props.isDark ? STYLE_CONSTANTS.responsiveCard.background.dark : STYLE_CONSTANTS.responsiveCard.background.light)};
  position: relative;
  padding: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media {
    width: ${STYLE_CONSTANTS.responsiveCard.width.sm};
    height: ${STYLE_CONSTANTS.responsiveCard.height.sm};
  }
`;

const BitWalletSection = ({ profileData, isDark, onDownload }) => {
  const { t } = useTranslation('common');
    const router = useRouter();

  return (
    <VStack spacing={8} >
      <Box id="user-qr-box">
        <BitWalletCard isDark={isDark} whileHover={{ y: -10 }} transition={{ duration: 0.3 }}>
          {/* Card content */}
          <Box>
            <Flex justify="space-between">
              <Text fontSize="md" fontWeight="bold" color={isDark ? 'white' : 'black'}>
                BitWallet™️
              </Text>
            </Flex>
            <Flex justify="space-between" align="center" mt={8}>
              <Box>
                <Text fontSize="lg" fontWeight="bold" color={isDark ? 'white' : 'black'}>
                  {profileData?.attributes?.fullName || 'Card Holder'}
                </Text>
                <Text fontSize="md" color={isDark ? 'white' : 'black'}>
                  {profileData?.attributes?.phone || '•••• •••• ••••'}
                </Text>
              </Box>
              <Box bg="white" p={2} borderRadius="md" boxShadow="md">
                <QRCodeCanvas
                  value={profileData?.attributes?.wallet_qr_code?.data?.attributes?.url || 'https://bitdash.app'}
                  bgColor="white"
                  fgColor={isDark ? '#111111' : '#1179be'}
                  size={75}
                />
              </Box>
            </Flex>
          </Box>
        </BitWalletCard>
      </Box>

     {/* Card Actions */}
      <Flex justify="center" width="100%">
        <Button leftIcon={<FiDownload />} onClick={onDownload} size="lg">
          {t('saveImage')}
        </Button>
      </Flex>

      {/* Credit Balance */}
      {/* <Flex justify="center" width="100%">
        <Button leftIcon={<FiDollarSign />} variant="outline" onClick={() => router.push('/stores/voucher')} size="lg">
          {t('creditBalance')} {profileData?.attributes?.credit_balance || 0}
        </Button>
      </Flex> */}
    </VStack>
  );
};

const Dashboard = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const { colorMode } = useColorMode();
  const [qrCode, setQrCode] = useState('');
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(true);
  const [isAllergiesOpen, setIsAllergiesOpen] = useState(true);
  const toast = useToast();

  const handleQRCodeScan = async (orderId) => {
    try {
      const token = localStorage.getItem('token');

      // Deduct credits from customer's account
      const deductResponse = await fetch(`${BASE_URL}/api/customer-profiles/${profileData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            credit_balance: profileData.attributes.credit_balance - order.total,
          },
        }),
      });

      if (!deductResponse.ok) throw new Error('Failed to deduct credits');

      // Transfer funds to operator's account
      const transferResponse = await fetch(`${BASE_URL}/api/operators/${order.operator.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            credit_balance: order.operator.attributes.credit_balance + order.total,
          },
        }),
      });

      if (!transferResponse.ok) throw new Error('Failed to transfer funds');

      // Update order status to 'completed'
      const updateResponse = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            status: 'completed',
          },
        }),
      });

      if (!updateResponse.ok) throw new Error('Failed to update order status');

      toast({
        title: t('success'),
        description: t('paymentSuccessful'),
        status: 'success',
        duration: 3000,
      });

      // Refresh data
      validateAndFetchData();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: t('error'),
        description: t('paymentFailed'),
        status: 'error',
        duration: 3000,
      });
    }
  };


  const validateAndFetchData = async () => {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || !user.id) {
      router.replace('/login');
      return;
    }

    const profileResponse = await fetch(
      `${BASE_URL}/api/customer-profiles?filters[users_permissions_user][id][$eq]=${user.id}&populate=*`,
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
    setQrCode(profile?.attributes?.wallet_qr_code?.data?.attributes?.url || '');
    setFavourites(profile?.attributes?.favourites?.data || []);


    // Fetch orders separately with proper population
    const ordersResponse = await fetch(
      `${BASE_URL}/api/orders?filters[customer_profile][id][$eq]=${profile.id}&populate[menu_items][populate][*]=*&populate[tables][populate][*]=*&sort[0]=createdAt:desc`,
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

const captureAndDownloadUserQR = async () => {
  const element = document.getElementById('user-qr-box');
  if (!element || !profileData) return;

  try {
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(element, {
      backgroundColor: colorMode === 'dark' ? '#1f2029' : '#0284c7',
      scale: 2,
      logging: false,
      useCORS: false,
      allowTaint: false,
      foreignObjectRendering: false,
      removeContainer: false,
    });

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${profileData.attributes.fullName}-BitWallet.png`;
    link.href = url;
    link.click();
  } catch (error) {
    console.error('Error capturing wallet card:', error);
    toast({
      title: t('error'),
      description: t('failedToSaveWallet'),
      status: 'error',
      duration: 3000
    });
  }
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
      <title>{t('customer')}</title>
    </Head>
   <DashboardContext.Provider
  value={{
    router, // Add this line
  }}
>
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
            
            {/* BitWallet Card */}
                  <BitWalletSection 
                    profileData={profileData}
                    isDark={colorMode === 'dark'}
                    onDownload={captureAndDownloadUserQR}
                    router={router}
                  />

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
                    {/* Dietary Preferences Section */}
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
                          <Text>{t('dietary_preferences', 'Dietary Preferences')}</Text>
                        </HStack>
                      </Button>
                      
                      <Collapse in={isPreferencesOpen} animateOpacity>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          {Array.isArray(profileData?.attributes?.dietary_preferences) && 
                          profileData?.attributes?.dietary_preferences?.length > 0 ? (
                            profileData?.attributes?.dietary_preferences?.map((preference, index) => (
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
                              {t('noDietaryPreferences')}
                            </Text>
                          )}
                        </SimpleGrid>
                      </Collapse>
                    </Box>

                    {/* Allergies Section */}
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
                          <Text>{t('allergies', 'Allergies')}</Text>
                        </HStack>
                      </Button>
                      
                      <Collapse in={isAllergiesOpen} animateOpacity>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          {Array.isArray(profileData?.attributes?.allergies) && 
                          profileData?.attributes?.allergies?.length > 0 ? (
                            profileData?.attributes?.allergies?.map((allergy, index) => (
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
                                  {allergy}
                                </Text>
                              </Box>
                            ))
                          ) : (
                            <Text fontWeight="bold" color={STYLE_CONSTANTS.textColor}>
                              {t('noAllergies')}
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
                            {/* Restaurant Name */}
                            <Text fontWeight="bold" color={STYLE_CONSTANTS.textColor}>
                              {order.restaurant?.name}
                            </Text>

                            {/* Order Items */}
                            <VStack align="start" spacing={1} width="100%">
                              {order.menu_items?.map((item) => (
                                <Text key={item.id} color={STYLE_CONSTANTS.textColor}>
                                  {item.name} - ${item.price}
                                </Text>
                              ))}
                            </VStack>

                            {/* Order Details */}
                            <HStack justify="space-between" width="100%">
                              <Text color={STYLE_CONSTANTS.secondaryTextColor}>
                                {order.total} {t('bits')}
                              </Text>
                              <Badge 
                                colorScheme={
                                  order.status === 'pending'
                                    ? 'yellow'
                                    : order.status === 'preparing'
                                    ? 'blue'
                                    : order.status === 'ready'
                                    ? 'orange'
                                    : order.status === 'completed'
                                    ? 'green'
                                    : 'red'
                                }
                              >
                                {order.status}
                              </Badge>
                            </HStack>

                            {/* Table & Time */}
                            <HStack justify="space-between" width="100%" fontSize="sm" color={STYLE_CONSTANTS.secondaryTextColor}>
                              <Text>
                                Table: {order.tables?.[0]?.name || 'N/A'}
                              </Text>
                              <Text>
                                {new Date(order.createdAt).toLocaleString()}
                              </Text>
                            </HStack>

                            {/* Payment Method */}
                            <Text fontSize="sm" color={STYLE_CONSTANTS.secondaryTextColor}>
                              Payment: {order.payment_method}
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
                                  {favourite.attributes?.price} {t('bits')}
                                </Badge>
                                {favourite.attributes?.dietary_info && (
                                  <Badge colorScheme="purple">
                                    {favourite.attributes?.dietary_info}
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
        </DashboardContext.Provider>
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

export default Dashboard;