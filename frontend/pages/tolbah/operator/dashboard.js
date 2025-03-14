import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js'; 
import Layout from '@/components/Layout';
import OperatorMessages from '@/components/OperatorMessages';
import SubscriptionInfo from '@/components/SubscriptionInfo';
import AnalyticsTab from '@/components/tolbah/operator/AnalyticsTab';
import Head from 'next/head';
import { QRCodeCanvas } from 'qrcode.react';

import {
  Box, Container, VStack, Heading, Text, Flex, Switch, 
  SimpleGrid, Button, FormControl, FormLabel, Input, Spinner,
  useToast, Tabs, TabList, TabPanels, Tab, TabPanel, Badge,
  Icon, Divider, HStack, Avatar, IconButton, Modal, ModalOverlay,
  DrawerContent, DrawerOverlay, Drawer, ModalContent, ModalHeader,
  ModalFooter, Image, ModalBody, ModalCloseButton, DrawerHeader,
  DrawerBody, DrawerCloseButton, Textarea, Select, NumberInput,
  NumberInputField, NumberInputStepper, NumberIncrementStepper,
  NumberDecrementStepper, useColorModeValue
} from '@chakra-ui/react';

import { mdiCheckCircle } from '@mdi/js';
import { IoIosColorFill } from "react-icons/io";

