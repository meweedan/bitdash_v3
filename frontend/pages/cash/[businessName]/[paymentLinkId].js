import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  Text, 
  Button, 
  FormControl, 
  FormLabel, 
  useToast,
  Spinner,
  Flex,
  HStack,
  Avatar,
  Badge,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider,
  Icon,
  useDisclosure,
  PinInput,
  PinInputField
} from "@chakra-ui/react";
import { FiCheckCircle, FiAlertCircle, FiDollarSign, FiUser, FiLock } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { useWallet } from '@/hooks/useWallet';
import { useQuery } from '@tanstack/react-query';

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
            <Text>{t('merchant')}</Text>
            <Text fontWeight="bold">{merchantName}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>{t('amount')}</Text>
            <Text fontWeight="bold" color="green.500">
              {amount.toLocaleString()} LYD
            </Text>
          </HStack>
          {transactionId && (
            <HStack justify="space-between">
              <Text>{t('transaction_id')}</Text>
              <Text fontWeight="bold">{transactionId}</Text>
            </HStack>
          )}
          <Divider />
          <HStack justify="space-between">
            <Text>{t('balance_before')}</Text>
            <Text>{beforeBalance.toLocaleString()} LYD</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>{t('balance_after')}</Text>
            <Text>{afterBalance.toLocaleString()} LYD</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>{t('time')}</Text>
            <Text>{new Date().toLocaleString()}</Text>
          </HStack>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} colorScheme="blue">{t('close')}</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

