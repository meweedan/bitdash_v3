import React, { useState, useMemo, useEffect } from 'react';
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

// Use valid icons from lucide-react
import { ArrowUpDown, LineChart, CandlestickChart } from 'lucide-react';

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
  // No built-in Candlestick in recharts
} from 'recharts';

import { useQuery } from '@tanstack/react-query';
import { Layer, Rectangle } from 'recharts';

// ----------------------
// CONFIGURATION
// ----------------------
const AVAILABLE_CURRENCIES = {
  FIAT: ['USD', 'LYD', 'EGP', 'EUR', 'GBP', 'TND'],
  CRYPTO: ['BTC', 'ETH', 'USDT'],
  METALS: ['XAU', 'XAG']
};

const CHART_TYPES = {
  CANDLESTICK: 'candlestick',
  LINE: 'line'
};

// ----------------------
// UTILITY FUNCTIONS
// ----------------------
const formatPrice = (price, currency) => {
  if (!price) return '-';
  return price.toLocaleString('en-US', {
    minimumFractionDigits: currency === 'BTC' ? 8 : 4,
    maximumFractionDigits: currency === 'BTC' ? 8 : 4
  });
};

const getTrendColor = (open, close) =>
  close >= open ? '#26a69a' : '#ef5350';

// ----------------------
// Custom Candlestick Shape
// ----------------------
const CustomCandle = ({ x, y, width, height, payload }) => {
  const fillColor = getTrendColor(payload.open, payload.close);
  return (
    <Layer>
      <Rectangle x={x} y={y} width={width} height={height} fill={fillColor} />
    </Layer>
  );
};

// ----------------------
// Fetch Historical Data via TraderMade API
// ----------------------
const fetchHistoricalRates = async ({ queryKey }) => {
  const [, baseCurrency, quoteCurrency, timeframe] = queryKey;

  // Determine the date range based on the timeframe button selected
  const now = new Date();
  let startDate = new Date();
  switch (timeframe) {
    case "1D":
      startDate = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
      break;
    case "1W":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "1M":
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    case "3M":
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      break;
    case "6M":
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      break;
    case "1Y":
    default:
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      break;
  }
  const formatDate = (date) => date.toISOString().slice(0, 10);
  const start_date = formatDate(startDate);
  const end_date = formatDate(now);

  // Use your TraderMade API key and build the currency pair (e.g. "USDLYD")
  const apiKey = "JAvk5zeVBW6ml3oTZfXN";
  const currencyPair = baseCurrency + quoteCurrency;
  const url = `https://api.tradermade.com/v1/timeseries?currency=${currencyPair}&api_key=${apiKey}&start_date=${start_date}&end_date=${end_date}&interval=day`;

  console.log('Fetching TraderMade URL:', url);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch from TraderMade');
  }
  const data = await response.json();
  if (!data.rates) {
    throw new Error(`No historical data found for ${baseCurrency}-${quoteCurrency}`);
  }

  // Process the returned data:
  // TraderMade returns an object with dates as keys.
  const dates = Object.keys(data.rates);
  dates.sort(); // ascending order (oldest to newest)
  const processedData = dates.map(date => {
    const dayData = data.rates[date];
    return {
      date,
      open: parseFloat(dayData.open),
      high: parseFloat(dayData.high),
      low: parseFloat(dayData.low),
      close: parseFloat(dayData.close),
      volume: dayData.volume ? parseInt(dayData.volume) : 0,
    };
  });
  return processedData;
};

