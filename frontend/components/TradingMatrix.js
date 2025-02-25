import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  useColorModeValue,
  Text,
  Grid,
  Flex,
  Badge,
  Skeleton,
  VStack,
  HStack,
  Icon,
  useBreakpointValue,
  Heading,
  Tooltip,
  useTheme,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Select,
  useToast
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartLine, FaChartBar, FaInfoCircle, FaSyncAlt, FaFilter } from 'react-icons/fa';
import { BsArrowUpRight, BsArrowDownRight } from 'react-icons/bs';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const TradingMatrix = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const { locale } = router;
  const theme = useTheme();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // States
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dataError, setDataError] = useState(false);

  // Responsive values
  const columns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 });
  const gridGap = useBreakpointValue({ base: 2, md: 3 });
  const boxPadding = useBreakpointValue({ base: 2, md: 3 });
  const textSize = useBreakpointValue({ base: 'xs', md: 'sm' });
  const symbolSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const headingSize = useBreakpointValue({ base: 'sm', md: 'md' });

  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const cardHoverBg = useColorModeValue('gray.100', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const subtleTextColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = useColorModeValue('brand.bitfund.500', 'brand.bitfund.400');

  // Create categories list
  const categories = [
    { value: 'all', label: t('assets.category.all', 'All Assets') },
    { value: 'forex', label: t('assets.category.forex', 'Forex') },
    { value: 'crypto', label: t('assets.category.crypto', 'Crypto') },
    { value: 'stocks', label: t('assets.category.stocks', 'Stocks') },
    { value: 'indices', label: t('assets.category.indices', 'Indices') },
    { value: 'commodities', label: t('assets.category.commodities', 'Commodities') }
  ];

  // Format price change to appropriate string with + or - sign
  const formatPriceChange = (change) => {
    const numValue = parseFloat(change);
    const sign = numValue >= 0 ? '+' : '';
    return `${sign}${numValue.toFixed(2)}%`;
  };

  // Fetch data from API
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setDataError(false);
    
    try {
      // We'll use a free API for this example
      // For real implementation, you'd use a paid API with more reliable data
      
      // Forex data
      const forexResponse = await axios.get(
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=EUR&to_currency=USD&apikey=demo'
      );
      
      // Crypto data
      const cryptoResponse = await axios.get(
        'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=demo'
      );
      
      // If we're using a demo API with limited data, we'll supplement with realistic mock data
      // In a real implementation, you'd fetch full data from a paid API
      
      const mockData = [
        // Forex
        { 
          symbol: 'EUR/USD', 
          name: t('assets.forex.eurusd', 'Euro/US Dollar'),
          price: forexResponse.data['Realtime Currency Exchange Rate']?.['5. Exchange Rate'] || '1.0876',
          change: (Math.random() * 0.6 - 0.3).toFixed(2),
          category: 'forex'
        },
        { 
          symbol: 'GBP/USD', 
          name: t('assets.forex.gbpusd', 'British Pound/US Dollar'),
          price: '1.2654',
          change: (Math.random() * 0.6 - 0.3).toFixed(2), 
          category: 'forex'
        },
        { 
          symbol: 'USD/JPY', 
          name: t('assets.forex.usdjpy', 'US Dollar/Japanese Yen'),
          price: '115.32',
          change: (Math.random() * 0.7 - 0.4).toFixed(2),
          category: 'forex'
        },
        
        // Crypto
        { 
          symbol: 'BTC/USD', 
          name: t('assets.crypto.btcusd', 'Bitcoin/US Dollar'),
          price: cryptoResponse.data['Realtime Currency Exchange Rate']?.['5. Exchange Rate'] || '26745.32',
          change: (Math.random() * 4 - 2).toFixed(2),
          category: 'crypto'
        },
        { 
          symbol: 'ETH/USD', 
          name: t('assets.crypto.ethusd', 'Ethereum/US Dollar'),
          price: '1654.21',
          change: (Math.random() * 4.5 - 2.2).toFixed(2),
          category: 'crypto'
        },
        
        // Stocks
        { 
          symbol: 'AAPL', 
          name: t('assets.stocks.aapl', 'Apple Inc.'),
          price: '173.45',
          change: (Math.random() * 3 - 1.5).toFixed(2),
          category: 'stocks'
        },
        { 
          symbol: 'MSFT', 
          name: t('assets.stocks.msft', 'Microsoft Corp'),
          price: '315.78',
          change: (Math.random() * 3 - 1.5).toFixed(2),
          category: 'stocks'
        },
        { 
          symbol: 'TSLA', 
          name: t('assets.stocks.tsla', 'Tesla Inc'),
          price: '239.45',
          change: (Math.random() * 4 - 2).toFixed(2),
          category: 'stocks'
        },
        
        // Indices
        { 
          symbol: 'SPX', 
          name: t('assets.indices.spx', 'S&P 500'),
          price: '4,532.12',
          change: (Math.random() * 2 - 1).toFixed(2),
          category: 'indices'
        },
        { 
          symbol: 'NDX', 
          name: t('assets.indices.ndx', 'Nasdaq 100'),
          price: '15,678.32',
          change: (Math.random() * 2.2 - 1.1).toFixed(2),
          category: 'indices'
        },
        
        // Commodities
        { 
          symbol: 'XAUUSD', 
          name: t('assets.commodities.gold', 'Gold'),
          price: '1,856.45',
          change: (Math.random() * 1.8 - 0.9).toFixed(2),
          category: 'commodities'
        },
        { 
          symbol: 'CL', 
          name: t('assets.commodities.oil', 'Crude Oil'),
          price: '75.32',
          change: (Math.random() * 2.5 - 1.2).toFixed(2),
          category: 'commodities'
        }
      ];
      
      setAssets(mockData);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setDataError(true);
      
      toast({
        title: t('error.data_fetch', 'Error fetching data'),
        description: t('error.try_again', 'Please try again later'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      // Fallback to static data in case of API failure
      const fallbackData = generateFallbackData();
      setAssets(fallbackData);
    } finally {
      setIsLoading(false);
    }
  }, [t, toast]);

  // Generate fallback data in case API fails
  const generateFallbackData = () => {
    return [
      { symbol: 'EUR/USD', name: t('assets.forex.eurusd', 'Euro/US Dollar'), price: '1.0876', change: '0.25', category: 'forex' },
      { symbol: 'BTC/USD', name: t('assets.crypto.btcusd', 'Bitcoin/US Dollar'), price: '26745.32', change: '1.20', category: 'crypto' },
      { symbol: 'AAPL', name: t('assets.stocks.aapl', 'Apple Inc.'), price: '173.45', change: '-0.75', category: 'stocks' },
      { symbol: 'SPX', name: t('assets.indices.spx', 'S&P 500'), price: '4,532.12', change: '0.45', category: 'indices' },
      { symbol: 'XAUUSD', name: t('assets.commodities.gold', 'Gold'), price: '1,856.45', change: '-0.32', category: 'commodities' },
      { symbol: 'ETH/USD', name: t('assets.crypto.ethusd', 'Ethereum/US Dollar'), price: '1654.21', change: '2.20', category: 'crypto' },
      { symbol: 'TSLA', name: t('assets.stocks.tsla', 'Tesla Inc'), price: '239.45', change: '-1.85', category: 'stocks' },
      { symbol: 'CL', name: t('assets.commodities.oil', 'Crude Oil'), price: '75.32', change: '0.87', category: 'commodities' }
    ];
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
    
    // Set interval to update data every 30 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  // Filter assets by category
  const filteredAssets = selectedCategory === 'all' 
    ? assets 
    : assets.filter(asset => asset.category === selectedCategory);

  // Format time for last updated
  const formatLastUpdated = (date) => {
    if (!date) return '';
    
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <Box
      w="full"
      maxW="4xl"
      bg={bgColor}
      borderRadius="xl"
      boxShadow="lg"
      overflow="hidden"
      borderWidth="1px"
      borderColor={borderColor}
    >
      {/* Header */}
      <Flex 
        justify="space-between" 
        align="center" 
        p={boxPadding} 
        borderBottomWidth="1px" 
        borderColor={borderColor}
        flexWrap="wrap"
        gap={2}
      >
        <Flex align="center">
          <Heading size={headingSize} color={textColor}>
            {t('trading.matrix.title', 'Live Markets')}
          </Heading>
          <Tooltip label={t('trading.matrix.info', 'Real-time market data for various assets')}>
            <Box display="inline-block" ml={2}>
              <Icon as={FaInfoCircle} color={subtleTextColor} />
            </Box>
          </Tooltip>
        </Flex>
        
        <HStack spacing={2}>
          <Select
            size="sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            width="auto"
            borderRadius="md"
            icon={<FaFilter />}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </Select>
          
          <Button
            size="sm"
            leftIcon={<FaSyncAlt />}
            onClick={fetchData}
            isLoading={isLoading}
            variant="outline"
          >
            {t('actions.refresh', 'Refresh')}
          </Button>
        </HStack>
      </Flex>
      
      {/* Asset Grid */}
      <Box p={boxPadding}>
        {isLoading ? (
          <Grid
            templateColumns={`repeat(${columns}, 1fr)`}
            gap={gridGap}
          >
            {[...Array(8)].map((_, index) => (
              <Box
                key={index}
                p={boxPadding}
                borderRadius="md"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Skeleton height="24px" mb={2} />
                <Skeleton height="16px" mb={2} width="80%" />
                <Skeleton height="16px" width="40%" />
              </Box>
            ))}
          </Grid>
        ) : (
          <AnimatePresence>
            <Grid
              templateColumns={`repeat(${columns}, 1fr)`}
              gap={gridGap}
            >
              {filteredAssets.map((asset, index) => (
                <motion.div
                  key={asset.symbol}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Box
                    p={boxPadding}
                    borderRadius="md"
                    bg={cardBg}
                    _hover={{ bg: cardHoverBg, transform: 'translateY(-2px)' }}
                    transition="all 0.2s"
                    cursor="pointer"
                    onClick={onOpen}
                    borderWidth="1px"
                    borderColor={borderColor}
                    boxShadow="sm"
                  >
                    <Flex justify="space-between" align="center" mb={1}>
                      <Text fontWeight="bold" fontSize={symbolSize}>{asset.symbol}</Text>
                      <Badge 
                        colorScheme={parseFloat(asset.change) >= 0 ? "green" : "red"}
                        variant="subtle"
                        borderRadius="full"
                        px={2}
                        py={0.5}
                      >
                        <Flex align="center">
                          <Icon 
                            as={parseFloat(asset.change) >= 0 ? BsArrowUpRight : BsArrowDownRight} 
                            mr={1} 
                            fontSize="xs"
                          />
                          {formatPriceChange(asset.change)}
                        </Flex>
                      </Badge>
                    </Flex>
                    
                    <Text fontSize={textSize} color={subtleTextColor} mb={1} isTruncated>
                      {asset.name}
                    </Text>
                    
                    <Flex justify="space-between" align="center">
                      <Text fontWeight="semibold" fontSize={textSize} color={accentColor}>
                        {asset.price}
                      </Text>
                      <Badge 
                        size="sm" 
                        colorScheme="blue" 
                        fontSize="10px"
                        variant="outline"
                        textTransform="capitalize"
                      >
                        {t(`assets.category.${asset.category}`, asset.category)}
                      </Badge>
                    </Flex>
                  </Box>
                </motion.div>
              ))}
            </Grid>
          </AnimatePresence>
        )}
        
        {/* Last updated timestamp */}
        <Flex justify="flex-end" mt={3}>
          <Text fontSize="xs" color={subtleTextColor}>
            {t('data.last_updated', 'Last updated')}: {formatLastUpdated(lastUpdated)}
          </Text>
        </Flex>
      </Box>

      {/* Modal for detailed asset view - would be implemented fully in a real version */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          <ModalHeader>{t('modal.asset_details', 'Asset Details')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{t('modal.feature_coming_soon', 'Detailed asset view coming soon!')}</Text>
            <Flex justify="center" mt={4}>
              <Icon as={FaChartLine} boxSize={12} color={accentColor} />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              {t('actions.close', 'Close')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TradingMatrix;