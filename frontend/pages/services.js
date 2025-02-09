// pages/services.js
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Button,
  useColorMode,
  useBreakpointValue,
  Flex,
  Spinner,
  Grid,
  GridItem,
  AspectRatio,
  IconButton,
  Portal,
  SimpleGrid
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useInView } from 'react-intersection-observer';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import Layout from '@/components/Layout';
import Head from 'next/head';

const platforms = [
  {
    id: 'cash',
    title: 'BitCash',
    tagline: 'Digital Banking Redefined',
    description: 'Experience the future of financial transactions with our sophisticated digital payment platform.',
    image: '/cash.png',
    imageAr: '/cash-ar.png',
    color: 'brand.bitcash.500',
    stats: [
      { value: '1M+', label: 'Active Users' },
      { value: '99.99%', label: 'Uptime' },
      { value: '$2B+', label: 'Processed' }
    ],
    features: [
      'Instant Transfers',
      'Business Solutions',
      'Advanced Security',
      'Smart Analytics'
    ]
  },
  {
    id: 'food',
    title: 'BitFood',
    tagline: 'Elevating Dining Experiences',
    description: 'Transform your restaurant operations with our comprehensive digital solution.',
    image: '/food.png',
    imageAr: '/food-ar.png',
    color: 'brand.bitfood.500',
    stats: [
      { value: '500+', label: 'Partners' },
      { value: '4.9', label: 'Rating' },
      { value: '2M+', label: 'Orders' }
    ],
    features: [
      'Smart Menu Management',
      'Real-time Analytics',
      'Inventory Control',
      'Customer Insights'
    ]
  },
  {
    id: 'shop',
    title: 'BitShop',
    tagline: 'Commerce Without Limits',
    description: 'Unlock your business potential with our advanced e-commerce platform.',
    image: '/shop.png',
    imageAr: '/shop-ar.png',
    color: 'brand.bitshop.500',
    stats: [
      { value: '10K+', label: 'Merchants' },
      { value: '24/7', label: 'Support' },
      { value: '99%', label: 'Satisfaction' }
    ],
    features: [
      'Omnichannel Retail',
      'Advanced Analytics',
      'Smart Inventory',
      'Marketing Tools'
    ]
  },
  {
    id: 'ride',
    title: 'BitRide',
    tagline: 'Mobility of Tomorrow',
    description: 'Revolutionize transportation with our intelligent mobility solutions.',
    image: '/ride.png',
    imageAr: '/ride-ar.png',
    color: 'brand.bitride.500',
    stats: [
      { value: '50K+', label: 'Daily Rides' },
      { value: '15+', label: 'Cities' },
      { value: '4.8', label: 'Rating' }
    ],
    features: [
      'Smart Routing',
      'Fleet Management',
      'Real-time Tracking',
      'Driver Analytics'
    ]
  },
  {
    id: 'work',
    title: 'BitWork',
    tagline: 'Your Career & Service Marketplace',
    description: 'Connect with top employers and skilled professionals. From corporate careers to handyman services, we bridge the gap between talent and opportunity.',
    image: '/work.png',
    imageAr: '/work-ar.png',
    color: 'brand.bitwork.500',
    stats: [
      { value: '100K+', label: 'Active Users' },
      { value: '20K+', label: 'Job Listings' },
      { value: '95%', label: 'Success Rate' }
    ],
    features: [
      'Corporate Job Listings',
      'Skilled Labor Market',
      'Instant Booking',
      'Verified Professionals'
    ]
   }
];

