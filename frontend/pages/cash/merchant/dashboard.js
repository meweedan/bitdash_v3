import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { format, parseISO, subDays } from 'date-fns';
import {
  Box,
  Container,
  Flex,
  VStack,
  HStack,
  SimpleGrid,
  Text,
  Heading,
  Button,
  IconButton,
  Badge,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Alert,
  Spinner,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  useToast,
  Stack,
  Divider,
} from '@chakra-ui/react';

// Layout & Components
import Layout from '@/components/Layout';
import GlassCard from '@/components/GlassCard';
import TransactionList from '@/components/transactions/TransactionList';
import TransactionSummary from '@/components/transactions/TransactionSummary';
import PaymentLinksList from '@/components/cash/merchant/PaymentLinksList';
import PaymentLinkGenerator from '@/components/cash/merchant/PaymentLinkGenerator';
import ProfileEditor from '@/components/cash/merchant/ProfileEditor';
import BusinessDetailsCard from '@/components/cash/merchant/BusinessDetailsCard';

// Icons
import { 
  CreditCard, DollarSign, TrendingUp, Menu as MenuIcon, Settings, 
  RefreshCw, ChevronDown, LogOut, Activity, Link as LinkIcon, Plus, 
  Download, MapPin, Phone, Mail, Building2, FileText, QrCode,
  Clock, ArrowUpRight, ArrowDownRight, Wallet, AlertTriangle,
  Share2, PieChart, Users, BarChart4, Calendar, Eye, EyeOff
} from 'lucide-react';

