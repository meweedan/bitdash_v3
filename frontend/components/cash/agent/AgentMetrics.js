// components/pay/agent/AgentMetrics.js
import {
  SimpleGrid,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  CircularProgress,
  CircularProgressLabel,
  useColorModeValue,
} from '@chakra-ui/react';

const MetricCard = ({ label, value, change, suffix = '', format = (v) => v }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
      transition="all 0.2s"
    >
      <Stat>
        <StatLabel color="gray.500">{label}</StatLabel>
        <StatNumber fontSize="2xl">
          {format(value)}{suffix}
        </StatNumber>
        {change && (
          <StatHelpText>
            <StatArrow type={change > 0 ? 'increase' : 'decrease'} />
            {Math.abs(change)}%
          </StatHelpText>
        )}
      </Stat>
    </Box>
  );
};

const AgentMetrics = ({ agentData, walletData, dailyStats }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LYD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Existing metrics, but use dailyStats
  const metrics = {
    dailyVolume: dailyStats.totalVolume,
    transactionCount: dailyStats.totalTransactions,
    deposits: dailyStats.deposits,
    withdrawals: dailyStats.withdrawals,
    
    // Add more advanced metrics
    averageTransactionValue: dailyStats.totalVolume / (dailyStats.totalTransactions || 1),
    
    // Performance tracking
    performanceScore: calculatePerformanceScore(dailyStats)
  };

  function calculatePerformanceScore(stats) {
    // Complex scoring based on transaction volume, count, and types
    const volumeScore = Math.min(stats.totalVolume / 10000, 1) * 40;
    const transactionScore = Math.min(stats.totalTransactions / 50, 1) * 30;
    const diversityScore = calculateDiversityBonus(stats);
    return Math.round(volumeScore + transactionScore + diversityScore);
  }

  function calculateDiversityBonus(stats) {
    const hasDeposits = stats.deposits > 0;
    const hasWithdrawals = stats.withdrawals > 0;
    const depositWithdrawalRatio = hasDeposits && hasWithdrawals 
      ? Math.abs(stats.deposits - stats.withdrawals) / Math.max(stats.deposits, stats.withdrawals)
      : 0;
    return (hasDeposits && hasWithdrawals ? (1 - depositWithdrawalRatio) * 30 : 0);
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
      {/* Daily Volume */}
      <MetricCard
        label="Daily Volume"
        value={metrics.dailyVolume}
        format={formatCurrency}
      />

      {/* Deposits */}
      <MetricCard
        label="Total Deposits"
        value={metrics.deposits}
        format={formatCurrency}
      />

      {/* Withdrawals */}
      <MetricCard
        label="Total Withdrawals"
        value={metrics.withdrawals}
        format={formatCurrency}
      />

      {/* Performance Score */}
      <MetricCard
        label="Performance Score"
        value={metrics.performanceScore}
        suffix="/100"
      />

      {/* Avg Transaction Value */}
      <MetricCard
        label="Avg Transaction"
        value={metrics.averageTransactionValue}
        format={formatCurrency}
      />

      {/* Transaction Count */}
      <MetricCard
        label="Total Transactions"
        value={metrics.transactionCount}
      />
    </SimpleGrid>
  );
};

export default AgentMetrics;