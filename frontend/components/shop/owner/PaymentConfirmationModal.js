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
  Spinner,
  useColorModeValue,
  Divider,
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

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>Confirm Payment</ModalHeader>
        <ModalBody>
          <VStack spacing={6} align="stretch">
            <VStack align="start" spacing={2}>
              <Text color="gray.500">Paying to</Text>
              <Text fontSize="lg" fontWeight="bold">{shopName}</Text>
            </VStack>

            <HStack justify="space-between" p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
              <HStack>
                <Icon as={FiUser} />
                <Text>Your Balance</Text>
              </HStack>
              <Text fontWeight="bold">
                {customerBalance?.toLocaleString()} LYD
              </Text>
            </HStack>

            <HStack justify="space-between" p={4} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="md">
              <HStack>
                <Icon as={FiDollarSign} />
                <Text>Amount to Pay</Text>
              </HStack>
              <Text fontWeight="bold" color="blue.500">
                {totalAmount?.toLocaleString()} LYD
              </Text>
            </HStack>

            <Divider />

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
                  {[...Array(6)].map((_, i) => (
                    <PinInputField
                      key={i}
                      fontSize="xl"
                      borderColor={useColorModeValue('gray.200', 'gray.600')}
                      _focus={{
                        borderColor: 'blue.400',
                        boxShadow: `0 0 0 1px ${useColorModeValue('blue.400', 'blue.300')}`
                      }}
                    />
                  ))}
                </PinInput>
              </HStack>
            </FormControl>
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
              onClick={() => onConfirmPayment(pin)}
              isLoading={isProcessing}
              isDisabled={pin.length !== 6 || isProcessing}
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