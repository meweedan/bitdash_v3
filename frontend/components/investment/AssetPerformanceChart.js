import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  HStack,
  VStack,
  Button,
  Select,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaChartLine, FaCoins } from 'react-icons/fa'; 
// (You can add more icons if you want)

const HYPOTHETICAL_INVESTMENT = 10000; // $10,000
const TIMEFRAME_DAYS = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365 };

// Restrict to these categories & symbols (all real data files must exist):
const ASSET_SYMBOLS = {
  stocks: ['AAPL', 'MSFT', 'SAP.DE'],       // US + EU stocks
  gold: ['GLD', 'XAU'],                    // Gold ETF + Spot gold
  etfs: ['SPY', 'QQQ', 'VTI', 'DIA'],      // Popular US ETFs/Indices
};

// Give each category a nice label & optional icon
const ASSET_LABELS = {
  gold:   { name: 'Gold & Precious Metals', icon: FaCoins },
  stocks: { name: 'US & EU Stocks', icon: FaChartLine },
  etfs:   { name: 'ETFs & Indices', icon: FaChartLine },
};

const AssetPerformanceFOMO = () => {
  const [assetType, setAssetType] = useState('gold'); // default category
  const [timeframe, setTimeframe] = useState('1M');     // 1M, 3M, 6M, 1Y
  const [data, setData] = useState([]);                // normalized data
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chakra color mode values
  const bgColor     = useColorModeValue('white', 'gray.800');
  const textColor   = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // We’ll pick the first symbol from the category for demonstration,
  // or you could let the user pick from multiple in each category:
  const symbol = ASSET_SYMBOLS[assetType][0];

  // --- Data Fetch & Processing (Real data only, no fallback) ---
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      setData([]);

      try {
        // For real data, we assume a daily .json file like: /public/chart-data/SYMBOL_1d.json
        const fileUrl = `/chart-data/${symbol}_1d.json`;
        
        // Check if file is actually there
        const headResp = await fetch(fileUrl, { method: 'HEAD' });
        if (!headResp.ok) {
          throw new Error(`No data file found for ${symbol} at ${fileUrl}`);
        }

        // If file exists, fetch full JSON
        const resp = await fetch(fileUrl);
        if (!resp.ok) {
          throw new Error(`File exists but fetch failed: ${resp.status}`);
        }
        const rawData = await resp.json();

        // 1) Sort by ascending timestamp
        rawData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        // 2) Slice the last N days based on timeframe
        const days = TIMEFRAME_DAYS[timeframe];
        const sliced = rawData.slice(-days);

        if (sliced.length === 0) {
          throw new Error(`Not enough data for timeframe ${timeframe}`);
        }

        // 3) Normalize so the FIRST close is "100"
        const firstClose = sliced[0].close;
        const normalizedData = sliced.map(d => ({
          date: d.timestamp,
          value: (d.close / firstClose) * 100,
        }));

        setData(normalizedData);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setIsLoading(false);
      }
    }

    fetchData();
  }, [assetType, timeframe, symbol]);

  // --- If loading or error, show a small box (similar width to your prior component) ---
  if (isLoading) {
    return (
      <Box
        w="full"
        maxW="4xl"  // same as your previous code
        mx="auto"    // center on desktop
        bg={bgColor}
        borderRadius="xl"
        boxShadow="lg"
        p={6}
        borderWidth="1px"
        borderColor={borderColor}
        textAlign="center"
      >
        <Spinner size="xl" color="brand.bitinvest.400" />
        <Text mt={4}>Loading data for {symbol}...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        w="full"
        maxW="4xl"
        mx="auto"
        bg={bgColor}
        borderRadius="xl"
        boxShadow="lg"
        p={6}
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Alert status="error" variant="left-accent">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box
        w="full"
        maxW="4xl"
        mx="auto"
        bg={bgColor}
        borderRadius="xl"
        boxShadow="lg"
        p={6}
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Alert status="warning" variant="left-accent">
          <AlertIcon />
          No data found for {symbol} / {timeframe}
        </Alert>
      </Box>
    );
  }

  // --- Compute FOMO stats ---
  const firstVal = data[0].value;
  const lastVal  = data[data.length - 1].value;

  const pctChange = ((lastVal - firstVal) / firstVal) * 100;
  const isPositive = pctChange >= 0;

  // If you had invested $10k at the start:
  // Start = 100 => End = lastVal => scale by 10k
  const hypotheticalNow = (HYPOTHETICAL_INVESTMENT * lastVal) / 100;
  const netGainLoss = hypotheticalNow - HYPOTHETICAL_INVESTMENT;
  
  // Asset category label & icon
  const { name: assetLabel, icon: AssetIcon } = ASSET_LABELS[assetType];

  return (
    <Box
      w="full"
      maxW="4xl"
      mx="auto"
      bg={bgColor}
      borderRadius="xl"
      boxShadow="lg"
      p={6}
      borderWidth="1px"
      borderColor={borderColor}
    >
      {/* Header */}
      <Flex justify="space-between" align="center" mb={4} wrap="wrap">
        <HStack spacing={3} mb={{ base: 2, md: 0 }}>
          {AssetIcon && <Icon as={AssetIcon} color="brand.bitinvest.400" boxSize={5} />}
          <Heading size="md" color={textColor}>
            {assetLabel} ({symbol})
          </Heading>
        </HStack>

        {/* Controls */}
        <HStack spacing={3}>
          <Select
            size="sm"
            variant="filled"
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
          >
            <option value="gold">Gold</option>
            <option value="stocks">Stocks (US/EU)</option>
            <option value="etfs">ETFs & Indices</option>
          </Select>

          <HStack spacing={1}>
            {Object.keys(TIMEFRAME_DAYS).map(tf => (
              <Button
                key={tf}
                size="sm"
                variant={timeframe === tf ? 'bitinvest-solid' : 'bitinvest-outline'}
                colorScheme="brand.bitinvest"
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </Button>
            ))}
          </HStack>
        </HStack>
      </Flex>

      {/* FOMO Summary */}
      <Box
        borderRadius="md"
        p={4}
        bg={useColorModeValue('gray.50', 'gray.700')}
      >
        <VStack align="flex-start" spacing={3}>
          <Text fontSize="lg" color={textColor}>
            If you had invested{' '}
            <Text as="span" fontWeight="bold" color="brand.bitinvest.500">
              ${HYPOTHETICAL_INVESTMENT.toLocaleString()}
            </Text>{' '}
            in <Text as="span" fontWeight="semibold">{symbol}</Text> at the start of this {timeframe} period...
          </Text>

          <Text
            fontSize="xl"
            fontWeight="bold"
            color={isPositive ? 'brand.bitinvest.500' : 'brand.bitinvest.600'}
          >
            You&apos;d have 
            {' $'}
            {hypotheticalNow.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </Text>

          <Text color={isPositive ? 'green.400' : 'red.400'} fontWeight="semibold">
            That&apos;s a {isPositive ? '+' : '-'}
            {Math.abs(netGainLoss).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            {' '}
            overall!
          </Text>
        </VStack>
      </Box>

      {/* Quick Stats */}
      <HStack
        mt={6}
        bg={useColorModeValue('gray.100', 'gray.600')}
        p={4}
        borderRadius="md"
        justify="space-between"
        wrap="wrap"
        spacing={4}
      >
        <VStack align="start" spacing={0}>
          <Text fontSize="sm" color="gray.500">
            Initial (Normalized)
          </Text>
          <Text fontSize="lg" fontWeight="bold">
            {firstVal.toFixed(2)}
          </Text>
        </VStack>

        <VStack align="start" spacing={0}>
          <Text fontSize="sm" color="gray.500">
            Current (Normalized)
          </Text>
          <Text fontSize="lg" fontWeight="bold">
            {lastVal.toFixed(2)}
          </Text>
        </VStack>

        <VStack align="start" spacing={0}>
          <Text fontSize="sm" color="gray.500">
            % Change
          </Text>
          <Badge
            fontSize="md"
            colorScheme={isPositive ? 'green' : 'red'}
            px={2}
            py={1}
          >
            {isPositive ? '+' : ''}
            {pctChange.toFixed(2)}%
          </Badge>
        </VStack>
      </HStack>

      {/* Final CTA */}
      <Box mt={6} textAlign="center">
        <Text fontSize="md" color={textColor} fontWeight="semibold">
          Don&apos;t miss out again. Start investing smarter with BitInvest!
        </Text>
      </Box>
    </Box>
  );
};

export default AssetPerformanceFOMO;
