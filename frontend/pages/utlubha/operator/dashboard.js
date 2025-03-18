import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js'; 
import Layout from '@/components/Layout';
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
  NumberDecrementStepper, useColorModeValue, Grid, GridItem,
  Stack, Card, CardBody, CardHeader, CardFooter, useDisclosure,
  Tag, TagLabel, TagLeftIcon, Progress, Stat, StatLabel, StatNumber,
  StatHelpText, StatArrow, StatGroup, Tooltip, Menu, MenuButton,
  MenuList, MenuItem
} from '@chakra-ui/react';

import { IoIosColorFill } from "react-icons/io";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
  PieChart, Pie, ResponsiveContainer, Cell
} from 'recharts';

import {
  FiLogOut, FiPlus, FiEdit, FiTrash, FiMenu, FiGrid, FiList,
  FiCheck, FiPackage, FiArrowRight, FiSettings, FiDownload,
  FiSun, FiClock, FiX, FiCreditCard, FiTrendingUp, FiMoon,
  FiUser, FiPrinter, FiMaximize2, FiDollarSign, FiShoppingCart,
  FiCheckCircle, FiMinimize2, FiMessageSquare, FiRefreshCw,
  FiActivity, FiFilter, FiCalendar, FiAlertCircle, FiMoreVertical, 
  FiSearch, FiBell, FiEye, FiSend, FiPhone, FiInfo, FiMapPin
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

// Helper function to get order status color
const getOrderStatusColor = (status) => {
  switch(status) {
    case 'pending': return 'yellow';
    case 'preparing': return 'blue';
    case 'ready': return 'orange';
    case 'completed': return 'green';
    case 'cancelled': return 'red';
    default: return 'gray';
  }
};

// Helper to get order property safely
const getOrderProperty = (order, property) => {
  if (!order) return null;
  return order.attributes?.[property] || order[property];
};

// Helper function to format timestamp
const formatTime = (timestamp) => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return 'Unknown time';
  }
};

// Helper function to format date
const formatDate = (timestamp) => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  } catch (e) {
    return 'Unknown date';
  }
};

// Normalize order data structure
const normalizeOrderData = (orders) => {
  return orders.map(order => {
    // If the order already has attributes, return it as-is
    if (order.attributes) return order;

    // Otherwise, restructure it to have attributes
    return {
      id: order.id,
      attributes: { ...order }
    };
  });
};

// Responsive card component
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

// Order message component
const OrderMessages = ({ order, operatorData }) => {
  const { t } = useTranslation('common');
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Function to load messages
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

  // Filter orders based on selected filter
const filteredOrders = () => {
  let filtered = [...orders];
  
  // Apply status filter
  if (orderFilter === 'active') {
    filtered = filtered.filter(order => 
      ['pending', 'preparing', 'ready'].includes(order.attributes?.status)
    );
  } else if (orderFilter !== 'all') {
    filtered = filtered.filter(order => order.attributes?.status === orderFilter);
  }
  
  // Apply date filter
  if (dateFilter === 'today') {
    const today = new Date().toDateString();
    filtered = filtered.filter(order => {
      const orderDate = new Date(order.attributes?.createdAt).toDateString();
      return orderDate === today;
    });
  } else if (dateFilter === 'week') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    filtered = filtered.filter(order => {
      const orderDate = new Date(order.attributes?.createdAt);
      return orderDate >= weekAgo;
    });
  } else if (dateFilter === 'month') {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    filtered = filtered.filter(order => {
      const orderDate = new Date(order.attributes?.createdAt);
      return orderDate >= monthAgo;
    });
  }
  
  return filtered;
};

// Get icon for next action button based on status
const getActionIcon = (status) => {
  switch(status) {
    case 'pending': return FiList;
    case 'preparing': return FiClock;
    case 'ready': return FiCheck;
    default: return FiX;
  }
};

// Get color for next action button based on status
const getActionColor = (status) => {
  switch(status) {
    case 'pending': return 'blue';
    case 'preparing': return 'orange';
    case 'ready': return 'green';
    default: return 'red';
  }
};

// Get text for next action button based on status
const getActionText = (status) => {
  switch(status) {
    case 'pending': return t('prepare');
    case 'preparing': return t('ready');
    case 'ready': return t('complete');
    default: return t('cancel');
  }
};

