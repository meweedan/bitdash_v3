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
  Divider,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Tag,
  Avatar,
  Stack,
} from '@chakra-ui/react';
import {
  FiDollarSign,
  FiCreditCard,
  FiSettings,
  FiDownload,
  FiLink,
  FiTrendingUp,
  FiCalendar,
  FiMapPin,
  FiMail,
  FiPlus,
  FiPhone,
} from 'react-icons/fi';
import { FaQrcode } from 'react-icons/fa';
import format from 'date-fns/format';

// Components
import TransactionsList from '@/components/cash/merchant/TransactionsList';
import PaymentLinksList from '@/components/cash/merchant/PaymentLinksList';
import WalletBalance from '@/components/cash/WalletBalance';
import PaymentLinkGenerator from '@/components/cash/merchant/PaymentLinkGenerator';

const statusColors = {
  active: 'green',
  completed: 'blue',
  pending: 'orange',
  expired: 'red',
  failed: 'red',
  suspended: 'yellow',
};

const MerchantDashboard = () => {
  const router = useRouter();
  const toast = useToast();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // UI state
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  // Modal controls
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
  });

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

  const merchant = merchantData?.attributes || {};

  // Enhanced Business Details Component
  const BusinessDetails = () => (
    <VStack spacing={4} align="stretch">
      <Flex justify="space-between" align="center">
        <Heading size="md">Business Information</Heading>
        <IconButton
          icon={<FiSettings />}
          variant="ghost"
          onClick={() => router.push('/settings')}
          aria-label="Settings"
        />
      </Flex>
      
      <Stack spacing={3}>
        <DetailItem icon={FiMapPin} label="Address">
          {merchant?.location?.address || 'N/A'}
        </DetailItem>
        
        <DetailItem icon={FiMail} label="Email">
          {merchant?.contact?.email || 'N/A'}
        </DetailItem>
        
        <DetailItem icon={FiPhone} label="Phone">
          {merchant?.contact?.phone || 'N/A'}
        </DetailItem>
        
        <DetailItem icon={FiCreditCard} label="Registration Number">
          {merchant?.registrationNumber || 'Not provided'}
        </DetailItem>
        
        <Flex align="center" justify="space-between">
          <Text fontSize="sm" color={mutedColor}>Verification Status</Text>
          <Badge 
            colorScheme={merchant.verificationStatus === 'verified' ? 'green' : 'orange'}
            textTransform="capitalize"
          >
            {merchant.verificationStatus}
          </Badge>
        </Flex>
      </Stack>
    </VStack>
  );

  // Responsive Header Component
  const DashboardHeader = () => (
    <Flex
      justify="space-between"
      align="center"
      w="full"
      pb={4}
      borderBottom="1px solid"
      borderColor={borderColor}
    >
      <HStack spacing={4}>
        {merchant?.logo?.data?.attributes?.url && (
          <Avatar 
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${merchant.logo.data.attributes.url}`}
            size="lg"
            name={merchant.businessName}
          />
        )}
        <VStack align="start" spacing={1}>
          <Heading size="lg">{merchant.businessName}</Heading>
          <HStack spacing={2}>
            <Badge 
              colorScheme={statusColors[merchant.status]}
              textTransform="capitalize"
            >
              {merchant.status}
            </Badge>
            <Text fontSize="sm" color={mutedColor}>
              {merchant.businessType}
            </Text>
          </HStack>
        </VStack>
      </HStack>

      {!isMobile && (
        <Button
          leftIcon={<FiLink />}
          colorScheme="blue"
          onClick={onPaymentLinkOpen}
          size="lg"
        >
          Create Payment Link
        </Button>
      )}
    </Flex>
  );

  return (
    <Layout>
      <Head>
        <title>{merchant.businessName || 'Merchant'} Dashboard | BitCash</title>
      </Head>

      <Container maxW="1400px" p={{ base: 2, md: 6 }}>
        <VStack spacing={6} align="stretch">
          <DashboardHeader />

          {/* Wallet & Key Metrics */}
          <SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
            <WalletBalance 
              type="merchant" 
              walletId={merchant?.wallet?.data?.id}
              currency={merchant.currency}
              style={{ gridColumn: '1 / span 1' }}
            />
            
            <StatCard
              label="Today's Sales"
              value={merchant?.metadata?.todaySales || 0}
              prefix={merchant.currency}
              icon={FiTrendingUp}
              color="green"
            />
            
            <StatCard
              label="Active Links"
              value={merchant?.payment_links?.data?.filter(
                link => link.attributes.status === 'active'
              ).length || 0}
              icon={FiLink}
              color="blue"
            />
            
            <StatCard
              label="Success Rate"
              value={(merchant?.metadata?.successRate || 0).toFixed(1)}
              suffix="%"
              icon={FiCreditCard}
              color="purple"
            />
          </SimpleGrid>

          {/* Main Content Grid */}
          <Grid
            templateColumns={{ base: '1fr', lg: '3fr 2fr' }}
            gap={6}
            alignItems="start"
          >
            {/* Left Column */}
            <GridItem>
              <VStack spacing={6} align="stretch">
                {/* Recent Transactions */}
                <DashboardCard 
                  title="Recent Transactions"
                  action={
                    <Button
                      leftIcon={<FiDownload />}
                      size="sm"
                      onClick={() => exportTransactions.mutate()}
                      isLoading={exportTransactions.isLoading}
                    >
                      Export
                    </Button>
                  }
                >
                  <TransactionsList 
                    merchantId={merchantData?.id}
                    currency={merchant.currency}
                    mobileView={isMobile}
                  />
                </DashboardCard>
              </VStack>
            </GridItem>

            {/* Right Column */}
            <GridItem>
              <VStack spacing={6} align="stretch">
                {/* Business Details */}
                <DashboardCard title="Business Details">
                  <BusinessDetails />
                </DashboardCard>

                {/* Active Payment Links */}
                <DashboardCard 
                  title="Active Payment Links"
                  action={
                    <Button
                      size="sm"
                      onClick={onPaymentLinkOpen}
                      leftIcon={<FiPlus />}
                    >
                      New Link
                    </Button>
                  }
                >
                  <PaymentLinksList 
                    merchantId={merchantData?.id}
                    currency={merchant.currency}
                    mobileView={isMobile}
                  />
                </DashboardCard>
              </VStack>
            </GridItem>
          </Grid>
        </VStack>

        {/* Mobile Actions Drawer */}
        <MobileActionsDrawer
          isOpen={isMenuOpen}
          onClose={onMenuClose}
          onPaymentLinkOpen={onPaymentLinkOpen}
        />

        {/* Payment Link Generator Modal */}
        <PaymentLinkGenerator 
          merchantData={merchantData}
          isOpen={isPaymentLinkOpen}
          onClose={onPaymentLinkClose}
          currency={merchant.currency}
        />
      </Container>
    </Layout>
  );
};

// Reusable Components
const DashboardCard = ({ title, children, action }) => (
  <Box
    bg={useColorModeValue('white', 'gray.800')}
    borderRadius="xl"
    p={6}
    boxShadow="sm"
    border="1px solid"
    borderColor={useColorModeValue('gray.100', 'gray.700')}
  >
    <VStack align="stretch" spacing={4}>
      <Flex justify="space-between" align="center">
        <Heading size="md">{title}</Heading>
        {action}
      </Flex>
      {children}
    </VStack>
  </Box>
);

const DetailItem = ({ icon, label, children }) => (
  <Flex align="center" justify="space-between">
    <HStack spacing={3} color={useColorModeValue('gray.600', 'gray.400')}>
      <Icon as={icon} boxSize={5} />
      <Text fontSize="sm">{label}</Text>
    </HStack>
    <Text fontWeight="medium" textAlign="right">
      {children}
    </Text>
  </Flex>
);

const MobileActionsDrawer = ({ isOpen, onClose, onPaymentLinkOpen }) => (
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
          <Button leftIcon={<FiDownload />}>
            Export Transactions
          </Button>
          <Button leftIcon={<FiSettings />}>
            Business Settings
          </Button>
        </VStack>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);

const StatCard = ({ label, value, prefix, suffix, icon, color }) => (
  <Box
    p={5}
    bg={useColorModeValue('white', 'gray.800')}
    borderRadius="xl"
    boxShadow="sm"
    border="1px solid"
    borderColor={useColorModeValue('gray.100', 'gray.700')}
  >
    <HStack justify="space-between">
      <VStack align="start" spacing={1}>
        <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
          {label}
        </Text>
        <HStack spacing={2}>
          {prefix && <Text fontSize="sm">{prefix}</Text>}
          <Text fontSize="xl" fontWeight="bold">
            {value}
          </Text>
          {suffix && <Text fontSize="sm">{suffix}</Text>}
        </HStack>
      </VStack>
      <Icon as={icon} boxSize={8} color={`${color}.500`} />
    </HStack>
  </Box>
);

export default MerchantDashboard;