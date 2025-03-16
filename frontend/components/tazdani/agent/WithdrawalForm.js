// components/pay/agent/WithdrawalForm.js
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

const WithdrawalForm = ({ selectedCustomer, onComplete }) => {
  const [amount, setAmount] = useState('');
  const toast = useToast();
  const queryClient = useQueryClient();

  const createWithdrawal = useMutation({
    mutationFn: async (withdrawalData) => {
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
              amount: parseFloat(withdrawalData.amount),
              type: 'withdrawal',
              status: 'completed',
              customer: selectedCustomer.id,
              publishedAt: new Date().toISOString()
            }
          })
        }
      );
      if (!response.ok) throw new Error('Failed to process withdrawal');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries('agentData');
      toast({
        title: 'Success',
        description: 'Withdrawal processed successfully',
        status: 'success'
      });
      onComplete();
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createWithdrawal.mutate({ amount });
  };

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={4}>
      {selectedCustomer && (
        <Text fontWeight="bold">
          Customer: {selectedCustomer.attributes.name}
        </Text>
      )}

      <FormControl isRequired>
        <FormLabel>Withdrawal Amount</FormLabel>
        <InputGroup>
          <InputLeftAddon>LYD</InputLeftAddon>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </InputGroup>
      </FormControl>

      <Button
        type="submit"
        colorScheme="blue"
        isLoading={createWithdrawal.isLoading}
        w="full"
      >
        Process Withdrawal
      </Button>
    </VStack>
  );
};


export default WithdrawalForm;