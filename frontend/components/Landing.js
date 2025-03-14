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
  useColorModeValue,
  Icon,
  HStack,
  Grid,
  GridItem,
  SimpleGrid,
  Image,
  Divider,
  Center,
  Badge,
  useBreakpointValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import {
  ArrowRight,
  Users,
  CheckCircle,
  Shield,
  QrCode,
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
  ArrowRightCircle,
  Zap,
  BookOpen,
  Info,
  DollarSign,
  PlayCircle,
  Download,
  ExternalLink,
  ChevronDown,
  Truck,
  ShoppingBag
} from 'lucide-react';
import { 
  FaWhatsapp, 
  FaRegFile, 
  FaRegCreditCard, 
  FaHandHoldingUsd, 
  FaBalanceScale, 
  FaFileContract, 
  FaMosque, 
  FaExchangeAlt, 
  FaUniversity, 
  FaShieldAlt, 
  FaChevronRight, 
  FaMoneyBillWave, 
  FaDollarSign, 
  FaChartBar, 
  FaCoins, 
  FaUser,
  FaQrcode,
  FaStore,
  FaUtensils,
  FaShoppingBasket,
  FaMobileAlt
} from 'react-icons/fa';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const MotionBox = motion(Box);
const ChakraBox = motion(Box);

