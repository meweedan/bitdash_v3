import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useAnimation, useInView } from 'framer-motion';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Grid,
  GridItem,
  useColorMode,
  Flex,
  Badge,
  useBreakpointValue,
  Button,
  HStack,
  SimpleGrid,
  Divider,
  Icon,
  Circle,
  Image,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { 
  ArrowUpRight, 
  ChevronRight, 
  Shield, 
  CheckCircle, 
  Globe, 
  FileText, 
  Key, 
  Lock,
  Target,
  TrendingUp,
  BarChart2,
  Award,
  Users,
  DollarSign,
  Clock,
  LineChart,
  Building
} from 'lucide-react';
import { 
  FaMoneyBillWave, 
  FaChartLine, 
  FaUniversity, 
  FaExchangeAlt, 
  FaShieldAlt, 
  FaGlobe, 
  FaCheckCircle, 
  FaHandshake,
  FaTrophy,
  FaLock,
  FaRegLightbulb
} from 'react-icons/fa';
import { useRouter } from 'next/router';

// Financial Animation Components
const TradingAnimation = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const isMobile = useBreakpointValue({ base: true, md: false });
  const scale = useBreakpointValue({ base: 0.7, md: 1 });
  
  return (
    <Box position="relative" h={{ base: "300px", md: "400px" }} w="full" perspective="1000px">
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `scale(${scale})`
        }}
      >
        {/* Trading Chart */}
        <motion.div
          initial={{ rotateY: -20, y: 0 }}
          animate={{ 
            rotateY: [-20, 10],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            width: '300px',
            height: '200px',
            background: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            borderRadius: '16px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            padding: '20px',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
          }}
        >
          {/* Chart Lines */}
          <svg width="100%" height="100%" viewBox="0 0 260 160">
            {/* Grid Lines */}
            {[...Array(5)].map((_, i) => (
              <line 
                key={`h-${i}`}
                x1="0" 
                y1={i * 40} 
                x2="260" 
                y2={i * 40} 
                stroke={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} 
                strokeWidth="1"
              />
            ))}
            {[...Array(6)].map((_, i) => (
              <line 
                key={`v-${i}`}
                x1={i * 52} 
                y1="0" 
                x2={i * 52} 
                y2="160" 
                stroke={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} 
                strokeWidth="1"
              />
            ))}
            
            {/* Chart Line */}
            <motion.path
              d="M 0 120 C 40 100, 80 140, 120 80 C 160 30, 200 60, 260 40"
              fill="none"
              stroke="#3182CE"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                ease: "easeInOut"
              }}
            />
            
            {/* Area under chart */}
            <motion.path
              d="M 0 120 C 40 100, 80 140, 120 80 C 160 30, 200 60, 260 40 L 260 160 L 0 160 Z"
              fill="url(#blueGradient)"
              opacity="0.2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{
                duration: 2,
                ease: "easeInOut"
              }}
            />
            
            <defs>
              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3182CE" />
                <stop offset="100%" stopColor="rgba(49, 130, 206, 0)" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
        
        {/* Floating indicators */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: 50 + (i * 70), 
              y: 80 - (i * 30),
              opacity: 0 
            }}
            animate={{ 
              x: 50 + (i * 70), 
              y: [80 - (i * 30), 60 - (i * 30), 80 - (i * 30)],
              opacity: 1
            }}
            transition={{
              y: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: i * 0.3
              },
              opacity: {
                duration: 0.5
              }
            }}
            style={{
              position: 'absolute',
              width: i === 0 ? '80px' : '60px',
              height: i === 0 ? '40px' : '30px',
              borderRadius: '8px',
              background: i === 0 ? '#3182CE' : isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              zIndex: 10 - i
            }}
          />
        ))}
      </motion.div>
    </Box>
  );
};

