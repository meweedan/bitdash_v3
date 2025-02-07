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
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { 
  Car,
  Shield,
  Clock,
  MapPin,
  CreditCard,
  Star,
  ArrowRight,
  Smartphone,
  Award,
  UserCheck
} from 'lucide-react';

import GradientHeading from '@/components/GradientHeading';
import ScrollProgress from '@/components/ScrollProgress';
import GlassCard from '@/components/GlassCard';
import RideAnimation from '@/components/ride/RideAnimation';
import SafetyAnimation from '@/components/ride/SafetyAnimation';

const MotionBox = motion(Box);

const BitRideLandingBrowser = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const containerRef = useRef(null);

  const bgGradient = useColorModeValue(
    'linear(to-b, #FFF9F0, white)',
    'linear(to-b, gray.900, black)'
  );

  const features = [
    {
      icon: Clock,
      title: 'Quick Pickup',
      description: 'Get a ride in minutes, day or night',
    },
    {
      icon: Shield,
      title: 'Safe Travel',
      description: 'Verified drivers and real-time tracking',
    },
    {
      icon: CreditCard,
      title: 'Easy Payment',
      description: 'Pay with BitCash or card',
    },
    {
      icon: Star,
      title: 'Rate & Review',
      description: 'Share your experience and feedback',
    }
  ];

  const driverBenefits = [
    {
      icon: Award,
      title: 'Competitive Earnings',
      description: 'Make more with our fair pricing model'
    },
    {
      icon: Smartphone,
      title: 'Flexible Hours',
      description: 'Drive whenever it suits you'
    },
    {
      icon: UserCheck,
      title: 'Quick Verification',
      description: 'Easy onboarding process'
    },
    {
      icon: Shield,
      title: 'Insurance Coverage',
      description: 'Stay protected while driving'
    }
  ];

  return (
    <Box 
      ref={containerRef} 
      bg={bgGradient}
    >
      <Head>
        <title>BitRide</title>
        <meta name="description" content="Safe and reliable rides at your fingertips" />
      </Head>

      {/* Hero Section */}
      <Container maxW="8xl" px={{ base: 4, lg: 0 }}>
  <Grid
    templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
    gap={{ base: 12, lg: 8 }}
    alignItems="center"
  >
    <GridItem order={{ base: 2, lg: 1 }}>
      <VStack 
        align={{ base: 'center', lg: 'start' }} 
        spacing={{ base: 6, lg: 8 }} 
        textAlign={{ base: 'center', lg: 'left' }}
      >
        <GradientHeading
          fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
          bgGradient="linear(to-r, brand.bitride.500, brand.bitride.700)"
          lineHeight={{ base: 1.2, lg: 1.1 }}
        >
          Your Ride, Your Way
        </GradientHeading>

        <Text
          fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
          color={useColorModeValue('gray.600', 'gray.300')}
          maxW="xl"
        >
          Experience premium ride-hailing service with professional drivers and comfortable vehicles. Available 24/7.
        </Text>

        <HStack 
          spacing={{ base: 2, md: 4 }}
          flexDir={{ base: 'column', sm: 'row' }}
          w={{ base: "full", sm: "auto" }}
        >
          <Button
            size={{ base: "md", lg: "lg" }}
            variant="bitride-solid"
            rightIcon={<ArrowRight />}
            w={{ base: "full", sm: "auto" }}
            h={{ base: 12, lg: 14 }}
            px={{ base: 6, lg: 8 }}
            fontSize={{ base: "md", lg: "lg" }}
            onClick={() => router.push('/ride/book')}
          >
            Book Now
          </Button>
          <Button
            size={{ base: "md", lg: "lg" }}
            variant="bitride-outline"
            w={{ base: "full", sm: "auto" }}
            h={{ base: 12, lg: 14 }}
            px={{ base: 6, lg: 8 }}
            fontSize={{ base: "md", lg: "lg" }}
            onClick={() => router.push('/ride/driver-signup')}
          >
            Become a Driver
          </Button>
        </HStack>
      </VStack>
    </GridItem>

    <GridItem order={{ base: 1, lg: 2 }}>
      <Box 
        height={{ base: '500px', sm: '300px', md: '400px', lg: '600px' }}
        mx={{ base: -4, lg: 0 }}
      >
        <RideAnimation />
      </Box>
    </GridItem>
  </Grid>
</Container>

      {/* Features Grid */}
      <Container maxW="8xl" py={{ base: 12, md: 20 }} px={{ base: 4, lg: 0 }}>
        <SimpleGrid 
            columns={{ base: 1, md: 2, lg: 4 }} 
            spacing={{ base: 6, lg: 8 }}
        >
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
                variant="bitride"
                _hover={{ 
                  transform: 'translateY(-5px)',
                  boxShadow: 'xl'
                }}
                transition="all 0.3s ease"
              >
                <VStack align="start" spacing={4}>
                  <Icon as={feature.icon} boxSize={8} color="brand.bitride.500" />
                  <Heading size="md">{feature.title}</Heading>
                  <Text>{feature.description}</Text>
                </VStack>
              </GlassCard>
            </motion.div>
          ))}
        </SimpleGrid>
      </Container>

      {/* Driver Benefits */}
      <Box bg={useColorModeValue('white', 'gray.900')} py={20}>
        <Container maxW="8xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <GradientHeading
                size="2xl"
                bgGradient="linear(to-r, brand.bitride.500, brand.bitride.700)"
              >
                Drive with BitRide
              </GradientHeading>
              <Text fontSize="xl" maxW="3xl">
                Join our community of professional drivers and earn on your own schedule
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
              {driverBenefits.map((benefit, index) => (
                <GlassCard
                  key={index}
                  p={8}
                  variant="bitride"
                  _hover={{ 
                    transform: 'translateY(-5px)',
                    boxShadow: 'xl'
                  }}
                  transition="all 0.3s ease"
                >
                  <VStack align="start" spacing={4}>
                    <Icon as={benefit.icon} boxSize={8} color="brand.bitride.500" />
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
      <Box py={20}>
        <Container maxW="8xl">
          <SimpleGrid 
            columns={{ base: 1, sm: 2, md: 3 }} 
            spacing={{ base: 8, md: 16 }}
            px={{ base: 4, lg: 0 }}
            >
            <VStack>
                <Heading 
                size={{ base: "2xl", md: "3xl" }} 
                color="brand.bitride.500"
                >
                5K+
                </Heading>
                <Text fontSize={{ base: "lg", md: "xl" }}>Active Drivers</Text>
            </VStack>
            <VStack>
              <Heading size="3xl" color="brand.bitride.500">1M+</Heading>
              <Text fontSize="xl">Monthly Rides</Text>
            </VStack>
            <VStack>
              <Heading size="3xl" color="brand.bitride.500">4.9⭐</Heading>
              <Text fontSize="xl">User Rating</Text>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxW="8xl" py={20}>
        <GlassCard
          p={12}
          variant="bitride"
          textAlign="center"
        >
          <VStack spacing={6}>
            <GradientHeading
              size="2xl"
              bgGradient="linear(to-r, brand.bitride.500, brand.bitride.700)"
            >
              Ready to Start?
            </GradientHeading>
            <Text fontSize="xl" maxW="2xl">
              Download the app and experience premium ride service today
            </Text>
            <HStack spacing={4}>
              <Button
                size="lg"
                variant="bitride-solid"
                rightIcon={<ArrowRight />}
                h={14}
                px={8}
                fontSize="lg"
                onClick={() => router.push('/ride/download')}
              >
                Download App
              </Button>
              <Button
                size="lg"
                variant="bitride-outline"
                h={14}
                px={8}
                fontSize="lg"
                onClick={() => router.push('/ride/learn-more')}
              >
                Learn More
              </Button>
            </HStack>
          </VStack>
        </GlassCard>
      </Container>

      {/* How It Works Section */}
      <Box bg={useColorModeValue('white', 'gray.900')} py={20}>
        <Container maxW="8xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <GradientHeading
                size="2xl"
                bgGradient="linear(to-r, brand.bitride.500, brand.bitride.700)"
              >
                How BitRide Works
              </GradientHeading>
              <Text fontSize="xl" maxW="3xl">
                Getting a ride is easier than ever
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              <GlassCard
                p={8}
                variant="bitride"
                textAlign="center"
              >
                <VStack spacing={4}>
                  <Icon as={MapPin} boxSize={10} color="brand.bitride.500" />
                  <Heading size="md">Set Your Location</Heading>
                  <Text>Let us know where you are and where you're going</Text>
                </VStack>
              </GlassCard>

              <GlassCard
                p={8}
                variant="bitride"
                textAlign="center"
              >
                <VStack spacing={4}>
                  <Icon as={Car} boxSize={10} color="brand.bitride.500" />
                  <Heading size="md">Match with a Driver</Heading>
                  <Text>We'll connect you with a nearby professional driver</Text>
                </VStack>
              </GlassCard>

              <GlassCard
                p={8}
                variant="bitride"
                textAlign="center"
              >
                <VStack spacing={4}>
                  <Icon as={Star} boxSize={10} color="brand.bitride.500" />
                  <Heading size="md">Enjoy Your Ride</Heading>
                  <Text>Track your ride in real-time and pay seamlessly</Text>
                </VStack>
              </GlassCard>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Safety Section */}
      <Container maxW="8xl" py={20}>
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
          <GridItem>
            <VStack align="start" spacing={6}>
              <GradientHeading
                size="2xl"
                bgGradient="linear(to-r, brand.bitride.500, brand.bitride.700)"
              >
                Your Safety is Our Priority
              </GradientHeading>
              <Text fontSize="lg">
                Every ride is tracked and monitored in real-time. Our drivers undergo thorough background checks and training to ensure your safety.
              </Text>
              <SimpleGrid columns={2} spacing={6} w="full">
                <VStack align="start">
                  <HStack>
                    <Icon as={Shield} color="brand.bitride.500" />
                    <Text fontWeight="bold">Driver Verification</Text>
                  </HStack>
                  <Text fontSize="sm">Background checked and licensed drivers</Text>
                </VStack>
                <VStack align="start">
                  <HStack>
                    <Icon as={MapPin} color="brand.bitride.500" />
                    <Text fontWeight="bold">Live Tracking</Text>
                  </HStack>
                  <Text fontSize="sm">Share your ride with trusted contacts</Text>
                </VStack>
                <VStack align="start">
                  <HStack>
                    <Icon as={Clock} color="brand.bitride.500" />
                    <Text fontWeight="bold">24/7 Support</Text>
                  </HStack>
                  <Text fontSize="sm">Always here when you need us</Text>
                </VStack>
                <VStack align="start">
                  <HStack>
                    <Icon as={Shield} color="brand.bitride.500" />
                    <Text fontWeight="bold">Insurance Coverage</Text>
                  </HStack>
                  <Text fontSize="sm">Every ride is insured</Text>
                </VStack>
              </SimpleGrid>
            </VStack>
          </GridItem>
          <GridItem>
                <SafetyAnimation />
          </GridItem>
        </Grid>
      </Container>

      {/* Final CTA */}
      <Box py={20}>
        <Container maxW="8xl">
          <GlassCard
            p={{ base: 6, md: 12 }}
            variant="bitride"
            textAlign="center"
            mx={{ base: 4, lg: 0 }}
            >
            <VStack spacing={{ base: 4, md: 6 }}>
                <GradientHeading
                size={{ base: "xl", md: "2xl" }}
                bgGradient="linear(to-r, brand.bitride.500, brand.bitride.700)"
                >
                Ready to Start?
                </GradientHeading>
                <Text 
                fontSize={{ base: "lg", md: "xl" }} 
                maxW="2xl"
                >
                Download the app and experience premium ride service today
                </Text>
                <HStack 
                spacing={{ base: 2, md: 4 }}
                flexDir={{ base: 'column', sm: 'row' }}
                w={{ base: "full", sm: "auto" }}
                >
                <Button
                  size="lg"
                  variant="bitride-solid"
                  h={14}
                  px={8}
                  fontSize="lg"
                  onClick={() => router.push('/ride/signup')}
                >
                  Sign Up to Ride
                </Button>
                <Button
                  size="lg"
                  variant="bitride-outline"
                  h={14}
                  px={8}
                  fontSize="lg"
                  onClick={() => router.push('/ride/driver-signup')}
                >
                  Become a Driver
                </Button>
              </HStack>
            </VStack>
          </GlassCard>
        </Container>
      </Box>
    </Box>
  );
};

export default BitRideLandingBrowser;