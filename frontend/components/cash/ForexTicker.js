import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
  Button,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ArrowUp, ArrowDown, ArrowUpDown, RefreshCw } from "lucide-react";

const PROFIT_MARGINS = {
  LYD: {
    buy: 0.04,
    sell: 0.04,
    market_multiplier: 1.5
  },
  EGP: {
    buy: 0.05,
    sell: 0.025,
    market_multiplier: 1.4
  },
  CRYPTO: {
    buy: 0.02,
    sell: 0.015,
    market_multiplier: 1.2
  }
};

const CRYPTO_SYMBOLS = ['BTC', 'ETH', 'USDT'];
const METAL_SYMBOLS = ['XAU', 'XAG'];

const RatePanel = ({ rates, isLoading, error, onSwitch }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const bgColor = useColorModeValue('gray.100', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  if (isLoading) return <Spinner color="brand.bitfund.700" />;
  if (error) return <Alert status="error"><AlertIcon />{error.message}</Alert>;
  if (!Array.isArray(rates) || rates.length === 0) return <Text>No data available</Text>;
  
  return (
    <VStack spacing={4} w="full">
      {rates.map((rate) => (
        <Flex
          key={`${rate.from}-${rate.to}`}
          justify="space-between"
          align="center"
          w="full"
          p={3}
          borderRadius="md"
          bg={bgColor}
          boxShadow="sm"
          flexDirection={isMobile ? 'column' : 'row'}
        >
          <HStack mb={isMobile ? 4 : 0} w="full" justify="start">
            <HStack>
              <Text fontSize={isMobile ? 'md' : 'lg'} fontWeight="bold" color={textColor}>
                {rate.from} → {rate.to}
              </Text>
              <Button 
                onClick={() => onSwitch(rate)} 
                variant="ghost" 
                size="xs"
                p={2}
                color="brand.bitfund.400"
              >
                <ArrowUpDown size={16} />
              </Button>
            </HStack>
            
            <Text fontSize={isMobile ? 'lg' : 'xl'} fontWeight="bold" color="brand.bitfund.700">
              {rate.rate.toFixed(4)}
            </Text>
          </HStack>

          <Flex 
            w="full" 
            justifyContent="space-between" 
            alignItems="center"
            flexDirection={isMobile ? 'column' : 'row'}
          >
            <HStack spacing={4}>
              <Text fontSize="sm" fontWeight="bold" color="brand.bitfund.400">
                Buy: {rate.buy.toFixed(4)}
              </Text>
              <Text fontSize="sm" fontWeight="bold" color="red.400">
                Sell: {rate.sell.toFixed(4)}
              </Text>
            </HStack>

            <HStack>
              {rate.change > 0 ? (
                <ArrowUp color="green" size={16} />
              ) : (
                <ArrowDown color="red" size={16} />
              )}
              <Text color={rate.change > 0 ? "green.500" : "red.500"}>
                {Math.abs(rate.change).toFixed(2)}%
              </Text>
            </HStack>
          </Flex>
        </Flex>
      ))}
    </VStack>
  );
};

const ForexTicker = () => {
  const [activeTab, setActiveTab] = useState("LYD");
  const [forexData, setForexData] = useState({
    LYD: [],
    EGP: [],
    CRYPTO: [],
    METALS: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Responsive design
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Color theming
  const bgColor = useColorModeValue('white', 'gray.900');
  const tabBg = useColorModeValue('gray.100', 'gray.800');
  const brandGradient = "linear(to-r, brand.bitfund.500, brand.bitfund.700)";

  // Fetch exchange rate data
  useEffect(() => {
    async function fetchRates() {
      try {
        setIsLoading(true);
        
        // Try to get exchange rate matrix
        const response = await fetch('/public/chart-data/exchange_rate_data.json');
        
        if (!response.ok) {
          throw new Error("Failed to fetch exchange rates matrix");
        }
        
        const matrixData = await response.json();
        
        // Process the matrix data for different currency categories
        const lydRates = processMatrixRates(matrixData, 'LYD');
        const egpRates = processMatrixRates(matrixData, 'EGP');
        const cryptoRates = processCryptoRates(matrixData);
        const metalRates = processMetalRates(matrixData);
        
        setForexData({
          LYD: lydRates,
          EGP: egpRates,
          CRYPTO: cryptoRates,
          METALS: metalRates
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching exchange rates:", err);
        setError(err.message);
        
        // Fall back to simulated data
        setForexData({
          LYD: generateFallbackRates('LYD'),
          EGP: generateFallbackRates('EGP'),
          CRYPTO: generateFallbackRates('CRYPTO'),
          METALS: generateFallbackRates('METALS')
        });
        
        setIsLoading(false);
      }
    }
    
    fetchRates();
    
    // Poll for updates every 60 seconds
    const interval = setInterval(() => {
      fetchRates();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Process rates from the exchange rate matrix for a base currency
  function processMatrixRates(matrixData, baseCurrency) {
    if (!Array.isArray(matrixData)) return [];
    
    // Find the entry for the base currency
    const baseRow = matrixData.find(row => row.base_currency === baseCurrency);
    
    if (!baseRow) return [];
    
    // Get the target currencies to display
    const targetCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'TRY'];
    
    // Create the rates objects for each target currency
    const rates = [];
    
    for (const to of targetCurrencies) {
      if (to === baseCurrency) continue;
      
      const rate = baseRow[to];
      
      if (rate !== undefined && rate !== null && !isNaN(rate)) {
        // Apply profit margins
        const margin = PROFIT_MARGINS[baseCurrency] || PROFIT_MARGINS.CRYPTO;
        const marketRate = parseFloat(rate) * margin.market_multiplier;
        
        // Get change from historical data (simulated since we don't have historical data)
        const change = (Math.random() * 2 - 1) * 0.5; // Random change between -0.5% and +0.5%
        
        rates.push({
          from: baseCurrency,
          to: to,
          rate: marketRate,
          buy: marketRate * (1 + margin.buy),
          sell: marketRate * (1 - margin.sell),
          change: change
        });
      }
    }
    
    return rates;
  }
  
  // Process crypto rates from the matrix
  function processCryptoRates(matrixData) {
    if (!Array.isArray(matrixData)) return [];
    
    const rates = [];
    
    // For each crypto currency
    for (const crypto of CRYPTO_SYMBOLS) {
      // Find the entry for USD to crypto
      const usdRow = matrixData.find(row => row.base_currency === 'USD');
      
      if (usdRow && usdRow[crypto] !== undefined && usdRow[crypto] !== null) {
        const rate = 1 / parseFloat(usdRow[crypto]); // Inverse of USD to crypto is crypto to USD
        
        // Apply margins
        const margin = PROFIT_MARGINS.CRYPTO;
        const marketRate = rate * margin.market_multiplier;
        
        // Random change (simulated)
        const change = (Math.random() * 4 - 2) * 1.5; // Random change between -3% and +3%
        
        rates.push({
          from: crypto,
          to: 'USD',
          rate: marketRate,
          buy: marketRate * (1 + margin.buy),
          sell: marketRate * (1 - margin.sell),
          change: change
        });
      }
    }
    
    return rates;
  }
  
  // Process metal rates from the matrix
  function processMetalRates(matrixData) {
    if (!Array.isArray(matrixData)) return [];
    
    const rates = [];
    
    // For each metal
    for (const metal of METAL_SYMBOLS) {
      // Find the entry for USD to metal
      const usdRow = matrixData.find(row => row.base_currency === 'USD');
      
      if (usdRow && usdRow[metal] !== undefined && usdRow[metal] !== null) {
        const rate = parseFloat(usdRow[metal]);
        
        // Apply margins
        const margin = PROFIT_MARGINS.CRYPTO; // Use crypto margins for metals
        const marketRate = rate * margin.market_multiplier;
        
        // Random change (simulated)
        const change = (Math.random() * 2 - 1) * 0.8; // Random change between -0.8% and +0.8%
        
        rates.push({
          from: 'USD',
          to: metal,
          rate: marketRate,
          buy: marketRate * (1 + margin.buy),
          sell: marketRate * (1 - margin.sell),
          change: change
        });
      }
    }
    
    return rates;
  }
  
  // Generate fallback rates if API calls fail
  function generateFallbackRates(category) {
    if (category === 'LYD') {
      return [
        { from: 'LYD', to: 'USD', rate: 0.22, buy: 0.228, sell: 0.2112, change: 0.25 },
        { from: 'LYD', to: 'EUR', rate: 0.18, buy: 0.1872, sell: 0.1728, change: -0.35 },
        { from: 'LYD', to: 'GBP', rate: 0.16, buy: 0.1664, sell: 0.1536, change: 0.15 },
        { from: 'LYD', to: 'JPY', rate: 24.5, buy: 25.48, sell: 23.52, change: -0.42 },
        { from: 'LYD', to: 'CNY', rate: 1.42, buy: 1.477, sell: 1.363, change: 0.18 }
      ];
    } else if (category === 'EGP') {
      return [
        { from: 'EGP', to: 'USD', rate: 0.032, buy: 0.0336, sell: 0.0312, change: -0.28 },
        { from: 'EGP', to: 'EUR', rate: 0.027, buy: 0.0284, sell: 0.0263, change: 0.31 },
        { from: 'EGP', to: 'GBP', rate: 0.024, buy: 0.0252, sell: 0.0234, change: -0.15 },
        { from: 'EGP', to: 'JPY', rate: 3.65, buy: 3.833, sell: 3.559, change: 0.42 },
        { from: 'EGP', to: 'CNY', rate: 0.21, buy: 0.221, sell: 0.205, change: -0.18 }
      ];
    } else if (category === 'CRYPTO') {
      return [
        { from: 'BTC', to: 'USD', rate: 50000, buy: 51000, sell: 49250, change: 2.35 },
        { from: 'ETH', to: 'USD', rate: 3000, buy: 3060, sell: 2955, change: -1.25 },
        { from: 'USDT', to: 'USD', rate: 1.0, buy: 1.02, sell: 0.985, change: 0.05 }
      ];
    } else {
      return [
        { from: 'USD', to: 'XAU', rate: 0.000565, buy: 0.000576, sell: 0.000557, change: 0.75 },
        { from: 'USD', to: 'XAG', rate: 0.0415, buy: 0.0423, sell: 0.0409, change: -0.48 }
      ];
    }
  }

  // Rate switching handler
  const handleSwitch = useCallback((rate) => {
    if (!rate) return;

    const newRate = {
      ...rate,
      from: rate.to,
      to: rate.from,
      rate: 1 / rate.rate,
      buy: 1 / rate.sell,  // Note the swap of buy/sell when inverting
      sell: 1 / rate.buy,
      change: -rate.change // Invert the change direction
    };

    // Update the state with the swapped rate
    setForexData(prevData => {
      const categoryData = [...prevData[activeTab]];
      const rateIndex = categoryData.findIndex(r => r.from === rate.from && r.to === rate.to);
      
      if (rateIndex !== -1) {
        // Replace the existing rate
        categoryData[rateIndex] = newRate;
      } else {
        // Add the new rate
        categoryData.push(newRate);
      }
      
      return {
        ...prevData,
        [activeTab]: categoryData
      };
    });
  }, [activeTab]);

  // Refetch handler
  const handleRefetch = () => {
    fetchRates();
  };

  return (
    <Box 
      bg={bgColor} 
      borderRadius="lg" 
      p={isMobile ? 2 : 6} 
      boxShadow="md" 
      w="full"
    >
      <Tabs 
        variant="soft-rounded" 
        isFitted 
        onChange={(index) => setActiveTab(["LYD", "EGP", "CRYPTO", "METALS"][index])}
      >
        <TabList 
          bg={tabBg} 
          borderRadius="lg" 
          p={1}
          mb={2}
        >
          <Tab 
            _selected={{ 
              color: "black", 
              bg: "brand.bitfund.700" 
            }}
          >
            LYD
          </Tab>
          <Tab 
            _selected={{ 
              color: "black", 
              bg: "brand.bitfund.700" 
            }}
          >
            EGP
          </Tab>
          <Tab 
            _selected={{ 
              color: "black", 
              bg: "brand.bitfund.700" 
            }}
          >
            Crypto
          </Tab>
          <Tab 
            _selected={{ 
              color: "black", 
              bg: "brand.bitfund.700" 
            }}
          >
            Metals
          </Tab>
        </TabList>

        <HStack justify="flex-end" mb={2}>
          <Button 
            onClick={handleRefetch} 
            variant="ghost" 
            size="sm" 
            leftIcon={<RefreshCw size={16} />}
            color="brand.bitfund.500"
          >
            Refresh
          </Button>
        </HStack>

        <TabPanels>
          <TabPanel>
            <RatePanel 
              rates={forexData.LYD} 
              isLoading={isLoading && activeTab === "LYD"} 
              error={error}
              onSwitch={handleSwitch}
            />
          </TabPanel>

          <TabPanel>
            <RatePanel 
              rates={forexData.EGP} 
              isLoading={isLoading && activeTab === "EGP"} 
              error={error}
              onSwitch={handleSwitch}
            />
          </TabPanel>

          <TabPanel>
            <RatePanel 
              rates={forexData.CRYPTO} 
              isLoading={isLoading && activeTab === "CRYPTO"} 
              error={error}
              onSwitch={handleSwitch}
            />
          </TabPanel>

          <TabPanel>
            <RatePanel 
              rates={forexData.METALS} 
              isLoading={isLoading && activeTab === "METALS"} 
              error={error}
              onSwitch={handleSwitch}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ForexTicker;