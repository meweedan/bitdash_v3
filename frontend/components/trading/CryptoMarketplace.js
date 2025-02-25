import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Text,
  Image,
  Badge,
  HStack,
  VStack,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaStar, 
  FaSearch,
  FaBitcoin,
  FaEthereum,
  FaChartLine,
  FaRegClock
} from 'react-icons/fa';

const CryptoMarketplace = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('blue.50', 'blue.900');

  // Generate demo crypto data
  useEffect(() => {
    const cryptos = [
      { 
        id: 'bitcoin', 
        name: 'Bitcoin', 
        symbol: 'BTC', 
        price: 61247.80, 
        change24h: 2.14, 
        volume24h: 24582.34,
        marketCap: 1205.7,
        icon: FaBitcoin,
        color: 'orange.400',
        isUp: true,
        top: true,
        trending: true
      },
      { 
        id: 'ethereum', 
        name: 'Ethereum', 
        symbol: 'ETH', 
        price: 3408.52, 
        change24h: 1.87, 
        volume24h: 13285.67,
        marketCap: 410.2,
        icon: FaEthereum,
        color: 'purple.400',
        isUp: true,
        top: true,
        trending: true
      },
      { 
        id: 'solana', 
        name: 'Solana', 
        symbol: 'SOL', 
        price: 158.75, 
        change24h: 4.32, 
        volume24h: 4572.19,
        marketCap: 70.8,
        icon: FaChartLine,
        color: 'green.400',
        isUp: true,
        top: true,
        trending: true
      },
      { 
        id: 'cardano', 
        name: 'Cardano', 
        symbol: 'ADA', 
        price: 0.53, 
        change24h: -1.24, 
        volume24h: 897.45,
        marketCap: 18.9,
        icon: FaChartLine,
        color: 'blue.400',
        isUp: false,
        top: true,
        trending: false
      },
      { 
        id: 'xrp', 
        name: 'XRP', 
        symbol: 'XRP', 
        price: 0.62, 
        change24h: -2.18, 
        volume24h: 1523.87,
        marketCap: 33.7,
        icon: FaChartLine,
        color: 'gray.400',
        isUp: false,
        top: true,
        trending: false
      },
      { 
        id: 'polkadot', 
        name: 'Polkadot', 
        symbol: 'DOT', 
        price: 7.82, 
        change24h: 0.87, 
        volume24h: 432.56,
        marketCap: 10.1,
        icon: FaChartLine,
        color: 'pink.400',
        isUp: true,
        top: false,
        trending: false
      },
      { 
        id: 'dogecoin', 
        name: 'Dogecoin', 
        symbol: 'DOGE', 
        price: 0.154, 
        change24h: 3.45, 
        volume24h: 1268.45,
        marketCap: 21.8,
        icon: FaChartLine,
        color: 'yellow.400',
        isUp: true,
        top: false,
        trending: true
      },
      { 
        id: 'avalanche', 
        name: 'Avalanche', 
        symbol: 'AVAX', 
        price: 34.72, 
        change24h: 1.18, 
        volume24h: 542.36,
        marketCap: 12.7,
        icon: FaChartLine,
        color: 'red.400',
        isUp: true,
        top: false,
        trending: false
      },
      { 
        id: 'chainlink', 
        name: 'Chainlink', 
        symbol: 'LINK', 
        price: 14.83, 
        change24h: -0.54, 
        volume24h: 358.42,
        marketCap: 8.5,
        icon: FaChartLine,
        color: 'blue.500',
        isUp: false,
        top: false,
        trending: false
      },
      { 
        id: 'litecoin', 
        name: 'Litecoin', 
        symbol: 'LTC', 
        price: 84.35, 
        change24h: 0.34, 
        volume24h: 487.23,
        marketCap: 6.2,
        icon: FaChartLine,
        color: 'gray.500',
        isUp: true,
        top: false,
        trending: false
      },
      { 
        id: 'uniswap', 
        name: 'Uniswap', 
        symbol: 'UNI', 
        price: 10.27, 
        change24h: -1.87, 
        volume24h: 198.36,
        marketCap: 5.4,
        icon: FaChartLine,
        color: 'pink.300',
        isUp: false,
        top: false,
        trending: false
      },
      { 
        id: 'shiba-inu', 
        name: 'Shiba Inu', 
        symbol: 'SHIB', 
        price: 0.00002534, 
        change24h: 5.67, 
        volume24h: 876.54,
        marketCap: 14.9,
        icon: FaChartLine,
        color: 'orange.300',
        isUp: true,
        top: false,
        trending: true
      }
    ];
    
    setCryptoData(cryptos);
    setFilteredData(cryptos);
    
    // Simulate data updates
    const interval = setInterval(() => {
      setCryptoData(prevData => {
        return prevData.map(crypto => {
          // Small random price change
          const priceChange = crypto.price * (Math.random() - 0.48) * 0.01; // Slight upward bias
          const newPrice = crypto.price + priceChange;
          
          // Calculate new 24h change with some randomness
          const changeAdjustment = (Math.random() - 0.5) * 0.3;
          const newChange = crypto.change24h + changeAdjustment;
          const isUp = newChange >= 0;
          
          // Update volume
          const volumeChange = crypto.volume24h * (Math.random() - 0.5) * 0.02;
          const newVolume = Math.max(0, crypto.volume24h + volumeChange);
          
          return {
            ...crypto,
            price: newPrice,
            change24h: newChange,
            volume24h: newVolume,
            isUp
          };
        });
      });
    }, 2500);
    
    return () => clearInterval(interval);
  }, []);
  
  // Filter crypto based on search and tab
  useEffect(() => {
    let filtered = [...cryptoData];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(crypto => 
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply tab filter
    if (tabIndex === 1) { // Top tokens
      filtered = filtered.filter(crypto => crypto.top);
    } else if (tabIndex === 2) { // Trending
      filtered = filtered.filter(crypto => crypto.trending);
    }
    
    setFilteredData(filtered);
  }, [searchQuery, cryptoData, tabIndex]);

  return (
    <Box>
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        direction={{ base: 'column', md: 'row' }}
      >
        <Tabs 
          variant="soft-rounded" 
          colorScheme="blue" 
          size="sm"
          onChange={setTabIndex}
          mb={{ base: 3, md: 0 }}
        >
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
      
      {/* Market Stats */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        <Box
          p={4}
          bg={cardBg}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <VStack spacing={0} align="start">
            <Text fontSize="sm" color="gray.500">Global Market Cap</Text>
            <Text fontSize="xl" fontWeight="bold">$2.34T</Text>
            <HStack spacing={1} mt={1}>
              <Icon as={FaArrowUp} color="green.400" boxSize={3} />
              <Text fontSize="sm" color="green.400">2.7% (24h)</Text>
            </HStack>
          </VStack>
        </Box>
        <Box
          p={4}
          bg={cardBg}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <VStack spacing={0} align="start">
            <Text fontSize="sm" color="gray.500">24h Trading Volume</Text>
            <Text fontSize="xl" fontWeight="bold">$105.6B</Text>
            <HStack spacing={1} mt={1}>
              <Icon as={FaArrowUp} color="green.400" boxSize={3} />
              <Text fontSize="sm" color="green.400">5.3% (24h)</Text>
            </HStack>
          </VStack>
        </Box>
        <Box
          p={4}
          bg={cardBg}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
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

      {/* Crypto Grid */}
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
                bg={cardBg}
                borderRadius="md"
                borderWidth="1px"
                borderColor={borderColor}
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'md',
                  borderColor: 'blue.300'
                }}
                transition="all 0.2s"
              >
                <Flex justify="space-between" align="center" mb={3}>
                  <HStack>
                    <Icon as={crypto.icon} color={crypto.color} boxSize={6} />
                    <VStack spacing={0} align="start">
                      <Text fontWeight="bold">{crypto.name}</Text>
                      <Text color="gray.500" fontSize="sm">{crypto.symbol}</Text>
                    </VStack>
                  </HStack>
                  <Badge 
                    colorScheme={crypto.isUp ? "green" : "red"}
                    display="flex"
                    alignItems="center"
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    <Icon 
                      as={crypto.isUp ? FaArrowUp : FaArrowDown} 
                      boxSize={2} 
                      mr={1} 
                    />
                    {crypto.change24h.toFixed(2)}%
                  </Badge>
                </Flex>
                
                <Text fontSize="2xl" fontWeight="bold" mb={3}>
                  ${crypto.price < 0.01 ? crypto.price.toFixed(8) : crypto.price.toFixed(2)}
                </Text>
                
                <SimpleGrid columns={2} spacing={4}>
                  <VStack spacing={0} align="start">
                    <Text fontSize="xs" color="gray.500">Market Cap</Text>
                    <Text fontWeight="medium">${crypto.marketCap.toFixed(1)}B</Text>
                  </VStack>
                  <VStack spacing={0} align="start">
                    <Text fontSize="xs" color="gray.500">24h Volume</Text>
                    <Text fontWeight="medium">${crypto.volume24h.toFixed(2)}M</Text>
                  </VStack>
                </SimpleGrid>
                
                <Button 
                  colorScheme="blue" 
                  size="sm" 
                  width="full" 
                  mt={4}
                  variant="outline"
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
          bg={cardBg}
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
      
      {/* Trading conditions */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mt={6}>
        <Box
          p={3}
          bg={cardBg}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <VStack spacing={1} align="start">
            <Text fontSize="xs" color="gray.500">Trading Hours</Text>
            <HStack>
              <Icon as={FaRegClock} color="brand.tradebrowser.500" boxSize={3} />
              <Text fontWeight="bold">24/7</Text>
            </HStack>
          </VStack>
        </Box>
        <Box
          p={3}
          bg={cardBg}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <VStack spacing={1} align="start">
            <Text fontSize="xs" color="gray.500">Trading Fee</Text>
            <Text fontWeight="bold">From 0.1%</Text>
          </VStack>
        </Box>
        <Box
          p={3}
          bg={cardBg}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <VStack spacing={1} align="start">
            <Text fontSize="xs" color="gray.500">Min. Deposit</Text>
            <Text fontWeight="bold">$10</Text>
          </VStack>
        </Box>
        <Box
          p={3}
          bg={cardBg}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
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