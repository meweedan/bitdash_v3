// components/pay/CryptoMarket.js
import { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Text,
  Skeleton,
  useColorModeValue,
  Badge
} from '@chakra-ui/react';
import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import useSWR from 'swr';
import { formatCurrency } from '@/utils/format';

const CryptoMarket = () => {
  const { data, error } = useSWR('/api/crypto/market');
  const chartColor = useColorModeValue('purple.400', 'purple.200');
  const positiveColor = useColorModeValue('green.600', 'green.300');
  const negativeColor = useColorModeValue('red.600', 'red.300');

  if (error) return (
    <Box p={4} bg="red.50" borderRadius="md">
      <Text color="red.500">Failed to load market data</Text>
    </Box>
  );

  return (
    <Box>
      <Heading size="sm" mb={4} px={2}>Crypto Prices</Heading>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Coin</Th>
            <Th isNumeric>Price</Th>
            <Th isNumeric>24h</Th>
            <Th>Chart</Th>
          </Tr>
        </Thead>
        <Tbody>
          {!data ? (
            [1, 2, 3, 4, 5].map((i) => (
              <Tr key={i}>
                <Td><Skeleton height="20px" /></Td>
                <Td><Skeleton height="20px" /></Td>
                <Td><Skeleton height="20px" /></Td>
                <Td><Skeleton height="20px" /></Td>
              </Tr>
            ))
          ) : (
            data.map((coin) => {
              const change = coin.price_change_percentage_24h || 0;
              
              return (
                <Tr key={coin.symbol} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                  <Td>
                    <Text fontWeight="medium">{coin.name}</Text>
                    <Text fontSize="sm" color="gray.500">{coin.symbol.toUpperCase()}</Text>
                  </Td>
                  <Td isNumeric>
                    {formatCurrency(coin.current_price, 'USD')}
                  </Td>
                  <Td isNumeric>
                    <Badge 
                      colorScheme={change >= 0 ? 'green' : 'red'}
                      display="inline-flex" 
                      alignItems="center"
                    >
                      {change >= 0 ? (
                        <TriangleUpIcon mr={1} />
                      ) : (
                        <TriangleDownIcon mr={1} />
                      )}
                      {Math.abs(change).toFixed(2)}%
                    </Badge>
                  </Td>
                  <Td>
                    <Box width="100px" height="30px">
                      {coin.sparkline ? (
                        <Sparklines data={coin.sparkline}>
                          <SparklinesLine 
                            color={change >= 0 ? positiveColor : negativeColor} 
                            style={{ fill: 'none' }} 
                          />
                        </Sparklines>
                      ) : (
                        <Text color="gray.500">N/A</Text>
                      )}
                    </Box>
                  </Td>
                </Tr>
              );
            })
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default CryptoMarket;