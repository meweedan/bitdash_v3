import React, { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  Text,
} from '@chakra-ui/react';

const OrderTracker = ({ onClose }) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setError('Please enter a valid order number');
      return;
    }
    router.push(`/track/${orderNumber.trim()}`);
    onClose();
  };

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={6} pt={2}>
      <Text fontSize="sm" color="gray.500">
        Enter your order number to track its status
      </Text>
      <FormControl isInvalid={!!error}>
        <FormLabel>Order Number</FormLabel>
        <Input
          value={orderNumber}
          onChange={(e) => {
            setOrderNumber(e.target.value);
            setError('');
          }}
          placeholder="Enter order number"
          size="lg"
          autoComplete="off"
        />
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
      <Button 
        type="submit" 
        colorScheme="blue" 
        width="100%"
        size="lg"
      >
        Track Order
      </Button>
    </VStack>
  );
};

export default OrderTracker;