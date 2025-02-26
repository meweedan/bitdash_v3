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
  
  // Colors for styling
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  
  // Generate demo market data
  useEffect(() => {
    // Sample US markets data
    const usData = [
      { name: 'S&P 500', value: '4,873.12', change: '+0.45%', percentChange: 0.45, isUp: true },
      { name: 'Dow Jones', value: '38,927.03', change: '+0.21%', percentChange: 0.21, isUp: true },
      { name: 'NASDAQ', value: '17,245.36', change: '+0.67%', percentChange: 0.67, isUp: true },
      { name: 'Russell 2000', value: '2,055.82', change: '-0.31%', percentChange: -0.31, isUp: false },
      { name: 'NYSE', value: '17,621.93', change: '+0.28%', percentChange: 0.28, isUp: true },
      { name: 'Tesla', value: '$219.33', change: '+1.87%', percentChange: 1.87, isUp: true },
      { name: 'Apple', value: '$182.27', change: '-0.54%', percentChange: -0.54, isUp: false },
      { name: 'Microsoft', value: '$416.88', change: '+1.23%', percentChange: 1.23, isUp: true }
    ];
    
    // Sample EU markets data
    const euData = [
      { name: 'FTSE 100', value: '7,655.20', change: '-0.15%', percentChange: -0.15, isUp: false },
      { name: 'DAX', value: '18,354.76', change: '+0.32%', percentChange: 0.32, isUp: true },
      { name: 'CAC 40', value: '7,932.61', change: '+0.28%', percentChange: 0.28, isUp: true },
      { name: 'Euro Stoxx 50', value: '4,921.22', change: '+0.39%', percentChange: 0.39, isUp: true },
      { name: 'IBEX 35', value: '10,811.40', change: '-0.12%', percentChange: -0.12, isUp: false },
      { name: 'Volkswagen', value: '€107.50', change: '+0.89%', percentChange: 0.89, isUp: true },
      { name: 'LVMH', value: '€720.40', change: '-1.22%', percentChange: -1.22, isUp: false },
      { name: 'SAP', value: '€175.64', change: '+2.15%', percentChange: 2.15, isUp: true }
    ];
    
    // Sample commodities data
    const commoditiesData = [
      { name: 'Gold', value: '$2,345.60/oz', change: '+0.83%', percentChange: 0.83, isUp: true },
      { name: 'Silver', value: '$27.50/oz', change: '+1.12%', percentChange: 1.12, isUp: true },
      { name: 'Crude Oil WTI', value: '$78.42/bbl', change: '-1.25%', percentChange: -1.25, isUp: false },
      { name: 'Brent Crude', value: '$82.16/bbl', change: '-0.92%', percentChange: -0.92, isUp: false },
      { name: 'Natural Gas', value: '$2.08/MMBtu', change: '+3.48%', percentChange: 3.48, isUp: true },
      { name: 'Platinum', value: '$980.30/oz', change: '-0.42%', percentChange: -0.42, isUp: false },
      { name: 'Palladium', value: '$1,050.75/oz', change: '+0.67%', percentChange: 0.67, isUp: true },
      { name: 'Copper', value: '$4.52/lb', change: '+1.35%', percentChange: 1.35, isUp: true }
    ];
    
    setMarketData({
      usMarkets: usData,
      euMarkets: euData,
      commodities: commoditiesData
    });
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMarketData(prevData => {
        return {
          usMarkets: updateMarketData(prevData.usMarkets),
          euMarkets: updateMarketData(prevData.euMarkets),
          commodities: updateMarketData(prevData.commodities)
        };
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Function to simulate market data changes
  const updateMarketData = (data) => {
    return data.map(item => {
      const randomChange = (Math.random() * 0.3 - 0.15).toFixed(2);
      const newPercentChange = (parseFloat(item.percentChange) + parseFloat(randomChange)).toFixed(2);
      const isUp = newPercentChange >= 0;
      
      return {
        ...item,
        change: `${isUp ? '+' : ''}${newPercentChange}%`,
        percentChange: parseFloat(newPercentChange),
        isUp
      };
    });
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