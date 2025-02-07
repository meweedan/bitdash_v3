import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@chakra-ui/react';

export function useWithdraw(options = {}) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ customerId, amount, customerPin }) => {
      try {
        // Fetch customer's wallet
        const customerWalletResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallets?filters[customer][id][$eq]=${customerId}&populate=*`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!customerWalletResponse.ok) {
          throw new Error('Failed to fetch customer wallet');
        }

        const customerWalletData = await customerWalletResponse.json();
        
        if (!customerWalletData.data || customerWalletData.data.length === 0) {
          throw new Error('No wallet found for the customer');
        }

        const customerWalletId = customerWalletData.data[0].id;

        // Get agent data from localStorage
        const agentDataString = localStorage.getItem('agentData');
        let agentData = JSON.parse(agentDataString);
        const agentId = agentData?.data?.[0]?.id;

        // Perform withdrawal
        const withdrawalResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallets/withdraw`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              customerId: customerWalletId,
              agentId,
              amount: parseFloat(amount),
              pin: customerPin
            })
          }
        );

        const result = await withdrawalResponse.json();

        console.log('Withdrawal Response:', {
          status: withdrawalResponse.status,
          result,
          customerWalletId,
          agentId
        });

        if (!withdrawalResponse.ok) {
          throw new Error(result.error?.message || 'Withdrawal failed');
        }

        return result;
      } catch (error) {
        console.error('Withdrawal error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['agentData']);
      queryClient.invalidateQueries(['wallet']);
      queryClient.invalidateQueries(['walletBalance']);
      
      toast({
        title: 'Success',
        description: 'Withdrawal completed successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    },
    onError: (error) => {
      console.error('Withdrawal mutation error:', error);
      
      toast({
        title: 'Withdrawal Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    },
    ...options
  });
}