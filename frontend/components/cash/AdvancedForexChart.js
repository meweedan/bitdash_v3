import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Select,  
  SimpleGrid,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Text,
  useColorModeValue,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line
} from 'recharts';
import { ArrowUpDown, LineChart, CandlestickChart, ZoomOut, ZoomIn } from 'lucide-react';

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
  
  if (!payload || !height) return null;

  // Extract OHLC values correctly from payload
  const open = payload.open;
  const high = payload.high;
  const low = payload.low;
  const close = payload.close;
  
  // TradingView colors
  const color = close >= open ? '#26a69a' : '#ef5350';
  
  // Calculate positions within the allocated space
  const maxPrice = Math.max(high, low);
  const minPrice = Math.min(high, low);
  const priceRange = maxPrice - minPrice;
  
  // Convert prices to y-coordinates
  const getY = (price) => {
    return y + (maxPrice - price) / priceRange * height;
  };

  const highY = getY(high);
  const lowY = getY(low);
  const openY = getY(open);
  const closeY = getY(close);
  
  const candleWidth = Math.min(width * 0.75, 8); // TradingView width

  return (
    <g>
      {/* Wick */}
      <line
        x1={x + width/2}
        y1={highY}
        x2={x + width/2}
        y2={lowY}
        stroke={color}
        strokeWidth={1}
      />
      
      {/* Body */}
      <rect
        x={x + (width - candleWidth)/2}
        y={Math.min(openY, closeY)}
        width={candleWidth}
        height={Math.max(Math.abs(openY - closeY), 1)}
        fill={color}
      />
    </g>
  );
}

export default function AdvancedForexChart() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
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
    let data = timeframe === 'All' ? chartData : chartData.slice(-timeframeDaysMap[timeframe]);
    
    // Apply zoom
    const visibleItems = Math.floor(data.length / zoomLevel);
    return data.slice(visibleStartIndex, visibleStartIndex + visibleItems);
  }, [chartData, timeframe, zoomLevel, visibleStartIndex]);

   const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 1));

  // Navigation controls
  const handleScroll = (direction) => {
    setVisibleStartIndex(prev => Math.max(0, 
      direction === 'left' ? prev - 10 : prev + 10
    ));
  };

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
          <Box height={chartHeight} width="full" position="relative">
            {/* Zoom controls */}
            <HStack position="absolute" top={2} right={4} zIndex={1}>
              <IconButton
                icon={<ZoomOut size={16} />}
                onClick={handleZoomOut}
                size="sm"
                aria-label="Zoom out"
              />
              <IconButton
                icon={<ZoomIn size={16} />}
                onClick={handleZoomIn}
                size="sm"
                aria-label="Zoom in"
              />
            </HStack>

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
                    dataKey="high"
                    fill="transparent"
                    isAnimationActive={false}
                    shape={<CandleBarShape />}
                    barCategoryGap={20}
                    barSize={14}
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