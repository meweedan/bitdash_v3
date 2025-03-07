import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  useColorModeValue,
  HStack,
  VStack,
  Button,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Skeleton,
  Container,
  useBreakpointValue,
  Tooltip,
  Icon,
  Select,
  ButtonGroup,
  useToast
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaInfoCircle, FaChartLine, FaChartBar, FaChartPie } from 'react-icons/fa';
import { BsArrowUpRight, BsArrowDownRight } from 'react-icons/bs';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

// Import the recharts components needed
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const TradingPerformanceChart = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const { locale } = router;
  const toast = useToast();
  const [timeframe, setTimeframe] = useState('1M');
  const [isLoading, setIsLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState({});
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  
  // Responsive values
  const headingSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const statFontSize = useBreakpointValue({ base: 'md', md: 'xl' });
  const chartHeight = useBreakpointValue({ base: 180, sm: 200, md: 250, lg: 300 });
  const buttonSize = useBreakpointValue({ base: 'xs', md: 'sm' });
  const statDirection = useBreakpointValue({ base: 'column', md: 'row' });
  const tabOrientation = useBreakpointValue({ base: 'column', md: 'horizontal' });
  const showButtons = useBreakpointValue({ base: false, md: true });
  const isMobile = useBreakpointValue({ base: true, md: false });
  const showFullStats = useBreakpointValue({ base: false, md: true });
  
  // Background and text colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const buttonBgActive = useColorModeValue('brand.crypto.500', 'brand.crypto.400');
  const buttonColorActive = useColorModeValue('white', 'white');
  const lineColor = useColorModeValue('brand.crypto.500', 'brand.crypto.400');
  const tooltipBg = useColorModeValue('white', 'gray.700');
  const accentColor = useColorModeValue('brand.crypto.500', 'brand.crypto.400');

  // Tabs for mobile
  const tabs = [
    { label: t('tabs.balance', 'Balance'), icon: FaChartLine },
    { label: t('tabs.pnl', 'P&L'), icon: FaChartBar },
    { label: t('tabs.stats', 'Statistics'), icon: FaChartPie }
  ];

  // Pie chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Fetch data function - in a real app, this would call an API
  const fetchPerformanceData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // This would be replaced with a real API call
      // For demo purposes, we'll simulate a network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample performance data - in a real app this would come from an API
      const sampleData = {
        '1M': [
          { day: '1', balance: 10000, pnl: 0, drawdown: 0 },
          { day: '3', balance: 10240, pnl: 240, drawdown: 0 },
          { day: '5', balance: 10190, pnl: 190, drawdown: -50 },
          { day: '7', balance: 10350, pnl: 350, drawdown: 0 },
          { day: '9', balance: 10290, pnl: 290, drawdown: -60 },
          { day: '11', balance: 10520, pnl: 520, drawdown: 0 },
          { day: '13', balance: 10610, pnl: 610, drawdown: 0 },
          { day: '15', balance: 10540, pnl: 540, drawdown: -70 },
          { day: '17', balance: 10730, pnl: 730, drawdown: 0 },
          { day: '19', balance: 10690, pnl: 690, drawdown: -40 },
          { day: '21', balance: 10810, pnl: 810, drawdown: 0 },
          { day: '23', balance: 10940, pnl: 940, drawdown: 0 },
          { day: '25', balance: 11060, pnl: 1060, drawdown: 0 },
          { day: '27', balance: 10980, pnl: 980, drawdown: -80 },
          { day: '30', balance: 11150, pnl: 1150, drawdown: 0 },
        ],
        '3M': [
          { day: 'Jan 1', balance: 10000, pnl: 0, drawdown: 0 },
          { day: 'Jan 10', balance: 10320, pnl: 320, drawdown: 0 },
          { day: 'Jan 20', balance: 10580, pnl: 580, drawdown: 0 },
          { day: 'Jan 30', balance: 11150, pnl: 1150, drawdown: 0 },
          { day: 'Feb 9', balance: 11040, pnl: 1040, drawdown: -110 },
          { day: 'Feb 19', balance: 11380, pnl: 1380, drawdown: 0 },
          { day: 'Feb 28', balance: 11760, pnl: 1760, drawdown: 0 },
          { day: 'Mar 10', balance: 11620, pnl: 1620, drawdown: -140 },
          { day: 'Mar 20', balance: 12050, pnl: 2050, drawdown: 0 },
          { day: 'Mar 30', balance: 12380, pnl: 2380, drawdown: 0 },
        ],
        '6M': [
          { day: 'Month 1', balance: 10000, pnl: 0, drawdown: 0 },
          { day: 'Month 2', balance: 11150, pnl: 1150, drawdown: 0 },
          { day: 'Month 3', balance: 12380, pnl: 2380, drawdown: 0 },
          { day: 'Month 4', balance: 12150, pnl: 2150, drawdown: -230 },
          { day: 'Month 5', balance: 13420, pnl: 3420, drawdown: 0 },
          { day: 'Month 6', balance: 14950, pnl: 4950, drawdown: 0 },
        ],
        '1Y': [
          { day: 'Jan', balance: 10000, pnl: 0, drawdown: 0 },
          { day: 'Feb', balance: 11150, pnl: 1150, drawdown: 0 },
          { day: 'Mar', balance: 12380, pnl: 2380, drawdown: 0 },
          { day: 'Apr', balance: 12150, pnl: 2150, drawdown: -230 },
          { day: 'May', balance: 13420, pnl: 3420, drawdown: 0 },
          { day: 'Jun', balance: 14950, pnl: 4950, drawdown: 0 },
          { day: 'Jul', balance: 14620, pnl: 4620, drawdown: -330 },
          { day: 'Aug', balance: 15840, pnl: 5840, drawdown: 0 },
          { day: 'Sep', balance: 16750, pnl: 6750, drawdown: 0 },
          { day: 'Oct', balance: 17890, pnl: 7890, drawdown: 0 },
          { day: 'Nov', balance: 19240, pnl: 9240, drawdown: 0 },
          { day: 'Dec', balance: 21050, pnl: 11050, drawdown: 0 },
        ],
      };

      setPerformanceData(sampleData);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      toast({
        title: t('error.data_fetch', 'Error fetching data'),
        description: t('error.try_again', 'Please try again later'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [t, toast]);

  // Get current data
  const currentData = performanceData[timeframe] || [];
  
  // Calculate performance metrics for current timeframe
  const initialBalance = currentData.length > 0 ? currentData[0].balance : 0;
  const currentBalance = currentData.length > 0 ? currentData[currentData.length - 1].balance : 0;
  const totalReturn = ((currentBalance - initialBalance) / initialBalance * 100).toFixed(2);
  
  // Maximum drawdown for the period
  const maxDrawdown = currentData.length > 0 ? Math.min(...currentData.map(item => item.drawdown)) : 0;
  
  // Identify the best and worst day/period
  const bestDay = currentData.length > 0 ? currentData.reduce((prev, current) => 
    (current.pnl > prev.pnl) ? current : prev
  ) : { day: '-', pnl: 0 };
  
  const worstDay = currentData.length > 0 ? currentData.reduce((prev, current) => 
    (current.drawdown < prev.drawdown) ? current : prev
  ) : { day: '-', drawdown: 0 };
  
  // Trading stats for display in this demo
  const tradingStats = {
    winRate: '67.3%',
    profitFactor: '2.85',
    avgWin: '$345',
    avgLoss: '$125',
    sharpeRatio: '1.92',
    tradesPerDay: '5.4',
    avgHoldingTime: '2h 15m',
  };

  // Distribution data for pie chart
  const distributionData = [
    { name: t('chart.forex', 'Forex'), value: 35 },
    { name: t('chart.crypto', 'Crypto'), value: 25 },
    { name: t('chart.stocks', 'Stocks'), value: 20 },
    { name: t('chart.commodities', 'Commodities'), value: 15 },
    { name: t('chart.indices', 'Indices'), value: 5 }
  ];

  // Fetch data on initial load
  useEffect(() => {
    fetchPerformanceData();
  }, [fetchPerformanceData]);

  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box bg={tooltipBg} p={2} borderRadius="md" boxShadow="md" border="1px solid" borderColor={borderColor}>
          <Text fontWeight="bold">{label}</Text>
          {payload.map((entry, index) => (
            <Text key={index} color={entry.color}>
              {entry.name}: ${entry.value}
            </Text>
          ))}
        </Box>
      );
    }
    return null;
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Box
      w="full"
      maxW="4xl"
      bg={bgColor}
      borderRadius="xl"
      boxShadow="lg"
      p={{ base: 3, md: 4 }}
      borderWidth="1px"
      borderColor={borderColor}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <Flex 
        justify="space-between" 
        align="center" 
        mb={4} 
        flexDir={{ base: 'column', sm: 'row' }}
        gap={{ base: 2, sm: 0 }}
      >
        <Flex align="center">
          <Heading size={headingSize} color={textColor}>
            {t('performance.analysis', 'Performance Analysis')}
          </Heading>
          <Tooltip label={t('performance.info', 'Analyze your trading performance across different timeframes')}>
            <Box display="inline-block" ml={2}>
              <Icon as={FaInfoCircle} color={useColorModeValue('gray.400', 'gray.500')} />
            </Box>
          </Tooltip>
        </Flex>
        
        {showButtons ? (
          <HStack spacing={1}>
            {['1M', '3M', '6M', '1Y'].map((period) => (
              <Button
                key={period}
                size={buttonSize}
                onClick={() => setTimeframe(period)}
                bg={timeframe === period ? buttonBgActive : 'transparent'}
                color={timeframe === period ? buttonColorActive : textColor}
                _hover={{ bg: timeframe === period ? buttonBgActive : useColorModeValue('gray.100', 'gray.700') }}
              >
                {t(`timeframe.${period.toLowerCase()}`, period)}
              </Button>
            ))}
          </HStack>
        ) : (
          <Select
            size="sm"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            width={{ base: 'full', sm: '120px' }}
          >
            {['1M', '3M', '6M', '1Y'].map((period) => (
              <option key={period} value={period}>
                {t(`timeframe.${period.toLowerCase()}`, period)}
              </option>
            ))}
          </Select>
        )}
      </Flex>

      {isLoading ? (
        <VStack spacing={4}>
          <Skeleton height={chartHeight} width="100%" />
          <Skeleton height="60px" width="100%" />
          <Skeleton height="100px" width="100%" />
        </VStack>
      ) : (
        <Tabs 
          colorScheme="blue" 
          variant="soft-rounded" 
          mt={2}
          index={currentTabIndex}
          onChange={setCurrentTabIndex}
          orientation={tabOrientation}
        >
          <TabList mb={3} flexWrap="wrap" justifyContent="center">
            {tabs.map((tab, index) => (
              <Tab 
                key={index}
                fontSize={{ base: 'xs', md: 'sm' }}
                px={{ base: 2, md: 3 }}
                py={{ base: 1, md: 2 }}
                borderRadius="full"
                mb={1}
              >
                <Icon as={tab.icon} mr={1} />
                {tab.label}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            <TabPanel px={0} py={2}>
              <Box h={chartHeight}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={currentData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={lineColor} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={lineColor} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="day"
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      tickMargin={8}
                    />
                    <YAxis 
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="balance" 
                      stroke={lineColor} 
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorBalance)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
              
              <StatGroup 
                mt={4} 
                textAlign="center"
                flexDirection={statDirection}
                px={2}
                py={3}
                bg={cardBg}
                borderRadius="md"
                spacing={{ base: 2, md: 4 }}
              >
                <Stat>
                  <StatLabel>{t('stat.initial_balance', 'Initial Balance')}</StatLabel>
                  <StatNumber fontSize={statFontSize}>{formatCurrency(initialBalance)}</StatNumber>
                </Stat>
                
                <Stat>
                  <StatLabel>{t('stat.current_balance', 'Current Balance')}</StatLabel>
                  <StatNumber fontSize={statFontSize}>{formatCurrency(currentBalance)}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {totalReturn}%
                  </StatHelpText>
                </Stat>
                
                <Stat>
                  <StatLabel>{t('stat.max_drawdown', 'Maximum Drawdown')}</StatLabel>
                  <StatNumber fontSize={statFontSize}>{maxDrawdown}%</StatNumber>
                </Stat>
              </StatGroup>
            </TabPanel>
            
            <TabPanel px={0} py={2}>
              <Box h={chartHeight}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={currentData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      tickMargin={8}
                    />
                    <YAxis 
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="pnl" 
                      fill={lineColor}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              
              <Flex 
                mt={4} 
                justify="space-between"
                flexDirection={{ base: 'column', sm: 'row' }}
                gap={4}
              >
                <Box
                  p={3}
                  borderRadius="md"
                  bg={cardBg}
                  width={{ base: 'full', sm: '48%' }}
                >
                  <Text fontWeight="bold" mb={2} textAlign="center">
                    {t('stat.best_performance', 'Best Performance')}
                  </Text>
                  <Flex 
                    align="center" 
                    justify="center"
                    bg={useColorModeValue('green.50', 'green.900')}
                    p={2}
                    borderRadius="md"
                    color={useColorModeValue('green.600', 'green.200')}
                  >
                    <Icon as={BsArrowUpRight} mr={2} />
                    <Text fontWeight="semibold">
                      {bestDay.day}: +{formatCurrency(bestDay.pnl)}
                    </Text>
                  </Flex>
                </Box>
                
                <Box
                  p={3}
                  borderRadius="md"
                  bg={cardBg}
                  width={{ base: 'full', sm: '48%' }}
                >
                  <Text fontWeight="bold" mb={2} textAlign="center">
                    {t('stat.worst_performance', 'Worst Performance')}
                  </Text>
                  <Flex 
                    align="center"
                    justify="center"
                    bg={useColorModeValue('red.50', 'red.900')}
                    p={2}
                    borderRadius="md"
                    color={useColorModeValue('red.600', 'red.200')}
                  >
                    <Icon as={BsArrowDownRight} mr={2} />
                    <Text fontWeight="semibold">
                      {worstDay.day}: {formatCurrency(worstDay.drawdown)}
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            </TabPanel>
            
            <TabPanel px={0} py={2}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box p={{ base: 3, md: 4 }} borderRadius="md" bg={cardBg}>
                  <Heading size="sm" mb={{ base: 2, md: 4 }}>
                    {t('stat.trading_statistics', 'Trading Statistics')}
                  </Heading>
                  
                  {showFullStats ? (
                    <SimpleGrid columns={{ base: 2, md: 2 }} spacing={{ base: 3, md: 4 }}>
                      <VStack align="start">
                        <Text fontSize="sm" color="gray.500">{t('stat.win_rate', 'Win Rate')}</Text>
                        <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">{tradingStats.winRate}</Text>
                      </VStack>
                      
                      <VStack align="start">
                        <Text fontSize="sm" color="gray.500">{t('stat.profit_factor', 'Profit Factor')}</Text>
                        <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">{tradingStats.profitFactor}</Text>
                      </VStack>
                      
                      <VStack align="start">
                        <Text fontSize="sm" color="gray.500">{t('stat.avg_win', 'Average Win')}</Text>
                        <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">{tradingStats.avgWin}</Text>
                      </VStack>
                      
                      <VStack align="start">
                        <Text fontSize="sm" color="gray.500">{t('stat.avg_loss', 'Average Loss')}</Text>
                        <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">{tradingStats.avgLoss}</Text>
                      </VStack>
                      
                      <VStack align="start">
                        <Text fontSize="sm" color="gray.500">{t('stat.sharpe', 'Sharpe Ratio')}</Text>
                        <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">{tradingStats.sharpeRatio}</Text>
                      </VStack>
                      
                      <VStack align="start">
                        <Text fontSize="sm" color="gray.500">{t('stat.trades_per_day', 'Trades/Day')}</Text>
                        <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">{tradingStats.tradesPerDay}</Text>
                      </VStack>
                    </SimpleGrid>
                  ) : (
                    // Simplified mobile view
                    <SimpleGrid columns={3} spacing={2}>
                      <VStack align="center" p={2}>
                        <Text fontSize="xs" color="gray.500" textAlign="center">{t('stat.win_rate', 'Win Rate')}</Text>
                        <Text fontSize="md" fontWeight="bold">{tradingStats.winRate}</Text>
                      </VStack>
                      
                      <VStack align="center" p={2}>
                        <Text fontSize="xs" color="gray.500" textAlign="center">{t('stat.profit_factor', 'P-Factor')}</Text>
                        <Text fontSize="md" fontWeight="bold">{tradingStats.profitFactor}</Text>
                      </VStack>
                      
                      <VStack align="center" p={2}>
                        <Text fontSize="xs" color="gray.500" textAlign="center">{t('stat.sharpe', 'Sharpe')}</Text>
                        <Text fontSize="md" fontWeight="bold">{tradingStats.sharpeRatio}</Text>
                      </VStack>
                    </SimpleGrid>
                  )}
                </Box>
                
                <Box p={{ base: 3, md: 4 }} borderRadius="md" bg={cardBg}>
                  <Heading size="sm" mb={{ base: 2, md: 2 }}>
                    {t('stat.asset_distribution', 'Asset Distribution')}
                  </Heading>
                  
                  <Box h={{ base: "150px", sm: "180px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={distributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={isMobile ? 35 : 50}
                          outerRadius={isMobile ? 55 : 70}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={isMobile ? undefined : ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={!isMobile}
                        >
                          {distributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                        {!isMobile && <Legend />}
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
};

export default TradingPerformanceChart;