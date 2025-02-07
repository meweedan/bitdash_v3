// hooks/useWallet.js
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

export const useWallet = () => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['wallet', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User ID is required');
      
      // Ensure token exists
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token is missing');

      // Default to customer type unless specifically a merchant
      const userType = user.role?.type === 'merchant' ? 'merchant' : 'customer';
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallets/${userType}/${user.id}/public`,
        {
          method: 'GET', // Explicitly set method
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Wallet fetch error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(errorText || 'Failed to fetch wallet');
      }

      return response.json();
    },
    enabled: !!user?.id && isAuthenticated,
    staleTime: 5000,
    refetchOnWindowFocus: true,
    retry: 2,
    onError: (error) => {
      console.error('Wallet query error:', error);
    }
  });
};