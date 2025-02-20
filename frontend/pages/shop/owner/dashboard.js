import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
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
  Skeleton,
  Alert,
  AlertIcon,
  Badge,
  useColorModeValue,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import {
  FiTrendingUp,
  FiPackage,
  FiStar,
  FiList,
  FiAlertCircle,
  FiSettings,
  FiRefreshCw,
  FiMoreVertical,
  FiPlus
} from 'react-icons/fi';
import { useRouter } from 'next/router';

// Hooks, Layout, and Components
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Head from 'next/head';
// The following are placeholders for your custom components:
import ProductsList from '@/components/shop/owner/ProductsList';
import OrdersList from '@/components/shop/owner/OrdersList';
import ReviewsList from '@/components/shop/owner/ReviewsList';
import SalesChart from '@/components/shop/owner/SalesChart';
import ThemeEditor from '@/components/shop/owner/ThemeEditor'; // if you have a theme editor

/**
 * Skeleton loader for initial data fetch
 */
const DashboardSkeleton = () => (
  <VStack spacing={6} w="full">
    <Skeleton height="200px" w="full" borderRadius="xl" />
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} height="120px" borderRadius="xl" />
      ))}
    </SimpleGrid>
    <Skeleton height="50px" w="50%" borderRadius="xl" />
    <Skeleton height="300px" w="full" borderRadius="xl" />
  </VStack>
);

