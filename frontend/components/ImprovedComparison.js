// components/ImprovedComparison.js
import { VStack, Grid, Box, Text, HStack, useColorMode } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

export const ImprovedComparison = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const comparisons = [
    {
      traditional: {
        text: "12-15 minute wait times",
        metric: "15min",
        impact: "Lost customers during peak hours"
      },
      bitFood: {
        text: "Instant digital ordering",
        metric: "<1min",
        impact: "60% faster table turnover"
      }
    },
    {
      traditional: {
        text: "15% order error rate",
        metric: "15%",
        impact: "$2,000+ monthly waste"
      },
      bitFood: {
        text: "Near-perfect accuracy",
        metric: "99.9%",
        impact: "Save $24,000+ annually"
      }
    },
    {
      traditional: {
        text: "2-3 servers per section",
        metric: "3x",
        impact: "$8,000+ monthly staff cost"
      },
      bitFood: {
        text: "1 server per section",
        metric: "1x",
        impact: "67% staff cost reduction"
      }
    }
  ];

  return (
    <VStack spacing={8} w="full">
      {comparisons.map((comparison, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.2 }}
          style={{ width: '100%' }}
        >
          <Grid templateColumns="1fr 1fr" gap={4}>
            <Box 
              p={6} 
              bg={isDark ? 'gray.800' : 'gray.50'} 
              rounded="xl"
              borderWidth="1px"
              borderColor={isDark ? 'gray.700' : 'gray.200'}
            >
              <VStack align="start" spacing={4}>
                <Text fontSize="3xl" fontWeight="bold">{comparison.traditional.metric}</Text>
                <Text fontWeight="medium">{comparison.traditional.text}</Text>
                <Text fontSize="sm" color="gray.500">{comparison.traditional.impact}</Text>
              </VStack>
            </Box>
            <Box 
              p={6} 
              bg={isDark ? 'gray.900' : 'white'} 
              rounded="xl"
              borderWidth="1px"
              borderColor={isDark ? 'gray.700' : 'gray.200'}
              shadow="xl"
            >
              <VStack align="start" spacing={4}>
                <Text fontSize="3xl" fontWeight="bold">{comparison.bitFood.metric}</Text>
                <Text fontWeight="medium">{comparison.bitFood.text}</Text>
                <Text fontSize="sm" color="gray.500">{comparison.bitFood.impact}</Text>
              </VStack>
            </Box>
          </Grid>
        </motion.div>
      ))}
    </VStack>
  );
};