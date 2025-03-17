// frontend/pages/utlubha/operator/dashboard.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js'; 

import Layout from '@/components/Layout';
import OperatorMessages from '@/components/OperatorMessages';
import SubscriptionInfo from '@/components/SubscriptionInfo';
import AnalyticsTab from '@/components/utlubha/operator/AnalyticsTab';
import Head from 'next/head';
import { QRCodeCanvas } from 'qrcode.react';

// Chakra UI imports
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
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, ResponsiveContainer, Cell
} from 'recharts';

import {
  FiLogOut, FiPlus, FiEdit, FiTrash, FiMenu, FiGrid, FiList,
  FiCheck, FiPackage, FiArrowRight, FiSettings, FiDownload,
  FiSun, FiClock, FiX, FiCreditCard, FiTrendingUp, FiMoon,
  FiUser, FiPrinter, FiMaximize2, FiDollarSign, FiShoppingCart,
  FiCheckCircle, FiMinimize2, FiMessageSquare, FiRefreshCw 
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

const OrderDetails = ({ order, onClose, onUpdateStatus, operatorData }) => {
  const { t } = useTranslation('common');
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get base URL from environment variable
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Fetch messages when component mounts or order changes
  useEffect(() => {
    if (order?.id) {
      loadMessages();
    }
  }, [order?.id]);
  
  // Set up message polling
  useEffect(() => {
    if (!order?.id) return;
    
    // Poll for new messages every 10 seconds
    const intervalId = setInterval(loadMessages, 10000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [order?.id]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Load messages function
  const loadMessages = async () => {
    if (!order?.id) return;
    
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${baseUrl}/api/messages?filters[order][id]=${order.id}&sort=timestamp:asc&populate=*`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.data) {
        setMessages(data.data);
      } else {
        console.warn('No messages found for order:', order.id);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: 'Error',
        description: `Failed to load messages: ${error.message}`,
        status: 'error',
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Send message function
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !order?.id) return;
    
    try {
      const token = localStorage.getItem('token');
      
      // Create message data
      const messageData = {
        data: {
          content: newMessage,
          sender_type: 'operator',
          timestamp: new Date().toISOString(),
          order: order.id,
          read: false
        }
      };
      
      // Add operator ID if available
      if (operatorData && operatorData.id) {
        messageData.data.operator = operatorData.id;
      }
      
      // Add optimistic update for better UX
      const tempMessage = {
        id: `temp-${Date.now()}`,
        attributes: {
          content: newMessage,
          sender_type: 'operator',
          timestamp: new Date().toISOString(),
          read: false
        }
      };
      
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');
      
      // Send the actual message
      const response = await fetch(
        `${baseUrl}/api/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(messageData)
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }
      
      // Reload messages to get the real message
      await loadMessages();
      
      toast({
        title: 'Success',
        description: 'Message sent',
        status: 'success',
        duration: 2000
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: `Failed to send message: ${error.message}`,
        status: 'error',
        duration: 3000
      });
      
      // Reload messages to remove the optimistic update
      await loadMessages();
    }
  };
  
  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Unknown time';
    }
  };
  
  if (!order) {
    return (
      <Flex justify="center" align="center" height="100%">
        <Text>No order selected</Text>
      </Flex>
    );
  }
  
  return (
    <VStack spacing={4} align="stretch" h="full">
      {/* Order Header */}
      <Flex justify="space-between" align="center">
        <Heading size="md">Order #{order.id}</Heading>
        <Badge
          colorScheme={
            order.attributes?.status === 'pending' ? 'yellow' :
            order.attributes?.status === 'preparing' ? 'blue' :
            order.attributes?.status === 'ready' ? 'orange' :
            order.attributes?.status === 'completed' ? 'green' : 'red'
          }
          fontSize="sm"
          px={2}
          py={1}
          borderRadius="full"
        >
          {order.attributes?.status}
        </Badge>
      </Flex>
      
      <Divider />
      
      {/* Order Information */}
      <Box bg="gray.50" p={4} borderRadius="md">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Box>
            <Text fontWeight="bold">Customer:</Text>
            <Text>
              {order.attributes?.customer_profile?.data?.attributes?.fullName || 
               order.attributes?.guest_info?.name || 
               'Guest'}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="bold">Contact:</Text>
            <Text>
              {order.attributes?.customer_profile?.data?.attributes?.phone || 
               order.attributes?.guest_info?.phone || 
               'N/A'}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="bold">Table:</Text>
            <Text>
              {order.attributes?.tables?.data?.[0]?.attributes?.name || 'N/A'}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="bold">Payment:</Text>
            <Text>{order.attributes?.payment_method || 'N/A'}</Text>
          </Box>
        </SimpleGrid>
      </Box>
      
      {/* Order Items */}
      <Box>
        <Text fontWeight="bold" mb={2}>Order Items:</Text>
        <VStack spacing={2} align="stretch">
          {order.attributes?.order_items?.data?.map((item, index) => (
            <Box 
              key={index} 
              p={3} 
              borderWidth="1px" 
              borderRadius="md" 
              bg="white"
            >
              <Flex justify="space-between">
                <Box>
                  <Text fontWeight="medium">
                    {item.attributes?.quantity || 1}x {item.attributes?.menu_item?.data?.attributes?.name || 'Unknown Item'}
                  </Text>
                  {item.attributes?.special_instructions && (
                    <Text fontSize="sm" color="gray.600">
                      Note: {item.attributes.special_instructions}
                    </Text>
                  )}
                </Box>
                <Text fontWeight="bold">${item.attributes?.subtotal || '0.00'}</Text>
              </Flex>
            </Box>
          ))}
        </VStack>
        
        <Flex justify="space-between" mt={4} fontWeight="bold">
          <Text>Total:</Text>
          <Text>${order.attributes?.total || '0.00'}</Text>
        </Flex>
      </Box>
      
      <Divider />
      
      {/* Action Buttons */}
      <SimpleGrid columns={2} spacing={4}>
        {order.attributes?.status === 'pending' && (
          <Button 
            colorScheme="blue" 
            onClick={() => onUpdateStatus(order.id, 'preparing')}
            leftIcon={<Icon as={FiList} />}
          >
            Start Preparing
          </Button>
        )}
        {order.attributes?.status === 'preparing' && (
          <Button 
            colorScheme="orange" 
            onClick={() => onUpdateStatus(order.id, 'ready')}
            leftIcon={<Icon as={FiClock} />}
          >
            Mark Ready
          </Button>
        )}
        {order.attributes?.status === 'ready' && (
          <Button 
            colorScheme="green" 
            onClick={() => onUpdateStatus(order.id, 'completed')}
            leftIcon={<Icon as={FiCheck} />}
          >
            Complete
          </Button>
        )}
        {['pending', 'preparing', 'ready'].includes(order.attributes?.status) && (
          <Button 
            colorScheme="red" 
            onClick={() => onUpdateStatus(order.id, 'cancelled')}
            leftIcon={<Icon as={FiX} />}
          >
            Cancel
          </Button>
        )}
      </SimpleGrid>
      
      <Divider />
      
      {/* Messages Section */}
      <Box flex="1">
        <Text fontWeight="bold" mb={2}>Customer Communication:</Text>
        
        {/* Messages List */}
        <Box 
          borderWidth="1px" 
          borderRadius="md" 
          height="200px" 
          overflowY="auto"
          p={3}
          bg="gray.50"
        >
          {isLoading ? (
            <Flex justify="center" align="center" height="100%">
              <Spinner />
            </Flex>
          ) : messages.length === 0 ? (
            <Flex justify="center" align="center" height="100%" color="gray.500">
              <Text>No messages yet</Text>
            </Flex>
          ) : (
            messages.map((message, index) => (
              <Box 
                key={message.id || index}
                mb={2}
                display="flex"
                justifyContent={message.attributes.sender_type === 'operator' ? 'flex-end' : 'flex-start'}
              >
                <Box
                  maxWidth="80%"
                  p={2}
                  borderRadius="md"
                  bg={message.attributes.sender_type === 'operator' ? 'blue.100' : 'gray.200'}
                >
                  <Text fontSize="sm">
                    {message.attributes.content}
                  </Text>
                  <Text fontSize="xs" color="gray.500" textAlign="right">
                    {formatTime(message.attributes.timestamp)}
                  </Text>
                </Box>
              </Box>
            ))
          )}
          <div ref={messagesEndRef} />
        </Box>
        
        {/* Message Input */}
        <Flex mt={2}>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
            mr={2}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button
            colorScheme="blue"
            onClick={handleSendMessage}
            isDisabled={!newMessage.trim()}
          >
            Send
          </Button>
        </Flex>
      </Box>
    </VStack>
  );
};

