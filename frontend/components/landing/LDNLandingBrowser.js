import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  useColorMode,
  Grid,
  GridItem,
  Divider,
  Image,
  List,
  ListItem,
  ListIcon,
  Circle,
  Link,
  Wrap,
  WrapItem,
  useBreakpointValue,
  Center
} from '@chakra-ui/react';
import { 
  FaShieldAlt,
  FaChartLine,
  FaGlobeAmericas,
  FaMobileAlt,
  FaLock,
  FaMoneyBillWave,
  FaUser,
  FaCheckCircle,
  FaDesktop,
  FaHeadset,
  FaWhatsapp,
  FaHandHoldingUsd,
  FaBalanceScale,
  FaFileContract,
  FaMosque,
  FaBitcoin
} from 'react-icons/fa';
import { 
  ArrowRight, 
  CheckCircle, 
  Download,
  ExternalLink,
  Shield,
  Globe,
  LineChart,
  Clock
} from 'lucide-react';
import ForexPairDisplay from '@/components/trading/ForexPairDisplay';
import AdvancedChart from '@/components/AdvancedChart';

const ForexLandingBrowser = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const containerRef = useRef(null);
  const MotionBox = motion(Box);
  const { locale } = router;
  const isRTL = locale === 'ar';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  // For responsive design
  const isMobile = useBreakpointValue({ base: true, md: false });
  const heroImageSize = useBreakpointValue({ base: "100%", md: "90%" });
  const headingSize = useBreakpointValue({ base: "3xl", md: "4xl", lg: "5xl" });
  const glassCardBg = useColorModeValue('whiteAlpha.900', 'whiteAlpha.100');
  const headingColor = useColorModeValue('whiteAlpha.900', 'brand.bitdash.400');
  const textColor = useColorModeValue('brand.bitdash.400', 'brand.bitdash.400');
  const accentColor = '#8b7966'; // The gold/brown accent color

  // Parallax component
  const ParallaxBox = ({ children, offset = 100, ...rest }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "end start"]
    });
    
    const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
    
    return (
      <MotionBox
        ref={ref}
        style={{ y }}
        {...rest}
      >
        {children}
      </MotionBox>
    );
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  // Main trading products
  const tradingProducts = [
    {
      icon: FaGlobeAmericas,
      title: t('trade.products.forex.title', 'Forex'),
      description: t('trade.products.forex.description', 'Trade 80+ currency pairs with tight spreads starting from 0.1 pips and leverage up to 1:500'),
      highlights: [
        t('trade.products.forex.highlight1', 'Major, Minor & Exotic Pairs'), 
        t('trade.products.forex.highlight2', 'Institutional-grade liquidity'), 
        t('trade.products.forex.highlight3', 'Advanced charting tools')
      ],
      color: accentColor,
      image: '/images/eur.png'
    },
    {
      icon: FaBitcoin,
      title: t('trade.products.crypto.title', 'Cryptocurrencies'),
      description: t('trade.products.crypto.description', 'Access 50+ cryptocurrencies with institutional liquidity and competitive fees'),
      highlights: [
        t('trade.products.crypto.highlight1', 'BTC, ETH, SOL, ADA & more'), 
        t('trade.products.crypto.highlight2', '24/7 trading availability'), 
        t('trade.products.crypto.highlight3', 'Cold storage security')
      ],
      color: accentColor,
      image: '/images/btc.png'
    },
    {
      icon: FaChartLine,
      title: t('trade.products.stocks.title', 'Stocks'),
      description: t('trade.products.stocks.description', 'Diversify with global indices and stocks from US, EU, and Asian markets'),
      highlights: [
        t('trade.products.stocks.highlight1', '0% commission on stocks'), 
        t('trade.products.stocks.highlight2', 'Fractional shares available'), 
        t('trade.products.stocks.highlight3', 'Extended market hours')
      ],
      color: accentColor,
      image: '/images/tsla.png'
    },
    {
      icon: FaMoneyBillWave,
      title: t('trade.products.commodities.title', 'Commodities'),
      description: t('trade.products.commodities.description', 'Trade gold, silver, oil and other commodities with competitive pricing'),
      highlights: [
        t('trade.products.commodities.highlight1', 'Spot & futures contracts'), 
        t('trade.products.commodities.highlight2', 'Low margin requirements'), 
        t('trade.products.commodities.highlight3', 'Hedge against inflation')
      ],
      color: accentColor,
      image: '/images/goldbar.png'
    }
  ];

  // Platform features
  const platformFeatures = [
    {
      icon: FaDesktop,
      title: t('platform.features.trading.title', 'Advanced Trading Platforms'),
      description: t('platform.features.trading.description', 'Trade on our proprietary platform, MetaTrader 5, or via robust API solutions'),
      color: accentColor,
      image: '/images/mt5.png'
    },
    {
      icon: FaLock,
      title: t('platform.features.security.title', 'Bank-Grade Security'),
      description: t('platform.features.security.description', 'Funds held in segregated accounts with multi-layer security protocols'),
      color: accentColor,
      image: '/images/shield.png'
    },
    {
      icon: FaMobileAlt,
      title: t('platform.features.mobile.title', 'Mobile Trading'),
      description: t('platform.features.mobile.description', 'Trade anytime, anywhere with our award-winning mobile applications'),
      color: accentColor,
      image: '/images/MT5-IOS.png'
    },
    {
      icon: FaHeadset,
      title: t('platform.features.support.title', '24/7 Support'),
      description: t('platform.features.support.description', 'Dedicated customer support in multiple languages via chat, email, and phone'),
      color: accentColor,
      image: '/images/advisors.png'
    }
  ];

  // Islamic account features
  const islamicFeatures = [
    {
      icon: FaMosque,
      title: t('islamic.features.shariah.title', 'Shariah Compliant'),
      description: t('islamic.features.shariah.description', 'All our products and services adhere strictly to Islamic finance principles, certified by leading Shariah scholars.')
    },
    {
      icon: FaHandHoldingUsd,
      title: t('islamic.features.riba.title', 'No Riba (Interest)'),
      description: t('islamic.features.riba.description', 'Our financial solutions operate without interest, utilizing ethical profit-sharing and fee-based structures.')
    },
    {
      icon: FaBalanceScale,
      title: t('islamic.features.ethical.title', 'Ethical Investments'),
      description: t('islamic.features.ethical.description', 'We screen all investments to ensure they comply with Islamic values, avoiding prohibited industries.')
    },
    {
      icon: FaFileContract,
      title: t('islamic.features.transparent.title', 'Transparent Contracts'),
      description: t('islamic.features.transparent.description', 'All agreements are clearly defined with fair terms that avoid uncertainty (gharar) and speculation (maysir).')
    }
  ];

  // Account types
  const accountTypes = [
    {
      name: t('accounts.standard.title', 'Standard'),
      minDeposit: t('accounts.standard.minDeposit', '$150'),
      spread: t('accounts.standard.spread', 'From 1.0 pips'),
      leverage: t('accounts.standard.leverage', 'Up to 1:200'),
      features: [
        t('accounts.standard.feature1', '100+ trading instruments'), 
        t('accounts.standard.feature2', '24/5 support'), 
        t('accounts.standard.feature3', 'Standard execution')
      ],
      color: accentColor
    },
    {
      name: t('accounts.premium.title', 'Premium'),
      minDeposit: t('accounts.premium.minDeposit', '$5,000'),
      spread: t('accounts.premium.spread', 'From 0.5 pips'),
      leverage: t('accounts.premium.leverage', 'Up to 1:300'),
      features: [
        t('accounts.premium.feature1', '100+ trading instruments'), 
        t('accounts.premium.feature2', '24/5 dedicated support'), 
        t('accounts.premium.feature3', 'Priority execution')
      ],
      color: accentColor,
      popular: true
    },
    {
      name: t('accounts.professional.title', 'Professional'),
      minDeposit: t('accounts.professional.minDeposit', '$25,000'),
      spread: t('accounts.professional.spread', 'From 0.1 pips'),
      leverage: t('accounts.professional.leverage', 'Up to 1:500'),
      features: [
        t('accounts.professional.feature1', 'All available instruments'), 
        t('accounts.professional.feature2', '24/7 personal account manager'), 
        t('accounts.professional.feature3', 'Ultra-fast execution')
      ],
      color: accentColor
    }
  ];

  // Feature highlights with images
  const featureHighlights = [
    {
      title: t('highlights.commission.title', '0% Commission Fees'),
      description: t('highlights.commission.description', 'Trade with zero commission on all instruments'),
      image: '/images/0-fees.png'
    },
    {
      title: t('highlights.products.title', '100+ Trading Products'),
      description: t('highlights.products.description', 'Access a wide range of global markets'),
      image: '/images/100s-products.png'
    },
    {
      title: t('highlights.conditions.title', 'Competitive Conditions'),
      description: t('highlights.conditions.description', 'Low spreads and high leverage options'),
      image: '/images/comp-cond.png'
    }
  ];

  // Trading features
  const tradingFeatures = [
    {
      icon: Globe,
      title: t('features.global.title', 'Global Market Access'),
      description: t('features.global.description', 'Trade on global markets with direct market access and competitive conditions')
    },
    {
      icon: Shield,
      title: t('features.secure.title', 'Enhanced Security'),
      description: t('features.secure.description', 'Benefit from bank-grade security protocols and fund segregation')
    },
    {
      icon: LineChart,
      title: t('features.analysis.title', 'Advanced Analysis'),
      description: t('features.analysis.description', 'Access powerful charting tools and real-time market data')
    },
    {
      icon: Clock,
      title: t('features.execution.title', 'Fast Execution'),
      description: t('features.execution.description', 'Experience ultra-fast trade execution with minimal slippage')
    }
  ];

  // Steps to start trading
  const tradingSteps = [
    {
      number: "1",
      title: t('steps.step1.title', 'Register'),
      description: t('steps.step1.description', 'Complete our quick and secure account registration process')
    },
    {
      number: "2",
      title: t('steps.step2.title', 'Fund'),
      description: t('steps.step2.description', 'Deposit funds using one of our multiple payment methods')
    },
    {
      number: "3",
      title: t('steps.step3.title', 'Trade'),
      description: t('steps.step3.description', 'Start trading over 100 instruments across global markets')
    }
  ];

  return (
  <Box ref={containerRef} dir={isRTL ? 'rtl' : 'ltr'}>
    {/* Hero Section */}
    <Box 
        as="section" 
        position="relative"
        p={{ base: 18, md: 20 }}
      >
        {/* Background elements */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex={0}
          overflow="hidden" // This prevents image overflow
        >
          {/* First background image */}
          <Image
            src="/images/background-1.png"
            alt="Background image"
            width="100%"
            height="100%"
            objectFit="cover"
            objectPosition="center"
            opacity={0.25}
            position="absolute"
          />
          <Image
              src="/images/clouds.png"
              alt="Clouds skyline"
              width="100%"
              height="100%"
              objectFit="cover"
              objectPosition="bottom center"
              opacity={0.25}
            />
          
          {/* London skyline image */}
          <Box
            position="absolute"
            bottom="0"
            width="100%"
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="flex-end" // Ensures alignment at the bottom
          >
            <Image
              src="/images/ldn-skyline.png"
              alt="London skyline"
              width="100%"
              height="100%"
              objectFit="contain"
              objectPosition="bottom center"
              opacity={0.35}
              style={{ marginTop: "auto" }} // Pushes the image to the bottom
            />
          </Box>
        </Box>

        <Container maxW="container.xl" position="relative" zIndex="2">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 1, lg: 10 }} alignItems="center" mt={{ base: 18, md: 20 }}>
            <GridItem>
              <MotionBox
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <VStack spacing={6} align="flex-start">
                  <Heading
                    as="h1"
                    fontSize={headingSize}
                    fontWeight="bold"
                    lineHeight="1.2"
                    bgGradient="linear(to-r, brand.bitdash.400, brand.bitdash.600)"
                    bgClip="text"
                  >
                    {t('trade.hero.title', 'Trade with Confidence')}
                  </Heading>
                  
                  <Text
                    fontSize={{ base: "xl", md: "xl" }}
                    fontWeight="bold"
                    maxW="550px"
                    color={isDark ? "white" : "black"}
                  >
                    {t('trade.hero.description', 'Access global markets with a regulated Forex broker offering competitive spreads, fast execution, and powerful trading platforms.')}
                  </Text>
                  <Button
                      variant="ldn-solid"
                      color="white"
                      _hover={{ bg: "#9c8877" }}
                      onClick={() => router.push('/signup')}
                    >
                      {t('trade.hero.get_started', 'Open Account')}
                    </Button>

                  <HStack spacing={6} mt={6} color={isDark ? "white" : "black"} fontWeight="bold" flexWrap="wrap">
                    <HStack>
                      <Icon as={CheckCircle} color={isDark ? "white" : "black"} />
                      <Text>{t('Landinghero.feature1', 'Regulated Broker')}</Text>
                    </HStack>
                    
                    <HStack>
                      <Icon as={CheckCircle} color={isDark ? "white" : "black"}/>
                      <Text>{t('Landinghero.feature2', 'Fast Execution')}</Text>
                    </HStack>
                    
                    <HStack>
                      <Icon as={CheckCircle} color={isDark ? "white" : "black"} />
                      <Text>{t('Landinghero.feature3', 'Competitive Spreads')}</Text>
                    </HStack>
                  </HStack>
                </VStack>
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Feature Highlights */}
      <Box py={10}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {featureHighlights.map((feature, idx) => (
              <Box
                key={idx}
                bg={useColorModeValue('white', 'gray.800')}
                borderRadius="lg"
                overflow="hidden"
                boxShadow="xl"
                height="100%"
              >
                <Grid 
                  templateColumns="120px 1fr"
                  gap={4}
                  p={4}
                  alignItems="center"
                >
                  <Center>
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      maxH="80px"
                      objectFit="contain"
                    />
                  </Center>
                  <Box>
                    <Heading size="md" mb={1} color={accentColor}>
                      {feature.title}
                    </Heading>
                    <Text fontSize="sm" color={textColor}>
                      {feature.description}
                    </Text>
                  </Box>
                </Grid>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Container maxW="container.xl" pt={{ base: 10, md: 20 }}>
        {/* Trading Features Section */}
        <Box as="section" position="relative">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 10, lg: 16 }} alignItems="center">
            <GridItem order={{ base: 2, lg: 1 }}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                {/* Feature Cards */}
                {tradingFeatures.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    delay={index * 0.1}
                  />
                ))}
              </SimpleGrid>
            </GridItem>
            
            <GridItem order={{ base: 1, lg: 2 }}>
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <VStack align={{ base: "center", lg: "flex-start" }} textAlign={{ base: "center", lg: "left" }}>
                  <Image 
                    src="/images/100usd-100eur-bills.png" 
                    alt={t('features.image.alt', 'Trading Features')}
                    width={{ base: "300px", md: "500px" }}
                    as={motion.img}
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  />        
                </VStack>
              </MotionBox>
            </GridItem>
          </Grid>
        </Box>
        
        {/* Live Trading Chart */}
        <Box mb={24} pt={{ base: 10, md: 20 }}>
          <Heading
            textAlign="center"
            mb={12}
            fontSize={{ base: '3xl', md: '4xl' }}
            color={accentColor}
          >
            {t('trade.chart.title', 'Real-Time Market Analysis')}
          </Heading>
          
          <Box
            w="full"
            borderRadius="3xl"
            bg={glassCardBg}
            borderColor={accentColor}
            borderWidth={2}
            boxShadow="xl"
            overflow="hidden"
            p={4}
          >
            <Box px={{ base: 0, md: 4 }} py={4} position="relative">
              <AdvancedChart />
            </Box>
            
            <Box px={{ base: 0, md: 4 }} py={4} position="relative">
              <ForexPairDisplay />
            </Box>
          </Box>
        </Box>
        
        {/* MT5 Platform Section */}
        <Box as="section" py={{ base: 16, md: 24 }} position="relative" zIndex={1}>
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 10, lg: 16 }} alignItems="center">
            <GridItem>
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <VStack spacing={6} align={{ base: "center", lg: "flex-start" }} textAlign={{ base: "center", lg: "left" }}>
                  <Heading
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight="bold"
                    color={isDark ? "white" : "#333"}
                  >
                    {t('mt5.title', 'MetaTrader 5')}
                  </Heading>
                  
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color={isDark ? "gray.300" : "gray.600"}
                    maxW="600px"
                  >
                    {t('mt5.subtitle', 'The world\'s most powerful trading platform for forex and financial markets')}
                  </Text>
                  
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color={isDark ? "gray.300" : "gray.600"}
                    maxW="600px"
                  >
                    {t('mt5.description', 'Access advanced trading tools, real-time market data, automated trading capabilities, and comprehensive technical analysis options all in one platform.')}
                  </Text>
                </VStack>
              </MotionBox>
            </GridItem>
            
            <GridItem>
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={scaleUp}
              >
                <Image 
                  src="/images/mt5-multi.png" 
                  alt={t('mt5.imageAlt', 'MetaTrader 5 Platform')}
                  width="100%"
                />
              </MotionBox>
            </GridItem>
          </Grid>
        </Box>
        
        {/* Platform Features */}
        <Box mb={24}>
          <Heading
            textAlign="center"
            mb={12}
            fontSize={{ base: '3xl', md: '4xl' }}
            color={accentColor}
          >
            {t('trade.platform.title')}
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mb={16}>
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
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
                  <VStack align="center" spacing={6}>
                    <Image 
                      src={feature.image}
                      alt={feature.title}
                      height="80px"
                      objectFit="contain"
                    />
                    <Heading size="md" color={feature.color} textAlign="center">
                      {feature.title}
                    </Heading>
                    <Text textAlign="center">
                      {feature.description}
                    </Text>
                  </VStack>
                </Box>
              </motion.div>
            ))}
          </SimpleGrid>
        </Box>
        
        {/* Islamic Account Section */}
        <Box mb={24}>
          <Heading
            textAlign="center"
            mb={12}
            fontSize={{ base: '3xl', md: '4xl' }}
            color={accentColor}
          >
            {t('trade.islamic.title', 'Shariah-Compliant Trading')}
          </Heading>
          
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={16} alignItems="center">
            <GridItem order={{ base: 2, lg: 1 }}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                {islamicFeatures.map((feature, idx) => (
                  <IslamicPrincipleCard
                    key={idx}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    delay={idx * 0.1}
                  />
                ))}
              </SimpleGrid>
            </GridItem>
            
            <GridItem order={{ base: 1, lg: 2 }}>
              <VStack spacing={6} align={{ base: "center", lg: "flex-start" }} textAlign={{ base: "center", lg: "left" }}>
                <Heading
                  fontSize={{ base: "2xl", md: "3xl" }}
                  color={accentColor}
                >
                  {t('islamic.title', 'Islamic Trading Accounts')}
                </Heading>
                <Text fontSize="lg" color={textColor}>
                  {t('islamic.description1', 'BitDash offers Shariah-compliant trading accounts that adhere to Islamic finance principles, ensuring that all transactions are ethical and transparent.')}
                </Text>
                <Text fontSize="lg" color={textColor}>
                  {t('islamic.description2', 'Our Islamic accounts have no swap rates, rollover interest, or hidden fees, making them suitable for Muslim traders who follow Shariah law.')}
                </Text>
                <Button
                  bg={accentColor}
                  color="white"
                  _hover={{ bg: "#9c8877" }}
                  px={8}
                  size="lg"
                  onClick={() => router.push('/islamic-account')}
                >
                  {t('islamic.learnMore', 'Learn More')}
                </Button>
              </VStack>
            </GridItem>
          </Grid>
        </Box>

        {/* Partnership (IB) Section */}
        <Box mb={24}>
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 8, lg: 16 }} alignItems="center">
            <GridItem>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <VStack spacing={6} align={{ base: "center", lg: "flex-start" }} textAlign={{ base: "center", lg: "left" }}>
                  <Heading 
                    fontSize={{ base: "xl", md: "3xl" }}
                    fontWeight="bold"
                    color={accentColor}
                  >
                    {t('partners.title', 'BECOME A BITDASH PARTNER')}
                  </Heading>
                  
                  <Text
                    fontSize={{ base: "sm", md: "lg" }}
                    color={textColor}
                    fontWeight="bold"
                  >
                    {t('partners.subtitle', 'EXPAND YOUR BUSINESS WITH OUR IB PROGRAM')}
                  </Text>
                  
                  <Text fontSize={{ base: "sm", md: "lg" }} color={textColor}>
                    {t('partners.description', 'Our Introducing Broker program offers competitive rebates, dedicated support, and powerful tools to help you grow your business.')}
                  </Text>
                  
                  <List spacing={3} mt={2} alignSelf={{ base: "center", lg: "flex-start" }} textAlign={{ base: "left", lg: "left" }}>
                    <ListItem display="flex" alignItems="center">
                      <ListIcon as={FaCheckCircle} color={accentColor} />
                      <Text fontSize={{ base: "sm", md: "md" }}>{t('partners.benefit1', 'Competitive commission structures')}</Text>
                    </ListItem>
                    <ListItem display="flex" alignItems="center">
                      <ListIcon as={FaCheckCircle} color={accentColor} />
                      <Text fontSize={{ base: "sm", md: "md" }}>{t('partners.benefit2', 'Dedicated partnership manager')}</Text>
                    </ListItem>
                    <ListItem display="flex" alignItems="center">
                      <ListIcon as={FaCheckCircle} color={accentColor} />
                      <Text fontSize={{ base: "sm", md: "md" }}>{t('partners.benefit3', 'Marketing materials and support')}</Text>
                    </ListItem>
                    <ListItem display="flex" alignItems="center">
                      <ListIcon as={FaCheckCircle} color={accentColor} />
                      <Text fontSize={{ base: "sm", md: "md" }}>{t('partners.benefit4', 'Advanced reporting tools')}</Text>
                    </ListItem>
                  </List>
                  
                  <Button
                    mt={4}
                    bg={accentColor}
                    color="white"
                    _hover={{ bg: "#9c8877" }}
                    px={8}
                    size={{ base: "md", md: "lg" }}
                    onClick={() => router.push('/partners')}
                  >
                    {t('partners.cta', 'Become a Partner')}
                  </Button>
                </VStack>
              </motion.div>
            </GridItem>
            
            <GridItem display={{ base: "none", md: "block" }}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Image 
                  src="/images/ib.png" 
                  alt={t('partners.imageAlt', 'Partnership Program')}
                />
              </motion.div>
            </GridItem>
          </Grid>
        </Box>
        
        {/* Steps to Start Trading Section */}
        <Box>
          <VStack spacing={16}>
              <Text 
                color="#8b7966" 
                fontWeight="bold" 
                mb={3}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {t('steps.subtitle', 'Getting Started')}
              </Text>
              
              <Heading
                fontWeight="bold"
                color={isDark ? "white" : "#333"}
                mb={5}
              >
                {t('steps.title', 'Start Trading in 3 Simple Steps')}
              </Heading>
              
              <Text
                color={isDark ? "gray.300" : "gray.600"}
              >
                {t('steps.description', 'Begin your trading journey with BitDash in just a few easy steps')}
              </Text>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} width="full">
              {tradingSteps.map((step, index) => (
                <StepCard
                  key={index}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </SimpleGrid>
            
            <Button
              bg="#8b7966"
              color="white"
              onClick={() => router.push('/signup')}
              rightIcon={<ArrowRight />}
            >
              {t('steps.cta', 'Open Your Account Now')}
            </Button>
          </VStack>
        </Box>
                
        {/* Mobile App Section */}
        <Box mt={24}>
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} alignItems="center">
            <GridItem>
                <VStack align={{ base: "center", lg: "flex-start" }} spacing={{ base: 4, md: 8 }} textAlign={{ base: "center", lg: "left" }}>
                  <Heading
                    fontSize={{ base: "xl", md: "3xl" }}
                    fontWeight="bold"
                    color={accentColor}
                  >
                    {t('mobileApp.title', 'DOWNLOAD BITDASH APPLICATION')}
                  </Heading>
                                    
                  <Text
                    fontSize={{ base: "sm", md: "lg" }}
                    color={textColor}
                    fontWeight="bold"
                  >
                    {t('mobileApp.subtitle', 'STAY IN THE KNOW ANYWHERE, ANYTIME.')}
                  </Text>

                  <Text fontSize={{ base: "sm", md: "lg" }} color={textColor}>
                    {t('mobileApp.description', 'Trade on the go with our powerful mobile app. Get real-time market data, execute trades, and manage your account from anywhere in the world.')}
                  </Text>

                  <HStack spacing={4} mt={{ base: 2, md: 4 }} zIndex={1}>
                    <Link onClick={() => {
                        router.push("https://apps.apple.com/us/app/metatrader-5/id413251709");
                        }}>
                    <Image 
                      src="/images/app-store.png" 
                      alt="App Store" 
                      height={{ base: "40px", md: "50px" }}
                      cursor="pointer"
                      transition="transform 0.3s ease"
                      _hover={{ transform: "scale(1.05)" }}
                    />
                    </Link>
                    <Link
                     onClick={() => {
                        router.push("https://play.google.com/store/apps/details?id=net.metaquotes.metatrader5&hl=en&gl=US");
                        }}
                     >
                    <Image 
                      src="/images/google-play.png" 
                      alt="Google Play" 
                      height={{ base: "40px", md: "50px" }}
                      cursor="pointer"
                    />
                    </Link>
                  </HStack>
                </VStack>
            </GridItem>
                            
            <GridItem>
                <Box 
                  zIndex={1}
                >
                  <Image 
                    src="/images/dashboard-ldn.png" 
                    alt={t('mobileApp.imageAlt', 'Mobile App Screenshot')}
                    width="30%"
                    height="30%"
                    objectFit="cover"
                    objectPosition="center"
                  />
                </Box>
            </GridItem>
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box as="section" py={{ base: 16, md: 24 }}>
          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Flex
              direction="column"
              align="center"
              textAlign="center"
              py={{ base: 10, md: 16 }}
              px={{ base: 6, md: 10 }}
              color={isDark ? "white" : "#333"}
              borderWidth="1px"
              borderColor={isDark ? "gray.700" : "gray.200"}
              position="relative"
              overflow="hidden"
            >
              {/* Decorative top border */}
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                height="6px"
                bg="#8b7966"
              />
              
              <VStack spacing={8} maxW="3xl" position="relative" zIndex="1">
                <Text 
                  color="#8b7966" 
                  fontWeight="bold" 
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  {t('cta.subtitle', 'Ready to Trade?')}
                </Text>
                
                <Heading
                  fontSize={{ base: "3xl", md: "4xl" }}
                  fontWeight="bold"
                  color={isDark ? "white" : "#333"}
                >
                  {t('cta.title', 'Ready to Start Trading?')}
                </Heading>
                
                <Text 
                  fontSize="lg" 
                  color={isDark ? "gray.300" : "gray.600"}
                  maxW="2xl"
                >
                  {t('cta.description', 'Join thousands of traders worldwide who trust Forex by BitDash for their trading needs. Open an account today and experience the difference.')}
                </Text>
                
                <HStack spacing={6} pt={4} wrap="wrap" justify="center">
                  <Button
                    bg="#8b7966"
                    color="white"
                    _hover={{ bg: "#9c7c63" }}
                    size="lg"
                    px={8}
                    rightIcon={<ArrowRight />}
                    onClick={() => router.push('/signup')}
                  >
                    {t('cta.primaryButton', 'Open an Account')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    borderColor="#8b7966"
                    color="#8b7966"
                    _hover={{ borderColor: "#9c7c63", color: "#9c7c63" }}
                    size="lg"
                    px={8}
                    leftIcon={<FaWhatsapp />}
                    onClick={() => window.open("https://api.whatsapp.com/send?phone=00447538636207", "_blank")}
                  >
                    {t('cta.secondaryButton', 'Contact Support')}
                  </Button>
                </HStack>
              </VStack>
            </Flex>
          </MotionBox>
        </Box>
      </Container>

      {/* Legal Notices Section */}
      <Box 
        as="section" 
        py={10} 
        borderTop="1px solid"
        borderColor={isDark ? "gray.700" : "gray.200"}
      >
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            <Heading size="md" color="#8b7966">
              {t('legal.title', 'Risk Warning & Regulatory Information')}
            </Heading>
            
            <Text fontSize="sm" color={isDark ? "gray.400" : "gray.600"} lineHeight="tall">
              {t('legal.riskWarning', 'Contracts for Difference (\'CFDs\') are complex financial products that are traded on margin. Trading CFDs carries a high level of risk since leverage can work both to your advantage and disadvantage. As a result, CFDs may not be suitable for all investors because you may lose all your invested capital. You should not risk more than you are prepared to lose. Before deciding to trade, you need to ensure that you understand the risks involved taking into account your investment objectives and level of experience. Past performance of CFDs is not a reliable indicator of future results. Most CFDs have no set maturity date. Hence, a CFD position matures on the date you choose to close an existing open position. Seek independent advice, if necessary.')}
            </Text>
            
            <Divider borderColor={isDark ? "gray.700" : "gray.200"} />
            
            <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8}>
              <GridItem>
                <VStack align="flex-start" spacing={4}>
                  <Heading size="sm" color={isDark ? "white" : "gray.800"}>
                    {t('legal.license.title', 'Licensed and Regulated')}
                  </Heading>
                  
                  <Text fontSize="sm" color={isDark ? "gray.400" : "gray.600"} lineHeight="tall">
                    {t('legal.license.content', 'BitDash LLC is officially licensed and regulated, holding an International Brokerage License in Saint Vincent and the Grenadines, numbered 1547 LLC. The registered address is Richmond Hill Rd, Kingstown, St. Vincent and the Grenadines, VC0100.')}
                  </Text>
                </VStack>
              </GridItem>
              
              <GridItem>
                <VStack align="flex-start" spacing={4}>
                  <Heading size="sm" color={isDark ? "white" : "gray.800"}>
                    {t('legal.restricted.title', 'Restricted Jurisdictions')}
                  </Heading>
                  
                  <Text fontSize="sm" color={isDark ? "gray.400" : "gray.600"} lineHeight="tall">
                    {t('legal.restricted.content', 'BitDash does not provide services to citizens and residents of certain jurisdictions such as United States of America, United Kingdom, Canada, Japan, EU countries, Iran, Israel and North Korea.')}
                  </Text>
                </VStack>
              </GridItem>
            </Grid>
            
            <Wrap spacing={4}>
              {[
                'legal.links.privacy',
                'legal.links.aml',
                'legal.links.terms',
                'legal.links.security',
                'legal.links.risk',
                'legal.links.complaints'
              ].map((key, idx) => (
                <WrapItem key={idx}>
                  <Link 
                    href={`/policies/${t(key).toLowerCase().replace(/\s+/g, '-')}`}
                    fontSize="xs"
                    color={isDark ? "gray.400" : "gray.600"}
                    _hover={{ color: "#8b7966" }}
                    zIndex={1}
                  >
                    {t(key)}
                  </Link>
                </WrapItem>
              ))}
            </Wrap>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

// Component for Feature Cards
const FeatureCard = ({ icon, title, description, delay }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Flex
        direction="column"
        p={6}
        borderRadius="lg"
        boxShadow="md"
        height="full"
        transition="all 0.3s"
        _hover={{
          transform: 'translateY(-5px)',
          boxShadow: 'lg'
        }}
      >
        <Circle
          size="40px"
          bg="#8b7966"
          color="white"
          mb={4}
        >
          <Icon as={icon} boxSize={4} />
        </Circle>
        
        <Heading as="h3" size="sm" mb={3} fontWeight="bold">
          {title}
        </Heading>
        
        <Text fontSize="sm" color={isDark ? "gray.300" : "gray.600"}>
          {description}
        </Text>
      </Flex>
    </motion.div>
  );
};

// Component for Islamic Principle Cards
const IslamicPrincipleCard = ({ icon, title, description, delay }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Flex
        direction="column"
        p={6}
        borderRadius="lg"
        boxShadow="md"
        height="full"
        transition="all 0.3s"
        _hover={{
          transform: 'translateY(-5px)',
          boxShadow: 'lg'
        }}
      >
        <Circle
          size="50px"
          bg="#8b7966"
          color="white"
          mb={4}
        >
          <Icon as={icon} boxSize={5} />
        </Circle>
        
        <Heading as="h3" size="md" mb={3} fontWeight="bold">
          {title}
        </Heading>
        
        <Text fontSize="sm" color={isDark ? "gray.300" : "gray.600"}>
          {description}
        </Text>
      </Flex>
    </motion.div>
  );
};

// Component for Step Cards
const StepCard = ({ number, title, description, delay }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <VStack spacing={6} align="center" textAlign="center">
        <Flex
          alignItems="center"
          justifyContent="center"
          w="100px"
          h="100px"
          borderRadius="full"
          boxShadow="xl"
          position="relative"
          bg={isDark ? "gray.800" : "white"}
          _after={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: "full",
            border: "2px dashed",
            borderColor: "#8b7966",
            opacity: 0.5,
            transform: "scale(1.1)"
          }}
        >
          <Text
            fontSize="4xl"
            fontWeight="bold"
            color="#8b7966"
          >
            {number}
          </Text>
        </Flex>
        
        <Heading size="md" textAlign="center">{title}</Heading>
        
        <Text textAlign="center" color={isDark ? "gray.300" : "gray.600"}>
          {description}
        </Text>
      </VStack>
    </motion.div>
  );
};

export default ForexLandingBrowser;