import {
  FiLogOut, FiPlus, FiEdit, FiTrash, FiMenu, FiGrid, FiList,
  FiCheck, FiPackage, FiArrowRight, FiSettings, FiDownload,
  FiSun, FiClock, FiX, FiCreditCard, FiTrendingUp, FiMoon,
  FiUser
} from 'react-icons/fi';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
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
  const [operatorData, setOperatorData] = useState(null);
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [qrDarkMode, setQrDarkMode] = useState(false);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const toast = useToast();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  // Modal states
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [currentMenuItem, setCurrentMenuItem] = useState(null);
  
  // Form states
  const [menuForm, setMenuForm] = useState({ name: '', description: '' });
  const [menuItemForm, setMenuItemForm] = useState({ 
    name: '', 
    description: '', 
    price: 0, 
    category: '',
    menuId: null
  });

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

  // Load colors and settings when userData changes
  useEffect(() => {
    if (userData?.restaurant) {
      if (userData.restaurant.custom_colors) {
        setSelectedColors(prevColors => ({
          ...prevColors,
          ...userData.restaurant.custom_colors
        }));
      }
      
      if (userData.restaurant.qr_settings) {
        setQrSettings(prevSettings => ({
          ...prevSettings,
          ...userData.restaurant.qr_settings
        }));
      }
    }
  }, [userData?.restaurant?.custom_colors, userData?.restaurant?.qr_settings]);

  // Color Customization Modal
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
                leftIcon={<Icon as={FiCheck} />}
                onClick={handleColorChange}
              >
                Save Changes
              </Button>
              <Button 
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

  // Menu Modal Component
  const MenuModal = ({ isOpen, onClose, menu }) => {
    const isEditing = !!menu;
    
    useEffect(() => {
      if (menu) {
        console.log("Menu data for form:", menu);
        setMenuForm({
          name: menu.attributes?.name || menu.name || '',
          description: menu.attributes?.description || menu.description || ''
        });
      } else {
        setMenuForm({ name: '', description: '' });
      }
    }, [menu]);
    
    const handleSubmit = async () => {
      try {
        console.log("Submitting menu form:", menuForm);
        
        const token = localStorage.getItem('token');
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing 
          ? `${BASE_URL}/api/menus/${menu.id}` 
          : `${BASE_URL}/api/menus`;
        
        const body = {
          data: {
            name: menuForm.name,
            description: menuForm.description,
            restaurant: userData.restaurant.id
          }
        };
        
        console.log("Menu request:", { method, url, body });
        
        const response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        
        const responseData = await response.json();
        console.log("Menu response:", responseData);
        
        if (!response.ok) {
          throw new Error(responseData.error?.message || `Failed to ${isEditing ? 'update' : 'create'} menu`);
        }
        
        toast({
          title: 'Success',
          description: `Menu ${isEditing ? 'updated' : 'created'} successfully`,
          status: 'success',
          duration: 2000
        });
        
        // Refresh data
        await checkAuth();
        onClose();
      } catch (error) {
        console.error('Menu operation error:', error);
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 3000
        });
      }
    };
    
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? 'Edit Menu' : 'Create Menu'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Menu Name</FormLabel>
                <Input 
                  value={menuForm.name} 
                  onChange={(e) => setMenuForm({...menuForm, name: e.target.value})}
                  placeholder="Enter menu name"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}
                  placeholder="Enter menu description"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleSubmit}
              isDisabled={!menuForm.name}
            >
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  // Menu Item Modal Component
  const MenuItemModal = ({ isOpen, onClose, menuItem, menus }) => {
    const isEditing = !!menuItem;
    
    useEffect(() => {
      if (menuItem) {
        setMenuItemForm({
          name: menuItem.name,
          description: menuItem.description || '',
          price: menuItem.price || 0,
          category: menuItem.category || '',
          menuId: menuItem.menus?.id || null
        });
      } else {
        // Default to first menu if creating new
        const defaultMenuId = menus && menus.length > 0 ? menus[0].id : null;
        setMenuItemForm({ 
          name: '', 
          description: '', 
          price: 0, 
          category: '',
          menuId: defaultMenuId
        });
      }
    }, [menuItem, menus]);
    
    const handleSubmit = async () => {
      try {
        const token = localStorage.getItem('token');
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing 
          ? `${BASE_URL}/api/menu-items/${menuItem.id}` 
          : `${BASE_URL}/api/menu-items`;
        
        const body = {
          data: {
            name: menuItemForm.name,
            description: menuItemForm.description,
            price: parseFloat(menuItemForm.price),
            category: menuItemForm.category,
            menus: menuItemForm.menuId // Using menus as per schema
          }
        };
        
        const response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        
        if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} menu item`);
        
        toast({
          title: 'Success',
          description: `Menu item ${isEditing ? 'updated' : 'created'} successfully`,
          status: 'success',
          duration: 2000
        });
        
        // Refresh data
        await checkAuth();
        onClose();
      } catch (error) {
        console.error('Menu item operation error:', error);
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 3000
        });
      }
    };
    
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? 'Edit Menu Item' : 'Create Menu Item'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Item Name</FormLabel>
                <Input 
                  value={menuItemForm.name} 
                  onChange={(e) => setMenuItemForm({...menuItemForm, name: e.target.value})}
                  placeholder="Enter item name"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={menuItemForm.description}
                  onChange={(e) => setMenuItemForm({...menuItemForm, description: e.target.value})}
                  placeholder="Enter item description"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Price</FormLabel>
                <NumberInput 
                  value={menuItemForm.price} 
                  onChange={(value) => setMenuItemForm({...menuItemForm, price: value})}
                  min={0}
                  precision={2}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Input 
                  value={menuItemForm.category} 
                  onChange={(e) => setMenuItemForm({...menuItemForm, category: e.target.value})}
                  placeholder="Enter category (e.g., Appetizers, Main Course)"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Menu</FormLabel>
                <Select 
                  value={menuItemForm.menuId || ''}
                  onChange={(e) => setMenuItemForm({...menuItemForm, menuId: e.target.value})}
                >
                  <option value="">Select a menu</option>
                  {menus && menus.map(menu => (
                    <option key={menu.id} value={menu.id}>{menu.name}</option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleSubmit}
              isDisabled={!menuItemForm.name || !menuItemForm.menuId}
            >
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  // QR Code printing functionality
  const handlePrint = async (tableName) => {
    try {
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

      const image = canvas.toDataURL('image/png');
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

      const img = printWindow.document.querySelector('img');
      if (img) {
        img.onload = () => {
          printWindow.print();
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


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Fetch operator data function
  const fetchOperatorData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userObj = localStorage.getItem('user');
      let userId;
      
      try {
        userId = userObj ? JSON.parse(userObj).id : null;
      } catch (e) {
        console.error('Error parsing user object:', e);
        userId = null;
      }
      
      if (!token || !userId) {
        console.error('Authentication information missing:', { token: !!token, userId });
        throw new Error('Authentication information missing');
      }
      
      // Use the correct endpoint for operators - check your actual API path
      const response = await fetch(`${BASE_URL}/api/operators`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to fetch operator data');
      }
      
      const data = await response.json();
      console.log('Operator data response:', data);
      
      // Find the operator that matches the user ID
      const operator = data.data?.find(op => op.id === userId);
      if (operator) {
        setOperatorData(operator);
        return operator;
      } else {
        console.error('No matching operator found for user ID:', userId);
        throw new Error('No operator data found');
      }
    } catch (error) {
      console.error('Error fetching operator data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load operator data: ' + error.message,
        status: 'error',
        duration: 3000
      });
      return null;
    }
  };

  // Fetch restaurant data and check authentication
  // The core authentication and data fetching function
// Improved checkAuth function that correctly handles the data structure
const checkAuth = async () => {
  setIsLoading(true);
  
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }
  
  try {
    // First fetch user data
    const userResponse = await fetch(`${BASE_URL}/api/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const userData = await userResponse.json();
    console.log("User data:", userData);
    
    // Then fetch operator data
    const operatorResponse = await fetch(
      `${BASE_URL}/api/operators?filters[users_permissions_user][id]=${userData.id}&populate[restaurant][populate][0]=logo&populate[restaurant][populate][1]=tables&populate[restaurant][populate][2]=menus&populate[restaurant][populate][3]=menus.menu_items&populate[restaurant][populate][4]=subscription&populate[restaurant][populate][5]=custom_colors&populate[restaurant][populate][6]=qr_settings`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!operatorResponse.ok) {
      throw new Error('Failed to fetch operator data');
    }
    
    const operatorData = await operatorResponse.json();
    console.log("Operator data:", operatorData);
    
    // Save operator data
    if (operatorData.data && operatorData.data.length > 0) {
      setOperatorData(operatorData.data[0]);
      
      // Extract restaurant data from operator relationship
      const restaurant = operatorData.data[0].attributes?.restaurant?.data;
      
      if (restaurant) {
        // Process restaurant data carefully with null checks
        const processedRestaurantData = {
          id: restaurant.id,
          name: restaurant.attributes?.name || '',
          description: restaurant.attributes?.description || '',
          custom_colors: restaurant.attributes?.custom_colors || null,
          qr_settings: restaurant.attributes?.qr_settings || null,
          logo: restaurant.attributes?.logo?.data || null,
          tables: restaurant.attributes?.tables?.data || [],
          menus: restaurant.attributes?.menus?.data || [],
          subscription: restaurant.attributes?.subscription?.data?.attributes || {
            tier: 'standard',
            status: 'active'
          }
        };
        
        // Set user data with restaurant info
        setUserData({
          restaurant: processedRestaurantData
        });
        
        // Fetch orders if restaurant exists
        if (restaurant.id) {
          const token = localStorage.getItem('token');
          await fetchOrders(restaurant.id, token);
        }
      } else {
        setUserData({
          ...initialUserData,
          noRestaurant: true
        });
      }
    } else {
      throw new Error('No operator data found');
    }
  } catch (error) {
    console.error('Dashboard error:', error);
    
    toast({
      title: 'Error',
      description: error.message || 'Failed to load dashboard',
      status: 'error',
      duration: 5000
    });
    
    setUserData(initialUserData);
  } finally {
    setIsLoading(false);
  }
};

