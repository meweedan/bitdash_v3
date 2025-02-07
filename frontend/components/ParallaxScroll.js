// components/ParallaxScroll.js
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Box } from '@chakra-ui/react';
import { useRef } from 'react';

export const ParallaxScroll = ({ children, speed = 0.5 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const yRange = useTransform(
    smoothProgress,
    [0, 1],
    [0, speed * 100]
  );

  return (
    <Box ref={ref} position="relative" overflow="hidden">
      <motion.div 
        style={{ 
          y: yRange,
          willChange: "transform"
        }}
      >
        {children}
      </motion.div>
    </Box>
  );
};