const RegulationAnimation = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const scale = useBreakpointValue({ base: 0.7, md: 1 });
  
  return (
    <Box position="relative" h={{ base: "300px", md: "400px" }} w="full" perspective="1000px">
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `scale(${scale})`
        }}
      >
        <Circle
          size={{ base: "230px", md: "280px" }}
          boxShadow="xl"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0.7 }}
            animate={{ 
              scale: [0.9, 1.1, 0.9],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Icon 
              as={FaShieldAlt} 
              boxSize={{ base: 24, md: 32 }}
              color={isDark ? 'blue.400' : 'blue.500'}
              opacity={0.8}
            />
          </motion.div>
        </Circle>
        
        {/* Orbiting elements */}
        {[
          { icon: Globe, color: 'cyan.500', delay: 0 },
          { icon: Lock, color: 'blue.500', delay: 1.5 },
          { icon: FileText, color: 'purple.500', delay: 3 },
          { icon: Key, color: 'teal.500', delay: 4.5 }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ 
              rotate: index * 90,
              opacity: 0
            }}
            animate={{ 
              rotate: [index * 90, index * 90 + 360],
              opacity: 1
            }}
            transition={{
              rotate: {
                duration: 10,
                repeat: Infinity,
                ease: "linear",
                delay: item.delay
              },
              opacity: {
                duration: 1
              }
            }}
            style={{
              position: 'absolute',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              top: '50%',
              left: '50%',
              transformOrigin: '0 0'
            }}
          >
            <Circle
              size="50px"
              boxShadow="lg"
              color={item.color}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={item.icon} boxSize={5} />
            </Circle>
          </motion.div>
        ))}
      </motion.div>
    </Box>
  );
};

const PlatformsAnimation = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const scale = useBreakpointValue({ base: 0.7, md: 1 });
  
  const platforms = [
    { name: 'BitCash', icon: FaMoneyBillWave, color: 'brand.bitcash.500' },
    { name: 'BitFund', icon: FaChartLine, color: 'brand.bitfund.500' },
    { name: 'BitStock', icon: FaUniversity, color: 'brand.bitstock.500' },
    { name: 'BitTrade', icon: FaExchangeAlt, color: 'brand.bittrade.500' }
  ];
  
  return (
    <Box position="relative" h={{ base: "300px", md: "400px" }} w="full" perspective="1000px">
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `scale(${scale})`
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Grid 
            templateColumns="repeat(2, 1fr)" 
            templateRows="repeat(2, 1fr)" 
            gap={8}
            maxW="400px"
          >
            {platforms.map((platform, index) => (
              <motion.div
                key={index}
                initial={{ 
                  x: (index % 2 === 0 ? -20 : 20),
                  y: (index < 2 ? -20 : 20),
                  opacity: 0 
                }}
                animate={{ 
                  x: 0, 
                  y: 0,
                  opacity: 1,
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  x: { duration: 0.8, delay: index * 0.2 },
                  y: { duration: 0.8, delay: index * 0.2 },
                  opacity: { duration: 0.8, delay: index * 0.2 },
                  scale: { 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatType: "reverse",
                    delay: index * 0.5
                  }
                }}
              >
                <Box
                  w="150px"
                  h="150px"
                  borderRadius="xl"
                  boxShadow="xl"
                  borderWidth="1px"
                  borderColor={isDark ? 'whiteAlpha.200' : platform.color + '30'}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  p={4}
                >
                  <Circle
                    size="60px"
                    color={platform.color}
                    mb={3}
                  >
                    <Icon as={platform.icon} boxSize={6} />
                  </Circle>
                  <Text
                    fontWeight="bold"
                    color={platform.color}
                  >
                    {platform.name}
                  </Text>
                </Box>
              </motion.div>
            ))}
          </Grid>
        </motion.div>
      </motion.div>
    </Box>
  );
};

const VisionAnimation = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const scale = useBreakpointValue({ base: 0.7, md: 1 });
  
  return (
    <Box position="relative" h={{ base: "300px", md: "400px" }} w="full">
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transform: `scale(${scale})`
        }}
      >
        {/* World Map Background */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width="300px"
          height="300px"
          borderRadius="full"
          overflow="hidden"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {/* Simplified world map or globe graphic would go here */}
            <Icon
              as={FaGlobe}
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              boxSize={200}
              color={isDark ? 'blue.400' : 'blue.500'}
              opacity={0.2}
            />
          </motion.div>
        </Box>
        
        {/* Connected nodes representing global presence */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45) * (Math.PI / 180);
          const radius = 120;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <motion.div
              key={i}
              initial={{ 
                x: x,
                y: y,
                opacity: 0
              }}
              animate={{ 
                x: x,
                y: y,
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                opacity: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.2
                }
              }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: i % 2 === 0 ? '#3182CE' : '#63B3ED',
                transform: 'translate(-50%, -50%)'
              }}
            />
          );
        })}
        
        {/* Center focal point */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Circle
            size="80px"
            bg={isDark ? 'blue.700' : 'white'}
            boxShadow="lg"
            borderWidth="2px"
            borderColor={isDark ? 'blue.500' : 'blue.400'}
          >
            <Icon
              as={Target}
              boxSize={10}
              color={isDark ? 'blue.300' : 'blue.500'}
            />
          </Circle>
        </motion.div>
      </motion.div>
    </Box>
  );
};

