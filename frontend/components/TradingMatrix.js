import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  useColorModeValue,
  Text,
  Grid,
  Flex,
  Badge,
  VStack,
  HStack,
  Icon,
  useBreakpointValue,
  Heading,
  Tooltip,
  Button,
  Select,
  Spinner,
  SimpleGrid,
  Skeleton
} from '@chakra-ui/react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  Bar,
  CartesianGrid
} from 'recharts';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  RepeatIcon, 
  ChevronDownIcon
} from '@chakra-ui/icons';

// Fixed candlestick renderer component
function CustomCandlestickBar(props) {
  const { x, y, width, height, payload } = props;
  
  if (!payload || !height) return null;
  
  const { open, high, low, close } = payload;
  
  // Colors from TradingView
  const bullishColor = '#26a69a'; // Green for up candles
  const bearishColor = '#ef5350'; // Red for down candles
  const color = close >= open ? bullishColor : bearishColor;
  
  // Calculate positions
  const candleWidth = Math.max(width * 0.6, 2);
  const wickWidth = 1;
  
  // Calculate the vertical positions
  const range = high - low;
  if (range === 0) return null;
  
  const openY = y + height - ((open - low) / range * height);
  const closeY = y + height - ((close - low) / range * height);
  const highY = y + height - ((high - low) / range * height);
  const lowY = y + height;
  
  return (
    <g>
      {/* Wick */}
      <line
        x1={x + width / 2}
        y1={highY}
        x2={x + width / 2}
        y2={lowY}
        stroke={color}
        strokeWidth={wickWidth}
      />
      
      {/* Body */}
      <rect
        x={x + (width - candleWidth) / 2}
        y={Math.min(openY, closeY)}
        width={candleWidth}
        height={Math.max(Math.abs(closeY - openY), 1)}
        fill={color}
      />
    </g>
  );
}

