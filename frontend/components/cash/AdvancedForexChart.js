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
import { ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Candlestick, Line, Bar } from 'recharts';
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

const AdvancedForexChart = () => {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [quoteCurrency, setQuoteCurrency] = useState('LYD');
  const [timeframe, setTimeframe] = useState('1D');
  const [showVolume, setShowVolume] = useState(true);

  // Combine all currencies for the selectors
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
    if (!historicalData) return [];
    return historicalData.map(d => ({
      date: new Date(d.timestamp).toLocaleDateString(),
      open: d.open_rate,
      high: d.high_rate,
      low: d.low_rate,
      close: d.rate,
      volume: d.volume,
      ma20: d.ma20, // 20-day moving average
      ma50: d.ma50, // 50-day moving average
    }));
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
              <Candlestick
                yAxisId="price"
                name={`${baseCurrency}/${quoteCurrency}`}
                dataKey={['open', 'close', 'high', 'low']}
                fill="#8884d8"
                stroke="#8884d8"
              />
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