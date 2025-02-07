// components/FBMetric.js
import { motion } from 'framer-motion';
import { Box, VStack, Text, Icon } from '@chakra-ui/react';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { SurfaceTransition } from './SurfaceTransition';

export const FBMetric = ({ 
  icon: IconComponent,
  value,
  label,
  prefix = '',
  suffix = '',
  description 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      const duration = 2000;
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
    <Box
      ref={ref}
      p={6}
      bg="transparent"
      position="relative"
    >
      <SurfaceTransition>
        <VStack spacing={4} align="start" p={6}>
          <Icon as={IconComponent} boxSize={8} />
          <Text fontSize={{ base: "3xl", md: "5xl" }} fontWeight="bold" lineHeight="1">
            {prefix}{displayValue}{suffix}
          </Text>
          <Text fontSize="xl" fontWeight="bold" color="#67bdfd">{label}</Text>
          {description && (
            <Text fontSize="md">{description}</Text>
          )}
        </VStack>
      </SurfaceTransition>
    </Box>
  );
};