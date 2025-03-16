// components/tazdani/merchant/CustomerAnalytics.js
import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  SimpleGrid,
  Progress,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Select,
  Button
} from '@chakra-ui/react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { FiDownload } from 'react-icons/fi';

const CustomerAnalytics = ({ transactions = [] }) => {
  // Calculate customer metrics
  const customersData = React.useMemo(() => {
    const customerTransactions = transactions.reduce((acc, tx) => {
      const customerId = tx.customer?.id;
      if (!customerId) return acc;
      
      if (!acc[customerId]) {
        acc[customerId] = {
          id: customerId,
          name: tx.customer?.name || 'Unknown',
          transactions: [],
          totalSpent: 0
        };
      }
      
      acc[customerId].transactions.push(tx);
      acc[customerId].totalSpent += tx.amount;
      
      return acc;
    }, {});

    return Object.values(customerTransactions)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .map(customer => ({
        ...customer,
        averageOrder: customer.totalSpent / customer.transactions.length,
        frequency: customer.transactions.length
      }));
  }, [transactions]);

  // Customer segments
  const segments = [
    { name: 'VIP', value: customersData.filter(c => c.totalSpent > 1000).length },
    { name: 'Regular', value: customersData.filter(c => c.totalSpent > 500 && c.totalSpent <= 1000).length },
    { name: 'Occasional', value: customersData.filter(c => c.totalSpent <= 500).length }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <VStack spacing={8} align="stretch">
      <HStack justify="space-between">
        <Heading size="md">Customer Analytics</Heading>
        <Button leftIcon={<FiDownload />} size="sm">
          Export Report
        </Button>
      </HStack>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        {/* Customer Segments */}
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          p={6}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={useColorModeValue('gray.100', 'gray.700')}
        >
          <Heading size="sm" mb={6}>Customer Segments</Heading>
          <Box height="300px">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={segments}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {segments.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Top Customers */}
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          p={6}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={useColorModeValue('gray.100', 'gray.700')}
        >
          <HStack justify="space-between" mb={6}>
            <Heading size="sm">Top Customers</Heading>
            <Select size="sm" w="150px">
              <option value="amount">By Amount</option>
              <option value="frequency">By Frequency</option>
            </Select>
          </HStack>

          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Customer</Th>
                <Th isNumeric>Orders</Th>
                <Th isNumeric>Total Spent</Th>
                <Th isNumeric>Avg. Order</Th>
              </Tr>
            </Thead>
            <Tbody>
              {customersData.slice(0, 5).map(customer => (
                <Tr key={customer.id}>
                  <Td>{customer.name}</Td>
                  <Td isNumeric>{customer.frequency}</Td>
                  <Td isNumeric>{customer.totalSpent.toLocaleString()} LYD</Td>
                  <Td isNumeric>{customer.averageOrder.toFixed(1)} LYD</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Customer Growth */}
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          p={6}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={useColorModeValue('gray.100', 'gray.700')}
        >
          <Heading size="sm" mb={6}>Customer Growth</Heading>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text>New Customers (This Month)</Text>
              <Badge colorScheme="green">+12%</Badge>
            </HStack>
            <Progress value={72} size="sm" colorScheme="green" borderRadius="full" />
            
            <HStack justify="space-between">
              <Text>Retention Rate</Text>
              <Badge colorScheme="blue">85%</Badge>
            </HStack>
            <Progress value={85} size="sm" colorScheme="blue" borderRadius="full" />
            
            <HStack justify="space-between">
              <Text>Customer Satisfaction</Text>
              <Badge colorScheme="purple">4.8/5</Badge>
            </HStack>
            <Progress value={96} size="sm" colorScheme="purple" borderRadius="full" />
          </VStack>
        </Box>

        {/* Customer Behavior */}
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          p={6}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={useColorModeValue('gray.100', 'gray.700')}
        >
          <Heading size="sm" mb={6}>Customer Behavior</Heading>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text>Peak Transaction Hours</Text>
              <Text fontWeight="bold">2PM - 6PM</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>Most Popular Day</Text>
              <Text fontWeight="bold">Friday</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>Average Transaction Time</Text>
              <Text fontWeight="bold">2.3 minutes</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>Repeat Purchase Rate</Text>
              <Text fontWeight="bold">68%</Text>
            </HStack>
          </VStack>
        </Box>
      </SimpleGrid>
    </VStack>
  );
};

export default CustomerAnalytics;