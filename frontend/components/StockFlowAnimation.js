// components/StockFlowAnimation.js
import React from 'react';
import { Box, useColorMode } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Package, DollarSign, Building2 } from 'lucide-react';

const MotionBox = motion(Box);

export const StockFlowAnimation = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <Box 
      position="relative" 
      h="400px" 
      overflow="hidden"
      my={8}
    >
      {/* Business Icons */}
      <MotionBox
        position="absolute"
        left="5%"
        top="40%"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Building2 size={48} color={isDark ? '#fff' : '#000'} />
      </MotionBox>

      <MotionBox
        position="absolute"
        right="5%"
        top="40%"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Building2 size={48} color={isDark ? '#fff' : '#000'} />
      </MotionBox>

      {/* Animated Stock Flow */}
      <MotionBox
        position="absolute"
        left="20%"
        top="45%"
        animate={{
          x: [0, 400, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Package size={32} color="#3182CE" />
      </MotionBox>

      {/* Money Flow */}
      <MotionBox
        position="absolute"
        right="20%"
        top="45%"
        animate={{
          x: [0, -400, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <DollarSign size={32} color="#38A169" />
      </MotionBox>

      {/* Floating Elements */}
      {[...Array(5)].map((_, i) => (
        <MotionBox
          key={i}
          position="absolute"
          left={`${20 + i * 15}%`}
          top="60%"
          width="8px"
          height="8px"
          borderRadius="full"
          bg="blue.400"
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut"
          }}
        />
      ))}
    </Box>
  );
};

export default StockFlowAnimation;