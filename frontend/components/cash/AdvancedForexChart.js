import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Select,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Text,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  SimpleGrid,
  Bar,
  Line
} from 'recharts';
import { ArrowUpDown, LineChart, CandlestickChart } from 'lucide-react';

/** ----- Configuration ----- */
const AVAILABLE_CURRENCIES = {
  FIAT: ['USD', 'LYD', 'EGP', 'EUR', 'GBP', 'TND'],
  CRYPTO: ['BTC', 'ETH', 'USDT'],
  METALS: ['XAU', 'XAG'],
};

const timeframeDaysMap = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '6M': 180,
  '1Y': 365,
  'All': Infinity,
};

function getCandleColor(open, close) {
  return close >= open ? '#26a69a' : '#ef5350';
}

function formatPrice(value, currency = 'USD') {
  if (value == null) return '-';
  const decimals = currency === 'BTC' ? 8 : 3;
  return parseFloat(value).toFixed(decimals);
}

function CandleBarShape(props) {
  const { x, y, width, height, payload } = props;
  
  if (!payload) return null;
  const { open, high, low, close } = payload;
  const color = getCandleColor(open, close);

  // Calculate relative positions within the bar's allocated space
  const priceRange = high - low;
  const bodyTop = ((high - Math.max(open, close)) / priceRange * height);
  const bodyHeight = (Math.abs(close - open) / priceRange * height);
  const candleWidth = Math.min(width * 0.6, 8); // Max width 8px

  return (
    <g>
      {/* Wick from high to low */}
      <line
        x1={x + width/2}
        y1={0} // Top of the allocated space (high)
        x2={x + width/2}
        y2={height} // Bottom of allocated space (low)
        stroke={color}
        strokeWidth={1}
      />
      {/* Candle body */}
      <rect
        x={x + (width - candleWidth)/2}
        y={bodyTop}
        width={candleWidth}
        height={Math.max(bodyHeight, 1)}
        fill={color}
      />
    </g>
  );
}

export default function AdvancedForexChart() {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [quoteCurrency, setQuoteCurrency] = useState('GBP');
  const [timeframe, setTimeframe] = useState('1M');
  const [isLineChart, setIsLineChart] = useState(false);
  const [rawData, setRawData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const chartHeight = useBreakpointValue({ base: 300, md: 500 });

  useEffect(() => {
    fetch('/chart-data/exchange_rates_data.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load exchange rate data');
        return res.json();
      })
      .then((jsonData) => {
        setRawData(jsonData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
        setIsLoading(false);
      });
  }, []);

  const allCurrencies = useMemo(() => {
    return [
      ...AVAILABLE_CURRENCIES.FIAT,
      ...AVAILABLE_CURRENCIES.CRYPTO,
      ...AVAILABLE_CURRENCIES.METALS,
    ];
  }, []);

  const chartData = useMemo(() => {
    if (!rawData || !rawData.length) return [];

    const filtered = rawData.filter(
      (item) => item.from_currency === baseCurrency && item.to_currency === quoteCurrency
    );

    return filtered.map((item) => {
      const dayStr = new Date(item.timestamp).toISOString().split('T')[0]; 

      return {
        day: dayStr, 
        open: item.open_rate,
        high: item.high_rate,
        low: item.low_rate,
        close: item.rate,
      };
    })
    .sort((a, b) => (a.day > b.day ? 1 : -1));
  }, [rawData, baseCurrency, quoteCurrency]);

  const finalData = useMemo(() => {
    if (!chartData.length) return [];
    if (timeframe === 'All') return chartData;
    const daysToShow = timeframeDaysMap[timeframe] || 30;
    return chartData.slice(-daysToShow);
  }, [chartData, timeframe]);

  const switchCurrencies = () => {
    setBaseCurrency(quoteCurrency);
    setQuoteCurrency(baseCurrency);
  };

  const lineAnimationProps = {
    isAnimationActive: true,
    animationDuration: 700,
    animationEasing: 'ease-in-out',
  };

  return (
    <Box bg={bgColor} color={textColor} p={6} borderRadius="xl" w="full" boxShadow="md">
      <VStack spacing={4} align="stretch">
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error.message}
          </Alert>
        )}

        <HStack spacing={4}>
          <Select
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
            bg={useColorModeValue('gray.100', 'gray.700')}
          >
            {allCurrencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </Select>
          <Button onClick={switchCurrencies} variant="outline">
            <ArrowUpDown />
          </Button>
          <Select
            value={quoteCurrency}
            onChange={(e) => setQuoteCurrency(e.target.value)}
            bg={useColorModeValue('gray.100', 'gray.700')}
          >
            {allCurrencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </Select>
        </HStack>

        <HStack spacing={2} wrap="wrap">
          {Object.keys(timeframeDaysMap).map((tf) => (
            <Button
              key={tf}
              size="sm"
              onClick={() => setTimeframe(tf)}
              variant={timeframe === tf ? 'solid' : 'outline'}
            >
              {tf}
            </Button>
          ))}
          <Button size="sm" onClick={() => setIsLineChart(!isLineChart)} variant="ghost">
            {isLineChart ? <CandlestickChart size={16} /> : <LineChart size={16} />}
          </Button>
        </HStack>

        {isLoading ? (
          <Spinner />
        ) : !finalData.length ? (
          <Text>No historical data available for this pair.</Text>
        ) : (
          <Box height={chartHeight} width="full">
            <ResponsiveContainer>
              <ComposedChart
                data={finalData}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <SimpleGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  type="category"
                  scale="band"
                  stroke={textColor}
                />
                <YAxis
                stroke={textColor}
                domain={[(dataMin) => dataMin * 0.995, (dataMax) => dataMax * 1.005]} // Add padding
                tickFormatter={(val) => formatPrice(val, quoteCurrency)}
              />
                <Tooltip
                  contentStyle={{
                    backgroundColor: bgColor,
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(label) => label}
                  formatter={(value) => formatPrice(value, quoteCurrency)}
                />
                <Legend />

                {isLineChart ? (
                  <Line
                    dataKey="close"
                    stroke="#84d8bf"
                    dot={false}
                    type="monotone"
                    {...lineAnimationProps}
                  />
                ) : (
                  <Bar
                    dataKey="high" // Use high as primary data key
                    fill="transparent"
                    isAnimationActive={false}
                    shape={<CandleBarShape />}
                    barCategoryGap="40%"
                    barSize={20} // Control overall bar width
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        )}
      </VStack>
    </Box>
  );
}