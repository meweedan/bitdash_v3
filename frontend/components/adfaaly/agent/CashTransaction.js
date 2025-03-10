// frontend/components/pay/agent/CashTransaction.js
import { useState } from 'react';
import {
  VStack,
  Input,
  Button,
  Text,
  useToast,
  Select,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CashTransaction = ({ agentId }) => {
  const [amount, setAmount] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [pin, setPin] = useState('');
  const [type, setType] = useState('deposit');
  const toast = useToast();
  const queryClient = useQueryClient();

  const processTransaction = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agents/process-transaction`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            data: {
              amount: parseFloat(data.amount),
              customerId: data.customerId,
              type: data.type,
              pin: data.pin,
              agentId
            }
          })
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Transaction failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['agentBalance']);
      queryClient.invalidateQueries(['transactions']);
      
      toast({
        title: 'Transaction Successful',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} of ${data.amount} LYD processed`,
        status: 'success',
        duration: 5000
      });

      // Reset form
      setAmount('');
      setCustomerId('');
      setPin('');
    },
    onError: (error) => {
      toast({
        title: 'Transaction Failed',
        description: error.message,
        status: 'error',
        duration: 5000
      });
    }
  });

  const handleSubmit = () => {
    if (!amount || !customerId || (type === 'withdrawal' && !pin)) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000
      });
      return;
    }

    processTransaction.mutate({
      amount,
      customerId,
      type,
      pin
    });
  };

  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>Transaction Type</FormLabel>
        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="deposit">Cash Deposit</option>
          <option value="withdrawal">Cash Withdrawal</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Amount (LYD)</FormLabel>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Customer ID/Phone</FormLabel>
        <Input
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          placeholder="Enter customer ID or phone"
        />
      </FormControl>

      {type === 'withdrawal' && (
        <FormControl>
          <FormLabel>Customer PIN</FormLabel>
          <Input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter customer PIN"
            maxLength={6}
          />
        </FormControl>
      )}

      <Button
        colorScheme="blue"
        onClick={handleSubmit}
        isLoading={processTransaction.isLoading}
      >
        Process {type.charAt(0).toUpperCase() + type.slice(1)}
      </Button>
    </VStack>
  );
};