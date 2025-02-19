// pages/shop/customer/dashboard.js
import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
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
  Avatar,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Flex,
  useToast,
  Image,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Alert,
  AlertIcon,
  Progress,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Tooltip,
  Card,
  CardBody,
  CardHeader
} from '@chakra-ui/react';
import { 
  FiShoppingBag,
  FiHeart,
  FiClock,
  FiStar,
  FiUser,
  FiList,
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiRefreshCw,
  FiShare2,
  FiCopy,
  FiMoreVertical,
  FiEye,
  FiEyeOff,
  FiLogOut,
  FiSettings,
  FiImage,
  FiShoppingCart
} from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { motion } from 'framer-motion';

// Custom components
import OrderList from '@/components/orders/OrderList';
import OrderSummary from '@/components/orders/OrderSummary';
import SpendingChart from '@/components/charts/SpendingChart';
import CategorySpendingChart from '@/components/charts/CategorySpendingChart';
import MonthlyOrdersChart from '@/components/charts/MonthlyOrdersChart';
import FavoriteItems from '@/components/shop/FavoriteItems';
import ReviewsList from '@/components/shop/ReviewsList';

const MotionStat = motion(Stat);

const CustomerDashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const [showBalance, setShowBalance] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { 
    isOpen: isMenuModalOpen, 
    onOpen: onMenuModalOpen, 
    onClose: onMenuModalClose 
  } = useDisclosure();

  // Fetch customer profile data
  const { 
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError
  } = useQuery({
    queryKey: ['customerProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID found');

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        throw new Error('No auth token found');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customer-profiles?` +
        `populate[avatar][fields][0]=url` +
        `&populate[wallet][fields][0]=balance` +
        `&populate[wallet][fields][1]=currency` +
        `&populate[shopOrders][populate][0]=shop_items` +
        `&populate[shopOrders][populate][1]=status` +
        `&populate[shopOrders][populate][2]=total` +
        `&populate[reviews][populate][0]=shop_item` +
        `&populate[reviews][populate][1]=rating` +
        `&populate[reviews][populate][2]=images` +
        `&populate[favourites][populate][0]=images` + 
        `&populate[favourites][populate][1]=name` +
        `&populate[favourites][populate][2]=price` +
        `&filters[users_permissions_user][id][$eq]=${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
          throw new Error('Authentication expired');
        }
        throw new Error('Failed to fetch profile');
      }

      return response.json();
    },
    enabled: !!user?.id
  });

  // Fetch orders
  const { 
    data: ordersData,
    isLoading: isOrdersLoading
  } = useQuery({
    queryKey: ['shopOrders', profileData?.data?.[0]?.id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders?` + 
        `filters[customer_profile][id][$eq]=${profileData.data[0].id}` +
        `&filters[type][$eq]=shop` +  // Add this to filter shop orders only
        `&sort[0]=createdAt:desc` +
        `&populate=*`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },
    enabled: !!profileData?.data?.[0]?.id
  });

  // Calculate order stats
  const orderStats = useMemo(() => {
  if (!ordersData?.data) return {
    totalSpent: 0,
    monthlySpending: 0,
    totalOrders: 0,
    completedOrders: 0
  };

  const shopOrders = ordersData.data.filter(order => order.attributes.type === 'shop');
    const now = new Date();
    
    return {
      totalSpent: shopOrders.reduce((sum, order) => 
        sum + (parseFloat(order?.attributes?.total) || 0), 0),
      monthlySpending: shopOrders
        .filter(order => {
          const orderDate = new Date(order?.attributes?.createdAt);
          return orderDate.getMonth() === now.getMonth() && 
                orderDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, order) => sum + (parseFloat(order?.attributes?.total) || 0), 0),
      totalOrders: shopOrders.length,
      completedOrders: shopOrders.filter(order => 
        order?.attributes?.status === 'completed').length
    };
  }, [ordersData]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      router.push('/login');
      return;
    }
  }, [router]);

  // THEN have your loading check
  if (isProfileLoading) {
    return (
      <Layout>
        <Flex justify="center" align="center" minH="100vh">
          <Spinner size="xl" />
        </Flex>
      </Layout>
    );
  }

  // Error state
  if (profileError || !profileData?.data?.[0]) {
    return (
      <Layout>
        <Container maxW="container.xl" py={6}>
          <Alert status="error">
            <AlertIcon />
            {profileError?.message || 'Failed to load profile data'}
          </Alert>
        </Container>
      </Layout>
    );
  }

  // When accessing data
  const profile = profileData?.data?.[0]?.attributes || {};
  const wallet = profile?.wallet?.data?.attributes || {};

  return (
    <Layout>
      <Head>
        <title>Dashboard | BitShop</title>
      </Head>
      <Container 
        maxW="1200px" 
        py={6} 
        px={{ base: 4, md: 8 }}
        position="relative"
        overflow="hidden"
      >
        {/* Background Gradient */}
        <Box
          position="absolute"
          top="-10%"
          left="-10%"
          right="-10%"
          bottom="-10%"
          bg="linear-gradient(45deg, rgba(49, 130, 206, 0.1), rgba(128, 90, 213, 0.1))"
          filter="blur(60px)"
          zIndex={-1}
          pointerEvents="none"
        />

        <VStack spacing={{ base: 6, md: 8 }} align="stretch">
          {/* Header */}
          <Flex 
            justify="space-between" 
            align={{ base: "start", md: "center" }}
            direction={{ base: "column", md: "row" }}
            gap={4}
            backdropFilter="blur(8px)"
            bg={useColorModeValue('whiteAlpha.800', 'blackAlpha.500')}
            p={6}
            borderRadius="2xl"
            boxShadow="sm"
          >
            <VStack align="start" spacing={1}>
              <HStack spacing={3}>
                <Avatar
                  size="2xl"
                  name={profile.fullName}
                  src={profile.avatar?.data?.attributes?.url}
                  bg="blue.500"
                  color="white"
                />
                <VStack align="start" spacing={0}>
                  <Heading size="md">{profile.fullName}</Heading>
                  <Text fontSize="sm" color="gray.500">{profile.phone}</Text>
                  <HStack mt={2}>
                    <Badge colorScheme="green">{profile.wallet_status}</Badge>
                    <Badge colorScheme="blue">Verified Customer</Badge>
                  </HStack>
                </VStack>
              </HStack>
            </VStack>
            
            <HStack spacing={3}>
              <Tooltip label="Shopping Cart">
                <IconButton
                  icon={<FiShoppingCart />}
                  onClick={() => router.push('/cart')}
                  colorScheme="blue"
                  variant="ghost"
                  size="lg"
                />
              </Tooltip>
              <Tooltip label="Wishlist">
                <IconButton
                  icon={<FiHeart />}
                  onClick={() => router.push('/wishlist')}
                  colorScheme="red"
                  variant="ghost"
                  size="lg"
                />
              </Tooltip>
              <Tooltip label="More Options">
                <IconButton
                  icon={<FiMoreVertical />}
                  onClick={onMenuModalOpen}
                  variant="ghost"
                  size="lg"
                />
              </Tooltip>
            </HStack>
          </Flex>

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <MotionStat
              p={6}
              bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
              borderRadius="2xl"
              boxShadow="lg"
              backdropFilter="blur(8px)"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <StatLabel fontSize="sm" mb={2}>Wallet Balance</StatLabel>
              <HStack>
                <StatNumber color={useColorModeValue('blue.600', 'blue.300')} fontSize="3xl">
                  {showBalance ? wallet?.balance?.toLocaleString() : '•••••••'} {wallet?.currency || 'LYD'}
                </StatNumber>
                <IconButton
                  icon={showBalance ? <FiEyeOff /> : <FiEye />}
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBalance(!showBalance)}
                />
              </HStack>
              <StatHelpText>Available for shopping</StatHelpText>
            </MotionStat>

            <MotionStat
              p={6}
              bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
              borderRadius="2xl"
              boxShadow="lg"
              backdropFilter="blur(8px)"
              whileHover={{ scale: 1.02 }}
            >
              <StatLabel fontSize="sm">Monthly Spending</StatLabel>
              <StatNumber fontSize="2xl">
                {orderStats.monthlySpending.toLocaleString()} LYD
              </StatNumber>
              <Box w="full">
                <SimpleGrid columns={2} spacing={4}>
                  <VStack align="start" spacing={0}>
                    <HStack color="green.500">
                      <Icon as={FiTrendingUp} />
                      <Text fontSize="sm" fontWeight="medium">Orders</Text>
                    </HStack>
                    <Text fontSize="sm">
                      {orderStats.totalOrders} total
                    </Text>
                  </VStack>
                  <VStack align="start" spacing={0}>
                    <HStack color="blue.500">
                      <Icon as={FiShoppingBag} />
                      <Text fontSize="sm" fontWeight="medium">Completed</Text>
                    </HStack>
                    <Text fontSize="sm">
                      {orderStats.completedOrders} orders
                    </Text>
                  </VStack>
                </SimpleGrid>
              </Box>
            </MotionStat>

            <MotionStat
              p={6}
              bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
              borderRadius="2xl"
              boxShadow="lg"
              backdropFilter="blur(8px)"
              whileHover={{ scale: 1.02 }}
            >
              <StatLabel fontSize="sm">Total Spent</StatLabel>
              <StatNumber fontSize="2xl">
                {orderStats.totalSpent.toLocaleString()} LYD
              </StatNumber>
              <StatHelpText>
                Lifetime shopping value
              </StatHelpText>
            </MotionStat>
          </SimpleGrid>

          {/* Spending Chart */}
          <Box 
            bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
            borderRadius="2xl"
            boxShadow="lg"
            backdropFilter="blur(8px)"
            p={6}
          >
            <SpendingChart 
              orders={ordersData?.data || []} 
              isLoading={isOrdersLoading}
            />
          </Box>

          {/* Main Content */}
          <Box
            bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
            borderRadius="2xl"
            boxShadow="lg"
            backdropFilter="blur(8px)"
            p={6}
          >
            <Tabs variant="soft-rounded" colorScheme="blue">
              <TabList>
                <Tab><Icon as={FiClock} mr={2} /> Recent Orders</Tab>
                <Tab><Icon as={FiHeart} mr={2} /> Favorites</Tab>
                <Tab><Icon as={FiStar} mr={2} /> Reviews</Tab>
                <Tab><Icon as={FiList} mr={2} /> Analytics</Tab>
              </TabList>

              <TabPanels>
                <TabPanel px={0}>
                  <OrderList 
                    orders={ordersData?.data?.filter(order => order.attributes.type === 'shop')?.slice(0, 5) || []}
                    isLoading={isOrdersLoading}
                  />
                  </TabPanel>
                
                <TabPanel px={0}>
                  <VStack spacing={6}>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
                      {profileData?.data?.[0]?.attributes?.favourites?.data?.map((item) => (
                        <Card key={item.id}>
                          <CardBody>
                            <VStack spacing={3}>
                              <Box
                                position="relative"
                                w="full"
                                h="200px"
                                overflow="hidden"
                                borderRadius="lg"
                              >
                                {item.attributes.images?.data?.[0]?.attributes?.url ? (
                                  <Image
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.attributes.images.data[0].attributes.url}`}
                                    alt={item.attributes.name}
                                    objectFit="cover"
                                    w="full"
                                    h="full"
                                  />
                                ) : (
                                  <Flex
                                    w="full"
                                    h="full"
                                    bg="gray.100"
                                    align="center"
                                    justify="center"
                                  >
                                    <Icon as={FiImage} boxSize={8} color="gray.400" />
                                  </Flex>
                                )}
                                <IconButton
                                  icon={<FiHeart />}
                                  position="absolute"
                                  top={2}
                                  right={2}
                                  colorScheme="red"
                                  variant="solid"
                                  size="sm"
                                  onClick={() => {
                                    // Handle removing from favorites
                                    toast({
                                      title: "Removed from favorites",
                                      status: "success",
                                      duration: 2000
                                    });
                                  }}
                                />
                              </Box>
                              <VStack spacing={1} align="start" w="full">
                                <Heading size="md">{item.attributes.name}</Heading>
                                <Text fontWeight="bold" color="blue.500">
                                  {item.attributes.price} LYD
                                </Text>
                                <Button
                                  leftIcon={<FiShoppingCart />}
                                  colorScheme="blue"
                                  variant="solid"
                                  w="full"
                                  onClick={() => {
                                    // Handle adding to cart
                                    toast({
                                      title: "Added to cart",
                                      status: "success",
                                      duration: 2000
                                    });
                                  }}
                                >
                                  Add to Cart
                                </Button>
                              </VStack>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  </VStack>
                </TabPanel>

                <TabPanel px={0}>
                  <VStack spacing={4} align="stretch">
                    {profileData?.data?.[0]?.attributes?.reviews?.data?.map((review) => (
                      <Card key={review.id}>
                        <CardBody>
                          <VStack align="start" spacing={2}>
                            <HStack justify="space-between" w="full">
                              <Heading size="sm">
                                {review.attributes.shop_item?.data?.attributes?.name}
                              </Heading>
                              <HStack spacing={1}>
                                {[...Array(5)].map((_, i) => (
                                  <Icon
                                    key={i}
                                    as={FiStar}
                                    color={i < review.attributes.rating ? "yellow.400" : "gray.300"}
                                  />
                                ))}
                              </HStack>
                            </HStack>
                            <Text color="gray.600">{review.attributes.comment}</Text>
                            {review.attributes.images?.data?.length > 0 && (
                              <HStack spacing={2} mt={2}>
                                {review.attributes.images.data.map((image, index) => (
                                  <Image
                                    key={index}
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${image.attributes.url}`}
                                    alt={`Review image ${index + 1}`}
                                    boxSize="100px"
                                    objectFit="cover"
                                    borderRadius="md"
                                  />
                                ))}
                              </HStack>
                            )}
                            <Text fontSize="sm" color="gray.500">
                              Posted on {new Date(review.attributes.createdAt).toLocaleDateString()}
                            </Text>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                </TabPanel>

                <TabPanel px={0}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Card>
                      <CardHeader>
                        <Heading size="md">Spending by Category</Heading>
                      </CardHeader>
                      <CardBody>
                        <CategorySpendingChart 
                          orders={ordersData?.data || []} 
                          isLoading={isOrdersLoading}
                        />
                      </CardBody>
                    </Card>
                    <Card>
                      <CardHeader>
                        <Heading size="md">Monthly Orders</Heading>
                      </CardHeader>
                      <CardBody>
                        <MonthlyOrdersChart 
                          orders={ordersData?.data || []} 
                          isLoading={isOrdersLoading}
                        />
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </VStack>

        {/* Menu Modal */}
        <Modal 
          isOpen={isMenuModalOpen} 
          onClose={onMenuModalClose}
          size="xs"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Quick Actions</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} w="full">
                <Button 
                  leftIcon={<FiUser />}
                  onClick={() => {
                    onMenuModalClose();
                    router.push('/customer/profile');
                  }}
                  w="full"
                  justifyContent="start"
                >
                  Profile Settings
                </Button>

                <Button 
                  leftIcon={<FiShoppingBag />}
                  onClick={() => {
                    onMenuModalClose();
                    router.push('/orders');
                  }}
                  w="full"
                  justifyContent="start"
                >
                  Order History
                </Button>

                <Button 
                  leftIcon={<FiHeart />}
                  onClick={() => {
                    onMenuModalClose();
                    router.push('/wishlist');
                  }}
                  w="full"
                  justifyContent="start"
                >
                  Wishlist
                </Button>

                <Button 
                  leftIcon={<FiSettings />}
                  onClick={() => {
                    onMenuModalClose();
                    router.push('/customer/settings');
                  }}
                  w="full"
                  justifyContent="start"
                >
                  Account Settings
                </Button>

                <Button 
                  leftIcon={<FiLogOut />}
                  onClick={() => {
                    onMenuModalClose();
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    router.push('/login');
                  }}
                  w="full"
                  justifyContent="start"
                  colorScheme="red"
                  variant="outline"
                >
                  Logout
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default CustomerDashboard;