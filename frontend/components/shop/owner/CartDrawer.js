// components/shop/owner/CartDrawer.js
import React, { useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  HStack,
  Text,
  Button,
  Image,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  useToast,
  Radio,
  RadioGroup,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  PinInput,
  PinInputField,
  useDisclosure,
} from '@chakra-ui/react';
import { FiTrash2, FiCreditCard } from 'react-icons/fi';
import { useShopCart } from '@/contexts/ShopCartContext';
import { useTransfer } from '@/hooks/useTransfer';
import { useAuth } from '@/hooks/useAuth';
import { useMutation } from '@tanstack/react-query';

const CartDrawer = ({ isOpen, onClose, shopData }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useShopCart();
  const { user } = useAuth();
  const toast = useToast();
  const transfer = useTransfer();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [pin, setPin] = useState('');
  const { 
    isOpen: isPaymentOpen, 
    onOpen: onPaymentOpen, 
    onClose: onPaymentClose 
  } = useDisclosure();
  const [isProcessing, setIsProcessing] = useState(false);

  // Create order mutation
  const createOrder = useMutation({
    mutationFn: async (orderData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            data: orderData
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create order');
      }

      return response.json();
    }
  });

  // Update stock mutation
  const updateStock = useMutation({
    mutationFn: async ({ itemId, newStock }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-items/${itemId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            data: {
              stock: newStock
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update stock');
      }

      return response.json();
    }
  });

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to place an order',
        status: 'error',
        duration: 3000
      });
      return;
    }

    if (paymentMethod === 'bitcash') {
      onPaymentOpen();
      return;
    }

    await processOrder('cod');
  };

  const processOrder = async (paymentStatus) => {
    setIsProcessing(true);
    try {
      // Create order
      const orderData = {
        owner: shopData.data[0].id,  // Shop owner ID
        customer: user.id,
        total: getCartTotal(),
        items: cart.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        status: 'pending',
        payment_status: paymentStatus,
        payment_method: paymentMethod
      };

      const order = await createOrder.mutateAsync(orderData);

      // Update stock for each item
      await Promise.all(
        cart.items.map(item =>
          updateStock.mutateAsync({
            itemId: item.id,
            newStock: item.stock - item.quantity
          })
        )
      );

      if (paymentMethod === 'bitcash') {
        // Process BitCash payment
        await transfer.mutateAsync({
          recipientId: shopData.data[0].id,
          amount: getCartTotal(),
          pin
        });
      }

      // Clear cart and close drawers
      clearCart();
      onPaymentClose();
      onClose();

      toast({
        title: 'Order placed successfully',
        status: 'success',
        duration: 3000
      });
    } catch (error) {
      toast({
        title: 'Error placing order',
        description: error.message,
        status: 'error',
        duration: 5000
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePinComplete = async (value) => {
    setPin(value);
    await processOrder('paid');
  };

  return (
    <>
      <Drawer isOpen={isOpen} onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Shopping Cart</DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="stretch">
              {cart.items.map((item) => (
                <HStack key={item.id} spacing={4} p={2} borderWidth={1} borderRadius="md">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    boxSize="80px" 
                    objectFit="cover" 
                    borderRadius="md"
                  />
                  <VStack flex={1} align="start" spacing={1}>
                    <Text fontWeight="bold">{item.name}</Text>
                    <Text>{item.price} LYD</Text>
                    <NumberInput
                      size="sm"
                      maxW={20}
                      min={1}
                      max={item.stock}
                      value={item.quantity}
                      onChange={(value) => updateQuantity(item.id, parseInt(value))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </VStack>
                  <IconButton
                    icon={<FiTrash2 />}
                    onClick={() => removeFromCart(item.id)}
                    variant="ghost"
                    colorScheme="red"
                  />
                </HStack>
              ))}

              {cart.items.length === 0 && (
                <Text color="gray.500" textAlign="center">
                  Your cart is empty
                </Text>
              )}

              {cart.items.length > 0 && (
                <>
                  <Divider />
                  <Box p={4}>
                    <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                      <VStack align="start" spacing={3}>
                        <Radio value="cod">Cash on Delivery</Radio>
                        <Radio value="bitcash">Pay with BitCash</Radio>
                      </VStack>
                    </RadioGroup>
                  </Box>
                </>
              )}
            </VStack>
          </DrawerBody>

          <DrawerFooter borderTopWidth={1}>
            <VStack w="full" spacing={4}>
              <HStack justify="space-between" w="full">
                <Text fontWeight="bold">Total:</Text>
                <Text fontWeight="bold">{getCartTotal()} LYD</Text>
              </HStack>
              <Button
                colorScheme="blue"
                w="full"
                isDisabled={cart.items.length === 0}
                onClick={handleCheckout}
                isLoading={isProcessing}
                leftIcon={paymentMethod === 'bitcash' ? <FiCreditCard /> : undefined}
              >
                Checkout
              </Button>
            </VStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* BitCash Payment Modal */}
      <Modal isOpen={isPaymentOpen} onClose={onPaymentClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter your BitCash PIN</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Text>Amount: {getCartTotal()} LYD</Text>
              <HStack>
                <PinInput otp onComplete={handlePinComplete}>
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CartDrawer;