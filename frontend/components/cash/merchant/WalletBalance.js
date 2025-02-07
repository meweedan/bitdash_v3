// components/pay/WalletBalance.js
import React from 'react';
import { 
  Text, 
  VStack, 
  HStack, 
  Icon,
  Badge
} from '@chakra-ui/react';
import { 
  FiCreditCard, 
  FiTrendingUp, 
  FiTrendingDown 
} from 'react-icons/fi';

const WalletBalance = ({ 
  balance = 0,
  currency = 'LYD',
  isActive = true,
  walletId = 'N/A',
  blockedFunds = 0,
  businessName = 'Business Account'
}) => {
  const availableBalance = balance - blockedFunds;

  return (
    <VStack align="stretch" spacing={2} w="full">
      <Text fontWeight="bold" fontSize="3xl">
        {parseFloat(balance).toLocaleString()} {currency}
      </Text>

      <VStack align="stretch" spacing={2} mt={2}>
        <HStack justify="space-between">
          <HStack>
            <Icon as={FiTrendingUp} color="green.500" />
            <Text fontSize="sm">Available Balance</Text>
          </HStack>
          <Text fontWeight="bold" color="green.500">
            {parseFloat(availableBalance).toLocaleString()} {currency}
          </Text>
        </HStack>
        <HStack justify="space-between">
          <HStack>
            <Icon as={FiTrendingDown} color="red.500" />
            <Text fontSize="sm">Blocked Funds</Text>
          </HStack>
          <Text fontWeight="bold" color="red.500">
            {parseFloat(blockedFunds).toLocaleString()} {currency}
          </Text>
        </HStack>
      </VStack>

      <HStack justify="space-between" mt={2} fontSize="sm" color="gray.500">
        <HStack>
          <Icon as={FiCreditCard} />
          <Text>{businessName}</Text>
        </HStack>
        <Badge colorScheme={isActive ? 'green' : 'yellow'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      </HStack>
    </VStack>
  );
};

export default WalletBalance;