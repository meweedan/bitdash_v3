import { VStack, Grid, Box, Text, HStack, useColorMode } from '@chakra-ui/react';
import { XCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'next-i18next';

export const SystemComparison = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const { t } = useTranslation('common');

  const comparisons = [
    {
      traditional: "Manual order taking (12-15 min)",
      bitMenu: "Instant digital ordering"
    },
    {
      traditional: "15% order error rate",
      bitMenu: "< 0.1% error rate"
    },
    {
      traditional: "High staff costs",
      bitMenu: "Reduced staff needs"
    },
    {
      traditional: "Limited analytics",
      bitMenu: "Real-time insights"
    }
  ];

  return (
    <VStack spacing={4} w="full">
      {comparisons.map((comparison, index) => (
        <Grid key={index} templateColumns="1fr 1fr" gap={4}>
          <Box p={4} bg={isDark ? 'red.900' : 'red.50'} rounded="md">
            <HStack>
              <XCircle />
              <Text>{comparison.traditional}</Text>
            </HStack>
          </Box>
          <Box p={4} bg={isDark ? 'green.900' : 'green.50'} rounded="md">
            <HStack>
              <CheckCircle />
              <Text>{comparison.bitMenu}</Text>
            </HStack>
          </Box>
        </Grid>
      ))}
    </VStack>
  );
};