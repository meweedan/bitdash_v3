// pages/crypto-exchange.js

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  colorMode,
  VStack,
  HStack,
  Flex,
  useColorModeValue,
  Icon,
  Grid,
  GridItem,
  Spinner,
  useBreakpointValue,
  Stack,
  useColorMode,
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Select,
  Slider,
  useDisclosure,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Skeleton,
  Avatar,
  Link
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FaSearch,
  FaStar,
  FaCreditCard,
  FaWallet,
  FaClipboard,
  FaQrcode,
  FaChevronLeft,
  FaChevronRight,
  FaRegClock,
  FaSync,
  FaChartLine,
  FaArrowDown,
  FaArrowUp,
  FaNewspaper,
  FaGlobe,
  FaCog,
  FaExternalLinkAlt
} from 'react-icons/fa';
import CryptoNews from '@/components/crypto/CryptoNews';
import TradeForm from '@/components/crypto/TradeForm'; // Ensure you have this component defined

// DYNAMIC IMPORT: Candlestick chart from ApexCharts (no SSR)
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// --- Helper Format Functions ---
function formatPrice(p) {
  if (!p) return '0.00';
  if (p < 1) return p.toFixed(6);
  if (p < 10) return p.toFixed(4);
  if (p < 1000) return p.toFixed(2);
  return p.toFixed(2);
}

function formatPercent(num) {
  if (!num) return '0.00%';
  return num > 0 ? `+${num.toFixed(2)}%` : `${num.toFixed(2)}%`;
}

