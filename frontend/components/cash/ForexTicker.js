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
  return processRates(data?.data?.attributes?.results, baseCurrency);
};

const fetchCryptoRates = async ({ queryKey }) => {
  const [, base = 'USDT'] = queryKey;
  const response = await fetch(
    `https://api.currencyfreaks.com/latest?apikey=9cd5b2412b1749a7b9c44ba9f9b2446f&symbols=${CRYPTO_SYMBOLS.join(',')}`
  );
  
  if (!response.ok) throw new Error("Failed to fetch Crypto rates");
  
  const data = await response.json();
  return Object.entries(data.rates).map(([symbol, rate]) => ({
    from: base,
    to: symbol,
    rate: parseFloat(rate),
    buy: parseFloat(rate) * (1 + PROFIT_MARGINS.CRYPTO.buy),
    sell: parseFloat(rate) * (1 - PROFIT_MARGINS.CRYPTO.sell),
    change: 0,
    timestamp: new Date().toISOString()
  }));
};

const fetchMetalRates = async ({ queryKey }) => {
  const [, base = 'USD'] = queryKey;
  const response = await fetch(
    `https://api.currencyfreaks.com/latest?apikey=9cd5b2412b1749a7b9c44ba9f9b2446f&symbols=${METAL_SYMBOLS.join(',')}`
  );
  
  if (!response.ok) throw new Error("Failed to fetch Metal rates");
  
  const data = await response.json();
  return Object.entries(data.rates).map(([symbol, rate]) => ({
    from: base,
    to: symbol,
    rate: parseFloat(rate),
    buy: parseFloat(rate) * (1 + PROFIT_MARGINS.CRYPTO.buy),
    sell: parseFloat(rate) * (1 - PROFIT_MARGINS.CRYPTO.sell),
    change: 0,
    timestamp: new Date().toISOString()
  }));
};

const processRates = (rates, baseCurrency) => {
  if (!rates) return [];
  
  return rates.map(item => {
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
  
  return (
    <VStack spacing={3} w="full">
      {Array.isArray(rates) && rates.length > 0 ? (
        rates.map((rate) => (
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
                {rate.change.toFixed(2)}%
              </Text>
            </HStack>
          </HStack>
        ))
      ) : (
        <Text>No data available</Text>
      )}
    </VStack>
  );
};

const ForexTicker = () => {
  const [activeBase, setActiveBase] = useState("LYD");
  const [activeTab, setActiveTab] = useState(0);
  const queryClient = useQueryClient();

  const forexQuery = useQuery({
    queryKey: ["forex-rates", activeBase],
    queryFn: fetchForexRates,
    refetchInterval: 60000,
  });

  const cryptoQuery = useQuery({
    queryKey: ["crypto-rates", "USDT"],
    queryFn: fetchCryptoRates,
    refetchInterval: 60000,
  });

  const metalQuery = useQuery({
    queryKey: ["metal-rates", "USD"],
    queryFn: fetchMetalRates,
    refetchInterval: 60000,
  });

  const handleSwitch = async (rate) => {
    const newBase = rate.to;
    const prevBase = rate.from;
    
    if (activeTab === 0 || activeTab === 1) {
      setActiveBase(newBase);
      await queryClient.invalidateQueries(["forex-rates", newBase]);
    } else if (activeTab === 2) {
      await queryClient.invalidateQueries(["crypto-rates", newBase]);
      queryClient.setQueryData(["crypto-rates", newBase], (old) => 
        old?.map(r => ({
          ...r,
          from: newBase,
          to: r.to === newBase ? prevBase : r.to,
          rate: r.to === newBase ? 1 / r.rate : r.rate,
          buy: r.to === newBase ? 1 / r.sell : r.buy,
          sell: r.to === newBase ? 1 / r.buy : r.sell
        }))
      );
    } else {
      await queryClient.invalidateQueries(["metal-rates", newBase]);
      queryClient.setQueryData(["metal-rates", newBase], (old) => 
        old?.map(r => ({
          ...r,
          from: newBase,
          to: r.to === newBase ? prevBase : r.to,
          rate: r.to === newBase ? 1 / r.rate : r.rate,
          buy: r.to === newBase ? 1 / r.sell : r.buy,
          sell: r.to === newBase ? 1 / r.buy : r.sell
        }))
      );
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
        onChange={(index) => {
          setActiveTab(index);
          setActiveBase(["LYD", "EGP", "CRYPTO", "METALS"][index]);
        }}
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
              rates={forexQuery.data} 
              isLoading={forexQuery.isLoading} 
              error={forexQuery.error}
              onSwitch={handleSwitch}
            />
          </TabPanel>

          <TabPanel>
            <RatePanel 
              rates={forexQuery.data} 
              isLoading={forexQuery.isLoading} 
              error={forexQuery.error}
              onSwitch={handleSwitch}
            />
          </TabPanel>

          <TabPanel>
            <RatePanel 
              rates={cryptoQuery.data} 
              isLoading={cryptoQuery.isLoading} 
              error={cryptoQuery.error}
              onSwitch={handleSwitch}
            />
          </TabPanel>

          <TabPanel>
            <RatePanel 
              rates={metalQuery.data} 
              isLoading={metalQuery.isLoading} 
              error={metalQuery.error}
              onSwitch={handleSwitch}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ForexTicker;