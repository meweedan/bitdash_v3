import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

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
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exchange-rates/latest?base=${baseCurrency}`);
  
  if (!response.ok) throw new Error(`Failed to fetch Forex rates for ${baseCurrency}`);
  
  const data = await response.json();
  return processRates(data?.data?.attributes?.results || [], baseCurrency);
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
  if (isLoading) return <Spinner />;
  if (error) return <Alert status="error"><AlertIcon />{error.message}</Alert>;
  if (!Array.isArray(rates) || rates.length === 0) return <Text>No data available</Text>;
  
  return (
    <VStack spacing={3} w="full">
      {rates.map((rate) => (
        <HStack
          key={`${rate.from}-${rate.to}`}
          justify="space-between"
          w="full"
          p={3}
          borderRadius="md"
          bg="gray.800"
        >
          <HStack>
            <Text fontSize="md" fontWeight="bold">
              {rate.from} → {rate.to}
            </Text>
            <Button 
              onClick={() => onSwitch(rate)} 
              variant="ghost" 
              size="sm"
              p={1}
            >
              <ArrowUpDown size={16} />
            </Button>
          </HStack>
          <Text fontSize="lg" fontWeight="bold" color="green.300">
            {rate.rate.toFixed(4)}
          </Text>
          <Text fontSize="sm" fontWeight="bold" color="blue.300">
            Buy: {rate.buy.toFixed(4)}
          </Text>
          <Text fontSize="sm" fontWeight="bold" color="red.300">
            Sell: {rate.sell.toFixed(4)}
          </Text>
          <HStack>
            {rate.change > 0 ? (
              <ArrowUp color="green" size={16} />
            ) : (
              <ArrowDown color="red" size={16} />
            )}
            <Text color={rate.change > 0 ? "green.400" : "red.400"}>
              {Math.abs(rate.change).toFixed(2)}%
            </Text>
          </HStack>
        </HStack>
      ))}
    </VStack>
  );
};

const ForexTicker = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("LYD");

  const { data: forexData, isLoading: forexLoading, error: forexError } = useQuery({
    queryKey: ["forex-rates", activeTab],
    queryFn: fetchForexRates,
    refetchInterval: 60000,
    enabled: ["LYD", "EGP"].includes(activeTab)
  });

  const { data: cryptoData, isLoading: cryptoLoading, error: cryptoError } = useQuery({
    queryKey: ["crypto-rates"],
    queryFn: fetchCryptoRates,
    refetchInterval: 60000,
    enabled: activeTab === "CRYPTO"
  });

  const { data: metalData, isLoading: metalLoading, error: metalError } = useQuery({
    queryKey: ["metal-rates"],
    queryFn: fetchMetalRates,
    refetchInterval: 60000,
    enabled: activeTab === "METALS"
  });

  const handleSwitch = (rate) => {
    if (!rate) return;

    const newRate = {
        ...rate,
        from: rate.to,
        to: rate.from,
        rate: 1 / rate.rate,
        buy: 1 / rate.sell,
        sell: 1 / rate.buy
    };

    let currentData;
    if (activeTab === "CRYPTO") {
        currentData = queryClient.getQueryData(["crypto-rates"]) || [];
    } else if (activeTab === "METALS") {
        currentData = queryClient.getQueryData(["metal-rates"]) || [];
    } else {
        currentData = queryClient.getQueryData(["forex-rates", activeTab]) || [];
    }

    if (!Array.isArray(currentData)) return;

    const updatedData = currentData.map(r => 
        r.from === rate.from && r.to === rate.to ? newRate : r
    );

    if (activeTab === "CRYPTO") {
        queryClient.setQueryData(["crypto-rates"], updatedData);
    } else if (activeTab === "METALS") {
        queryClient.setQueryData(["metal-rates"], updatedData);
    } else {
        queryClient.setQueryData(["forex-rates", activeTab], updatedData);
    }
    };

  const bgColor = useColorModeValue("gray.900", "black");
  const textColor = useColorModeValue("white", "gray.200");
  const brandGradient = "linear(to-r, brand.bitcash.400, brand.bitcash.700)";

  return (
    <Box bg={bgColor} color={textColor} borderRadius="lg" p={6} boxShadow="xl" w="full">
      <Tabs 
        variant="solid-rounded" 
        isFitted 
        onChange={(index) => setActiveTab(["LYD", "EGP", "CRYPTO", "METALS"][index])}
      >
        <TabList bg={brandGradient} borderRadius="lg" p={2}>
          <Tab _selected={{ color: "white", bg: "brand.bitcash.500" }}>LYD</Tab>
          <Tab _selected={{ color: "white", bg: "brand.bitcash.500" }}>EGP</Tab>
          <Tab _selected={{ color: "white", bg: "brand.bitcash.500" }}>Crypto</Tab>
          <Tab _selected={{ color: "white", bg: "brand.bitcash.500" }}>Metals</Tab>
        </TabList>

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