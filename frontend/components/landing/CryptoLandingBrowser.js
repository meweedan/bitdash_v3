// pages/crypto-exchange.js

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next'; // Remove if not using next-i18next
import dynamic from 'next/dynamic';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  useColorModeValue,
  Icon,
  Grid,
  GridItem,
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
  useDisclosure,
  Select
} from '@chakra-ui/react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  FaSearch,
  FaStar,
  FaCog,
  FaCreditCard,
  FaWallet,
  FaClipboard,
  FaQrcode,
  FaDollarSign
} from 'react-icons/fa';
import AdvancedChart from '@/components/AdvancedChart';

// DYNAMIC IMPORT: Candlestick chart from ApexCharts (no SSR).
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Simple example top-coins ticker from CoinGecko
function TopCoinsTicker() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    async function fetchTopCoins() {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets' +
            '?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
        );
        if (!res.ok) throw new Error('Failed fetching ticker data.');
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchTopCoins();
    // Optional: re-fetch every 60 seconds (or however often).
    const interval = setInterval(fetchTopCoins, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      bg={useColorModeValue('gray.100', 'gray.700')}
      borderRadius="md"
      p={2}
      overflow="hidden"
      whiteSpace="nowrap"
      mb={4}
    >
      <motion.div
        animate={{ x: ['100%', '-100%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'inline-flex' }}
      >
        {coins.map((coin) => (
          <HStack key={coin.id} spacing={2} mx={4}>
            <Box boxSize={5}>
              <img src={coin.image} alt={coin.name} />
            </Box>
            <Text fontWeight="bold">{coin.symbol.toUpperCase()}</Text>
            <Text color="green.400">${coin.current_price.toFixed(2)}</Text>
          </HStack>
        ))}
      </motion.div>
    </Box>
  );
}

// The main page
function CryptoExchange() {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation('common'); // Remove if not using next-i18next

  // For parallax effect on the hero (optional).
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const heroScale = useTransform(
    useSpring(scrollYProgress, { mass: 0.1, stiffness: 100, damping: 20 }),
    [0, 1],
    [1, 0.93]
  );

  // Adjust text direction & language
  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  // Color/theme usage
  const bgGradient = useColorModeValue('linear(to-b, gray.50, white)', 'linear(to-b, gray.900, black)');
  const panelBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');
  const { colorMode } = useColorMode();
  const dark = colorMode === 'dark';

  // States
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const intervals = ['5m','15m','1h','4h','1d'];
  const [sub, setSub] = useState('');
  const [win, setWin] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 768,
    height: typeof window !== 'undefined' ? window.innerHeight : 600
  });
  const [favoritePairs, setFavoritePairs] = useState([]);
  const [coins, setCoins] = useState([]); // All coins from CoinGecko
  const [selectedCoin, setSelectedCoin] = useState(null); // The user’s selected coin object
  const [selectedPair, setSelectedPair] = useState(selectedCoin ? selectedCoin.symbol.toUpperCase() : 'BTC');
  const [selectedInterval, setSelectedInterval] = useState('1d');
  const [loading, setLoading] = useState(true);
  const [chartTimeframe, setChartTimeframe] = useState('1D');
  const [orderSide, setOrderSide] = useState('buy');
  const [orderType, setOrderType] = useState('limit');
  const mb = win.width < 768;

  // For modals
  const { isOpen: depositOpen, onOpen: onDepositOpen, onClose: onDepositClose } = useDisclosure();
  const { isOpen: withdrawOpen, onOpen: onWithdrawOpen, onClose: onWithdrawClose } = useDisclosure();

  // Fetch the top ~20 coins from CoinGecko for the “market pairs” list
  useEffect(() => {
    async function fetchCoins() {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets' +
            '?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false'
        );
        if (!res.ok) throw new Error('Failed fetching market data.');
        const data = await res.json();
        setCoins(data);
        // Default selected: the first coin
        setSelectedCoin(data[0]);
      } catch (err) {
        console.error(err);
      }
    }

    fetchCoins();
  }, []);

  // Toggle coin in favorites
  const toggleFavorite = (coinId) => {
    setFavoritePairs((prev) =>
      prev.includes(coinId) ? prev.filter((id) => id !== coinId) : [...prev, coinId]
    );
  };

  const isCryptoDomain = sub === 'crypto';
  const isForexDomain = sub === 'forex';
  const isStockDomain = sub === 'stock';


  const getPairs = () => {
    if (isCryptoDomain) return cryptoPairs;
    if (isForexDomain) return forexPairs;
    if (isStockDomain) return stockPairs;
    return [];
  };

  // Filter coins by search term
  const filteredCoins = coins.filter((coin) =>
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Decide which coin ID to chart
  // e.g. "bitcoin", "ethereum", "cardano", etc.
  const coinIdForChart = selectedCoin ? selectedCoin.id : null;

  // ----------------------------------------------------------------
  // Live Chart with OHLC data from CoinGecko
  // ----------------------------------------------------------------
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);

  useEffect(() => {
    if (!coinIdForChart) return;

    async function fetchCoinOHLC() {
      setChartLoading(true);
      try {
        // According to CoinGecko docs, valid days param: 1, 7, 14, 30, 90, 180, 365, max
        // We'll interpret timeframes as: '1D' -> 1, '7D' -> 7, '1M' -> 30, '3M' -> 90, etc.
        let days = 1;
        if (chartTimeframe === '7D') days = 7;
        else if (chartTimeframe === '1M') days = 30;
        else if (chartTimeframe === '3M') days = 90;
        else if (chartTimeframe === '1Y') days = 365;

        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinIdForChart}/ohlc` +
            `?vs_currency=usd&days=${days}`
        );
        if (!res.ok) throw new Error('Failed fetching OHLC data.');
        const data = await res.json();
        // data => Array of [timestamp, open, high, low, close]
        const formatted = data.map((entry) => {
          return {
            x: new Date(entry[0]).getTime(),
            y: [entry[1], entry[2], entry[3], entry[4]]
          };
        });
        setChartData(formatted);
      } catch (err) {
        console.error(err);
      }
      setChartLoading(false);
    }

    fetchCoinOHLC();
  }, [coinIdForChart, chartTimeframe]);

  // ApexCharts options
  const chartOptions = {
    chart: {
      type: 'candlestick',
      background: 'transparent',
      toolbar: { show: false }
    },
    xaxis: { type: 'datetime' },
    yaxis: { tooltip: { enabled: true } },
    theme: { mode: 'dark' },
    tooltip: { enabled: true, theme: 'dark' }
  };

  // Some helper format functions
  function formatPrice(p) {
    if (!p) return '0.00';
    if (p < 1) return p.toFixed(6);
    return p.toFixed(2);
  }
  function formatPercent(num) {
    if (!num) return '';
    return num > 0 ? `+${num.toFixed(2)}%` : `${num.toFixed(2)}%`;
  }

  // RESPONSIVENESS
  const isLargeScreen = useBreakpointValue({ base: false, lg: true });

  return (
    <Box ref={containerRef} bg={bgGradient} minH="100vh">
      <Container maxW="8xl" pt={{ base: 4, md: 8 }}>
        {/* OPTIONAL Parallax Hero */}
        <motion.div style={{ scale: heroScale }}>
          <VStack spacing={4} textAlign="center" mb={4}>
            <Heading
              color="brand.bitfund.400"
              fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }}
              fontWeight="extrabold"
            >
              {t('crypto_exchange.hero.title', 'Trade Crypto Live')}
            </Heading>
            <Text fontSize={{ base: 'sm', md: 'lg' }} opacity={0.7} maxW="3xl">
              {t(
                'crypto_exchange.hero.subtitle',
                'Real data from CoinGecko, buy or sell with ease.'
              )}
            </Text>
          </VStack>
        </motion.div>

        {/* Top Ticker */}
        <TopCoinsTicker />

        <Grid templateColumns={{ base: '1fr', lg: '280px 1fr' }} gap={4}>
          {/* LEFT SIDEBAR: Market List */}
          {isLargeScreen && (
            <GridItem>
              <Box
                bg={panelBg}
                borderRadius="md"
                borderWidth="1px"
                borderColor={borderColor}
                position="relative"
                zIndex={1}
                overflow="hidden"
              >
                {/* Search */}
                <Box p={3}>
                  <InputGroup size="sm">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaSearch} color="gray.500" />
                    </InputLeftElement>
                    <Input
                      placeholder={t('search.markets', 'Search markets')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      borderRadius="md"
                    />
                  </InputGroup>
                </Box>

                {/* Coin Listing */}
                <Box maxH="calc(100vh - 220px)" overflowY="auto">
                  <TableContainer>
                    <Table size="sm" variant="simple">
                      <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
                        <Tr>
                          <Th>{t('coin', 'Coin')}</Th>
                          <Th isNumeric>{t('price', 'Price')}</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredCoins.map((coin) => {
                          const isFav = favoritePairs.includes(coin.id);
                          return (
                            <Tr
                              key={coin.id}
                              cursor="pointer"
                              onClick={() => setSelectedCoin(coin)}
                              bg={
                                selectedCoin && selectedCoin.id === coin.id
                                  ? useColorModeValue('blue.50', 'blue.900')
                                  : 'transparent'
                              }
                              _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                            >
                              <Td>
                                <HStack spacing={2}>
                                  <IconButton
                                    aria-label="Toggle favorite"
                                    icon={<FaStar />}
                                    size="xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleFavorite(coin.id);
                                    }}
                                    color={isFav ? 'yellow.400' : 'gray.300'}
                                    variant="ghost"
                                  />
                                  <Box boxSize="5">
                                    <img src={coin.image} alt={coin.name} />
                                  </Box>
                                  <Text fontWeight="medium">{coin.symbol.toUpperCase()}</Text>
                                </HStack>
                              </Td>
                              <Td isNumeric>
                                <Text fontWeight="medium">
                                  ${formatPrice(coin.current_price)}
                                </Text>
                                <Text
                                  fontSize="xs"
                                  color={coin.price_change_percentage_24h >= 0 ? 'green.100' : 'red.100'}
                                >
                                  {formatPercent(coin.price_change_percentage_24h)}
                                </Text>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            </GridItem>
          )}

          {/* MAIN PANEL: Chart + Order Form */}
          <GridItem>
            <VStack spacing={4} align="stretch">
              {/* SELECTED COIN INFO */}
              {selectedCoin && (
                <Box
                  bg={panelBg}
                  borderRadius="md"
                  p={3}
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <HStack justify="space-between" flexWrap="wrap" gap={2}>
                    <HStack>
                      <Box boxSize="6">
                        <img src={selectedCoin.image} alt={selectedCoin.name} />
                      </Box>
                      <VStack align="start" spacing={0}>
                        <Heading size="sm">{selectedCoin.name}</Heading>
                        <Text fontSize="xs" color={textColorSecondary}>
                          {t('rank', 'Rank')}: {selectedCoin.market_cap_rank}
                        </Text>
                      </VStack>
                    </HStack>

                    <Box textAlign="right">
                      <Heading
                        size="xl"
                        color={
                          selectedCoin.price_change_percentage_24h >= 0 ? 'green.300' : 'red.300'
                        }
                      >
                        ${formatPrice(selectedCoin.current_price)}
                      </Heading>
                      <Text fontSize="xs" color={textColorSecondary}>
                        {formatPercent(selectedCoin.price_change_percentage_24h)} (24h)
                      </Text>
                      {/* Search Markets Modal for Mobile */}
                        {showSearch && (
                          <div style={{
                            position:'fixed',
                            top:0,
                            left:0,
                            right:0,
                            bottom:0,
                            backgroundColor:'rgba(0,0,0,0.5)',
                            display:'flex',
                            justifyContent:'center',
                            alignItems:'center',
                            zIndex:1000
                          }} onClick={() => setShowSearch(false)}>
                            <div style={{
                              backgroundColor: dark ? '#000' : '#fff',
                              padding:'16px',
                              borderRadius:'8px',
                              width:'80%',
                              maxHeight:'80%',
                              overflowY:'auto'
                            }} onClick={e => e.stopPropagation()}>
                              <div style={{ marginBottom:'8px' }}>
                                <input
                                  type="text"
                                  placeholder="Search markets"
                                  value={searchTerm}
                                  onChange={e => setSearchTerm(e.target.value)}
                                  style={{
                                    width:'100%',
                                    padding:'8px',
                                    fontSize:'14px',
                                    borderRadius:'4px',
                                    border:'1px solid #ccc'
                                  }}
                                />
                              </div>
                              <div>
                                {coins ? coins
                                  .filter(coin => 
                                    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
                                  )
                                  .map(coin => (
                                    <div
                                      key={coin.id}
                                      style={{ padding:'8px', borderBottom:'1px solid #eee', cursor:'pointer' }}
                                      onClick={() => {
                                        setShowSearch(false);
                                        setSearchTerm('');
                                        setSelectedPair(coin.symbol.toUpperCase());
                                        if(onPairSelect) onPairSelect(coin);
                                      }}
                                    >
                                      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                                        <img src={coin.image} alt={coin.name} style={{ width:'24px', height:'24px' }} />
                                        <span style={{ fontWeight:'bold' }}>{coin.symbol.toUpperCase()}</span>
                                        <span>{coin.name}</span>
                                      </div>
                                    </div>
                                )) : <div>No markets available</div>}
                              </div>
                            </div>
                          </div>
                        )}
                    </Box>
                  </HStack>
                </Box>
              )}

              {/* Mobile Header: Unified Pricing and Search Markets */}
      {mb ? (
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            {selectedCoin && selectedCoin.image && (
              <img src={selectedCoin.image} alt={selectedCoin.name} style={{ width:'24px', height:'24px' }} />
            )}
            <span style={{ fontWeight:'bold', fontSize:'16px' }}>
              {selectedCoin ? selectedCoin.symbol.toUpperCase() : selectedPair}
            </span>
            {!loading && filteredData.length > 0 && !noData && (
              <>
                <span style={{ fontSize:'16px' }}>{fp(stats.currentPrice)}</span>
                <span style={{
                  backgroundColor: stats.isPriceUp ? 'rgba(38,166,154,0.15)' : 'rgba(239,83,80,0.15)',
                  color: stats.isPriceUp ? '#26a69a' : '#ef5350',
                  padding:'2px 8px',
                  borderRadius:'4px',
                  fontWeight:'bold'
                }}>
                  {stats.isPriceUp ? '+' : ''}{stats.priceChangePercent.toFixed(2)}%
                </span>
              </>
            )}
          </div>
          <button onClick={() => setShowSearch(true)} style={{ padding:'8px 12px', borderRadius:'4px', backgroundColor:'#2962FF', color:'white', fontSize:'14px' }}>
            Search Markets
          </button>
        </div>
      ) : (
        // Desktop Header: Pair and Interval selectors with pricing info
        <div style={{ display:'flex', flexDirection:'row', gap:'8px', marginBottom:'12px' }}>
          <div style={{ display:'flex', width:'100%', gap:'8px' }}>
            <select
              value={selectedPair}
              onChange={e => { 
                setSelectedPair(e.target.value); 
                if(onPairSelect && coins) { 
                  const coin = coins.find(c => c.symbol.toUpperCase() === e.target.value);
                  if(coin) onPairSelect(coin);
                }
              }}
              style={{
                backgroundColor:'#8b7966',
                color: dark ? 'white' : 'black',
                border:'none',
                borderRadius:'4px',
                padding:'10px',
                fontSize:'14px',
                flexGrow:1,
                maxWidth:'130px',
                appearance:'none'
              }}
            >
              {getPairs().map(x=>(
                <option key={x} value={x}>{x}</option>
              ))}
            </select>
            <select
              value={selectedInterval}
              onChange={e => setSelectedInterval(e.target.value)}
              style={{
                backgroundColor:'#8b7966',
                color: dark ? 'white' : 'black',
                border:'none',
                borderRadius:'4px',
                padding:'10px',
                fontSize:'14px',
                flexGrow:1,
                maxWidth:'100px',
                appearance:'none'
              }}
            >
              {intervals.map(x=>(
                <option key={x} value={x}>{x}</option>
              ))}
            </select>
          </div>
          {!loading && filteredData.length>0 && !noData && (
            <div style={{ display:'flex', alignItems:'center', width:'auto' }}>
              <div style={{ fontSize:'16px', fontWeight:'bold', marginRight:'8px' }}>
                {fp(stats.currentPrice)}
              </div>
              <div style={{
                backgroundColor: stats.isPriceUp ? 'rgba(38,166,154,0.15)' : 'rgba(239,83,80,0.15)',
                color: stats.isPriceUp ? '#26a69a' : '#ef5350',
                padding:'2px 8px',
                borderRadius:'4px',
                fontSize:'12px',
                fontWeight:'bold'
              }}>
                {stats.isPriceUp ? '+' : ''}{stats.priceChangePercent.toFixed(2)}%
              </div>
            </div>
          )}
        </div>
      )}

              {/* CANDLESTICK CHART with updated AdvancedChart */}
              <Box
                bg={panelBg}
                borderRadius="md"
                p={3}
                borderWidth="1px"
                borderColor={borderColor}
                minH={{ base: '300px', md: '400px' }}
                position="relative"
              >
                <AdvancedChart 
                  selectedCoin={selectedCoin} 
                  coins={coins} 
                  onPairSelect={setSelectedCoin} 
                />
              </Box>

              {/* BUY/SELL PANEL (placeholder) */}
              <Box
                bg={panelBg}
                borderRadius="md"
                p={3}
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Tabs variant="soft-rounded" colorScheme="blue">
                  <TabList mb={4}>
                    <Tab>{t('spot', 'Spot')}</Tab>
                    <Tab>{t('margin', 'Margin')}</Tab>
                    <Tab>{t('futures', 'Futures')}</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel px={0}>
                      <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
                        {/* ORDER FORM */}
                        <Box flex="1">
                          {/* Buy / Sell toggle */}
                          <HStack mb={4}>
                            <Button
                              colorScheme="green"
                              size="sm"
                              flex="1"
                              variant={orderSide === 'buy' ? 'solid' : 'outline'}
                              onClick={() => setOrderSide('buy')}
                            >
                              {t('buy', 'Buy')}
                            </Button>
                            <Button
                              colorScheme="red"
                              size="sm"
                              flex="1"
                              variant={orderSide === 'sell' ? 'solid' : 'outline'}
                              onClick={() => setOrderSide('sell')}
                            >
                              {t('sell', 'Sell')}
                            </Button>
                          </HStack>

                          {/* Limit / Market */}
                          <HStack mb={4}>
                            <Button
                              size="xs"
                              variant={orderType === 'limit' ? 'solid' : 'ghost'}
                              onClick={() => setOrderType('limit')}
                            >
                              {t('limit', 'Limit')}
                            </Button>
                            <Button
                              size="xs"
                              variant={orderType === 'market' ? 'solid' : 'ghost'}
                              onClick={() => setOrderType('market')}
                            >
                              {t('market', 'Market')}
                            </Button>
                          </HStack>

                          {/* Example form controls */}
                          {orderType === 'limit' && (
                            <FormControl mb={3}>
                              <FormLabel fontSize="xs">{t('price', 'Price')} (USD)</FormLabel>
                              <NumberInput size="sm" defaultValue={0} precision={2} min={0}>
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </FormControl>
                          )}

                          <FormControl mb={3}>
                            <FormLabel fontSize="xs">
                              {t('amount', 'Amount')}{' '}
                              {selectedCoin ? `(${selectedCoin.symbol.toUpperCase()})` : ''}
                            </FormLabel>
                            <NumberInput size="sm" defaultValue={0} precision={6} min={0}>
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>

                          <FormControl mb={4}>
                            <FormLabel fontSize="xs">
                              {t('total', 'Total')} (USD)
                            </FormLabel>
                            <NumberInput size="sm" defaultValue={0} precision={2} min={0} isReadOnly>
                              <NumberInputField />
                            </NumberInput>
                          </FormControl>

                          <Button
                            w="full"
                            size="md"
                            colorScheme={orderSide === 'buy' ? 'green.500' : 'red.500'}
                          >
                            {orderSide === 'buy'
                              ? t('buy_coin', 'Buy {{coin}}', {
                                  coin: selectedCoin ? selectedCoin.symbol.toUpperCase() : '?'
                                })
                              : t('sell_coin', 'Sell {{coin}}', {
                                  coin: selectedCoin ? selectedCoin.symbol.toUpperCase() : '?'
                                })}
                          </Button>
                        </Box>
                      </Stack>
                    </TabPanel>

                    {/* Margin & Futures tabs are placeholders */}
                    <TabPanel>
                      <Text fontSize="sm" opacity={0.8}>
                        {t(
                          'margin_placeholder',
                          'Margin trading data would go here. Integrate a real exchange API.'
                        )}
                      </Text>
                    </TabPanel>
                    <TabPanel>
                      <Text fontSize="sm" opacity={0.8}>
                        {t(
                          'futures_placeholder',
                          'Futures trading data would go here. Integrate a real exchange API.'
                        )}
                      </Text>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </VStack>
          </GridItem>
        </Grid>

        {/* Dummy "Wallet" / "Deposit"/"Withdraw" for demonstration */}
        <HStack justify="flex-end" mt={4} spacing={3}>
          <Button leftIcon={<FaCreditCard />} onClick={onDepositOpen}>
            {t('deposit', 'Deposit')}
          </Button>
          <Button leftIcon={<FaWallet />} onClick={onWithdrawOpen}>
            {t('withdraw', 'Withdraw')}
          </Button>
        </HStack>
      </Container>

      {/* Deposit Modal */}
      <Modal isOpen={depositOpen} onClose={onDepositClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('deposit', 'Deposit')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Select placeholder={t('select_coin', 'Select Coin')}>
                {coins.map((c) => (
                  <option key={c.id} value={c.symbol}>
                    {c.symbol.toUpperCase()}
                  </option>
                ))}
              </Select>

              <FormControl>
                <FormLabel>{t('deposit_amount', 'Deposit Amount')}</FormLabel>
                <NumberInput defaultValue={0}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <Button leftIcon={<FaQrcode />} variant="outline">
                {t('show_qr', 'Show Deposit QR')}
              </Button>
              <Button colorScheme="blue">{t('confirm_deposit', 'Confirm Deposit')}</Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Withdraw Modal */}
      <Modal isOpen={withdrawOpen} onClose={onWithdrawClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('withdraw', 'Withdraw')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Select placeholder={t('select_coin', 'Select Coin')}>
                {coins.map((c) => (
                  <option key={c.id} value={c.symbol}>
                    {c.symbol.toUpperCase()}
                  </option>
                ))}
              </Select>

              <FormControl>
                <FormLabel>{t('withdraw_amount', 'Withdraw Amount')}</FormLabel>
                <NumberInput defaultValue={0}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>{t('withdrawal_address', 'Withdrawal Address')}</FormLabel>
                <InputGroup>
                  <Input placeholder={t('enter_address', 'Enter wallet address')} />
                  <IconButton
                    aria-label="Paste address"
                    icon={<FaClipboard />}
                    size="sm"
                    variant="ghost"
                    ml={2}
                  />
                </InputGroup>
              </FormControl>

              <Button colorScheme="red">{t('confirm_withdraw', 'Confirm Withdrawal')}</Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CryptoExchange;

// (OPTIONAL) If you use next-i18next, enable serverSideTranslations:
export async function getStaticProps({ locale }) {
  return {
    props: {
      // remove or adjust if not using next-i18next
      ...(await import('next-i18next/serverSideTranslations').then(({ serverSideTranslations }) =>
        serverSideTranslations(locale, ['common'])
      ))
    }
  };
}
