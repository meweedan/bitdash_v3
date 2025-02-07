// components/common/SlideInSection.js
import { motion } from 'framer-motion';
import { chakra } from '@chakra-ui/react';

const MotionDiv = chakra(motion.div);

export const SlideInSection = ({ children, direction = "up", delay = 0 }) => {
  const variants = {
    hidden: {
      opacity: 0,
      x: direction === "left" ? -30 : direction === "right" ? 30 : 0,
      y: direction === "up" ? 30 : direction === "down" ? -30 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };

  return (
    <MotionDiv
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={variants}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </MotionDiv>
  );
};