const TradingMatrix = () => {
  // States
  const [assets, setAssets] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false });
  const gridGap = useBreakpointValue({ base: 2, md: 4 });
  const boxPadding = useBreakpointValue({ base: 3, md: 4 });
  const textSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const symbolSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const headingSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const chartHeight = useBreakpointValue({ base: 200, md: 300 });

  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const cardHoverBg = useColorModeValue('gray.100', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const subtleTextColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const positiveColor = useColorModeValue('green.500', 'green.300');
  const negativeColor = useColorModeValue('red.500', 'red.300');

  // Create categories list
  const categories = [
    { value: 'all', label: 'All Assets' },
    { value: 'forex', label: 'Forex' },
    { value: 'crypto', label: 'Crypto' },
    { value: 'stocks', label: 'Stocks' },
    { value: 'indices', label: 'Indices' },
    { value: 'commodities', label: 'Commodities' }
  ];

  // Format price change to appropriate string with + or - sign
  const formatPriceChange = (change) => {
    const numValue = parseFloat(change);
    const sign = numValue >= 0 ? '+' : '';
    return `${sign}${numValue.toFixed(2)}%`;
  };

  // Format price with thousands separator and decimal places
  const formatPrice = (price, decimals = 2) => {
    if (!price) return '';
    const numValue = parseFloat(price);
    return new Intl.NumberFormat('en-US', { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals 
    }).format(numValue);
  };

  // Generate historical price data for charts
  const generateChartData = useCallback((basePrice, days = 30) => {
    const data = [];
    const now = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(now.getDate() - (days - i));
      
      // Create some volatility
      const volatility = 0.02;
      const changePercent = 2 * volatility * Math.random() - volatility;
      
      const dayOpen = i === 0 ? basePrice : data[i-1].close;
      const dayClose = dayOpen * (1 + changePercent);
      const dayHigh = Math.max(dayOpen, dayClose) * (1 + Math.random() * 0.01);
      const dayLow = Math.min(dayOpen, dayClose) * (1 - Math.random() * 0.01);
      
      data.push({
        date: date.toISOString().split('T')[0],
        open: dayOpen,
        high: dayHigh,
        low: dayLow,
        close: dayClose
      });
    }
    
    return data;
  }, []);

  // Live data fetching from CurrencyFreaks API
  const fetchLiveData = useCallback(async () => {
    setIsLoading(true);
    setRefreshing(true);
    
    try {
      // Use CurrencyFreaks API with your API key
      const currencyFreaksAPIKey = process.env.NEXT_PUBLIC_CURRENCYFREAKS_KEY || 'demo';
      const currencyFreaksURL = process.env.NEXT_PUBLIC_CURRENCYFREAKS_URL || 'https://api.currencyfreaks.com';
      
      // Currencies to fetch
      const symbols = [
        'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', // Forex
        'BTC', 'ETH', 'XRP', 'LTC', 'ADA', 'DOT', // Crypto
        'XAU', 'XAG' // Metals
      ].join(',');
      
      const response = await fetch(
        `${currencyFreaksURL}/latest?apikey=${currencyFreaksAPIKey}&symbols=${symbols}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch currency data');
      }
      
      const data = await response.json();
      
      if (!data.rates) {
        throw new Error('Invalid response format');
      }
      
      // Process the rates
      const liveAssets = [];
      
      // Helper function to calculate change (randomly for demo)
      const getRandomChange = () => (Math.random() * 2 - 0.5).toFixed(2);
      
      // Process Forex rates
      const forexRates = [
        { symbol: 'EUR/USD', name: 'Euro/US Dollar', rate: 1 / parseFloat(data.rates.EUR), category: 'forex' },
        { symbol: 'GBP/USD', name: 'British Pound/US Dollar', rate: 1 / parseFloat(data.rates.GBP), category: 'forex' },
        { symbol: 'USD/JPY', name: 'US Dollar/Japanese Yen', rate: parseFloat(data.rates.JPY), category: 'forex' },
        { symbol: 'USD/CAD', name: 'US Dollar/Canadian Dollar', rate: parseFloat(data.rates.CAD), category: 'forex' },
        { symbol: 'AUD/USD', name: 'Australian Dollar/US Dollar', rate: 1 / parseFloat(data.rates.AUD), category: 'forex' }
      ];
      
      forexRates.forEach(item => {
        liveAssets.push({
          symbol: item.symbol,
          name: item.name,
          price: item.rate.toFixed(4),
          change: getRandomChange(),
          category: item.category,
          volume: Math.floor(Math.random() * 1000000) + 500000
        });
      });
      
      // Process Crypto rates
      if (data.rates.BTC) {
        liveAssets.push({
          symbol: 'BTC/USD',
          name: 'Bitcoin/US Dollar',
          price: (1 / parseFloat(data.rates.BTC)).toFixed(2),
          change: getRandomChange(),
          category: 'crypto',
          volume: Math.floor(Math.random() * 2000000) + 1000000
        });
      }
      
      if (data.rates.ETH) {
        liveAssets.push({
          symbol: 'ETH/USD',
          name: 'Ethereum/US Dollar',
          price: (1 / parseFloat(data.rates.ETH)).toFixed(2),
          change: getRandomChange(),
          category: 'crypto',
          volume: Math.floor(Math.random() * 1500000) + 800000
        });
      }
      
      // Process Metal rates
      if (data.rates.XAU) {
        liveAssets.push({
          symbol: 'XAU/USD',
          name: 'Gold/US Dollar',
          price: (1 / parseFloat(data.rates.XAU)).toFixed(2),
          change: getRandomChange(),
          category: 'commodities',
          volume: Math.floor(Math.random() * 800000) + 400000
        });
      }
      
      if (data.rates.XAG) {
        liveAssets.push({
          symbol: 'XAG/USD',
          name: 'Silver/US Dollar',
          price: (1 / parseFloat(data.rates.XAG)).toFixed(2),
          change: getRandomChange(),
          category: 'commodities',
          volume: Math.floor(Math.random() * 600000) + 300000
        });
      }
      
      // Additional assets to ensure a comprehensive dashboard
      const additionalAssets = [
        { 
          symbol: 'AAPL', 
          name: 'Apple Inc.', 
          price: '173.45', 
          change: '-0.75', 
          category: 'stocks',
          volume: 12456789
        },
        { 
          symbol: 'MSFT', 
          name: 'Microsoft Corp', 
          price: '412.65', 
          change: '0.45', 
          category: 'stocks',
          volume: 8456789
        },
        { 
          symbol: 'TSLA', 
          name: 'Tesla Inc', 
          price: '239.45', 
          change: (Math.random() * 4 - 2).toFixed(2), 
          category: 'stocks',
          volume: 6782345
        },
        { 
          symbol: 'SPX', 
          name: 'S&P 500', 
          price: '4,532.12', 
          change: '0.45', 
          category: 'indices',
          volume: 2345678
        },
        { 
          symbol: 'NDX', 
          name: 'Nasdaq 100', 
          price: '15,678.32', 
          change: (Math.random() * 2.2 - 1.1).toFixed(2), 
          category: 'indices',
          volume: 1876543
        }
      ];
      
      // Combine all assets
      const allAssets = [...liveAssets, ...additionalAssets];
      
      // Generate chart data for the first asset
      if (allAssets.length > 0) {
        const chartData = generateChartData(parseFloat(allAssets[0].price));
        setChartData(chartData);
        setSelectedAsset(allAssets[0]);
      }
      
      setAssets(allAssets);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error fetching data:', error);
      
      // Fallback to static data in case of API failure
      const fallbackData = [
        { 
          symbol: 'EUR/USD', 
          name: 'Euro/US Dollar', 
          price: '1.0876', 
          change: '0.25', 
          category: 'forex',
          volume: 7254360
        },
        { 
          symbol: 'BTC/USD', 
          name: 'Bitcoin/US Dollar', 
          price: '26745.32', 
          change: '1.20', 
          category: 'crypto',
          volume: 15689432
        },
        { 
          symbol: 'AAPL', 
          name: 'Apple Inc.', 
          price: '173.45', 
          change: '-0.75', 
          category: 'stocks',
          volume: 12456789
        },
        { 
          symbol: 'SPX', 
          name: 'S&P 500', 
          price: '4,532.12', 
          change: '0.45', 
          category: 'indices',
          volume: 2345678
        },
        { 
          symbol: 'XAU/USD', 
          name: 'Gold/US Dollar', 
          price: '1,856.45', 
          change: '-0.32', 
          category: 'commodities',
          volume: 789456
        }
      ];
      
      setAssets(fallbackData);
      
      if (fallbackData.length > 0) {
        const chartData = generateChartData(parseFloat(fallbackData[0].price));
        setChartData(chartData);
        setSelectedAsset(fallbackData[0]);
      }
      
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [generateChartData]);

  // Handle asset selection for chart view
  const handleAssetSelect = useCallback((asset) => {
    setSelectedAsset(asset);
    // Generate new chart data for the selected asset
    const newChartData = generateChartData(parseFloat(asset.price));
    setChartData(newChartData);
  }, [generateChartData]);

  // Initial fetch
  useEffect(() => {
    fetchLiveData();
    
    // Set interval to update data every 60 seconds
    const interval = setInterval(() => {
      fetchLiveData();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [fetchLiveData]);

  // Filter assets by category
  const filteredAssets = useMemo(() => {
    return selectedCategory === 'all' 
      ? assets 
      : assets.filter(asset => asset.category === selectedCategory);
  }, [assets, selectedCategory]);

  // Format time for last updated
  const formatLastUpdated = (date) => {
    if (!date) return '';
    
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <Box
      w="full"
      maxW={{ base: "100%", md: "4xl" }}
      bg={bgColor}
      borderRadius="xl"
      boxShadow="xl"
      overflow="hidden"
      borderWidth="1px"
      borderColor={borderColor}
    >
      {/* Header */}
      <Flex 
        justify="space-between" 
        align="center" 
        p={boxPadding} 
        borderBottomWidth="1px" 
        borderColor={borderColor}
        flexWrap="wrap"
        gap={2}
        bg={useColorModeValue('gray.50', 'gray.700')}
      >
        <HStack>
          <Heading size={headingSize} color={textColor}>
            Live Markets
          </Heading>
          <Tooltip label="Real-time market data for various assets">
            <Box display="inline-block" ml={2}>
              <Icon as={ChevronDownIcon} color={subtleTextColor} />
            </Box>
          </Tooltip>
        </HStack>
        
        <HStack spacing={2}>
          <Select
            size="sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            width={{ base: "120px", md: "auto" }}
            borderRadius="md"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </Select>
          
          <Button
            size="sm"
            leftIcon={refreshing ? <Spinner size="xs" /> : <RepeatIcon />}
            onClick={fetchLiveData}
            isLoading={isLoading}
            variant="outline"
            colorScheme="blue"
          >
            {isMobile ? "" : "Refresh"}
          </Button>
        </HStack>
      </Flex>
      
      {/* Chart Section */}
      {selectedAsset && (
        <Box p={boxPadding} borderBottomWidth="1px" borderColor={borderColor}>
          <Flex justify="space-between" align="center" mb={2}>
            <HStack>
              <Text fontWeight="bold" fontSize={symbolSize}>
                {selectedAsset.symbol}
              </Text>
              <Badge 
                colorScheme={parseFloat(selectedAsset.change) >= 0 ? "green" : "red"}
                variant="solid"
                borderRadius="full"
                px={2}
                py={1}
              >
                <Flex align="center">
                  <Icon 
                    as={parseFloat(selectedAsset.change) >= 0 ? ArrowUpIcon : ArrowDownIcon} 
                    mr={1} 
                    fontSize="xs"
                  />
                  {formatPriceChange(selectedAsset.change)}
                </Flex>
              </Badge>
            </HStack>
            <Text fontWeight="bold" fontSize={symbolSize}>
              {formatPrice(selectedAsset.price, selectedAsset.category === 'forex' ? 4 : 2)}
            </Text>
          </Flex>
          
          {isLoading ? (
            <Skeleton height={chartHeight} />
          ) : (
            <Box height={chartHeight} width="full" bg={cardBg} borderRadius="md" p={2}>
              <ResponsiveContainer>
                <ComposedChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(date) => date.split('-')[2]} // Just show day
                  />
                  <YAxis 
                    domain={['dataMin', 'dataMax']}
                    tickFormatter={(value) => value.toFixed(2)}
                    tick={{ fontSize: 10 }}
                  />
                  <RechartsTooltip
                    labelFormatter={(label) => `Date: ${label}`}
                    formatter={(value, name) => [value.toFixed(4), name.charAt(0).toUpperCase() + name.slice(1)]}
                  />
                  <Bar
                    dataKey="high"
                    fill="transparent"
                    isAnimationActive={false}
                    shape={<CustomCandlestickBar />}
                    barSize={10}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Box>
      )}
      
      {/* Asset Grid */}
      <Box p={boxPadding}>
        {isLoading ? (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={gridGap}>
            {[...Array(8)].map((_, index) => (
              <Skeleton key={index} height="80px" borderRadius="md" />
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={gridGap}>
            {filteredAssets.map((asset) => (
              <Box
                key={asset.symbol}
                p={3}
                borderRadius="md"
                bg={asset.symbol === selectedAsset?.symbol ? useColorModeValue('blue.50', 'blue.900') : cardBg}
                _hover={{ bg: cardHoverBg, transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                cursor="pointer"
                onClick={() => handleAssetSelect(asset)}
                borderWidth="1px"
                borderColor={asset.symbol === selectedAsset?.symbol ? 'blue.200' : borderColor}
                boxShadow="sm"
              >
                <Flex justify="space-between" align="center" mb={1}>
                  <Text fontWeight="bold" fontSize={textSize}>{asset.symbol}</Text>
                  <Badge 
                    colorScheme={parseFloat(asset.change) >= 0 ? "green" : "red"}
                    variant="solid"
                    borderRadius="full"
                    px={2}
                    py={0.5}
                    fontSize="xs"
                  >
                    <Flex align="center">
                      <Icon 
                        as={parseFloat(asset.change) >= 0 ? ArrowUpIcon : ArrowDownIcon} 
                        mr={1} 
                        fontSize="xx-small"
                      />
                      {formatPriceChange(asset.change)}
                    </Flex>
                  </Badge>
                </Flex>
                
                <Text fontSize="xs" color={subtleTextColor} mb={1} isTruncated>
                  {asset.name}
                </Text>
                
                <Flex justify="space-between" align="center">
                  <Text fontWeight="semibold" fontSize={textSize} color={textColor}>
                    {formatPrice(asset.price, asset.category === 'forex' ? 4 : 2)}
                  </Text>
                  <Badge 
                    size="sm" 
                    colorScheme="blue" 
                    fontSize="xs"
                    variant="outline"
                    textTransform="capitalize"
                  >
                    {asset.category}
                  </Badge>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        )}
        
        {/* Last updated timestamp */}
        <Flex justify="flex-end" mt={4}>
          <Text fontSize="xs" color={subtleTextColor}>
            Last updated: {formatLastUpdated(lastUpdated)}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default TradingMatrix;