// Update QRCodeCard to safely handle logo URL
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
        direction: 'ltr'
      }}
      borderRadius="8px"
      position="relative"
      overflow="hidden"
      padding="15px"
      mx="auto"
      boxShadow="0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)"
    >
      {/* Tolbah Brand */}
      <Text 
        fontSize="xs" 
        textAlign="center"
        fontWeight="bold" 
        color={customColors?.accent || (isDarkMode ? 'white' : 'black')}
      >
        Powered by Tolbah
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
                filter: 'brightness(0) invert(1)'
              }}
            />
          </Box>
        )}
      </Flex>
    </Box>
  );
};

  // Fetch orders function with proper error handling
  const fetchOrders = async (restaurantId, token) => {
    if (!restaurantId) {
      console.warn('Cannot fetch orders: No restaurant ID provided');
      return;
    }
    
    try {
      // Basic orders fetch with populate for essential fields
      const response = await fetch(
        `${BASE_URL}/api/orders?filters[restaurant][id]=${restaurantId}&populate=*`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

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
      setOrders([]);
    }
  };

  // Handle order status updates
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
      const statusToSet = newStatus.toLowerCase();
      
      if (!validStatuses.includes(statusToSet)) {
        throw new Error(`Invalid status: ${newStatus}`);
      }
      
      const response = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            status: statusToSet
          }
        })
      });

      if (!response.ok) throw new Error('Failed to update order status');

      // Refresh orders after update
      await fetchOrders(userData.restaurant.id, token);
      
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

  // Handle viewing order details
  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
    setIsOrderDetailsOpen(false);
  };

  // Handle different actions (add, update, delete)
  const handleAdd = (type) => {
  switch (type) {
    case 'restaurant':
      router.push('/bsoraa/operator/create-page');
      break;
    case 'menu':
      // Reset the form first
      setMenuForm({ name: '', description: '' });
      setCurrentMenu(null);
      setIsMenuModalOpen(true);
      break;
    case 'menuItem':
      // Reset the form with default menu if available
      const defaultMenuId = userData?.restaurant?.menus?.length > 0 ? userData.restaurant.menus[0].id : null;
      setMenuItemForm({ 
        name: '', 
        description: '', 
        price: 0, 
        category: '',
        menuId: defaultMenuId
      });
      setCurrentMenuItem(null);
      setIsMenuItemModalOpen(true);
      break;
    case 'table':
      handleAddTable();
      break;
  }
};

