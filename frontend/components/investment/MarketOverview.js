import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  SimpleGrid,
  useColorModeValue,
  HStack,
  VStack,
  Badge,
  Divider,
  Icon,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  FaChartLine, 
  FaArrowUp, 
  FaArrowDown, 
  FaGlobeEurope, 
  FaGlobeAmericas,
  FaOilCan,
  FaCoins
} from 'react-icons/fa';

const MarketOverview = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [marketData, setMarketData] = useState({
    usMarkets: [],
    euMarkets: [],
    commodities: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Colors for styling
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  
  // Fetch market data
  useEffect(() => {
    async function fetchMarketData() {
      try {
        setIsLoading(true);
        
        // Try to load the pre-generated market_overview.json
        const response = await fetch('/public/chart-data/market_overview.json');
        
        if (!response.ok) {
          // Fallback to individual data files if the overview file doesn't exist
          const usData = await fetchCategoryData('usMarkets');
          const euData = await fetchCategoryData('euMarkets');
          const commoditiesData = await fetchCategoryData('commodities');
          
          setMarketData({
            usMarkets: usData,
            euMarkets: euData,
            commodities: commoditiesData
          });
        } else {
          const data = await response.json();
          setMarketData(data);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching market overview:", err);
        setError(err.message);
        setIsLoading(false);
        
        // Fall back to generated data if fetch fails
        setMarketData({
          usMarkets: generateFallbackData('usMarkets'),
          euMarkets: generateFallbackData('euMarkets'),
          commodities: generateFallbackData('commodities')
        });
      }
    }
    
    fetchMarketData();
    
    // Poll for updates every 60 seconds
    const interval = setInterval(() => {
      fetchMarketData();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Helper function to fetch data for a specific category
  async function fetchCategoryData(category) {
    const symbols = {
      usMarkets: ['^GSPC', '^DJI', '^IXIC', '^RUT', 'TSLA', 'AAPL', 'MSFT', 'AMZN'],
      euMarkets: ['^FTSE', '^GDAXI', '^FCHI', '^STOXX50E', 'VOW.DE', 'MC.PA', 'SAP.DE', 'SIE.DE'],
      commodities: ['XAU', 'XAG', 'CL', 'BZ', 'NG', 'XPT', 'XPD', 'HG']
    };
    
    const names = {
      usMarkets: ['S&P 500', 'Dow Jones', 'NASDAQ', 'Russell 2000', 'Tesla', 'Apple', 'Microsoft', 'Amazon'],
      euMarkets: ['FTSE 100', 'DAX', 'CAC 40', 'Euro Stoxx 50', 'Volkswagen', 'LVMH', 'SAP', 'Siemens'],
      commodities: ['Gold', 'Silver', 'Crude Oil WTI', 'Brent Crude', 'Natural Gas', 'Platinum', 'Palladium', 'Copper']
    };
    
    // First try to get market summary
    try {
      const response = await fetch('/public/chart-data/market_summary.json');
      if (response.ok) {
        const data = await response.json();
        
        // Map to the required format
        const categoryMap = {
          usMarkets: ['indices', 'stocks'],
          euMarkets: ['indices', 'stocks'],
          commodities: ['commodities']
        };
        
        const result = [];
        
        for (const section of categoryMap[category]) {
          if (data[section]) {
            for (const item of data[section]) {
              // Find if the item belongs to the current category based on symbol
              const symbolIndex = symbols[category].findIndex(s => s === item.symbol);
              if (symbolIndex !== -1) {
                const isUp = item.change >= 0;
                result.push({
                  name: names[category][symbolIndex],
                  value: formatValue(item.price, category, item.symbol),
                  change: `${isUp ? '+' : ''}${item.change.toFixed(2)}%`,
                  percentChange: item.change,
                  isUp
                });
              }
            }
          }
        }
        
        if (result.length > 0) {
          return result;
        }
      }
    } catch (err) {
      console.error(`Error fetching market summary for ${category}:`, err);
    }
    
    // Try individual files for each symbol
    const results = [];
    
    for (let i = 0; i < symbols[category].length; i++) {
      const symbol = symbols[category][i];
      
      try {
        const response = await fetch(`/chart-data/${symbol}_1d.json`);
        if (response.ok) {
          const data = await response.json();
          
          // Sort by timestamp to get the latest
          data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          
          if (data.length > 0) {
            const latestData = data[0];
            const previousData = data.length > 1 ? data[1] : { close: latestData.close };
            
            const percentChange = ((latestData.close - previousData.close) / previousData.close * 100);
            const isUp = percentChange >= 0;
            
            results.push({
              name: names[category][i],
              value: formatValue(latestData.close, category, symbol),
              change: `${isUp ? '+' : ''}${percentChange.toFixed(2)}%`,
              percentChange: percentChange,
              isUp
            });
          }
        }
      } catch (err) {
        console.error(`Error fetching data for ${symbol}:`, err);
      }
    }
    
    // If we got some results, return them
    if (results.length > 0) {
      return results;
    }
    
    // Otherwise, fall back to generated data
    return generateFallbackData(category);
  }
  
  // Format value based on the category and symbol
  function formatValue(value, category, symbol) {
    // Handle nulls or undefined
    if (value === null || value === undefined) return "N/A";
    
    const numValue = parseFloat(value);
    
    // European stocks use Euro
    if (symbol && (symbol.includes('.DE') || symbol.includes('.PA'))) {
      return `€${numValue.toFixed(2)}`;
    }
    
    // Regular stocks and indices use dollar
    if (category === 'usMarkets' || (category === 'euMarkets' && !symbol.startsWith('^'))) {
      return `$${numValue.toFixed(2)}`;
    }
    
    // Indices just use the number
    if (symbol && symbol.startsWith('^')) {
      return numValue.toFixed(2);
    }
    
    // Handle commodities with units
    if (category === 'commodities') {
      if (symbol === 'XAU' || symbol === 'XAG' || symbol === 'XPT' || symbol === 'XPD') {
        return `$${numValue.toFixed(2)}/oz`;
      } else if (symbol === 'CL' || symbol === 'BZ') {
        return `$${numValue.toFixed(2)}/bbl`;
      } else if (symbol === 'NG') {
        return `$${numValue.toFixed(2)}/MMBtu`;
      } else if (symbol === 'HG') {
        return `$${numValue.toFixed(2)}/lb`;
      }
    }
    
    // Default
    return `${numValue.toFixed(2)}`;
  }
  
  // Function to generate fallback data
  function generateFallbackData(category) {
    if (category === 'usMarkets') {
      return [
        { name: 'S&P 500', value: '4,873.12', change: '+0.45%', percentChange: 0.45, isUp: true },
        { name: 'Dow Jones', value: '38,927.03', change: '+0.21%', percentChange: 0.21, isUp: true },
        { name: 'NASDAQ', value: '17,245.36', change: '+0.67%', percentChange: 0.67, isUp: true },
        { name: 'Russell 2000', value: '2,055.82', change: '-0.31%', percentChange: -0.31, isUp: false },
        { name: 'Tesla', value: '$219.33', change: '+1.87%', percentChange: 1.87, isUp: true },
        { name: 'Apple', value: '$182.27', change: '-0.54%', percentChange: -0.54, isUp: false },
        { name: 'Microsoft', value: '$416.88', change: '+1.23%', percentChange: 1.23, isUp: true },
        { name: 'Amazon', value: '$181.56', change: '+0.87%', percentChange: 0.87, isUp: true }
      ];
    } else if (category === 'euMarkets') {
      return [
        { name: 'FTSE 100', value: '7,655.20', change: '-0.15%', percentChange: -0.15, isUp: false },
        { name: 'DAX', value: '18,354.76', change: '+0.32%', percentChange: 0.32, isUp: true },
        { name: 'CAC 40', value: '7,932.61', change: '+0.28%', percentChange: 0.28, isUp: true },
        { name: 'Euro Stoxx 50', value: '4,921.22', change: '+0.39%', percentChange: 0.39, isUp: true },
        { name: 'Volkswagen', value: '€107.50', change: '+0.89%', percentChange: 0.89, isUp: true },
        { name: 'LVMH', value: '€720.40', change: '-1.22%', percentChange: -1.22, isUp: false },
        { name: 'SAP', value: '€175.64', change: '+2.15%', percentChange: 2.15, isUp: true },
        { name: 'Siemens', value: '€168.92', change: '+0.76%', percentChange: 0.76, isUp: true }
      ];
    } else {
      return [
        { name: 'Gold', value: '$2,345.60/oz', change: '+0.83%', percentChange: 0.83, isUp: true },
        { name: 'Silver', value: '$27.50/oz', change: '+1.12%', percentChange: 1.12, isUp: true },
        { name: 'Crude Oil WTI', value: '$78.42/bbl', change: '-1.25%', percentChange: -1.25, isUp: false },
        { name: 'Brent Crude', value: '$82.16/bbl', change: '-0.92%', percentChange: -0.92, isUp: false },
        { name: 'Natural Gas', value: '$2.08/MMBtu', change: '+3.48%', percentChange: 3.48, isUp: true },
        { name: 'Platinum', value: '$980.30/oz', change: '-0.42%', percentChange: -0.42, isUp: false },
        { name: 'Palladium', value: '$1,050.75/oz', change: '+0.67%', percentChange: 0.67, isUp: true },
        { name: 'Copper', value: '$4.52/lb', change: '+1.35%', percentChange: 1.35, isUp: true }
      ];
    }
  }

  // Loading state
  if (isLoading) {
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
        p={4}
        textAlign="center"
        py={10}
      >
        <Spinner color="brand.bitinvest.500" size="xl" />
        <Text mt={4}>Loading market data...</Text>
      </Box>
    );
  }
  
  // Error state
  if (error) {
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
        p={4}
      >
        <Alert status="error" variant="left-accent">
          <AlertIcon />
          Error loading market data: {error}
        </Alert>
      </Box>
    );
  }

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
      <Tabs 
        variant="bitinvest-outline" 
        onChange={setActiveTab}
        index={activeTab}
        p={4}
      >
        <TabList>
          <Tab><HStack><Icon as={FaGlobeAmericas} mr={2} />US Markets</HStack></Tab>
          <Tab><HStack><Icon as={FaGlobeEurope} mr={2} />EU Markets</HStack></Tab>
          <Tab><HStack><Icon as={FaCoins} mr={2} />Commodities</HStack></Tab>
        </TabList>
        
        <TabPanels mt={4}>
          <TabPanel p={0}>
            <MarketPanel 
              markets={marketData.usMarkets} 
              title="US Markets Overview"
              icon={FaGlobeAmericas}
            />
          </TabPanel>
          
          <TabPanel p={0}>
            <MarketPanel 
              markets={marketData.euMarkets} 
              title="European Markets Overview"
              icon={FaGlobeEurope}
            />
          </TabPanel>
          
          <TabPanel p={0}>
            <MarketPanel 
              markets={marketData.commodities} 
              title="Commodities Overview"
              icon={FaCoins}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

// Component for displaying market data in a panel
const MarketPanel = ({ markets, title, icon }) => {
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  
  return (
    <Box>
      <HStack mb={4} ml={2}>
        <Icon as={icon} color="brand.bitinvest.500" />
        <Heading size="md" color="brand.bitinvest.500">{title}</Heading>
      </HStack>
      
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
        {markets.map((market, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Box
              p={3}
              borderRadius="md"
              bg={cardBg}
              _hover={{ 
                transform: 'translateY(-2px)', 
                shadow: 'md',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>
                {market.name}
              </Text>
              <Flex justify="space-between" align="center" mt={1}>
                <Text fontSize="sm">{market.value}</Text>
                <Badge
                  colorScheme={market.isUp ? 'green' : 'red'}
                  display="flex"
                  alignItems="center"
                >
                  <Icon 
                    as={market.isUp ? FaArrowUp : FaArrowDown} 
                    boxSize={2} 
                    mr={1} 
                  />
                  {market.change}
                </Badge>
              </Flex>
            </Box>
          </motion.div>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default MarketOverview;