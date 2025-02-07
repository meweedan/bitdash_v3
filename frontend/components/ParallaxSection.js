import { motion } from 'framer-motion';
import { Box } from '@chakra-ui/react';

const ParallaxSection = ({ children, ...props }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.25 }}
    variants={{
      visible: { opacity: 1, y: 0 },
      hidden: { opacity: 0, y: 50 }
    }}
    transition={{ duration: 0.8, ease: [0.16, 0.77, 0.47, 0.97] }}
  >
    <Box {...props}>
      {children}
    </Box>
  </motion.div>
);

export default ParallaxSection;