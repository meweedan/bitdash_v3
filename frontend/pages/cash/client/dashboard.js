// frontend/pages/client/dashboard.js
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Spinner,
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Alert,
  AlertIcon,
  Progress,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Tooltip
} from '@chakra-ui/react';
import { 
  FiDollarSign,
  FiCreditCard,
  FiArrowLeftCircle,
  FiClock,
  FiUser,
  FiList,
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiRefreshCw,
  FiShare2,
  FiCopy,
  FiDownload,
  FiMoreVertical,
  FiEye,
  FiLink,
  FiUsers,
  FiLogOut,
  FiMap,
  FiEyeOff
} from 'react-icons/fi';
import { QRCodeCanvas } from 'qrcode.react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { motion } from 'framer-motion';

// Transaction components
import TransactionList from '@/components/transactions/TransactionList';
import TransactionSummary from '@/components/transactions/TransactionSummary';
import SpendingChart from '@/components/charts/SpendingChart';
import WalletQRModal from '@/components/modals/WalletQRModal';
import SpendingCategoryChart from '@/components/charts/SpendingCategoryChart';
import MonthlyTrendChart from '@/components/charts/MonthlyTrendChart';
import PaymentLinkList from '@/components/transactions/PaymentLinkList';
import AgentLocator from '@/components/cash/customer/AgentLocator';

const MotionStat = motion(Stat);

const ClientDashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen: isQROpen, onOpen: onQROpen, onClose: onQRClose } = useDisclosure();
  const [showBalance, setShowBalance] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { 
    isOpen: isMenuModalOpen, 
    onOpen: onMenuModalOpen, 
    onClose: onMenuModalClose 
  } = useDisclosure();

  // Fetch wallet data
  const { 
    data: walletData,
    isLoading: isWalletLoading,
    error: walletError,
    refetch: refetchWallet
  } = useQuery({
    queryKey: ['walletBalance', 'customer', user?.id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallets?` +
      `populate[customer][populate][avatar][fields][0]=url` +
      `&populate=*` +
      `&filters[customer][users_permissions_user][id][$eq]=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch wallet');
      return response.json();
    },
    refetchInterval: 10000,
    enabled: !!user?.id,
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

  // Fetch transactions
  const {
  data: transactionsData,
  isLoading: isTransactionsLoading,
  error: transactionsError
  } = useQuery({
    queryKey: ['transactions', walletData?.data?.[0]?.id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions?` + 
        `filters[sender][id][$eq]=${walletData.data[0].id}` +
        `&filters[status][$eq]=completed` +
        `&sort[0]=createdAt:desc` +
        `&populate=*`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch transactions');
      return response.json();
    },
    enabled: !!walletData?.data?.[0]?.id && walletData?.data?.[0]?.id !== undefined,
    refetchInterval: 10000
  });

  // Calculate transaction stats
  const transactionStats = useMemo(() => {
    if (!transactionsData?.data) return {
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalPayments: 0,
      monthlySpending: 0
    };

    const transactions = transactionsData.data || [];
    return {
      totalDeposits: transactions
        .filter(t => t?.attributes?.type === 'deposit')
        .reduce((sum, t) => sum + (parseFloat(t?.attributes?.amount) || 0), 0),
      totalWithdrawals: transactions
        .filter(t => t?.attributes?.type === 'withdrawal')
        .reduce((sum, t) => sum + (parseFloat(t?.attributes?.amount) || 0), 0),
      totalPayments: transactions
        .filter(t => t?.attributes?.type === 'payment')
        .reduce((sum, t) => sum + (parseFloat(t?.attributes?.amount) || 0), 0),
      monthlySpending: transactions
        .filter(t => {
          if (!t?.attributes?.createdAt) return false;
          const date = new Date(t.attributes.createdAt);
          const now = new Date();
          return date.getMonth() === now.getMonth() && 
                date.getFullYear() === now.getFullYear() &&
                t.attributes.type === 'payment';
        })
        .reduce((sum, t) => sum + (parseFloat(t?.attributes?.amount) || 0), 0)
    };
  }, [transactionsData]);

  // Calculate daily limit usage
  const dailyLimitUsage = useMemo(() => {
    if (!walletData?.data?.[0]?.attributes?.dailyLimit || !transactionStats) return 0;
    const dailyLimit = parseFloat(walletData.data[0].attributes.dailyLimit) || 0;
    return dailyLimit > 0 ? ((transactionStats.monthlySpending || 0) / dailyLimit) * 100 : 0;
  }, [walletData, transactionStats]);

  // Loading state
  if (isWalletLoading) {
    return (
      <Layout>
        <Flex justify="center" align="center" minH="100vh">
          <Spinner size="xl" />
        </Flex>
      </Layout>
    );
  }

  // Error state
  if (walletError || !walletData?.data?.[0]) {
    return (
      <Layout>
        <Container maxW="container.xl" py={6}>
          <Alert status="error">
            <AlertIcon />
            {walletError?.message || 'Failed to load wallet data'}
          </Alert>
        </Container>
      </Layout>
    );
  }

  const wallet = walletData.data[0].attributes;

  return (
    <Layout>
      <Head>
        <title>Dashboard | BitCash</title>
      </Head>
      <Container 
        maxW="1200px" 
        py={6} 
        px={{ base: 4, md: 8 }}
        position="relative"
        overflow="hidden"
      >
        {/* Background Gradient */}
        <Box
          position="absolute"
          top="-10%"
          left="-10%"
          right="-10%"
          bottom="-10%"
          bg="linear-gradient(45deg, rgba(49, 130, 206, 0.1), rgba(128, 90, 213, 0.1))"
          filter="blur(60px)"
          zIndex={-1}
          pointerEvents="none"
        />

        <VStack spacing={{ base: 6, md: 8 }} align="stretch">
          {/* Header */}
          <Flex 
            justify="space-between" 
            align={{ base: "start", md: "center" }}
            direction={{ base: "column", md: "row" }}
            gap={4}
            backdropFilter="blur(8px)"
            bg={useColorModeValue('whiteAlpha.800', 'blackAlpha.500')}
            p={6}
            borderRadius="2xl"
            boxShadow="sm"
          >
            <VStack align="start" spacing={1}>
              <HStack spacing={3}>
                <Avatar
                  size="2xl"
                  name={
                    user?.customer_profile?.fullName || 
                    user?.username || 
                    'User'
                  }
                  src={
                    user?.customer_profile?.avatar?.data?.attributes?.url
                      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${user.customer_profile.avatar.data.attributes.url}`
                      : undefined
                  }
                  bg="blue.500"
                  color="white"
                />
                <VStack align="start" spacing={0}>
                  <Heading size="md">
                    {user?.customer_profile?.fullName || user?.username || 'User'}
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    {user?.email || 'No email'}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
            
            <HStack spacing={3}>
              <Tooltip label="Send Money">
                <IconButton
                  icon={<FiArrowLeftCircle />}
                  onClick={() => router.push('/client/transfer')}
                  colorScheme="blue"
                  variant="ghost"
                  size="lg"
                />
              </Tooltip>
              <Tooltip label="Your QR Code">
                <IconButton
                  icon={<FiCreditCard />}
                  onClick={onQROpen}
                  colorScheme="purple"
                  variant="ghost"
                  size="lg"
                />
              </Tooltip>

              {/* Replace existing Menu with Modal trigger */}
              <Tooltip label="More Options">
                <IconButton
                  icon={<FiMoreVertical />}
                  onClick={onMenuModalOpen}
                  variant="ghost"
                  size="lg"
                />
              </Tooltip>
            </HStack>

            {/* Menu Modal */}
            <Modal 
              isOpen={isMenuModalOpen} 
              onClose={onMenuModalClose}
              size="xs"
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Quick Actions</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <VStack spacing={4} w="full">
                    {/* Profile Settings */}
                    <Button 
                      leftIcon={<FiUser />}
                      onClick={() => {
                        onMenuModalClose();
                        router.push('/client/profile');
                      }}
                      w="full"
                      justifyContent="start"
                    >
                      Profile Settings
                    </Button>

                    {/* Payment Links */}
                    <Button 
                      leftIcon={<FiLink />}
                      onClick={() => {
                        onMenuModalClose();
                        router.push('/client/payment-links');
                      }}
                      w="full"
                      justifyContent="start"
                    >
                      Payment Links
                    </Button>

                    {/* Contacts */}
                    <Button 
                      leftIcon={<FiUsers />}
                      onClick={() => {
                        onMenuModalClose();
                        router.push('/client/contacts');
                      }}
                      w="full"
                      justifyContent="start"
                    >
                      Contacts
                    </Button>

                    {/* Share Wallet */}
                    <Button 
                      leftIcon={<FiShare2 />}
                      onClick={() => {
                        onMenuModalClose();
                        toast({
                          title: 'Share Wallet',
                          description: 'Wallet sharing functionality coming soon',
                          status: 'info'
                        });
                      }}
                      w="full"
                      justifyContent="start"
                    >
                      Share Wallet
                    </Button>

                    {/* Logout */}
                    <Button 
                      leftIcon={<FiLogOut />}
                      onClick={() => {
                        onMenuModalClose();
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        router.push('/login');
                      }}
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
          </Flex>

          {/* Main Stats */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <MotionStat
              p={6}
              bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
              borderRadius="2xl"
              boxShadow="lg"
              backdropFilter="blur(8px)"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <StatLabel fontSize="sm" mb={2}>Available Balance</StatLabel>
              <HStack>
                <StatNumber color={useColorModeValue('blue.600', 'blue.300')} fontSize="3xl">
                  {showBalance ? wallet.balance.toLocaleString() : '•••••••'} LYD
                </StatNumber>
                <IconButton
                  icon={showBalance ? <FiEyeOff /> : <FiEye />}
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBalance(!showBalance)}
                />
              </HStack>
              <HStack mt={2} spacing={2}>
                <Badge 
                  colorScheme="green"
                  variant="subtle"
                  px={2}
                  py={1}
                  borderRadius="full"
                >
                  Active
                </Badge>
                <Text fontSize="sm" color="gray.500">
                  ID: {wallet.walletId}
                </Text>
              </HStack>
            </MotionStat>

            <MotionStat
              p={6}
              bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
              borderRadius="2xl"
              boxShadow="lg"
              backdropFilter="blur(8px)"
              whileHover={{ scale: 1.02 }}
            >
              <VStack align="start" spacing={2}>
                <StatLabel fontSize="sm">Daily Spending Limit</StatLabel>
                <StatNumber fontSize="2xl">
                  {((wallet.dailyLimit - transactionStats?.monthlySpending) || 0).toLocaleString()} LYD
                </StatNumber>
                <Box w="full">
                  <Progress 
                    value={dailyLimitUsage} 
                    colorScheme={dailyLimitUsage > 80 ? 'red' : 'blue'} 
                    size="sm"
                    borderRadius="full"
                  />
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    {dailyLimitUsage.toFixed(1)}% used today
                  </Text>
                </Box>
              </VStack>
            </MotionStat>

            <MotionStat
              p={6}
              bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
              borderRadius="2xl"
              boxShadow="lg"
              backdropFilter="blur(8px)"
              whileHover={{ scale: 1.02 }}
            >
              <VStack align="start" spacing={2}>
                <StatLabel fontSize="sm">Monthly Activity</StatLabel>
                <StatNumber fontSize="2xl">
                  {(transactionStats?.monthlySpending || 0).toLocaleString()} LYD
                </StatNumber>
                <Box w="full">
                  <SimpleGrid columns={2} spacing={4}>
                    <VStack align="start" spacing={0}>
                      <HStack color="green.500">
                        <Icon as={FiTrendingUp} />
                        <Text fontSize="sm" fontWeight="medium">Income</Text>
                      </HStack>
                      <Text fontSize="sm">
                        {(transactionStats?.totalDeposits || 0).toLocaleString()} LYD
                      </Text>
                    </VStack>
                    <VStack align="start" spacing={0}>
                      <HStack color="red.500">
                        <Icon as={FiTrendingDown} />
                        <Text fontSize="sm" fontWeight="medium">Spent</Text>
                      </HStack>
                      <Text fontSize="sm">
                        {(transactionStats?.totalPayments || 0).toLocaleString()} LYD
                      </Text>
                    </VStack>
                  </SimpleGrid>
                </Box>
              </VStack>
            </MotionStat>
          </SimpleGrid>

          {/* Spending Chart */}
          <Box 
            bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
            borderRadius="2xl"
            boxShadow="lg"
            backdropFilter="blur(8px)"
            p={6}
          >
            <SpendingChart 
              transactions={transactionsData?.data || []} 
              isLoading={isTransactionsLoading}
            />
          </Box>

          {/* Transactions and Activity */}
          <Box
            bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
            borderRadius="2xl"
            boxShadow="lg"
            backdropFilter="blur(8px)"
            p={6}
          >
            <Tabs variant="soft-rounded" colorScheme="blue">
              <TabList>
                <Tab><Icon as={FiClock} mr={2} /> Recent</Tab>
                <Tab><Icon as={FiList} mr={2} /> History</Tab>
                <Tab><Icon as={FiUser} mr={2} /> Analytics</Tab>
                <Tab><Icon as={FiMap} mr={2} /> Locations</Tab>  
              </TabList>


              <TabPanels>
                <TabPanel px={0}>
                  <TransactionList 
                    transactions={transactionsData?.data?.slice(0, 5) || []}
                    isLoading={isTransactionsLoading}
                  />
                </TabPanel>
                
                <TabPanel px={0}>
                  <VStack spacing={6}>
                    <TransactionSummary 
                      transactions={transactionsData?.data}
                      isLoading={isTransactionsLoading}
                    />
                    <TransactionList 
                      transactions={transactionsData?.data || []}
                      isLoading={isTransactionsLoading}
                      showFilters
                      showPagination
                    />
                  </VStack>
                </TabPanel>

                <TabPanel px={0}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <VStack align="stretch" spacing={6}>
                      <Heading size="md">Spending by Category</Heading>
                      <SpendingCategoryChart 
                        transactions={transactionsData?.data || []} 
                        isLoading={isTransactionsLoading}
                      />
                    </VStack>
                    <VStack align="stretch" spacing={6}>
                      <Heading size="md">Monthly Overview</Heading>
                      <MonthlyTrendChart 
                        transactions={transactionsData?.data || []} 
                        isLoading={isTransactionsLoading}
                      />
                    </VStack>
                  </SimpleGrid>
                </TabPanel>

                {/* New Locations TabPanel */}
                <TabPanel px={0}>
                  <Box 
                    bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
                    borderRadius="xl"
                    height="600px"
                    overflow="hidden"
                  >
                    <AgentLocator />
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </VStack>

        <WalletQRModal
          isOpen={isQROpen}
          onClose={onQRClose}
          walletData={wallet}
          profileId={user?.customer_profile?.id || walletData?.data?.[0]?.attributes?.customer?.data?.id}
        />
      </Container>
    </Layout>
  );
};

export default ClientDashboard;