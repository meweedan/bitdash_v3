// pages/bsoraa/captain/dashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Container,
  Badge,
  Icon,
  Spinner,
  useToast,
  Divider,
  Avatar,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Input,
  useBreakpointValue,
  Switch,
  IconButton,
  Center
} from '@chakra-ui/react';

import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaMotorcycle, 
  FaCheckCircle, 
  FaWallet,
  FaStar,
  FaStore,
  FaUser,
  FaPhone,
  FaDirections,
  FaMap,
  FaList
} from 'react-icons/fa';

import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import HotspotMap from '@/components/utlubha/captain/HotspotMap';
import { useTranslation } from 'next-i18next';

const ORDER_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  PICKED_UP: 'picked_up',
  DELIVERING: 'delivering',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Mobile Components
const MobileHeader = ({ captainData, isOnline, onToggleOnline }) => (
  <Box 
    position="fixed"
    top={0}
    left={0}
    right={0}
    zIndex={1000}
    boxShadow="sm"
    p={4}
  >
    <HStack justify="space-between">
      <HStack spacing={3}>
        <Avatar size="sm" name={captainData?.name} src={captainData?.avatar?.url} />
        <VStack align="start" spacing={0}>
          <Text fontWeight="bold">{captainData?.name}</Text>
          <Text fontSize="xs" color="gray.500">{captainData?.vehicle_type}</Text>
        </VStack>
      </HStack>
      <HStack spacing={3}>
        <Text fontSize="sm" color={isOnline ? "green.500" : "gray.500"}>
          {isOnline ? 'Online' : 'Offline'}
        </Text>
        <Switch 
          isChecked={isOnline} 
          onChange={onToggleOnline}
          colorScheme="green"
        />
      </HStack>
    </HStack>
  </Box>
);

const MobileNav = ({ activeTab, setActiveTab, hasActiveOrder }) => (
  <Box 
    position="fixed"
    bottom={0}
    left={0}
    right={0}
    zIndex={1000}
    boxShadow="0 -2px 10px rgba(0,0,0,0.1)"
    p={2}
  >
    <SimpleGrid columns={4} spacing={2}>
      <NavItem 
        icon={FaMap} 
        label="Map"
        isActive={activeTab === 0}
        onClick={() => setActiveTab(0)}
      />
      <NavItem 
        icon={hasActiveOrder ? FaMotorcycle : FaList} 
        label={hasActiveOrder ? "Active" : "Orders"}
        isActive={activeTab === 1}
        onClick={() => setActiveTab(1)}
      />
      <NavItem 
        icon={FaWallet} 
        label="Earnings"
        isActive={activeTab === 2}
        onClick={() => setActiveTab(2)}
      />
      <NavItem 
        icon={FaUser} 
        label="Profile"
        isActive={activeTab === 3}
        onClick={() => setActiveTab(3)}
      />
    </SimpleGrid>
  </Box>
);

const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
  <VStack 
    spacing={1} 
    py={2}
    color={isActive ? "blue.500" : "gray.500"}
    onClick={onClick}
    cursor="pointer"
    transition="all 0.2s"
    _hover={{ color: "blue.500" }}
  >
    <Icon size={20} />
    <Text fontSize="xs">{label}</Text>
  </VStack>
);

const EarningsView = ({ stats }) => (
  <VStack spacing={4} align="stretch">
    <SimpleGrid columns={2} spacing={4}>
      <StatCard
        title="Today"
        value={`${stats.earnings} LYD`}
        icon={FaWallet}
        color="green.500"
      />
      <StatCard
        title="Deliveries"
        value={stats.deliveries}
        icon={FaMotorcycle}
        color="blue.500"
      />
    </SimpleGrid>
    
    <Box p={4} borderRadius="lg" boxShadow="sm">
      <VStack align="stretch" spacing={3}>
        <Heading size="sm">Recent Earnings</Heading>
        <SimpleGrid columns={2} spacing={4}>
          <Box>
            <Text fontSize="sm">Distance</Text>
            <Text fontWeight="bold">{Math.round(stats.distance)} km</Text>
          </Box>
          <Box>
            <Text fontSize="sm">Online Hours</Text>
            <Text fontWeight="bold">{Math.round(stats.hours * 10) / 10}h</Text>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  </VStack>
);

