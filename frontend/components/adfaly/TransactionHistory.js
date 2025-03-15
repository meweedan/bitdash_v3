// frontend/components/pay/TransactionHistory.js
import { useQuery } from '@tanstack/react-query';
import {
  VStack,
  Box,
  Text,
  Badge,
  Spinner,
  HStack,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { FiArrowUpRight, FiArrowDownLeft, FiRepeat } from 'react-icons/fi';

const TransactionHistory = ({ type = 'all', limit }) => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', type],
    queryFn: async () => {
      const userId = JSON.parse(localStorage.getItem('user'))?.id;
      let endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions?populate=*`;
      
      if (type !== 'all') {
        endpoint += `&filters[${type}][users_permissions_user][id][$eq]=${userId}`;
      }
      if (limit) {
        endpoint += `&pagination[limit]=${limit}`;
      }

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch transactions');
      return response.json();
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const getTransactionIcon = (transactionType) => {
    switch (transactionType) {
      case 'deposit': return FiArrowDownLeft;
      case 'withdrawal': return FiArrowUpRight;
      default: return FiRepeat;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'pending': return 'yellow';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <VStack spacing={4} align="stretch">
      {transactions?.data?.map((transaction) => (
        <Box
          key={transaction.id}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
        >
          <HStack justify="space-between">
            <HStack>
              <Icon 
                as={getTransactionIcon(transaction.attributes.type)}
                color={`${getStatusColor(transaction.attributes.status)}.500`}
                boxSize={5}
              />
              <VStack align="start" spacing={0}>
                <Text fontWeight="medium">
                  {transaction.attributes.type.charAt(0).toUpperCase() + 
                   transaction.attributes.type.slice(1)}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(transaction.attributes.createdAt).toLocaleString()}
                </Text>
              </VStack>
            </HStack>
            <VStack align="end" spacing={0}>
              <Text fontWeight="bold">
                {transaction.attributes.amount} {transaction.attributes.currency}
              </Text>
              <Badge colorScheme={getStatusColor(transaction.attributes.status)}>
                {transaction.attributes.status}
              </Badge>
            </VStack>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};

export default TransactionHistory;