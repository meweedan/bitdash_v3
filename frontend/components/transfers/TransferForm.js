// components/transfers/TransferForm.js
import { useState } from 'react';
import {
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  NumberInput,
  NumberInputField,
  Box,
  useToast,
  IconButton,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiArrowLeft, FiPlus, FiUser } from 'react-icons/fi';
import { useMutation } from '@tanstack/react-query';
import TransferStatus from './TransferStatus';
import PinInput from '@/components/PinInput';

const TransferForm = ({ recipient, onBack, onComplete }) => {
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [step, setStep] = useState('amount'); // amount, confirm, processing
  const [transferId, setTransferId] = useState(null);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  

  const transfer = useMutation({
    mutationFn: async ({ recipientId, amount, pin }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallets/transfer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            recipientId,
            amount: parseFloat(amount),
            pin,
            type: 'transfer'
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onSuccess: (data) => {
      setTransferId(data.transactionId);
      setStep('processing');
    },
    onError: (error) => {
      toast({
        title: 'Transfer failed',
        description: error.message,
        status: 'error',
        duration: 5000
      });
      setStep('amount');
    }
  });

  const handleSubmit = () => {
    if (step === 'amount') {
      if (!amount || parseFloat(amount) <= 0) {
        toast({
          title: 'Invalid amount',
          status: 'error',
          duration: 2000
        });
        return;
      }
      setStep('confirm');
    } else if (step === 'confirm') {
      if (!pin || pin.length !== 6) {
        toast({
          title: 'Invalid PIN',
          status: 'error',
          duration: 2000
        });
        return;
      }
      transfer.mutate({
        recipientId: recipient.id,
        amount,
        pin
      });
    }
  };

  if (step === 'processing') {
    return (
      <TransferStatus 
        transferId={transferId}
        amount={amount}
        recipient={recipient}
        onComplete={onComplete}
      />
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <HStack>
        <IconButton
          icon={<FiArrowLeft />}
          variant="ghost"
          onClick={onBack}
        />
        <Text fontSize="lg" fontWeight="medium">Transfer Money</Text>
      </HStack>

      <VStack 
        spacing={4} 
        bg={bgColor} 
        p={6} 
        borderRadius="lg"
        align="center"
      >
        <Avatar 
          size="xl"
          name={recipient.attributes.fullName}
          src={recipient.attributes.profile_image?.url}
        />
        <Text fontSize="xl" fontWeight="medium">
          {recipient.attributes.fullName}
        </Text>

        {step === 'amount' ? (
          <VStack spacing={8} w="full">
            <NumberInput
              min={0}
              value={amount}
              onChange={setAmount}
              size="lg"
            >
              <NumberInputField
                textAlign="center"
                fontSize="4xl"
                fontWeight="bold"
                placeholder="0"
                border="none"
                _focus={{
                  boxShadow: 'none'
                }}
              />
            </NumberInput>
            <Text color="gray.500">LYD</Text>
          </VStack>
        ) : (
          <VStack spacing={4} w="full">
            <Text color="gray.500">Enter your PIN</Text>
            <PinInput value={pin} onChange={setPin} />
            <HStack justify="space-between" w="full">
              <Text color="gray.500">Amount</Text>
              <Text fontWeight="bold">{parseFloat(amount).toLocaleString()} LYD</Text>
            </HStack>
          </VStack>
        )}
      </VStack>

      <Button
        colorScheme="blue"
        size="lg"
        onClick={handleSubmit}
        isLoading={transfer.isLoading}
      >
        {step === 'amount' ? 'Continue' : 'Confirm Transfer'}
      </Button>
    </VStack>
  );
};

export default TransferForm;