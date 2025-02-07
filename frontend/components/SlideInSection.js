// components/SlideInSection.js
import { motion } from 'framer-motion';
import { Box } from '@chakra-ui/react';

export const SlideInSection = ({ 
  children, 
  direction = 'left', 
  delay = 0,
  duration = 0.8 
}) => {
  const variants = {
    hidden: {
      opacity: 1,
      x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
      y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: duration,
        delay: delay,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};