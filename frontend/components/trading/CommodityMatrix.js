import { motion } from 'framer-motion';
import { SimpleGrid, Box, useColorModeValue, Icon } from '@chakra-ui/react';
import React from 'react';
import { 
  GiOilDrum, 
  GiGoldBar,
  GiSilverBullet,
  GiCorn,
  GiCoffeeBeans,
  GiWheat,
  GiWoodBeam,
  GiGasStove,
  GiCoalWagon,
  GiCottonFlower,
  GiSevenPointedStar,
  GiSteelClaws
} from 'react-icons/gi';

// List of commodities
const commodities = [
  {
    symbol: 'oil',
    name: 'Crude Oil',
    icon: GiOilDrum,
    color: '#4D4D4D'
  },
  {
    symbol: 'gold',
    name: 'Gold',
    icon: GiGoldBar,
    color: '#FFD700'
  },
  {
    symbol: 'silver',
    name: 'Silver',
    icon: GiSilverBullet,
    color: '#C0C0C0'
  },
  {
    symbol: 'naturalgas',
    name: 'Natural Gas',
    icon: GiGasStove,
    color: '#00A3E0'
  },
  {
    symbol: 'corn',
    name: 'Corn',
    icon: GiCorn,
    color: '#F4CC29'
  },
  {
    symbol: 'coffee',
    name: 'Coffee',
    icon: GiCoffeeBeans,
    color: '#6F4E37'
  },
  {
    symbol: 'wheat',
    name: 'Wheat',
    icon: GiWheat,
    color: '#F5DEB3'
  },
  {
    symbol: 'cotton',
    name: 'Cotton',
    icon: GiCottonFlower,
    color: '#FFFFFF'
  },
  {
    symbol: 'lumber',
    name: 'Lumber',
    icon: GiWoodBeam,
    color: '#855E42'
  },
  {
    symbol: 'copper',
    name: 'Copper',
    icon: GiSteelClaws,
    color: '#B87333'
  },
];

const CommodityMatrix = ({ 
  columns = { base: 3, md: 4, lg: 5 }, 
  spacing = { base: 2, md: 2 },
  duration = 4 
}) => {
  const boxBg = useColorModeValue('whiteAlpha.200', 'whiteAlpha.50');
  const boxShadow = useColorModeValue('lg', 'dark-lg');
  const glowColor = useColorModeValue('amber.200', 'amber.600');

  return (
    <SimpleGrid columns={columns} spacing={spacing}>
      {commodities.map(({ symbol, name, icon, color }, index) => (
        <motion.div
          key={symbol}
          animate={{
            y: [20, -5, 20],
            opacity: [0.8, 1, 0.8]
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

export default CommodityMatrix;