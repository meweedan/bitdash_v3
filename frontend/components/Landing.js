import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  Button, 
  useColorMode, 
  Container,
  Flex,
  Circle,
  Icon,
  HStack,
  Grid,
  GridItem,
  SimpleGrid,
  Image,
  Divider,
  Center,
  Badge,
  useBreakpointValue
} from '@chakra-ui/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import PWALanding from './PWALanding';
import { 
  ArrowRight, 
  Users, 
  CheckCircle,
  Shield,
  Globe,
  CreditCard,
  Key,
  LineChart,
  BarChart2,
  TrendingUp,
  Layers,
  Clock,
  Award,
  Lock,
  Database,
  Server,
  Terminal,
  ChevronRight,
  Circle as CircleIcon,
  ArrowRightCircle,
  Zap,
  BookOpen,
  Info,
  DollarSign,
  PlayCircle,
  BookOpen as BookOpenIcon
} from 'lucide-react';
import { FaWhatsapp, FaChartLine, FaExchangeAlt, FaUniversity, FaShieldAlt, FaChevronRight, FaMosque, FaHandHoldingUsd, FaBalanceScale, FaFileContract } from 'react-icons/fa';

const checkIsPWA = () => {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone ||
    document.referrer.includes('android-app://')
  );
};

const MotionBox = motion(Box);
const ChakraBox = motion(Box);

// Custom parallax component
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

