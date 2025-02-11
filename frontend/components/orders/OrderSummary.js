// components/orders/OrderSummary.js
import React, { useMemo } from 'react';
import {
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Card,
  CardBody,
  Skeleton,
  useColorModeValue
} from '@chakra-ui/react';
import { FiPackage, FiTrendingUp, FiClock, FiCheck } from 'react-icons/fi';

const OrderSummary = ({ orders = [], isLoading }) => {
  const cardBg = useColorModeValue('white', 'gray.800');

  const stats = useMemo(() => {
    if (!orders.length) return {
      totalOrders: 0,
      completedOrders: 0,
      pendingOrders: 0,
      averageOrderValue: 0
    };

    const completed = orders.filter(order => 
      order.attributes.status === 'completed'
    ).length;

    const pending = orders.filter(order => 
      order.attributes.status === 'pending' || 
      order.attributes.status === 'processing'
    ).length;

    const totalValue = orders.reduce((sum, order) => 
      sum + (parseFloat(order.attributes.total) || 0), 0
    );

    return {
      totalOrders: orders.length,
      completedOrders: completed,
      pendingOrders: pending,
      averageOrderValue: totalValue / orders.length
    };
  }, [orders]);

  if (isLoading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
        {[1, 2, 3, 4].map((index) => (
          <Skeleton key={index} height="100px" borderRadius="lg" />
        ))}
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
      <Card bg={cardBg}>
        <CardBody>
          <Stat>
            <StatLabel>Total Orders</StatLabel>
            <StatNumber>{stats.totalOrders}</StatNumber>
            <StatHelpText>
              <Icon as={FiPackage} mr={1} />
              Lifetime orders
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card bg={cardBg}>
        <CardBody>
          <Stat>
            <StatLabel>Completed Orders</StatLabel>
            <StatNumber>{stats.completedOrders}</StatNumber>
            <StatHelpText>
              <Icon as={FiCheck} mr={1} />
              Successfully delivered
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card bg={cardBg}>
        <CardBody>
          <Stat>
            <StatLabel>Pending Orders</StatLabel>
            <StatNumber>{stats.pendingOrders}</StatNumber>
            <StatHelpText>
              <Icon as={FiClock} mr={1} />
              In progress
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card bg={cardBg}>
        <CardBody>
          <Stat>
            <StatLabel>Average Order Value</StatLabel>
            <StatNumber>{stats.averageOrderValue.toFixed(2)} LYD</StatNumber>
            <StatHelpText>
              <Icon as={FiTrendingUp} mr={1} />
              Per order
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>
    </SimpleGrid>
  );
};

export default OrderSummary;