const ProcessingFeesWidget = ({ transactions }) => {
  const today = new Date().toISOString().split('T')[0];
  const thisMonth = new Date().toISOString().slice(0, 7);

  const stats = useMemo(() => {
    const todayTxs = transactions?.data?.filter(tx => 
      tx.attributes.createdAt.startsWith(today)
    ) || [];

    const monthTxs = transactions?.data?.filter(tx =>
      tx.attributes.createdAt.startsWith(thisMonth)
    ) || [];

    return {
      todayFees: todayTxs.reduce((sum, tx) => sum + (parseFloat(tx.attributes.fee) || 0), 0),
      monthlyFees: monthTxs.reduce((sum, tx) => sum + (parseFloat(tx.attributes.fee) || 0), 0),
      averageFee: monthTxs.length ? 
        monthTxs.reduce((sum, tx) => sum + (parseFloat(tx.attributes.fee) || 0), 0) / monthTxs.length 
        : 0
    };
  }, [transactions, today, thisMonth]);

  return (
    <GlassCard variant="bitcash">
      <VStack spacing={4} p={6}>
        <HStack w="full" justify="space-between">
          <Heading size="md" display="flex" alignItems="center" gap={2}>
            <DollarSign />
            Processing Fees
          </Heading>
          <Tooltip label="Updated in real-time">
            <IconButton
              icon={<RefreshCw />}
              variant="ghost"
              size="sm"
              colorScheme="bitcash"
            />
          </Tooltip>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
          <Stat>
            <StatLabel>Today's Fees</StatLabel>
            <StatNumber>
              LYD {stats.todayFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Monthly Total</StatLabel>
            <StatNumber>
              LYD {stats.monthlyFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Average Fee</StatLabel>
            <StatNumber>
              LYD {stats.averageFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </StatNumber>
          </Stat>
        </SimpleGrid>
      </VStack>
    </GlassCard>
  );
};

const WalletBalanceWidget = ({ wallet, merchant }) => {
  const [showBalance, setShowBalance] = useState(false);

  const dailyLimitUsage = useMemo(() => {
    if (!merchant?.transactions?.data || !wallet?.dailyLimit) return 0;
    const today = new Date().toISOString().split('T')[0];
    const todayTotal = merchant.transactions.data
      .filter(tx => tx.attributes.createdAt.startsWith(today))
      .reduce((sum, tx) => sum + parseFloat(tx.attributes.amount), 0);
    return (todayTotal / wallet.dailyLimit) * 100;
  }, [merchant, wallet]);

  return (
    <GlassCard variant="bitcash">
      <Box p={6} position="relative" overflow="hidden">
        <Box
          position="absolute"
          top="-50%"
          right="-20%"
          w="70%"
          h="200%"
          filter="blur(100px)"
          opacity={0.1}
          transform="rotate(-15deg)"
          pointerEvents="none"
        />

        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Heading size="md" display="flex" alignItems="center" gap={2}>
                <Wallet />
                Wallet Balance
              </Heading>
              <Text color="gray.500" fontSize="sm">
                Last updated: {format(new Date(), 'MMM d, h:mm a')}
              </Text>
            </VStack>
            <Badge 
              colorScheme={wallet.isActive ? 'green' : 'red'}
              variant="subtle"
              px={3}
              py={1}
              borderRadius="full"
            >
              {wallet.isActive ? 'ACTIVE' : 'INACTIVE'}
            </Badge>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box>
              <HStack justify="space-between" mb={2}>
                <Text color="gray.500" fontSize="sm">Available Balance</Text>
                <IconButton
                  icon={showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBalance(!showBalance)}
                />
              </HStack>
              <Heading size="lg">
                {showBalance 
                  ? `${wallet.balance.toLocaleString()} ${merchant.currency}`
                  : '••••••••'
                }
              </Heading>
            </Box>

            <Box>
              <Text color="gray.500" fontSize="sm" mb={2}>Daily Limit Usage</Text>
              <Progress 
                value={dailyLimitUsage} 
                size="lg"
                borderRadius="full"
                colorScheme={dailyLimitUsage > 80 ? 'red' : 'bitcash'}
                mb={2}
              />
              <HStack justify="space-between">
                <Text fontSize="sm">
                  {dailyLimitUsage.toFixed(1)}% Used
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Limit: {wallet.dailyLimit.toLocaleString()} {merchant.currency}
                </Text>
              </HStack>
            </Box>
          </SimpleGrid>

          {dailyLimitUsage > 80 && (
            <Alert status="warning" borderRadius="lg">
              <AlertIcon />
              <AlertDescription>
                You are approaching your daily transaction limit
              </AlertDescription>
            </Alert>
          )}
        </VStack>
      </Box>
    </GlassCard>
  );
};

const QuickMetricsGrid = ({ merchant }) => {
  const metrics = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);
    
    const todayTxs = merchant.transactions.data
      .filter(tx => tx.attributes.createdAt.startsWith(today));
    
    const monthTxs = merchant.transactions.data
      .filter(tx => tx.attributes.createdAt.startsWith(thisMonth));

    const completedTodayTxs = todayTxs
      .filter(tx => tx.attributes.status === 'completed');

    return {
      todayVolume: todayTxs.reduce((sum, tx) => 
        sum + parseFloat(tx.attributes.amount), 0
      ),
      monthlyVolume: monthTxs.reduce((sum, tx) => 
        sum + parseFloat(tx.attributes.amount), 0
      ),
      successRate: todayTxs.length 
        ? (completedTodayTxs.length / todayTxs.length) * 100 
        : 0,
      activeLinks: merchant.payment_links.data
        .filter(link => link.attributes.status === 'active')
        .length
    };
  }, [merchant]);

  return (
    <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={6}>
      <GlassCard variant="bitcash">
        <VStack p={6} align="start" spacing={2}>
          <HStack color="gray.500">
            <Clock size={16} />
            <Text fontSize="sm">Today's Volume</Text>
          </HStack>
          <Heading size="lg">
            {metrics.todayVolume.toLocaleString()} {merchant.currency}
          </Heading>
        </VStack>
      </GlassCard>

      <GlassCard variant="bitcash">
        <VStack p={6} align="start" spacing={2}>
          <HStack color="gray.500">
            <BarChart4 size={16} />
            <Text fontSize="sm">Monthly Volume</Text>
          </HStack>
          <Heading size="lg">
            {metrics.monthlyVolume.toLocaleString()} {merchant.currency}
          </Heading>
        </VStack>
      </GlassCard>

      <GlassCard variant="bitcash">
        <VStack p={6} align="start" spacing={2}>
          <HStack color="gray.500">
            <Activity size={16} />
            <Text fontSize="sm">Success Rate</Text>
          </HStack>
          <Heading size="lg">
            {metrics.successRate.toFixed(1)}%
          </Heading>
        </VStack>
      </GlassCard>

      <GlassCard variant="bitcash">
        <VStack p={6} align="start" spacing={2}>
          <HStack color="gray.500">
            <LinkIcon size={16} />
            <Text fontSize="sm">Active Links</Text>
          </HStack>
          <Heading size="lg">
            {metrics.activeLinks}
          </Heading>
        </VStack>
      </GlassCard>
    </SimpleGrid>
  );
};

const MerchantDashboard = () => {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const { isOpen: isProfileOpen, onOpen: onProfileOpen, onClose: onProfileClose } = useDisclosure();
  const { isOpen: isPaymentLinkOpen, onOpen: onPaymentLinkOpen, onClose: onPaymentLinkClose } = useDisclosure();

  const { 
  data: merchantData, 
  isLoading, 
  error,
  refetch
} = useQuery({
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
    return data.data[0]; // Key change: return the first merchant directly
  },
  enabled: !!isAuthenticated,
  refetchInterval: 30000
});

// Remove duplicate useEffect
useEffect(() => {
  if (!authLoading && !isAuthenticated) {
    router.push('/login');
  }
}, [authLoading, isAuthenticated, router]);

// Loading state
if (authLoading || isLoading) {
  return (
    <Layout>
      <Box>
        <Container maxW="7xl" py={8}>
          <VStack spacing={8} align="center" justify="center" minH="60vh">
            <Spinner size="xl" />
            <Text color="gray.500">Loading your dashboard...</Text>
          </VStack>
        </Container>
      </Box>
    </Layout>
  );
}

