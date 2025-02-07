// components/charts/MonthlyTrendChart.js
import { Box, useColorModeValue, Text, Spinner } from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import { format, parseISO, startOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

const MonthlyTrendChart = ({ transactions, isLoading }) => {
  if (isLoading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" />
      </Box>
    );
  }

  // Get last 6 months
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 6);
  
  const months = eachMonthOfInterval({
    start: sixMonthsAgo,
    end: now
  });

  // Process transactions by month
  const monthlyData = months.map(month => {
    const monthKey = format(month, 'MMM yyyy');
    
    return (transactions || []).reduce((acc, transaction) => {
      if (!transaction?.attributes?.createdAt || !transaction?.attributes?.type) {
        return acc;
      }

      const transactionDate = parseISO(transaction.attributes.createdAt);
      if (format(transactionDate, 'MMM yyyy') !== monthKey) {
        return acc;
      }

      const amount = parseFloat(transaction.attributes.amount || 0);
      const fee = parseFloat(transaction.attributes.fee || 0);
      const type = transaction.attributes.type;

      switch (type) {
        case 'deposit':
          acc.deposits += amount;
          break;
        case 'payment':
          acc.payments += amount;
          if (transaction.attributes.payment_link) {
            acc.qrPayments += amount;
          }
          break;
        case 'withdrawal':
          acc.withdrawals += amount;
          break;
        case 'transfer':
          if (transaction.attributes.sender) {
            acc.outgoingTransfers += amount;
          }
          break;
        case 'conversion':
          acc.conversions += amount;
          break;
      }

      acc.fees += fee;
      acc.totalVolume += amount;

      return acc;
    }, {
      month: format(month, 'MMM'),
      deposits: 0,
      payments: 0,
      qrPayments: 0,
      withdrawals: 0,
      outgoingTransfers: 0,
      conversions: 0,
      fees: 0,
      totalVolume: 0
    });
  });

  if (monthlyData.every(month => month.totalVolume === 0)) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">No transaction data available</Text>
      </Box>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          p={3}
          borderRadius="md"
          boxShadow="lg"
        >
          <Text fontWeight="bold" mb={2}>{label}</Text>
          {payload.map((entry) => (
            <Text key={entry.name} color={entry.color} fontSize="sm">
              {entry.name}: {Math.abs(entry.value).toLocaleString()} LYD
            </Text>
          ))}
          {payload[0]?.payload?.fees > 0 && (
            <Text fontSize="sm" color="gray.500" mt={2}>
              Fees: {payload[0].payload.fees.toLocaleString()} LYD
            </Text>
          )}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box h="400px" w="full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={monthlyData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke={useColorModeValue('#E2E8F0', '#2D3748')} 
          />
          <XAxis 
            dataKey="month"
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value.toLocaleString()} LYD`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <ReferenceLine y={0} stroke={useColorModeValue('#CBD5E0', '#4A5568')} />
          
          <Bar dataKey="deposits" name="Deposits" fill="#38A169" stackId="a" />
          <Bar dataKey="payments" name="Payments" fill="#805AD5" stackId="b" />
          <Bar dataKey="qrPayments" name="QR Payments" fill="#D53F8C" stackId="b" />
          <Bar dataKey="withdrawals" name="Withdrawals" fill="#E53E3E" stackId="b" />
          <Bar dataKey="outgoingTransfers" name="Transfers" fill="#3182CE" stackId="b" />
          <Bar dataKey="conversions" name="Conversions" fill="#DD6B20" stackId="b" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default MonthlyTrendChart;