// components/pay/CryptoBadge.jsx
import { useEffect, useState } from 'react';
import { 
  Box,
  HStack,
  VStack,
  Image,
  Text,
  Skeleton,
  useColorModeValue,
  useToken
} from '@chakra-ui/react';
import useSWR from 'swr';

const CryptoBadge = ({ 
  currencies = ['LYD', 'USDT', 'USD', 'EUR'],
  variant = 'solid',
  showRates = true,
  size = 'md',
  ...props 
}) => {
  const [bgColor] = useToken('colors', ['blackAlpha.400']);
  const { data: rates, error } = useSWR('/api/exchange-rates');
  
  const getSize = () => {
    switch(size) {
      case 'sm': return { px: 2, py: 1, text: 'sm' };
      case 'lg': return { px: 4, py: 2, text: 'lg' };
      default: return { px: 3, py: 1.5, text: 'md' };
    }
  };

  const getCurrencyData = (currency) => {
    const cryptoLogos = {
      LYD: '/cash/lyd-logo.png',
      USDT: '/cash/usdt-logo.png',
      USD: '/cash/usd-logo.png',
      EUR: '/cash/eur-logo.png',
    };

    return {
      logo: cryptoLogos[currency],
      rate: rates?.[currency]?.rate,
      change: rates?.[currency]?.change_24h
    };
  };

  return (
    <Box
      bg={variant === 'solid' ? 'whiteAlpha.100' : 'transparent'}
      borderWidth={variant === 'outline' ? '1px' : 0}
      borderColor="whiteAlpha.300"
      borderRadius="xl"
      p={getSize().py}
      backdropFilter="blur(12px)"
      sx={{
        backdropBlur: '12px',
        background: variant === 'glass' ? 
          `linear-gradient(145deg, ${bgColor} 0%, transparent 100%)` : 
          undefined
      }}
      boxShadow="lg"
      {...props}
    >
      <HStack spacing={3}>
        {currencies.map((currency) => {
          const { logo, rate, change } = getCurrencyData(currency);
          
          return (
            <HStack key={currency} spacing={2}>
              <Image 
                src={logo} 
                alt={currency}
                w={6} 
                h={6}
                borderRadius="full"
              />
              
              <VStack spacing={0} align="start">
                <Text fontSize={getSize().text} fontWeight="bold">
                  {currency}
                </Text>
                
                {showRates && (
                  <Skeleton isLoaded={!error && rates}>
                    <HStack spacing={1}>
                      <Text fontSize="xs" opacity={0.8}>
                        {rate ? `$${rate?.toFixed(2)}` : '--'}
                      </Text>
                      {change && (
                        <Text
                          fontSize="xs"
                          color={change >= 0 ? 'green.300' : 'red.300'}
                        >
                          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
                        </Text>
                      )}
                    </HStack>
                  </Skeleton>
                )}
              </VStack>
            </HStack>
          );
        })}
      </HStack>
    </Box>
  );
};

export default CryptoBadge;