// components/shop/PaymentConfirmationModal.js
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  HStack,
  Text,
  PinInput,
  PinInputField,
  FormControl,
  FormLabel,
  Icon,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiUser, FiLock, FiDollarSign } from 'react-icons/fi';

const PaymentConfirmationModal = ({
  isOpen,
  onClose,
  customerBalance,
  totalAmount,
  shopName,
  onConfirmPayment,
  isProcessing,
}) => {
  const [pin, setPin] = useState('');

  const handleConfirm = () => {
    onConfirmPayment(pin);
    setPin(''); // Reset PIN after submission
  };

  // Theme colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      closeOnOverlayClick={!isProcessing}
      isCentered
    >
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg={bgColor}>
        <ModalHeader>Confirm Payment</ModalHeader>
        <ModalBody>
          <VStack spacing={6}>
            {/* Payment Details */}
            <VStack spacing={2} w="full">
              <Text color="gray.500">Paying to</Text>
              <Text fontSize="lg" fontWeight="bold">{shopName}</Text>
            </VStack>

            {/* Balance Info */}
            <HStack 
              w="full" 
              justify="space-between" 
              p={4} 
              bg={useColorModeValue('gray.50', 'gray.700')}
              borderRadius="md"
            >
              <HStack>
                <Icon as={FiUser} />
                <Text>Your Balance</Text>
              </HStack>
              <Text fontWeight="bold">
                {customerBalance.toLocaleString()} LYD
              </Text>
            </HStack>

            {/* Amount */}
            <HStack 
              w="full" 
              justify="space-between" 
              p={4} 
              bg={useColorModeValue('blue.50', 'blue.900')}
              borderRadius="md"
            >
              <HStack>
                <Icon as={FiDollarSign} />
                <Text>Amount to Pay</Text>
              </HStack>
              <Text fontWeight="bold" color="blue.500">
                {totalAmount.toLocaleString()} LYD
              </Text>
            </HStack>

            <Divider />

            {/* PIN Input */}
            <FormControl>
              <FormLabel>
                <HStack>
                  <Icon as={FiLock} />
                  <Text>Enter Your PIN</Text>
                </HStack>
              </FormLabel>
              <HStack justify="center" spacing={4}>
                <PinInput
                  value={pin}
                  onChange={setPin}
                  type="number"
                  mask
                  size="lg"
                >
                  {[...Array(6)].map((_, index) => (
                    <PinInputField
                      key={index}
                      borderColor={borderColor}
                      _focus={{
                        borderColor: 'blue.400',
                        boxShadow: `0 0 0 1px ${useColorModeValue('blue.400', 'blue.300')}`
                      }}
                    />
                  ))}
                </PinInput>
              </HStack>
            </FormControl>

            {/* Balance Check Warning */}
            {customerBalance < totalAmount && (
              <Text color="red.500" fontSize="sm">
                Insufficient balance. Please add funds to your wallet.
              </Text>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button 
              variant="ghost" 
              onClick={onClose}
              isDisabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleConfirm}
              isLoading={isProcessing}
              isDisabled={
                pin.length !== 6 || 
                isProcessing || 
                customerBalance < totalAmount
              }
              loadingText="Processing..."
            >
              Confirm Payment
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentConfirmationModal;