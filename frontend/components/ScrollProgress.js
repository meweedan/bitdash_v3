import { motion } from 'framer-motion';
import { Box } from '@chakra-ui/react';
import { useScroll } from 'framer-motion';

const ScrollProgress = ({ scrollYProgress }) => (
  <Box
    position="fixed"
    top={0}
    left={0}
    right={0}
    h="2px"
    zIndex={2000}
    bg="whiteAlpha.100"
  >
    <motion.div
      style={{
        width: scrollYProgress,
        height: '100%',
        background: 'linear(90deg, #4F46E5 0%, #EC4899 100%)',
        transformOrigin: '0% 50%'
      }}
    />
  </Box>
);

export default ScrollProgress;