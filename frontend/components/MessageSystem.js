// components/MessageSystem.js
import { useState, useEffect, useRef } from 'react';
import {
 Box,
 VStack,
 HStack,
 Text,
 Input,
 Button,
 useToast,
 IconButton,
 Badge,
 Drawer,
 DrawerBody,
 DrawerHeader,
 DrawerOverlay,
 DrawerContent,
 DrawerCloseButton
} from '@chakra-ui/react';
import { Socket, io } from 'socket.io-client';
import { FiSend, FiMessageSquare } from 'react-icons/fi';

export default function MessageSystem({ orderId, restaurantId, isOpen, onClose }) {
 const [messages, setMessages] = useState([]);
 const [newMessage, setNewMessage] = useState('');
 const messagesEndRef = useRef(null);
 const toast = useToast();
 const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

 const scrollToBottom = () => {
   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
 };

 useEffect(() => {
   if (orderId) {
     fetchMessages();
     const interval = setInterval(fetchMessages, 10000);
     return () => clearInterval(interval);
   }
 }, [orderId]);

 useEffect(() => {
   scrollToBottom();
 }, [messages]);

 const fetchMessages = async () => {
   try {
     const token = localStorage.getItem('token');
     const response = await fetch(
       `${BASE_URL}/api/messages?filters[order][id]=${orderId}&sort[0]=createdAt:asc`,
       {
         headers: {
           'Authorization': `Bearer ${token}`
         }
       }
     );
     
     if (!response.ok) throw new Error('Failed to fetch messages');
     const data = await response.json();
     setMessages(data.data || []);
   } catch (error) {
     console.error('Error fetching messages:', error);
   }
 };

 const sendMessage = async () => {
   if (!newMessage.trim()) return;

   try {
     const token = localStorage.getItem('token');
     const response = await fetch(`${BASE_URL}/api/messages`, {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         data: {
           content: newMessage,
           order: orderId,
           restaurant: restaurantId,
           type: 'operator_message'
         }
       })
     });

     if (!response.ok) throw new Error('Failed to send message');
     
     setNewMessage('');
     fetchMessages();
     
     toast({
       title: 'Message sent',
       status: 'success',
       duration: 2000
     });
   } catch (error) {
     toast({
       title: 'Error sending message',
       description: error.message,
       status: 'error',
       duration: 3000
     });
   }
 };

 const MessageBubble = ({ message }) => (
   <Box
     alignSelf={message.type === 'operator_message' ? 'flex-end' : 'flex-start'}
     bg={message.type === 'operator_message' ? 'blue.500' : 'gray.600'}
    //  color="white"
     px={4}
     py={2}
     borderRadius="lg"
     maxW="80%"
   >
     <Text fontSize="sm">{message.content}</Text>
     <Text fontSize="xs" opacity={0.7} mt={1}>
       {new Date(message.createdAt).toLocaleTimeString()}
     </Text>
   </Box>
 );

 return (
   <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
     <DrawerOverlay />
     <DrawerContent>
       <DrawerCloseButton />
       <DrawerHeader>Order #{orderId} Chat</DrawerHeader>

       <DrawerBody>
         <VStack h="full" spacing={4}>
           <VStack flex={1} w="full" spacing={4} overflowY="auto" p={4}>
             {messages.map((msg) => (
               <MessageBubble key={msg.id} message={msg} />
             ))}
             <div ref={messagesEndRef} />
           </VStack>

           <HStack w="full" p={4} borderTop="1px" borderColor="gray.200">
             <Input
               value={newMessage}
               onChange={(e) => setNewMessage(e.target.value)}
               placeholder="Type your message..."
               onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
             />
             <IconButton
               colorScheme="blue"
               icon={<FiSend />}
               onClick={sendMessage}
             />
           </HStack>
         </VStack>
       </DrawerBody>
     </DrawerContent>
   </Drawer>
 );
}