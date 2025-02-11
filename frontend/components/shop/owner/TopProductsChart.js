// components/shop/owner/TopProductsChart.js
import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Box,
  Spinner,
  Center,
  useColorModeValue,
  Text,
  VStack,
  HStack,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge
} from '@chakra-ui/react';

const TopProductsChart = ({ orders = [], isLoading }) => {
  const [sortBy, setSortBy] = React.useState('revenue'); // 'revenue' or 'quantity'
  const barColor = useColorModeValue('#3182CE', '#63B3ED');
  const gridColor = useColorModeValue('#E2E8F0', '#2D3748');

  const productStats = useMemo(() => {
    if (!orders.length) return [];

    const stats = orders.reduce((acc, order) => {
      const items = order.attributes.items || [];
      items.forEach(item => {
        if (!acc[item.id]) {
          acc[item.id] = {
            id: item.id,
            name: item.name,
            revenue: 0,
            quantity: 0,
            averagePrice: 0
          };
        }
        acc[item.id].revenue += parseFloat(item.price) * item.quantity;
        acc[item.id].quantity += item.quantity;
        acc[item.id].averagePrice = acc[item.id].revenue / acc[item.id].quantity;
      });
      return acc;
    }, {});

    return Object.values(stats)
      .sort((a, b) => b[sortBy] - a[sortBy])
      .slice(0, 10)
      .map(product => ({
        ...product,
        revenue: parseFloat(product.revenue.toFixed(2)),
        averagePrice: parseFloat(product.averagePrice.toFixed(2))
      }));
  }, [orders, sortBy]);

  if (isLoading) {
    return (
      <Center h="300px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="sm" color="gray.500">
          Top 10 Products
        </Text>
        <Select
          size="sm"
          width="150px"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="revenue">By Revenue</option>
          <option value="quantity">By Quantity</option>
        </Select>
      </HStack>

      <Box h="300px">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={productStats}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="name"
              stroke={useColorModeValue('#4A5568', '#A0AEC0')}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.substring(0, 15) + (value.length > 15 ? '...' : '')}
            />
            <YAxis
              stroke={useColorModeValue('#4A5568', '#A0AEC0')}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => sortBy === 'revenue' ? `${value} LYD` : value}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: useColorModeValue('#FFF', '#2D3748'),
                border: '1px solid #CBD5E0',
                borderRadius: '8px',
              }}
              formatter={(value) => sortBy === 'revenue' ? `${value} LYD` : value}
            />
            <Bar
              dataKey={sortBy}
              fill={barColor}
              name={sortBy === 'revenue' ? 'Revenue (LYD)' : 'Units Sold'}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Detailed Stats Table */}
      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            <Th>Product</Th>
            <Th isNumeric>Revenue</Th>
            <Th isNumeric>Units Sold</Th>
            <Th isNumeric>Avg. Price</Th>
          </Tr>
        </Thead>
        <Tbody>
          {productStats.map((product) => (
            <Tr key={product.id}>
              <Td>
                <Text fontSize="sm" noOfLines={1}>
                  {product.name}
                </Text>
              </Td>
              <Td isNumeric>
                <Badge colorScheme="green">
                  {product.revenue} LYD
                </Badge>
              </Td>
              <Td isNumeric>
                <Badge colorScheme="blue">
                  {product.quantity}
                </Badge>
              </Td>
              <Td isNumeric>
                {product.averagePrice} LYD
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
};

export default TopProductsChart;