const ProfileView = ({ captain }) => (
  <VStack spacing={4} align="stretch">
    <Box p={4} borderRadius="lg" boxShadow="sm">
      <VStack spacing={4} align="center">
        <Avatar size="xl" name={captain?.name} src={captain?.avatar?.url} />
        <VStack spacing={1} align="center">
          <Heading size="md">{captain?.name}</Heading>
          <Text>{captain?.vehicle_type}</Text>
          <HStack>
            <Icon as={FaStar} color="yellow.400" />
            <Text fontWeight="bold">{captain?.rating || "5.0"}</Text>
          </HStack>
        </VStack>
      </VStack>
    </Box>
    
    <SimpleGrid columns={2} spacing={4}>
      <Box p={4} borderRadius="lg" boxShadow="sm">
        <VStack align="start">
          <Text fontSize="sm">Total Deliveries</Text>
          <Text fontWeight="bold" fontSize="xl">
            {captain?.total_deliveries || 0}
          </Text>
        </VStack>
      </Box>
      <Box p={4} borderRadius="lg" boxShadow="sm">
        <VStack align="start">
          <Text fontSize="sm">Member Since</Text>
          <Text fontWeight="bold" fontSize="xl">
            {new Date(captain?.createdAt).toLocaleDateString()}
          </Text>
        </VStack>
      </Box>
    </SimpleGrid>
  </VStack>
);

// Card Components
const StatCard = ({ title, value, subtitle, icon: Icon, color, isLoading }) => (
  <Box 
    p={4}
    borderRadius="lg"
    boxShadow="sm"
    position="relative"
    overflow="hidden"
  >
    <HStack spacing={4}>
      <Box
        p={3}
        borderRadius="lg"
      >
        <Icon color={color} size={24} />
      </Box>
      <VStack align="start" spacing={0}>
        <Text fontSize="sm" color="gray.500">{title}</Text>
        <Text fontSize="2xl" fontWeight="bold">
          {isLoading ? <Spinner size="sm" /> : value}
        </Text>
        {subtitle && (
          <Text fontSize="sm" color="gray.500">{subtitle}</Text>
        )}
      </VStack>
    </HStack>
  </Box>
);

const OrderCard = ({ order, onAccept, isMobile }) => (
  <Box
    p={4}
    borderRadius={isMobile ? "md" : "lg"}
    boxShadow="sm"
  >
    <VStack align="stretch" spacing={3}>
      <HStack justify="space-between">
        <HStack>
          <Badge colorScheme="green">{order.total} LYD</Badge>
          <Badge colorScheme="blue">{order.estimated_time} mins</Badge>
        </HStack>
        <Badge colorScheme="yellow">{order.items?.length} items</Badge>
      </HStack>

      <HStack>
        <Icon as={FaStore} color="blue.500" />
        <VStack align="start" spacing={0}>
          <Text fontWeight="medium">{order.restaurant?.name}</Text>
          <Text fontSize="sm" color="gray.500">
            {order.restaurant?.location?.address}
          </Text>
        </VStack>
      </HStack>

      <HStack>
        <Icon as={FaMapMarkerAlt} color="red.500" />
        <VStack align="start" spacing={0}>
          <Text fontWeight="medium">Delivery Location</Text>
          <Text fontSize="sm" color="gray.500">
            {order.delivery_address}
          </Text>
        </VStack>
      </HStack>

      <Button
        colorScheme="blue"
        size="sm"
        onClick={() => onAccept(order)}
        leftIcon={<FaMotorcycle />}
        isFullWidth
      >
        Accept Order • {order.total} LYD
      </Button>
    </VStack>
  </Box>
);

