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
import { ArrowUpDown, LineChart, Candles } from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Candlestick,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend
} from 'recharts';
import { useQuery } from '@tanstack/react-query';

// Currency Configuration
const AVAILABLE_CURRENCIES = {
  FIAT: ['USD', 'LYD', 'EGP', 'EUR', 'GBP', 'TND'],
  CRYPTO: ['BTC', 'ETH', 'USDT'],
  METALS: ['XAU', 'XAG']
};

// Chart Types
const CHART_TYPES = {
  CANDLESTICK: 'candlestick',
  LINE: 'line'
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

const getAllCurrencies = () => [
  ...AVAILABLE_CURRENCIES.FIAT,
  ...AVAILABLE_CURRENCIES.CRYPTO,
  ...AVAILABLE_CURRENCIES.METALS
];

const fetchHistoricalRates = async ({ queryKey }) => {
  const [, baseCurrency, quoteCurrency, timeframe] = queryKey;
  
  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exchange-rates?/fetch-historical?base=${baseCurrency}&quote=${quoteCurrency}&days=${getDaysFromTimeframe(timeframe)}`;
    console.log('Fetching URL:', url);

    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch historical data:', errorText);
      throw new Error(`Failed to fetch historical data: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Raw historical data response:', result);
    
    return result.data || [];
  } catch (error) {
    console.error('Error in historical rates fetch:', error);
    throw error;
  }
};

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

