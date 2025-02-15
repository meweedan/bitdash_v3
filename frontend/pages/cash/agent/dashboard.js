import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

// Layout & Common Components 
import Layout from '@/components/Layout';
import GlassCard from '@/components/GlassCard';
import QRScanner from '@/components/QRScanner';

// Agent Components
import AgentHeader from '@/components/cash/agent/AgentHeader';
import AgentMetrics from '@/components/cash/agent/AgentMetrics';
import CashBalanceWidget from '@/components/cash/agent/CashBalanceWidget';
import DailyLimitTracker from '@/components/cash/agent/DailyLimitTracker';
import LocationManager from '@/components/cash/agent/LocationManager';

// Agent deposit + withdraw logic
import DepositPage from './deposit';
import WithdrawPage from './withdraw';

// Transaction Components
import TransactionList from '@/components/transactions/TransactionList';
import TransactionSummary from '@/components/transactions/TransactionSummary';

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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Badge,
  Flex,
  Heading,
  Button,
  IconButton,
  useBreakpointValue,
  Stat,
  StatLabel,
  StatNumber,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';

import {
  QrCode,
  ArrowDownCircle,
  ArrowUpCircle,
  Menu as MenuIcon,
  Settings,
  RefreshCw,
  DollarSign,
  ChevronDown,
  LogOut,
  Activity
} from 'lucide-react';

const ProcessingFeesWidget = ({ transactions }) => {
  const calculateProcessingFees = () => {
    if (!transactions?.data?.length) return {
      totalFees: 0,
      depositFees: 0,
      withdrawalFees: 0
    };

    const today = new Date().toISOString().split('T')[0];
    const todayTransactions = transactions.data.filter(tx => 
      tx.attributes.createdAt.startsWith(today)
    );

    return {
      totalFees: todayTransactions.reduce((sum, tx) => 
        sum + (parseFloat(tx.attributes.fee) || 0), 0
      ),
      depositFees: todayTransactions
        .filter(tx => tx.attributes.type === 'deposit')
        .reduce((sum, tx) => sum + (parseFloat(tx.attributes.fee) || 0), 0),
      withdrawalFees: todayTransactions
        .filter(tx => tx.attributes.type === 'withdrawal')
        .reduce((sum, tx) => sum + (parseFloat(tx.attributes.fee) || 0), 0)
    };
  };

  const { totalFees, depositFees, withdrawalFees } = calculateProcessingFees();
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, blue.900, purple.900)'
  );

  return (
    <VStack 
      align="stretch" 
      spacing={4} 
      w="full" 
      p={6} 
      borderRadius="xl"
      bgGradient={bgGradient}
      boxShadow="xl"
    >
      <Heading size="md" display="flex" alignItems="center">
        <DollarSign style={{ marginRight: '8px' }} />
        Processing Fees
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
        <Stat>
          <StatLabel>Total Fees</StatLabel>
          <StatNumber>LYD {totalFees.toFixed(2)}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Deposit Fees</StatLabel>
          <StatNumber>LYD {depositFees.toFixed(2)}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Withdrawal Fees</StatLabel>
          <StatNumber>LYD {withdrawalFees.toFixed(2)}</StatNumber>
        </Stat>
      </SimpleGrid>
    </VStack>
  );
};

