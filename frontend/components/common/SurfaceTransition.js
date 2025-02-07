// components/common/SurfaceTransition.js
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const SurfaceTransition = ({ children }) => {
  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </MotionBox>
  );
};