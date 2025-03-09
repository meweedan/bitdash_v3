import { useState, useEffect } from 'react';
import { SimpleGrid, Box, Text, HStack, Heading, Badge, Spinner } from '@chakra-ui/react';
import { subDays, format } from 'date-fns';

async function fetchPairWithPrevious(from, to) {
  const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATES_API_KEY;
  if (!API_KEY) {
    throw new Error("Exchange Rates API key is missing");
  }
  
  // Fetch current rate using apilayer's convert endpoint
  const currentRes = await fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=1`, {
    headers: { apikey: API_KEY }
  });
  if (!currentRes.ok) {
    throw new Error(`Error fetching ${from}/${to} today: ${currentRes.statusText}`);
  }
  const currentData = await currentRes.json();
  const todayRate = currentData.result;
  
  // Fetch yesterday's rate
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
  const historicalRes = await fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=1&date=${yesterday}`, {
    headers: { apikey: API_KEY }
  });
  if (!historicalRes.ok) {
    throw new Error(`Error fetching ${from}/${to} yesterday: ${historicalRes.statusText}`);
  }
  const historicalData = await historicalRes.json();
  const yesterdayRate = historicalData.result;
  
  // Calculate percentage change
  const percentageChange = yesterdayRate
    ? (((todayRate - yesterdayRate) / yesterdayRate) * 100).toFixed(2)
    : "0.00";
  
  return { rate: todayRate, percentageChange };
}

export default function ForexRates() {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRates() {
      try {
        const [eurUsd, gbpUsd, usdJpy, usdChf] = await Promise.all([
          fetchPairWithPrevious("EUR", "USD"),
          fetchPairWithPrevious("GBP", "USD"),
          fetchPairWithPrevious("USD", "JPY"),
          fetchPairWithPrevious("USD", "CHF")
        ]);
        setRates({ eurUsd, gbpUsd, usdJpy, usdChf });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching forex rates:", error);
        setLoading(false);
      }
    }
    fetchRates();
  }, []);

  if (loading || !rates) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <SimpleGrid columns={2} spacing={1}>
      <Box>
        <Text fontSize="sm" color="gray.500">EUR/USD</Text>
        <HStack>
          <Heading size="md">{rates.eurUsd.rate.toFixed(4)}</Heading>
          <Badge colorScheme={rates.eurUsd.percentageChange >= 0 ? "green" : "red"}>
            {rates.eurUsd.percentageChange >= 0
              ? `+${rates.eurUsd.percentageChange}%`
              : `${rates.eurUsd.percentageChange}%`}
          </Badge>
        </HStack>
      </Box>
      <Box>
        <Text fontSize="sm" color="gray.500">GBP/USD</Text>
        <HStack>
          <Heading size="md">{rates.gbpUsd.rate.toFixed(4)}</Heading>
          <Badge colorScheme={rates.gbpUsd.percentageChange >= 0 ? "green" : "red"}>
            {rates.gbpUsd.percentageChange >= 0
              ? `+${rates.gbpUsd.percentageChange}%`
              : `${rates.gbpUsd.percentageChange}%`}
          </Badge>
        </HStack>
      </Box>
      <Box>
        <Text fontSize="sm" color="gray.500">USD/JPY</Text>
        <HStack>
          <Heading size="md">{rates.usdJpy.rate.toFixed(2)}</Heading>
          <Badge colorScheme={rates.usdJpy.percentageChange >= 0 ? "green" : "red"}>
            {rates.usdJpy.percentageChange >= 0
              ? `+${rates.usdJpy.percentageChange}%`
              : `${rates.usdJpy.percentageChange}%`}
          </Badge>
        </HStack>
      </Box>
      <Box>
        <Text fontSize="sm" color="gray.500">USD/CHF</Text>
        <HStack>
          <Heading size="md">{rates.usdChf.rate.toFixed(4)}</Heading>
          <Badge colorScheme={rates.usdChf.percentageChange >= 0 ? "green" : "red"}>
            {rates.usdChf.percentageChange >= 0
              ? `+${rates.usdChf.percentageChange}%`
              : `${rates.usdChf.percentageChange}%`}
          </Badge>
        </HStack>
      </Box>
    </SimpleGrid>
  );
}
