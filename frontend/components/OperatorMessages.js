import React, { useState, useEffect, useRef } from 'react';
import {
  VStack,
  Box,
  Input,
  Button,
  Text,
  HStack,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { FiMessageCircle } from 'react-icons/fi';
import { io, Socket } from 'socket.io-client';

const OperatorMessages = ({ orderId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef();
  const toast = useToast();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const newSocket = io(BASE_URL, {
      path: '/socket.io',
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('token')
      }
    });

    newSocket.on('connect', () => {
      newSocket.emit('joinRoom', `order_${orderId}`);
    });

    newSocket.on('message', (data) => {
      if (data.orderId === orderId) {
        fetchMessages();
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [orderId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${BASE_URL}/api/messages?populate=*&filters[order][id]=${orderId}&sort=timestamp:asc`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      
      // Sort messages by timestamp
      const sortedMessages = data.data.sort((a, b) => 
        new Date(a.attributes.timestamp) - new Date(b.attributes.timestamp)
      );
      
      // Mark messages as read
      const unreadMessages = sortedMessages.filter(msg => 
        msg.attributes.sender_type === 'customer' && !msg.attributes.read
      );
      
      if (unreadMessages.length > 0) {
        await Promise.all(unreadMessages.map(msg =>
          fetch(`${BASE_URL}/api/messages/${msg.id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              data: { read: true }
            })
          })
        ));
      }

      setMessages(sortedMessages);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setIsSendingMessage(true);
      const token = localStorage.getItem('token');
      const messageData = {
        data: {
          content: newMessage,
          sender_type: 'operator',
          order: orderId,
          timestamp: new Date().toISOString(),
          read: true
        }
      };

      const response = await fetch(`${BASE_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });

      if (!response.ok) throw new Error('Failed to send message');

      const result = await response.json();
      socket?.emit('message', {
        orderId,
        message: result.data,
        room: `order_${orderId}`
      });

      setNewMessage('');
      await fetchMessages();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 10000); // Fallback polling
      return () => clearInterval(interval);
    }
  }, [orderId]);

  return (
    <Box h="full">
      <VStack spacing={4} h="full">
        <Box 
          flex="1" 
          w="full" 
          overflowY="auto" 
          borderRadius="lg" 
          p={4}
          maxH="400px"
        >
          <VStack spacing={4} align="stretch">
            {messages.map((message) => (
              <Box 
                key={message.id}
                alignSelf={message.attributes.sender_type === 'operator' ? 'flex-end' : 'flex-start'}
                maxW="80%"
              >
                <Box
                //   bg={message.attributes.sender_type === 'operator' ? 'blue.500' : 'gray.200'}
                //   color={message.attributes.sender_type === 'operator' ? 'white' : 'gray.800'}
                  p={3}
                  borderRadius="lg"
                >
                  <Text fontSize="sm">{message.attributes.content}</Text>
                  <Text fontSize="xs" opacity={0.7} mt={1}>
                    {new Date(message.attributes.timestamp).toLocaleString()}
                  </Text>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>

        <HStack w="full" p={4} borderTopWidth="1px">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            isLoading={isSendingMessage}
            isDisabled={!newMessage.trim()}
            leftIcon={<Icon as={FiMessageCircle} />}
          >
            Send
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default OperatorMessages;