// components/cash/merchant/MerchantMetrics.js
import React from 'react';
import {
  SimpleGrid,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { FiDollarSign, FiShoppingCart, FiUsers, FiTrendingUp } from 'react-icons/fi';

const MetricCard = ({ title, value, change, icon, prefix = '' }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box
      p={6}
      bg={bgColor}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={borderColor}
      position="relative"
      overflow="hidden"
    >
      <Stat>
        <StatLabel fontSize="sm" color="gray.500">
          {title}
        </StatLabel>
        <StatNumber fontSize="2xl" mt={2}>
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
        </StatNumber>
        {change !== undefined && (
          <StatHelpText mb={0}>
            <StatArrow type={change >= 0 ? 'increase' : 'decrease'} />
            {Math.abs(change)}%
          </StatHelpText>
        )}
      </Stat>
      <Icon
        as={icon}
        position="absolute"
        right={4}
        top={4}
        color="gray.300"
        boxSize={6}
      />
    </Box>
  );
};

const MerchantMetrics = ({ metrics }) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
      <MetricCard
        title="Total Revenue"
        value={metrics.totalRevenue}
        prefix="LYD "
        icon={FiDollarSign}
      />
      <MetricCard
        title="Total Orders"
        value={metrics.totalTransactions}
        icon={FiShoppingCart}
      />
      <MetricCard
        title="Active Customers"
        value={metrics.customerCount}
        icon={FiUsers}
      />
      <MetricCard
        title="Avg. Order Value"
        value={metrics.averageOrder}
        prefix="LYD "
        icon={FiTrendingUp}
      />
    </SimpleGrid>
  );
};

export default MerchantMetrics;