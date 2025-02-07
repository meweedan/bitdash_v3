// components/ROIMetrics.js
import { SimpleGrid, Box, VStack, Text, useColorMode } from '@chakra-ui/react';
import { MetricCounter } from './MetricCounter';

export const ROIMetrics = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const metrics = [
    {
      value: 35,
      suffix: '%',
      label: "Average Revenue Increase",
      description: "Within first 3 months"
    },
    {
      value: 24000,
      prefix: '$',
      label: "Annual Savings",
      description: "Through reduced errors & waste"
    },
    {
      value: 67,
      suffix: '%',
      label: "Staff Cost Reduction",
      description: "More efficient operations"
    },
    {
      value: 98,
      suffix: '%',
      label: "Customer Satisfaction",
      description: "Based on 10,000+ reviews"
    }
  ];

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
      {metrics.map((metric, index) => (
        <Box 
          key={index}
          p={6}
          bg={isDark ? '#67bdfd' : 'white'}
          rounded="xl"
          borderWidth="1px"
          borderColor={isDark ? '#67bdfd' : 'gray.200'}
          shadow="sm"
          transition="all 0.3s"
          _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
        >
          <MetricCounter {...metric} />
        </Box>
      ))}
    </SimpleGrid>
  );
};