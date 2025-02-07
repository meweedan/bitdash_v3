// components/pay/agent/TransactionForm.js
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  InputGroup,
  InputLeftAddon,
  Text
} from '@chakra-ui/react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';


const TransactionForm = ({ selectedCustomer, type }) => {
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const queryClient = useQueryClient();

  const processTransaction = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            data: {
              amount: parseFloat(data.amount),
              currency: 'LYD',
              type: data.type, // deposit or withdrawal
              status: 'pending',
              agent: data.agentId,
              customer: data.customerId,
              pin: data.pin
            }
          })
        }
      );
      if (!response.ok) throw new Error('Transaction failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agentBalance'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });

  return (
    <VStack spacing={4}>
      <Input 
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Input 
        type="password"
        placeholder="Customer PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />
      <Button 
        onClick={() => processTransaction.mutate({
          amount,
          pin,
          type,
          customerId: selectedCustomer.id,
          agentId: currentAgent.id
        })}
      >
        Process {type === 'deposit' ? 'Deposit' : 'Withdrawal'}
      </Button>
    </VStack>
  );
};

export default TransactionForm;