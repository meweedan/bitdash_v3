// components/charts/RevenueChart.js
import React from 'react';
import {
  Box,
  Heading,
  Text,
  useColorModeValue,
  Flex,
  Select,
  Spinner,
  Button,
  HStack
} from '@chakra-ui/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { FiCalendar } from 'react-icons/fi';

const RevenueChart = ({ data = [], isLoading = false, period = '7d' }) => {
  const chartColor = useColorModeValue('blue.500', 'blue.300');
  const gridColor = useColorModeValue('gray.200', 'gray.700');
  
  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="300px">
        <Spinner size="xl" color={chartColor} />
      </Flex>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="md">Revenue Overview</Heading>
        <HStack spacing={4}>
          <Select 
            defaultValue={period}
            w="150px"
            size="sm"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </Select>
          <Button leftIcon={<FiCalendar />} size="sm" variant="outline">
            Custom Range
          </Button>
        </HStack>
      </Flex>

      <Box h="300px">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={value => `${value} LYD`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: useColorModeValue('white', 'gray.800'),
                border: 'none',
                borderRadius: '8px',
                boxShadow: 'lg'
              }}
              formatter={value => [`${value} LYD`, 'Revenue']}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke={chartColor}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default RevenueChart;