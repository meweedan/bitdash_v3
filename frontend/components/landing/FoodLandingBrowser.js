import { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  useColorModeValue,
  Flex,
  Icon,
  Badge,
  useBreakpointValue,
} from '@chakra-ui/react';
import { 
  ArrowRight, 
  Utensils,
  ShoppingBag,
  Timer,
  ChefHat,
  Truck,
  Store,
  Star,
  Clock,
  Award,
  Shield
} from 'lucide-react';

import GradientHeading from '@/components/GradientHeading';
import ScrollProgress from '@/components/ScrollProgress';
import GlassCard from '@/components/GlassCard';
import DeluxeDeliveryFlow from '@/components/DeluxeDeliveryFlow';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const FoodLandingBrowser = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const containerRef = useRef(null);
  
  // Responsive font sizes
  const heroFontSize = useBreakpointValue({ 
    base: '3xl', 
    sm: '4xl', 
    md: '6xl', 
    lg: '7xl' 
  });
  
  const subtitleFontSize = useBreakpointValue({ 
    base: 'lg', 
    sm: 'xl', 
    md: '2xl' 
  });

  // Theme colors
  const bgGradient = useColorModeValue(
    'linear(to-b, #FFF5F2, white)',
    'linear(to-b, gray.900, black)'
  );

  const features = [
    {
      icon: ChefHat,
      title: 'Premium Dining',
      description: 'Experience culinary excellence with our carefully curated selection of top-rated restaurants',
    },
    {
      icon: Clock,
      title: 'Priority Delivery',
      description: 'Swift, white-glove delivery service ensuring your meal arrives in perfect condition',
    },
    {
      icon: Award,
      title: 'Elite Selection',
      description: 'Access to exclusive restaurants and specialty grocers not available elsewhere',
    },
    {
      icon: Shield,
      title: 'Concierge Service',
      description: 'Dedicated support team for a seamless premium dining experience',
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <Box 
      ref={containerRef} 
      bg={bgGradient}
      overflow="hidden"
    >
      <Head>
        <title>BitFood</title>
        <meta name="description" content="Premium dining and delivery experiences with BitFood" />
      </Head>

      {/* Hero Section */}
      <Box position="relative">
        <AnimatePresence>
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            position="relative"
            zIndex={2}
          >
            <Container maxW="8xl" px={{ base: 4, lg: 8 }} py={{ base: 8, md: 0 }}>
              <Flex 
                minH="100vh"
                direction="column" 
                align="center" 
                justify="center"
                pt={{ base: 20, md: 24 }}
                textAlign="center"
              >
                <VStack spacing={{ base: 6, md: 8 }} maxW="4xl" mb={{ base: 8, md: 12 }}>
                  <GradientHeading 
                    fontSize={heroFontSize}
                    bgGradient="linear(to-r, brand.bitfood.500, brand.bitfood.700)"
                    letterSpacing="tight"
                    fontWeight="bold"
                  >
                    Elevate Your Dining Experience
                  </GradientHeading>

                  <Text 
                    fontSize={subtitleFontSize}
                    color={useColorModeValue('gray.600', 'gray.300')}
                    maxW="2xl"
                    lineHeight="tall"
                  >
                    Discover a world of culinary excellence with our premium dining and delivery service
                  </Text>

                  <HStack 
                    spacing={{ base: 3, md: 4 }} 
                    pt={{ base: 4, md: 6 }}
                    flexDir={{ base: 'column', sm: 'row' }}
                    w={{ base: 'full', sm: 'auto' }}
                  >
                    <Button
                      variant="bitfood-solid"
                      size="lg"
                      rightIcon={<ArrowRight />}
                      h={{ base: 12, md: 14 }}
                      px={{ base: 6, md: 8 }}
                      fontSize={{ base: 'md', md: 'lg' }}
                      w={{ base: 'full', sm: 'auto' }}
                      onClick={() => router.push('/food/explore')}
                    >
                      Explore Premium Dining
                    </Button>
                    <Button
                      variant="bitfood-outline"
                      size="lg"
                      h={{ base: 12, md: 14 }}
                      px={{ base: 6, md: 8 }}
                      fontSize={{ base: 'md', md: 'lg' }}
                      w={{ base: 'full', sm: 'auto' }}
                      onClick={() => router.push('/food/business')}
                    >
                      Partner With Us
                    </Button>
                  </HStack>
                </VStack>

                {/* Delivery flow showcase */}
                <Box w="full" minH={{ base: '50vh', md: '70vh' }} position="relative">
                  <DeluxeDeliveryFlow />
                </Box>
              </Flex>
            </Container>
          </MotionBox>
        </AnimatePresence>
      </Box>

      {/* Features Grid */}
      <Box py={{ base: 16, md: 32 }} px={{ base: 4, md: 8 }}>
        <Container maxW="8xl">
          <SimpleGrid 
            columns={{ base: 1, md: 2, lg: 4 }} 
            spacing={{ base: 6, md: 8 }}
            mx="auto"
          >
            {features.map((feature, index) => (
              <MotionBox
                key={index}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <GlassCard
                  variant="bitfood"
                  p={{ base: 6, md: 8 }}
                  height="full"
                  _hover={{ 
                    transform: 'translateY(-5px)',
                    boxShadow: 'xl'
                  }}
                  transition="all 0.3s ease"
                >
                  <VStack align="start" spacing={4}>
                    <Icon as={feature.icon} boxSize={{ base: 6, md: 8 }} color="brand.bitfood.500" />
                    <Heading size="md" color={useColorModeValue('gray.800', 'white')}>
                      {feature.title}
                    </Heading>
                    <Text color={useColorModeValue('gray.600', 'gray.300')}>
                      {feature.description}
                    </Text>
                  </VStack>
                </GlassCard>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box 
        bg={useColorModeValue('white', 'gray.900')} 
        py={{ base: 16, md: 32 }}
        px={{ base: 4, md: 8 }}
      >
        <Container maxW="8xl">
          <SimpleGrid 
            columns={{ base: 1, md: 3 }} 
            spacing={{ base: 12, md: 16 }}
            textAlign="center"
          >
            <VStack>
              <Heading 
                size={{ base: '2xl', md: '3xl' }} 
                color="brand.bitfood.500"
                fontWeight="bold"
              >
                500+
              </Heading>
              <Text fontSize={{ base: 'lg', md: 'xl' }}>Elite Restaurant Partners</Text>
            </VStack>
            <VStack>
              <Heading 
                size={{ base: '2xl', md: '3xl' }} 
                color="brand.bitfood.500"
                fontWeight="bold"
              >
                15min
              </Heading>
              <Text fontSize={{ base: 'lg', md: 'xl' }}>Priority Delivery Time</Text>
            </VStack>
            <VStack>
              <Heading 
                size={{ base: '2xl', md: '3xl' }} 
                color="brand.bitfood.500"
                fontWeight="bold"
              >
                4.9⭐️
              </Heading>
              <Text fontSize={{ base: 'lg', md: 'xl' }}>Client Satisfaction</Text>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxW="8xl" py={{ base: 16, md: 32 }} px={{ base: 4, md: 8 }}>
        <GlassCard
          variant="bitfood"
          p={{ base: 8, md: 12 }}
          textAlign="center"
        >
          <VStack spacing={{ base: 4, md: 6 }}>
            <GradientHeading
              size={{ base: 'xl', md: '2xl' }}
              bgGradient="linear(to-r, brand.bitfood.500, brand.bitfood.700)"
            >
              Experience Premium Dining Today
            </GradientHeading>
            <Text 
              fontSize={{ base: 'md', md: 'xl' }} 
              maxW="2xl"
              color={useColorModeValue('gray.600', 'gray.300')}
            >
              Join our exclusive community of food connoisseurs and experience dining excellence
            </Text>
            <HStack 
              spacing={{ base: 3, md: 4 }}
              flexDir={{ base: 'column', sm: 'row' }}
              w={{ base: 'full', sm: 'auto' }}
            >
              <Button
                variant="bitfood-solid"
                size="lg"
                rightIcon={<ArrowRight />}
                h={{ base: 12, md: 14 }}
                px={{ base: 6, md: 8 }}
                fontSize={{ base: 'md', md: 'lg' }}
                w={{ base: 'full', sm: 'auto' }}
                onClick={() => router.push('/food/signup')}
              >
                Join Now
              </Button>
              <Button
                variant="bitfood-outline"
                size="lg"
                h={{ base: 12, md: 14 }}
                px={{ base: 6, md: 8 }}
                fontSize={{ base: 'md', md: 'lg' }}
                w={{ base: 'full', sm: 'auto' }}
                onClick={() => router.push('/food/learn-more')}
              >
                Learn More
              </Button>
            </HStack>
          </VStack>
        </GlassCard>
      </Container>
    </Box>
  );
};

export default FoodLandingBrowser;