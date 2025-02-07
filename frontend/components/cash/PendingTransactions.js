// components/pay/PendingTransactions.js
import {
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  Skeleton,
  useToast
} from '@chakra-ui/react';
import { Check, X } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

const PendingTransactions = ({ transactions = [], isLoading = false, onUpdate }) => {
  const { token } = useAuth();
  const toast = useToast();

  const handleTransaction = async (txId, action) => {
    try {
      await axios.post(`/api/agent/transaction/${txId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast({
        title: 'Success',
        description: `Transaction ${action === 'approve' ? 'approved' : 'rejected'}`,
        status: 'success',
        duration: 3000,
      });
      
      if (onUpdate) onUpdate();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} transaction`,
        status: 'error',
        duration: 5000,
      });
    }
  };

  if (isLoading) {
    return [...Array(3)].map((_, i) => (
      <Skeleton key={i} height="60px" mb={2} />
    ));
  }

  return (
    <VStack spacing={3} align="stretch">
      {transactions.length === 0 ? (
        <Text color="gray.500">No pending transactions</Text>
      ) : (
        transactions.map((tx) => (
          <HStack key={tx.id} justify="space-between" p={3} bg="gray.50" borderRadius="md">
            <VStack align="start" spacing={1}>
              <Text fontWeight="medium">
                {tx.type === 'deposit' ? 'Cash Deposit' : 'Cash Withdrawal'}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {formatCurrency(tx.amount)}
              </Text>
            </VStack>
            
            <HStack>
              <Badge 
                colorScheme={
                  tx.status === 'pending' ? 'yellow' : 
                  tx.status === 'completed' ? 'green' : 
                  'red'
                }
              >
                {tx.status}
              </Badge>
              
              {tx.status === 'pending' && (
                <>
                  <IconButton
                    size="sm"
                    colorScheme="green"
                    icon={<Check size={16} />}
                    onClick={() => handleTransaction(tx.id, 'approve')}
                    aria-label="Approve"
                  />
                  <IconButton
                    size="sm"
                    colorScheme="red"
                    icon={<X size={16} />}
                    onClick={() => handleTransaction(tx.id, 'reject')}
                    aria-label="Reject"
                  />
                </>
              )}
            </HStack>
          </HStack>
        ))
      )}
    </VStack>
  );
};

export default PendingTransactions;