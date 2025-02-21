import React, { useEffect, useState, useRef } from 'react';
import { Box, HStack, Text, Skeleton } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const ForexTicker = () => {
  const [rates, setRates] = useState([]);
  const tickerRef = useRef(null);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const res = await fetch('/api/exchange-rates');
        const data = await res.json();

        const filteredRates = data.map(item => ({
          from: item.from_currency,
          to: item.to_currency,
          rate: parseFloat(item.rate).toFixed(2),
        })).filter(rate => 
          ['USD', 'EUR', 'GBP', 'EGP', 'USDT'].includes(rate.to)
        );

        setRates(filteredRates);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
    const interval = setInterval(fetchExchangeRates, 60000); // Update every 60 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Box 
      ref={tickerRef} 
      overflow="hidden" 
      whiteSpace="nowrap" 
      w="full"
      py={2} 
      bg="gray.900"
      color="white"
      borderRadius="lg"
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: '-100%' }}
        transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
        style={{ display: 'inline-flex' }}
      >
        {rates.length > 0 ? rates.map((rate, index) => (
          <HStack key={index} mx={6}>
            <Text fontWeight="bold" color="green.300">{rate.from} → {rate.to}</Text>
            <Text fontWeight="bold" color="yellow.400">{rate.rate}</Text>
          </HStack>
        )) : (
          <Skeleton height="20px" width="80%" />
        )}
      </motion.div>
    </Box>
  );
};

export default ForexTicker;
