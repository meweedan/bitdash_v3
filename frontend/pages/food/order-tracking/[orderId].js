import React from 'react';
import { sendNotification, requestNotificationPermission } from '@/services/notificationService';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Spinner,
  Circle,
  Divider,
  useToast,
  useBreakpointValue,
  Icon,
  Button,
  Textarea,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Input,
  Badge,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { FiCheck, FiClock, FiPackage, FiX, FiMessageCircle } from 'react-icons/fi';
import { GiCook } from 'react-icons/gi';
import Layout from '@/components/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

// Update the emojiShowerAnimation keyframes
const emojiShowerAnimation = keyframes`
  0% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }
  10% {
    transform: translateY(20px) scale(1);
    opacity: 0.7;
  }
  90% {
    transform: translateY(150px) scale(1);
    opacity: 0.3;
  }
  100% {
    transform: translateY(180px) scale(0.8);
    opacity: 0;
    display: none;
  }
`;

// Update the ShowerEmoji component
const ShowerEmoji = ({ emoji, delay }) => (
  <Box
    as="span"
    position="absolute"
    fontSize="xl"
    animation={`${emojiShowerAnimation} 4s ease-out ${delay}s`}
    animationFillMode="forwards"
    top="-20px"
    left={`${Math.random() * 90 + 5}%`}
    transform="rotate(0deg)"
    pointerEvents="none"
    zIndex={1}
    style={{
      willChange: 'transform, opacity',
    }}
  >
    {emoji}
  </Box>
);

const getStatusWeight = (status) => {
  const weights = {
    pending: 0,
    preparing: 1,
    ready: 2,
    completed: 3,
    cancelled: 4,
  };
  return weights[status] || 0;
};

const getStatusColor = (status) => {
  const colors = {
    pending: 'yellow',
    preparing: 'blue',
    ready: 'orange',
    completed: 'green',
    cancelled: 'red'
  };
  return colors[status] || 'gray';
};

const StatusStep = ({ status, currentStatus, icon, label, isLast }) => {
  const isCompleted = getStatusWeight(currentStatus) > getStatusWeight(status);
  const isActive = currentStatus === status;
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isActive]);

  return (
    <VStack flex={1} position="relative">
      <Circle
        size={{ base: '50px', md: '70px' }}
        bg={
          isCompleted
            ? 'green.500'
            : isActive
            ? 'blue.500'
            : status === 'cancelled'
            ? 'red.500'
            : 'whiteAlpha.200'
        }
        color={isCompleted || isActive ? 'white' : 'gray.500'}
        animation={isAnimating ? `${pulse} 1.75s infinite` : undefined}
        boxShadow={isActive || isCompleted ? 'lg' : 'none'}
        transition="all 0.3s ease"
      >
        <Icon as={icon} boxSize={{ base: 6, md: 8 }} />
      </Circle>
      <Text
        fontWeight="bold"
        color={isActive ? 'blue.500' : 'white'}
        textAlign="center"
        fontSize={{ base: 'sm', md: 'md' }}
        opacity={(!isMobile || isActive) ? 1 : 0.7}
        transition="all 0.3s ease"
      >
        {label}
      </Text>
    </VStack>
  );
};

const OrderTrackingPage = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const cancelRef = React.useRef();
  const messagesEndRef = React.useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchOrderStatus = async () => {
 try {
   if (!orderId) return;
   
   const response = await fetch(
     `${BASE_URL}/api/orders/${orderId}?populate[order_items][populate][menu_item]=*&populate[tables]=*&populate[guest_info]=*&populate[restaurant]=*&populate[customer_profile]=*`,
     { headers: { 'Content-Type': 'application/json' } }
   );

   const data = await response.json();
   if (!data?.data) {
     console.error('No order data found');
     return;
   }

   setOrder(data.data);
   setLoading(false);

 } catch (error) {
   console.error('Order fetch error:', error);
   setLoading(false);
 }
};

// Update status reference at return
// const currentStatus = order?.attributes?.status;

