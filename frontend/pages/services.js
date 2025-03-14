// pages/services.js
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Button,
  useColorMode,
  useBreakpointValue,
  Flex,
  Spinner,
  Grid,
  GridItem,
  AspectRatio,
  IconButton,
  Portal,
  SimpleGrid,
  Divider,
  Badge
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useInView } from 'react-intersection-observer';
import { ArrowUpRight, ChevronRight, Shield, CheckCircle, Globe, FileText, Key, Lock } from 'lucide-react';
import { FaMoneyBillWave, FaChartLine, FaUniversity, FaExchangeAlt, FaShieldAlt, FaGlobe, FaCheckCircle } from 'react-icons/fa';
import Layout from '@/components/Layout';
import Head from 'next/head';

const platforms = [
  {
    id: 'adfaaly',
    title: 'Adfaaly',
    tagline: 'Digital payment solution that fits your needs.',
    description: 'Experience seamless cross-border transactions with our institutional-grade payment infrastructure designed for businesses and consumers globally.',
    image: '/adfaaly.png',
    imageAr: '/adfaaly-ar.png',
    color: 'brand.adfaaly.500',
    stats: [
      { value: '$2.5B+', label: 'Monthly Volume' },
      { value: '99.99%', label: 'Uptime' },
      { value: '180+', label: 'Countries' }
    ],
    features: [
      'Instant Global Transfers',
      'Multi-Currency Support',
      'Enterprise APIs',
      'Advanced Fraud Protection'
    ]
  },
  {
    id: 'bsoraa',
    title: 'Bsoraa',
    tagline: 'Your orders, instantly delivered.',
    description: 'Order your favourite cravings, your late night snacks or your montly grocery run and get it delivered instantly.',
    image: '/bsoraa.png',
    imageAr: '/bsoraa-ar.png',
    color: 'brand.bsoraa.500',
    stats: [
      { value: '80+', label: 'Currency Pairs' },
      { value: '50+', label: 'Cryptocurrencies' },
      { value: '0.1', label: 'Min Spread (pips)' }
    ],
    features: [
      'Institutional Liquidity',
      'Advanced Trading Tools',
      'Multiple Account Types',
      'API Trading Solutions'
    ]
  }
];

const licenses = [
  {
    authority: 'Financial Services Authority (FSA)',
    country: 'Saint Vincent and the Grenadines',
    licenseNumber: 'License No. 26898 BC 2022',
    scope: 'Trading services, payment processing, financial technology solutions',
    icon: FaShieldAlt
  },
  {
    authority: 'Mwali International Services Authority (MISA)',
    country: 'Comoros',
    licenseNumber: 'Certificate No. C23-027-59721',
    scope: 'Forex trading, cryptocurrency exchange, investment services',
    icon: FaGlobe
  }
];