const StorySection = ({ title, subtitle, description, stats, features, animation: Animation, color, index, ctaText, ctaLink }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const router = useRouter();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      <Grid
        templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
        gap={{ base: 12, lg: 16 }}
        alignItems="center"
      >
        <GridItem order={{ base: 1, lg: index % 2 === 0 ? 1 : 2 }}>
          <VStack align={index % 2 === 0 ? 'start' : 'end'} spacing={8}>
            <Badge
              px={4}
              py={2}
              borderRadius="full"
              fontSize="sm"
              bg={`${color}20`}
              color={color}
            >
              {subtitle}
            </Badge>
            
            <Heading
              fontSize={{ base: '3xl', lg: '5xl' }}
              bgGradient={`linear(to-r, ${color}, ${color})`}
              bgClip="text"
              textAlign={index % 2 === 0 ? 'left' : 'right'}
              lineHeight="1.2"
            >
              {title}
            </Heading>
            
            <Text
              fontSize={{ base: 'lg', lg: 'xl' }}
              color={isDark ? 'whiteAlpha.900' : 'gray.700'}
              textAlign={index % 2 === 0 ? 'left' : 'right'}
              lineHeight="tall"
            >
              {description}
            </Text>

            <Grid 
              templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
              gap={6}
              w="full"
            >
              {stats.map((stat, i) => (
                <VStack key={i} align={index % 2 === 0 ? 'start' : 'end'}>
                  <Text
                    fontSize={{ base: '2xl', lg: '3xl' }}
                    fontWeight="bold"
                    color={color}
                  >
                    {stat.value}
                  </Text>
                  <Text 
                    fontSize="sm"
                    color={isDark ? 'whiteAlpha.600' : 'gray.600'}
                  >
                    {stat.label}
                  </Text>
                </VStack>
              ))}
            </Grid>

            <Grid 
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap={4}
              w="full"
            >
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: index % 2 === 0 ? 10 : -10 }}
                >
                  <Flex
                    p={4}
                    borderWidth="1px"
                    borderColor={isDark ? 'whiteAlpha.200' : 'gray.200'}
                    borderRadius="xl"
                    _hover={{
                      borderColor: color,
                      bg: `${color}10`
                    }}
                    transition="all 0.3s"
                    alignItems="center"
                  >
                    <Icon 
                      as={CheckCircle} 
                      color={color} 
                      boxSize={4} 
                      mr={3}
                      flexShrink={0}
                    />
                    <Text
                      textAlign="left"
                      color={isDark ? 'white' : 'gray.800'}
                    >
                      {feature}
                    </Text>
                  </Flex>
                </motion.div>
              ))}
            </Grid>

            {ctaText && (
              <Button
                rightIcon={<ArrowUpRight />}
                variant="outline"
                size="lg"
                borderColor={color}
                color={color}
                _hover={{
                  bg: color,
                  color: 'white',
                  transform: 'translateY(-2px)'
                }}
                transition="all 0.2s"
                onClick={() => router.push(ctaLink || '/contact')}
              >
                {ctaText}
              </Button>
            )}
          </VStack>
        </GridItem>

        <GridItem order={{ base: 2, lg: index % 2 === 0 ? 2 : 1 }}>
          <Animation />
        </GridItem>
      </Grid>
    </motion.div>
  );
};

