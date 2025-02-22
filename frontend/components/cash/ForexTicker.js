import React, { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

const fetchForexRates = async ({ queryKey }) => {
  const [, baseCurrency] = queryKey;
  
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exchange-rates/latest?base=${baseCurrency}`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Forex rates fetch error for ${baseCurrency}:`, errorText);
      throw new Error(`Failed to fetch Forex rates for ${baseCurrency}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Raw forex data:', data);

    return processRates(data.data || [], baseCurrency);
  } catch (error) {
    console.error('Forex rates fetch failed:', error);
    throw error;
  }
};

const fetchCryptoRates = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_CURRENCYFREAKS_URL}/latest?apikey=${process.env.NEXT_PUBLIC_CURRENCYFREAKS_KEY}&symbols=${CRYPTO_SYMBOLS.join(',')}`
  );
  
  if (!response.ok) throw new Error("Failed to fetch Crypto rates");
  
  const data = await response.json();
  const rates = [];
  
  for (const [symbol, rate] of Object.entries(data.rates || {})) {
    if (CRYPTO_SYMBOLS.includes(symbol)) {
      rates.push({
        from: "USDT",
        to: symbol,
        rate: parseFloat(rate),
        buy: parseFloat(rate) * (1 + PROFIT_MARGINS.CRYPTO.buy),
        sell: parseFloat(rate) * (1 - PROFIT_MARGINS.CRYPTO.sell),
        change: 0,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  return rates;
};

const fetchMetalRates = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_CURRENCYFREAKS_URL}/latest?apikey=${process.env.NEXT_PUBLIC_CURRENCYFREAKS_KEY}&symbols=${METAL_SYMBOLS.join(',')}`
  );
  
  if (!response.ok) throw new Error("Failed to fetch Metal rates");
  
  const data = await response.json();
  const rates = [];
  
  for (const [symbol, rate] of Object.entries(data.rates || {})) {
    if (METAL_SYMBOLS.includes(symbol)) {
      rates.push({
        from: "USD",
        to: symbol,
        rate: parseFloat(rate),
        buy: parseFloat(rate) * (1 + PROFIT_MARGINS.CRYPTO.buy),
        sell: parseFloat(rate) * (1 - PROFIT_MARGINS.CRYPTO.sell),
        change: 0,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  return rates;
};

const processRates = (rates, baseCurrency) => {
  if (!Array.isArray(rates)) return [];
  
  return rates.filter(item => item && item.rate).map(item => {
    const margin = PROFIT_MARGINS[baseCurrency] || PROFIT_MARGINS.CRYPTO;
    const marketRate = parseFloat(item.rate) * margin.market_multiplier;
    
    return {
      from: item.from_currency,
      to: item.to_currency,
      rate: marketRate,
      buy: marketRate * (1 + margin.buy),
      sell: marketRate * (1 - margin.sell),
      change: item.change_percentage || 0,
      timestamp: item.timestamp
    };
  });
};

const RatePanel = ({ rates, isLoading, error, onSwitch }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const bgColor = useColorModeValue('gray.100', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  if (isLoading) return <Spinner color="brand.bitcash.700" />;
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
                color="brand.bitcash.400"
              >
                <ArrowUpDown size={16} />
              </Button>
            </HStack>
            
            <Text fontSize={isMobile ? 'lg' : 'xl'} fontWeight="bold" color="brand.bitcash.700">
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
              <Text fontSize="sm" fontWeight="bold" color="brand.bitcash.400">
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
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("LYD");

  // Responsive design
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Color theming
  const bgColor = useColorModeValue('white', 'gray.900');
  const tabBg = useColorModeValue('gray.100', 'gray.800');
  const brandGradient = "linear(to-r, brand.bitcash.500, brand.bitcash.700)";

  // Queries
  const { 
    data: forexData, 
    isLoading: forexLoading, 
    error: forexError,
    refetch: refetchForex
  } = useQuery({
    queryKey: ["forex-rates", activeTab],
    queryFn: () => fetchForexRates({ queryKey: ["", activeTab] }),
    refetchInterval: 60000,
    enabled: ["LYD", "EGP"].includes(activeTab)
  });

  const { 
    data: cryptoData, 
    isLoading: cryptoLoading, 
    error: cryptoError,
    refetch: refetchCrypto
  } = useQuery({
    queryKey: ["crypto-rates"],
    queryFn: fetchCryptoRates,
    refetchInterval: 60000,
    enabled: activeTab === "CRYPTO"
  });

  const { 
    data: metalData, 
    isLoading: metalLoading, 
    error: metalError,
    refetch: refetchMetal
  } = useQuery({
    queryKey: ["metal-rates"],
    queryFn: fetchMetalRates,
    refetchInterval: 60000,
    enabled: activeTab === "METALS"
  });

  // Rate switching handler
  const handleSwitch = useCallback((rate) => {
    if (!rate) return;

    const newRate = {
      ...rate,
      from: rate.to,
      to: rate.from,
      rate: 1 / rate.rate,
      buy: 1 / rate.sell,
      sell: 1 / rate.buy
    };

    const queryKey = activeTab === "CRYPTO" 
      ? ["crypto-rates"] 
      : activeTab === "METALS" 
        ? ["metal-rates"] 
        : ["forex-rates", activeTab];

    const currentData = queryClient.getQueryData(queryKey) || [];
    
    if (!Array.isArray(currentData)) return;

    const updatedData = currentData.map(r => 
      r.from === rate.from && r.to === rate.to ? newRate : r
    );

    queryClient.setQueryData(queryKey, updatedData);
  }, [activeTab, queryClient]);

  // Refetch handler
  const handleRefetch = () => {
    switch(activeTab) {
      case 'LYD':
      case 'EGP':
        refetchForex();
        break;
      case 'CRYPTO':
        refetchCrypto();
        break;
      case 'METALS':
        refetchMetal();
        break;
    }
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
              bg: "brand.bitcash.700" 
            }}
          >
            LYD
          </Tab>
          <Tab 
            _selected={{ 
              color: "black", 
              bg: "brand.bitcash.700" 
            }}
          >
            EGP
          </Tab>
          <Tab 
            _selected={{ 
              color: "black", 
              bg: "brand.bitcash.700" 
            }}
          >
            Crypto
          </Tab>
          <Tab 
            _selected={{ 
              color: "black", 
              bg: "brand.bitcash.700" 
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
            color="brand.bitcash.500"
          >
            Refresh
          </Button>
        </HStack>

        <TabPanels>
          <TabPanel>
            <RatePanel 
              rates={forexData} 
              isLoading={forexLoading} 
              error={forexError}
              onSwitch={handleSwitch}
            />
          </TabPanel>

          <TabPanel>
            <RatePanel 
              rates={forexData} 
              isLoading={forexLoading} 
              error={forexError}
              onSwitch={handleSwitch}
            />
          </TabPanel>

          <TabPanel>
            <RatePanel 
              rates={cryptoData} 
              isLoading={cryptoLoading} 
              error={cryptoError}
              onSwitch={handleSwitch}
            />
          </TabPanel>

          <TabPanel>
            <RatePanel 
              rates={metalData} 
              isLoading={metalLoading} 
              error={metalError}
              onSwitch={handleSwitch}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ForexTicker;