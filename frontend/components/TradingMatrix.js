import React, { useEffect, useState } from 'react';
import {
  Box,
  useColorModeValue,
  Text,
  Grid,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const TradingMatrix = () => {
  const [symbolsData, setSymbolsData] = useState([]);
  
  // Background and text colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const highlightColor = useColorModeValue('brand.bitfund.500', 'brand.bitfund.400');
  
  // Simulated trading instruments with random data
  useEffect(() => {
    const instruments = [
      { 
        symbol: 'ES', 
        name: 'E-mini S&P 500', 
        type: 'Futures',
        change: (Math.random() * 2 - 1).toFixed(2),
      },
      { 
        symbol: 'NQ', 
        name: 'E-mini NASDAQ', 
        type: 'Futures',
        change: (Math.random() * 2 - 1).toFixed(2),
      },
      { 
        symbol: 'CL', 
        name: 'Crude Oil', 
        type: 'Futures',
        change: (Math.random() * 2 - 1).toFixed(2),
      },
      { 
        symbol: 'GC', 
        name: 'Gold', 
        type: 'Futures',
        change: (Math.random() * 2 - 1).toFixed(2),
      },
      { 
        symbol: 'EUR/USD', 
        name: 'Euro/US Dollar', 
        type: 'Forex',
        change: (Math.random() * 0.5 - 0.25).toFixed(3),
      },
      { 
        symbol: 'GBP/USD', 
        name: 'British Pound/US Dollar', 
        type: 'Forex',
        change: (Math.random() * 0.5 - 0.25).toFixed(3),
      },
      { 
        symbol: 'USD/JPY', 
        name: 'US Dollar/Japanese Yen', 
        type: 'Forex',
        change: (Math.random() * 0.5 - 0.25).toFixed(3),
      },
      { 
        symbol: 'AAPL', 
        name: 'Apple Inc.', 
        type: 'Stocks',
        change: (Math.random() * 3 - 1.5).toFixed(2),
      },
      { 
        symbol: 'MSFT', 
        name: 'Microsoft', 
        type: 'Stocks',
        change: (Math.random() * 3 - 1.5).toFixed(2),
      },
      { 
        symbol: 'AMZN', 
        name: 'Amazon', 
        type: 'Stocks',
        change: (Math.random() * 3 - 1.5).toFixed(2),
      },
      { 
        symbol: 'TSLA', 
        name: 'Tesla', 
        type: 'Stocks',
        change: (Math.random() * 4 - 2).toFixed(2),
      },
      { 
        symbol: 'BTC/USD', 
        name: 'Bitcoin/US Dollar', 
        type: 'Crypto',
        change: (Math.random() * 5 - 2.5).toFixed(2),
      }
    ];
    
    // Update data
    setSymbolsData(instruments);
    
    // Set interval to update data randomly (simulating price changes)
    const interval = setInterval(() => {
      setSymbolsData(prevData => 
        prevData.map(item => ({
          ...item,
          change: (parseFloat(item.change) + (Math.random() * 0.4 - 0.2)).toFixed(
            item.type === 'Forex' ? 3 : 2
          )
        }))
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      w="full"
      maxW="4xl"
      bg={bgColor}
      borderRadius="xl"
      boxShadow="lg"
      overflow="hidden"
      p={1}
    >
      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
        gap={1}
      >
        {symbolsData.map((instrument, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Box
              p={3}
              borderRadius="md"
              bg={useColorModeValue('gray.50', 'gray.700')}
              _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
              transition="all 0.2s"
              cursor="pointer"
            >
              <Flex justify="space-between" align="center" mb={1}>
                <Text fontWeight="bold" fontSize="md">{instrument.symbol}</Text>
                <Badge 
                  colorScheme={parseFloat(instrument.change) >= 0 ? "green" : "red"}
                  variant="subtle"
                >
                  {parseFloat(instrument.change) >= 0 ? "+" : ""}{instrument.change}%
                </Badge>
              </Flex>
              <Text fontSize="xs" color="gray.500" mb={1}>{instrument.name}</Text>
              <Badge 
                size="sm" 
                colorScheme="blue" 
                fontSize="10px"
                variant="outline"
              >
                {instrument.type}
              </Badge>
            </Box>
          </motion.div>
        ))}
      </Grid>
    </Box>
  );
};

export default TradingMatrix;