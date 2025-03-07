import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
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
  useColorMode,
  colorMode,
  Link,
  useColorModeValue,
  Flex,
  Icon,
  Badge,
  Grid,
  GridItem,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatArrow,
  StatGroup,
  Avatar,
  Wrap,
  WrapItem,
  Tag,
  Image,
  useBreakpointValue,
  Center,
  Circle,
  chakra,
  Tooltip
} from '@chakra-ui/react';
import { 
  FaChartLine,
  FaGlobeAmericas,
  FaShieldAlt,
  FaUsers,
  FaExchangeAlt,
  FaMobileAlt,
  FaUniversity,
  FaCoins,
  FaOilCan,
  FaBuilding,
  FaUserTie,
  FaCheckCircle,
  FaMapMarkedAlt,
  FaStar,
  FaRegCreditCard,
  FaHandshake,
  FaArrowRight,
  FaArrowDown,
  FaLock,
  FaBriefcase,
  FaChartPie,
  FaRocket,
  FaSearch
} from 'react-icons/fa';
import { CheckCircle } from 'lucide-react';
import MarketOverview from '@/components/stock/MarketOverview';
import AdvancedChart from '@/components/AdvancedChart';
import AssetPerformanceChart from '@/components/stock/AssetPerformanceChart';
import StocksMatrix from '../StocksMatrix';


const BitStockLanding = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const containerRef = useRef(null);
  const isRTL = router.locale === 'ar';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  const bgGradient = useColorModeValue(
    'linear(to-b, #F8F9FA, white)',
    'linear(to-b, gray.900, black)'
  );
  
  const headingSize = useBreakpointValue({ base: "3xl", md: "4xl", lg: "5xl" });
  const accentColor = '#8b7966';
  
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
    [0, 0.2],
    [1, 0.95]
  );

  const marketOverviewOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2],
    [1, 0.8, 0]
  );


// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
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

// Custom animated stat component
const AnimatedStat = ({ icon, label, value, color, delay = 0 }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    let startTimestamp;
    const duration = 1500;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setAnimatedValue(Math.floor(progress * numericValue));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    const animationId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationId);
  }, [value]);
  
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }
        }
      }}
    >
      <VStack
        p={8}
        borderRadius="xl"
        boxShadow="xl"
        spacing={4}
        height="full"
        borderLeft="4px solid"
        borderColor={color}
        position="relative"
        overflow="hidden"
        _hover={{
          transform: 'translateY(-5px)',
          boxShadow: '2xl'
        }}
        transition="all 0.3s ease"
      >
        <Circle 
          position="absolute" 
          right="-20px"
          top="-20px"
          size="100px" 
          bg={color} 
          opacity={0.1}
        />
        <Icon as={icon} boxSize={10} color={color} />
        <Text fontWeight="bold" fontSize="lg">{label}</Text>
        <Text fontSize="4xl" fontWeight="bold" color={color}>
          {value.includes('k') ? 
            `${animatedValue}k+` : 
            value.includes('M') ? 
              `${(animatedValue / 1000000).toFixed(1)}M+` : 
              animatedValue}
        </Text>
      </VStack>
    </motion.div>
  );
};

// Feature card component
const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div
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
            delay: index * 0.1,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }}
    >
      <Box 
        ref={containerRef}
        overflow="hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
        p={8}
        h="full"
        bg={useColorModeValue('white', 'gray.800')}
        borderRadius="xl"
        boxShadow="lg"
        borderLeft="4px solid"
        borderColor={feature.color}
        position="relative"
        _hover={{
          transform: 'translateY(-8px)',
          boxShadow: '2xl'
        }}
        transition="all 0.3s ease"
      >
        <Circle
          position="absolute"
          top="-20px"
          right="-20px"
          size="100px"
          bg={feature.color}
          opacity={0.1}
        />
        
        <VStack align="start" spacing={6}>
          <Icon as={feature.icon} boxSize={12} color={feature.color} />
          <Heading size="md" color={feature.color}>
            {feature.title}
          </Heading>
          <Text>
            {feature.description}
          </Text>
        </VStack>
      </Box>
    </motion.div>
  );
};

