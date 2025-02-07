// frontend/pages/menu/operator/dashboard.js
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js'; 

import Layout from '@/components/Layout';
import OperatorMessages from '@/components/OperatorMessages';
import SubscriptionInfo from '@/components/SubscriptionInfo';
import AnalyticsTab from '@/components/AnalyticsTab';

import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Flex,
  Switch,
  DrawerHeader,
  SimpleGrid,
  DrawerBody,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  useToast,
  DrawerCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Icon,
  Divider,
  HStack,
  Avatar,
  IconButton,
  Modal,
  ModalOverlay,
  DrawerContent,
  DrawerOverlay,
  Drawer,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Image,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

import { mdiCheckCircle } from '@mdi/js';

import { IoIosColorFill } from "react-icons/io";

import {
  FiLogOut,
  FiPlus,
  FiEdit,
  FiTrash,
  FiMenu,
  FiGrid,
  FiPrinter,
  FiList,
  FiCheck,
  FiPackage,
  CheckCircle,
  FiArrowRight,
  FiSettings,
  FiDownload,
  FiSun,
  FiClock,
  FiX,
  FiCreditCard,
  FiTrendingUp,
  FiMoon,
} from 'react-icons/fi';

import { QRCodeCanvas } from 'qrcode.react';
import Head from 'next/head';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Add a default userData structure to prevent null errors
      initialUserData: {
        restaurant: {
          id: null,
          name: '',
          description: '',
          tables: [],
          menus: [],
          subscription: {
            tier: 'standard',
            status: 'active'
          }
        }
      }
    },
  };
}

const Dashboard = ({ initialUserData }) => {
  const [userData, setUserData] = useState(initialUserData);
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [qrDarkMode, setQrDarkMode] = useState(false);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const toast = useToast();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const closeColorCustomizationModal = () => setIsColorModalOpen(false);
  const openColorCustomizationModal = () => setIsColorModalOpen(true);
  const [selectedColors, setSelectedColors] = useState({
  primary: userData?.restaurant?.custom_colors?.primary || '#3182CE',
  secondary: userData?.restaurant?.custom_colors?.secondary || '#48BB78',
  accent: userData?.restaurant?.custom_colors?.accent || '#ED64A6',
  qrBackground: userData?.restaurant?.custom_colors?.qrBackground || '#FFFFFF',
  qrForeground: userData?.restaurant?.custom_colors?.qrForeground || '#000000'
});

const [qrSettings, setQrSettings] = useState({
  showLogo: userData?.restaurant?.qr_settings?.showLogo ?? true,
  showName: userData?.restaurant?.qr_settings?.showName ?? true
});

// Modify the useEffect to properly handle data loading
useEffect(() => {
  if (userData?.restaurant) {
    // Load custom colors if they exist
    if (userData.restaurant.custom_colors) {
      setSelectedColors(prevColors => ({
        ...prevColors,
        ...userData.restaurant.custom_colors
      }));
    }
    
    // Load QR settings if they exist
    if (userData.restaurant.qr_settings) {
      setQrSettings(prevSettings => ({
        ...prevSettings,
        ...userData.restaurant.qr_settings
      }));
    }
  }
}, [userData?.restaurant?.custom_colors, userData?.restaurant?.qr_settings]);

const ColorCustomizationModal = ({ 
  isColorModalOpen, 
  closeColorCustomizationModal, 
  userData, 
  setUserData,
  selectedColors,
  setSelectedColors,
  qrSettings,
  setQrSettings,
  toast,
  t,
  BASE_URL
}) => {
  const handleColorChange = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/restaurants/${userData.restaurant.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            custom_colors: selectedColors,
            qr_settings: qrSettings
          }
        })
      });

      if (!response.ok) throw new Error('Failed to update customization settings');

      // Update the restaurant data in userData
      setUserData(prev => ({
        ...prev,
        restaurant: {
          ...prev.restaurant,
          custom_colors: selectedColors,
          qr_settings: qrSettings
        }
      }));

      toast({
        title: t('success'),
        description: t('settingsUpdated'),
        status: 'success',
        duration: 2000
      });

      closeColorCustomizationModal();
    } catch (error) {
      toast({
        title: t('error'),
        description: error.message,
        status: 'error'
      });
    }
  };

  return (
    <Modal 
      isOpen={isColorModalOpen} 
      onClose={closeColorCustomizationModal} 
      size="xl"
      motionPreset="slideInBottom"
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <Icon as={IoIosColorFill} />
            <Text>Customize QR Cards</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6}>
            {/* QR Code Customization */}
            <Box borderWidth="1px" borderRadius="md" p={4} w="100%" shadow="sm">
              <Heading size="sm" mb={4}>QR Code Settings</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl>
                  <FormLabel>QR Code Color</FormLabel>
                  <Input 
                    type="color"
                    value={selectedColors.qrForeground}
                    onChange={(e) => setSelectedColors(prev => ({
                      ...prev, 
                      qrForeground: e.target.value
                    }))}
                    h="40px"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>QR Background Color</FormLabel>
                  <Input 
                    type="color"
                    value={selectedColors.qrBackground}
                    onChange={(e) => setSelectedColors(prev => ({
                      ...prev, 
                      qrBackground: e.target.value
                    }))}
                    h="40px"
                  />
                </FormControl>
              </SimpleGrid>
            </Box>

            {/* Display Settings */}
            <Box borderWidth="1px" borderRadius="md" p={4} w="100%" shadow="sm">
              <Heading size="sm" mb={4}>Display Settings</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Show Restaurant Logo</FormLabel>
                  <Switch 
                    isChecked={qrSettings.showLogo}
                    onChange={(e) => setQrSettings(prev => ({
                      ...prev,
                      showLogo: e.target.checked
                    }))}
                  />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Show Restaurant Name</FormLabel>
                  <Switch 
                    isChecked={qrSettings.showName}
                    onChange={(e) => setQrSettings(prev => ({
                      ...prev,
                      showName: e.target.checked
                    }))}
                  />
                </FormControl>
              </SimpleGrid>
            </Box>

            {/* Card Colors */}
            <Box borderWidth="1px" borderRadius="md" p={4} w="100%" shadow="sm">
              <Heading size="sm" mb={4}>Card Colors</Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <FormControl>
                  <FormLabel>Primary Color</FormLabel>
                  <Input 
                    type="color"
                    value={selectedColors.primary}
                    onChange={(e) => setSelectedColors(prev => ({
                      ...prev, 
                      primary: e.target.value
                    }))}
                    h="40px"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Secondary Color</FormLabel>
                  <Input 
                    type="color"
                    value={selectedColors.secondary}
                    onChange={(e) => setSelectedColors(prev => ({
                      ...prev, 
                      secondary: e.target.value
                    }))}
                    h="40px"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Accent Color</FormLabel>
                  <Input 
                    type="color"
                    value={selectedColors.accent}
                    onChange={(e) => setSelectedColors(prev => ({
                      ...prev, 
                      accent: e.target.value
                    }))}
                    h="40px"
                  />
                </FormControl>
              </SimpleGrid>
            </Box>

            {/* Preview */}
            <Box borderWidth="1px" borderRadius="md" p={4} w="100%" shadow="sm">
              <Heading size="sm" mb={4}>Live Preview</Heading>
              <Box 
                p={4} 
                borderRadius="md"
                display="flex"
                justifyContent="center"
              >
                <QRCodeCard
                  tableName="Preview"
                  qrValue="https://preview.example.com"
                  isDarkMode={false}
                  restaurantName={userData?.restaurant?.name || "Restaurant Name"}
                  customColors={selectedColors}
                  showLogo={qrSettings.showLogo}
                  showName={qrSettings.showName}
                  logoUrl={userData?.restaurant?.logo ? `${BASE_URL}${userData.restaurant.logo.url}` : null}
                />
              </Box>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={3}>
            <Button 
              colorScheme="blue" 
              leftIcon={<Icon as={mdiCheckCircle} />}
              onClick={handleColorChange}
            >
              Save Changes
            </Button>
            <Button 
              variant="ghost" 
              onClick={closeColorCustomizationModal}
            >
              Cancel
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

  const handlePrint = async (tableName) => {
  try {
    // First capture the QR code using html2canvas
    const element = document.getElementById(`qr-box-${tableName}`);
    if (!element) return;

    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(element, {
      scale: 4,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: qrDarkMode ? '#1f2029' : '#0284c7',
    });

    // Convert canvas to image
    const image = canvas.toDataURL('image/png');

    // Create print window with the image
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: 'Error',
        description: 'Please allow pop-ups to print QR codes',
        status: 'error',
        duration: 3000
      });
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR Code - ${tableName}</title>
          <style>
            @page {
              size: 85.60mm 53.98mm;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 53.98mm;
            }
            img {
              width: 85.60mm;
              height: 53.98mm;
              object-fit: contain;
              display: block;
            }
            @media print {
              body {
                width: 85.60mm;
                height: 53.98mm;
              }
              img {
                width: 100%;
                height: 100%;
              }
            }
          </style>
        </head>
        <body>
          <img src="${image}" alt="QR Code ${tableName}" />
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for the image to load before printing
    const img = printWindow.document.querySelector('img');
    if (img) {
      img.onload = () => {
        printWindow.print();
        // Close the window after a short delay to ensure print dialog appears
        setTimeout(() => {
          printWindow.close();
        }, 500);
      };
    } else {
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
      }, 500);
    }
  } catch (error) {
    console.error('Print error:', error);
    toast({
      title: 'Error',
      description: 'Failed to print QR code',
      status: 'error',
      duration: 3000
    });
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

const STYLE_CONSTANTS = {
  brand: {
    primary: '#1179be',
    secondary: '#245b84',
    accent: '#c4e6ff',
    dark: '#000000',
    light: '#FFFFFF'
  },
  dashboard: {
    borderRadius: 'lg',
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,0.12)',
      md: '0 4px 6px rgba(0,0,0,0.1)',
      lg: '0 10px 15px rgba(0,0,0,0.1)'
    }
  }
};

