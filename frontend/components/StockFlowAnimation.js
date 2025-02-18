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
      h="500px" 
      overflow="hidden"
      my={8}
      borderRadius="lg"
      boxShadow="lg"
      bgGradient={isDark ? "linear(to-r, gray.800, black)" : "linear(to-r, white, gray.100)"}
    >
      {/* Business Icons */}
      <MotionBox
        position="absolute"
        left="10%"
        top="30%"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Building2 size={64} color={isDark ? '#fff' : '#000'} />
      </MotionBox>

      <MotionBox
        position="absolute"
        right="10%"
        top="30%"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Building2 size={64} color={isDark ? '#fff' : '#000'} />
      </MotionBox>

      {/* Animated Stock Flow */}
      <MotionBox
        position="absolute"
        left="25%"
        top="45%"
        animate={{
          x: [0, 500, 0],
          y: [0, -30, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Package size={40} color="#2B6CB0" style={{ filter: 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.2))' }} />
      </MotionBox>

      {/* Money Flow */}
      <MotionBox
        position="absolute"
        right="25%"
        top="45%"
        animate={{
          x: [0, -500, 0],
          y: [0, 30, 0],
          rotate: [0, -10, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <DollarSign size={40} color="#38A169" style={{ filter: 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.2))' }} />
      </MotionBox>

      {/* Floating Particles for Depth */}
      {[...Array(7)].map((_, i) => (
        <MotionBox
          key={i}
          position="absolute"
          left={`${15 + i * 12}%`}
          top="55%"
          width="10px"
          height="10px"
          borderRadius="full"
          bg="blue.400"
          animate={{
            y: [-20, 20, -20],
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.5, 0.8]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
          boxShadow="lg"
        />
      ))}
    </Box>
  );
};

export default StockFlowAnimation;