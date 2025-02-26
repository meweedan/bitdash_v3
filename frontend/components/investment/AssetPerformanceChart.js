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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Select,
  Icon,
} from '@chakra-ui/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { FaChartLine, FaCoins, FaOilCan, FaBuilding } from 'react-icons/fa';

const AssetPerformanceChart = () => {
  const [timeframe, setTimeframe] = useState('1M');
  const [assetType, setAssetType] = useState('stocks');
  
  // Background and text colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Sample performance data for different asset types and timeframes
  const performanceData = {
    stocks: {
      '1M': generateStocksData(30, 'day'),
      '3M': generateStocksData(90, 'week'),
      '6M': generateStocksData(180, 'week'),
      '1Y': generateStocksData(12, 'month'),
    },
    gold: {
      '1M': generateGoldData(30, 'day'),
      '3M': generateGoldData(90, 'week'),
      '6M': generateGoldData(180, 'week'),
      '1Y': generateGoldData(12, 'month'),
    },
    oil: {
      '1M': generateOilData(30, 'day'),
      '3M': generateOilData(90, 'week'),
      '6M': generateOilData(180, 'week'),
      '1Y': generateOilData(12, 'month'),
    },
    private: {
      '1M': generatePrivateData(30, 'day'),
      '3M': generatePrivateData(90, 'week'),
      '6M': generatePrivateData(180, 'week'),
      '1Y': generatePrivateData(12, 'month'),
    }
  };

  // Current selected data based on asset type and timeframe
  const currentData = performanceData[assetType][timeframe];
  
  // Functions to get asset-specific colors
  const getAssetColors = () => {
    switch (assetType) {
      case 'stocks':
        return { 
          main: 'rgba(138, 43, 226, 0.7)', 
          gradient: ['rgba(138, 43, 226, 0.2)', 'rgba(138, 43, 226, 0)'],
          accent: 'rgb(138, 43, 226)'
        };
      case 'gold':
        return { 
          main: 'rgba(218, 165, 32, 0.7)', 
          gradient: ['rgba(218, 165, 32, 0.2)', 'rgba(218, 165, 32, 0)'],
          accent: 'rgb(218, 165, 32)'
        };
      case 'oil':
        return { 
          main: 'rgba(63, 81, 181, 0.7)', 
          gradient: ['rgba(63, 81, 181, 0.2)', 'rgba(63, 81, 181, 0)'],
          accent: 'rgb(63, 81, 181)'
        };
      case 'private':
        return { 
          main: 'rgba(76, 175, 80, 0.7)', 
          gradient: ['rgba(76, 175, 80, 0.2)', 'rgba(76, 175, 80, 0)'],
          accent: 'rgb(76, 175, 80)'
        };
      default:
        return { 
          main: 'rgba(138, 43, 226, 0.7)', 
          gradient: ['rgba(138, 43, 226, 0.2)', 'rgba(138, 43, 226, 0)'],
          accent: 'rgb(138, 43, 226)'
        };
    }
  };
  
  const colors = getAssetColors();
  
  // Calculate performance metrics
  const initialValue = currentData[0].value;
  const currentValue = currentData[currentData.length - 1].value;
  const percentageChange = ((currentValue - initialValue) / initialValue * 100).toFixed(2);
  const isPositive = parseFloat(percentageChange) >= 0;
  
  // Icons for different asset types
  const assetIcons = {
    stocks: FaChartLine,
    gold: FaCoins,
    oil: FaOilCan,
    private: FaBuilding
  };
  
  // Asset titles
  const assetTitles = {
    stocks: 'US & EU Stocks',
    gold: 'Gold & Precious Metals',
    oil: 'Oil & Commodities',
    private: 'Private Assets'
  };

  return (
    <Box
      w="full"
      maxW="4xl"
      bg={bgColor}
      borderRadius="xl"
      boxShadow="lg"
      p={4}
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Flex justify="space-between" align="center" mb={4} wrap="wrap">
        <HStack spacing={2}>
          <Icon as={assetIcons[assetType]} color={colors.accent} boxSize={5} />
          <Heading size="md" color={textColor}>
            {assetTitles[assetType]} Performance
          </Heading>
        </HStack>
        
        <HStack spacing={4} mt={{ base: 2, md: 0 }}>
          <Select 
            size="sm" 
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
            width="150px"
            variant="filled"
          >
            <option value="stocks">Stocks</option>
            <option value="gold">Gold</option>
            <option value="oil">Oil</option>
            <option value="private">Private Assets</option>
          </Select>
          
          <HStack spacing={1}>
            {['1M', '3M', '6M', '1Y'].map((period) => (
              <Button
                key={period}
                size="sm"
                onClick={() => setTimeframe(period)}
                bg={timeframe === period ? 'brand.bitinvest.500' : 'transparent'}
                color={timeframe === period ? 'white' : textColor}
                _hover={{ 
                  bg: timeframe === period 
                    ? 'brand.bitinvest.600' 
                    : useColorModeValue('gray.100', 'gray.700') 
                }}
              >
                {period}
              </Button>
            ))}
          </HStack>
        </HStack>
      </Flex>

      <Tabs color="brand.bitinvest.500" variant="soft-rounded" mt={2}>
        <TabList>
          <Tab>Performance</Tab>
          <Tab>Comparison</Tab>
          <Tab>Volume</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <Box h="250px" mt={2}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={currentData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={useColorModeValue('gray.200', 'gray.700')} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    stroke={useColorModeValue('gray.500', 'gray.400')}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke={useColorModeValue('gray.500', 'gray.400')}
                  />
                  <Tooltip 
                    formatter={(value) => ['$' + value.toFixed(2), 'Value']}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{ 
                      backgroundColor: useColorModeValue('white', 'gray.800'),
                      borderColor: borderColor
                    }}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.gradient[0]} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={colors.gradient[1]} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={colors.accent}
                    fillOpacity={1}
                    fill="url(#colorGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
            
            <HStack 
              mt={4} 
              p={4} 
              borderRadius="md" 
              bg={useColorModeValue('gray.50', 'gray.700')}
              justify="space-between"
              wrap="wrap"
            >
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" color="gray.500">Starting Value</Text>
                <Text fontSize="lg" fontWeight="bold">${initialValue.toFixed(2)}</Text>
              </VStack>
              
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" color="gray.500">Current Value</Text>
                <Text fontSize="lg" fontWeight="bold">${currentValue.toFixed(2)}</Text>
              </VStack>
              
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" color="gray.500">Change</Text>
                <HStack>
                  <Badge 
                    colorScheme={isPositive ? "green" : "red"}
                    fontSize="md"
                    px={2}
                    py={1}
                  >
                    {isPositive ? '+' : ''}{percentageChange}%
                  </Badge>
                </HStack>
              </VStack>
              
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" color="gray.500">Volatility</Text>
                <Text fontSize="lg" fontWeight="bold">
                  {assetType === 'stocks' ? 'Medium' : 
                   assetType === 'gold' ? 'Low' : 
                   assetType === 'oil' ? 'High' : 'Very Low'}
                </Text>
              </VStack>
            </HStack>
          </TabPanel>
          
          <TabPanel px={0}>
            <Box h="250px" mt={2}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={generateComparisonData(assetType, timeframe)}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={useColorModeValue('gray.200', 'gray.700')} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    stroke={useColorModeValue('gray.500', 'gray.400')}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke={useColorModeValue('gray.500', 'gray.400')}
                  />
                  <Tooltip 
                    formatter={(value, name) => ['$' + value.toFixed(2), name]}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{ 
                      backgroundColor: useColorModeValue('white', 'gray.800'),
                      borderColor: borderColor
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={assetTitles[assetType]}
                    stroke={colors.accent}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="S&P 500"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="MSCI World"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
            
            <VStack
              mt={4}
              p={4}
              borderRadius="md"
              bg={useColorModeValue('gray.50', 'gray.700')}
              align="stretch"
            >
              <Text fontWeight="bold" mb={2}>Performance vs Benchmark</Text>
              <HStack justify="space-between">
                <Text>vs S&P 500</Text>
                <Badge 
                  colorScheme={assetType === "oil" ? "red" : "green"}
                  fontSize="sm"
                >
                  {assetType === "oil" ? "-2.45%" : 
                   assetType === "gold" ? "+3.12%" : 
                   assetType === "private" ? "+5.83%" : "+1.87%"}
                </Badge>
              </HStack>
              <HStack justify="space-between">
                <Text>vs MSCI World</Text>
                <Badge 
                  colorScheme={assetType === "stocks" || assetType === "oil" ? "red" : "green"}
                  fontSize="sm"
                >
                  {assetType === "oil" ? "-1.72%" : 
                   assetType === "gold" ? "+4.58%" : 
                   assetType === "private" ? "+7.24%" : "-0.45%"}
                </Badge>
              </HStack>
            </VStack>
          </TabPanel>
          
          <TabPanel px={0}>
            <Box h="250px" mt={2}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={generateVolumeData(assetType, timeframe)}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={useColorModeValue('gray.200', 'gray.700')} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    stroke={useColorModeValue('gray.500', 'gray.400')}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke={useColorModeValue('gray.500', 'gray.400')}
                  />
                  <Tooltip 
                    formatter={(value) => [value.toLocaleString(), 'Volume']}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{ 
                      backgroundColor: useColorModeValue('white', 'gray.800'),
                      borderColor: borderColor
                    }}
                  />
                  <Bar 
                    dataKey="volume" 
                    fill={colors.accent}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
            
            <HStack 
              mt={4} 
              p={4} 
              borderRadius="md" 
              bg={useColorModeValue('gray.50', 'gray.700')}
              justify="space-between"
              wrap="wrap"
            >
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" color="gray.500">Avg. Daily Volume</Text>
                <Text fontSize="lg" fontWeight="bold">
                  {assetType === 'stocks' ? '3.2M' : 
                   assetType === 'gold' ? '876K' : 
                   assetType === 'oil' ? '1.4M' : '125K'}
                </Text>
              </VStack>
              
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" color="gray.500">30-Day Vol Change</Text>
                <Badge 
                  colorScheme={
                    assetType === 'stocks' || assetType === 'private' ? "green" : "red"
                  }
                  fontSize="md"
                  px={2}
                  py={1}
                >
                  {assetType === 'stocks' ? '+12.4%' : 
                   assetType === 'gold' ? '-3.7%' : 
                   assetType === 'oil' ? '-8.2%' : '+21.5%'}
                </Badge>
              </VStack>
              
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" color="gray.500">Liquidity Rating</Text>
                <Text fontSize="lg" fontWeight="bold">
                  {assetType === 'stocks' ? 'High' : 
                   assetType === 'gold' ? 'High' : 
                   assetType === 'oil' ? 'Medium' : 'Low'}
                </Text>
              </VStack>
            </HStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

// Helper function to generate stocks data
function generateStocksData(points, interval) {
  const data = [];
  let value = 100 + Math.random() * 20;
  
  for (let i = 0; i < points; i++) {
    // Create more realistic market movements with occasional jumps
    const change = (Math.random() - 0.48) * 2; // Slight upward bias
    value = Math.max(80, value + change);
    
    // Add some volatility spikes
    if (Math.random() > 0.95) {
      value = value * (1 + (Math.random() * 0.06 - 0.03));
    }
    
    let date;
    if (interval === 'day') {
      date = `Day ${i + 1}`;
    } else if (interval === 'week') {
      date = `Week ${Math.floor(i / 7) + 1}`;
    } else {
      date = `Month ${i + 1}`;
    }
    
    data.push({
      date,
      value
    });
  }
  
  return data;
}

// Helper function to generate gold data
function generateGoldData(points, interval) {
  const data = [];
  let value = 100 + Math.random() * 10;
  
  for (let i = 0; i < points; i++) {
    // Gold tends to be less volatile but with occasional jumps
    const change = (Math.random() - 0.45) * 1.2; // Slight upward bias
    value = Math.max(90, value + change);
    
    // Add some volatility spikes
    if (Math.random() > 0.97) {
      value = value * (1 + (Math.random() * 0.04 - 0.02));
    }
    
    let date;
    if (interval === 'day') {
      date = `Day ${i + 1}`;
    } else if (interval === 'week') {
      date = `Week ${Math.floor(i / 7) + 1}`;
    } else {
      date = `Month ${i + 1}`;
    }
    
    data.push({
      date,
      value
    });
  }
  
  return data;
}

// Helper function to generate oil data
function generateOilData(points, interval) {
  const data = [];
  let value = 100 + Math.random() * 15;
  
  for (let i = 0; i < points; i++) {
    // Oil tends to be more volatile
    const change = (Math.random() - 0.5) * 3;
    value = Math.max(70, value + change);
    
    // Add some volatility spikes
    if (Math.random() > 0.93) {
      value = value * (1 + (Math.random() * 0.08 - 0.04));
    }
    
    let date;
    if (interval === 'day') {
      date = `Day ${i + 1}`;
    } else if (interval === 'week') {
      date = `Week ${Math.floor(i / 7) + 1}`;
    } else {
      date = `Month ${i + 1}`;
    }
    
    data.push({
      date,
      value
    });
  }
  
  return data;
}

// Helper function to generate private asset data
function generatePrivateData(points, interval) {
  const data = [];
  let value = 100 + Math.random() * 5;
  
  for (let i = 0; i < points; i++) {
    // Private assets tend to be much less volatile but with steady growth
    const change = (Math.random() - 0.3) * 0.8; // Strong upward bias
    value = Math.max(95, value + change);
    
    // Occasionally revalue (up or down)
    if (Math.random() > 0.95) {
      value = value * (1 + (Math.random() * 0.06 - 0.02)); // Upward bias in revaluations
    }
    
    let date;
    if (interval === 'day') {
      date = `Day ${i + 1}`;
    } else if (interval === 'week') {
      date = `Week ${Math.floor(i / 7) + 1}`;
    } else {
      date = `Month ${i + 1}`;
    }
    
    data.push({
      date,
      value
    });
  }
  
  return data;
}

// Helper function to generate comparison data
function generateComparisonData(assetType, timeframe) {
  const pointCount = timeframe === '1M' ? 30 : 
                     timeframe === '3M' ? 12 : 
                     timeframe === '6M' ? 24 : 12;
  
  const data = [];
  let assetValue = 100;
  let spValue = 100;
  let msciValue = 100;
  
  const assetTitle = 
    assetType === 'stocks' ? 'US & EU Stocks' : 
    assetType === 'gold' ? 'Gold & Precious Metals' : 
    assetType === 'oil' ? 'Oil & Commodities' : 'Private Assets';
  
  for (let i = 0; i < pointCount; i++) {
    // Different volatility and trend for each asset type
    let assetChange;
    if (assetType === 'stocks') {
      assetChange = (Math.random() - 0.47) * 2.2;
    } else if (assetType === 'gold') {
      assetChange = (Math.random() - 0.45) * 1.5;
    } else if (assetType === 'oil') {
      assetChange = (Math.random() - 0.52) * 3;
    } else {
      assetChange = (Math.random() - 0.35) * 0.9;
    }
    
    const spChange = (Math.random() - 0.48) * 2;
    const msciChange = (Math.random() - 0.49) * 1.8;
    
    assetValue = Math.max(80, assetValue + assetChange);
    spValue = Math.max(80, spValue + spChange);
    msciValue = Math.max(80, msciValue + msciChange);
    
    let date;
    if (timeframe === '1M') {
      date = `D${i + 1}`;
    } else if (timeframe === '3M') {
      date = `W${i + 1}`;
    } else if (timeframe === '6M') {
      date = `W${i + 1}`;
    } else {
      date = `M${i + 1}`;
    }
    
    const dataPoint = { date };
    dataPoint[assetTitle] = assetValue;
    dataPoint['S&P 500'] = spValue;
    dataPoint['MSCI World'] = msciValue;
    
    data.push(dataPoint);
  }
  
  return data;
}

// Helper function to generate volume data
function generateVolumeData(assetType, timeframe) {
  const pointCount = timeframe === '1M' ? 20 : 
                     timeframe === '3M' ? 12 : 
                     timeframe === '6M' ? 24 : 12;
  
  const data = [];
  
  // Base volume depends on asset type
  const baseVolume = 
    assetType === 'stocks' ? 3000000 : 
    assetType === 'gold' ? 800000 : 
    assetType === 'oil' ? 1200000 : 100000;
  
  for (let i = 0; i < pointCount; i++) {
    // Random volume with some spikes
    let volume = baseVolume + (Math.random() - 0.5) * baseVolume * 0.5;
    
    // Occasional volume spikes
    if (Math.random() > 0.85) {
      volume = volume * (1 + Math.random());
    }
    
    let date;
    if (timeframe === '1M') {
      date = `D${i + 1}`;
    } else if (timeframe === '3M') {
      date = `W${i + 1}`;
    } else if (timeframe === '6M') {
      date = `W${i + 1}`;
    } else {
      date = `M${i + 1}`;
    }
    
    data.push({
      date,
      volume: Math.round(volume)
    });
  }
  
  return data;
}

export default AssetPerformanceChart;