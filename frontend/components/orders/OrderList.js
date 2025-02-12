// components/orders/OrderList.js
import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Text,
  Badge,
  Card,
  CardBody,
  Button,
  Icon,
  Skeleton,
  Select,
  Input,
  Box,
  useColorModeValue
} from '@chakra-ui/react';
import { FiPackage, FiClock, FiCheck, FiX, FiSearch } from 'react-icons/fi';
import { useRouter } from 'next/router';

const OrderList = ({ orders = [], isLoading, showFilters = false, showPagination = false }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const cardBg = useColorModeValue('white', 'gray.800');

  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'yellow',
      processing: 'blue',
      completed: 'green',
      cancelled: 'red',
      refunded: 'purple'
    };
    return statusColors[status] || 'gray';
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      pending: FiClock,
      processing: FiPackage,
      completed: FiCheck,
      cancelled: FiX
    };
    return statusIcons[status] || FiPackage;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.attributes.id?.toString().includes(searchTerm) ||
      order.attributes.total?.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.attributes.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <VStack spacing={4} align="stretch" w="full">
        {[1, 2, 3].map((index) => (
          <Skeleton key={index} height="100px" borderRadius="lg" />
        ))}
      </VStack>
    );
  }

  return (
    <VStack spacing={4} align="stretch" w="full">
      {showFilters && (
        <HStack spacing={4} mb={4}>
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<FiSearch />}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            w="200px"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </HStack>
      )}

      {filteredOrders.length === 0 ? (
        <Card bg={cardBg}>
          <CardBody>
            <Text textAlign="center" color="gray.500">No orders found</Text>
          </CardBody>
        </Card>
      ) : (
        filteredOrders.map((order) => (
          <Card 
            key={order.id} 
            bg={cardBg}
            _hover={{ transform: 'translateY(-2px)', cursor: 'pointer' }}
            transition="all 0.2s"
            onClick={() => router.push(`/orders/${order.id}`)}
          >
            <CardBody>
              <HStack justify="space-between" align="start">
                <VStack align="start" spacing={1}>
                  <HStack>
                    <Text fontWeight="bold">Order #{order.id}</Text>
                    <Badge 
                      colorScheme={getStatusColor(order.attributes.status)}
                      display="flex"
                      alignItems="center"
                    >
                      <Icon as={getStatusIcon(order.attributes.status)} mr={1} />
                      {order.attributes.status}
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(order.attributes.createdAt).toLocaleDateString()}
                  </Text>
                  <Text fontSize="sm">
                    {order.attributes.items?.length || 0} items
                  </Text>
                </VStack>
                <VStack align="end" spacing={1}>
                  <Text fontWeight="bold" fontSize="lg">
                    {order.attributes.total} LYD
                  </Text>
                  {order.attributes.status === 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="blue"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/orders/${order.id}/review`);
                      }}
                    >
                      Leave Review
                    </Button>
                  )}
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        ))
      )}

      {showPagination && filteredOrders.length > 0 && (
        <HStack justify="center" pt={4}>
          <Button
            variant="outline"
            isDisabled={true} // Add pagination logic here
          >
            Previous
          </Button>
          <Text mx={4}>Page 1 of 1</Text>
          <Button
            variant="outline"
            isDisabled={true} // Add pagination logic here
          >
            Next
          </Button>
        </HStack>
      )}
    </VStack>
  );
};

export default OrderList;