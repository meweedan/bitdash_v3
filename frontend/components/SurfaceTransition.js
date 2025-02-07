// components/SurfaceTransition.js
import { motion } from 'framer-motion';
import { Box, useColorMode } from '@chakra-ui/react';

export const SurfaceTransition = ({ children }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <Box
      position="relative"
      overflow="hidden"
      rounded="2xl"
    >
      <motion.div
        initial={{ backgroundPosition: "0% 0%" }}
        whileInView={{
          backgroundPosition: ["0% 0%", "100% 100%"]
        }}
        transition={{
          duration: 2,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDark
            ? "linear-gradient(45deg, rgba(26,32,44,1) 0%, rgba(45,55,72,1) 100%)"
            : "linear-gradient(45deg, rgba(247,250,252,1) 0%, rgba(237,242,247,1) 100%)",
          opacity: 0.33
        }}
      />
      {children}
    </Box>
  );
};
