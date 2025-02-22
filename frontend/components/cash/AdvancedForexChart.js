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
  Layer,
  Rectangle,
} from 'recharts';

import { useQuery } from '@tanstack/react-query';

// ----- Configuration -----
const AVAILABLE_CURRENCIES = {
  FIAT: ['USD', 'LYD', 'EGP', 'EUR', 'GBP', 'TND'],
  CRYPTO: ['BTC', 'ETH', 'USDT'],
  METALS: ['XAU', 'XAG']
};

const CHART_TYPES = {
  CANDLESTICK: 'candlestick',
  LINE: 'line'
};

// ----- Utility Functions -----
const formatPrice = (price, currency) => {
  if (!price) return '-';
  return price.toLocaleString('en-US', {
    minimumFractionDigits: currency === 'BTC' ? 8 : 4,
    maximumFractionDigits: currency === 'BTC' ? 8 : 4
  });
};

const getTrendColor = (open, close) =>
  close >= open ? '#26a69a' : '#ef5350';

// ----- Custom Candlestick Shape -----
const CustomCandle = (props) => {
  const { x, y, width, height, payload } = props;
  const fillColor = getTrendColor(payload.open, payload.close);
  return (
    <Layer>
      <Rectangle x={x} y={y} width={width} height={height} fill={fillColor} />
    </Layer>
  );
};

// ----- Fetch Historical Data with Fallback -----
const fetchHistoricalRates = async ({ queryKey }) => {
  const [, baseCurrency, quoteCurrency, timeframe] = queryKey;
  // Get one year of data.
  const today = new Date();
  const endDate = today.toISOString().split('T')[0];
  const pastDate = new Date();
  pastDate.setFullYear(pastDate.getFullYear() - 1);
  const startDate = pastDate.toISOString().split('T')[0];

  // Primary API: exchangerate.host
  const primaryUrl = `https://api.exchangerate.host/timeseries?start_date=${startDate}&end_date=${endDate}&base=${baseCurrency}&symbols=${quoteCurrency}&apikey=00501cab070cfa4550c2f9c0eed2d61e`;
  console.log("Fetching primary URL:", primaryUrl);
  try {
    const res = await fetch(primaryUrl);
    if (!res.ok) throw new Error("Primary API request failed");
    const data = await res.json();
    if (!data.success) throw new Error("Primary API call unsuccessful");
    const dates = Object.keys(data.rates).sort(); // ascending order
    const margin = 0.005; // simulate OHLC by applying a 0.5% margin
    const historicalData = dates.map(date => {
      const rate = data.rates[date][quoteCurrency];
      return {
        date,
        open: rate * (1 - margin),
        high: rate * (1 + margin),
        low: rate * (1 - margin * 1.5),
        close: rate,
        volume: Math.floor(Math.random() * 1000) // simulated volume
      };
    });
    return historicalData;
  } catch (primaryError) {
    console.error("Primary API failed:", primaryError);
    // Fallback API call:
    const fallbackUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exchange-rates?/latest?base=${baseCurrency}`;
    console.log("Fetching fallback URL:", fallbackUrl);
    const fallbackRes = await fetch(fallbackUrl);
    if (!fallbackRes.ok) {
      throw new Error("Fallback API request failed");
    }
    const fallbackData = await fallbackRes.json();
    // Assume fallbackData.data is an array of rate objects with attributes.
    const margin = 0.005;
    const fallbackHistoricalData = fallbackData.data.map(item => {
      const { timestamp, rate, volume } = item.attributes;
      return {
        date: new Date(timestamp).toISOString().split('T')[0],
        open: rate * (1 - margin),
        high: rate * (1 + margin),
        low: rate * (1 - margin * 1.5),
        close: rate,
        volume: volume || Math.floor(Math.random() * 1000)
      };
    });
    return fallbackHistoricalData;
  }
};

const AdvancedForexChart = () => {
  // Local state for currency pair, timeframe, chart type, and volume toggle.
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [quoteCurrency, setQuoteCurrency] = useState('EUR'); // default pair
  const [timeframe, setTimeframe] = useState('1Y'); // default view: 1 Year
  const [showVolume, setShowVolume] = useState(true);
  const [chartType, setChartType] = useState(CHART_TYPES.CANDLESTICK);

  // Responsive design
  const isMobile = useBreakpointValue({ base: true, md: false });
  const chartHeight = useBreakpointValue({ base: 300, md: 500 });

  // Available currency list
  const allCurrencies = useMemo(() => [
    ...AVAILABLE_CURRENCIES.FIAT,
    ...AVAILABLE_CURRENCIES.CRYPTO,
    ...AVAILABLE_CURRENCIES.METALS
  ], []);

  // Fetch historical data (one year) with React Query.
  const { data: historicalData, isLoading, error } = useQuery({
    queryKey: ['historical-rates', baseCurrency, quoteCurrency, timeframe],
    queryFn: fetchHistoricalRates,
    refetchInterval: 60000,
    retry: 1
  });

  // Allow switching the currency pair.
  const switchCurrencies = () => {
    setBaseCurrency(quoteCurrency);
    setQuoteCurrency(baseCurrency);
  };

  // Map timeframe to the number of days to display.
  const timeframeDaysMap = {
    '1D': 1,
    '1W': 7,
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365
  };
  const daysToShow = timeframeDaysMap[timeframe] || 365;

  // Process fetched data: sort by date and filter by timeframe.
  const chartData = useMemo(() => {
    if (!historicalData || !Array.isArray(historicalData)) return [];
    const sortedData = historicalData.sort((a, b) => new Date(a.date) - new Date(b.date));
    return sortedData.slice(-daysToShow);
  }, [historicalData, daysToShow]);

  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const selectBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box bg={bgColor} color={textColor} p={isMobile ? 2 : 6} borderRadius="xl" w="full" boxShadow="md">
      <VStack spacing={4} align="stretch">
        {/* Always show currency navigation even if error */}
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error.message || 'Failed to fetch exchange rate data.'}
          </Alert>
        )}

        <HStack spacing={isMobile ? 2 : 4} flexDirection={isMobile ? 'column' : 'row'} w="full">
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

        {/* Chart Controls */}
        <HStack spacing={2} justify="center" wrap="wrap">
          {['1D', '1W', '1M', '3M', '6M', '1Y'].map(tf => (
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
            leftIcon={chartType === CHART_TYPES.CANDLESTICK ? <LineChart size={16} /> : <CandlestickChart size={16} />}
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
          <Text>No historical data available for this pair.</Text>
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
                  <Bar yAxisId="price" dataKey="close" shape={(barProps) => <CustomCandle {...barProps} />} />
                ) : (
                  <Line yAxisId="price" type="monotone" dataKey="close" stroke="#8884d8" strokeWidth={2} />
                )}

                {showVolume && (
                  <Bar yAxisId="volume" dataKey="volume" fill="#82ca9d" opacity={0.3} barSize={10} />
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
