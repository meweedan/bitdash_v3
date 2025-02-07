// components/charts/SpendingChart.js
import React from 'react';
import { Box, Heading, useColorModeValue, HStack, Text, Icon, Spinner } from '@chakra-ui/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format, parseISO, subDays, isValid } from 'date-fns';
import { FiArrowUp, FiArrowDown, FiAlertCircle } from 'react-icons/fi';

const processTransactions = (transactions) => {
  if (!Array.isArray(transactions)) return { chartData: [], totals: { inflow: 0, outflow: 0 } };

  const dailyData = transactions.reduce((acc, transaction) => {
    if (!transaction?.attributes) return acc;

    try {
      const dateStr = transaction.attributes.createdAt;
      if (!dateStr || !isValid(parseISO(dateStr))) return acc;

      const date = format(parseISO(dateStr), 'MMM dd');
      const amount = parseFloat(transaction.attributes.amount || 0);
      const type = transaction.attributes.type;
      const status = transaction.attributes.status;

      // Only process completed transactions
      if (status !== 'completed') return acc;

      if (!acc[date]) {
        acc[date] = {
          date,
          inflow: 0,
          outflow: 0,
          netFlow: 0
        };
      }

      switch (type) {
        case 'deposit':
          acc[date].inflow += amount;
          acc[date].netFlow += amount;
          break;
        case 'withdrawal':
        case 'payment':
          acc[date].outflow += amount;
          acc[date].netFlow -= amount;
          break;
        case 'transfer':
          if (transaction.attributes.sender) {
            acc[date].outflow += amount;
            acc[date].netFlow -= amount;
          }
          if (transaction.attributes.receiver) {
            acc[date].inflow += amount;
            acc[date].netFlow += amount;
          }
          break;
      }

      return acc;
    } catch (error) {
      console.error('Error processing transaction:', error);
      return acc;
    }
  }, {});

  // Fill in missing dates
  const chartData = [];
  const today = new Date();
  let totalInflow = 0;
  let totalOutflow = 0;

  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(today, i), 'MMM dd');
    const dayData = dailyData[date] || { inflow: 0, outflow: 0, netFlow: 0 };
    
    totalInflow += dayData.inflow;
    totalOutflow += dayData.outflow;
    
    chartData.push({
      date,
      inflow: dayData.inflow,
      outflow: dayData.outflow,
      netFlow: dayData.netFlow
    });
  }

  return {
    chartData,
    totals: { inflow: totalInflow, outflow: totalOutflow }
  };
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const bg = useColorModeValue('white', 'gray.800');
    
    return (
      <Box
        bg={bg}
        p={3}
        borderRadius="md"
        boxShadow="lg"
      >
        <Text fontWeight="bold" mb={2}>{label}</Text>
        {payload.map((entry) => (
          <HStack key={entry.name} spacing={2}>
            <Icon 
              as={entry.name === 'inflow' ? FiArrowUp : FiArrowDown}
              color={entry.name === 'inflow' ? 'green.500' : 'red.500'}
            />
            <Text color={entry.color} fontSize="sm">
              {entry.name.charAt(0).toUpperCase() + entry.name.slice(1)}: {Math.abs(entry.value).toLocaleString()} LYD
            </Text>
          </HStack>
        ))}
      </Box>
    );
  }
  return null;
};

const SpendingChart = ({ transactions, isLoading }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  if (isLoading) {
    return (
      <Box h="400px" display="flex" alignItems="center" justifyContent="center" bg={bg} borderRadius="lg" p={4}>
        <Spinner size="xl" />
      </Box>
    );
  }

  const { chartData, totals } = processTransactions(transactions);

  if (chartData.length === 0) {
    return (
      <Box h="400px" display="flex" alignItems="center" justifyContent="center" bg={bg} borderRadius="lg" p={4}>
        <HStack spacing={2} color="gray.500">
          <Icon as={FiAlertCircle} />
          <Text>No transaction data available</Text>
        </HStack>
      </Box>
    );
  }

  return (
    <Box bg={bg} borderRadius="lg" p={6}>
      <HStack justify="space-between" mb={6}>
        <Heading size="md">30 Day Cash Flow</Heading>
        <HStack spacing={6}>
          <HStack>
            <Icon as={FiArrowUp} color="green.500" />
            <Text color={textColor}>
              In: {totals.inflow.toLocaleString()} LYD
            </Text>
          </HStack>
          <HStack>
            <Icon as={FiArrowDown} color="red.500" />
            <Text color={textColor}>
              Out: {totals.outflow.toLocaleString()} LYD
            </Text>
          </HStack>
        </HStack>
      </HStack>

      <Box h="400px" w="full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="inflow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#48BB78" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#48BB78" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="outflow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F56565" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F56565" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#718096" opacity={0.1} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#718096', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#718096', fontSize: 12 }}
              tickFormatter={(value) => `${value.toLocaleString()} LYD`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="inflow"
              name="Income"
              stroke="#48BB78"
              fill="url(#inflow)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="outflow"
              name="Spending"
              stroke="#F56565"
              fill="url(#outflow)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default SpendingChart;