const fetchSubscriptionData = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BASE_URL}/api/restaurants/${userData.restaurant.id}?populate[subscription]=*`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) throw new Error('Failed to fetch subscription');
    const data = await response.json();
    setSubscriptionData(data?.data?.attributes?.subscription?.data || null);
  } catch (error) {
    console.error('Error fetching subscription:', error);
  }
};

useEffect(() => {
  if (userData?.restaurant?.id) {
    fetchSubscriptionData();
  }
}, [userData]);

const ResponsiveIconButton = ({ 
  icon: Icon, 
  label, 
  onClick, 
  colorScheme = "blue",
  size = "md",
  variant = "solid",
  isDisabled = false,
  iconsOnly = false // New prop to control display mode
}) => (
  <Button
    onClick={onClick}
    colorScheme={colorScheme}
    size={size}
    variant={variant}
    isDisabled={isDisabled}
    minW={iconsOnly ? "40px" : undefined} // Fixed width for icon-only buttons
    w={iconsOnly ? "40px" : undefined}
    p={iconsOnly ? "0" : undefined}
  >
    <Icon />
    {!iconsOnly && (
      <Text display={{ base: "none", md: "inline" }} ml={{ md: 2 }}>
        {label}
      </Text>
    )}
  </Button>
);

const DashboardCard = motion(({ children, ...props }) => (
  <Box
    p={6}
    borderWidth="1px"
    borderRadius="lg"
    backdropFilter="blur(10px)"
    borderColor="whiteAlpha.200"
    boxShadow="lg"
    transition="all 0.2s"
    _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
    {...props}
  >
    {children}
  </Box>
));



// QRCodeCard component with consistent cross-device styling
const QRCodeCard = ({ 
  tableName,
  qrValue,
  isDarkMode,
  restaurantName,
  poweredByText,
  customColors = null,
  showLogo = true,
  showName = true,
  logoUrl = null
}) => {
  const backgroundColor = customColors 
    ? `linear-gradient(110deg, ${customColors.primary} 0%, ${customColors.secondary} 100%)`
    : isDarkMode 
      ? 'linear-gradient(110deg, #111111 0%, #67bdfd 100%)'
      : 'linear-gradient(110deg, #67bdfd 0%, #111111 100%)';
  
  return (
    <Box 
      id={`qr-box-${tableName}`}
      background={backgroundColor}
      width="85.60mm"
      height="53.98mm"
      style={{
        minWidth: '85.60mm',
        minHeight: '53.98mm',
        maxWidth: '85.60mm',
        maxHeight: '53.98mm',
        direction: 'ltr' // Force LTR layout
      }}
      borderRadius="8px"
      position="relative"
      overflow="hidden"
      padding="15px"
      mx="auto"
      boxShadow="0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)"
    >
      {/* BitMenu Brand */}
      <Text 
        fontSize="xs" 
        textAlign="center"
        fontWeight="bold" 
        color={customColors?.accent || (isDarkMode ? 'white' : 'black')}
      >
        Powered by BitMenu
      </Text>

      {/* Main Content Area */}
      <Flex 
        height="calc(100% - 60px)"
        width="100%"
        position="relative"
        justifyContent="flex-end"
        alignItems="center"
        style={{ direction: 'ltr' }}
      >
        {/* Restaurant Name (if shown) */}
        {showName && (
          <Box 
            position="absolute"
            left="0"
            maxWidth="calc(100% - 35mm)"
          >
            <Text 
              fontSize="sm"
              color="whiteAlpha.800"
              letterSpacing="wide"
              noOfLines={1}
              style={{ direction: 'ltr' }}
            >
              {restaurantName}
            </Text>
          </Box>
        )}

        {/* QR Code */}
        <Box
          bg={customColors?.qrBackground || 'white'}
          p={2}
          borderRadius="md"
          width="25mm"
          height="25mm"
          style={{
            minWidth: '25mm',
            minHeight: '25mm',
            maxWidth: '25mm',
            maxHeight: '25mm'
          }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          boxShadow="md"
        >
          <QRCodeCanvas
            id={`qr-canvas-${tableName}`}
            value={qrValue}
            size={180}
            level="H"
            bgColor={customColors?.qrBackground || 'white'}
            fgColor={customColors?.qrForeground || (isDarkMode ? '#111111' : '#1179be')}
            style={{
              width: '100%',
              height: '100%'
            }}
          />
        </Box>
      </Flex>

      {/* Bottom Area */}
      <Flex 
        position="absolute"
        bottom="15px"
        left="15px"
        right="15px"
        justifyContent="space-between"
        alignItems="flex-end"
        style={{ direction: 'ltr' }}
      >
        {/* Table Number */}
        <Text 
          fontSize="3xl"
          fontWeight="bold" 
          color={customColors?.accent || 'white'}
          letterSpacing="wide"
        >
          {tableName}
        </Text>

        {/* Restaurant Logo */}
        {showLogo && logoUrl && (
          <Box
            width="12mm"
            height="8mm"
            position="relative"
            overflow="hidden"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image
              src={logoUrl}
              alt={restaurantName}
              style={{
                maxWidth: '12mm',
                maxHeight: '8mm',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)' // Makes logo white
              }}
            />
          </Box>
        )}
      </Flex>
    </Box>
  );
};
const checkAuth = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/api/users/me?populate[restaurant][populate][]=logo&populate[restaurant][populate][]=tables&populate[restaurant][populate][]=menus&populate[restaurant][populate][]=menus.menu_items&populate[restaurant][populate][]=subscription&populate[restaurant][populate][]=custom_colors&populate[restaurant][populate][]=qr_settings`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch user data');

    const userData = await response.json();
    
    // Check subscription status
    if (userData.restaurant?.subscription) {
      const subscriptionEndDate = new Date(userData.restaurant.subscription.end_date);
      const now = new Date();
      const timeUntilExpiry = subscriptionEndDate - now;
      const daysUntilExpiry = timeUntilExpiry / (1000 * 60 * 60 * 24);

      if (timeUntilExpiry <= 0) {
        // Subscription has ended
        setUserData({
          ...userData,
          subscriptionExpired: true
        });
        
        toast({
          title: "Subscription Expired",
          description: (
            <VStack align="start" spacing={2}>
              <Text>Your subscription has expired. Please renew to continue using our services.</Text>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => handleUpgradeSubscription(userData.restaurant.subscription.tier)}
              >
                Renew Now
              </Button>
            </VStack>
          ),
          status: "error",
          duration: null,
          isClosable: true,
          position: "top-right"
        });
      } else if (daysUntilExpiry <= 2) {
        // Show 48-hour warning
        setUserData(userData);
        
        toast({
          title: "Subscription Ending Soon",
          description: (
            <HStack spacing={2}>
              <Text>⏳ {Math.ceil(daysUntilExpiry * 24)} hours left until subscription ends. ⏳</Text>
              <Button
                size="sm"
                variant="link"
                colorScheme="blue"
                onClick={() => handleUpgradeSubscription(userData.restaurant.subscription.tier)}
              >
                Renew Now
              </Button>
            </HStack>
          ),
          status: "error",
          duration: 10000,
          isClosable: true,
          position: "top-right"
        });
      } else {
        setUserData(userData);
      }
    } else {
      // Create default subscription if none exists
      await createDefaultSubscription(userData.restaurant.id, token);
    }

    // Load custom colors and settings
    if (userData.restaurant?.custom_colors) {
      setSelectedColors(prevColors => ({
        ...prevColors,
        ...userData.restaurant.custom_colors
      }));
    }

    if (userData.restaurant?.qr_settings) {
      setQrSettings(prevSettings => ({
        ...prevSettings,
        ...userData.restaurant.qr_settings
      }));
    }

  } catch (error) {
    console.error('Dashboard error:', error);
    toast({
      title: t('error'),
      description: error.message || t('failedLoadDashboard'),
      status: 'error',
      duration: 3000
    });
    router.push('/login');
  } finally {
    setIsLoading(false);
  }
};

