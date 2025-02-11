// components/shop/owner/OrdersList.js
import React, { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Box,
  Text,
  HStack,
  VStack,
  Select,
  Input,
  Button,
  useColorModeValue,
  Flex,
  Spinner
} from '@chakra-ui/react';
import {
  FiMoreVertical,
  FiPackage,
  FiTruck,
  FiCheck,
  FiX,
  FiSearch
} from 'react-icons/fi';

const OrdersList = ({ orders = [], isLoading, onStatusChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const bgColor = useColorModeValue('white', 'gray.800');

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'yellow',
      processing: 'blue',
      shipped: 'purple',
      delivered: 'green',
      cancelled: 'red'
    };
    return <Badge colorScheme={statusColors[status]}>{status}</Badge>;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toString().includes(searchTerm) ||
      order.attributes.customer_profile?.data?.attributes?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.attributes.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {/* Filters */}
      <Flex 
        gap={4} 
        direction={{ base: 'column', md: 'row' }}
        bg={bgColor}
        p={4}
        borderRadius="lg"
        boxShadow="sm"
      >
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          maxW={{ base: 'full', md: '300px' }}
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          maxW={{ base: 'full', md: '200px' }}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </Flex>

      {/* Orders Table */}
      <Box
        bg={bgColor}
        borderRadius="lg"
        boxShadow="sm"
        overflowX="auto"
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Order ID</Th>
              <Th>Customer</Th>
              <Th>Items</Th>
              <Th isNumeric>Total</Th>
              <Th>Status</Th>
              <Th>Date</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredOrders.map((order) => (
              <Tr key={order.id}>
                <Td fontWeight="medium">#{order.id}</Td>
                <Td>
                  <VStack align="start" spacing={0}>
                    <Text>
                      {order.attributes.customer_profile?.data?.attributes?.fullName || 'Unknown Customer'}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {order.attributes.customer_profile?.data?.attributes?.phone || 'No phone'}
                    </Text>
                  </VStack>
                </Td>
                <Td>
                  <Text>
                    {order.attributes.items?.length || 0} items
                  </Text>
                </Td>
                <Td isNumeric fontWeight="bold">
                  {order.attributes.total} LYD
                </Td>
                <Td>
                  {getStatusBadge(order.attributes.status)}
                </Td>
                <Td>
                  <VStack align="start" spacing={0}>
                    <Text>
                      {new Date(order.attributes.createdAt).toLocaleDateString()}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(order.attributes.createdAt).toLocaleTimeString()}
                    </Text>
                  </VStack>
                </Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem
                        icon={<FiPackage />}
                        onClick={() => onStatusChange(order.id, 'processing')}
                        isDisabled={order.attributes.status !== 'pending'}
                      >
                        Mark as Processing
                      </MenuItem>
                      <MenuItem
                        icon={<FiTruck />}
                        onClick={() => onStatusChange(order.id, 'shipped')}
                        isDisabled={order.attributes.status !== 'processing'}
                      >
                        Mark as Shipped
                      </MenuItem>
                      <MenuItem
                        icon={<FiCheck />}
                        onClick={() => onStatusChange(order.id, 'delivered')}
                        isDisabled={order.attributes.status !== 'shipped'}
                      >
                        Mark as Delivered
                      </MenuItem>
                      <MenuItem
                        icon={<FiX />}
                        onClick={() => onStatusChange(order.id, 'cancelled')}
                        isDisabled={['delivered', 'cancelled'].includes(order.attributes.status)}
                        color="red.500"
                      >
                        Cancel Order
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {filteredOrders.length === 0 && (
          <Box p={8} textAlign="center">
            <Text color="gray.500">No orders found</Text>
          </Box>
        )}
      </Box>
    </VStack>
  );
};

export default OrdersList;