const PlatformShowcase = ({ platform, index, isRTL }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  const { colorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const containerRef = useRef(null);
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  // Alternate layout for better mobile experience
  const isReversed = index % 2 === 1;

  return (
    <Grid
      templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
      gap={{ base: 8, lg: 16 }}
      py={{ base: 16, lg: 32 }}
      px={{ base: 4, lg: 8 }}
      position="relative"
    >
      {/* Image Section */}
      <GridItem 
        order={{ base: 1, lg: isReversed ? 2 : 1 }}
        position="relative"
        w="full"
        h={{ base: "200px", md: "400px", lg: "300px" }}
        overflow="hidden"
        borderRadius={{ base: "24px", lg: "40px" }}
        boxShadow="2xl"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}
        >
          <Image
            src={isRTL ? platform.imageAr : platform.image}
            alt={platform.title}
            width={1800}
            height={558}
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            priority={index === 0}
          />
          <Box
            position="absolute"
            inset="0"
            bg={`linear-gradient(to bottom, 
              transparent 0%, 
              ${colorMode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)'} 100%
            )`}
            opacity={0.9}
            transition="opacity 0.3s"
            _groupHover={{ opacity: 0.7 }}
          />
        </Box>
      </GridItem>

      {/* Content Section */}
      <GridItem 
        order={{ base: 2, lg: isReversed ? 1 : 2 }}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        p={{ base: 4, lg: 8 }}
      >
        <VStack 
          align="start" 
          spacing={{ base: 6, lg: 8 }}
        >
          <Box>
            <Text 
              fontSize={{ base: "sm", lg: "md" }}
              textTransform="uppercase"
              letterSpacing="wider"
              color={platform.color}
              fontWeight="bold"
              mb={2}
            >
              {platform.tagline}
            </Text>
            
            <Heading 
              fontSize={{ base: "4xl", lg: "6xl" }}
              bgGradient={`linear(to-r, ${platform.color}, ${platform.color})`}
              bgClip="text"
              letterSpacing="tight"
              mb={4}
            >
              {platform.title}
            </Heading>

            <Text 
              fontSize={{ base: "lg", lg: "xl" }}
              color={colorMode === 'dark' ? 'whiteAlpha.800' : 'blackAlpha.800'}
              lineHeight="tall"
            >
              {platform.description}
            </Text>
          </Box>

          {/* Stats Grid */}
          <SimpleGrid 
            columns={3} 
            spacing={{ base: 4, lg: 8 }} 
            w="full"
            py={4}
          >
            {platform.stats.map((stat, idx) => (
              <Box key={idx}>
                <Text 
                  fontSize={{ base: "2xl", lg: "3xl" }}
                  fontWeight="bold"
                  color={platform.color}
                >
                  {stat.value}
                </Text>
                <Text 
                  fontSize={{ base: "xs", lg: "sm" }}
                  color={colorMode === 'dark' ? 'whiteAlpha.600' : 'blackAlpha.600'}
                >
                  {stat.label}
                </Text>
              </Box>
            ))}
          </SimpleGrid>

          {/* Features */}
          <SimpleGrid 
            columns={{ base: 1, md: 2 }}
            spacing={4} 
            w="full"
          >
            {platform.features.map((feature, idx) => (
              <HStack 
                key={idx}
                spacing={4}
                p={4}
                borderWidth="1px"
                borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.200'}
                borderRadius="xl"
                transition="all 0.3s"
                _hover={{
                  borderColor: platform.color,
                  transform: 'translateX(8px)',
                  bg: colorMode === 'dark' ? 'whiteAlpha.50' : 'blackAlpha.50'
                }}
              >
                <Icon as={ChevronRight} color={platform.color} />
                <Text>{feature}</Text>
              </HStack>
            ))}
          </SimpleGrid>

          <Button
            rightIcon={<ArrowUpRight />}
            variant="outline"
            size="lg"
            borderColor={platform.color}
            color={platform.color}
            _hover={{
              bg: platform.color,
              color: 'white',
              transform: 'translateY(-2px)'
            }}
            _active={{
              transform: 'translateY(0)'
            }}
            transition="all 0.2s"
          >
            {t('learnMore')}
          </Button>
        </VStack>
      </GridItem>
    </Grid>
  );
};

const Services = () => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const router = useRouter();
  const isRTL = router.locale === 'ar';

  return (
    <>
    <Head>
      <title>{t('services')}</title>
    </Head>
    <Layout>
    <Box
      bg={colorMode === 'dark' ? 'black' : 'white'}
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
        <Container maxW="8xl" px={{ base: 4, lg: 8 }}>
          <VStack spacing={8} alignItems="center" textAlign="center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Heading
                fontSize={{ base: '4xl', md: '7xl' }}
                bgGradient="linear(to-r, brand.bitcash.500, brand.bitfood.500, brand.bitshop.500, brand.bitride.500)"
                bgClip="text"
                letterSpacing="tight"
                lineHeight="shorter"
              >
                {t('services.title')}
              </Heading>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <Text
                fontSize={{ base: 'lg', md: '2xl' }}
                color={colorMode === 'dark' ? 'whiteAlpha.700' : 'blackAlpha.700'}
                maxW="3xl"
              >
                {t('services.description')}
              </Text>
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
            <Text fontSize="sm" color={colorMode === 'dark' ? 'whiteAlpha.600' : 'blackAlpha.600'}>
              Scroll to Explore
            </Text>
            <Box
              h="40px"
              w="24px"
              borderRadius="full"
              border="2px solid"
              borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.200'}
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

      {/* Platforms Showcase */}
      <Container maxW="8xl" px={{ base: 4, lg: 8 }}>
        {platforms.map((platform, index) => (
          <PlatformShowcase
            key={platform.id}
            platform={platform}
            index={index}
            isRTL={isRTL}
          />
        ))}
      </Container>
    </Box>
    </Layout>
    </>
  );
};

export default Services;