const ExpiredSubscriptionView = ({ subscription }) => (
  <VStack
    spacing={8}
    justify="center"
    align="center"
    minH="60vh"
    p={8}
    textAlign="center"
  >
    <Icon as={FiClock} boxSize={16} />
    <Heading size="lg">Please renew your subscription</Heading>
    <Text maxW="lg">
      Your subscription has expired. Renew now to continue enjoying our services and keep your restaurant running smoothly.
    </Text>
    <Button
      size="lg"
      colorScheme="blue"
      rightIcon={<FiArrowRight />}
      onClick={() => handleUpgradeSubscription(subscription.tier)}
    >
      Renew Subscription
    </Button>
  </VStack>
);

const createDefaultSubscription = async (restaurantId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/api/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          tier: 'standard',
          status: 'active',
          commission_rate: 2.5,
          monthly_fee: 80,
          start_date: new Date().toISOString(),
          restaurant: restaurantId
        }
      })
    });

    if (!response.ok) throw new Error('Failed to create default subscription');
    
    // Refresh user data to include new subscription
    checkAuth();
  } catch (error) {
    console.error('Error creating default subscription:', error);
  }
};

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
  if (userData?.restaurant?.id) {
    fetchOrders();
  }
}, [userData]);

 const handleUpgradeSubscription = async (newTier) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ planId: newTier })
    });

    if (!response.ok) throw new Error('Failed to create checkout session');
    
    const { sessionId } = await response.json();
    if (!sessionId) throw new Error('No session ID returned');

    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) throw error;
  } catch (error) {
    console.error(error);
    toast({
      title: 'Error',
      description: error.message,
      status: 'error',
      duration: 3000
    });
  }
};

