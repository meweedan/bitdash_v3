import React, { useState, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Select,
  Button,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ArrowUpDown } from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Candlestick,
  XAxis,
  YAxis,
  Tooltip,
  Bar
} from 'recharts';
import { useQuery } from '@tanstack/react-query';

// Currency Configuration
const AVAILABLE_CURRENCIES = {
  FIAT: ['USD', 'LYD', 'EGP', 'EUR', 'GBP', 'TND'],
  CRYPTO: ['BTC', 'ETH', 'USDT'],
  METALS: ['XAU', 'XAG']
};

// Utility Functions
const formatPrice = (price, currency) => {
  if (!price) return '-';
  return price.toLocaleString('en-US', {
    minimumFractionDigits: currency === 'BTC' ? 8 : 4,
    maximumFractionDigits: currency === 'BTC' ? 8 : 4
  });
};

const getTrendColor = (open, close) => 
  close >= open ? '#26a69a' : '#ef5350';

const AdvancedForexChart = () => {
  // State Management
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [quoteCurrency, setQuoteCurrency] = useState('LYD');
  const [timeframe, setTimeframe] = useState('1M');
  const [showVolume, setShowVolume] = useState(true);

  // Responsive Design
  const isMobile = useBreakpointValue({ base: true, md: false });
  const chartHeight = useBreakpointValue({ base: 300, md: 500 });

  // Currency List
  const allCurrencies = useMemo(() => [
    ...AVAILABLE_CURRENCIES.FIAT,
    ...AVAILABLE_CURRENCIES.CRYPTO,
    ...AVAILABLE_CURRENCIES.METALS
  ], []);

  // Fetch Historical Rates
  const { 
    data: historicalData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['historical-rates', baseCurrency, quoteCurrency, timeframe],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exchange-rates?/historical?base=${baseCurrency}&quote=${quoteCurrency}&days=${getDaysFromTimeframe(timeframe)}`;
      console.log('Fetching URL:', url);

      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch error details:', errorText);
        throw new Error(`Failed to fetch historical data: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Raw response:', result);
      
      return result.data || [];
    },
    refetchInterval: 60000
  });

  // Utility to convert timeframe to days
  const getDaysFromTimeframe = (tf) => {
    const timeframeDays = {
      '1D': 1,
      '1W': 7,
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365
    };
    return timeframeDays[tf] || 30;
  };

  // Currency Switch Handler
  const switchCurrencies = () => {
    const temp = baseCurrency;
    setBaseCurrency(quoteCurrency);
    setQuoteCurrency(temp);
  };

  // Prepare Chart Data
  const chartData = useMemo(() => {
  console.log('Raw historical data:', historicalData);
  
  // Check if historicalData exists and is an array
  if (!historicalData || !Array.isArray(historicalData)) {
    console.warn('Historical data is not an array:', historicalData);
    return [];
  }

  // Safely process the data
  return historicalData.map(item => {
    // Check if item and item.attributes exist
    if (!item || !item.attributes) {
      console.warn('Invalid data item:', item);
      return null;
    }

    return {
      date: item.attributes.timestamp 
        ? new Date(item.attributes.timestamp).toLocaleDateString() 
        : 'N/A',
      open: item.attributes.open_rate || item.attributes.rate || 0,
      high: item.attributes.high_rate || item.attributes.rate || 0,
      low: item.attributes.low_rate || item.attributes.rate || 0,
      close: item.attributes.rate || 0,
      volume: item.attributes.volume || 0,
      ma20: item.attributes.ma20 || null, 
      ma50: item.attributes.ma50 || null
    };
  }).filter(Boolean); // Remove any null entries
}, [historicalData]);

  // Color Theming
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const selectBg = useColorModeValue('gray.100', 'gray.700');

  // Render
  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error.message}
      </Alert>
    );
  }

  return (
    <Box 
      bg={bgColor} 
      color={textColor} 
      p={isMobile ? 2 : 6} 
      borderRadius="xl" 
      w="full"
      boxShadow="md"
    >
      {/* Currency & Timeframe Selection */}
      <VStack spacing={4} align="stretch">
        <HStack 
          spacing={isMobile ? 2 : 4} 
          flexDirection={isMobile ? 'column' : 'row'}
          w="full"
        >
          {/* Base Currency Selector */}
          <Select
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
            flex={1}
            size={isMobile ? 'sm' : 'md'}
            bg={selectBg}
            borderColor="transparent"
            _hover={{ borderColor: 'brand.bitcash.700' }}
          >
            {allCurrencies.map(currency => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </Select>

          {/* Switch Button */}
          <Button 
            onClick={switchCurrencies} 
            variant="bitcash-outline"
            size={isMobile ? 'sm' : 'md'}
            colorScheme="brand.bitcash.700"
          >
            <ArrowUpDown />
          </Button>

          {/* Quote Currency Selector */}
          <Select
            value={quoteCurrency}
            onChange={(e) => setQuoteCurrency(e.target.value)}
            flex={1}
            size={isMobile ? 'sm' : 'md'}
            bg={selectBg}
            borderColor="transparent"
            _hover={{ borderColor: 'brand.bitcash.700' }}
          >
            {allCurrencies.map(currency => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </Select>
        </HStack>

        {/* Timeframe Buttons */}
        <HStack 
          spacing={isMobile ? 1 : 2} 
          justify="center" 
          overflowX={isMobile ? 'auto' : 'visible'}
          maxW="full"
        >
          {['1D', '1W', '1M', '3M', '6M', '1Y'].map(tf => (
            <Button
              key={tf}
              onClick={() => setTimeframe(tf)}
              variant={timeframe === tf ? 'solid' : 'ghost'}
              size={isMobile ? 'xs' : 'sm'}
              colorScheme="brand.bitcash.700"
            >
              {tf}
            </Button>
          ))}
          <Button
            onClick={() => setShowVolume(!showVolume)}
            variant={showVolume ? 'solid' : 'outline'}
            size={isMobile ? 'xs' : 'sm'}
            colorScheme="green"
          >
            Volume
          </Button>
        </HStack>

        {/* Chart */}
        {isLoading ? (
          <Spinner />
        ) : (
          <Box h={`${chartHeight}px`} w="full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ 
                  top: 10, 
                  right: 10, 
                  left: 10, 
                  bottom: 10 
                }}
              >
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: isMobile ? 8 : 12 }}
                  stroke={textColor}
                />
                <YAxis 
                  yAxisId="price" 
                  domain={['auto', 'auto']} 
                  tick={{ fontSize: isMobile ? 8 : 12 }}
                  stroke={textColor}
                />
                {showVolume && (
                  <YAxis 
                    yAxisId="volume" 
                    orientation="right" 
                    domain={['auto', 'auto']} 
                    tick={{ fontSize: isMobile ? 8 : 12 }}
                    stroke={textColor}
                  />
                )}

                <Candlestick 
                  yAxisId="price"
                  dataKey="close"
                  fill={(data) => getTrendColor(data.open, data.close)}
                  stroke={(data) => getTrendColor(data.open, data.close)}
                />

                {showVolume && (
                  <Bar 
                    yAxisId="volume" 
                    dataKey="volume" 
                    fill="#82ca9d" 
                    opacity={0.3} 
                  />
                )}

                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: bgColor, 
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                  content={({ payload, label }) => {
                    if (!payload?.length) return null;
                    const data = payload[0].payload;
                    return (
                      <Box p={2} bg={bgColor} borderRadius="md">
                        <Text fontWeight="bold">{label}</Text>
                        <Text>Open: {formatPrice(data.open, quoteCurrency)}</Text>
                        <Text>High: {formatPrice(data.high, quoteCurrency)}</Text>
                        <Text>Low: {formatPrice(data.low, quoteCurrency)}</Text>
                        <Text>Close: {formatPrice(data.close, quoteCurrency)}</Text>
                        {showVolume && (
                          <Text>Volume: {data.volume.toLocaleString()}</Text>
                        )}
                      </Box>
                    );
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default AdvancedForexChart;