const LicenseSection = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const { t } = useTranslation();
  
  return (
    <Box
      py={20}
      borderRadius="xl"
      mt={16}
      mb={16}
    >
      <Container maxW="8xl" px={{ base: 4, lg: 8 }}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Badge 
              colorScheme="blue" 
              fontSize="md" 
              px={4} 
              py={2} 
              borderRadius="full"
            >
              {t('fullyRegulated', 'Fully Regulated')}
            </Badge>
            
            <Heading
              fontSize={{ base: '3xl', md: '5xl' }}
              bgClip="text"
              letterSpacing="tight"
            >
              {t('regulatory.title', 'Licensed & Regulated Globally')}
            </Heading>
            
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color={isDark ? 'whiteAlpha.700' : 'blackAlpha.700'}
              maxW="3xl"
            >
              {t('regulatory.description', 'BitDash operates under strict regulatory oversight to ensure the highest standards of security, compliance, and transparency for our clients worldwide.')}
            </Text>
          </VStack>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
            {licenses.map((license, idx) => (
              <Box
                key={idx}
                p={8}
                borderRadius="xl"
                boxShadow="lg"
                borderWidth="1px"
                borderColor={isDark ? 'whiteAlpha.200' : 'gray.100'}
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-5px)',
                  boxShadow: '2xl',
                }}
              >
                <VStack spacing={6} align="start">
                  <Flex
                    w="60px"
                    h="60px"
                    borderRadius="full"
                    align="center"
                    justify="center"
                  >
                    <Icon as={license.icon} color="blue.500" boxSize={6} />
                  </Flex>
                  
                  <VStack spacing={1} align="start">
                    <Heading size="md" color={isDark ? 'white' : 'gray.800'}>
                      {license.authority}
                    </Heading>
                    <Text color="blue.500" fontWeight="bold">
                      {license.country}
                    </Text>
                  </VStack>
                  
                  <Divider />
                  
                  <VStack spacing={4} align="start" w="full">
                    <HStack>
                      <Icon as={FileText} boxSize={5} color="blue.500" />
                      <Text fontWeight="medium">{license.licenseNumber}</Text>
                    </HStack>
                    
                    <HStack align="start">
                      <Icon as={CheckCircle} boxSize={5} color="green.500" mt={1} />
                      <Text>{license.scope}</Text>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
          
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} w="full">
            {[
              { icon: Shield, text: 'Segregated Client Funds', color: 'blue.500' },
              { icon: Key, text: 'Enterprise-Grade Security', color: 'purple.500' },
              { icon: Globe, text: 'Global Compliance', color: 'green.500' },
              { icon: Lock, text: 'AML/KYC Protocols', color: 'orange.500' }
            ].map((item, idx) => (
              <HStack
                key={idx}
                p={4}
                borderRadius="lg"
                boxShadow="md"
                spacing={3}
              >
                <Icon as={item.icon} color={item.color} boxSize={5} />
                <Text fontWeight="medium" fontSize="sm">{item.text}</Text>
              </HStack>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

const PlatformShowcase = ({ platform, index, isRTL }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const containerRef = useRef(null);
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  // Alternate layout for better mobile experience
  const isReversed = index % 2 === 1;

  // Map platform IDs to appropriate icons
  const platformIcons = {
    cash: FaMoneyBillWave,
    fund: FaChartLine,
    stock: FaUniversity,
    trade: FaExchangeAlt
  };

  return (
    <Grid
      templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
      gap={{ base: 8, lg: 16 }}
      py={{ base: 16, lg: 32 }}
      px={{ base: 4, lg: 8 }}
      position="relative"
      ref={containerRef}
    >
      {/* Image Section */}
      <GridItem 
        order={{ base: 1, lg: isReversed ? 2 : 1 }}
        position="relative"
        w="full"
        h={{ base: "200px", md: "400px", lg: "300px" }}
        overflow="hidden"
        borderRadius={{ base: "24px", lg: "40px" }}
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
        >
          <Image
            src={isRTL ? platform.imageAr : platform.image}
            alt={platform.title}
            width={1800}
            height={558}
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            priority={index === 0}
          />
          <Box
            position="absolute"
            inset="0"
            transition="opacity 0.3s"
            _groupHover={{ opacity: 0.7 }}
          />
        </Box>
      </GridItem>

      {/* Content Section */}
      <GridItem 
        order={{ base: 2, lg: isReversed ? 1 : 2 }}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        p={{ base: 4, lg: 8 }}
      >
        <VStack 
          align="start" 
          spacing={{ base: 6, lg: 8 }}
        >
          <Box>
            <HStack spacing={3} mb={2}>
              <Icon 
                as={platformIcons[platform.id]} 
                color={platform.color} 
                boxSize={6} 
              />
              <Text 
                fontSize={{ base: "sm", lg: "md" }}
                textTransform="uppercase"
                letterSpacing="wider"
                color={platform.color}
                fontWeight="bold"
              >
                {platform.tagline}
              </Text>
            </HStack>
            
            <Heading 
              fontSize={{ base: "4xl", lg: "6xl" }}
              bgClip="text"
              letterSpacing="tight"
              mb={4}
            >
              {platform.title}
            </Heading>

            <Text 
              fontSize={{ base: "lg", lg: "xl" }}
              color={isDark ? 'whiteAlpha.800' : 'blackAlpha.800'}
              lineHeight="tall"
            >
              {platform.description}
            </Text>
          </Box>

          {/* Stats Grid */}
          <SimpleGrid 
            columns={3} 
            spacing={{ base: 4, lg: 8 }} 
            w="full"
            py={4}
          >
            {platform.stats.map((stat, idx) => (
              <Box key={idx}>
                <Text 
                  fontSize={{ base: "2xl", lg: "3xl" }}
                  fontWeight="bold"
                  color={platform.color}
                >
                  {stat.value}
                </Text>
                <Text 
                  fontSize={{ base: "xs", lg: "sm" }}
                  color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                >
                  {stat.label}
                </Text>
              </Box>
            ))}
          </SimpleGrid>

          {/* Features */}
          <SimpleGrid 
            columns={{ base: 1, md: 2 }}
            spacing={4} 
            w="full"
          >
            {platform.features.map((feature, idx) => (
              <HStack 
                key={idx}
                spacing={4}
                p={4}
                borderWidth="1px"
                borderColor={isDark ? 'whiteAlpha.200' : 'blackAlpha.200'}
                borderRadius="xl"
                transition="all 0.3s"
                _hover={{
                  borderColor: platform.color,
                  transform: 'translateX(8px)',
                }}
              >
                <Icon as={FaCheckCircle} color={platform.color} />
                <Text>{feature}</Text>
              </HStack>
            ))}
          </SimpleGrid>

          <Button
            rightIcon={<ArrowUpRight />}
            variant="outline"
            size="lg"
            borderColor={platform.color}
            color={platform.color}
            _hover={{
              bg: platform.color,
              color: 'white',
              transform: 'translateY(-2px)'
            }}
            _active={{
              transform: 'translateY(0)'
            }}
            transition="all 0.2s"
          >
            {t('learnMore')}
          </Button>
        </VStack>
      </GridItem>
    </Grid>
  );
};

const Services = () => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const router = useRouter();
  const isRTL = router.locale === 'ar';

  return (
    <>
    <Head>
      <title>{t('services', 'Financial Services')}</title>
    </Head>
    <Layout>
    <Box
      position="relative"
      overflow="hidden"
    >
      {/* Hero Section */}
      <Box
        h="80vh"
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Container maxW="8xl" px={{ base: 4, lg: 8 }}>
          <VStack spacing={8} alignItems="center" textAlign="center">
            <Badge 
              colorScheme="blue" 
              fontSize="md" 
              px={4} 
              py={2} 
              borderRadius="full"
            >
              {t('svgAndComoros', 'SVG & Comoros Licensed')}
            </Badge>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Heading
                fontSize={{ base: '4xl', md: '7xl' }}
                bgGradient="linear(to-r, brand.adfaaly.500, brand.bsoraa.500)"
                bgClip="text"
                letterSpacing="tight"
                lineHeight="shorter"
              >
                {t('services.title', 'Regulated Financial Technology Solutions')}
              </Heading>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <Text
                fontSize={{ base: 'lg', md: '2xl' }}
                color={isDark ? 'whiteAlpha.700' : 'blackAlpha.700'}
                maxW="3xl"
              >
                {t('services.description', 'Access institutional-grade financial services for retail and institutional clients. Trade forex, cryptocurrencies, stocks, commodities, and more on our regulated platforms.')}
              </Text>
            </motion.div>
            
            <HStack spacing={4} pt={6}>
              <Button
                size="lg"
                colorScheme="blue"
                px={8}
                height="60px"
                fontSize="lg"
                fontWeight="bold"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg'
                }}
                onClick={() => router.push('/signup')}
              >
                {t('openAccount', 'Open Account')}
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                colorScheme="blue"
                px={8}
                height="60px"
                fontSize="lg"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg'
                }}
                onClick={() => router.push('/contact')}
              >
                {t('contactUs', 'Contact Us')}
              </Button>
            </HStack>
          </VStack>
        </Container>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <VStack spacing={2}>
            <Text fontSize="sm" color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}>
              {t('scrollToExplore', 'Scroll to Explore')}
            </Text>
            <Box
              h="40px"
              w="24px"
              borderRadius="full"
              border="2px solid"
              borderColor={isDark ? 'whiteAlpha.200' : 'blackAlpha.200'}
              position="relative"
            >
              <motion.div
                animate={{
                  y: [0, 12, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isDark ? 'white' : 'black',
                  position: 'absolute',
                  top: '6px',
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
              />
            </Box>
          </VStack>
        </motion.div>
      </Box>

      {/* Licensing Section */}
      <Container maxW="8xl" px={{ base: 4, lg: 8 }}>
        <LicenseSection />
      </Container>

      {/* Platforms Showcase */}
      <Container maxW="8xl" px={{ base: 4, lg: 8 }}>
        {platforms.map((platform, index) => (
          <PlatformShowcase
            key={platform.id}
            platform={platform}
            index={index}
            isRTL={isRTL}
          />
        ))}
      </Container>
    
      {/* Final CTA Section */}
      <Box py={20}>
        <Container maxW="6xl" textAlign="center">
          <VStack spacing={8}>
            <Heading
              fontSize={{ base: '3xl', md: '4xl' }}
              bgClip="text"
            >
              {t('readyToStart', 'Ready to Elevate Your Financial Experience?')}
            </Heading>
            
            <Text 
              fontSize="lg" 
              color={isDark ? 'gray.300' : 'gray.700'} 
              maxW="3xl"
            >
              {t('ctaDescription', 'Join thousands of traders and investors who trust our regulated financial platforms. Start today and access global markets with confidence.')}
            </Text>
            
            <HStack spacing={4}>
              <Button
                size="lg"
                colorScheme="blue"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'xl'
                }}
                px={8}
                height="60px"
                fontSize="lg"
                onClick={() => router.push('/signup')}
              >
                {t('createAccount', 'Create Account')}
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                colorScheme="blue"
                px={8}
                height="60px"
                fontSize="lg"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'md',
                }}
                onClick={() => router.push('/contact')}
              >
                {t('scheduleDemo', 'Schedule Demo')}
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </Box>
    </Layout>
    </>
  );
};

export default Services;