const OwnerDashboard = () => {
  const router = useRouter();
  const { t } = useTranslation(['dashboard', 'common']);
  const toast = useToast();
  const { user, loading: authLoading } = useAuth();

  const bgColor = useColorModeValue('white', 'gray.800');

  // Example modals or theme editor usage
  const [isThemeEditorOpen, setIsThemeEditorOpen] = useState(false);
  const openThemeEditor = () => setIsThemeEditorOpen(true);
  const closeThemeEditor = () => setIsThemeEditorOpen(false);

  /**
   *  Fetch the owner's shop data
   *  We expect: /api/owners?filters[user][id][$eq]={user.id}
   *  with multiple populates for shop_items, orders, etc.
   */
  const {
    data: ownerData,
    isLoading: isOwnerLoading,
    error: ownerError,
    refetch: refetchOwner
  } = useQuery({
    queryKey: ['owner', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID found');

      // Adjust the query params based on your exact needs:
      const queryParams = new URLSearchParams({
        'filters[user][id][$eq]': user.id.toString(),
        // Populate all relevant fields
        'populate[logo]': 'true',
        'populate[coverImage]': 'true',
        'populate[shop_items][populate][0]': 'images',
        'populate[shop_items][populate][1]': 'reviews',
        'populate[orders]': 'true'
      });

      // Combine into final URL
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/owners?${queryParams.toString()}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to fetch owner data:', errorText);
        throw new Error('Failed to fetch shop data');
      }
      return res.json();
    },
    enabled: !!user?.id && !authLoading,
    retry: 1
  });

  /**
   *  Loading state
   */
  if (isOwnerLoading || authLoading) {
    return (
      <Layout>
        <Container maxW="1200px" py={6}>
          <DashboardSkeleton />
        </Container>
      </Layout>
    );
  }

  /**
   *  Error state
   */
  if (ownerError || !ownerData?.data?.[0]) {
    return (
      <Layout>
        <Container maxW="1200px" py={6}>
          <Alert status="error">
            <AlertIcon />
            {ownerError?.message || t('errors.load_owner', { ns: 'common' })}
          </Alert>
        </Container>
      </Layout>
    );
  }

  // The first owner object
  const owner = ownerData.data[0];
  const shop = owner?.attributes || {};
  const shopItems = shop?.shop_items?.data || [];
  const orders = shop?.orders?.data || [];

  /**
   *  Example stats computation
   */
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalProducts = shopItems.length;
    // Simple revenue (if you store 'total' in each order)
    const totalRevenue = orders.reduce((sum, o) => {
      const orderTotal = o.attributes.total || 0;
      return sum + parseFloat(orderTotal);
    }, 0);

    return {
      totalOrders,
      totalProducts,
      totalRevenue
    };
  }, [orders, shopItems]);

  /**
   *  Return the main Dashboard
   */
  return (
    <Layout>
      <Head>
        <title>{shop?.shopName || t('shop.default_name')} - Dashboard</title>
      </Head>

      <Container maxW="1200px" py={{ base: 4, md: 8 }}>
        {/* Header row */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'start', md: 'center' }}
          mb={6}
          gap={4}
        >
          <VStack align="start">
            <Heading size="lg">
              {shop?.shopName || t('shop.default_name')}
            </Heading>
            <HStack spacing={2}>
              <Badge colorScheme="blue">{shopItems.length} {t('dashboard:labels.products')}</Badge>
              <Badge colorScheme={shop.verificationStatus === 'verified' ? 'green' : 'yellow'}>
                {shop?.verificationStatus || 'pending'}
              </Badge>
            </HStack>
          </VStack>
          <HStack>
            {/* Quick actions menu */}
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Owner Actions"
                icon={<FiMoreVertical />}
                variant="outline"
              />
              <MenuList>
                <MenuItem icon={<FiSettings />} onClick={openThemeEditor}>
                  {t('dashboard:actions.theme_settings')}
                </MenuItem>
                <MenuItem
                  icon={<FiRefreshCw />}
                  onClick={() => {
                    refetchOwner();
                    toast({ title: t('common:refreshed'), status: 'info' });
                  }}
                >
                  {t('dashboard:actions.refresh')}
                </MenuItem>
              </MenuList>
            </Menu>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={() => router.push('/owner/add-product')}
            >
              {t('dashboard:actions.add_product')}
            </Button>
          </HStack>
        </Flex>

        {/* Shop Stats */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
          <Box p={6} bg={bgColor} borderRadius="lg" boxShadow="md">
            <Text fontSize="sm" color="gray.500">{t('dashboard:stats.revenue')}</Text>
            <Heading size="md">{stats.totalRevenue.toLocaleString()} LYD</Heading>
            <HStack mt={2}>
              <FiTrendingUp />
              <Text fontSize="sm">{t('dashboard:stats.all_time')}</Text>
            </HStack>
          </Box>
          <Box p={6} bg={bgColor} borderRadius="lg" boxShadow="md">
            <Text fontSize="sm" color="gray.500">{t('dashboard:stats.orders')}</Text>
            <Heading size="md">{stats.totalOrders}</Heading>
            <HStack mt={2}>
              <FiPackage />
              <Text fontSize="sm">{t('dashboard:stats.order_history')}</Text>
            </HStack>
          </Box>
          <Box p={6} bg={bgColor} borderRadius="lg" boxShadow="md">
            <Text fontSize="sm" color="gray.500">{t('dashboard:stats.products')}</Text>
            <Heading size="md">{stats.totalProducts}</Heading>
            <HStack mt={2}>
              <FiList />
              <Text fontSize="sm">{t('dashboard:stats.inventory')}</Text>
            </HStack>
          </Box>
        </SimpleGrid>

        {/* Main Tabs */}
        <Tabs isLazy variant="soft-rounded" colorScheme="blue">
          <TabList overflowX="auto" whiteSpace="nowrap">
            <Tab><FiPackage style={{ marginRight: 4 }} />{t('dashboard:tabs.products')}</Tab>
            <Tab><FiList style={{ marginRight: 4 }} />{t('dashboard:tabs.orders')}</Tab>
            <Tab><FiTrendingUp style={{ marginRight: 4 }} />{t('dashboard:tabs.analytics')}</Tab>
            <Tab><FiStar style={{ marginRight: 4 }} />{t('dashboard:tabs.reviews')}</Tab>
          </TabList>
          <TabPanels mt={4}>
            {/* Products */}
            <TabPanel px={0}>
              <ProductsList 
                products={shopItems} 
                // If your component needs a refetch callback or ownerId, pass them:
                onRefetch={refetchOwner} 
              />
            </TabPanel>

            {/* Orders */}
            <TabPanel px={0}>
              <OrdersList 
                orders={orders} 
                onRefetch={refetchOwner}
              />
            </TabPanel>

            {/* Analytics */}
            <TabPanel px={0}>
              <Box p={4} bg={bgColor} borderRadius="lg" boxShadow="md">
                <SalesChart orders={orders} />
              </Box>
            </TabPanel>

            {/* Reviews */}
            <TabPanel px={0}>
              <ReviewsList 
                ownerId={owner.id} 
                // If your reviews are nested differently, adjust here
                // or fetch them in a separate query
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>

      {/* Optional Theme Editor Modal */}
      {isThemeEditorOpen && (
        <ThemeEditor
          isOpen={isThemeEditorOpen}
          onClose={closeThemeEditor}
          // If you store theme in shop.theme, pass it here:
          themeData={shop.theme}
          onSave={async (newTheme) => {
            try {
              const updateUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/owners/${owner.id}`;
              const res = await fetch(updateUrl, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ data: { theme: newTheme } })
              });
              if (!res.ok) throw new Error('Failed to update theme');
              toast({ title: t('dashboard:theme_updated'), status: 'success' });
              refetchOwner();
            } catch (err) {
              toast({ title: t('common:error'), description: err.message, status: 'error' });
            } finally {
              closeThemeEditor();
            }
          }}
        />
      )}
    </Layout>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'dashboard'])),
  },
});

export default OwnerDashboard;
