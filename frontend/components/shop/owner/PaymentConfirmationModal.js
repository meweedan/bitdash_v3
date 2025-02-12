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

export const PaymentConfirmationModal = ({
  isOpen,
  onClose,
  customerBalance,
  totalAmount,
  shopName,
  onConfirmPayment,
  isProcessing
}) => {
  const [pin, setPin] = React.useState('');
  const theme = useShopTheme();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent 
        bg={theme.colors.background}
        color={theme.colors.text}
        borderRadius={theme.customization.borderRadius}
      >
        <ModalHeader 
          borderBottomWidth="1px" 
          borderColor={useColorModeValue('gray.200', 'gray.600')}
        >
          Confirm Payment
        </ModalHeader>
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Payment Details Section */}
            <VStack align="start" spacing={4}>
              <HStack w="full" justify="space-between">
                <Text color="gray.500">Paying to</Text>
                <Text fontWeight="bold" color={theme.colors.primary}>
                  {shopName}
                </Text>
              </HStack>
              
              {/* Balance Display */}
              <HStack 
                w="full" 
                justify="space-between" 
                p={4} 
                bg={useColorModeValue('gray.50', 'gray.700')} 
                borderRadius={theme.customization.borderRadius}
              >
                <HStack>
                  <Icon as={FiUser} color={theme.colors.primary} />
                  <Text>Your Balance</Text>
                </HStack>
                <Text fontWeight="bold">
                  {customerBalance?.toLocaleString()} LYD
                </Text>
              </HStack>

              {/* Payment Amount */}
              <HStack 
                w="full" 
                justify="space-between" 
                p={4} 
                bg={useColorModeValue(`${theme.colors.primary}50`, `${theme.colors.primary}900`)} 
                borderRadius={theme.customization.borderRadius}
              >
                <HStack>
                  <Icon as={FiDollarSign} color={theme.colors.primary} />
                  <Text>Amount to Pay</Text>
                </HStack>
                <Text fontWeight="bold" color={theme.colors.primary}>
                  {totalAmount?.toLocaleString()} LYD
                </Text>
              </HStack>
            </VStack>

            {/* PIN Input */}
            <FormControl>
              <FormLabel>
                <HStack>
                  <Icon as={FiLock} color={theme.colors.primary} />
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
                        borderColor: theme.colors.primary,
                        boxShadow: `0 0 0 1px ${theme.colors.primary}`
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
              colorScheme={theme.colors.primary.split('.')[0]}
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

export default ShopThemeContext;