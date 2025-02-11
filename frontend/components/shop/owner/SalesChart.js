// components/shop/owner/SalesChart.js
import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts';
import {
  Box,
  Spinner,
  Center,
  useColorModeValue,
  ButtonGroup,
  Button,
  Text,
  VStack
} from '@chakra-ui/react';

const SalesChart = ({ orders = [], isLoading }) => {
  const [timeRange, setTimeRange] = React.useState('weekly'); // 'weekly', 'monthly', 'yearly'
  const lineColor = useColorModeValue('#3182CE', '#63B3ED');
  const areaColor = useColorModeValue('#EBF8FF', 'rgba(49, 130, 206, 0.1)');
  const gridColor = useColorModeValue('#E2E8F0', '#2D3748');

  const chartData = useMemo(() => {
    if (!orders.length) return [];

    let groupedData;
    const now = new Date();

    switch (timeRange) {
      case 'weekly':
        // Last 7 days
        groupedData = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dayOrders = orders.filter(order => {
            const orderDate = new Date(order.attributes.createdAt);
            return orderDate.toDateString() === date.toDateString();
          });
          return {
            date: date.toLocaleDateString('en-US', { weekday: 'short' }),
            sales: dayOrders.reduce((sum, order) => sum + parseFloat(order.attributes.total || 0), 0),
            orders: dayOrders.length
          };
        }).reverse();
        break;

      case 'monthly':
        // Last 30 days
        groupedData = Array.from({ length: 30 }, (_, i) => {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dayOrders = orders.filter(order => {
            const orderDate = new Date(order.attributes.createdAt);
            return orderDate.toDateString() === date.toDateString();
          });
          return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            sales: dayOrders.reduce((sum, order) => sum + parseFloat(order.attributes.total || 0), 0),
            orders: dayOrders.length
          };
        }).reverse();
        break;

      case 'yearly':
        // Last 12 months
        groupedData = Array.from({ length: 12 }, (_, i) => {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          const monthOrders = orders.filter(order => {
            const orderDate = new Date(order.attributes.createdAt);
            return orderDate.getMonth() === date.getMonth() &&
                   orderDate.getFullYear() === date.getFullYear();
          });
          return {
            date: date.toLocaleDateString('en-US', { month: 'short' }),
            sales: monthOrders.reduce((sum, order) => sum + parseFloat(order.attributes.total || 0), 0),
            orders: monthOrders.length
          };
        }).reverse();
        break;
    }

    return groupedData;
  }, [orders, timeRange]);

  if (isLoading) {
    return (
      <Center h="300px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <ButtonGroup size="sm" isAttached variant="outline">
        <Button
          onClick={() => setTimeRange('weekly')}
          colorScheme={timeRange === 'weekly' ? 'blue' : 'gray'}
        >
          Weekly
        </Button>
        <Button
          onClick={() => setTimeRange('monthly')}
          colorScheme={timeRange === 'monthly' ? 'blue' : 'gray'}
        >
          Monthly
        </Button>
        <Button
          onClick={() => setTimeRange('yearly')}
          colorScheme={timeRange === 'yearly' ? 'blue' : 'gray'}
        >
          Yearly
        </Button>
      </ButtonGroup>

      <Box h="300px">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="date"
              stroke={useColorModeValue('#4A5568', '#A0AEC0')}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left"
              stroke={useColorModeValue('#4A5568', '#A0AEC0')}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value} LYD`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke={useColorModeValue('#4A5568', '#A0AEC0')}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: useColorModeValue('#FFF', '#2D3748'),
                border: '1px solid #CBD5E0',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              fill={areaColor}
              stroke={lineColor}
              name="Sales (LYD)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="orders"
              stroke="#805AD5"
              name="Orders"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </VStack>
  );
};

export default SalesChart;