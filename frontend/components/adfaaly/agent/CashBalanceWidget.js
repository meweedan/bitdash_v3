// components/pay/agent/CashBalanceWidget.js
import {
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider
} from '@chakra-ui/react';
import { ArrowDownCircle, ArrowUpCircle, AlertTriangle } from 'lucide-react';

const CashBalanceWidget = ({ data, onDeposit, onWithdraw }) => {
  const isLowCash = data.cashBalance < data.minCashBalance;
  const isHighCash = data.cashBalance > data.maxCashBalance * 0.9;

  return (
    <VStack spacing={6} align="stretch" p={6}>
      {/* Balance Display */}
      <Stat>
        <StatLabel fontSize="lg">Cash Balance</StatLabel>
        <StatNumber fontSize="4xl" fontWeight="bold">
          {data.cashBalance?.toLocaleString()} LYD
        </StatNumber>
        <StatHelpText>
          Daily Limit: {data.dailyTransactionLimit?.toLocaleString()} LYD
        </StatHelpText>
      </Stat>

      <Divider />

      {/* Alerts */}
      {(isLowCash || isHighCash) && (
        <HStack 
          spacing={3} 
          p={4} 
          bg={isLowCash ? 'red.50' : 'yellow.50'} 
          color={isLowCash ? 'red.600' : 'yellow.700'}
          rounded="lg"
        >
          <Icon as={AlertTriangle} boxSize={5} />
          <Text fontSize="sm" fontWeight="medium">
            {isLowCash 
              ? 'Low cash balance. Consider limiting withdrawals.' 
              : 'High cash balance. Consider limiting deposits.'}
          </Text>
        </HStack>
      )}

      {/* Action Buttons */}
      <HStack spacing={4}>
        <Button
          flex={1}
          size="lg"
          colorScheme="green"
          leftIcon={<ArrowDownCircle />}
          onClick={onDeposit}
          isDisabled={isHighCash}
        >
          Deposit
        </Button>
        <Button
          flex={1}
          size="lg"
          colorScheme="blue"
          leftIcon={<ArrowUpCircle />}
          onClick={onWithdraw}
          isDisabled={isLowCash}
        >
          Withdraw
        </Button>
      </HStack>
    </VStack>
  );
};

export default CashBalanceWidget;