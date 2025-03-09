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
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  useDisclosure
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
  FaGem,
  FaInfoCircle,
  FaHistory
} from 'react-icons/fa';

const MarketTicker = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const { locale } = router;
  const scrollRef = useRef(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // States
  const [marketData, setMarketData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [tickerSpeed, setTickerSpeed] = useState(50); // seconds to complete one scroll
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dataError, setDataError] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [holdTimer, setHoldTimer] = useState(null);
  const [longPressDetected, setLongPressDetected] = useState(false);
  
  // Responsive values
  const tickerHeight = useBreakpointValue({ base: '60px', md: '70px' });
  const tickerItemSpacing = useBreakpointValue({ base: 3, md: 5 });
  const tickerItemWidth = useBreakpointValue({ base: 140, md: 180 });
  const tickerContainerPadding = useBreakpointValue({ base: 1, md: 3 });
  const modalSize = useBreakpointValue({ base: "full", md: "md" });
  const showCategories = useBreakpointValue({ base: false, md: true });
  const categoryIconSize = useBreakpointValue({ base: 3, md: 4 });
  const tickerPadding = useBreakpointValue({ base: 2, md: 3 });
  const headerPadding = useBreakpointValue({ base: 2, md: 4 });
  const showControls = useBreakpointValue({ base: false, md: true });
  const tickerContainerRef = useRef(null);
  const [tickerWidth, setTickerWidth] = useState(0);
  const fadeSize = useBreakpointValue({ base: '20px', md: '40px' });
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Colors
  const bgColor = useColorModeValue('blue.50', 'gray.800');
  const tickerBg = useColorModeValue('white', 'gray.700');
  const labelColor = useColorModeValue('gray.600', 'gray.300');
  const tickerHeaderBg = useColorModeValue('blue.100', 'gray.700');
  const accentColor = useColorModeValue('brand.crypto.500', 'brand.crypto.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const highlightColor = useColorModeValue('blue.100', 'blue.800');
  
  // Asset categories with icons
  const categories = [
    { id: 'all', label: t('ticker.category.all', 'All'), icon: FaChartLine },
    { id: 'forex', label: t('ticker.category.forex', 'Forex'), icon: FaDollarSign },
    { id: 'crypto', label: t('ticker.category.crypto', 'Crypto'), icon: FaCoins },
    { id: 'commodities', label: t('ticker.category.commodities', 'Commodities'), icon: FaOilCan }
  ];

  const tickerStyle = {
    display: 'flex',
    whiteSpace: 'nowrap',
    willChange: 'transform',
    animation: isPaused ? 'none' : `ticker ${tickerSpeed}s linear infinite`,
    '@keyframes ticker': {
      '0%': { transform: 'translateX(0)' },
      '100%': { transform: `translateX(-50%)` } // Use percentage instead of fixed pixels
    }
  };

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
        for (const category of ['forex', 'crypto', 'commodities']) {
          if (data[category] && Array.isArray(data[category])) {
            for (const item of data[category]) {
              marketSummaryData.push({
                name: item.name,
                symbol: item.symbol,
                value: formatValue(item.price, category, item.symbol),
                change: `${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}%`,
                positive: item.change >= 0,
                category: category,
                details: {
                  open: item.open || item.price * (1 - Math.random() * 0.02),
                  high: item.high || item.price * (1 + Math.random() * 0.03),
                  low: item.low || item.price * (1 - Math.random() * 0.03),
                  volume: item.volume || Math.floor(Math.random() * 1000000),
                  marketCap: item.marketCap || Math.floor(Math.random() * 100000000000)
                }
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
                    category: 'forex',
                    details: {
                      open: rate * (1 - Math.random() * 0.01),
                      high: rate * (1 + Math.random() * 0.01),
                      low: rate * (1 - Math.random() * 0.01),
                      volume: Math.floor(Math.random() * 1000000),
                      spread: (Math.random() * 0.0005).toFixed(5)
                    }
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
                    category: 'crypto',
                    details: {
                      open: rate * (1 - Math.random() * 0.03),
                      high: rate * (1 + Math.random() * 0.05),
                      low: rate * (1 - Math.random() * 0.05),
                      volume: Math.floor(Math.random() * 5000000),
                      marketCap: rate * Math.floor(Math.random() * 20000000)
                    }
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
                    category: 'commodities',
                    details: {
                      open: rate * (1 - Math.random() * 0.01),
                      high: rate * (1 + Math.random() * 0.015),
                      low: rate * (1 - Math.random() * 0.015),
                      volume: Math.floor(Math.random() * 100000),
                      contract: 'Spot'
                    }
                  });
                }
              }
            }
          }
        } else {
          // If both files don't exist, look for individual asset files
          const assetSymbols = [
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
                    category: asset.category,
                    details: {
                      open: latestData.open || latestData.close * 0.99,
                      high: latestData.high || latestData.close * 1.01,
                      low: latestData.low || latestData.close * 0.99,
                      volume: latestData.volume || Math.floor(Math.random() * 1000000),
                    }
                  });
                }
              }
            } catch (err) {
              console.warn(`Failed to load data for ${asset.symbol}`);
            }
          }
        }
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
      
    } finally {
      setIsLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
      if (tickerContainerRef.current) {
        const resizeObserver = new ResizeObserver(() => {
          if (tickerContainerRef.current) {
            setTickerWidth(tickerContainerRef.current.scrollWidth);
          }
        });
        
        resizeObserver.observe(tickerContainerRef.current);
        return () => resizeObserver.disconnect();
      }
    }, []);

  // Format value based on category and symbol
  const formatValue = (price, category, symbol) => {
    if (price === undefined || price === null) return 'N/A';
    
    // Convert to number if it's a string
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Format based on category
    if (category === 'ldn') {
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

  // Ticker item component
const TickerItem = ({ market }) => (
  <Flex 
    mr={tickerItemSpacing} 
    align="center"
    px={2}
    py={1}
    borderRadius="md"
    bg={tickerBg}
    borderWidth="1px"
    borderColor={borderColor}
    boxShadow="sm"
    minW={tickerItemWidth}
    maxW={tickerItemWidth}
    cursor="pointer"
    transition="all 0.2s"
    _hover={{ boxShadow: "md", bg: highlightColor }}
    onClick={() => handleClick(market)}
    onTouchStart={() => handleTouchStart(market)}
    onTouchEnd={handleTouchEnd}
    onTouchCancel={handleTouchEnd}
    role="button"
    aria-label={`View details for ${market.name}`}
  >
    <VStack spacing={0} align="start" w="full">
      <Flex w="full" justify="space-between" align="center">
        <Text fontWeight="bold" fontSize="xs" isTruncated>
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
);

  // Handle ticker item long press
  const handleTouchStart = (ticker) => {
    const timer = setTimeout(() => {
      // Long press detected, show ticker details
      setSelectedTicker(ticker);
      setIsPaused(true);
      setLongPressDetected(true);
      onOpen();
    }, 500); // Long press threshold (500ms)
    
    setHoldTimer(timer);
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
    
    // If it wasn't a long press, don't resume automatically
    if (!longPressDetected) {
      // This was a simple tap, not a long press
    } else {
      setLongPressDetected(false);
    }
  };

  // Handle click (for desktop)
  const handleClick = (ticker) => {
    setSelectedTicker(ticker);
    setIsPaused(true);
    onOpen();
  };

  // Handle modal close
  const handleModalClose = () => {
    onClose();
    // Don't resume automatically, let the user decide
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
      x: isPaused ? [0, 0] : [0, -10000], // Made longer to ensure continuous loop
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

  // Details modal for ticker
  const TickerDetailsModal = () => {
    if (!selectedTicker) return null;
    
    // Get category icon
    const getCategoryIcon = (category) => {
      const categoryObj = categories.find(cat => cat.id === category);
      return categoryObj ? categoryObj.icon : FaChartLine;
    };
    
    // Format detailed stats based on category
    const getDetailedStats = () => {
      const details = selectedTicker.details || {};
      
      // Common stats for all categories
      const commonStats = [
        {
          label: 'Open',
          value: formatValue(details.open, selectedTicker.category, selectedTicker.symbol),
        },
        {
          label: 'High',
          value: formatValue(details.high, selectedTicker.category, selectedTicker.symbol),
        },
        {
          label: 'Low',
          value: formatValue(details.low, selectedTicker.category, selectedTicker.symbol),
        }
      ];
      
      // Category specific stats
      switch(selectedTicker.category) {
        case 'ldn':
          return [
            ...commonStats,
            {
              label: 'Spread',
              value: details.spread || '0.00010',
            },
            {
              label: 'Volume',
              value: details.volume ? (details.volume / 1000000).toFixed(2) + 'M' : 'N/A',
            }
          ];
        case 'crypto':
          return [
            ...commonStats,
            {
              label: 'Volume',
              value: details.volume ? (details.volume / 1000000).toFixed(2) + 'M' : 'N/A',
            },
            {
              label: 'Market Cap',
              value: details.marketCap ? '$' + (details.marketCap / 1000000000).toFixed(2) + 'B' : 'N/A',
            }
          ];
        case 'commodities':
          return [
            ...commonStats,
            {
              label: 'Volume',
              value: details.volume ? details.volume.toLocaleString() : 'N/A',
            },
            {
              label: 'Contract',
              value: details.contract || 'Spot',
            }
          ];
        case 'indices':
        default:
          return [
            ...commonStats,
            {
              label: 'Volume',
              value: details.volume ? details.volume.toLocaleString() : 'N/A',
            },
            {
              label: 'Prev Close',
              value: formatValue(details.prevClose, selectedTicker.category, selectedTicker.symbol),
            }
          ];
      }
    };

    useEffect(() => {
      if (tickerContainerRef.current && filteredData.length > 0) {
        // Calculate total width needed
        setTickerWidth(tickerContainerRef.current.scrollWidth);
      }
    }, [filteredData]);
    
    const detailedStats = getDetailedStats();
    
    return (
      <Modal isOpen={isOpen} onClose={handleModalClose} size="sm" isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalHeader>
            <Flex align="center">
              <Icon 
                as={getCategoryIcon(selectedTicker.category)} 
                mr={2} 
                color={accentColor}
              />
              {selectedTicker.name} ({selectedTicker.symbol})
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stat mb={4}>
              <StatLabel>{t('ticker.current_value', 'Current Value')}</StatLabel>
              <StatNumber>{selectedTicker.value}</StatNumber>
              <StatHelpText>
                <StatArrow type={selectedTicker.positive ? 'increase' : 'decrease'} />
                {selectedTicker.change}
              </StatHelpText>
            </Stat>
            
            <Divider mb={4} />
            
            <Text fontWeight="bold" mb={2}>{t('ticker.statistics', 'Statistics')}</Text>
            <VStack align="stretch" spacing={2}>
              {detailedStats.map((stat, index) => (
                <Flex key={index} justify="space-between">
                  <Text fontSize="sm" color={labelColor}>{stat.label}:</Text>
                  <Text fontSize="sm" fontWeight="medium">{stat.value}</Text>
                </Flex>
              ))}
            </VStack>
            
            <Divider my={4} />
            
            <Text fontSize="xs" color={labelColor}>
              <Icon as={FaHistory} mr={1} />
              {t('ticker.last_updated', 'Updated')}: {formatLastUpdated(lastUpdated)}
            </Text>
          </ModalBody>
          
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={handleModalClose} 
              size="sm"
            >
              {t('ticker.close', 'Close')}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setIsPaused(false);
                handleModalClose();
              }}
              leftIcon={<FaPlay />}
            >
              {t('ticker.resume', 'Resume Ticker')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

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
        
        {/* Mobile controls */}
        {isMobile && (
          <Box position="absolute" right={2} bottom={2} zIndex={3}>
            <ButtonGroup size="xs" isAttached colorScheme="blue" opacity={0.8} borderRadius="full">
              <IconButton
                icon={isPaused ? <FaPlay /> : <FaPause />}
                onClick={() => setIsPaused(!isPaused)}
                aria-label={isPaused ? t('ticker.play', 'Play') : t('ticker.pause', 'Pause')}
                borderRadius="full"
                />
              <IconButton
                icon={<FaSyncAlt />}
                isLoading={isLoading}
                onClick={fetchMarketData}
                aria-label={t('ticker.refresh', 'Refresh')}
                borderRadius="full"
              />
            </ButtonGroup>
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
            <Box
              ref={tickerContainerRef}
              sx={tickerStyle}
              h="100%"
              display="flex"
              alignItems="center"
            >
            {/* First set of items */}
      {filteredData.map((market, index) => (
        <TickerItem key={`first-${index}`} market={market} />
      ))}
      
      {/* Second identical set of items */}
      {filteredData.map((market, index) => (
        <TickerItem key={`second-${index}`} market={market} />
      ))}
    </Box>
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
      
      {/* Details modal */}
      <TickerDetailsModal />
    </Box>
  );
};

export default MarketTicker;