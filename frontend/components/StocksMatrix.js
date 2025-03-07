import { motion } from 'framer-motion';
import { SimpleGrid, Box, useColorModeValue, Image } from '@chakra-ui/react';
import React from 'react';
import { FaBitcoin, FaEthereum, FaMonero } from 'react-icons/fa';

// Only including currencies with actual icons
const shares = [
  {
    symbol: 'aapl',
    name: 'AAPL',
    image: '/images/aapl.png',
  },
   {
    symbol: 'amzn',
    name: 'AMZN',
    image: '/images/amzn.png',
  },
   {
    symbol: 'tsla',
    name: 'TSLA',
    image: '/images/tsla.png',
  },
   {
    symbol: 'bofa',
    name: 'BOFA',
    image: '/images/bofa.png',
  },
  {
    symbol: 'gold',
    name: 'XAU',
    image: '/images/goldbar.png',
  },
  {
    symbol: 'oil',
    name: 'WTI',
    image: '/images/oil.png',
  },
];

const StocksMatrix = ({
  columns = { base: 3, md: 4, lg: 6 },
  spacing = { base: 2, md: 2 },
  duration = 4
}) => {
  const boxBg = useColorModeValue('whiteAlpha.200', 'whiteAlpha.50');
  const boxShadow = useColorModeValue('lg', 'dark-lg');
  const glowColor = useColorModeValue('green.200', 'green.600');

  return (
    <SimpleGrid columns={columns} spacing={spacing}>
      {shares.map(({ symbol, name, image, color }, index) => (
        <motion.div
          key={symbol}
          animate={{
            y: [10, -10, 10],
            opacity: [0.75, 1.5, 0.75]
          }}
          transition={{
            duration: duration,
            delay: index * 0.2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Box
            w="full"
            aspectRatio={1}
            p={3}
            bg={boxBg}
            borderRadius="3xl"
            boxShadow={boxShadow}
            _hover={{
              transform: 'scale(1.5)',
              boxShadow: `0 0 20px ${glowColor}`,
            }}
            transition="all 0.3s ease"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image src={image} boxSize="64px" />
          </Box>
        </motion.div>
      ))}
    </SimpleGrid>
  );
};

export default StocksMatrix;