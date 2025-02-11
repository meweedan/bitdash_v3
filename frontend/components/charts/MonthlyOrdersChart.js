// components/charts/MonthlyOrdersChart.js
import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  Box,
  Spinner,
  Center,
  useColorModeValue
} from '@chakra-ui/react';

const MonthlyOrdersChart = ({ orders = [], isLoading }) => {
  const barColor = useColorModeValue('#3182CE', '#63B3ED');
  const gridColor = useColorModeValue('#E2E8F0', '#2D3748');

  const chartData = useMemo(() => {
    if (!orders.length) return [];

    // Create a map of the last 12 months
    const months = new Array(12).fill(null).map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
        count: 0,
        total: 0,
        timestamp: date.getTime()
      };
    }).reverse();

    // Populate with order data
    orders.forEach(order => {
      const orderDate = new Date(order.attributes.createdAt);
      const monthIndex = months.findIndex(m => {
        const monthDate = new Date(m.timestamp);
        return monthDate.getMonth() === orderDate.getMonth() &&
               monthDate.getFullYear() === orderDate.getFullYear();
      });
      
      if (monthIndex !== -1) {
        months[monthIndex].count++;
        months[monthIndex].total += parseFloat(order.attributes.total || 0);
      }
    });

    return months;
  }, [orders]);

  if (isLoading) {
    return (
      <Center h="300px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box h="300px">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="month" 
            stroke={useColorModeValue('#4A5568', '#A0AEC0')}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="left"
            orientation="left"
            stroke={useColorModeValue('#4A5568', '#A0AEC0')}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke={useColorModeValue('#4A5568', '#A0AEC0')}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value} LYD`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: useColorModeValue('#FFF', '#2D3748'),
              border: '1px solid #CBD5E0',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="count"
            fill={barColor}
            name="Number of Orders"
            opacity={0.8}
          />
          <Bar
            yAxisId="right"
            dataKey="total"
            fill="#4FD1C5"
            name="Total Value (LYD)"
            opacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default MonthlyOrdersChart;