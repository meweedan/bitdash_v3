import React, { useEffect, useState } from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  Text, 
  Icon, 
  Flex, 
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue 
} from "@chakra-ui/react";
import { AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';

const PaymentFailedPage = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [errorDetails, setErrorDetails] = useState({
    amount: 0,
    merchantName: '',
    errorMessage: ''
  });

  const bgColor = useColorModeValue('red.50', 'red.900');
  const textColor = useColorModeValue('red.700', 'red.200');

  useEffect(() => {
    // Retrieve error details from localStorage
    const storedErrorDetails = localStorage.getItem('paymentErrorDetails');
    if (storedErrorDetails) {
      try {
        const parsedErrorDetails = JSON.parse(storedErrorDetails);
        setErrorDetails(parsedErrorDetails);
        
        // Clear the stored error details
        localStorage.removeItem('paymentErrorDetails');
      } catch (error) {
        console.error('Error parsing payment error details:', error);
      }
    }
  }, []);

  const handleRetryPayment = () => {
    // Redirect back to previous payment page or payment links
    router.push('/payments');
  };

  const handleBackToDashboard = () => {
    router.push('/client/dashboard');
  };

  return (
    <Layout>
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
              as={AlertTriangle} 
              color="red.500" 
              boxSize={20} 
            />
            
            <Heading 
              size="xl" 
              color={textColor}
            >
              {t('payment.failed.title')}
            </Heading>
            
            <Alert 
              status="error" 
              variant="subtle" 
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              borderRadius="lg"
            >
              <AlertIcon boxSize={10} mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                {t('payment.failed.error_occurred')}
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                {errorDetails.errorMessage || t('payment.failed.generic_error')}
              </AlertDescription>
            </Alert>

            <VStack spacing={4} w="full">
              {errorDetails.amount > 0 && (
                <Text>
                  {t('payment.failed.attempted_amount')}: 
                  <Text as="span" fontWeight="bold" color="red.500">
                    {` ${errorDetails.amount.toLocaleString()} LYD`}
                  </Text>
                </Text>
              )}
              
              {errorDetails.merchantName && (
                <Text>
                  {t('payment.failed.merchant')}: 
                  <Text as="span" fontWeight="bold">
                    {` ${errorDetails.merchantName}`}
                  </Text>
                </Text>
              )}
            </VStack>
            
            <Flex gap={4} w="full" justifyContent="center">
              <Button 
                colorScheme="red" 
                variant="outline"
                onClick={handleRetryPayment}
              >
                {t('payment.failed.retry_payment')}
              </Button>
              
              <Button 
                colorScheme="blue" 
                onClick={handleBackToDashboard}
              >
                {t('payment.failed.back_to_dashboard')}
              </Button>
            </Flex>
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

export default PaymentFailedPage;