import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Flex,
  Text,
  HStack,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MarketTicker = () => {
  const [marketData, setMarketData] = useState([]);
  const scrollRef = useRef(null);
  
  // Generate demo market data
  useEffect(() => {
    const indices = [
      { 
        name: 'S&P 500', 
        value: '4,873.12', 
        change: '+0.45%',
        positive: true 
      },
      { 
        name: 'NASDAQ', 
        value: '17,245.36', 
        change: '+0.67%',
        positive: true 
      },
      { 
        name: 'DOW JONES', 
        value: '38,927.03', 
        change: '+0.21%',
        positive: true 
      },
      { 
        name: 'FTSE 100', 
        value: '7,655.20', 
        change: '-0.15%',
        positive: false 
      },
      { 
        name: 'DAX', 
        value: '18,354.76', 
        change: '+0.32%',
        positive: true 
      },
      { 
        name: 'NIKKEI 225', 
        value: '38,687.22', 
        change: '-0.23%',
        positive: false 
      },
      { 
        name: 'EUR/USD', 
        value: '1.0864', 
        change: '+0.12%',
        positive: true 
      },
      { 
        name: 'USD/JPY', 
        value: '153.42', 
        change: '-0.34%',
        positive: false 
      },
      { 
        name: 'GOLD', 
        value: '$2,345.60', 
        change: '+0.83%',
        positive: true 
      },
      { 
        name: 'OIL (WTI)', 
        value: '$78.42', 
        change: '-1.25%',
        positive: false 
      },
      { 
        name: 'BTC/USD', 
        value: '$61,247.80', 
        change: '+2.14%',
        positive: true 
      },
      { 
        name: 'VIX', 
        value: '16.21', 
        change: '-3.45%',
        positive: false 
      }
    ];
    
    setMarketData(indices);
    
    // Simulate real-time updates with random changes every 5 seconds
    const interval = setInterval(() => {
      setMarketData(prevData => 
        prevData.map(item => {
          const randomChange = (Math.random() * 0.5 - 0.25).toFixed(2);
          const isPositive = parseFloat(randomChange) >= 0;
          
          return {
            ...item,
            change: `${isPositive ? '+' : ''}${randomChange}%`,
            positive: isPositive
          };
        })
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Animation settings for the ticker
  const tickerVariants = {
    animate: {
      x: [0, -3500],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 50,
          ease: "linear",
        },
      },
    },
  };

  return (
    <Box 
      w="full" 
      maxW="4xl"
      bg={useColorModeValue('blue.50', 'gray.800')}
      borderRadius="xl"
      overflow="hidden"
      px={4}
      py={3}
      position="relative"
    >
      <Text 
        position="absolute" 
        left={3} 
        top={3} 
        fontSize="xs" 
        fontWeight="bold"
        color={useColorModeValue('gray.600', 'gray.300')}
        zIndex={2}
      >
        LIVE MARKETS
      </Text>
      
      <Box 
        w="full" 
        overflowX="hidden"
        mt={1}
        pl="100px"
      >
        <motion.div
          ref={scrollRef}
          variants={tickerVariants}
          animate="animate"
          style={{ display: 'flex', whiteSpace: 'nowrap' }}
        >
          {[...marketData, ...marketData].map((market, index) => (
            <Flex 
              key={index} 
              mr={8} 
              align="center"
              px={3}
              py={1}
              borderRadius="md"
              bg={useColorModeValue('white', 'gray.700')}
              boxShadow="sm"
            >
              <Text fontWeight="semibold" fontSize="sm" mr={2}>
                {market.name}
              </Text>
              <Text fontSize="sm" mr={2}>
                {market.value}
              </Text>
              <Badge 
                colorScheme={market.positive ? "green" : "red"}
                variant="subtle"
              >
                {market.change}
              </Badge>
            </Flex>
          ))}
        </motion.div>
      </Box>
    </Box>
  );
};

export default MarketTicker;