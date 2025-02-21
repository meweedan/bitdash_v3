import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import {
  Box, Container, VStack, HStack, Heading, Text, Button, SimpleGrid, 
  Skeleton, Badge, Avatar, useColorModeValue, Stat, StatLabel, StatNumber,
  Icon, Flex, useToast, Tabs, TabList, TabPanels, Tab, TabPanel,
  IconButton, Alert, AlertIcon, Progress, Tooltip, Wrap, WrapItem
} from '@chakra-ui/react';
import { 
  FiPackage, FiDollarSign, FiShoppingBag, FiTrendingUp, FiSettings,
  FiPlusCircle, FiEdit2, FiTrash2, FiEye, FiArchive, FiStar
} from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { motion } from 'framer-motion';

import AddProductModal from '@/components/shop/owner/AddProductModal';
import CartDrawer from '@/components/shop/owner/CartDrawer';
import OrdersList from '@/components/shop/owner/OrdersList';
import PaymentConfirmationModal from '@/components/shop/owner/PaymentConfirmationModal';
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
  const { t } = useTranslation(['dashboard', 'common']);
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
        `populate[users_permissions_user]=*` +
        `&populate[wallet]=*` +
        `&populate[shop_items][populate]=images` +
        `&populate[logo]=*` +
        `&populate[orders]=*` +
        `&filters[user][id][$eq]=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch owner data');
      }

      const data = await response.json();
      console.log('Raw owner data:', data);
      return data;
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

  if (ownerError) {
    return (
      <Layout>
        <Container maxW="container.xl" py={6}>
          <Alert status="error" flexDirection="column" alignItems="start" gap={2}>
            <AlertIcon />
            <AlertTitle>Error Loading Shop Data</AlertTitle>
            <AlertDescription>
              {ownerError.message}
              {process.env.NODE_ENV === 'development' && (
                <Box mt={2}>
                  <Text>Debug Info:</Text>
                  <Text>User ID: {user?.id}</Text>
                  <Text>Has Token: {!!localStorage.getItem('token')}</Text>
                </Box>
              )}
            </AlertDescription>
            <Button mt={4} onClick={() => refetchOwner()}>
              Try Again
            </Button>
          </Alert>
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
            No owner profile found
          </Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{ownerAttributes.shopName} - Dashboard</title>
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
                name={ownerAttributes.shopName}
                src={ownerAttributes.logo?.data?.attributes?.url}
              />
              <VStack align="start" spacing={1}>
                <Heading size="lg">{ownerAttributes.shopName}</Heading>
                <Badge colorScheme={ownerAttributes.verificationStatus === 'verified' ? 'green' : 'yellow'}>
                  {ownerAttributes.verificationStatus.toUpperCase()}
                </Badge>
                <Text color="gray.500">Wallet ID: {wallet?.walletId || 'N/A'}</Text>
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
                {wallet?.balance?.toFixed(2) || '0.00'} {wallet?.currency || 'LYD'}
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
                <StatNumber>{ownerAttributes.rating?.toFixed(1) || '0.0'}/5.0</StatNumber>
              </HStack>
            </MotionStat>

            <MotionStat
              p={6}
              bg={bgColor}
              borderRadius="xl"
              boxShadow="sm"
              whileHover={{ scale: 1.02 }}
            >
              <StatLabel>Total Orders</StatLabel>
              <HStack>
                <Icon as={FiShoppingBag} />
                <StatNumber>{ownerAttributes.orders?.data?.length || 0}</StatNumber>
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
                    currentTheme={ownerAttributes.theme}
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