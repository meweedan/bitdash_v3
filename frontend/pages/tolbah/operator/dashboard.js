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
    const timeoutId = setTimeout(() => {
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
    }, 100); // Small delay to prevent too many state updates at once
    
    return () => clearTimeout(timeoutId);
  }
}, [userData?.restaurant?.custom_colors, userData?.restaurant?.qr_settings]);

// Update the handler for table actions
const handleTableAction = async (action, tableId, tableName) => {
  try {
    const token = localStorage.getItem('token');
    
    if (action === 'delete') {
      if (!confirm(`Delete table "${tableName}"?`)) {
        return;
      }
      
      const response = await fetch(`${BASE_URL}/api/tables/${tableId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete table');
      }
      
      toast({
        title: 'Success',
        description: 'Table deleted successfully',
        status: 'success',
        duration: 2000
      });
      
      window.location.reload(); // Force reload
    }
    
    if (action === 'edit') {
      const newName = prompt('Enter new table name:', tableName);
      
      if (!newName || newName === tableName) {
        return;
      }
      
      const response = await fetch(`${BASE_URL}/api/tables/${tableId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            name: newName
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update table');
      }
      
      toast({
        title: 'Success',
        description: 'Table updated successfully',
        status: 'success',
        duration: 2000
      });
      
      window.location.reload(); // Force reload
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: error.message,
      status: 'error',
      duration: 3000
    });
  }
};

  // Color Customization Modal
  const ColorCustomizationModal = ({ isOpen, onClose, userData }) => {
    const [colors, setColors] = useState({
      primary: '#3182CE',
      secondary: '#48BB78',
      accent: '#ED64A6'
    });
    
    const handleSave = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!userData.restaurant?.id) {
          toast({
            title: 'Error',
            description: 'Restaurant ID is missing',
            status: 'error',
            duration: 3000
          });
          return;
        }
        
        const response = await fetch(`${BASE_URL}/api/restaurants/${userData.restaurant.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: {
              custom_colors: colors
            }
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to update colors');
        }
        
        toast({
          title: 'Success',
          description: 'Colors updated successfully',
          status: 'success',
          duration: 2000
        });
        
        onClose();
        window.location.reload(); // Force reload to update data
      } catch (error) {
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
          <ModalHeader>Customize Colors</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Primary Color</FormLabel>
              <Input 
                type="color"
                value={colors.primary}
                onChange={(e) => setColors({...colors, primary: e.target.value})}
              />
            </FormControl>
            
            <FormControl mb={4}>
              <FormLabel>Secondary Color</FormLabel>
              <Input 
                type="color"
                value={colors.secondary}
                onChange={(e) => setColors({...colors, secondary: e.target.value})}
              />
            </FormControl>
            
            <FormControl mb={4}>
              <FormLabel>Accent Color</FormLabel>
              <Input 
                type="color"
                value={colors.accent}
                onChange={(e) => setColors({...colors, accent: e.target.value})}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleSave}
            >
              Save Colors
            </Button>
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
        const token = localStorage.getItem('token');
        
        if (!userData.restaurant?.id) {
          toast({
            title: 'Error',
            description: 'Restaurant ID is missing',
            status: 'error',
            duration: 3000
          });
          return;
        }
        
        const body = {
          data: {
            name: menuForm.name,
            description: menuForm.description,
            restaurant: userData.restaurant.id
          }
        };
        
        // For new menu
        const url = `${BASE_URL}/api/menus`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        
        if (!response.ok) {
          throw new Error('Failed to create menu');
        }
        
        toast({
          title: 'Success',
          description: 'Menu created successfully',
          status: 'success',
          duration: 2000
        });
        
        onClose();
        window.location.reload(); // Force reload to update data
      } catch (error) {
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
            <FormControl isRequired mb={4}>
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
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleSubmit}
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
// Update the checkAuth function to correctly extract subscription data from the operator
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
    
    // Then fetch operator data with subscription information
    const operatorResponse = await fetch(
      `${BASE_URL}/api/operators?filters[users_permissions_user][id]=${userData.id}&populate[restaurant][populate][]=logo&populate[restaurant][populate][]=tables&populate[restaurant][populate][]=menus&populate[restaurant][populate][]=menus.menu_items&populate[subscription][fields][]=tier&populate[subscription][fields][]=status&populate[subscription][fields][]=commission_rate&populate[subscription][fields][]=monthly_fee&populate[subscription][fields][]=start_date&populate[subscription][fields][]=end_date&populate[restaurant][populate][]=custom_colors&populate[restaurant][populate][]=qr_settings`,
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
      
      const operator = operatorData.data[0];
      const restaurant = operator.attributes?.restaurant?.data;
      
      // Extract subscription directly from operator
      const subscription = operator.attributes?.subscription?.data;
      console.log("Subscription data:", subscription);
      
      if (restaurant) {
        // Process restaurant data
        const processedRestaurantData = {
          id: restaurant.id,
          name: restaurant.attributes?.name || '',
          description: restaurant.attributes?.description || '',
          custom_colors: restaurant.attributes?.custom_colors || null,
          qr_settings: restaurant.attributes?.qr_settings || null,
          logo: restaurant.attributes?.logo?.data || null,
          tables: restaurant.attributes?.tables?.data || [],
          menus: restaurant.attributes?.menus?.data || []
        };
        
        // Add subscription data if available
        if (subscription) {
          processedRestaurantData.subscription = {
            id: subscription.id,
            tier: subscription.attributes?.tier || 'standard',
            status: subscription.attributes?.status || 'active',
            commission_rate: subscription.attributes?.commission_rate || 0,
            monthly_fee: subscription.attributes?.monthly_fee || 0,
            start_date: subscription.attributes?.start_date,
            end_date: subscription.attributes?.end_date
          };
        } else {
          // Default subscription data if none exists
          processedRestaurantData.subscription = {
            tier: 'standard',
            status: 'active',
            commission_rate: 0,
            monthly_fee: 0
          };
        }
        
        // Set user data with restaurant info and subscription
        setUserData({
          restaurant: processedRestaurantData
        });
        
        // Fetch orders if restaurant exists
        if (restaurant.id) {
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
      router.push('/tolbah/operator/create-page');
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

const handleUpgradeSubscription = async (newTier) => {
  try {
    console.log('Upgrading subscription to:', newTier);
    
    const token = localStorage.getItem('token');
    // Make sure to use the full absolute URL
    const stripeEndpoint = `${BASE_URL}/api/stripe/create-checkout-session`;
    
    console.log('Sending request to:', stripeEndpoint);
    
    const response = await fetch(stripeEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        planId: newTier,
        restaurantId: userData.restaurant.id
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Subscription error response:', errorData);
      throw new Error(errorData.error?.message || 'Failed to create checkout session');
    }
    
    const data = await response.json();
    console.log('Stripe session created:', data);
    
    if (!data.sessionId) {
      throw new Error('No session ID returned from Stripe');
    }

    // Initialize Stripe and redirect to checkout
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
    
    if (error) {
      console.error('Stripe redirect error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Subscription upgrade error:', error);
    toast({
      title: 'Error',
      description: error.message || 'Failed to process subscription upgrade',
      status: 'error',
      duration: 3000
    });
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

      // Ensure we have a valid table name
      const tableName = currentTableName || "Table";
      
      // Prompt for new table name with current name as default
      const newTableName = prompt(t('enterNewTableName'), tableName);
      
      // Check if user canceled or submitted empty name
      if (!newTableName || newTableName.trim() === '') return;
      
      // Check if name didn't change
      if (newTableName.trim() === tableName) return;

      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        // Update the table data
        const updateData = {
          data: {
            name: newTableName.trim()
          }
        };
        
        console.log('Updating table', tableId, 'with name', newTableName);
        
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
          description: `Table renamed to "${newTableName}".`,
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
      try {
        // Get the element to capture
        const element = document.getElementById(`qr-box-${tableName}`);
        if (!element) {
          console.error(`Element with ID "qr-box-${tableName}" not found`);
          toast({
            title: 'Error',
            description: 'Failed to find QR code element',
            status: 'error',
            duration: 3000
          });
          return;
        }

        // Make sure html2canvas is imported properly
        const html2canvas = (await import('html2canvas')).default;
        
        // Capture the element with better settings
        const canvas = await html2canvas(element, {
          scale: 2, // Higher quality but not too high
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: true, // Enable logging for debugging
          onclone: (doc) => {
            // Make sure the element is visible in the cloned document
            const clonedElement = doc.getElementById(`qr-box-${tableName}`);
            if (clonedElement) {
              clonedElement.style.display = 'block';
            }
          }
        });

        // Convert to image data URL
        const image = canvas.toDataURL('image/png');
        
        // Create a simple download link
        const link = document.createElement('a');
        link.href = image;
        link.download = `${tableName}-qrcode.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: 'Success',
          description: 'QR code downloaded successfully',
          status: 'success',
          duration: 2000
        });
      } catch (error) {
        console.error('Error capturing QR code:', error);
        toast({
          title: 'Error',
          description: `Failed to download QR code: ${error.message}`,
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
        backdropFilter="blur(10px)"
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
                  backdropFilter="blur(20px)"
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
                                  variant="tolbah-outline"
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
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            leftIcon={<FiEdit />}
                                            onClick={() => handleTableAction('edit', table.id, table.attributes?.name || table.name)}
                                          >
                                            Edit
                                          </Button>
                                          <Button
                                            size="sm"
                                            colorScheme="red"
                                            variant="outline"
                                            leftIcon={<FiTrash />}
                                            onClick={() => handleTableAction('delete', table.id, table.attributes?.name || table.name)}
                                          >
                                            Delete
                                          </Button>
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
                                          qrValue={`https://tolbah.bitdash.app/tolbah/${userData.restaurant.id}`}
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
                              <Button
                                leftIcon={<FiPlus />}
                                colorScheme="green"
                                onClick={() => {
                                  setCurrentMenu(null);
                                  setMenuForm({ name: '', description: '' });
                                  setIsMenuModalOpen(true);
                                }}
                                isDisabled={!userData?.restaurant}
                              >
                                {t('addMenu')}
                              </Button>
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
                                                    <Badge rounded="full">
                                                      {item.attributes?.category || item.category || 'Uncategorized'}
                                                    </Badge>
                                                    <Badge rounded="full">
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
                                          <Badge rounded="full">
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
                                    variant="tolbah-outline"
                                    leftIcon={<FiArrowRight />}
                                    onClick={() => handleUpgradeSubscription(userData.restaurant.subscription.tier === 'standard' ? 'premium' : 'standard')}
                                  >
                                    {userData.restaurant.subscription.tier === 'standard' ? 'Upgrade to Premium' : 'Downgrade to Standard'}
                                  </Button>
                                  
                                  {userData.restaurant.subscription.status === 'active' && (
                                    <Button 
                                      variant="tolbah-solid"
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