import { useRef } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
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
  Divider,
  Code,
  List,
  ListItem,
  ListIcon,
  Badge
} from '@chakra-ui/react';
import { ArrowRight } from 'phosphor-react/dist';
import { 
  FaCode, 
  FaServer, 
  FaShieldAlt, 
  FaGlobe,
  FaMoneyBillWave,
  FaLock,
  FaExchangeAlt,
  FaBitcoin,
  FaIndustry,
  FaMobileAlt,
  FaRegChartBar,
  FaBalanceScale
} from 'react-icons/fa';
import { MdCheckCircle } from 'react-icons/md';

import ParallaxSection from '@/components/ParallaxSection';
import GradientHeading from '@/components/GradientHeading';
import ScrollProgress from '@/components/ScrollProgress';
import GlassCard from '@/components/GlassCard';
import LocationsPreview from '@/components/landing/LocationsPreview';
import CryptoMatrix from '@/components/CryptoMatrix';

const BitCashLanding = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const containerRef = useRef(null);

  // Updated color scheme using new BitDash v3 colors
  const primaryColor = useColorModeValue('brand.bitcash.500', 'brand.bitcash.600');
  const bgGradient = useColorModeValue(
    'linear(to-b, green.50, white)',
    'linear(to-b, gray.900, black)'
  );
  const glassCardBg = useColorModeValue('whiteAlpha.900', 'whiteAlpha.100');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothScroll = useSpring(scrollYProgress, {
    mass: 0.1,
    stiffness: 100,
    damping: 20
  });

  const heroScale = useTransform(smoothScroll, [0, 1], [1, 0.92]);

  // Enterprise solutions with updated styling
  const enterpriseSolutions = [
    {
      icon: FaServer,
      title: 'bitcash.solutions.scalable.title',
      description: 'bitcash.solutions.scalable.description',
      technical: 'bitcash.solutions.scalable.technical',
      color: 'brand.bitcash.500'
    },
    {
      icon: FaShieldAlt,
      title: 'bitcash.solutions.security.title',
      description: 'bitcash.solutions.security.description',
      technical: 'bitcash.solutions.security.technical',
      color: 'brand.bitcash.600'
    },
    {
      icon: FaCode,
      title: 'bitcash.solutions.api.title',
      description: 'bitcash.solutions.api.description',
      technical: 'bitcash.solutions.api.technical',
      color: 'brand.bitcash.700'
    }
  ];

  // Updated features with new brand colors
  const sectionFeatures = [
    {
      icon: FaGlobe,
      title: 'bitcash.features.global.title',
      description: 'bitcash.features.global.description',
      color: 'brand.bitcash.400'
    },
    {
      icon: FaLock,
      title: 'bitcash.features.security.title',
      description: 'bitcash.features.security.description',
      color: 'brand.bitcash.500'
    },
    {
      icon: FaBitcoin,
      title: 'bitcash.features.crypto.title',
      description: 'bitcash.features.crypto.description',
      color: 'brand.bitcash.600'
    },
    {
      icon: FaIndustry,
      title: 'bitcash.features.enterprise.title',
      description: 'bitcash.features.enterprise.description',
      color: 'brand.bitcash.700'
    }
  ];

  return (
    <Box 
      ref={containerRef} 
      bg={bgGradient} 
      minH="100vh"
      overflow="hidden"
    >
      <Head>
        <title>BitCash</title>
        <meta name="description" content="Experience the future of digital payments with BitCash" />
      </Head>

      <ScrollProgress scrollYProgress={smoothScroll} color="brand.bitcash.500" />

      <Container maxW="8xl" px={{ base: 4, lg: 0 }}>
        {/* Hero Section */}
        <ParallaxSection>
          <motion.div style={{ scale: heroScale }}>
            <Flex 
              direction="column" 
              align="center" 
              textAlign="center" 
              py={{ base: 20, md: 28 }}
              position="relative"
            >

              <VStack spacing={8} maxW="4xl">
                <GradientHeading 
                  fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
                  bgGradient="linear(to-r, brand.bitcash.500, brand.bitcash.700)"
                >
                  {t('bitcash.hero.title')}
                </GradientHeading>

                <Text 
                  fontSize={{ base: 'xl', md: '2xl' }} 
                  color={useColorModeValue('gray.600', 'gray.300')}
                  maxW="3xl"
                  lineHeight="tall"
                >
                  {t('bitcash.hero.subtitle')}
                </Text>

                <HStack spacing={6} pt={8}>
                  <Button
                    size="lg"
                    variant="bitcash-solid"
                    px={8}
                    h={14}
                    fontSize="lg"
                    rightIcon={<ArrowRight weight="bold" />}
                    _hover={{ bg: 'green.600' }}
                    onClick={() => router.push('/signup')}
                  >
                    {t('bitcash.hero.cta.signup')}
                  </Button>
                  <Button
                    size="lg"
                    variant="bitcash-outline"
                    borderColor="brand.bitcash.600"
                    color="brand.bitcash.500"
                    px={8}
                    h={14}
                    fontSize="lg"
                    _hover={{ bg: 'green.50' }}
                    onClick={() => router.push('/enterprise')}
                  >
                    {t('bitcash.hero.cta.enterprise')}
                  </Button>
                </HStack>
              </VStack>

              {/* Updated CryptoMatrix Card */}
              <Box mt={16} w="full" maxW="6xl">
                <GlassCard 
                  p={8} 
                  borderRadius="3xl"
                  bg={glassCardBg}
                  borderColor="brand.bitcash"
                  borderWidth={2}
                  boxShadow="xl"
                >
                  <CryptoMatrix 
                    columns={{ base: 3, md: 6 }} 
                    spacing={{ base: 4, md: 6 }} 
                  />
                </GlassCard>
              </Box>
            </Flex>
          </motion.div>
        </ParallaxSection>

        {/* Features Grid with Animation */}
        <ParallaxSection>
          <SimpleGrid 
            columns={{ base: 1, md: 2, lg: 4 }} 
            spacing={8} 
            py={{ base: 20, md: 28 }}
          >
            {sectionFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
              >
                <GlassCard 
                  p={8} 
                  h="full"
                  bg={glassCardBg}
                  borderColor={feature.color}
                  borderWidth={2}
                  _hover={{ 
                    transform: 'translateY(-5px)',
                    boxShadow: 'xl'
                  }}
                  transition="all 0.3s ease"
                >
                  <VStack align="start" spacing={6}>
                    <Icon 
                      as={feature.icon} 
                      boxSize={12} 
                      color={feature.color}
                    />
                    <Heading size="md">{t(feature.title)}</Heading>
                    <Text color={useColorModeValue('gray.600', 'gray.300')}>
                      {t(feature.description)}
                    </Text>
                  </VStack>
                </GlassCard>
              </motion.div>
            ))}
          </SimpleGrid>
        </ParallaxSection>

        {/* Updated Locations Preview */}
        <ParallaxSection>
          <Box 
            bg={glassCardBg}
            borderRadius="3xl"
            overflow="hidden"
            height="1200px"
            borderColor="bitcash-solid"
            borderWidth={2}
            boxShadow="2xl"
          >
            <LocationsPreview />
          </Box>
        </ParallaxSection>

        {/* Enterprise Solutions with New Styling */}
        <ParallaxSection>
          <VStack spacing={16} py={28} align="center">
            <VStack textAlign="center" maxW="3xl" spacing={6}>
              <GradientHeading 
                size="2xl"
                bgGradient="linear(to-r, brand.bitcash.500, brand.bitcash.700)"
              >
                {t('bitcash.enterprise.title')}
              </GradientHeading>
              <Text 
                fontSize="xl" 
                color={useColorModeValue('gray.600', 'gray.300')}
              >
                {t('bitcash.enterprise.subtitle')}
              </Text>
            </VStack>

            <SimpleGrid 
              columns={{ base: 1, md: 3 }} 
              spacing={8} 
              w="full"
            >
              {enterpriseSolutions.map((solution, index) => (
                <GlassCard 
                  key={index} 
                  p={8}
                  bg={glassCardBg}
                  borderColor={solution.color}
                  borderWidth={2}
                  _hover={{ 
                    transform: 'translateY(-5px)',
                    boxShadow: 'xl'
                  }}
                  transition="all 0.3s ease"
                >
                  <VStack spacing={6} align="start">
                    <Icon 
                      as={solution.icon} 
                      boxSize={12} 
                      color={solution.color} 
                    />
                    <Heading size="md">{t(solution.title)}</Heading>
                    <Text>{t(solution.description)}</Text>
                    <Code 
                      colorScheme="green" 
                      p={4} 
                      borderRadius="xl"
                      fontSize="sm"
                      w="full"
                    >
                      {t(solution.technical)}
                    </Code>
                  </VStack>
                </GlassCard>
              ))}
            </SimpleGrid>
          </VStack>
        </ParallaxSection>

        {/* Call to Action Section */}
        <ParallaxSection>
          <Box py={20}>
            <GlassCard 
              p={12}
              bg={glassCardBg}
              borderColor="brand.bitcash"
              borderWidth={2}
              textAlign="center"
            >
              <VStack spacing={8}>
                <Heading size="xl">
                  {t('bitcash.cta.title')}
                </Heading>
                <Text fontSize="xl" maxW="2xl">
                  {t('bitcash.cta.description')}
                </Text>
                <Button
                  size="lg"
                  variant="bitcash-solid"
                  px={12}
                  h={16}
                  fontSize="xl"
                  rightIcon={<ArrowRight weight="bold" />}
                  _hover={{ bg: 'green.600' }}
                  onClick={() => router.push('/get-started')}
                >
                  {t('bitcash.cta.button')}
                </Button>
              </VStack>
            </GlassCard>
          </Box>
        </ParallaxSection>
      </Container>
    </Box>
  );
};

export default BitCashLanding;