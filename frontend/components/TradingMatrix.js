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

  // Convert candle data to chart format
  const processChartCandleData = (data) => {
    if (!Array.isArray(data) || !data.length) return [];
    
    // Map to the chart format, converting timestamps
    return data.map(candle => {
      // Candle format is [timestamp, open, high, low, close, volume]
      return {
        date: new Date(candle[0]).toISOString().split('T')[0],
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
        volume: candle[5] || 0
      };
    });
  };

  // Process JSON format market data
  const processMarketData = (data) => {
    if (!Array.isArray(data) || !data.length) return [];
    
    return data.map(item => {
      return {
        date: new Date(item.timestamp).toISOString().split('T')[0],
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume || 0
      };
    });
  };

  // Generate chart data if no historical data available
  const generateFallbackChartData = useCallback((basePrice, days = 30) => {
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

  // Fetch market data from the data fetcher
  const fetchMarketData = useCallback(async () => {
    setIsLoading(true);
    setRefreshing(true);
    
    try {
      // We'll first try to load market_summary.json or exchange_rate_matrix.json
      // which should have been generated by the market data fetcher
      let exchangeRateResponse = await fetch('/chart-data/market_summary.json');
      
      if (!exchangeRateResponse.ok) {
        // Try exchange rate matrix as fallback
        exchangeRateResponse = await fetch('/chart-data/exchange_rate_data.json');
      }

      // Process the market data
      const marketAssets = [];
      
      if (exchangeRateResponse.ok) {
        const marketData = await exchangeRateResponse.json();
        
        // Check if we have the market_summary format or exchange_rate_matrix format
        if (marketData.indices || marketData.forex || marketData.crypto) {
          // Process market_summary.json format
          for (const category of ['indices', 'forex', 'crypto', 'commodities']) {
            if (marketData[category] && Array.isArray(marketData[category])) {
              marketData[category].forEach(asset => {
                marketAssets.push({
                  symbol: asset.symbol,
                  name: asset.name || asset.symbol,
                  price: asset.price,
                  change: asset.change.toFixed(2),
                  isUp: asset.direction === 'up' || asset.change >= 0,
                  category
                });
              });
            }
          }
        } else if (Array.isArray(marketData)) {
          // Process exchange_rate_matrix.json format
          // Exchange matrix contains rows of base currency to all other currencies
          const usdRow = marketData.find(row => row.base_currency === 'USD');
          
          if (usdRow) {
            // Create forex pairs (USD to major currencies)
            for (const currency of ['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF']) {
              if (usdRow[currency]) {
                const rate = parseFloat(usdRow[currency]);
                // Generate random change for demo
                const change = (Math.random() * 1.5 - 0.75).toFixed(2);
                marketAssets.push({
                  symbol: `USD/${currency}`,
                  name: `US Dollar / ${currency}`,
                  price: rate.toFixed(4),
                  change,
                  isUp: parseFloat(change) >= 0,
                  category: 'forex'
                });
              }
            }
            
            // Create crypto pairs (major cryptos to USD)
            for (const crypto of ['BTC', 'ETH', 'XRP', 'LTC']) {
              if (usdRow[crypto]) {
                const rate = parseFloat(usdRow[crypto]);
                const change = (Math.random() * 5 - 1).toFixed(2); // More volatility for crypto
                marketAssets.push({
                  symbol: `${crypto}/USD`,
                  name: `${crypto} / US Dollar`,
                  price: rate.toFixed(2),
                  change,
                  isUp: parseFloat(change) >= 0,
                  category: 'crypto'
                });
              }
            }
            
            // Add metals as commodities
            for (const metal of ['XAU', 'XAG']) {
              if (usdRow[metal]) {
                const rate = parseFloat(usdRow[metal]);
                const change = (Math.random() * 2 - 0.5).toFixed(2);
                marketAssets.push({
                  symbol: `${metal}/USD`,
                  name: `${metal === 'XAU' ? 'Gold' : 'Silver'} / US Dollar`,
                  price: rate.toFixed(2),
                  change,
                  isUp: parseFloat(change) >= 0,
                  category: 'commodities'
                });
              }
            }
          }
        }
      }
      
      // If we didn't get enough assets, add fallback stock data
      if (marketAssets.length < 5) {
        // Add some stocks and indices
        marketAssets.push(
          { 
            symbol: 'AAPL', 
            name: 'Apple Inc.', 
            price: '173.45', 
            change: '-0.75', 
            isUp: false, 
            category: 'stocks'
          },
          { 
            symbol: 'MSFT', 
            name: 'Microsoft Corp', 
            price: '412.65', 
            change: '0.45', 
            isUp: true, 
            category: 'stocks'
          },
          { 
            symbol: 'TSLA', 
            name: 'Tesla Inc', 
            price: '239.45', 
            change: (Math.random() * 4 - 2).toFixed(2), 
            isUp: Math.random() > 0.5, 
            category: 'stocks'
          },
          { 
            symbol: 'SPX', 
            name: 'S&P 500', 
            price: '4,532.12', 
            change: '0.45', 
            isUp: true, 
            category: 'indices'
          },
          { 
            symbol: 'NDX', 
            name: 'Nasdaq 100', 
            price: '15,678.32', 
            change: (Math.random() * 2.2 - 1.1).toFixed(2), 
            isUp: Math.random() > 0.5, 
            category: 'indices'
          }
        );
      }
      
      // Load chart data for first asset if any exist
      if (marketAssets.length > 0) {
        await loadChartDataForAsset(marketAssets[0]);
        setSelectedAsset(marketAssets[0]);
      }
      
      setAssets(marketAssets);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error fetching market data:', error);
      
      // Fallback to static data in case of API failure
      const fallbackData = [
        { 
          symbol: 'EUR/USD', 
          name: 'Euro/US Dollar', 
          price: '1.0876', 
          change: '0.25', 
          isUp: true,
          category: 'forex'
        },
        { 
          symbol: 'BTC/USD', 
          name: 'Bitcoin/US Dollar', 
          price: '26745.32', 
          change: '1.20', 
          isUp: true,
          category: 'crypto'
        },
        { 
          symbol: 'AAPL', 
          name: 'Apple Inc.', 
          price: '173.45', 
          change: '-0.75', 
          isUp: false,
          category: 'stocks'
        },
        { 
          symbol: 'SPX', 
          name: 'S&P 500', 
          price: '4,532.12', 
          change: '0.45', 
          isUp: true,
          category: 'indices'
        },
        { 
          symbol: 'XAU/USD', 
          name: 'Gold/US Dollar', 
          price: '1,856.45', 
          change: '-0.32', 
          isUp: false,
          category: 'commodities'
        }
      ];
      
      setAssets(fallbackData);
      
      if (fallbackData.length > 0) {
        const chartData = generateFallbackChartData(parseFloat(fallbackData[0].price));
        setChartData(chartData);
        setSelectedAsset(fallbackData[0]);
      }
      
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [generateFallbackChartData]);

  // Load chart data for a specific asset
  const loadChartDataForAsset = async (asset) => {
    try {
      let symbol = asset.symbol;
      
      // Clean up symbol format for file name
      if (symbol.includes('/')) {
        const [base, quote] = symbol.split('/');
        symbol = base + quote;
      }
      
      // First try to get candle data (better for charts)
      let response = await fetch(`/chart-data/${symbol}_1d_candles.json`);
      
      if (response.ok) {
        const candleData = await response.json();
        const processedData = processChartCandleData(candleData);
        
        // Sort by date and use the last 30 days
        const sortedData = processedData
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(-30);
          
        setChartData(sortedData);
        return;
      }
      
      // Try regular JSON format
      response = await fetch(`/chart-data/${symbol}_1d.json`);
      
      if (response.ok) {
        const jsonData = await response.json();
        const processedData = processMarketData(jsonData);
        
        // Sort by date and use the last 30 days
        const sortedData = processedData
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(-30);
          
        setChartData(sortedData);
        return;
      }
      
      // If nothing worked, generate fallback data
      const basePrice = parseFloat(asset.price.replace(/[^0-9.]/g, ''));
      const fallbackData = generateFallbackChartData(isNaN(basePrice) ? 100 : basePrice);
      setChartData(fallbackData);
      
    } catch (error) {
      console.error(`Error loading chart data for ${asset.symbol}:`, error);
      
      // Generate fallback data
      const basePrice = parseFloat(asset.price.replace(/[^0-9.]/g, ''));
      const fallbackData = generateFallbackChartData(isNaN(basePrice) ? 100 : basePrice);
      setChartData(fallbackData);
    }
  };

  // Handle asset selection for chart view
  const handleAssetSelect = useCallback(async (asset) => {
    setSelectedAsset(asset);
    await loadChartDataForAsset(asset);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchMarketData();
    
    // Set interval to update data every 60 seconds
    const interval = setInterval(() => {
      fetchMarketData();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [fetchMarketData]);

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
            onClick={fetchMarketData}
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
                colorScheme={selectedAsset.isUp ? "green" : "red"}
                variant="solid"
                borderRadius="full"
                px={2}
                py={1}
              >
                <Flex align="center">
                  <Icon 
                    as={selectedAsset.isUp ? ArrowUpIcon : ArrowDownIcon} 
                    mr={1} 
                    fontSize="xs"
                  />
                  {formatPriceChange(selectedAsset.change)}
                </Flex>
              </Badge>
            </HStack>
            <Text fontWeight="bold" fontSize={symbolSize}>
              {selectedAsset.price}
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
                    colorScheme={asset.isUp ? "green" : "red"}
                    variant="solid"
                    borderRadius="full"
                    px={2}
                    py={0.5}
                    fontSize="xs"
                  >
                    <Flex align="center">
                      <Icon 
                        as={asset.isUp ? ArrowUpIcon : ArrowDownIcon} 
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
                    {asset.price}
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