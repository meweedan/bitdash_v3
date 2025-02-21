import React, { useEffect, useState, useRef } from 'react';
import { Box, HStack, Text, Skeleton, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const ForexTicker = () => {
  const [rates, setRates] = useState([]);
  const tickerRef = useRef(null);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const res = await fetch('/api/exchange-rates');
        if (!res.ok) {
          throw new Error(`API responded with status ${res.status}`);
        }
        const response = await res.json();

        // Extract exchange rate data from API response
        const filteredRates = response.data.map(item => ({
          from: item.attributes.from_currency,
          to: item.attributes.to_currency,
          rate: parseFloat(item.attributes.rate).toFixed(2),
        })).filter(rate => 
          ['USD', 'EUR', 'GBP', 'EGP', 'USDT'].includes(rate.to)
        );

        setRates(filteredRates);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
    const interval = setInterval(fetchExchangeRates, 60000); // Update every 60 sec

    return () => clearInterval(interval);
  }, []);

  const bgColor = useColorModeValue('gray.900', 'black');
  const textColor = useColorModeValue('white', 'gray.200');
  const accentColor = useColorModeValue('green.400', 'green.300');

  return (
    <Box
      ref={tickerRef}
      overflow="hidden"
      w="full"
      py={2}
      bg={bgColor}
      color={textColor}
      borderRadius="md"
      boxShadow="lg"
      border="1px solid"
      borderColor="gray.700"
    >
      {/* Animated Scrolling Container */}
      <motion.div
        style={{ display: 'flex', whiteSpace: 'nowrap', alignItems: 'center' }}
        animate={{ x: ['0%', '-100%'] }}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
      >
        {/* Duplicate Content to Ensure Seamless Looping */}
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
    </Box>
  );
};

export default ForexTicker;
