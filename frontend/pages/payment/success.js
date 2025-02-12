// pages/payment/success.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
    useToast,
    Box,
    VStack,
    Text,
    Spinner
 } from '@chakra-ui/react';

export default function PaymentSuccess() {
  const router = useRouter();
  const toast = useToast();
  const { type, id } = router.query;

  useEffect(() => {
    const updatePayment = async () => {
      const token = localStorage.getItem('token');
      
      try {
        // Update payment status
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              status: 'completed'
            }
          })
        });

        toast({
          title: 'Payment Successful',
          status: 'success',
          duration: 5000
        });

        // Redirect based on payment type
        if (type === 'voucher') {
          router.push('/wallet');
        } else {
          router.push('/operator/dashboard');
        }

      } catch (error) {
        console.error('Error updating payment:', error);
        toast({
          title: 'Error',
          description: 'There was an error confirming your payment',
          status: 'error',
          duration: 5000
        });
      }
    };

    if (id) {
      updatePayment();
    }
  }, [id]);

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={4}>
        <Spinner size="xl" />
        <Text>Processing your payment...</Text>
      </VStack>
    </Box>
  );
}