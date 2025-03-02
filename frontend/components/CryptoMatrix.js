import { motion } from 'framer-motion';
import { SimpleGrid, Box, useColorModeValue, Icon } from '@chakra-ui/react';
import React from 'react';
import { 
  FaBitcoin, 
  FaEthereum,
  FaMonero
} from 'react-icons/fa';
import {
  SiDogecoin,
  SiLitecoin,
  SiCardano,
  SiPolkadot,
  SiTether,
  SiDash,
  SiRipple,
  SiChainlink,
  SiStellar
} from 'react-icons/si';

// Only including currencies with actual icons
const currencies = [
  {
    symbol: 'btc',
    name: 'Bitcoin',
    icon: FaBitcoin,
    color: '#F7931A'
  },
  {
    symbol: 'eth',
    name: 'Ethereum',
    icon: FaEthereum,
    color: '#627EEA'
  },
  {
    symbol: 'usdt',
    name: 'Tether',
    icon: SiTether,
    color: '#26A17B'
  },
  {
    symbol: 'ada',
    name: 'Cardano',
    icon: SiCardano,
    color: '#0033AD'
  },
  {
    symbol: 'xrp',
    name: 'Ripple',
    icon: SiRipple,
    color: '#23292F'
  },
  {
    symbol: 'dot',
    name: 'Polkadot',
    icon: SiPolkadot,
    color: '#E6007A'
  },
  {
    symbol: 'doge',
    name: 'Dogecoin',
    icon: SiDogecoin,
    color: '#C2A633'
  },
  {
    symbol: 'link',
    name: 'Chainlink',
    icon: SiChainlink,
    color: '#2A5ADA'
  },
  {
    symbol: 'ltc',
    name: 'Litecoin',
    icon: SiLitecoin,
    color: '#345D9D'
  },
  {
    symbol: 'xlm',
    name: 'Stellar',
    icon: SiStellar,
    color: '#3E1BDB'
  },
  {
    symbol: 'xmr',
    name: 'Monero',
    icon: FaMonero,
    color: '#FF6600'
  },
  {
    symbol: 'dash',
    name: 'Dash',
    icon: SiDash,
    color: '#008CE7'
  }
];

const CryptoMatrix = ({ 
  columns = { base: 3, md: 4, lg: 6 }, 
  spacing = { base: 2, md: 2 },
  duration = 4 
}) => {
  const boxBg = useColorModeValue('whiteAlpha.200', 'whiteAlpha.50');
  const boxShadow = useColorModeValue('lg', 'dark-lg');
  const glowColor = useColorModeValue('green.200', 'green.600');

  return (
    <SimpleGrid columns={columns} spacing={spacing}>
      {currencies.map(({ symbol, name, icon, color }, index) => (
        <motion.div
          key={symbol}
          animate={{
            y: [40, -40, 40],
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
            <Icon as={icon} boxSize="64px" color={color} />
          </Box>
        </motion.div>
      ))}
    </SimpleGrid>
  );
};

export default CryptoMatrix;