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
  Store,
  ShoppingBag,
  Package,
  Truck,
  BarChart3,
  Users,
  CreditCard,
  Star,
  ArrowRight,
  Building2
} from 'lucide-react';

import GradientHeading from '@/components/GradientHeading';
import ScrollProgress from '@/components/ScrollProgress';
import GlassCard from '@/components/GlassCard';
import DeluxeDeliveryFlow from '@/components/DeluxeDeliveryFlow';

const MotionBox = motion(Box);

const ShopLandingBrowser = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  // BitShop theme colors
  const bgGradient = useColorModeValue(
    'linear(to-b, #77a2e4, white)',
    'linear(to-b, gray.900, black)'
  );

  const features = [
    {
      icon: Store,
      title: 'Online Store',
      description: 'Create your store in minutes with powerful e-commerce tools',
      color: 'brand.bitshop.500'
    },
    {
      icon: Package,
      title: 'FBB Service',
      description: 'Fulfilled by BitShop - We handle storage and shipping',
      color: 'brand.bitshop.500'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Track performance and grow your business with insights',
      color: 'brand.bitshop.500'
    },
    {
      icon: CreditCard,
      title: 'Payments',
      description: 'Secure payment processing with BitCash integration',
      color: 'brand.bitshop.500'
    }
  ];

  const sellerBenefits = [
    {
      icon: Building2,
      title: 'Warehouse Network',
      description: 'Access our nationwide fulfillment centers'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Next-day delivery for FBB items'
    },
    {
      icon: Users,
      title: 'Customer Base',
      description: 'Reach millions of BitDash users'
    },
    {
      icon: Star,
      title: 'Seller Support',
      description: '24/7 dedicated seller support'
    }
  ];

  useEffect(() => {
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
        <title>BitShop | E-commerce Platform</title>
        <meta name="description" content="Build and grow your online business with BitShop" />
      </Head>

      {/* Hero Section */}
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
                    bgGradient="linear(to-r, brand.bitshop.500, brand.bitshop.700)"
                  >
                    Your Success Starts Here
                  </GradientHeading>

                  <Text 
                    fontSize={{ base: 'xl', md: '2xl' }} 
                    color={useColorModeValue('gray.600', 'gray.300')}
                    maxW="2xl"
                    textAlign="center"
                  >
                    Build, manage, and scale your online business with powerful e-commerce tools
                  </Text>

                  <HStack spacing={4} pt={4}>
                    <Button
                      size="lg"
                      variant="bitshop-solid"
                      rightIcon={<ArrowRight />}
                      h={14}
                      px={8}
                      fontSize="lg"
                      onClick={() => router.push('/shop/signup')}
                    >
                      Start Selling
                    </Button>
                    <Button
                      size="lg"
                      variant="bitshop-outline"
                      h={14}
                      px={8}
                      fontSize="lg"
                      onClick={() => router.push('/shop/learn-more')}
                    >
                      Learn More
                    </Button>
                  </HStack>
                </VStack>

                {/* Delivery flow showcase */}
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
                variant="bitshop"
                _hover={{ 
                  transform: 'translateY(-5px)',
                  boxShadow: 'xl'
                }}
                transition="all 0.3s ease"
              >
                <VStack align="start" spacing={4}>
                  <Icon as={feature.icon} boxSize={8} color="brand.bitshop.500" />
                  <Heading size="md">{feature.title}</Heading>
                  <Text>{feature.description}</Text>
                </VStack>
              </GlassCard>
            </motion.div>
          ))}
        </SimpleGrid>
      </Container>

      {/* Seller Benefits */}
      <Box bg={useColorModeValue('white', 'gray.900')} py={32}>
        <Container maxW="8xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <GradientHeading
                size="2xl"
                bgGradient="linear(to-r, brand.bitshop.500, brand.bitshop.700)"
              >
                Why Sell on BitShop?
              </GradientHeading>
              <Text fontSize="xl" maxW="3xl">
                Join thousands of successful sellers already growing their business with us
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
              {sellerBenefits.map((benefit, index) => (
                <GlassCard
                  key={index}
                  p={8}
                  variant="bitshop"
                  _hover={{ 
                    transform: 'translateY(-5px)',
                    boxShadow: 'xl'
                  }}
                  transition="all 0.3s ease"
                >
                  <VStack align="start" spacing={4}>
                    <Icon as={benefit.icon} boxSize={8} color="brand.bitshop.500" />
                    <Heading size="md">{benefit.title}</Heading>
                    <Text>{benefit.description}</Text>
                  </VStack>
                </GlassCard>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box py={32}>
        <Container maxW="8xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={16}>
            <VStack>
              <Heading size="3xl" color="brand.bitshop.500">10K+</Heading>
              <Text fontSize="xl">Active Sellers</Text>
            </VStack>
            <VStack>
              <Heading size="3xl" color="brand.bitshop.500">1M+</Heading>
              <Text fontSize="xl">Products Listed</Text>
            </VStack>
            <VStack>
              <Heading size="3xl" color="brand.bitshop.500">24/7</Heading>
              <Text fontSize="xl">Support Available</Text>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxW="8xl" py={32}>
        <GlassCard
          p={12}
          variant="bitshop"
          textAlign="center"
        >
          <VStack spacing={6}>
            <GradientHeading
              size="2xl"
              bgGradient="linear(to-r, brand.bitshop.500, brand.bitshop.700)"
            >
              Ready to Start Selling?
            </GradientHeading>
            <Text fontSize="xl" maxW="2xl">
              Join the fastest growing e-commerce platform in the region
            </Text>
            <HStack spacing={4}>
              <Button
                size="lg"
                variant="bitshop-solid"
                rightIcon={<ArrowRight />}
                h={14}
                px={8}
                fontSize="lg"
                onClick={() => router.push('/shop/signup')}
              >
                Create Store
              </Button>
              <Button
                size="lg"
                variant="bitshop-outline"
                h={14}
                px={8}
                fontSize="lg"
                onClick={() => router.push('/shop/demo')}
              >
                Request Demo
              </Button>
            </HStack>
          </VStack>
        </GlassCard>
      </Container>
    </Box>
  );
};

export default ShopLandingBrowser;