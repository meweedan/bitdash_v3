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
  ArrowRightCircle,
  Zap,
  BookOpen,
  Info,
  DollarSign,
  PlayCircle,
  Download,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { FaWhatsapp, FaRegFile, FaRegCreditCard, FaHandHoldingUsd, FaBalanceScale, FaFileContract, FaMosque, FaChartLine, FaExchangeAlt, FaUniversity, FaShieldAlt, FaChevronRight, FaBitcoin, FaDollarSign, FaChartBar, FaCoins, FaUser } from 'react-icons/fa';
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
                    {t('Landinghero.title')}
                  </Heading>
                  
                  <Text
                    fontSize={{ base: "lg", md: "xl" }}
                    maxW="550px"
                  >
                    {t('Landinghero.subtitle')}
                  </Text>
                  
                  <HStack spacing={6} mt={6} color={isDark ? "gray.400" : "gray.600"} flexWrap="wrap">
                    <HStack>
                      <Icon as={CheckCircle} />
                      <Text>{t('Landinghero.feature1')}</Text>
                    </HStack>
                    
                    <HStack>
                      <Icon as={CheckCircle} />
                      <Text>{t('Landinghero.feature2')}</Text>
                    </HStack>
                    
                    <HStack>
                      <Icon as={CheckCircle} />
                      <Text>{t('Landinghero.feature3')}</Text>
                    </HStack>
                  </HStack>
                </VStack>
              </MotionBox>
            </GridItem>
            
            <GridItem>
              <ParallaxBox offset={isMobile ? 30 : 100}>
                  <Image 
                    src="/images/iphones-chart.webp" 
                    alt={t('alt.tradingPlatform')}
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
                {t('platformSection.subtitle')}
              </Text>
              
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                color={isDark ? "white" : "#333"}
                mb={5}
              >
                {t('platformSection.title')}
              </Heading>
              
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={isDark ? "gray.300" : "gray.600"}
              >
                {t('platformSection.description')}
              </Text>
            </MotionBox>
            
            {/* Platform Cards */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} width="full">
              {/* Bsoraa Platform */}
              <PlatformCard
                title={t('platforms.forex.title')}
                description={t('platforms.forex.description')}
                image="/images/eur.png"
                cta={t('platforms.forex.cta')}
                link="https://bsoraa.bitdash.app"
                color="#8b7966"
                delay={0}
              />
              
              {/* Adfaaly Platform */}
              <PlatformCard
                title={t('platforms.adfaaly.title')}
                description={t('platforms.adfaaly.description')}
                image="/images/usd.png"
                cta={t('platforms.adfaaly.cta')}
                link="https://adfaaly.bitdash.app"
                color="#8b7966"
                delay={0.3}
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
      
      {/* Trading Features Section */}
      <Box 
        as="section" 
        py={{ base: 16, md: 24 }}
        position="relative"
      >
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 10, lg: 16 }} alignItems="center">
            <GridItem order={{ base: 2, lg: 1 }}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                {/* Feature Cards */}
                <FeatureCard
                  icon={Globe}
                  title={t('features.global.title')}
                  description={t('features.global.description')}
                  delay={0}
                />
                
                <FeatureCard
                  icon={Shield}
                  title={t('features.secure.title')}
                  description={t('features.secure.description')}
                  delay={0.1}
                />
                
                <FeatureCard
                  icon={LineChart}
                  title={t('features.analysis.title')}
                  description={t('features.analysis.description')}
                  delay={0.2}
                />
                
                <FeatureCard
                  icon={Clock}
                  title={t('features.execution.title')}
                  description={t('features.execution.description')}
                  delay={0.3}
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
                      src="/images/trading-banner.png" 
                      alt={t('products.hundredsAlt')}
                      width={{ base: "300px", md: "500px" }}
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
      
      {/* Islamic Finance Section */}
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
                color="#8b7966" 
                fontWeight="bold" 
                mb={3}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {t('islamic.subtitle')}
              </Text>
              
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                color={isDark ? "white" : "#333"}
                mb={5}
              >
                {t('islamic.title')}
              </Heading>
              
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={isDark ? "gray.300" : "gray.600"}
              >
                {t('islamic.description')}
              </Text>
            </MotionBox>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} width="full">
              <IslamicPrincipleCard
                icon={FaMosque}
                title={t('islamic.principles.compliant.title')}
                description={t('islamic.principles.compliant.description')}
                delay={0}
              />
              
              <IslamicPrincipleCard
                icon={FaHandHoldingUsd}
                title={t('islamic.principles.noRiba.title')}
                description={t('islamic.principles.noRiba.description')}
                delay={0.1}
              />
              
              <IslamicPrincipleCard
                icon={FaBalanceScale}
                title={t('islamic.principles.ethical.title')}
                description={t('islamic.principles.ethical.description')}
                delay={0.2}
              />
              
              <IslamicPrincipleCard
                icon={FaFileContract}
                title={t('islamic.principles.transparent.title')}
                description={t('islamic.principles.transparent.description')}
                delay={0.3}
              />
            </SimpleGrid>
          </VStack>
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
                    {t('app.title')}
                  </Heading>
                  
                  <Text
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="bold"
                    color="#8b7966"
                  >
                    {t('app.subtitle')}
                  </Text>
                  
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color={isDark ? "gray.300" : "gray.600"}
                    maxW="600px"
                  >
                    {t('app.description')}
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
                    src="/images/mt5-multi.png" 
                    alt={t('app.screenshotAlt')}
                    borderRadius="md"
                    width="100%"
                  />
                </Box>
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>
      
      {/* Steps to Start Trading Section */}
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
                {t('steps.subtitle')}
              </Text>
              
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                color={isDark ? "white" : "#333"}
                mb={5}
              >
                {t('steps.title')}
              </Heading>
              
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={isDark ? "gray.300" : "gray.600"}
              >
                {t('steps.description')}
              </Text>
            </MotionBox>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} width="full">
              <StepCard
                number="1"
                title={t('steps.step1.title')}
                description={t('steps.step1.description')}
                delay={0}
              />
              
              <StepCard
                number="2"
                title={t('steps.step2.title')}
                description={t('steps.step2.description')}
                delay={0.1}
              />
              
              <StepCard
                number="3"
                title={t('steps.step3.title')}
                description={t('steps.step3.description')}
                delay={0.2}
              />
            </SimpleGrid>
            
            <Button
              bg="#8b7966"
              color="white"
              _hover={{ bg: "#9c7c63" }}
              size="lg"
              px={10}
              onClick={() => router.push('/signup')}
              rightIcon={<ArrowRight />}
            >
              {t('steps.cta')}
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
                  {t('cta.subtitle')}
                </Text>
                
                <Heading
                  fontSize={{ base: "3xl", md: "4xl" }}
                  fontWeight="bold"
                  color={isDark ? "white" : "#333"}
                >
                  {t('cta.title')}
                </Heading>
                
                <Text 
                  fontSize="lg" 
                  color={isDark ? "gray.300" : "gray.600"}
                  maxW="2xl"
                >
                  {t('cta.description')}
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
                    {t('cta.primaryButton')}
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
                    {t('cta.secondaryButton')}
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
          _hover={{ bg: "transparent", color: "#9c7c63" }}
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
const FeatureCard = ({ icon, title, description, delay }) => {
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

// Component for Product Cards
const ProductCard = ({ image, title, category, delay }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  return (
    <MotionBox
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: { 
          opacity: 1, 
          scale: 1,
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
        align="center"
        p={4}
        borderRadius="lg"
        boxShadow="md"
        height="full"
        transition="all 0.3s"
        _hover={{
          transform: 'scale(1.05)',
          boxShadow: 'lg'
        }}
      >
        <Image 
          src={image} 
          alt={title}
          boxSize="80px"
          objectFit="contain"
          mb={4}
        />
        
        <Heading as="h3" size="sm" mb={1} textAlign="center">
          {title}
        </Heading>
        
        <Badge colorScheme="gray">{category}</Badge>
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