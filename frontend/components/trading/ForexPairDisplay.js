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
import { motion } from 'framer-motion';
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

  // Generate demo forex data
  useEffect(() => {
    const majorPairs = [
      { pair: 'EUR/USD', bid: 1.0864, ask: 1.0867, spread: 0.3, change: 0.12, isUp: true, popular: true },
      { pair: 'GBP/USD', bid: 1.2683, ask: 1.2687, spread: 0.4, change: -0.34, isUp: false, popular: true },
      { pair: 'USD/JPY', bid: 153.42, ask: 153.45, spread: 0.3, change: -0.21, isUp: false, popular: true },
      { pair: 'USD/CHF', bid: 0.9045, ask: 0.9048, spread: 0.3, change: 0.15, isUp: true, popular: false },
      { pair: 'USD/CAD', bid: 1.3652, ask: 1.3655, spread: 0.3, change: -0.18, isUp: false, popular: false },
      { pair: 'AUD/USD', bid: 0.6527, ask: 0.6530, spread: 0.3, change: 0.24, isUp: true, popular: true },
      { pair: 'NZD/USD', bid: 0.6075, ask: 0.6079, spread: 0.4, change: 0.35, isUp: true, popular: false }
    ];
    
    const minorPairs = [
      { pair: 'EUR/GBP', bid: 0.8565, ask: 0.8569, spread: 0.4, change: 0.28, isUp: true, popular: false },
      { pair: 'EUR/JPY', bid: 166.67, ask: 166.72, spread: 0.5, change: -0.11, isUp: false, popular: true },
      { pair: 'GBP/JPY', bid: 194.58, ask: 194.64, spread: 0.6, change: -0.54, isUp: false, popular: true },
      { pair: 'CHF/JPY', bid: 169.61, ask: 169.67, spread: 0.6, change: -0.32, isUp: false, popular: false },
      { pair: 'GBP/AUD', bid: 1.9428, ask: 1.9434, spread: 0.6, change: -0.47, isUp: false, popular: false },
      { pair: 'EUR/AUD', bid: 1.6643, ask: 1.6648, spread: 0.5, change: -0.19, isUp: false, popular: false },
      { pair: 'EUR/CAD', bid: 1.4825, ask: 1.4830, spread: 0.5, change: 0.08, isUp: true, popular: false }
    ];
    
    const exoticPairs = [
      { pair: 'USD/TRY', bid: 32.458, ask: 32.478, spread: 2.0, change: 0.65, isUp: true, popular: true },
      { pair: 'USD/ZAR', bid: 18.742, ask: 18.762, spread: 2.0, change: -0.42, isUp: false, popular: false },
      { pair: 'USD/MXN', bid: 16.938, ask: 16.958, spread: 2.0, change: 0.18, isUp: true, popular: true },
      { pair: 'USD/SGD', bid: 1.3427, ask: 1.3432, spread: 0.5, change: -0.11, isUp: false, popular: false },
      { pair: 'USD/HKD', bid: 7.8164, ask: 7.8169, spread: 0.5, change: 0.01, isUp: true, popular: false },
      { pair: 'EUR/PLN', bid: 4.3065, ask: 4.3085, spread: 2.0, change: 0.24, isUp: true, popular: false },
      { pair: 'GBP/ZAR', bid: 23.772, ask: 23.792, spread: 2.0, change: -0.75, isUp: false, popular: false }
    ];
    
    const categories = {
      major: majorPairs,
      minor: minorPairs,
      exotic: exoticPairs
    };
    
    setForexData(categories);
    
    // Simulate data updates
    const interval = setInterval(() => {
      setForexData(prevData => {
        const updatePairs = (pairs) => {
          return pairs.map(pair => {
            // Small random change
            const bidChange = (Math.random() - 0.5) * 0.0008;
            const newBid = parseFloat((pair.bid + bidChange).toFixed(4));
            const newAsk = parseFloat((newBid + pair.spread / 10000).toFixed(4));
            
            // Calculate change percentage for 24h
            const changePercentage = (Math.random() - 0.5) * 0.2;
            const newChange = parseFloat((pair.change + changePercentage).toFixed(2));
            const isUp = newChange >= 0;
            
            return {
              ...pair,
              bid: newBid,
              ask: newAsk,
              change: newChange,
              isUp
            };
          });
        };
        
        return {
          major: updatePairs(prevData.major),
          minor: updatePairs(prevData.minor),
          exotic: updatePairs(prevData.exotic)
        };
      });
    }, 2000);
    
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

  // Current pairs to display based on category
  const displayPairs = favoriteMode 
    ? [...forexData.major, ...forexData.minor, ...forexData.exotic].filter(pair => favorites.includes(pair.pair))
    : forexData[category] || [];

  return (
    <Box>
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        wrap={{ base: 'wrap', md: 'nowrap' }}
      >
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
      
      <Box
        borderRadius="md"
        borderWidth="1px"
        borderColor={borderColor}
        overflow="hidden"
      >
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
              <Tr 
                key={index}
                bg={tableBg}
                _hover={{ bg: hoverBg }}
                transition="background 0.2s"
              >
                <Td fontWeight="medium">
                  <HStack>
                    <Text>{pair.pair}</Text>
                    {pair.popular && (
                      <Badge size="sm" colorScheme="green" variant="subtle">
                        Popular
                      </Badge>
                    )}
                  </HStack>
                </Td>
                <Td isNumeric fontFamily="mono">{pair.bid.toFixed(4)}</Td>
                <Td isNumeric fontFamily="mono">{pair.ask.toFixed(4)}</Td>
                <Td isNumeric>{pair.spread.toFixed(1)}</Td>
                <Td isNumeric>
                  <Flex align="center" justify="flex-end">
                    <Badge
                      colorScheme={pair.isUp ? "green" : "red"}
                      variant="subtle"
                      display="flex"
                      alignItems="center"
                    >
                      <Icon 
                        as={pair.isUp ? FaArrowUp : FaArrowDown} 
                        boxSize={2} 
                        mr={1} 
                      />
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
        <Box
          p={3}
          bg={tableBg}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <VStack spacing={1} align="start">
            <Text fontSize="xs" color="gray.500">Trading Hours</Text>
            <Text fontWeight="bold">24/5</Text>
          </VStack>
        </Box>
        <Box
          p={3}
          bg={tableBg}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <VStack spacing={1} align="start">
            <Text fontSize="xs" color="gray.500">Min. Spread</Text>
            <Text fontWeight="bold">0.1 pips</Text>
          </VStack>
        </Box>
        <Box
          p={3}
          bg={tableBg}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <VStack spacing={1} align="start">
            <Text fontSize="xs" color="gray.500">Max. Leverage</Text>
            <Text fontWeight="bold">1:500</Text>
          </VStack>
        </Box>
        <Box
          p={3}
          bg={tableBg}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
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