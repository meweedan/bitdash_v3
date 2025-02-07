// pages/pay/merchant/dashboard.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useDisclosure } from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import {
  Box,
  Container,
  Grid,
  GridItem,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  IconButton,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Icon,
  Flex,
  useToast,
  Spinner,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import {
  FiDollarSign,
  FiCreditCard,
  FiSettings,
  FiDownload,
  FiLink,
  FiTrendingUp,
  FiRefreshCw,
  FiMenu,
  FiPlus,
  FiMoreVertical,
} from 'react-icons/fi';
import { FaQrcode } from 'react-icons/fa';

// Import merchant components
import TransactionsList from '@/components/cash/merchant/TransactionsList';
import PaymentLinksList from '@/components/cash/merchant/PaymentLinksList';
import WalletBalance from '@/components/cash/WalletBalance';
import PaymentLinkGenerator from '@/components/cash/merchant/PaymentLinkGenerator';

const MerchantDashboard = () => {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // UI state
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Modal controls
  const { 
    isOpen: isQROpen, 
    onOpen: onQROpen, 
    onClose: onQRClose 
  } = useDisclosure();
  
  const { 
    isOpen: isPaymentLinkOpen, 
    onOpen: onPaymentLinkOpen, 
    onClose: onPaymentLinkClose 
  } = useDisclosure();

  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose
  } = useDisclosure();

  // Fetch merchant data
  const { data: merchantData, isLoading } = useQuery({
    queryKey: ['merchantData'],
    queryFn: async () => {
      const userId = JSON.parse(localStorage.getItem('user'))?.id;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/merchants?populate=*&filters[users_permissions_user][id][$eq]=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch merchant data');
      const data = await response.json();
      return data.data[0];
    },
    enabled: !!isAuthenticated,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { 
    data: walletData,
    isLoading: isWalletLoading,
    error: walletError,
    refetch: refetchWallet
    } = useQuery({
      queryKey: ['walletBalance', 'merchant', merchantData?.id],
      queryFn: async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallets?populate=*&filters[merchant][id][$eq]=${merchantData?.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        if (!response.ok) throw new Error('Failed to fetch wallet');
        return response.json();
      },
      enabled: !!merchantData?.id,
      refetchInterval: 10000,
      retry: 2,
      onError: (error) => {
        toast({
          title: 'Error fetching wallet',
          description: error.message,
          status: 'error',
          duration: 5000
        });
      }
    });

  // Export mutation
  const exportTransactions = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/merchants/export`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Export failed');
      return response.blob();
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast({
        title: 'Export Successful',
        status: 'success',
        duration: 3000
      });
    }
  });

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || isLoading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Spinner size="xl" />
        </Box>
      </Layout>
    );
  }

  const merchant = merchantData?.attributes || {};

  return (
    <Layout>
      <Head>
        <title>Merchant Dashboard | BitCash</title>
      </Head>

      <Container maxW="1200px" py={4} px={{ base: 2, md: 6 }}>
        <VStack spacing={6}>
          {/* Mobile Header */}
          <Flex
            display={{ base: 'flex', md: 'none' }}
            justify="space-between"
            align="center"
            w="full"
          >
            <VStack align="start" spacing={1}>
              <Heading size="md">{merchant?.metadata?.businessName || 'Merchant Dashboard'}</Heading>
              <Badge colorScheme={merchant?.status === 'active' ? 'green' : 'yellow'}>
                {merchant?.status}
              </Badge>
            </VStack>
            <IconButton
              icon={<FiMenu />}
              onClick={onMenuOpen}
              variant="ghost"
            />
          </Flex>

          {/* Desktop Header */}
          <Flex
            display={{ base: 'none', md: 'flex' }}
            justify="space-between"
            align="center"
            w="full"
          >
            <VStack align="start" spacing={1}>
              <Heading size="lg">Merchant Dashboard</Heading>
              <Text color="gray.500">
                {merchant?.metadata?.businessName}
              </Text>
              <Badge colorScheme={merchant?.status === 'active' ? 'green' : 'yellow'}>
                {merchant?.status}
              </Badge>
            </VStack>
            <HStack spacing={4}>
              {/* <Button
                leftIcon={<FaQrcode />}
                colorScheme="blue"
                onClick={onQROpen}
              >
                Generate QR Code
              </Button> */}
              <Button
                leftIcon={<FiLink />}
                colorScheme="green"
                onClick={onPaymentLinkOpen}
              >
                Create Payment Link
              </Button>
            </HStack>
          </Flex>

          {/* Wallet Balance */}
          <WalletBalance 
            type="merchant" 
            walletId={merchant?.wallet?.data?.id} 
          />

          {/* Stats Overview */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 3, md: 6 }} w="full">
            <StatCard
              label="Total Revenue"
              value={merchant?.metadata?.totalRevenue || 0}
              prefix="LYD"
              icon={FiDollarSign}
              color="blue"
            />
            <StatCard
              label="Today's Sales"
              value={merchant?.metadata?.todaySales || 0}
              prefix="LYD"
              icon={FiTrendingUp}
              color="green"
            />
            <StatCard
              label="Active Links"
              value={merchant?.metadata?.activeLinks || 0}
              icon={FiLink}
              color="purple"
            />
            <StatCard
              label="Success Rate"
              value={merchant?.metadata?.successRate || 0}
              suffix="%"
              icon={FiCreditCard}
              color="orange"
            />
          </SimpleGrid>

          {/* Main Content */}
          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} w="full">
            {/* Left Column */}
            <GridItem>
              <VStack spacing={6}>
                {/* Recent Transactions */}
                <Box
                  p={6}
                  bg={bgColor}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                  w="full"
                >
                  <VStack align="stretch" spacing={4}>
                    <Flex justify="space-between" align="center">
                      <Heading size="md">Recent Transactions</Heading>
                      <Button
                        leftIcon={<FiDownload />}
                        size="sm"
                        onClick={() => exportTransactions.mutate()}
                        isLoading={exportTransactions.isLoading}
                      >
                        Export
                      </Button>
                    </Flex>
                    <TransactionsList merchantId={merchantData?.id} />
                  </VStack>
                </Box>
              </VStack>
            </GridItem>

            {/* Right Column */}
            <GridItem>
              <VStack spacing={6}>
                {/* Business Details */}
                <Box
                  p={6}
                  bg={bgColor}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                  w="full"
                >
                  <VStack align="stretch" spacing={4}>
                    <Flex justify="space-between" align="center">
                      <Heading size="md">Business Details</Heading>
                      <IconButton
                        icon={<FiSettings />}
                        variant="ghost"
                        onClick={() => router.push('/settings')}
                      />
                    </Flex>
                    <SimpleGrid columns={1} spacing={4}>
                      <Box>
                        <Text color="gray.500" fontSize="sm">Business Name</Text>
                        <Text fontWeight="medium">{merchant?.metadata?.businessName || 'N/A'}</Text>
                      </Box>
                      <Box>
                        <Text color="gray.500" fontSize="sm">Registration Number</Text>
                        <Text fontWeight="medium">{merchant?.metadata?.registrationNumber || 'N/A'}</Text>
                      </Box>
                      <Box>
                        <Text color="gray.500" fontSize="sm">Contact Phone</Text>
                        <Text fontWeight="medium">{merchant?.metadata?.contact?.phone || 'N/A'}</Text>
                      </Box>
                    </SimpleGrid>
                  </VStack>
                </Box>

                {/* Active Payment Links */}
                <Box
                  p={6}
                  bg={bgColor}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                  w="full"
                >
                  <VStack align="stretch" spacing={4}>
                    <Flex justify="space-between" align="center">
                      <Heading size="md">Active Payment Links</Heading>
                      <Button
                        leftIcon={<FiPlus />}
                        size="sm"
                        onClick={onPaymentLinkOpen}
                      >
                        Create New
                      </Button>
                    </Flex>
                    <PaymentLinksList merchantId={merchantData?.id} />
                  </VStack>
                </Box>
              </VStack>
            </GridItem>
          </Grid>
        </VStack>

        {/* Mobile Menu Drawer */}
        <Drawer
          isOpen={isMenuOpen}
          placement="right"
          onClose={onMenuClose}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Quick Actions</DrawerHeader>
            <DrawerBody>
              <VStack spacing={4}>
                {/* <Button
                  w="full"
                  leftIcon={<FaQrcode />}
                  onClick={() => {
                    onMenuClose();
                    onQROpen();
                  }}
                >
                  Generate QR Code
                </Button> */}
                <Button
                  w="full"
                  leftIcon={<FiLink />}
                  onClick={() => {
                    onMenuClose();
                    onPaymentLinkOpen();
                  }}
                >
                  Create Payment Link
                </Button>
                <Button
                  w="full"
                  leftIcon={<FiDownload />}
                  onClick={() => {
                    onMenuClose();
                    exportTransactions.mutate();
                  }}
                >
                  Export Transactions
                </Button>
                <Button
                  w="full"
                  leftIcon={<FiSettings />}
                  onClick={() => {
                    onMenuClose();
                    router.push('/settings');
                  }}
                >
                  Settings
                </Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Modals */}
        <PaymentLinkGenerator 
        merchantData={merchantData}
        isOpen={isPaymentLinkOpen}
        onClose={onPaymentLinkClose}
        />
      </Container>
    </Layout>
  );
};

const StatCard = ({ label, value, prefix, suffix, icon, color }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const displayValue = `${prefix ? prefix + ' ' : ''}${typeof value === 'number' ? value.toLocaleString() : value}${suffix ? ' ' + suffix : ''}`;
  
  return (
    <Box
      p={6}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <VStack align="start" spacing={2}>
        <Icon as={icon} boxSize={6} color={`${color}.500`} />
        <Stat>
          <StatLabel>{label}</StatLabel>
          <StatNumber>{displayValue}</StatNumber>
        </Stat>
      </VStack>
    </Box>
  );
};

export default MerchantDashboard;