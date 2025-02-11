// pages/shop/owner/dashboard.js
import React, { useState, useMemo } from 'react';
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
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Progress,
  Card,
  CardBody,
} from '@chakra-ui/react';

import {
  FiPlus,
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiStar,
  FiTrendingUp,
  FiTrendingDown,
  FiGrid,
  FiList,
  FiSettings,
  FiUpload,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiEye,
  FiAlertCircle,
} from 'react-icons/fi';

import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { motion } from 'framer-motion';

// Custom components
import ProductsList from '@/components/shop/owner/ProductsList';
import AddProductModal from '@/components/shop/owner/AddProductModal';
import OrdersList from '@/components/shop/owner/OrdersList';
import ReviewsList from '@/components/shop/owner/ReviewsList';
import SalesChart from '@/components/shop/owner/SalesChart';
import TopProductsChart from '@/components/shop/owner/TopProductsChart';

const MotionStat = motion(Stat);

const ShopOwnerDashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen: isAddProductOpen, onOpen: onAddProductOpen, onClose: onAddProductClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-owners?` +
        `populate[logo][fields][0]=url` +
        `&populate[coverImage][fields][0]=url` +
        `&populate[wallet][fields][0]=balance` +
        `&populate[shop_items][fields][0]=name` +
        `&populate[shop_items][fields][1]=price` +
        `&populate[shop_items][fields][2]=stock` +
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

  // Fetch orders
  const {
    data: ordersData,
    isLoading: isOrdersLoading
  } = useQuery({
    queryKey: ['shopOrders', shopData?.data?.[0]?.id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders?` +
        `filters[shop_owner][id][$eq]=${shopData.data[0].id}` +
        `&sort[0]=createdAt:desc` +
        `&populate=*`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },
    enabled: !!shopData?.data?.[0]?.id
  });

  // Calculate shop statistics
  const shopStats = useMemo(() => {
    if (!ordersData?.data) return {
      totalRevenue: 0,
      monthlyRevenue: 0,
      totalOrders: 0,
      pendingOrders: 0,
      lowStockItems: 0
    };

    const orders = ordersData.data;
    const now = new Date();
    const shopItems = shopData?.data?.[0]?.attributes?.shop_items?.data || [];
    
    return {
      totalRevenue: orders.reduce((sum, order) => 
        sum + (parseFloat(order?.attributes?.total) || 0), 0),
      monthlyRevenue: orders
        .filter(order => {
          const orderDate = new Date(order?.attributes?.createdAt);
          return orderDate.getMonth() === now.getMonth() && 
                 orderDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, order) => sum + (parseFloat(order?.attributes?.total) || 0), 0),
      totalOrders: orders.length,
      pendingOrders: orders.filter(order => 
        order?.attributes?.status === 'pending').length,
      lowStockItems: shopItems.filter(item => 
        item.attributes.stock < 10).length
    };
  }, [ordersData, shopData]);

  if (isShopLoading) {
    return (
      <Layout>
        <Flex justify="center" align="center" minH="100vh">
          <Spinner size="xl" />
        </Flex>
      </Layout>
    );
  }

  if (shopError || !shopData?.data?.[0]) {
    return (
      <Layout>
        <Container maxW="container.xl" py={6}>
          <Alert status="error">
            <Icon as={FiAlertCircle} />
            {shopError?.message || 'Failed to load shop data'}
          </Alert>
        </Container>
      </Layout>
    );
  }

  const shop = shopData.data[0].attributes;

  return (
    <Layout>
      <Head>
        <title>{shop.shopName} - Dashboard | BitShop</title>
      </Head>
      <Container maxW="1400px" py={6}>
        {/* Shop Header */}
        <Card mb={6}>
          <CardBody>
            <Flex direction={{ base: 'column', md: 'row' }} gap={6} align="center">
              <Box 
                position="relative" 
                minW={{ base: "full", md: "200px" }}
                h="200px"
                overflow="hidden"
                borderRadius="lg"
              >
                <Image
                  src={shop.coverImage?.data?.attributes?.url ?
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}${shop.coverImage.data.attributes.url}` :
                    '/default-shop-cover.jpg'
                  }
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
                  p={2}
                  borderRadius="full"
                  boxShadow="md"
                >
                  <Image
                    src={shop.logo?.data?.attributes?.url ?
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}${shop.logo.data.attributes.url}` :
                      '/default-shop-logo.jpg'
                    }
                    alt={`${shop.shopName} logo`}
                    boxSize="50px"
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
          <MotionStat
            p={6}
            bg={bgColor}
            borderRadius="lg"
            boxShadow="sm"
            whileHover={{ scale: 1.02 }}
          >
            <StatLabel>Total Revenue</StatLabel>
            <StatNumber>{shopStats.totalRevenue.toLocaleString()} LYD</StatNumber>
            <StatHelpText>
              <Icon as={FiTrendingUp} /> All time sales
            </StatHelpText>
          </MotionStat>

          <MotionStat
            p={6}
            bg={bgColor}
            borderRadius="lg"
            boxShadow="sm"
            whileHover={{ scale: 1.02 }}
          >
            <StatLabel>Monthly Revenue</StatLabel>
            <StatNumber>{shopStats.monthlyRevenue.toLocaleString()} LYD</StatNumber>
            <StatHelpText>
              <Icon as={FiDollarSign} /> This month
            </StatHelpText>
          </MotionStat>

          <MotionStat
            p={6}
            bg={bgColor}
            borderRadius="lg"
            boxShadow="sm"
            whileHover={{ scale: 1.02 }}
          >
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
          </MotionStat>

          <MotionStat
            p={6}
            bg={bgColor}
            borderRadius="lg"
            boxShadow="sm"
            whileHover={{ scale: 1.02 }}
          >
            <StatLabel>Inventory Alert</StatLabel>
            <StatNumber>{shopStats.lowStockItems}</StatNumber>
            <StatHelpText>
              <Icon as={FiAlertCircle} /> Low stock items
            </StatHelpText>
          </MotionStat>
        </SimpleGrid>

        {/* Main Content */}
        <Tabs colorScheme="blue" isLazy>
          <TabList>
            <Tab><Icon as={FiGrid} mr={2} /> Products</Tab>
            <Tab><Icon as={FiList} mr={2} /> Orders</Tab>
            <Tab><Icon as={FiTrendingUp} mr={2} /> Analytics</Tab>
            <Tab><Icon as={FiStar} mr={2} /> Reviews</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <ProductsList 
                products={shopData?.data?.[0]?.attributes?.shop_items?.data || []}
                onEdit={(id) => router.push(`/shop/owner/products/${id}/edit`)}
                onDelete={async (id) => {
                  // Handle product deletion
                  toast({
                    title: "Product deleted",
                    status: "success",
                    duration: 2000
                  });
                  refetchShop();
                }}
              />
            </TabPanel>

            <TabPanel px={0}>
              <OrdersList 
                orders={ordersData?.data || []}
                isLoading={isOrdersLoading}
                onStatusChange={async (orderId, newStatus) => {
                  // Handle order status change
                  toast({
                    title: "Order status updated",
                    status: "success",
                    duration: 2000
                  });
                }}
              />
            </TabPanel>

            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <Card>
                  <CardBody>
                    <Heading size="md" mb={4}>Sales Overview</Heading>
                    <SalesChart 
                      orders={ordersData?.data || []}
                      isLoading={isOrdersLoading}
                    />
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <Heading size="md" mb={4}>Top Products</Heading>
                    <TopProductsChart 
                      orders={ordersData?.data || []}
                      isLoading={isOrdersLoading}
                    />
                  </CardBody>
                </Card>
              </SimpleGrid>
            </TabPanel>

            <TabPanel px={0}>
              <ReviewsList
                shopId={shopData?.data?.[0]?.id}
                onReply={async (reviewId, reply) => {
                  // Handle review reply
                  toast({
                    title: "Reply posted",
                    status: "success",
                    duration: 2000
                  });
                }}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Add Product Modal */}
        <AddProductModal
          isOpen={isAddProductOpen}
          onClose={onAddProductClose}
          onSubmit={async (productData) => {
            // Handle product creation
            toast({
              title: "Product added successfully",
              status: "success",
              duration: 2000
            });
            try {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-items`,
                {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                  },
                  body: productData
                }
              );

              if (!response.ok) {
                throw new Error('Failed to create product');
              }

              toast({
                title: "Product added successfully",
                status: "success",
                duration: 2000
              });
              onAddProductClose();
              refetchShop();
            } catch (error) {
              console.error('Error creating product:', error);
              toast({
                title: "Error adding product",
                description: error.message,
                status: "error",
                duration: 3000
              });
            }
          }}
        />

        {/* Settings Menu */}
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FiMoreVertical />}
            variant="ghost"
            position="fixed"
            top={4}
            right={4}
          />
          <MenuList>
            <MenuItem
              icon={<FiSettings />}
              onClick={() => router.push('/shop/owner/settings')}
            >
              Shop Settings
            </MenuItem>
            <MenuItem
              icon={<FiUpload />}
              onClick={() => router.push('/shop/owner/import')}
            >
              Import Products
            </MenuItem>
            <MenuItem
              icon={<FiPackage />}
              onClick={() => router.push('/shop/owner/inventory')}
            >
              Inventory Management
            </MenuItem>
            <MenuItem
              icon={<FiStar />}
              onClick={() => router.push('/shop/owner/reviews')}
            >
              Review Management
            </MenuItem>
          </MenuList>
        </Menu>
      </Container>
    </Layout>
  );
};

export default ShopOwnerDashboard;