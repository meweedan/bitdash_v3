// hooks/useWithdraw.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useWithdraw(options = {}) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ customerId, amount, customerPin }) => {
      try {
        const token = await AsyncStorage.getItem('token');
        const customerWalletResponse = await fetch(
          `${process.env.API_URL}/api/wallets?filters[customer][id][$eq]=${customerId}&populate=*`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
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

        const agentDataString = await AsyncStorage.getItem('agentData');
        const agentData = JSON.parse(agentDataString);
        const agentId = agentData?.data?.[0]?.id;

        const withdrawalResponse = await fetch(
          `${process.env.API_URL}/api/wallets/withdraw`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
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
      
      Alert.alert('Success', 'Withdrawal completed successfully');
    },
    onError: (error) => {
      console.error('Withdrawal mutation error:', error);
      Alert.alert('Withdrawal Failed', error.message);
    },
    ...options
  });
}