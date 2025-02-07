import { motion } from 'framer-motion';
import { SimpleGrid, Box, Image } from '@chakra-ui/react';
import path from 'path';

const customCurrencies = [
  // Cryptocurrencies
  { symbol: 'btc', name: 'Bitcoin' },
  { symbol: 'eth', name: 'Ethereum' },
  { symbol: 'usdt', name: 'Tether' },
  
  // Fiat Currencies
  { symbol: 'lyd', name: 'Libyan Dinar' },
  { symbol: 'usd', name: 'US Dollar' },
  { symbol: 'eur', name: 'Euro' },
  { symbol: 'gbp', name: 'British Pound' },
  { symbol: 'egp', name: 'Egyptian Pound' },
  
];

const CryptoMatrix = ({ 
  columns = 8, 
  spacing = 2, 
  duration = 4 
}) => (
  <SimpleGrid columns={columns} spacing={spacing}>
    {customCurrencies.map(({ symbol, name }, index) => (
      <motion.div
        key={index}
        animate={{
          y: [10, -5, 10],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: duration,
          delay: Math.random() * 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <Box
          w={16}
          h={16}
          p={1}
          bg="whiteAlpha.50"
          borderRadius="2xl"
          boxShadow="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            src={`/cryptocurrency-icons/32/icon/${symbol}.png`}
            fallbackSrc={`/custom-icons/32/${symbol}.png`}
            alt={`${name} icon`}
            w={12}
            h={12}
            objectFit="contain"
          />
        </Box>
      </motion.div>
    ))}
  </SimpleGrid>
);

export default CryptoMatrix;