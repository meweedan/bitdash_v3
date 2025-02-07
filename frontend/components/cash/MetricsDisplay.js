// components/wallet/MetricsDisplay.js
import { SimpleGrid, Box, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const MetricsDisplay = () => {
  const metrics = [
    { label: 'Daily Transactions', value: '1M+' },
    { label: 'Processing Volume', value: '$500M+' },
    { label: 'Active Users', value: '100k+' },
    { label: 'Bank Partners', value: '25+' }
  ];

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
      {metrics.map((metric, index) => (
        <MotionBox
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <VStack spacing={2}>
            <Text fontSize="4xl" fontWeight="bold">
              {metric.value}
            </Text>
            <Text color="gray.500">{metric.label}</Text>
          </VStack>
        </MotionBox>
      ))}
    </SimpleGrid>
  );
};