const ActiveOrderCard = ({
  order,
  onUpdateStatus,
  onComplete,
  messages,
  onSendMessage,
  newMessage,
  setNewMessage,
  isSendingMessage,
  isMobile
}) => {
  const statusSteps = [
    { status: ORDER_STATUSES.ACCEPTED, label: 'Accepted', icon: FaCheckCircle },
    { status: ORDER_STATUSES.PICKED_UP, label: 'At Restaurant', icon: FaStore },
    { status: ORDER_STATUSES.DELIVERING, label: 'On the Way', icon: FaMotorcycle },
    { status: ORDER_STATUSES.COMPLETED, label: 'Delivered', icon: FaCheckCircle }
  ];

  const currentStepIndex = statusSteps.findIndex(step => step.status === order.status);

  return (
    <Box
      borderRadius="lg"
      boxShadow="sm"
      overflow="hidden"
    >
      {/* Progress Steps */}
      <Box p={4}>
        <SimpleGrid columns={4} spacing={2}>
          {statusSteps.map((step, index) => (
            <VStack 
              key={step.status}
              spacing={1}
              color={index <= currentStepIndex ? 'blue.500' : 'gray.400'}
            >
              <Icon as={step.icon} boxSize={5} />
              <Text fontSize="xs" textAlign="center">
                {step.label}
              </Text>
            </VStack>
          ))}
        </SimpleGrid>
      </Box>

      {/* Order Details */}
      <VStack p={4} spacing={4} align="stretch">
        <HStack justify="space-between">
          <HStack spacing={4}>
            <VStack align="start" spacing={0}>
              <Text fontSize="sm">Order #</Text>
              <Text fontWeight="bold">{order.id}</Text>
            </VStack>
            <VStack align="start" spacing={0}>
              <Text fontSize="sm">Earnings</Text>
              <Text fontWeight="bold" color="green.500">
                {order.total} LYD
              </Text>
            </VStack>
          </HStack>
          <IconButton
            icon={<FiMessageSquare />}
            variant="ghost"
            colorScheme="blue"
            onClick={() => setIsChatOpen(true)}
          />
        </HStack>

        <Divider />

        {/* Locations */}
        <VStack spacing={4} align="stretch">
          <LocationInfo
            icon={FaStore}
            title="Pickup from"
            name={order.restaurant?.name}
            address={order.restaurant?.location?.address}
            coordinates={order.restaurant?.location}
          />
          <LocationInfo
            icon={FaMapMarkerAlt}
            title="Deliver to"
            name={order.customer_profile?.fullName}
            address={order.delivery_address}
            coordinates={order.customer_profile?.location}
          />
        </VStack>

        {/* Action Buttons */}
        {order.status === ORDER_STATUSES.ACCEPTED && (
          <Button
            colorScheme="blue"
            leftIcon={<FaStore />}
            onClick={() => onUpdateStatus(order.id, ORDER_STATUSES.PICKED_UP)}
            isFullWidth
          >
            Arrived at Restaurant
          </Button>
        )}

        {order.status === ORDER_STATUSES.PICKED_UP && (
          <Button
            colorScheme="orange"
            leftIcon={<FaMotorcycle />}
            onClick={() => onUpdateStatus(order.id, ORDER_STATUSES.DELIVERING)}
            isFullWidth
          >
            Start Delivery
          </Button>
        )}

        {order.status === ORDER_STATUSES.DELIVERING && (
          <Button
            colorScheme="green"
            leftIcon={<FaCheckCircle />}
            onClick={onComplete}
            isFullWidth
          >
            Complete Delivery
          </Button>
        )}

        {/* Contact Buttons */}
        <SimpleGrid columns={2} spacing={4}>
          <Button
            leftIcon={<FiMessageSquare />}
            variant="outline"
            size={isMobile ? "sm" : "md"}
          >
            Message
          </Button>
          <Button
            leftIcon={<FaPhone />}
            variant="outline"
            size={isMobile ? "sm" : "md"}
            onClick={() => window.open(`tel:${order.customer_profile?.phone}`)}
          >
            Call
          </Button>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

const CaptainDashboard = () => {
  const router = useRouter();
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [activeTab, setActiveTab] = useState(0);
  const [isOnline, setIsOnline] = useState(false);
  const [captainData, setCaptainData] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [orderRequests, setOrderRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState({
    earnings: 0,
    deliveries: 0,
    distance: 0,
    hours: 0
  });

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const authenticatedFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      throw new Error('No authentication token found');
    }

    const defaultHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        throw new Error('Authentication expired');
      }
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Server error');
    }

    return response.json();
  };

  const handleLocationUpdate = async (newLocation) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await authenticatedFetch(`${API_URL}/api/captains/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          data: {
            location: newLocation
          }
        })
      });
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const ChatDrawer = ({ isOpen, onClose, messages, newMessage, setNewMessage, onSendMessage, isSendingMessage }) => (
    <Box
      position="fixed"
      right={isOpen ? 0 : "-100%"}
      top={0}
      bottom={0}
      width="300px"
      boxShadow="-2px 0 10px rgba(0,0,0,0.1)"
      transition="right 0.3s"
      zIndex={1000}
    >
      <VStack h="100%" p={4}>
        <HStack w="full" justify="space-between">
          <Text fontWeight="bold">Messages</Text>
          <IconButton 
            icon={<FiX />} 
            size="sm" 
            onClick={onClose}
          />
        </HStack>
        
        <VStack 
          flex={1} 
          w="full" 
          overflowY="auto" 
          spacing={2}
          p={2}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              alignSelf={message.attributes.sender_type === 'captain' ? 'flex-end' : 'flex-start'}
              bg={message.attributes.sender_type === 'captain' ? 'blue.500' : 'gray.100'}
              color={message.attributes.sender_type === 'captain' ? 'white' : 'black'}
              p={2}
              px={3}
              borderRadius="lg"
              maxW="80%"
            >
              <Text fontSize="sm">{message.attributes.content}</Text>
              <Text fontSize="xs" opacity={0.7} mt={1}>
                {new Date(message.attributes.timestamp).toLocaleTimeString()}
              </Text>
            </Box>
          ))}
        </VStack>

        <HStack w="full">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
          />
          <IconButton
            icon={<FiSend />}
            onClick={onSendMessage}
            isLoading={isSendingMessage}
            colorScheme="blue"
          />
        </HStack>
      </VStack>
    </Box>
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeOrder) return;

    try {
      setIsSendingMessage(true);
      await authenticatedFetch(`${API_URL}/api/messages`, {
        method: 'POST',
        body: JSON.stringify({
          data: {
            content: newMessage,
            sender_type: 'captain',
            order: activeOrder.id,
            timestamp: new Date().toISOString(),
            read: false
          }
        })
      });

      setNewMessage('');
      await fetchMessages(activeOrder.id);
      toast({
        title: 'Message sent',
        status: 'success',
        duration: 3000
      });
    } catch (error) {
      toast({
        title: 'Error sending message',
        status: 'error',
        duration: 3000
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleToggleOnline = async () => {
    try {
      await authenticatedFetch(`${API_URL}/api/captains/${captainData.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          data: {
            availability_status: isOnline ? 'offline' : 'online'
          }
        })
      });

      setIsOnline(!isOnline);
      toast({
        title: `You are now ${isOnline ? 'offline' : 'online'}`,
        status: 'success',
        duration: 2000
      });
    } catch (error) {
      toast({
        title: 'Error updating status',
        status: 'error',
        duration: 3000
      });
    }
  };

  const handleAcceptOrder = async (order) => {
    try {
      await authenticatedFetch(`${API_URL}/api/orders/${order.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          data: {
            status: ORDER_STATUSES.ACCEPTED,
            captain: captainData.id
          }
        })
      });

      setActiveOrder({...order, status: ORDER_STATUSES.ACCEPTED});
      setOrderRequests(prev => prev.filter(req => req.id !== order.id));
      
      if (isMobile) {
        setActiveTab(1); // Switch to active order tab
      }

      toast({
        title: 'Order Accepted',
        status: 'success',
        duration: 2000
      });
    } catch (error) {
      toast({
        title: 'Failed to accept order',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await authenticatedFetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({
          data: {
            status: newStatus,
            status_updated_at: new Date().toISOString()
          }
        })
      });

      setActiveOrder(prev => ({...prev, status: newStatus}));

      toast({
        title: 'Status Updated',
        status: 'success',
        duration: 2000
      });
    } catch (error) {
      toast({
        title: 'Failed to update status',
        status: 'error',
        duration: 3000
      });
    }
  };

  const handleCompleteOrder = async () => {
    try {
      await authenticatedFetch(`${API_URL}/api/orders/${activeOrder.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          data: {
            status: ORDER_STATUSES.COMPLETED,
            completed_at: new Date().toISOString()
          }
        })
      });

      // Update stats
      setDailyStats(prev => ({
        ...prev,
        earnings: prev.earnings + (activeOrder.total || 0),
        deliveries: prev.deliveries + 1
      }));

      setActiveOrder(null);
      
      if (isMobile) {
        setActiveTab(0); // Switch back to map
      }

      toast({
        title: 'Delivery Completed',
        status: 'success',
        duration: 2000
      });
    } catch (error) {
      toast({
        title: 'Failed to complete order',
        status: 'error',
        duration: 3000
      });
    }
  };

  useEffect(() => {
    const fetchCaptainData = async () => {
      try {
        setIsLoading(true);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const { data } = await authenticatedFetch(
          `${API_URL}/api/captains?filters[users_permissions_user][id][$eq]=${user.id}&populate=*`
        );
        
        if (!data?.[0]) throw new Error('Captain profile not found');
        
        const captain = data[0];
        const orders = captain.attributes?.orders?.data || [];
        setCaptainData(captain);
        setIsOnline(captain.attributes?.availability_status === 'online');

        // Calculate daily stats
        const today = new Date().toISOString().split('T')[0];
        const completedOrders = orders.filter(
          order => order.attributes?.status === ORDER_STATUSES.COMPLETED && 
          order.attributes?.completed_at?.startsWith(today)
        ) || [];

        setDailyStats({
          earnings: completedOrders.reduce((sum, order) => sum + (parseFloat(order.attributes?.total) || 0), 0),
          deliveries: completedOrders.length,
          distance: completedOrders.reduce((sum, order) => sum + (parseFloat(order.attributes?.distance) || 0), 0),
          hours: completedOrders.length > 0 ? 
            (new Date() - new Date(completedOrders[0].attributes?.created_at)) / (1000 * 60 * 60) : 0
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading captain data:', error);
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 3000
        });
        setIsLoading(false);
      }
    };

    fetchCaptainData();
  }, []);

  // Poll for new orders
  useEffect(() => {
    if (!isOnline) return;

    const fetchOrders = async () => {
      try {
        const { data } = await authenticatedFetch(
          `${API_URL}/api/orders?filters[status][$eq]=pending&populate=*`
        );
        setOrderRequests(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [isOnline]);

  if (isLoading) {
    return (
      <Layout>
        <Center h="100vh">
          <Spinner size="xl" />
        </Center>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>BitEats Captain Dashboard</title>
      </Head>

      <Box 
        minH="100vh" 
        pt={isMobile ? "70px" : 0} 
        pb={isMobile ? "70px" : 0}
      >
        {isMobile ? (
          <>
            <MobileHeader 
              captainData={captainData}
              isOnline={isOnline}
              onToggleOnline={handleToggleOnline}
            />

            <Box p={4}>
              {activeTab === 0 && (
                <Box h="calc(100vh - 140px)">
                  <HotspotMap 
                    captainLocation={captainData?.location}
                    activeOrder={activeOrder}
                    orders={orderRequests}
                    onLocationUpdate={handleLocationUpdate}
                  />
                </Box>
              )}

              {activeTab === 1 && (
                <VStack spacing={4} align="stretch">
                  {activeOrder ? (
                    <ActiveOrderCard 
                      order={activeOrder}
                      onUpdateStatus={handleUpdateStatus}
                      onComplete={handleCompleteOrder}
                      messages={messages}
                      onSendMessage={handleSendMessage}
                      newMessage={newMessage}
                      setNewMessage={setNewMessage}
                      isSendingMessage={isSendingMessage}
                      isMobile={true}
                    />
                  ) : (
                    orderRequests.map(order => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onAccept={handleAcceptOrder}
                        isMobile={true}
                      />
                    ))
                  )}
                </VStack>
              )}

              {activeTab === 2 && <EarningsView stats={dailyStats} />}
              {activeTab === 3 && <ProfileView captain={captainData} />}
            </Box>

            <MobileNav 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              hasActiveOrder={!!activeOrder}
            />
          <ChatDrawer 
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
              messages={messages}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              onSendMessage={handleSendMessage}
              isSendingMessage={isSendingMessage}
            />
          </>
        ) : (
          // Desktop Layout
          <Container maxW="container.xl" py={6}>
            <HStack justify="space-between">
              <HStack spacing={4}>
                <Avatar size="md" name={captainData?.name} src={captainData?.avatar?.url} />
                <VStack align="start" spacing={0}>
                  <Text fontSize="lg" fontWeight="bold">{captainData?.name}</Text>
                  <Text>{captainData?.vehicle_type}</Text>
                </VStack>
              </HStack>
              <HStack>
                <Text>{isOnline ? 'Online' : 'Offline'}</Text>
                <Switch
                  isChecked={isOnline}
                  onChange={handleToggleOnline}
                  colorScheme="green"
                />
              </HStack>
            </HStack>

            <SimpleGrid columns={4} spacing={6} mb={6}>
              <StatCard
                title="Today's Earnings"
                value={`${dailyStats.earnings} LYD`}
                icon={FaWallet}
                color="green.500"
              />
              <StatCard
                title="Deliveries"
                value={dailyStats.deliveries}
                icon={FaMotorcycle}
                color="blue.500"
              />
              <StatCard
                title="Distance"
                value={`${Math.round(dailyStats.distance)} km`}
                icon={FaMapMarkerAlt}
                color="purple.500"
              />
              <StatCard
                title="Online Hours"
                value={`${Math.round(dailyStats.hours * 10) / 10}h`}
                icon={FaClock}
                color="orange.500"
              />
            </SimpleGrid>

            <SimpleGrid columns={2} spacing={6}>
              <Box
                borderRadius="lg"
                boxShadow="sm"
                h="600px"
                overflow="hidden"
              >
                <HotspotMap 
                  captainLocation={captainData?.location}
                  activeOrder={activeOrder}
                  orders={orderRequests}
                  onLocationUpdate={handleLocationUpdate}
                />
              </Box>

              <VStack spacing={4} align="stretch">
                {activeOrder ? (
                  <ActiveOrderCard
                    order={activeOrder}
                    onUpdateStatus={handleUpdateStatus}
                    onComplete={handleCompleteOrder}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    isSendingMessage={isSendingMessage}
                    isMobile={false}
                  />
                ) : (
                  <>
                    <Heading size="md" mb={2}>Available Orders</Heading>
                    <Box maxH="calc(100vh - 300px)" overflowY="auto">
                      {orderRequests.map(order => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onAccept={handleAcceptOrder}
                          isMobile={false}
                        />
                      ))}
                    </Box>
                  </>
                )}
              </VStack>
            </SimpleGrid>
          </Container>
        )}
      </Box>
    </Layout>
  );
};

export default CaptainDashboard;