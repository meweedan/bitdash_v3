// frontend/pages/trader/dashboard.js
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
  StatArrow,
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
  WrapItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Card,
  CardBody
} from '@chakra-ui/react';
import { 
  FiDollarSign,
  FiCreditCard,
  FiClock,
  FiUser,
  FiList,
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiRefreshCw,
  FiShare2,
  FiCopy,
  FiMoreVertical,
  FiEye,
  FiUsers,
  FiLogOut,
  FiEyeOff,
  FiActivity,
  FiBarChart2,
  FiSettings,
  FiTarget,
  FiTrendingDown as FiLoss,
  FiTrendingUp as FiProfit,
  FiDatabase,
  FiDownload,
  FiUpload
} from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Motion components
const MotionStat = motion(Stat);
const MotionBox = motion(Box);

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

const TraderDashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const { t } = useTranslation(['dashboard', 'common']);
  const [showBalance, setShowBalance] = useState(false);
  const [showProfitLoss, setShowProfitLoss] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { 
    isOpen: isMenuModalOpen, 
    onOpen: onMenuModalOpen, 
    onClose: onMenuModalClose 
  } = useDisclosure();

  // Fetch trader data
  const { 
    data: traderData,
    isLoading: isTraderLoading,
    error: traderError,
    refetch: refetchTrader
  } = useQuery({
    queryKey: ['traderData', user?.id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/retail-traders?` +
        `populate[users_permissions_user][populate][0]=avatar` +
        `&populate=wallet,trading_history` +
        `&filters[users_permissions_user][id][$eq]=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error(t('errors.fetch_trader'));
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

  // Fetch trading history
  const {
    data: tradingHistoryData,
    isLoading: isTradingHistoryLoading,
    error: tradingHistoryError
  } = useQuery({
    queryKey: ['tradingHistory', traderData?.data?.[0]?.id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions?` + 
        `filters[retail_trader][id][$eq]=${traderData.data[0].id}` +
        `&sort[0]=createdAt:desc` +
        `&populate=*`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error(t('errors.fetch_history'));
      return response.json();
    },
    enabled: !!traderData?.data?.[0]?.id,
    refetchInterval: 10000
  });

  // Calculate trading statistics
  const tradingStats = useMemo(() => {
    if (!tradingHistoryData?.data) return {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      averageProfitPerTrade: 0,
      totalProfit: 0,
      totalLoss: 0,
      netProfitLoss: 0,
      winRate: 0
    };

    const trades = tradingHistoryData.data || [];
    const winningTrades = trades.filter(t => parseFloat(t?.attributes?.profitLoss || 0) > 0);
    const losingTrades = trades.filter(t => parseFloat(t?.attributes?.profitLoss || 0) < 0);
    
    const totalProfit = winningTrades.reduce((sum, t) => sum + parseFloat(t?.attributes?.profitLoss || 0), 0);
    const totalLoss = Math.abs(losingTrades.reduce((sum, t) => sum + parseFloat(t?.attributes?.profitLoss || 0), 0));
    const netProfitLoss = totalProfit - totalLoss;
    
    return {
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      averageProfitPerTrade: trades.length > 0 ? netProfitLoss / trades.length : 0,
      totalProfit,
      totalLoss,
      netProfitLoss,
      winRate: trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0
    };
  }, [tradingHistoryData]);

  // Calculate margin health percentage
  const marginHealthPercentage = useMemo(() => {
    if (!traderData?.data?.[0]?.attributes) return 100;
    
    const trader = traderData.data[0].attributes;
    const marginLevel = parseFloat(trader.marginLevel) || 100;
    const marginCallLevel = parseFloat(trader.marginCallLevel) || 80;
    const stopOutLevel = parseFloat(trader.stopOutLevel) || 50;
    
    // Calculate health as percentage between stopOutLevel and 100%
    return Math.min(100, Math.max(0, ((marginLevel - stopOutLevel) / (100 - stopOutLevel)) * 100));
  }, [traderData]);

  // Generate performance data for chart
  const getPerformanceData = () => {
    if (!tradingHistoryData?.data) return [];
    
    const trades = tradingHistoryData.data;
    const performanceData = [];
    
    // Group by day
    const tradesByDay = trades.reduce((acc, trade) => {
      const date = new Date(trade.attributes.createdAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(trade);
      return acc;
    }, {});
    
    // Calculate cumulative P&L for each day
    let cumulativePnL = 0;
    Object.entries(tradesByDay)
      .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
      .forEach(([date, dayTrades]) => {
        const dayPnL = dayTrades.reduce((sum, trade) => sum + parseFloat(trade.attributes.profitLoss || 0), 0);
        cumulativePnL += dayPnL;
        
        performanceData.push({
          date,
          pnl: dayPnL,
          cumulativePnL,
          trades: dayTrades.length
        });
      });
    
    return performanceData;
  };

  // Loading state
  if (isTraderLoading) {
    return (
      <Layout>
        <Container maxW={{ base: "100%", md: "1200px" }} py={6}>
          <DashboardSkeleton />
        </Container>
      </Layout>
    );
  }

  // Error state
  if (traderError || !traderData?.data?.[0]) {
    return (
      <Layout>
        <Container maxW="container.xl" py={6}>
          <Alert status="error">
            <AlertIcon />
            {traderError?.message || t('errors.load_trader')}
          </Alert>
          <Button 
            mt={4} 
            leftIcon={<FiRefreshCw />} 
            onClick={() => refetchTrader()}
          >
            {t('actions.retry')}
          </Button>
        </Container>
      </Layout>
    );
  }

  const trader = traderData.data[0].attributes;
  const userProfile = trader?.users_permissions_user?.data?.attributes;
  const wallet = trader?.wallet?.data?.attributes || {};
  const tradeHistory = tradingHistoryData?.data || [];

  return (
    <Layout>
      <Head>
        <title>{t('meta.title')} | BitTrade</title>
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
            borderRadius="2xl"
            boxShadow="sm"
            backdropFilter="blur(8px)"
          >
            <HStack spacing={{ base: 2, md: 3 }} flex={1}>
              <Avatar
                size={{ base: "lg", md: "2xl" }}
                name={userProfile?.username || user?.username}
                src={
                  userProfile?.avatar?.data?.attributes?.url
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${userProfile.avatar.data.attributes.url}`
                    : undefined
                }
                bg="blue.500"
                color="white"
              />
              <VStack align="start" spacing={0}>
                <Heading size={{ base: "sm", md: "md" }}>
                  {userProfile?.username || user?.username || t('common:unnamed')}
                </Heading>
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
                  {user?.email || t('common:no_email')}
                </Text>
                <HStack spacing={2} mt={1}>
                  <Badge 
                    colorScheme={
                      trader.status === 'active' ? 'green' :
                      trader.status === 'pending' ? 'yellow' :
                      trader.status === 'suspended' ? 'orange' : 'red'
                    }
                    variant="subtle"
                  >
                    {trader.status?.toUpperCase()}
                  </Badge>
                  <Badge 
                    colorScheme={
                      trader.accountType === 'vip' ? 'purple' :
                      trader.accountType === 'premium' ? 'blue' :
                      trader.accountType === 'standard' ? 'green' : 'gray'
                    }
                    variant="subtle"
                  >
                    {trader.accountType?.toUpperCase()}
                  </Badge>
                  <Badge 
                    colorScheme={
                      trader.tradingLevel === 'professional' ? 'red' :
                      trader.tradingLevel === 'advanced' ? 'purple' :
                      trader.tradingLevel === 'intermediate' ? 'blue' : 'teal'
                    }
                    variant="subtle"
                  >
                    {trader.tradingLevel?.toUpperCase()}
                  </Badge>
                </HStack>
              </VStack>
            </HStack>
            
            <Wrap spacing={2} justify={{ base: "start", sm: "end" }}>
              <WrapItem>
                <Tooltip label={t('actions.deposit')}>
                  <IconButton
                    icon={<FiUpload />}
                    onClick={() => router.push('/trader/deposit')}
                    colorScheme="green"
                    variant="ghost"
                    size={{ base: "md", md: "lg" }}
                  />
                </Tooltip>
              </WrapItem>
              <WrapItem>
                <Tooltip label={t('actions.withdraw')}>
                  <IconButton
                    icon={<FiDownload />}
                    onClick={() => router.push('/trader/withdraw')}
                    colorScheme="blue"
                    variant="ghost"
                    size={{ base: "md", md: "lg" }}
                  />
                </Tooltip>
              </WrapItem>
              <WrapItem>
                <Tooltip label={t('actions.trade')}>
                  <IconButton
                    icon={<FiBarChart2 />}
                    onClick={() => router.push('/trader/platform')}
                    colorScheme="purple"
                    variant="ghost"
                    size={{ base: "md", md: "lg" }}
                  />
                </Tooltip>
              </WrapItem>
              <WrapItem>
                <Tooltip label={t('actions.more')}>
                  <IconButton
                    icon={<FiMoreVertical />}
                    onClick={onMenuModalOpen}
                    variant="ghost"
                    size={{ base: "md", md: "lg" }}
                  />
                </Tooltip>
              </WrapItem>
            </Wrap>
          </Flex>

          {/* Main Stats */}
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 3, md: 6 }}>
            <MotionStat
              p={{ base: 4, md: 6 }}
              bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
              borderRadius="2xl"
              boxShadow="lg"
              backdropFilter="blur(8px)"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <StatLabel fontSize={{ base: "xs", md: "sm" }} mb={2}>
                {t('balance.wallet')}
              </StatLabel>
              <HStack>
                <StatNumber 
                  color={useColorModeValue('blue.600', 'blue.300')} 
                  fontSize={{ base: "2xl", md: "3xl" }}
                >
                  {showBalance ? (wallet?.balance || 0).toLocaleString() : '•••••••'} {t('common:currency')}
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
                  colorScheme="blue"
                  variant="subtle"
                  px={2}
                  py={1}
                  borderRadius="full"
                >
                  {t('balance.available')}
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
              <StatLabel fontSize={{ base: "xs", md: "sm" }} mb={2}>
                {t('stats.profit_loss')}
              </StatLabel>
              <HStack>
                <StatNumber 
                  color={trader.totalProfitLoss >= 0 ? 'green.500' : 'red.500'} 
                  fontSize={{ base: "2xl", md: "3xl" }}
                >
                  {showProfitLoss ? (trader.totalProfitLoss || 0).toLocaleString() : '•••••••'} {t('common:currency')}
                </StatNumber>
                <IconButton
                  icon={showProfitLoss ? <FiEyeOff /> : <FiEye />}
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProfitLoss(!showProfitLoss)}
                />
              </HStack>
              <StatHelpText>
                <StatArrow type={trader.totalProfitLoss >= 0 ? 'increase' : 'decrease'} />
                {t('stats.win_rate')}: {trader.winRate.toFixed(2)}%
              </StatHelpText>
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
                  {t('stats.margin_health')}
                </StatLabel>
                <Box w="full">
                  <Progress 
                    value={marginHealthPercentage} 
                    colorScheme={
                      marginHealthPercentage > 80 ? 'green' :
                      marginHealthPercentage > 50 ? 'yellow' :
                      marginHealthPercentage > 30 ? 'orange' : 'red'
                    } 
                    size="sm"
                    borderRadius="full"
                  />
                </Box>
                <HStack justify="space-between" w="full">
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
                    {t('stats.margin_level')}: {trader.marginLevel}%
                  </Text>
                  <HStack spacing={1}>
                    <Box 
                      w={2} 
                      h={2} 
                      borderRadius="full" 
                      bg={
                        marginHealthPercentage > 80 ? 'green.500' :
                        marginHealthPercentage > 50 ? 'yellow.500' :
                        marginHealthPercentage > 30 ? 'orange.500' : 'red.500'
                      } 
                    />
                    <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold">
                      {
                        marginHealthPercentage > 80 ? t('stats.margin_healthy') :
                        marginHealthPercentage > 50 ? t('stats.margin_warning') :
                        marginHealthPercentage > 30 ? t('stats.margin_call') : t('stats.stop_out')
                      }
                    </Text>
                  </HStack>
                </HStack>
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
                  {t('stats.margin_call_at')}: {trader.marginCallLevel}%
                </Text>
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
                  {t('stats.stop_out_at')}: {trader.stopOutLevel}%
                </Text>
              </VStack>
            </MotionStat>
          </SimpleGrid>

          {/* Trading Stats */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 3, md: 6 }}>
            <MotionBox
              p={{ base: 4, md: 6 }}
              bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
              borderRadius="2xl"
              boxShadow="lg"
              backdropFilter="blur(8px)"
              whileHover={{ scale: 1.01 }}
              height={{ base: 'auto', md: '300px' }}
            >
              <Heading size="md" mb={4}>{t('charts.performance')}</Heading>
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart
                  data={getPerformanceData()}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RechartsTooltip />
                  <Area 
                    type="monotone" 
                    dataKey="cumulativePnL" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#colorPnL)" 
                    name={t('charts.cumulative_pnl')}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </MotionBox>

            <MotionBox
              p={{ base: 4, md: 6 }}
              bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
              borderRadius="2xl"
              boxShadow="lg"
              backdropFilter="blur(8px)"
              whileHover={{ scale: 1.01 }}
              height={{ base: 'auto', md: '300px' }}
            >
              <Heading size="md" mb={4}>{t('charts.trading_activity')}</Heading>
              {tradeHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart
                    data={getPerformanceData()}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <RechartsTooltip />
                    <Bar 
                      dataKey="trades" 
                      fill="#3182CE" 
                      name={t('charts.daily_trades')}
                    />
                    <Bar 
                      dataKey="pnl" 
                      name={t('charts.daily_pnl')}
                      fill={(entry) => entry.pnl >= 0 ? '#48BB78' : '#E53E3E'}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Flex height="90%" align="center" justify="center">
                  <Text color="gray.500">{t('charts.no_trading_data')}</Text>
                </Flex>
              )}
            </MotionBox>
          </SimpleGrid>

          {/* Tabs Section */}
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
                  <Icon as={FiClock} mr={2} /> {t('tabs.recent_trades')}
                </Tab>
                <Tab whiteSpace="nowrap">
                  <Icon as={FiActivity} mr={2} /> {t('tabs.statistics')}
                </Tab>
                <Tab whiteSpace="nowrap">
                  <Icon as={FiList} mr={2} /> {t('tabs.account_details')}
                </Tab>
                <Tab whiteSpace="nowrap">
                  <Icon as={FiSettings} mr={2} /> {t('tabs.preferences')}
                </Tab>
              </TabList>

              <TabPanels>
                {/* Recent Trades Tab */}
                <TabPanel px={0}>
                  {isTradingHistoryLoading ? (
                    <Skeleton height="400px" />
                  ) : tradeHistory.length === 0 ? (
                    <Flex p={6} direction="column" align="center" justify="center">
                      <Icon as={FiDatabase} fontSize="4xl" color="gray.400" mb={3} />
                      <Heading size="md" mb={2}>{t('trades.no_trades_title')}</Heading>
                      <Text color="gray.500" textAlign="center" mb={4}>
                        {t('trades.no_trades_description')}
                      </Text>
                      <Button 
                        colorScheme="blue" 
                        leftIcon={<FiBarChart2 />}
                        onClick={() => router.push('/trader/platform')}
                      >
                        {t('actions.start_trading')}
                      </Button>
                    </Flex>
                  ) : (
                    <Box overflowX="auto">
                      <Table variant="simple" size={{ base: "sm", md: "md" }}>
                        <Thead>
                          <Tr>
                            <Th>{t('trades.date')}</Th>
                            <Th>{t('trades.type')}</Th>
                            <Th>{t('trades.instrument')}</Th>
                            <Th isNumeric>{t('trades.amount')}</Th>
                            <Th isNumeric>{t('trades.profit_loss')}</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {tradeHistory.slice(0, 10).map((trade, index) => (
                            <Tr key={index}>
                              <Td>{new Date(trade.attributes.createdAt).toLocaleString()}</Td>
                              <Td>
                                <Badge colorScheme={
                                  trade.attributes.type === 'buy' ? 'green' : 
                                  trade.attributes.type === 'sell' ? 'red' : 'gray'
                                }>
                                  {trade.attributes.type?.toUpperCase()}
                                </Badge>
                              </Td>
                              <Td>{trade.attributes.instrument}</Td>
                              <Td isNumeric>{parseFloat(trade.attributes.amount).toLocaleString()}</Td>
                              <Td isNumeric color={
                                parseFloat(trade.attributes.profitLoss) > 0 ? 'green.500' : 
                                parseFloat(trade.attributes.profitLoss) < 0 ? 'red.500' : 'gray.500'
                              }>
                                {parseFloat(trade.attributes.profitLoss).toLocaleString()}
                              </Td>
                              </Tr>
                          ))}
                        </Tbody>
                      </Table>
                      <Flex justify="center" mt={4}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push('/trader/history')}
                        >
                          {t('actions.view_all_trades')}
                        </Button>
                      </Flex>
                    </Box>
                  )}
                </TabPanel>
                
                {/* Statistics Tab */}
                <TabPanel px={0}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Card>
                      <CardBody>
                        <Heading size="sm" mb={4}>{t('stats.overview')}</Heading>
                        <SimpleGrid columns={2} spacing={4}>
                          <Box>
                            <Text fontSize="xs" color="gray.500">{t('stats.total_trades')}</Text>
                            <Text fontSize="lg" fontWeight="bold">{trader.totalTrades}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="xs" color="gray.500">{t('stats.win_rate')}</Text>
                            <Text fontSize="lg" fontWeight="bold">{trader.winRate}%</Text>
                          </Box>
                          <Box>
                            <Text fontSize="xs" color="gray.500">{t('stats.volume')}</Text>
                            <Text fontSize="lg" fontWeight="bold">{trader.tradingVolume.toLocaleString()}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="xs" color="gray.500">{t('stats.trading_since')}</Text>
                            <Text fontSize="lg" fontWeight="bold">
                              {trader.tradingSince 
                                ? new Date(trader.tradingSince).toLocaleDateString() 
                                : t('common:not_available')}
                            </Text>
                          </Box>
                        </SimpleGrid>
                      </CardBody>
                    </Card>
                    
                    <Card>
                      <CardBody>
                        <Heading size="sm" mb={4}>{t('stats.trading_metrics')}</Heading>
                        <SimpleGrid columns={2} spacing={4}>
                          {trader.tradingMetrics ? (
                            <>
                              <Box>
                                <Text fontSize="xs" color="gray.500">{t('stats.sharpe_ratio')}</Text>
                                <Text fontSize="lg" fontWeight="bold">
                                  {trader.tradingMetrics.sharpeRatio?.toFixed(2) || t('common:not_available')}
                                </Text>
                              </Box>
                              <Box>
                                <Text fontSize="xs" color="gray.500">{t('stats.max_drawdown')}</Text>
                                <Text fontSize="lg" fontWeight="bold">
                                  {trader.tradingMetrics.maxDrawdown?.toFixed(2)}%
                                </Text>
                              </Box>
                              <Box>
                                <Text fontSize="xs" color="gray.500">{t('stats.profit_factor')}</Text>
                                <Text fontSize="lg" fontWeight="bold">
                                  {trader.tradingMetrics.profitFactor?.toFixed(2) || t('common:not_available')}
                                </Text>
                              </Box>
                              <Box>
                                <Text fontSize="xs" color="gray.500">{t('stats.avg_trade_duration')}</Text>
                                <Text fontSize="lg" fontWeight="bold">
                                  {trader.tradingMetrics.avgTradeDuration || t('common:not_available')}
                                </Text>
                              </Box>
                            </>
                          ) : (
                            <Text color="gray.500" gridColumn="span 2">{t('stats.no_metrics')}</Text>
                          )}
                        </SimpleGrid>
                      </CardBody>
                    </Card>
                    
                    <Card gridColumn={{ md: "span 2" }}>
                      <CardBody>
                        <Heading size="sm" mb={4}>{t('stats.monthly_target')}</Heading>
                        {trader.monthlyTradingGoal ? (
                          <>
                            <Progress 
                              value={(trader.totalProfitLoss / trader.monthlyTradingGoal) * 100}
                              colorScheme={trader.totalProfitLoss >= 0 ? "green" : "red"}
                              borderRadius="md"
                              size="lg"
                              mb={3}
                            />
                            <Flex justify="space-between">
                              <Text>{t('stats.current')}: {trader.totalProfitLoss.toLocaleString()} {t('common:currency')}</Text>
                              <Text>{t('stats.target')}: {trader.monthlyTradingGoal.toLocaleString()} {t('common:currency')}</Text>
                            </Flex>
                          </>
                        ) : (
                          <Flex direction="column" align="center">
                            <Text color="gray.500" mb={2}>{t('stats.no_goal')}</Text>
                            <Button 
                              size="sm" 
                              colorScheme="blue" 
                              variant="outline"
                              onClick={() => router.push('/trader/settings')}
                            >
                              {t('actions.set_goal')}
                            </Button>
                          </Flex>
                        )}
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                </TabPanel>
                
                {/* Account Details Tab */}
                <TabPanel px={0}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Card>
                      <CardBody>
                        <Heading size="sm" mb={4}>{t('account.details')}</Heading>
                        <VStack spacing={3} align="stretch">
                          <Flex justify="space-between">
                            <Text fontWeight="medium">{t('account.type')}</Text>
                            <Badge colorScheme={
                              trader.accountType === 'vip' ? 'purple' :
                              trader.accountType === 'premium' ? 'blue' :
                              trader.accountType === 'standard' ? 'green' : 'gray'
                            }>
                              {trader.accountType?.toUpperCase()}
                            </Badge>
                          </Flex>
                          <Flex justify="space-between">
                            <Text fontWeight="medium">{t('account.level')}</Text>
                            <Badge colorScheme={
                              trader.tradingLevel === 'professional' ? 'red' :
                              trader.tradingLevel === 'advanced' ? 'purple' :
                              trader.tradingLevel === 'intermediate' ? 'blue' : 'teal'
                            }>
                              {trader.tradingLevel?.toUpperCase()}
                            </Badge>
                          </Flex>
                          <Flex justify="space-between">
                            <Text fontWeight="medium">{t('account.status')}</Text>
                            <Badge colorScheme={
                              trader.status === 'active' ? 'green' :
                              trader.status === 'pending' ? 'yellow' :
                              trader.status === 'suspended' ? 'orange' : 'red'
                            }>
                              {trader.status?.toUpperCase()}
                            </Badge>
                          </Flex>
                          <Flex justify="space-between">
                            <Text fontWeight="medium">{t('account.kyc_verified')}</Text>
                            <Badge colorScheme={trader.kycVerified ? 'green' : 'red'}>
                              {trader.kycVerified ? t('common:yes') : t('common:no')}
                            </Badge>
                          </Flex>
                          <Flex justify="space-between">
                            <Text fontWeight="medium">{t('account.fee_discount')}</Text>
                            <Text>{trader.feeDiscountTier.replace('tier', t('account.tier') + ' ')}</Text>
                          </Flex>
                        </VStack>
                      </CardBody>
                    </Card>
                    
                    <Card>
                      <CardBody>
                        <Heading size="sm" mb={4}>{t('account.trading_parameters')}</Heading>
                        <VStack spacing={3} align="stretch">
                          <Flex justify="space-between">
                            <Text fontWeight="medium">{t('account.leverage_limit')}</Text>
                            <Text>{trader.leverageLimit}x</Text>
                          </Flex>
                          <Flex justify="space-between">
                            <Text fontWeight="medium">{t('account.margin_call')}</Text>
                            <Text>{trader.marginCallLevel}%</Text>
                          </Flex>
                          <Flex justify="space-between">
                            <Text fontWeight="medium">{t('account.stop_out')}</Text>
                            <Text>{trader.stopOutLevel}%</Text>
                          </Flex>
                          <Flex justify="space-between">
                            <Text fontWeight="medium">{t('account.loyalty_points')}</Text>
                            <Text>{trader.loyaltyPoints || 0}</Text>
                          </Flex>
                          <Flex justify="space-between">
                            <Text fontWeight="medium">{t('account.margin_level')}</Text>
                            <Text>{trader.marginLevel}%</Text>
                          </Flex>
                        </VStack>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                </TabPanel>
                
                {/* Preferences Tab */}
                <TabPanel px={0}>
                  <Card>
                    <CardBody>
                      <Heading size="sm" mb={4}>{t('preferences.trading')}</Heading>
                      {trader.tradingPreferences ? (
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <Box>
                            <Text fontWeight="medium">{t('preferences.instruments')}</Text>
                            <Wrap mt={1}>
                              {trader.tradingPreferences.instruments?.map((instrument, idx) => (
                                <WrapItem key={idx}>
                                  <Badge>{instrument}</Badge>
                                </WrapItem>
                              ))}
                            </Wrap>
                          </Box>
                          <Box>
                            <Text fontWeight="medium">{t('preferences.markets')}</Text>
                            <Wrap mt={1}>
                              {trader.tradingPreferences.markets?.map((market, idx) => (
                                <WrapItem key={idx}>
                                  <Badge colorScheme="blue">{market}</Badge>
                                </WrapItem>
                              ))}
                            </Wrap>
                          </Box>
                          <Box>
                            <Text fontWeight="medium">{t('preferences.time_frames')}</Text>
                            <Wrap mt={1}>
                              {trader.tradingPreferences.timeFrames?.map((timeFrame, idx) => (
                                <WrapItem key={idx}>
                                  <Badge colorScheme="purple">{timeFrame}</Badge>
                                </WrapItem>
                              ))}
                            </Wrap>
                          </Box>
                          <Box>
                            <Text fontWeight="medium">{t('preferences.strategy')}</Text>
                            <Text mt={1}>{trader.tradingPreferences.strategy || t('common:not_specified')}</Text>
                          </Box>
                        </SimpleGrid>
                      ) : (
                        <Flex direction="column" align="center">
                          <Text color="gray.500" mb={2}>{t('preferences.not_set')}</Text>
                          <Button 
                            size="sm" 
                            colorScheme="blue" 
                            onClick={() => router.push('/trader/settings')}
                          >
                            {t('actions.update_preferences')}
                          </Button>
                        </Flex>
                      )}
                    </CardBody>
                  </Card>
                  
                  <Card mt={6}>
                    <CardBody>
                      <Heading size="sm" mb={4}>{t('preferences.notifications')}</Heading>
                      {trader.notificationPreferences ? (
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          {Object.entries(trader.notificationPreferences).map(([key, value]) => (
                            <Flex key={key} justify="space-between" align="center">
                              <Text>{t(`preferences.${key}`)}</Text>
                              <Badge colorScheme={value ? 'green' : 'red'}>
                                {value ? t('common:enabled') : t('common:disabled')}
                              </Badge>
                            </Flex>
                          ))}
                        </SimpleGrid>
                      ) : (
                        <Flex direction="column" align="center">
                          <Text color="gray.500" mb={2}>{t('preferences.notifications_not_set')}</Text>
                          <Button 
                            size="sm" 
                            colorScheme="blue" 
                            onClick={() => router.push('/trader/settings')}
                          >
                            {t('actions.update_notifications')}
                          </Button>
                        </Flex>
                      )}
                    </CardBody>
                  </Card>
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
                    router.push('/trader/profile');
                  }}
                  w="full"
                  justifyContent="start"
                >
                  {t('menu.profile')}
                </Button>

                <Button 
                  leftIcon={<FiBarChart2 />}
                  onClick={() => {
                    onMenuModalClose();
                    router.push('/trader/platform');
                  }}
                  w="full"
                  justifyContent="start"
                >
                  {t('menu.trading_platform')}
                </Button>

                <Button 
                  leftIcon={<FiSettings />}
                  onClick={() => {
                    onMenuModalClose();
                    router.push('/trader/settings');
                  }}
                  w="full"
                  justifyContent="start"
                >
                  {t('menu.settings')}
                </Button>

                <Button 
                  leftIcon={<FiUpload />}
                  onClick={() => {
                    onMenuModalClose();
                    router.push('/trader/deposit');
                  }}
                  w="full"
                  justifyContent="start"
                >
                  {t('menu.deposit')}
                </Button>

                <Button 
                  leftIcon={<FiDownload />}
                  onClick={() => {
                    onMenuModalClose();
                    router.push('/trader/withdraw');
                  }}
                  w="full"
                  justifyContent="start"
                >
                  {t('menu.withdraw')}
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
      </Container>
    </Layout>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'dashboard'])),
  },
});

export default TraderDashboard;