import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box, Container, VStack, HStack, Heading, Text, Button, SimpleGrid, 
  Skeleton, Badge, Avatar, useColorModeValue, Stat, StatLabel, StatNumber,
  Icon, Flex, useToast, Tabs, TabList, TabPanels, Tab, TabPanel,
  IconButton, Alert, AlertIcon, Progress, Tooltip, Wrap, WrapItem
} from '@chakra-ui/react';
import { 
  FiPackage, FiDollarSign, FiShoppingBag, FiTrendingUp, FiSettings,
  FiPlusCircle, FiEdit2, FiStar
} from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { motion } from 'framer-motion';

import AddProductModal from '@/components/shop/owner/AddProductModal';
import OrdersList from '@/components/shop/owner/OrdersList';
import ProductEditModal from '@/components/shop/owner/ProductEditModal';
import ProductsList from '@/components/shop/owner/ProductsList';
import ReviewsList from '@/components/shop/owner/ReviewsList';
import SalesChart from '@/components/shop/owner/SalesChart';
import TopProductsChart from '@/components/shop/owner/TopProductsChart';
import ThemeEditor from '@/components/shop/owner/ThemeEditor';

const MotionStat = motion(Stat);

const OwnerDashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { 
    data: ownerData,
    isLoading: isOwnerLoading,
    error: ownerError,
    refetch: refetchOwner
  } = useQuery({
    queryKey: ['owner', user?.id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/owners?` +
        `populate=*` +
        `&filters[users_permissions_user][id][$eq]=${user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('API Error:', error);
        throw new Error(error.error?.message || 'Failed to fetch owner data');
      }

      const data = await response.json();
      console.log('Raw owner data:', data);

      if (!data?.data?.results?.[0]) {
        throw new Error('No owner profile found');
      }

      return data.data.results[0];
    },
    enabled: !!user?.id
  });

  if (isOwnerLoading) {
    return (
      <Layout>
        <Container maxW="container.xl" py={6}>
          <VStack spacing={6}>
            <Skeleton height="100px" w="full" />
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} w="full">
              <Skeleton height="150px" />
              <Skeleton height="150px" />
              <Skeleton height="150px" />
              <Skeleton height="150px" />
            </SimpleGrid>
          </VStack>
        </Container>
      </Layout>
    );
  }

  const owner = ownerData?.data?.results?.[0];
  if (!owner) {
    return (
      <Layout>
        <Container maxW="container.xl" py={6}>
          <Alert status="error">
            <AlertIcon />
            No owner profile found for this user
          </Alert>
        </Container>
      </Layout>
    );
  }

  const shopItems = owner.shop_items || [];
  const wallet = owner.wallet || {};
  const logoUrl = owner.logo?.url ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${owner.logo.url}` : null;

  return (
    <Layout>
      <Head>
        <title>{owner.shopName} - Dashboard</title>
      </Head>
      
      <Container maxW="container.xl" py={6}>
        <VStack spacing={6} align="stretch">
          <Flex 
            p={6}
            bg={bgColor}
            borderRadius="xl"
            boxShadow="sm"
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
            gap={4}
          >
            <HStack spacing={4}>
              <Avatar
                size="xl"
                name={owner.shopName}
                src={logoUrl}
              />
              <VStack align="start" spacing={1}>
                <Heading size="lg">{owner.shopName}</Heading>
                <Badge colorScheme={owner.verificationStatus === 'verified' ? 'green' : 'yellow'}>
                  {owner.verificationStatus.toUpperCase()}
                </Badge>
                <Text color="gray.500">Wallet ID: {wallet.walletId || 'N/A'}</Text>
              </VStack>
            </HStack>
            
            <Wrap spacing={2}>
              <WrapItem>
                <Button
                  leftIcon={<FiPlusCircle />}
                  colorScheme="blue"
                  onClick={() => router.push('/shop/owner/add-item')}
                >
                  Add New Item
                </Button>
              </WrapItem>
              <WrapItem>
                <Button
                  leftIcon={<FiSettings />}
                  variant="outline"
                  onClick={() => setSelectedTab(4)}
                >
                  Shop Settings
                </Button>
              </WrapItem>
            </Wrap>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <MotionStat
              p={6}
              bg={bgColor}
              borderRadius="xl"
              boxShadow="sm"
              whileHover={{ scale: 1.02 }}
            >
              <StatLabel>Available Balance</StatLabel>
              <StatNumber fontSize="2xl">
                {wallet.balance?.toFixed(2) || '0.00'} {wallet.currency || 'LYD'}
              </StatNumber>
            </MotionStat>

            <MotionStat
              p={6}
              bg={bgColor}
              borderRadius="xl"
              boxShadow="sm"
              whileHover={{ scale: 1.02 }}
            >
              <StatLabel>Total Products</StatLabel>
              <HStack>
                <Icon as={FiPackage} />
                <StatNumber>{shopItems.length}</StatNumber>
              </HStack>
            </MotionStat>

            <MotionStat
              p={6}
              bg={bgColor}
              borderRadius="xl"
              boxShadow="sm"
              whileHover={{ scale: 1.02 }}
            >
              <StatLabel>Shop Rating</StatLabel>
              <HStack>
                <Icon as={FiStar} color="yellow.400" />
                <StatNumber>{owner.rating?.toFixed(1) || '0.0'}/5.0</StatNumber>
              </HStack>
            </MotionStat>

            <MotionStat
              p={6}
              bg={bgColor}
              borderRadius="xl"
              boxShadow="sm"
              whileHover={{ scale: 1.02 }}
            >
              <StatLabel>Daily Limit</StatLabel>
              <HStack>
                <Icon as={FiDollarSign} />
                <StatNumber>{wallet.dailyLimit?.toLocaleString() || '0'}</StatNumber>
              </HStack>
            </MotionStat>
          </SimpleGrid>

          <Box bg={bgColor} borderRadius="xl" boxShadow="sm" overflow="hidden">
            <Tabs index={selectedTab} onChange={setSelectedTab}>
              <TabList px={4}>
                <Tab><Icon as={FiTrendingUp} mr={2} /> Analytics</Tab>
                <Tab><Icon as={FiPackage} mr={2} /> Products</Tab>
                <Tab><Icon as={FiShoppingBag} mr={2} /> Orders</Tab>
                <Tab><Icon as={FiStar} mr={2} /> Reviews</Tab>
                <Tab><Icon as={FiSettings} mr={2} /> Settings</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Box bg={bgColor} p={4} borderRadius="lg">
                      <SalesChart ownerId={owner.id} />
                    </Box>
                    <Box bg={bgColor} p={4} borderRadius="lg">
                      <TopProductsChart ownerId={owner.id} />
                    </Box>
                  </SimpleGrid>
                </TabPanel>

                <TabPanel>
                  <ProductsList 
                    ownerId={owner.id}
                    products={shopItems}
                    onEdit={setSelectedProduct}
                  />
                </TabPanel>

                <TabPanel>
                  <OrdersList ownerId={owner.id} />
                </TabPanel>

                <TabPanel>
                  <ReviewsList ownerId={owner.id} />
                </TabPanel>

                <TabPanel>
                  <ThemeEditor 
                    ownerId={owner.id}
                    currentTheme={owner.theme}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </VStack>
      </Container>

      <ProductEditModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        onSuccess={() => {
          setSelectedProduct(null);
          refetchOwner();
        }}
      />
    </Layout>
  );
};

export default OwnerDashboard;