import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
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
  Image,
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
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import InlineLoginForm from '@/components/common/InlineLoginForm';
import CelebrationOverlay from '@/components/common/CelebrationOverlay';

const TransactionConfirmationModal = ({ 
  isOpen, 
  onClose, 
  beforeBalance, 
  afterBalance, 
  amount, 
  merchantName, 
  isSuccess,
  transactionId
}) => {
  const { t } = useTranslation();
  
  return (
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
            <Text>
              {t(`payment.confirmation.${isSuccess ? 'success' : 'failed'}`)}
            </Text>
          </Flex>
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text>{t('payment.confirmation.merchant')}:</Text>
              <Text fontWeight="bold">{merchantName}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>{t('payment.confirmation.amount')}:</Text>
              <Text fontWeight="bold" color="green.500">
                {amount.toLocaleString()} {t('common.currency')}
              </Text>
            </HStack>
            {transactionId && (
              <HStack justify="space-between">
                <Text>{t('payment.confirmation.transaction_id')}:</Text>
                <Text fontWeight="bold">{transactionId}</Text>
              </HStack>
            )}
            <Divider />
            <HStack justify="space-between">
              <Text>{t('payment.confirmation.balance_before')}:</Text>
              <Text>{beforeBalance.toLocaleString()} {t('common.currency')}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>{t('payment.confirmation.balance_after')}:</Text>
              <Text>{afterBalance.toLocaleString()} {t('common.currency')}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>{t('payment.confirmation.time')}:</Text>
              <Text>{new Date().toLocaleString()}</Text>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} colorScheme="blue">
            {t('payment.confirmation.close')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const DynamicPaymentPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { businessName, paymentLinkId } = router.query;
  const { isAuthenticated, user, setUser } = useAuth();
  const { data: wallet } = useWallet();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [merchantDetails, setMerchantDetails] = useState(null);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const toast = useToast();
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
      if (!user?.id) throw new Error(t('errors.user_id_missing'));
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error(t('errors.token_missing'));

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
          
          throw new Error(errorText || t('payment.errors.wallet_fetch'));
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Complete wallet fetch error:', error);
        throw error;
      }
    },
    select: (data) => {
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
        title: t('payment.errors.wallet_error'),
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
          throw new Error(t('payment.errors.payment_link_invalid'));
        }

        const paymentData = await paymentResponse.json();
        setPaymentDetails(paymentData.data);
        setMerchantDetails(paymentData.data.attributes.merchant?.data);
      } catch (error) {
        toast({
          title: t('common.error'),
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
  }, [paymentLinkId, t, toast]);

  const handleLoginSuccess = (data) => {
    setUser(data.user);
    refetchWallet();
  };

  const handlePayment = async () => {
    if (!pin || pin.length !== 6) {
      toast({
        title: t('payment.errors.invalid_pin'),
        description: t('payment.errors.pin_required'),
        status: 'error',
        duration: 3000
      });
      return;
    }

    const totalAmount = paymentDetails.attributes.amount;
    const currentBalance = walletData?.data?.attributes?.balance || 0;

    if (currentBalance < totalAmount) {
      toast({
        title: t('payment.errors.insufficient_balance'),
        description: t('payment.errors.insufficient_balance_desc', {
          balance: currentBalance.toLocaleString()
        }),
        status: 'error',
        duration: 3000
      });
      return;
    }

    setIsProcessing(true);

    try {
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
        throw new Error(t('payment.errors.merchant_wallet'));
      }

      const merchantWalletData = await merchantWalletResponse.json();
      const merchantWalletId = merchantWalletData.data?.[0]?.id;

      if (!merchantWalletId) {
        throw new Error(t('payment.errors.merchant_not_found'));
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
      
      if (!response.ok) {
        throw new Error(result.error?.message || t('payment.errors.payment_failed'));
      }

      setShowCelebration(true);
      setTransactionResult({
        beforeBalance: currentBalance,
        afterBalance: result.data.customerBalance,
        isSuccess: true,
        transactionId: result.data.transaction.id
      });
      
      onConfirmOpen();

      setTimeout(() => {
        setShowCelebration(false);
      }, 5000);

    } catch (error) {
      console.error('Payment Error:', error);
      
      setTransactionResult({
        beforeBalance: currentBalance,
        afterBalance: currentBalance,
        isSuccess: false
      });
      
      onConfirmOpen();
      toast({
        title: t('payment.errors.payment_failed'),
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
            <Heading>{t('payment.errors.link_invalid')}</Heading>
            <Text>{t('payment.errors.link_expired')}</Text>
            <Button onClick={() => router.push('/')}>
              {t('payment.labels.go_home')}
            </Button>
          </VStack>
        </Flex>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>
          {t('payment.meta.merchant_title', {
            merchantName: merchantDetails?.attributes?.metadata?.businessName || t('common.merchant')
          })}
        </title>
      </Head>
      <Layout>
        <Flex 
          justifyContent="center" 
          alignItems="center" 
          p={4} 
          bg={useColorModeValue('gray.50', 'gray.800')}
          minHeight="100vh"
        >
          <Box
            w="full"
            maxW="md"
            borderRadius="xl"
            boxShadow="xl"
            p={6}
            bg={useColorModeValue('white', 'gray.700')}
          >
            <VStack spacing={6}>
              <Flex 
                direction="column" 
                align="center" 
                w="full" 
                textAlign="center"
                mb={4}
              >
                {merchantDetails?.attributes?.logo?.data ? (
                  <Image 
                    src={`${backendUrl}${merchantDetails.attributes.logo.data.attributes.url}`} 
                    alt={merchantDetails.attributes.metadata?.businessName || t('common.merchant')}
                    boxSize="150px"
                    objectFit="contain"
                    borderRadius="full"
                    mb={4}
                    boxShadow="md"
                  />
                ) : (
                  <Avatar 
                    bg="blue.500" 
                    color="white"
                    size="2xl"
                    name={merchantDetails?.attributes?.metadata?.businessName || businessName}
                    mb={4}
                  />
                )}
                <VStack spacing={2}>
                  <Heading size="lg" color={useColorModeValue('gray.800', 'white')}>
                    {merchantDetails?.attributes?.metadata?.businessName || businessName}
                  </Heading>
                  <Badge 
                    colorScheme="green" 
                    fontSize="sm"
                  >
                    {t('payment.status.verified')}
                  </Badge>
                </VStack>
              </Flex>

              <Box w="full" p={4} borderRadius="lg" textAlign="center">
                <Text fontSize="sm" color="gray.500">{t('payment.labels.payment_amount')}</Text>
                <Text fontSize="3xl" fontWeight="bold" color="green.500">
                  {paymentDetails.attributes.amount.toLocaleString()} {t('common.currency')}
                </Text>
              </Box>

              {isAuthenticated && (
                <Flex align="center" justify="space-between" p={3} borderRadius="md" w="full">
                  <HStack>
                    <Icon as={FiUser} />
                    <Text>{t('payment.labels.your_balance')}</Text>
              {isWalletLoading ? (
                <Spinner size="sm" />
              ) : (
                <Text fontWeight="bold">
                  {walletData?.data?.attributes?.balance?.toLocaleString() || 0} {t('common.currency')}
                </Text>
              )}
              </HStack>
            </Flex>
          )}

          {isAuthenticated ? (
            <VStack spacing={4} align="stretch" w="full">
              <FormControl>
                <FormLabel>
                  <HStack>
                    <Icon as={FiLock} />
                    <Text>{t('payment.labels.enter_pin')}</Text>
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
              >
                {t('payment.labels.confirm_payment')}
              </Button>
            </VStack>
          ) : (
            <InlineLoginForm onLoginSuccess={handleLoginSuccess} />
          )}
        </VStack>
      </Box>
    </Flex>

    <CelebrationOverlay 
      isSuccess={transactionResult?.isSuccess}
      isActive={showCelebration}
    />

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
export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
    },
  });
  
export default DynamicPaymentPage;