const handleCancelSubscription = async () => {
  if (!window.confirm(t('confirmCancelSubscription'))) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/api/subscriptions/${userData.restaurant.subscription.id}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to cancel subscription');

    toast({
      title: t('success'),
      description: t('subscriptionCancelled'),
      status: 'success',
      duration: 3000
    });

    // Refresh data
    await checkAuth();
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    toast({
      title: t('error'),
      description: error.message,
      status: 'error',
      duration: 3000
    });
  }
};

// Update the fetchOrders function
const fetchOrders = async () => {
  try {
    const token = localStorage.getItem('token');
    // Update the populate parameter to include order_items
    const response = await fetch(
      `${BASE_URL}/api/orders?filters[restaurant][id]=${userData.restaurant.id}&populate[customer_profile][populate][*]=*&populate[order_items][populate][menu_item]=*&populate[tables][populate][*]=*&sort[0]=createdAt:desc`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) throw new Error('Failed to fetch orders');

    const data = await response.json();
    setOrders(data.data || []);
  } catch (error) {
    console.error('Error fetching orders:', error);
    toast({
      title: t('error'),
      description: t('failedToLoadOrders'),
      status: 'error',
      duration: 3000
    });
  }
};

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          status: newStatus.toLowerCase()
        }
      })
    });

    if (!response.ok) throw new Error('Failed to update order status');

    // Refresh orders after update
    await fetchOrders();
    
    toast({
      title: t('success'),
      description: t('orderUpdated'),
      status: 'success',
      duration: 2000
    });
  } catch (error) {
    console.error('Error updating order:', error);
    toast({
      title: t('error'),
      description: error.message,
      status: 'error',
      duration: 3000
    });
  }
};

const handleViewOrderDetails = (order) => {
  setSelectedOrder(order);
  setIsOrderDetailsOpen(true);
};

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
    setIsOrderDetailsOpen(false);
  };

const handleAdd = (type) => {
  switch (type) {
    case 'restaurant':
      router.push('/menu/operator/create-page');
      break;
    case 'menu':
      router.push('/menu/operator/dashboard/menus/create'); // This path doesn't exist
      break;
    case 'menuItem':
      router.push('/menu/operator/dashboard/menu-items/create'); // This path doesn't exist
      break;
    case 'table':
      handleAddTable();
      break;
  }
};

