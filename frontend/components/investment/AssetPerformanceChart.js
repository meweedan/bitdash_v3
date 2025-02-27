import React, { useState, useEffect } from 'react';
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
  Spinner,
  Alert,
  AlertIcon,
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
  const [performanceData, setPerformanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Background and text colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Asset categories to symbols mapping
  const assetSymbols = {
    stocks: ["SPY", "QQQ", "DIA", "IWM", "VTI"],
    gold: ["GLD", "XAU", "XAG", "SLV", "IAU"],
    oil: ["USO", "CL", "BZ", "OIL", "XLE"],
    private: ["VOW.DE", "SIE.DE", "MC.PA", "SAP.DE", "TSLA"]
  };

  // Timeframe mapping
  const timeframeDays = {
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // Try to fetch from public/chart-data/asset_performance.json first
        let response = await fetch('/chart-data/asset_performance.json');
        
        // If specific file doesn't exist, try to get data from symbol-specific file
        if (!response.ok) {
          // Get primary symbol for current asset type
          const symbol = assetSymbols[assetType][0];
          const interval = '1d'; // Daily data
          
          response = await fetch(`/chart-data/${symbol}_${interval}.json`);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch data for ${symbol}`);
          }
          
          const symbolData = await response.json();
          
          // Process the data for the chart
          const processedData = processSymbolData(symbolData, timeframe);
          setPerformanceData({
            [assetType]: {
              [timeframe]: processedData,
              // Add other standard data
              comparison: generateComparisonData(assetType, timeframe),
              volume: processVolumeData(symbolData, timeframe)
            }
          });
        } else {
          // Use the pre-processed asset_performance.json
          const data = await response.json();
          setPerformanceData(data);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching performance data:", err);
        setError(err.message);
        setIsLoading(false);
        
        // Fallback to generated data
        setPerformanceData({
          [assetType]: {
            [timeframe]: generateFallbackData(assetType, timeframe),
            comparison: generateComparisonData(assetType, timeframe),
            volume: generateVolumeData(assetType, timeframe)
          }
        });
      }
    }
    
    fetchData();
  }, [assetType, timeframe]);
  
  // Process market data from symbol data
  function processSymbolData(data, timeframe) {
    if (!Array.isArray(data)) return [];
    
    // Sort by timestamp
    const sortedData = [...data].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    // Get the last N days based on timeframe
    const days = timeframeDays[timeframe];
    const filteredData = sortedData.slice(-days);
    
    // Normalize to start at 100
    const initialValue = filteredData.length > 0 ? filteredData[0].close : 100;
    
    return filteredData.map((item, index) => {
      const date = new Date(item.timestamp);
      let dateLabel;
      
      if (timeframe === '1M') {
        dateLabel = `D${date.getDate()}`;
      } else if (timeframe === '3M' || timeframe === '6M') {
        // Get week number
        const weekNumber = Math.floor(index / 7) + 1;
        dateLabel = `W${weekNumber}`;
      } else {
        // Month for yearly view
        dateLabel = date.toLocaleString('default', { month: 'short' });
      }
      
      return {
        date: dateLabel,
        value: (item.close / initialValue) * 100
      };
    });
  }
  
  // Process volume data from symbol data
  function processVolumeData(data, timeframe) {
    if (!Array.isArray(data)) return [];
    
    // Sort by timestamp
    const sortedData = [...data].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    // Get the last N days based on timeframe
    const days = timeframeDays[timeframe];
    const filteredData = sortedData.slice(-days);
    
    return filteredData.map((item) => {
      const date = new Date(item.timestamp);
      let dateLabel;
      
      if (timeframe === '1M') {
        dateLabel = `D${date.getDate()}`;
      } else if (timeframe === '3M' || timeframe === '6M') {
        // Use week number
        const weekNum = Math.ceil((date.getDate() + 6 - date.getDay()) / 7);
        dateLabel = `W${weekNum}`;
      } else {
        // Month for yearly view
        dateLabel = date.toLocaleString('default', { month: 'short' });
      }
      
      return {
        date: dateLabel,
        volume: item.volume || 0
      };
    });
  }
  
  // Fallback functions if no data is available
  function generateFallbackData(assetType, timeframe) {
    const data = [];
    const points = timeframe === '1M' ? 30 : 
                  timeframe === '3M' ? 90 : 
                  timeframe === '6M' ? 180 : 12;
    
    let value = 100;
    for (let i = 0; i < points; i++) {
      // Different trends for different asset categories
      let change;
      if (assetType === 'stocks') {
        change = (Math.random() - 0.47) * 2;
      } else if (assetType === 'gold') {
        change = (Math.random() - 0.45) * 1.5;
      } else if (assetType === 'oil') {
        change = (Math.random() - 0.52) * 3;
      } else {  // private assets
        change = (Math.random() - 0.35) * 0.9;
      }
      
      value = Math.max(80, value + change);
      
      let date;
      if (timeframe === '1M') {
        date = `D${i+1}`;
      } else if (timeframe === '3M' || timeframe === '6M') {
        date = `W${Math.floor(i/7) + 1}`;
      } else {
        date = `M${i+1}`;
      }
      
      data.push({
        date,
        value
      });
    }
    
    return data;
  }
  
  function generateComparisonData(assetType, timeframe) {
    const points = timeframe === '1M' ? 30 : 
                  timeframe === '3M' ? 12 : 
                  timeframe === '6M' ? 24 : 12;
    
    const data = [];
    let assetValue = 100;
    let spValue = 100;
    let msciValue = 100;
    
    for (let i = 0; i < points; i++) {
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
        date = `D${i+1}`;
      } else if (timeframe === '3M' || timeframe === '6M') {
        date = `W${i+1}`;
      } else {
        date = `M${i+1}`;
      }
      
      data.push({
        date,
        assetValue,
        sp500: spValue,
        msciWorld: msciValue
      });
    }
    
    return data;
  }
  
  function generateVolumeData(assetType, timeframe) {
    const points = timeframe === '1M' ? 20 : 
                  timeframe === '3M' ? 12 : 
                  timeframe === '6M' ? 24 : 12;
    
    const data = [];
    
    // Base volume depends on asset type
    const baseVolume = 
      assetType === 'stocks' ? 3000000 : 
      assetType === 'gold' ? 800000 : 
      assetType === 'oil' ? 1200000 : 100000;
    
    for (let i = 0; i < points; i++) {
      // Random volume with some spikes
      let volume = baseVolume + (Math.random() - 0.5) * baseVolume * 0.5;
      
      // Occasional volume spikes
      if (Math.random() > 0.85) {
        volume = volume * (1 + Math.random());
      }
      
      let date;
      if (timeframe === '1M') {
        date = `D${i+1}`;
      } else if (timeframe === '3M' || timeframe === '6M') {
        date = `W${i+1}`;
      } else {
        date = `M${i+1}`;
      }
      
      data.push({
        date,
        volume: Math.round(volume)
      });
    }
    
    return data;
  }
  
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

  // If data is loading or not available
  if (isLoading) {
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
        textAlign="center"
        py={10}
      >
        <Spinner color="brand.bitinvest.500" size="xl" />
        <Text mt={4}>Loading market data...</Text>
      </Box>
    );
  }
  
  if (error) {
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
        <Alert status="error" variant="left-accent">
          <AlertIcon />
          Error loading market data: {error}
        </Alert>
      </Box>
    );
  }
  
  // Check if we have the necessary data
  if (!performanceData || !performanceData[assetType] || !performanceData[assetType][timeframe]) {
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
        <Alert status="warning" variant="left-accent">
          <AlertIcon />
          No data available for {assetTitles[assetType]} with timeframe {timeframe}
        </Alert>
      </Box>
    );
  }
  
  // Get current data
  const currentData = performanceData[assetType][timeframe];
  
  // Calculate performance metrics
  const initialValue = currentData.length > 0 ? currentData[0].value : 100;
  const currentValue = currentData.length > 0 ? currentData[currentData.length - 1].value : 100;
  const percentageChange = ((currentValue - initialValue) / initialValue * 100).toFixed(2);
  const isPositive = parseFloat(percentageChange) >= 0;

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
                  data={performanceData[assetType].comparison[timeframe]}
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
                    dataKey="assetValue"
                    name={assetTitles[assetType]}
                    stroke={colors.accent}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sp500"
                    name="S&P 500"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="msciWorld"
                    name="MSCI World"
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
                  data={performanceData[assetType].volume[timeframe]}
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

export default AssetPerformanceChart;