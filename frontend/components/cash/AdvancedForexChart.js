import React, { useState, useMemo } from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Select,
  Button,
  Grid,
  GridItem,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { ArrowUpDown } from 'lucide-react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { useQuery } from '@tanstack/react-query';

const AVAILABLE_CURRENCIES = {
  FIAT: ['USD', 'LYD', 'EGP', 'EUR', 'GBP', 'TND'],
  CRYPTO: ['BTC', 'ETH', 'USDT'],
  METALS: ['XAU', 'XAG']
};

const formatPrice = (price, currency) => {
  if (!price) return '-';
  return price.toFixed(currency === 'BTC' ? 8 : 4);
};

const CustomCandlestick = (props) => {
  const { x, y, width, height, open, close, high, low } = props;
  const color = close > open ? "#00b894" : "#ff7675";
  const bodyHeight = Math.max(1, Math.abs(close - open));
  const bodyY = Math.min(close, open);

  return (
    <g>
      {/* Wick */}
      <line
        x1={x + width / 2}
        y1={y + high}
        x2={x + width / 2}
        y2={y + low}
        stroke={color}
        strokeWidth={1}
      />
      {/* Body */}
      <rect
        x={x}
        y={y + bodyY}
        width={width}
        height={bodyHeight}
        fill={color}
      />
    </g>
  );
};

const AdvancedForexChart = () => {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [quoteCurrency, setQuoteCurrency] = useState('LYD');
  const [timeframe, setTimeframe] = useState('1D');
  const [showVolume, setShowVolume] = useState(true);

  const allCurrencies = useMemo(() => [
    ...AVAILABLE_CURRENCIES.FIAT,
    ...AVAILABLE_CURRENCIES.CRYPTO,
    ...AVAILABLE_CURRENCIES.METALS
  ], []);

  const { data: historicalData, isLoading, error } = useQuery({
    queryKey: ['historical-rates', baseCurrency, quoteCurrency, timeframe],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exchange-rates?/historical?base=${baseCurrency}&quote=${quoteCurrency}&timeframe=${timeframe}`
      );
      if (!response.ok) throw new Error('Failed to fetch historical data');
      return response.json();
    },
    refetchInterval: 60000
  });

  const switchCurrencies = () => {
    const temp = baseCurrency;
    setBaseCurrency(quoteCurrency);
    setQuoteCurrency(temp);
  };

  const chartData = useMemo(() => {
  console.log('Raw historical data:', historicalData);
  
  if (!historicalData || !Array.isArray(historicalData)) {
    console.warn('Historical data is not an array:', historicalData);
    return [];
  }

  return historicalData.map(d => {
    if (!d) {
      console.warn('Encountered null/undefined data point:', d);
      return null;
    }
    return {
      date: d.timestamp ? new Date(d.timestamp).toLocaleDateString() : 'N/A',
      open: d.open_rate || d.rate || 0,
      high: d.high_rate || d.rate || 0,
      low: d.low_rate || d.rate || 0,
      close: d.rate || 0,
      volume: d.volume || 0,
      ma20: d.ma20 || null, 
      ma50: d.ma50 || null
    };
  }).filter(Boolean); // Remove any null entries
}, [historicalData]);

  const bgColor = useColorModeValue('gray.900', 'black');
  const textColor = useColorModeValue('white', 'gray.200');

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error.message}
      </Alert>
    );
  }

  return (
    <Box bg={bgColor} color={textColor} p={6} borderRadius="xl" w="full">
      <VStack spacing={6} align="stretch">
        {/* Currency Selection */}
        <Grid templateColumns="repeat(5, 1fr)" gap={4} alignItems="center">
          <GridItem colSpan={2}>
            <Select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              bg="gray.800"
            >
              {allCurrencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </Select>
          </GridItem>
          
          <GridItem colSpan={1}>
            <Button 
              onClick={switchCurrencies}
              variant="ghost"
              w="full"
            >
              <ArrowUpDown />
            </Button>
          </GridItem>

          <GridItem colSpan={2}>
            <Select
              value={quoteCurrency}
              onChange={(e) => setQuoteCurrency(e.target.value)}
              bg="gray.800"
            >
              {allCurrencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </Select>
          </GridItem>
        </Grid>

        {/* Timeframe Selection */}
        <HStack spacing={4}>
          {['1D', '1W', '1M', '3M', '6M', '1Y'].map(tf => (
            <Button
              key={tf}
              onClick={() => setTimeframe(tf)}
              variant={timeframe === tf ? 'solid' : 'ghost'}
              size="sm"
            >
              {tf}
            </Button>
          ))}
          <Button
            size="sm"
            variant={showVolume ? 'solid' : 'ghost'}
            onClick={() => setShowVolume(!showVolume)}
          >
            Volume
          </Button>
        </HStack>

        {/* Chart */}
        {isLoading ? (
          <Spinner />
        ) : (
          <Box h="500px" w="full">
            <ComposedChart
              width={800}
              height={500}
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="price" domain={['auto', 'auto']} />
              {showVolume && (
                <YAxis yAxisId="volume" orientation="right" domain={['auto', 'auto']} />
              )}
              <Tooltip
                content={({ payload, label }) => {
                  if (!payload?.length) return null;
                  const data = payload[0].payload;
                  return (
                    <Box bg="gray.800" p={3} borderRadius="md">
                      <Text fontWeight="bold">{label}</Text>
                      <Text>Open: {formatPrice(data.open, quoteCurrency)}</Text>
                      <Text>High: {formatPrice(data.high, quoteCurrency)}</Text>
                      <Text>Low: {formatPrice(data.low, quoteCurrency)}</Text>
                      <Text>Close: {formatPrice(data.close, quoteCurrency)}</Text>
                      {showVolume && <Text>Volume: {data.volume?.toLocaleString()}</Text>}
                    </Box>
                  );
                }}
              />
              <Legend />
              {chartData.map((d, i) => (
                <CustomCandlestick
                  key={i}
                  x={i * (800 / chartData.length)}
                  y={0}
                  width={10}
                  height={500}
                  open={d.open}
                  close={d.close}
                  high={d.high}
                  low={d.low}
                />
              ))}
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="ma20"
                stroke="#ff7300"
                name="MA20"
                dot={false}
              />
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="ma50"
                stroke="#387908"
                name="MA50"
                dot={false}
              />
              {showVolume && (
                <Bar
                  yAxisId="volume"
                  dataKey="volume"
                  fill="#82ca9d"
                  opacity={0.3}
                  name="Volume"
                />
              )}
            </ComposedChart>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default AdvancedForexChart;