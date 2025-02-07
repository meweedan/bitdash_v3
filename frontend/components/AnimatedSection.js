import { motion } from 'framer-motion';
import { Box } from '@chakra-ui/react';

export const AnimatedSection = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 1, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <Box>{children}</Box>
    </motion.div>
  );
};