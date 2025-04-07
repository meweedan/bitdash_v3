import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { TbBrandNextjs } from "react-icons/tb";
import { SiMysql } from "react-icons/si";
import { IoLogoPwa } from "react-icons/io5";
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
  Badge,
  useBreakpointValue,
} from '@chakra-ui/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import {
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Users,
  Shield,
  QrCode,
  LineChart,
  TrendingUp,
  Play,
  PlayCircle,
  ChevronRight,
  Zap
} from 'lucide-react';
import { 
  FaWhatsapp, 
  FaRegCreditCard, 
  FaHandHoldingUsd, 
  FaExchangeAlt, 
  FaShieldAlt,
  FaStore,
  FaUser,
  FaQrcode,
  FaMobileAlt,
  FaReact,
  FaNodeJs,
  FaAws,
  FaCloud,
  FaGit,
  FaNextjs,
  FaMysql,
  FaDocker,
  FaSwift,
  FaPython,
  FaAndroid,
  FaJava,
  FaLaptopCode,
  FaRocket,
  FaProjectDiagram,
  FaDatabase
} from 'react-icons/fa';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';

// Dynamic import for better performance
const GlobeMap = dynamic(() => import('@/components/GlobeMap'), { ssr: false });

// Motion components for animations
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionImage = motion(Image);

