import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
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
  Grid,
  GridItem,
  Image,
  AspectRatio,
  Divider,
  Link,
  useBreakpointValue,
  chakra,
  Center,
  List,
  ListItem,
  ListIcon,
  IconButton,
} from '@chakra-ui/react';
import { 
  FaMoneyBillWave,
  FaBolt,
  FaStore,
  FaGlobe,
  FaShieldAlt,
  FaMobileAlt,
  FaQrcode,
  FaChartLine,
  FaHandHoldingUsd,
  FaUserTie,
  FaMapMarkerAlt,
  FaCreditCard,
  FaLaptop,
  FaUserCheck,
  FaCheckCircle,
  FaUniversity,
  FaTruck,
  FaWallet,
  FaPhoneAlt,
  FaClock,
  FaIdCard,
  FaFingerprint,
  FaLock,
  FaUserShield,
  FaKey,
  FaStar,
  FaStarHalfAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaApple,
  FaGooglePlay,
} from 'react-icons/fa';
import CryptoMatrix from '@/components/CryptoMatrix';
import AgentLocator from '@/components/tazdani/customer/AgentLocator';

const TazdaniLanding = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const containerRef = useRef(null);
  const MotionBox = motion(Box);
  const [activeSection, setActiveSection] = useState('customer');
  const subtleBg = useColorModeValue('gray.50', 'gray.900');
  
  // Get current locale
  const { locale } = router;
  const isRTL = locale === 'ar';
  
  // Color schemes and styling
  const bgGradient = useColorModeValue(
    'linear(to-b, green.50, white)',
    'linear(to-b, gray.900, black)'
  );
  
  const glassCardBg = useColorModeValue('whiteAlpha.900', 'whiteAlpha.100');
  const accentColor = 'brand.tazdani.500';
  const secondaryAccent = 'brand.tazdani.400';

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(
    useSpring(scrollYProgress, {
      mass: 0.1,
      stiffness: 100,
      damping: 20
    }),
    [0, 1],
    [1, 0.92]
  );

  // Features section data
  const features = [
    {
      icon: FaBolt,
      title: 'features.instant.title',
      description: 'features.instant.description',
      color: 'brand.tazdani.400'
    },
    {
      icon: FaStore,
      title: 'features.business.title',
      description: 'features.business.description',
      color: 'brand.tazdani.500'
    },
    {
      icon: FaQrcode,
      title: 'features.qr.title',
      description: 'features.qr.description',
      color: 'brand.tazdani.600'
    },
    {
      icon: FaMobileAlt,
      title: 'features.mobile.title',
      description: 'features.mobile.description',
      color: 'brand.tazdani.700'
    }
  ];

  // Solution cards data
  const solutions = [
    {
      icon: FaMoneyBillWave,
      title: 'solutions.transfers.title',
      description: 'solutions.transfers.description',
      technical: 'solutions.transfers.technical',
      color: 'brand.tazdani.500'
    },
    {
      icon: FaShieldAlt,
      title: 'solutions.security.title',
      description: 'solutions.security.description',
      technical: 'solutions.security.technical',
      color: 'brand.tazdani.600'
    },
    {
      icon: FaChartLine,
      title: 'solutions.analytics.title',
      description: 'solutions.analytics.description',
      technical: 'solutions.analytics.technical',
      color: 'brand.tazdani.700'
    }
  ];

  // Agent network data
  const agentFeatures = [
    {
      icon: FaMapMarkerAlt,
      title: 'agent.network.title',
      description: 'agent.network.description',
      color: 'brand.tazdani.500'
    },
    {
      icon: FaUserCheck,
      title: 'agent.verified.title',
      description: 'agent.verified.description',
      color: 'brand.tazdani.600'
    },
    {
      icon: FaHandHoldingUsd,
      title: 'agent.cash.title',
      description: 'agent.cash.description',
      color: 'brand.tazdani.700'
    }
  ];

  // Merchant solutions data
  const merchantFeatures = [
    {
      icon: FaQrcode,
      title: 'merchant.qr.title',
      description: 'merchant.qr.description',
      color: 'brand.tazdani.500'
    },
    {
      icon: FaLaptop,
      title: 'merchant.online.title',
      description: 'merchant.online.description',
      color: 'brand.tazdani.600'
    },
    {
      icon: FaChartLine,
      title: 'merchant.analytics.title',
      description: 'merchant.analytics.description',
      color: 'brand.tazdani.700'
    }
  ];

  // Customer benefits data
  const customerBenefits = [
    {
      icon: FaShieldAlt,
      title: 'customer.security.title',
      description: 'customer.security.description'
    },
    {
      icon: FaBolt,
      title: 'customer.instant.title',
      description: 'customer.instant.description'
    },
    {
      icon: FaWallet,
      title: 'customer.fees.title',
      description: 'customer.fees.description'
    },
    {
      icon: FaGlobe,
      title: 'customer.access.title',
      description: 'customer.access.description'
    }
  ];

  // Animations
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  // Helper function for account type selection
  const handleAccountTypeChange = (type) => {
    setActiveSection(type);
  };

  // Render account type section based on active selection
  const renderAccountSection = () => {
    switch(activeSection) {
      case 'customer':
        return (
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8} py={12}>
            <GridItem>
              <VStack align="flex-start" spacing={8}>
                <Heading 
                  size="xl"
                  bgGradient="linear(to-r, brand.tazdani.500, brand.tazdani.700)"
                  bgClip="text"
                >
                  {t('customer.heading')}
                </Heading>
                <Text fontSize="lg">
                  {t('customer.subheading')}
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                  {customerBenefits.map((benefit, i) => (
                    <HStack key={i} align="flex-start" spacing={4}>
                      <Icon as={benefit.icon} boxSize={6} color={accentColor} mt={1} />
                      <VStack align="flex-start" spacing={1}>
                        <Text fontWeight="bold">{t(benefit.title)}</Text>
                        <Text fontSize="sm">{t(benefit.description)}</Text>
                      </VStack>
                    </HStack>
                  ))}
                </SimpleGrid>
                <Button 
                  size="lg" 
                  colorScheme="green" 
                  px={8}
                  onClick={() => router.push('/signup')}
                >
                  {t('customer.cta')}
                </Button>
              </VStack>
            </GridItem>
            <GridItem>
              <AspectRatio ratio={1}>
                <Image src="/images/trader.png" alt={t('customer.image.alt')} objectFit="cover" />
              </AspectRatio>
            </GridItem>
          </Grid>
        );
      case 'merchant':
        return (
          <VStack spacing={12} py={12}>
            <VStack spacing={4} textAlign="center" maxW="3xl" mx="auto">
              <Heading 
                size="xl"
                bgGradient="linear(to-r, brand.tazdani.500, brand.tazdani.700)"
                bgClip="text"
              >
                {t('merchant.heading')}
              </Heading>
              <Text fontSize="lg">
                {t('merchant.subheading')}
              </Text>
            </VStack>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              {merchantFeatures.map((feature, index) => (
                <Box
                  key={index}
                  p={8}
                  h="full"
                  bg={glassCardBg}
                  borderRadius="xl"
                  borderColor={feature.color}
                  borderWidth={2}
                  _hover={{
                    transform: 'translateY(-5px)',
                    boxShadow: 'xl'
                  }}
                  transition="all 0.3s ease"
                >
                  <VStack align="start" spacing={6}>
                    <Icon as={feature.icon} boxSize={12} color={feature.color} />
                    <Heading size="md">{t(feature.title)}</Heading>
                    <Text>{t(feature.description)}</Text>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
            
            <Grid 
              templateColumns={{ base: "1fr", md: "2fr 1fr" }} 
              gap={8} 
              bg={glassCardBg}
              p={8}
              borderRadius="xl"
              boxShadow="lg"
              w="full"
            >
              <GridItem>
                <VStack align="flex-start" spacing={4}>
                  <Heading size="lg">{t('merchant.ready')}</Heading>
                  <Text>
                    {t('merchant.ready.description')}
                  </Text>
                  <List spacing={3} mt={4}>
                    <ListItem>
                      <ListIcon as={FaCheckCircle} color={accentColor} />
                      {t('merchant.benefit.fees')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheckCircle} color={accentColor} />
                      {t('merchant.benefit.settlement')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheckCircle} color={accentColor} />
                      {t('merchant.benefit.support')}
                    </ListItem>
                  </List>
                </VStack>
              </GridItem>
              <GridItem>
                <Center h="full">
                  <Button 
                    size="lg" 
                    colorScheme="green" 
                    px={8}
                    onClick={() => router.push('/merchants')}
                  >
                    {t('merchant.cta')}
                  </Button>
                </Center>
              </GridItem>
            </Grid>
          </VStack>
        );
      case 'agent':
        return (
          <VStack spacing={12} py={12}>
            <VStack spacing={4} textAlign="center" maxW="3xl" mx="auto">
              <Heading 
                size="xl"
                bgGradient="linear(to-r, brand.tazdani.500, brand.tazdani.700)"
                bgClip="text"
              >
                {t('agent.heading')}
              </Heading>
              <Text fontSize="lg">
                {t('agent.subheading')}
              </Text>
            </VStack>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              {agentFeatures.map((feature, index) => (
                <Box
                  key={index}
                  p={8}
                  h="full"
                  bg={glassCardBg}
                  borderRadius="xl"
                  borderColor={feature.color}
                  borderWidth={2}
                  _hover={{
                    transform: 'translateY(-5px)',
                    boxShadow: 'xl'
                  }}
                  transition="all 0.3s ease"
                >
                  <VStack align="start" spacing={6}>
                    <Icon as={feature.icon} boxSize={12} color={feature.color} />
                    <Heading size="md">{t(feature.title)}</Heading>
                    <Text>{t(feature.description)}</Text>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
            
            <Flex 
              direction={{ base: "column", md: "row" }}
              bg={glassCardBg}
              p={8}
              borderRadius="xl"
              boxShadow="lg"
              w="full"
              gap={8}
            >
              <VStack flex="2" align="flex-start" spacing={4}>
                <Heading size="lg">{t('agent.benefits')}</Heading>
                <Text>
                  {t('agent.benefits.description')}
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full" mt={4}>
                  <HStack align="center">
                    <Icon as={FaCheckCircle} color={accentColor} />
                    <Text>{t('agent.benefit.commission')}</Text>
                  </HStack>
                  <HStack align="center">
                    <Icon as={FaCheckCircle} color={accentColor} />
                    <Text>{t('agent.benefit.traffic')}</Text>
                  </HStack>
                  <HStack align="center">
                    <Icon as={FaCheckCircle} color={accentColor} />
                    <Text>{t('agent.benefit.equipment')}</Text>
                  </HStack>
                  <HStack align="center">
                    <Icon as={FaCheckCircle} color={accentColor} />
                    <Text>{t('agent.benefit.payments')}</Text>
                  </HStack>
                </SimpleGrid>
              </VStack>
              <Center flex="1">
                <Button 
                  size="lg" 
                  colorScheme="green" 
                  px={8}
                  onClick={() => router.push('/agents')}
                >
                  {t('agent.cta')}
                </Button>
              </Center>
            </Flex>
          </VStack>
        );
      default:
        return null;
    }
  };

  // Stats data
  const stats = [
    { label: 'stats.speed.label', value: 'stats.speed.value', icon: FaBolt },
    { label: 'stats.locations.label', value: 'stats.locations.value', icon: FaMapMarkerAlt },
    { label: 'stats.users.label', value: 'stats.users.value', icon: FaUserCheck },
    { label: 'stats.merchants.label', value: 'stats.merchants.value', icon: FaStore }
  ];

  return (
    <Box ref={containerRef} bg={subtleBg} overflow="hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <Container maxW="8xl" pt={8}>
        <motion.div style={{ scale: heroScale }}>
          <Flex
            direction="column"
            align="center"
            textAlign="center"
            position="relative"
          >
            <VStack spacing={8} maxW="4xl">
              <Heading
                fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
                bgGradient="linear(to-r, brand.tazdani.500, brand.tazdani.700)"
                bgClip="text"
                letterSpacing="tight"
                fontWeight="extrabold"
              >
                {t('tazdani.hero.title')}
              </Heading>
              
              <Text fontSize={{ base: 'xl', md: '2xl' }} maxW="3xl" color={useColorModeValue('gray.600', 'gray.300')}>
                {t('tazdani.hero.description')}
              </Text>

              <HStack spacing={6} pt={2} flexWrap="wrap" justify="center">
                <Button
                  colorScheme="green"
                  size="lg"
                  h={14}
                  px={8}
                  fontSize="md"
                  fontWeight="bold"
                  onClick={() => router.push('/signup')}
                  boxShadow="md"
                >
                  {t('tazdani.hero.cta.primary')}
                </Button>
                <Button
                  variant="outline"
                  colorScheme="green"
                  size="lg"
                  h={14}
                  px={8}
                  fontSize="md"
                  fontWeight="bold"
                  onClick={() => router.push('/demo')}
                >
                  {t('tazdani.hero.cta.secondary')}
                </Button>
              </HStack>
            </VStack>

            {/* Stats Section */}
            <Box
              mt={16}
              w="full"
              maxW="6xl"
              p={8}
              borderRadius="3xl"
              bg={glassCardBg}
              borderColor="brand.tazdani.500"
              borderWidth={2}
              boxShadow="xl"
            >
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
                {stats.map((stat, index) => (
                  <VStack
                    key={index}
                    p={6}
                    borderRadius="xl"
                    bg={useColorModeValue('white', 'gray.800')}
                    spacing={4}
                  >
                    <Icon as={stat.icon} boxSize={8} color="brand.tazdani.500" />
                    <Text fontWeight="bold">{t(stat.label)}</Text>
                    <Text fontSize="3xl" fontWeight="bold" color="brand.tazdani.500">
                      {t(stat.value)}
                    </Text>
                  </VStack>
                ))}
              </SimpleGrid>
            </Box>
          </Flex>
        </motion.div>

        {/* How It Works Section */}
        <Box pt={8} bg={subtleBg}>
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center" maxW="3xl" mx="auto">
              <Text 
                fontWeight="bold" 
                textTransform="uppercase" 
                letterSpacing="wider"
                color={accentColor}
              >
                {t('howItWorks.subtitle')}
              </Text>
              <Heading size="xl">{t('howItWorks.title')}</Heading>
              <Text fontSize="lg">
                {t('howItWorks.description')}
              </Text>
            </VStack>

            <GridItem>
                    <MotionBox
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <VStack spacing={6} align={{ base: "center", lg: "flex-start" }} textAlign={{ base: "center", lg: "left" }}>
                        <Image 
                          src="/images/money-transfer.png" 
                          alt={t('tazdani.imageAlt', 'tazdani Payment App Screenshot')}
                          width={{ base: "500px", md: "800px" }}
                          as={motion.img}
                          animate={{ scale: [1, 1.03, 1] }}
                          transition={{ repeat: Infinity, duration: 3 }}
                        />        
                      </VStack>
                    </MotionBox>
                  </GridItem>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              <Box 
                bg={glassCardBg} 
                p={8} 
                borderRadius="xl" 
                borderLeftWidth="4px" 
                borderLeftColor={accentColor}
                position="relative"
              >
                <Box
                  position="absolute"
                  right={4}
                  bg={accentColor}
                  color="white"
                  width="36px"
                  height="36px"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="bold"
                >
                  1
                </Box>
                <VStack align="start" spacing={4}>
                  <Heading size="md">{t('howItWorks.step1.title')}</Heading>
                  <Text>
                    {t('howItWorks.step1.description')}
                  </Text>
                </VStack>
              </Box>
              
              <Box 
                bg={glassCardBg} 
                p={8} 
                borderRadius="xl" 
                borderLeftWidth="4px" 
                borderLeftColor={accentColor}
                position="relative"
              >
                <Box
                  position="absolute"
                  top={4}
                  right={4}
                  bg={accentColor}
                  color="white"
                  width="36px"
                  height="36px"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="bold"
                >
                  2
                </Box>
                <VStack align="start" spacing={4}>
                  <Heading size="md">{t('howItWorks.step2.title')}</Heading>
                  <Text>
                    {t('howItWorks.step2.description')}
                  </Text>
                </VStack>
              </Box>
              
              <Box 
                bg={glassCardBg} 
                p={8} 
                borderRadius="xl" 
                borderLeftWidth="4px" 
                borderLeftColor={accentColor}
                position="relative"
              >
                <Box
                  position="absolute"
                  top={4}
                  right={4}
                  bg={accentColor}
                  color="white"
                  width="36px"
                  height="36px"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="bold"
                >
                  3
                </Box>
                <VStack align="start" spacing={4}>
                  <Heading size="md">{t('howItWorks.step3.title')}</Heading>
                  <Text>
                    {t('howItWorks.step3.description')}
                  </Text>
                </VStack>
              </Box>
            </SimpleGrid>
            
            <Box
              color="white"
              borderRadius="xl"
              p={8}
              w="full"
            >
              <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8} alignItems="center">
                <GridItem>
                  <VStack align={{ base: "center", md: "flex-start" }} spacing={4}>
                    <Heading size="lg">{t('howItWorks.cta.title')}</Heading>
                    <Text fontSize="lg">{t('howItWorks.cta.description')}</Text>
                  </VStack>
                </GridItem>
                <GridItem>
                  <Center>
                    <Button 
                      px={8}
                      variant="tazdani-outline"
                      onClick={() => router.push('/signup')}
                    >
                      {t('howItWorks.cta.button')}
                    </Button>
                  </Center>
                </GridItem>
              </Grid>
            </Box>
          </VStack>
        </Box>

        {/* Features Grid */}
        <Box py={20} bg={subtleBg}>
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Text 
                fontSize="sm" 
                fontWeight="bold" 
                textTransform="uppercase" 
                letterSpacing="wider"
                color={accentColor}
              >
                {t('features.section.subtitle')}
              </Text>
              <Heading size="xl">{t('features.section.title')}</Heading>
              <Text fontSize="lg" maxW="3xl">
                {t('features.section.description')}
              </Text>
            </VStack>
            
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 4 }}
              spacing={8}
              w="full"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Box
                    p={8}
                    h="full"
                    bg={glassCardBg}
                    borderRadius="xl"
                    borderColor={feature.color}
                    borderWidth={2}
                    _hover={{
                      transform: 'translateY(-5px)',
                      boxShadow: 'xl'
                    }}
                    transition="all 0.3s ease"
                  >
                    <VStack align="start" spacing={6}>
                      <Icon as={feature.icon} boxSize={12} color={feature.color} />
                      <Heading size="md">{t(feature.title)}</Heading>
                      <Text>{t(feature.description)}</Text>
                    </VStack>
                  </Box>
                </motion.div>
              ))}
            </SimpleGrid>
          </VStack>
        </Box>

        {/* App Showcase */}
        <Box py={20} bg={subtleBg}>
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={12} alignItems="center">
            <GridItem order={{ base: 2, lg: 1 }}>
              <VStack align="flex-start" spacing={8}>
                <Text 
                  fontSize="sm" 
                  fontWeight="bold" 
                  textTransform="uppercase" 
                  letterSpacing="wider"
                  color={accentColor}
                >
                  {t('app.subtitle')}
                </Text>
                <Heading size="xl">{t('app.title')}</Heading>
                <Text fontSize="lg">
                  {t('app.description')}
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                  <HStack align="flex-start" spacing={4}>
                    <Icon as={FaBolt} boxSize={6} color={accentColor} mt={1} />
                    <VStack align="flex-start" spacing={1}>
                      <Text fontWeight="bold">{t('app.feature.instant.title')}</Text>
                      <Text fontSize="sm">{t('app.feature.instant.description')}</Text>
                    </VStack>
                  </HStack>
                  <HStack align="flex-start" spacing={4}>
                    <Icon as={FaQrcode} boxSize={6} color={accentColor} mt={1} />
                    <VStack align="flex-start" spacing={1}>
                      <Text fontWeight="bold">{t('app.feature.qr.title')}</Text>
                      <Text fontSize="sm">{t('app.feature.qr.description')}</Text>
                    </VStack>
                  </HStack>
                  <HStack align="flex-start" spacing={4}>
                    <Icon as={FaMapMarkerAlt} boxSize={6} color={accentColor} mt={1} />
                    <VStack align="flex-start" spacing={1}>
                      <Text fontWeight="bold">{t('app.feature.locator.title')}</Text>
                      <Text fontSize="sm">{t('app.feature.locator.description')}</Text>
                    </VStack>
                  </HStack>
                  <HStack align="flex-start" spacing={4}>
                    <Icon as={FaShieldAlt} boxSize={6} color={accentColor} mt={1} />
                    <VStack align="flex-start" spacing={1}>
                      <Text fontWeight="bold">{t('app.feature.security.title')}</Text>
                      <Text fontSize="sm">{t('app.feature.security.description')}</Text>
                    </VStack>
                  </HStack>
                </SimpleGrid>
                <HStack spacing={4}>
                  <Button 
                    leftIcon={<FaApple />} 
                    variant="tazdani-solid"
                    onClick={() => router.push(t('app.store.ios.link'))}
                  >
                    {t('app.store.ios')}
                  </Button>
                  <Button 
                    leftIcon={<FaGooglePlay />} 
                    variant="tazdani-solid"
                    onClick={() => router.push(t('app.store.android.link'))}
                  >
                    {t('app.store.android')}
                  </Button>
                </HStack>
              </VStack>
            </GridItem>
            <GridItem order={{ base: 1, lg: 2 }}>
              <Center>
                <Box
                  position="relative"
                  w="full"
                  maxW="300px"
                >
                  {/* Phone mockup with app screenshot */}
                  <Image 
                    src="/images/tazdani-dashboard.png" 
                    alt={t('app.image.alt')} 
                  />
                </Box>
              </Center>
            </GridItem>
          </Grid>
        </Box>

        {/* Agent Network Map */}
        <Box py={20}>
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={12} alignItems="center">
            <GridItem>
              <VStack align="flex-start" spacing={8}>
                <Text 
                  fontSize="sm" 
                  fontWeight="bold" 
                  textTransform="uppercase" 
                  letterSpacing="wider"
                  color={accentColor}
                >
                  {t('agentMap.subtitle')}
                </Text>
                <Heading size="xl">{t('agentMap.title')}</Heading>
                <Text fontSize="lg">
                  {t('agentMap.description')}
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                  <HStack align="flex-start" spacing={4}>
                    <Icon as={FaMapMarkerAlt} boxSize={6} color={accentColor} mt={1} />
                    <VStack align="flex-start" spacing={1}>
                      <Text fontWeight="bold">{t('agentMap.feature.cities.title')}</Text>
                      <Text fontSize="sm">{t('agentMap.feature.cities.description')}</Text>
                    </VStack>
                  </HStack>
                  <HStack align="flex-start" spacing={4}>
                    <Icon as={FaStore} boxSize={6} color={accentColor} mt={1} />
                    <VStack align="flex-start" spacing={1}>
                      <Text fontWeight="bold">{t('agentMap.feature.locations.title')}</Text>
                      <Text fontSize="sm">{t('agentMap.feature.locations.description')}</Text>
                    </VStack>
                  </HStack>
                  <HStack align="flex-start" spacing={4}>
                    <Icon as={FaClock} boxSize={6} color={accentColor} mt={1} />
                    <VStack align="flex-start" spacing={1}>
                      <Text fontWeight="bold">{t('agentMap.feature.hours.title')}</Text>
                      <Text fontSize="sm">{t('agentMap.feature.hours.description')}</Text>
                    </VStack>
                  </HStack>
                  <HStack align="flex-start" spacing={4}>
                    <Icon as={FaIdCard} boxSize={6} color={accentColor} mt={1} />
                    <VStack align="flex-start" spacing={1}>
                      <Text fontWeight="bold">{t('agentMap.feature.verification.title')}</Text>
                      <Text fontSize="sm">{t('agentMap.feature.verification.description')}</Text>
                    </VStack>
                  </HStack>
                </SimpleGrid>
              </VStack>
            </GridItem>
            <GridItem>
               <Box 
                    bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
                    borderRadius="xl"
                    height={{ base: "400px", md: "600px" }}
                    overflow="hidden"
                  >
                    <AgentLocator 
                      labels={{
                        title: t('locations.title'),
                        searchPlaceholder: t('locations.search'),
                        noAgents: t('locations.no_agents')
                      }}
                    />
                  </Box>
            </GridItem>
          </Grid>
        </Box>

        {/* Account Types Section */}
        <Box>
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center" maxW="3xl" mx="auto">
              <Text 
                fontSize="sm" 
                fontWeight="bold" 
                textTransform="uppercase" 
                letterSpacing="wider"
                color={accentColor}
              >
                {t('accounts.subtitle')}
              </Text>
              <Heading size="xl">{t('accounts.title')}</Heading>
              <Text fontSize="lg">
                {t('accounts.description')}
              </Text>
            </VStack>
            
            <HStack spacing={4} justify="center" flexWrap="wrap">
              <Button 
                variant={activeSection === 'customer' ? 'solid' : 'outline'} 
                colorScheme="green"
                size="lg"
                onClick={() => handleAccountTypeChange('customer')}
              >
                {t('accounts.tab.individual')}
              </Button>
              <Button 
                variant={activeSection === 'merchant' ? 'solid' : 'outline'} 
                colorScheme="green"
                size="lg"
                onClick={() => handleAccountTypeChange('merchant')}
              >
                {t('accounts.tab.merchant')}
              </Button>
              <Button 
                variant={activeSection === 'agent' ? 'solid' : 'outline'} 
                colorScheme="green"
                size="lg"
                onClick={() => handleAccountTypeChange('agent')}
              >
                {t('accounts.tab.agent')}
              </Button>
            </HStack>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%' }}
              >
                {renderAccountSection()}
              </motion.div>
            </AnimatePresence>
          </VStack>
        </Box>
        
        {/* Final CTA Section */}
        <Box py={20}>
          <Box
          borderWidth={1}
          borderColor={useColorModeValue('brand.tazdani.400', 'brand.tazdani.700')}
            borderRadius="2xl"
            overflow="hidden"
            position="relative"
          >
            {/* Background pattern */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              opacity={0.15}
              backgroundImage="url('/images/tazdani-pattern.png')"
              backgroundSize="cover"
            />
            
            <Container maxW="4xl" py={16} px={8} position="relative">
              <VStack spacing={8} textAlign="center">
                <Heading size="2xl">{t('finalCta.title')}</Heading>
                <Text fontSize="xl" maxW="3xl">
                  {t('finalCta.description')}
                </Text>
                <HStack spacing={6} pt={4}>
                  <Button
                  variant="tazdani-outline"
                    _hover={{ bg: "lightgreen", transform: "translateY(-2px)" }}
                    onClick={() => router.push('/signup')}
                  >
                    {t('finalCta.primary')}
                  </Button>
                  <Button
                    variant="tazdani-outline"
                    _hover={{ bg: "lightgreen", transform: "translateY(-2px)" }}
                    onClick={() => router.push('/contact')}
                  >
                    {t('finalCta.secondary')}
                  </Button>
                </HStack>
              </VStack>
            </Container>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TazdaniLanding;