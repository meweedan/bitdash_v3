// components/FeatureComparison.js
import { Grid, Box, VStack, Text, HStack, Icon } from '@chakra-ui/react';
import { SlideInSection } from './SlideInSection';
import { SurfaceTransition } from './SurfaceTransition';
import { useColorMode } from '@chakra-ui/react';
import {
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const FeatureComparison = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const comparisons = [
    {
      traditional: {
        icon: Clock,
        metric: "15min",
        title: "Order Wait Time",
        description: "Long queues during peak hours"
      },
      BitFood: {
        icon: Clock,
        metric: "<1min",
        title: "Instant Ordering",
        description: "QR code scan to order"
      }
    },
    {
      traditional: {
        icon: DollarSign,
        metric: "15%",
        title: "Order Errors",
        description: "$2,000+ monthly waste"
      },
      BitFood: {
        icon: DollarSign,
        metric: "0.1%",
        title: "Error Rate",
        description: "AI-powered order validation"
      }
    },
    {
      traditional: {
        icon: Users,
        metric: "3x",
        title: "Staff Needs",
        description: "Higher operational costs"
      },
      BitFood: {
        icon: Users,
        metric: "1x",
        title: "Staff Optimization",
        description: "Efficient workforce management"
      }
    }
  ];

  return (
    <VStack spacing={12}>
      {comparisons.map((comparison, index) => (
        <SlideInSection 
          key={index} 
          direction={index % 2 === 0 ? 'left' : 'right'}
          delay={index * 0.2}
        >
          <Grid 
            templateColumns={{ base: "1fr", md: "1fr 1fr" }} 
            gap={8}
            w="full"
          >
            <Box>
              <SurfaceTransition>
                <VStack 
                  align="start" 
                  spacing={4} 
                  p={6}
                >
                  <Icon as={comparison.traditional.icon} boxSize={6} />
                  <Text fontSize="3xl" fontWeight="bold">
                    {comparison.traditional.metric}
                  </Text>
                  <Text fontSize="lg" fontWeight="medium">
                    {comparison.traditional.title}
                  </Text>
                  <Text fontSize="sm">
                    {comparison.traditional.description}
                  </Text>
                </VStack>
              </SurfaceTransition>
            </Box>
            <Box>
              <SurfaceTransition>
                <VStack 
                  align="start" 
                  spacing={4} 
                  p={6}
                >
                  <Icon as={comparison.BitFood.icon} boxSize={6} color="#67bdfd"/>
                  <Text fontSize="3xl" fontWeight="bold" color="#67bdfd">
                    {comparison.BitFood.metric}
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="#67bdfd">
                    {comparison.BitFood.title}
                  </Text>
                  <Text fontSize="sm" color="#67bdfd">
                    {comparison.BitFood.description}
                  </Text>
                </VStack>
              </SurfaceTransition>
            </Box>
          </Grid>
        </SlideInSection>
      ))}
    </VStack>
  );
};