import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box,
  Container,
  VStack,
  HStack,
  Flex,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  useDisclosure,
  Text,
  Spinner,
  useToast,
  Alert,
  AlertIcon,
  Badge,
  Heading,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import {
  FiPlus,
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiStar,
  FiTrendingUp,
  FiGrid,
  FiList,
  FiEdit,
  FiTrash2,
  FiAlertCircle,
  FiRefreshCw,
  FiActivity,
  FiLogOut
} from 'react-icons/fi';
import { ChevronDown, Menu as MenuIcon } from 'lucide-react';

// Custom components (ensure these exist or adjust accordingly)
import Layout from '@/components/Layout';
import GlassCard from '@/components/GlassCard';
import ProductsList from '@/components/shop/owner/ProductsList';
import OrdersList from '@/components/shop/owner/OrdersList';
import ReviewsList from '@/components/shop/owner/ReviewsList';
import SalesChart from '@/components/shop/owner/SalesChart';
import TopProductsChart from '@/components/shop/owner/TopProductsChart';
import ProductEditModal from '@/components/shop/owner/ProductEditModal';
import AddProductModal from '@/components/shop/owner/AddProductModal';
import ThemeEditor from '@/components/shop/owner/ThemeEditor';
import { useAuth } from '@/hooks/useAuth';

