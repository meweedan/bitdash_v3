import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";
import { ArrowUp, ArrowDown } from "lucide-react";

const profitMargin = 0.02; // 2% profit margin

const fetchRates = async ({ queryKey }) => {
  const [type, baseCurrency] = queryKey;
  let API_URL;

  if (type === "crypto-rates") {
    API_URL = `https://api.currencyfreaks.com/latest?apikey=9cd5b2412b1749a7b9c44ba9f9b2446f&symbols=USD,USDT,ETH,BTC,XAU`;
  } else {
    API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exchange-rates?/latest?base=${baseCurrency}`;
  }

  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${type}`);
  }

  const data = await response.json();

  if (type === "crypto-rates") {
    return Object.keys(data.rates).map((symbol) => ({
      from: "USDT",
      to: symbol,
      rate: parseFloat(data.rates[symbol]),
      buy: parseFloat(data.rates[symbol]) * (1 + profitMargin),
      sell: parseFloat(data.rates[symbol]) * (1 - profitMargin),
    }));
  } else {
    return data.data.attributes.results.map((item) => ({
      from: item.from_currency,
      to: item.to_currency,
      rate: parseFloat(item.rate),
      buy: parseFloat(item.buy_price),
      sell: parseFloat(item.sell_price),
      change: item.change_percentage || 0, // Default to 0 if missing
    }));
  }
};

const ForexTicker = () => {
  const [activeBase, setActiveBase] = useState("LYD");

  const forexQuery = useQuery({
    queryKey: ["forex-rates", activeBase],
    queryFn: fetchRates,
    refetchInterval: 60000,
  });

  const cryptoQuery = useQuery({
    queryKey: ["crypto-rates"],
    queryFn: fetchRates,
    refetchInterval: 60000,
  });

  const bgColor = useColorModeValue("gray.900", "black");
  const textColor = useColorModeValue("white", "gray.200");
  const brandGradient = "linear(to-r, brand.bitcash.400, brand.bitcash.700)";

  return (
    <Box bg={bgColor} color={textColor} borderRadius="lg" p={6} boxShadow="xl" w="full">
      <Tabs variant="solid-rounded" isFitted>
        <TabList bg={brandGradient} borderRadius="lg" p={2}>
          <Tab onClick={() => setActiveBase("LYD")} _selected={{ color: "white", bg: "brand.bitcash.500" }}>LYD</Tab>
          <Tab onClick={() => setActiveBase("EGP")} _selected={{ color: "white", bg: "brand.bitcash.500" }}>EGP</Tab>
          <Tab _selected={{ color: "white", bg: "brand.bitcash.500" }}>Crypto</Tab>
        </TabList>

        <TabPanels>
          {/* Forex (LYD/EGP) Panel */}
          <TabPanel>
            {forexQuery.isLoading ? (
              <Spinner />
            ) : forexQuery.error ? (
              <Alert status="error">
                <AlertIcon />
                {forexQuery.error.message}
              </Alert>
            ) : (
              <VStack spacing={3} w="full">
                {forexQuery.data.length > 0 ? (
                  forexQuery.data.map((rate) => (
                    <HStack
                      key={`${rate.from}-${rate.to}`}
                      justify="space-between"
                      w="full"
                      p={3}
                      borderRadius="md"
                      bg="gray.800"
                    >
                      <Text fontSize="md" fontWeight="bold">
                        {rate.from} → {rate.to}
                      </Text>
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
            )}
          </TabPanel>

          {/* Crypto Panel */}
          <TabPanel>
            {cryptoQuery.isLoading ? (
              <Spinner />
            ) : cryptoQuery.error ? (
              <Alert status="error">
                <AlertIcon />
                {cryptoQuery.error.message}
              </Alert>
            ) : (
              <VStack spacing={3} w="full">
                {cryptoQuery.data.length > 0 ? (
                  cryptoQuery.data.map((rate) => (
                    <HStack
                      key={`${rate.from}-${rate.to}`}
                      justify="space-between"
                      w="full"
                      p={3}
                      borderRadius="md"
                      bg="gray.800"
                    >
                      <Text fontSize="md" fontWeight="bold">
                        {rate.from} → {rate.to}
                      </Text>
                      <Text fontSize="lg" fontWeight="bold" color="yellow.300">
                        {rate.rate.toFixed(4)}
                      </Text>
                      <Text fontSize="sm" fontWeight="bold" color="blue.300">
                        Buy: {rate.buy.toFixed(4)}
                      </Text>
                      <Text fontSize="sm" fontWeight="bold" color="red.300">
                        Sell: {rate.sell.toFixed(4)}
                      </Text>
                    </HStack>
                  ))
                ) : (
                  <Text>No data available</Text>
                )}
              </VStack>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ForexTicker;