function formatCompactNumber(num) {
  if (!num) return '0';
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toFixed(0);
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// --- Top Coins Ticker ---
function TopCoinsTicker() {
  const { t } = useTranslation('common');
  const [coins, setCoins] = useState([]);
  const bg = useColorModeValue('gray.100', 'gray.700');

  // Update ticker every 30 seconds
  useEffect(() => {
    async function fetchTopCoins() {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false'
        );
        if (!res.ok) throw new Error('Failed fetching ticker data.');
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchTopCoins();
    const interval = setInterval(fetchTopCoins, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box borderRadius="md" boxShadow="sm" overflowX="auto" mb={4}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>{t('pair', 'Pair')}</Th>
            <Th isNumeric>{t('price', 'Price')}</Th>
            <Th isNumeric>{t('24h_change', '24h Change')}</Th>
            <Th>{t('actions', 'Actions')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {coins.length === 0 ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <Tr key={i}>
                  <Td><Skeleton height="20px" width="100px" /></Td>
                  <Td><Skeleton height="20px" width="80px" /></Td>
                  <Td><Skeleton height="20px" width="70px" /></Td>
                  <Td><Skeleton height="20px" width="100px" /></Td>
                </Tr>
              ))
          ) : (
            coins.map(coin => (
              <Tr key={coin.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                <Td>
                  <HStack spacing={2}>
                    <Avatar src={coin.image} size="xs" />
                    <Text fontWeight="medium">{coin.symbol.toUpperCase()}/USDT</Text>
                  </HStack>
                </Td>
                <Td isNumeric fontWeight="medium">${formatPrice(coin.current_price)}</Td>
                <Td isNumeric>
                  <Text color={coin.price_change_percentage_24h >= 0 ? 'green.500' : 'red.500'} fontWeight="medium">
                    {formatPercent(coin.price_change_percentage_24h)}
                  </Text>
                </Td>
                <Td>
                  <Button size="xs" variant="crypto-solid">
                    {t('crypto.trade', 'Trade')}
                  </Button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
}

// --- Main CryptoExchange Page ---
function CryptoExchange() {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation('common');

  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  // Use brand colors and custom variants (assumed to be in your theme)
  const panelBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.300');
  const textColorPrimary = useColorModeValue('gray.800', 'gray.100');
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const dark = colorMode === 'dark';

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState('1d');
  const [favoritePairs, setFavoritePairs] = useState([]);
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartTimeframe, setChartTimeframe] = useState('1D');
  const [orderSide, setOrderSide] = useState('buy');
  const [loading, setLoading] = useState(true);
  const [orderType, setOrderType] = useState('limit');
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [recentTrades, setRecentTrades] = useState([]);
  const [tradeAmount, setTradeAmount] = useState(0);
  const [tradePrice, setTradePrice] = useState(0);
  const [line, setLine] = useState(false);
  const [vol, setVol] = useState(true);
  const [leverage, setLeverage] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [err, setErr] = useState('');
  const [noData, setNoData] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [idx, setIdx] = useState(0);
  const [selectedPair, setSelectedPair] = useState('');

  const win = useMemo(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 768,
    height: typeof window !== 'undefined' ? window.innerHeight : 600
  }), []);
  const isLargeScreen = useBreakpointValue({ base: false, lg: true });
  const mb = win.width < 768;
  const chartH = mb ? Math.min(350, win.height * 0.5) : 600;
  const volH = mb ? 10 : 10;

  const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure();

  // --- Fetch Coins for Market List with Polling ---
  useEffect(() => {
    async function fetchCoins() {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false'
        );
        if (!res.ok) throw new Error('Failed fetching market data.');
        const data = await res.json();
        setCoins(data);
        // Set the first coin as default if none is selected
        if (!selectedCoin && data.length > 0) {
          setSelectedCoin(data[0]);
          setTradePrice(data[0].current_price);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    fetchCoins();
    const interval = setInterval(fetchCoins, 30000);
    return () => clearInterval(interval);
  }, [selectedCoin]);

  const toggleFavorite = coinId => {
    setFavoritePairs(prev =>
      prev.includes(coinId) ? prev.filter(id => id !== coinId) : [...prev, coinId]
    );
  };

  const filteredCoins = coins.filter(coin =>
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Fetch Chart Data ---
  useEffect(() => {
    if (!selectedCoin) return;
    setChartLoading(true);
    (async () => {
      try {
        let days = 1;
        // Map longer-term timeframes to number of days
        if (['1W', '1M', '3M', '6M', '1Y', 'All'].includes(chartTimeframe)) {
          const longtermMap = {
            '1W': 7,
            '1M': 30,
            '3M': 90,
            '6M': 180,
            '1Y': 365,
            'All': 3650 // Use a large number for "All"
          };
          days = longtermMap[chartTimeframe];
        }
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${selectedCoin.id}/ohlc?vs_currency=usd&days=${days}`
        );
        if (!res.ok) throw new Error('Failed fetching OHLC data.');
        const data = await res.json();
        const formatted = data.map(entry => ({
          x: new Date(entry[0]).getTime(),
          y: [entry[1], entry[2], entry[3], entry[4]],
          timestamp: entry[0],
          open: entry[1],
          high: entry[2],
          low: entry[3],
          close: entry[4],
          // Generate a mock volume value as OHLC endpoint does not include volume
          volume: Math.random() * 1000000
        }));
        setChartData(formatted);
      } catch (error) {
        console.error(error);
        setErr(error.message);
      }
      setChartLoading(false);
    })();
  }, [selectedCoin, chartTimeframe]);

  const stats = useMemo(() => {
    if (!chartData.length || noData) {
      return {
        currentPrice: 0,
        priceChangePercent: 0,
        isPriceUp: false,
        high24h: 0,
        low24h: 0
      };
    }
    const cp = chartData[chartData.length - 1].y[3];
    const prev = chartData.length > 1 ? chartData[chartData.length - 2].y[3] : cp;
    const change = cp - prev;
    return {
      currentPrice: cp,
      priceChangePercent: prev ? (change / prev) * 100 : 0,
      isPriceUp: change >= 0,
      high24h: selectedCoin?.high_24h || 0,
      low24h: selectedCoin?.low_24h || 0
    };
  }, [chartData, noData, selectedCoin]);

  const fp = n => (n ? n.toFixed(2) : '0.00');

  // Timeframe buttons for chart
  const renderTimeframeButtons = () => {
    const timeframes = ['5m', '15m', '1h', '4h', '1D', '1W', '1M'];
    return (
      <HStack spacing={2} wrap="wrap">
        {timeframes.map(interval => (
          <Button
            key={interval}
            size="xs"
            variant={chartTimeframe === interval ? 'crypto-solid' : 'crypto-outline'}
            onClick={() => setChartTimeframe(interval)}
          >
            {interval}
          </Button>
        ))}
      </HStack>
    );
  };

  // Simple scroll and zoom logic (mock implementation)
  const scroll = dir => {
    if (noData) return;
    const s = Math.max(1, Math.floor(chartData.length / 20));
    setIdx(prev => {
      if (dir === 'left') return Math.max(0, prev - s);
      const mx = Math.max(0, chartData.length - Math.floor(chartData.length / zoomLevel));
      return Math.min(mx, prev + s);
    });
  };

  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 4));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 1));

  // Build chart series based on chartData and user selections
  const mainSeries = useMemo(() => {
    let d = chartData;
    if (!d.length) return [];
    const priceSeries = {
      name: 'Price',
      type: line ? 'line' : 'candlestick',
      data: d.map(x => ({ 
        x: x.x, 
        y: line ? x.y[3] : x.y 
      })),
      color: 'blue'
    };
    if (vol && selectedCoin && !noData) {
      const volumeSeries = {
        name: 'Volume',
        type: 'bar',
        data: d.map(x => ({
          x: x.x,
          y: x.volume,
          fillColor: x.y[3] >= x.y[0] ? 'green' : 'red'
        }))
      };
      return [priceSeries, volumeSeries];
    }
    return [priceSeries];
  }, [chartData, line, vol, noData, selectedCoin]);

  const chartOptions = useMemo(() => ({
    chart: {
      type: line ? 'line' : 'candlestick',
      height: chartH,
      background: 'transparent',
      toolbar: { show: true },
      zoom: { enabled: true },
      animations: { enabled: false }
    },
    plotOptions: {
      candlestick: {
        colors: { upward: '#26A69A', downward: '#EF5350' },
        wick: { useFillColor: true }
      },
      bar: { columnWidth: '80%' }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        show: true,
        style: { colors: dark ? '#B2B5BE' : '#555', fontSize: '10px' },
        formatter: v => {
          const dt = new Date(v);
          return selectedInterval === '1d'
            ? dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            : dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        }
      },
      axisBorder: { show: true, color: dark ? '#363C4E' : '#E7E7E7' },
      axisTicks: { show: true, color: dark ? '#363C4E' : '#E7E7E7' },
      tooltip: { enabled: true }
    },
    yaxis: [
      {
        show: true,
        labels: { 
          show: true,
          style: { colors: dark ? '#B2B5BE' : '#555', fontSize: '10px' },
          formatter: val => fp(val)
        },
        axisBorder: { show: true, color: dark ? '#363C4E' : '#E7E7E7' },
        tooltip: { enabled: true }
      },
      {
        show: vol && selectedCoin && !noData,
        opposite: true,
        labels: { 
          show: true,
          style: { colors: dark ? '#B2B5BE' : '#555', fontSize: '10px' },
          formatter: val => val >= 1e6 ? (val/1e6).toFixed(1)+'M' : (val/1e3).toFixed(0)+'K'
        }
      }
    ],
    tooltip: {
      enabled: true,
      theme: dark ? 'dark' : 'light',
      style: { fontSize: '12px' }
    }
  }), [line, chartH, dark, selectedInterval, vol, selectedCoin, noData]);

  return (
    <Layout>
    <Box minH="100vh" width="100%" pb={8}>
      <Container maxW="8xl" width="100%" pt={{ base: 2, md: 4 }}>
        {/* Mobile Search Button */}
        {!isLargeScreen && (
          <Button
            w="full"
            leftIcon={<FaSearch />}
            mb={4}
            onClick={onSearchOpen}
            variant="crypto-outline"
            colorScheme="crypto-outline"
          >
            {t('search_markets', 'Search Markets')}
          </Button>
        )}

        {/* Market Search Modal (Mobile) */}
        <Modal isOpen={isSearchOpen} onClose={onSearchClose} size="lg" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color="brand.crypto.600">{t('search_markets', 'Search Markets')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaSearch} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    placeholder={t('search_by_name_or_symbol', 'Search by name or symbol')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </InputGroup>
                <Box borderTopWidth="1px" borderColor={borderColor} pt={4} width="100%">
                  <Tabs isFitted variant="enclosed" colorScheme="crypto-solid">
                    <TabList mb={2}></TabList>
                    <TabPanels>
                      <TabPanel p={0}>
                        <TableContainer maxH="400px" overflowY="auto">
                          <Table size="sm" variant="simple">
                            <Thead>
                              <Tr>
                                <Th>{t('name', 'Name')}</Th>
                                <Th isNumeric>{t('price', 'Price')}</Th>
                                <Th isNumeric>{t('24h_change', '24h Change')}</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {filteredCoins.map(coin => (
                                <Tr
                                  key={coin.id}
                                  _hover={{ bg: 'gray.50' }}
                                  cursor="pointer"
                                  onClick={() => {
                                    setSelectedCoin(coin);
                                    onSearchClose();
                                  }}
                                >
                                  <Td>
                                    <HStack>
                                      <Avatar src={coin.image} />
                                      <VStack spacing={1} align="start">
                                        <Text fontWeight="medium">{coin.symbol.toUpperCase()}</Text>
                                        <Text fontSize="xs" color="gray.500">{coin.name}</Text>
                                      </VStack>
                                    </HStack>
                                  </Td>
                                  <Td isNumeric fontWeight="medium">${formatPrice(coin.current_price)}</Td>
                                  <Td isNumeric>
                                    <Text color={coin.price_change_percentage_24h >= 0 ? 'green.500' : 'red.500'}>
                                      {formatPercent(coin.price_change_percentage_24h)}
                                    </Text>
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </TableContainer>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </Box>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* MAIN TRADING INTERFACE */}
        <Grid templateColumns={{ base: '1fr', lg: '300px 1fr 300px' }} gap={2}>
          {/* LEFT SIDEBAR: Market List */}
          {isLargeScreen && (
            <GridItem>
              <VStack spacing={4} align="stretch">
                <Box borderRadius="md" borderWidth="1px" borderColor={borderColor} boxShadow="sm" overflow="hidden">
                  <Tabs size="sm" variant="enclosed" colorScheme="crypto-solid">
                    <Box p={3}>
                      <InputGroup size="sm" mb={2}>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FaSearch} color="gray.500" />
                        </InputLeftElement>
                        <Input
                          placeholder={t('search_markets', 'Search markets')}
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          borderRadius="md"
                        />
                      </InputGroup>
                    </Box>
                    <Box maxH="calc(100vh - 360px)" overflowY="hidden">
                      <TableContainer>
                        <Table size="sm" variant="simple">
                          <Thead bg={useColorModeValue('gray.100', 'gray.900')}>
                            <Tr>
                              <Th>{t('pair', 'Pair')}</Th>
                              <Th isNumeric>{t('price', 'Price')}</Th>
                              <Th isNumeric>{t('change', 'Change')}</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {filteredCoins.map(coin => (
                              <Tr
                                key={coin.id}
                                cursor="pointer"
                                onClick={() => setSelectedCoin(coin)}
                                bg={selectedCoin && selectedCoin.id === coin.id ? useColorModeValue('brand.crypto.500', 'brand.crypto.700') : 'transparent'}
                                _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                              >
                                <Td>
                                  <HStack>
                                    <Text fontWeight="medium">{coin.symbol.toUpperCase()}</Text>
                                  </HStack>
                                </Td>
                                <Td isNumeric>
                                  <Text fontWeight="medium">${formatPrice(coin.current_price)}</Text>
                                </Td>
                                <Td isNumeric py={2}>
                                  <Text fontSize="xs" color={coin.price_change_percentage_24h >= 0 ? 'green.500' : 'red.500'}>
                                    {formatPercent(coin.price_change_percentage_24h)}
                                  </Text>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </Tabs>
                </Box>

                {/* Market Overview */}
                {selectedCoin && (
                  <Box borderRadius="md" borderWidth="1px" borderColor={borderColor} boxShadow="sm" p={3}>
                    <Heading size="xs" mb={3} color="brand.crypto.600">
                      {t('market_info', 'Market Info')}
                    </Heading>
                    <Stack spacing={2}>
                      <HStack justify="space-between">
                        <Text fontSize="xs" color={textColorSecondary}>{t('24h_high', '24h High')}</Text>
                        <Text fontSize="xs" fontWeight="bold">${formatPrice(selectedCoin.high_24h)}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="xs" color={textColorSecondary}>{t('24h_low', '24h Low')}</Text>
                        <Text fontSize="xs" fontWeight="bold">${formatPrice(selectedCoin.low_24h)}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="xs" color={textColorSecondary}>{t('24h_volume', '24h Volume')}</Text>
                        <Text fontSize="xs" fontWeight="bold">${formatCompactNumber(selectedCoin.total_volume)}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="xs" color={textColorSecondary}>{t('market_cap', 'Market Cap')}</Text>
                        <Text fontSize="xs" fontWeight="bold">${formatCompactNumber(selectedCoin.market_cap)}</Text>
                      </HStack>
                    </Stack>
                  </Box>
                )}
              </VStack>
            </GridItem>
          )}
          
          {/* MAIN PANEL: Chart and Trading Activity */}
          <GridItem>
            <VStack spacing={4} align="stretch">
              {/* Selected Coin Header */}
              {selectedCoin && (isLargeScreen || activeTab === 0 || activeTab === 1) && (
                <Box borderRadius="md" p={3} borderWidth="1px" bg={useColorModeValue('gray.100', 'gray.900')}>
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                    <GridItem>
                      <HStack>
                        <Box boxSize="14">
                          <Avatar src={selectedCoin.image} />
                        </Box>
                        <VStack align="stretch" spacing={0}>
                          <HStack>
                            <Heading size="md">{selectedCoin.symbol.toUpperCase()}/USDT</Heading>
                          </HStack>
                          <Text fontSize="sm" color={useColorModeValue('black', 'white')}>
                            {selectedCoin.name} • {t('rank', 'Rank')} #{selectedCoin.market_cap_rank}
                          </Text>
                        </VStack>
                      </HStack>
                    </GridItem>
                    <GridItem>
                      <Flex justify={{ base: 'flex-start', md: 'flex-end' }} align="center">
                        <VStack align={{ base: 'start', md: 'end' }} spacing={0}>
                          <Heading size="md" color={selectedCoin.price_change_percentage_24h >= 0 ? 'green.500' : 'red.500'}>
                            ${formatPrice(selectedCoin.current_price)}
                          </Heading>
                          <HStack>
                            <Badge
                              colorScheme={selectedCoin.price_change_percentage_24h >= 0 ? 'green' : 'red'}
                              variant="subtle"
                              px={2}
                              py={0.5}
                              borderRadius="full"
                            >
                              <HStack spacing={1}>
                                <Icon as={selectedCoin.price_change_percentage_24h >= 0 ? FaArrowUp : FaArrowDown} boxSize={3} />
                                <Text fontSize="xs" color={useColorModeValue('black', 'white')}>
                                  {formatPercent(selectedCoin.price_change_percentage_24h)}
                                </Text>
                              </HStack>
                            </Badge>
                            <Text fontSize="xs" color={textColorSecondary}>
                              {t('24h', '24h')}
                            </Text>
                          </HStack>
                        </VStack>
                      </Flex>
                    </GridItem>
                  </Grid>
                </Box>
              )}

              {/* Chart Panel */}
              {(isLargeScreen || activeTab === 0) && (
                <Box borderRadius="md" borderWidth="1px" borderColor={borderColor} boxShadow="sm" overflow="hidden">
                  <HStack p={3} borderBottomWidth="1px" borderBottomColor={borderColor} justify="space-between">
                    <HStack spacing={2} wrap="wrap">
                      {['5m', '15m', '1h', '4h', '1D', '1W', '1M'].map(interval => (
                        <Button
                          key={interval}
                          size="xs"
                          variant={chartTimeframe === interval ? 'crypto-solid' : 'crypto-outline'}
                          colorScheme="crypto-solid"
                          onClick={() => setChartTimeframe(interval)}
                        >
                          {interval}
                        </Button>
                      ))}
                    </HStack>
                    <HStack>
                      <IconButton icon={<FaCog />} size="sm" variant="crypto-outline" aria-label={t('chart_settings', 'Chart settings')} />
                      <IconButton icon={<FaChartLine />} size="sm" variant="crypto-outline" aria-label={t('full_screen_chart', 'Full screen chart')} />
                    </HStack>
                  </HStack>
                  <Box p={2} h="400px" position="relative">
                    {chartLoading ? (
                      <Flex justify="center" align="center" h="100%">
                        <Spinner size="xl" color="brand.crypto.400" />
                      </Flex>
                    ) : (
                      chartData.length > 0 && (
                        <Chart
                          options={chartOptions}
                          series={[{ data: mainSeries[0].data }]}
                          type={line ? 'line' : 'candlestick'}
                          height="100%"
                          width="100%"
                        />
                      )
                    )}
                    {vol && selectedCoin && !noData && mainSeries.length > 1 && (
                      <Box position="absolute" bottom={0} width="100%" height={`${volH}px`}>
                        <Chart
                          options={{
                            ...chartOptions,
                            chart: { ...chartOptions.chart, height: volH, id: 'volume-chart' },
                            xaxis: { ...chartOptions.xaxis, labels: { ...chartOptions.xaxis.labels, show: false } },
                            yaxis: [{
                              labels: {
                                show: true,
                                style: { colors: dark ? '#B2B5BE' : '#555', fontSize: '1px' },
                                formatter: v => v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : (v / 1e3).toFixed(0) + 'K',
                              },
                              opposite: false
                            }],
                            tooltip: { enabled: true }
                          }}
                          series={[{ data: mainSeries[1].data }]}
                          type="bar"
                          height={volH}
                          width="100%"
                        />
                      </Box>
                    )}
                    {!loading && noData && (
                      <Flex
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        direction="column"
                        align="center"
                        bg="rgba(0,0,0,0.7)"
                        p={4}
                        borderRadius="md"
                      >
                        <Text fontSize="4xl" fontWeight="bold" mb={2}>404</Text>
                        <Text>
                          No data available for {selectedPair} ({selectedInterval}) in timeframe {chartTimeframe}
                        </Text>
                      </Flex>
                    )}
                  </Box>
                </Box>
              )}

              <Box mt={4} p={4} bg={isDark ? 'gray.800' : 'white'} zIndex={1}>
                <CryptoNews 
                  coinId={selectedCoin?.id} 
                  coinSymbol={selectedCoin?.symbol?.toUpperCase()} 
                />
              </Box>
            </VStack>
          </GridItem>

          {/* RIGHT SIDEBAR: Order Book & More (if on desktop) */}
          {isLargeScreen && (
            <GridItem>
              <VStack spacing={4} align="stretch">
                <Box borderRadius="md" borderWidth="1px" borderColor={borderColor} boxShadow="sm" p={3}>
                  <Tabs variant="enclosed" size="sm" colorScheme="crypto-solid">
                    <TabList mb={3}>
                      <Tab>{t('spot', 'Spot')}</Tab>
                      <Tab>{t('margin', 'Margin')}</Tab>
                      <Tab>{t('futures', 'Futures')}</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel p={0}>
                        {/* Order Form inline for desktop */}
                        <TradeForm 
                          selectedCoin={selectedCoin} 
                          initialTradePrice={selectedCoin?.current_price}
                          onSubmit={(data) => console.log("Trade submitted:", data)}
                        />
                      </TabPanel>
                      <TabPanel p={0}>
                        <Box textAlign="center" py={8}>
                          <Icon as={FaRegClock} boxSize={10} color="gray.300" mb={4} />
                          <Text>{t('no_open_orders', 'No open orders')}</Text>
                          <Button mt={4} variant="crypto-solid" size="sm">
                            {t('view_order_history', 'View Order History')}
                          </Button>
                        </Box>
                      </TabPanel>
                      <TabPanel p={0}>
                        <VStack spacing={3} align="stretch">
                          <HStack>
                            <Text fontSize="sm" fontWeight="medium">{t('futures_leverage', 'Futures Leverage')}</Text>
                            <Text fontSize="sm" fontWeight="bold" color="brand.crypto.400">{leverage}x</Text>
                          </HStack>
                          <Slider
                            defaultValue={1}
                            min={1}
                            max={20}
                            step={1}
                            colorScheme="crypto-solid"
                            value={leverage}
                            onChange={(val) => setLeverage(val)}
                          >
                            <SliderTrack>
                              <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb boxSize={4} />
                          </Slider>
                          <Text fontSize="xs" color="brand.crypto.500">
                            {t('futures_leverage_available', 'Up to 20x leverage available for futures trading')}
                          </Text>
                        </VStack>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </Box>

                {/* Order Book */}
                <Box borderRadius="md" borderWidth="1px" borderColor={borderColor} boxShadow="sm" p={3}>
                  <Heading size="xs" mb={3} color="brand.crypto.600">{t('order_book', 'Order Book')}</Heading>
                  <VStack spacing={2} align="stretch">
                    <Text fontSize="xs" color={textColorSecondary}>{t('asks', 'Asks')}</Text>
                    {orderBook.asks && orderBook.asks.slice(0, 5).map((ask, i) => (
                      <HStack key={i} justify="space-between" fontSize="xs">
                        <Text color="red.500">${formatPrice(ask.price)}</Text>
                        <Text>{ask.amount.toFixed(4)}</Text>
                        <Text>${formatCompactNumber(ask.total)}</Text>
                      </HStack>
                    ))}
                    <Divider />
                    {/* Current price indicator */}
                    <Flex 
                      justify="space-between" 
                      bg={selectedCoin?.price_change_percentage_24h >= 0 ? 'green.50' : 'red.50'} 
                      p={1} 
                      borderRadius="md"
                    >
                      <Text fontWeight="bold" color={selectedCoin?.price_change_percentage_24h >= 0 ? 'green.500' : 'red.500'}>
                        ${selectedCoin ? formatPrice(selectedCoin.current_price) : '0.00'}
                      </Text>
                      <Text fontSize="xs" color="gray.500">≈ ${formatCompactNumber(selectedCoin?.current_price || 0)}</Text>
                    </Flex>
                    <Divider />
                    <Text fontSize="xs" color={textColorSecondary}>{t('bids', 'Bids')}</Text>
                    {orderBook.bids && orderBook.bids.slice(0, 5).map((bid, i) => (
                      <HStack key={i} justify="space-between" fontSize="xs">
                        <Text color="green.500">${formatPrice(bid.price)}</Text>
                        <Text>{bid.amount.toFixed(4)}</Text>
                        <Text>${formatCompactNumber(bid.total)}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              </VStack>
            </GridItem>
          )}
        </Grid>
      </Container>
    </Box>
    </Layout>
  );
}

export default CryptoExchange;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await import('next-i18next/serverSideTranslations').then(({ serverSideTranslations }) =>
        serverSideTranslations(locale, ['common'])
      ))
    }
  };
}
