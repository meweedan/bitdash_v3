// components/transfers/TransferStatus.js
import { useEffect, useState } from 'react';
import {
  VStack,
  Text,
  Progress,
  HStack,
  Avatar,
  Icon,
  Box,
  Button,
  useInterval,
} from '@chakra-ui/react';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const TransferStatus = ({ transferId, amount, recipient, onComplete }) => {
  const [status, setStatus] = useState('processing');
  const [progress, setProgress] = useState(0);

  const { data: transaction } = useQuery({
    queryKey: ['transaction', transferId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions/${transferId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch transaction');
      return response.json();
    },
    refetchInterval: status === 'processing' ? 1000 : false,
    enabled: !!transferId
  });

  useEffect(() => {
    if (transaction?.data?.attributes?.status === 'completed') {
      setStatus('complete');
    }
  }, [transaction]);

  useInterval(() => {
    if (status === 'processing' && progress < 100) {
      setProgress(p => Math.min(p + 20, 100));
    }
  }, 500);

  return (
    <VStack spacing={8} align="center" py={8}>
      {status === 'processing' ? (
        <>
          <Progress 
            value={progress} 
            size="sm"
            width="100%"
            borderRadius="full"
            colorScheme="blue"
            isAnimated
          />
          <Text fontSize="xl" fontWeight="medium">
            Processing Transfer
          </Text>
          <Text color="gray.500">
            {progress < 40 ? 'Initiating transfer...' :
             progress < 70 ? 'Processing payment...' :
             'Almost done...'}
          </Text>
        </>
      ) : (
        <MotionBox
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <VStack spacing={4}>
            <Box
              bg="green.100"
              p={4}
              borderRadius="full"
            >
              <Icon as={FiCheck} w={8} h={8} color="green.500" />
            </Box>
            <Text fontSize="xl" fontWeight="medium">
              Transfer Complete
            </Text>
          </VStack>
        </MotionBox>
      )}

      <HStack spacing={8}>
        <VStack>
          <Avatar size="lg" name={recipient.attributes.fullName} />
          <Text>{recipient.attributes.fullName}</Text>
        </VStack>
        <Icon as={FiArrowRight} w={6} h={6} color="blue.500" />
        <VStack>
          <Text fontSize="2xl" fontWeight="bold">
            {parseFloat(amount).toLocaleString()} LYD
          </Text>
        </VStack>
      </HStack>

      {status === 'complete' && (
        <Button
          colorScheme="blue"
          size="lg"
          onClick={onComplete}
        >
          Done
        </Button>
      )}
    </VStack>
  );
};

export default TransferStatus;