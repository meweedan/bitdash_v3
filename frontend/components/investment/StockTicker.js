import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Flex,
  Text,
  HStack,
  useColorModeValue,
  Badge,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StockTicker = () => {
  const [stockData, setStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  
  useEffect(() => {
    async function fetchStockData() {
      try {
        setIsLoading(true);
        
        // Try to fetch the stock ticker data
        const response = await fetch('/chart-data/stock_ticker.json');
        
        if (!response.ok) {
          // Fallback to fetching individual symbols
          const symbols = [
            'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'TSLA', 'NVDA', 'JPM', 
            'V', 'XOM', 'WMT', 'JNJ', 'VOW.DE', 'MC.PA', 'SAP.DE', 'GLD', 'USO'
          ];
          
          const stocksData = [];
          
          // Fetch data for each symbol
          for (const symbol of symbols) {
            try {
              const symbolResponse = await fetch(`/chart-data/${symbol}_1d.json`);
              
              if (symbolResponse.ok) {
                const data = await symbolResponse.json();
                
                // Sort by timestamp to get the latest
                data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                
                if (data.length > 0) {
                  const latestData = data[0];
                  const previousData = data.length > 1 ? data[1] : { close: latestData.close };
                  
                  const percentChange = ((latestData.close - previousData.close) / previousData.close * 100);
                  const isUp = percentChange >= 0;
                  
                  const formattedPrice = symbol.includes('.DE') || symbol.includes('.PA') 
                    ? `${latestData.close.toFixed(2)}€` 
                    : `$${latestData.close.toFixed(2)}`;
                  
                  stocksData.push({
                    symbol,
                    price: formattedPrice,
                    change: `${isUp ? '+' : ''}${percentChange.toFixed(2)}%`,
                    isUp
                  });
                }
              }
            } catch (err) {
              console.error(`Error fetching data for ${symbol}:`, err);
            }
          }
          
          if (stocksData.length > 0) {
            setStockData(stocksData);
          } else {
            // Fallback to generated data
            setStockData(generateFallbackData());
          }
        } else {
          const data = await response.json();
          setStockData(data);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching stock ticker data:", err);
        setError(err.message);
        setIsLoading(false);
        
        // Fallback to generated data
        setStockData(generateFallbackData());
      }
    }
    
    fetchStockData();
    
    // Poll for updates every 60 seconds
    const interval = setInterval(() => {
      fetchStockData();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Generate fallback stock data if API fails
  function generateFallbackData() {
    return [
      { 
        symbol: 'AAPL', 
        price: '$182.27', 
        change: '-0.54%',
        isUp: false 
      },
      { 
        symbol: 'MSFT', 
        price: '$416.88', 
        change: '+1.23%',
        isUp: true 
      },
      { 
        symbol: 'AMZN', 
        price: '$181.56', 
        change: '+0.87%',
        isUp: true 
      },
      { 
        symbol: 'GOOGL', 
        price: '$173.92', 
        change: '+0.34%',
        isUp: true 
      },
      { 
        symbol: 'META', 
        price: '$495.32', 
        change: '+1.65%',
        isUp: true 
      },
      { 
        symbol: 'TSLA', 
        price: '$219.33', 
        change: '+1.87%',
        isUp: true 
      },
      { 
        symbol: 'NVDA', 
        price: '$950.02', 
        change: '+2.13%',
        isUp: true 
      },
      { 
        symbol: 'JPM', 
        price: '$197.45', 
        change: '-0.22%',
        isUp: false 
      },
      { 
        symbol: 'V', 
        price: '$274.16', 
        change: '+0.45%',
        isUp: true 
      },
      { 
        symbol: 'XOM', 
        price: '$112.37', 
        change: '-1.14%',
        isUp: false 
      },
      { 
        symbol: 'WMT', 
        price: '$60.85', 
        change: '+0.35%',
        isUp: true 
      },
      { 
        symbol: 'JNJ', 
        price: '$147.82', 
        change: '-0.76%',
        isUp: false 
      },
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
      { 
        symbol: 'GLD', 
        price: '$211.42', 
        change: '+0.83%',
        isUp: true 
      },
      { 
        symbol: 'USO', 
        price: '$74.36', 
        change: '-1.25%',
        isUp: false 
      },
    ];
  }

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

  // Loading state
  if (isLoading) {
    return (
      <Box 
        w="full" 
        maxW="4xl"
        bg={useColorModeValue('purple.50', 'gray.800')}
        borderRadius="xl"
        overflow="hidden"
        p={4}
        textAlign="center"
      >
        <Spinner color="brand.bitinvest.500" />
        <Text mt={2}>Loading stock data...</Text>
      </Box>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Box 
        w="full" 
        maxW="4xl"
        bg={useColorModeValue('purple.50', 'gray.800')}
        borderRadius="xl"
        overflow="hidden"
        p={4}
      >
        <Alert status="error" variant="left-accent">
          <AlertIcon />
          Error loading stock data: {error}
        </Alert>
      </Box>
    );
  }

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