useEffect(() => {
  if (orderId) {
    fetchOrderStatus();
    const interval = setInterval(fetchOrderStatus, 5000);
    return () => clearInterval(interval);
  }
}, [orderId]);

  const scrollToBottom = () => {
  const container = messagesEndRef.current?.parentElement;
  if (container && container.scrollHeight - container.scrollTop <= container.clientHeight + 50) {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
};

  // Add function to fetch messages
  const fetchMessages = async () => {
 try {
   const response = await fetch(
     `${BASE_URL}/api/messages?filters[order][id]=${orderId}&sort=timestamp:asc`,
     { headers: { 'Content-Type': 'application/json' } }
   );

   const data = await response.json();
   setMessages(data.data || []);
 } catch (error) {
   console.error('Error fetching messages:', error);
 }
};

  // Add function to send message
  const handleSendMessage = async () => {
 if (!newMessage.trim()) return;

 try {
   setIsSendingMessage(true);
   const response = await fetch(`${BASE_URL}/api/messages`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       data: {
         content: newMessage,
         sender_type: 'customer',
         order: orderId,
         timestamp: new Date().toISOString(),
         read: false,
       }
     })
   });

   if (!response.ok) throw new Error('Failed to send message');

   const messageData = await response.json();
   setNewMessage('');
   fetchMessages();
   
   toast({
     title: 'Message sent',
     status: 'success', 
     duration: 3000,
   });

 } catch (error) {
   console.error('Error sending message:', error);
   toast({
     title: 'Error',
     description: 'Failed to send message',
     status: 'error',
     duration: 5000,
   });
 } finally {
   setIsSendingMessage(false);
 }
};

  // Add function to handle order cancellation
  const handleCancelOrder = async () => {
    try {
      if (order?.attributes?.cancellation_attempts >= 3) {
        toast({
          title: 'Error',
          description: 'Maximum cancellation attempts reached',
          status: 'error',
          duration: 5000,
        });
        return;
      }

      const response = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            status: 'cancelled',
            cancellation_attempts: (order?.attributes?.cancellation_attempts || 0) + 1
          }
        })
      });

      if (!response.ok) throw new Error('Failed to cancel order');

      toast({
        title: 'Order cancelled',
        status: 'success',
        duration: 3000,
      });
      fetchOrderStatus(); // Refresh order status
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel order',
        status: 'error',
        duration: 5000,
      });
    } finally {
      onClose();
    }
  };

  // Add message polling
  useEffect(() => {
    if (orderId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Box>
      </Layout>
    );
  }

  const currentStatus = order?.status;

  return (
    <>
      <Head>
        <title>{`Order #${orderId}' status`}</title>
      </Head>
      <Layout>
        <Container maxW="container.lg" py={8}>
          <Box
            maxW="1000px"
            mx="auto"
            p={8}
            borderRadius="xl"
            boxShadow="xl"
            backdropFilter="blur(20px)"
            border="1px solid"
            borderColor="whiteAlpha.200"
            position="relative"
            overflow="hidden"
            transition="all 0.3s ease"
            _hover={{ transform: 'translateY(-2px)' }}
          >
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="whiteAlpha.100"
              backdropFilter="blur(10px)"
              borderRadius="2xl"
              zIndex="0"
            />

            <VStack position="relative" zIndex="1">
              {/* Status Badge */}
              <Box 
                p={2} 
                bg={`${getStatusColor(currentStatus)}.500`}
                borderRadius="full"
                boxShadow="lg"
                transition="all 0.3s ease"
              >
                <Badge
                  fontSize={{ base: "xl", sm: "xl", md: "xl" }}
                  p={4}
                  borderRadius="lg"
                  bg="transparent"
                  color="white"
                >
                  {currentStatus && t(`status${currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}Badge`)}
                </Badge>
              </Box>

              {/* Progress Tracker */}
              <Box 
  position="relative" 
  width="100%" 
  borderWidth="2px" 
  borderRadius="lg" 
  p={6}
  height="200px"
  overflow="hidden"
>
  {/* Fixed-height container for emojis */}
  <Box 
    position="absolute"
    top={0}
    left={0}
    right={0}
    height="200px"
    pointerEvents="none"
    zIndex={1}
  >
    {currentStatus && currentStatus !== 'cancelled' && (
      Array.from({ length: 5 }).map((_, index) => (
        <Box
          key={`shower-${index}-${currentStatus}`}
          position="absolute"
          top={0}
          left={`${20 + (index * 15)}%`}
          fontSize="xl"
          animation={`${emojiShowerAnimation} 3s ease-out ${index * 0.3}s`}
          animationFillMode="forwards"
          pointerEvents="none"
          zIndex={1}
        >
          {currentStatus === 'completed'
            ? ['🎉', '✨'][index % 2]
            : currentStatus === 'pending'
            ? '⏳'
            : currentStatus === 'preparing'
            ? '👨‍🍳'
            : currentStatus === 'ready'
            ? '✨'
            : ''
          }
        </Box>
      ))
    )}
  </Box>

  {/* Status steps with fixed positioning */}
  <HStack 
    spacing={{ base: 4, md: 8 }} 
    width="100%"
    position="absolute"
    top="50%"
    left="50%"
    transform="translate(-50%, -50%)"
    zIndex={2}
  >
    <StatusStep
      status="pending"
      currentStatus={currentStatus}
      icon={FiClock}
      label={t('orderTracking.steps.received')}
    />
    <StatusStep
      status="preparing"
      currentStatus={currentStatus}
      icon={GiCook}
      label={t('orderTracking.steps.preparing')}
    />
    <StatusStep
      status="ready"
      currentStatus={currentStatus}
      icon={FiPackage}
      label={t('orderTracking.steps.ready')}
    />
    <StatusStep
      status="completed"
      currentStatus={currentStatus}
      icon={FiCheck}
      label={t('orderTracking.steps.completed')}
      isLast={currentStatus !== 'cancelled'}
    />
    {currentStatus === 'cancelled' && (
      <StatusStep
        status="cancelled"
        currentStatus={currentStatus}
        icon={FiX}
        label={t('orderTracking.steps.cancelled')}
        isLast
      />
    )}
  </HStack>
</Box>

               <VStack spacing={4} align="stretch" width="100%">
                   {/* Add Cancel Order Button */}
          {currentStatus !== 'cancelled' && currentStatus !== 'completed' && (
            <Button
              colorScheme="red"
              onClick={onOpen}
              isDisabled={order?.attributes?.cancellation_attempts >= 3}
            >{t('cancel_order')}</Button>
          )}

          {/* Messages Section */}
          <Box bg="whiteAlpha.200" p={4} borderRadius="lg">
            <Heading size="md" mb={4}>{t('messages')}</Heading>
            <VStack spacing={4} maxH="300px" overflowY="auto" mb={4}>
              {messages.map((message) => (
                <Box 
                  key={message.id}
                  alignSelf={message.attributes.sender_type === 'customer' ? 'flex-end' : 'flex-start'}
                  maxW="80%"
                  bg={message.attributes.sender_type === 'customer' ? 'blue.500' : 'gray.600'}
                  color="white"
                  p={3}
                  borderRadius="lg"
                >
                  <Text fontSize="sm">{message.attributes.content}</Text>
                  <Text fontSize="xs" opacity={0.7} mt={1}>
                    {new Date(message.attributes.timestamp).toLocaleString()}
                  </Text>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </VStack>
            
            <HStack>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                bg="whiteAlpha.100"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                colorScheme="blue"
                onClick={handleSendMessage}
                isLoading={isSendingMessage}
                leftIcon={<FiMessageCircle />}
              >{t('send')}</Button>
            </HStack>
          </Box>

          {/* Cancellation Confirmation Dialog */}
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader>{t('cancel_order')}</AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure? You have {3 - (order?.attributes?.cancellation_attempts || 0)} attempts remaining.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>{t('no')}</Button>
                  <Button colorScheme="red" onClick={handleCancelOrder} ml={3}>{t('yes_cancel_order')}</Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </VStack>

              {/* Order Details */}
              <VStack spacing={4} align="stretch" width="100%">
                <Box p={6} borderWidth="1px" borderRadius="lg" bg="whiteAlpha.100">
                  <VStack align="stretch" spacing={6}>
                    {/* Customer Info */}
                    <Box bg="whiteAlpha.200" p={4} borderRadius="lg">
                      <HStack justify="space-between" mb={2}>
                        <Text fontWeight="bold" fontSize="lg">
                          {order?.customer_profile ? "Customer Information" : "Guest Information"}
                        </Text>
                        <Badge colorScheme={order?.customer_profile ? "green" : "blue"}>
                          {order?.customer_profile ? "Registered" : "Guest"}
                        </Badge>
                      </HStack>
                      <VStack align="start" spacing={1}>
                        <Text>
                          Name: {order?.customer_profile?.fullName || order?.guest_info?.name || 'N/A'}
                        </Text>
                        <Text>
                          Phone: {order?.customer_profile?.phone || order?.guest_info?.phone || 'N/A'}
                        </Text>
                      </VStack>
                    </Box>

                    {/* Order Items */}
                    <VStack align="stretch" spacing={3}>
                      <Heading size="md">{t('orderItems')}</Heading>
                      {order?.order_items?.map((item) => (
                        <Box
                          key={item.id}
                          p={4}
                          borderWidth="1px"
                          borderRadius="md"
                          bg="whiteAlpha.200"
                          transition="all 0.2s"
                          _hover={{ bg: 'whiteAlpha.300' }}
                        >
                          <HStack justify="space-between">
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="semibold">
                                {item.menu_item.name}
                              </Text>
                              <Text fontSize="sm" color="gray.400">
                                ${item.unit_price}
                              </Text>
                              {item.special_instructions && (
                                <Text fontSize="sm" color="gray.500">
                                  Note: {item.special_instructions}
                                </Text>
                              )}
                            </VStack>
                            <VStack align="end" spacing={1}>
                              <Badge colorScheme="blue">x{item.quantity}</Badge>
                              <Text fontWeight="bold">${item.subtotal}</Text>
                            </VStack>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>

                    {/* Order Summary */}
                    <Box bg="whiteAlpha.200" p={4} borderRadius="lg">
                      <VStack spacing={3}>
                        <HStack justify="space-between" width="100%">
                          <Text>{t('table')}</Text>
                          <Text>{order?.tables?.[0]?.name || 'N/A'}</Text>
                        </HStack>
                        <HStack justify="space-between" width="100%">
                          <Text>{t('payment_method')}</Text>
                          <Badge colorScheme="purple">{order?.payment_method}</Badge>
                        </HStack>
                        <Divider />
                        <HStack justify="space-between" width="100%">
                          <Text fontWeight="bold">{t('total_amount')}</Text>
                          <Text fontWeight="bold" fontSize="xl">${order?.total}</Text>
                        </HStack>
                      </VStack>
                    </Box>

                    {/* Notes */}
                    {order?.notes && (
                      <Box bg="whiteAlpha.200" p={4} borderRadius="lg">
                        <Text fontWeight="bold" mb={2}>{t('order_notes')}</Text>
                        <Text>{order.notes}</Text>
                      </Box>
                    )}

                    {/* Timestamps */}
                    <Box bg="whiteAlpha.100" p={4} borderRadius="lg">
                      <VStack align="stretch" spacing={2}>
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.400">{t('order_placed')}</Text>
                          <Text fontSize="sm" color="gray.400">
                            {new Date(order?.createdAt).toLocaleString()}
                          </Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.400">{t('last_updated')}</Text>
                          <Text fontSize="sm" color="gray.400">
                            {new Date(order?.updatedAt).toLocaleString()}
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            </VStack>
          </Box>
        </Container>
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

export default OrderTrackingPage;