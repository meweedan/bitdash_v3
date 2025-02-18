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
      h="600px" 
      overflow="hidden"
      perspective="1000px"
    >
      {/* 3D Grid Background */}
      <MotionBox
        position="absolute"
        width="200%"
        height="200%"
        style={{
          backgroundImage: `linear-gradient(${isDark ? 'rgba(45,55,72,0.3)' : 'rgba(226,232,240,0.3)'} 1px, 
                           transparent 1px), 
                           linear-gradient(90deg, ${isDark ? 'rgba(45,55,72,0.3)' : 'rgba(226,232,240,0.3)'} 1px, 
                           transparent 1px)`,
          backgroundSize: '40px 40px',
          transform: 'rotateX(60deg) translateY(-50%)',
        }}
        animate={{
          y: [0, -40],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear"
        }}
      />

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

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <MotionBox
          key={i}
          position="absolute"
          left={`${Math.random() * 100}%`}
          top={`${Math.random() * 100}%`}
          width="4px"
          height="4px"
          borderRadius="full"
          bg={isDark ? "blue.400" : "blue.500"}
          animate={{
            y: [-100, 100],
            x: [-50, 50],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </Box>
  );
};