const AdvancedForexChart = () => {
  // State Management
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [quoteCurrency, setQuoteCurrency] = useState('LYD');
  const [timeframe, setTimeframe] = useState('1M');
  const [showVolume, setShowVolume] = useState(true);
  const [chartType, setChartType] = useState(CHART_TYPES.CANDLESTICK);
  const [showMovingAverages, setShowMovingAverages] = useState(false);

  // Responsive Design
  const isMobile = useBreakpointValue({ base: true, md: false });
  const chartHeight = useBreakpointValue({ base: 300, md: 500 });

  // Currency List
  const allCurrencies = useMemo(() => getAllCurrencies(), []);

  // Fetch Historical Rates
  const { 
    data: historicalData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['historical-rates', baseCurrency, quoteCurrency, timeframe],
    queryFn: fetchHistoricalRates,
    refetchInterval: 60000
  });

  // Currency Switch Handler
  const switchCurrencies = () => {
    const temp = baseCurrency;
    setBaseCurrency(quoteCurrency);
    setQuoteCurrency(temp);
  };

  // Prepare Chart Data
  const chartData = useMemo(() => {
    console.log('Raw historical data:', historicalData);
    
    if (!historicalData || !Array.isArray(historicalData)) {
      console.warn('Historical data is not an array:', historicalData);
      return [];
    }

    return historicalData.map(item => {
      if (!item || !item.attributes) {
        console.warn('Invalid data item:', item);
        return null;
      }

      const rates = {
        date: item.attributes.timestamp 
          ? new Date(item.attributes.timestamp).toLocaleDateString() 
          : 'N/A',
        open: item.attributes.open_rate || item.attributes.rate || 0,
        high: item.attributes.high_rate || item.attributes.rate || 0,
        low: item.attributes.low_rate || item.attributes.rate || 0,
        close: item.attributes.rate || 0,
        volume: item.attributes.volume || 0
      };

      // Calculate Moving Averages
      if (showMovingAverages) {
        rates.ma20 = calculateMovingAverage(historicalData, 20, 'rate');
        rates.ma50 = calculateMovingAverage(historicalData, 50, 'rate');
      }

      return rates;
    }).filter(Boolean);
  }, [historicalData, showMovingAverages]);

  // Color Theming
  const bgColor = useColorModeValue('brand.bitcash.400', 'brand.bitcash.700');
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
      <VStack spacing={4} align="stretch">
        {/* Currency Selection */}
        <HStack 
          spacing={isMobile ? 2 : 4} 
          flexDirection={isMobile ? 'column' : 'row'}
          w="full"
        >
          <Select
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
            flex={1}
            size={isMobile ? 'sm' : 'md'}
            bg={selectBg}
          >
            {allCurrencies.map(currency => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </Select>

          <Button 
            onClick={switchCurrencies} 
            variant="outline"
            size={isMobile ? 'sm' : 'md'}
          >
            <ArrowUpDown />
          </Button>

          <Select
            value={quoteCurrency}
            onChange={(e) => setQuoteCurrency(e.target.value)}
            flex={1}
            size={isMobile ? 'sm' : 'md'}
            bg={selectBg}
          >
            {allCurrencies.map(currency => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </Select>
        </HStack>

        {/* Chart Controls */}
        <HStack spacing={2} justify="center" wrap="wrap">
          {/* Timeframe Buttons */}
          {['1D', '1W', '1M', '3M', '6M', '1Y'].map(tf => (
            <Button
              key={tf}
              onClick={() => setTimeframe(tf)}
              variant={timeframe === tf ? 'solid' : 'ghost'}
              size="xs"
              colorScheme="blue"
            >
              {tf}
            </Button>
          ))}

          {/* Chart Type Toggle */}
          <Button
            onClick={() => setChartType(
              chartType === CHART_TYPES.CANDLESTICK 
                ? CHART_TYPES.LINE 
                : CHART_TYPES.CANDLESTICK
            )}
            size="xs"
            variant="ghost"
            leftIcon={
              chartType === CHART_TYPES.CANDLESTICK 
                ? <LineChart size={16} /> 
                : <Candles size={16} />
            }
          >
            {chartType === CHART_TYPES.CANDLESTICK ? 'Line' : 'Candle'}
          </Button>

          {/* Volume Toggle */}
          <Button
            onClick={() => setShowVolume(!showVolume)}
            size="xs"
            variant={showVolume ? 'solid' : 'ghost'}
            colorScheme="green"
          >
            Volume
          </Button>

          {/* Moving Averages Toggle */}
          <Button
            onClick={() => setShowMovingAverages(!showMovingAverages)}
            size="xs"
            variant={showMovingAverages ? 'solid' : 'ghost'}
            colorScheme="purple"
          >
            MA
          </Button>
        </HStack>

        {/* Chart Rendering */}
        {isLoading ? (
          <Spinner />
        ) : (
          <Box h={`${chartHeight}px`} w="full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: isMobile ? 8 : 12 }}
                />
                <YAxis 
                  yAxisId="price" 
                  domain={['auto', 'auto']} 
                  tick={{ fontSize: isMobile ? 8 : 12 }}
                />
                {showVolume && (
                  <YAxis 
                    yAxisId="volume" 
                    orientation="right" 
                    domain={['auto', 'auto']} 
                    tick={{ fontSize: isMobile ? 8 : 12 }}
                  />
                )}

                {chartType === CHART_TYPES.CANDLESTICK ? (
                  <Candlestick 
                    yAxisId="price"
                    dataKey="close"
                    fill={(data) => getTrendColor(data.open, data.close)}
                    stroke={(data) => getTrendColor(data.open, data.close)}
                  />
                ) : (
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="close"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                )}

                {showMovingAverages && (
                  <>
                    <Line
                      yAxisId="price"
                      type="monotone"
                      dataKey="ma20"
                      stroke="#ff7300"
                      name="20-Day MA"
                      dot={false}
                    />
                    <Line
                      yAxisId="price"
                      type="monotone"
                      dataKey="ma50"
                      stroke="#387908"
                      name="50-Day MA"
                      dot={false}
                    />
                  </>
                )}

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
                <Legend />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

// Helper function for Moving Average calculation
const calculateMovingAverage = (data, period, key) => {
  return data.map((_, index, array) => {
    if (index < period - 1) return null;
    const startIndex = index - (period - 1);
    const subset = array.slice(startIndex, index + 1);
    const avg = subset.reduce((sum, item) => sum + (item.attributes[key] || 0), 0) / period;
    return avg;
  });
};

export default AdvancedForexChart;