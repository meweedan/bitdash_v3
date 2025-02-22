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
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
  Layer,
  Customized,
  Line
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpDown, LineChart, CandlestickChart } from 'lucide-react';

// ----- Configuration -----
const AVAILABLE_CURRENCIES = {
  FIAT: ['USD', 'LYD', 'EGP', 'EUR', 'GBP', 'TND'],
  CRYPTO: ['BTC', 'ETH', 'USDT'],
  METALS: ['XAU', 'XAG'],
};

const CHART_TYPES = {
  CANDLESTICK: 'candlestick',
  LINE: 'line',
};

// ----- Utility Functions -----
const formatPrice = (price, currency) => {
  if (!price) return '-';
  return price.toLocaleString('en-US', {
    minimumFractionDigits: currency === 'BTC' ? 8 : 4,
    maximumFractionDigits: currency === 'BTC' ? 8 : 4,
  });
};

const getTrendColor = (open, close) => (close >= open ? '#26a69a' : '#ef5350');

// ----- Fetch Historical Data with Fallback -----
const fetchHistoricalRates = async ({ queryKey }) => {
  const [, baseCurrency, quoteCurrency, timeframe] = queryKey;

  // Get one year of data (start_date -> end_date).
  const today = new Date();
  const endDate = today.toISOString().split('T')[0];
  const pastDate = new Date();
  pastDate.setFullYear(pastDate.getFullYear() - 1);
  const startDate = pastDate.toISOString().split('T')[0];

  // Primary API: exchangerate.host
  const primaryUrl = `https://api.exchangerate.host/timeseries?start_date=${startDate}&end_date=${endDate}&base=${baseCurrency}&symbols=${quoteCurrency}&apikey=00501cab070cfa4550c2f9c0eed2d61e`;
  console.log('Fetching primary URL:', primaryUrl);
  try {
    const res = await fetch(primaryUrl);
    if (!res.ok) throw new Error('Primary API request failed');
    const data = await res.json();
    if (!data.success) throw new Error('Primary API call unsuccessful');

    const dates = Object.keys(data.rates).sort(); // ascending order
    // To simulate OHLC, add a small margin
    const margin = 0.005;
    const historicalData = dates.map((date) => {
      const rate = data.rates[date][quoteCurrency];
      return {
        date,
        open: rate * (1 - margin),
        high: rate * (1 + margin),
        low: rate * (1 - margin * 1.5),
        close: rate,
        volume: Math.floor(Math.random() * 1000), // fake volume
      };
    });
    return historicalData;
  } catch (primaryError) {
    console.error('Primary API failed:', primaryError);

    // Fallback API call (your backend):
    const fallbackUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exchange-rates?/latest?base=${baseCurrency}`;
    console.log('Fetching fallback URL:', fallbackUrl);
    const fallbackRes = await fetch(fallbackUrl);
    if (!fallbackRes.ok) {
      throw new Error('Fallback API request failed');
    }
    const fallbackData = await fallbackRes.json();
    // Assume fallbackData.data is an array with each item containing { timestamp, rate, volume }
    const margin = 0.005;
    const fallbackHistoricalData = fallbackData.data.map((item) => {
      const { timestamp, rate, volume } = item.attributes;
      return {
        date: new Date(timestamp).toISOString().split('T')[0],
        open: rate * (1 - margin),
        high: rate * (1 + margin),
        low: rate * (1 - margin * 1.5),
        close: rate,
        volume: volume || Math.floor(Math.random() * 1000),
      };
    });
    return fallbackHistoricalData;
  }
};

// ----- Customized Candlestick Layer -----
const CandlestickSeries = ({ xAxis, yAxis, data }) => {
  if (!xAxis || !yAxis || !xAxis.scale || !yAxis.scale) return null;

  const scaleX = xAxis.scale;
  const scaleY = yAxis.scale;

  // Width of each candle in pixels
  const candleWidth = 6;

  return (
    <Layer>
      {data.map((entry, index) => {
        const { open, high, low, close } = entry;
        // X position is based on the category (date) on the X-axis
        const cx = scaleX(entry.date);

        // For the body (rectangle), top is min(openY, closeY), height is their difference
        const openY = scaleY(open);
        const closeY = scaleY(close);
        const highY = scaleY(high);
        const lowY = scaleY(low);

        const candleColor = getTrendColor(open, close);
        const barX = cx - candleWidth / 2;
        const barY = Math.min(openY, closeY);
        const barHeight = Math.abs(closeY - openY);

        return (
          <Layer key={`candlestick-${index}`}>
            {/* Wick */}
            <line
              x1={cx}
              y1={highY}
              x2={cx}
              y2={lowY}
              stroke={candleColor}
              strokeWidth={1}
            />
            {/* Candle Body */}
            <rect
              x={barX}
              y={barY}
              width={candleWidth}
              height={barHeight}
              fill={candleColor}
            />
          </Layer>
        );
      })}
    </Layer>
  );
};

const AdvancedForexChart = () => {
  // Local state
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [quoteCurrency, setQuoteCurrency] = useState('EUR'); // default pair
  const [timeframe, setTimeframe] = useState('1Y');
  const [showVolume, setShowVolume] = useState(true);
  const [chartType, setChartType] = useState(CHART_TYPES.CANDLESTICK);

  // Breakpoints
  const isMobile = useBreakpointValue({ base: true, md: false });
  const chartHeight = useBreakpointValue({ base: 300, md: 500 });

  // Combined list of currencies
  const allCurrencies = useMemo(
    () => [
      ...AVAILABLE_CURRENCIES.FIAT,
      ...AVAILABLE_CURRENCIES.CRYPTO,
      ...AVAILABLE_CURRENCIES.METALS,
    ],
    []
  );

  // Query data
  const {
    data: historicalData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['historical-rates', baseCurrency, quoteCurrency, timeframe],
    queryFn: fetchHistoricalRates,
    refetchInterval: 60_000,
    retry: 1,
  });

  // Switch base & quote
  const switchCurrencies = () => {
    setBaseCurrency(quoteCurrency);
    setQuoteCurrency(baseCurrency);
  };

  // Timeframe
  const timeframeDaysMap = {
    '1D': 1,
    '1W': 7,
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365,
  };
  const daysToShow = timeframeDaysMap[timeframe] || 365;

  // Filter the data to the timeframe
  const chartData = useMemo(() => {
    if (!historicalData || !Array.isArray(historicalData)) return [];
    const sorted = [...historicalData].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    return sorted.slice(-daysToShow);
  }, [historicalData, daysToShow]);

  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const selectBg = useColorModeValue('gray.100', 'gray.700');

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
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error.message || 'Failed to fetch exchange rate data.'}
          </Alert>
        )}

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
            {allCurrencies.map((currency) => (
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
            {allCurrencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </Select>
        </HStack>

        {/* Timeframe & Chart Controls */}
        <HStack spacing={2} justify="center" wrap="wrap">
          {Object.keys(timeframeDaysMap).map((tf) => (
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
            onClick={() =>
              setChartType(
                chartType === CHART_TYPES.CANDLESTICK
                  ? CHART_TYPES.LINE
                  : CHART_TYPES.CANDLESTICK
              )
            }
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

        {/* The Chart */}
        {isLoading ? (
          <Spinner />
        ) : chartData.length === 0 ? (
          <Text>No historical data available for this pair.</Text>
        ) : (
          <Box height={`${chartHeight}px`} width="full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <XAxis dataKey="date" tick={{ fontSize: isMobile ? 8 : 12 }} />
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

                {/* 
                  Hidden or “dummy” Bar to keep Recharts tooltip + mouse tracking functional. 
                  This ensures payload[0].payload has open, high, low, close.
                */}
                <Bar
                  yAxisId="price"
                  dataKey="close"
                  fill="transparent"
                  hide={true}
                  isAnimationActive={false}
                />

                {/* Volume Bars */}
                {showVolume && (
                  <Bar
                    yAxisId="volume"
                    dataKey="volume"
                    fill="#82ca9d"
                    opacity={0.3}
                    barSize={10}
                  />
                )}

                {/* Conditionally render candlesticks or line */}
                {chartType === CHART_TYPES.CANDLESTICK ? (
                  <Customized
                    component={<CandlestickSeries data={chartData} />}
                    yAxisId="price"
                  />
                ) : (
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="close"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                )}

                <Tooltip
                  contentStyle={{ backgroundColor: bgColor, borderRadius: '8px' }}
                  content={({ payload, label }) => {
                    if (!payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <Box p={2} bg={bgColor} borderRadius="md">
                        <Text fontWeight="bold">{label}</Text>
                        <Text>Open: {formatPrice(d.open, quoteCurrency)}</Text>
                        <Text>High: {formatPrice(d.high, quoteCurrency)}</Text>
                        <Text>Low: {formatPrice(d.low, quoteCurrency)}</Text>
                        <Text>Close: {formatPrice(d.close, quoteCurrency)}</Text>
                        {showVolume && (
                          <Text>Volume: {d.volume.toLocaleString()}</Text>
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

export default AdvancedForexChart;