const ShopOwnerDashboard = () => {
  const router = useRouter();
  const toast = useToast();
  const { user, loading: authLoading } = useAuth();

  // Modal controls for adding product, editing product, and theme editing
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
  const {
    isOpen: isThemeOpen,
    onOpen: onThemeOpen,
    onClose: onThemeClose
  } = useDisclosure();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Fetch shop owner data by filtering on the authenticated user's id
  const {
    data: shopData,
    isLoading: isShopLoading,
    error: shopError,
    refetch: refetchShop
  } = useQuery({
    queryKey: ['shopOwner', user?.id],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        'populate[logo][fields][0]': 'url',
        'populate[coverImage][fields][0]': 'url',
        'populate[wallet][fields][0]': 'balance',
        'populate[shop_items][populate][images]': '*',
        'populate[shop_items][populate][reviews]': '*',
        'populate[orders][populate][items]': '*',
        'filters[user][id][$eq]': user.id
      });
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/owners?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch shop data');
      return response.json();
    },
    enabled: !!user?.id && !authLoading
  });

  // Extract shop and shop id from the returned data
  const shop = shopData?.data?.[0]?.attributes;
  const shopId = shopData?.data?.[0]?.id;

  // Calculate shop statistics using useMemo
  const shopStats = useMemo(() => {
    if (!shop?.orders?.data) {
      return {
        totalRevenue: 0,
        monthlyRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        lowStockItems: 0
      };
    }
    const orders = shop.orders.data;
    const now = new Date();
    const shopItems = shop.shop_items?.data || [];
    return {
      totalRevenue: orders.reduce((sum, order) => 
        sum + (parseFloat(order.attributes.total) || 0), 0),
      monthlyRevenue: orders
        .filter(order => {
          const orderDate = new Date(order.attributes.createdAt);
          return (
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          );
        })
        .reduce((sum, order) => sum + (parseFloat(order.attributes.total) || 0), 0),
      totalOrders: orders.length,
      pendingOrders: orders.filter(order => order.attributes.status === 'pending').length,
      lowStockItems: shopItems.filter(item => item.attributes.stock < 10).length
    };
  }, [shop]);

  // Handler for opening the edit product modal
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    onEditProductOpen();
  };

  // Handler for product actions (delete or status update)
  const handleProductAction = async (productId, action) => {
    try {
      if (action === 'delete') {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-items/${productId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-items/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            data: { status: action }
          })
        });
      }
      toast({
        title: action === 'delete' ? 'Product deleted' : 'Product updated',
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

  // If still loading or if error occurs
  if (isShopLoading || authLoading) {
    return (
      <Layout>
        <Flex justify="center" align="center" minH="100vh">
          <Spinner size="xl" />
        </Flex>
      </Layout>
    );
  }

  if (shopError || !shop) {
    return (
      <Layout>
        <Container maxW="container.xl" py={6}>
          <Alert status="error">
            <AlertIcon />
            {shopError?.message || 'Failed to load shop data'}
          </Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{shop.shopName} Dashboard</title>
      </Head>

      <Container maxW="1400px" py={6} px={{ base: 2, md: 6 }}>
        <VStack spacing={6}>
          {/* Shop Header */}
          <GlassCard p={0} w="full">
            <Flex direction={{ base: 'column', md: 'row' }} gap={6} align="center">
              <Box
                position="relative"
                minW={{ base: 'full', md: '200px' }}
                h="315px"
                w="full"
                overflow="hidden"
                borderRadius="lg"
              >
                <Image
                  src={
                    shop.coverImage?.data?.attributes?.url
                      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${shop.coverImage.data.attributes.url}`
                      : '/default-shop-cover.jpg'
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
                  p={1}
                  borderRadius="full"
                  boxShadow="lg"
                  border="4px solid white"
                >
                  <Image
                    src={
                      shop.logo?.data?.attributes?.url
                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${shop.logo.data.attributes.url}`
                        : '/default-shop-logo.jpg'
                    }
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
                  <Badge
                    colorScheme={
                      shop.verificationStatus === 'verified'
                        ? 'green'
                        : shop.verificationStatus === 'pending'
                        ? 'yellow'
                        : 'red'
                    }
                  >
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
                    <FiStar />
                    <Text>{shop.rating?.toFixed(1) || '0.0'}</Text>
                  </HStack>
                </HStack>
              </VStack>
              <HStack spacing={4}>
                <Button
                  leftIcon={<FiEdit />}
                  colorScheme="purple"
                  variant="outline"
                  onClick={onThemeOpen}
                >
                  Edit Theme
                </Button>
                <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onAddProductOpen}>
                  Add Product
                </Button>
              </HStack>
            </Flex>
          </GlassCard>

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} w="full">
            <GlassCard p={6}>
              <VStack align="start">
                <Text fontSize="sm" color="gray.500">
                  Total Revenue
                </Text>
                <Heading size="md">
                  {shopStats.totalRevenue.toLocaleString()} LYD
                </Heading>
                <HStack>
                  <FiTrendingUp />
                  <Text fontSize="sm">All time sales</Text>
                </HStack>
              </VStack>
            </GlassCard>
            <GlassCard p={6}>
              <VStack align="start">
                <Text fontSize="sm" color="gray.500">
                  Monthly Revenue
                </Text>
                <Heading size="md">
                  {shopStats.monthlyRevenue.toLocaleString()} LYD
                </Heading>
                <HStack>
                  <FiDollarSign />
                  <Text fontSize="sm">This month</Text>
                </HStack>
              </VStack>
            </GlassCard>
            <GlassCard p={6}>
              <VStack align="start">
                <Text fontSize="sm" color="gray.500">
                  Total Orders
                </Text>
                <HStack>
                  <Heading size="md">{shopStats.totalOrders}</Heading>
                  {shopStats.pendingOrders > 0 && (
                    <Badge colorScheme="yellow">
                      {shopStats.pendingOrders} pending
                    </Badge>
                  )}
                </HStack>
                <HStack>
                  <FiPackage />
                  <Text fontSize="sm">Order history</Text>
                </HStack>
              </VStack>
            </GlassCard>
            <GlassCard p={6}>
              <VStack align="start">
                <Text fontSize="sm" color="gray.500">
                  Inventory Alert
                </Text>
                <Heading size="md">{shopStats.lowStockItems}</Heading>
                <HStack>
                  <FiAlertCircle />
                  <Text fontSize="sm">Low stock items</Text>
                </HStack>
              </VStack>
            </GlassCard>
          </SimpleGrid>

          {/* Main Content Tabs */}
          <Tabs colorScheme="blue" isLazy variant="enclosed" w="full">
            <TabList>
              <Tab>
                <HStack>
                  <FiGrid />
                  <Text>Products</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack>
                  <FiList />
                  <Text>Orders</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack>
                  <FiTrendingUp />
                  <Text>Analytics</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack>
                  <FiStar />
                  <Text>Reviews</Text>
                </HStack>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={0}>
                <ProductsList
                  products={shop.shop_items?.data || []}
                  onEdit={handleEditProduct}
                  onDelete={handleProductAction}
                />
              </TabPanel>
              <TabPanel p={0}>
                <OrdersList
                  orders={shop.orders?.data || []}
                  onStatusChange={async (orderId, newStatus) => {
                    try {
                      await fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${orderId}`,
                        {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                          },
                          body: JSON.stringify({
                            data: { status: newStatus }
                          })
                        }
                      );
                      toast({
                        title: 'Order status updated',
                        status: 'success',
                        duration: 2000
                      });
                      refetchShop();
                    } catch (error) {
                      toast({
                        title: 'Error updating order',
                        description: error.message,
                        status: 'error',
                        duration: 3000
                      });
                    }
                  }}
                />
              </TabPanel>
              <TabPanel p={0}>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  <GlassCard p={6}>
                    <Heading size="md" mb={4}>
                      Sales Overview
                    </Heading>
                    <SalesChart orders={shop.orders?.data || []} />
                  </GlassCard>
                  <GlassCard p={6}>
                    <Heading size="md" mb={4}>
                      Top Products
                    </Heading>
                    <TopProductsChart orders={shop.orders?.data || []} />
                  </GlassCard>
                </SimpleGrid>
              </TabPanel>
              <TabPanel p={0}>
                <ReviewsList
                  shopId={shopId}
                  onReply={async (reviewId, reply) => {
                    try {
                      await fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/${reviewId}`,
                        {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                          },
                          body: JSON.stringify({
                            data: {
                              reply,
                              reply_at: new Date().toISOString()
                            }
                          })
                        }
                      );
                      toast({
                        title: 'Reply posted',
                        status: 'success',
                        duration: 2000
                      });
                      refetchShop();
                    } catch (error) {
                      toast({
                        title: 'Error posting reply',
                        description: error.message,
                        status: 'error',
                        duration: 3000
                      });
                    }
                  }}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>

          {/* Quick Actions Menu */}
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<MenuIcon size={24} />}
              variant="ghost"
              position="fixed"
              bottom={4}
              right={4}
              size="lg"
              colorScheme="blue"
              boxShadow="lg"
            />
            <MenuList>
              <MenuItem icon={<FiEdit />} onClick={onThemeOpen}>
                Customize Theme
              </MenuItem>
              <MenuItem icon={<FiPlus />} onClick={onAddProductOpen}>
                Add New Product
              </MenuItem>
              <MenuItem
                icon={<FiPackage />}
                onClick={() => {
                  const lowStockItems =
                    shop.shop_items?.data.filter(
                      item => item.attributes.stock < 10
                    ) || [];
                  if (lowStockItems.length === 0) {
                    toast({
                      title: 'No low stock items',
                      description: 'All products have sufficient stock',
                      status: 'info',
                      duration: 3000
                    });
                    return;
                  }
                  toast({
                    title: 'Low Stock Items',
                    description: (
                      <VStack align="start">
                        {lowStockItems.map(item => (
                          <Text key={item.id}>
                            {item.attributes.name}: {item.attributes.stock} left
                          </Text>
                        ))}
                      </VStack>
                    ),
                    status: 'warning',
                    duration: 5000,
                    isClosable: true
                  });
                }}
              >
                Check Low Stock
              </MenuItem>
            </MenuList>
          </Menu>
        </VStack>

        {/* Modals */}
        <AddProductModal
          isOpen={isAddProductOpen}
          onClose={onAddProductClose}
          onSubmit={async (productData) => {
            try {
              // Ensure owner id is attached to product data
              const formDataObj = JSON.parse(productData.get('data'));
              formDataObj.owner = shopId;
              productData.set('data', JSON.stringify(formDataObj));

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
              if (!response.ok) throw new Error('Failed to create product');
              toast({
                title: 'Product added successfully',
                status: 'success',
                duration: 2000
              });
              onAddProductClose();
              refetchShop();
            } catch (error) {
              toast({
                title: 'Error adding product',
                description: error.message,
                status: 'error',
                duration: 3000
              });
            }
          }}
        />

        <ProductEditModal
          isOpen={isEditProductOpen}
          onClose={() => {
            onEditProductClose();
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onSave={async (formData) => {
            try {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-items/${selectedProduct.id}`,
                {
                  method: 'PUT',
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                  },
                  body: formData
                }
              );
              if (!response.ok) throw new Error('Failed to update product');
              toast({
                title: 'Product updated successfully',
                status: 'success',
                duration: 2000
              });
              onEditProductClose();
              setSelectedProduct(null);
              refetchShop();
            } catch (error) {
              toast({
                title: 'Error updating product',
                description: error.message,
                status: 'error',
                duration: 3000
              });
            }
          }}
        />

        <ThemeEditor
          isOpen={isThemeOpen}
          onClose={onThemeClose}
          theme={shop.theme}
          onSave={async (newTheme) => {
            try {
              await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/owners/${shopId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                  data: { theme: newTheme }
                })
              });
              toast({
                title: 'Theme updated successfully',
                status: 'success',
                duration: 2000
              });
              refetchShop();
            } catch (error) {
              toast({
                title: 'Error updating theme',
                description: error.message,
                status: 'error',
                duration: 3000
              });
            }
          }}
        />
      </Container>
    </Layout>
  );
};

export default ShopOwnerDashboard;
