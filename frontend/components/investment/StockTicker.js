import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Flex,
  Text,
  HStack,
  useColorModeValue,
  Badge,
  Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StockTicker = () => {
  const [stockData, setStockData] = useState([]);
  const scrollRef = useRef(null);
  
  // Generate demo stock data
  useEffect(() => {
    const stocks = [
      { 
        symbol: 'AAPL', 
        price: '182.27', 
        change: '-0.54%',
        isUp: false 
      },
      { 
        symbol: 'MSFT', 
        price: '416.88', 
        change: '+1.23%',
        isUp: true 
      },
      { 
        symbol: 'AMZN', 
        price: '181.56', 
        change: '+0.87%',
        isUp: true 
      },
      { 
        symbol: 'GOOGL', 
        price: '173.92', 
        change: '+0.34%',
        isUp: true 
      },
      { 
        symbol: 'META', 
        price: '495.32', 
        change: '+1.65%',
        isUp: true 
      },
      { 
        symbol: 'TSLA', 
        price: '219.33', 
        change: '+1.87%',
        isUp: true 
      },
      { 
        symbol: 'NVDA', 
        price: '950.02', 
        change: '+2.13%',
        isUp: true 
      },
      { 
        symbol: 'JPM', 
        price: '197.45', 
        change: '-0.22%',
        isUp: false 
      },
      { 
        symbol: 'V', 
        price: '274.16', 
        change: '+0.45%',
        isUp: true 
      },
      { 
        symbol: 'XOM', 
        price: '112.37', 
        change: '-1.14%',
        isUp: false 
      },
      { 
        symbol: 'WMT', 
        price: '60.85', 
        change: '+0.35%',
        isUp: true 
      },
      { 
        symbol: 'JNJ', 
        price: '147.82', 
        change: '-0.76%',
        isUp: false 
      },
      // EU stocks (with currency)
      { 
        symbol: 'VOW.DE', 
        price: '107.50€', 
        change: '+0.89%',
        isUp: true 
      },
      { 
        symbol: 'MC.PA', 
        price: '720.40€', 
        change: '-1.22%',
        isUp: false 
      },
      { 
        symbol: 'SAP.DE', 
        price: '175.64€', 
        change: '+2.15%',
        isUp: true 
      },
      // Gold and Oil "stocks" (actually ETFs)
      { 
        symbol: 'GLD', 
        price: '211.42', 
        change: '+0.83%',
        isUp: true 
      },
      { 
        symbol: 'USO', 
        price: '74.36', 
        change: '-1.25%',
        isUp: false 
      },
    ];
    
    setStockData(stocks);
    
    // Simulate real-time updates with random changes every 3 seconds
    const interval = setInterval(() => {
      setStockData(prevData => 
        prevData.map(stock => {
          const randomChange = (Math.random() * 0.5 - 0.25).toFixed(2);
          const isUp = parseFloat(randomChange) >= 0;
          
          return {
            ...stock,
            change: `${isUp ? '+' : ''}${randomChange}%`,
            isUp
          };
        })
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Animation settings for the ticker
  const tickerVariants = {
    animate: {
      x: [0, -4000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 60,
          ease: "linear",
        },
      },
    },
  };

  return (
    <Box 
      w="full" 
      maxW="4xl"
      bg={useColorModeValue('purple.50', 'gray.800')}
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
        LIVE STOCKS
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
          {[...stockData, ...stockData].map((stock, index) => (
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
              <Text fontWeight="bold" fontSize="sm" mr={2} color="brand.bitinvest.500">
                {stock.symbol}
              </Text>
              <Text fontSize="sm" mr={2}>
                {stock.price}
              </Text>
              <Badge 
                colorScheme={stock.isUp ? "green" : "red"}
                variant="subtle"
                display="flex"
                alignItems="center"
                px={1.5}
                py={0.5}
              >
                <Icon 
                  as={stock.isUp ? FaArrowUp : FaArrowDown} 
                  boxSize={2} 
                  mr={1} 
                />
                {stock.change}
              </Badge>
            </Flex>
          ))}
        </motion.div>
      </Box>
    </Box>
  );
};

export default StockTicker;