const AgentDashboard = () => {
  const router = useRouter();
  const toast = useToast();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const [scanType, setScanType] = useState(null);
  const [scannedCustomer, setScannedCustomer] = useState(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Modal controls
  const {
    isOpen: isQROpen,
    onOpen: onQROpen,
    onClose: onQRClose
  } = useDisclosure();

  const {
    isOpen: isDepositOpen,
    onOpen: onDepositOpen,
    onClose: onDepositClose
  } = useDisclosure();

  const {
    isOpen: isWithdrawalOpen,
    onOpen: onWithdrawalOpen,
    onClose: onWithdrawalClose
  } = useDisclosure();

  // First, update the auth check useEffect
  useEffect(() => {
    const checkAccess = async () => {
      if (!authLoading && !isAuthenticated) {
        router.push('/login');
        return;
      }

      if (!authLoading && isAuthenticated && user?.id) {
        try {
          // 1. Check if user is linked to an agent
          const agentResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agents?` +
            `filters[users_permissions_user][id][$eq]=${user.id}&` +
            `populate[wallet][populate]=*&` +
            `populate[operator][populate]=*`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );

          const agentData = await agentResponse.json();
          
          if (agentData.data?.length === 0) {
            toast({
              title: 'Access Denied',
              description: 'No agent account is associated with this user.',
              status: 'error',
              duration: 5000,
            });
            router.push('/login');
            return;
          }

          // Store agent ID for later use
          const agentId = agentData.data[0].id;

          // 2. Fetch agent's active payment links if they exist
          try {
            const paymentLinksResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment-links?` +
              `filters[agent][id][$eq]=${agentId}&` +
              `filters[status][$eq]=active&` +
              `populate=*`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                }
              }
            );

            if (!paymentLinksResponse.ok) {
              console.warn('Failed to fetch payment links:', await paymentLinksResponse.text());
            }
          } catch (error) {
            console.warn('Error fetching payment links:', error);
          }

        } catch (error) {
          console.error('Access check error:', error);
          toast({
            title: 'Error',
            description: 'Failed to verify agent access',
            status: 'error',
            duration: 5000,
          });
          router.push('/login');
        }
      }
    };

    checkAccess();
  }, [authLoading, isAuthenticated, user, router, toast]);

  // Then update the data fetching queries
  const { data: operatorData } = useQuery({
    queryKey: ['operatorData', user?.id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/operators?` +
        `filters[users_permissions_user][id][$eq]=${user.id}&` +
        `populate[wallet][populate]=*&` +
        `populate[agent][populate]=*`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch operator data');
      const data = await response.json();
      
      if (data.data.length === 0) {
        throw new Error('No operator found for this user');
      }
      
      return data.data[0];
    },
    enabled: !!user?.id && isAuthenticated
  });

  const { 
    data: agentData, 
    isLoading: isAgentLoading,
    error: agentError,
    refetch: refetchAgent
  } = useQuery({
    queryKey: ['agentData', operatorData?.id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agents?` +
        `filters[operator][id][$eq]=${operatorData.id}&` +
        `populate[wallet][populate]=*&` +
        `populate[transactions][limit]=10&` +
        `populate[transactions][sort][0]=createdAt:desc&` +
        `populate[operator][fields][0]=fullName&` +
        `populate[payment_links][filters][status][$eq]=active&` +
        `populate[location]=*`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch agent data');
      const data = await response.json();
      
      if (data.data.length === 0) {
        throw new Error('No agent account found');
      }
      
      return data;
    },
    enabled: !!operatorData?.id && isAuthenticated,
    retry: 1,
    onError: (error) => {
      toast({
        title: 'Access Denied',
        description: error.message,
        status: 'error',
        duration: 5000
      });
      router.push('/login');
    }
  });

  // Move this useEffect inside the component body
  useEffect(() => {
    if (agentData) {
      localStorage.setItem('agentData', JSON.stringify(agentData));
    }
  }, [agentData]);

  const agent = agentData?.data?.[0]?.attributes || {};
  const wallet = agent?.wallet?.data?.attributes || {};

  // Calculate daily stats
  const dailyStats = useMemo(() => {
    if (!agent?.transactions?.data) return {
      totalTransactions: 0,
      totalVolume: 0,
      deposits: 0,
      withdrawals: 0
    };

    const today = new Date().toISOString().split('T')[0];
    const todayTransactions = agent.transactions.data.filter(tx =>
      tx.attributes.createdAt.startsWith(today)
    );

    return {
      totalTransactions: todayTransactions.length,
      totalVolume: todayTransactions.reduce((sum, tx) => 
        sum + (parseFloat(tx.attributes.amount) || 0), 0
      ),
      deposits: todayTransactions.filter(tx => 
        tx.attributes.type === 'deposit'
      ).reduce((sum, tx) => sum + (parseFloat(tx.attributes.amount) || 0), 0),
      withdrawals: todayTransactions.filter(tx => 
        tx.attributes.type === 'withdrawal'
      ).reduce((sum, tx) => sum + (parseFloat(tx.attributes.amount) || 0), 0)
    };
  }, [agent?.transactions?.data]);

  const handleScan = async (result) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customer-profiles/${result}?populate[wallet]=*`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) throw new Error('Invalid customer QR code');
      const data = await response.json();

      setScannedCustomer(data.data);
      onQRClose();

      if (scanType === 'deposit') {
        onDepositOpen();
      } else {
        onWithdrawalOpen();
      }
    } catch (error) {
      toast({
        title: 'Invalid QR Code',
        description: 'Please scan a valid customer QR code',
        status: 'error',
        duration: 3000
      });
    }
      
    };const handleDeposit = () => {
      router.push('/agent/deposit');
    };

    const handleWithdraw = () => {
      router.push('/agent/withdraw');
    };

  // Loading state
  if (authLoading || isAgentLoading) {
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

  // Error state
  if (agentError || !agent) {
    return (
      <Layout>
        <Container maxW="container.xl" py={8}>
          <Alert 
            status="error" 
            variant="solid" 
            borderRadius="xl"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            py={4}
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Error Loading Dashboard
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              {agentError?.message || 'Failed to load agent data'}
            </AlertDescription>
            <Button 
              mt={4} 
              colorScheme="red" 
              onClick={() => router.push('/login')}
            >
              Return to Login
            </Button>
          </Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Agent Dashboard | BitCash</title>
      </Head>

      <Container maxW="1200px" py={4} px={{ base: 2, md: 6 }}>
        <VStack spacing={6}>
          {/* Mobile Header */}
          <Flex
            display={{ base: 'flex', md: 'none' }}
            justify="space-between"
            align="center"
            w="full"
            mb={4}
          >
            <VStack align="start" spacing={1}>
              <Heading size="md">Agent Dashboard</Heading>
              <Badge 
                colorScheme={agent?.status === 'active' ? 'green' : 'orange'}
                p={2} 
                borderRadius="full"
              >
                Status: {agent?.status || 'Unknown'}
              </Badge>
            </VStack>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<MenuIcon size={24} />}
                variant="ghost"
                aria-label="Options"
              />
              <MenuList>
                <MenuItem icon={<RefreshCw size={18} />} onClick={() => refetchAgent()}>
                  Refresh
                </MenuItem>
                <MenuItem icon={<Activity size={18} />} onClick={() => router.push('/transactions')}>
                  All Transactions
                </MenuItem>
                <MenuItem icon={<Settings size={18} />} onClick={() => router.push('/settings')}>
                  Settings
                </MenuItem>
                <MenuItem icon={<LogOut size={18} />} onClick={logout}>
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
            mb={6}
          >
            <VStack align="start" spacing={1}>
              <Heading size="lg">Agent Dashboard</Heading>
              <Text color="gray.500">
                {agent?.operator?.data?.attributes?.fullName}
              </Text>
              <Badge colorScheme={agent?.status === 'active' ? 'green' : 'orange'}>
                {agent?.status?.toUpperCase()}
              </Badge>
            </VStack>
            <HStack spacing={4}>
              <Button
                leftIcon={<RefreshCw />}
                colorScheme="blue"
                onClick={() => refetchAgent()}
              >
                Refresh
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
                  <MenuItem icon={<Activity size={18} />} onClick={() => router.push('/transactions')}>
                    All Transactions
                  </MenuItem>
                  <MenuItem icon={<Settings size={18} />} onClick={() => router.push('/settings')}>
                    Settings
                  </MenuItem>
                  <MenuItem icon={<LogOut size={18} />} onClick={logout}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>

            {/* Main Stats */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} w="full">
            {/* Cash Balance */}
            <GlassCard p={6}>
              <CashBalanceWidget
                data={agent}
                onDeposit={handleDeposit}
                onWithdraw={handleWithdraw}
              />
            </GlassCard>

            {/* Processing Fees */}
            <GlassCard p={6}>
              <ProcessingFeesWidget 
                transactions={agent?.transactions} 
              />
            </GlassCard>
          </SimpleGrid>

          {/* Daily Limits and Metrics */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} w="full">
            <GlassCard p={6}>
              <DailyLimitTracker agentData={agent} />
            </GlassCard>

            <GlassCard p={6}>
              <AgentMetrics 
                agentData={agent}
                walletData={wallet}
                dailyStats={dailyStats}
              />
            </GlassCard>

            {/* New Location Manager Card */}
            <GlassCard p={6}>
              <LocationManager 
                initialLocation={{
                  latitude: agent?.location?.coordinates?.lat,
                  longitude: agent?.location?.coordinates?.lng,
                  address: agent?.location?.address
                }} 
              />
            </GlassCard>
          </SimpleGrid>

          {/* Transactions */}
          <GlassCard p={6} w="full">
            <VStack spacing={6} align="stretch">
              <Flex justify="space-between" align="center">
                <Heading size="md">Recent Transactions</Heading>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => router.push('/transactions')}
                  rightIcon={<ChevronDown />}
                >
                  View All
                </Button>
              </Flex>
              <TransactionSummary transactions={agent?.transactions?.data || []} />
              <TransactionList 
                transactions={agent?.transactions?.data || []} 
                isLoading={isAgentLoading}
              />
            </VStack>
          </GlassCard>
        </VStack>

        {/* QR Scanner Modal */}
        <Modal 
          isOpen={isQROpen} 
          onClose={onQRClose}
          size="full"
          isCentered
          motionPreset="slideInBottom"
        >
          <ModalOverlay 
            bg="blackAlpha.300" 
            backdropFilter="blur(10px)"
          />
          <ModalContent bg="transparent" maxW="full" h="full">
            <ModalCloseButton 
              zIndex={10}
              color="white"
              bg="blackAlpha.500"
              _hover={{ bg: "blackAlpha.700" }}
            />
            <ModalBody p={0}>
              <QRScanner
                onScan={(result) => {
                  handleScan(result);
                  onQRClose();
                }}
                onClose={onQRClose}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Layout>
  );
};

export default AgentDashboard;