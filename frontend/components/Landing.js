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
import dynamic from 'next/dynamic';

const GlobeMap = dynamic(() => import('@/components/GlobeMap'), { ssr: false });

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
  const heroImageSize = useBreakpointValue({ base: "90%", md: "70%" });
  const headingSize = useBreakpointValue({ base: "3xl", md: "4xl", lg: "5xl" });
  const glassCardBg = useColorModeValue('whiteAlpha.900', 'whiteAlpha.100');
  const headingColor = useColorModeValue('whiteAlpha.900', 'brand.bitdash.700');
  const textColor = useColorModeValue('black.900', 'whiteAlpha.900');
  const accentColor = '#387fc2'; // The gold/brown accent color from the main site
  const utlubhaColor = '#FF7D1A'; // Orange color for utlubha
  const tazdaniColor = '#00bf63'; // Green color for tazdani

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
        pt={{ base: 18, md: 20 }}
        overflow="hidden"
      >
        <Container maxW="container.xl" position="relative" zIndex="2">
          <Grid alignItems="center">
            <GridItem>
              <MotionBox
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <VStack spacing={6}>
                  <Heading
                    as="h1"
                    fontSize={headingSize}
                    fontWeight="bold"
                    bgGradient="linear(to-r, #387fc2, #387fc2)"
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
                </VStack>
              </MotionBox>
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
              {/* <Text 
                color="#387fc2" 
                fontWeight="bold" 
                mb={3}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {t('platformSection.subtitle', 'Our Digital Ecosystem')}
              </Text> */}
              
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                color={isDark ? "white" : "#333"}
                mb={5}
              >
                {t('platformSection.title', 'Two Revolutionary Platforms')}
              </Heading>
            </MotionBox>
            
            {/* Platform Cards */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} width="full">
              {/* utlubha Platform */}
              <PlatformCard
                description={t('platforms.utlubha.description', 'Your complete delivery solution for food, groceries, and retail items. Features QR ordering for seamless in-restaurant experiences.')}
                image="/utlubha.png"
                cta={t('platforms.utlubha.cta', 'Try utlubha')}
                link="https://utlubha.bitdash.app"
                color={utlubhaColor}
                delay={0}
              />
              
              {/* tazdani Platform */}
              <PlatformCard
                description={t('platforms.tazdani.description', 'Cashless payment solution featuring merchant accounts, payment links, QR code payments, and a network of agent-operated human ATMs.')}
                image="/tazdani.png"
                cta={t('platforms.tazdani.cta', 'Try tazdani')}
                link="https://tazdani.bitdash.app"
                color={tazdaniColor}
                delay={0.3}
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
      
      {/* utlubha Features Section */}
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
                color={utlubhaColor} 
                fontWeight="bold" 
                mb={3}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {t('utlubha.subtitle', 'Delivery Solutions')}
              </Text>
              
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                color={isDark ? "white" : "#333"}
                mb={5}
              >
                {t('utlubha.title', 'utlubha: Beyond Delivery')}
              </Heading>
              
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={isDark ? "gray.300" : "gray.600"}
              >
                {t('utlubha.description', 'Experience seamless delivery of food, groceries, and retail items, plus innovative QR ordering for a contactless dining experience.')}
              </Text>
            </MotionBox>
          </VStack>

          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 10, lg: 16 }} alignItems="center">
            <GridItem order={{ base: 2, lg: 1 }}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                {/* Feature Cards */}
                <FeatureCard
                  icon={FaUtensils}
                  title={t('utlubha.features.food.title', 'Food Delivery')}
                  description={t('utlubha.features.food.description', 'Get hot, fresh food delivered directly to your doorstep from your favorite restaurants')}
                  delay={0}
                  color={utlubhaColor}
                />
                
                <FeatureCard
                  icon={FaShoppingBasket}
                  title={t('utlubha.features.grocery.title', 'Grocery Delivery')}
                  description={t('utlubha.features.grocery.description', 'Fresh produce and pantry essentials delivered when you need them')}
                  delay={0.1}
                  color={utlubhaColor}
                />
                
                <FeatureCard
                  icon={FaStore}
                  title={t('utlubha.features.retail.title', 'Retail Items')}
                  description={t('utlubha.features.retail.description', 'Shop electronics, gifts, and more from local stores with same-day delivery')}
                  delay={0.2}
                  color={utlubhaColor}
                />
                
                <FeatureCard
                  icon={FaQrcode}
                  title={t('utlubha.features.qr.title', 'QR Ordering')}
                  description={t('utlubha.features.qr.description', 'Scan, order, and pay directly from your table at participating restaurants')}
                  delay={0.3}
                  color={utlubhaColor}
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
                    src="/images/delivery-man.png" 
                    alt={t('utlubha.imageAlt', 'utlubha Delivery App Screenshot')}
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
      
      {/* tazdani Features Section */}
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
                color={tazdaniColor} 
                fontWeight="bold" 
                mb={3}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {t('tazdani.subtitle', 'Payment Solutions')}
              </Text>
              
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                color={isDark ? "white" : "#333"}
                mb={5}
              >
                {t('tazdani.title', 'tazdani: The Cashless Revolution')}
              </Heading>
              
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={isDark ? "gray.300" : "gray.600"}
              >
                {t('tazdani.description', 'A comprehensive payment solution that transforms how people handle cash, with merchant tools, agent networks, and instant transfers.')}
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
            
            <GridItem>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                {/* Feature Cards */}
                <FeatureCard
                  icon={FaStore}
                  title={t('tazdani.features.merchant.title', 'Merchant Tools')}
                  description={t('tazdani.features.merchant.description', 'Issue payment links and QR codes to collect payments seamlessly')}
                  delay={0}
                  color={tazdaniColor}
                />
                
                <FeatureCard
                  icon={FaUser}
                  title={t('tazdani.features.agent.title', 'Agent Network')}
                  description={t('tazdani.features.agent.description', 'Human ATMs for cash deposits and withdrawals across the community')}
                  delay={0.1}
                  color={tazdaniColor}
                />
                
                <FeatureCard
                  icon={FaExchangeAlt}
                  title={t('tazdani.features.transfer.title', 'Instant Transfers')}
                  description={t('tazdani.features.transfer.description', 'Send money instantly to anyone, anywhere with just a few taps')}
                  delay={0.2}
                  color={tazdaniColor}
                />
                
                <FeatureCard
                  icon={FaShieldAlt}
                  title={t('tazdani.features.secure.title', 'Secure Transactions')}
                  description={t('tazdani.features.secure.description', 'Enterprise-grade security for all your financial activities')}
                  delay={0.3}
                  color={tazdaniColor}
                />
              </SimpleGrid>
            </GridItem>
          </Grid>
        </Container>
      </Box>
      
      {/* QR Ordering Section */}
      <Box 
        as="section" 
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
                    color={utlubhaColor}
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
                    bg={utlubhaColor}
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
                    color={tazdaniColor}
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
                    {t('agent.description', 'Our agent network transforms local businesses and individuals into human ATMs, allowing for cash deposits and withdrawals from your tazdani account. Find agents near you, request services, and complete transactions with ease.')}
                  </Text>
                  
                  <Button
                    bg={tazdaniColor}
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
          </Grid>
          <Heading
            fontSize={{ base: "3xl", md: "4xl" }}
            py={{ base: 10, md: 20}}
            fontWeight="bold"
            textAlign="center"
            color={isDark ? "white" : "#333"}
          >
            {t('startedInLibya')}
          </Heading>
          <GlobeMap />
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
                bg="#387fc2"
              />
              
              <VStack spacing={8} maxW="3xl" position="relative" zIndex="1">
                <Text 
                  color="#387fc2" 
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
                  {t('cta.title', 'Get Started with Utlubha and tazdani Today')}
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
                    bg={utlubhaColor}
                    px={8}
                    rightIcon={<ArrowRight />}
                    onClick={() => router.push('/signup')}
                  >
                    {t('cta.utlubhaButton', 'Try Utlubha')}
                  </Button>
                  
                  <Button
                    bg={tazdaniColor}
                    px={8}
                    rightIcon={<ArrowRight />}
                    onClick={() => router.push('/signup')}
                  >
                    {t('cta.tazdaniButton', 'Try tazdani')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    borderColor="#387fc2"
                    color="#387fc2"
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
          variant="ghost"
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
          bg={color || "#387fc2"}
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
          bg="#387fc2"
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
            borderColor: "#387fc2",
            opacity: 0.5,
            transform: "scale(1.1)"
          }}
        >
          <Text
            fontSize="4xl"
            fontWeight="bold"
            color="#387fc2"
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