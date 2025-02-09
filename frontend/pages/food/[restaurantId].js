import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Box,
  Container,
  VStack,
  Text,
  Heading,
  SimpleGrid,
  Spinner,
  useToast,
  Image,
  Badge,
  Button,
  HStack,
  Icon,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerFooter,
  DrawerContent,
  DrawerCloseButton,
  DrawerOverlay,
  useDisclosure,
  Select,
  Textarea,
  Radio,
  RadioGroup,
  Stack,
  IconButton,
  Input,
  useBreakpointValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { FiDollarSign, FiShoppingCart, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { api } from '@/services/api';
import LoginForm from '@/components/LoginForm';
import UserInfo from '@/components/UserInfo';
import Head from 'next/head';

const MenuPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { restaurantId } = router.query;
  const [categorizedMenuItems, setCategorizedMenuItems] = useState({});
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderIdempotencyKey] = useState(() => crypto.randomUUID());
  const [categories, setCategories] = useState([]);
  const showButtonText = useBreakpointValue({ base: false, md: true });
  const [restaurantData, setRestaurantData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [customerNotes, setCustomerNotes] = useState('');
  const [tables, setTables] = useState([]);
  const [isGuest, setIsGuest] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const pendingCart = localStorage.getItem('pendingCart');
    if (pendingCart) {
      const parsedCart = JSON.parse(pendingCart);
      cartDispatch({ type: 'RESTORE_CART', payload: parsedCart });
      if (parsedCart.table) setSelectedTable(parsedCart.table);
      if (parsedCart.paymentMethod) setPaymentMethod(parsedCart.paymentMethod);
      if (parsedCart.notes) setCustomerNotes(parsedCart.notes);
      onOpen();
    }
  }, []);

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurantAndMenuData();
      cartDispatch({ type: 'SET_RESTAURANT', payload: Number(restaurantId) });
    }
  }, [restaurantId]);

  const fetchRestaurantAndMenuData = async () => {
  setLoading(true);
  try {
    const response = await api.get(`/api/restaurants/${restaurantId}/public-menu`);
    
    const { data } = response.data;
    const { attributes } = data;

    // Set restaurant data
    setRestaurantData({
      id: data.id,
      name: attributes.name,
      description: attributes.description,
      logo: attributes.logo?.data?.attributes ?? null,
    });

    // Handle tables
    if (attributes.tables?.data) {
      const availableTables = attributes.tables.data
        .map(table => ({
          id: table.id,
          ...table.attributes
        }))
        .filter(table => table.status === 'Available');
      setTables(availableTables);
    }

    // Get menus data
    const menus = attributes.menus?.data ?? [];

    // Get all menu items from all menus
    const allItems = menus.reduce((acc, menu) => {
      const menuItems = menu.attributes.menu_items?.data ?? [];
      const formattedItems = menuItems.map(item => ({
        id: item.id,
        name: item.attributes.name,
        description: item.attributes.description,
        price: item.attributes.price,
        category: item.attributes.category,
        image: item.attributes.image?.data?.attributes ?? null,
        menuId: menu.id,
        menuName: menu.attributes.name
      }));
      return [...acc, ...formattedItems];
    }, []);

    // Set all menu items
    setAllMenuItems(allItems);

    // First, organize by menu
    const menuOrganized = allItems.reduce((acc, item) => {
      const menuName = item.menuName;
      if (!acc[menuName]) {
        acc[menuName] = [];
      }
      acc[menuName].push(item);
      return acc;
    }, {});

    // Then within each menu, organize by category
    const categorized = Object.entries(menuOrganized).reduce((menuAcc, [menuName, menuItems]) => {
      menuAcc[menuName] = menuItems.reduce((catAcc, item) => {
        const category = item.category || 'Other';
        if (!catAcc[category]) {
          catAcc[category] = [];
        }
        catAcc[category].push(item);
        return catAcc;
      }, {});
      return menuAcc;
    }, {});

    setCategorizedMenuItems(categorized);
    setCategories(Object.keys(menuOrganized));
    setMenuItems(allItems);

  } catch (error) {
    console.error('Fetch error:', error);
    toast({
      title: t('error'),
      description: t('failedToLoadMenu'),
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  } finally {
    setLoading(false);
  }
};

const handleAuthSuccess = async (userData) => {
  try {
    setShowAuthForm(false);
    setIsGuest(false);
    
    // Small delay to ensure token is properly set
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Proceed with checkout
    await handleCheckout();
  } catch (error) {
    console.error('Auth success handler error:', error);
    toast({
      title: t('error'),
      description: error.message || t('checkoutError'),
      status: 'error',
      duration: 5000,
    });
  }
};

const createCustomerProfile = async (userId, token) => {
    try {
      const response = await api.post('/api/customer-profiles', 
        {
          data: {
            user: userId,
            name: formData.email.split('@')[0], // Use email username as name
            email: formData.email
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating customer profile:', error);
      throw error;
    }
  };

// Update the handleCheckout function in MenuPage
const handleCheckout = async () => {
  if (!selectedTable) {
    toast({
      title: t('error'),
      description: t('pleaseSelectTable'),
      status: 'error',
      duration: 3000,
    });
    return;
  }

  if (isSubmitting) {
    return; // Prevent duplicate submissions
  }

  try {
    setIsSubmitting(true);

    const formattedPaymentMethod = paymentMethod.charAt(0).toUpperCase() + 
                               paymentMethod.slice(1).toLowerCase();

    // Create order items array with correct menu_item connections
    const orderItemsData = cartState.items.map(item => ({
      menu_item: { connect: [item.id] },
      quantity: item.quantity,
      unit_price: Number(item.price),
      subtotal: Number(item.price * item.quantity),
      special_instructions: item.notes || '',
      status: 'pending'
    }));

    const orderData = {
      data: {
        status: 'pending',
        restaurant: Number(restaurantId),
        total: Number(cartState.total),
        payment_method: formattedPaymentMethod,
        amount_deducted_from_credit: formattedPaymentMethod === 'Credit' ? Number(cartState.total) : 0,
        notes: customerNotes || '',
        tables: { connect: [Number(selectedTable)] },
        order_items: orderItemsData,
        idempotency_key: orderIdempotencyKey, // Add idempotency key
        order_timestamp: new Date().toISOString()
      }
    };

    // Handle customer profile or guest info
    if (!isGuest) {
      const customerProfileStr = localStorage.getItem('customerProfile');
      if (customerProfileStr) {
        const profile = JSON.parse(customerProfileStr);
        orderData.data.customer_profile = { connect: [profile.id] };
      }
    } else {
      if (!guestName || !guestPhone) {
        toast({
          title: t('error'),
          description: t('guestInfoRequired'),
          status: 'error',
          duration: 3000,
        });
        setIsSubmitting(false);
        return;
      }
      orderData.data.guest_info = {
        name: guestName,
        phone: guestPhone
      };
    }

    // Add headers for idempotency
    const headers = {
      'X-Idempotency-Key': orderIdempotencyKey,
    };

    const response = await api.post('/api/orders', orderData, { headers });

    // Success handling
    localStorage.removeItem('pendingCart');
    cartDispatch({ type: 'CLEAR_CART' });
    onClose();

    const orderId = response.data.data.id;

    toast({
      title: t('success'),
      description: t('orderPlaced'),
      status: 'success',
      duration: 3000,
    });

    // Redirect to order tracking
    router.push({
      pathname: `/food/order-tracking/${orderId}`,
      query: isGuest ? { guestName, guestPhone } : {}
    });

  } catch (error) {
    console.error('Order creation error:', error);
    toast({
      title: t('error'),
      description: error.response?.data?.error?.message || t('failedToCreateOrder'),
      status: 'error',
      duration: 5000,
    });
  } finally {
    setIsSubmitting(false);
  }
};

useEffect(() => {
  const checkAuthExpiry = () => {
    const expiryTime = localStorage.getItem('authExpiry');
    if (expiryTime) {
      const expiry = new Date(expiryTime);
      const now = new Date();
      
      if (now > expiry) {
        // Clear auth data if expired
        localStorage.removeItem('jwt');
        localStorage.removeItem('customerProfile');
        localStorage.removeItem('authExpiry');
        setIsGuest(true);
      }
    }
  };

  checkAuthExpiry();
}, []);

  // Cart management functions
  const addToCart = (item) => {
    cartDispatch({
      type: 'ADD_ITEM',
      payload: {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1
      }
    });

    toast({
      title: t('itemAdded'),
      description: `${item.name} ${t('addedToCart')}`,
      status: 'success',
      duration: 2000,
    });
  };

  

  const handleLoginSuccess = async (userData) => {
    try {
      setShowLoginForm(false);
      setIsGuest(false);
      
      // Small delay to ensure token is properly set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Proceed with checkout
      await handleCheckout();
    } catch (error) {
      console.error('Login success handler error:', error);
      toast({
        title: t('error'),
        description: error.message || t('loginError'),
        status: 'error',
        duration: 5000,
      });
    }
  };

  const removeFromCart = (itemId) => {
    cartDispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const updateQuantity = (itemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      cartDispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id: itemId, quantity: newQuantity }
      });
    }
  };

  const updateNotes = (itemId, notes) => {
    cartDispatch({
      type: 'UPDATE_NOTES',
      payload: { id: itemId, notes }
    });
  };

const OrderCheckout = ({ order, operatorId }) => {
  const handlePaymentSuccess = async (payment) => {
    // Update order status
    await updateOrderStatus(order.id, 'paid');
    // Generate receipt
    await generateReceipt(payment.id);
    // Navigate to success page
    router.push(`/payment/success/${payment.id}`);
  };

  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);
    // Handle failure
  };
}

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
          <Spinner size="xl" />
        </Box>
      </Layout>
    );
  }

  return (
    <>
    <Head>
      <title>{t('menu')} </title>
    </Head>
    <Layout> 
      {/* Restaurant Info */}
        <Box as="header" position="sticky" top={0} zIndex={1} py={4} 
        borderWidth="1px"
            borderRadius="lg"
            backdropFilter="blur(40px)"
            backgroundColor="whiteAlpha.200">
              {restaurantData?.logo && (
                <Image
                  src={restaurantData.logo.url.startsWith('http') 
                    ? restaurantData.logo.url 
                    : `${BASE_URL}${restaurantData.logo.url.startsWith('/') ? '' : '/'}${restaurantData.logo.url}`}
                  alt={restaurantData.name}
                  mx="auto"
                  mb={4}
                  maxH="100px"
                  objectFit="contain"
                />
              )}
              <Heading size="lg" textAlign="center">{restaurantData?.name}</Heading>
              <Text mt={2} textAlign="center">
                {restaurantData?.description}
              </Text>
              {cartState.items.length > 0 && (
                <Box mt={4} textAlign="center">
                  <Button
                    colorScheme="blue"
                    size="lg"
                    onClick={onOpen}
                    leftIcon={<Icon as={FiShoppingCart} />}
                  >
                    {cartState.items.length} {t('items')} - ${cartState.total.toFixed(2)}
                  </Button>
                </Box>
              )}
            </Box>

      <Box
        mx="auto"
        p={8}
        borderRadius="xl"
        boxShadow="xl"
        backdropFilter="blur(20px)"
        border="1px solid"
        borderColor="whiteAlpha.200"
      >
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8} align="stretch">
            <Tabs variant="soft-rounded" colorScheme="blue">
              <TabList overflowX="auto" py={2}>
                {categories.map((menuName) => (
                  <Tab key={menuName}>{menuName}</Tab>
                ))}
              </TabList>

              <TabPanels>
  {categories.map((menuName) => (
    <TabPanel key={menuName}>
      {/* Categories within this menu */}
      {Object.entries(categorizedMenuItems[menuName] || {}).map(([category, items]) => (
        <Box key={`${menuName}-${category}`} mb={8}>
          <Heading size="md" mb={4}>{category}</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {items.map((item) => (
              <Box
                key={item.id}
                p={6}
                borderWidth="1px"
                borderRadius="lg"
                backdropFilter="blur(10px)"
                backgroundColor="whiteAlpha.200"
                _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}
              >
                {item.image && (
                  <Image
                    src={item.image.url.startsWith('http') 
                      ? item.image.url 
                      : `${BASE_URL}${item.image.url}`}
                    alt={item.name}
                    mb={4}
                    borderRadius="md"
                    objectFit="cover"
                    w="100%"
                    h="250px"
                  />
                )}
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Heading size="md">{item.name}</Heading>
                    <Text color="gray.600">{item.description}</Text>
                  </Box>
                  <HStack justify="space-between">
                    <Badge colorScheme="green" fontSize="md">
                      <HStack spacing={1}>
                        <Icon as={FiDollarSign} />
                        <Text>{item.price}</Text>
                      </HStack>
                    </Badge>
                    <Button
                      colorScheme="blue"
                      leftIcon={<Icon as={FiPlus} />}
                      onClick={() => addToCart(item)}
                    >
                      {t('addToCart')}
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      ))}
    </TabPanel>
  ))}
</TabPanels>
            </Tabs>
          </VStack>
        </Container>
      </Box>

          {/* Cart Drawer */}
          <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>{t('yourCart')}</DrawerHeader>

              <DrawerBody>
                <VStack spacing={4} align="stretch">
                  
                  {/* Cart items */}
                  {cartState.items.map((item) => (
                    <Box key={item.id} p={4} borderWidth="1px" borderRadius="md">
                      <HStack justify="space-between">
                        <Text fontWeight="bold">{item.name}</Text>
                        <IconButton
                          icon={<FiTrash2 />}
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => removeFromCart(item.id)}
                        />
                      </HStack>
                      <HStack mt={2} justify="space-between">
                        <HStack>
                          <IconButton
                            icon={<FiMinus />}
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity, -1)}
                          />
                          <Text>{item.quantity}</Text>
                          <IconButton
                            icon={<FiPlus />}
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity, 1)}
                          />
                        </HStack>
                        <Text>${(item.price * item.quantity).toFixed(2)}</Text>
                      </HStack>
                      <Textarea
                        mt={2}
                        placeholder={t('specialInstructions')}
                        value={item.notes || ''}
                        onChange={(e) => updateNotes(item.id, e.target.value)}
                        size="sm"
                      />
                    </Box>
                  ))}
                  {/* Checkout section */}
                  <Box mt={4}>
                    <Select
                      placeholder={t('selectTable')}
                      value={selectedTable}
                      onChange={(e) => setSelectedTable(e.target.value)}
                      mb={4}
                    >
                      {tables.map((table) => (
                        <option key={table.id} value={table.id}>
                          {table.name}
                        </option>
                      ))}
                    </Select>

                    {/* Payment method selection */}
                    <RadioGroup 
                      value={paymentMethod} 
                      onChange={setPaymentMethod} 
                      mb={4}
                    >
                      <Stack>
                        <Radio value="cash">{t('cash')}</Radio>
                        {/* <Radio value="card">{t('card')}</Radio>
                        {!isGuest && <Radio value="credit">{t('credit')}</Radio>} */}
                      </Stack>
                    </RadioGroup>
                        {/* Authentication/Guest section */}
                  {!localStorage.getItem('jwt') && !showLoginForm && !isGuest ? (
                    <HStack spacing={4} mb={4}>
                      <Button
                        flex={1}
                        onClick={() => {
                          setShowLoginForm(true);
                          setIsGuest(false);
                        }}
                      >
                        {t('login')}
                      </Button>
                      <Button
                        flex={1}
                        variant="outline"
                        onClick={() => {
                          setIsGuest(true);
                          setShowLoginForm(false);
                        }}
                      >
                        {t('continueAsGuest')}
                      </Button>
                    </HStack>
                  ) : (
                    !showLoginForm && (
                      <UserInfo 
                        onLogout={() => {
                          localStorage.removeItem('jwt');
                          localStorage.removeItem('user');
                          localStorage.removeItem('customerProfile');
                          localStorage.removeItem('authExpiry');
                          setIsGuest(true);
                          toast({
                            title: t('success'),
                            description: t('logoutSuccess'),
                            status: 'success',
                            duration: 2000,
                          });
                        }}
                        showDetails={true}
                      />
                    )
                  )}

                  {/* Login form */}
                  {showLoginForm && (
                    <Box mb={4}>
                      <LoginForm
                        onSuccess={handleLoginSuccess}
                        onClose={() => setShowLoginForm(false)}
                      />
                    </Box>
                  )}

                  {/* Guest info form */}
                  {isGuest && (
                    <VStack spacing={4} align="stretch" mb={4}>
                      <Input
                        placeholder={t('guestName')}
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        isRequired
                      />
                      <Input
                        placeholder={t('guestPhone')}
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        isRequired
                      />
                    </VStack>
                  )}
                    </Box>
                  </VStack>
                </DrawerBody>
              <DrawerFooter borderTopWidth="1px">
                <VStack width="100%" spacing={4}>
                  <HStack justify="space-between" width="100%">
                    <Text fontWeight="bold">{t('total')}:</Text>
                    <Text fontWeight="bold">${cartState.total.toFixed(2)}</Text>
                  </HStack>
                  <Button
                    colorScheme="blue"
                    width="100%"
                    onClick={handleCheckout}
                    isDisabled={
                      cartState.items.length === 0 || 
                      !selectedTable || 
                      (isGuest && (!guestName || !guestPhone))
                    }
                  >
                    {t('checkout')}
                  </Button>
                </VStack>
              </DrawerFooter>
     </DrawerContent>
      </Drawer>
    </Layout>
    </>
  );
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default MenuPage;