// components/pay/agent/DailyLimitTracker.js
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  CircularProgress,
  CircularProgressLabel,
  Tooltip,
  Icon,
} from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';

const DailyLimitTracker = ({ agentData }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const getTodayTransactions = () => {
    const today = new Date().toISOString().split('T')[0];
    const transactions = agentData?.transactions?.data || [];
    return transactions.filter(tx => 
      tx.attributes.createdAt.startsWith(today)
    );
  };

  const calculateLimits = () => {
    const todayTransactions = getTodayTransactions();
    const dailyLimit = agentData?.dailyTransactionLimit || 10000;

    const deposits = todayTransactions.filter(tx => 
      tx.attributes.type === 'deposit'
    );
    const withdrawals = todayTransactions.filter(tx => 
      tx.attributes.type === 'withdrawal'
    );

    return {
      deposits: {
        used: deposits.reduce((sum, tx) => sum + parseFloat(tx.attributes.amount), 0),
        limit: dailyLimit
      },
      withdrawals: {
        used: withdrawals.reduce((sum, tx) => sum + parseFloat(tx.attributes.amount), 0),
        limit: dailyLimit
      },
      totalTransactions: todayTransactions.length,
      successfulTransactions: todayTransactions.filter(tx => 
        tx.attributes.status === 'completed'
      ).length
    };
  };

  const limitData = calculateLimits();

  const calculatePercentage = (used, limit) => {
    return (used / limit) * 100;
  };

  const getColorScheme = (percentage) => {
    if (percentage >= 90) return 'red';
    if (percentage >= 75) return 'orange';
    if (percentage >= 50) return 'yellow';
    return 'green';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LYD'
    }).format(amount);
  };

  const getRemainingTime = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const depositsPercentage = calculatePercentage(
    limitData?.deposits?.used || 0,
    limitData?.deposits?.limit || 0
  );

  const withdrawalsPercentage = calculatePercentage(
    limitData?.withdrawals?.used || 0,
    limitData?.withdrawals?.limit || 0
  );

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Text fontWeight="medium">Daily Limits</Text>
          <Tooltip label={`Resets in ${getRemainingTime()}`}>
            <Icon as={FiInfo} color="gray.400" />
          </Tooltip>
        </HStack>

        <HStack spacing={8} justify="center">
          {/* Deposits Circle */}
          <VStack>
            <CircularProgress
              value={depositsPercentage}
              size="120px"
              thickness="8px"
              colorScheme={getColorScheme(depositsPercentage)}
            >
              <CircularProgressLabel>
                {depositsPercentage.toFixed(1)}%
              </CircularProgressLabel>
            </CircularProgress>
            <Stat size="sm">
              <StatLabel>Deposits</StatLabel>
              <StatNumber fontSize="md">
                {formatCurrency(limitData?.deposits?.used || 0)}
              </StatNumber>
              <StatHelpText>
                of {formatCurrency(limitData?.deposits?.limit || 0)}
              </StatHelpText>
            </Stat>
          </VStack>

          {/* Withdrawals Circle */}
          <VStack>
            <CircularProgress
              value={withdrawalsPercentage}
              size="120px"
              thickness="8px"
              colorScheme={getColorScheme(withdrawalsPercentage)}
            >
              <CircularProgressLabel>
                {withdrawalsPercentage.toFixed(1)}%
              </CircularProgressLabel>
            </CircularProgress>
            <Stat size="sm">
              <StatLabel>Withdrawals</StatLabel>
              <StatNumber fontSize="md">
                {formatCurrency(limitData?.withdrawals?.used || 0)}
              </StatNumber>
              <StatHelpText>
                of {formatCurrency(limitData?.withdrawals?.limit || 0)}
              </StatHelpText>
            </Stat>
          </VStack>
        </HStack>

        {/* Transaction Counts */}
        <HStack justify="space-between" mt={4}>
          <Stat size="sm">
            <StatLabel>Transactions Today</StatLabel>
            <StatNumber>{limitData?.totalTransactions || 0}</StatNumber>
            <StatHelpText>
              <StatArrow 
                type={limitData?.transactionTrend === 'up' ? 'increase' : 'decrease'} 
              />
              vs. yesterday
            </StatHelpText>
          </Stat>

          <Stat size="sm">
            <StatLabel>Success Rate</StatLabel>
            <StatNumber>
              {((limitData?.successfulTransactions / limitData?.totalTransactions) * 100 || 0).toFixed(1)}%
            </StatNumber>
            <StatHelpText>
              {limitData?.successfulTransactions || 0} of {limitData?.totalTransactions || 0}
            </StatHelpText>
          </Stat>
        </HStack>
      </VStack>
    </Box>
  );
};

export default DailyLimitTracker;