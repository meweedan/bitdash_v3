import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import Head from 'next/head';
import { QRCodeCanvas } from 'qrcode.react';

// Chakra UI components
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Flex,
  Switch,
  SimpleGrid,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  useToast,
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
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react';

// Icon imports
import { mdiCheckCircle } from '@mdi/js';
import { IoIosColorFill } from 'react-icons/io';
import {
  FiLogOut,
  FiPlus,
  FiEdit,
  FiTrash,
  FiMenu,
  FiGrid,
  FiList,
  FiCheck,
  FiPackage,
  FiArrowRight,
  FiSettings,
  FiDownload,
  FiSun,
  FiClock,
  FiX,
  FiCreditCard,
  FiTrendingUp,
  FiMoon,
  FiUser
} from 'react-icons/fi';

// Layout and other custom components
import Layout from '@/components/Layout';
import OperatorMessages from '@/components/OperatorMessages';
import SubscriptionInfo from '@/components/SubscriptionInfo';
import AnalyticsTab from '@/components/utlubha/operator/AnalyticsTab';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Default userData structure
      initialUserData: {
        restaurant: {
          id: null,
          name: '',
          description: '',
          tables: [],
          menus: [],
          subscription: { tier: 'standard', status: 'active' }
        }
      }
    }
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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const toast = useToast();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Modal states for color, menu, and menu item
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);

  // For menu modals (create/edit)
  const [currentMenu, setCurrentMenu] = useState(null);
  const [menuForm, setMenuForm] = useState({ name: '', description: '' });

  // For menu item modals (create/edit)
  const [currentMenuItem, setCurrentMenuItem] = useState(null);
  const [menuItemForm, setMenuItemForm] = useState({ 
    name: '', 
    description: '', 
    price: 0, 
    category: '', 
    menuId: null 
  });

  // Colors and QR settings
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

  // Update colors/settings when userData.restaurant changes
  useEffect(() => {
    if (userData?.restaurant) {
      if (userData.restaurant.custom_colors) {
        setSelectedColors(prev => ({ ...prev, ...userData.restaurant.custom_colors }));
      }
      if (userData.restaurant.qr_settings) {
        setQrSettings(prev => ({ ...prev, ...userData.restaurant.qr_settings }));
      }
    }
  }, [userData?.restaurant?.custom_colors, userData?.restaurant?.qr_settings]);

  // -------------------------
  // DATA FETCHING (checkAuth)
  // -------------------------
  const checkAuth = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      // Fetch user data
      const userRes = await fetch(`${BASE_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!userRes.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userResult = await userRes.json();
      console.log('User data:', userResult);

      // Fetch operator data with all required relationships
      const operatorRes = await fetch(
        `${BASE_URL}/api/operators?filters[users_permissions_user][id]=${userResult.id}&populate[restaurant][populate][]=logo&populate[restaurant][populate][]=tables&populate[restaurant][populate][]=menus&populate[restaurant][populate][]=menus.menu_items&populate[subscription][fields][]=tier&populate[subscription][fields][]=status&populate[subscription][fields][]=commission_rate&populate[subscription][fields][]=monthly_fee&populate[subscription][fields][]=start_date&populate[subscription][fields][]=end_date&populate[restaurant][populate][]=custom_colors&populate[restaurant][populate][]=qr_settings`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (!operatorRes.ok) {
        throw new Error('Failed to fetch operator data');
      }
      const operatorResult = await operatorRes.json();
      console.log('Operator data:', operatorResult);

      if (operatorResult.data && operatorResult.data.length > 0) {
        const operator = operatorResult.data[0];
        setOperatorData(operator);
        const restaurant = operator.attributes?.restaurant?.data;
        const subscription = operator.attributes?.subscription?.data;
        const processedRestaurant = {
          id: restaurant.id,
          name: restaurant.attributes?.name || '',
          description: restaurant.attributes?.description || '',
          custom_colors: restaurant.attributes?.custom_colors || null,
          qr_settings: restaurant.attributes?.qr_settings || null,
          logo: restaurant.attributes?.logo?.data || null,
          tables: restaurant.attributes?.tables?.data || [],
          menus: restaurant.attributes?.menus?.data || []
        };
        if (subscription) {
          processedRestaurant.subscription = {
            id: subscription.id,
            tier: subscription.attributes?.tier || 'standard',
            status: subscription.attributes?.status || 'active',
            commission_rate: subscription.attributes?.commission_rate || 0,
            monthly_fee: subscription.attributes?.monthly_fee || 0,
            start_date: subscription.attributes?.start_date,
            end_date: subscription.attributes?.end_date
          };
        } else {
          processedRestaurant.subscription = { tier: 'standard', status: 'active' };
        }
        setUserData({ restaurant: processedRestaurant });
        await fetchOrders(processedRestaurant.id, token);
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

  const fetchOrders = async (restaurantId, token) => {
    if (!restaurantId) return;
    try {
      const ordersRes = await fetch(
        `${BASE_URL}/api/orders?filters[restaurant][id]=${restaurantId}&populate=*`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (!ordersRes.ok) {
        throw new Error('Failed to fetch orders');
      }
      const ordersData = await ordersRes.json();
      setOrders(ordersData.data || []);
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

  // -------------------------
  // MODALS
  // -------------------------
  // Color Customization Modal
  const ColorCustomizationModal = ({ isOpen, onClose }) => {
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
        onClose();
      } catch (error) {
        toast({
          title: t('error'),
          description: error.message,
          status: 'error'
        });
      }
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl" motionPreset="slideInBottom">
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
              <Box borderWidth="1px" borderRadius="md" p={4} w="100%" shadow="sm">
                <Heading size="sm" mb={4}>QR Code Settings</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>QR Code Color</FormLabel>
                    <Input
                      type="color"
                      value={selectedColors.qrForeground}
                      onChange={(e) =>
                        setSelectedColors(prev => ({ ...prev, qrForeground: e.target.value }))
                      }
                      h="40px"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>QR Background Color</FormLabel>
                    <Input
                      type="color"
                      value={selectedColors.qrBackground}
                      onChange={(e) =>
                        setSelectedColors(prev => ({ ...prev, qrBackground: e.target.value }))
                      }
                      h="40px"
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>
              <Box borderWidth="1px" borderRadius="md" p={4} w="100%" shadow="sm">
                <Heading size="sm" mb={4}>Display Settings</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">Show Restaurant Logo</FormLabel>
                    <Switch
                      isChecked={qrSettings.showLogo}
                      onChange={(e) =>
                        setQrSettings(prev => ({ ...prev, showLogo: e.target.checked }))
                      }
                    />
                  </FormControl>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">Show Restaurant Name</FormLabel>
                    <Switch
                      isChecked={qrSettings.showName}
                      onChange={(e) =>
                        setQrSettings(prev => ({ ...prev, showName: e.target.checked }))
                      }
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>
              <Box borderWidth="1px" borderRadius="md" p={4} w="100%" shadow="sm">
                <Heading size="sm" mb={4}>Card Colors</Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Primary Color</FormLabel>
                    <Input
                      type="color"
                      value={selectedColors.primary}
                      onChange={(e) =>
                        setSelectedColors(prev => ({ ...prev, primary: e.target.value }))
                      }
                      h="40px"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Secondary Color</FormLabel>
                    <Input
                      type="color"
                      value={selectedColors.secondary}
                      onChange={(e) =>
                        setSelectedColors(prev => ({ ...prev, secondary: e.target.value }))
                      }
                      h="40px"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Accent Color</FormLabel>
                    <Input
                      type="color"
                      value={selectedColors.accent}
                      onChange={(e) =>
                        setSelectedColors(prev => ({ ...prev, accent: e.target.value }))
                      }
                      h="40px"
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>
              <Box borderWidth="1px" borderRadius="md" p={4} w="100%" shadow="sm">
                <Heading size="sm" mb={4}>Live Preview</Heading>
                <Box p={4} borderRadius="md" display="flex" justifyContent="center">
                  <QRCodeCard
                    tableName="Preview"
                    qrValue="https://preview.example.com"
                    isDarkMode={false}
                    restaurantName={userData?.restaurant?.name || 'Restaurant Name'}
                    customColors={selectedColors}
                    showLogo={qrSettings.showLogo}
                    showName={qrSettings.showName}
                    logoUrl={
                      userData?.restaurant?.logo
                        ? `${BASE_URL}${userData.restaurant.logo.url}`
                        : null
                    }
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
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  // Menu Modal (for creating/editing menus)
  const MenuModal = ({ isOpen, onClose, menu }) => {
    const isEditing = !!menu;
    useEffect(() => {
      if (menu) {
        setMenuForm({
          name: menu.attributes?.name || menu.name || '',
          description: menu.attributes?.description || menu.description || ''
        });
        setCurrentMenu(menu);
      } else {
        setMenuForm({ name: '', description: '' });
        setCurrentMenu(null);
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
        await checkAuth();
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
                onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                placeholder="Enter menu name"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={menuForm.description}
                onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                placeholder="Enter menu description"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  // Menu Item Modal (for creating/editing menu items)
  const MenuItemModal = ({ isOpen, onClose, menuItem, menus }) => {
    const isEditing = !!menuItem;
    useEffect(() => {
      if (menuItem) {
        setMenuItemForm({
          name: menuItem.attributes?.name || menuItem.name || '',
          description: menuItem.attributes?.description || menuItem.description || '',
          price: menuItem.attributes?.price || menuItem.price || 0,
          category: menuItem.attributes?.category || menuItem.category || '',
          menuId: menuItem.attributes?.menus?.data?.id || menuItem.menus?.id || null
        });
        setCurrentMenuItem(menuItem);
      } else {
        const defaultMenuId = menus && menus.length > 0 ? menus[0].id : null;
        setMenuItemForm({ name: '', description: '', price: 0, category: '', menuId: defaultMenuId });
        setCurrentMenuItem(null);
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
            menus: menuItemForm.menuId
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
        if (!response.ok) {
          throw new Error(`Failed to ${isEditing ? 'update' : 'create'} menu item`);
        }
        toast({
          title: 'Success',
          description: `Menu item ${isEditing ? 'updated' : 'created'} successfully`,
          status: 'success',
          duration: 2000
        });
        onClose();
        await checkAuth();
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
          <ModalHeader>{isEditing ? 'Edit Menu Item' : 'Create Menu Item'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Item Name</FormLabel>
                <Input
                  value={menuItemForm.name}
                  onChange={(e) => setMenuItemForm({ ...menuItemForm, name: e.target.value })}
                  placeholder="Enter item name"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={menuItemForm.description}
                  onChange={(e) => setMenuItemForm({ ...menuItemForm, description: e.target.value })}
                  placeholder="Enter item description"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Price</FormLabel>
                <NumberInput
                  value={menuItemForm.price}
                  onChange={(value) => setMenuItemForm({ ...menuItemForm, price: value })}
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
                  onChange={(e) => setMenuItemForm({ ...menuItemForm, category: e.target.value })}
                  placeholder="Enter category"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Menu</FormLabel>
                <Select
                  value={menuItemForm.menuId || ''}
                  onChange={(e) => setMenuItemForm({ ...menuItemForm, menuId: e.target.value })}
                >
                  <option value="">Select a menu</option>
                  {menus &&
                    menus.map(menu => (
                      <option key={menu.id} value={menu.id}>
                        {menu.attributes?.name || menu.name}
                      </option>
                    ))}
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit} isDisabled={!menuItemForm.name || !menuItemForm.menuId}>
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  // -------------------------
  // QRCodeCard Component
  // -------------------------
  const QRCodeCard = ({ tableName, qrValue, isDarkMode, restaurantName, customColors = null, showLogo = true, showName = true, logoUrl = null }) => {
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
        <Text fontSize="xs" textAlign="center" fontWeight="bold" color={customColors?.accent || (isDarkMode ? 'white' : 'black')}>
          Powered by Utlubha
        </Text>
        <Flex height="calc(100% - 60px)" width="100%" position="relative" justifyContent="flex-end" alignItems="center" style={{ direction: 'ltr' }}>
          {showName && (
            <Box position="absolute" left="0" maxWidth="calc(100% - 35mm)">
              <Text fontSize="sm" color="whiteAlpha.800" letterSpacing="wide" noOfLines={1} style={{ direction: 'ltr' }}>
                {restaurantName}
              </Text>
            </Box>
          )}
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
              style={{ width: '100%', height: '100%' }}
            />
          </Box>
        </Flex>
        <Flex position="absolute" bottom="15px" left="15px" right="15px" justifyContent="space-between" alignItems="flex-end" style={{ direction: 'ltr' }}>
          <Text fontSize="3xl" fontWeight="bold" color={customColors?.accent || 'white'} letterSpacing="wide">
            {tableName}
          </Text>
          {showLogo && logoUrl && (
            <Box width="12mm" height="8mm" position="relative" overflow="hidden" display="flex" alignItems="center" justifyContent="center">
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

  // -------------------------
  // Order and Table Handlers
  // -------------------------
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: { status: newStatus.toLowerCase() } })
      });
      if (!response.ok) throw new Error('Failed to update order status');
      await fetchOrders(userData.restaurant.id, token);
      toast({
        title: t('success'),
        description: t('orderUpdated'),
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

  const handleViewOrderDetails = order => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
    setIsOrderDetailsOpen(false);
  };

  // Consolidated handleAdd for different types
  const handleAdd = type => {
    switch (type) {
      case 'restaurant':
        router.push('/utlubha/operator/create-page');
        break;
      case 'menu':
        setCurrentMenu(null);
        setMenuForm({ name: '', description: '' });
        setIsMenuModalOpen(true);
        break;
      case 'menuItem':
        const defaultMenuId =
          userData?.restaurant?.menus && userData.restaurant.menus.length > 0
            ? userData.restaurant.menus[0].id
            : null;
        setCurrentMenuItem(null);
        setMenuItemForm({ name: '', description: '', price: 0, category: '', menuId: defaultMenuId });
        setIsMenuItemModalOpen(true);
        break;
      case 'table':
        handleAddTable();
        break;
      default:
        break;
    }
  };

  // Table creation and update functions (assumed similar to your original logic)
  const handleAddTable = async () => {
    const subscriptionTier = userData?.restaurant?.subscription?.tier || 'standard';
    const existingTableCount = userData?.restaurant?.tables?.length || 0;
    if (subscriptionTier === 'standard' && existingTableCount >= 5) {
      toast({
        title: 'Upgrade Required',
        description: 'You have reached the maximum number of tables for the standard subscription.',
        status: 'warning',
        duration: 5000,
        render: () => (
          <Box p={3} borderRadius="md">
            <Flex align="center" justify="space-between">
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">Upgrade to Premium</Text>
                <Text fontSize="sm">Unlock unlimited table creation</Text>
              </VStack>
              <Button size="sm" onClick={() => handleUpgradeSubscription('premium')}>
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
            color: subscriptionTier === 'premium' ? getRandomTableColor() : '#3182CE'
          }
        })
      });
      if (!response.ok) throw new Error('Failed to create table');
      await checkAuth();
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

  const getRandomTableColor = () => {
    const colors = ['#3182CE', '#48BB78', '#ED64A6', '#F6AD55', '#667EEA', '#38B2AC', '#9F7AEA'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleUpdateTable = async (tableId, currentName) => {
    if (!tableId) {
      toast({ title: t('error'), description: 'Invalid table ID', status: 'error', duration: 3000 });
      return;
    }
    const newName = prompt(t('enterNewTableName'), currentName);
    if (!newName || newName.trim() === '' || newName.trim() === currentName) return;
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/tables/${tableId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: { name: newName.trim() } })
      });
      if (!response.ok) throw new Error('Failed to update table');
      await checkAuth();
      toast({
        title: t('tableUpdated'),
        description: `Table renamed to "${newName}"`,
        status: 'success',
        duration: 2000
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: error.message || 'Failed to update table. Please try again.',
        status: 'error',
        duration: 3000
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
      switch (type) {
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
        const errData = await response.json();
        throw new Error(errData?.error?.message || `Failed to delete ${type}`);
      }
      await checkAuth();
      toast({
        title: t('success'),
        description: t(`${type}Deleted`),
        status: 'success',
        duration: 2000
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({ title: t('error'), description: error.message, status: 'error', duration: 3000 });
    }
  };

  const handleUpgradeSubscription = async newTier => {
    try {
      const token = localStorage.getItem('token');
      const stripeEndpoint = `${BASE_URL}/api/stripe/create-checkout-session`;
      const response = await fetch(stripeEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ planId: newTier, restaurantId: userData.restaurant.id })
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || 'Failed to create checkout session');
      }
      const data = await response.json();
      if (!data.sessionId) throw new Error('No session ID returned from Stripe');
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (error) throw error;
    } catch (error) {
      toast({ title: 'Error', description: error.message || 'Failed to process subscription upgrade', status: 'error', duration: 3000 });
    }
  };

  // -------------------------
  // Render Section
  // -------------------------
  useEffect(() => {
    checkAuth();
  }, []);

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
        <Box position="center">
          <Container maxW="1200px">
            <Box maxW="1500px" mx="auto" p={8} backdropFilter="blur(20px)">
              <VStack spacing={8} align="stretch">
                {/* Header */}
                <Flex justify="space-between" align="center">
                  <HStack spacing={4}>
                    <Avatar
                      size="md"
                      name={userData?.restaurant?.name}
                      src={userData?.restaurant?.logo ? `${BASE_URL}${userData.restaurant.logo.url}` : undefined}
                    />
                    <VStack align="start" spacing={0}>
                      <Heading size="lg">{userData?.restaurant?.name || t('dashboard')}</Heading>
                      {operatorData && (
                        <HStack>
                          <Icon as={FiUser} color="gray.500" />
                          <Text fontSize="sm" color="gray.500">
                            {operatorData.attributes?.fullName || "Operator"} ({operatorData.attributes?.operatorType || "standard"})
                          </Text>
                        </HStack>
                      )}
                    </VStack>
                  </HStack>
                  <ResponsiveIconButton icon={FiLogOut} label={t('logout')} onClick={handleLogout} />
                </Flex>

                {/* Restaurant Info */}
                {userData?.restaurant ? (
                  <Box>
                    <Text>{userData.restaurant.description || t('noDescription')}</Text>
                  </Box>
                ) : (
                  <Box>
                    <VStack spacing={4} align="center" py={8}>
                      <Icon as={FiSettings} boxSize={12} />
                      <Text>{t('noRestaurant')}</Text>
                      <ResponsiveIconButton icon={FiPlus} label={t('createRestaurant')} onClick={() => handleAdd('restaurant')} colorScheme="blue" />
                    </VStack>
                  </Box>
                )}

                {/* Main Tabs */}
                <Tabs isFitted variant="enclosed">
                  <TabList mb="1em">
                    <Tab>
                      <Icon as={FiGrid} display={{ base: 'block', md: 'none' }} />
                      <Text display={{ base: 'none', md: 'block' }}>{t('tables')}</Text>
                    </Tab>
                    <Tab>
                      <Icon as={FiMenu} display={{ base: 'block', md: 'none' }} />
                      <Text display={{ base: 'none', md: 'block' }}>{t('menus')}</Text>
                    </Tab>
                    <Tab>
                      <Icon as={FiPackage} display={{ base: 'block', md: 'none' }} />
                      <Text display={{ base: 'none', md: 'block' }}>{t('menuItems')}</Text>
                    </Tab>
                    <Tab>
                      <Icon as={FiList} display={{ base: 'block', md: 'none' }} />
                      <Text display={{ base: 'none', md: 'block' }}>{t('orders')}</Text>
                    </Tab>
                    <Tab>
                      <Icon as={FiTrendingUp} display={{ base: 'block', md: 'none' }} />
                      <Text display={{ base: 'none', md: 'block' }}>{t('analytics')}</Text>
                    </Tab>
                    <Tab>
                      <Icon as={FiCreditCard} display={{ base: 'block', md: 'none' }} />
                      <Text display={{ base: 'none', md: 'block' }}>{t('subscription')}</Text>
                    </Tab>
                  </TabList>
                  <TabPanels>
                    {/* Tables Tab */}
                    <TabPanel>
                      {/* Insert your table rendering logic here */}
                      <Text>Table functionality goes here.</Text>
                    </TabPanel>
                    {/* Menus Tab */}
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        <Flex justify="space-between" align="center">
                          <Heading size="md">{t('menus')}</Heading>
                          <Button
                            leftIcon={<FiPlus />}
                            colorScheme="green"
                            onClick={() => {
                              setCurrentMenu(null);
                              setMenuForm({ name: '', description: '' });
                              setIsMenuModalOpen(true);
                            }}
                          >
                            {t('addMenu')}
                          </Button>
                        </Flex>
                        {(!userData.restaurant.menus || userData.restaurant.menus.length === 0) ? (
                          <DashboardCard>
                            <VStack spacing={4} align="center" py={8}>
                              <Icon as={FiMenu} boxSize={12} />
                              <Text>{t('noMenus')}</Text>
                              <ResponsiveIconButton icon={FiPlus} label={t('createMenu')} onClick={() => handleAdd('menu')} colorScheme="blue" />
                            </VStack>
                          </DashboardCard>
                        ) : (
                          <VStack spacing={4} align="stretch">
                            {userData.restaurant.menus.map(menu => (
                              <DashboardCard key={menu.id}>
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
                          <Heading size="md">{t('menuItems')}</Heading>
                          <ResponsiveIconButton
                            icon={FiPlus}
                            label={t('addMenuItem')}
                            onClick={() => handleAdd('menuItem')}
                            colorScheme="green"
                            isDisabled={!userData?.restaurant?.menus?.length}
                          />
                        </Flex>
                        {(!userData?.restaurant?.menus?.length) ? (
                          <DashboardCard>
                            <VStack spacing={4} align="center" py={8}>
                              <Icon as={FiPackage} boxSize={12} />
                              <Text>{t('noMenu')}</Text>
                              <ResponsiveIconButton
                                icon={FiPlus}
                                label={t('createMenu')}
                                onClick={() => handleAdd('menu')}
                                colorScheme="blue"
                              />
                            </VStack>
                          </DashboardCard>
                        ) : (
                          userData.restaurant.menus.map(menu => {
                            const menuItems = menu.menu_items || [];
                            return (
                              <Box key={menu.id}>
                                <Heading as="h4" size="md" mb={4}>
                                  {menu.attributes?.name || menu.name}
                                </Heading>
                                {(!menuItems.length) ? (
                                  <DashboardCard>
                                    <VStack spacing={4} align="center" py={8}>
                                      <Icon as={FiPackage} boxSize={12} />
                                      <Text>{t('noMenuItems')}</Text>
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
                                    {menuItems.map(item => (
                                      <DashboardCard key={item.id}>
                                        <Flex justify="space-between" align="center">
                                          <Box>
                                            <Heading as="h4" size="sm">
                                              {item.attributes?.name || item.name}
                                            </Heading>
                                            <Text fontSize="sm">
                                              {item.attributes?.description || item.description}
                                            </Text>
                                            <HStack spacing={2} mt={2}>
                                              <Badge>
                                                {item.attributes?.category || item.category || 'Uncategorized'}
                                              </Badge>
                                              <Badge>
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
                          <Heading size="md">{t('orders')}</Heading>
                        </Flex>
                        {(!userData?.restaurant) ? (
                          <DashboardCard>
                            <VStack spacing={4} align="center" py={8}>
                              <Icon as={FiMenu} boxSize={12} />
                              <Text>{t('noRestaurant')}</Text>
                            </VStack>
                          </DashboardCard>
                        ) : orders.length === 0 ? (
                          <DashboardCard>
                            <VStack spacing={4} align="center" py={8}>
                              <Icon as={FiMenu} boxSize={12} />
                              <Text>{t('noOrders')}</Text>
                            </VStack>
                          </DashboardCard>
                        ) : (
                          <VStack spacing={4} align="stretch">
                            {orders.map(order => (
                              <Flex key={order.id} direction="row" align="stretch">
                                <DashboardCard flex="1">
                                  <VStack spacing={4} align="stretch">
                                    <Heading as="h4" size="sm">{t('order')} #{order.id}</Heading>
                                    {order.attributes?.customer_profile ? (
                                      <VStack align="start" spacing={0} mt={1}>
                                        <Text fontSize="sm">
                                          Customer: {order.attributes.customer_profile.data?.attributes?.fullName || "Guest"}
                                        </Text>
                                        <Text fontSize="sm">
                                          Phone: {order.attributes.customer_profile.data?.attributes?.phone || "N/A"}
                                        </Text>
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
                                      <Badge>{order.attributes?.payment_method || 'N/A'}</Badge>
                                      <Badge colorScheme="green">{`$${order.attributes?.total || '0.00'}`}</Badge>
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
                      <AnalyticsTab orders={orders} subscription={userData?.restaurant?.subscription || { tier: 'standard', status: 'active' }} dir="ltr" />
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
                                variant="outline"
                                leftIcon={<FiArrowRight />}
                                onClick={() =>
                                  handleUpgradeSubscription(
                                    userData.restaurant.subscription.tier === 'standard' ? 'premium' : 'standard'
                                  )
                                }
                              >
                                {userData.restaurant.subscription.tier === 'standard'
                                  ? 'Upgrade to Premium'
                                  : 'Downgrade to Standard'}
                              </Button>
                              {userData.restaurant.subscription.status === 'active' && (
                                <Button variant="solid" onClick={handleCancelSubscription}>
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
                <Drawer isOpen={isOrderDetailsOpen} placement="right" onClose={handleCloseOrderDetails} size="md">
                  <DrawerOverlay />
                  <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>{t('orderDetails')}</DrawerHeader>
                    <DrawerBody>
                      {selectedOrder && (
                        <VStack spacing={4} align="stretch">
                          <Heading size="md">Order #{selectedOrder.id}</Heading>
                          {selectedOrder.attributes?.guest_info && (
                            <Box>
                              <Text fontWeight="bold">Guest Information:</Text>
                              <Text>Name: {selectedOrder.attributes.guest_info.name}</Text>
                              <Text>Phone: {selectedOrder.attributes.guest_info.phone}</Text>
                            </Box>
                          )}
                          <Box>
                            <Text fontWeight="bold">Table:</Text>
                            <Text>{selectedOrder.attributes?.tables?.data?.[0]?.attributes?.name || 'No table'}</Text>
                          </Box>
                          <Box>
                            <Text fontWeight="bold">Items:</Text>
                            {selectedOrder.attributes?.order_items?.data?.map((item, index) => (
                              <Box key={index} p={2} borderWidth="1px" borderRadius="md" mt={2}>
                                <HStack justify="space-between">
                                  <VStack align="start">
                                    <Text fontWeight="medium">{item.attributes.menu_item.data.attributes.name}</Text>
                                    <Text fontSize="sm">${item.attributes.unit_price} x {item.attributes.quantity}</Text>
                                  </VStack>
                                  <Text fontWeight="bold">${item.attributes.subtotal}</Text>
                                </HStack>
                              </Box>
                            ))}
                          </Box>
                          <Divider />
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
                              <Badge>{selectedOrder.attributes?.status}</Badge>
                            </HStack>
                          </Box>
                          <Box>
                            <Text fontWeight="bold">Order Time:</Text>
                            <Text>{new Date(selectedOrder.attributes?.createdAt).toLocaleString()}</Text>
                          </Box>
                          {selectedOrder.id && <OperatorMessages orderId={selectedOrder.id} />}
                        </VStack>
                      )}
                    </DrawerBody>
                  </DrawerContent>
                </Drawer>
              </VStack>
            </Box>
          </Container>
        </Box>
      </Layout>

      {/* Modals */}
      <ColorCustomizationModal isOpen={isColorModalOpen} onClose={() => setIsColorModalOpen(false)} />
      <MenuModal isOpen={isMenuModalOpen} onClose={() => setIsMenuModalOpen(false)} menu={currentMenu} />
      <MenuItemModal isOpen={isMenuItemModalOpen} onClose={() => setIsMenuItemModalOpen(false)} menuItem={currentMenuItem} menus={userData?.restaurant?.menus} />
    </>
  );
};

// Responsive Icon Button component
const ResponsiveIconButton = ({ icon: IconComponent, label, onClick, colorScheme = 'blue', size = 'md', variant = 'solid', isDisabled = false, iconsOnly = false }) => (
  <Button
    onClick={onClick}
    colorScheme={colorScheme}
    size={size}
    variant={variant}
    isDisabled={isDisabled}
    minW={iconsOnly ? '40px' : undefined}
    w={iconsOnly ? '40px' : undefined}
    p={iconsOnly ? '0' : undefined}
  >
    <IconComponent />
    {!iconsOnly && <Text display={{ base: 'none', md: 'inline' }} ml={{ md: 2 }}>{label}</Text>}
  </Button>
);

// Dashboard Card using framer-motion for animations
const DashboardCard = motion(({ children, ...props }) => (
  <Box p={6} backdropFilter="blur(10px)" transition="all 0.2s" _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }} {...props}>
    {children}
  </Box>
));

export default Dashboard;