const Dashboard = ({ initialUserData }) => {
  // State variables
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
  
  // Use ref to store the base URL to avoid re-renders
  const baseUrlRef = useRef(process.env.NEXT_PUBLIC_BACKEND_URL);
  const BASE_URL = baseUrlRef.current;

  // API call tracking ref to prevent concurrent calls
  const isLoadingRef = useRef(false);
  
  // Modal states
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);
  
  // Form states
  const [menuForm, setMenuForm] = useState({ name: '', description: '' });
  const [menuItemForm, setMenuItemForm] = useState({ 
    name: '', 
    description: '', 
    price: 0, 
    category: '',
    menuId: null
  });

  // Color and QR customization states
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

  // Set colors and settings when userData changes
  useEffect(() => {
    if (!userData?.restaurant) return;
    
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
  }, [userData?.restaurant]);

  // Fetch orders when restaurant ID is available
  useEffect(() => {
    if (userData?.restaurant?.id) {
      fetchOrders();
    }
  }, [userData?.restaurant?.id]);

  // Main authentication check and data loading function
  const checkAuth = useCallback(async () => {
    // Prevent concurrent auth checks using ref
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      
      // Fetch user data
      const userResponse = await fetch(`${BASE_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await userResponse.ok ? await userResponse.json() : null;
      
      if (!userData || !userData.id) {
        throw new Error('Invalid user data');
      }
      
      // Fetch operator data with all necessary relationships
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
      
      // Save operator data
      if (operatorData.data && operatorData.data.length > 0) {
        setOperatorData(operatorData.data[0]);
        
        const operator = operatorData.data[0];
        const restaurant = operator.attributes?.restaurant?.data;
        
        // Extract subscription directly from operator
        const subscription = operator.attributes?.subscription?.data;
        
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
            await fetchOrders();
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
        title: t('error'),
        description: error.message || 'Failed to load dashboard',
        status: 'error',
        duration: 5000
      });
      
      setUserData(initialUserData);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [BASE_URL, router, t, toast, initialUserData]);

// Analytics Tab with improved data visualization
const AnalyticsTab = ({ orders, subscription }) => {
  const { t } = useTranslation('common');
  const [timeFrame, setTimeFrame] = useState('weekly');
  const [isExpandedView, setIsExpandedView] = useState(false);
  
  // Function to get appropriate time ranges based on selected timeframe
  const getTimeRanges = () => {
    const now = new Date();
    const periods = [];
    
    if (timeFrame === 'daily') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        periods.push({
          label: date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
          start: new Date(date.setHours(0, 0, 0, 0)),
          end: new Date(date.setHours(23, 59, 59, 999))
        });
      }
    } else if (timeFrame === 'weekly') {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - (i * 7 + 6));
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() - i * 7);
        
        periods.push({
          label: `Week ${4-i}`,
          start: new Date(startDate.setHours(0, 0, 0, 0)),
          end: new Date(endDate.setHours(23, 59, 59, 999))
        });
      }
    } else if (timeFrame === 'monthly') {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        periods.push({
          label: date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }),
          start: new Date(startDate.setHours(0, 0, 0, 0)),
          end: new Date(endDate.setHours(23, 59, 59, 999))
        });
      }
    }
    
    return periods;
  };
  
  // Calculate sales data based on orders and time ranges
  const calculateSalesData = () => {
    const periods = getTimeRanges();
    
    // Calculate sales for each period
    return periods.map(period => {
      const periodOrders = orders.filter(order => {
        const orderDate = new Date(order.attributes?.createdAt);
        return orderDate >= period.start && orderDate <= period.end;
      });
      
      const totalSales = periodOrders.reduce((sum, order) => 
        sum + parseFloat(order.attributes?.total || 0), 0);
      
      const completedOrders = periodOrders.filter(order => 
        order.attributes?.status === 'completed').length;
      
      const cancelledOrders = periodOrders.filter(order => 
        order.attributes?.status === 'cancelled').length;
      
      return {
        period: period.label,
        sales: totalSales.toFixed(2),
        orders: periodOrders.length,
        completed: completedOrders,
        cancelled: cancelledOrders,
        averageOrderValue: periodOrders.length > 0 
          ? (totalSales / periodOrders.length).toFixed(2) 
          : '0.00'
      };
    });
  };
  
  // Generate chart data
  const salesData = calculateSalesData();
  
  // Calculate KPIs
  const calculateKPIs = () => {
    const totalSales = orders.reduce((sum, order) => 
      sum + parseFloat(order.attributes?.total || 0), 0);
    
    const completedOrders = orders.filter(order => 
      order.attributes?.status === 'completed').length;
    
    const averageOrderValue = orders.length > 0 
      ? totalSales / orders.length 
      : 0;
    
    return {
      totalSales: totalSales.toFixed(2),
      orderCount: orders.length,
      completedOrders,
      completionRate: orders.length > 0 
        ? ((completedOrders / orders.length) * 100).toFixed(1) 
        : '0.0',
      averageOrderValue: averageOrderValue.toFixed(2)
    };
  };
  
  const kpis = calculateKPIs();
  
  return (
    <VStack spacing={6} align="stretch">
      <Flex justify="space-between" align="center">
        <Heading size="md">{t('analytics')}</Heading>
        
        <HStack>
          <Select 
            value={timeFrame} 
            onChange={(e) => setTimeFrame(e.target.value)}
            size="sm"
            w="150px"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </Select>
          
          <IconButton
            icon={isExpandedView ? <FiMinimize2 /> : <FiMaximize2 />}
            aria-label="Toggle expanded view"
            size="sm"
            onClick={() => setIsExpandedView(!isExpandedView)}
          />
        </HStack>
      </Flex>
      
      {/* KPI Summary Cards */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
        <StatCard
          label="Total Sales"
          value={`$${kpis.totalSales}`}
          icon={FiDollarSign}
          color="green.500"
        />
        
        <StatCard
          label="Order Count"
          value={kpis.orderCount.toString()}
          icon={FiShoppingCart}
          color="brand.utlubha.500"
        />
        
        <StatCard
          label="Completion Rate"
          value={`${kpis.completionRate}%`}
          icon={FiCheckCircle}
          color="brand.utlubha.500"
        />
        
        <StatCard
          label="Avg. Order Value"
          value={`$${kpis.averageOrderValue}`}
          icon={FiTrendingUp}
          color="brand.utlubha.500"
        />
      </SimpleGrid>
      
      {/* Sales Chart */}
      <Box 
        p={6}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="sm"
        h={isExpandedView ? "400px" : "300px"}
      >
        <Heading size="sm" mb={4}>Sales Trend</Heading>
        <Box h={isExpandedView ? "350px" : "250px"}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="sales" name="Sales ($)" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="orders" name="Order Count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
      
      {/* Order Status Distribution */}
      <Box 
        p={6}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="sm"
      >
        <Heading size="sm" mb={4}>Order Status Distribution</Heading>
        <Flex justify="center" h="250px">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Pending', value: orders.filter(o => o.attributes?.status === 'pending').length, fill: '#F6E05E' },
                  { name: 'Preparing', value: orders.filter(o => o.attributes?.status === 'preparing').length, fill: '#4299E1' },
                  { name: 'Ready', value: orders.filter(o => o.attributes?.status === 'ready').length, fill: '#ED8936' },
                  { name: 'Completed', value: orders.filter(o => o.attributes?.status === 'completed').length, fill: '#48BB78' },
                  { name: 'Cancelled', value: orders.filter(o => o.attributes?.status === 'cancelled').length, fill: '#F56565' }
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
              </Pie>
              <Tooltip formatter={(value) => [`${value} orders`, null]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Flex>
      </Box>
      
      {/* Premium Features Banner (if not on premium) */}
      {subscription?.tier !== 'premium' && (
        <Box
          p={6}
          borderWidth="1px"
          borderRadius="lg"
          bg="purple.50"
          borderColor="purple.200"
        >
          <Flex justify="space-between" align="center">
            <Box>
              <Heading size="sm" mb={2} color="purple.700">
                Upgrade to Premium Analytics
              </Heading>
              <Text fontSize="sm" color="purple.600">
                Get access to advanced analytics, customer insights, and sales forecasting.
              </Text>
            </Box>
            <Button
              colorScheme="purple"
              size="sm"
              onClick={() => handleUpgradeSubscription('premium')}
            >
              Upgrade Now
            </Button>
          </Flex>
        </Box>
      )}
    </VStack>
  );
};

// Stat Card Component for Analytics
const StatCard = ({ label, value, icon: Icon, color }) => {
  return (
    <Box
      p={5}
      borderRadius="lg"
      borderWidth="1px"
      boxShadow="sm"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
    >
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="sm" color="gray.500">{label}</Text>
          <Text fontSize="2xl" fontWeight="bold" mt={1}>{value}</Text>
        </Box>
        <Icon color={color} size={24} />
      </Flex>
    </Box>
  );
};

// OperatorMessages Component (Used in Order Details)
const OperatorMessages = ({ orderId }) => {
  const { t } = useTranslation('common');
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  
  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!orderId) return;
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages?filters[order][id]=${orderId}&sort=timestamp:asc&populate=*`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const data = await response.json();
      setMessages(data.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        status: 'error',
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  }, [orderId, toast]);
  
  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !orderId) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: {
              content: newMessage,
              sender_type: 'operator',
              timestamp: new Date().toISOString(),
              order: orderId,
              read: false
            }
          })
        }
      );
      
      if (!response.ok) throw new Error('Failed to send message');
      
      setNewMessage('');
      fetchMessages();
      
      toast({
        title: 'Success',
        description: 'Message sent successfully',
        status: 'success',
        duration: 2000
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        status: 'error',
        duration: 3000
      });
    }
  };
  
  // Initial fetch and setup message polling
  useEffect(() => {
    if (orderId) {
      fetchMessages();
      
      // Set up polling for new messages
      const intervalId = setInterval(fetchMessages, 15000); // Poll every 15 seconds
      
      return () => clearInterval(intervalId);
    }
  }, [orderId, fetchMessages]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Format timestamp
  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Unknown time';
    }
  };
  
  return (
    <Box>
      <Heading size="sm" mb={2}>
        {t('messages')}
      </Heading>
      
      {/* Messages Container */}
      <Box
        maxH="300px"
        overflowY="auto"
        p={3}
        borderWidth="1px"
        borderRadius="md"
        bg="gray.50"
        mb={3}
      >
        {isLoading ? (
          <Flex justify="center" p={4}>
            <Spinner size="sm" />
          </Flex>
        ) : messages.length === 0 ? (
          <Text color="gray.500" textAlign="center" py={4}>
            {t('noMessages')}
          </Text>
        ) : (
          messages.map((message, index) => (
            <Box 
              key={index}
              mb={2}
              display="flex"
              justifyContent={message.attributes.sender_type === 'operator' ? 'flex-end' : 'flex-start'}
            >
              <Box
                maxWidth="80%"
                p={2}
                borderRadius="md"
                bg={message.attributes.sender_type === 'operator' ? 'blue.100' : 'gray.200'}
              >
                <Text fontSize="sm">
                  {message.attributes.content}
                </Text>
                <Text fontSize="xs" color="gray.500" textAlign="right">
                  {formatTime(message.attributes.timestamp)}
                </Text>
              </Box>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Message Input */}
      <Flex>
        <Input
          placeholder={t('typeMessage')}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          mr={2}
        />
        <Button
          variant="utlubha-outline"
          onClick={handleSendMessage}
          isDisabled={!newMessage.trim()}
        >
          {t('send')}
        </Button>
      </Flex>
    </Box>
  );
}

const TableCard = ({ 
  table,
  orders,
  restaurant,
  onViewDetails,
  onDownloadQR,
  onPrintQR,
  isDarkMode,
  customColors,
  qrSettings,
  baseUrl
}) => {
  // Filter only active orders (pending, preparing, ready) for this table
  const activeOrders = orders.filter(order => 
    order.attributes?.tables?.data?.some(t => t.id === table.id) && 
    ['pending', 'preparing', 'ready'].includes(order.attributes?.status)
  );

  return (
    <DashboardCard>
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
            <Badge colorScheme={activeOrders.length > 0 ? "red" : "green"} mt={1}>
              {activeOrders.length > 0 ? `${activeOrders.length} Active Orders` : "Available"}
            </Badge>
          </Box>
          <HStack spacing={2}>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<FiEdit />}
              onClick={() => onViewDetails('edit', table.id, table.attributes?.name || table.name)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              leftIcon={<FiTrash />}
              onClick={() => onViewDetails('delete', table.id, table.attributes?.name || table.name)}
            >
              Delete
            </Button>
          </HStack>
        </Flex>

        {/* Active Orders Section */}
        {activeOrders.length > 0 && (
          <Box bg="gray.50" p={3} borderRadius="md" mb={2}>
            <Text fontWeight="bold" mb={2}>Active Orders:</Text>
            <VStack align="stretch" spacing={2}>
              {activeOrders.map(order => (
                <Flex key={order.id} justify="space-between" align="center" p={2} bg="white" borderRadius="md" boxShadow="sm">
                  <Box>
                    <Text fontSize="sm" fontWeight="medium">Order #{order.id}</Text>
                    <Badge 
                      colorScheme={
                        order.attributes?.status === 'pending' ? 'yellow' :
                        order.attributes?.status === 'preparing' ? 'blue' : 'orange'
                      }
                      fontSize="xs"
                    >
                      {order.attributes?.status}
                    </Badge>
                  </Box>
                  <HStack>
                    <Button 
                      size="xs" 
                      colorScheme="blue" 
                      leftIcon={<FiMessageSquare />}
                      onClick={() => onViewDetails('messages', order)}
                    >
                      Messages
                    </Button>
                    <Button 
                      size="xs" 
                      variant="outline"
                      onClick={() => onViewDetails('order', order)}
                    >
                      Details
                    </Button>
                  </HStack>
                </Flex>
              ))}
            </VStack>
          </Box>
        )}

        {/* QR Code */}
        <Box 
          display="flex" 
          justifyContent="center" 
          width="100%" 
          py={4}
        >
          <QRCodeCard
            tableName={table.attributes?.name || table.name}
            qrValue={`https://utlubha.bitdash.app/${restaurant.id}/${table.id}`}
            isDarkMode={isDarkMode}
            restaurantName={restaurant.name}
            customColors={customColors}
            showLogo={qrSettings?.showLogo ?? true}
            showName={qrSettings?.showName ?? true}
            logoUrl={restaurant.logo 
              ? `${baseUrl}${restaurant.logo.url}` 
              : null}
          />
        </Box>

        <Flex mt={4} gap={4} justify="center">
          <Button
            onClick={() => onDownloadQR(table.attributes?.name || table.name)}
            leftIcon={<FiDownload />}
            variant="utlubha-outline"
            isFullWidth
          >
            Download QR
          </Button>
          <Button
            onClick={() => onPrintQR(table.attributes?.name || table.name)}
            leftIcon={<FiPrinter />}
            colorScheme="green"
            isFullWidth
          >
            Print QR
          </Button>
        </Flex>
      </VStack>
    </DashboardCard>
  );
};

  // Fetch orders function
  const fetchOrders = async () => {
    if (!userData?.restaurant?.id) return;
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      // Show loading toast for longer operations
      const loadingToast = toast({
        title: t('loading'),
        description: t('fetchingOrders'),
        status: 'info',
        duration: null,
        isClosable: false
      });
      
      // Fetch orders with full relationship data
      const response = await fetch(
        `${BASE_URL}/api/orders?filters[restaurant][id]=${userData.restaurant.id}&populate[tables][populate]=*&populate[order_items][populate][menu_item]=*&populate[customer_profile]=*&populate[messages]=*&sort=createdAt:desc`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Close loading toast
      toast.close(loadingToast);

      if (!response.ok) {
        console.error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
        const errorData = await response.json().catch(() => ({}));
        console.error('Error data:', errorData);
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data = await response.json();
      console.log('Orders data received:', data);
      
      if (!data || !data.data) {
        console.warn('No orders data in response');
        setOrders([]);
        return [];
      }
      
      setOrders(data.data || []);
      return data.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: t('error'),
        description: t('failedToLoadOrders'),
        status: 'error',
        duration: 3000
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Color Customization Modal Component
  const ColorCustomizationModal = React.memo(({ 
    isOpen, 
    onClose, 
    userData, 
    setUserData,
    selectedColors,
    setSelectedColors,
    qrSettings,
    setQrSettings
  }) => {
    // Local state to avoid re-renders
    const [localColors, setLocalColors] = useState(selectedColors);
    const [localSettings, setLocalSettings] = useState(qrSettings);
    
    // Update local state when props change
    useEffect(() => {
      setLocalColors(selectedColors);
      setLocalSettings(qrSettings);
    }, [selectedColors, qrSettings, isOpen]);
    
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
              custom_colors: localColors,
              qr_settings: localSettings
            }
          })
        });

        if (!response.ok) throw new Error('Failed to update customization settings');

        // Update the restaurant data in userData
        setUserData(prev => ({
          ...prev,
          restaurant: {
            ...prev.restaurant,
            custom_colors: localColors,
            qr_settings: localSettings
          }
        }));
        
        // Update parent state
        setSelectedColors(localColors);
        setQrSettings(localSettings);

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
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
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
                      value={localColors.qrForeground}
                      onChange={(e) => setLocalColors(prev => ({
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
                      value={localColors.qrBackground}
                      onChange={(e) => setLocalColors(prev => ({
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
                      isChecked={localSettings.showLogo}
                      onChange={(e) => setLocalSettings(prev => ({
                        ...prev,
                        showLogo: e.target.checked
                      }))}
                    />
                  </FormControl>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">Show Restaurant Name</FormLabel>
                    <Switch 
                      isChecked={localSettings.showName}
                      onChange={(e) => setLocalSettings(prev => ({
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
                      value={localColors.primary}
                      onChange={(e) => setLocalColors(prev => ({
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
                      value={localColors.secondary}
                      onChange={(e) => setLocalColors(prev => ({
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
                      value={localColors.accent}
                      onChange={(e) => setLocalColors(prev => ({
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
                    customColors={localColors}
                    showLogo={localSettings.showLogo}
                    showName={localSettings.showName}
                    logoUrl={userData?.restaurant?.logo ? `${BASE_URL}${userData.restaurant.logo.url}` : null}
                  />
                </Box>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button 
                variant="utlubha-outline"
                leftIcon={<Icon as={FiCheck} />}
                onClick={handleColorChange}
              >
                Save Changes
              </Button>
              <Button 
                variant="ghost" 
                onClick={onClose}
              >
                Cancel
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  });

  // Menu Modal Component
  const MenuModal = React.memo(({ isOpen, onClose }) => {  
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
        
        const response = await fetch(`${BASE_URL}/api/menus`, {
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
        
        // Reset form
        setMenuForm({ name: '', description: '' });
        
        // Close modal
        onClose();
        
        // Refresh data
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
          <ModalHeader>Create Menu</ModalHeader>
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
            <Button variant="utlubha-solid" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="utlubha-outline"
              onClick={handleSubmit}
              isDisabled={!menuForm.name}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  });
  
  // Menu Item Modal Component
  const MenuItemModal = React.memo(({ isOpen, onClose }) => {
    useEffect(() => {
      // Set default menu ID when modal opens
      if (isOpen && userData?.restaurant?.menus?.length > 0 && !menuItemForm.menuId) {
        setMenuItemForm(prev => ({ 
          ...prev, 
          menuId: userData.restaurant.menus[0].id 
        }));
      }
    }, [isOpen, userData?.restaurant?.menus]);
    
    const handleSubmit = async () => {
      try {
        if (!menuItemForm.name || !menuItemForm.menuId) {
          toast({
            title: 'Error',
            description: 'Name and menu selection are required',
            status: 'error',
            duration: 3000
          });
          return;
        }
        
        const token = localStorage.getItem('token');
        const body = {
          data: {
            name: menuItemForm.name,
            description: menuItemForm.description,
            price: parseFloat(menuItemForm.price),
            category: menuItemForm.category,
            menus: menuItemForm.menuId // Using menus as per schema
          }
        };
        
        const response = await fetch(`${BASE_URL}/api/menu-items`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        
        if (!response.ok) throw new Error(`Failed to create menu item: ${response.status}`);
        
        toast({
          title: 'Success',
          description: 'Menu item created successfully',
          status: 'success',
          duration: 2000
        });
        
        // Reset form
        setMenuItemForm({ 
          name: '', 
          description: '', 
          price: 0, 
          category: '',
          menuId: userData?.restaurant?.menus?.[0]?.id || null
        });
        
        // Close modal
        onClose();
        
        // Refresh data
        await checkAuth();
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
          <ModalHeader>Create Menu Item</ModalHeader>
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
                  {userData?.restaurant?.menus && userData.restaurant.menus.map(menu => (
                    <option key={menu.id} value={menu.id}>
                      {menu.attributes?.name || menu.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="utlubha-solid" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="utlubha-outline"
              onClick={handleSubmit}
              isDisabled={!menuItemForm.name || !menuItemForm.menuId}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  });

  // QR Code Card Component
  const QRCodeCard = React.memo(({ 
  tableName,
  qrValue,
  isDarkMode,
  restaurantName,
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
  
  // Ensure the QR code value is clean and valid
  const safeQrValue = qrValue || `https://example.com/${tableName}`;
  const safeTableName = tableName || 'Table';
  
  return (
    <Box 
      id={`qr-box-${safeTableName}`}
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
      {/* Utlubha Brand */}
      <Text 
        fontSize="xs" 
        textAlign="center"
        fontWeight="bold" 
        color={customColors?.accent || (isDarkMode ? 'white' : 'black')}
      >
        Powered by Utlubha
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
            id={`qr-canvas-${safeTableName}`}
            value={safeQrValue}
            size={180}
            level="H" // High error correction for better scanning
            includeMargin={true} // Include margin around QR code for better scanning
            bgColor={customColors?.qrBackground || 'white'}
            fgColor={customColors?.qrForeground || (isDarkMode ? '#111111' : '#1179be')}
            style={{
              width: '100%',
              height: '100%'
            }}
            renderAs="canvas" // Force canvas rendering for better image capture
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
          {safeTableName}
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
              crossOrigin="anonymous" // Important for canvas to capture external images
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
});

  // Handle print QR code
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

  // Handle download QR code
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

    // Show loading toast
    const loadingToastId = toast({
      title: 'Processing',
      description: 'Generating QR code image...',
      status: 'info',
      duration: null,
      isClosable: false
    });

    // Make sure html2canvas is imported properly
    let html2canvas;
    try {
      html2canvas = (await import('html2canvas')).default;
    } catch (error) {
      console.error('Failed to load html2canvas:', error);
      toast.close(loadingToastId);
      toast({
        title: 'Error',
        description: 'Failed to load required libraries',
        status: 'error',
        duration: 3000
      });
      return;
    }
    
    // Capture the element with better settings for QR codes
    const canvas = await html2canvas(element, {
      scale: 3, // Higher quality for QR readability
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      removeContainer: false,
      foreignObjectRendering: false, // Often more reliable for complex layouts
      onclone: (doc) => {
        // Make sure the element is visible in the cloned document
        const clonedElement = doc.getElementById(`qr-box-${tableName}`);
        if (clonedElement) {
          clonedElement.style.display = 'block';
          clonedElement.style.transform = 'none'; // Remove any transforms that might affect rendering
        }
      }
    });

    // Convert to image data URL with high quality
    const image = canvas.toDataURL('image/png', 1.0);
    
    // Close loading toast
    toast.close(loadingToastId);
    
    // Create a simple download link
    const link = document.createElement('a');
    link.href = image;
    link.download = `${tableName.replace(/\s+/g, '-')}-qrcode.png`;
    
    // Append to body, click and remove (standard download approach)
    document.body.appendChild(link);
    
    // Small delay to ensure everything is ready
    setTimeout(() => {
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Success',
        description: 'QR code downloaded successfully',
        status: 'success',
        duration: 2000
      });
    }, 100);
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

  // Handle table actions (create, edit, delete)
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
      }
      
      // Refresh data
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

  // Create a new table
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

  // Get random color for premium tables
  const getRandomTableColor = () => {
    const colors = [
      '#3182CE', // Blue
      '#38A169', // Green
      '#DD6B20', // Orange
      '#805AD5', // Purple
      '#D53F8C', // Pink
      '#718096', // Gray
      '#2B6CB0', // Deep Blue
      '#2C7A7B', // Teal
      '#9F7AEA', // Light Purple
      '#ED64A6'  // Light Pink
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Handle subscription upgrade
  const handleUpgradeSubscription = async (newTier) => {
    try {
      console.log('Upgrading subscription to:', newTier);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/stripe/create-checkout-session`, {
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
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      
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

  // Handle subscription cancellation
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

  // Handle updating order status
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

  // Handle viewing order details
  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  // Handle closing order details
  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
    setIsOrderDetailsOpen(false);
  };

  

  // Handle delete operations
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

  // Handle different actions (add, update, delete)
  const handleAdd = (type) => {
    switch (type) {
      case 'restaurant':
        router.push('/utlubha/operator/create-page');
        break;
      case 'menu':
        // Reset the form first
        setMenuForm({ name: '', description: '' });
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
        setIsMenuItemModalOpen(true);
        break;
      case 'table':
        handleAddTable();
        break;
    }
  };

  const handleUpdate = (type, item) => {
    switch (type) {
      case 'menu':
        // Populate form with menu data
        setMenuForm({
          name: item.attributes?.name || item.name || '',
          description: item.attributes?.description || item.description || ''
        });
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
        setIsMenuItemModalOpen(true);
        break;
      case 'table':
        handleTableAction('edit', item.id, item.attributes?.name || item.name);
        break;
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Load data on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Responsive icon button component
  const ResponsiveIconButton = React.memo(({ 
    icon: Icon, 
    label, 
    onClick, 
    colorScheme = "orange",
    size = "md",
    variant = "utlubha-solid",
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
  ));

  // Dashboard card component
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

  // Render loading spinner if data is loading
  if (isLoading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Spinner size="xl" />
        </Box>
      </Layout>
    );
  }

  // Main component render
  return (
    <>
      <Head>
        <title>{userData?.restaurant?.name || 'Dashboard'} | {t('dashboard')}</title>
      </Head>
      <Layout>
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
              borderColor="whiteAlpha.200"
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
                    <Heading size="lg">
                      {userData?.restaurant?.name || t('dashboard')}
                    </Heading>
                  </HStack>
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
                              variant="outline"
                            />
                            <ResponsiveIconButton
                              icon={FiPlus}
                              label={t('addTable')}
                              onClick={() => handleAdd('table')}
                              isDisabled={!userData?.restaurant}
                            />
                            <Button
                              leftIcon={<FiRefreshCw />}
                              variant="outline"
                              size="sm"
                              onClick={fetchOrders}
                            >
                              Refresh
                            </Button>
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
                                variant="utlubha-solid"
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
                                variant="utlubha-solid"
                              />
                            </VStack>
                          </DashboardCard>
                        ) : (
                          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                            {userData.restaurant.tables.map((table) => (
                              <TableCard
                                key={table.id}
                                table={table}
                                orders={orders}
                                restaurant={userData.restaurant}
                                onViewDetails={(action, id, name) => {
                                  if (action === 'edit' || action === 'delete') {
                                    handleTableAction(action, id, name);
                                  } else if (action === 'order') {
                                    handleViewOrderDetails(id);
                                  } else if (action === 'messages') {
                                    handleViewOrderDetails(id);
                                    // After opening the order details, focus on messages tab if needed
                                  }
                                }}
                                onDownloadQR={captureAndDownload}
                                onPrintQR={handlePrint}
                                isDarkMode={qrDarkMode}
                                customColors={userData.restaurant.custom_colors}
                                qrSettings={userData.restaurant.qr_settings}
                                baseUrl={BASE_URL}
                              />
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
                            onClick={() => handleAdd('menu')}
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
                                variant="utlubha-solid"
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
                                variant="utlubha-solid"
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
                                variant="utlubha-solid"
                              />
                            </VStack>
                          </DashboardCard>
                        ) : (
                          userData.restaurant.menus.map((menu) => {
                            const menuItems = menu.attributes?.menu_items?.data || [];
                            
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
                                        variant="utlubha-solid"
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
                                      colorScheme="blue"
                                    />
                                  )}
                                  {order.attributes?.status === 'preparing' && (
                                    <ResponsiveIconButton
                                      icon={FiClock}
                                      label={t('ready')}
                                      onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                                      colorScheme="orange"
                                    />
                                  )}
                                  {order.attributes?.status === 'ready' && (
                                    <ResponsiveIconButton
                                      icon={FiCheck}
                                      label={t('complete')}
                                      onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
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
                                variant="outline"
                                leftIcon={<FiArrowRight />}
                                onClick={() => handleUpgradeSubscription(userData.restaurant.subscription.tier === 'standard' ? 'premium' : 'standard')}
                              >
                                {userData.restaurant.subscription.tier === 'standard' ? 'Upgrade to Premium' : 'Downgrade to Standard'}
                              </Button>
                              
                              {userData.restaurant.subscription.status === 'active' && (
                                <Button 
                                  variant="solid"
                                  colorScheme="red"
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
                              <Button variant="utlubha-solid" onClick={() => handleUpgradeSubscription('standard')}>
                                Subscribe Now
                              </Button>
                            </VStack>
                          </Box>
                        )}
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </VStack>
            </Box>
          </Container>
        </Box>
      </Layout>
      
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

      {/* Only render modals when they're open to reduce re-renders */}
      {isColorModalOpen && (
        <ColorCustomizationModal 
          isOpen={isColorModalOpen}
          onClose={() => setIsColorModalOpen(false)}
          userData={userData}
          setUserData={setUserData}
          selectedColors={selectedColors}
          setSelectedColors={setSelectedColors}
          qrSettings={qrSettings}
          setQrSettings={setQrSettings}
        />
      )}
      
      {isMenuModalOpen && (
        <MenuModal 
          isOpen={isMenuModalOpen}
          onClose={() => setIsMenuModalOpen(false)}
        />
      )}
      
      {isMenuItemModalOpen && (
        <MenuItemModal 
          isOpen={isMenuItemModalOpen}
          onClose={() => setIsMenuItemModalOpen(false)}
        />
      )}
    </>
  );
};

export default Dashboard;