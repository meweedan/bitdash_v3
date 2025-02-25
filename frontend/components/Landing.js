import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  Button, 
  useColorMode, 
  Link, 
  Grid,
  Container,
  Flex,
  Spinner,
  chakra,
  Select,
  Badge,
  Center,
  SimpleGrid,
  Circle,
  shouldForwardProp,
  Icon,
  HStack,
  Divider,
  IconButton,
  Image,
  Stack,
  useBreakpointValue
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { motion, isValidMotionProp, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import PWALanding from './PWALanding';
import { 
  ArrowRight, 
  Users, 
  Clock, 
  CheckCircle,
  TrendingUp, 
  Shield,
  Smartphone,
  Menu as MenuIcon,
  BarChart3,
  Bell,
  QrCode,
  ArrowDown,
  Scan,
  Lock,
  Globe,
  DollarSign,
  PieChart,
  LineChart,
  BarChart,
  Award,
  Briefcase,
  Key,
  Settings,
  CreditCard,
  Layers,
  Target,
  Zap,
  Database
} from 'lucide-react';
import { FaWhatsapp, FaMoneyBillWave, FaChartLine, FaExchangeAlt, FaUniversity, FaShieldAlt } from 'react-icons/fa';
import Hero from './Hero';
import theme from '@/styles/theme';

const checkIsPWA = () => {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone ||
    document.referrer.includes('android-app://')
  );
};

const MotionBox = motion(Box);
const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

const FeatureCard = ({ icon: IconComponent, title, description, delay, color }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <ChakraBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      p={6}
      borderRadius="xl"
      boxShadow="lg"
      borderWidth="1px"
      borderColor={isDark ? 'whiteAlpha.200' : 'gray.100'}
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: '2xl',
        borderColor: `${color}.400`,
      }}
    >
      <VStack spacing={4} align="flex-start">
        <Circle
          size="50px"
          color="white"
          opacity={0.9}
        >
          <Icon as={IconComponent} boxSize={5} />
        </Circle>
        <Text
          fontWeight="bold"
          fontSize="xl"
          color={isDark ? 'white' : 'gray.800'}
        >
          {title}
        </Text>
        <Text
          color={isDark ? 'gray.400' : 'gray.600'}
          lineHeight="tall"
        >
          {description}
        </Text>
      </VStack>
    </ChakraBox>
  );
};

const StepCard = ({ icon: IconComponent, title, content, delay }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <ChakraBox
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      p={6}
      borderRadius="xl"
      boxShadow="lg"
      borderWidth="1px"
      borderColor={isDark ? 'whiteAlpha.200' : 'gray.100'}
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: '2xl',
      }}
    >
      <VStack spacing={4} align="flex-start">
        <Circle
          size="50px"
          color={isDark ? 'white' : 'blue.500'}
        >
          <Icon as={IconComponent} boxSize={5} />
        </Circle>
        <Text
          fontWeight="bold"
          fontSize="xl"
          color={isDark ? 'white' : 'gray.800'}
        >
          {title}
        </Text>
        <Text
          color={isDark ? 'gray.400' : 'gray.600'}
          lineHeight="tall"
        >
          {content}
        </Text>
      </VStack>
    </ChakraBox>
  );
};

