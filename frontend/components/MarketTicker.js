import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Box,
  Flex,
  Text,
  HStack,
  useColorModeValue,
  Badge,
  Icon,
  Button,
  ButtonGroup,
  Skeleton,
  IconButton,
  useBreakpointValue,
  Tooltip,
  useToast,
  Tag,
  Divider,
  Fade,
  VStack
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { 
  FaSyncAlt, 
  FaPause, 
  FaPlay,
  FaArrowUp, 
  FaArrowDown,
  FaChartLine,
  FaCoins,
  FaDollarSign,
  FaOilCan,
  FaGem
} from 'react-icons/fa';

const MarketTicker = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const { locale } = router;
  const scrollRef = useRef(null);
  const toast = useToast();
  
  // States
  const [marketData, setMarketData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [tickerSpeed, setTickerSpeed] = useState(50); // seconds to complete one scroll
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dataError, setDataError] = useState(false);
  
  // Responsive values
  const tickerHeight = useBreakpointValue({ base: '60px', md: '70px' });
  const tickerItemSpacing = useBreakpointValue({ base: 3, md: 5 });
  const showCategories = useBreakpointValue({ base: false, md: true });
  const categoryIconSize = useBreakpointValue({ base: 3, md: 4 });
  const tickerPadding = useBreakpointValue({ base: 2, md: 3 });
  const headerPadding = useBreakpointValue({ base: 2, md: 4 });
  const showControls = useBreakpointValue({ base: false, md: true });
  const fadeSize = useBreakpointValue({ base: '20px', md: '40px' });
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Colors
  const bgColor = useColorModeValue('blue.50', 'gray.800');
  const tickerBg = useColorModeValue('white', 'gray.700');
  const labelColor = useColorModeValue('gray.600', 'gray.300');
  const tickerHeaderBg = useColorModeValue('blue.100', 'gray.700');
  const accentColor = useColorModeValue('brand.bitfund.500', 'brand.bitfund.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Asset categories with icons
  const categories = [
    { id: 'all', label: t('ticker.category.all', 'All'), icon: FaChartLine },
    { id: 'forex', label: t('ticker.category.forex', 'Forex'), icon: FaDollarSign },
    { id: 'crypto', label: t('ticker.category.crypto', 'Crypto'), icon: FaCoins },
    { id: 'indices', label: t('ticker.category.indices', 'Indices'), icon: FaChartLine },
    { id: 'commodities', label: t('ticker.category.commodities', 'Commodities'), icon: FaOilCan }
  ];

  // Fetch data from the market data fetcher files
  const fetchMarketData = useCallback(async () => {
    setIsLoading(true);
    setDataError(false);
    
    try {
      // Try to fetch market data from our generated files
      let marketSummaryData = [];
      
      // Try market_summary.json first
      let response = await fetch('public/chart-data/market_summary.json');
      
      if (response.ok) {
        const data = await response.json();
        
        // Extract data for each category
        for (const category of ['indices', 'forex', 'crypto', 'commodities']) {
          if (data[category] && Array.isArray(data[category])) {
            for (const item of data[category]) {
              marketSummaryData.push({
                name: item.name,
                symbol: item.symbol,
                value: formatValue(item.price, category, item.symbol),
                change: `${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}%`,
                positive: item.change >= 0,
                category: category
              });
            }
          }
        }
      } else {
        // Try exchange_rate_matrix.json as backup
        response = await fetch('public/chart-data/exchange_rate_data.json');
        
        if (response.ok) {
          const matrixData = await response.json();
          
          // Process the exchange rate matrix
          if (Array.isArray(matrixData)) {
            // Find common base currencies to extract rates
            const usdRow = matrixData.find(row => row.base_currency === 'USD');
            
            if (usdRow) {
              // Add forex pairs
              for (const currency of ['EUR', 'GBP', 'JPY', 'CAD', 'CHF']) {
                if (usdRow[currency]) {
                  const rate = parseFloat(usdRow[currency]);
                  // Generate a random change for demo purposes
                  const changePercent = (Math.random() * 0.4 - 0.2).toFixed(2);
                  
                  marketSummaryData.push({
                    name: `USD/${currency}`,
                    symbol: `USD/${currency}`,
                    value: rate.toFixed(4),
                    change: `${parseFloat(changePercent) >= 0 ? '+' : ''}${changePercent}%`,
                    positive: parseFloat(changePercent) >= 0,
                    category: 'forex'
                  });
                }
              }
              
              // Add crypto rates
              for (const crypto of ['BTC', 'ETH', 'XRP']) {
                if (usdRow[crypto]) {
                  const rate = parseFloat(usdRow[crypto]);
                  // Cryptos tend to be more volatile
                  const changePercent = (Math.random() * 2 - 1).toFixed(2);
                  
                  marketSummaryData.push({
                    name: `${crypto}/USD`,
                    symbol: `${crypto}/USD`,
                    value: rate.toFixed(2),
                    change: `${parseFloat(changePercent) >= 0 ? '+' : ''}${changePercent}%`,
                    positive: parseFloat(changePercent) >= 0,
                    category: 'crypto'
                  });
                }
              }
              
              // Add commodities (metals)
              for (const metal of ['XAU', 'XAG']) {
                if (usdRow[metal]) {
                  const rate = parseFloat(usdRow[metal]);
                  const changePercent = (Math.random() * 0.6 - 0.3).toFixed(2);
                  
                  const metalName = metal === 'XAU' ? 'Gold' : 'Silver';
                  
                  marketSummaryData.push({
                    name: metalName,
                    symbol: metal,
                    value: `$${rate.toFixed(2)}/oz`,
                    change: `${parseFloat(changePercent) >= 0 ? '+' : ''}${changePercent}%`,
                    positive: parseFloat(changePercent) >= 0,
                    category: 'commodities'
                  });
                }
              }
            }
          }
        } else {
          // If both files don't exist, look for individual asset files
          const assetSymbols = [
            // Indices
            { symbol: '^GSPC', name: 'S&P 500', category: 'indices' },
            { symbol: '^DJI', name: 'DOW JONES', category: 'indices' },
            { symbol: '^IXIC', name: 'NASDAQ', category: 'indices' },
            // Forex
            { symbol: 'EURUSD', name: 'EUR/USD', category: 'forex' },
            { symbol: 'GBPUSD', name: 'GBP/USD', category: 'forex' },
            { symbol: 'USDJPY', name: 'USD/JPY', category: 'forex' },
            // Crypto
            { symbol: 'BTC', name: 'Bitcoin', category: 'crypto' },
            { symbol: 'ETH', name: 'Ethereum', category: 'crypto' },
            // Commodities
            { symbol: 'XAU', name: 'Gold', category: 'commodities' },
            { symbol: 'CL', name: 'Oil (WTI)', category: 'commodities' }
          ];
          
          // Try to load individual asset data
          for (const asset of assetSymbols) {
            try {
              // Try to load the data
              const assetResponse = await fetch(`/chart-data/${asset.symbol}_1d.json`);
              
              if (assetResponse.ok) {
                const assetData = await assetResponse.json();
                
                // Get the most recent data point
                if (Array.isArray(assetData) && assetData.length > 0) {
                  // Sort by timestamp to get the latest
                  assetData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                  
                  const latestData = assetData[0];
                  const previousData = assetData.length > 1 ? assetData[1] : { close: latestData.close };
                  
                  // Calculate change
                  const changePercent = ((latestData.close - previousData.close) / previousData.close * 100).toFixed(2);
                  
                  marketSummaryData.push({
                    name: asset.name,
                    symbol: asset.symbol,
                    value: formatValue(latestData.close, asset.category, asset.symbol),
                    change: `${parseFloat(changePercent) >= 0 ? '+' : ''}${changePercent}%`,
                    positive: parseFloat(changePercent) >= 0,
                    category: asset.category
                  });
                }
              }
            } catch (err) {
              console.warn(`Failed to load data for ${asset.symbol}`);
            }
          }
        }
      }
      
      // If we still don't have data, use fallback data
      if (marketSummaryData.length === 0) {
        marketSummaryData = getFallbackData();
      }
      
      setMarketData(marketSummaryData);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error fetching market data:', error);
      setDataError(true);
      
      toast({
        title: t('error.data_fetch', 'Error fetching data'),
        description: t('error.try_again', 'Please try again later'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      // Set some fallback data
      setMarketData(getFallbackData());
      
    } finally {
      setIsLoading(false);
    }
  }, [t, toast]);

  // Format value based on category and symbol
  const formatValue = (price, category, symbol) => {
    if (price === undefined || price === null) return 'N/A';
    
    // Convert to number if it's a string
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Format based on category
    if (category === 'forex') {
      return numPrice.toFixed(4);
    } else if (category === 'crypto') {
      return `$${numPrice.toFixed(2)}`;
    } else if (category === 'commodities') {
      if (symbol === 'XAU' || symbol === 'XAG') {
        return `$${numPrice.toFixed(2)}/oz`;
      } else if (symbol === 'CL' || symbol === 'BZ') {
        return `$${numPrice.toFixed(2)}/bbl`;
      } else {
        return `$${numPrice.toFixed(2)}`;
      }
    } else if (category === 'indices') {
      // Format with commas for thousands
      return numPrice.toLocaleString(undefined, { maximumFractionDigits: 2 });
    } else {
      return `$${numPrice.toFixed(2)}`;
    }
  };

  // Get fallback data in case of API error
  const getFallbackData = () => {
    return [
      { name: 'S&P 500', symbol: 'SPX', value: '4,873.12', change: '+0.45%', positive: true, category: 'indices' },
      { name: 'BTC/USD', symbol: 'BTC/USD', value: '$61,247.80', change: '+2.14%', positive: true, category: 'crypto' },
      { name: 'EUR/USD', symbol: 'EUR/USD', value: '1.0864', change: '+0.12%', positive: true, category: 'forex' },
      { name: 'Gold', symbol: 'XAU', value: '$2,345.60/oz', change: '+0.83%', positive: true, category: 'commodities' }
    ];
  };

  // Initial fetch and set periodic updates
  useEffect(() => {
    fetchMarketData();
    
    // Set interval to update data randomly (simulating price changes) every 30 seconds
    const updateInterval = setInterval(() => {
      if (!isPaused) {
        setMarketData(prevData => 
          prevData.map(item => {
            const randomChange = (Math.random() * 0.5 - 0.25).toFixed(2);
            const isPositive = parseFloat(randomChange) >= 0;
            
            return {
              ...item,
              change: `${isPositive ? '+' : ''}${randomChange}%`,
              positive: isPositive
            };
          })
        );
        setLastUpdated(new Date());
      }
    }, 30000);
    
    return () => clearInterval(updateInterval);
  }, [fetchMarketData, isPaused]);

  // Filter data by category
  const filteredData = selectedCategory === 'all'
    ? marketData
    : marketData.filter(item => item.category === selectedCategory);

  // Animation settings for the ticker
  const tickerVariants = {
    animate: {
      x: isPaused ? [0, 0] : [0, -5000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: tickerSpeed,
          ease: "linear",
        },
      },
    },
  };

  // Format last updated time
  const formatLastUpdated = (date) => {
    if (!date) return '';
    
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  // Category selector for mobile
  const MobileCategorySelector = () => (
    <Flex justify="center" mt={2} mb={3}>
      <ButtonGroup size="xs" isAttached variant="outline" overflow="auto" maxW="100%" p={1}>
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            colorScheme={selectedCategory === category.id ? 'blue' : 'gray'}
            leftIcon={<Icon as={category.icon} />}
            fontSize="xs"
            px={2}
          >
            {category.label}
          </Button>
        ))}
      </ButtonGroup>
    </Flex>
  );

  return (
    <Box 
      w="full"
      maxW="4xl"
      bg={bgColor}
      borderRadius="xl"
      overflow="hidden"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Header with title and controls */}
      <Flex 
        justify="space-between" 
        align="center" 
        px={headerPadding}
        py={2}
        bg={tickerHeaderBg}
        borderBottomWidth="1px"
        borderColor={borderColor}
        flexWrap="wrap"
        gap={2}
      >
        <Flex align="center">
          <Text 
            fontSize={{ base: 'xs', md: 'sm' }}
            fontWeight="bold"
            color={labelColor}
          >
            {t('ticker.title', 'LIVE MARKETS')}
          </Text>
          {showControls && (
            <Text 
              fontSize="xs" 
              color={labelColor}
              ml={2}
            >
              {t('ticker.last_updated', 'Updated')}: {formatLastUpdated(lastUpdated)}
            </Text>
          )}
        </Flex>
        
        {showControls && (
          <HStack spacing={2}>
            <ButtonGroup size="xs" isAttached variant="outline">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  colorScheme={selectedCategory === category.id ? 'blue' : 'gray'}
                  leftIcon={<Icon as={category.icon} />}
                >
                  {category.label}
                </Button>
              ))}
            </ButtonGroup>
            
            <IconButton
              icon={isPaused ? <FaPlay /> : <FaPause />}
              size="xs"
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? t('ticker.play', 'Play') : t('ticker.pause', 'Pause')}
              variant="outline"
            />
            
            <IconButton
              icon={<FaSyncAlt />}
              isLoading={isLoading}
              size="xs"
              onClick={fetchMarketData}
              aria-label={t('ticker.refresh', 'Refresh')}
              variant="outline"
            />
          </HStack>
        )}
      </Flex>
      
      {/* Mobile category selector */}
      {isMobile && <MobileCategorySelector />}
      
      {/* Main ticker */}
      <Box position="relative">
        {/* Left fade effect */}
        <Box 
          position="absolute" 
          left={0} 
          top={0} 
          bottom={0} 
          width={fadeSize} 
          zIndex={2}
          bgGradient={locale === 'ar' ? 
            `linear(to-l, transparent, ${bgColor})` :
            `linear(to-r, ${bgColor}, transparent)`
          }
        />
        
        {/* Right fade effect */}
        <Box 
          position="absolute" 
          right={0} 
          top={0} 
          bottom={0} 
          width={fadeSize} 
          zIndex={2}
          bgGradient={locale === 'ar' ? 
            `linear(to-r, transparent, ${bgColor})` :
            `linear(to-l, ${bgColor}, transparent)`
          }
        />
        
        {/* Mobile refresh button */}
        {isMobile && (
          <Box position="absolute" right={2} bottom={2} zIndex={3}>
            <IconButton
              icon={<FaSyncAlt />}
              isLoading={isLoading}
              size="xs"
              onClick={fetchMarketData}
              aria-label={t('ticker.refresh', 'Refresh')}
              colorScheme="blue"
              opacity={0.8}
              borderRadius="full"
            />
          </Box>
        )}
        
        {/* Ticker content */}
        <Box 
          h={tickerHeight}
          overflowX="hidden"
          px={tickerPadding}
          py={2}
          position="relative"
        >
          {isLoading ? (
            <Flex align="center" h="full">
              <HStack spacing={tickerItemSpacing} w="full" overflow="hidden">
                {[...Array(5)].map((_, index) => (
                  <Skeleton 
                    key={index} 
                    height="30px" 
                    width={isMobile ? "120px" : "160px"} 
                    borderRadius="md" 
                  />
                ))}
              </HStack>
            </Flex>
          ) : (
            <motion.div
              ref={scrollRef}
              variants={tickerVariants}
              animate="animate"
              style={{ 
                display: 'flex', 
                height: '100%', 
                alignItems: 'center'
              }}
            >
              {[...filteredData, ...filteredData].map((market, index) => (
                <Flex 
                  key={index} 
                  mr={tickerItemSpacing} 
                  align="center"
                  px={2}
                  py={1}
                  borderRadius="md"
                  bg={tickerBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  boxShadow="sm"
                  minW={isMobile ? "110px" : "150px"}
                >
                  <VStack spacing={0} align="start" w="full">
                    <Flex w="full" justify="space-between" align="center">
                      <Text fontWeight="bold" fontSize="xs">
                        {market.symbol}
                      </Text>
                      <Badge 
                        colorScheme={market.positive ? "green" : "red"}
                        variant="subtle"
                        fontSize="2xs"
                        borderRadius="sm"
                      >
                        <Flex align="center">
                          <Icon 
                            as={market.positive ? FaArrowUp : FaArrowDown} 
                            mr={1} 
                            fontSize="2xs"
                          />
                          {market.change}
                        </Flex>
                      </Badge>
                    </Flex>
                    <Flex w="full" justify="space-between" align="center">
                      <Text fontSize="2xs" color="gray.500" noOfLines={1}>
                        {market.name}
                      </Text>
                      <Text fontSize="xs" fontWeight="medium">
                        {market.value}
                      </Text>
                    </Flex>
                  </VStack>
                </Flex>
              ))}
            </motion.div>
          )}
        </Box>
      </Box>
      
      {/* Mobile last updated info */}
      {isMobile && !showControls && (
        <Text 
          fontSize="2xs" 
          color={labelColor}
          textAlign="center"
          pb={1}
        >
          {t('ticker.last_updated', 'Updated')}: {formatLastUpdated(lastUpdated)}
        </Text>
      )}
    </Box>
  );
};

export default MarketTicker;