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

// Replace invalid `Candles` icon with a valid icon from lucide-react
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
  // We remove Candlestick from here
} from 'recharts';

import { useQuery } from '@tanstack/react-query';

// Currency Configuration
const AVAILABLE_CURRENCIES = {
  FIAT: ['USD', 'LYD', 'EGP', 'EUR', 'GBP', 'TND'],
  CRYPTO: ['BTC', 'ETH', 'USDT'],
  METALS: ['XAU', 'XAG']
};

const PROFIT_MARGINS = {
  LYD: { buy: 0.04, sell: 0.04, market_multiplier: 1.5 },
  EGP: { buy: 0.05, sell: 0.025, market_multiplier: 1.4 },
  CRYPTO: { buy: 0.02, sell: 0.015, market_multiplier: 1.2 },
  METALS: { buy: 0.02, sell: 0.015, market_multiplier: 1.2 },
  DEFAULT: { buy: 0.02, sell: 0.015, market_multiplier: 1.1 }
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

// ----------------------
// Custom Candlestick Shape
// ----------------------
import { Layer, Rectangle } from 'recharts';

const CustomCandle = (props) => {
  // Each bar's props include x, y, width, height, data, etc.
  // We can retrieve the data point from props.payload:
  const { x, y, width, height, payload } = props;
  const fillColor = getTrendColor(payload.open, payload.close);

  // This is a simplified rectangle for demonstration.
  // For "TradingView-like" wicks, you’d draw lines for high/low and a rect for open/close.
  return (
    <Layer>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fillColor}
      />
    </Layer>
  );
};

const fetchHistoricalRates = async ({ queryKey }) => {
  const [, baseCurrency, quoteCurrency, timeframe] = queryKey;
  
  try {
    const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY;
    if (!apiKey) {
      throw new Error('Alpha Vantage API key is missing.');
    }

    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${baseCurrency}&to_currency=${quoteCurrency}&apikey=${apiKey}`;
    console.log('Fetching Alpha Vantage URL:', url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch from Alpha Vantage');
    }

    const data = await response.json();
    const exchangeRate = data['Realtime Currency Exchange Rate'];
    
    if (!exchangeRate) {
      throw new Error('No exchange rate data found');
    }

    // Apply profit margins
    const margin = PROFIT_MARGINS[baseCurrency] || PROFIT_MARGINS.DEFAULT;
    const rate = parseFloat(exchangeRate['5. Exchange Rate']);
    const processedRate = {
      from_currency: baseCurrency,
      to_currency: quoteCurrency,
      rate: rate * margin.market_multiplier,
      open_rate: rate * margin.market_multiplier,
      high_rate: rate * margin.market_multiplier * 1.01,
      low_rate: rate * margin.market_multiplier * 0.99,
      buy_price: rate * (1 + margin.buy),
      sell_price: rate * (1 - margin.sell),
      timestamp: new Date().toISOString(),
      source: 'Alpha Vantage'
    };

    // Save to backend (optional)
    const saveResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exchange-rates`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: processedRate })
      }
    );
    if (!saveResponse.ok) {
      console.warn('Failed to save exchange rate to backend');
    }

    // Simulate historical data (30 days)
    return Array(30)
      .fill(null)
      .map((_, index) => {
        const randomFactor = 1 + (Math.random() - 0.5) * 0.1; // +/- 5%
        return {
          attributes: {
            timestamp: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
            rate: rate * randomFactor,
            open_rate: rate * randomFactor * 0.99,
            high_rate: rate * randomFactor * 1.01,
            low_rate: rate * randomFactor * 0.97,
            volume: Math.floor(Math.random() * 1000)
          }
        };
      })
      .reverse();
  } catch (error) {
    console.error('Error in historical rates fetch:', error);
    throw error;
  }
};

const AdvancedForexChart = () => {
  // State Management
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [quoteCurrency, setQuoteCurrency] = useState('LYD');
  const [timeframe, setTimeframe] = useState('1M');
  const [showVolume, setShowVolume] = useState(true);
  const [chartType, setChartType] = useState(CHART_TYPES.CANDLESTICK);

  // Responsive Design
  const isMobile = useBreakpointValue({ base: true, md: false });
  const chartHeight = useBreakpointValue({ base: 300, md: 500 });

  // Currency List
  const allCurrencies = useMemo(
    () => [
      ...AVAILABLE_CURRENCIES.FIAT,
      ...AVAILABLE_CURRENCIES.CRYPTO,
      ...AVAILABLE_CURRENCIES.METALS
    ],
    []
  );

  // Fetch Historical Rates
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

    return historicalData
      .map((item) => {
        if (!item?.attributes) return null;
        const { timestamp, rate, open_rate, high_rate, low_rate, volume } = item.attributes;
        return {
          date: new Date(timestamp).toLocaleDateString(),
          open: open_rate,
          high: high_rate,
          low: low_rate,
          close: rate,
          volume: volume || 0
        };
      })
      .filter(Boolean);
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
        {error.message || 'Failed to fetch exchange rates.'}
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
            {allCurrencies.map((currency) => (
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
            {allCurrencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </Select>
        </HStack>

        {/* Chart Controls */}
        <HStack spacing={2} justify="center" wrap="wrap">
          {/* Timeframe Buttons */}
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

          {/* Chart Type Toggle */}
          <Button
            onClick={() =>
              setChartType(
                chartType === CHART_TYPES.CANDLESTICK ? CHART_TYPES.LINE : CHART_TYPES.CANDLESTICK
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

          {/* Volume Toggle */}
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
        ) : (
          <Box h={`${chartHeight}px`} w="full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <XAxis dataKey="date" tick={{ fontSize: isMobile ? 8 : 12 }} />
                <YAxis
                  yAxisId="price"
                  domain={['auto', 'auto']}
                  tick={{ fontSize: isMobile ? 8 : 12 }}
                />

                {/* Optional volume Y-axis */}
                {showVolume && (
                  <YAxis
                    yAxisId="volume"
                    orientation="right"
                    domain={['auto', 'auto']}
                    tick={{ fontSize: isMobile ? 8 : 12 }}
                  />
                )}

                {/* Candlestick vs. Line Toggle */}
                {chartType === CHART_TYPES.CANDLESTICK ? (
                  <Bar
                    yAxisId="price"
                    dataKey="close"
                    // We use a custom shape for a candlestick-like bar
                    shape={(barProps) => {
                      // barProps.payload has open, high, low, close, etc.
                      // We'll forward it into our CustomCandle shape
                      return <CustomCandle {...barProps} />;
                    }}
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

                {/* Volume bars */}
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

export default AdvancedForexChart;