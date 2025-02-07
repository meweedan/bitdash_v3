// components/wallet/WalletParallax.js
import { Box, Image, useColorMode } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const WalletParallax = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <Box position="relative" height="500px">
      <MotionBox
        initial={{ y: 0 }}
        animate={{ 
          y: [-20, 20, -20],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <Image
          src={isDark ? "/wallet-dark.png" : "/wallet-light.png"}
          alt="BitWallet Platform"
          fallbackSrc="https://via.placeholder.com/500x400"
          objectFit="contain"
          w="full"
          h="full"
        />
      </MotionBox>

      {/* Background Glow Effect */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width="100%"
        height="100%"
        bgGradient={isDark ? 
          "radial(circle, blue.900 0%, transparent 70%)" : 
          "radial(circle, blue.50 0%, transparent 70%)"
        }
        opacity={0.6}
        filter="blur(40px)"
        zIndex={-1}
      />
    </Box>
  );
};