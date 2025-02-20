import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Spinner,
  Badge,
  Image,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Flex,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  useDisclosure
} from '@chakra-ui/react';

import {
  FiPlus,
  FiPackage,
  FiDollarSign,
  FiStar,
  FiTrendingUp,
  FiGrid,
  FiList,
  FiAlertCircle,
  FiEdit
} from 'react-icons/fi';

// Placeholder for authentication hook
const useAuth = () => {
  // Implement actual authentication logic
  return { user: { id: 1 } };
};

// Placeholder components - replace with actual implementations
const ProductsList = ({ products, onEdit, onDelete }) => (
  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
    {products.map((product) => (
      <Card key={product.id}>
        <CardBody>
          <VStack align="start" spacing={3}>
            <Image 
              src={product.image} 
              alt={product.name} 
              boxSize="200px" 
              objectFit="cover" 
              borderRadius="md"
            />
            <Heading size="sm">{product.name}</Heading>
            <Text>${product.price}</Text>
            <HStack>
              <Button 
                size="sm" 
                leftIcon={<FiEdit />} 
                onClick={() => onEdit(product)}
              >
                Edit
              </Button>
              <Button 
                size="sm" 
                colorScheme="red" 
                onClick={() => onDelete(product.id)}
              >
                Delete
              </Button>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    ))}
  </SimpleGrid>
);

const OrdersList = ({ orders }) => (
  <VStack spacing={4} align="stretch">
    {orders.map((order) => (
      <Card key={order.id}>
        <CardBody>
          <VStack align="start" spacing={2}>
            <HStack justify="space-between" width="full">
              <Heading size="sm">Order #{order.id}</Heading>
              <Badge 
                colorScheme={
                  order.status === 'completed' ? 'green' :
                  order.status === 'pending' ? 'yellow' : 'blue'
                }
              >
                {order.status}
              </Badge>
            </HStack>
            <Text>Total: ${order.total}</Text>
            <Text>Items: {order.items.length}</Text>
          </VStack>
        </CardBody>
      </Card>
    ))}
  </VStack>
);

const SalesChart = ({ orders }) => (
  <Box height="300px" display="flex" justifyContent="center" alignItems="center">
    <Text>Sales Chart Placeholder</Text>
  </Box>
);

const OwnerDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { 
    isOpen: isAddProductOpen, 
    onOpen: onAddProductOpen, 
    onClose: onAddProductClose 
  } = useDisclosure();

  const { 
    isOpen: isEditProductOpen, 
    onOpen: onEditProductOpen, 
    onClose: onEditProductClose 
  } = useDisclosure();

  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch shop owner data
  const { 
    data: shopData, 
    isLoading: isShopLoading,
    error: shopError,
    refetch: refetchShop
  } = useQuery({
    queryKey: ['shopOwner', user?.id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/owners?` +
        `populate[shop_items][populate][images]=*` +
        `&populate[orders][populate][items]=*` +
        `&filters[user][id][$eq]=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch shop data');
      return response.json();
    },
    enabled: !!user?.id
  });

  // Calculate shop statistics
  const shopStats = useMemo(() => {
    const shop = shopData?.data?.[0]?.attributes;
    if (!shop?.orders?.data) return {
      totalRevenue: 0,
      monthlyRevenue: 0,
      totalOrders: 0,
      pendingOrders: 0,
      lowStockItems: 0
    };

    const orders = shop.orders.data;
    const now = new Date();
    const shopItems = shop.shop_items?.data || [];
    
    return {
      totalRevenue: orders.reduce((sum, order) => 
        sum + (parseFloat(order.attributes.total) || 0), 0),
      monthlyRevenue: orders
        .filter(order => {
          const orderDate = new Date(order.attributes.createdAt);
          return orderDate.getMonth() === now.getMonth() && 
                 orderDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, order) => sum + (parseFloat(order.attributes.total) || 0), 0),
      totalOrders: orders.length,
      pendingOrders: orders.filter(order => 
        order.attributes.status === 'pending').length,
      lowStockItems: shopItems.filter(item => 
        item.attributes.stock < 10).length
    };
  }, [shopData]);

  // Product edit handler
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    onEditProductOpen();
  };

  // Product delete handler
  const handleDeleteProduct = async (productId) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-items/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      toast({
        title: 'Product deleted',
        status: 'success',
        duration: 2000
      });
      refetchShop();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  };

  // Loading state
  if (isShopLoading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  // Error state
  if (shopError || !shopData?.data?.[0]) {
    return (
      <Container maxW="container.xl" py={6}>
        <VStack spacing={4} align="center">
          <Icon as={FiAlertCircle} boxSize={12} color="red.500" />
          <Text color="red.500">
            {shopError?.message || 'Failed to load shop data'}
          </Text>
        </VStack>
      </Container>
    );
  }

  const shop = shopData.data[0].attributes;
  const shopId = shopData.data[0].id;

  return (
    <Container maxW="1400px" py={6}>
      {/* Shop Header */}
      <Card mb={6}>
        <CardBody>
          <Flex direction={{ base: 'column', md: 'row' }} gap={6} align="center">
            <Box 
              position="relative" 
              minW={{ base: "full", md: "200px" }}
              h="315px"
              w="full" 
              overflow="hidden"
              borderRadius="lg"
            >
              <Image
                src={shop.coverImage?.url || '/default-shop-cover.jpg'}
                alt={shop.shopName}
                objectFit="cover"
                w="full"
                h="full"
              />
              <Box
                position="absolute"
                bottom={4}
                left={4}
                bg="white"
                p={1}
                borderRadius="full"
                boxShadow="lg"
                border="4px solid white"
              >
                <Image
                  src={shop.logo?.url || '/default-shop-logo.jpg'}
                  alt={`${shop.shopName} logo`}
                  boxSize="160px"
                  borderRadius="full"
                  objectFit="cover"
                />
              </Box>
            </Box>

            <VStack align="start" flex={1} spacing={2}>
              <HStack>
                <Heading size="lg">{shop.shopName}</Heading>
                <Badge colorScheme={
                  shop.verificationStatus === 'verified' ? 'green' :
                  shop.verificationStatus === 'pending' ? 'yellow' : 'red'
                }>
                  {shop.verificationStatus}
                </Badge>
              </HStack>
              <Text color="gray.600" noOfLines={2}>
                {shop.description}
              </Text>
              <HStack>
                <Badge colorScheme="blue">
                  {shop.shop_items?.data?.length || 0} Products
                </Badge>
                <HStack color="yellow.500">
                  <Icon as={FiStar} />
                  <Text>{shop.rating?.toFixed(1) || '0.0'}</Text>
                </HStack>
              </HStack>
            </VStack>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={onAddProductOpen}
            >
              Add Product
            </Button>
          </Flex>
        </CardBody>
      </Card>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Revenue</StatLabel>
              <StatNumber>{shopStats.totalRevenue.toLocaleString()} LYD</StatNumber>
              <StatHelpText>
                <Icon as={FiTrendingUp} /> All time sales
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Monthly Revenue</StatLabel>
              <StatNumber>{shopStats.monthlyRevenue.toLocaleString()} LYD</StatNumber>
              <StatHelpText>
                <Icon as={FiDollarSign} /> This month
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Orders</StatLabel>
              <HStack>
                <StatNumber>{shopStats.totalOrders}</StatNumber>
                {shopStats.pendingOrders > 0 && (
                  <Badge colorScheme="yellow">
                    {shopStats.pendingOrders} pending
                  </Badge>
                )}
              </HStack>
              <StatHelpText>
                <Icon as={FiPackage} /> Order history
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Inventory Alert</StatLabel>
              <StatNumber>{shopStats.lowStockItems}</StatNumber>
              <StatHelpText>
                <Icon as={FiAlertCircle} /> Low stock items
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Main Content Tabs */}
      <Tabs colorScheme="blue" isLazy>
        <TabList>
          <Tab><Icon as={FiGrid} mr={2} /> Products</Tab>
          <Tab><Icon as={FiList} mr={2} /> Orders</Tab>
          <Tab><Icon as={FiTrendingUp} mr={2} /> Analytics</Tab>
          <Tab><Icon as={FiStar} mr={2} /> Reviews</Tab>
        </TabList>

        <TabPanels>
          {/* Products Tab */}
          <TabPanel px={0}>
            <ProductsList 
              products={shop.shop_items?.data.map(item => ({
                id: item.id,
                name: item.attributes.name,
                price: item.attributes.price,
                image: item.attributes.images?.data?.[0]?.attributes?.url || '/default-product.jpg'
              })) || []}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </TabPanel>

          {/* Orders Tab */}
          <TabPanel px={0}>
            <OrdersList 
              orders={shop.orders?.data.map(order => ({
                id: order.id,
                status: order.attributes.status,
                total: order.attributes.total,
                items: order.attributes.order_items || []
              })) || []}
            />
          </TabPanel>

          {/* Analytics Tab */}
          <TabPanel px={0}>
            <SalesChart 
              orders={shop.orders?.data || []}
            />
          </TabPanel>

          {/* Reviews Tab */}
          <TabPanel px={0}>
            <VStack spacing={4} align="stretch">
              <Text>Reviews will be displayed here</Text>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Modals for Add and Edit Products would go here */}
    </Container>
  );
};

export default OwnerDashboard;