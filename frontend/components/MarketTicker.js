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
import axios from 'axios';

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

  // Fetch data from API (or mock data for demo)
  const fetchMarketData = useCallback(async () => {
    setIsLoading(true);
    setDataError(false);
    
    try {
      // In a real app, we would make API calls to get live market data
      // For demo, we'll use a mock API call with a timeout to simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample data structure for different asset types
      const mockData = [
        // Indices
        { 
          name: 'S&P 500', 
          symbol: 'SPX',
          value: '4,873.12', 
          change: '+0.45%',
          positive: true,
          category: 'indices'
        },
        { 
          name: 'NASDAQ', 
          symbol: 'COMP',
          value: '17,245.36', 
          change: '+0.67%',
          positive: true,
          category: 'indices'
        },
        { 
          name: 'DOW JONES', 
          symbol: 'DJIA',
          value: '38,927.03', 
          change: '+0.21%',
          positive: true,
          category: 'indices'
        },
        { 
          name: 'FTSE 100', 
          symbol: 'UKX',
          value: '7,655.20', 
          change: '-0.15%',
          positive: false,
          category: 'indices'
        },
        { 
          name: 'DAX', 
          symbol: 'DAX',
          value: '18,354.76', 
          change: '+0.32%',
          positive: true,
          category: 'indices'
        },
        { 
          name: 'NIKKEI 225', 
          symbol: 'NI225',
          value: '38,687.22', 
          change: '-0.23%',
          positive: false,
          category: 'indices'
        },
        
        // Forex
        { 
          name: 'EUR/USD', 
          symbol: 'EUR/USD',
          value: '1.0864', 
          change: '+0.12%',
          positive: true,
          category: 'forex'
        },
        { 
          name: 'GBP/USD', 
          symbol: 'GBP/USD',
          value: '1.2654', 
          change: '+0.25%',
          positive: true,
          category: 'forex'
        },
        { 
          name: 'USD/JPY', 
          symbol: 'USD/JPY',
          value: '153.42', 
          change: '-0.34%',
          positive: false,
          category: 'forex'
        },
        
        // Commodities
        { 
          name: 'Gold', 
          symbol: 'XAU',
          value: '$2,345.60', 
          change: '+0.83%',
          positive: true,
          category: 'commodities'
        },
        { 
          name: 'Oil (WTI)', 
          symbol: 'CL',
          value: '$78.42', 
          change: '-1.25%',
          positive: false,
          category: 'commodities'
        },
        { 
          name: 'Silver', 
          symbol: 'XAG',
          value: '$27.35', 
          change: '+0.65%',
          positive: true,
          category: 'commodities'
        },
        
        // Crypto
        { 
          name: 'Bitcoin', 
          symbol: 'BTC/USD',
          value: '$61,247.80', 
          change: '+2.14%',
          positive: true,
          category: 'crypto'
        },
        { 
          name: 'Ethereum', 
          symbol: 'ETH/USD',
          value: '$3,456.75', 
          change: '+1.87%',
          positive: true,
          category: 'crypto'
        },
        { 
          name: 'Cardano', 
          symbol: 'ADA/USD',
          value: '$0.45', 
          change: '-2.15%',
          positive: false,
          category: 'crypto'
        }
      ];

      setMarketData(mockData);
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

  // Get fallback data in case of API error
  const getFallbackData = () => {
    return [
      { name: 'S&P 500', symbol: 'SPX', value: '4,873.12', change: '+0.45%', positive: true, category: 'indices' },
      { name: 'BTC/USD', symbol: 'BTC/USD', value: '$61,247.80', change: '+2.14%', positive: true, category: 'crypto' },
      { name: 'EUR/USD', symbol: 'EUR/USD', value: '1.0864', change: '+0.12%', positive: true, category: 'forex' },
      { name: 'Gold', symbol: 'XAU', value: '$2,345.60', change: '+0.83%', positive: true, category: 'commodities' }
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