// Handle next action for an order
const handleNextAction = (order) => {
  const status = order.attributes?.status;
  const nextStatus = 
    status === 'pending' ? 'preparing' :
    status === 'preparing' ? 'ready' :
    status === 'ready' ? 'completed' : 'cancelled';
  
  handleUpdateOrderStatus(order.id, nextStatus);
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <Card p={5}>
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="sm" color="gray.500">{title}</Text>
          <Text fontSize="2xl" fontWeight="bold" mt={1}>{value}</Text>
        </Box>
        <Box
          p={3}
          borderRadius="full"
          bg={`${color}Alpha.100`}
          color={color}
        >
          <Icon size={24} />
        </Box>
      </Flex>
    </Card>
  );
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box>
      {/* Messages Container */}
      <Box
        height="200px"
        overflowY="auto"
        p={3}
        borderWidth="1px"
        borderRadius="md"
        bg="gray.50"
        mb={3}
      >
        {isLoading ? (
          <Flex justify="center" align="center" height="100%">
            <Spinner size="sm" />
          </Flex>
        ) : messages.length === 0 ? (
          <Flex justify="center" align="center" height="100%" color="gray.500">
            <Text>{t('noMessages')}</Text>
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
          placeholder={t('typeMessage')}
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
          leftIcon={<FiSend />}
        >
          {t('send')}
        </Button>
      </Flex>
    </Box>
  );
};

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

// Order Details Component
const OrderDetailsView = ({ order, onClose, onUpdateStatus, operatorData }) => {
  const { t } = useTranslation('common');
  
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
          colorScheme={getOrderStatusColor(order.attributes?.status)}
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
        <OrderMessages order={order} operatorData={operatorData} />
      </Box>
    </VStack>
  );
};

// Active Table Component for Dashboard
const ActiveTableCard = ({ table, orders, onViewOrder }) => {
  // Filter active orders for this table
  const activeOrders = orders.filter(order => 
    order.attributes?.tables?.data?.some(t => t.id === table.id) && 
    ['pending', 'preparing', 'ready'].includes(order.attributes?.status)
  );

  const tableName = table.attributes?.name || table.name || 'Unknown Table';
  
  return (
    <Card 
      variant="outline" 
      size="sm"
      boxShadow="sm"
      _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
      transition="all 0.2s"
    >
      <CardHeader pb={2}>
        <Flex justifyContent="space-between" alignItems="center">
          <HStack>
            <Icon as={FiMapPin} color={activeOrders.length > 0 ? "red.500" : "green.500"} />
            <Heading size="md">{tableName}</Heading>
          </HStack>
          <Badge colorScheme={activeOrders.length > 0 ? "red" : "green"}>
            {activeOrders.length > 0 ? `${activeOrders.length} Active` : "Available"}
          </Badge>
        </Flex>
      </CardHeader>
      
      <CardBody py={2}>
        {activeOrders.length > 0 ? (
          <VStack spacing={2} align="stretch">
            {activeOrders.map(order => (
              <Box 
                key={order.id} 
                p={3} 
                borderWidth="1px" 
                borderRadius="md" 
                bg="white"
                cursor="pointer"
                onClick={() => onViewOrder(order)}
                _hover={{ bg: "gray.50" }}
              >
                <HStack justifyContent="space-between">
                  <VStack align="start" spacing={0}>
                    <HStack>
                      <Text fontWeight="bold">Order #{order.id}</Text>
                      <Badge colorScheme={getOrderStatusColor(order.attributes?.status)}>
                        {order.attributes?.status}
                      </Badge>
                    </HStack>
                    <Text fontSize="sm">
                      {order.attributes?.customer_profile?.data?.attributes?.fullName || 
                       order.attributes?.guest_info?.name || 'Guest'}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {formatTime(order.attributes?.createdAt)} - ${order.attributes?.total || '0.00'}
                    </Text>
                  </VStack>
                  <Icon as={FiEye} />
                </HStack>
              </Box>
            ))}
          </VStack>
        ) : (
          <Text color="gray.500" textAlign="center" py={4}>No active orders</Text>
        )}
      </CardBody>
    </Card>
  );
};

// Main Dashboard Component
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
  const [selectedTable, setSelectedTable] = useState(null);
  const toast = useToast();
  
  // Order details drawer state
  const {
    isOpen: isOrderDetailsOpen,
    onOpen: openOrderDetails,
    onClose: closeOrderDetails
  } = useDisclosure();

  // Table details drawer state
  const {
    isOpen: isTableDetailsOpen,
    onOpen: openTableDetails,
    onClose: closeTableDetails
  } = useDisclosure();
  
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

  // Filters and view options
  const [orderFilter, setOrderFilter] = useState('active'); // 'active', 'all', 'completed', 'cancelled'
  const [dateFilter, setDateFilter] = useState('today'); // 'today', 'week', 'month', 'all'
  const [tableView, setTableView] = useState('grid'); // 'grid', 'list'

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

      // Continuing the checkAuth function
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