// Fade in animation variant
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function Landing() {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const [isPWAMode, setIsPWAMode] = useState(false);
  const router = useRouter();
  const isDark = colorMode === 'dark';
  
  useEffect(() => {
    const handlePWACheck = () => {
      setIsPWAMode(checkIsPWA());
    };

    handlePWACheck();
    window.addEventListener('load', handlePWACheck);
    
    // Check for display-mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addListener(handlePWACheck);

    return () => {
      window.removeEventListener('load', handlePWACheck);
      mediaQuery.removeListener(handlePWACheck);
    };
  }, []);

  if (isPWAMode) {
    return <PWALanding />;
  }

  // Section Components
  const HeroSection = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const parallaxOffset = useBreakpointValue({ base: 30, md: 100 });
    
    return (
      <Box 
        as="section" 
        position="relative"
        pt={{ base: 24, md: 40 }}
        pb={{ base: 32, md: 48 }}
        overflow="hidden"
      >
        {/* Background gradient */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex="0"
        />
        
        {/* Subtle grid pattern */}
        <Box
          position="absolute"
          width="100%"
          height="100%"
          top="0"
          left="0"
          opacity={isDark ? "0.05" : "0.03"}
          backgroundImage="url('/images/grid-pattern.svg')"
          backgroundSize="50px 50px"
          zIndex="0"
        />
        
        {/* Hero content */}
        <Container maxW="container.xl" position="relative" zIndex="1">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 16, lg: 20 }} alignItems="center">
            <GridItem>
              <MotionBox
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <VStack spacing={8} align="flex-start">
                  <Badge 
                    colorScheme="brand.bitdash" 
                    bg="brand.bitdash.500" 
                    color="white" 
                    px={3} 
                    py={1} 
                    borderRadius="full"
                    fontSize="sm"
                  >
                    {t('shariahCompliant', 'SHARIAH-COMPLIANT FINTECH')}
                  </Badge>
                  
                  <Heading
                    as="h1"
                    fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                    fontWeight="bold"
                    lineHeight={1.1}
                    letterSpacing="tight"
                    color={isDark ? "white" : "gray.800"}
                  >
                    {t('heroTitle', 'Islamic Financial Technology for the Modern Economy')}
                  </Heading>
                  
                  <Text
                    fontSize={{ base: "lg", md: "xl" }}
                    color={isDark ? "gray.300" : "gray.600"}
                    maxW="xl"
                    lineHeight="tall"
                  >
                    {t('heroDescription', 'BitDash delivers shariah-compliant fintech solutions that empower businesses with ethical financial operations across forex, payments, and investments.')}
                  </Text>
                  
                  <HStack spacing={5} pt={4}>
                    <Button
                      size="lg"
                      bg="brand.bitdash.600"
                      color="white"
                      _hover={{ bg: "brand.bitdash.700" }}
                      _active={{ bg: "brand.bitdash.700" }}
                      height="58px"
                      px={8}
                      fontSize="md"
                      fontWeight="bold"
                      rightIcon={<ArrowRightCircle size={18} />}
                      boxShadow="lg"
                      rounded="full"
                      onClick={() => router.push('/signup')}
                    >
                      {t('startTrial', 'Start Free Trial')}
                    </Button>
                    
                    <Button
                      leftIcon={<FaWhatsapp size={18} />}
                      size="lg"
                      variant="outline"
                      color="brand.bitdash.500"
                      borderColor="brand.bitdash.500"
                      _hover={{ bg: "brand.bitdash.50" }}
                      height="58px"
                      px={8}
                      fontSize="md"
                      borderWidth="2px"
                      rounded="full"
                      onClick={() => window.open("https://api.whatsapp.com/send?phone=00447538636207", "_blank")}
                    >
                      {t('scheduleDemo', 'Schedule Demo')}
                    </Button>
                  </HStack>
                  
                  <HStack spacing={8} pt={6} flexWrap="wrap">
                    <VStack align="flex-start" spacing={1}>
                      <Text fontSize="sm" color={isDark ? "gray.400" : "gray.500"}>
                        {t('statHeadingTransactions', 'MONTHLY TRANSACTIONS')}
                      </Text>
                      <Text fontSize="3xl" fontWeight="bold" color={isDark ? "white" : "gray.800"}>
                        $2.5B+
                      </Text>
                    </VStack>
                    
                    <VStack align="flex-start" spacing={1}>
                      <Text fontSize="sm" color={isDark ? "gray.400" : "gray.500"}>
                        {t('statHeadingClients', 'GLOBAL CLIENTS')}
                      </Text>
                      <Text fontSize="3xl" fontWeight="bold" color={isDark ? "white" : "gray.800"}>
                        180+
                      </Text>
                    </VStack>
                    
                    <VStack align="flex-start" spacing={1}>
                      <Text fontSize="sm" color={isDark ? "gray.400" : "gray.500"}>
                        {t('statHeadingUptime', 'SYSTEM UPTIME')}
                      </Text>
                      <Text fontSize="3xl" fontWeight="bold" color={isDark ? "white" : "gray.800"}>
                        99.99%
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>
              </MotionBox>
            </GridItem>
            
            <GridItem display={{ base: "none", lg: "block" }}>
              <ParallaxBox offset={parallaxOffset}>
                <MotionBox
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  position="relative"
                >
                  <Image 
                    src="/images/dashboard-mockup.png" 
                    alt="BitDash Financial Dashboard"
                    borderRadius="xl"
                    boxShadow="2xl"
                    width="full"
                  />
                  
                  {/* Floating elements */}
                  <MotionBox
                    position="absolute"
                    top="-40px"
                    right="40px"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    <Flex
                      bg={isDark ? "gray.800" : "white"}
                      boxShadow="lg"
                      borderRadius="xl"
                      p={4}
                      align="center"
                    >
                      <Circle size="40px" bg="green.100" color="green.500" mr={3}>
                        <Icon as={CheckCircle} boxSize={5} />
                      </Circle>
                      <VStack spacing={0} align="flex-start">
                        <Text fontWeight="bold">Shariah Certified</Text>
                        <Text fontSize="sm" color="gray.500">All transactions verified</Text>
                      </VStack>
                    </Flex>
                  </MotionBox>
                  
                  <MotionBox
                    position="absolute"
                    bottom="-30px"
                    left="30px"
                    animate={{ y: [0, 15, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                  >
                    <Flex
                      bg={isDark ? "gray.800" : "white"}
                      boxShadow="lg"
                      borderRadius="xl"
                      p={4}
                      align="center"
                    >
                      <Circle size="40px" bg="blue.100" color="brand.bitdash.500" mr={3}>
                        <Icon as={TrendingUp} boxSize={5} />
                      </Circle>
                      <VStack spacing={0} align="flex-start">
                        <Text fontWeight="bold">Forex Trading</Text>
                        <Text fontSize="sm" color="gray.500">0% commission</Text>
                      </VStack>
                    </Flex>
                  </MotionBox>
                </MotionBox>
              </ParallaxBox>
            </GridItem>
          </Grid>
        </Container>
        
        {/* SVG wave divider */}
        <Box
          position="absolute"
          bottom="-2px"
          left="0"
          right="0"
          height="150px"
          zIndex="1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path 
              fill={isDark ? "#1A202C" : "#F7FAFC"} 
              fillOpacity="1" 
              d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,218.7C672,203,768,149,864,117.3C960,85,1056,75,1152,80C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
            </path>
          </svg>
        </Box>
      </Box>
    );
  };
  
  const IslamicPrinciplesSection = () => {
    const principles = [
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
    
    return (
      <Box 
        as="section" 
        py={20} 
        position="relative"
        zIndex="2"
      >
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <MotionBox
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              textAlign="center"
            >
              <Text 
                color="brand.bitdash.500" 
                fontWeight="bold" 
                mb={3}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {t('islamicFinanceSubtitle', 'ISLAMIC FINANCE PRINCIPLES')}
              </Text>
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                color={isDark ? "white" : "gray.800"}
                mb={5}
              >
                {t('islamicFinanceTitle', 'Built On Strong Ethical Foundations')}
              </Heading>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={isDark ? "gray.300" : "gray.600"}
                maxW="3xl"
                mx="auto"
              >
                {t('islamicFinanceDescription', 'BitDash integrates Islamic financial principles into modern financial technology, ensuring all transactions are ethical, transparent, and shariah-compliant.')}
              </Text>
            </MotionBox>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
              {principles.map((principle, idx) => (
                <MotionBox
                  key={idx}
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
                        delay: idx * 0.1,
                        ease: [0.22, 1, 0.36, 1]
                      }
                    }
                  }}
                >
                  <Flex
                    direction="column"
                    p={8}
                    borderRadius="2xl"
                    bg={isDark ? "gray.800" : "white"}
                    boxShadow="lg"
                    height="full"
                    transition="all 0.3s"
                    _hover={{
                      transform: 'translateY(-8px)',
                      boxShadow: 'xl'
                    }}
                  >
                    <Circle
                      size="56px"
                      bg={isDark ? "gray.700" : "brand.bitdash.50"}
                      color="brand.bitdash.500"
                      mb={6}
                    >
                      <Icon as={principle.icon} boxSize={6} />
                    </Circle>
                    
                    <Heading
                      as="h3"
                      size="md"
                      fontWeight="bold"
                      mb={4}
                      color={isDark ? "white" : "gray.800"}
                    >
                      {principle.title}
                    </Heading>
                    
                    <Text
                      color={isDark ? "gray.300" : "gray.600"}
                      fontSize="md"
                    >
                      {principle.description}
                    </Text>
                  </Flex>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    );
  };
  
  const PlatformSection = () => {
    const platforms = [
      {
        name: t('bitcash.name', 'BitCash'),
        icon: CreditCard,
        description: t('bitcash.description', 'Shariah-compliant payment solutions with seamless cross-border transactions and 0% hidden fees.'),
        subdomain: "cash.bitdash.app",
        color: "brand.bitdash.500",
        bgGradient: "linear(to-br, brand.bitdash.400, brand.bitdash.700)"
      },
      {
        name: t('bitfund.name', 'BitFund'),
        icon: LineChart,
        description: t('bitfund.description', 'Ethical trading platform with verified performance-based funding for traders following Islamic principles.'),
        subdomain: "fund.bitdash.app",
        color: "brand.bitdash.500",
        bgGradient: "linear(to-br, brand.bitdash.400, brand.bitdash.700)"
      },
      {
        name: t('bitstock.name', 'BitStock'),
        icon: BarChart2,
        description: t('bitstock.description', 'Shariah-compliant investment platform tailored for MENA & GCC investors to access global halal markets.'),
        subdomain: "stock.bitdash.app",
        color: "brand.bitdash.500",
        bgGradient: "linear(to-br, brand.bitdash.400, brand.bitdash.700)"
      },
      {
        name: t('bittrade.name', 'BitTrade'),
        icon: TrendingUp,
        description: t('bittrade.description', 'Regulated Islamic forex trading with zero interest (riba) and institutional-grade security protocols.'),
        subdomain: "trade.bitdash.app",
        color: "brand.bitdash.500",
        bgGradient: "linear(to-br, brand.bitdash.400, brand.bitdash.700)"
      }
    ];

    return (
      <Box 
        as="section" 
        py={24} 
        position="relative"
        overflow="hidden"
      >
        {/* Decorative elements */}
        <Box
          position="absolute"
          width="600px"
          height="600px"
          borderRadius="full"
          bg="brand.bitdash.500"
          opacity="0.05"
          top="-300px"
          left="-100px"
        />
        
        <Box
          position="absolute"
          width="400px"
          height="400px"
          borderRadius="full"
          bg="brand.bitdash.400"
          opacity="0.05"
          bottom="-200px"
          right="-100px"
        />
        
        <Container maxW="container.xl" position="relative">
          <VStack spacing={16}>
            <MotionBox
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              textAlign="center"
            >
              <Text 
                color="brand.bitdash.500" 
                fontWeight="bold" 
                mb={3}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {t('platformSubtitle', 'COMPREHENSIVE ECOSYSTEM')}
              </Text>
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                color={isDark ? "white" : "gray.800"}
                mb={5}
              >
                {t('platformTitle', 'Our Shariah-Compliant Solutions')}
              </Heading>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={isDark ? "gray.300" : "gray.600"}
                maxW="3xl"
                mx="auto"
              >
                {t('platformDescription', 'Integrated Islamic financial technology solutions designed for modern businesses, from halal payment processing to ethical trading systems.')}
              </Text>
            </MotionBox>
            
            <SimpleGrid 
              templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
              gap={10}
              w="full"
            >
              {platforms.map((platform, idx) => (
                <ParallaxBox 
                  key={platform.name} 
                  offset={20}
                >
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
                          duration: 0.7, 
                          delay: idx * 0.15,
                          ease: [0.22, 1, 0.36, 1]
                        }
                      }
                    }}
                  >
                    <Grid
                      templateColumns={{ base: "1fr", md: "100px 1fr" }}
                      gap={6}
                      p={8}
                      borderRadius="2xl"
                      bg={isDark ? "gray.800" : "white"}
                      boxShadow="lg"
                      overflow="hidden"
                      position="relative"
                      onClick={() => window.location.href = `https://${platform.subdomain}`}
                      cursor="pointer"
                      transition="all 0.3s"
                      _hover={{
                        transform: 'translateY(-8px)',
                        boxShadow: 'xl'
                      }}
                    >
                      {/* Icon in circle with gradient background */}
                      <GridItem>
                        <Center 
                          h="100px" 
                          w="100px" 
                          borderRadius="full"
                          bgGradient={platform.bgGradient}
                          color="white"
                        >
                          <Icon as={platform.icon} boxSize={8} />
                        </Center>
                      </GridItem>
                      
                      {/* Content */}
                      <GridItem>
                        <VStack align="flex-start" spacing={4}>
                          <Heading
                            as="h3"
                            size="lg"
                            fontWeight="bold"
                            color={isDark ? "white" : "gray.800"}
                          >
                            {platform.name}
                          </Heading>
                          
                          <Text
                            color={isDark ? "gray.300" : "gray.600"}
                            fontSize="md"
                          >
                            {platform.description}
                          </Text>
                          
                          <Flex 
                            align="center"
                            color="brand.bitdash.500" 
                            fontWeight="medium"
                            mt={2}
                          >
                            <Text>{t('exploreService', 'Explore Service')}</Text>
                            <Icon as={ArrowRight} boxSize={4} ml={2} />
                          </Flex>
                        </VStack>
                      </GridItem>
                      
                      {/* Subtle decorative element */}
                      <Box
                        position="absolute"
                        width="200px"
                        height="200px"
                        borderRadius="full"
                        bg={platform.color}
                        opacity="0.05"
                        bottom="-100px"
                        right="-100px"
                      />
                    </Grid>
                  </MotionBox>
                </ParallaxBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    );
  };

  const FeaturesSection = () => {
  const features = [
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Process Shariah-compliant payments internationally with transparent fees and instant settlement.'
    },
    {
      icon: Shield,
      title: 'Ethical Security',
      description: 'Bank-grade encryption and compliance with both international and Islamic financial regulations.'
    },
    {
      icon: Database,
      title: 'Halal Analytics',
      description: 'Advanced financial data visualization and predictive analytics for informed decision-making.'
    },
    {
      icon: Server,
      title: 'Scalable Infrastructure',
      description: 'Cloud architecture that grows with your business while maintaining Shariah compliance.'
    },
    {
      icon: Lock,
      title: 'Regulatory Compliance',
      description: 'Stay compliant with regional, international, and Islamic financial regulations.'
    },
    {
      icon: Layers,
      title: 'Multi-Asset Platform',
      description: 'Trade and manage diverse Shariah-compliant asset classes from a single unified dashboard.'
    }
  ];
  
  return (
    <Box 
      as="section" 
      py={24} 
      position="relative"
    >
      {/* SVG wave divider at top */}
      <Box
        position="absolute"
        top="-2px"
        left="0"
        right="0"
        height="150px"
        transform="rotate(180deg)"
        zIndex="1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <path 
            fill={isDark ? "#171923" : "#FFFFFF"} 
            fillOpacity="1" 
            d="M0,128L48,133.3C96,139,192,149,288,144C384,139,480,117,576,122.7C672,128,768,160,864,170.7C960,181,1056,171,1152,154.7C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
          </path>
        </svg>
      </Box>
      
      <Container maxW="container.xl" position="relative" zIndex="2">
        <VStack spacing={16}>
          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            textAlign="center"
          >
            <Text 
              color="brand.bitdash.500" 
              fontWeight="bold" 
              mb={3}
              textTransform="uppercase"
              letterSpacing="wide"
            >
              {t('featuresSubtitle', 'POWERFUL CAPABILITIES')}
            </Text>
            <Heading
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              color={isDark ? "white" : "gray.800"}
              mb={5}
            >
              {t('featuresTitle', 'Enterprise-Grade Islamic Fintech')}
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={isDark ? "gray.300" : "gray.600"}
              maxW="3xl"
              mx="auto"
            >
              {t('featuresDescription', 'Comprehensive tools and technologies designed for Islamic financial institutions and businesses seeking ethical financial solutions.')}
            </Text>
          </MotionBox>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} w="full">
            {features.map((feature, idx) => (
              <ParallaxBox 
                key={idx}
                offset={10}
              >
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
                        delay: idx * 0.1,
                        ease: [0.22, 1, 0.36, 1]
                      }
                    }
                  }}
                >
                  <Flex
                    direction="column"
                    p={8}
                    borderRadius="2xl"
                    bg={isDark ? "gray.700" : "white"}
                    boxShadow="lg"
                    height="full"
                    transition="all 0.3s"
                    _hover={{
                      transform: 'translateY(-8px)',
                      boxShadow: 'xl',
                      borderColor: "brand.bitdash.500",
                      borderWidth: "1px"
                    }}
                  >
                    <Circle
                      size="56px"
                      bgGradient="linear(to-br, brand.bitdash.400, brand.bitdash.600)"
                      color="white"
                      mb={6}
                    >
                      <Icon as={feature.icon} boxSize={5} />
                    </Circle>
                    
                    <Heading
                      as="h3"
                      size="md"
                      fontWeight="bold"
                      mb={4}
                      color={isDark ? "white" : "gray.800"}
                    >
                      {feature.title}
                    </Heading>
                    
                    <Text
                      color={isDark ? "gray.300" : "gray.600"}
                      fontSize="md"
                    >
                      {feature.description}
                    </Text>
                  </Flex>
                </MotionBox>
              </ParallaxBox>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};
  
  const AppShowcaseSection = () => {
    return (
      <Box 
        as="section" 
        py={32} 
        position="relative"
        overflow="hidden"
      >
        {/* Background gradient elements */}
        <Box
          position="absolute"
          width="900px"
          height="900px"
          borderRadius="full"
          bg="brand.bitdash.500"
          opacity="0.03"
          top="-400px"
          right="-400px"
        />
        
        <Box
          position="absolute"
          width="600px"
          height="600px"
          borderRadius="full"
          bg="brand.bitdash.400"
          opacity="0.03"
          bottom="-300px"
          left="-300px"
        />
        
        <Container maxW="container.xl" position="relative">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={16} alignItems="center">
            <GridItem order={{ base: 2, lg: 1 }}>
              <ParallaxBox offset={40}>
                <MotionBox
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                >
                  <Image 
                    src="/images/bitdash-mobile-app.png" 
                    alt="BitDash Mobile App"
                    borderRadius="2xl"
                    boxShadow="2xl"
                  />
                </MotionBox>
              </ParallaxBox>
            </GridItem>
            
            <GridItem order={{ base: 1, lg: 2 }}>
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
              >
                <VStack spacing={8} align="flex-start">
                  <Text 
                    color="brand.bitdash.500" 
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    {t('mobileAppSubtitle', 'SEAMLESS MOBILE EXPERIENCE')}
                  </Text>
                  
                  <Heading
                    fontSize={{ base: "3xl", md: "4xl" }}
                    fontWeight="bold"
                    color={isDark ? "white" : "gray.800"}
                    lineHeight={1.2}
                  >
                    {t('mobileAppTitle', 'Manage Your Islamic Finances On The Go')}
                  </Heading>
                  
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color={isDark ? "gray.300" : "gray.600"}
                  >
                    {t('mobileAppDescription', 'Access all BitDash services from our powerful mobile application. Execute trades, process payments, and monitor investments while maintaining Shariah compliance, all from the palm of your hand.')}
                  </Text>
                  
                  <VStack spacing={5} align="flex-start" width="full">
                    {[
                      {
                        icon: Zap,
                        title: 'Instant Notifications',
                        description: 'Real-time alerts for trades, payments, and important financial events.'
                      },
                      {
                        icon: Shield,
                        title: 'Biometric Security',
                        description: 'Enterprise-grade protection with facial recognition and fingerprint authentication.'
                      },
                      {
                        icon: BookOpenIcon,
                        title: 'Islamic Finance Learning',
                        description: 'Educational resources on Shariah-compliant investing and financial principles.'
                      }
                    ].map((feature, idx) => (
                      <HStack key={idx} spacing={4} width="full">
                        <Circle 
                          size="40px" 
                          bgGradient="linear(to-br, brand.bitdash.400, brand.bitdash.600)"
                          color="white"
                        >
                          <Icon as={feature.icon} boxSize={4} />
                        </Circle>
                        
                        <VStack spacing={0} align="flex-start">
                          <Text fontWeight="bold" color={isDark ? "white" : "gray.800"}>
                            {feature.title}
                          </Text>
                          <Text fontSize="sm" color={isDark ? "gray.400" : "gray.600"}>
                            {feature.description}
                          </Text>
                        </VStack>
                      </HStack>
                    ))}
                  </VStack>
                  
                  <HStack spacing={6} pt={3}>
                    <Button
                      leftIcon={<FaWhatsapp size={18} />}
                      size="lg"
                      bg="brand.bitdash.600"
                      color="white"
                      _hover={{ bg: "brand.bitdash.700" }}
                      height="56px"
                      px={8}
                      fontSize="md"
                      fontWeight="bold"
                      borderRadius="full"
                      boxShadow="md"
                      onClick={() => window.open("https://api.whatsapp.com/send?phone=00447538636207", "_blank")}
                    >
                      {t('demoApp', 'Request Demo')}
                    </Button>
                    
                    <Button
                      rightIcon={<PlayCircle size={18} />}
                      size="lg"
                      variant="outline"
                      borderColor="brand.bitdash.500"
                      color="brand.bitdash.500"
                      _hover={{ bg: "brand.bitdash.50" }}
                      height="56px"
                      px={8}
                      fontSize="md"
                      borderRadius="full"
                      borderWidth="2px"
                      onClick={() => window.open("#", "_blank")}
                    >
                      {t('watchVideo', 'Watch Video')}
                    </Button>
                  </HStack>
                </VStack>
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>
    );
  };
  
  const TestimonialSection = () => {
    const testimonials = [
      {
        quote: "BitDash's shariah-compliant fintech suite has transformed how we handle cross-border payments, reducing settlement time while ensuring ethical compliance.",
        author: "Sarah Al-Mansouri",
        company: "CFO at GulfTech Solutions",
        image: "/images/testimonial-1.jpg"
      },
      {
        quote: "Implementing BitFund has allowed us to scale our trading operations globally while maintaining full adherence to Islamic financial principles.",
        author: "James Chen",
        company: "Director at Apex Trading Group",
        image: "/images/testimonial-2.jpg"
      },
      {
        quote: "The integration between all BitDash platforms gives us a competitive edge in serving our MENA clients with global halal investment opportunities.",
        author: "Mohammed Al-Harbi",
        company: "CEO at Riyadh Financial Advisors",
        image: "/images/testimonial-3.jpg"
      }
    ];
    
    return (
      <Box 
        as="section" 
        py={24} 
        position="relative"
      >
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <MotionBox
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              textAlign="center"
            >
              <Text 
                color="brand.bitdash.500" 
                fontWeight="bold" 
                mb={3}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {t('testimonialsSubtitle', 'CLIENT TESTIMONIALS')}
              </Text>
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                color={isDark ? "white" : "gray.800"}
                mb={5}
              >
                {t('testimonialsTitle', 'Trusted by Islamic Financial Institutions')}
              </Heading>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={isDark ? "gray.300" : "gray.600"}
                maxW="3xl"
                mx="auto"
              >
                {t('testimonialsDescription', 'See what our clients say about our shariah-compliant financial technology solutions and services.')}
              </Text>
            </MotionBox>
            
            <Grid 
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={8}
              w="full"
            >
              {testimonials.map((testimonial, idx) => (
                <ParallaxBox
                  key={idx}
                  offset={20}
                >
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
                          delay: idx * 0.15,
                          ease: [0.22, 1, 0.36, 1]
                        }
                      }
                    }}
                  >
                    <Flex
                      direction="column"
                      p={8}
                      borderRadius="2xl"
                      bg={isDark ? "gray.700" : "white"}
                      boxShadow="lg"
                      height="full"
                      position="relative"
                      zIndex="1"
                    >
                      <Icon 
                        as={Info} 
                        boxSize={10} 
                        color="brand.bitdash.500" 
                        opacity={0.15} 
                        mb={4} 
                      />
                      
                      <Text
                        fontSize="lg"
                        fontStyle="italic"
                        color={isDark ? "gray.300" : "gray.600"}
                        mb={8}
                        zIndex="2"
                      >
                        "{testimonial.quote}"
                      </Text>
                      
                      <HStack spacing={4} mt="auto">
                        <Image 
                          src={testimonial.image}
                          fallbackSrc="https://via.placeholder.com/60"
                          alt={testimonial.author}
                          boxSize="60px"
                          borderRadius="full"
                          objectFit="cover"
                        />
                        
                        <VStack spacing={0} align="flex-start">
                          <Text fontWeight="bold" color={isDark ? "white" : "gray.800"}>
                            {testimonial.author}
                          </Text>
                          <Text fontSize="sm" color={isDark ? "gray.400" : "gray.500"}>
                            {testimonial.company}
                          </Text>
                        </VStack>
                      </HStack>
                      
                      {/* Decorative element */}
                      <Box
                        position="absolute"
                        right="0"
                        bottom="0"
                        width="150px"
                        height="150px"
                        bgGradient="linear(to-tr, brand.bitdash.500, brand.bitdash.400)"
                        opacity="0.05"
                        borderTopLeftRadius="full"
                        zIndex="0"
                      />
                    </Flex>
                  </MotionBox>
                </ParallaxBox>
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>
    );
  };
  
  const CTASection = () => {
    return (
      <Box 
        as="section" 
        py={24} 
        position="relative"
        overflow="hidden"
      >
        {/* Background elements */}
        <Box
          position="absolute"
          width="500px"
          height="500px"
          borderRadius="full"
          bg="brand.bitdash.500"
          opacity="0.05"
          top="-250px"
          left="-200px"
        />
        
        <Box
          position="absolute"
          width="600px"
          height="600px"
          borderRadius="full"
          bg="brand.bitdash.400"
          opacity="0.05"
          bottom="-300px"
          right="-200px"
        />
        
        <Container maxW="container.xl" position="relative">
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
              borderRadius="3xl"
              bgGradient={isDark 
                ? "linear(to-br, gray.800, gray.700)" 
                : "linear(to-br, white, gray.50)"
              }
              boxShadow="xl"
              borderWidth="1px"
              borderColor={isDark ? "gray.700" : "gray.100"}
              position="relative"
              overflow="hidden"
            >
              {/* Decorative gradient overlay */}
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                height="6px"
                bgGradient="linear(to-r, brand.bitdash.400, brand.bitdash.600)"
              />
              
              <VStack spacing={8} maxW="3xl" position="relative" zIndex="1">
                <Text 
                  color="brand.bitdash.500" 
                  fontWeight="bold" 
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  {t('ctaSubtitle', 'START YOUR JOURNEY')}
                </Text>
                <Heading
                  fontSize={{ base: "3xl", md: "4xl" }}
                  fontWeight="bold"
                  color={isDark ? "white" : "gray.800"}
                >
                  {t('ctaTitle', 'Ready to Transform Your Financial Operations?')}
                </Heading>
                
                <Text 
                  fontSize="lg" 
                  color={isDark ? "gray.300" : "gray.600"}
                  maxW="2xl"
                >
                  {t('ctaText', 'Join leading Islamic financial institutions already leveraging our shariah-compliant fintech ecosystem to streamline operations, reduce costs, and ensure ethical financial practices.')}
                </Text>
                
                <HStack spacing={6} pt={4} wrap="wrap" justify="center">
                  <Button
                    size="lg"
                    color="white"
                    height="58px"
                    px={8}
                    fontSize="md"
                    fontWeight="bold"
                    borderRadius="full"
                    boxShadow="lg"
                    rightIcon={<ArrowRightCircle size={18} />}
                    onClick={() => router.push('/signup')}
                  >
                    {t('ctaButton', 'Start Your Free Trial')}
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="bitdash-outline"
                    height="58px"
                    px={8}
                    fontSize="md"
                    borderRadius="full"
                    borderWidth="2px"
                    leftIcon={<FaWhatsapp size={18} />}
                    onClick={() => window.open("https://api.whatsapp.com/send?phone=00447538636207", "_blank")}
                  >
                    {t('scheduleDemo', 'Schedule Demo')}
                  </Button>
                </HStack>
              </VStack>
              
              {/* Decorative elements */}
              <Box
                position="absolute"
                bottom="30px"
                left="30px"
                width="120px"
                height="120px"
                opacity="0.1"
                borderRadius="full"
                bgGradient="linear(to-r, brand.bitdash.400, brand.bitdash.600)"
              />
              
              <Box
                position="absolute"
                top="60px"
                right="40px"
                width="80px"
                height="80px"
                opacity="0.1"
                borderRadius="full"
                bgGradient="linear(to-r, brand.bitdash.600, brand.bitdash.400)"
              />
            </Flex>
          </MotionBox>
        </Container>
      </Box>
    );
  };

  return (
    <Box>
      <HeroSection />
      <IslamicPrinciplesSection />
      <PlatformSection />
      <FeaturesSection />
      <AppShowcaseSection />
      <TestimonialSection />
      <CTASection />
    </Box>
  );
}