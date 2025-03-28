import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recipientId, amount, pin }) => {
      try {
        const token = await AsyncStorage.getItem('token');
        const user = JSON.parse(await AsyncStorage.getItem('user'));

        // Fetch sender's wallet
        const senderWalletResponse = await fetch(
          `${process.env.API_URL}/api/wallets?populate=*&filters[customer][users_permissions_user][id][$eq]=${user.id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!senderWalletResponse.ok) throw new Error('Failed to fetch sender wallet');
        const senderWalletData = await senderWalletResponse.json();
        const senderWalletId = senderWalletData.data[0]?.id;

        // Fetch recipient's wallet
        const recipientWalletResponse = await fetch(
          `${process.env.API_URL}/api/wallets?populate=*&filters[customer][id][$eq]=${recipientId}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        if (!recipientWalletResponse.ok) throw new Error('Failed to fetch recipient wallet');
        const recipientWalletData = await recipientWalletResponse.json();
        const recipientWalletId = recipientWalletData.data[0]?.id;

        // Process transfer
        const transferResponse = await fetch(
          `${process.env.API_URL}/api/wallets/transfer`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
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
        if (!transferResponse.ok) throw new Error(result.error?.message || 'Transfer failed');
        
        return result;
      } catch (error) {
        Alert.alert('Transfer Failed', error.message);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['walletBalance']);
      queryClient.invalidateQueries(['wallet']);
      Alert.alert('Success', 'Money transferred successfully');
    }
  });
};