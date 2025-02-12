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
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
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
  FiGrid,
  FiList,
  FiSettings,
  FiUpload,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiAlertCircle,
} from 'react-icons/fi';

import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { motion } from 'framer-motion';

// Import your existing components
import ProductsList from '@/components/shop/owner/ProductsList';
import ProductEditModal from '@/components/shop/owner/ProductEditModal';
import AddProductModal from '@/components/shop/owner/AddProductModal';
import OrdersList from '@/components/shop/owner/OrdersList';
import ReviewsList from '@/components/shop/owner/ReviewsList';
import SalesChart from '@/components/shop/owner/SalesChart';
import TopProductsChart from '@/components/shop/owner/TopProductsChart';
import ThemeEditor from '@/components/shop/owner/ThemeEditor';

const MotionStat = motion(Stat);

const ShopOwnerDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen: isAddProductOpen, onOpen: onAddProductOpen, onClose: onAddProductClose } = useDisclosure();
  const { isOpen: isEditProductOpen, onOpen: onEditProductOpen, onClose: onEditProductClose } = useDisclosure();
  const { isOpen: isThemeOpen, onOpen: onThemeOpen, onClose: onThemeClose } = useDisclosure();
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Fetch shop owner data with proper API structure
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
        `populate[logo][fields][0]=url` +
        `&populate[coverImage][fields][0]=url` +
        `&populate[wallet][fields][0]=balance` +
        `&populate[shop_items][populate][images]=*` +
        `&populate[shop_items][populate][reviews]=*` +
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

  const shop = shopData?.data?.[0]?.attributes;
  const shopId = shopData?.data?.[0]?.id;

  // Calculate shop statistics
  const shopStats = useMemo(() => {
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
  }, [shop]);

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    onEditProductOpen();
  };

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
            data: {
              status: action
            }
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

  if (isShopLoading) {
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
            <Icon as={FiAlertCircle} />
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
                  p={1}
                  borderRadius="full"
                  boxShadow="lg"
                  border="4px solid white"
                >
                  <Image
                    src={shop.logo?.data?.attributes?.url ?
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}${shop.logo.data.attributes.url}` :
                      '/default-shop-logo.jpg'
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
                products={shop.shop_items?.data || []}
                onEdit={handleEditProduct}
                onDelete={handleProductAction}
              />
            </TabPanel>

            <TabPanel px={0}>
              <OrdersList 
                orders={shop.orders?.data || []}
                onStatusChange={async (orderId, newStatus) => {
                  try {
                    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${orderId}`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                      },
                      body: JSON.stringify({
                        data: {
                          status: newStatus
                        }
                      })
                    });
                    
                    toast({
                      title: "Order status updated",
                      status: "success",
                      duration: 2000
                    });
                    refetchShop();
                  } catch (error) {
                    toast({
                      title: "Error updating order",
                      description: error.message,
                      status: "error",
                      duration: 3000
                    });
                  }
                }}
              />
            </TabPanel>

            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <Card>
                  <CardBody>
                    <Heading size="md" mb={4}>Sales Overview</Heading>
                    <SalesChart orders={shop.orders?.data || []} />
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <Heading size="md" mb={4}>Top Products</Heading>
                    <TopProductsChart orders={shop.orders?.data || []} />
                  </CardBody>
                </Card>
              </SimpleGrid>
            </TabPanel>

            <TabPanel px={0}>
              <ReviewsList
                shopId={shopId}
                onReply={async (reviewId, reply) => {
                  try {
                    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/${reviewId}`, {
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
                    });
                    
                    toast({
                      title: "Reply posted",
                      status: "success",
                      duration: 2000
                    });
                    refetchShop();
                  } catch (error) {
                    toast({
                      title: "Error posting reply",
                      description: error.message,
                      status: "error",
                      duration: 3000
                    });
                  }
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
            try {
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

        {/* Edit Product Modal */}
        <ProductEditModal
          isOpen={isEditProductOpen}
          onClose={onEditProductClose}
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
                title: "Product updated successfully",
                status: "success",
                duration: 2000
              });
              onEditProductClose();
              setSelectedProduct(null);
              refetchShop();
            } catch (error) {
              toast({
                title: "Error updating product",
                description: error.message,
                status: "error",
                duration: 3000
              });
            }
          }}
        />

        {/* Theme Editor Modal */}
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
                  data: {
                    theme: newTheme
                  }
                })
              });

              toast({
                title: "Theme updated successfully",
                status: "success",
                duration: 2000
              });
              refetchShop();
            } catch (error) {
              toast({
                title: "Error updating theme",
                description: error.message,
                status: "error",
                duration: 3000
              });
            }
          }}
        />

        {/* Quick Actions Menu */}
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FiMoreVertical />}
            variant="ghost"
            position="fixed"
            bottom={4}
            right={4}
            size="lg"
            colorScheme="blue"
            shadow="lg"
          >
            Actions
          </MenuButton>
          <MenuList>
            <MenuItem
              icon={<FiEdit />}
              onClick={onThemeOpen}
            >
              Customize Theme
            </MenuItem>
            <MenuItem
              icon={<FiUpload />}
              onClick={onAddProductOpen}
            >
              Add New Product
            </MenuItem>
            <MenuItem
              icon={<FiPackage />}
              onClick={() => {
                // Toggle quick view of low stock items
                const lowStockItems = shop.shop_items?.data.filter(item => 
                  item.attributes.stock < 10
                ) || [];
                
                if (lowStockItems.length === 0) {
                  toast({
                    title: "No low stock items",
                    description: "All products have sufficient stock",
                    status: "info",
                    duration: 3000
                  });
                  return;
                }

                toast({
                  title: "Low Stock Items",
                  description: (
                    <VStack align="start">
                      {lowStockItems.map(item => (
                        <Text key={item.id}>
                          {item.attributes.name}: {item.attributes.stock} left
                        </Text>
                      ))}
                    </VStack>
                  ),
                  status: "warning",
                  duration: 5000,
                  isClosable: true
                });
              }}
            >
              Check Low Stock
            </MenuItem>
          </MenuList>
        </Menu>
      </Container>
    </Layout>
  );
};

export default ShopOwnerDashboard;