import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
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
  CheckCircle,
  Grid,
  GridItem,
  Divider,
  Image,
  List,
  ListItem,
  ListIcon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Wrap,
  WrapItem,
  Center,
  Circle,
  Link
} from '@chakra-ui/react';
import { 
  FaShieldAlt,
  FaChartLine,
  FaGlobeAmericas,
  FaMobileAlt,
  FaLock,
  FaMoneyBillWave,
  FaUser,
  FaUserTie,
  FaDesktop,
  FaLaptopCode,
  FaBitcoin,
  FaEthereum,
  FaCheckCircle,
  FaAward,
  FaUniversity,
  FaHandshake,
  FaClock,
  FaHeadset,
  FaRegCreditCard,
  FaToolbox,
  FaTimes,
  FaPhoneAlt,
  FaWhatsapp,
  FaRegFile,
  FaHandHoldingUsd,
  FaBalanceScale,
  FaFileContract,
  FaMosque,
  FaExchangeAlt,
  FaChevronRight,
  FaDollarSign,
  FaChartBar,
  FaCoins
} from 'react-icons/fa';
import { Download } from 'lucide-react';
import ForexPairDisplay from '@/components/trading/ForexPairDisplay';
import CryptoMarketplace from '@/components/trading/CryptoMarketplace';
import TradingPlatformPreview from '@/components/trading/TradingPlatformPreview';
import AdvancedChart from '@/components/AdvancedChart';

