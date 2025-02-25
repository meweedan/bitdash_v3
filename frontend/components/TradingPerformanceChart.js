import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { Line } from 'recharts';

// Import the recharts components needed
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from 'recharts';

const TradingPerformanceChart = () => {
  const [timeframe, setTimeframe] = useState('1M');
  
  // Background and text colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const buttonBgActive = useColorModeValue('brand.bitfund.500', 'brand.bitfund.400');
  const buttonColorActive = useColorModeValue('white', 'white');
  const lineColor = useColorModeValue('brand.bitfund.500', 'brand.bitfund.400');
  
  // Sample performance data
  const performanceData = {
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

  // Current timeframe data
  const currentData = performanceData[timeframe];
  
  // Calculate performance metrics for current timeframe
  const initialBalance = currentData[0].balance;
  const currentBalance = currentData[currentData.length - 1].balance;
  const totalReturn = ((currentBalance - initialBalance) / initialBalance * 100).toFixed(2);
  
  // Maximum drawdown for the period
  const maxDrawdown = Math.min(...currentData.map(item => item.drawdown));
  
  // Identify the best and worst day/period
  const bestDay = currentData.reduce((prev, current) => 
    (current.pnl > prev.pnl) ? current : prev
  );
  
  const worstDay = currentData.reduce((prev, current) => 
    (current.drawdown < prev.drawdown) ? current : prev
  );
  
  // Trading stats for display in this demo
  const tradingStats = {
    winRate: '67.3%',
    profitFactor: '2.85',
    avgWin: '$345',
    avgLoss: '$125',
    sharpeRatio: '1.92', 
  };

  return (
    <Box
      w="full"
      maxW="4xl"
      bg={bgColor}
      borderRadius="xl"
      boxShadow="lg"
      p={4}
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md" color={textColor}>Performance Analysis</Heading>
        <HStack spacing={1}>
          {['1M', '3M', '6M', '1Y'].map((period) => (
            <Button
              key={period}
              size="sm"
              onClick={() => setTimeframe(period)}
              bg={timeframe === period ? buttonBgActive : 'transparent'}
              color={timeframe === period ? buttonColorActive : textColor}
              _hover={{ bg: timeframe === period ? buttonBgActive : useColorModeValue('gray.100', 'gray.700') }}
            >
              {period}
            </Button>
          ))}
        </HStack>
      </Flex>

      <Tabs colorScheme="blue" variant="soft-rounded" mt={2}>
        <TabList>
          <Tab>Balance</Tab>
          <Tab>P&L</Tab>
          <Tab>Statistics</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <Box h="250px">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={currentData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Account Balance']}
                    labelFormatter={(label) => `Day: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke={lineColor} 
                    fill={useColorModeValue('rgba(49, 130, 206, 0.2)', 'rgba(49, 130, 206, 0.1)')} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
            
            <StatGroup mt={4} textAlign="center">
              <Stat>
                <StatLabel>Initial Balance</StatLabel>
                <StatNumber>${initialBalance.toLocaleString()}</StatNumber>
              </Stat>
              
              <Stat>
                <StatLabel>Current Balance</StatLabel>
                <StatNumber>${currentBalance.toLocaleString()}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {totalReturn}%
                </StatHelpText>
              </Stat>
              
              <Stat>
                <StatLabel>Maximum Drawdown</StatLabel>
                <StatNumber>{maxDrawdown}%</StatNumber>
              </Stat>
            </StatGroup>
          </TabPanel>
          
          <TabPanel px={0}>
            <Box h="250px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={currentData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Profit/Loss']}
                    labelFormatter={(label) => `Day: ${label}`}
                  />
                  <Bar 
                    dataKey="pnl" 
                    fill={lineColor} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
            
            <Flex mt={4} justify="space-between">
              <VStack align="start">
                <Text fontWeight="bold">Best Performance</Text>
                <Badge colorScheme="green" p={2} borderRadius="md">
                  {bestDay.day}: +${bestDay.pnl}
                </Badge>
              </VStack>
              
              <VStack align="start">
                <Text fontWeight="bold">Worst Performance</Text>
                <Badge colorScheme="red" p={2} borderRadius="md">
                  {worstDay.day}: ${worstDay.drawdown}
                </Badge>
              </VStack>
            </Flex>
          </TabPanel>
          
          <TabPanel px={0}>
            <SimpleStats stats={tradingStats} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

// Simple component to display trading stats
const SimpleStats = ({ stats }) => {
  return (
    <Box p={4} borderRadius="md" bg={useColorModeValue('gray.50', 'gray.700')}>
      <Heading size="sm" mb={4}>Trading Statistics</Heading>
      
      <SimpleGrid columns={{ base: 2, md: 3 }} spacing={6}>
        <VStack align="start">
          <Text fontSize="sm" color="gray.500">Win Rate</Text>
          <Text fontSize="xl" fontWeight="bold">{stats.winRate}</Text>
        </VStack>
        
        <VStack align="start">
          <Text fontSize="sm" color="gray.500">Profit Factor</Text>
          <Text fontSize="xl" fontWeight="bold">{stats.profitFactor}</Text>
        </VStack>
        
        <VStack align="start">
          <Text fontSize="sm" color="gray.500">Sharpe Ratio</Text>
          <Text fontSize="xl" fontWeight="bold">{stats.sharpeRatio}</Text>
        </VStack>
        
        <VStack align="start">
          <Text fontSize="sm" color="gray.500">Average Win</Text>
          <Text fontSize="xl" fontWeight="bold">{stats.avgWin}</Text>
        </VStack>
        
        <VStack align="start">
          <Text fontSize="sm" color="gray.500">Average Loss</Text>
          <Text fontSize="xl" fontWeight="bold">{stats.avgLoss}</Text>
        </VStack>
      </SimpleGrid>
    </Box>
  );
};

export default TradingPerformanceChart;