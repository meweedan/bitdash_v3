// components/RestaurantMetrics.js
import { SimpleGrid } from '@chakra-ui/react';
import { FBMetric } from './FBMetric';
import { 
  Utensils, 
  Clock, 
  DollarSign, 
  Users,
  TrendingUp,
  Star,
  Smile,
  Coffee
} from 'lucide-react';
import { SlideInSection } from './SlideInSection';

export const RestaurantMetrics = () => {
  const metrics = [
    {
      icon: Clock,
      value: 60,
      suffix: '%',
      label: "Faster Service",
      description: "Average reduction in wait times"
    },
    {
      icon: DollarSign,
      value: 35,
      suffix: '%',
      label: "Revenue Growth",
      description: "Typical increase in first 3 months"
    },
    {
      icon: TrendingUp,
      value: 28,
      suffix: '%',
      label: "Higher Orders",
      description: "Average increase in order value"
    },
    {
      icon: Smile,
      value: 98,
      suffix: '%',
      label: "Guest Satisfaction",
      description: "Based on 10,000+ reviews"
    }
  ];

  return (
    <SimpleGrid 
      columns={{ base: 1, md: 2, lg: 4 }} 
      spacing={{ base: 6, md: 8 }}
      color="#67bdfd"
      w="full"
    >
      {metrics.map((metric, index) => (
        <SlideInSection
          key={index}
          direction={['left', 'right', 'left', 'right'][index]}
          delay={index * 0.1}
        >
          <FBMetric {...metric} />
        </SlideInSection>
      ))}
    </SimpleGrid>
  );
};
