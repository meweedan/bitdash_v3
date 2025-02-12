import React, { createContext, useContext, useState } from 'react';
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
  useDisclosure,
  useToast,
  useColorModeValue,
  Avatar,
  Badge,
  Flex,
  Box,
  Spinner
} from '@chakra-ui/react';
import { FiUser, FiLock, FiDollarSign, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import theme from '../styles/theme'

// Create the PaymentContext
const PaymentContext = createContext(null);

// Transaction Confirmation Modal Component
const TransactionConfirmationModal = ({ 
  isOpen, 
  onClose, 
  beforeBalance, 
  afterBalance, 
  amount, 
  merchantName, 
  isSuccess,
  transactionId
}) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay backdropFilter="blur(10px)" />
    <ModalContent>
      <ModalHeader>
        <Flex align="center">
          <Icon 
            as={isSuccess ? FiCheckCircle : FiAlertCircle} 
            color={isSuccess ? 'green.500' : 'red.500'}
            mr={3}
            boxSize={6}
          />
          <Text>{isSuccess ? 'Payment Successful' : 'Payment Failed'}</Text>
        </Flex>
      </ModalHeader>
      <ModalBody>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Text>Merchant:</Text>
            <Text fontWeight="bold">{merchantName}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>Amount:</Text>
            <Text fontWeight="bold" color="green.500">
              {amount.toLocaleString()} LYD
            </Text>
          </HStack>
          {transactionId && (
            <HStack justify="space-between">
              <Text>Transaction ID:</Text>
              <Text fontWeight="bold">{transactionId}</Text>
            </HStack>
          )}
          <Divider />
          <HStack justify="space-between">
            <Text>Balance Before:</Text>
            <Text>{beforeBalance.toLocaleString()} LYD</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>Balance After:</Text>
            <Text>{afterBalance.toLocaleString()} LYD</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>Time:</Text>
            <Text>{new Date().toLocaleString()}</Text>
          </HStack>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} colorScheme="blue">
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export const PaymentProvider = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();
  const { 
    isOpen: isPaymentModalOpen, 
    onOpen: onOpenPaymentModal, 
    onClose: onClosePaymentModal 
  } = useDisclosure();
  const { 
    isOpen: isConfirmationModalOpen, 
    onOpen: onOpenConfirmationModal, 
    onClose: onCloseConfirmationModal 
  } = useDisclosure();

  // Payment state
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [merchantDetails, setMerchantDetails] = useState(null);
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);
  const [customerBalance, setCustomerBalance] = useState(0);
  const [walletData, setWalletData] = useState(null);

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    if (!user?.id) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallets?populate=*&filters[customer][users_permissions_user][id][$eq]=${user.id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch wallet');
      }

      const data = await response.json();
      const wallet = data.data?.[0];
      
      setWalletData({
        id: wallet?.id,
        balance: wallet?.attributes?.balance || 0
      });
      setCustomerBalance(wallet?.attributes?.balance || 0);
    } catch (error) {
      console.error('Wallet fetch error:', error);
      toast({
        title: 'Error fetching wallet',
        description: error.message,
        status: 'error',
        duration: 5000
      });
    }
  };

  // Initiate payment for BitShop sellers
  const initiatePayment = async (paymentInfo) => {
    // Validate authentication
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
      return;
    }

    // Fetch wallet balance
    await fetchWalletBalance();

    // Set payment details
    setPaymentDetails({
      amount: paymentInfo.amount,
      ownerId: paymentInfo.ownerId,
      orderId: paymentInfo.orderId
    });

    // Set merchant details
    setMerchantDetails({
      name: paymentInfo.shopName,
      logo: paymentInfo.shopLogo
    });

    // Open payment modal
    onOpenPaymentModal();
  };

  // Handle payment confirmation
  const handlePayment = async () => {
    // Validate PIN
    if (!pin || pin.length !== 6) {
      toast({
        title: 'Invalid PIN',
        description: 'Please enter a 6-digit PIN',
        status: 'error',
        duration: 3000
      });
      return;
    }

    // Check balance
    if (customerBalance < paymentDetails.amount) {
      toast({
        title: 'Insufficient Balance',
        description: `Your balance (${customerBalance.toLocaleString()} LYD) is insufficient`,
        status: 'error',
        duration: 3000
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Fetch merchant wallet
      const merchantWalletResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallets?populate=*&filters[owner][id][$eq]=${paymentDetails.ownerId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!merchantWalletResponse.ok) {
        throw new Error('Failed to fetch merchant wallet');
      }

      const merchantWalletData = await merchantWalletResponse.json();
      const merchantWalletId = merchantWalletData.data?.[0]?.id;

      if (!merchantWalletId) {
        throw new Error('Merchant wallet not found');
      }

      // Process payment
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallets/payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          senderId: walletData.id,
          merchantId: merchantWalletId,
          amount: paymentDetails.amount,
          pin,
          orderId: paymentDetails.orderId
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Payment failed');
      }

      // Set transaction result
      setTransactionResult({
        beforeBalance: customerBalance,
        afterBalance: result.data.customerBalance,
        isSuccess: true,
        transactionId: result.data.transaction.id
      });

      // Close payment modal and open confirmation modal
      onClosePaymentModal();
      onOpenConfirmationModal();

    } catch (error) {
      console.error('Payment Error:', error);
      
      // Set failed transaction result
      setTransactionResult({
        beforeBalance: customerBalance,
        afterBalance: customerBalance,
        isSuccess: false
      });

      // Open confirmation modal
      onClosePaymentModal();
      onOpenConfirmationModal();

      // Show error toast
      toast({
        title: 'Payment Error',
        description: error.message,
        status: 'error',
        duration: 5000
      });
    } finally {
      setIsProcessing(false);
      setPin('');
    }
  };

  // Payment Modal Component
  const PaymentModal = () => (
    <Modal 
      isOpen={isPaymentModalOpen} 
      onClose={onClosePaymentModal}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent 
        // Use Theme directly
        bg={useColorModeValue('white', 'black')}
        color={useColorModeValue('gray.800', 'white')}
        borderRadius="xl"
      >
        <ModalHeader 
          borderBottomWidth="1px" 
          borderColor={useColorModeValue('gray.200', 'gray.600')}
        >
          Confirm Payment
        </ModalHeader>
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Merchant Details */}
            <Flex align="center" justify="space-between" w="full">
              {merchantDetails?.logo ? (
                <Avatar 
                  src={merchantDetails.logo} 
                  size="lg" 
                  name={merchantDetails.name}
                />
              ) : (
                <Avatar 
                  bg="blue.500" 
                  color="white"
                  size="lg"
                  name={merchantDetails?.name}
                />
              )}
              <VStack align="end" spacing={1}>
                <Text fontWeight="bold">{merchantDetails?.name}</Text>
                <Badge colorScheme="green">Verified Merchant</Badge>
              </VStack>
            </Flex>

            {/* Payment Amount */}
            <Box w="full" p={4} borderRadius="lg" textAlign="center">
              <Text fontSize="sm" color="gray.500">Payment Amount</Text>
              <Text fontSize="3xl" fontWeight="bold" color="green.500">
                {paymentDetails?.amount.toLocaleString()} LYD
              </Text>
            </Box>

            {/* Customer Balance */}
            <Flex align="center" justify="space-between" p={3} borderRadius="md" w="full">
              <HStack>
                <Icon as={FiUser} />
                <Text>Your Balance</Text>
              </HStack>
              <Text fontWeight="bold">
                {customerBalance?.toLocaleString() || 0} LYD
              </Text>
            </Flex>

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
            onClick={onClosePaymentModal}
            isDisabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            // Use a direct color scheme from your theme
            colorScheme="bitshop"
            onClick={handlePayment}
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


  return (
    <PaymentContext.Provider 
      value={{ 
        initiatePayment,
        fetchWalletBalance,
        customerBalance,
        walletData
      }}
    >
      {children}
      <PaymentModal />
      {transactionResult && (
        <TransactionConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => {
            onCloseConfirmationModal();
            setTransactionResult(null);
            // Redirect based on transaction success
            router.push(transactionResult.isSuccess ? '/orders' : '/');
          }}
          beforeBalance={transactionResult.beforeBalance}
          afterBalance={transactionResult.afterBalance}
          amount={paymentDetails?.amount}
          merchantName={merchantDetails?.name}
          isSuccess={transactionResult.isSuccess}
          transactionId={transactionResult.transactionId}
        />
      )}
    </PaymentContext.Provider>
  );
};

// Custom hook to use payment context
export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export default PaymentContext;