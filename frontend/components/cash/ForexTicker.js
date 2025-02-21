import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  HStack,
  Text,
  Skeleton,
  useColorModeValue,
  VStack,
  Icon
} from "@chakra-ui/react";
import { ArrowUp, ArrowDown } from "lucide-react";

const ForexTicker = () => {
  const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exchange-rates/latest`;

  // Store previous rates to calculate movement
  const [previousRates, setPreviousRates] = useState({});

  // ✅ Fetch exchange rates using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["exchange-rates"],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const json = await response.json();
      console.log("✅ Exchange Rates API Response:", json);

      if (!json?.data?.attributes?.results) {
        throw new Error("Invalid response format from API");
      }

      return json.data.attributes.results;
    },
    staleTime: 60000, // Cache data for 1 min
    refetchInterval: 60000, // Auto-refresh every 60 sec
  });

  useEffect(() => {
    if (data) {
      // Store the last known rates
      const rateMap = {};
      data.forEach(rate => {
        rateMap[`${rate.from_currency}-${rate.to_currency}`] = rate.rate;
      });
      setPreviousRates(rateMap);
    }
  }, [data]);

  // ✅ Process data to extract rates correctly and determine price movement
  const rates = data?.map((item) => {
    const pairKey = `${item.from_currency}-${item.to_currency}`;
    const previousRate = previousRates[pairKey] || item.rate;
    const currentRate = item.rate;
    const change = ((currentRate - previousRate) / previousRate) * 100;

    return {
      from: item.from_currency,
      to: item.to_currency,
      rate: parseFloat(currentRate).toFixed(2),
      change: change.toFixed(2),
      direction: currentRate > previousRate ? "up" : "down"
    };
  }).filter(rate => 
    ["USD", "EUR", "GBP", "EGP", "USDT"].includes(rate.to)
  ) || [];

  const bgColor = useColorModeValue("gray.900", "black");
  const textColor = useColorModeValue("white", "gray.200");
  const accentColor = useColorModeValue("green.400", "green.300");

  return (
    <Box
      w="full"
      py={4}
      px={6}
      bg={bgColor}
      color={textColor}
      borderRadius="md"
      boxShadow="xl"
      border="2px solid"
      borderColor="gray.700"
    >
      {/* Title */}
      <Text fontSize="xl" fontWeight="bold" textAlign="center" mb={3}>
        Live Exchange Rates
      </Text>

      {/* Handle Loading State */}
      {isLoading ? (
        <Skeleton height="20px" width="full" mt={2} />
      ) : error ? (
        <Text color="red.400" textAlign="center">Error loading exchange rates.</Text>
      ) : (
        <VStack spacing={2} align="stretch">
          {rates.map((rate, index) => (
            <HStack
              key={index}
              justify="space-between"
              p={2}
              borderBottom="1px solid"
              borderColor="gray.600"
            >
              {/* Currency Pair */}
              <Text fontSize="lg" fontWeight="bold">
                {rate.from} → {rate.to}
              </Text>

              {/* Exchange Rate */}
              <Text fontSize="lg" fontWeight="bold" color={accentColor}>
                {rate.rate}
              </Text>

              {/* Price Movement */}
              <HStack spacing={2}>
                <Icon
                  as={rate.direction === "up" ? ArrowUp : ArrowDown}
                  color={rate.direction === "up" ? "green.400" : "red.400"}
                  boxSize={5}
                />
                <Text color={rate.direction === "up" ? "green.400" : "red.400"}>
                  {rate.change}%
                </Text>
              </HStack>
            </HStack>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default ForexTicker;