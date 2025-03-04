import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  SimpleGrid,
  Text,
  Image,
  Badge,
  HStack,
  VStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaStar, 
  FaSearch,
  FaRegClock
} from 'react-icons/fa';
import { useRouter } from 'next/router';

const CryptoMarketplace = () => {
  const [allCoins, setAllCoins] = useState([]);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();

  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('blue.50', 'blue.900');

  // Fetch market data from CoinGecko API
  useEffect(() => {
    const fetchAllCoins = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h"
        );
        const data = await res.json();
        setAllCoins(data);
      } catch (error) {
        console.error("Error fetching all coins", error);
      }
    };

    fetchAllCoins();
    const interval = setInterval(fetchAllCoins, 15000); // refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch trending coins from CoinGecko trending API
  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/search/trending");
        const data = await res.json();
        // data.coins is an array of { item: { id, name, symbol, market_cap_rank, thumb, ... } }
        const trending = data.coins.map(item => item.item);
        setTrendingCoins(trending);
      } catch (error) {
        console.error("Error fetching trending coins", error);
      }
    };

    fetchTrendingCoins();
    const interval = setInterval(fetchTrendingCoins, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update filtered data based on the selected tab and search query.
  useEffect(() => {
    let data = [];
    if (tabIndex === 0) {
      data = allCoins; // All assets
    } else if (tabIndex === 1) {
      // Top tokens: take top 20 by market cap
      data = allCoins.slice(0, 20);
    } else if (tabIndex === 2) {
      data = trendingCoins;
    }

    if (searchQuery) {
      data = data.filter(item => 
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.symbol && item.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    setFilteredData(data);
  }, [searchQuery, allCoins, trendingCoins, tabIndex]);

  // Toggle favorite coins
  const toggleFavorite = (id) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(fav => fav !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Redirect to signup/trader page when Trade is clicked
  const handleTrade = () => {
    router.push('/signup/trader');
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4} direction={{ base: 'column', md: 'row' }}>
        <Tabs variant="soft-rounded" size="sm" onChange={setTabIndex} mb={{ base: 3, md: 0 }}>
          <TabList>
            <Tab>All Assets</Tab>
            <Tab>Top Tokens</Tab>
            <Tab>Trending</Tab>
          </TabList>
        </Tabs>
        
        <InputGroup maxW={{ base: '100%', md: '300px' }}>
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} color="gray.400" />
          </InputLeftElement>
          <Input 
            placeholder="Search assets" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </Flex>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        <Box p={4} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
          <VStack spacing={0} align="start">
            <Text fontSize="sm" color="gray.500">Global Market Cap</Text>
            <Text fontSize="xl" fontWeight="bold">$2.34T</Text>
            <HStack spacing={1} mt={1}>
              <Icon as={FaArrowUp} color="green.400" boxSize={3} />
              <Text fontSize="sm" color="green.400">2.7% (24h)</Text>
            </HStack>
          </VStack>
        </Box>
        <Box p={4}  borderRadius="md" borderWidth="1px" borderColor={borderColor}>
          <VStack spacing={0} align="start">
            <Text fontSize="sm" color="gray.500">24h Trading Volume</Text>
            <Text fontSize="xl" fontWeight="bold">$105.6B</Text>
            <HStack spacing={1} mt={1}>
              <Icon as={FaArrowUp} color="green.400" boxSize={3} />
              <Text fontSize="sm" color="green.400">5.3% (24h)</Text>
            </HStack>
          </VStack>
        </Box>
        <Box p={4}  borderRadius="md" borderWidth="1px" borderColor={borderColor}>
          <VStack spacing={0} align="start">
            <Text fontSize="sm" color="gray.500">BTC Dominance</Text>
            <Text fontSize="xl" fontWeight="bold">52.4%</Text>
            <HStack spacing={1} mt={1}>
              <Icon as={FaArrowDown} color="red.400" boxSize={3} />
              <Text fontSize="sm" color="red.400">0.8% (24h)</Text>
            </HStack>
          </VStack>
        </Box>
      </SimpleGrid>
      
      {filteredData.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {filteredData.map((crypto, index) => (
            <motion.div
              key={crypto.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Box
                p={4}
                
                borderRadius="md"
                borderWidth="1px"
                borderColor={borderColor}
                _hover={{ transform: 'translateY(-2px)', shadow: 'md', borderColor: 'blue.300' }}
                transition="all 0.2s"
              >
                <Flex justify="space-between" align="center" mb={3}>
                  <HStack>
                    <Image src={crypto.image} boxSize={6} alt={crypto.name} />
                    <VStack spacing={0} align="start">
                      <Text fontWeight="bold">{crypto.name}</Text>
                      <Text color="gray.500" fontSize="sm">{crypto.symbol.toUpperCase()}</Text>
                    </VStack>
                  </HStack>
                  <Badge 
                    colorScheme={crypto.price_change_percentage_24h >= 0 ? "green" : "red"}
                    display="flex"
                    alignItems="center"
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    <Icon as={crypto.price_change_percentage_24h >= 0 ? FaArrowUp : FaArrowDown} boxSize={2} mr={1} />
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </Badge>
                </Flex>
                
                <Text fontSize="2xl" fontWeight="bold" mb={3}>
                  ${crypto.current_price < 0.01 ? crypto.current_price.toFixed(8) : crypto.current_price.toFixed(2)}
                </Text>
                
                <Button 
                  colorScheme="blue" 
                  size="sm" 
                  width="full" 
                  mt={4}
                  variant="bittrade-outline"
                  onClick={handleTrade}
                >
                  Trade
                </Button>
              </Box>
            </motion.div>
          ))}
        </SimpleGrid>
      ) : (
        <Box
          p={8}
          
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
          textAlign="center"
        >
          <VStack spacing={2}>
            <Text>No assets found matching your search</Text>
            <Text fontSize="sm" color="gray.500">
              Try a different search term or category
            </Text>
          </VStack>
        </Box>
      )}
      
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mt={6}>
        <Box p={3}  borderRadius="md" borderWidth="1px" borderColor={borderColor}>
          <VStack spacing={1} align="start">
            <Text fontSize="xs" color="gray.500">Trading Hours</Text>
            <HStack>
              <Icon as={FaRegClock} color="brand.bittrade.500" boxSize={3} />
              <Text fontWeight="bold">24/7</Text>
            </HStack>
          </VStack>
        </Box>
        <Box p={3}  borderRadius="md" borderWidth="1px" borderColor={borderColor}>
          <VStack spacing={1} align="start">
            <Text fontSize="xs" color="gray.500">Trading Fee</Text>
            <Text fontWeight="bold">From 0.1%</Text>
          </VStack>
        </Box>
        <Box p={3}  borderRadius="md" borderWidth="1px" borderColor={borderColor}>
          <VStack spacing={1} align="start">
            <Text fontSize="xs" color="gray.500">Min. Deposit</Text>
            <Text fontWeight="bold">$10</Text>
          </VStack>
        </Box>
        <Box p={3}  borderRadius="md" borderWidth="1px" borderColor={borderColor}>
          <VStack spacing={1} align="start">
            <Text fontSize="xs" color="gray.500">Security</Text>
            <Text fontWeight="bold">Cold Storage</Text>
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default CryptoMarketplace;
