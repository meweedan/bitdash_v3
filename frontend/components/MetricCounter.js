// components/MetricCounter.js
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { VStack, Text, Box } from '@chakra-ui/react';

export const MetricCounter = ({ value, label, prefix = '', suffix = '', description }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      const duration = 2000; // 2 seconds animation
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          current = value;
          clearInterval(timer);
        }
        setDisplayValue(Math.floor(current));
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <VStack 
      ref={ref} 
      align="start" 
      spacing={2}
      transform={isInView ? "none" : "translateY(20px)"}
      transition="all 0.9s cubic-bezier(0.22, 1, 0.36, 1)"
    >
      <Text fontSize={{ base: "4xl", md: "6xl" }} fontWeight="bold" lineHeight="1">
        {prefix}{displayValue}{suffix}
      </Text>
      <Text fontSize="xl" fontWeight="medium">{label}</Text>
      {description && (
        <Text fontSize="md" color="gray.500">{description}</Text>
      )}
    </VStack>
  );
};