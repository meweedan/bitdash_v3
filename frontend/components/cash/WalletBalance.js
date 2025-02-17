// components/pay/WalletBalance.js
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  VStack,
  Text,
  HStack,
  Spinner,
  useColorModeValue
} from '@chakra-ui/react';
import { FiDollarSign } from 'react-icons/fi';

const WalletBalance = ({ type }) => {
  // Fetch wallet data based on user type (merchant, customer, agent)
  const { data: wallet, isLoading } = useQuery({
    queryKey: ['walletBalance', type],
    queryFn: async () => {
      const userId = JSON.parse(localStorage.getItem('user'))?.id;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallets?populate=*&filters[${type}][users_permissions_user][id][$eq]=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch wallet');
      return response.json();
    },
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box
      p={6}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      w="full"
    >
      <VStack align="start" spacing={2}>
        <HStack>
          <FiDollarSign size={24} color="green" />
          <Text fontSize="lg" color="gray.500">Available Balance</Text>
        </HStack>
        <HStack spacing={2} mt={2}>
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <Text fontSize="3xl" fontWeight="bold">
                {wallet?.data?.[0]?.attributes?.balance?.toLocaleString() || '0'}
              </Text>
              <Text fontSize="xl" color="gray.500">
                {wallet?.data?.[0]?.attributes?.currency || 'LYD'}
              </Text>
            </>
          )}
        </HStack>
        <Text fontSize="sm" color="gray.500">
          Daily Limit: {wallet?.data?.[0]?.attributes?.dailyLimit?.toLocaleString() || '0'} LYD
        </Text>
      </VStack>
    </Box>
  );
};

export default WalletBalance;