// Error handling
if (error || !merchantData?.data?.[0]) {
  return (
    <Layout>
      <Box>
        <Container maxW="7xl" py={8}>
          <Alert status="error" variant="solid">
            <AlertIcon />
            <AlertTitle>Error Loading Dashboard</AlertTitle>
            <AlertDescription>
              {error?.message || 'Failed to load merchant data'}
            </AlertDescription>
            <Button onClick={() => router.push('/login')}>
              Return to Login
            </Button>
          </Alert>
        </Container>
      </Box>
    </Layout>
  );
}

// Correct data access
const merchant = merchantData?.attributes || {};
const wallet = merchant?.wallet?.data?.attributes;

  return (
    <Layout>
      <Head>
        <title>{merchant.businessName} | Merchant Dashboard</title>
      </Head>

      <Box>
        <Container maxW="7xl" py={8}>
          <VStack spacing={6}>
            {/* Mobile Header */}
            <Flex
              display={{ base: 'flex', md: 'none' }}
              justify="space-between"
              align="center"
              w="full"
            >
              <VStack align="start" spacing={1}>
                <Heading size="md">{merchant.businessName}</Heading>
                <Badge colorScheme={merchant.status === 'active' ? 'green' : 'yellow'}>
                  {merchant.status}
                </Badge>
              </VStack>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<MenuIcon />}
                  variant="ghost"
                  aria-label="Options"
                />
                <MenuList>
                  <MenuItem icon={<RefreshCw />} onClick={refetch}>
                    Refresh
                  </MenuItem>
                  <MenuItem icon={<Download />} onClick={() => router.push('/transactions')}>
                    Export Transactions
                  </MenuItem>
                  <MenuItem icon={<Settings />} onClick={onProfileOpen}>
                    Edit Profile
                  </MenuItem>
                  <MenuItem icon={<LogOut />} onClick={logout}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>

            {/* Desktop Header */}
            <Flex
              display={{ base: 'none', md: 'flex' }}
              justify="space-between"
              align="center"
              w="full"
            >
              <Box>
                <Heading size="lg">Merchant Dashboard</Heading>
                <Text color="gray.500" mt={1}>
                  Welcome back to {merchant.businessName}
                </Text>
              </Box>
              <HStack spacing={4}>
                <Button
                  leftIcon={<Plus />}
                  colorScheme="bitcash"
                  onClick={onPaymentLinkOpen}
                >
                  Create Payment Link
                </Button>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDown />}
                    variant="ghost"
                  >
                    Actions
                  </MenuButton>
                  <MenuList>
                    <MenuItem icon={<RefreshCw />} onClick={refetch}>
                      Refresh
                    </MenuItem>
                    <MenuItem icon={<Download />} onClick={() => router.push('/transactions')}>
                      Export Transactions
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

            {/* Business Overview */}
            <BusinessDetailsCard 
              merchant={merchantData.data[0].attributes}
              onQROpen={() => {/* QR code handler */}}
              onCreateLink={() => {/* Link creation handler */}}
            />

            {/* Wallet & Processing Fees */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} w="full">
              <WalletBalanceWidget wallet={wallet} merchant={merchant} />
              <ProcessingFeesWidget transactions={merchant.transactions} />
            </SimpleGrid>

            {/* Quick Metrics */}
            <QuickMetricsGrid merchant={merchant} />

            {/* Transactions & Payment Links */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} w="full">
              <GlassCard variant="bitcash">
                <VStack spacing={4} p={6} align="stretch">
                  <HStack justify="space-between">
                    <Heading size="md">Recent Transactions</Heading>
                    <Button
                      rightIcon={<ChevronDown />}
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push('/transactions')}
                    >
                      View All
                    </Button>
                  </HStack>
                  <TransactionList 
                    transactions={merchant.transactions.data.slice(0, 5)} 
                    isLoading={isLoading}
                  />
                </VStack>
              </GlassCard>

              <GlassCard variant="bitcash">
                <VStack spacing={4} p={6} align="stretch">
                  <HStack justify="space-between">
                    <Heading size="md">Active Payment Links</Heading>
                    <Button
                      leftIcon={<Plus />}
                      variant="ghost"
                      size="sm"
                      onClick={onPaymentLinkOpen}
                    >
                      Create New
                    </Button>
                  </HStack>
                  <PaymentLinksList merchantId={merchantData.data[0].id} />
                </VStack>
              </GlassCard>
            </SimpleGrid>
          </VStack>
        </Container>

        {/* Payment Link Modal */}
        <PaymentLinkGenerator
          merchantData={merchantData.data[0]}
          isOpen={isPaymentLinkOpen}
          onClose={onPaymentLinkClose}
        />

        {/* Profile Editor */}
        <ProfileEditor 
          merchant={merchantData.data[0]}
          isOpen={isProfileOpen}
          onClose={onProfileClose}
          onUpdate={(updatedData) => {
            queryClient.setQueryData(['merchantData', user?.id], (old) => ({
              ...old,
              data: [updatedData.data]
            }));
          }}
        />
      </Box>
    </Layout>
  );
};

export default MerchantDashboard;