export default function LandingPage() {
  const { t } = useTranslation('common');
  const { colorMode } = useColorMode();
  const router = useRouter();
  const isDark = colorMode === 'dark';
  const containerRef = useRef(null);
  const { locale } = router;
  const isRTL = router.locale === 'ar';
  
  // For responsive design
  const isMobile = useBreakpointValue({ base: true, md: false });
  const heroImageSize = useBreakpointValue({ base: "100%", md: "90%" });
  const headingSize = useBreakpointValue({ base: "3xl", md: "4xl", lg: "5xl" });
  const glassCardBg = useColorModeValue('whiteAlpha.900', 'whiteAlpha.100');
  const headingColor = useColorModeValue('whiteAlpha.900', 'brand.bitdash.700');
  const textColor = useColorModeValue('brand.bitdash.400', 'brand.bitdash.400');
  const accentColor = '#8b7966'; // The gold/brown accent color from the main site
  const tolbahColor = '#FF7D1A'; // Orange color for tolbah
  const adfaalyColor = '#00bf63'; // Green color for Adfaaly

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
  
  return (
    <Box ref={containerRef} overflow="hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <Box 
        as="section" 
        position="relative"
        pt={{ base: 18, md: 20 }}
        overflow="hidden"
      >
        <Container maxW="container.xl" position="relative" zIndex="2">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 1, lg: 10 }} alignItems="center">
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
                    bgGradient="linear(to-r, #8b7966, #b8a28b)"
                    bgClip="text"
                  >
                    {t('Landinghero.title', 'Revolutionizing Digital Services')}
                  </Heading>
                  
                  <Text
                    fontSize={{ base: "lg", md: "xl" }}
                    maxW="550px"
                  >
                    {t('Landinghero.subtitle', 'From seamless deliveries to cashless payments, we offer innovative solutions for modern lifestyles.')}
                  </Text>
                  
                  <HStack spacing={6} mt={6} color={isDark ? "gray.400" : "gray.600"} flexWrap="wrap">
                    <HStack>
                      <Icon as={CheckCircle} />
                      <Text>{t('Landinghero.feature1', 'Delivery and Cashless Solutions')}</Text>
                    </HStack>
                    
                    <HStack>
                      <Icon as={CheckCircle} />
                      <Text>{t('Landinghero.feature2', 'Innovative Digital Services')}</Text>
                    </HStack>
                    
                    <HStack>
                      <Icon as={CheckCircle} />
                      <Text>{t('Landinghero.feature3', 'Secure Transactions')}</Text>
                    </HStack>
                  </HStack>
                </VStack>
              </MotionBox>
            </GridItem>
            
            <GridItem>
              <ParallaxBox offset={isMobile ? 30 : 100}>
                <Image
                  src="/images/digital-services.webp"
                  alt={t('alt.digitalServices', 'Digital Services Platform')}
                  borderRadius="xl"
                  width={heroImageSize}
                />
              </ParallaxBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>
      
      {/* Platform Overview Section */}
      <Box 
        as="section" 
        py={{ base: 16, md: 24 }}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl">
          <VStack spacing={16}>
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
                {t('platformSection.subtitle', 'Our Digital Ecosystem')}
              </Text>
              
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                color={isDark ? "white" : "#333"}
                mb={5}
              >
                {t('platformSection.title', 'Two Revolutionary Platforms')}
              </Heading>
              
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={isDark ? "gray.300" : "gray.600"}
              >
                {t('platformSection.description', 'Discover our innovative platforms designed to transform how you handle daily tasks, from deliveries to payments.')}
              </Text>
            </MotionBox>
            
            {/* Platform Cards */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} width="full">
              {/* tolbah Platform */}
              <PlatformCard
                title={t('platforms.tolbah.title', 'Tolbah')}
                description={t('platforms.tolbah.description', 'Your complete delivery solution for food, groceries, and retail items. Features QR ordering for seamless in-restaurant experiences.')}
                image="/tolbah.png"
                cta={t('platforms.tolbah.cta', 'Try Tolbah')}
                link="https://tolbah.bitdash.app"
                color={tolbahColor}
                delay={0}
              />
              
              {/* Adfaaly Platform */}
              <PlatformCard
                title={t('platforms.adfaaly.title', 'Adfaaly')}
                description={t('platforms.adfaaly.description', 'Cashless payment solution featuring merchant accounts, payment links, QR code payments, and a network of agent-operated human ATMs.')}
                image="/adfaaly.png"
                cta={t('platforms.adfaaly.cta', 'Try Adfaaly')}
                link="https://adfaaly.bitdash.app"
                color={adfaalyColor}
                delay={0.3}
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
      
      {/* tolbah Features Section */}
      <Box 
        as="section" 
        py={{ base: 16, md: 24 }}
        position="relative"
      >
        <Container maxW="container.xl">
          <VStack spacing={12} mb={12}>
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
                color={tolbahColor} 
                fontWeight="bold" 
                mb={3}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {t('tolbah.subtitle', 'Delivery Solutions')}
              </Text>
              
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                color={isDark ? "white" : "#333"}
                mb={5}
              >
                {t('tolbah.title', 'Tolbah: Beyond Delivery')}
              </Heading>
              
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={isDark ? "gray.300" : "gray.600"}
              >
                {t('tolbah.description', 'Experience seamless delivery of food, groceries, and retail items, plus innovative QR ordering for a contactless dining experience.')}
              </Text>
            </MotionBox>
          </VStack>

          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 10, lg: 16 }} alignItems="center">
            <GridItem order={{ base: 2, lg: 1 }}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                {/* Feature Cards */}
                <FeatureCard
                  icon={FaUtensils}
                  title={t('tolbah.features.food.title', 'Food Delivery')}
                  description={t('tolbah.features.food.description', 'Get hot, fresh food delivered directly to your doorstep from your favorite restaurants')}
                  delay={0}
                  color={tolbahColor}
                />
                
                <FeatureCard
                  icon={FaShoppingBasket}
                  title={t('tolbah.features.grocery.title', 'Grocery Delivery')}
                  description={t('tolbah.features.grocery.description', 'Fresh produce and pantry essentials delivered when you need them')}
                  delay={0.1}
                  color={tolbahColor}
                />
                
                <FeatureCard
                  icon={FaStore}
                  title={t('tolbah.features.retail.title', 'Retail Items')}
                  description={t('tolbah.features.retail.description', 'Shop electronics, gifts, and more from local stores with same-day delivery')}
                  delay={0.2}
                  color={tolbahColor}
                />
                
                <FeatureCard
                  icon={FaQrcode}
                  title={t('tolbah.features.qr.title', 'QR Ordering')}
                  description={t('tolbah.features.qr.description', 'Scan, order, and pay directly from your table at participating restaurants')}
                  delay={0.3}
                  color={tolbahColor}
                />
              </SimpleGrid>
            </GridItem>
            
            <GridItem order={{ base: 1, lg: 2 }}>
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <VStack spacing={6} align={{ base: "center", lg: "flex-start" }} textAlign={{ base: "center", lg: "left" }}>
                  <Image 
                    src="/images/delivery-app-screen.png" 
                    alt={t('tolbah.imageAlt', 'tolbah Delivery App Screenshot')}
                    width={{ base: "300px", md: "400px" }}
                    as={motion.img}
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  />        
                </VStack>
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>
      
      {/* Adfaaly Features Section */}
      <Box 
        as="section" 
        py={{ base: 16, md: 24 }}
        position="relative"
      >
        <Container maxW="container.xl">
          <VStack spacing={12} mb={12}>
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
                color={adfaalyColor} 
                fontWeight="bold" 
                mb={3}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {t('adfaaly.subtitle', 'Payment Solutions')}
              </Text>
              
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                color={isDark ? "white" : "#333"}
                mb={5}
              >
                {t('adfaaly.title', 'Adfaaly: The Cashless Revolution')}
              </Heading>
              
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={isDark ? "gray.300" : "gray.600"}
              >
                {t('adfaaly.description', 'A comprehensive payment solution that transforms how people handle cash, with merchant tools, agent networks, and instant transfers.')}
              </Text>
            </MotionBox>
          </VStack>

          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 10, lg: 16 }} alignItems="center">
            <GridItem>
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <VStack spacing={6} align={{ base: "center", lg: "flex-start" }} textAlign={{ base: "center", lg: "left" }}>
                  <Image 
                    src="/images/payment-app-screen.png" 
                    alt={t('adfaaly.imageAlt', 'Adfaaly Payment App Screenshot')}
                    width={{ base: "300px", md: "400px" }}
                    as={motion.img}
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  />        
                </VStack>
              </MotionBox>
            </GridItem>
            
            <GridItem>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                {/* Feature Cards */}
                <FeatureCard
                  icon={FaStore}
                  title={t('adfaaly.features.merchant.title', 'Merchant Tools')}
                  description={t('adfaaly.features.merchant.description', 'Issue payment links and QR codes to collect payments seamlessly')}
                  delay={0}
                  color={adfaalyColor}
                />
                
                <FeatureCard
                  icon={FaUser}
                  title={t('adfaaly.features.agent.title', 'Agent Network')}
                  description={t('adfaaly.features.agent.description', 'Human ATMs for cash deposits and withdrawals across the community')}
                  delay={0.1}
                  color={adfaalyColor}
                />
                
                <FeatureCard
                  icon={FaExchangeAlt}
                  title={t('adfaaly.features.transfer.title', 'Instant Transfers')}
                  description={t('adfaaly.features.transfer.description', 'Send money instantly to anyone, anywhere with just a few taps')}
                  delay={0.2}
                  color={adfaalyColor}
                />
                
                <FeatureCard
                  icon={FaShieldAlt}
                  title={t('adfaaly.features.secure.title', 'Secure Transactions')}
                  description={t('adfaaly.features.secure.description', 'Enterprise-grade security for all your financial activities')}
                  delay={0.3}
                  color={adfaalyColor}
                />
              </SimpleGrid>
            </GridItem>
          </Grid>
        </Container>
      </Box>
      
      {/* QR Ordering Section */}
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
                    color={tolbahColor}
                  >
                    {t('qr.title', 'QR Table Ordering')}
                  </Heading>
                  
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color={textColor}
                    maxW="600px"
                  >
                    {t('qr.subtitle', 'A contactless dining experience that revolutionizes how customers order in restaurants')}
                  </Text>
                  
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color={textColor}
                    maxW="600px"
                  >
                    {t('qr.description', 'Customers scan a QR code at their table to view the menu, place orders, and pay directly from their phones. No app download required, just a seamless web experience that enhances dining for everyone.')}
                  </Text>
                  
                  <Button
                    bg={tolbahColor}
                    color="white"
                    _hover={{ bg: "#E86C00" }}
                    size="lg"
                    rightIcon={<ArrowRight />}
                    onClick={() => router.push('/qr-ordering')}
                  >
                    {t('qr.learn_more', 'Learn More')}
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
                  src="/images/qr-ordering-screen.png" 
                  alt={t('qr.imageAlt', 'QR Ordering System')}
                  width="100%"
                />
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Agent Banking Section */}
      <Box 
        as="section" 
        py={{ base: 16, md: 24 }}
        position="relative"
      >
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 10, lg: 16 }} alignItems="center">
            <GridItem order={{ base: 1, lg: 2 }}>
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
                    color={adfaalyColor}
                  >
                    {t('agent.title', 'Human ATM Network')}
                  </Heading>
                  
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color={textColor}
                    maxW="600px"
                  >
                    {t('agent.subtitle', 'A network of trusted agents providing cash services in your community')}
                  </Text>
                  
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color={textColor}
                    maxW="600px"
                  >
                    {t('agent.description', 'Our agent network transforms local businesses and individuals into human ATMs, allowing for cash deposits and withdrawals from your Adfaaly account. Find agents near you, request services, and complete transactions with ease.')}
                  </Text>
                  
                  <Button
                    bg={adfaalyColor}
                    color="white"
                    _hover={{ bg: "#1D4044" }}
                    size="lg"
                    rightIcon={<ArrowRight />}
                    onClick={() => router.push('/agent-network')}
                  >
                    {t('agent.learn_more', 'Learn More')}
                  </Button>
                </VStack>
              </MotionBox>
            </GridItem>
            
            <GridItem order={{ base: 2, lg: 1 }}>
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={scaleUp}
              >
                <Image 
                  src="/images/agent-banking.png" 
                  alt={t('agent.imageAlt', 'Agent Banking Network')}
                  width="100%"
                />
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>
      
      {/* Mobile App Section */}
      <Box>
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
                    {t('app.title', 'Mobile Apps for All Services')}
                  </Heading>
                  
                  <Text
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="bold"
                    color="#8b7966"
                  >
                    {t('app.subtitle', 'DOWNLOAD AND EXPERIENCE THE DIFFERENCE')}
                  </Text>
                  
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color={isDark ? "gray.300" : "gray.600"}
                    maxW="600px"
                  >
                    {t('app.description', 'Get our mobile apps for both Tolbah and Adfaaly to enjoy seamless deliveries and payments wherever you go. Feature-rich interfaces designed for intuitive use.')}
                  </Text>
                  
                  <HStack spacing={4} mt={6} flexWrap="wrap">
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
              </MotionBox>
            </GridItem>
            
            <GridItem>
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={scaleUp}
              >
                <Box 
                  borderRadius="xl"
                  overflow="hidden"
                  transform="perspective(1000px) rotateY(-5deg) rotateX(5deg)"
                  transition="all 0.5s ease"
                  _hover={{
                    transform: "perspective(1000px) rotateY(0deg) rotateX(0deg)"
                  }}
                >
                  <Image 
                    src="/images/mobile-apps.png" 
                    alt={t('app.screenshotAlt', 'Mobile Apps')}
                    borderRadius="md"
                    width="100%"
                  />
                </Box>
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>
      
      {/* Steps to Start Section */}
      <Box as="section" py={{ base: 16, md: 24 }}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
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
                {t('steps.subtitle', 'Getting Started')}
              </Text>
              
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                color={isDark ? "white" : "#333"}
                mb={5}
              >
                {t('steps.title', 'Start Using Our Services in 3 Simple Steps')}
              </Heading>
              
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={isDark ? "gray.300" : "gray.600"}
              >
                {t('steps.description', 'Whether it\'s deliveries with Tolbah or cashless payments with Adfaaly, getting started is quick and easy.')}
              </Text>
            </MotionBox>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} width="full">
              <StepCard
                number="1"
                title={t('steps.step1.title', 'Download App')}
                description={t('steps.step1.description', 'Download Tolbah for deliveries or Adfaaly for payments from your app store')}
                delay={0}
              />
              
              <StepCard
                number="2"
                title={t('steps.step2.title', 'Create Account')}
                description={t('steps.step2.description', 'Sign up with your phone number and complete a simple verification process')}
                delay={0.1}
              />
              
              <StepCard
                number="3"
                title={t('steps.step3.title', 'Start Using')}
                description={t('steps.step3.description', 'Order deliveries or make cashless payments instantly')}
                delay={0.2}
              />
            </SimpleGrid>
            
            <Button
              bg="#8b7966"
              color="white"
              _hover={{ bg: "#9c7c63" }}
              size="lg"
              px={10}
              onClick={() => router.push('/download')}
              rightIcon={<ArrowRight />}
            >
              {t('steps.cta', 'Download Our Apps')}
            </Button>
          </VStack>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Box 
        as="section" 
        py={{ base: 16, md: 24 }}
      >
        <Container maxW="container.xl">
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
              borderRadius="xl"
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
                  {t('cta.subtitle', 'Ready to Transform Your Experience?')}
                </Text>
                
                <Heading
                  fontSize={{ base: "3xl", md: "4xl" }}
                  fontWeight="bold"
                  color={isDark ? "white" : "#333"}
                >
                  {t('cta.title', 'Get Started with Tolbah and Adfaaly Today')}
                </Heading>
                
                <Text 
                  fontSize="lg" 
                  color={isDark ? "gray.300" : "gray.600"}
                  maxW="2xl"
                >
                  {t('cta.description', 'Join thousands of users who have transformed their daily routines with our digital solutions. Experience seamless deliveries and cashless payments.')}
                </Text>
                
                <HStack spacing={6} pt={4} wrap="wrap" justify="center">
                  <Button
                    bg={tolbahColor}
                    color="white"
                    _hover={{ bg: "#E86C00" }}
                    size="lg"
                    px={8}
                    rightIcon={<ArrowRight />}
                    onClick={() => router.push('/signup')}
                  >
                    {t('cta.tolbahButton', 'Try Tolbah')}
                  </Button>
                  
                  <Button
                    bg={adfaalyColor}
                    color="white"
                    _hover={{ bg: "#1D4044" }}
                    size="lg"
                    px={8}
                    rightIcon={<ArrowRight />}
                    onClick={() => router.push('/signup')}
                  >
                    {t('cta.adfaalyButton', 'Try Adfaaly')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    borderColor="#8b7966"
                    color="#8b7966"
                    _hover={{ borderColor: "#9c7c63", color: "#9c7c63" }}
                    size="lg"
                    px={8}
                    leftIcon={<FaWhatsapp />}
                    onClick={() => window.open("https://api.whatsapp.com/send?phone=+447538636207", "_blank")}
                  >
                    {t('cta.supportButton', 'Contact Support')}
                  </Button>
                </HStack>
              </VStack>
            </Flex>
          </MotionBox>
        </Container>
      </Box>
      
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
              {t('legal.title', 'BitDash Digital Services')}
            </Heading>
            
            <Text fontSize="sm" color={isDark ? "gray.400" : "gray.600"} lineHeight="tall">
              {t('legal.disclaimer', 'Tolbah and Adfaaly are products of BitDash. Our delivery and payment services are designed to provide convenience and security. Please refer to our terms of service for complete information.')}
            </Text>
            
            <Divider borderColor={isDark ? "gray.700" : "gray.200"} />
            
            <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8}>
              <GridItem>
                <VStack align="flex-start" spacing={4}>
                  <Heading size="sm" color={isDark ? "white" : "gray.800"}>
                    {t('legal.coverage.title', 'Service Coverage')}
                  </Heading>
                  
                  <Text fontSize="sm" color={isDark ? "gray.400" : "gray.600"} lineHeight="tall">
                    {t('legal.coverage.content', 'Our services are currently available in select cities with plans for rapid expansion. Check our apps to see if delivery and payment services are available in your area.')}
                  </Text>
                </VStack>
              </GridItem>
              
              <GridItem>
                <VStack align="flex-start" spacing={4}>
                  <Heading size="sm" color={isDark ? "white" : "gray.800"}>
                    {t('legal.support.title', 'Customer Support')}
                  </Heading>
                  
                  <Text fontSize="sm" color={isDark ? "gray.400" : "gray.600"} lineHeight="tall">
                    {t('legal.support.content', 'Our dedicated support team is available to assist you with all delivery and payment related inquiries. Contact us through our apps or website.')}
                  </Text>
                </VStack>
              </GridItem>
            </Grid>
            
            <Wrap spacing={4}>
              {[
                'legal.links.privacy',
                'legal.links.terms',
                'legal.links.about',
                'legal.links.careers',
                'legal.links.help',
                'legal.links.contact'
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
            
            <Text fontSize="xs" color={isDark ? "gray.400" : "gray.600"} textAlign="center" mt={4}>
              {t('legal.copyright', '© 2025 BitDash. All rights reserved.')}
            </Text>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}

// Component for Platform Cards
const PlatformCard = ({ title, description, image, cta, link, color, delay }) => {
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
        p={6}
        borderRadius="lg"
        borderLeft="4px solid"
        borderColor={color}
        boxShadow="lg"
        height="full"
        bg={isDark ? "gray.800" : "white"}
        transition="all 0.3s"
        _hover={{
          transform: 'translateY(-8px)',
          boxShadow: 'xl'
        }}
      >
        <Flex mb={6} justify="space-between" align="center">
          <Image 
            src={image}
            alt={title}
            boxSize="60px"
            objectFit="contain"
          />
        </Flex>
        
        <Heading as="h3" size="md" mb={4} fontWeight="bold">
          {title}
        </Heading>
        
        <Text fontSize="sm" flex="1" mb={6}>
          {description}
        </Text>
        
        <Button 
          colorScheme="gray"
          variant="ghost"
          size="sm"
          rightIcon={<ExternalLink size={16} />}
          justifyContent="flex-start"
          pl={0}
          color={color}
          _hover={{ bg: "transparent", color: isDark ? `${color}300` : `${color}600` }}
          as="a"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          mt="auto"
        >
          {cta}
        </Button>
      </Flex>
    </MotionBox>
  );
};

// Component for Feature Cards
const FeatureCard = ({ icon, title, description, delay, color }) => {
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
        p={6}
        borderRadius="lg"
        boxShadow="md"
        height="full"
        bg={isDark ? "gray.700" : "white"}
        transition="all 0.3s"
        _hover={{
          transform: 'translateY(-5px)',
          boxShadow: 'lg'
        }}
      >
        <Circle
          size="40px"
          bg={color || "#8b7966"}
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
    </MotionBox>
  );
};

// Component for Islamic Principle Cards
const IslamicPrincipleCard = ({ icon, title, description, delay }) => {
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
        p={6}
        borderRadius="lg"
        boxShadow="md"
        height="full"
        bg={isDark ? "gray.700" : "white"}
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
    </MotionBox>
  );
};

// Component for Step Cards
const StepCard = ({ number, title, description, delay }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  return (
    <MotionBox
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
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
    </MotionBox>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}