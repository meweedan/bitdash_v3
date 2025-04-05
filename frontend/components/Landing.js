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
  ShoppingBag,
  Code,
  Smartphone,
  Globe,
  Command
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
  FaCode,
  FaMobileAlt,
  FaReact,
  FaNodeJs,
  FaAws,
  FaDocker,
  FaSwift,
  FaPython,
  FaAndroid,
  FaJava,
  FaStripe,
  FaCloud,
  FaLaptopCode,
  FaRocket,
  FaProjectDiagram,
  FaDatabase
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
  const bitdashBlue = '#387fc2'; // Primary brand color
  const tazdaniColor = '#00bf63'; // Green color for tazdani
  const devServicesColor = '#387fc2'; // Purple color for development services

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
  
  return (
    <Box ref={containerRef} overflow="hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
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
                    color="brand.bitdash.400"
                  >
                    {t('Landinghero.title', 'Innovative Software Solutions for Modern Businesses')}
                  </Heading>
                  
                  <Text
                    fontSize={{ base: "lg", md: "xl" }}
                    maxW="600px"
                    textAlign="center"
                  >
                    {t('Landinghero.subtitle', 'From revolutionary payment systems to custom software development, we bring your digital vision to life.')}
                  </Text>
                  
                  <HStack spacing={4} pt={6}>
                    <Button
                      colorScheme="blue"
                      size="lg"
                      rightIcon={<ArrowRight />}
                      onClick={() => router.push('/solutions')}
                      bg={bitdashBlue}
                      _hover={{ bg: "#2a6eab" }}
                    >
                      {t('hero.solutions', 'Our Solutions')}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      borderColor={bitdashBlue}
                      color={bitdashBlue}
                      rightIcon={<ArrowRight />}
                      onClick={() => router.push('/contact')}
                      _hover={{ bg: "rgba(56, 127, 194, 0.1)" }}
                    >
                      {t('hero.contact', 'Work With Us')}
                    </Button>
                  </HStack>
                </VStack>
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>
      
      {/* Solutions Overview Section */}
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
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                color={isDark ? "white" : "#333"}
                mb={5}
              >
                {t('solutions.title', 'Our Core Offerings')}
              </Heading>
            </MotionBox>
            
            {/* Solutions Cards */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} width="full">
              {/* Tazdani Platform */}
              <PlatformCard
                title={t('solutions.tazdani.title', 'tazdani Payment System')}
                description={t('solutions.tazdani.description', 'A comprehensive cashless payment solution featuring merchant accounts, payment links, QR code payments, and a network of agent-operated human ATMs.')}
                image="/tazdani.png"
                cta={t('solutions.tazdani.cta', 'Learn More')}
                link="/tazdani"
                color={tazdaniColor}
                delay={0}
              />
              
              {/* Development Services */}
              <PlatformCard
                title={t('solutions.dev.title', 'Custom Software Development')}
                description={t('solutions.dev.description', 'Bring your digital ideas to life with our expert team of developers, designers, and strategists. We build custom solutions tailored to your business needs.')}
                image="/images/bitdash-design-logo.png"
                cta={t('solutions.dev.cta', 'Our Services')}
                link="/services"
                color={devServicesColor}
                delay={0.3}
              />
            </SimpleGrid>
          </VStack>
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
                {t('tazdani.description', 'A comprehensive payment solution that transforms how people and businesses handle finances, with merchant tools, agent networks, and instant transfers.')}
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
      
      {/* Development Services Section */}
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
                color={devServicesColor} 
                fontWeight="bold" 
                mb={3}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {t('dev.subtitle', 'Custom Development')}
              </Text>
              
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                color={isDark ? "white" : "#333"}
                mb={5}
              >
                {t('dev.title', 'Bringing Your Ideas to Life')}
              </Heading>
              
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={isDark ? "gray.300" : "gray.600"}
              >
                {t('dev.description', 'Partner with our expert team to design and develop custom software solutions that drive growth and innovation for your business.')}
              </Text>
            </MotionBox>
          </VStack>

          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 10, lg: 16 }} alignItems="center">
            <GridItem order={{ base: 2, lg: 1 }}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                {/* Feature Cards */}
                <FeatureCard
                  icon={FaLaptopCode}
                  title={t('dev.features.webapps.title', 'Web Applications')}
                  description={t('dev.features.webapps.description', 'Responsive, scalable web applications built with modern technologies')}
                  delay={0}
                  color={devServicesColor}
                />
                
                <FeatureCard
                  icon={FaMobileAlt}
                  title={t('dev.features.mobile.title', 'Mobile Apps')}
                  description={t('dev.features.mobile.description', 'Native and cross-platform mobile applications for iOS and Android')}
                  delay={0.1}
                  color={devServicesColor}
                />
                
                <FeatureCard
                  icon={FaDatabase}
                  title={t('dev.features.backend.title', 'Backend Systems')}
                  description={t('dev.features.backend.description', 'Robust backend architecture and API development to power your solutions')}
                  delay={0.2}
                  color={devServicesColor}
                />
                
                <FeatureCard
                  icon={FaProjectDiagram}
                  title={t('dev.features.integration.title', 'System Integration')}
                  description={t('dev.features.integration.description', 'Seamless integration with existing systems and third-party services')}
                  delay={0.3}
                  color={devServicesColor}
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
                    src="/images/bitdash-design.png" 
                    alt={t('dev.imageAlt', 'Software Development Illustration')}
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
      
      {/* Collaboration Process Section */}
      <Box 
        as="section" 
        py={{ base: 16, md: 24 }}
        position="relative"
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
                color={bitdashBlue} 
                fontWeight="bold" 
                mb={3}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {t('process.subtitle', 'Our Approach')}
              </Text>
              
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                color={isDark ? "white" : "#333"}
                mb={5}
              >
                {t('process.title', 'How We Collaborate')}
              </Heading>
              
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={isDark ? "gray.300" : "gray.600"}
              >
                {t('process.description', 'Our streamlined process ensures that we deliver high-quality solutions that meet your business needs and exceed your expectations.')}
              </Text>
            </MotionBox>
            
            {/* Process Steps */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10} width="full">
              <StepCard 
                number="1" 
                title={t('process.steps.discovery.title', 'Discovery')}
                description={t('process.steps.discovery.description', 'We learn about your business, goals, and challenges to define clear project objectives.')}
                delay={0}
              />
              
              <StepCard 
                number="2" 
                title={t('process.steps.planning.title', 'Planning')}
                description={t('process.steps.planning.description', 'Our team creates a detailed roadmap with milestones, deliverables, and timelines.')}
                delay={0.1}
              />
              
              <StepCard 
                number="3" 
                title={t('process.steps.development.title', 'Development')}
                description={t('process.steps.development.description', 'We build your solution using agile methodologies with regular updates and feedback.')}
                delay={0.2}
              />
              
              <StepCard 
                number="4" 
                title={t('process.steps.delivery.title', 'Delivery & Support')}
                description={t('process.steps.delivery.description', 'We deploy your solution and provide ongoing support and maintenance services.')}
                delay={0.3}
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
      
      {/* Why Choose Us Section */}
      <Box 
        as="section" 
        position="relative"
        py={{ base: 16, md: 24 }}
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
                    color={bitdashBlue}
                  >
                    {t('whyus.title', 'Why Partner with bitdash?')}
                  </Heading>
                  
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color={textColor}
                    maxW="600px"
                  >
                    {t('whyus.subtitle', 'We combine technical expertise with business acumen to deliver solutions that drive real value.')}
                  </Text>
                  
                  <VStack spacing={4} align="stretch" width="full" pt={4}>
                    <HStack>
                      <Circle size="30px" bg={bitdashBlue} color="white">
                        <CheckCircle size={16} />
                      </Circle>
                      <Text fontWeight="medium">{t('whyus.points.expertise', 'Technical expertise across multiple platforms and technologies')}</Text>
                    </HStack>
                    
                    <HStack>
                      <Circle size="30px" bg={bitdashBlue} color="white">
                        <CheckCircle size={16} />
                      </Circle>
                      <Text fontWeight="medium">{t('whyus.points.proven', 'Proven track record with tazdani payment system')}</Text>
                    </HStack>
                    
                    <HStack>
                      <Circle size="30px" bg={bitdashBlue} color="white">
                        <CheckCircle size={16} />
                      </Circle>
                      <Text fontWeight="medium">{t('whyus.points.client', 'Client-centric approach with transparent communication')}</Text>
                    </HStack>
                    
                    <HStack>
                      <Circle size="30px" bg={bitdashBlue} color="white">
                        <CheckCircle size={16} />
                      </Circle>
                      <Text fontWeight="medium">{t('whyus.points.global', 'Global perspective with local understanding')}</Text>
                    </HStack>
                  </VStack>
                  
                  <Button
                    bg={bitdashBlue}
                    color="white"
                    _hover={{ bg: "#2a6eab" }}
                    size="lg"
                    rightIcon={<ArrowRight />}
                    onClick={() => router.push('/about')}
                    mt={4}
                  >
                    {t('whyus.learn_more', 'Learn More About Us')}
                  </Button>
                </VStack>
              </MotionBox>
            </GridItem>
            
            <GridItem>
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <Box
                  position="relative"
                  height={{ base: "300px", md: "400px" }}
                >
                  <GlobeMap />
                  <Heading
                    position="absolute"
                    bottom="20px"
                    left="0"
                    right="0"
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="bold"
                    textAlign="center"
                    color={isDark ? "white" : "#333"}
                    zIndex="1"
                  >
                    {t('startedInLibya', 'Started in Libya, Expanding Globally')}
                  </Heading>
                </Box>
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Technology Stack Section */}
      <Box 
        as="section" 
        py={{ base: 16, md: 24 }}
        position="relative"
      >
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
                color={bitdashBlue} 
                fontWeight="bold" 
                mb={3}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {t('tech.subtitle', 'Our Technology Stack')}
              </Text>
              
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                color={isDark ? "white" : "#333"}
                mb={5}
              >
                {t('tech.title', 'Cutting-Edge Technologies')}
              </Heading>
              
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={isDark ? "gray.300" : "gray.600"}
              >
                {t('tech.description', 'We leverage modern technologies to build scalable, secure, and high-performance applications.')}
              </Text>
            </MotionBox>
            
            <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} spacing={10}>
              <FeatureCard icon={FaReact} name="React" />
              <FeatureCard icon={FaNodeJs} name="Node.js" />
              <FeatureCard icon={FaDatabase} name="MongoDB" />
              <FeatureCard icon={FaAws} name="AWS" />
              <FeatureCard icon={FaDocker} name="Docker" />
              <FeatureCard icon={FaSwift} name="Swift" />
              <FeatureCard icon={FaAndroid} name="Android" />
              <FeatureCard icon={FaPython} name="Python" />
              <FeatureCard icon={FaJava} name="Java" />
              <FeatureCard icon={FaRocket} name="Firebase" />
              <FeatureCard icon={FaStripe} name="Stripe" />
              <FeatureCard icon={FaCloud} name="GCP" />
            </SimpleGrid>
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
                bg={bitdashBlue}
              />
              
              <VStack spacing={8} maxW="3xl" position="relative" zIndex="1">
                <Text 
                  color={bitdashBlue} 
                  fontWeight="bold" 
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  {t('cta.subtitle', 'Ready to Transform Your Business?')}
                </Text>
                
                <Heading
                  fontSize={{ base: "3xl", md: "4xl" }}
                  fontWeight="bold"
                  color={isDark ? "white" : "#333"}
                >
                  {t('cta.title', 'Let\'s Build Something Amazing Together')}
                </Heading>
                
                <Text 
                  fontSize="lg" 
                  color={isDark ? "gray.300" : "gray.600"}
                  maxW="2xl"
                >
                  {t('cta.description', 'Whether you need a payment solution or custom software development, our team is ready to help you turn your vision into reality.')}
                </Text>
                
                <HStack spacing={6} pt={4} wrap="wrap" justify="center">
                  <Button
                    bg={tazdaniColor}
                    color="white"
                    _hover={{ bg: "#00a857" }}
                    size="lg"
                    px={8}
                    rightIcon={<ArrowRight />}
                    onClick={() => router.push('/tazdani')}
                  >
                    {t('cta.tazdaniButton', 'Explore tazdani')}
                  </Button>
                  
                  <Button
                    bg={devServicesColor}
                    color="white"
                    _hover={{ bg: "#5a3ba3" }}
                    size="lg"
                    px={8}
                    rightIcon={<ArrowRight />}
                    onClick={() => router.push('/services')}
                  >
                    {t('cta.devButton', 'Our Services')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    borderColor={bitdashBlue}
                    color={bitdashBlue}
                    _hover={{ borderColor: "#2a6eab", color: "#2a6eab" }}
                    size="lg"
                    px={8}
                    leftIcon={<FaWhatsapp />}
                    aria-label="WhatsApp"
                  >
                    {t('cta.whatsappButton', 'Get in Touch')}
                  </Button>
                </HStack>
                </VStack>
              </Flex>
            </MotionBox>
        </Container> 
      </Box>
    </Box>
  );
};
