// components/MarketplaceAnimation.js
import React from 'react';
import { Box, useColorMode } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Package, DollarSign, Building2, ShoppingCart, Store, Star } from 'lucide-react';

const MotionBox = motion(Box);

export const MarketplaceAnimation = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  return (
    <Box 
      position="relative" 
      h="400px" 
      overflow="hidden"
    >

      {/* Floating Stores */}
      {[...Array(5)].map((_, i) => (
        <MotionBox
          key={i}
          position="absolute"
          left={`${20 + i * 15}%`}
          top={`${30 + (i % 2) * 20}%`}
          animate={{
            y: [-20, 20],
            rotateY: [0, 360],
            z: [-50, 50]
          }}
          transition={{
            duration: 4,
            delay: i * 0.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <Store 
            size={48} 
            color={isDark ? "#90CDF4" : "#2B6CB0"}
            style={{ filter: 'drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.3))' }} 
          />
        </MotionBox>
      ))}

      {/* Products Flow */}
      <MotionBox
        position="absolute"
        left="50%"
        top="50%"
        animate={{
          scale: [1, 1.2, 1],
          rotateY: [0, 360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <ShoppingCart 
          size={64} 
          color={isDark ? "#F6AD55" : "#DD6B20"}
          style={{ filter: 'drop-shadow(0px 4px 30px rgba(0, 0, 0, 0.4))' }} 
        />
      </MotionBox>
    </Box>
  );
};