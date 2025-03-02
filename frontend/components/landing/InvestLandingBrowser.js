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
  FaHandshake
} from 'react-icons/fa';
import MarketOverview from '@/components/investment/MarketOverview';
import StockTicker from '@/components/investment/StockTicker';
import AssetPerformanceChart from '@/components/investment/AssetPerformanceChart';

const BitInvestLanding = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const containerRef = useRef(null);
  
  const bgGradient = useColorModeValue(
    'linear(to-b, brand.bitinvest.400, white)',
    'linear(to-b, gray.900, black)'
  );
  
  const glassCardBg = useColorModeValue('whiteAlpha.900', 'whiteAlpha.100');

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

  const features = [
    {
      icon: FaGlobeAmericas,
      title: 'global.markets.access.title',
      description: 'Seamless access to US and EU stock markets with localized support and trading hours',
      color: 'brand.bitinvest.400'
    },
    {
      icon: FaMobileAlt,
      title: 'mobile.trading.title',
      description: 'Trade anytime, anywhere with our award-winning mobile app designed for MENA users',
      color: 'brand.bitinvest.500'
    },
    {
      icon: FaShieldAlt,
      title: 'compliant.investing.title',
      description: 'Fully compliant with regional regulations while providing access to global markets',
      color: 'brand.bitinvest.600'
    },
    {
      icon: FaRegCreditCard,
      title: 'local.payment.methods.title',
      description: 'Deposit and withdraw using popular payment methods in the MENA and GCC regions',
      color: 'brand.bitinvest.700'
    }
  ];

  const investmentOptions = [
    {
      icon: FaChartLine,
      title: 'US & EU Stocks',
      description: 'Access over 5,000 stocks from the world\'s largest exchanges with zero commission',
      badge: 'Most Popular',
      color: 'brand.bitinvest.400'
    },
    {
      icon: FaBuilding,
      title: 'Private Assets',
      description: 'Exclusive access to pre-IPO companies and private equity opportunities with minimum investments of $1,000',
      badge: 'Exclusive',
      color: 'brand.bitinvest.500'
    },
    {
      icon: FaCoins,
      title: 'Gold & Precious Metals',
      description: 'Invest in gold and other precious metals with full ownership or through ETFs and funds',
      badge: 'Traditional',
      color: 'brand.bitinvest.600'
    },
    {
      icon: FaOilCan,
      title: 'Oil & Commodities',
      description: 'Trade oil futures or invest in energy companies with specialized regional insights',
      badge: 'Strategic',
      color: 'brand.bitinvest.700'
    }
  ];

  const regionalBenefits = [
    {
      title: 'Arabic Interface',
      description: 'Fully localized Arabic interface with regional market insights and analysis'
    },
    {
      title: 'Shariah-Compliant Options',
      description: 'Filter and invest in Shariah-compliant stocks and funds with ease'
    },
    {
      title: 'Local Support Team',
      description: '24/7 customer support from our offices in Dubai, Riyadh, and Cairo'
    },
    {
      title: 'Regional Bank Integration',
      description: 'Seamless deposit and withdrawal with major MENA and GCC banks'
    },
    {
      title: 'Regional Market Hours',
      description: 'Extended trading hours aligned with GCC time zones'
    },
    {
      title: 'Dual Language Research',
      description: 'Investment research and reports available in both English and Arabic'
    }
  ];

  const regulatoryInfo = [
    {
      authority: 'Dubai Financial Services Authority (DFSA)',
      license: 'License No. F0099',
      country: 'UAE'
    },
    {
      authority: 'Capital Market Authority (CMA)',
      license: 'Authorization No. 23-455',
      country: 'Saudi Arabia'
    },
    {
      authority: 'Financial Regulatory Authority (FRA)',
      license: 'License No. 12877',
      country: 'Egypt'
    },
    {
      authority: 'Central Bank of Bahrain (CBB)',
      license: 'Investment Business Firm License IBF-235',
      country: 'Bahrain'
    }
  ];

  const testimonials = [
    {
      name: 'Ahmed K.',
      location: 'Dubai, UAE',
      image: '/images/testimonials/ahmed.jpg',
      quote: 'BitInvest made investing in US tech stocks incredibly easy. As a Dubai resident, I had always found it challenging to access global markets until now.',
      rating: 5
    },
    {
      name: 'Layla M.',
      location: 'Riyadh, KSA',
      image: '/images/testimonials/layla.jpg',
      quote: 'The Shariah-compliant screening tools help me invest according to my values. The Arabic interface and local support make everything so much more accessible.',
      rating: 5
    },
    {
      name: 'Omar J.',
      location: 'Cairo, Egypt',
      image: '/images/testimonials/omar.jpg',
      quote: 'Being able to invest in both local and international markets through one platform has diversified my portfolio significantly. The local bank integration makes funding my account seamless.',
      rating: 4
    }
  ];

  return (
    <Box ref={containerRef} bg={bgGradient} overflow="hidden">
      <Container maxW="8xl" pt={8}>
        {/* Hero Section */}
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
                bgGradient="linear(to-r, brand.bitinvest.400, brand.bitinvest.700)"
                bgClip="text"
              >
                {t('invest.hero.title', 'Smart investments, at your fingertips')}
              </Heading>

              <MarketOverview />

              <AssetPerformanceChart />

              <HStack spacing={6} pt={8}>
                <Button
                  size="lg"
                  color="brand.bitinvest.400"
                  px={8}
                  h={14}
                  fontSize="lg"
                  onClick={() => router.push('/signup')}
                >
                  {t('invest.hero.get_started', 'Start Investing')}
                </Button>
                <Button
                  size="lg"
                  variant="bitinvest-outline"
                  color="brand.bitinvest.400"
                  px={8}
                  h={14}
                  fontSize="lg"
                  onClick={() => router.push('/learn')}
                >
                  {t('hero.learn_more', 'Learn More')}
                </Button>
              </HStack>
            </VStack>

            {/* Stats Preview */}
            <Box
              mt={16}
              w="full"
              maxW="6xl"
              p={8}
              borderRadius="3xl"
              bg={glassCardBg}
              borderColor="brand.bitinvest.500"
              borderWidth={2}
              boxShadow="xl"
            >
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                <VStack
                  p={6}
                  borderRadius="xl"
                  bg={useColorModeValue('white', 'gray.800')}
                  spacing={4}
                >
                  <Icon as={FaUsers} boxSize={8} color="brand.bitinvest.500" />
                  <Text fontWeight="bold">{t('demo.active_investors', 'Active Investors')}</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="brand.bitinvest.500">
                    350k+
                  </Text>
                </VStack>
                <VStack
                  p={6}
                  borderRadius="xl"
                  bg={useColorModeValue('white', 'gray.800')}
                  spacing={4}
                >
                  <Icon as={FaGlobeAmericas} boxSize={8} color="brand.bitinvest.500" />
                  <Text fontWeight="bold">{t('demo.countries_served', 'Countries Served')}</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="brand.bitinvest.500">
                    18
                  </Text>
                </VStack>
                <VStack
                  p={6}
                  borderRadius="xl"
                  bg={useColorModeValue('white', 'gray.800')}
                  spacing={4}
                >
                  <Icon as={FaExchangeAlt} boxSize={8} color="brand.bitinvest.500" />
                  <Text fontWeight="bold">{t('demo.daily_trades', 'Daily Trades')}</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="brand.bitinvest.500">
                    2.5M+
                  </Text>
                </VStack>
              </SimpleGrid>
            </Box>
          </Flex>
        </motion.div>

        {/* Features Grid */}
        <Box mt={24}>
          <Heading
            textAlign="center"
            mb={12}
            fontSize={{ base: '3xl', md: '4xl' }}
            bgGradient="linear(to-r, brand.bitinvest.500, brand.bitinvest.700)"
            bgClip="text"
          >
            {t('invest.why.choose.us', 'Why Choose BitInvest')}
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mb={16}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
                    <Heading size="md" color={feature.color}>
                      {t(feature.title, feature.title)}
                    </Heading>
                    <Text>
                      {t(feature.description, feature.description)}
                    </Text>
                  </VStack>
                </Box>
              </motion.div>
            ))}
          </SimpleGrid>
        </Box>
        
        {/* Investment Options */}
        <Box mt={24}>
          <Heading
            textAlign="center"
            mb={12}
            fontSize={{ base: '3xl', md: '4xl' }}
            bgGradient="linear(to-r, brand.bitinvest.500, brand.bitinvest.700)"
            bgClip="text"
          >
            {t('invest.options', 'Investment Options')}
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mb={16}>
            {investmentOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Box
                  p={8}
                  h="full"
                  bg={glassCardBg}
                  borderRadius="xl"
                  borderColor={option.color}
                  borderWidth={2}
                  position="relative"
                  _hover={{
                    transform: 'translateY(-5px)',
                    boxShadow: 'xl'
                  }}
                  transition="all 0.3s ease"
                >
                  {option.badge && (
                    <Badge
                      position="absolute"
                      top={3}
                      right={3}
                      colorScheme="brand.bitinvest.400"
                      variant="solid"
                      px={2}
                      py={1}
                      borderRadius="md"
                    >
                      {option.badge}
                    </Badge>
                  )}
                  <VStack align="start" spacing={6}>
                    <Icon as={option.icon} boxSize={12} color={option.color} />
                    <Heading size="md" color={option.color}>
                      {option.title}
                    </Heading>
                    <Text>
                      {option.description}
                    </Text>
                    <Button
                      variant="outline"
                      color="brand.bitinvest.400"
                      size="sm"
                      onClick={() => router.push(`/invest/${option.title.toLowerCase().replace(/[&\s]+/g, '-')}`)}
                    >
                      Learn More
                    </Button>
                  </VStack>
                </Box>
              </motion.div>
            ))}
          </SimpleGrid>
        </Box>
        
        {/* Regional Benefits */}
        <Box mt={24}>
          <Heading
            textAlign="center"
            mb={12}
            fontSize={{ base: '3xl', md: '4xl' }}
            bgGradient="linear(to-r, brand.bitinvest.500, brand.bitinvest.700)"
            bgClip="text"
          >
            {t('invest.regional.benefits', 'Designed for MENA & GCC Investors')}
          </Heading>
          
          <Box
            p={8}
            bg={glassCardBg}
            borderRadius="xl"
            borderColor="brand.bitinvest.500"
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
                <Heading size="lg" color="brand.bitinvest.500">
                  {t('invest.regional.title', 'Local Expertise, Global Opportunities')}
                </Heading>
                <Text maxW="xl">
                  {t('invest.regional.description', 'BitInvest brings global investment opportunities to MENA and GCC investors with localized features and support designed specifically for the region.')}
                </Text>
              </VStack>
              
              <Icon 
                as={FaMapMarkedAlt} 
                boxSize={{ base: 16, md: 24 }} 
                color="brand.bitinvest.400" 
                opacity={0.8}
              />
            </Flex>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {regionalBenefits.map((benefit, index) => (
                <HStack key={index} align="start" spacing={3}>
                  <Icon as={FaCheckCircle} color="brand.bitinvest.500" mt={1} />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">{benefit.title}</Text>
                    <Text fontSize="sm" color="gray.600">{benefit.description}</Text>
                  </VStack>
                </HStack>
              ))}
            </SimpleGrid>
          </Box>
        </Box>
        
        {/* Testimonials */}
        <Box mt={24}>
          <Heading
            textAlign="center"
            mb={12}
            fontSize={{ base: '3xl', md: '4xl' }}
            bgGradient="linear(to-r, brand.bitinvest.400, brand.bitinvest.700)"
            bgClip="text"
          >
            {t('invest.testimonials', 'What Our Investors Say')}
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={16}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Box
                  p={8}
                  bg={glassCardBg}
                  borderRadius="xl"
                  borderColor="brand.bitinvest.400"
                  borderWidth={1}
                  boxShadow="md"
                  height="full"
                  display="flex"
                  flexDirection="column"
                >
                  <Flex mb={6}>
                    <Box boxSize={12} mr={4}>
                      <Avatar 
                        size="full" 
                        name={testimonial.name} 
                        src={testimonial.image}
                      />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold">{testimonial.name}</Text>
                      <Text fontSize="sm" color="gray.500">{testimonial.location}</Text>
                      <HStack mt={1}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Icon key={i} as={FaStar} color="yellow.400" boxSize={3} />
                        ))}
                      </HStack>
                    </VStack>
                  </Flex>
                  
                  <Text flex="1" fontStyle="italic" fontSize="sm">
                    "{testimonial.quote}"
                  </Text>
                </Box>
              </motion.div>
            ))}
          </SimpleGrid>
        </Box>
        
        {/* Regulatory Information */}
        <Box mt={24}>
          <Heading
            textAlign="center"
            mb={12}
            fontSize={{ base: '3xl', md: '4xl' }}
            bgGradient="linear(to-r, brand.bitinvest.400, brand.bitinvest.700)"
            bgClip="text"
          >
            {t('invest.regulatory', 'Regulatory Information')}
          </Heading>
          
          <Flex 
            direction={{ base: "column", md: "row" }}
            bg={glassCardBg}
            borderRadius="xl"
            borderColor="brand.bitinvest.400"
            borderWidth={2}
            boxShadow="xl"
            overflow="hidden"
          >
            <Box 
              p={8} 
              bg="brand.bitinvest.400" 
              color="white"
              width={{ base: "full", md: "40%" }}
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              <Icon as={FaUniversity} boxSize={16} mb={6} />
              <Heading size="lg" mb={4}>
                {t('invest.regulatory.title', 'Fully Licensed & Regulated')}
              </Heading>
              <Text>
                {t('invest.regulatory.description', 'BitInvest operates with full regulatory compliance across the MENA and GCC regions, ensuring your investments are secure and protected under local laws.')}
              </Text>
              <Button
                mt={8}
                variant="bitinvest-solid"
                leftIcon={<FaShieldAlt />}
                onClick={() => router.push('/compliance')}
              >
                Our Security Measures
              </Button>
            </Box>
            
            <Box p={8} width={{ base: "full", md: "60%" }}>
              <Heading size="md" mb={6}>
                {t('invest.regulatory.licenses', 'Our Licenses & Authorizations')}
              </Heading>
              
              <VStack spacing={4} align="stretch">
                {regulatoryInfo.map((regulation, index) => (
                  <Box key={index} p={4} borderRadius="md" bg={useColorModeValue('white', 'gray.700')} boxShadow="sm">
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">{regulation.authority}</Text>
                        <Text fontSize="sm" color="gray.500">{regulation.country}</Text>
                      </VStack>
                      <Badge colorScheme="brand.bitinvest.400" p={2}>
                        {regulation.license}
                      </Badge>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </Box>
          </Flex>
        </Box>
        
        {/* Call to Action */}
        <Box
          mt={24}
          mb={16}
          p={12}
          borderRadius="xl"
            borderColor="brand.bitinvest.400"
            borderWidth={2}
            boxShadow="xl"
            overflow="hidden"
          color="brand.bitinvest.400"
          textAlign="center"
        >
          <VStack spacing={6}>
            <Heading size="xl">
              {t('invest.cta.title', 'Start Your Global Investment Journey Today')}
            </Heading>
            <Text fontSize="lg" maxW="2xl">
              {t('invest.cta.description', 'Join thousands of MENA and GCC investors who are growing their wealth through global markets with BitInvest\'s localized approach.')}
            </Text>
            <HStack spacing={4}>
              <Button
                h={14}
                variant="bitinvest-solid"
                leftIcon={<FaUserTie />}
                onClick={() => router.push('/signup')}
              >
                {t('invest.cta.button', 'Create Account')}
              </Button>
              <Button
                variant="bitinvest-solid"
                h={14}
                leftIcon={<FaHandshake />}
                onClick={() => router.push('/demo')}
              >
                {t('invest.cta.demo', 'Request Demo')}
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default BitInvestLanding;