const ForexLandingBrowser = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const containerRef = useRef(null);
  const MotionBox = motion(Box);

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
  
  const isDark = useColorModeValue(false, true);
  const bgGradient = useColorModeValue(
    'linear(to-b, blue.50, white)',
    'linear(to-b, gray.900, black)'
  );
  
  const glassCardBg = useColorModeValue('whiteAlpha.900', 'whiteAlpha.100');
  const headingColor = useColorModeValue('whiteAlpha.900', 'brand.bitdash.400');
  const textColor = useColorModeValue('brand.bitdash.400', 'brand.bitdash.400');
  const accentColor = '#8b7966'; // The gold/brown accent color from the main site

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

  // Main trading products
  const tradingProducts = [
    {
      icon: FaGlobeAmericas,
      title: 'Forex',
      description: 'Trade 80+ currency pairs with tight spreads starting from 0.1 pips and leverage up to 1:500',
      highlights: ['Major, Minor & Exotic Pairs', 'Institutional-grade liquidity', 'Advanced charting tools'],
      color: accentColor,
      image: '/images/eur.png'
    },
    {
      icon: FaBitcoin,
      title: 'Cryptocurrencies',
      description: 'Access 50+ cryptocurrencies with institutional liquidity and competitive fees',
      highlights: ['BTC, ETH, SOL, ADA & more', '24/7 trading availability', 'Cold storage security'],
      color: accentColor,
      image: '/images/btc.png'
    },
    {
      icon: FaChartLine,
      title: 'Stocks',
      description: 'Diversify with global indices and stocks from US, EU, and Asian markets',
      highlights: ['0% commission on stocks', 'Fractional shares available', 'Extended market hours'],
      color: accentColor,
      image: '/images/tsla.png'
    },
    {
      icon: FaMoneyBillWave,
      title: 'Commodities',
      description: 'Trade gold, silver, oil and other commodities with competitive pricing',
      highlights: ['Spot & futures contracts', 'Low margin requirements', 'Hedge against inflation'],
      color: accentColor,
      image: '/images/goldbar.png'
    }
  ];

  // Platform features
  const platformFeatures = [
    {
      icon: FaDesktop,
      title: 'Advanced Trading Platforms',
      description: 'Trade on our proprietary platform, MetaTrader 5, or via robust API solutions',
      color: accentColor,
      image: '/images/mt5.png'
    },
    {
      icon: FaLock,
      title: 'Bank-Grade Security',
      description: 'Funds held in segregated accounts with multi-layer security protocols',
      color: accentColor,
      image: '/images/shield.png'
    },
    {
      icon: FaMobileAlt,
      title: 'Mobile Trading',
      description: 'Trade anytime, anywhere with our award-winning mobile applications',
      color: accentColor,
      image: '/images/MT5-IOS.png'
    },
    {
      icon: FaHeadset,
      title: '24/7 Support',
      description: 'Dedicated customer support in multiple languages via chat, email, and phone',
      color: accentColor,
      image: '/images/advisors.png'
    }
  ];

  // Regulatory information
  const regulatoryInfo = [
    {
      authority: 'Financial Conduct Authority (FCA)',
      license: 'Reference No. 612025',
      country: 'United Kingdom',
      logo: '/images/shield.png'
    },
    {
      authority: 'Cyprus Securities and Exchange Commission (CySEC)',
      license: 'License No. 250/14',
      country: 'Cyprus',
      logo: '/images/shield.png'
    },
    {
      authority: 'Australian Securities and Investments Commission (ASIC)',
      license: 'AFSL No. 417727',
      country: 'Australia',
      logo: '/images/shield.png'
    }
  ];

  // Account types
  const accountTypes = [
    {
      name: 'Standard',
      minDeposit: '$150',
      spread: 'From 1.0 pips',
      leverage: 'Up to 1:200',
      features: ['100+ trading instruments', '24/5 support', 'Standard execution'],
      ideal: 'Beginner traders',
      color: accentColor
    },
    {
      name: 'Premium',
      minDeposit: '$5,000',
      spread: 'From 0.5 pips',
      leverage: 'Up to 1:300',
      features: ['100+ trading instruments', '24/5 dedicated support', 'Priority execution'],
      ideal: 'Active traders',
      color: accentColor,
      popular: true
    },
    {
      name: 'Professional',
      minDeposit: '$25,000',
      spread: 'From 0.1 pips',
      leverage: 'Up to 1:500',
      features: ['All available instruments', '24/7 personal account manager', 'Ultra-fast execution'],
      ideal: 'Professional traders',
      color: accentColor
    },
    {
      name: 'Institutional',
      minDeposit: '$100,000',
      spread: 'Raw spreads',
      leverage: 'Customized',
      features: ['All available instruments', 'API trading', 'Custom solutions'],
      ideal: 'Institutions & funds',
      color: accentColor
    }
  ];

  // Feature highlights with images
  const featureHighlights = [
    {
      title: '0% Commission Fees',
      description: 'Trade with zero commission on all instruments',
      image: '/images/0-fees.png'
    },
    {
      title: '100+ Trading Products',
      description: 'Access a wide range of global markets',
      image: '/images/100s-products.png'
    },
    {
      title: 'Competitive Conditions',
      description: 'Low spreads and high leverage options',
      image: '/images/comp-cond.png'
    }
  ];

  // Islamic account features
  const islamicFeatures = [
    {
      icon: FaMosque,
      title: 'Shariah Compliant',
      description: 'All our products and services adhere strictly to Islamic finance principles, certified by leading Shariah scholars.'
    },
    {
      icon: FaHandHoldingUsd,
      title: 'No Riba (Interest)',
      description: 'Our financial solutions operate without interest, utilizing ethical profit-sharing and fee-based structures.'
    },
    {
      icon: FaBalanceScale,
      title: 'Ethical Investments',
      description: 'We screen all investments to ensure they comply with Islamic values, avoiding prohibited industries.'
    },
    {
      icon: FaFileContract,
      title: 'Transparent Contracts',
      description: 'All agreements are clearly defined with fair terms that avoid uncertainty (gharar) and speculation (maysir).'
    }
  ];

  const AccountTypeCard = ({ title, minDeposit, spread, leverage, features, color, popular, delay }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  return (
    <MotionBox
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.6, 
            delay: delay,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }}
    >
      <Flex
        direction="column"
        borderRadius="lg"
        overflow="hidden"
        height="full"
        boxShadow={popular ? "xl" : "md"}
        position="relative"
        transition="all 0.3s"
        transform={popular ? "scale(1.05)" : "scale(1)"}
        _hover={{
          boxShadow: "xl"
        }}
      >
        {popular && (
          <Badge
            position="absolute"
            top={4}
            right={4}
            colorScheme="green"
            px={2}
            py={1}
            borderRadius="full"
            fontWeight="bold"
            zIndex="1"
          >
            Popular
          </Badge>
        )}
        
        <Box bg={color} p={5} color="white">
          <Heading size="lg">{title}</Heading>
        </Box>
        
        <VStack p={6} spacing={4} align="flex-start" flex="1" bg={isDark ? "gray.800" : "white"}>
          <VStack spacing={3} align="flex-start" width="full">
            <HStack justify="space-between" width="full">
              <Text fontWeight="medium">Min Deposit:</Text>
              <Text fontWeight="bold">{minDeposit}</Text>
            </HStack>
            
            <HStack justify="space-between" width="full">
              <Text fontWeight="medium">Spread:</Text>
              <Text fontWeight="bold">{spread}</Text>
            </HStack>
            
            <HStack justify="space-between" width="full">
              <Text fontWeight="medium">Leverage:</Text>
              <Text fontWeight="bold">{leverage}</Text>
            </HStack>
            
            <Divider my={2} />
            
            {features.map((feature, idx) => (
              <HStack key={idx}>
                <Icon as={CheckCircle} color="green.500" />
                <Text>{feature}</Text>
              </HStack>
            ))}
          </VStack>
          
          <Button 
            mt="auto" 
            bg={color}
            color="white"
            _hover={{ bg: "#9c7c63" }} 
            size="lg" 
            width="full"
          >
            Open Account
          </Button>
        </VStack>
      </Flex>
    </MotionBox>
  );
};

  return (
    <Box ref={containerRef} bg={bgGradient} overflow="hidden">
     <Box 
        as="section" 
        position="relative"
        pt={{ base: 18, md: 20 }}
        pb={{ base: 32, md: 48 }}
        overflow="hidden"
      >
        {/* Background image */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
        >
          <Image
            src="/images/background-image.png"
            alt="Background"
            width="100%"
            opacity="0.75"
            height="100%"
            objectFit="cover"
            objectPosition="center"
          />
        </Box>
        <Image
          src="/images/ldn-skyline.png"
          position="absolute"
          alt="Background"
          opacity="0.2"
          width="100%"
          zIndex={1}
          height="100%"
          objectFit="cover"
          objectPosition="center"
          />
          
        <Container maxW="container.xl" position="relative" zIndex="2">
          <motion.div style={{ scale: heroScale }}>
            <Flex
              direction={{ base: "column", lg: "row" }}
              align="center"
              justify="space-between"
              gap={{ base: 10, lg: 16 }}
            >
              <VStack spacing={8} align={{ base: "center", lg: "flex-start" }} textAlign={{ base: "center", lg: "left" }} maxW="3xl">
                <Heading
                  fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
                  fontWeight="bold"
                  color={headingColor}
                >
                  {t('trade.hero.title', 'Trade with Confidence')}
                </Heading>
                
                <Text fontSize={{ base: "lg", md: "xl" }} color={headingColor}>
                  Access global markets with a regulated Forex broker offering competitive spreads, fast execution, and powerful trading platforms.
                </Text>

                <HStack spacing={6} pt={4}>
                  <Button
                    size="lg"
                    px={8}
                    bg={accentColor}
                    color="white"
                    _hover={{ bg: "#9c8877" }}
                    h={14}
                    fontSize="lg"
                    onClick={() => router.push('/signup')}
                  >
                    {t('trade.hero.get_started', 'Open Account')}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    borderColor={accentColor}
                    color={accentColor}
                    px={8}
                    h={14}
                    fontSize="lg"
                    onClick={() => router.push('/demo')}
                  >
                    {t('hero.try_demo', 'Try Demo')}
                  </Button>
                </HStack>
              </VStack>
              
              <Box 
                maxW={{ base: "100%", lg: "100%" }}
                position="relative"
                shadow="2xl"
                borderRadius="lg"
                overflow="hidden"
              >
                <Image 
                  src="/images/trading-banner.png" 
                  alt="Trading Banner"
                  borderRadius="lg"
                />
              </Box>
            </Flex>
          </motion.div>
        </Container>
        <Box  
          maxW={{ base: "100%", lg: "100%" }}
          position="relative"
          shadow="2xl"
          borderRadius="lg"
          overflow="hidden"
        >
{/* 
          <Image
          src="/images/trading-features.png"
          alt="Hero Bottom"
          bottom={0}
          left={0}
          right={0}
          h="100%"
          /> */}
          {/* Trading features banner */}
        <Box
          left="0"
          position="relative"
          right="0"
          zIndex="3"
          mx="auto"
          px={{ base: 4, md: 6 }}
          maxW="container.xl"
        >
          <VStack 
            spacing={{ base: 4, md: 6 }}
            width="full"
          >
            {/* Desktop view: 3 columns */}
            <Grid 
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={{ base: 4, md: 6 }}
              w="full"
              display={{ base: "none", md: "grid" }}
            >
              {featureHighlights.map((feature, idx) => (
                <GridItem key={idx}>
                  <Box
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
                </GridItem>
              ))}
            </Grid>
            
            {/* Mobile view: 1 column */}
            <VStack
              spacing={4}
              w="full"
              display={{ base: "flex", md: "none" }}
            >
              {featureHighlights.map((feature, idx) => (
                <Box
                  key={idx}
                  bg={useColorModeValue('white', 'gray.800')}
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="xl"
                  width="100%"
                >
                  <HStack 
                    p={3}
                    alignItems="center"
                    spacing={3}
                  >
                    <Box width="80px" height="80px" flexShrink={0}>
                      <Center h="full">
                        <Image
                          src={feature.image}
                          alt={feature.title}
                          maxH="60px"
                          maxW="60px"
                          objectFit="contain"
                        />
                      </Center>
                    </Box>
                    <Box>
                      <Heading size="sm" mb={1} color={accentColor}>
                        {feature.title}
                      </Heading>
                      <Text fontSize="xs" color={textColor}>
                        {feature.description}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </VStack>
        </Box>
        </Box>
      </Box>

      <Container maxW="8xl" pt={{ base: 20, md: 28 }}>
        {/* Trading Products Section */}
        <Box mb={24}>
          <Heading
            textAlign="center"
            mb={12}
            fontSize={{ base: '3xl', md: '4xl' }}
            color={accentColor}
          >
            {t('trade.products.title', 'Trading Products')}
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mb={16}>
            {tradingProducts.map((product, index) => (
              <motion.div
                key={index}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Box
                  p={8}
                  h="full"
                  bg={glassCardBg}
                  borderRadius="xl"
                  borderColor={product.color}
                  borderWidth={2}
                  _hover={{
                    transform: 'translateY(-5px)',
                    boxShadow: 'xl'
                  }}
                  transition="all 0.3s ease"
                  position="relative"
                  overflow="hidden"
                >
                  <VStack align="start" spacing={6}>
                    <Flex width="full" justify="space-between" alignItems="center">
                      <Icon as={product.icon} boxSize={12} color={product.color} />
                      <Image
                        src={product.image}
                        alt={product.title}
                        height="60px"
                        objectFit="contain"
                      />
                    </Flex>
                    <Heading size="md" color={product.color}>
                      {product.title}
                    </Heading>
                    <Text>
                      {product.description}
                    </Text>
                    <List spacing={2} w="full">
                      {product.highlights.map((highlight, idx) => (
                        <ListItem key={idx} display="flex" alignItems="center">
                          <ListIcon as={FaCheckCircle} color={product.color} />
                          <Text fontSize="sm">{highlight}</Text>
                        </ListItem>
                      ))}
                    </List>
                    <Button
                      variant="outline"
                      borderColor={product.color}
                      color={product.color}
                      size="sm"
                      w="full"
                      onClick={() => router.push(`/markets/${product.title.toLowerCase()}`)}
                    >
                      Explore {product.title}
                    </Button>
                  </VStack>
                </Box>
              </motion.div>
            ))}
          </SimpleGrid>
        </Box>
        
        {/* Live Trading Chart */}
        <Box mb={24}>
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
      <Box 
        as="section" 
        py={{ base: 16, md: 24 }}
        position="relative"
      >
        <Container maxW="container.xl">
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
                    {t('mt5.title')}
                  </Heading>
                  
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color={isDark ? "gray.300" : "gray.600"}
                    maxW="600px"
                  >
                    {t('mt5.subtitle')}
                  </Text>
                  
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color={isDark ? "gray.300" : "gray.600"}
                    maxW="600px"
                  >
                    {t('mt5.description')}
                  </Text>
                  
                  <Button
                    bg="#8b7966"
                    color="white"
                    _hover={{ bg: "#9c7c63" }}
                    size="lg"
                    px={8}
                    onClick={() => router.push('/mt5')}
                    rightIcon={<Download />}
                    mt={4}
                  >
                    {t('mt5.download')}
                  </Button>
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
                  alt={t('mt5.imageAlt')}
                  width="100%"
                />
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>
        
        {/* Platform Features */}
        <Box mb={24}>
          <Heading
            textAlign="center"
            mb={12}
            fontSize={{ base: '3xl', md: '4xl' }}
            color={accentColor}
          >
            {t('trade.platform.title', 'Why Choose Forex by BitDash')}
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mb={16}>
            {platformFeatures.map((feature, index) => (
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
                  <Box
                    key={idx}
                    p={6}
                    bg={glassCardBg}
                    borderRadius="xl"
                    borderColor={accentColor}
                    borderWidth={1}
                    transition="all 0.3s ease"
                    _hover={{
                      transform: 'translateY(-5px)',
                      boxShadow: 'md'
                    }}
                  >
                    <VStack align="start" spacing={4}>
                      <Circle
                        size="50px"
                        bg={accentColor}
                        color="white"
                      >
                        <Icon as={feature.icon} boxSize={5} />
                      </Circle>
                      <Heading size="sm" color={accentColor}>
                        {feature.title}
                      </Heading>
                      <Text fontSize="sm">
                        {feature.description}
                      </Text>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </GridItem>
            
            <GridItem order={{ base: 1, lg: 2 }}>
              <VStack spacing={6} align={{ base: "center", lg: "flex-start" }} textAlign={{ base: "center", lg: "left" }}>
                <Heading
                  fontSize={{ base: "2xl", md: "3xl" }}
                  color={accentColor}
                >
                  Islamic Trading Accounts
                </Heading>
                <Text fontSize="lg" color={textColor}>
                  BitDash offers Shariah-compliant trading accounts that adhere to Islamic finance principles, ensuring that all transactions are ethical and transparent.
                </Text>
                <Text fontSize="lg" color={textColor}>
                  Our Islamic accounts have no swap rates, rollover interest, or hidden fees, making them suitable for Muslim traders who follow Shariah law.
                </Text>
                <Button
                  bg={accentColor}
                  color="white"
                  _hover={{ bg: "#9c8877" }}
                  px={8}
                  size="lg"
                  onClick={() => router.push('/islamic-account')}
                >
                  Learn More
                </Button>
              </VStack>
            </GridItem>
          </Grid>
        </Box>
        
        {/* Account Types Section */}
        <Box as="section" py={{ base: 16, md: 24 }}>
          <Container maxW="container.xl">
            <VStack spacing={12}>
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                textAlign="center"
                maxW="3xl"
                mx="auto"
              >
                <Text 
                  color="#8b7966" 
                  fontWeight="bold" 
                  mb={3}
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  {t('accounts.subtitle')}
                </Text>
                
                <Heading
                  fontSize={{ base: "3xl", md: "4xl" }}
                  fontWeight="bold"
                  color={isDark ? "white" : "#333"}
                  mb={5}
                >
                  {t('accounts.title')}
                </Heading>
              </MotionBox>
              
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} width="full">
                <AccountTypeCard
                  title={t('accounts.standard.title')}
                  minDeposit={t('accounts.standard.minDeposit')}
                  spread={t('accounts.standard.spread')}
                  leverage={t('accounts.standard.leverage')}
                  features={[
                    t('accounts.standard.feature1'),
                    t('accounts.standard.feature2'),
                    t('accounts.standard.feature3')
                  ]}
                  color="#8b7966"
                  popular={false}
                  delay={0}
                />
                
                <AccountTypeCard
                  title={t('accounts.premium.title')}
                  minDeposit={t('accounts.premium.minDeposit')}
                  spread={t('accounts.premium.spread')}
                  leverage={t('accounts.premium.leverage')}
                  features={[
                    t('accounts.premium.feature1'),
                    t('accounts.premium.feature2'),
                    t('accounts.premium.feature3'),
                    t('accounts.premium.feature4')
                  ]}
                  color="#8b7966"
                  popular={true}
                  delay={0.1}
                />
                
                <AccountTypeCard
                  title={t('accounts.professional.title')}
                  minDeposit={t('accounts.professional.minDeposit')}
                  spread={t('accounts.professional.spread')}
                  leverage={t('accounts.professional.leverage')}
                  features={[
                    t('accounts.professional.feature1'),
                    t('accounts.professional.feature2'),
                    t('accounts.professional.feature3'),
                    t('accounts.professional.feature4')
                  ]}
                  color="#8b7966"
                  popular={false}
                  delay={0.2}
                />
                
                <AccountTypeCard
                  title={t('accounts.institutional.title')}
                  minDeposit={t('accounts.institutional.minDeposit')}
                  spread={t('accounts.institutional.spread')}
                  leverage={t('accounts.institutional.leverage')}
                  features={[
                    t('accounts.institutional.feature1'),
                    t('accounts.institutional.feature2'),
                    t('accounts.institutional.feature3'),
                    t('accounts.institutional.feature4')
                  ]}
                  color="#8b7966"
                  popular={false}
                  delay={0.3}
                />
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>
        
        
        {/* Mobile App Section */}
        <Box mb={24}>
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={16} alignItems="center">
            <GridItem>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <VStack align="flex-start" spacing={8}>
                  <Heading
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight="bold"
                    color={accentColor}
                  >
                    DOWNLOAD BITDASH APPLICATION
                  </Heading>
                                    
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color={textColor}
                    fontWeight="bold"
                  >
                    STAY IN THE KNOW ANYWHERE, ANYTIME.
                  </Text>

                  <Text fontSize={{ base: "md", md: "lg" }} color={textColor} mt={2} mb={4}>
                    Trade on the go with our powerful mobile app. Get real-time market data, execute trades, and manage your account from anywhere in the world.
                  </Text>

                  <HStack spacing={4} mt={4}>
                    <Image 
                      src="/images/app-store.png" 
                      alt="App Store" 
                      height="50px"
                      cursor="pointer"
                      transition="transform 0.3s ease"
                      _hover={{ transform: "scale(1.05)" }}
                    />
                    <Image 
                      src="/images/google-play.png" 
                      alt="Google Play" 
                      height="50px"
                      cursor="pointer"
                      transition="transform 0.3s ease"
                      _hover={{ transform: "scale(1.05)" }}
                    />
                  </HStack>
                  </VStack>
                  </motion.div>
                  </GridItem>
                              
                  <GridItem>
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <Box 
                        borderRadius="xl" 
                        overflow="hidden" 
                        boxShadow="2xl"
                      >
                        <Image 
                          src="/images/dashboard-screenshot.png" 
                          alt="Mobile App Screenshot" 
                          width="100%"
                        />
                      </Box>
                    </motion.div>
                  </GridItem>
                  </Grid>
                  </Box>

                  {/* Account Opening Steps */}
                  <Box 
                    mb={24} 
                    bg={useColorModeValue("gray.50", "gray.900")} 
                    py={16}
                  >
                    <Container maxW="container.xl">
                      <Heading
                        textAlign="center"
                        mb={16}
                        fontSize={{ base: '3xl', md: '4xl' }}
                        color={accentColor}
                      >
                        Start Trading in 3 Simple Steps
                      </Heading>
                      
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
                        {[
                          {
                            title: "Register",
                            description: "Complete our quick and secure account registration process",
                            image: "/images/terms.png"
                          },
                          {
                            title: "Fund",
                            description: "Deposit funds using one of our multiple payment methods",
                            image: "/images/usd.png"
                          },
                          {
                            title: "Trade",
                            description: "Start trading over 100 instruments across global markets",
                            image: "/images/candlesticks.png"
                          }
                        ].map((step, idx) => (
                          <VStack key={idx} spacing={6}>
                            <Box
                              position="relative"
                              width="120px"
                              height="120px"
                            >
                              <Circle
                                size="120px"
                                bg={useColorModeValue("white", "gray.800")}
                                boxShadow="xl"
                                position="absolute"
                                opacity={0.9}
                              />
                              <Circle
                                size="100px"
                                bg={accentColor}
                                position="absolute"
                                top="10px"
                                left="10px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Image
                                  src={step.image}
                                  alt={step.title}
                                  width="50px"
                                  height="50px"
                                  objectFit="contain"
                                />
                              </Circle>
                            </Box>
                            <Heading size="md" color={accentColor}>{step.title}</Heading>
                            <Text textAlign="center">{step.description}</Text>
                          </VStack>
                        ))}
                      </SimpleGrid>
                      
                      <Center mt={12}>
                        <Button
                          size="lg"
                          bg={accentColor}
                          color="white"
                          _hover={{ bg: "#9c8877" }}
                          px={8}
                          onClick={() => router.push('/signup')}
                        >
                          Open Your Account Now
                        </Button>
                      </Center>
                    </Container>
                  </Box>

                  {/* Partnership (IB) Section */}
                  <Box mb={24}>
                    <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={16} alignItems="center">
                      <GridItem>
                        <motion.div
                          initial={{ opacity: 0, x: -50 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5 }}
                          viewport={{ once: true }}
                        >
                          <VStack spacing={6} align="flex-start">
                            <Heading 
                              fontSize={{ base: "2xl", md: "3xl" }}
                              fontWeight="bold"
                              color={accentColor}
                            >
                              BECOME A BITDASH PARTNER
                            </Heading>
                            
                            <Text
                              fontSize={{ base: "md", md: "lg" }}
                              color={textColor}
                              fontWeight="bold"
                            >
                              EXPAND YOUR BUSINESS WITH OUR IB PROGRAM
                            </Text>
                            
                            <Text fontSize={{ base: "md", md: "lg" }} color={textColor}>
                              Our Introducing Broker program offers competitive rebates, dedicated support, and powerful tools to help you grow your business.
                            </Text>
                            
                            <List spacing={3} mt={2}>
                              <ListItem display="flex" alignItems="center">
                                <ListIcon as={FaCheckCircle} color={accentColor} />
                                <Text>Competitive commission structures</Text>
                              </ListItem>
                              <ListItem display="flex" alignItems="center">
                                <ListIcon as={FaCheckCircle} color={accentColor} />
                                <Text>Dedicated partnership manager</Text>
                              </ListItem>
                              <ListItem display="flex" alignItems="center">
                                <ListIcon as={FaCheckCircle} color={accentColor} />
                                <Text>Marketing materials and support</Text>
                              </ListItem>
                              <ListItem display="flex" alignItems="center">
                                <ListIcon as={FaCheckCircle} color={accentColor} />
                                <Text>Advanced reporting tools</Text>
                              </ListItem>
                            </List>
                            
                            <Button
                              mt={4}
                              bg={accentColor}
                              color="white"
                              _hover={{ bg: "#9c8877" }}
                              px={8}
                              onClick={() => router.push('/partners')}
                            >
                              Become a Partner
                            </Button>
                          </VStack>
                        </motion.div>
                      </GridItem>
                      
                      <GridItem>
                        <motion.div
                          initial={{ opacity: 0, x: 50 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5 }}
                          viewport={{ once: true }}
                        >
                          <Image 
                            src="/images/ib.png" 
                            alt="Partnership Program" 
                          />
                        </motion.div>
                      </GridItem>
                    </Grid>
                  </Box>

                  {/* Regulatory Section */}
                  <Box mb={24}>
                    <Heading
                      textAlign="center"
                      mb={12}
                      fontSize={{ base: '3xl', md: '4xl' }}
                      color={accentColor}
                    >
                      {t('trade.regulatory.title', 'Regulated & Trusted Globally')}
                    </Heading>
                    
                    <Box
                      p={8}
                      bg={glassCardBg}
                      borderRadius="xl"
                      borderColor={accentColor}
                      borderWidth={2}
                      boxShadow="xl"
                    >
                      <Flex 
                        direction={{ base: "column", md: "row" }}
                        align="center"
                        justify="space-between"
                        mb={8}
                      >
                        <VStack align={{ base: "center", md: "start" }} mb={{ base: 6, md: 0 }}>
                          <Heading size="lg" color={accentColor}>
                            {t('trade.regulatory.subtitle', 'Your Security is Our Priority')}
                          </Heading>
                          <Text maxW="xl">
                            {t('trade.regulatory.description', 'Forex by BitDash is regulated by leading financial authorities across multiple jurisdictions, ensuring a secure and compliant trading environment for all clients.')}
                          </Text>
                        </VStack>
                        
                        <Image 
                          src="/images/shield.png" 
                          alt="Security Shield"
                          height="100px"
                          opacity={0.8}
                        />
                      </Flex>
                      
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                        {regulatoryInfo.map((reg, index) => (
                          <Flex 
                            key={index} 
                            bg={useColorModeValue('white', 'gray.800')}
                            p={4}
                            borderRadius="md"
                            boxShadow="sm"
                            align="center"
                          >
                            <Box 
                              minW="60px" 
                              h="60px" 
                              mr={4}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Image 
                                src={reg.logo}
                                alt={reg.authority}
                                height="50px"
                              />
                            </Box>
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="bold">{reg.authority}</Text>
                              <Text fontSize="sm">{reg.license}</Text>
                              <Text fontSize="xs" color="gray.500">{reg.country}</Text>
                            </VStack>
                          </Flex>
                        ))}
                      </SimpleGrid>
                      
                      <Wrap mt={8} spacing={4} justify="center">
                        <WrapItem>
                          <Tag size="lg" bg={accentColor} color="white" borderRadius="full">
                            Segregated Client Funds
                          </Tag>
                        </WrapItem>
                        <WrapItem>
                          <Tag size="lg" bg={accentColor} color="white" borderRadius="full">
                            Negative Balance Protection
                          </Tag>
                        </WrapItem>
                        <WrapItem>
                          <Tag size="lg" bg={accentColor} color="white" borderRadius="full">
                            SSL Encryption
                          </Tag>
                        </WrapItem>
                        <WrapItem>
                          <Tag size="lg" bg={accentColor} color="white" borderRadius="full">
                            Two-Factor Authentication
                          </Tag>
                        </WrapItem>
                      </Wrap>
                    </Box>
                  </Box>

                  {/* CTA Section */}
                  <Box
                    mb={24}
                    py={16}
                    borderRadius="2xl"
                    position="relative"
                    overflow="hidden"
                  >
                    <Image
                    src="/images/start-trading-cta.png"
                    alt="CTA Background"
                    position="relative"
                    width="100%"
                    height="100%"
                    objectFit="cover"
                    objectPosition="center"
                    />

                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bg={useColorModeValue("whiteAlpha.800", "blackAlpha.700")}
                      zIndex={1}
                    />
                    
                    <Container maxW="container.xl" position="relative" zIndex={2}>
                      <VStack spacing={8} textAlign="center">
                        <Heading
                          fontSize={{ base: '3xl', md: '4xl' }}
                          color={accentColor}
                        >
                          Ready to Start Trading?
                        </Heading>
                        
                        <Text fontSize="xl" maxW="3xl" mx="auto" color={textColor}>
                          Join thousands of traders worldwide who trust Forex by BitDash for their trading needs. Open an account today and experience the difference.
                        </Text>
                        
                        <HStack spacing={6} wrap="wrap" justify="center">
                          <Button
                            size="lg"
                            bg={accentColor}
                            color="white"
                            _hover={{ bg: "#9c8877" }}
                            h={14}
                            px={8}
                            leftIcon={<FaUser />}
                            onClick={() => router.push('/signup')}
                          >
                            Open Account
                          </Button>
                          
                          <Button
                            size="lg"
                            variant="outline"
                            borderColor={accentColor}
                            color={accentColor}
                            h={14}
                            px={8}
                            leftIcon={<FaWhatsapp />}
                            onClick={() => window.open("https://api.whatsapp.com/send?phone=00447538636207", "_blank")}
                          >
                            Contact Support
                          </Button>
                        </HStack>
                      </VStack>
                    </Container>
                  </Box>

                  {/* Legal Notices */}
                  <Box
                    py={10}
                    borderTop="1px solid"
                    borderColor={useColorModeValue("gray.200", "gray.700")}
                  >
                    <Container maxW="container.xl">
                      <VStack spacing={8} align="stretch">
                        <Heading size="md" color={accentColor}>
                          Risk Warning & Regulatory Information
                        </Heading>
                        
                        <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")} lineHeight="tall">
                          Contracts for Difference ('CFDs') are complex financial products that are traded on margin. Trading CFDs carries a high level of risk since leverage can work both to your advantage and disadvantage. As a result, CFDs may not be suitable for all investors because you may lose all your invested capital. You should not risk more than you are prepared to lose. Before deciding to trade, you need to ensure that you understand the risks involved taking into account your investment objectives and level of experience. Past performance of CFDs is not a reliable indicator of future results. Most CFDs have no set maturity date. Hence, a CFD position matures on the date you choose to close an existing open position. Seek independent advice, if necessary.
                        </Text>
                        
                        <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8}>
                          <GridItem>
                            <VStack align="flex-start" spacing={4}>
                              <Heading size="sm" color={textColor}>
                                Licensed and Regulated
                              </Heading>
                              
                              <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
                                BitDash LLC is officially licensed and regulated, holding an International Brokerage License in Saint Vincent and the Grenadines, numbered 1547 LLC. The registered address is Richmond Hill Rd, Kingstown, St. Vincent and the Grenadines, VC0100.
                              </Text>
                            </VStack>
                          </GridItem>
                          
                          <GridItem>
                            <VStack align="flex-start" spacing={4}>
                              <Heading size="sm" color={textColor}>
                                Restricted Jurisdictions
                              </Heading>
                              
                              <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
                                BitDash does not provide services to citizens and residents of certain jurisdictions such as United States of America, United Kingdom, Canada, Japan, EU countries, Iran, Israel and North Korea.
                              </Text>
                            </VStack>
                          </GridItem>
                        </Grid>
                      </VStack>
                    </Container>
                  </Box>
                </Container>
              </Box>
            );
          };

          export default ForexLandingBrowser;