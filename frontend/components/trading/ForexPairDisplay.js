import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ButtonGroup,
  Text,
  Flex,
  Badge,
  HStack,
  VStack,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Button,
  Tabs,
  TabList,
  Tab,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatArrow,
  Grid,
  Divider,
  useBreakpointValue,
  IconButton,
  Collapse,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Tooltip
} from '@chakra-ui/react';
import { FaArrowUp, FaArrowDown, FaStar, FaChartLine, FaFilter, FaClock, FaChevronDown } from 'react-icons/fa';
import AdvancedChart from '@/components/AdvancedChart';

const ForexPairDisplay = () => {
  const [forexData, setForexData] = useState([]);
  const [category, setCategory] = useState('major');
  const [favoriteMode, setFavoriteMode] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedPair, setSelectedPair] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isDrawerOpen, 
    onOpen: onDrawerOpen, 
    onClose: onDrawerClose 
  } = useDisclosure();
  
  // Responsive design variables
  const isMobile = useBreakpointValue({ base: true, md: false });
  const tableSize = useBreakpointValue({ base: "sm", md: "md" });
  const chartHeight = useBreakpointValue({ base: "300px", md: "500px" });
  
  // Color scheme
  const tableBg = useColorModeValue('white', 'gray.800');
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('blue.50', 'blue.900');
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');

  // Mappings for each forex category
  const majorMapping = {
    'EUR/USD': 'EURUSD',
    'GBP/USD': 'GBPUSD',
    'USD/JPY': 'USDJPY',
    'USD/CHF': 'USDCHF',
    'USD/CAD': 'USDCAD',
    'AUD/USD': 'AUDUSD',
    'NZD/USD': 'NZDUSD',
  };

  const minorMapping = {
    'EUR/GBP': 'EURGBP',
    'EUR/JPY': 'EURJPY',
    'GBP/JPY': 'GBPJPY',
    'CHF/JPY': 'CHFJPY',
    'GBP/AUD': 'GBPAUD',
    'EUR/AUD': 'EURAUD',
    'EUR/CAD': 'EURCAD',
  };

  const exoticMapping = {
    'USD/TRY': 'USDTRY',
    'USD/ZAR': 'USDZAR',
    'USD/MXN': 'USDMXN',
    'USD/SGD': 'USDSGD',
    'USD/HKD': 'USDHKD',
    'EUR/PLN': 'EURPLN',
    'GBP/ZAR': 'GBPZAR',
  };

  // Fetch data with the option to prefer copy files
  const fetchFile = async (basePath) => {
    // Try copy version first (newer data)
    try {
      const copyPath = `${basePath} copy.json`;
      const copyRes = await fetch(copyPath);
      if (copyRes.ok) {
        return await copyRes.json();
      }
    } catch (e) {
      // Silently fail and try standard version
    }
    
    // Try standard version
    const standardPath = `${basePath}.json`;
    const standardRes = await fetch(standardPath);
    if (!standardRes.ok) {
      throw new Error(`Data not available: ${standardRes.status}`);
    }
    return await standardRes.json();
  };

  // Helper function to fetch data for a given mapping
  const fetchDataForMapping = async (mapping) => {
    const entries = Object.entries(mapping);
    const dataArray = [];
    
    for (const [pair, symbol] of entries) {
      try {
        // Use the non-candles version of the file
        const json = await fetchFile(`/chart-data/${symbol}_1d`);
        
        if (!Array.isArray(json) || json.length === 0) {
          console.error(`Invalid or empty data for ${symbol}`);
          continue;
        }
        
        // Get the latest data point
        const latest = json[json.length - 1];
        
        // Get previous data point or use latest if it's the only one
        const previousDay = json.length > 1 ? json[json.length - 2] : latest;
        
        // Calculate values safely
        const bid = parseFloat(latest.close || latest.rate || 0);
        const ask = bid + 0.0002; // Small spread
        
        // Calculate spread in pips
        const pipMultiplier = pair.includes('JPY') ? 100 : 10000;
        const open = parseFloat(latest.open || latest.open_rate || bid);
        const spreadValue = Math.abs((bid - open) * pipMultiplier);
        
        // Calculate daily change safely
        const prevClose = parseFloat(previousDay.close || previousDay.rate || bid);
        const changeValue = prevClose !== 0 ? ((bid - prevClose) / prevClose) * 100 : 0;
        
        dataArray.push({
          pair,
          symbol,
          bid: parseFloat(bid.toFixed(4)),
          ask: parseFloat(ask.toFixed(4)),
          spread: parseFloat(spreadValue.toFixed(1)),
          change: parseFloat(changeValue.toFixed(2)),
          isUp: changeValue >= 0,
          high: parseFloat(latest.high || latest.high_rate || bid),
          low: parseFloat(latest.low || latest.low_rate || bid),
          volume: parseFloat(latest.volume || 0),
          timestamp: latest.timestamp || Date.now(),
          fullData: json
        });
      } catch (error) {
        console.error(`Error processing data for ${pair}:`, error);
      }
    }
    return dataArray;
  };

  function getSubdomain() {
    if (typeof window === 'undefined') return '';
    const parts = window.location.hostname.split('.');
    return parts[0].toLowerCase();
  }

  // Function to refresh all data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const subDomain = getSubdomain();
      
      if (subDomain === 'ldn' || !subDomain) {
        const majorData = await fetchDataForMapping(majorMapping);
        const minorData = await fetchDataForMapping(minorMapping);
        const exoticData = await fetchDataForMapping(exoticMapping);
        setForexData({
          major: majorData,
          minor: minorData,
          exotic: exoticData,
        });
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching forex data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load + refresh
  useEffect(() => {
    refreshData();
    
    // Set up refresh interval
    const interval = setInterval(refreshData, 60000); // Refresh every minute
    
    // Load favorites from local storage
    const savedFavorites = localStorage.getItem('forexFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    return () => clearInterval(interval);
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('forexFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toggle favorite pairs
  const toggleFavorite = (pair) => {
    if (favorites.includes(pair)) {
      setFavorites(prev => prev.filter(p => p !== pair));
    } else {
      setFavorites(prev => [...prev, pair]);
    }
  };

  // Determine which pairs to display based on the selected category or favorites
  const displayPairs = favoriteMode 
    ? [...(forexData.major || []), ...(forexData.minor || []), ...(forexData.exotic || [])]
      .filter(pair => favorites.includes(pair.pair))
    : forexData[category] || [];

  // Open detail modal for a pair
  const openPairDetail = (pair) => {
    setSelectedPair(pair);
    if (isMobile) {
      onDrawerOpen();
    } else {
      onOpen();
    }
  };

  // Format numbers based on pair type (handle JPY pairs differently)
  const formatNumber = (value, pair) => {
    if (value === undefined || value === null || isNaN(value)) return '-';
    return pair && pair.includes('JPY') ? value.toFixed(2) : value.toFixed(4);
  };

  // Available timeframes for the chart
  const availableTimeframes = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];

  return (
    <Box>
      {/* Header with responsive controls */}
      <Flex 
        direction={{ base: 'column', md: 'row' }}
        justify="space-between" 
        align={{ base: 'stretch', md: 'center' }}
        mb={4} 
        bg={headerBg}
        p={3}
        borderRadius="lg"
        boxShadow="sm"
        gap={3}
      >
        <Flex justify="space-between" align="center" width={{ base: 'full', md: 'auto' }}>
          <Heading size="md">Forex Market</Heading>
          {isMobile && (
            <Button 
              size="sm" 
              leftIcon={<FaStar />} 
              colorScheme={favoriteMode ? "yellow" : "gray"}
              variant={favoriteMode ? "solid" : "outline"}
              onClick={() => setFavoriteMode(!favoriteMode)}
            >
              {favoriteMode ? "Favorites" : "Favs"}
            </Button>
          )}
        </Flex>
        
        <Flex 
          wrap="wrap" 
          justify={{ base: 'space-between', md: 'flex-end' }}
          align="center"
          gap={3}
        >
          {/* Category Tabs - Responsive */}
          <Tabs 
            variant="soft-rounded" 
            size="sm"
            onChange={index => {
              setFavoriteMode(false);
              setCategory(['major', 'minor', 'exotic'][index]);
            }}
            width={{ base: '100%', md: 'auto' }}
          >
            <TabList>
              <Tab flexGrow={{ base: 1, md: 0 }}>Major</Tab>
              <Tab flexGrow={{ base: 1, md: 0 }}>Minor</Tab>
              <Tab flexGrow={{ base: 1, md: 0 }}>Exotic</Tab>
            </TabList>
          </Tabs>
          
          {/* Last updated timestamp + manual refresh */}
          <HStack spacing={2} display={{ base: 'none', md: 'flex' }}>
            {lastUpdated && (
              <Text fontSize="xs" color={mutedTextColor}>
                <Icon as={FaClock} mr={1} />
                Updated: {lastUpdated.toLocaleTimeString()}
              </Text>
            )}
            <Button 
              size="sm" 
              color="brand.bitdash.400"
              variant="ghost"
              onClick={refreshData}
              isLoading={isLoading}
            >
              Refresh
            </Button>
          </HStack>
          
          {/* Favorites toggle - desktop only */}
          {!isMobile && (
            <Button 
              size="sm" 
              leftIcon={<FaStar />} 
              colorScheme={favoriteMode ? "yellow" : "gray"}
              variant={favoriteMode ? "solid" : "outline"}
              onClick={() => setFavoriteMode(!favoriteMode)}
            >
              Favorites
            </Button>
          )}
        </Flex>
      </Flex>
      
      {/* Mobile Last Updated + Refresh */}
      {isMobile && lastUpdated && (
        <Flex 
          justify="space-between" 
          align="center" 
          px={2} 
          pb={2} 
          fontSize="xs" 
          color={mutedTextColor}
        >
          <HStack>
            <Icon as={FaClock} />
            <Text>Updated: {lastUpdated.toLocaleTimeString()}</Text>
          </HStack>
          <Button 
            size="xs" 
            color="brand.bitdash.400"
            variant="ghost"
            onClick={refreshData}
            isLoading={isLoading}
          >
            Refresh
          </Button>
        </Flex>
      )}
      
      {/* Data Table - Responsive */}
      <Box 
        borderRadius="lg" 
        borderWidth="1px" 
        borderColor={borderColor} 
        overflow={{ base: 'auto', md: 'hidden' }}
        boxShadow="md"
        mb={6}
      >
        <Table variant="simple" size={tableSize}>
          <Thead bg={headerBg} position="sticky" top={0} zIndex={1}>
            <Tr>
              <Th>Pair</Th>
              <Th isNumeric display={{ base: 'none', sm: 'table-cell' }}>Bid</Th>
              <Th isNumeric>Ask</Th>
              <Th isNumeric display={{ base: 'none', md: 'table-cell' }}>Spread</Th>
              <Th isNumeric>24h Change</Th>
              <Th width="70px" textAlign="center">
                <Icon as={FaChartLine} />
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {displayPairs.length > 0 ? (
              displayPairs.map((pair, index) => (
                <Tr 
                  key={index} 
                  bg={tableBg} 
                  _hover={{ bg: hoverBg, cursor: 'pointer' }} 
                  transition="background 0.2s"
                  onClick={() => openPairDetail(pair)}
                >
                  <Td fontWeight="medium">
                    <HStack>
                      <Text>{pair.pair}</Text>
                      {favorites.includes(pair.pair) && (
                        <Icon 
                          as={FaStar} 
                          color="yellow.400" 
                          boxSize={3}
                        />
                      )}
                    </HStack>
                  </Td>
                  <Td isNumeric fontFamily="mono" display={{ base: 'none', sm: 'table-cell' }}>
                    {pair.bid && !isNaN(pair.bid) ? formatNumber(pair.bid, pair.pair) : '-'}
                  </Td>
                  <Td isNumeric fontFamily="mono" fontWeight="medium">
                    {pair.ask && !isNaN(pair.ask) ? formatNumber(pair.ask, pair.pair) : '-'}
                  </Td>
                  <Td isNumeric display={{ base: 'none', md: 'table-cell' }}>
                    {pair.spread && !isNaN(pair.spread) ? pair.spread.toFixed(1) : '-'}
                  </Td>
                  <Td isNumeric>
                    <Badge 
                      colorScheme={pair.isUp ? "green" : "red"} 
                      variant="subtle" 
                      px={2} 
                      py={1} 
                      borderRadius="md"
                    >
                      <HStack spacing={1}>
                        <Icon as={pair.isUp ? FaArrowUp : FaArrowDown} boxSize={2} />
                        <Text>{pair.change}%</Text>
                      </HStack>
                    </Badge>
                  </Td>
                  <Td textAlign="center">
                    <HStack spacing={2} justify="center">
                      <IconButton
                        icon={<FaStar />}
                        variant="ghost"
                        colorScheme={favorites.includes(pair.pair) ? "yellow" : "gray"}
                        size="sm"
                        aria-label={favorites.includes(pair.pair) ? "Remove from favorites" : "Add to favorites"}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(pair.pair);
                        }}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={6} textAlign="center" py={8}>
                  <VStack spacing={2}>
                    <Text>No pairs available</Text>
                    <Text fontSize="sm" color="gray.500">
                      {favoriteMode ? "Click the star icon to add pairs to your favorites" : "No data available for this category"}
                    </Text>
                  </VStack>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
      
      {/* Information Cards - Responsive Grid */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
        <Box p={3} bg={tableBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} boxShadow="sm">
          <VStack spacing={1} align="start">
            <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500">Trading Hours</Text>
            <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>24/5</Text>
          </VStack>
        </Box>
        <Box p={3} bg={tableBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} boxShadow="sm">
          <VStack spacing={1} align="start">
            <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500">Min. Spread</Text>
            <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>0.1 pips</Text>
          </VStack>
        </Box>
        <Box p={3} bg={tableBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} boxShadow="sm">
          <VStack spacing={1} align="start">
            <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500">Max. Leverage</Text>
            <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>1:500</Text>
          </VStack>
        </Box>
        <Box p={3} bg={tableBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} boxShadow="sm">
          <VStack spacing={1} align="start">
            <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500">Commission</Text>
            <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>Zero</Text>
          </VStack>
        </Box>
      </SimpleGrid>
      
      {/* Desktop: Pair Detail Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        size="5xl" 
        scrollBehavior="inside"
      >
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent bg={tableBg}>
          <ModalHeader>
            <HStack spacing={2}>
              <Text>{selectedPair?.pair}</Text>
              <IconButton
                icon={<FaStar />}
                variant="ghost"
                colorScheme={favorites.includes(selectedPair?.pair) ? "yellow" : "gray"}
                size="sm"
                aria-label={favorites.includes(selectedPair?.pair) ? "Remove from favorites" : "Add to favorites"}
                onClick={() => selectedPair && toggleFavorite(selectedPair.pair)}
              />
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <PairDetailContent 
              selectedPair={selectedPair}
              selectedTimeframe={selectedTimeframe}
              setSelectedTimeframe={setSelectedTimeframe}
              availableTimeframes={availableTimeframes}
              formatNumber={formatNumber}
              chartHeight={chartHeight}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      
      {/* Mobile: Pair Detail Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        placement="bottom"
        onClose={onDrawerClose}
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent borderTopRadius="lg">
          <DrawerHeader borderBottomWidth="1px">
            <HStack spacing={2}>
              <Text>{selectedPair?.pair}</Text>
              <IconButton
                icon={<FaStar />}
                variant="ghost"
                colorScheme={favorites.includes(selectedPair?.pair) ? "yellow" : "gray"}
                size="sm"
                aria-label={favorites.includes(selectedPair?.pair) ? "Remove from favorites" : "Add to favorites"}
                onClick={() => selectedPair && toggleFavorite(selectedPair.pair)}
              />
            </HStack>
          </DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>
            <PairDetailContent 
              selectedPair={selectedPair}
              selectedTimeframe={selectedTimeframe}
              setSelectedTimeframe={setSelectedTimeframe}
              availableTimeframes={availableTimeframes}
              formatNumber={formatNumber}
              chartHeight={chartHeight}
              isMobile={true}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

// Extracted Component: Pair Detail Content
// This saves code duplication between Modal and Drawer
const PairDetailContent = ({ 
  selectedPair, 
  selectedTimeframe, 
  setSelectedTimeframe, 
  availableTimeframes,
  formatNumber,
  chartHeight,
  isMobile
}) => {
  const bg = useColorModeValue('gray.50', 'gray.700');
  
  if (!selectedPair) return null;
  
  return (
    <>
      {/* Chart Component */}
      <Box 
        mb={4}
      >
        <AdvancedChart 
          selectedCoin={{ 
            symbol: selectedPair.symbol, 
            name: selectedPair.pair 
          }}
          selectedInterval={selectedTimeframe}
        />
      </Box>
      
      {/* Stats Grid - Responsive */}
      <Grid 
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
        gap={4}
        p={4}
        bg={bg}
        borderRadius="md"
        mb={4}
      >
        <Stat size={isMobile ? "sm" : "md"}>
          <StatLabel>Current Price</StatLabel>
          <StatNumber fontSize={isMobile ? "lg" : "xl"}>
            {formatNumber(selectedPair.ask, selectedPair.pair)}
          </StatNumber>
        </Stat>
        
        <Stat size={isMobile ? "sm" : "md"}>
          <StatLabel>24h Change</StatLabel>
          <StatNumber 
            fontSize={isMobile ? "lg" : "xl"}
            color={selectedPair.isUp ? "green.500" : "red.500"}
          >
            <StatArrow type={selectedPair.isUp ? "increase" : "decrease"} />
            {selectedPair.change}%
          </StatNumber>
        </Stat>
        
        <Stat size={isMobile ? "sm" : "md"}>
          <StatLabel>24h High</StatLabel>
          <StatNumber fontSize={isMobile ? "lg" : "xl"}>
            {formatNumber(selectedPair.high, selectedPair.pair)}
          </StatNumber>
        </Stat>
        
        <Stat size={isMobile ? "sm" : "md"}>
          <StatLabel>24h Low</StatLabel>
          <StatNumber fontSize={isMobile ? "lg" : "xl"}>
            {formatNumber(selectedPair.low, selectedPair.pair)}
          </StatNumber>
        </Stat>
      </Grid>
      
      <Divider mb={4} />
      
      {/* Market Information - Responsive */}
      <VStack align="stretch" spacing={4}>
        <Heading size={isMobile ? "sm" : "md"}>Market Information</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Box>
            <Text fontWeight="bold" mb={1}>Description</Text>
            <Text fontSize={isMobile ? "sm" : "md"}>
              {getPairDescription(selectedPair.pair)}
            </Text>
          </Box>
          
          <Box>
            <Text fontWeight="bold" mb={1}>Trading Hours</Text>
            <Text fontSize={isMobile ? "sm" : "md"}>Monday 00:00 - Friday 22:00 GMT</Text>
            <Text mt={2} fontWeight="bold">Market Specifications</Text>
            <HStack mt={1} justify="space-between">
              <Text fontSize={isMobile ? "sm" : "md"}>Min Spread:</Text>
              <Text fontWeight="medium" fontSize={isMobile ? "sm" : "md"}>
                {selectedPair.spread.toFixed(1)} pips
              </Text>
            </HStack>
            <HStack mt={1} justify="space-between">
              <Text fontSize={isMobile ? "sm" : "md"}>Leverage:</Text>
              <Text fontWeight="medium" fontSize={isMobile ? "sm" : "md"}>Up to 1:500</Text>
            </HStack>
            <HStack mt={1} justify="space-between">
              <Text fontSize={isMobile ? "sm" : "md"}>Min Lot Size:</Text>
              <Text fontWeight="medium" fontSize={isMobile ? "sm" : "md"}>0.01</Text>
            </HStack>
          </Box>
        </SimpleGrid>
      </VStack>
    </>
  );
};

// Helper function to get descriptions for forex pairs
const getPairDescription = (pair) => {
  const descriptions = {
    'EUR/USD': 'The Euro vs US Dollar (EUR/USD) is the most traded currency pair in the world. Both currencies represent two of the largest economies globally. The pair is affected by factors that influence the value of the euro and/or the US dollar.',
    'GBP/USD': 'The British Pound vs US Dollar (GBP/USD) represents the currencies of two major financial powers. It is influenced by the economic policies of the UK and US, as well as the trade relationship between these nations.',
    'USD/JPY': 'The US Dollar vs Japanese Yen (USD/JPY) is one of the most liquid currency pairs. It is particularly sensitive to changes in US and Japanese interest rates and serves as an important barometer of risk sentiment in financial markets.',
    'USD/CHF': 'The US Dollar vs Swiss Franc (USD/CHF) pair combines the USD with the Swiss Franc, which is considered a safe-haven currency. The Swiss National Bank\'s policies significantly influence this pair.',
    'USD/CAD': 'The US Dollar vs Canadian Dollar (USD/CAD) is heavily influenced by the price of oil, as Canada is a major oil exporter. The tight economic integration between the US and Canada also impacts this pair.',
    'AUD/USD': 'The Australian Dollar vs US Dollar (AUD/USD) is a commodity currency pair sensitive to changes in commodity prices, particularly metals and minerals that Australia exports globally.',
    'NZD/USD': 'The New Zealand Dollar vs US Dollar (NZD/USD) is influenced by agricultural commodity prices and New Zealand\'s export economy. It is also sensitive to risk sentiment in global markets.',
  };
  
  return descriptions[pair] || `${pair} represents the exchange rate between the two currencies, reflecting their relative economic strength and monetary policies.`;
};

export default ForexPairDisplay;