const TeamMemberCard = ({ name, position, image, color, index }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Box
        p={6}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={isDark ? 'whiteAlpha.200' : 'gray.200'}
        boxShadow="md"
        textAlign="center"
        _hover={{
          transform: 'translateY(-5px)',
          boxShadow: 'xl',
          borderColor: color
        }}
        transition="all 0.3s"
      >
        <Circle
          size="120px"
          mx="auto"
          mb={4}
          overflow="hidden"
        >
          {image ? (
            <Image src={image} alt={name} />
          ) : (
            <Icon as={Users} boxSize={12} color={color} />
          )}
        </Circle>
        
        <Heading size="md" mb={1}>
          {name}
        </Heading>
        
        <Text
          fontSize="sm"
          color={isDark ? 'whiteAlpha.700' : 'gray.600'}
        >
          {position}
        </Text>
      </Box>
    </motion.div>
  );
};

const AchievementsSection = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const { t } = useTranslation();
  
  const achievements = [
    {
      year: '2022',
      title: 'Launch',
      description: 'BitDash established with regulatory approval from Saint Vincent and the Grenadines FSA.',
      icon: Building
    },
    {
      year: '2023',
      title: 'Expansion',
      description: 'Secured Comoros regulatory license. Expanded financial services to cover 180+ countries.',
      icon: Globe
    },
    {
      year: '2023',
      title: 'Growth',
      description: 'Reached $2.5B monthly transaction volume across all platforms. Expanded institutional client base.',
      icon: BarChart2
    },
    {
      year: '2024',
      title: 'Innovation',
      description: 'Launched proprietary trading algorithms and enhanced API capabilities for institutional traders.',
      icon: LineChart
    }
  ];
  
  return (
    <Container maxW="6xl" py={16}>
      <VStack spacing={12} align="center">
        <VStack spacing={4} textAlign="center">
          <Badge 
            colorScheme="blue" 
            fontSize="md" 
            px={4} 
            py={2} 
            borderRadius="full"
          >
            {t('ourMilestones', 'Our Milestones')}
          </Badge>
          
          <Heading
            fontSize={{ base: '3xl', md: '4xl' }}
            bgClip="text"
          >
            {t('achievements.title', 'Key Achievements')}
          </Heading>
          
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            color={isDark ? 'whiteAlpha.700' : 'gray.700'}
            maxW="3xl"
          >
            {t('achievements.description', 'Our journey of innovation, growth, and regulatory excellence in the global fintech landscape.')}
          </Text>
        </VStack>
        
        <Grid 
          templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
          gap={8}
          w="full"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <VStack
                p={6}
                h="full"
                borderRadius="xl"
                bg={isDark ? 'whiteAlpha.100' : 'white'}
                boxShadow="md"
                borderWidth="1px"
                borderColor={isDark ? 'whiteAlpha.200' : 'gray.200'}
                spacing={4}
                _hover={{
                  transform: 'translateY(-5px)',
                  boxShadow: 'xl',
                  borderColor: 'blue.400'
                }}
                transition="all 0.3s"
              >
                <HStack spacing={2}>
                  <Badge colorScheme="blue" fontSize="sm">
                    {achievement.year}
                  </Badge>
                  <Heading size="md">
                    {achievement.title}
                  </Heading>
                </HStack>
                
                <Text
                  fontSize="sm"
                  color={isDark ? 'whiteAlpha.700' : 'gray.600'}
                >
                  {achievement.description}
                </Text>
                
                <Icon 
                  as={achievement.icon} 
                  boxSize={8} 
                  color="blue.400" 
                  opacity={0.8} 
                  mt={2}
                />
              </VStack>
            </motion.div>
          ))}
        </Grid>
      </VStack>
    </Container>
  );
};

