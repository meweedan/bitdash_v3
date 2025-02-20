import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Box, Container, VStack, HStack, Heading, Text, Button, SimpleGrid, Skeleton, Badge,
  Image, useColorModeValue, Stat, StatLabel, StatNumber, Icon, Flex, useToast,
  Tabs, TabList, TabPanels, Tab, TabPanel, IconButton, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalCloseButton, Alert, AlertIcon, Divider, Tooltip
} from '@chakra-ui/react';
import {
  FiPlus, FiTrendingUp, FiPackage, FiList, FiSettings, FiRefreshCw, FiMoreVertical,
  FiEdit, FiTrash2, FiAlertCircle, FiEye
} from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Head from 'next/head';
import ProductsList from '@/components/shop/owner/ProductsList';
import OrdersList from '@/components/shop/owner/OrdersList';
import SalesChart from '@/components/shop/owner/SalesChart';
import ReviewsList from '@/components/shop/owner/ReviewsList';
import ThemeEditor from '@/components/shop/owner/ThemeEditor';

const OwnerDashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const { t } = useTranslation(['dashboard', 'common']);
  const bgColor = useColorModeValue('white', 'gray.800');

  // Fetch shop owner data
  const { data: shopData, isLoading, error, refetch } = useQuery({
    queryKey: ['shopOwner', user?.id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/owners?populate=shop_items,orders,wallet,logo,coverImage&filters[user][id][$eq]=${user.id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (!response.ok) throw new Error('Failed to fetch shop data');
      return response.json();
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <Layout>
        <Container maxW="container.xl" py={6}>
          <Skeleton height="300px" borderRadius="lg" />
          <SimpleGrid columns={3} spacing={6} mt={6}>
            {[...Array(3)].map((_, i) => <Skeleton key={i} height="150px" borderRadius="lg" />)}
          </SimpleGrid>
        </Container>
      </Layout>
    );
  }

  if (error || !shopData?.data?.[0]) {
    return (
      <Layout>
        <Container maxW="container.xl" py={6}>
          <Alert status="error">
            <AlertIcon />
            {error?.message || 'Failed to load shop data'}
          </Alert>
        </Container>
      </Layout>
    );
  }

  const shop = shopData.data[0].attributes;

  return (
    <Layout>
      <Head>
        <title>{shop.shopName} Dashboard</title>
      </Head>

      <Container maxW="1400px" py={6}>
        <HStack justify="space-between" mb={6}>
          <Heading size="lg">{shop.shopName}</Heading>
          <Button leftIcon={<FiSettings />} onClick={() => router.push('/settings')}>
            {t('settings')}
          </Button>
        </HStack>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Stat bg={bgColor} p={6} borderRadius="lg">
            <StatLabel>Total Revenue</StatLabel>
            <StatNumber>{shop.wallet?.balance?.toLocaleString()} LYD</StatNumber>
          </Stat>
          <Stat bg={bgColor} p={6} borderRadius="lg">
            <StatLabel>Total Orders</StatLabel>
            <StatNumber>{shop.orders?.length || 0}</StatNumber>
          </Stat>
          <Stat bg={bgColor} p={6} borderRadius="lg">
            <StatLabel>Available Products</StatLabel>
            <StatNumber>{shop.shop_items?.length || 0}</StatNumber>
          </Stat>
        </SimpleGrid>

        <Tabs variant="soft-rounded" colorScheme="blue" mt={6}>
          <TabList>
            <Tab><FiPackage /> Products</Tab>
            <Tab><FiList /> Orders</Tab>
            <Tab><FiTrendingUp /> Analytics</Tab>
            <Tab><FiEye /> Reviews</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ProductsList products={shop.shop_items || []} refetch={refetch} />
            </TabPanel>
            <TabPanel>
              <OrdersList orders={shop.orders || []} refetch={refetch} />
            </TabPanel>
            <TabPanel>
              <SalesChart orders={shop.orders || []} />
            </TabPanel>
            <TabPanel>
              <ReviewsList reviews={shop.reviews || []} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Layout>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default OwnerDashboard;
