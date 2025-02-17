// pages/pay/merchant/dashboard.js
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
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
  useBreakpointValue,
  Wrap,
  WrapItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  GridItem,
} from '@chakra-ui/react';
import {
  FiLink,
  FiTrendingUp,
  FiCreditCard,
  FiSettings,
  FiDownload,
  FiUsers,
  FiBarChart2,
  FiActivity,
  FiMoreVertical,
  FiPieChart,
  FiLogOut,
  FiMapPin,
  FiMail,
  FiPhone,
} from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { motion } from 'framer-motion';

// Import your existing components
import TransactionsList from '@/components/cash/merchant/TransactionsList';
import PaymentLinksList from '@/components/cash/merchant/PaymentLinksList';
import PaymentLinkGenerator from '@/components/cash/merchant/PaymentLinkGenerator';
import BusinessDetailsCard from '@/components/cash/merchant/BusinessDetailsCard';
import RevenueChart from '@/components/charts/RevenueChart';
import MerchantMetrics from '@/components/cash/merchant/MerchantMetrics';
import CustomerAnalytics from '@/components/cash/merchant/CustomerAnalytics';

const MotionStat = motion(Stat);

// Reusable Detail Item Component
const DetailItem = ({ icon, label, children }) => {
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Flex align="center" justify="space-between">
      <HStack spacing={3} color={mutedColor}>
        <Icon as={icon} boxSize={5} />
        <Text fontSize="sm">{label}</Text>
      </HStack>
      <Text fontWeight="medium" textAlign="right">
        {children}
      </Text>
    </Flex>
  );
};

// Mobile Actions Drawer
const MobileActionsDrawer = ({ isOpen, onClose, onPaymentLinkOpen, onExport, onSettings, onLogout }) => (
  <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
    <DrawerOverlay />
    <DrawerContent>
      <DrawerCloseButton />
      <DrawerHeader>Quick Actions</DrawerHeader>
      <DrawerBody>
        <VStack spacing={4} align="stretch">
          <Button
            leftIcon={<FiLink />}
            onClick={() => {
              onClose();
              onPaymentLinkOpen();
            }}
          >
            Create Payment Link
          </Button>
          <Button leftIcon={<FiDownload />} onClick={onExport}>
            Export Transactions
          </Button>
          <Button leftIcon={<FiSettings />} onClick={onSettings}>
            Business Settings
          </Button>
          <Button 
            leftIcon={<FiLogOut />} 
            colorScheme="red" 
            variant="outline" 
            onClick={onLogout}
          >
            Logout
          </Button>
        </VStack>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);

const MerchantDashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const { t } = useTranslation(['dashboard', 'common']);
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Modal and drawer controls
  const { 
    isOpen: isPaymentLinkOpen, 
    onOpen: onPaymentLinkOpen, 
    onClose: onPaymentLinkClose 
  } = useDisclosure();

  const {
    isOpen: isMenuModalOpen,
    onOpen: onMenuModalOpen,
    onClose: onMenuModalClose
  } = useDisclosure();

  // Fetch merchant data
  const { 
    data: merchantData,
    isLoading: isMerchantLoading,
    error: merchantError
  } = useQuery({
    queryKey: ['merchantData', user?.id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/merchants/me`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch merchant data');
      return response.json();
    },
    enabled: !!user?.id,
  });

  // Export transactions
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

  // Calculate business metrics
  const metrics = useMemo(() => {
    if (!merchantData) return {
      totalRevenue: 0,
      totalTransactions: 0,
      averageOrder: 0,
      customerCount: 0,
      monthlyRevenue: 0,
      revenueGrowth: 0
    };

    const transactions = merchantData.transactions || [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const lastMonth = currentMonth - 1;
    
    const currentMonthRevenue = transactions
      .filter(t => new Date(t.createdAt).getMonth() === currentMonth)
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthRevenue = transactions
      .filter(t => new Date(t.createdAt).getMonth() === lastMonth)
      .reduce((sum, t) => sum + t.amount, 0);

    const revenueGrowth = lastMonthRevenue ? 
      ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

    return {
      totalRevenue: transactions.reduce((sum, t) => sum + t.amount, 0),
      totalTransactions: transactions.length,
      averageOrder: transactions.length ? 
        transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length : 0,
      customerCount: new Set(transactions.map(t => t.customer?.id)).size,
      monthlyRevenue: currentMonthRevenue,
      revenueGrowth
    };
  }, [merchantData]);

  // Calculate daily revenue trend
  const dailyRevenue = useMemo(() => {
    if (!merchantData?.transactions) return [];
    
    const dailyTotals = merchantData.transactions.reduce((acc, t) => {
      const date = new Date(t.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + t.amount;
      return acc;
    }, {});

    return Object.entries(dailyTotals).map(([date, amount]) => ({
      date,
      amount
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [merchantData]);

  // Loading and error handling
  if (isMerchantLoading) {
    return (
      <Layout>
        <Container maxW="1400px" p={{ base: 2, md: 6 }}>
          <Text>Loading...</Text>
        </Container>
      </Layout>
    );
  }

  if (merchantError) {
    return (
      <Layout>
        <Container maxW="1400px" p={{ base: 2, md: 6 }}>
          <Text color="red.500">Error: {merchantError.message}</Text>
        </Container>
      </Layout>
    );
  }

  const merchant = merchantData?.attributes || {};

  // Export and logout handlers
  const handleExport = () => {
    exportTransactions.mutate();
    onMenuModalClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
    onMenuModalClose();
  };

  return (
    <Layout>
      <Head>
        <title>{merchant.businessName || 'Merchant'} Dashboard | BitCash</title>
      </Head>

      <Container maxW="1400px" p={{ base: 2, md: 6 }}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Box
            p={{ base: 4, md: 6 }}
            bg={useColorModeValue('white', 'gray.800')}
            borderRadius="2xl"
            boxShadow="sm"
            position="relative"
            overflow="hidden"
          >
            <Flex
              justify="space-between"
              align={{ base: "start", md: "center" }}
              direction={{ base: "column", sm: "row" }}
              gap={{ base: 4, md: 0 }}
            >
              <HStack spacing={4}>
                <Avatar
                  size={{ base: "lg", md: "xl" }}
                  src={merchant?.logo?.data?.attributes?.url}
                  name={merchant.businessName}
                />
                <VStack align="start" spacing={1}>
                  <Heading size={{ base: "md", md: "lg" }}>
                    {merchant.businessName}
                  </Heading>
                  <HStack>
                    <Badge colorScheme={merchant.status === 'active' ? 'green' : 'yellow'}>
                      {merchant.status}
                    </Badge>
                    <Badge colorScheme="purple">{merchant.businessType}</Badge>
                  </HStack>
                </VStack>
              </HStack>

              <Wrap spacing={2}>
                <WrapItem>
                  <Button
                    leftIcon={<FiLink />}
                    colorScheme="blue"
                    onClick={onPaymentLinkOpen}
                  >
                    New Payment Link
                  </Button>
                </WrapItem>
                <WrapItem>
                  <IconButton
                    icon={<FiMoreVertical />}
                    variant="ghost"
                    onClick={onMenuModalOpen}
                  />
                </WrapItem>
              </Wrap>
            </Flex>
          </Box>

          {/* Grid Layout */}
          <SimpleGrid columns={{ base: 1, lg: 4 }} spacing={6}>
            {/* Wallet and Metrics */}
            <GridItem colSpan={{ base: 1, lg: 2 }}>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                {/* Business Details Card */}
                <BusinessDetailsCard merchant={merchant} />
                
                {/* Revenue and Customer Stats */}
                <VStack spacing={4}>
                  <MotionStat
                    p={6}
                    bg={useColorModeValue('white', 'gray.800')}
                    borderRadius="xl"
                    boxShadow="sm"
                    whileHover={{ scale: 1.02 }}
                  >
                    <StatLabel>Monthly Revenue</StatLabel>
                    <StatNumber fontSize="2xl">
                      {metrics.monthlyRevenue.toLocaleString()} LYD
                    </StatNumber>
                    <StatHelpText>
                      <HStack>
                        <Icon 
                          as={metrics.revenueGrowth >= 0 ? FiTrendingUp : FiTrendingDown} 
                          color={metrics.revenueGrowth >= 0 ? "green.500" : "red.500"}
                        />
                        <Text color={metrics.revenueGrowth >= 0 ? "green.500" : "red.500"}>
                          {Math.abs(metrics.revenueGrowth).toFixed(1)}% from last month
                        </Text>
                      </HStack>
                    </StatHelpText>
                  </MotionStat>

                  <MotionStat
                    p={6}
                    bg={useColorModeValue('white', 'gray.800')}
                    borderRadius="xl"
                    boxShadow="sm"
                    whileHover={{ scale: 1.02 }}
                  >
                    <StatLabel>Total Customers</StatLabel>
                    <StatNumber fontSize="2xl">
                      {metrics.customerCount.toLocaleString()}
                    </StatNumber>
                    <StatHelpText>
                      Avg. Order: {metrics.averageOrder.toLocaleString()} LYD
                    </StatHelpText>
                  </MotionStat>
                </VStack>
              </SimpleGrid>
            </GridItem>

            {/* Revenue Chart and Merchant Metrics */}
            <GridItem colSpan={{ base: 1, lg: 2 }}>
              <VStack spacing={4}>
                <RevenueChart data={dailyRevenue} />
                <MerchantMetrics metrics={metrics} />
              </VStack>
            </GridItem>
          </SimpleGrid>

          {/* Transactions and Payment Links */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <VStack spacing={4}>
              <TransactionsList
                merchantId={merchantData?.id || merchantData?.data?.id}
                currency={merchant.currency}
              />
            </VStack>
            <VStack spacing={4}>
              <PaymentLinksList
                merchantId={merchantData?.id || merchantData?.data?.id}
                currency={merchant.currency}
                onCreateLink={onPaymentLinkOpen}
              />
            </VStack>
          </SimpleGrid>

          {/* Customer Analytics */}
          <CustomerAnalytics
            transactions={merchantData?.transactions || []}
          />
        </VStack>

        {/* Payment Link Generator Modal */}
        <PaymentLinkGenerator
          merchantData={merchantData}
          isOpen={isPaymentLinkOpen}
          onClose={onPaymentLinkClose}
          currency={merchant.currency}
        />

        {/* Settings/Menu Modal */}
        <Modal
          isOpen={isMenuModalOpen}
          onClose={onMenuModalClose}
          size="xs"
        >
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent>
            <ModalHeader>Quick Actions</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} w="full">
                <Button
                  leftIcon={<FiSettings />}
                  onClick={() => {
                    onMenuModalClose();
                    router.push('/merchant/settings');
                  }}
                  w="full"
                  justifyContent="start"
                >
                  Business Settings
                </Button>

                <Button
                  leftIcon={<FiPieChart />}
                  onClick={() => {
                    onMenuModalClose();
                    router.push('/merchant/analytics');
                  }}
                  w="full"
                  justifyContent="start"
                >
                  Advanced Analytics
                </Button>

                <Button
                  leftIcon={<FiDownload />}
                  onClick={handleExport}
                  w="full"
                  justifyContent="start"
                  isLoading={exportTransactions.isLoading}
                >
                  Export Data
                </Button>

                <Button
                  leftIcon={<FiLogOut />}
                  onClick={handleLogout}
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

        {/* Mobile Actions Drawer */}
        <MobileActionsDrawer
          isOpen={isMenuModalOpen}
          onClose={onMenuModalClose}
          onPaymentLinkOpen={onPaymentLinkOpen}
          onExport={handleExport}
          onSettings={() => {
            onMenuModalClose();
            router.push('/merchant/settings');
          }}
          onLogout={handleLogout}
        />

        {/* Mobile Bottom Action Button */}
        <Box
          position="fixed"
          bottom={4}
          right={4}
          zIndex={20}
          display={{ base: 'block', md: 'none' }}
        >
          <Button
            colorScheme="blue"
            size="lg"
            rounded="full"
            leftIcon={<FiLink />}
            onClick={onPaymentLinkOpen}
            boxShadow="lg"
          >
            New Link
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

// Server-side translation setup
export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['dashboard', 'common'])),
  },
});

export default MerchantDashboard;