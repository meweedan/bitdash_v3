import React from 'react';
import { Box, useColorMode, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Car, DollarSign, Warehouse } from 'lucide-react';

const MotionBox = motion(Box);

const AutoShowroomAnimation = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <Box position="relative" h="400px" overflow="hidden" my={8}>
      {/* Left Business Icon */}
      <MotionBox
        position="absolute"
        left="5%"
        top="40%"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Icon as={Warehouse} boxSize={12} color={isDark ? '#fff' : '#000'} />
      </MotionBox>

      {/* Right Business Icon */}
      <MotionBox
        position="absolute"
        right="5%"
        top="40%"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Icon as={Warehouse} boxSize={12} color={isDark ? '#fff' : '#000'} />
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
          ease: 'easeInOut',
        }}
      >
        <Icon as={Car} boxSize={8} color="#3182CE" />
      </MotionBox>

      {/* Animated Money Flow */}
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
          ease: 'easeInOut',
          delay: 0.5,
        }}
      >
        <Icon as={DollarSign} boxSize={8} color="#38A169" />
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
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut',
          }}
        />
      ))}
    </Box>
  );
};

export default AutoShowroomAnimation;
