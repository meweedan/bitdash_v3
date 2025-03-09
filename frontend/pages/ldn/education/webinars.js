import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Stack,
  HStack,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Image,
  Divider,
  Link,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
  Skeleton
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, StarIcon, InfoIcon, ExternalLinkIcon, TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
import { FaBitcoin, FaEthereum, FaChartLine, FaChartPie, FaGlobeAmericas, FaRegNewspaper, FaFire } from 'react-icons/fa';
import Head from 'next/head';
import NextLink from 'next/link';
import Layout from '@/components/Layout';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'crypto'])),
    },
  };
}

export default function CryptoMarkets() {
  const { t, i18n } = useTranslation(['common', 'crypto']);
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const isRTL = i18n.language === 'ar' || i18n.language === 'he';
  
  // Responsive settings
  const headingSize = useBreakpointValue({ base: 'xl', md: '2xl' });
  const subheadingSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const textSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Market data state
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('market_cap');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filteredData, setFilteredData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  
  // Market stats
  const [marketStats, setMarketStats] = useState({
    total_market_cap: 0,
    total_volume: 0,
    btc_dominance: 0,
    eth_dominance: 0,
    market_change_24h: 0
  });
  
  // Fetch market data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, you would fetch data from your API or a third-party service
        // For example: const response = await fetch('/api/crypto/markets');
        
        // Simulate API delay
        setTimeout(() => {
          setLoading(false);
        }, 1500);
        
      } catch (err) {
        console.error('Error fetching market data:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Load saved favorites from localStorage
    const savedFavorites = localStorage.getItem('cryptoFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);
  
  // Handle adding/removing favorites
  const toggleFavorite = (coinId) => {
    const newFavorites = favorites.includes(coinId)
      ? favorites.filter(id => id !== coinId)
      : [...favorites, coinId];
    
    setFavorites(newFavorites);
    localStorage.setItem('cryptoFavorites', JSON.stringify(newFavorites));
  };
  
  // Sort and filter market data
  useEffect(() => {
    if (!marketData.length) return;
    
    let filtered = [...marketData];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(coin => 
        coin.name.toLowerCase().includes(query) || 
        coin.symbol.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortDirection === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
    
    setFilteredData(filtered);
  }, [marketData, searchQuery, sortBy, sortDirection]);
  
  // Change sort method
  const handleSort = (column) => {
    if (sortBy === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for new column
      setSortBy(column);
      setSortDirection('desc');
    }
  };
  
  // Data for trending coins section
  const trendingCoins = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 34250.75,
      change_24h: 2.45,
      icon: '/crypto/icons/btc.png'
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      price: 1845.30,
      change_24h: 1.75,
      icon: '/crypto/icons/eth.png'
    },
    {
      id: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      price: 52.88,
      change_24h: 5.32,
      icon: '/crypto/icons/sol.png'
    },
    {
      id: 'doge',
      name: 'Dogecoin',
      symbol: 'DOGE',
      price: 0.082,
      change_24h: -1.25,
      icon: '/crypto/icons/doge.png'
    }
  ];
  
  // Format numbers for display
  const formatNumber = (number, digits = 2) => {
    if (number === null || number === undefined) return 'N/A';
    
    // Format as currency for prices above 1
    if (number >= 1) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      }).format(number);
    }
    
    // For very small values, use scientific notation
    if (number < 0.00001) {
      return number.toExponential(2);
    }
    
    // For small values, use more decimal places
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 6,
      maximumFractionDigits: 6
    }).format(number);
  };
  
  // Format large numbers with abbreviations (K, M, B, T)
  const formatLargeNumber = (number) => {
    if (number === null || number === undefined) return 'N/A';
    
    if (number >= 1e12) {
      return `$${(number / 1e12).toFixed(2)}T`;
    }
    if (number >= 1e9) {
      return `$${(number / 1e9).toFixed(2)}B`;
    }
    if (number >= 1e6) {
      return `$${(number / 1e6).toFixed(2)}M`;
    }
    if (number >= 1e3) {
      return `$${(number / 1e3).toFixed(2)}K`;
    }
    return `$${number.toFixed(2)}`;
  };
  
  return (
    <>
      <Head>
        <title>{t('crypto:marketsPageTitle', 'Cryptocurrency Markets | Live Prices & Data | BitDash')}</title>
        <meta 
          name="description" 
          content={t('crypto:marketsMetaDescription', 'Track real-time cryptocurrency prices, market caps, trading volumes, and more. Get comprehensive market data for Bitcoin, Ethereum, and thousands of altcoins.')}
        />
      </Head>
      <Layout>
      <Box w="full" minH="100vh">
        {/* Hero Section */}
        <Box 
          py={12}
          position="relative"
          overflow="hidden"
        >
          <Container maxW="container.xl" position="relative" zIndex={1}>
            <Stack spacing={8} align={{ base: "center", md: "flex-start" }} textAlign={{ base: "center", md: "left" }}>
              <VStack spacing={3} align={{ base: "center", md: "flex-start" }}>
                <Heading 
                  as="h1" 
                  size={headingSize} 
                  fontWeight="bold"
                  bgGradient={isDark ? 
                    "linear(to-r, brand.crypto.400, brand.crypto.700)" : 
                    "linear(to-r, brand.crypto.700, brand.crypto.400)"
                  }
                  bgClip="text"
                >
                  {t('crypto:marketsTitle', 'Cryptocurrency Markets')}
                </Heading>
              </VStack>
              
              <Text 
                fontSize={textSize} 
                maxW="2xl" 
                color={isDark ? "gray.300" : "gray.700"}
              >
                {t('crypto:marketsIntroduction', 'Track real-time cryptocurrency prices, market capitalization, and trading volumes. Stay updated with detailed information on thousands of digital assets from Bitcoin to the latest altcoins.')}
              </Text>
              
              <HStack spacing={4} flexWrap="wrap">
                <Button
                  as={NextLink}
                  href="/crypto/exchange"
                  bg={isDark ? "brand.crypto.600" : "brand.crypto.500"}
                  color="white"
                  _hover={{
                    bg: isDark ? "brand.crypto.500" : "brand.crypto.600",
                  }}
                  leftIcon={<FaChartLine />}
                  size="md"
                  borderRadius="full"
                >
                  {t('crypto:startTrading', 'Start Trading')}
                </Button>
                
                <Button
                  as={NextLink}
                  href="/crypto/markets/watchlist"
                  variant="outline"
                  borderColor={isDark ? "brand.crypto.400" : "brand.crypto.500"}
                  color={isDark ? "brand.crypto.400" : "brand.crypto.500"}
                  _hover={{
                    bg: isDark ? "whiteAlpha.100" : "brand.crypto.50",
                  }}
                  leftIcon={<StarIcon />}
                  size="md"
                  borderRadius="full"
                >
                  {t('crypto:createWatchlist', 'Create Watchlist')}
                </Button>
              </HStack>
            </Stack>
          </Container>
        </Box>
        
        {/* Market Stats */}
        <Box py={8}>
          <Container maxW="container.xl">
            <SimpleGrid columns={{ base: 1, md: 3, lg: 5 }} spacing={4}>
              <Stat
                bg={isDark ? 'gray.800' : 'white'}
                p={4}
                borderRadius="lg"
                boxShadow="sm"
              >
                <StatLabel>{t('crypto:totalMarketCap', 'Total Market Cap')}</StatLabel>
                {loading ? (
                  <Skeleton height="36px" mt={2} />
                ) : (
                  <>
                    <StatNumber>$2.15T</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      2.3%
                    </StatHelpText>
                  </>
                )}
              </Stat>
              
              <Stat
                bg={isDark ? 'gray.800' : 'white'}
                p={4}
                borderRadius="lg"
                boxShadow="sm"
              >
                <StatLabel>{t('crypto:24hVolume', '24h Volume')}</StatLabel>
                {loading ? (
                  <Skeleton height="36px" mt={2} />
                ) : (
                  <>
                    <StatNumber>$85.7B</StatNumber>
                    <StatHelpText>
                      <StatArrow type="decrease" />
                      4.2%
                    </StatHelpText>
                  </>
                )}
              </Stat>
              
              <Stat
                bg={isDark ? 'gray.800' : 'white'}
                p={4}
                borderRadius="lg"
                boxShadow="sm"
              >
                <StatLabel>{t('crypto:btcDominance', 'BTC Dominance')}</StatLabel>
                {loading ? (
                  <Skeleton height="36px" mt={2} />
                ) : (
                  <>
                    <StatNumber>48.2%</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      0.8%
                    </StatHelpText>
                  </>
                )}
              </Stat>
              
              <Stat
                bg={isDark ? 'gray.800' : 'white'}
                p={4}
                borderRadius="lg"
                boxShadow="sm"
              >
                <StatLabel>{t('crypto:ethDominance', 'ETH Dominance')}</StatLabel>
                {loading ? (
                  <Skeleton height="36px" mt={2} />
                ) : (
                  <>
                    <StatNumber>17.5%</StatNumber>
                    <StatHelpText>
                      <StatArrow type="decrease" />
                      0.3%
                    </StatHelpText>
                  </>
                )}
              </Stat>
              
              <Stat
                bg={isDark ? 'gray.800' : 'white'}
                p={4}
                borderRadius="lg"
                boxShadow="sm"
              >
                <StatLabel>{t('crypto:activeCryptocurrencies', 'Active Cryptocurrencies')}</StatLabel>
                {loading ? (
                  <Skeleton height="36px" mt={2} />
                ) : (
                  <>
                    <StatNumber>12,453</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      35
                    </StatHelpText>
                  </>
                )}
              </Stat>
            </SimpleGrid>
          </Container>
        </Box>
        
        {/* Trending Coins */}
        <Box py={8}>
          <Container maxW="container.xl">
            <VStack spacing={6} align="stretch">
              <HStack justify="space-between">
                <HStack>
                  <Icon as={FaFire} color={isDark ? 'brand.crypto.400' : 'brand.crypto.600'} />
                  <Heading as="h2" size="md">{t('crypto:trendingCoins', 'Trending Coins')}</Heading>
                </HStack>
                
                <Button
                  as={NextLink}
                  href="/crypto/markets/trending"
                  variant="ghost"
                  colorScheme="brand.crypto"
                  size="sm"
                >
                  {t('crypto:viewAll', 'View All')}
                </Button>
              </HStack>
              
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                {loading ? (
                  Array(4).fill(0).map((_, index) => (
                    <Skeleton key={index} height="120px" borderRadius="lg" />
                  ))
                ) : (
                  trendingCoins.map((coin) => (
                    <Box
                      key={coin.id}
                      bg={isDark ? 'gray.700' : 'gray.50'}
                      p={4}
                      borderRadius="lg"
                      boxShadow="sm"
                      transition="all 0.3s"
                      _hover={{
                        transform: "translateY(-5px)",
                        boxShadow: "md"
                      }}
                      as={NextLink}
                      href={`/crypto/markets/${coin.id}`}
                    >
                      <VStack spacing={2} align="start">
                        <HStack>
                          <Box boxSize={8} position="relative">
                            <Image
                              src={coin.icon}
                              alt={coin.name}
                              width={32}
                              height={32}
                            />
                          </Box>
                          <VStack spacing={0} align="start">
                            <Text fontWeight="bold">{coin.name}</Text>
                            <Text fontSize="xs" color={isDark ? 'gray.400' : 'gray.600'}>
                              {coin.symbol}
                            </Text>
                          </VStack>
                        </HStack>
                        
                        <Text fontSize="xl" fontWeight="bold">
                          ${coin.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: coin.price < 1 ? 6 : 2
                          })}
                        </Text>
                        
                        <Badge
                          colorScheme={coin.change_24h >= 0 ? 'green' : 'red'}
                          display="flex"
                          alignItems="center"
                        >
                          {coin.change_24h >= 0 ? (
                            <TriangleUpIcon mr={1} boxSize={3} />
                          ) : (
                            <TriangleDownIcon mr={1} boxSize={3} />
                          )}
                          {Math.abs(coin.change_24h)}%
                        </Badge>
                      </VStack>
                    </Box>
                  ))
                )}
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>
        
        {/* Main Markets Table */}
        <Box py={12}>
          <Container maxW="container.xl">
            <VStack spacing={8} align="stretch">
              <HStack justify="space-between" wrap="wrap">
                <Heading as="h2" size="lg">{t('crypto:cryptoMarkets', 'Cryptocurrency Markets')}</Heading>
                
                <HStack spacing={4}>
                  <InputGroup maxW="300px">
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color="gray.500" />
                    </InputLeftElement>
                    <Input
                      placeholder={t('crypto:searchCoin', 'Search coins...')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      bg={isDark ? 'gray.800' : 'white'}
                      borderRadius="full"
                    />
                  </InputGroup>
                  
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<ChevronDownIcon />}
                      bg={isDark ? 'gray.800' : 'white'}
                      display={{ base: 'none', md: 'flex' }}
                    >
                      {t('crypto:sortBy', 'Sort by')}
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => handleSort('market_cap')}>
                        {t('crypto:marketCap', 'Market Cap')}
                      </MenuItem>
                      <MenuItem onClick={() => handleSort('price')}>
                        {t('crypto:price', 'Price')}
                      </MenuItem>
                      <MenuItem onClick={() => handleSort('volume_24h')}>
                        {t('crypto:volume', '24h Volume')}
                      </MenuItem>
                      <MenuItem onClick={() => handleSort('change_24h')}>
                        {t('crypto:change', '24h Change')}
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              </HStack>
              
              <Tabs isFitted variant="enclosed" colorScheme="brand.crypto">
                <TabList>
                  <Tab>{t('crypto:allCoins', 'All Coins')}</Tab>
                  <Tab>{t('crypto:favorites', 'Favorites')}</Tab>
                  <Tab>{t('crypto:gainers', 'Top Gainers')}</Tab>
                  <Tab>{t('crypto:losers', 'Top Losers')}</Tab>
                </TabList>
                
                <TabPanels>
                  <TabPanel p={0} pt={4}>
                    <TableContainer
                      bg={isDark ? 'gray.800' : 'white'}
                      borderRadius="lg"
                      boxShadow="sm"
                      overflowX="auto"
                    >
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th w="50px">#</Th>
                            <Th w="50px"></Th>
                            <Th>{t('crypto:name', 'Name')}</Th>
                            <Th isNumeric>{t('crypto:price', 'Price')}</Th>
                            <Th isNumeric>{t('crypto:24hChange', '24h Change')}</Th>
                            <Th isNumeric display={{ base: 'none', md: 'table-cell' }}>
                              {t('crypto:marketCap', 'Market Cap')}
                            </Th>
                            <Th isNumeric display={{ base: 'none', lg: 'table-cell' }}>
                              {t('crypto:volume', 'Volume (24h)')}
                            </Th>
                            <Th isNumeric display={{ base: 'none', lg: 'table-cell' }}>
                              {t('crypto:supply', 'Circulating Supply')}
                            </Th>
                            <Th w="100px" display={{ base: 'none', md: 'table-cell' }}>
                              {t('crypto:7dChart', '7d Chart')}
                            </Th>
                            <Th w="50px">{t('crypto:trade', 'Trade')}</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {loading ? (
                            Array(10).fill(0).map((_, index) => (
                              <Tr key={index}>
                                <Td><Skeleton height="20px" /></Td>
                                <Td><Skeleton height="20px" /></Td>
                                <Td><Skeleton height="20px" /></Td>
                                <Td><Skeleton height="20px" /></Td>
                                <Td><Skeleton height="20px" /></Td>
                                <Td display={{ base: 'none', md: 'table-cell' }}><Skeleton height="20px" /></Td>
                                <Td display={{ base: 'none', lg: 'table-cell' }}><Skeleton height="20px" /></Td>
                                <Td display={{ base: 'none', lg: 'table-cell' }}><Skeleton height="20px" /></Td>
                                <Td display={{ base: 'none', md: 'table-cell' }}><Skeleton height="20px" /></Td>
                                <Td><Skeleton height="20px" /></Td>
                              </Tr>
                            ))
                          ) : (
                            <>
                              <Tr>
                                <Td>1</Td>
                                <Td>
                                  <IconButton
                                    icon={<StarIcon color="yellow.400" />}
                                    variant="ghost"
                                    size="sm"
                                    aria-label="Favorite"
                                  />
                                </Td>
                                <Td>
                                  <HStack>
                                    <Box boxSize={8} position="relative">
                                      <Image
                                        src="/crypto/icons/btc.png"
                                        alt="Bitcoin"
                                        width={32}
                                        height={32}
                                      />
                                    </Box>
                                    <VStack spacing={0} align="start">
                                      <Text fontWeight="bold">Bitcoin</Text>
                                      <Text fontSize="xs" color={isDark ? 'gray.400' : 'gray.600'}>
                                        BTC
                                      </Text>
                                    </VStack>
                                  </HStack>
                                </Td>
                                <Td isNumeric fontWeight="medium">$34,250.75</Td>
                                <Td isNumeric>
                                  <Badge colorScheme="green">+2.45%</Badge>
                                </Td>
                                <Td isNumeric display={{ base: 'none', md: 'table-cell' }}>$667.52B</Td>
                                <Td isNumeric display={{ base: 'none', lg: 'table-cell' }}>$28.24B</Td>
                                <Td isNumeric display={{ base: 'none', lg: 'table-cell' }}>19.5M BTC</Td>
                                <Td display={{ base: 'none', md: 'table-cell' }}>
                                  <Box h="40px" w="100px" bg="gray.100" borderRadius="md"></Box>
                                </Td>
                                <Td>
                                  <Button
                                    as={NextLink}
                                    href="/crypto/exchange"
                                    size="sm"
                                    colorScheme="brand.crypto"
                                    borderRadius="full"
                                  >
                                    {t('crypto:trade', 'Trade')}
                                  </Button>
                                </Td>
                              </Tr>
                              <Tr>
                                <Td>2</Td>
                                <Td>
                                  <IconButton
                                    icon={<StarIcon color="gray.400" />}
                                    variant="ghost"
                                    size="sm"
                                    aria-label="Favorite"
                                  />
                                </Td>
                                <Td>
                                  <HStack>
                                    <Box boxSize={8} position="relative">
                                      <Image
                                        src="/crypto/icons/eth.png"
                                        alt="Ethereum"
                                        width={32}
                                        height={32}
                                      />
                                    </Box>
                                    <VStack spacing={0} align="start">
                                      <Text fontWeight="bold">Ethereum</Text>
                                      <Text fontSize="xs" color={isDark ? 'gray.400' : 'gray.600'}>
                                        ETH
                                      </Text>
                                    </VStack>
                                  </HStack>
                                </Td>
                                <Td isNumeric fontWeight="medium">$1,845.30</Td>
                                <Td isNumeric>
                                  <Badge colorScheme="green">+1.75%</Badge>
                                </Td>
                                <Td isNumeric display={{ base: 'none', md: 'table-cell' }}>$221.64B</Td>
                                <Td isNumeric display={{ base: 'none', lg: 'table-cell' }}>$12.36B</Td>
                                <Td isNumeric display={{ base: 'none', lg: 'table-cell' }}>120.1M ETH</Td>
                                <Td display={{ base: 'none', md: 'table-cell' }}>
                                  <Box h="40px" w="100px" bg="gray.100" borderRadius="md"></Box>
                                </Td>
                                <Td>
                                  <Button
                                    as={NextLink}
                                    href="/crypto/exchange"
                                    size="sm"
                                    colorScheme="brand.crypto"
                                    borderRadius="full"
                                  >
                                    {t('crypto:trade', 'Trade')}
                                  </Button>
                                </Td>
                              </Tr>
                              <Tr>
                                <Td>3</Td>
                                <Td>
                                  <IconButton
                                    icon={<StarIcon color="gray.400" />}
                                    variant="ghost"
                                    size="sm"
                                    aria-label="Favorite"
                                  />
                                </Td>
                                <Td>
                                  <HStack>
                                    <Box boxSize={8} position="relative">
                                      <Image
                                        src="/crypto/icons/usdt.png"
                                        alt="Tether"
                                        width={32}
                                        height={32}
                                      />
                                    </Box>
                                    <VStack spacing={0} align="start">
                                      <Text fontWeight="bold">Tether</Text>
                                      <Text fontSize="xs" color={isDark ? 'gray.400' : 'gray.600'}>
                                        USDT
                                      </Text>
                                    </VStack>
                                  </HStack>
                                </Td>
                                <Td isNumeric fontWeight="medium">$1.00</Td>
                                <Td isNumeric>
                                  <Badge colorScheme="gray">0.00%</Badge>
                                </Td>
                                <Td isNumeric display={{ base: 'none', md: 'table-cell' }}>$83.76B</Td>
                                <Td isNumeric display={{ base: 'none', lg: 'table-cell' }}>$42.20B</Td>
                                <Td isNumeric display={{ base: 'none', lg: 'table-cell' }}>83.8B USDT</Td>
                                <Td display={{ base: 'none', md: 'table-cell' }}>
                                  <Box h="40px" w="100px" bg="gray.100" borderRadius="md"></Box>
                                </Td>
                                <Td>
                                  <Button
                                    as={NextLink}
                                    href="/crypto/exchange"
                                    size="sm"
                                    colorScheme="brand.crypto"
                                    borderRadius="full"
                                  >
                                    {t('crypto:trade', 'Trade')}
                                  </Button>
                                </Td>
                              </Tr>
                            </>
                          )}
                        </Tbody>
                      </Table>
                    </TableContainer>
                    
                    <HStack justify="center" mt={6}>
                      <Button
                        colorScheme="brand.crypto"
                        variant="outline"
                        size="md"
                        isDisabled={loading}
                      >
                        {t('crypto:loadMore', 'Load More')}
                      </Button>
                    </HStack>
                  </TabPanel>
                  
                  <TabPanel p={0} pt={4}>
                    {/* Favorites Tab Content */}
                    <Box
                      bg={isDark ? 'gray.800' : 'white'}
                      p={8}
                      borderRadius="lg"
                      boxShadow="sm"
                      textAlign="center"
                    >
                      <VStack spacing={4}>
                        <Icon as={StarIcon} boxSize={12} color="gray.400" />
                        <Heading size="md">{t('crypto:noFavorites', 'No favorite coins yet')}</Heading>
                        <Text color={isDark ? 'gray.400' : 'gray.600'}>
                          {t('crypto:favoritesDescription', 'Click the star icon next to any coin to add it to your favorites for quick access.')}
                        </Text>
                      </VStack>
                    </Box>
                  </TabPanel>
                  
                  <TabPanel p={0} pt={4}>
                    {/* Top Gainers Tab Content */}
                    <TableContainer
                      bg={isDark ? 'gray.800' : 'white'}
                      borderRadius="lg"
                      boxShadow="sm"
                      overflowX="auto"
                    >
                      {/* Similar table structure as All Coins but with sorted data */}
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th w="50px">#</Th>
                            <Th w="50px"></Th>
                            <Th>{t('crypto:name', 'Name')}</Th>
                            <Th isNumeric>{t('crypto:price', 'Price')}</Th>
                            <Th isNumeric>{t('crypto:24hChange', '24h Change')}</Th>
                            <Th isNumeric display={{ base: 'none', md: 'table-cell' }}>{t('crypto:marketCap', 'Market Cap')}</Th>
                            <Th isNumeric display={{ base: 'none', lg: 'table-cell' }}>{t('crypto:volume', 'Volume (24h)')}</Th>
                            <Th w="50px">{t('crypto:trade', 'Trade')}</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {loading ? (
                            Array(5).fill(0).map((_, index) => (
                              <Tr key={index}>
                                <Td><Skeleton height="20px" /></Td>
                                <Td><Skeleton height="20px" /></Td>
                                <Td><Skeleton height="20px" /></Td>
                                <Td><Skeleton height="20px" /></Td>
                                <Td><Skeleton height="20px" /></Td>
                                <Td display={{ base: 'none', md: 'table-cell' }}><Skeleton height="20px" /></Td>
                                <Td display={{ base: 'none', lg: 'table-cell' }}><Skeleton height="20px" /></Td>
                                <Td><Skeleton height="20px" /></Td>
                              </Tr>
                            ))
                          ) : (
                            <>
                              <Tr>
                                <Td>1</Td>
                                <Td>
                                  <IconButton
                                    icon={<StarIcon color="gray.400" />}
                                    variant="ghost"
                                    size="sm"
                                    aria-label="Favorite"
                                  />
                                </Td>
                                <Td>
                                  <HStack>
                                    <Box boxSize={8} position="relative">
                                      <Image
                                        src="/crypto/icons/sol.png"
                                        alt="Solana"
                                        width={32}
                                        height={32}
                                      />
                                    </Box>
                                    <VStack spacing={0} align="start">
                                      <Text fontWeight="bold">Solana</Text>
                                      <Text fontSize="xs" color={isDark ? 'gray.400' : 'gray.600'}>
                                        SOL
                                      </Text>
                                    </VStack>
                                  </HStack>
                                </Td>
                                <Td isNumeric fontWeight="medium">$52.88</Td>
                                <Td isNumeric>
                                  <Badge colorScheme="green">+5.32%</Badge>
                                </Td>
                                <Td isNumeric display={{ base: 'none', md: 'table-cell' }}>$22.53B</Td>
                                <Td isNumeric display={{ base: 'none', lg: 'table-cell' }}>$1.82B</Td>
                                <Td>
                                  <Button
                                    as={NextLink}
                                    href="/crypto/exchange"
                                    size="sm"
                                    colorScheme="brand.crypto"
                                    borderRadius="full"
                                  >
                                    {t('crypto:trade', 'Trade')}
                                  </Button>
                                </Td>
                              </Tr>
                            </>
                          )}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </TabPanel>
                  
                  <TabPanel p={0} pt={4}>
                    {/* Top Losers Tab Content - similar to Top Gainers */}
                    <TableContainer
                      bg={isDark ? 'gray.800' : 'white'}
                      borderRadius="lg"
                      boxShadow="sm"
                      overflowX="auto"
                    >
                      <Table variant="simple">
                        {/* Similar structure as other tabs */}
                        <Thead>
                          <Tr>
                            <Th w="50px">#</Th>
                            <Th w="50px"></Th>
                            <Th>{t('crypto:name', 'Name')}</Th>
                            <Th isNumeric>{t('crypto:price', 'Price')}</Th>
                            <Th isNumeric>{t('crypto:24hChange', '24h Change')}</Th>
                            <Th isNumeric display={{ base: 'none', md: 'table-cell' }}>{t('crypto:marketCap', 'Market Cap')}</Th>
                            <Th isNumeric display={{ base: 'none', lg: 'table-cell' }}>{t('crypto:volume', 'Volume (24h)')}</Th>
                            <Th w="50px">{t('crypto:trade', 'Trade')}</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {loading ? (
                            Array(5).fill(0).map((_, index) => (
                              <Tr key={index}>
                                <Td><Skeleton height="20px" /></Td>
                                <Td><Skeleton height="20px" /></Td>
                                <Td><Skeleton height="20px" /></Td>
                                <Td><Skeleton height="20px" /></Td>
                                <Td><Skeleton height="20px" /></Td>
                                <Td display={{ base: 'none', md: 'table-cell' }}><Skeleton height="20px" /></Td>
                                <Td display={{ base: 'none', lg: 'table-cell' }}><Skeleton height="20px" /></Td>
                                <Td><Skeleton height="20px" /></Td>
                              </Tr>
                            ))
                          ) : (
                            <>
                              <Tr>
                                <Td>1</Td>
                                <Td>
                                  <IconButton
                                    icon={<StarIcon color="gray.400" />}
                                    variant="ghost"
                                    size="sm"
                                    aria-label="Favorite"
                                  />
                                </Td>
                                <Td>
                                  <HStack>
                                    <Box boxSize={8} position="relative">
                                      <Image
                                        src="/crypto/icons/doge.png"
                                        alt="Dogecoin"
                                        width={32}
                                        height={32}
                                      />
                                    </Box>
                                    <VStack spacing={0} align="start">
                                      <Text fontWeight="bold">Dogecoin</Text>
                                      <Text fontSize="xs" color={isDark ? 'gray.400' : 'gray.600'}>
                                        DOGE
                                      </Text>
                                    </VStack>
                                  </HStack>
                                </Td>
                                <Td isNumeric fontWeight="medium">$0.082</Td>
                                <Td isNumeric>
                                  <Badge colorScheme="red">-1.25%</Badge>
                                </Td>
                                <Td isNumeric display={{ base: 'none', md: 'table-cell' }}>$11.25B</Td>
                                <Td isNumeric display={{ base: 'none', lg: 'table-cell' }}>$354.7M</Td>
                                <Td>
                                  <Button
                                    as={NextLink}
                                    href="/crypto/exchange"
                                    size="sm"
                                    colorScheme="brand.crypto"
                                    borderRadius="full"
                                  >
                                    {t('crypto:trade', 'Trade')}
                                  </Button>
                                </Td>
                              </Tr>
                            </>
                          )}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          </Container>
        </Box>
        
        {/* Market News Section */}
        <Box py={12} bg={isDark ? 'gray.800' : 'white'}>
          <Container maxW="container.xl">
            <VStack spacing={8} align="stretch">
              <HStack justify="space-between">
                <HStack>
                  <Icon as={FaRegNewspaper} color={isDark ? 'brand.crypto.400' : 'brand.crypto.600'} />
                  <Heading as="h2" size="lg">{t('crypto:marketNews', 'Market News')}</Heading>
                </HStack>
                
                <Button
                  as={NextLink}
                  href="/crypto/news"
                  variant="ghost"
                  colorScheme="brand.crypto"
                  size="sm"
                >
                  {t('crypto:viewAllNews', 'View All News')}
                </Button>
              </HStack>
              
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                {loading ? (
                  Array(3).fill(0).map((_, index) => (
                    <Skeleton key={index} height="300px" borderRadius="lg" />
                  ))
                ) : (
                  <>
                    <Box
                      bg={isDark ? 'gray.700' : 'gray.50'}
                      borderRadius="lg"
                      overflow="hidden"
                      boxShadow="sm"
                      transition="all 0.3s"
                      _hover={{
                        transform: "translateY(-5px)",
                        boxShadow: "md"
                      }}
                    >
                      <Box position="relative" height="160px">
                        <Image
                          src="/crypto/news/news1.jpg"
                          alt="Crypto news"
                          fill
                          sizes="100%"
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                      <Box p={4}>
                        <VStack align="start" spacing={3}>
                          <Badge colorScheme="brand.crypto">{t('crypto:featured', 'Featured')}</Badge>
                          <Heading size="md">
                            {t('crypto:newsHeadline1', 'Bitcoin Surpasses $30K as Institutional Interest Grows')}
                          </Heading>
                          <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'} noOfLines={3}>
                            {t('crypto:newsExcerpt1', 'Major institutional investors are increasingly adding Bitcoin to their portfolios as inflation concerns and regulatory clarity drive adoption.')}
                          </Text>
                          <HStack justify="space-between" w="full">
                            <Text fontSize="xs" color={isDark ? 'gray.500' : 'gray.500'}>2 hours ago</Text>
                            <Button 
                              as={NextLink}
                              href="/crypto/news/1"
                              size="xs" 
                              variant="ghost" 
                              colorScheme="brand.crypto"
                              rightIcon={<ExternalLinkIcon />}
                            >
                              {t('crypto:readMore', 'Read more')}
                            </Button>
                          </HStack>
                        </VStack>
                      </Box>
                    </Box>
                    
                    <Box
                      bg={isDark ? 'gray.700' : 'gray.50'}
                      borderRadius="lg"
                      overflow="hidden"
                      boxShadow="sm"
                      transition="all 0.3s"
                      _hover={{
                        transform: "translateY(-5px)",
                        boxShadow: "md"
                      }}
                    >
                      <Box position="relative" height="160px">
                        <Image
                          src="/crypto/news/news2.jpg"
                          alt="Crypto news"
                          fill
                          sizes="100%"
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                      <Box p={4}>
                        <VStack align="start" spacing={3}>
                          <Badge colorScheme="blue">{t('crypto:regulation', 'Regulation')}</Badge>
                          <Heading size="md">
                            {t('crypto:newsHeadline2', 'EU Finalizes Comprehensive Crypto Regulation Framework')}
                          </Heading>
                          <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'} noOfLines={3}>
                            {t('crypto:newsExcerpt2', 'The European Union has approved a comprehensive regulatory framework for cryptocurrencies that aims to protect consumers while fostering innovation.')}
                          </Text>
                          <HStack justify="space-between" w="full">
                            <Text fontSize="xs" color={isDark ? 'gray.500' : 'gray.500'}>5 hours ago</Text>
                            <Button 
                              as={NextLink}
                              href="/crypto/news/2"
                              size="xs" 
                              variant="ghost" 
                              colorScheme="brand.crypto"
                              rightIcon={<ExternalLinkIcon />}
                            >
                              {t('crypto:readMore', 'Read more')}
                            </Button>
                          </HStack>
                        </VStack>
                      </Box>
                    </Box>
                    
                    <Box
                      bg={isDark ? 'gray.700' : 'gray.50'}
                      borderRadius="lg"
                      overflow="hidden"
                      boxShadow="sm"
                      transition="all 0.3s"
                      _hover={{
                        transform: "translateY(-5px)",
                        boxShadow: "md"
                      }}
                    >
                      <Box position="relative" height="160px">
                        <Image
                          src="/crypto/news/news3.jpg"
                          alt="Crypto news"
                          fill
                          sizes="100%"
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                      <Box p={4}>
                        <VStack align="start" spacing={3}>
                          <Badge colorScheme="green">{t('crypto:adoption', 'Adoption')}</Badge>
                          <Heading size="md">
                            {t('crypto:newsHeadline3', 'Major Retailer Announces Bitcoin Payment Integration')}
                          </Heading>
                          <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'} noOfLines={3}>
                            {t('crypto:newsExcerpt3', 'A leading global retailer has announced plans to accept Bitcoin as payment across all online platforms, marking a significant milestone for mainstream crypto adoption.')}
                          </Text>
                          <HStack justify="space-between" w="full">
                            <Text fontSize="xs" color={isDark ? 'gray.500' : 'gray.500'}>8 hours ago</Text>
                            <Button 
                              as={NextLink}
                              href="/crypto/news/3"
                              size="xs" 
                              variant="ghost" 
                              colorScheme="brand.crypto"
                              rightIcon={<ExternalLinkIcon />}
                            >
                              {t('crypto:readMore', 'Read more')}
                            </Button>
                          </HStack>
                        </VStack>
                      </Box>
                    </Box>
                  </>
                )}
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>
        
        {/* Market Resources */}
        <Box py={12}>
          <Container maxW="container.xl">
            <VStack spacing={8} align="center">
              <Heading 
                as="h2" 
                size="lg" 
                textAlign="center"
              >
                {t('crypto:marketResources', 'Market Resources')}
              </Heading>
              
              <Text 
                textAlign="center" 
                maxW="3xl" 
                color={isDark ? "gray.300" : "gray.700"}
              >
                {t('crypto:resourcesDescription', 'Explore our comprehensive suite of tools and educational resources to enhance your crypto trading knowledge and strategy.')}
              </Text>
              
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
                <Box
                  as={NextLink}
                  href="/crypto/learn"
                  bg={isDark ? 'gray.800' : 'white'}
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  transition="all 0.3s"
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "md"
                  }}
                >
                  <VStack spacing={4}>
                    <Box
                      p={3}
                      borderRadius="full"
                      bg={isDark ? 'whiteAlpha.100' : 'brand.crypto.50'}
                      color={isDark ? 'brand.crypto.400' : 'brand.crypto.600'}
                    >
                      <Icon as={FaGlobeAmericas} boxSize={8} />
                    </Box>
                    <Heading size="md">{t('crypto:cryptoAcademy', 'Crypto Academy')}</Heading>
                    <Text textAlign="center" color={isDark ? 'gray.400' : 'gray.600'}>
                      {t('crypto:academyDescription', 'Learn the fundamentals of blockchain technology, cryptocurrencies, and trading strategies through our comprehensive educational resources.')}
                    </Text>
                  </VStack>
                </Box>
                
                <Box
                  as={NextLink}
                  href="/crypto/tools"
                  bg={isDark ? 'gray.800' : 'white'}
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  transition="all 0.3s"
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "md"
                  }}
                >
                  <VStack spacing={4}>
                    <Box
                      p={3}
                      borderRadius="full"
                      bg={isDark ? 'whiteAlpha.100' : 'brand.crypto.50'}
                      color={isDark ? 'brand.crypto.400' : 'brand.crypto.600'}
                    >
                      <Icon as={FaChartLine} boxSize={8} />
                    </Box>
                    <Heading size="md">{t('crypto:tradingTools', 'Trading Tools')}</Heading>
                    <Text textAlign="center" color={isDark ? 'gray.400' : 'gray.600'}>
                      {t('crypto:toolsDescription', 'Access advanced charting, technical analysis indicators, and portfolio tracking tools to optimize your trading decisions.')}
                    </Text>
                  </VStack>
                </Box>
                
                <Box
                  as={NextLink}
                  href="/crypto/insights"
                  bg={isDark ? 'gray.800' : 'white'}
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  transition="all 0.3s"
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "md"
                  }}
                >
                  <VStack spacing={4}>
                    <Box
                      p={3}
                      borderRadius="full"
                      bg={isDark ? 'whiteAlpha.100' : 'brand.crypto.50'}
                      color={isDark ? 'brand.crypto.400' : 'brand.crypto.600'}
                    >
                      <Icon as={FaChartPie} boxSize={8} />
                    </Box>
                    <Heading size="md">{t('crypto:marketInsights', 'Market Insights')}</Heading>
                    <Text textAlign="center" color={isDark ? 'gray.400' : 'gray.600'}>
                      {t('crypto:insightsDescription', 'Get expert analysis, market reports, and the latest research on cryptocurrency trends and developments.')}
                    </Text>
                  </VStack>
                </Box>
              </SimpleGrid>
              
              <Box 
                bg={isDark ? "whiteAlpha.100" : "brand.crypto.50"} 
                p={6} 
                borderRadius="lg"
                mt={4}
                maxW="3xl"
                w="full"
              >
                <VStack spacing={4} align="center">
                  <Heading size="md">{t('crypto:startTrading', 'Ready to Start Trading?')}</Heading>
                  <Text textAlign="center" maxW="2xl" color={isDark ? 'gray.300' : 'gray.700'}>
                    {t('crypto:tradingCTA', 'Join thousands of traders on BitDash. Create an account today to access our full suite of trading tools and features.')}
                  </Text>
                  <Button
                    as={NextLink}
                    href="/signup"
                    colorScheme="brand.crypto"
                    size="lg"
                    borderRadius="full"
                    px={8}
                  >
                    {t('crypto:createAccount', 'Create an Account')}
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </Container>
        </Box>
      </Box>
    </Layout>
    </>
  );
}