const TestimonialCard = ({ quote, author, company, image, delay }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <ChakraBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      p={6}
      borderRadius="xl"
      boxShadow="lg"
      borderWidth="1px"
      borderColor={isDark ? 'whiteAlpha.200' : 'gray.100'}
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: '2xl',
      }}
    >
      <VStack spacing={4} align="flex-start">
        <Text
          fontSize="lg"
          fontStyle="italic"
          color={isDark ? 'gray.300' : 'gray.700'}
          lineHeight="tall"
        >
          "{quote}"
        </Text>
        <HStack spacing={4}>
          <Circle
            size="40px"
            overflow="hidden"
          >
            {image ? (
              <Image src={image} alt={author} w="full" h="full" objectFit="cover" />
            ) : (
              <Icon as={Users} boxSize={5} color="gray.500" />
            )}
          </Circle>
          <VStack spacing={0} align="flex-start">
            <Text fontWeight="bold" color={isDark ? 'white' : 'gray.800'}>
              {author}
            </Text>
            <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
              {company}
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </ChakraBox>
  );
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

  // Animation for numbers
  const numberVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const PlatformSection = () => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const { t } = useTranslation();
    const router = useRouter();

    const platforms = [
      {
        name: t('bitcash.name', 'BitCash'),
        icon: FaMoneyBillWave,
        description: t('bitcash.description', 'Instant payment solutions for the digital age with seamless transactions across borders.'),
        subdomain: "cash.bitdash.app",
        color: "brand.bitcash"
      },
      {
        name: t('bitfund.name', 'BitFund'),
        icon: FaChartLine,
        description: t('bitfund.description', 'Proprietary trading platform with verified performance-based funding for traders.'),
        subdomain: "fund.bitdash.app",
        color: "brand.bitfund"
      },
      {
        name: t('bitinvest.name', 'BitInvest'),
        icon: FaUniversity,
        description: t('bitinvest.description', 'Global investment platform tailored for MENA & GCC investors to access international markets.'),
        subdomain: "invest.bitdash.app",
        color: "brand.bitinvest"
      },
      {
        name: t('bittrade.name', 'BitTrade'),
        icon: FaExchangeAlt,
        description: t('bittrade.description', 'Regulated forex and crypto trading with institutional-grade security and advanced tools.'),
        subdomain: "trade.bitdash.app",
        color: "brand.bittrade"
      }
    ];

    return (
      <Box py={16} overflow="hidden">
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Heading
              textAlign="center"
              bgGradient="linear(to-r, blue.600, blue.400)"
              bgClip="text"
              fontSize={{ base: "3xl", md: "4xl" }}
              mb={8}
            >
              {t('platformTitle', 'Our Fintech Ecosystem')}
            </Heading>
            
            <VStack spacing={8} width="full">
              {platforms.map((platform, idx) => (
                <ChakraBox
                  key={platform.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  w="full"
                  cursor="pointer"
                  onClick={() => window.location.href = `https://${platform.subdomain}`}
                >
                  <Flex
                    direction="row"
                    align="center"
                    p={6}
                    borderRadius="2xl"
                    borderWidth="1px"
                    borderColor={isDark ? 'whiteAlpha.100' : 'gray.100'}
                    boxShadow="md"
                    transition="all 0.3s ease"
                    _hover={{
                      transform: 'translateX(8px)',
                      bg: isDark ? 'whiteAlpha.100' : 'gray.50',
                      borderColor: `${platform.color}.500`,
                      boxShadow: 'xl'
                    }}
                  >
                    <Circle
                      size="54px"
                      color={isDark ? 'white' : 'white'}
                      opacity={0.9}
                      mr={6}
                    >
                      <Icon as={platform.icon} boxSize={6} />
                    </Circle>

                    <VStack align="start" spacing={1} flex={1}>
                      <Heading
                        size="md"
                        fontWeight="semibold"
                        letterSpacing="tight"
                      >
                        {platform.name}
                      </Heading>
                      <Text
                        fontSize="sm"
                        color={isDark ? 'gray.400' : 'gray.600'}
                        letterSpacing="tight"
                      >
                        {platform.description}
                      </Text>
                    </VStack>

                    <Icon
                      as={ArrowRight}
                      boxSize={5}
                      color={isDark ? 'gray.400' : 'gray.600'}
                      opacity={0.5}
                      transition="all 0.3s ease"
                      transform="translateX(-10px)"
                      _groupHover={{
                        transform: "translateX(0)",
                        opacity: 1,
                        color: `${platform.color}.500`
                      }}
                    />
                  </Flex>
                </ChakraBox>
              ))}
            </VStack>
          </VStack>
        </Container>
      </Box>
    );
  };

  // Updated steps with fintech focus
  const steps = [
    { 
      icon: Lock, 
      title: 'Enterprise Security',
      content: 'Bank-grade encryption and compliance with international financial regulations to protect your data and transactions.'
    },
    { 
      icon: Zap, 
      title: 'Rapid Implementation',
      content: 'Deploy our fintech solutions in under 48 hours with seamless integration into your existing systems.'
    },
    { 
      icon: Database, 
      title: 'Scalable Architecture',
      content: 'Built on cloud infrastructure that scales with your business, from startups to enterprise-level operations.'
    },
    { 
      icon: Users, 
      title: 'Dedicated Support',
      content: '24/7 technical support with a dedicated financial technology expert assigned to your account.'
    }
  ];

  // Fintech features
  const features = [
    {
      icon: CreditCard,
      title: 'Seamless Payments',
      description: 'Process transactions globally with minimal fees and instant settlement across multiple currencies.',
      color: 'brand.bitcash'
    },
    {
      icon: LineChart,
      title: 'Advanced Analytics',
      description: 'Real-time financial data visualization and predictive analytics to drive informed decision-making.',
      color: 'brand.bitfund'
    },
    {
      icon: Globe,
      title: 'Global Compliance',
      description: 'Stay compliant with regional and international financial regulations across all your operations.',
      color: 'brand.bitinvest'
    },
    {
      icon: Key,
      title: 'Secure Authentication',
      description: 'Multi-factor authentication and biometric verification for enhanced security protocols.',
      color: 'brand.bittrade'
    },
    {
      icon: Layers,
      title: 'Multi-Asset Support',
      description: 'Trade and manage diverse asset classes from a single unified platform with comprehensive portfolio views.',
      color: 'brand.bitcash'
    },
    {
      icon: Target,
      title: 'Precision Targeting',
      description: 'Use AI-driven insights to target the right financial products to the right customers at the right time.',
      color: 'brand.bitfund'
    }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "BitDash's fintech suite has transformed how we handle cross-border payments, reducing settlement time by 87% and cutting costs significantly.",
      author: "Sarah Al-Mansouri",
      company: "CFO at GulfTech Solutions",
      delay: 0
    },
    {
      quote: "Implementing BitFund has allowed us to scale our trading operations globally while maintaining regulatory compliance in every jurisdiction.",
      author: "James Chen",
      company: "Director at Apex Trading Group",
      delay: 0.1
    },
    {
      quote: "The integration between all BitDash platforms gives us a competitive edge in serving our MENA clients with global investment opportunities.",
      author: "Mohammed Al-Harbi",
      company: "CEO at Riyadh Financial Advisors",
      delay: 0.2
    }
  ];

  return (
    <Box
      minH="100vh"
      overflowX="hidden"
    >
      {/* Hero Section */}
      <Box 
        pt={20} 
        pb={32}
      >
        <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
          <VStack spacing={10} textAlign="center" maxW="3xl" mx="auto">
            <Heading
              fontSize={{ base: "4xl", md: "6xl" }}
              fontWeight="bold"
              letterSpacing="tight"
              bgGradient="linear(to-r, blue.600, blue.400)"
              bgClip="text"
              lineHeight={1.2}
            >
              {t('heroTitle', 'Powerful Financial Technology for the Modern Economy')}
            </Heading>

            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color={isDark ? 'gray.300' : 'gray.600'}
              maxW="2xl"
              lineHeight="tall"
            >
              {t('ctaDescription', 'BitDash delivers institutional-grade financial technology solutions that drive efficiency, security, and growth for businesses across markets worldwide.')}
            </Text>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} pt={4} width="full">
              <ChakraBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={numberVariants}
                p={6}
                borderRadius="lg"
                boxShadow="md"
              >
                <Text
                  fontSize={{ base: "4xl", md: "5xl" }}
                  fontWeight="bold"
                  letterSpacing="tight"
                  bgGradient="linear(to-r, blue.400, cyan.400)"
                  bgClip="text"
                  mb={2}
                >
                  $2.5B+
                </Text>
                <Text
                  color={isDark ? 'gray.400' : 'gray.600'}
                >
                  {t('stats.transactionVolume', 'Monthly Transaction Volume')}
                </Text>
              </ChakraBox>
              
              <ChakraBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={numberVariants}
                p={6}
                borderRadius="lg"
                boxShadow="md"
              >
                <Text
                  fontSize={{ base: "4xl", md: "5xl" }}
                  fontWeight="bold"
                  letterSpacing="tight"
                  bgGradient="linear(to-r, blue.400, cyan.400)"
                  bgClip="text"
                  mb={2}
                >
                  180+
                </Text>
                <Text
                  color={isDark ? 'gray.400' : 'gray.600'}
                >
                  {t('stats.globalClients', 'Enterprise Clients Worldwide')}
                </Text>
              </ChakraBox>
              
              <ChakraBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={numberVariants}
                p={6}
                borderRadius="lg"
                boxShadow="md"
              >
                <Text
                  fontSize={{ base: "4xl", md: "5xl" }}
                  fontWeight="bold"
                  letterSpacing="tight"
                  bgGradient="linear(to-r, blue.400, cyan.400)"
                  bgClip="text"
                  mb={2}
                >
                  99.99%
                </Text>
                <Text
                  color={isDark ? 'gray.400' : 'gray.600'}
                >
                  {t('stats.uptime', 'Platform Uptime & Reliability')}
                </Text>
              </ChakraBox>
            </SimpleGrid>

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
                {t('startFree', 'Start Free Trial')}
              </Button>
              
              <Button
                leftIcon={<FaWhatsapp size={20} />}
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
                onClick={() => window.open("https://api.whatsapp.com/send?phone=00447538636207", "_blank")}
              >
                {t('scheduleDemo', 'Schedule Demo')}
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Platforms Section */}
      <Box
        mt={-20}
        position="relative"
        zIndex={1}
      >
        <Container maxW="container.xl">
          <PlatformSection />
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <Heading
              textAlign="center"
              bgGradient="linear(to-r, blue.600, blue.400)"
              bgClip="text"
              fontSize={{ base: "3xl", md: "4xl" }}
            >
              {t('featuresTitle', 'Enterprise-Grade Fintech Features')}
            </Heading>
            
            <SimpleGrid 
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={8}
              w="full"
            >
              {features.map((feature, idx) => (
                <FeatureCard
                  key={idx}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={idx * 0.1}
                  color={feature.color}
                />
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Implementation Steps */}
      <Box py={20}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Heading
                bgGradient="linear(to-r, blue.600, blue.400)"
                bgClip="text"
                fontSize={{ base: "3xl", md: "4xl" }}
              >
                {t('implementationTitle', 'Enterprise Implementation')}
              </Heading>
              <Text
                fontSize="lg"
                color={isDark ? 'gray.400' : 'gray.600'}
                maxW="2xl"
              >
                {t('implementationDescription', 'Our proven implementation methodology ensures a smooth transition to our fintech ecosystem with minimal disruption.')}
              </Text>
            </VStack>
            
            <Grid 
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={8}
              w="full"
            >
              {steps.map((step, idx) => (
                <StepCard
                  key={idx}
                  icon={step.icon}
                  title={step.title}
                  content={step.content}
                  delay={idx * 0.1}
                />
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <Heading
              textAlign="center"
              bgGradient="linear(to-r, blue.600, blue.400)"
              bgClip="text"
              fontSize={{ base: "3xl", md: "4xl" }}
            >
              {t('testimonialsTitle', 'Trusted by Financial Institutions Worldwide')}
            </Heading>
            
            <SimpleGrid 
              columns={{ base: 1, md: 3 }}
              spacing={8}
              w="full"
            >
              {testimonials.map((testimonial, idx) => (
                <TestimonialCard
                  key={idx}
                  quote={testimonial.quote}
                  author={testimonial.author}
                  company={testimonial.company}
                  delay={testimonial.delay}
                />
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Security and Compliance Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={12} alignItems="center">
            <VStack spacing={8} align="flex-start">
              <Heading
                bgGradient="linear(to-r, blue.600, blue.400)"
                bgClip="text"
                fontSize={{ base: "3xl", md: "4xl" }}
              >
                {t('securityTitle', 'Financial-Grade Security & Compliance')}
              </Heading>
              
              <Text fontSize="lg" color={isDark ? 'gray.300' : 'gray.700'}>
                {t('securityDescription', 'BitDash adheres to the strictest security standards and regulatory requirements across global financial markets.')}
              </Text>
              
              <VStack spacing={4} align="flex-start" w="full">
                {[
                  'SOC 2 Type II Certified',
                  'PCI DSS Level 1 Compliant',
                  'GDPR & CCPA Compliant',
                  'ISO 27001 Certified',
                  'Bank-Grade Encryption (AES-256)',
                  'Multi-Region Data Redundancy'
                ].map((item, idx) => (
                  <HStack key={idx} spacing={3}>
                    <Icon as={CheckCircle} color="green.500" boxSize={5} />
                    <Text fontWeight="medium">{item}</Text>
                  </HStack>
                ))}
              </VStack>
              
              <Button
                rightIcon={<ArrowRight />}
                colorScheme="blue"
                size="lg"
                onClick={() => router.push('/security')}
              >
                {t('securityCTA', 'Learn More About Our Security')}
              </Button>
            </VStack>
            
            <Center>
              <Circle
                size={{ base: "250px", md: "350px" }}
                boxShadow="xl"
                position="relative"
              >
                <Icon 
                  as={FaShieldAlt} 
                  boxSize={{ base: 24, md: 32 }}
                  color={isDark ? 'blue.400' : 'blue.500'}
                  opacity={0.8}
                />
                
                {/* Animated security elements */}
                <ChakraBox
                  position="absolute"
                  animation={`${keyframes`
                    0% { transform: translateY(0) rotate(0); opacity: 0.7; }
                    50% { transform: translateY(-20px) rotate(5deg); opacity: 1; }
                    100% { transform: translateY(0) rotate(0); opacity: 0.7; }
                  `} 4s ease-in-out infinite`}
                >
                  <Icon 
                    as={Lock} 
                    boxSize={10}
                    color={isDark ? 'cyan.400' : 'cyan.500'}
                    position="absolute"
                    top="-50px"
                    left="50px"
                  />
                </ChakraBox>
                
                <ChakraBox
                  position="absolute"
                  animation={`${keyframes`
                    0% { transform: translateY(0) rotate(0); opacity: 0.7; }
                    50% { transform: translateY(20px) rotate(-5deg); opacity: 1; }
                    100% { transform: translateY(0) rotate(0); opacity: 0.7; }
                  `} 5s ease-in-out infinite`}
                >
                  <Icon 
                    as={Key} 
                    boxSize={10}
                    color={isDark ? 'purple.400' : 'purple.500'}
                    position="absolute"
                    bottom="-40px"
                    right="60px"
                  />
                </ChakraBox>
              </Circle>
            </Center>
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <ChakraBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            p={10}
            borderRadius="2xl"
            boxShadow="xl"
            textAlign="center"
          >
            <VStack spacing={8}>
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                bgClip="text"
              >
                {t('giveEdgeCompetitors', 'Ready to Transform Your Financial Operations?')}
              </Heading>
              
              <Text 
                fontSize="lg" 
                color={isDark ? 'gray.300' : 'gray.700'} 
                maxW="3xl"
              >
                {t('ctaText', 'Join leading financial institutions already leveraging our fintech ecosystem to streamline operations, reduce costs, and accelerate growth.')}
              </Text>
              
              <HStack spacing={4}>
                <Button
                  size="lg"
                  colorScheme="blue"
                  rightIcon={<ArrowRight />}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'xl',
                  }}
                  px={8}
                  height="60px"
                  fontSize="lg"
                  onClick={() => router.push('/signup')}
                >
                  {t('heroCTA', 'Start Your Free Trial')}
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  colorScheme="blue"
                  leftIcon={<FaWhatsapp size={20} />}
                  px={8}
                  height="60px"
                  fontSize="lg"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'md',
                  }}
                  onClick={() => window.open("https://api.whatsapp.com/send?phone=00447538636207", "_blank")}
                >
                  {t('scheduleDemo', 'Schedule Demo')}
                </Button>
              </HStack>
              
              <Text fontSize="sm" color={isDark ? 'gray.400' : 'gray.600'}>
                {t('commitmentText', 'No credit card required. 30-day free trial with full features and dedicated support.')}
              </Text>
            </VStack>
          </ChakraBox>
        </Container>
      </Box>
    </Box>
  );
}