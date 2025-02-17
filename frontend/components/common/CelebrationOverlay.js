// components/CelebrationOverlay.js
import React, { useEffect, useState } from 'react';
import { Box, keyframes } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const fallAnimation = keyframes`
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
`;

const Emoji = ({ children, delay }) => (
  <Box
    as={motion.div}
    position="fixed"
    left={`${Math.random() * 100}%`}
    top="-50px"
    fontSize="24px"
    animation={`${fallAnimation} 3s linear ${delay}s`}
    zIndex="tooltip"
  >
    {children}
  </Box>
);

const CelebrationOverlay = ({ isSuccess, isActive }) => {
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    if (isActive) {
      const emoji = isSuccess ? '💰' : '❌';
      const newEmojis = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        delay: Math.random() * 2
      }));
      setEmojis(newEmojis);

      // Clear emojis after animation
      const timer = setTimeout(() => {
        setEmojis([]);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isActive, isSuccess]);

  if (!isActive) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      pointerEvents="none"
      zIndex="overlay"
    >
      {emojis.map(({ id, delay }) => (
        <Emoji key={id} delay={delay}>
          {isSuccess ? '💰' : '❌'}
        </Emoji>
      ))}
    </Box>
  );
};

export default CelebrationOverlay;