// ----------------------
// AdvancedForexChart Component
// ----------------------
const AdvancedForexChart = () => {
  // State Management
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [quoteCurrency, setQuoteCurrency] = useState('LYD');
  const [timeframe, setTimeframe] = useState('1Y'); // default to 1 year for accuracy
  const [showVolume, setShowVolume] = useState(true);
  const [chartType, setChartType] = useState(CHART_TYPES.CANDLESTICK);

  // Responsive Design
  const isMobile = useBreakpointValue({ base: true, md: false });
  const chartHeight = useBreakpointValue({ base: 300, md: 500 });

  // Currency List
  const allCurrencies = useMemo(() => {
    return [
      ...AVAILABLE_CURRENCIES.FIAT,
      ...AVAILABLE_CURRENCIES.CRYPTO,
      ...AVAILABLE_CURRENCIES.METALS
    ];
  }, []);

  // Fetch Historical Rates using TraderMade API
  const { data: historicalData, isLoading, error } = useQuery({
    queryKey: ['historical-rates', baseCurrency, quoteCurrency, timeframe],
    queryFn: fetchHistoricalRates,
    refetchInterval: 60000,
    retry: 1
  });

  // Currency Switch Handler
  const switchCurrencies = () => {
    setBaseCurrency(quoteCurrency);
    setQuoteCurrency(baseCurrency);
  };

  // Prepare Chart Data
  const chartData = useMemo(() => {
    if (!historicalData || !Array.isArray(historicalData)) {
      return [];
    }
    return historicalData.map(item => ({
      date: new Date(item.date).toLocaleDateString(),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume || 0
    }));
  }, [historicalData]);

  // Color Theming
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const selectBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box bg={bgColor} color={textColor} p={isMobile ? 2 : 6} borderRadius="xl" w="full" boxShadow="md">
      {/* Navigation Bar (always visible) for selecting currency pair */}
      <HStack spacing={isMobile ? 2 : 4} flexDirection={isMobile ? 'column' : 'row'} w="full" mb={4}>
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
        <Button onClick={switchCurrencies} variant="outline" size={isMobile ? 'sm' : 'md'}>
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

      <VStack spacing={4} align="stretch">
        {/* Chart Controls */}
        <HStack spacing={2} justify="center" wrap="wrap">
          {['1D', '1W', '1M', '3M', '6M', '1Y'].map((tf) => (
            <Button
              key={tf}
              onClick={() => setTimeframe(tf)}
              variant={timeframe === tf ? 'solid' : 'outline'}
              size="xs"
              colorScheme="blue"
            >
              {tf}
            </Button>
          ))}
          <Button
            onClick={() => setChartType(chartType === CHART_TYPES.CANDLESTICK ? CHART_TYPES.LINE : CHART_TYPES.CANDLESTICK)}
            size="xs"
            variant="ghost"
            leftIcon={
              chartType === CHART_TYPES.CANDLESTICK ? (
                <LineChart size={16} />
              ) : (
                <CandlestickChart size={16} />
              )
            }
          >
            {chartType === CHART_TYPES.CANDLESTICK ? 'Line' : 'Candle'}
          </Button>
          <Button
            onClick={() => setShowVolume(!showVolume)}
            size="xs"
            variant={showVolume ? 'solid' : 'ghost'}
            colorScheme="green"
          >
            Volume
          </Button>
        </HStack>

        {/* Chart Rendering */}
        {isLoading ? (
          <Spinner />
        ) : chartData.length === 0 ? (
          <Alert status="warning">
            <AlertIcon />
            No exchange rate data found.
          </Alert>
        ) : (
          <Box h={`${chartHeight}px`} w="full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <XAxis dataKey="date" tick={{ fontSize: isMobile ? 8 : 12 }} />
                <YAxis yAxisId="price" domain={['auto', 'auto']} tick={{ fontSize: isMobile ? 8 : 12 }} />
                {showVolume && (
                  <YAxis
                    yAxisId="volume"
                    orientation="right"
                    domain={['auto', 'auto']}
                    tick={{ fontSize: isMobile ? 8 : 12 }}
                  />
                )}
                {chartType === CHART_TYPES.CANDLESTICK ? (
                  <Bar
                    yAxisId="price"
                    dataKey="close"
                    shape={(barProps) => <CustomCandle {...barProps} />}
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
                {showVolume && (
                  <Bar
                    yAxisId="volume"
                    dataKey="volume"
                    fill="#82ca9d"
                    opacity={0.3}
                    barSize={10}
                  />
                )}
                <Tooltip
                  contentStyle={{ backgroundColor: bgColor, borderRadius: '8px' }}
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
                        {showVolume && <Text>Volume: {data.volume.toLocaleString()}</Text>}
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

export default AdvancedForexChart;
