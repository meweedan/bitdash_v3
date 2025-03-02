import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
} from '@chakra-ui/react';
import { FaArrowUp, FaArrowDown, FaStar } from 'react-icons/fa';

const ForexPairDisplay = () => {
  const [forexData, setForexData] = useState([]);
  const [category, setCategory] = useState('major');
  const [favoriteMode, setFavoriteMode] = useState(false);
  const [favorites, setFavorites] = useState([]);
  
  const tableBg = useColorModeValue('white', 'gray.800');
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('blue.50', 'blue.900');

  // Mappings for each forex category.
  // Adjust file names if necessary to match your public/chart-data folder.
  const majorMapping = {
    'EUR/USD': 'EURUSD_1d.json',
    'GBP/USD': 'GBPUSD_1d.json',
    'USD/JPY': 'USDJPY_1d.json',
    'USD/CHF': 'USDCHF_1h.json',
    'USD/CAD': 'USDCAD_1d.json',
    'AUD/USD': 'AUDUSD_1d.json',
    'NZD/USD': 'NZDUSD_1d.json',
  };

  const minorMapping = {
    'EUR/GBP': 'EURGBP_1h.json',
    'EUR/JPY': 'EURJPY_1h.json',
    'GBP/JPY': 'GBPJPY_1d.json',
    'CHF/JPY': 'CHFJPY_1d.json',
    'GBP/AUD': 'GBPAUD_1d.json',
    'EUR/AUD': 'EURAUD_1d.json',
    'EUR/CAD': 'EURUSD_1d.json', // fallback if no dedicated file exists
  };

  const exoticMapping = {
    'USD/TRY': 'USDTRY_1d.json',
    'USD/ZAR': 'USDZAR_1d.json',
    'USD/MXN': 'MXN_1d.json',
    'USD/SGD': 'USDSGD_1d.json',
    'USD/HKD': 'HKD_1d.json',
    'EUR/PLN': 'EURPLN_1d.json',
    'GBP/ZAR': 'GBPZAR_1d.json',
  };

  // Helper function to fetch data for a given mapping.
  // Assumes each JSON file contains an array of candles.
  const fetchDataForMapping = async (mapping) => {
    const entries = Object.entries(mapping);
    const dataArray = [];
    for (const [pair, file] of entries) {
      try {
        const res = await fetch(`/chart-data/${file}`);
        const json = await res.json();
        if (Array.isArray(json) && json.length > 0) {
          const latest = json[json.length - 1]; // Get the most recent data point
          dataArray.push({
            pair,
            // Use open and close values from the candle; you can adjust as needed.
            bid: latest.open,
            ask: latest.close,
            // Calculate spread in pips (assumes a 4-decimal format for most pairs)
            spread: parseFloat(((latest.close - latest.open) * 10000).toFixed(1)),
            change: parseFloat((((latest.close - latest.open) / latest.open) * 100).toFixed(2)),
            isUp: latest.close >= latest.open,
            popular: false, // Set manually if needed.
          });
        }
      } catch (error) {
        console.error(`Error fetching data for ${pair} from ${file}:`, error);
      }
    }
    return dataArray;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      const majorData = await fetchDataForMapping(majorMapping);
      const minorData = await fetchDataForMapping(minorMapping);
      const exoticData = await fetchDataForMapping(exoticMapping);
      setForexData({
        major: majorData,
        minor: minorData,
        exotic: exoticData,
      });
    };

    fetchAllData();
    const interval = setInterval(fetchAllData, 5000); // Refresh data every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Toggle favorite pairs
  const toggleFavorite = (pair) => {
    if (favorites.includes(pair)) {
      setFavorites(prev => prev.filter(p => p !== pair));
    } else {
      setFavorites(prev => [...prev, pair]);
    }
  };

  // Determine which pairs to display based on the selected category or favorites.
  const displayPairs = favoriteMode 
    ? [...(forexData.major || []), ...(forexData.minor || []), ...(forexData.exotic || [])].filter(pair => favorites.includes(pair.pair))
    : forexData[category] || [];

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4} wrap={{ base: 'wrap', md: 'nowrap' }}>
        <Tabs 
          variant="soft-rounded" 
          colorScheme="blue" 
          size="sm"
          onChange={index => {
            setFavoriteMode(false);
            setCategory(['major', 'minor', 'exotic'][index]);
          }}
          mb={{ base: 3, md: 0 }}
        >
          <TabList>
            <Tab>Major Pairs</Tab>
            <Tab>Minor Pairs</Tab>
            <Tab>Exotic Pairs</Tab>
          </TabList>
        </Tabs>
        
        <Button 
          size="sm" 
          leftIcon={<FaStar />} 
          colorScheme={favoriteMode ? "yellow" : "gray"}
          variant={favoriteMode ? "solid" : "outline"}
          onClick={() => setFavoriteMode(!favoriteMode)}
        >
          Favorites
        </Button>
      </Flex>
      
      <Box borderRadius="md" borderWidth="1px" borderColor={borderColor} overflow="hidden">
        <Table variant="simple" size="sm">
          <Thead bg={headerBg}>
            <Tr>
              <Th>Pair</Th>
              <Th isNumeric>Bid</Th>
              <Th isNumeric>Ask</Th>
              <Th isNumeric>Spread</Th>
              <Th isNumeric>24h Change</Th>
              <Th width="50px"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {displayPairs.map((pair, index) => (
              <Tr key={index} bg={tableBg} _hover={{ bg: hoverBg }} transition="background 0.2s">
                <Td fontWeight="medium">
                  <HStack>
                    <Text>{pair.pair}</Text>
                  </HStack>
                </Td>
                <Td isNumeric fontFamily="mono">{pair.bid.toFixed(4)}</Td>
                <Td isNumeric fontFamily="mono">{pair.ask.toFixed(4)}</Td>
                <Td isNumeric>{pair.spread.toFixed(1)}</Td>
                <Td isNumeric>
                  <Flex align="center" justify="flex-end">
                    <Badge colorScheme={pair.isUp ? "green" : "red"} variant="subtle" display="flex" alignItems="center">
                      <Icon as={pair.isUp ? FaArrowUp : FaArrowDown} boxSize={2} mr={1} />
                      {pair.change}%
                    </Badge>
                  </Flex>
                </Td>
                <Td>
                  <Icon 
                    as={FaStar} 
                    color={favorites.includes(pair.pair) ? "yellow.400" : "gray.300"} 
                    cursor="pointer"
                    onClick={() => toggleFavorite(pair.pair)}
                  />
                </Td>
              </Tr>
            ))}
            {favoriteMode && displayPairs.length === 0 && (
              <Tr>
                <Td colSpan={6} textAlign="center" py={8}>
                  <VStack spacing={2}>
                    <Text>No favorite pairs selected</Text>
                    <Text fontSize="sm" color="gray.500">
                      Click the star icon to add pairs to your favorites
                    </Text>
                  </VStack>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
      
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mt={6}>
        <Box p={3} bg={tableBg} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
          <VStack spacing={1} align="start">
            <Text fontSize="xs" color="gray.500">Trading Hours</Text>
            <Text fontWeight="bold">24/5</Text>
          </VStack>
        </Box>
        <Box p={3} bg={tableBg} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
          <VStack spacing={1} align="start">
            <Text fontSize="xs" color="gray.500">Min. Spread</Text>
            <Text fontWeight="bold">0.1 pips</Text>
          </VStack>
        </Box>
        <Box p={3} bg={tableBg} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
          <VStack spacing={1} align="start">
            <Text fontSize="xs" color="gray.500">Max. Leverage</Text>
            <Text fontWeight="bold">1:500</Text>
          </VStack>
        </Box>
        <Box p={3} bg={tableBg} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
          <VStack spacing={1} align="start">
            <Text fontSize="xs" color="gray.500">Commission</Text>
            <Text fontWeight="bold">Zero</Text>
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default ForexPairDisplay;
