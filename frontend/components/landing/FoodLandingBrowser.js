import { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
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
} from '@chakra-ui/react';
import { 
  ArrowRight, 
  Utensils,
  ShoppingBag,
  Timer,
  ChefHat,
  Truck,
  Store,
  Star
} from 'lucide-react';

import GradientHeading from '@/components/GradientHeading';
import ScrollProgress from '@/components/ScrollProgress';
import GlassCard from '@/components/GlassCard';
import DeluxeDeliveryFlow from '@/components/DeluxeDeliveryFlow';

const MotionBox = motion(Box);

const BITFOOD_COLOR = '#FF7F50';
const BITFOOD_HOVER = '#FF6347';

const FoodLandingBrowser = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  // BitFood theme colors
  const bgGradient = useColorModeValue(
    'linear(to-b, #FFF5F2, white)',
    'linear(to-b, gray.900, black)'
  );

  const features = [
    {
      icon: Utensils,
      title: 'Restaurant Dining',
      description: 'Scan QR code, order, and pay at your table',
      color: BITFOOD_COLOR
    },
    {
      icon: Truck,
      title: 'Food Delivery',
      description: 'Your favorite meals delivered to your door',
      color: BITFOOD_COLOR
    },
    {
      icon: ShoppingBag,
      title: 'Grocery Delivery',
      description: 'Fresh groceries when you need them',
      color: BITFOOD_COLOR
    },
    {
      icon: Store,
      title: 'For Businesses',
      description: 'Complete restaurant management solution',
      color: BITFOOD_COLOR
    }
  ];

  useEffect(() => {
    // Ensure proper resize handling for animations
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }, []);

  return (
    <Box 
      ref={containerRef} 
      bg={bgGradient}
      minH="100vh"
      overflow="hidden"
    >
      <Head>
        <title>BitFood</title>
        <meta name="description" content="Order, dine, and deliver with BitFood" />
      </Head>

      {/* Hero Section with Full-Screen Delivery Flow */}
      <Box 
        ref={scrollRef}
        minH="100vh" 
        position="relative"
      >
        <AnimatePresence>
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            position="relative"
            zIndex={2}
          >
            <Container maxW="8xl" px={{ base: 4, lg: 0 }} py={0}>
              <Flex 
                minH="100vh"
                direction="column" 
                align="center" 
                justify="center"
                pt={{ base: 16, md: 24 }}
              >
                <VStack spacing={6} maxW="4xl" mb={12}>
                  <GradientHeading 
                    fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
                    textAlign="center"
                    bgGradient={`linear(to-r, ${BITFOOD_COLOR}, ${BITFOOD_HOVER})`}
                  >
                    The Future of Food
                  </GradientHeading>

                  <Text 
                    fontSize={{ base: 'xl', md: '2xl' }} 
                    color={useColorModeValue('gray.600', 'gray.300')}
                    maxW="2xl"
                    textAlign="center"
                  >
                    One platform for all your food needs - dine in, delivery, or groceries
                  </Text>

                  <HStack spacing={4} pt={4}>
                    <Button
                      size="lg"
                      bg={BITFOOD_COLOR}
                      color="white"
                      rightIcon={<ArrowRight />}
                      _hover={{ bg: BITFOOD_HOVER }}
                      h={14}
                      px={8}
                      fontSize="lg"
                      onClick={() => router.push('/food/explore')}
                    >
                      Explore BitFood
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      borderColor={BITFOOD_COLOR}
                      color={BITFOOD_COLOR}
                      h={14}
                      px={8}
                      fontSize="lg"
                      onClick={() => router.push('/food/business')}
                    >
                      For Business
                    </Button>
                  </HStack>
                </VStack>

                {/* Full-width delivery flow showcase */}
                <Box w="full" minH="70vh" position="relative">
                  <DeluxeDeliveryFlow />
                </Box>
              </Flex>
            </Container>
          </MotionBox>
        </AnimatePresence>
      </Box>

      {/* Features Grid */}
      <Container maxW="8xl" py={32}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard
                p={8}
                borderColor={feature.color}
                borderWidth={2}
                _hover={{ 
                  transform: 'translateY(-5px)',
                  boxShadow: 'xl'
                }}
                transition="all 0.3s ease"
              >
                <VStack align="start" spacing={4}>
                  <Icon as={feature.icon} boxSize={8} color={feature.color} />
                  <Heading size="md">{feature.title}</Heading>
                  <Text>{feature.description}</Text>
                </VStack>
              </GlassCard>
            </motion.div>
          ))}
        </SimpleGrid>
      </Container>

      {/* Stats Section */}
      <Box bg={useColorModeValue('white', 'gray.900')} py={32}>
        <Container maxW="8xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={16}>
            <VStack>
              <Heading size="3xl" color={BITFOOD_COLOR}>500+</Heading>
              <Text fontSize="xl">Restaurant Partners</Text>
            </VStack>
            <VStack>
              <Heading size="3xl" color={BITFOOD_COLOR}>15min</Heading>
              <Text fontSize="xl">Average Delivery Time</Text>
            </VStack>
            <VStack>
              <Heading size="3xl" color={BITFOOD_COLOR}>4.9⭐️</Heading>
              <Text fontSize="xl">Customer Rating</Text>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxW="8xl" py={32}>
        <GlassCard
          p={12}
          borderColor={BITFOOD_COLOR}
          borderWidth={2}
          textAlign="center"
        >
          <VStack spacing={6}>
            <GradientHeading
              size="2xl"
              bgGradient={`linear(to-r, ${BITFOOD_COLOR}, ${BITFOOD_HOVER})`}
            >
              Ready to Get Started?
            </GradientHeading>
            <Text fontSize="xl" maxW="2xl">
              Join thousands of satisfied customers and restaurants already using BitFood
            </Text>
            <HStack spacing={4}>
              <Button
                size="lg"
                bg={BITFOOD_COLOR}
                color="white"
                rightIcon={<ArrowRight />}
                _hover={{ bg: BITFOOD_HOVER }}
                h={14}
                px={8}
                fontSize="lg"
                onClick={() => router.push('/food/signup')}
              >
                Sign Up Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                borderColor={BITFOOD_COLOR}
                color={BITFOOD_COLOR}
                h={14}
                px={8}
                fontSize="lg"
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