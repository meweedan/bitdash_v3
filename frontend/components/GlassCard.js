import { motion } from 'framer-motion';
import { Box } from '@chakra-ui/react';

const GlassCard = ({ children, ...props }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
  >
    <Box
      bg="whiteAlpha.50"
      backdropFilter="blur(20px)"
      borderWidth="1px"
      borderColor="whiteAlpha.200"
      borderRadius="xl"
      boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
      {...props}
    >
      {children}
    </Box>
  </motion.div>
);

export default GlassCard;