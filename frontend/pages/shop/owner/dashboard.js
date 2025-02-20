import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

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
  useDisclosure,
} from '@chakra-ui/react';

// Icons
import { RefreshCw, PlusCircle, PaintBrush } from 'lucide-react';

const OwnerDashboard = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure(); // ThemeEditor modal control

  // Fetch Owner Data
  const { data: ownerData, isLoading, refetch, error } = useQuery({
    queryKey: ['ownerData', user?.id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/owners?filters[user][id][$eq]=${user.id}&populate=shop_items`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (!res.ok) throw new Error('Failed to fetch owner data');
      const data = await res.json();
      return data.data.length ? data.data[0] : null;
    },
    enabled: !!user?.id && isAuthenticated,
    retry: 1,
  });

  if (error) {
    console.error('Error fetching owner data:', error);
  }

  // Ensure owner data is available
  const owner = ownerData?.attributes || {};
  const products = owner?.shop_items?.data || [];

  // 🛠 Fix Undefined Theme Issue
  const defaultTheme = {
    colors: {
      primary: '#3182CE',
      secondary: '#F7FAFC',
      accent: '#48BB78',
      text: '#2D3748',
    },
  };

  const theme = owner?.theme || defaultTheme;
  const colors = theme?.colors || defaultTheme.colors;

  // Show Loading State
  if (authLoading || isLoading) {
    return (
      <Layout>
        <Flex justify="center" align="center" minH="100vh">
          <VStack spacing={4}>
            <Spinner size="xl" />
            <Text>{t('Loading your dashboard...')}</Text>
          </VStack>
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{t('Owner Dashboard | BitShop')}</title>
      </Head>

      <Container maxW="1200px" py={4}>
        <VStack spacing={6}>
          {/* Dashboard Header */}
          <Flex justify="space-between" align="center" w="full">
            <VStack align="start">
              <Heading size="lg">{t('Owner Dashboard')}</Heading>
              <Text color="gray.500">{owner?.shopName || t('No Shop Name')}</Text>
              <Badge colorScheme={owner?.verificationStatus === 'verified' ? 'green' : 'orange'}>
                {owner?.verificationStatus?.toUpperCase()}
              </Badge>
            </VStack>
            <HStack spacing={4}>
              <Button leftIcon={<RefreshCw />} colorScheme="bitshop-solid" onClick={refetch}>
                {t('Refresh')}
              </Button>
              <Button leftIcon={<PaintBrush />} colorScheme="bitshop-outline" onClick={onOpen}>
                {t('Customize Theme')}
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
                <Heading size="md">{t('Your Products')}</Heading>
                <Button leftIcon={<PlusCircle />} colorScheme="bitshop-solid">
                  {t('Add Product')}
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
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Theme Editor Modal */}
      <ThemeEditor
        isOpen={isOpen}
        onClose={onClose}
        theme={theme}
        ownerId={owner?.id}
        token={localStorage.getItem('token')}
        onSave={(updatedTheme) => {
          console.log('Theme updated:', updatedTheme);
          refetch();
        }}
      />
    </Layout>
  );
};

export default OwnerDashboard;