const DynamicPaymentPage = () => {
  const router = useRouter();
  const { businessName, paymentLinkId } = router.query; // Add this at the top
  const { isAuthenticated, user } = useAuth();
  const { data: wallet } = useWallet();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [merchantDetails, setMerchantDetails] = useState(null);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);
  const toast = useToast();
  const { t } = useTranslation();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const { 
    data: walletData,
    isLoading: isWalletLoading,
    error: walletError,
    refetch: refetchWallet
  } = useQuery({
    queryKey: ['walletBalance', 'customer', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User ID is missing');
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token is missing');

      try {
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
          const errorText = await response.text();
          console.error('Wallet fetch detailed error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          });
          
          throw new Error(errorText || 'Failed to fetch wallet');
        }

        const data = await response.json();
        
        console.log('Wallet data received:', {
          data,
          userId: user.id,
          walletId: data.data?.[0]?.id,
          balance: data.data?.[0]?.attributes?.balance
        });

        return data;
      } catch (error) {
        console.error('Complete wallet fetch error:', error);
        throw error;
      }
    },
    select: (data) => {
      // Ensure we always return a consistent data structure
      const wallet = data.data?.[0];
      return {
        data: {
          id: wallet?.id,
          attributes: {
            balance: wallet?.attributes?.balance || 0,
            walletId: wallet?.attributes?.walletId
          }
        }
      };
    },
    refetchInterval: 10000,
    enabled: !!user?.id,
    retry: 2,
    onError: (error) => {
      console.error('Wallet query error:', error);
      toast({
        title: 'Error fetching wallet',
        description: error.message,
        status: 'error',
        duration: 5000
      });
    }
  });

  useEffect(() => {
   const fetchPaymentLinkDetails = async () => {
      if (!paymentLinkId) return;

      try {
        const paymentResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment-links/${paymentLinkId}/public`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (!paymentResponse.ok) {
          throw new Error('Failed to fetch payment link details');
        }

        const paymentData = await paymentResponse.json();
        setPaymentDetails(paymentData.data);
        setMerchantDetails(paymentData.data.attributes.merchant?.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 5000
        });
      } finally {
        setLoading(false);
      }
    };

    if (paymentLinkId) {
      fetchPaymentLinkDetails();
    }
  }, [paymentLinkId, toast]);

   const handlePayment = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
      return;
    }

    if (!pin || pin.length !== 6) {
      toast({
        title: 'Invalid PIN',
        description: 'Please enter a 6-digit PIN',
        status: 'error',
        duration: 3000
      });
      return;
    }

    const totalAmount = paymentDetails.attributes.amount;
    
    // Extensive logging
    console.log('Payment Attempt Full Details:', {
      user: {
        id: user.id,
        email: user.email
      },
      walletData: {
        id: walletData?.data?.id,
        balance: walletData?.data?.attributes?.balance
      },
      merchantDetails: {
        id: merchantDetails?.id,
        businessName: merchantDetails?.attributes?.metadata?.businessName
      },
      paymentDetails: {
        id: paymentDetails.id,
        amount: totalAmount
      },
      pin: pin ? 'REDACTED' : 'MISSING'
    });

    const currentBalance = walletData?.data?.attributes?.balance || 0;

    if (currentBalance < totalAmount) {
      toast({
        title: 'Insufficient Balance',
        description: `Your balance (${currentBalance.toLocaleString()} LYD) is insufficient`,
        status: 'error',
        duration: 3000
      });
      return;
    }

    setIsProcessing(true);

    try {
      // First, verify merchant wallet
      const merchantWalletResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallets?populate=*&filters[merchant][id][$eq]=${merchantDetails.id}`,
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallets/payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          senderId: walletData?.data?.id,
          merchantId: merchantWalletId,
          amount: totalAmount,
          pin,
          paymentLinkId: paymentDetails.id
        })
      });

      const result = await response.json();
      
      console.log('Payment Response:', {
        status: response.status,
        body: result
      });

      if (!response.ok) {
        throw new Error(result.error?.message || 'Payment failed');
      }

      setTransactionResult({
        beforeBalance: currentBalance,
        afterBalance: result.data.customerBalance,
        isSuccess: true,
        transactionId: result.data.transaction.id
      });
      
      onConfirmOpen();

    } catch (error) {
      console.error('Complete Payment Error:', {
        message: error.message,
        stack: error.stack
      });
      
      setTransactionResult({
        beforeBalance: currentBalance,
        afterBalance: currentBalance,
        isSuccess: false
      });
      
      onConfirmOpen();
      toast({
        title: 'Payment Error',
        description: error.message,
        status: 'error',
        duration: 5000
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <Flex height="100vh" width="100vw" justifyContent="center" alignItems="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!paymentDetails) {
    return (
      <Layout>
        <Flex height="50vh" width="100vw" justifyContent="center" alignItems="center" textAlign="center">
          <VStack spacing={4}>
            <Heading>{t('invalid_payment_link')}</Heading>
            <Text>{t('the_payment_link_youre_trying_')}</Text>
            <Button onClick={() => router.push('/')}>{t('go_to_home')}</Button>
          </VStack>
        </Flex>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>{merchantDetails?.attributes?.metadata?.businessName || 'Merchant'} | Payment</title>
      </Head>
      <Layout>
        <Flex justifyContent="center" alignItems="center" p={4}>
          <Box
            w="full"
            maxW="md"
            borderRadius="xl"
            boxShadow="xl"
            p={6}
          >
            <VStack spacing={6}>
              <Flex align="center" justify="space-between" w="full">
                {merchantDetails?.attributes?.logo?.data ? (
                  <Avatar 
                    src={`${backendUrl}${merchantDetails.attributes.logo.data.attributes.url}`} 
                    size="lg" 
                    name={merchantDetails.attributes.metadata?.businessName || 'Merchant'}
                  />
                ) : (
                  <Avatar 
                    bg="blue.500" 
                    color="white"
                    size="lg"
                    name={merchantDetails?.attributes?.metadata?.businessName || businessName}
                  />
                )}
                <VStack align="end" spacing={1}>
                  <Heading size="md" textAlign="right">
                    {merchantDetails?.attributes?.metadata?.businessName || businessName}
                  </Heading>
                  <Badge colorScheme="green">{t('verified_merchant')}</Badge>
                </VStack>
              </Flex>

              <Box w="full" p={4} borderRadius="lg" textAlign="center">
                <Text fontSize="sm" color="gray.500">{t('payment_amount')}</Text>
                <Text fontSize="3xl" fontWeight="bold" color="green.500">
                  {paymentDetails.attributes.amount.toLocaleString()} LYD
                </Text>
              </Box>

              {isAuthenticated && (
                <Flex align="center" justify="space-between" p={3} borderRadius="md" w="full">
                  <HStack>
                    <Icon as={FiUser} />
                    <Text>{t('your_balance')}</Text>
                  </HStack>
                  {isWalletLoading ? (
                    <Spinner size="sm" />
                  ) : (
                    <Text fontWeight="bold">
                      {walletData?.data?.attributes?.balance?.toLocaleString() || 0} LYD
                    </Text>
                  )}
                </Flex>
              )}

              {isAuthenticated ? (
                <VStack spacing={4} align="stretch" w="full">
                  <FormControl>
                    <FormLabel>
                      <HStack>
                        <Icon as={FiLock} />
                        <Text>{t('enter_merchants_6digit_pin')}</Text>
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
                            _hover={{
                              borderColor: useColorModeValue('gray.300', 'gray.500')
                            }}
                          />
                        ))}
                      </PinInput>
                    </HStack>
                  </FormControl>
                  <Button
                    size="lg"
                    colorScheme="blue"
                    onClick={handlePayment}
                    isLoading={isProcessing}
                    isDisabled={pin.length !== 6 || isProcessing}
                  >{t('confirm_payment')}</Button>
                </VStack>
              ) : (
                <Button
                  w="full"
                  onClick={() => router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`)}
                >{t('login_to_pay')}</Button>
              )}
            </VStack>
          </Box>
        </Flex>

        {transactionResult && (
          <TransactionConfirmationModal
            isOpen={isConfirmOpen}
            onClose={() => {
              onConfirmClose();
              setTransactionResult(null);
              setPin('');
              router.push(transactionResult.isSuccess ? '/payments/success' : '/');
            }}
            beforeBalance={transactionResult.beforeBalance}
            afterBalance={transactionResult.afterBalance}
            amount={paymentDetails.attributes.amount}
            merchantName={merchantDetails?.attributes?.metadata?.businessName || businessName}
            isSuccess={transactionResult.isSuccess}
            transactionId={transactionResult.transactionId}
          />
        )}
      </Layout>
    </>
  );
};

// Fetching translations for multiple locales
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default DynamicPaymentPage;