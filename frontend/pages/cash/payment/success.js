import React, { useEffect, useState } from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  Text, 
  Icon, 
  Flex, 
  Button,
  useColorModeValue 
} from "@chakra-ui/react";
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';
import { useWallet } from '@/hooks/useWallet';
import CelebrationOverlay from '@/components/common/CelebrationOverlay';

const PaymentSuccessPage = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { data: wallet } = useWallet();
  const [transactionDetails, setTransactionDetails] = useState({
    amount: 0,
    merchantName: '',
    transactionId: ''
  });
  const [showCelebration, setShowCelebration] = useState(true);

  const bgColor = useColorModeValue('green.50', 'green.900');
  const textColor = useColorModeValue('green.700', 'green.200');

  useEffect(() => {
    // Retrieve transaction details from localStorage
    const storedTransaction = localStorage.getItem('lastTransaction');
    if (storedTransaction) {
      try {
        const parsedTransaction = JSON.parse(storedTransaction);
        setTransactionDetails(parsedTransaction);
        
        // Clear the stored transaction
        localStorage.removeItem('lastTransaction');

        // Hide celebration after 5 seconds
        const celebrationTimer = setTimeout(() => {
          setShowCelebration(false);
        }, 5000);

        return () => clearTimeout(celebrationTimer);
      } catch (error) {
        console.error('Error parsing transaction details:', error);
      }
    }
  }, []);

  const handleBackToDashboard = () => {
    router.push('/client/dashboard');
  };

  return (
    <Layout>
      <CelebrationOverlay 
        isSuccess={true}
        isActive={showCelebration}
      />
      <Flex 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
        bg={bgColor}
      >
        <Box 
          maxW="md" 
          textAlign="center" 
          p={8} 
          borderRadius="xl" 
          boxShadow="xl"
          bg={useColorModeValue('white', 'gray.800')}
        >
          <VStack spacing={6}>
            <Icon 
              as={CheckCircle} 
              color="green.500" 
              boxSize={20} 
            />
            
            <Heading 
              size="xl" 
              color={textColor}
            >
              {t('payment.success.title')}
            </Heading>
            
            <VStack spacing={4}>
              <Text>
                {t('payment.success.amount_paid')}: 
                <Text as="span" fontWeight="bold" color="green.500">
                  {` ${transactionDetails.amount.toLocaleString()} LYD`}
                </Text>
              </Text>
              
              <Text>
                {t('payment.success.merchant')}: 
                <Text as="span" fontWeight="bold">
                  {` ${transactionDetails.merchantName}`}
                </Text>
              </Text>
              
              {transactionDetails.transactionId && (
                <Text fontSize="sm" color="gray.500">
                  {t('payment.success.transaction_id')}: {transactionDetails.transactionId}
                </Text>
              )}
              
              <Text>
                {t('payment.success.new_balance')}: 
                <Text as="span" fontWeight="bold" color="blue.500">
                  {` ${wallet?.data?.attributes?.balance?.toLocaleString() || 0} LYD`}
                </Text>
              </Text>
            </VStack>
            
            <Button 
              colorScheme="green" 
              size="lg" 
              onClick={handleBackToDashboard}
            >
              {t('payment.success.back_to_dashboard')}
            </Button>
          </VStack>
        </Box>
      </Flex>
    </Layout>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default PaymentSuccessPage;