const AboutPage = () => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const router = useRouter();

  const storyData = [
    {
      title: "Regulated Financial Technology",
      subtitle: "Who We Are",
      description: "BitDash is a globally regulated fintech company offering a comprehensive suite of financial technology solutions. We provide institutional-grade trading, investment, and payment services to both retail and institutional clients with regulatory oversight from SVG and Comoros authorities.",
      animation: TradingAnimation,
      color: "blue.500",
      stats: [
        { value: "2022", label: "Established" },
        { value: "180+", label: "Countries Served" },
        { value: "$2.5B+", label: "Monthly Volume" }
      ],
      features: [
        "SVG & Comoros Licensed",
        "Institutional-Grade Security",
        "Global Financial Services",
        "Multi-Asset Trading Solutions"
      ],
      ctaText: "Our Licenses",
      ctaLink: "/licenses"
    },
    {
      title: "Regulatory Excellence",
      subtitle: "Trust & Compliance",
      description: "Operating with full regulatory compliance, we ensure the highest standards of security and transparency. Our SVG and Comoros licenses enable us to offer a wide range of financial services globally while maintaining strict adherence to international financial regulations.",
      animation: RegulationAnimation,
      color: "blue.500",
      stats: [
        { value: "100%", label: "Segregated Funds" },
        { value: "AES-256", label: "Encryption" },
        { value: "24/7", label: "Compliance Monitoring" }
      ],
      features: [
        "Regulatory Oversight",
        "AML/KYC Compliance",
        "Risk Management Protocols",
        "Transparent Fee Structure"
      ],
      ctaText: "Security Measures",
      ctaLink: "/security"
    },
    {
      title: "Comprehensive Fintech Ecosystem",
      subtitle: "Our Platforms",
      description: "Our integrated ecosystem of financial platforms provides seamless access to global markets. From instant payment solutions to proprietary trading, investment opportunities, and regulated forex and crypto exchange services, we deliver a complete suite of financial technology solutions.",
      animation: PlatformsAnimation,
      color: "blue.500",
      stats: [
        { value: "4", label: "Specialized Platforms" },
        { value: "99.99%", label: "Uptime" },
        { value: "12K+", label: "Active Traders" }
      ],
      features: [
        "BitCash - Payment Solutions",
        "BitFund - Proprietary Trading",
        "BitStock - Investment Platform",
        "BitTrade - Forex & Crypto Exchange"
      ],
      ctaText: "Explore Platforms",
      ctaLink: "/services"
    },
    {
      title: "Global Fintech Leadership",
      subtitle: "Our Vision",
      description: "Our vision is to become a leading global fintech player by delivering exceptional financial technology solutions that empower both retail and institutional clients. We're committed to continuous innovation, regulatory excellence, and expanding our global footprint to transform how the world accesses financial markets.",
      animation: VisionAnimation,
      color: "blue.500",
      stats: [
        { value: "50+", label: "Technology Partners" },
        { value: "3", label: "New Markets for 2025" },
        { value: "15%", label: "Annual Growth Rate" }
      ],
      features: [
        "Institutional API Solutions",
        "AI-Powered Trading Tools",
        "Cross-Border Payment Innovation",
        "Financial Inclusion Initiatives"
      ],
      ctaText: "Partner With Us",
      ctaLink: "/contact"
    }
  ];

  const executiveTeam = [
    { name: "Alex Bennett", position: "Chief Executive Officer", color: "blue.500" },
    { name: "Sarah Al-Mansouri", position: "Chief Financial Officer", color: "blue.500" },
    { name: "Michael Chen", position: "Chief Technology Officer", color: "blue.500" },
    { name: "Leila Tawfiq", position: "Chief Compliance Officer", color: "blue.500" }
  ];

  return (
    <Layout>
      <Head>
        <title>{t('about.title', 'About BitDash | Regulated Financial Technology')}</title>
        <meta name="description" content="BitDash is a globally regulated fintech company offering institutional-grade trading, investment, and payment solutions for retail and institutional clients." />
      </Head>

      <Box 
        minH="80vh"
        position="relative"
        overflow="hidden"
      >
        {/* Hero Section */}
        <Box
          h="80vh"
          position="relative"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Container maxW="8xl">
            <VStack spacing={16} align="center" textAlign="center">
              <Badge 
                colorScheme="blue" 
                fontSize="md" 
                px={4} 
                py={2} 
                borderRadius="full"
              >
                {t('svgAndComorosLicensed', 'SVG & Comoros Licensed')}
              </Badge>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <VStack spacing={6}>
                  <Heading
                    fontSize={{ base: '4xl', lg: '7xl' }}
                    bgGradient="linear(to-r, blue.600, blue.400)"
                    bgClip="text"
                    lineHeight="shorter"
                  >
                    {t('about.heroTitle', 'Global Financial Technology Solutions')}
                  </Heading>
                  <Text
                    fontSize={{ base: 'lg', lg: '2xl' }}
                    color={isDark ? 'whiteAlpha.800' : 'gray.700'}
                    maxW="3xl"
                  >
                    {t('about.heroDescription', 'Empowering retail and institutional clients with regulated trading and investment platforms')}
                  </Text>
                </VStack>
              </motion.div>

              <HStack spacing={4} pt={4}>
                <Button
                  size="lg"
                  colorScheme="blue"
                  px={8}
                  height="60px"
                  fontSize="lg"
                  onClick={() => router.push('/signup')}
                >
                  {t('openAccount', 'Open Account')}
                </Button>
                
                <Button
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
                  onClick={() => router.push('/contact')}
                >
                  {t('institutionalServices', 'Institutional Services')}
                </Button>
              </HStack>
            </VStack>
          </Container>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            <VStack spacing={2}>
              <Text 
                fontSize="sm" 
                color={isDark ? 'whiteAlpha.600' : 'gray.600'}
              >
                {t('scrollToExplore', 'Scroll to Explore')}
              </Text>
              <Box
                h="40px"
                w="24px"
                borderRadius="full"
                border="2px solid"
                borderColor={isDark ? 'whiteAlpha.200' : 'gray.200'}
                position="relative"
              >
                <motion.div
                  animate={{
                    y: [0, 12, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: isDark ? 'white' : 'black',
                    position: 'absolute',
                    top: '6px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                />
              </Box>
            </VStack>
          </motion.div>
        </Box>

        {/* Achievements Timeline */}
        <AchievementsSection />

        {/* Story Sections */}
        <Container maxW="8xl" py={16}>
          <VStack spacing={32}>
            {storyData.map((story, index) => (
              <StorySection
                key={index}
                {...story}
                index={index}
              />
            ))}
          </VStack>
        </Container>
        
        {/* Executive Team */}
        <Box py={20}>
          <Container maxW="6xl">
            <VStack spacing={16} align="center">
              <VStack spacing={4} textAlign="center">
                <Badge 
                  colorScheme="blue" 
                  fontSize="md" 
                  px={4} 
                  py={2} 
                  borderRadius="full"
                >
                  {t('ourLeadership', 'Our Leadership')}
                </Badge>
                
                <Heading
                  fontSize={{ base: '3xl', md: '4xl' }}
                  bgGradient="linear(to-r, blue.600, blue.400)"
                  bgClip="text"
                >
                  {t('executiveTeam', 'Executive Team')}
                </Heading>
                
                <Text
                  fontSize={{ base: 'lg', md: 'xl' }}
                  color={isDark ? 'whiteAlpha.700' : 'gray.700'}
                  maxW="3xl"
                >
                  {t('executiveTeamDescription', 'Our leadership team brings decades of experience from top financial institutions and technology companies to deliver exceptional financial solutions.')}
                </Text>
              </VStack>
              
              <SimpleGrid 
                columns={{ base: 1, md: 2, lg: 4 }} 
                spacing={8}
                w="full"
              >
                {executiveTeam.map((member, index) => (
                  <TeamMemberCard 
                    key={index}
                    {...member}
                    index={index}
                  />
                ))}
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>
        
        {/* CTA Section */}
        <Box py={20}>
          <Container maxW="6xl" textAlign="center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <VStack spacing={8}>
                <Heading
                  fontSize={{ base: '3xl', md: '4xl' }}
                  bgClip="text"
                >
                  {t('readyToStart', 'Ready to Experience Institutional-Grade Financial Services?')}
                </Heading>
                
                <Text 
                  fontSize="lg" 
                  color={isDark ? 'gray.300' : 'gray.700'} 
                  maxW="3xl"
                >
                  {t('ctaDescription', 'Whether you are a retail trader looking to access global markets or an institution seeking customized financial solutions, BitDash provides the technology, security, and support you need.')}
                </Text>
                
                <HStack spacing={4}>
                  <Button
                    size="lg"
                    colorScheme="blue"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'xl'
                    }}
                    px={8}
                    height="60px"
                    fontSize="lg"
                    onClick={() => router.push('/signup')}
                  >
                    {t('retailAccount', 'Open Retail Account')}
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    colorScheme="blue"
                    px={8}
                    height="60px"
                    fontSize="lg"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                    }}
                    onClick={() => router.push('/institutional')}
                  >
                    {t('institutionalInquiry', 'Institutional Inquiry')}
                  </Button>
                </HStack>
              </VStack>
            </motion.div>
          </Container>
        </Box>
      </Box>
    </Layout>
  );
};

export default AboutPage;