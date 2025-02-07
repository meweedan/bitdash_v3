// hooks/useTransfer.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@chakra-ui/react';

export const useTransfer = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ recipientId, amount, pin }) => {
      try {
        // Fetch sender's wallet using the alternative method
        const senderWalletResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallets?populate=*&filters[customer][users_permissions_user][id][$eq]=${user.id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!senderWalletResponse.ok) {
          const errorText = await senderWalletResponse.text();
          console.error('Sender Wallet Fetch Error:', {
            status: senderWalletResponse.status,
            body: errorText
          });
          throw new Error('Failed to fetch sender wallet');
        }

        const senderWalletData = await senderWalletResponse.json();
        
        if (!senderWalletData.data || senderWalletData.data.length === 0) {
          throw new Error('No wallet found for the sender');
        }

        const senderWalletId = senderWalletData.data[0].id;

        // Fetch recipient's wallet
        const recipientWalletResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallets?populate=*&filters[customer][id][$eq]=${recipientId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!recipientWalletResponse.ok) {
          const errorText = await recipientWalletResponse.text();
          console.error('Recipient Wallet Fetch Error:', {
            status: recipientWalletResponse.status,
            body: errorText
          });
          throw new Error('Failed to fetch recipient wallet');
        }

        const recipientWalletData = await recipientWalletResponse.json();
        
        if (!recipientWalletData.data || recipientWalletData.data.length === 0) {
          throw new Error('No wallet found for the recipient');
        }

        const recipientWalletId = recipientWalletData.data[0].id;

        // Process transfer
        const transferResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallets/transfer`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              senderId: senderWalletId,
              recipientId: recipientWalletId,
              amount: parseFloat(amount),
              pin
            })
          }
        );

        const result = await transferResponse.json();

        console.log('Transfer Response:', {
          status: transferResponse.status,
          result,
          senderWalletId,
          recipientWalletId
        });

        if (!transferResponse.ok) {
          throw new Error(result.error?.message || 'Transfer failed');
        }

        return result;
      } catch (error) {
        console.error('Complete transfer error:', error);
        
        toast({
          title: 'Transfer Failed',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        });

        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['walletBalance']);
      queryClient.invalidateQueries(['wallet']);

      toast({
        title: 'Transfer Successful',
        description: 'Money transferred successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    },
    onError: (error) => {
      console.error('Transfer mutation error:', error);
    }
  });
};