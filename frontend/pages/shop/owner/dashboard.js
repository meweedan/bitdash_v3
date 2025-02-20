import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

// Layout & Common Components 
import Layout from '@/components/Layout';
import GlassCard from '@/components/GlassCard';

// Owner Components
import ProductsList from '@/components/shop/owner/ProductsList';
import ProductEditModal from '@/components/shop/owner/ProductEditModal';
import AddProductModal from '@/components/shop/owner/AddProductModal';
import OrdersList from '@/components/shop/owner/OrdersList';
import ReviewsList from '@/components/shop/owner/ReviewsList';
import SalesChart from '@/components/shop/owner/SalesChart';
import TopProductsChart from '@/components/shop/owner/TopProductsChart';
import ThemeEditor from '@/components/shop/owner/ThemeEditor';

// Chakra UI Components
import {
  Box,
  Container,
  VStack,
  HStack,
  SimpleGrid,
  useColorModeValue,
  useDisclosure,
  Text,
  Spinner,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Badge,
  Flex,
  Heading,
  Button,
  IconButton,
  Stat,
  StatLabel,
  StatNumber,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';

// Icons
import {
  RefreshCw,
  Menu as MenuIcon,
  Settings,
  LogOut,
  Activity,
  PlusCircle,
  ShoppingCart
} from 'lucide-react';

const OwnerDashboard = () => {
  const router = useRouter();
  const toast = useToast();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();

  // Modals
  const { isOpen: isAddProductOpen, onOpen: onAddProductOpen, onClose: onAddProductClose } = useDisclosure();
  const { isOpen: isEditProductOpen, onOpen: onEditProductOpen, onClose: onEditProductClose } = useDisclosure();

  // Auth & Data Fetching
  useEffect(() => {
    const checkAccess = async () => {
      if (!authLoading && !isAuthenticated) {
        router.push('/login');
        return;
      }

      if (!authLoading && isAuthenticated && user?.id) {
        try {
          const ownerResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/owners?filters[user][id][$eq]=${user.id}&populate=*`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }
          );

          const ownerData = await ownerResponse.json();

          if (!ownerData?.data?.length) {
            toast({
              title: 'Access Denied',
              description: 'No store is linked to this user.',
              status: 'error',
              duration: 5000,
            });
            router.push('/login');
            return;
          }

          // Store owner ID for later use
          localStorage.setItem('ownerData', JSON.stringify(ownerData));
        } catch (error) {
          console.error('Access check error:', error);
          toast({
            title: 'Error',
            description: 'Failed to verify owner access',
            status: 'error',
            duration: 5000,
          });
          router.push('/login');
        }
      }
    };

    checkAccess();
  }, [authLoading, isAuthenticated, user, router, toast]);

  const { data: ownerData, isLoading, refetch } = useQuery({
    queryKey: ['ownerData', user?.id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/owners?filters[user][id][$eq]=${user.id}&populate=*`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch owner data');
      const data = await response.json();

      if (!data.data.length) throw new Error('No owner found for this user');

      return data.data[0];
    },
    enabled: !!user?.id && isAuthenticated
  });

  const owner = ownerData?.attributes || {};
  const wallet = owner?.wallet?.data?.attributes || {};

  // Loading state
  if (authLoading || isLoading) {
    return (
      <Layout>
        <Flex justify="center" align="center" minH="100vh">
          <VStack spacing={4}>
            <Spinner size="xl" thickness="4px" speed="0.65s" />
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

      <Container maxW="1200px" py={4} px={{ base: 2, md: 6 }}>
        <VStack spacing={6}>
          {/* Dashboard Header */}
          <Flex justify="space-between" align="center" w="full">
            <VStack align="start" spacing={1}>
              <Heading size="lg">Owner Dashboard</Heading>
              <Text color="gray.500">{owner?.shopName}</Text>
              <Badge colorScheme={owner?.verificationStatus === 'verified' ? 'green' : 'orange'}>
                {owner?.verificationStatus?.toUpperCase()}
              </Badge>
            </VStack>
            <HStack spacing={4}>
              <Button leftIcon={<RefreshCw />} colorScheme="bitshop-solid" onClick={() => refetch()}>
                Refresh
              </Button>
              <Menu>
                <MenuButton as={Button} rightIcon={<MenuIcon />} variant="bitshop-outline">
                  Actions
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<Activity />} onClick={() => router.push('/orders')}>
                    Orders
                  </MenuItem>
                  <MenuItem icon={<Settings />} onClick={() => router.push('/settings')}>
                    Settings
                  </MenuItem>
                  <MenuItem icon={<LogOut />} onClick={logout}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
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
                <Button leftIcon={<PlusCircle />} colorScheme="bitshop-solid" onClick={onAddProductOpen}>
                  Add Product
                </Button>
              </Flex>
              <ProductsList ownerData={owner} onEdit={onEditProductOpen} />
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
