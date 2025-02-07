// components/pay/CashBalance.js
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import { formatCurrency } from '@/utils/format';

const CashBalance = ({ balance = 0, dailyLimit = 50000, usage = 0 }) => {
  const percentage = (usage / dailyLimit) * 100;
  const remainingLimit = dailyLimit - usage;

  return (
    <Box>
      <HStack spacing={8} align="start">
        <Stat>
          <StatLabel>Cash Balance</StatLabel>
          <StatNumber>{formatCurrency(balance)}</StatNumber>
          <StatHelpText>
            <StatArrow type={balance > 0 ? 'increase' : 'decrease'} />
            Updated just now
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Daily Limit Usage</StatLabel>
          <StatNumber>{formatCurrency(usage)}</StatNumber>
          <StatHelpText>
            Remaining: {formatCurrency(remainingLimit)}
          </StatHelpText>
        </Stat>
      </HStack>

      <Box mt={4}>
        <Text mb={2} fontSize="sm">Daily Limit Usage ({percentage.toFixed(1)}%)</Text>
        <Progress 
          value={percentage} 
          colorScheme={percentage > 80 ? 'red' : percentage > 60 ? 'yellow' : 'green'} 
          borderRadius="full"
        />
      </Box>
    </Box>
  );
};

export default CashBalance;