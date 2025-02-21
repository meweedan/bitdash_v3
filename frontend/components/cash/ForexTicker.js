import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  HStack,
  Text,
  Skeleton,
  useColorModeValue
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const ForexTicker = () => {
  const tickerRef = useRef(null);
  const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exchange-rates?/latest`;

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

      return json;
    },
    staleTime: 60000, // Cache data for 1 min
    refetchInterval: 60000, // Auto-refresh every 60 sec
  });

  // ✅ Process data to extract rates correctly
  const rates = data?.data?.attributes?.results?.map((item) => ({
    from: item.from_currency,
    to: item.to_currency,
    rate: parseFloat(item.rate).toFixed(2),
  })).filter(rate => 
    ["USD", "EUR", "GBP", "EGP", "USDT"].includes(rate.to)
  ) || [];

  const bgColor = useColorModeValue("gray.900", "black");
  const textColor = useColorModeValue("white", "gray.200");
  const accentColor = useColorModeValue("green.400", "green.300");

  return (
    <Box
      ref={tickerRef}
      overflow="hidden"
      w="full"
      py={2}
      px={4}
      bg={bgColor}
      color={textColor}
      borderRadius="md"
      boxShadow="lg"
      border="1px solid"
      borderColor="gray.700"
    >
      {/* Handle Loading State */}
      {isLoading ? (
        <Skeleton height="20px" width="80%" mt={2} />
      ) : error ? (
        <Text color="red.400">Error loading exchange rates.</Text>
      ) : (
        <motion.div
          style={{ display: "flex", whiteSpace: "nowrap", alignItems: "center" }}
          animate={{ x: ["0%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          {/* Smooth Scrolling Ticker */}
          {[...rates, ...rates].map((rate, index) => (
            <HStack key={index} mx={6} spacing={2}>
              <Text fontSize="sm" fontWeight="bold" color="yellow.400">
                {rate.from} → {rate.to}
              </Text>
              <Text fontSize="md" fontWeight="bold" color={accentColor}>
                {rate.rate}
              </Text>
            </HStack>
          ))}
        </motion.div>
      )}
    </Box>
  );
};

export default ForexTicker;