export default function LandingPage() {
  const { t } = useTranslation('common');
  const { colorMode } = useColorMode();
  const containerRef = useRef(null);
  const router = useRouter();
  const isDark = colorMode === 'dark';
  const { locale } = router;
  const isRTL = router.locale === 'ar';
  
  // For responsive design
  const isMobile = useBreakpointValue({ base: true, md: false });
  const headingSize = useBreakpointValue({ base: "3xl", md: "4xl", lg: "5xl" });

    // Color schemes and styling
  const bgGradient = useColorModeValue(
    'linear(to-b, green.50, white)',
    'linear(to-b, gray.900, black)'
  );
  
  // Theme colors
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const bitdashBlue = '#387fc2'; // Primary brand color
  const tazdaniGreen = '#00bf63'; // Green color for tazdani
  const cardBg = useColorModeValue('white', 'gray.800');
  const subtleBg = useColorModeValue('gray.50', 'gray.900');
  
  // For intersection observer animations
  const [inViewRef, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  // Custom Hook for Intersection Observer
  function useInView(options) {
    const [ref, setRef] = useState(null);
    const [inView, setInView] = useState(false);
  
    useEffect(() => {
      if (!ref) return;
      
      const observer = new IntersectionObserver(([entry]) => {
        setInView(entry.isIntersecting);
        
        if (entry.isIntersecting && options.triggerOnce) {
          observer.unobserve(ref);
        }
      }, options);
      
      observer.observe(ref);
      
      return () => {
        if (ref) observer.unobserve(ref);
      };
    }, [ref, options]);
  
    return [setRef, inView];
  }

  // Component for Feature Cards
  const FeatureCard = ({ icon, title, description, delay = 0, color = bitdashBlue }) => {
    const [cardRef, isInView] = useInView({ threshold: 0.1, triggerOnce: true });
    
    return (
      <MotionBox
        ref={cardRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
              duration: 0.5, 
              delay: delay,
              ease: [0.22, 1, 0.36, 1]
            }
          }
        }}
      >
        <Flex
          direction="column"
          p={6}
          borderRadius="xl"
          boxShadow="md"
          bg={cardBg}
          height="full"
          transition="all 0.3s"
          _hover={{
            transform: 'translateY(-8px)',
            boxShadow: 'xl',
            borderColor: color
          }}
          borderWidth="1px"
          borderColor={useColorModeValue("gray.200", "gray.700")}
          position="relative"
          overflow="hidden"
        >
          <Box position="absolute" top="0" left="0" right="0" height="4px" bg={color} />
          
          <Circle
            size="48px"
            bg={`${color}20`}
            color={color}
            mb={4}
          >
            <Icon as={icon} boxSize={5} />
          </Circle>
          
          <Heading as="h3" size="md" mb={3} fontWeight="bold">
            {title}
          </Heading>
          
          <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>
            {description}
          </Text>
        </Flex>
      </MotionBox>
    );
  };

  // Component for Solution Cards
  const SolutionCard = ({ title, description, image, cta, link, color, delay = 0 }) => {
    const [cardRef, isInView] = useInView({ threshold: 0.1, triggerOnce: true });
    
    return (
      <MotionBox
        ref={cardRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
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
          p={8}
          borderRadius="2xl"
          bg={cardBg}
          height="full"
          boxShadow="lg"
          position="relative"
          overflow="hidden"
          transition="all 0.3s"
          _hover={{
            transform: 'translateY(-12px)',
            boxShadow: '2xl'
          }}
        >
          <Box 
            position="absolute" 
            top="0" 
            left="0" 
            right="0" 
            height="6px" 
            bg={color} 
          />
          
          <Flex mb={6} justify="space-between" align="center">
            <Image 
              src={image}
              alt={title}
              objectFit="contain"
              height="60px"
            />
          </Flex>
          
          <Heading as="h3" size="lg" mb={4} fontWeight="bold">
            {title}
          </Heading>
          
          <Text fontSize="md" flex="1" mb={8} color={useColorModeValue("gray.600", "gray.300")}>
            {description}
          </Text>
          
          <Button 
            colorScheme={color === tazdaniGreen ? "green" : "blue"}
            rightIcon={<ArrowRight size={16} />}
            justifyContent="space-between"
            width="full"
            bg={color}
            _hover={{ bg: color === tazdaniGreen ? "#00a857" : "#2a6eab" }}
            as="a"
            href={link}
            mt="auto"
            size="lg"
          >
            {cta}
          </Button>
        </Flex>
      </MotionBox>
    );
  };

  // Component for Process Steps
  const ProcessStep = ({ number, title, description, delay = 0 }) => {
    const [stepRef, isInView] = useInView({ threshold: 0.1, triggerOnce: true });
    
    return (
      <MotionBox
        ref={stepRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
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
            w="80px"
            h="80px"
            borderRadius="full"
            boxShadow="xl"
            position="relative"
            bg={cardBg}
            _after={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "full",
              border: "2px dashed",
              borderColor: bitdashBlue,
              opacity: 0.5,
              transform: "scale(1.1)",
              animation: "spin 30s linear infinite",
            }}
          >
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color={bitdashBlue}
            >
              {number}
            </Text>
          </Flex>
          
          <Heading size="md" textAlign="center">{title}</Heading>
          
          <Text textAlign="center" color={useColorModeValue("gray.600", "gray.300")}>
            {description}
          </Text>
        </VStack>
      </MotionBox>
    );
  };
  
  return (
    <Box ref={containerRef} bg={subtleBg} overflow="hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <Box 
        as="section" 
        pt={{ base: 10, md: 16 }}
        pb={{ base: 20, md: 28 }}
        position="relative"
        overflow="hidden"
      >
        {/* Background gradient */}
        <Container maxW="container.xl" position="relative" zIndex="2">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 12, lg: 16 }} alignItems="center">
            <GridItem>
              <MotionBox
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <VStack spacing={6} position="relative" align={{ base: "center", lg: "flex-start" }} textAlign={{ base: "center", lg: "left" }}>
                  <Heading>
                    {t('Landinghero.title', 'Innovative Software Solutions for Modern Businesses')}
                  </Heading>
                  
                  <Text
                    color={useColorModeValue("gray.600", "gray.300")}
                  >
                    {t('Landinghero.subtitle', 'From revolutionary payment systems to custom software development, we bring your digital vision to life.')}
                  </Text>
                  
                  <HStack pt={6}>                    
                    <Button
                      variant="outline"
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
            
            <GridItem display="flex" justifyContent="center">
              <MotionBox
                initial="hidden"
                animate="visible"
                variants={scaleUp}
              >
                <MotionImage
                  src="/images/web-design.png" 
                  alt="Software solutions"
                  maxW="100%"
                  animate={{ 
                    y: [0, -15, 0],
                    transition: { 
                      repeat: Infinity, 
                      duration: 6, 
                      ease: "easeInOut" 
                    }
                  }}
                />
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
        bg={subtleBg}
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
                {t('solutions.subtitle', 'What We Offer')}
              </Text>
              
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                mb={5}
              >
                {t('solutions.title', 'Our Core Offerings')}
              </Heading>
              
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={useColorModeValue("gray.600", "gray.300")}
              >
                {t('solutions.description', 'Two powerful solutions to transform your business and accelerate growth')}
              </Text>
            </MotionBox>
            
            {/* Solutions Cards */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10} width="full">
              {/* Tazdani Platform */}
              <SolutionCard
                title={t('solutions.tazdani.title', 'tazdani Payment System')}
                description={t('solutions.tazdani.description', 'A comprehensive cashless payment solution featuring merchant accounts, payment links, QR code payments, and a network of agent-operated human ATMs.')}
                image="/tazdani.png"
                cta={t('solutions.tazdani.cta', 'Learn More')}
                link="/tazdani"
                color={tazdaniGreen}
                delay={0}
              />
              
              {/* Development Services */}
              <SolutionCard
                title={t('solutions.dev.title', 'Custom Software Development')}
                description={t('solutions.dev.description', 'Bring your digital ideas to life with our expert team of developers, designers, and strategists. We build custom solutions tailored to your business needs.')}
                image="/images/bitdash-design-logo.png"
                cta={t('solutions.dev.cta', 'Our Services')}
                link="/services"
                color={bitdashBlue}
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
              <Badge 
                colorScheme="green" 
                px={3} 
                py={1} 
                borderRadius="full" 
                textTransform="uppercase" 
                fontSize="xs" 
                fontWeight="bold"
                bg={`${tazdaniGreen}20`}
                color={tazdaniGreen}
              >
                {t('tazdani.badge', 'Fintech Solution')}
              </Badge>
              
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                mt={3}
                mb={5}
              >
                {t('tazdani.title', 'tazdani: The Cashless Revolution')}
              </Heading>
              
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={useColorModeValue("gray.600", "gray.300")}
              >
                {t('tazdani.description', 'A comprehensive payment solution that transforms how people and businesses handle finances, with merchant tools, agent networks, and instant transfers.')}
              </Text>
            </MotionBox>

            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 10, lg: 16 }} alignItems="center">
              <GridItem>
                <MotionBox
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={slideInLeft}
                >
                  <Box position="relative" textAlign="center">
                    <Circle 
                      position="absolute"
                      size="300px"
                      bg={`${tazdaniGreen}10`}
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      opacity={0.7}
                      zIndex={0}
                    />
                    
                    <MotionImage 
                      src="/images/money-transfer.png" 
                      alt={t('tazdani.imageAlt', 'tazdani Payment App Screenshot')}
                      width={{ base: "100%", md: "80%" }}
                      position="relative"
                      zIndex={1}
                      animate={{ 
                        y: [0, -15, 0],
                        transition: { 
                          repeat: Infinity, 
                          duration: 6,
                          ease: "easeInOut" 
                        }
                      }}
                    />
                  </Box>    
                </MotionBox>
              </GridItem>
              
              <GridItem>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {/* Feature Cards */}
                  <FeatureCard
                    icon={FaStore}
                    title={t('tazdani.features.merchant.title', 'Merchant Tools')}
                    description={t('tazdani.features.merchant.description', 'Issue payment links and QR codes to collect payments seamlessly')}
                    delay={0}
                    color={tazdaniGreen}
                  />
                  
                  <FeatureCard
                    icon={FaUser}
                    title={t('tazdani.features.agent.title', 'Agent Network')}
                    description={t('tazdani.features.agent.description', 'Human ATMs for cash deposits and withdrawals across the community')}
                    delay={0.1}
                    color={tazdaniGreen}
                  />
                  
                  <FeatureCard
                    icon={FaExchangeAlt}
                    title={t('tazdani.features.transfer.title', 'Instant Transfers')}
                    description={t('tazdani.features.transfer.description', 'Send money instantly to anyone, anywhere with just a few taps')}
                    delay={0.2}
                    color={tazdaniGreen}
                  />
                  
                  <FeatureCard
                    icon={FaShieldAlt}
                    title={t('tazdani.features.secure.title', 'Secure Transactions')}
                    description={t('tazdani.features.secure.description', 'Enterprise-grade security for all your financial activities')}
                    delay={0.3}
                    color={tazdaniGreen}
                  />
                </SimpleGrid>
                
                <Button
                  mt={8}
                  size="lg"
                  rightIcon={<ArrowRight />}
                  bg={tazdaniGreen}
                  color="white"
                  _hover={{ bg: "#00a857" }}
                  onClick={() => router.push('/tazdani')}
                >
                  {t('tazdani.learnMore', 'Explore tazdani Platform')}
                </Button>
              </GridItem>
            </Grid>
          </VStack>
        </Container>
      </Box>
      
      {/* Development Services Section */}
      <Box 
        as="section" 
        py={{ base: 16, md: 24 }}
        position="relative"
        bg={subtleBg}
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
              <Badge 
                colorScheme="blue" 
                px={3} 
                py={1} 
                borderRadius="full" 
                textTransform="uppercase" 
                fontSize="xs" 
                fontWeight="bold"
                bg={`${bitdashBlue}20`}
                color={bitdashBlue}
              >
                {t('dev.badge', 'Development Expertise')}
              </Badge>
              
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                mt={3}
                mb={5}
              >
                {t('dev.title', 'Bringing Your Ideas to Life')}
              </Heading>
              
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={useColorModeValue("gray.600", "gray.300")}
              >
                {t('dev.description', 'Partner with our expert team to design and develop custom software solutions that drive growth and innovation for your business.')}
              </Text>
            </MotionBox>

            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 10, lg: 16 }} alignItems="center">
              <GridItem order={{ base: 2, lg: 1 }}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {/* Feature Cards */}
                  <FeatureCard
                    icon={FaLaptopCode}
                    title={t('dev.features.webapps.title', 'Web Applications')}
                    description={t('dev.features.webapps.description', 'Responsive, scalable web applications built with modern technologies')}
                    delay={0}
                    color={bitdashBlue}
                  />
                  
                  <FeatureCard
                    icon={FaMobileAlt}
                    title={t('dev.features.mobile.title', 'Mobile Apps')}
                    description={t('dev.features.mobile.description', 'Native and cross-platform mobile applications for iOS and Android')}
                    delay={0.1}
                    color={bitdashBlue}
                  />
                  
                  <FeatureCard
                    icon={FaDatabase}
                    title={t('dev.features.backend.title', 'Backend Systems')}
                    description={t('dev.features.backend.description', 'Robust backend architecture and API development to power your solutions')}
                    delay={0.2}
                    color={bitdashBlue}
                  />
                  
                  <FeatureCard
                    icon={FaProjectDiagram}
                    title={t('dev.features.integration.title', 'System Integration')}
                    description={t('dev.features.integration.description', 'Seamless integration with existing systems and third-party services')}
                    delay={0.3}
                    color={bitdashBlue}
                  />
                </SimpleGrid>
                
                <Button
                  mt={8}
                  size="lg"
                  rightIcon={<ArrowRight />}
                  bg={bitdashBlue}
                  color="white"
                  _hover={{ bg: "#2a6eab" }}
                  onClick={() => router.push('/services')}
                >
                  {t('dev.learnMore', 'Explore Development Services')}
                </Button>
              </GridItem>
              
              <GridItem order={{ base: 1, lg: 2 }}>
                <MotionBox
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={slideInRight}
                >
                  <Box position="relative" textAlign="center">
                    <Circle 
                      position="absolute"
                      size="300px"
                      bg={`${bitdashBlue}10`}
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      opacity={0.7}
                      zIndex={0}
                    />
                    
                    <MotionImage 
                      src="/images/bitdash-design.png" 
                      alt={t('dev.imageAlt', 'Software Development Illustration')}
                      width={{ base: "100%", md: "80%" }}
                      position="relative"
                      zIndex={1}
                      animate={{ 
                        y: [0, -15, 0],
                        transition: { 
                          repeat: Infinity, 
                          duration: 6,
                          ease: "easeInOut" 
                        }
                      }}
                    />
                  </Box>        
                </MotionBox>
              </GridItem>
            </Grid>
          </VStack>
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
                mb={5}
              >
                {t('process.title', 'How We Collaborate')}
              </Heading>
              
                            <Text
                fontSize={{ base: "md", md: "lg" }}
                color={useColorModeValue("gray.600", "gray.300")}
              >
                {t('process.description', 'A structured approach to ensure your vision is perfectly translated into digital reality')}
              </Text>
            </MotionBox>

            {/* Process Steps */}
            <SimpleGrid 
              columns={{ base: 1, md: 2, lg: 4 }} 
              spacing={10} 
              width="full"
            >
              <ProcessStep
                number="1"
                title={t('process.step1.title', 'Discovery & Planning')}
                description={t('process.step1.description', 'Deep dive into your business needs and technical requirements to create a comprehensive project plan')}
                delay={0}
              />
              
              <ProcessStep
                number="2"
                title={t('process.step2.title', 'Design & Prototyping')}
                description={t('process.step2.description', 'Craft intuitive user experiences and develop interactive prototypes for validation')}
                delay={0.2}
              />
              
              <ProcessStep
                number="3"
                title={t('process.step3.title', 'Development')}
                description={t('process.step3.description', 'Agile development process with continuous integration and regular progress updates')}
                delay={0.4}
              />
              
              <ProcessStep
                number="4"
                title={t('process.step4.title', 'Launch & Support')}
                description={t('process.step4.description', 'Deployment, monitoring, and ongoing support to ensure long-term success')}
                delay={0.6}
              />
            </SimpleGrid>

            <Button
              size="lg"
              colorScheme="blue"
              rightIcon={<Zap size={18} />}
              bg={bitdashBlue}
              _hover={{ bg: "#2a6eab" }}
              onClick={() => router.push('/contact')}
              px={8}
              boxShadow="xl"
            >
              {t('process.cta', 'Start Your Project Now')}
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Tech Stack Section */}
      <Box 
        as="section" 
        py={{ base: 16, md: 24 }}
        mb={{ base: 16, md: 24 }}
        bg={subtleBg}
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
                {t('tech.subtitle', 'Our Technology Stack')}
              </Text>
              
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                mb={5}
              >
                {t('tech.title', 'Built With Modern Technologies')}
              </Heading>
            </MotionBox>

            <SimpleGrid 
              columns={{ base: 3, md: 6 }} 
              spacing={8} 
              width="full"
              maxW="4xl"
              mx="auto"
            >
              {[
                { icon: FaReact, name: 'React', color: '#61DAFB' },
                { icon: TbBrandNextjs, name: 'Next.js', color: '#000000'},
                { icon: FaNodeJs, name: 'Node.js', color: '#68A063' },
                { icon: FaAndroid, name: 'Android', color: '#4479A1' },
                { icon: IoLogoPwa, name: 'PWA', color: '#4479A1' },
                { icon: SiMysql, name: 'MySQL', color: '#4479A1' },
                { icon: FaAws, name: 'AWS', color: '#FF9900' },
                { icon: FaDocker, name: 'Docker', color: '#2496ED' },
                { icon: FaSwift, name: 'Swift', color: '#F05138' },
                { icon: FaCloud, name: 'Cloud', color: '#4169E' },
                { icon: FaPython, name: 'Python', color: '#3776AB' },
                { icon: FaGit, name: 'Git', color: '#F05050' },
              ].map((tech, index) => (
                <MotionBox
                  key={tech.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { 
                      opacity: 1, 
                      scale: 1,
                      transition: { 
                        delay: index * 0.1,
                        duration: 0.5 
                      }
                    }
                  }}
                  textAlign="center"
                >
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    p={6}
                    bg={cardBg}
                    borderRadius="xl"
                    boxShadow="md"
                    height="full"
                    _hover={{
                      transform: 'translateY(-5px)',
                      boxShadow: 'lg',
                    }}
                    transition="all 0.3s"
                  >
                    <Icon 
                      as={tech.icon} 
                      boxSize={12} 
                      color={tech.color}
                      mb={4}
                    />
                    <Text fontWeight="medium">{tech.name}</Text>
                  </Flex>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}