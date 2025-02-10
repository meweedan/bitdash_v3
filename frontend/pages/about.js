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
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { ArrowUpRight } from 'lucide-react';

// BitCash Animation
const BitCashAnimation = () => {
  const { colorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const scale = useBreakpointValue({ base: 0.7, md: 1 });
  
  return (
    <Box position="relative" h={{ base: "300px", md: "400px" }} w="full" perspective="1000px">
      <motion.div
        initial={{ rotateY: -30, z: -100 }}
        animate={{ 
          rotateY: [30, -30],
          z: [-100, 100, -100],
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          transformStyle: 'preserve-3d',
          transform: `scale(${scale})`
        }}
      >
        {/* Card Element */}
        <motion.div
          style={{
            width: '300px',
            height: '180px',
            background: colorMode === 'dark' ? 
              'linear-gradient(45deg, #1a365d, #2a4365)' : 
              'linear-gradient(45deg, #2B6CB0, #4299E1)',
            borderRadius: '20px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}
        />
        
        {/* Transaction Particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: [-150 + (i * 75), -75 + (i * 75)],
              y: [-100 + (i * 50), -50 + (i * 50)]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut"
            }}
            style={{
              width: isMobile ? '15px' : '20px',
              height: isMobile ? '15px' : '20px',
              borderRadius: '50%',
              background: '#4299e1',
              position: 'absolute',
              top: '50%',
              left: '50%'
            }}
          />
        ))}
      </motion.div>
    </Box>
  );
};

// BitFood Animation
const BitFoodAnimation = () => {
  const { colorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box position="relative" h={{ base: "300px", md: "400px" }} w="full" perspective="1000px">
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Restaurant Interface */}
        <motion.div
          initial={{ rotateY: 0, z: -200 }}
          animate={{ 
            rotateY: [-20, 20],
            z: [-200, -100]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          style={{
            width: isMobile ? '240px' : '280px',
            height: isMobile ? '340px' : '400px',
            background: colorMode === 'dark' ? '#2D3748' : '#EDF2F7',
            borderRadius: '24px',
            position: 'absolute',
            left: '20%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}
        >
          {/* Menu Items */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: -50, opacity: 0 }}
              animate={{ 
                x: 0,
                opacity: 1
              }}
              transition={{
                duration: 0.5,
                delay: i * 0.2
              }}
              style={{
                width: '80%',
                height: '60px',
                margin: '20px auto',
                background: colorMode === 'dark' ? '#4A5568' : '#FFFFFF',
                borderRadius: '12px'
              }}
            />
          ))}
        </motion.div>

        {/* Delivery Route */}
        <motion.div
          animate={{
            pathLength: [0, 1],
            opacity: [0.2, 1, 0.2]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 400 400">
            <motion.path
              d="M 100 200 C 200 100, 300 300, 400 200"
              fill="none"
              stroke={colorMode === 'dark' ? '#4299e1' : '#2B6CB0'}
              strokeWidth="4"
              strokeDasharray="0 1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </Box>
  );
};

// BitShop Animation
const BitShopAnimation = () => {
  const { colorMode } = useColorMode();
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
        {/* Product Grid */}
        <motion.div
          initial={{ rotateX: 45, rotateZ: -45, z: -200 }}
          animate={{
            rotateX: [45, 35],
            rotateZ: [-45, -35],
            z: [-200, -150]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          style={{
            width: '300px',
            height: '300px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px'
          }}
        >
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.8, 1],
                opacity: [0, 1]
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{
                background: colorMode === 'dark' ? '#4A5568' : '#FFFFFF',
                borderRadius: '12px',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </Box>
  );
};

// BitRide Animation
const BitRideAnimation = () => {
  const { colorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box position="relative" h={{ base: "300px", md: "400px" }} w="full" perspective="1000px">
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Map Background */}
        <motion.div
          initial={{ rotateX: 30 }}
          animate={{
            rotateX: [30, 40],
            z: [-100, -50]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          style={{
            width: isMobile ? '300px' : '400px',
            height: isMobile ? '300px' : '400px',
            background: colorMode === 'dark' ? '#2D3748' : '#EDF2F7',
            borderRadius: '24px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            overflow: 'hidden'
          }}
        >
          {/* Route Line */}
          <svg width="100%" height="100%" viewBox="0 0 400 400">
            <motion.path
              d="M 100 300 Q 200 100 300 300"
              fill="none"
              stroke="#4299e1"
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </svg>

          {/* Vehicle */}
          <motion.div
            animate={{
              offsetDistance: ["0%", "100%"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: isMobile ? '15px' : '20px',
              height: isMobile ? '15px' : '20px',
              background: '#F6E05E',
              borderRadius: '50%',
              position: 'absolute'
            }}
          />
        </motion.div>
      </motion.div>
    </Box>
  );
};

// BitWork Animation
const BitWorkAnimation = () => {
  const { colorMode } = useColorMode();
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
        {/* Profile Cards */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              rotateY: -30,
              z: -100 * (i + 1),
              x: -50 * i
            }}
            animate={{
              rotateY: [-30, 0],
              z: [-100 * (i + 1), -50 * (i + 1)],
              x: [-50 * i, 0]
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            style={{
              width: isMobile ? '240px' : '280px',
              height: isMobile ? '140px' : '160px',
              background: colorMode === 'dark' ? 
                `linear-gradient(45deg, #2D3748 ${i * 10}%, #4A5568)` :
                `linear-gradient(45deg, #EDF2F7 ${i * 10}%, #FFFFFF)`,
              borderRadius: '16px',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}
          >
            {/* Profile Content Lines */}
            {[...Array(3)].map((_, j) => (
              <motion.div
                key={j}
                initial={{ width: '60%', opacity: 0 }}
                animate={{
                  width: ['60%', '80%'],
                  opacity: [0, 1]
                }}
                transition={{
                  duration: 1,
                  delay: j * 0.2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                style={{
                  height: '8px',
                  background: colorMode === 'dark' ? '#4A5568' : '#E2E8F0',
                  margin: '20px',
                  borderRadius: '4px'
                }}
              />
            ))}
          </motion.div>
        ))}
      </motion.div>
    </Box>
  );
};

const StorySection = ({ title, subtitle, description, stats, features, animation: Animation, color, index }) => {
  const { colorMode } = useColorMode();
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const isMobile = useBreakpointValue({ base: true, md: false });

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
        templateColumns={{ base: '1fr', lg: index % 2 === 0 ? '1fr 1fr' : '1fr 1fr' }}
        gap={{ base: 8, lg: 16 }}
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
            >
              {title}
            </Heading>
            
            <Text
              fontSize={{ base: 'lg', lg: 'xl' }}
              color={colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.700'}
              textAlign={index % 2 === 0 ? 'left' : 'right'}
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
                    color={colorMode === 'dark' ? 'whiteAlpha.600' : 'gray.600'}
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
                  <Box
                    p={4}
                    borderWidth="1px"
                    borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}
                    borderRadius="xl"
                    _hover={{
                      borderColor: color,
                      bg: `${color}10`
                    }}
                    transition="all 0.3s"
                  >
                    <Text
                      textAlign={index % 2 === 0 ? 'left' : 'right'}
                      color={colorMode === 'dark' ? 'white' : 'gray.800'}
                    >
                      {feature}
                    </Text>
                  </Box>
                </motion.div>
              ))}
            </Grid>

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
            >
              Learn More
            </Button>
          </VStack>
        </GridItem>

        <GridItem order={{ base: 2, lg: index % 2 === 0 ? 2 : 1 }}>
          <Animation />
        </GridItem>
      </Grid>
    </motion.div>
  );
};

const AboutPage = () => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  const storyData = [
    {
      title: "Our Beginning",
      subtitle: "The BitDash Story",
      description: "From inception to innovation, BitDash pioneers integrated digital solutions. Starting with a vision of technology transforming daily experiences.",
      animation: BitCashAnimation,
      color: "brand.bitcash.500",
      stats: [
        { value: "2024", label: "Founded" },
        { value: "5+", label: "Platforms" },
        { value: "100%", label: "Digital" }
      ],
      features: [
        "First Integrated Platform",
        "Tech Innovation",
        "Smart Solutions",
        "Digital Evolution"
      ]
    },
    {
      title: "Our Growth",
      subtitle: "Expanding Possibilities",
      description: "Evolving from a single digital solution into an ecosystem of services. Excellence drives our journey toward connecting communities.",
      animation: BitFoodAnimation,
      color: "brand.bitfood.500",
      stats: [
        { value: "15+", label: "Cities" },
        { value: "100K+", label: "Users" },
        { value: "24/7", label: "Support" }
      ],
      features: [
        "Market Expansion",
        "Service Integration",
        "Team Excellence",
        "Infrastructure Building"
      ]
    },
    {
      title: "Our Impact",
      subtitle: "Creating Change",
      description: "Every transaction, connection, and innovation contributes to digitalizing the economy. Building platforms, creating opportunities, enabling progress.",
      animation: BitShopAnimation,
      color: "brand.bitshop.500",
      stats: [
        { value: "$2M+", label: "Transactions" },
        { value: "500+", label: "Jobs Created" },
        { value: "30%", label: "Paper Reduced" }
      ],
      features: [
        "Economic Growth",
        "Digital Literacy",
        "Job Creation",
        "Sustainable Practices"
      ]
    },
    {
      title: "Our Future",
      subtitle: "Building Tomorrow",
      description: "Moving forward with continuous innovation and dedication. Establishing foundations for a digital-first future through technological advancement.",
      animation: BitWorkAnimation,
      color: "brand.bitride.500",
      stats: [
        { value: "10+", label: "New Projects" },
        { value: "3", label: "New Markets" },
        { value: "100%", label: "Growth Focus" }
      ],
      features: [
        "Regional Expansion",
        "Tech Innovation",
        "Market Leadership",
        "Digital Inclusion"
      ]
    }
  ];

  return (
    <Layout>
      <Head>
        <title>{t('about.title')}</title>
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <VStack spacing={6}>
                  <Heading
                    fontSize={{ base: '4xl', lg: '7xl' }}
                    bgGradient="linear(to-r, brand.bitcash.500, brand.bitride.500)"
                    bgClip="text"
                    lineHeight="shorter"
                  >
                    Transforming Digital Landscape
                  </Heading>
                  <Text
                    fontSize={{ base: 'lg', lg: '2xl' }}
                    color={colorMode === 'dark' ? 'whiteAlpha.800' : 'gray.700'}
                    maxW="3xl"
                  >
                    Building integrated solutions for a connected future
                  </Text>
                </VStack>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
              </motion.div>
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
                color={colorMode === 'dark' ? 'whiteAlpha.600' : 'gray.600'}
              >
                Scroll to Explore Our Story
              </Text>
              <Box
                h="40px"
                w="24px"
                borderRadius="full"
                border="2px solid"
                borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}
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
                    backgroundColor: colorMode === 'dark' ? 'white' : 'black',
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

        {/* Story Sections */}
        <Container maxW="8xl" py={32}>
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
      </Box>
    </Layout>
  );
};

export default AboutPage;