const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
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
    
    if (!data || !data.data) {
      console.warn('No orders data in response');
      setOrders([]);
      return [];
    }
    
    // Normalize the data structure
    const normalizedOrders = normalizeOrderData(data.data);
    console.log('Normalized orders:', normalizedOrders);
    
    setOrders(normalizedOrders);
    return normalizedOrders;
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

// Main component render
return (
  <>
    <Head>
      <title>{userData?.restaurant?.name || 'Dashboard'} | {t('dashboard')}</title>
    </Head>
    <Layout>
      <Box>
        {/* Dashboard Header */}
        <Box py={4} px={6}>
          <Container maxW="1400px">
            <Flex justify="space-between" align="center">
              <HStack spacing={4}>
                <Avatar 
                  size="md" 
                  name={userData?.restaurant?.name} 
                  src={userData?.restaurant?.logo ? `${BASE_URL}${userData.restaurant.logo.url}` : undefined} 
                />
                <Box>
                  <Heading size="lg">{userData?.restaurant?.name || t('dashboard')}</Heading>
                  <Text color="gray.600" fontSize="sm">{userData?.restaurant?.description || ''}</Text>
                </Box>
              </HStack>
              
              <HStack spacing={4}>
                <Button 
                  leftIcon={<FiRefreshCw />} 
                  variant="outline" 
                  onClick={fetchOrders}
                  size="sm"
                >
                  {t('refresh')}
                </Button>
                <Menu>
                  <MenuButton 
                    as={IconButton} 
                    icon={<FiSettings />} 
                    variant="outline" 
                    aria-label="Settings"
                  />
                  <MenuList>
                    <MenuItem icon={<FiUser />}>{t('profile')}</MenuItem>
                    <MenuItem icon={<IoIosColorFill />} onClick={() => setIsColorModalOpen(true)}>
                      {t('customizeQR')}
                    </MenuItem>
                    <MenuItem icon={<FiLogOut />} onClick={handleLogout}>{t('logout')}</MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            </Flex>
          </Container>
        </Box>
        
        {/* Main Dashboard Content */}
        <Container maxW="1400px" py={6}>
          {isLoading ? (
            <Flex justify="center" align="center" h="50vh">
              <Spinner size="xl" />
            </Flex>
          ) : !userData?.restaurant ? (
            <Card p={8} textAlign="center">
              <VStack spacing={4}>
                <Icon as={FiSettings} boxSize={12} color="blue.500" />
                <Heading size="md">{t('noRestaurant')}</Heading>
                <Text>{t('createRestaurantDesc')}</Text>
                <Button 
                  leftIcon={<FiPlus />}
                  colorScheme="blue"
                  onClick={() => router.push('/utlubha/operator/create-page')}
                >
                  {t('createRestaurant')}
                </Button>
              </VStack>
            </Card>
          ) : (
            <>
              {/* Dashboard Overview Stats */}
              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={6}>
                <StatCard 
                  title={t('activeOrders')}
                  value={orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.attributes?.status)).length}
                  icon={FiActivity}
                  color="red.500"
                />
                <StatCard 
                  title={t('todaysOrders')}
                  value={orders.filter(o => {
                    const date = new Date(o.attributes?.createdAt);
                    const today = new Date();
                    return date.toDateString() === today.toDateString();
                  }).length}
                  icon={FiCalendar}
                  color="blue.500"
                />
                <StatCard 
                  title={t('completedToday')}
                  value={orders.filter(o => {
                    const date = new Date(o.attributes?.createdAt);
                    const today = new Date();
                    return date.toDateString() === today.toDateString() && 
                           o.attributes?.status === 'completed';
                  }).length}
                  icon={FiCheckCircle}
                  color="green.500"
                />
                <StatCard 
                  title={t('totalRevenue')}
                  value={`$${orders.reduce((sum, order) => sum + parseFloat(order.attributes?.total || 0), 0).toFixed(2)}`}
                  icon={FiDollarSign}
                  color="purple.500"
                />
              </SimpleGrid>
              
              {/* Main Dashboard Grid */}
              <Grid 
                templateColumns={{ base: '1fr', lg: '1fr 300px' }}
                gap={6}
              >
                {/* Left Column - Tables with Orders */}
                <GridItem>
                  <Card p={4} mb={6}>
                    <CardHeader pb={2}>
                      <Flex justify="space-between" align="center">
                        <Heading size="md">{t('activeTables')}</Heading>
                        <HStack>
                          <IconButton
                            icon={tableView === 'grid' ? <FiList /> : <FiGrid />}
                            aria-label="Toggle view"
                            size="sm"
                            variant="ghost"
                            onClick={() => setTableView(tableView === 'grid' ? 'list' : 'grid')}
                          />
                          <Button
                            leftIcon={<FiPlus />}
                            size="sm"
                            colorScheme="blue"
                            onClick={() => handleAddTable()}
                          >
                            {t('addTable')}
                          </Button>
                        </HStack>
                      </Flex>
                    </CardHeader>
                    
                    <CardBody>
                      {userData.restaurant.tables?.length === 0 ? (
                        <Box textAlign="center" py={8}>
                          <Icon as={FiMapPin} boxSize={12} color="gray.300" mb={4} />
                          <Heading size="md" mb={2}>{t('noTables')}</Heading>
                          <Text mb={4}>{t('addTableDesc')}</Text>
                          <Button 
                            leftIcon={<FiPlus />}
                            colorScheme="blue"
                            onClick={() => handleAddTable()}
                          >
                            {t('addFirstTable')}
                          </Button>
                        </Box>
                      ) : (
                        <SimpleGrid 
                          columns={{ base: 1, md: tableView === 'grid' ? 2 : 1 }} 
                          spacing={4}
                        >
                          {userData.restaurant.tables.map(table => (
                            <ActiveTableCard
                              key={table.id}
                              table={table}
                              orders={orders}
                              onViewOrder={(order) => {
                                setSelectedOrder(order);
                                openOrderDetails();
                              }}
                            />
                          ))}
                        </SimpleGrid>
                      )}
                    </CardBody>
                  </Card>
                  
                  {/* Recent Orders */}
                  <Card p={4}>
                    <CardHeader pb={2}>
                      <Flex justify="space-between" align="center">
                        <Heading size="md">{t('recentOrders')}</Heading>
                        <HStack>
                          <Select 
                            size="sm"
                            width="140px"
                            value={orderFilter}
                            onChange={(e) => setOrderFilter(e.target.value)}
                          >
                            <option value="active">{t('activeOnly')}</option>
                            <option value="all">{t('allOrders')}</option>
                            <option value="completed">{t('completed')}</option>
                            <option value="cancelled">{t('cancelled')}</option>
                          </Select>
                        </HStack>
                      </Flex>
                    </CardHeader>
                    
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        {filteredOrders().length === 0 ? (
                          <Box textAlign="center" py={6}>
                            <Text color="gray.500">{t('noOrdersFound')}</Text>
                          </Box>
                        ) : (
                          filteredOrders().slice(0, 10).map(order => (
                            <Box 
                              key={order.id}
                              p={4}
                              borderWidth="1px"
                              borderRadius="lg"
                              _hover={{ bg: "gray.50", transform: "translateY(-2px)" }}
                              transition="all 0.2s"
                              cursor="pointer"
                              onClick={() => {
                                setSelectedOrder(order);
                                openOrderDetails();
                              }}
                            >
                              <Flex justify="space-between">
                                <Box>
                                  <HStack mb={1}>
                                    <Text fontWeight="bold">Order #{order.id}</Text>
                                    <Badge colorScheme={getOrderStatusColor(order.attributes?.status)}>
                                      {order.attributes?.status}
                                    </Badge>
                                  </HStack>
                                  <Text fontSize="sm">
                                    {order.attributes?.customer_profile?.data?.attributes?.fullName || 
                                     order.attributes?.guest_info?.name || 'Guest'}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    {formatDate(order.attributes?.createdAt)} {formatTime(order.attributes?.createdAt)}
                                  </Text>
                                  <Text fontSize="sm" mt={1}>
                                    Table: {order.attributes?.tables?.data?.[0]?.attributes?.name || 'N/A'}
                                  </Text>
                                </Box>
                                <VStack align="flex-end" justify="space-between">
                                  <Text fontWeight="bold" fontSize="lg">
                                    ${order.attributes?.total || '0.00'}
                                  </Text>
                                  <HStack>
                                    {['pending', 'preparing', 'ready'].includes(order.attributes?.status) && (
                                      <Button 
                                        size="xs" 
                                        leftIcon={getActionIcon(order.attributes?.status)} 
                                        colorScheme={getActionColor(order.attributes?.status)}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleNextAction(order);
                                        }}
                                      >
                                        {getActionText(order.attributes?.status)}
                                      </Button>
                                    )}
                                  </HStack>
                                </VStack>
                              </Flex>
                            </Box>
                          ))
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
                
                {/* Right Column - Analytics Summary */}
                <GridItem display={{ base: 'none', lg: 'block' }}>
                  <Card p={4} mb={6}>
                    <CardHeader pb={2}>
                      <Heading size="md">{t('todaySummary')}</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        {/* Order Status Distribution */}
                        <Box>
                          <Text fontWeight="medium" mb={2}>{t('orderStatus')}</Text>
                          <Box height="200px">
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
                                  outerRadius={70}
                                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                </Pie>
                                <RechartsTooltip formatter={(value) => [`${value} orders`, null]} />
                              </PieChart>
                            </ResponsiveContainer>
                          </Box>
                        </Box>
                        
                        {/* Quick Access */}
                        <Box>
                          <Text fontWeight="medium" mb={2}>{t('quickAccess')}</Text>
                          <VStack spacing={2} align="stretch">
                            <Button 
                              leftIcon={<FiPlus />} 
                              justifyContent="flex-start" 
                              variant="outline"
                              onClick={() => handleAdd('menu')}
                            >
                              {t('addMenu')}
                            </Button>
                            <Button 
                              leftIcon={<FiPlus />} 
                              justifyContent="flex-start" 
                              variant="outline"
                              onClick={() => handleAdd('menuItem')}
                            >
                              {t('addMenuItem')}
                            </Button>
                            <Button 
                              leftIcon={<FiPlus />} 
                              justifyContent="flex-start" 
                              variant="outline"
                              onClick={() => handleAddTable()}
                            >
                              {t('addTable')}
                            </Button>
                            <Button 
                              leftIcon={<FiTrendingUp />} 
                              justifyContent="flex-start" 
                              variant="outline"
                              onClick={() => document.querySelector('[aria-controls="tab-4-tabpanel"]').click()}
                            >
                              {t('viewAnalytics')}
                            </Button>
                          </VStack>
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>
                  
                  {/* Subscription Info */}
                  <Card p={4}>
                    <CardHeader pb={2}>
                      <Heading size="md">{t('subscriptionInfo')}</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Flex justify="space-between">
                          <Text>{t('plan')}:</Text>
                          <Badge colorScheme={userData.restaurant.subscription.tier === 'premium' ? 'purple' : 'blue'}>
                            {userData.restaurant.subscription.tier}
                          </Badge>
                        </Flex>
                        <Flex justify="space-between">
                          <Text>{t('status')}:</Text>
                          <Badge colorScheme={userData.restaurant.subscription.status === 'active' ? 'green' : 'red'}>
                            {userData.restaurant.subscription.status}
                          </Badge>
                        </Flex>
                        <Flex justify="space-between">
                          <Text>{t('monthlyFee')}:</Text>
                          <Text>${userData.restaurant.subscription.monthly_fee}</Text>
                        </Flex>
                        
                        {userData.restaurant.subscription.tier !== 'premium' && (
                          <Button 
                            colorScheme="purple" 
                            leftIcon={<FiArrowRight />}
                            size="sm"
                            onClick={() => handleUpgradeSubscription('premium')}
                          >
                            {t('upgradeToPremium')}
                          </Button>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </>
          )}
        </Container>
      </Box>
    </Layout>
    
    {/* Order Details Drawer */}
    <Drawer 
      isOpen={isOrderDetailsOpen} 
      placement="right" 
      onClose={closeOrderDetails} 
      size="md"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{t('orderDetails')}</DrawerHeader>
        
        <DrawerBody>
          {selectedOrder && (
            <OrderDetailsView 
              order={selectedOrder}
              onClose={closeOrderDetails}
              onUpdateStatus={handleUpdateOrderStatus}
              operatorData={operatorData}
            />
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
        BASE_URL={BASE_URL}
      />
    )}
    
    {isMenuModalOpen && (
      <MenuModal 
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        userData={userData}
        menuForm={menuForm}
        setMenuForm={setMenuForm}
        checkAuth={checkAuth}
        BASE_URL={BASE_URL}
        toast={toast}
      />
    )}
    
    {isMenuItemModalOpen && (
      <MenuItemModal 
        isOpen={isMenuItemModalOpen}
        onClose={() => setIsMenuItemModalOpen(false)}
        userData={userData}
        menuItemForm={menuItemForm}
        setMenuItemForm={setMenuItemForm}
        checkAuth={checkAuth}
        BASE_URL={BASE_URL}
        toast={toast}
      />
    )}
  </>
);
}

export default Dashboard;