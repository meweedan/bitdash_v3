import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  IconButton,
  Image,
  Badge,
  Alert,
  AlertIcon,
  Skeleton,
  useColorModeValue,
  useToast,
  Card,
  CardBody,
  SimpleGrid
} from '@chakra-ui/react';
import { FiEdit, FiPlus, FiPackage, FiStar, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import { ShoppingBag, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';

const ShopOwnerDashboard = () => {
  const router = useRouter();
  const toast = useToast();
  const { user, loading: authLoading } = useAuth();

  // Query to fetch shop owner data
  const {
    data: shopData,
    isLoading: isShopLoading,
    error: shopError,
    refetch: refetchShop
  } = useQuery({
    queryKey: ['shopOwner', user?.id],
    queryFn: async () => {
      // Build the query string
      const queryParams = new URLSearchParams({
        'populate[logo][fields][0]': 'url',
        'populate[coverImage][fields][0]': 'url',
        'populate[wallet][fields][0]': 'balance',
        'populate[shop_items][populate][images]': '*',
        'populate[shop_items][populate][reviews]': '*',
        'populate[orders][populate][items]': '*',
        'filters[user][id][$eq]': user.id
      });
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/owners?${queryParams.toString()}`;
      console.log("Fetching shop data from URL:", url);
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch shop data:", errorText);
        throw new Error('Failed to fetch shop data');
      }
      const data = await response.json();
      console.log("Shop data fetched:", data);
      return data;
    },
    enabled: !!user?.id && !authLoading
  });

  // Make sure your API returns an array of shop owner records.
  const shop = shopData?.data?.[0]?.attributes;
  const shopId = shopData?.data?.[0]?.id;

  // Debug log – check if shop data exists
  useEffect(() => {
    console.log("Shop Data Object:", shopData);
  }, [shopData]);

  // Compute shop statistics if shop data exists
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

  // Handler for product actions
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
          body: JSON.stringify({ data: { status: action } })
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

  if (isShopLoading || authLoading) {
    return (
      <Layout>
        <Container centerContent py={8}>
          <Spinner size="xl" />
          <Text mt={4}>Loading shop data...</Text>
        </Container>
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
      <Container maxW="1400px" py={6}>
        <VStack spacing={6}>
          <Heading size="2xl">{shop.shopName} Dashboard</Heading>
          <Text>{shop.description}</Text>
          {/* Display some shop stats */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} w="full">
            <Box p={6} bg={useColorModeValue('white', 'gray.800')} borderRadius="lg" boxShadow="md">
              <Text fontSize="sm" color="gray.500">Total Revenue</Text>
              <Heading size="md">{shopStats.totalRevenue.toLocaleString()} LYD</Heading>
              <HStack>
                <FiTrendingUp />
                <Text fontSize="sm">All time sales</Text>
              </HStack>
            </Box>
            <Box p={6} bg={useColorModeValue('white', 'gray.800')} borderRadius="lg" boxShadow="md">
              <Text fontSize="sm" color="gray.500">Monthly Revenue</Text>
              <Heading size="md">{shopStats.monthlyRevenue.toLocaleString()} LYD</Heading>
              <HStack>
                <FiDollarSign />
                <Text fontSize="sm">This month</Text>
              </HStack>
            </Box>
            <Box p={6} bg={useColorModeValue('white', 'gray.800')} borderRadius="lg" boxShadow="md">
              <Text fontSize="sm" color="gray.500">Total Orders</Text>
              <HStack>
                <Heading size="md">{shopStats.totalOrders}</Heading>
                {shopStats.pendingOrders > 0 && (
                  <Badge colorScheme="yellow">{shopStats.pendingOrders} pending</Badge>
                )}
              </HStack>
              <HStack>
                <FiPackage />
                <Text fontSize="sm">Order history</Text>
              </HStack>
            </Box>
            <Box p={6} bg={useColorModeValue('white', 'gray.800')} borderRadius="lg" boxShadow="md">
              <Text fontSize="sm" color="gray.500">Inventory Alert</Text>
              <Heading size="md">{shopStats.lowStockItems}</Heading>
              <HStack>
                <FiAlertCircle />
                <Text fontSize="sm">Low stock items</Text>
              </HStack>
            </Box>
          </SimpleGrid>
          {/* More dashboard content… */}
        </VStack>
      </Container>
    </Layout>
  );
};

export default ShopOwnerDashboard;