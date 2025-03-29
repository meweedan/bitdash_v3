// frontend/pages/client/dashboard.js
import React, { useState, useMemo } from 'react';
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
  Divider,
  Tooltip,
  Wrap,
  WrapItem
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
  FiEyeOff,
  FiActivity
} from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { motion } from 'framer-motion';

// Components
import TransactionList from '@/components/transactions/TransactionList';
import TransactionSummary from '@/components/transactions/TransactionSummary';
import SpendingChart from '@/components/charts/SpendingChart';
import WalletQRModal from '@/components/modals/WalletQRModal';
import SpendingCategoryChart from '@/components/charts/SpendingCategoryChart';
import MonthlyTrendChart from '@/components/charts/MonthlyTrendChart';
import PaymentLinkList from '@/components/transactions/PaymentLinkList';
import AgentLocator from '@/components/tazdani/customer/AgentLocator';

const MotionStat = motion(Stat);

// Loading Skeleton
const DashboardSkeleton = () => (
  <VStack spacing={6} w="full">
    <Skeleton height="100px" w="full" borderRadius="xl" />
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6} w="full">
      <Skeleton height="150px" borderRadius="xl" />
      <Skeleton height="150px" borderRadius="xl" />
      <Skeleton height="150px" borderRadius="xl" />
    </SimpleGrid>
    <Skeleton height="300px" w="full" borderRadius="xl" />
    <Skeleton height="400px" w="full" borderRadius="xl" />
  </VStack>
);

const ClientDashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const { t } = useTranslation(['dashboard', 'common']);
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
        `populate[customer][populate][0]=avatar` +
        `&populate[customer][populate][1]=users_permissions_user` +
        `&populate=*` +
        `&filters[customer][users_permissions_user][id][$eq]=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error(t('errors.fetch_wallet'));
      return response.json();
    },
    refetchInterval: 10000,
    enabled: !!user?.id,
    retry: 2,
    onError: (error) => {
      toast({
        title: t('errors.error'),
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
      if (!response.ok) throw new Error(t('errors.fetch_transactions'));
      return response.json();
    },
    enabled: !!walletData?.data?.[0]?.id,
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

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

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
          const date = new Date(t?.attributes?.createdAt);
          return date.getMonth() === currentMonth && 
                 date.getFullYear() === currentYear &&
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
        <Container maxW={{ base: "100%", md: "1200px" }} py={6}>
          <DashboardSkeleton />
        </Container>
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
            {walletError?.message || t('errors.load_wallet')}
          </Alert>
        </Container>
      </Layout>
    );
  }

  const wallet = walletData.data[0].attributes;
  const customerProfile = wallet?.customer?.data?.attributes;

  return (
    <Layout>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Container 
        maxW={{ base: "100%", md: "1200px" }}
        py={{ base: 3, md: 6 }}
        px={{ base: 2, md: 8 }}
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

        <VStack spacing={{ base: 4, md: 8 }} align="stretch">
          {/* Header */}
          <Flex 
            justify="space-between" 
            align={{ base: "start", md: "center" }}
            direction={{ base: "column", sm: "row" }}
            gap={{ base: 2, md: 4 }}
            p={{ base: 3, md: 6 }}
            bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
            backdropFilter="blur(8px)"
          >
            <HStack spacing={{ base: 2, md: 3 }} flex={1}>
              <Avatar
                size={{ base: "xl", md: "2xl" }}
                name={customerProfile?.fullName || user?.username}
                src={
                  customerProfile?.avatar?.data?.attributes?.url
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${customerProfile.avatar.data.attributes.url}`
                    : undefined
                }
                bg="brand.tazdani.500"
              />
              <VStack align="start" spacing={0}>
                <Heading size={{ base: "2xl", md: "2xl" }}>
                  {customerProfile?.fullName || user?.username || t('common:unnamed')}
                </Heading>
                <Text size={{ base: "2xl", md: "2xl" }} color="gray.500">
                  {user?.email || t('common:no_email')}
                </Text>
                <Badge 
                  colorScheme="green"
                  variant="subtle"
                  mt={1}
                >
                  {t('wallet.id')}: {wallet.walletId}
                </Badge>
              </VStack>
            </HStack>
            
            <SimpleGrid 
              columns={{ base: 2, md: 2 }} 
              width="full"
              spacing={{ base: 4, md: 6 }}
              px={{ base: 4, md: 8 }}
              py={{ base: 4, md: 5 }}
              borderRadius="lg"
              boxShadow="sm"
              borderWidth="1px"
              borderColor="gray.100"
            >
              <Button
                height={{ base: "60px", md: "70px" }}
                leftIcon={<FiArrowLeftCircle size={20} />}
                onClick={() => router.push('/client/transfer')}
                colorScheme="green"
                variant="solid"
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="600"
                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                transition="all 0.2s"
                borderRadius="md"
                isFullWidth
              >
                {t('actions.send_money')}
              </Button>
              <Button
                height={{ base: "60px", md: "70px" }}
                leftIcon={<FiCreditCard size={20} />}
                onClick={onQROpen}
                colorScheme="#00bf63"
                variant="solid"
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="600"
                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                transition="all 0.2s"
                borderRadius="md"
                isFullWidth
              >
                {t('actions.qr_code')}
              </Button>
            </SimpleGrid>
          </Flex>

          {/* Main Stats */}
          <SimpleGrid columns={{ base: 1, sm: 2, md: 2 }} spacing={{ base: 2, md: 4 }}>
            <MotionStat
              p={{ base: 2, md: 4}}
              bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
              borderRadius="2xl"
              boxShadow="lg"
              backdropFilter="blur(8px)"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <StatLabel fontSize={{ base: "3xl", md: "3xl" }} mb={2}>
                {t('balance.available')}
              </StatLabel>
              <HStack>
                <StatNumber 
                  color={useColorModeValue('brand.tazdani.600', 'brand.tazdani.600')} 
                  fontSize={{ base: "3xl", md: "4xl" }}
                >
                  {showBalance ? wallet.balance.toLocaleString() : '•••••••'} LYD
                </StatNumber>
                <Button
                  icon={showBalance ? <FiEyeOff /> : <FiEye />}
                  variant="ghost"
                  colorScheme="green"
                  onClick={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? t('actions.hide') : t('actions.show')}
                  </Button>
              </HStack>
              <HStack mt={2} spacing={2}>
                <Badge 
                  colorScheme={wallet.isActive ? "green" : "red"}
                  variant="subtle"
                  px={2}
                  py={1}
                  borderRadius="full"
                >
                  {t(`wallet.status.${wallet.isActive ? 'active' : 'inactive'}`)}
                </Badge>
              </HStack>
            </MotionStat>

            <MotionStat
              p={{ base: 4, md: 6 }}
              bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
              borderRadius="2xl"
              boxShadow="lg"
              backdropFilter="blur(8px)"
              whileHover={{ scale: 1.02 }}
            >
              <VStack align="start" spacing={2}>
                <StatLabel fontSize={{ base: "xs", md: "sm" }}>
                  {t('balance.daily_limit')}
                </StatLabel>
                <StatNumber fontSize={{ base: "xl", md: "2xl" }}>
                  {((wallet.dailyLimit - transactionStats?.monthlySpending) || 0).toLocaleString()} {t('common:currency')}
                </StatNumber>
                <Box w="full">
                  <Progress 
                    value={dailyLimitUsage} 
                    colorScheme={dailyLimitUsage > 80 ? 'red' : 'blue'} 
                    size="sm"
                    borderRadius="full"
                  />
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" mt={1}>
                    {t('stats.limit_used', { percentage: dailyLimitUsage.toFixed(1) })}
                  </Text>
                </Box>
              </VStack>
            </MotionStat>

            {/* <MotionStat
              p={{ base: 4, md: 6 }}
              bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
              borderRadius="2xl"
              boxShadow="lg"
              backdropFilter="blur(8px)"
              whileHover={{ scale: 1.02 }}
            >
              <VStack align="start" spacing={2}>
                <StatLabel fontSize={{ base: "xs", md: "sm" }}>
                  {t('stats.monthly_activity')}
                </StatLabel>
                <StatNumber fontSize={{ base: "xl", md: "2xl" }}>
                  {(transactionStats?.monthlySpending || 0).toLocaleString()} {t('common:currency')}
                </StatNumber>
                <SimpleGrid columns={2} spacing={4} w="full">
                  <VStack align="start" spacing={0}>
                    <HStack color="green.500">
                      <Icon as={FiTrendingUp} />
                      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">
                        {t('stats.income')}
                      </Text>
                    </HStack>
                    <Text fontSize={{ base: "xs", md: "sm" }}>
                      {(transactionStats?.totalDeposits || 0).toLocaleString()} {t('common:currency')}
                    </Text>
                  </VStack>
                  <VStack align="start" spacing={0}>
                    <HStack color="red.500">
                      <Icon as={FiTrendingDown} />
                      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">
                        {t('stats.spent')}
                      </Text>
                    </HStack>
                    <Text fontSize={{ base: "xs", md: "sm" }}>
                      {(transactionStats?.totalPayments || 0).toLocaleString()} {t('common:currency')}
                    </Text>
                  </VStack>
                </SimpleGrid>
              </VStack>
            </MotionStat> */}
          </SimpleGrid>
          {/* Spending Chart
          <Box 
            bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
            borderRadius="2xl"
            boxShadow="lg"
            backdropFilter="blur(8px)"
            p={{ base: 3, md: 6 }}
          >
            <SpendingChart 
              transactions={transactionsData?.data || []} 
              isLoading={isTransactionsLoading}
              title={t('charts.spending')}
            />
          </Box> */}

          {/* Transactions and Activity */}
          <Box
            bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
            borderRadius="2xl"
            boxShadow="lg"
            backdropFilter="blur(8px)"
            p={{ base: 3, md: 6 }}
          >
            <Tabs 
              variant="soft-rounded" 
              colorScheme="blue"
              isLazy
              size={{ base: "sm", md: "md" }}
            >
              <TabList 
                overflowX="auto" 
                py={2}
                css={{
                  scrollbarWidth: 'none',
                  '::-webkit-scrollbar': { display: 'none' },
                }}
              >
                <Tab whiteSpace="nowrap">
                  <Icon as={FiClock} mr={2} /> {t('tabs.recent')}
                </Tab>
                <Tab whiteSpace="nowrap">
                  <Icon as={FiList} mr={2} /> {t('tabs.history')}
                </Tab>
                <Tab whiteSpace="nowrap">
                  <Icon as={FiActivity} mr={2} /> {t('tabs.analytics')}
                </Tab>
                <Tab whiteSpace="nowrap">
                  <Icon as={FiMap} mr={2} /> {t('tabs.locations')}
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel px={0}>
                  <TransactionList 
                    transactions={transactionsData?.data?.slice(0, 5) || []}
                    isLoading={isTransactionsLoading}
                    emptyText={t('transactions.no_recent')}
                  />
                </TabPanel>
                
                <TabPanel px={0}>
                  <VStack spacing={6}>
                    <TransactionSummary 
                      transactions={transactionsData?.data}
                      isLoading={isTransactionsLoading}
                      labels={{
                        deposits: t('transactions.deposits'),
                        withdrawals: t('transactions.withdrawals'),
                        payments: t('transactions.payments')
                      }}
                    />
                    <TransactionList 
                      transactions={transactionsData?.data || []}
                      isLoading={isTransactionsLoading}
                      showFilters
                      showPagination
                      emptyText={t('transactions.no_history')}
                      labels={{
                        filterTitle: t('transactions.filter_title'),
                        typeLabel: t('transactions.type_label'),
                        dateLabel: t('transactions.date_label')
                      }}
                    />
                  </VStack>
                </TabPanel>

                <TabPanel px={0}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <VStack align="stretch" spacing={6}>
                      <Heading size="md">{t('charts.category')}</Heading>
                      <SpendingCategoryChart 
                        transactions={transactionsData?.data || []} 
                        isLoading={isTransactionsLoading}
                        labels={{
                          title: t('charts.category_title'),
                          noData: t('charts.no_data')
                        }}
                      />
                    </VStack>
                    <VStack align="stretch" spacing={6}>
                      <Heading size="md">{t('charts.monthly')}</Heading>
                      <MonthlyTrendChart 
                        transactions={transactionsData?.data || []} 
                        isLoading={isTransactionsLoading}
                        labels={{
                          title: t('charts.monthly_title'),
                          noData: t('charts.no_data')
                        }}
                      />
                    </VStack>
                  </SimpleGrid>
                </TabPanel>

                <TabPanel px={0}>
                  <Box 
                    bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
                    borderRadius="xl"
                    height={{ base: "400px", md: "600px" }}
                    overflow="hidden"
                  >
                    <AgentLocator 
                      labels={{
                        title: t('locations.title'),
                        searchPlaceholder: t('locations.search'),
                        noAgents: t('locations.no_agents')
                      }}
                    />
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </VStack>

        {/* Quick Actions Modal */}
        <Modal 
          isOpen={isMenuModalOpen} 
          onClose={onMenuModalClose}
          size="xs"
        >
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent>
            <ModalHeader>{t('menu.title')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} w="full">
                <Button 
                  leftIcon={<FiUser />}
                  onClick={() => {
                    onMenuModalClose();
                    router.push('/client/profile');
                  }}
                  w="full"
                  justifyContent="start"
                >
                  {t('menu.profile')}
                </Button>

                <Button 
                  leftIcon={<FiLink />}
                  onClick={() => {
                    onMenuModalClose();
                    router.push('/client/payment-links');
                  }}
                  w="full"
                  justifyContent="start"
                >
                  {t('menu.payment_links')}
                </Button>

                <Button 
                  leftIcon={<FiUsers />}
                  onClick={() => {
                    onMenuModalClose();
                    router.push('/client/contacts');
                  }}
                  w="full"
                  justifyContent="start"
                >
                  {t('menu.contacts')}
                </Button>

                <Button 
                  leftIcon={<FiShare2 />}
                  onClick={() => {
                    onMenuModalClose();
                    toast({
                      title: t('menu.share_coming_soon'),
                      status: 'info'
                    });
                  }}
                  w="full"
                  justifyContent="start"
                >
                  {t('menu.share')}
                </Button>

                <Divider />

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
                  {t('menu.logout')}
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* QR Code Modal */}
        <WalletQRModal
          isOpen={isQROpen}
          onClose={onQRClose}
          walletData={wallet}
          profileId={customerProfile?.id}
          labels={{
            title: t('qr.title'),
            description: t('qr.description'),
            copy: t('qr.copy'),
            share: t('qr.share'),
            download: t('qr.download')
          }}
        />
      </Container>
    </Layout>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default ClientDashboard;