// In the handleAddTable function
const handleAddTable = async () => {
  // Check subscription tier
  const subscriptionTier = userData?.restaurant?.subscription?.tier || 'standard';
  
  // Count existing tables
  const existingTableCount = userData?.restaurant?.tables?.length || 0;

  // Restrict table creation based on subscription
  if (subscriptionTier === 'standard' && existingTableCount >= 5) {
    toast({
      title: 'Upgrade Required',
      description: 'You have reached the maximum number of tables for the standard subscription.',
      status: 'warning',
      duration: 5000,
      render: () => (
        <Box 
          p={3} 
          borderRadius="md"
        >
          <Flex align="center" justify="space-between">
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold">Upgrade to Premium</Text>
              <Text fontSize="sm">Unlock unlimited table creation</Text>
            </VStack>
            <Button 
              size="sm" 
              onClick={() => handleUpgradeSubscription('premium')}
            >
              Upgrade
            </Button>
          </Flex>
        </Box>
      )
    });
    return;
  }

  const tableName = prompt(t('enterTableName'));
  if (!tableName) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/api/tables`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          name: tableName,
          restaurant: userData?.restaurant?.id,
          status: 'Available',
          color: subscriptionTier === 'premium' 
            ? getRandomTableColor() 
            : '#3182CE' // Default blue for standard
        }
      })
    });

    if (!response.ok) throw new Error('Failed to create table');

    checkAuth();
    toast({
      title: t('tableCreated'),
      status: 'success',
      duration: 2000
    });
  } catch (error) {
    toast({
      title: t('error'),
      description: error.message,
      status: 'error',
      duration: 3000
    });
  }
};

// Helper function for random color generation
const getRandomTableColor = () => {
  const colors = [
    '#3182CE', // Blue
    '#48BB78', // Green
    '#ED64A6', // Pink
    '#F6AD55', // Orange
    '#667EEA', // Indigo
    '#38B2AC', // Teal
    '#9F7AEA'  // Purple
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Modify the table rendering to use custom color
{userData.restaurant.tables.map((table) => (
  <DashboardCard 
    key={table.id} 
    borderLeft="4px solid" 
    borderColor={table.color || '#3182CE'}
  >
    {/* Existing table card content */}
  </DashboardCard>
))}

const handleUpdateTable = async (tableId) => {
  const newTableName = prompt(t('enterNewTableName'));
  if (!newTableName) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/api/tables/${tableId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          name: newTableName,
        },
      }),
    });

    if (!response.ok) throw new Error('Failed to update table');

    checkAuth();
    toast({
      title: t('tableUpdated'),
      status: 'success',
      duration: 2000,
    });
  } catch (error) {
    toast({
      title: t('error'),
      description: error.message,
      status: 'error',
      duration: 3000,
    });
  }
};

const handleUpdate = (type, id) => {
  switch (type) {
    case 'menu':
      router.push(`/menu/operator/dashboard/menus/${id}/edit`);
      break;
    case 'menuItem':
      router.push(`/menu/operator/dashboard/menu-items/${id}/edit`);
      break;
  }
};

const handleDelete = async (type, id) => {
  if (!window.confirm(t('confirmDelete'))) return;

  try {
    const token = localStorage.getItem('token');
    let endpoint;
    
    // Fix the endpoint paths to match Strapi's API structure
    switch(type) {
      case 'menu':
        endpoint = `${BASE_URL}/api/menus/${id}`;
        break;
      case 'menuItem':
        endpoint = `${BASE_URL}/api/menu-items/${id}`;
        break;
      case 'table':
        endpoint = `${BASE_URL}/api/tables/${id}`;
        break;
      default:
        throw new Error('Invalid type for deletion');
    }

    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error?.message || `Failed to delete ${type}`);
    }

    // Refresh data after successful deletion
    await checkAuth();

    toast({
      title: t('success'),
      description: t(`${type}Deleted`),
      status: 'success',
      duration: 2000
    });
  } catch (error) {
    console.error('Delete error:', error);
    toast({
      title: t('error'),
      description: error.message,
      status: 'error',
      duration: 3000
    });
  }
};

  const captureAndDownload = async (tableName) => {
  const element = document.getElementById(`qr-box-${tableName}`);
  if (!element || !userData?.restaurant) return;

  try {
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(element, {
      backgroundColor: qrDarkMode ? '#1f2029' : '#0284c7',
      scale: 4,
      logging: false,
      useCORS: true,
      allowTaint: false,
      foreignObjectRendering: false,
      removeContainer: true,
    });

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${userData.restaurant.name}-${tableName}-QR.png`;
    link.href = url;
    link.click();
  } catch (error) {
    console.error('Error capturing QR code:', error);
    toast({
      title: t('error'),
      description: t('failedToDownload'),
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
      <title>{userData?.restaurant?.name} | {t('dashboard')}</title>
    </Head>
    <Layout>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Spinner size="xl" />
        </Box>
      ) : userData?.subscriptionExpired ? (
        <ExpiredSubscriptionView subscription={userData.restaurant.subscription} />
      ) : (
    <Box position="center">
      <Container maxW="1200px">
        <Box
          maxW="1500px"
          mx="auto"
          p={8}
          borderRadius="xl"
          boxShadow="xl"
          backdropFilter="blur(20px)"
          border="1px solid"
        >
            <VStack spacing={8} align="stretch">
              {/* Header */}
                <Flex justifyContent="space-between" alignItems="center">
                  <HStack spacing={4}>
                    <Avatar 
                      size="md" 
                      name={userData?.restaurant?.name} 
                      src={userData?.restaurant?.logo ? `${BASE_URL}${userData.restaurant.logo.url}` : undefined} 
                    />
                    <Heading size="lg">
                      {userData?.restaurant?.name || t('dashboard')}
                    </Heading>
                  </HStack>
                <ResponsiveIconButton
                  icon={FiLogOut}
                  label={t('logout')}
                  onClick={handleLogout}
                />
              </Flex>

              {/* Restaurant Info Card */}
              {userData?.restaurant ? (
                <Box>
                  <VStack align="stretch" spacing={4}>
                    <Flex justify="space-between" align="center">
                      <Box>
                        <Text>
                          {userData.restaurant.description || t('noDescription')}
                        </Text>
                      </Box>
                    </Flex>
                  </VStack>
                </Box>
              ) : (
                <Box>
                  <VStack spacing={4} align="center" py={8}>
                    <Icon as={FiSettings} boxSize={12} />
                    <Text>
                      {t('noRestaurant')}
                    </Text>
                    <ResponsiveIconButton
                      icon={FiPlus}
                      label={t('createRestaurant')}
                      onClick={() => handleAdd('restaurant')}
                    />
                  </VStack>
                </Box>
              )}
              {/* Main Content Tabs */}
              <Tabs isFitted variant="enclosed">
                <TabList mb="1em">
                  <Tab>
                    <Icon as={FiGrid} display={{ base: "block", md: "none" }} />
                    <Text display={{ base: "none", md: "block" }}>{t('tables')}</Text>
                  </Tab>
                  <Tab>
                    <Icon as={FiMenu} display={{ base: "block", md: "none" }} />
                    <Text display={{ base: "none", md: "block" }}>{t('menus')}</Text>
                  </Tab>
                  <Tab>
                    <Icon as={FiPackage} display={{ base: "block", md: "none" }} />
                    <Text display={{ base: "none", md: "block" }}>{t('menuItems')}</Text>
                  </Tab>
                  <Tab>
                    <Icon as={FiList} display={{ base: "block", md: "none" }} />
                    <Text display={{ base: "none", md: "block" }}>{t('orders')}</Text>
                  </Tab>
                  <Tab>
                    <Icon as={FiTrendingUp} display={{ base: "block", md: "none" }} />
                    <Text display={{ base: "none", md: "block" }}>{t('analytics')}</Text>
                  </Tab>
                  <Tab>
                    <Icon as={FiCreditCard} display={{ base: "block", md: "none" }} />
                    <Text display={{ base: "none", md: "block" }}>{t('subscription')}</Text>
                  </Tab>
                </TabList>
                <TabPanels>
                  
                 {/* Tables Tab */}
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        <Flex justify="space-between" align="center">
                          <Heading size="md">
                            {t('tables')}
                          </Heading>
                          <HStack spacing={2}>
                            {userData?.restaurant?.subscription?.tier === 'premium' && (
                              <IconButton
                                icon={<IoIosColorFill />}
                                aria-label="Customize QR Cards"
                                onClick={openColorCustomizationModal}
                                colorScheme="purple"
                                variant="outline"
                              />
                            )}
                            <ResponsiveIconButton
                              icon={FiPlus}
                              label={t('addTable')}
                              onClick={() => handleAdd('table')}
                              isDisabled={!userData?.restaurant}
                            />
                          </HStack>
                        </Flex>

                        {!userData?.restaurant ? (
                          <DashboardCard>
                            <VStack spacing={4} align="center" py={8}>
                              <Icon as={FiGrid} boxSize={12} />
                              <Text>
                                {t('noRestaurant')}
                              </Text>
                              <ResponsiveIconButton
                                icon={FiPlus}
                                label={t('createRestaurant')}
                                onClick={() => handleAdd('restaurant')}
                                colorScheme="blue"
                              />
                            </VStack>
                          </DashboardCard>
                        ) : !userData.restaurant.tables?.length ? (
                          <DashboardCard>
                            <VStack spacing={4} align="center" py={8}>
                              <Icon as={FiGrid} boxSize={12} />
                              <Text>
                                {t('noTables')}
                              </Text>
                              <ResponsiveIconButton
                                icon={FiPlus}
                                label={t('addFirstTable')}
                                onClick={() => handleAdd('table')}
                                colorScheme="blue"
                              />
                            </VStack>
                          </DashboardCard>
                        ) : (
                          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                            {userData.restaurant.tables.map((table) => (
                              <DashboardCard key={table.id}>
                                <VStack spacing={4} align="stretch">
                                  <Flex justify="space-between" align="center">
                                    <Box>
                                      <Heading as="h4" size="sm">
                                        {table.name}
                                      </Heading>
                                      {table.description && (
                                        <Text fontSize="sm">
                                          {table.description}
                                        </Text>
                                      )}
                                    </Box>
                                    <HStack spacing={2}>
                                      <ResponsiveIconButton
                                        icon={FiTrash}
                                        label={t('delete')}
                                        onClick={() => handleDelete('table', table.id)}
                                        size="sm"
                                        colorScheme="red"
                                        variant="outline"
                                      />
                                    </HStack>
                                  </Flex>

                                  <Box 
                                    display="flex" 
                                    justifyContent="center" 
                                    width="100%" 
                                    py={4}
                                    sx={{
                                      '@media print': {
                                        padding: 0,
                                        margin: 0
                                      }
                                    }}
                                  >
                                    <QRCodeCard
                                      tableName={table.name}
                                      qrValue={`https://menu.bitdash.app/menu/${userData.restaurant.id}`}
                                      isDarkMode={qrDarkMode}
                                      restaurantName={userData.restaurant.name}
                                      poweredByText={t('poweredBy')}
                                      customColors={
                                        userData?.restaurant?.subscription?.tier === 'premium' 
                                          ? userData.restaurant.custom_colors 
                                          : null
                                      }
                                      showLogo={
                                        userData?.restaurant?.subscription?.tier === 'premium'
                                          ? userData.restaurant.qr_settings?.showLogo
                                          : true
                                      }
                                      showName={
                                        userData?.restaurant?.subscription?.tier === 'premium'
                                          ? userData.restaurant.qr_settings?.showName
                                          : true
                                      }
                                      logoUrl={
                                        userData?.restaurant?.logo 
                                          ? `${BASE_URL}${userData.restaurant.logo.url}` 
                                          : null
                                          }
                                    />
                                  </Box>

                                  <Flex mt={4} gap={4} justify="center">
                                    <Button
                                      bg={qrDarkMode ? '#FFFFFF' : '#000000'}
                                      color={qrDarkMode ? '#000000' : '#FFFFFF'}
                                      variant="outline"
                                      onClick={() => setQrDarkMode(!qrDarkMode)}
                                      leftIcon={qrDarkMode ? <FiSun /> : <FiMoon />}
                                    >
                                    </Button>
                                    <Button
                                      bg={qrDarkMode ? '#FFFFFF' : '#000000'}
                                      color={qrDarkMode ? '#000000' : '#FFFFFF'}
                                      variant="outline"
                                      onClick={() => captureAndDownload(table.name)}
                                      leftIcon={<FiDownload />}
                                    >
                                    </Button>
                                  </Flex>
                                </VStack>
                              </DashboardCard>
                            ))}
                          </SimpleGrid>
                        )}
                      </VStack>
                    </TabPanel>

                  {/* Menus Tab */}
                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <Flex justify="space-between" align="center">
                        <Heading size="md">
                          {t('menus')}
                        </Heading>
                        <ResponsiveIconButton
                          icon={FiPlus}
                          label={t('addMenu')}
                          onClick={() => handleAdd('menu')}
                          colorScheme="green"
                          isDisabled={!userData?.restaurant}
                        />
                      </Flex>

                      {!userData?.restaurant ? (
                        <DashboardCard>
                          <VStack spacing={4} align="center" py={8}>
                            <Icon as={FiMenu} boxSize={12} />
                            <Text>
                              {t('noRestaurant')}
                            </Text>
                            <ResponsiveIconButton
                              icon={FiPlus}
                              label={t('createRestaurant')}
                              onClick={() => handleAdd('restaurant')}
                              colorScheme="blue"
                            />
                          </VStack>
                        </DashboardCard>
                      ) : !userData.restaurant.menus || userData.restaurant.menus.length === 0 ? (
                        <DashboardCard>
                          <VStack spacing={4} align="center" py={8}>
                            <Icon as={FiMenu} boxSize={12} />
                            <Text>
                              {t('noMenus')}
                            </Text>
                            <ResponsiveIconButton
                              icon={FiPlus}
                              label={t('createMenu')}
                              onClick={() => handleAdd('menu')}
                              colorScheme="blue"
                            />
                          </VStack>
                        </DashboardCard>
                      ) : (
                        <VStack spacing={4} align="stretch">
                          {userData.restaurant.menus.map((menu) => (
                            <DashboardCard key={menu.id}>
                              <VStack spacing={4} align="stretch">
                                <Flex justify="space-between" align="center">
                                  <Box>
                                    <Heading as="h4" size="sm">
                                      {menu.name}
                                    </Heading>
                                    <Text fontSize="sm">
                                      {menu.description}
                                    </Text>
                                  </Box>
                                  {/* Menu actions */}
                                  <HStack spacing={2}>
                                    <ResponsiveIconButton
                                      icon={FiEdit}
                                      label={t('edit')}
                                      onClick={() => handleUpdate('menu', menu.id)}
                                      size="sm"
                                      variant="outline"
                                      iconsOnly={true}
                                    />
                                    <ResponsiveIconButton
                                      icon={FiTrash}
                                      label={t('delete')}
                                      onClick={() => handleDelete('menu', menu.id)}
                                      size="sm"
                                      colorScheme="red"
                                      variant="outline"
                                      iconsOnly={true}
                                    />
                                  </HStack>
                                </Flex>
                              </VStack>
                            </DashboardCard>
                          ))}
                        </VStack>
                      )}
                    </VStack>
                  </TabPanel>

                  {/* Menu Items Tab */}
                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <Flex justify="space-between" align="center">
                        <Heading size="md">
                          {t('menuItems')}
                        </Heading>
                        <ResponsiveIconButton
                          icon={FiPlus}
                          label={t('addMenuItem')}
                          onClick={() => handleAdd('menuItem')}
                          colorScheme="green"
                          isDisabled={!userData?.restaurant?.menus}
                        />
                      </Flex>

                      {!userData?.restaurant?.menus ? (
                        <DashboardCard>
                          <VStack spacing={4} align="center" py={8}>
                            <Icon as={FiPackage} boxSize={12} />
                            <Text>
                              {t('noMenu')}
                            </Text>
                            <ResponsiveIconButton
                              icon={FiPlus}
                              label={t('createMenu')}
                              onClick={() => handleAdd('menu')}
                              colorScheme="blue"
                            />
                          </VStack>
                        </DashboardCard>
                      ) : (
                        userData.restaurant.menus.map((menu) => {
                          return (
                            <Box key={menu.id}>
                              <Heading as="h4" size="md" mb={4}>
                                {menu.name}
                              </Heading>
                              {!menu.menu_items || menu.menu_items.length === 0 ? (
                                <DashboardCard>
                                  <VStack spacing={4} align="center" py={8}>
                                    <Icon as={FiPackage} boxSize={12} />
                                    <Text>
                                      {t('noMenuItems')}
                                    </Text>
                                    <ResponsiveIconButton
                                      icon={FiPlus}
                                      label={t('addFirstItem')}
                                      onClick={() => handleAdd('menuItem')}
                                      colorScheme="blue"
                                    />
                                  </VStack>
                                </DashboardCard>
                              ) : (
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                  {menu.menu_items.map((item) => (
                                    <DashboardCard key={item.id}>
                                      <VStack spacing={4} align="stretch">
                                        <Flex justify="space-between" align="center">
                                          <Box>
                                            <Heading as="h4" size="sm">
                                              {item.name}
                                            </Heading>
                                            <Text fontSize="sm">
                                              {item.description}
                                            </Text>
                                            <HStack spacing={2} mt={2}>
                                              <Badge colorScheme="purple" rounded="full">
                                                {item.category}
                                              </Badge>
                                              <Badge colorScheme="green" rounded="full">
                                                ${item.price}
                                              </Badge>
                                            </HStack>
                                          </Box>
                                          <HStack spacing={2}>
                                            <ResponsiveIconButton
                                              icon={FiEdit}
                                              label={t('edit')}
                                              onClick={() => handleUpdate('menuItem', item.id)}
                                              size="sm"
                                              variant="outline"
                                              iconsOnly={true}
                                            />
                                            <ResponsiveIconButton
                                              icon={FiTrash}
                                              label={t('delete')}
                                              onClick={() => handleDelete('menuItem', item.id)}
                                              size="sm"
                                              colorScheme="red"
                                              variant="outline"
                                              iconsOnly={true}
                                            />
                                          </HStack>
                                        </Flex>
                                      </VStack>
                                    </DashboardCard>
                                  ))}
                                </SimpleGrid>
                              )}
                            </Box>
                          );
                        })
                      )}
                    </VStack>
                  </TabPanel>

                  {/* Orders Tab */}
                  <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <Flex justify="space-between" align="center">
                      <Heading size="md">
                        {t('orders')}
                      </Heading>
                    </Flex>

                    {!userData?.restaurant ? (
                      <DashboardCard>
                        <VStack spacing={4} align="center" py={8}>
                          <Icon as={FiMenu} boxSize={12}/>
                          <Text>
                            {t('noRestaurant')}
                          </Text>
                        </VStack>
                      </DashboardCard>
                    ) : orders.length === 0 ? (
                      <DashboardCard>
                        <VStack spacing={4} align="center" py={8}>
                          <Icon as={FiMenu} boxSize={12} />
                          <Text>
                            {t('noOrders')}
                          </Text>
                        </VStack>
                      </DashboardCard>
                    ) : (
                      <VStack spacing={4} align="stretch">
                        {orders.map((order) => (
                          <Flex key={order.id} direction="row" align="stretch">
                            {/* Order Card */}
                            <DashboardCard flex="1">
                              <VStack spacing={4} align="stretch">
                                <Heading as="h4" size="sm">
                                  {t('order')} #{order.id}
                                </Heading>
                                {order.customer_profile ? (
                                  <VStack align="start" spacing={0} mt={1}>
                                    <Text fontSize="sm">Customer: {order.customer_profile.fullName}</Text>
                                    <Text fontSize="sm">Phone: {order.customer_profile.phone}</Text>
                                  </VStack>
                                ) : order.guest_info ? (
                                  <VStack align="start" spacing={0} mt={1}>
                                    <Text fontSize="sm">Guest: {order.guest_info.name}</Text>
                                    <Text fontSize="sm">Phone: {order.guest_info.phone}</Text>
                                  </VStack>
                                ) : null}
                                <Text fontSize="sm" mt={1}>
                                  Table: {order.tables?.[0]?.name || 'N/A'}
                                </Text>
                                <VStack align="start" spacing={0} mt={2}>
                                  {order.order_items?.map((item, index) => (
                                    <Text key={index} fontSize="sm">
                                      {item.quantity}x {item.menu_item.name}
                                    </Text>
                                  ))}
                                </VStack>
                                <HStack mt={2} spacing={2}>
                                  <Badge colorScheme="purple" rounded="full">
                                    {order.payment_method}
                                  </Badge>
                                  <Badge colorScheme="green" rounded="full">
                                    ${order.total}
                                  </Badge>
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
                                    rounded="full"
                                    px={2}
                                  >
                                    {order.status}
                                  </Badge>
                                </HStack>
                                {order.notes && (
                                  <Text fontSize="sm" mt={2}>
                                    Notes: {order.notes}
                                  </Text>
                                )}
                              </VStack>
                            </DashboardCard>

                            {/* Buttons Column */}
                            <VStack spacing={4} justify="space-between" pl={4} w="120px">
                              <ResponsiveIconButton
                                icon={FiEdit}
                                label={t('viewDetails')}
                                onClick={() => handleViewOrderDetails(order)}
                                size="sm"
                                colorScheme="gray"
                              />
                              {order.status === 'pending' && (
                                <ResponsiveIconButton
                                  icon={FiList}
                                  label={t('preparing')}
                                  onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                                  size="sm"
                                  colorScheme="blue"
                                />
                              )}
                              {order.status === 'preparing' && (
                                <ResponsiveIconButton
                                  icon={FiClock}
                                  label={t('ready')}
                                  onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                                  size="sm"
                                  colorScheme="orange"
                                />
                              )}
                              {order.status === 'ready' && (
                                <ResponsiveIconButton
                                  icon={FiCheck}
                                  label={t('complete')}
                                  onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                  size="sm"
                                  colorScheme="green"
                                />
                              )}
                              {(order.status === 'pending' ||
                                order.status === 'preparing' ||
                                order.status === 'ready') && (
                                <ResponsiveIconButton
                                  icon={FiX}
                                  label={t('cancel')}
                                  onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                  size="sm"
                                  colorScheme="red"
                                />
                              )}
                            </VStack>
                          </Flex>
                        ))}
                      </VStack>
                    )}
                  </VStack>
                </TabPanel>

                  {/* Analytics Tab */}
                  <TabPanel>
                      <AnalyticsTab 
                        orders={orders} 
                        subscription={userData?.restaurant?.subscription} 
                      />
                  </TabPanel>

                  {/* Subscription Tab */}
                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <Heading size="md">{t('subscriptionDetails')}</Heading>
                      <SubscriptionInfo
                        subscription={userData?.restaurant?.subscription || {
                          tier: 'standard',
                          status: 'active',
                          commission_rate: 2.5,
                          monthly_fee: 80,
                          start_date: new Date().toISOString()
                        }}
                        onUpgrade={handleUpgradeSubscription}
                        onCancel={handleCancelSubscription}
                      />
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>

              {/* Order Details Drawer */}
              <Drawer isOpen={isOrderDetailsOpen} placement="right" onClose={handleCloseOrderDetails} size="md">
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader>{t('orderDetails')}</DrawerHeader>

                  <DrawerBody>
                    {selectedOrder && (
                      <VStack spacing={4} align="stretch">
                        <Heading size="md">Order #{selectedOrder.id}</Heading>
                        
                        {/* Guest Info */}
                        {selectedOrder.guest_info && (
                          <Box>
                            <Text fontWeight="bold">Guest Information:</Text>
                            <Text>Name: {selectedOrder.guest_info.name}</Text>
                            <Text>Phone: {selectedOrder.guest_info.phone}</Text>
                          </Box>
                        )}

                        {/* Table Info */}
                        <Box>
                          <Text fontWeight="bold">Table:</Text>
                          <Text>{selectedOrder.tables?.[0]?.name || 'No table'}</Text>
                        </Box>

                        {/* Order Items */}
                        <Box>
                          <Text fontWeight="bold">Items:</Text>
                          {selectedOrder.order_items?.map((item, index) => (
                            <Box key={index} p={2} borderWidth="1px" borderRadius="md" mt={2}>
                              <HStack justify="space-between">
                                <VStack align="start" spacing={0}>
                                  <Text fontWeight="medium">{item.menu_item.name}</Text>
                                  <Text fontSize="sm">${item.unit_price} x {item.quantity}</Text>
                                  {item.special_instructions && (
                                    <Text fontSize="sm">
                                      Notes: {item.special_instructions}
                                    </Text>
                                  )}
                                </VStack>
                                <Text fontWeight="bold">${item.subtotal}</Text>
                              </HStack>
                            </Box>
                          ))}
                        </Box>

                        <Divider />

                        {/* Order Details */}
                        <Box>
                          <HStack justify="space-between">
                            <Text fontWeight="bold">Total:</Text>
                            <Text>${selectedOrder.total}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontWeight="bold">Payment Method:</Text>
                            <Text>{selectedOrder.payment_method}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontWeight="bold">Status:</Text>
                            <Badge
                              colorScheme={
                                selectedOrder.status === 'pending'
                                  ? 'yellow'
                                  : selectedOrder.status === 'preparing'
                                  ? 'blue'
                                  : selectedOrder.status === 'completed'
                                  ? 'green'
                                  : 'red'
                              }
                              rounded="full"
                              px={2}
                            >
                              {selectedOrder.status}
                            </Badge>
                          </HStack>
                        </Box>

                        {/* Notes */}
                        {selectedOrder.notes && (
                          <Box>
                            <Text fontWeight="bold">Notes:</Text>
                            <Text whiteSpace="pre-wrap">{selectedOrder.notes}</Text>
                          </Box>
                        )}

                        {/* Timestamps */}
                        <Box>
                          <Text fontWeight="bold">Order Time:</Text>
                          <Text>{new Date(selectedOrder.createdAt).toLocaleString()}</Text>
                        </Box>
                        <OperatorMessages orderId={selectedOrder.id} />
                      </VStack>
                    )}
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </VStack>
          </Box>
        </Container>
       </Box>
      )}    
    </Layout>
  <ColorCustomizationModal 
    isColorModalOpen={isColorModalOpen}
    closeColorCustomizationModal={closeColorCustomizationModal}
    userData={userData}
    setUserData={setUserData}
    selectedColors={selectedColors}
    setSelectedColors={setSelectedColors}
    qrSettings={qrSettings}
    setQrSettings={setQrSettings}
    toast={toast}
    t={t}
    BASE_URL={BASE_URL}
  />
</>
  );
};

export default Dashboard;