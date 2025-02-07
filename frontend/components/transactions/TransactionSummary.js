// components/transactions/TransactionSummary.js
import {
  SimpleGrid,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  useColorModeValue,
  HStack,
  Text,
  Spinner
} from '@chakra-ui/react';
import {
  FiArrowUpRight,
  FiArrowDownLeft,
  FiShoppingBag,
  FiRefreshCw
} from 'react-icons/fi';
import { getTransactionDetails } from './TransactionList';

const calculateStats = (transactions = []) => {
  // Ensure transactions is an array
  const validTransactions = Array.isArray(transactions) ? transactions : [];

  // Initial stats object with default zero values
  const initialStats = {
    totalVolume: 0,
    totalPayments: 0,
    totalQRPayments: 0,
    totalFees: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    monthlyDeposits: 0,
    monthlyPayments: 0,
    monthlyWithdrawals: 0
  };

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  return validTransactions.reduce((stats, transaction) => {
    // Skip if transaction is invalid
    if (!transaction?.attributes) return stats;

    const details = getTransactionDetails(transaction);
    const date = details.date;
    const isThisMonth = date.getMonth() === currentMonth && 
                       date.getFullYear() === currentYear;

    // Safely accumulate values
    stats.totalVolume += details.amount || 0;
    stats.totalFees += details.fee || 0;

    switch (details.type) {
      case 'deposit':
        stats.totalDeposits += details.amount || 0;
        if (isThisMonth) stats.monthlyDeposits += details.amount || 0;
        break;
      case 'payment':
        stats.totalPayments += details.amount || 0;
        if (isThisMonth) stats.monthlyPayments += details.amount || 0;
        break;
      case 'withdrawal':
      case 'transfer':
        stats.totalWithdrawals += details.amount || 0;
        if (isThisMonth) stats.monthlyWithdrawals += details.amount || 0;
        break;
    }

    return stats;
  }, initialStats);
};

const TransactionSummary = ({ transactions, isLoading }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (isLoading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" />
      </Box>
    );
  }

  const stats = calculateStats(transactions);

  const summaryItems = [
    {
      label: 'Monthly Income',
      value: stats.monthlyDeposits,
      icon: FiArrowDownLeft,
      color: 'green.500',
      helpText: `Total: ${stats.totalDeposits.toLocaleString()} LYD`
    },
    {
      label: 'Monthly Payments',
      value: stats.monthlyPayments,
      icon: FiShoppingBag,
      color: 'purple.500',
      helpText: `Total: ${stats.totalPayments.toLocaleString()} LYD`
    },
    {
      label: 'Monthly Withdrawals',
      value: stats.monthlyWithdrawals,
      icon: FiArrowUpRight,
      color: 'blue.500',
      helpText: `Total: ${stats.totalWithdrawals.toLocaleString()} LYD`
    },
    {
      label: 'Total Fees',
      value: stats.totalFees,
      icon: FiRefreshCw,
      color: 'red.500',
      helpText: 'All time fees'
    }
  ];

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} w="full">
      {summaryItems.map((item) => (
        <Box
          key={item.label}
          p={5}
          bg={bg}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="sm"
          transition="all 0.2s"
          _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
        >
          <Stat>
            <StatLabel>
              <HStack spacing={2}>
                <Icon as={item.icon} color={item.color} />
                <Text>{item.label}</Text>
              </HStack>
            </StatLabel>
            <StatNumber color={item.color} fontSize="2xl">
              {item.value.toLocaleString()} LYD
            </StatNumber>
            <StatHelpText>{item.helpText}</StatHelpText>
          </Stat>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default TransactionSummary;