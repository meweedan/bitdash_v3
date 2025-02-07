// components/charts/SpendingCategoryChart.js
import { Box, useColorModeValue, Text, VStack, Spinner } from '@chakra-ui/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = {
  payment: '#805AD5',      // Purple for merchant payments
  deposit: '#38A169',      // Green for deposits
  withdrawal: '#E53E3E',   // Red for withdrawals
  transfer: '#3182CE',     // Blue for transfers
  conversion: '#DD6B20'    // Orange for currency conversions
};

const SpendingCategoryChart = ({ transactions, isLoading }) => {
  if (isLoading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" />
      </Box>
    );
  }

  // Process transactions by type with metadata
  const categoryData = (transactions || []).reduce((acc, transaction) => {
    if (!transaction?.attributes) return acc;

    const { type, amount, payment_link, merchant } = transaction.attributes;
    const safeAmount = parseFloat(amount || 0);
    
    let category = type;
    // Special handling for payments
    if (type === 'payment') {
      category = payment_link ? 'QR Payment' : 'Regular Payment';
    }

    if (!acc[category]) {
      acc[category] = {
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: 0,
        count: 0,
        transactions: []
      };
    }

    acc[category].value += safeAmount;
    acc[category].count += 1;
    acc[category].transactions.push({
      amount: safeAmount,
      merchant: merchant?.data?.attributes?.metadata?.businessName,
      reference: transaction.attributes.reference,
      status: transaction.attributes.status
    });

    return acc;
  }, {});

  const data = Object.entries(categoryData)
    .map(([key, value]) => ({
      ...value,
      id: key,
      percentageValue: value.value
    }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">No transaction data available</Text>
      </Box>
    );
  }

  const totalAmount = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = ((item.value / totalAmount) * 100).toFixed(1);
      
      return (
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          p={3}
          borderRadius="md"
          boxShadow="lg"
        >
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold" color={payload[0].color}>
              {item.name}
            </Text>
            <Text fontSize="sm">
              Amount: {item.value.toLocaleString()} LYD
            </Text>
            <Text fontSize="sm">
              {percentage}% of total
            </Text>
            <Text fontSize="sm">
              {item.count} transactions
            </Text>
            {item.transactions.length > 0 && item.id.includes('Payment') && (
              <Box fontSize="xs" color="gray.500">
                Latest merchants: {item.transactions
                  .slice(0, 3)
                  .map(t => t.merchant)
                  .filter(Boolean)
                  .join(', ')}
              </Box>
            )}
          </VStack>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box h="300px" w="full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell 
                key={entry.name}
                fill={COLORS[entry.id.split(' ')[0].toLowerCase()] || '#CBD5E0'}
                stroke={useColorModeValue('white', 'gray.800')}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SpendingCategoryChart;