const handleUpdate = (type, item) => {
  console.log("Updating item:", type, item); // Debug logging
  
  switch (type) {
    case 'menu':
      // Populate form with menu data
      setMenuForm({
        name: item.attributes?.name || item.name || '',
        description: item.attributes?.description || item.description || ''
      });
      setCurrentMenu(item);
      setIsMenuModalOpen(true);
      break;
    case 'menuItem':
      // Populate form with menu item data
      setMenuItemForm({
        name: item.attributes?.name || item.name || '',
        description: item.attributes?.description || item.description || '',
        price: item.attributes?.price || item.price || 0,
        category: item.attributes?.category || item.category || '',
        menuId: item.attributes?.menus?.data?.id || item.menus?.id || item.menuId || null
      });
      setCurrentMenuItem(item);
      setIsMenuItemModalOpen(true);
      break;
    case 'table':
      handleUpdateTable(item.id, item.attributes?.name || item.name);
      break;
  }
};

  // Table creation function
  const handleAddTable = async () => {
    const tableName = prompt(t('enterTableName'));
    if (!tableName || tableName.trim() === '') return;

    if (!userData?.restaurant?.id) {
        toast({
          title: t('error'),
          description: 'Restaurant information is missing. Please refresh or contact support.',
          status: 'error',
          duration: 3000
        });
        return;
      }

      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        // Construct the table data object based on the schema
        const tableData = {
          data: {
            name: tableName.trim(),
            restaurant: userData.restaurant.id,
            status: 'Available', // Using the enum values from schema
            description: `Table created on ${new Date().toLocaleDateString()}`
          }
        };
        
        const response = await fetch(`${BASE_URL}/api/tables`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(tableData)
        });

        if (!response.ok) {
          const responseData = await response.json().catch(() => ({}));
          throw new Error(responseData.error?.message || `Failed to create table: ${response.status}`);
        }

        // Refresh data after successful creation
        await checkAuth();
        
        toast({
          title: t('tableCreated'),
          description: `Table "${tableName}" has been created successfully.`,
          status: 'success',
          duration: 2000
        });
      } catch (error) {
        console.error('Table creation error:', error);
        toast({
          title: t('error'),
          description: error.message || 'Failed to create table. Please try again.',
          status: 'error',
          duration: 5000
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleUpdateTable = async (tableId, currentTableName) => {
      if (!tableId) {
        toast({
          title: t('error'),
          description: 'Invalid table ID',
          status: 'error',
          duration: 3000
        });
        return;
      }

      // Prompt for new table name with current name as default
      const newTableName = prompt(t('enterNewTableName'), currentTableName);
      
      // Check if user canceled or submitted empty name
      if (!newTableName || newTableName.trim() === '') return;
      
      // Check if name didn't change
      if (newTableName.trim() === currentTableName) return;

      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        // Update the table data
        const updateData = {
          data: {
            name: newTableName.trim()
          }
        };
        
        const response = await fetch(`${BASE_URL}/api/tables/${tableId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          const responseData = await response.json().catch(() => ({}));
          throw new Error(responseData.error?.message || `Failed to update table: ${response.status}`);
        }

        // Refresh data after successful update
        await checkAuth();
        
        toast({
          title: t('tableUpdated'),
          description: `Table renamed from "${currentTableName}" to "${newTableName}".`,
          status: 'success',
          duration: 2000,
        });
      } catch (error) {
        console.error('Table update error:', error);
        toast({
          title: t('error'),
          description: error.message || 'Failed to update table. Please try again.',
          status: 'error',
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    const handleDelete = async (type, id) => {
      if (!window.confirm(t('confirmDelete'))) return;

      try {
        const token = localStorage.getItem('token');
        let endpoint;
        
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

    // Component for responsive buttons with icons
    const ResponsiveIconButton = ({ 
      icon: Icon, 
      label, 
      onClick, 
      colorScheme = "blue",
      size = "md",
      variant = "solid",
      isDisabled = false,
      iconsOnly = false
    }) => (
      <Button
        onClick={onClick}
        colorScheme={colorScheme}
        size={size}
        variant={variant}
        isDisabled={isDisabled}
        minW={iconsOnly ? "40px" : undefined}
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

    // Styled card component
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

    // Initialize the component
    useEffect(() => {
      checkAuth();
    }, []);

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
                    <Flex justify="space-between" alignItems="center">
                      <HStack spacing={4}>
                        <Avatar 
                          size="md" 
                          name={userData?.restaurant?.name} 
                          src={userData?.restaurant?.logo ? `${BASE_URL}${userData.restaurant.logo.url}` : undefined} 
                        />
                        <VStack align="start" spacing={0}>
                          <Heading size="lg">
                            {userData?.restaurant?.name || t('dashboard')}
                          </Heading>
                          {operatorData && (
                            <HStack>
                              <Icon as={FiUser} color="gray.500" />
                              <Text fontSize="sm" color="gray.500">
                                {operatorData.attributes?.fullName || "Operator"} 
                                ({operatorData.attributes?.operatorType || "standard"})
                              </Text>
                            </HStack>
                          )}
                        </VStack>
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
                                <IconButton
                                  icon={<IoIosColorFill />}
                                  aria-label="Customize QR Cards"
                                  onClick={() => setIsColorModalOpen(true)}
                                  colorScheme="purple"
                                  variant="outline"
                                />
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
                                            {table.attributes?.name || table.name}
                                          </Heading>
                                          {(table.attributes?.description || table.description) && (
                                            <Text fontSize="sm">
                                              {table.attributes?.description || table.description}
                                            </Text>
                                          )}
                                        </Box>
                                        <HStack spacing={2}>
                                          <ResponsiveIconButton
                                            icon={FiEdit}
                                            label={t('edit')}
                                            onClick={() => handleUpdate('table', table)}
                                            size="sm"
                                            variant="outline"
                                            iconsOnly={true}
                                          />
                                          <ResponsiveIconButton
                                            icon={FiTrash}
                                            label={t('delete')}
                                            onClick={() => handleDelete('table', table.id)}
                                            size="sm"
                                            colorScheme="red"
                                            variant="outline"
                                            iconsOnly={true}
                                          />
                                        </HStack>
                                      </Flex>

                                      <Box 
                                        display="flex" 
                                        justifyContent="center" 
                                        width="100%" 
                                        py={4}
                                      >
                                        <QRCodeCard
                                          tableName={table.attributes?.name || table.name}
                                          qrValue={`https://bsoraa.bitdash.app/bsoraa/${userData.restaurant.id}`}
                                          isDarkMode={qrDarkMode}
                                          restaurantName={userData.restaurant.name}
                                          customColors={userData.restaurant.custom_colors}
                                          showLogo={userData.restaurant.qr_settings?.showLogo ?? true}
                                          showName={userData.restaurant.qr_settings?.showName ?? true}
                                          logoUrl={userData.restaurant.logo 
                                            ? `${BASE_URL}${userData.restaurant.logo.url}` 
                                            : null}
                                        />
                                      </Box>

                                      <Flex mt={4} gap={4} justify="center">
                                        <Button
                                          onClick={() => setQrDarkMode(!qrDarkMode)}
                                          leftIcon={qrDarkMode ? <FiSun /> : <FiMoon />}
                                        >
                                          {qrDarkMode ? 'Light Mode' : 'Dark Mode'}
                                        </Button>
                                        <Button
                                          onClick={() => captureAndDownload(table.attributes?.name || table.name)}
                                          leftIcon={<FiDownload />}
                                        >
                                          Download
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
                                            {menu.attributes?.name || menu.name}
                                          </Heading>
                                          <Text fontSize="sm">
                                            {menu.attributes?.description || menu.description}
                                          </Text>
                                        </Box>
                                        <HStack spacing={2}>
                                          <ResponsiveIconButton
                                            icon={FiEdit}
                                            label={t('edit')}
                                            onClick={() => handleUpdate('menu', menu)}
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
                                isDisabled={!userData?.restaurant?.menus?.length}
                              />
                            </Flex>

                            {!userData?.restaurant?.menus?.length ? (
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
                                const menuItems = menu.menu_items || [];
                                
                                return (
                                  <Box key={menu.id}>
                                    <Heading as="h4" size="md" mb={4}>
                                      {menu.attributes?.name || menu.name}
                                    </Heading>
                                    {!menuItems.length ? (
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
                                        {menuItems.map((item) => (
                                          <DashboardCard key={item.id}>
                                            <VStack spacing={4} align="stretch">
                                              <Flex justify="space-between" align="center">
                                                <Box>
                                                  <Heading as="h4" size="sm">
                                                    {item.attributes?.name || item.name}
                                                  </Heading>
                                                  <Text fontSize="sm">
                                                    {item.attributes?.description || item.description}
                                                  </Text>
                                                  <HStack spacing={2} mt={2}>
                                                    <Badge colorScheme="purple" rounded="full">
                                                      {item.attributes?.category || item.category || 'Uncategorized'}
                                                    </Badge>
                                                    <Badge colorScheme="green" rounded="full">
                                                      ${item.attributes?.price || item.price || '0.00'}
                                                    </Badge>
                                                  </HStack>
                                                </Box>
                                                <HStack spacing={2}>
                                                  <ResponsiveIconButton
                                                    icon={FiEdit}
                                                    label={t('edit')}
                                                    onClick={() => handleUpdate('menuItem', item)}
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
                                        {order.attributes?.customer_profile ? (
                                          <VStack align="start" spacing={0} mt={1}>
                                            <Text fontSize="sm">Customer: {order.attributes.customer_profile.data?.attributes?.fullName || "Guest"}</Text>
                                            <Text fontSize="sm">Phone: {order.attributes.customer_profile.data?.attributes?.phone || "N/A"}</Text>
                                          </VStack>
                                        ) : order.attributes?.guest_info ? (
                                          <VStack align="start" spacing={0} mt={1}>
                                            <Text fontSize="sm">Guest: {order.attributes.guest_info.name}</Text>
                                            <Text fontSize="sm">Phone: {order.attributes.guest_info.phone}</Text>
                                          </VStack>
                                        ) : null}
                                        <Text fontSize="sm" mt={1}>
                                          Table: {order.attributes?.tables?.data?.[0]?.attributes?.name || 'N/A'}
                                        </Text>
                                        <VStack align="start" spacing={0} mt={2}>
                                          {order.attributes?.order_items?.data?.map((item, index) => (
                                            <Text key={index} fontSize="sm">
                                              {item.attributes?.quantity || 1}x {item.attributes?.menu_item?.data?.attributes?.name || 'Unknown Item'}
                                            </Text>
                                          ))}
                                        </VStack>
                                        <HStack mt={2} spacing={2}>
                                          <Badge colorScheme="purple" rounded="full">
                                            {order.attributes?.payment_method || 'N/A'}
                                          </Badge>
                                          <Badge colorScheme="green" rounded="full">
                                            ${order.attributes?.total || '0.00'}
                                          </Badge>
                                          <Badge
                                            colorScheme={
                                              order.attributes?.status === 'pending'
                                                ? 'yellow'
                                                : order.attributes?.status === 'preparing'
                                                ? 'blue'
                                                : order.attributes?.status === 'ready'
                                                ? 'orange'
                                                : order.attributes?.status === 'completed'
                                                ? 'green'
                                                : 'red'
                                            }
                                            rounded="full"
                                            px={2}
                                          >
                                            {order.attributes?.status || 'pending'}
                                          </Badge>
                                        </HStack>
                                        {order.attributes?.notes && (
                                          <Text fontSize="sm" mt={2}>
                                            Notes: {order.attributes.notes}
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
                                      {order.attributes?.status === 'pending' && (
                                        <ResponsiveIconButton
                                          icon={FiList}
                                          label={t('preparing')}
                                          onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                                          size="sm"
                                          colorScheme="blue"
                                        />
                                      )}
                                      {order.attributes?.status === 'preparing' && (
                                        <ResponsiveIconButton
                                          icon={FiClock}
                                          label={t('ready')}
                                          onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                                          size="sm"
                                          colorScheme="orange"
                                        />
                                      )}
                                      {order.attributes?.status === 'ready' && (
                                        <ResponsiveIconButton
                                          icon={FiCheck}
                                          label={t('complete')}
                                          onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                          size="sm"
                                          colorScheme="green"
                                        />
                                      )}
                                      {(order.attributes?.status === 'pending' ||
                                        order.attributes?.status === 'preparing' ||
                                        order.attributes?.status === 'ready') && (
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
                            subscription={userData?.restaurant?.subscription || {
                              tier: 'standard',
                              status: 'active'
                            }}
                            dir="ltr" 
                          />
                        </TabPanel>
                        
                        {/* Subscription Tab */}
                        <TabPanel>
                          <VStack spacing={4} align="stretch">
                            <Heading size="md">{t('subscriptionDetails')}</Heading>
                            {userData?.restaurant?.subscription ? (
                              <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                  <Box>
                                    <Text fontWeight="bold">Tier:</Text>
                                    <Badge colorScheme={userData.restaurant.subscription.tier === 'premium' ? 'purple' : 'blue'}>
                                      {userData.restaurant.subscription.tier || 'standard'}
                                    </Badge>
                                  </Box>
                                  <Box>
                                    <Text fontWeight="bold">Status:</Text>
                                    <Badge colorScheme={userData.restaurant.subscription.status === 'active' ? 'green' : 'red'}>
                                      {userData.restaurant.subscription.status || 'active'}
                                    </Badge>
                                  </Box>
                                  <Box>
                                    <Text fontWeight="bold">Monthly Fee:</Text>
                                    <Text>${userData.restaurant.subscription.monthly_fee || 0}</Text>
                                  </Box>
                                  <Box>
                                    <Text fontWeight="bold">Commission Rate:</Text>
                                    <Text>{userData.restaurant.subscription.commission_rate || 0}%</Text>
                                  </Box>
                                  {userData.restaurant.subscription.start_date && (
                                    <Box>
                                      <Text fontWeight="bold">Start Date:</Text>
                                      <Text>{new Date(userData.restaurant.subscription.start_date).toLocaleDateString()}</Text>
                                    </Box>
                                  )}
                                  {userData.restaurant.subscription.end_date && (
                                    <Box>
                                      <Text fontWeight="bold">End Date:</Text>
                                      <Text>{new Date(userData.restaurant.subscription.end_date).toLocaleDateString()}</Text>
                                    </Box>
                                  )}
                                </SimpleGrid>
                                
                                <HStack mt={6} spacing={4} justify="center">
                                  <Button 
                                    colorScheme="purple" 
                                    leftIcon={<FiArrowRight />}
                                    onClick={() => handleUpgradeSubscription(userData.restaurant.subscription.tier === 'standard' ? 'premium' : 'standard')}
                                  >
                                    {userData.restaurant.subscription.tier === 'standard' ? 'Upgrade to Premium' : 'Downgrade to Standard'}
                                  </Button>
                                  
                                  {userData.restaurant.subscription.status === 'active' && (
                                    <Button 
                                      colorScheme="red" 
                                      variant="outline"
                                      onClick={handleCancelSubscription}
                                    >
                                      Cancel Subscription
                                    </Button>
                                  )}
                                </HStack>
                              </Box>
                            ) : (
                              <Box textAlign="center" p={8}>
                                <VStack spacing={4}>
                                  <Icon as={FiCreditCard} boxSize={12} />
                                  <Text>No active subscription found</Text>
                                  <Button colorScheme="blue" onClick={() => handleUpgradeSubscription('standard')}>
                                    Subscribe Now
                                  </Button>
                                </VStack>
                              </Box>
                            )}
                          </VStack>
                        </TabPanel>
                      </TabPanels>
                    </Tabs>

                    {/* Order Details Drawer */}
                    <Drawer 
                      isOpen={isOrderDetailsOpen} 
                      placement="right" 
                      onClose={handleCloseOrderDetails} 
                      size="md"
                    >
                      <DrawerOverlay />
                      <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>{t('orderDetails')}</DrawerHeader>

                        <DrawerBody>
                          {selectedOrder && (
                            <VStack spacing={4} align="stretch">
                              <Heading size="md">Order #{selectedOrder.id}</Heading>
                              
                              {/* Guest Info */}
                              {selectedOrder.attributes?.guest_info && (
                                <Box>
                                  <Text fontWeight="bold">Guest Information:</Text>
                                  <Text>Name: {selectedOrder.attributes.guest_info.name}</Text>
                                  <Text>Phone: {selectedOrder.attributes.guest_info.phone}</Text>
                                </Box>
                              )}

                              {/* Table Info */}
                              <Box>
                                <Text fontWeight="bold">Table:</Text>
                                <Text>{selectedOrder.attributes?.tables?.data?.[0]?.attributes?.name || 'No table'}</Text>
                              </Box>

                              {/* Order Items */}
                              <Box>
                                <Text fontWeight="bold">Items:</Text>
                                {selectedOrder.attributes?.order_items?.data?.map((item, index) => (
                                  <Box key={index} p={2} borderWidth="1px" borderRadius="md" mt={2}>
                                    <HStack justify="space-between">
                                      <VStack align="start" spacing={0}>
                                        <Text fontWeight="medium">{item.attributes.menu_item.data.attributes.name}</Text>
                                        <Text fontSize="sm">${item.attributes.unit_price} x {item.attributes.quantity}</Text>
                                        {item.attributes.special_instructions && (
                                          <Text fontSize="sm">
                                            Notes: {item.attributes.special_instructions}
                                          </Text>
                                        )}
                                      </VStack>
                                      <Text fontWeight="bold">${item.attributes.subtotal}</Text>
                                    </HStack>
                                  </Box>
                                ))}
                              </Box>

                              <Divider />

                              {/* Order Details */}
                              <Box>
                                <HStack justify="space-between">
                                  <Text fontWeight="bold">Total:</Text>
                                  <Text>${selectedOrder.attributes?.total}</Text>
                                </HStack>
                                <HStack justify="space-between">
                                  <Text fontWeight="bold">Payment Method:</Text>
                                  <Text>{selectedOrder.attributes?.payment_method}</Text>
                                </HStack>
                                <HStack justify="space-between">
                                  <Text fontWeight="bold">Status:</Text>
                                  <Badge
                                    colorScheme={
                                      selectedOrder.attributes?.status === 'pending'
                                        ? 'yellow'
                                        : selectedOrder.attributes?.status === 'preparing'
                                        ? 'blue'
                                        : selectedOrder.attributes?.status === 'completed'
                                        ? 'green'
                                        : 'red'
                                    }
                                    rounded="full"
                                    px={2}
                                  >
                                    {selectedOrder.attributes?.status}
                                  </Badge>
                                </HStack>
                              </Box>

                              {/* Notes */}
                              {selectedOrder.attributes?.notes && (
                                <Box>
                                  <Text fontWeight="bold">Notes:</Text>
                                  <Text whiteSpace="pre-wrap">{selectedOrder.attributes.notes}</Text>
                                </Box>
                              )}

                              {/* Timestamps */}
                              <Box>
                                <Text fontWeight="bold">Order Time:</Text>
                                <Text>{new Date(selectedOrder.attributes?.createdAt).toLocaleString()}</Text>
                              </Box>
                              {selectedOrder.id && (
                                <OperatorMessages orderId={selectedOrder.id} />
                              )}
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
        
        {/* Modals */}
        <ColorCustomizationModal 
          isColorModalOpen={isColorModalOpen}
          closeColorCustomizationModal={() => setIsColorModalOpen(false)}
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
        
        <MenuModal 
          isOpen={isMenuModalOpen}
          onClose={() => setIsMenuModalOpen(false)}
          menu={currentMenu}
        />
        
        <MenuItemModal 
          isOpen={isMenuItemModalOpen}
          onClose={() => setIsMenuItemModalOpen(false)}
          menuItem={currentMenuItem}
          menus={userData?.restaurant?.menus}
        />
      </>
    );
};

export default Dashboard;