// Investment option card component
const InvestmentCard = ({ option, index }) => {
  return (
    <motion.div
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
            delay: index * 0.15,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }}
    >
      <Box
        p={8}
        h="full"
        bg={useColorModeValue('white', 'gray.800')}
        borderRadius="xl"
        boxShadow="lg"
        borderLeft="4px solid"
        borderColor={option.color}
        position="relative"
        overflow="hidden"
        _hover={{
          transform: 'translateY(-8px)',
          boxShadow: '2xl'
        }}
        transition="all 0.3s ease"
      >
 
        <Circle
          position="absolute"
          top="-20px"
          right="-20px"
          size="100px"
          bg={option.color}
          opacity={0.1}
        />
        
        <VStack align="start" spacing={6}>
          <Icon as={option.icon} boxSize={12} color={option.color} />
          <Heading size="md" color={option.color}>
            {option.title}
          </Heading>
          <Text>
            {option.description}
          </Text>
          <Button
            mt="auto"
            variant="outline"
            color={option.color}
            borderColor={option.color}
            size="md"
            rightIcon={<FaArrowRight />}
            _hover={{
              bg: option.color,
              color: 'white'
            }}
          >
            Learn More
          </Button>
        </VStack>
      </Box>
    </motion.div>
  );
};

  // Features
  const features = [
    {
      icon: FaGlobeAmericas,
      title: t('stock.features.global.title', 'Global Markets Access'),
      description: t('stock.features.global.description', 'Seamless access to US and EU stock markets with localized support and trading hours'),
      color: 'brand.stocks.400'
    },
    {
      icon: FaMobileAlt,
      title: t('stock.features.mobile.title', 'Mobile Trading Platform'),
      description: t('stock.features.mobile.description', 'Trade anytime, anywhere with our award-winning mobile app designed for MENA users'),
      color: 'brand.stocks.500'
    },
    {
      icon: FaShieldAlt,
      title: t('stock.features.compliant.title', 'Compliant Investing'),
      description: t('stock.features.compliant.description', 'Fully compliant with regional regulations while providing access to global markets'),
      color: 'brand.stocks.600'
    },
    {
      icon: FaRegCreditCard,
      title: t('stock.features.payment.title', 'Local Payment Methods'),
      description: t('stock.features.payment.description', 'Deposit and withdraw using popular payment methods in the MENA and GCC regions'),
      color: 'brand.stocks.700'
    }
  ];

  // Investment options
  const investmentOptions = [
    {
      icon: FaChartLine,
      title: t('stock.investment.stocks.title', 'US & EU Stocks'),
      description: t('stock.investment.stocks.description', 'Access over 5,000 stocks from the world\'s largest exchanges with zero commission'),
      badge: t('stock.most.popular', 'Most Popular'),
      color: 'brand.stocks.400'
    },
    {
      icon: FaBuilding,
      title: t('stock.investment.private.title', 'Private Assets'),
      description: t('stock.investment.private.description', 'Exclusive access to pre-IPO companies and private equity opportunities with minimum investments of $1,000'),
      badge: t('stock.exclusive', 'Exclusive'),
      color: 'brand.stocks.500'
    },
    {
      icon: FaCoins,
      title: t('stock.investment.gold.title', 'Gold & Precious Metals'),
      description: t('stock.investment.gold.description', 'Invest in gold and other precious metals with full ownership or through ETFs and funds'),
      badge: t('stock.traditional', 'Traditional'),
      color: 'brand.stocks.600'
    },
    {
      icon: FaOilCan,
      title: t('stock.investment.oil.title', 'Oil & Commodities'),
      description: t('stock.investment.oil.description', 'Trade oil futures or invest in energy companies with specialized regional insights'),
      badge: t('stock.strategic', 'Strategic'),
      color: 'brand.stocks.700'
    }
  ];

  // Regional benefits
  const regionalBenefits = [
    {
      title: t('stock.benefits.arabic.title', 'Arabic Interface'),
      description: t('stock.benefits.arabic.description', 'Fully localized Arabic interface with regional market insights and analysis')
    },
    {
      title: t('stock.benefits.shariah.title', 'Shariah-Compliant Options'),
      description: t('stock.benefits.shariah.description', 'Filter and invest in Shariah-compliant stocks and funds with ease')
    },
    {
      title: t('stock.benefits.support.title', 'Local Support Team'),
      description: t('stock.benefits.support.description', '24/7 customer support from our offices in Dubai, Riyadh, and Cairo')
    },
    {
      title: t('stock.benefits.banks.title', 'Regional Bank Integration'),
      description: t('stock.benefits.banks.description', 'Seamless deposit and withdrawal with major MENA and GCC banks')
    },
    {
      title: t('stock.benefits.hours.title', 'Regional Market Hours'),
      description: t('stock.benefits.hours.description', 'Extended trading hours aligned with GCC time zones')
    },
    {
      title: t('stock.benefits.research.title', 'Dual Language Research'),
      description: t('stock.benefits.research.description', 'Investment research and reports available in both English and Arabic')
    }
  ];

  // Regulatory information
  const regulatoryInfo = [
    {
      authority: t('stock.regulatory.dfsa.name', 'Dubai Financial Services Authority (DFSA)'),
      license: t('stock.regulatory.dfsa.license', 'License No. F0099'),
      country: t('stock.regulatory.uae', 'UAE')
    },
    {
      authority: t('stock.regulatory.cma.name', 'Capital Market Authority (CMA)'),
      license: t('stock.regulatory.cma.license', 'Authorization No. 23-455'),
      country: t('stock.regulatory.saudi', 'Saudi Arabia')
    },
    {
      authority: t('stock.regulatory.fra.name', 'Financial Regulatory Authority (FRA)'),
      license: t('stock.regulatory.fra.license', 'License No. 12877'),
      country: t('stock.regulatory.egypt', 'Egypt')
    },
    {
      authority: t('stock.regulatory.cbb.name', 'Central Bank of Bahrain (CBB)'),
      license: t('stock.regulatory.cbb.license', 'Investment Business Firm License IBF-235'),
      country: t('stock.regulatory.bahrain', 'Bahrain')
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: t('stock.testimonials.ahmed.name', 'Ahmed K.'),
      location: t('stock.testimonials.ahmed.location', 'Dubai, UAE'),
      image: '/images/testimonials/ahmed.jpg',
      quote: t('stock.testimonials.ahmed.quote', 'BitStocks made investing in US tech stocks incredibly easy. As a Dubai resident, I had always found it challenging to access global markets until now.'),
      rating: 5
    },
    {
      name: t('stock.testimonials.layla.name', 'Layla M.'),
      location: t('stock.testimonials.layla.location', 'Riyadh, KSA'),
      image: '/images/testimonials/layla.jpg',
      quote: t('stock.testimonials.layla.quote', 'The Shariah-compliant screening tools help me invest according to my values. The Arabic interface and local support make everything so much more accessible.'),
      rating: 5
    },
    {
      name: t('stock.testimonials.omar.name', 'Omar J.'),
      location: t('stock.testimonials.omar.location', 'Cairo, Egypt'),
      image: '/images/testimonials/omar.jpg',
      quote: t('stock.testimonials.omar.quote', 'Being able to invest in both local and international markets through one platform has diversified my portfolio significantly. The local bank integration makes funding my account seamless.'),
      rating: 4
    }
  ];

  return (
    <Box ref={containerRef} bg={bgGradient} overflow="hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <Box 
        position="relative" 
        pt={{ base: 20, md: 32 }}
        pb={{ base: 20, md: 32 }}
        overflow="hidden"
      >
        {/* Background elements */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex={0}
        >
          {/* Financial chart pattern background */}
           <Image
            src="/images/background-image.png"
            width="100%"
            height="100%"
            objectFit="cover"
            objectPosition="center"
            opacity={0.5}
            position="absolute"
          />
          
          {/* Animated gradient orbs */}
          <Box
            position="absolute"
            top="10%"
            left="5%"
            width="300px"
            height="300px"
            borderRadius="full"
            bg="radial-gradient(circle, rgba(139,121,102,0.3) 0%, rgba(139,121,102,0) 70%)"
            filter="blur(40px)"
            animation="pulse 15s infinite"
          />
          <Box
            position="absolute"
            bottom="10%"
            right="5%"
            width="400px"
            height="400px"
            borderRadius="full"
            bg="radial-gradient(circle, rgba(139,121,102,0.2) 0%, rgba(139,121,102,0) 70%)"
            filter="blur(40px)"
            animation="pulse 18s infinite 2s"
          />
        </Box>
        
        <Container maxW="container.xl" position="relative" zIndex={2}>
          <motion.div style={{ scale: heroScale }}>
            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 10, lg: 16 }} alignItems="center">
              <GridItem>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                >
                  <VStack spacing={6} align="flex-start">
                    <Heading
                      as="h1"
                      fontSize={headingSize}
                      fontWeight="bold"
                      lineHeight="1.2"
                      color={isDark ? '#8b7966' : 'white'}
                    >
                      {t('stock.hero.title', 'Smart investments, at your fingertips')}
                    </Heading>
                    
                    <Text
                      fontSize={{ base: "lg", md: "xl" }}
                      maxW="550px"
                      color={isDark ? '#8b7966' : 'white'}
                    >
                      {t('stock.hero.subtitle', 'Access global stock markets from anywhere in MENA with our user-friendly platform designed for regional investors.')}
                    </Text>
                    
                    <HStack spacing={6} mt={4}>
                      <Button
                        size="lg"
                        px={8}
                        variant="stocks-solid"
                        rightIcon={<FaArrowRight />}
                        onClick={() => router.push('/signup')}
                      >
                        {t('stock.hero.cta', 'Start Investing')}
                      </Button>
                    </HStack>
                    
                    <HStack spacing={8} mt={8} color={isDark ? '#8b7966' : 'white'} flexWrap="wrap">
                      <HStack>
                        <Icon as={CheckCircle} color={isDark ? '#8b7966' : 'white'} />
                        <Text>{t('stock.hero.feature1', 'Zero Commission')}</Text>
                      </HStack>
                      
                      <HStack>
                        <Icon as={CheckCircle} color={isDark ? '#8b7966' : 'white'} />
                        <Text>{t('stock.hero.feature2', 'Shariah Compliant')}</Text>
                      </HStack>
                      
                      <HStack>
                        <Icon as={CheckCircle} color={isDark ? '#8b7966' : 'white'} />
                        <Text>{t('stock.hero.feature3', '24/7 Support')}</Text>
                      </HStack>
                    </HStack>
                  </VStack>
                </motion.div>
              </GridItem>
              <StocksMatrix />
            </Grid>
          </motion.div>
          <Box py={{ base: 5, md: 10 }}>
            <AssetPerformanceChart />
          </Box>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Box as="section" pt={{ base: 20, md: 32 }}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              style={{ width: '100%' }}
            >
              <VStack spacing={4} textAlign="center" mb={12}>
                <Text 
                  color="#8b7966" 
                  fontWeight="bold" 
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  {t('stock.features.subtitle', 'Why Choose BitStocks')}
                </Text>
                
                <Heading
                  fontSize={{ base: "3xl", md: "4xl" }}
                  fontWeight="bold"
                  color={useColorModeValue("#333", "white")}
                  bgGradient="linear(to-r, #8b7966, #b8a28b)"
                  bgClip="text"
                >
                  {t('stock.features.title', 'Trading Features Designed for You')}
                </Heading>
                
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  color={useColorModeValue("gray.600", "gray.300")}
                  maxW="3xl"
                  mx="auto"
                >
                  {t('stock.features.description', 'Our platform offers unique features tailored specifically for MENA investors looking to access global markets.')}
                </Text>
              </VStack>
            </motion.div>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} width="full">
              {features.map((feature, index) => (
                <FeatureCard key={index} feature={feature} index={index} />
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
      
      {/* Investment Options Section */}
      <Box 
        as="section" 
        py={{ base: 20, md: 32 }}
        position="relative"
        overflow="hidden"
      > 
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack spacing={16}>
            <motion.div
             initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              style={{ width: '100%' }}
            >
              <VStack spacing={4} textAlign="center" mb={12}>
                <Text 
                  color="#8b7966" 
                  fontWeight="bold" 
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  {t('stock.investment.subtitle', 'Diverse Investment Options')}
                </Text>
                
                <Heading
                  fontSize={{ base: "3xl", md: "4xl" }}
                  fontWeight="bold"
                  color={useColorModeValue("#333", "white")}
                  bgGradient="linear(to-r, #8b7966, #b8a28b)"
                  bgClip="text"
                >
                  {t('stock.investment.title', 'Build Your Global Portfolio')}
                </Heading>
                
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  color={useColorModeValue("gray.600", "gray.300")}
                  maxW="3xl"
                  mx="auto"
                >
                  {t('stock.investment.description', 'Explore a wide range of investment opportunities from global markets with options tailored for regional investors.')}
                </Text>
              </VStack>
            </motion.div>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} width="full">
              {investmentOptions.map((option, index) => (
                <InvestmentCard key={index} option={option} index={index} />
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
      
      {/* Regional Benefits Section */}
      <Box as="section" py={{ base: 20, md: 32 }}>
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 10, lg: 16 }} alignItems="center">
          <Image
                src="/images/shares.png"
                alt="Investment Options"
                objectFit="cover"
                />
            <GridItem>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <VStack spacing={6} align="flex-start">
                  <Text 
                    color="#8b7966" 
                    fontWeight="bold" 
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    {t('stock.regional.subtitle', 'Regional Advantage')}
                  </Text>
                  
                  <Heading
                    fontSize={{ base: "3xl", md: "4xl" }}
                    fontWeight="bold"
                    lineHeight="1.2"
                    bgGradient="linear(to-r, #8b7966, #b8a28b)"
                    bgClip="text"
                  >
                    {t('stock.regional.title', 'Designed for MENA & GCC Investors')}
                  </Heading>
                  
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color={useColorModeValue("gray.600", "gray.300")}
                    maxW="xl"
                  >
                    {t('stock.regional.description', 'BitStocks brings global investment opportunities to MENA and GCC investors with localized features and support designed specifically for the region.')}
                  </Text>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={6} width="full">
                    {regionalBenefits.map((benefit, index) => (
                      <HStack key={index} align="start" spacing={3} mt={2}>
                        <Icon as={FaCheckCircle} color="#8b7966" mt={1} boxSize={5} />
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold">{benefit.title}</Text>
                          <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
                            {benefit.description}
                          </Text>
                        </VStack>
                      </HStack>
                    ))}
                  </SimpleGrid>
                  
                  <Button
                    mt={8}
                    size="lg"
                    bg="#8b7966"
                    color="white"
                    _hover={{ bg: "#9c7c63" }}
                    px={8}
                    rightIcon={<FaArrowRight />}
                    onClick={() => router.push('/about')}
                  >
                    {t('stock.regional.learn_more', 'Learn More')}
                  </Button>
                </VStack>
              </motion.div>
            </GridItem>
            
            <GridItem>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={scaleUp}
              >
                <Box
                  position="relative"
                  borderRadius="2xl"
                  overflow="hidden"
                  boxShadow="2xl"
                  transform="perspective(1000px) rotateY(-5deg) rotateX(5deg)"
                  transition="all 0.5s ease"
                  _hover={{
                    transform: "perspective(1000px) rotateY(0deg) rotateX(0deg)"
                  }}
                >
                </Box>
              </motion.div>
            </GridItem>
          </Grid>
        </Container>
      </Box>
      
      {/* Call to Action Section */}
      <Box 
        as="section" 
        py={{ base: 20, md: 32 }}
      >
        <Container maxW="container.xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Flex
              direction="column"
              align="center"
              textAlign="center"
              py={{ base: 16, md: 20 }}
              px={{ base: 6, md: 10 }}
              borderRadius="xl"
              boxShadow="2xl"
              borderWidth="1px"
              borderColor={useColorModeValue("gray.200", "gray.700")}
              position="relative"
              overflow="hidden"
            >
              {/* Decorative elements */}
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                height="6px"
                bg="#8b7966"
              />
              
              <Circle
                position="absolute"
                bottom="-50px"
                left="-50px"
                size="200px"
                bg="#8b7966"
                opacity={0.05}
              />
              
              <Circle
                position="absolute"
                top="-30px"
                right="-30px"
                size="150px"
                bg="#8b7966"
                opacity={0.05}
              />
              
              <VStack spacing={8} maxW="3xl" position="relative" zIndex={1}>
                <Text 
                  color="#8b7966" 
                  fontWeight="bold" 
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  {t('stock.cta.subtitle', 'Start Your Journey')}
                </Text>
                
                <Heading
                  fontSize={{ base: "3xl", md: "4xl" }}
                  fontWeight="bold"
                  color={useColorModeValue("#333", "white")}
                  bgGradient="linear(to-r, #8b7966, #b8a28b)"
                  bgClip="text"
                >
                  {t('stock.cta.title', 'Start Your Global Investment Journey Today')}
                </Heading>
                
                <Text 
                  fontSize={{ base: "md", md: "lg" }}
                  color={useColorModeValue("gray.600", "gray.300")}
                >
                  {t('stock.cta.description', 'Join thousands of MENA and GCC investors who are growing their wealth through global markets with BitStocks\' localized approach.')}
                </Text>
                
                <HStack spacing={6} pt={4} wrap="wrap" justify="center">
                  <Button
                    bg="#8b7966"
                    color="white"
                    _hover={{ bg: "#9c7c63" }}
                    size="lg"
                    px={8}
                    rightIcon={<FaArrowRight />}
                    onClick={() => router.push('/signup')}
                  >
                    {t('stock.cta.button', 'Create Account')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    borderColor="#8b7966"
                    color="#8b7966"
                    _hover={{ 
                      bg: "rgba(139,121,102,0.1)",
                      borderColor: "#9c7c63",
                      color: "#9c7c63"
                    }}
                    size="lg"
                    px={8}
                    leftIcon={<FaHandshake />}
                    onClick={() => router.push('/demo')}
                  >
                    {t('stock.cta.demo', 'Request Demo')}
                  </Button>
                </HStack>
              </VStack>
            </Flex>
          </motion.div>
        </Container>

        {/* Legal Notices Section */}
        <Box 
          as="section" 
          py={10} 
        >
          <Container maxW="container.xl">
            <VStack spacing={8} align="stretch">
              <Heading size="md" color="#8b7966">
                {t('legal.title')}
              </Heading>
              
              <Text fontSize="sm" color={isDark ? "gray.400" : "gray.600"} lineHeight="tall">
                {t('legal.riskWarning')}
              </Text>
              
              <Divider borderColor={isDark ? "gray.700" : "gray.200"} />
              
              <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8}>
                <GridItem>
                  <VStack align="flex-start" spacing={4}>
                    <Heading size="sm" color={isDark ? "white" : "gray.800"}>
                      {t('legal.license.title')}
                    </Heading>
                    
                    <Text fontSize="sm" color={isDark ? "gray.400" : "gray.600"} lineHeight="tall">
                      {t('legal.license.content')}
                    </Text>
                  </VStack>
                </GridItem>
                
                <GridItem>
                  <VStack align="flex-start" spacing={4}>
                    <Heading size="sm" color={isDark ? "white" : "gray.800"}>
                      {t('legal.restricted.title')}
                    </Heading>
                    
                    <Text fontSize="sm" color={isDark ? "gray.400" : "gray.600"} lineHeight="tall">
                      {t('legal.restricted.content')}
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
                      href={`/${t(key).toLowerCase().replace(/\s+/g, '-')}`}
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
    </Box>
  );
};

export default BitStockLanding;