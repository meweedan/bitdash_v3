import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

// Layout & Components
import Layout from '@/components/Layout';
import GlassCard from '@/components/GlassCard';
import ProductsList from '@/components/shop/owner/ProductsList';
import OrdersList from '@/components/shop/owner/OrdersList';
import ReviewsList from '@/components/shop/owner/ReviewsList';
import SalesChart from '@/components/shop/owner/SalesChart';
import TopProductsChart from '@/components/shop/owner/TopProductsChart';
import ThemeEditor from '@/components/shop/owner/ThemeEditor';

// Chakra UI Components
import {
  Container,
  VStack,
  SimpleGrid,
  Flex,
  Heading,
  Button,
  Badge,
  Spinner,
  Text,
  HStack,
} from '@chakra-ui/react';

// Icons
import { RefreshCw, PlusCircle } from 'lucide-react';

const OwnerDashboard = () => {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Fetch Owner Data
  const { data: ownerData, isLoading, refetch } = useQuery({
    queryKey: ['ownerData', user?.id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/owners?filters[user][id][$eq]=${user.id}&populate=shop_items`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      const data = await res.json();
      return data.data.length ? data.data[0] : null;
    },
    enabled: !!user?.id && isAuthenticated,
  });

  const owner = ownerData?.attributes || {};
  const products = owner?.shop_items?.data || [];

  // Show Loading State
  if (authLoading || isLoading) {
    return (
      <Layout>
        <Flex justify="center" align="center" minH="100vh">
          <VStack spacing={4}>
            <Spinner size="xl" />
            <Text>Loading your dashboard...</Text>
          </VStack>
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Owner Dashboard | BitShop</title>
      </Head>

      <Container maxW="1200px" py={4}>
        <VStack spacing={6}>
          {/* Dashboard Header */}
          <Flex justify="space-between" align="center" w="full">
            <VStack align="start">
              <Heading size="lg">Owner Dashboard</Heading>
              <Text color="gray.500">{owner?.shopName || 'No Shop Name'}</Text>
              <Badge colorScheme={owner?.verificationStatus === 'verified' ? 'green' : 'orange'}>
                {owner?.verificationStatus?.toUpperCase()}
              </Badge>
            </VStack>
            <HStack spacing={4}>
              <Button leftIcon={<RefreshCw />} colorScheme="bitshop-solid" onClick={refetch}>
                Refresh
              </Button>
            </HStack>
          </Flex>

          {/* Metrics & Performance */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} w="full">
            <GlassCard p={6}>
              <SalesChart ownerData={owner} />
            </GlassCard>
            <GlassCard p={6}>
              <TopProductsChart ownerData={owner} />
            </GlassCard>
          </SimpleGrid>

          {/* Products & Orders */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} w="full">
            <GlassCard p={6}>
              <Flex justify="space-between" align="center">
                <Heading size="md">Your Products</Heading>
                <Button leftIcon={<PlusCircle />} colorScheme="bitshop-solid">
                  Add Product
                </Button>
              </Flex>
              <ProductsList products={products} />
            </GlassCard>

            <GlassCard p={6}>
              <OrdersList ownerData={owner} />
            </GlassCard>
          </SimpleGrid>

          {/* Reviews & Theme Customization */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} w="full">
            <GlassCard p={6}>
              <ReviewsList ownerData={owner} />
            </GlassCard>

            <GlassCard p={6}>
              <ThemeEditor ownerData={owner} />
            </GlassCard>
          </SimpleGrid>
        </VStack>
      </Container>
    </Layout>
  );
};

export default OwnerDashboard;
