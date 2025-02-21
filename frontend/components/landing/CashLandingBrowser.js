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
  Code,
} from '@chakra-ui/react';
import { 
  FaMoneyBillWave,
  FaBolt,
  FaStore,
  FaGlobe,
  FaShieldAlt,
  FaMobileAlt,
  FaQrcode,
  FaChartLine
} from 'react-icons/fa';
import CryptoMatrix from '../CryptoMatrix';
import ForexTicker from '../cash/ForexTicker';

const BitCashLanding = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const containerRef = useRef(null);
  
  const bgGradient = useColorModeValue(
    'linear(to-b, green.50, white)',
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
      icon: FaBolt,
      title: 'instant.payments.title',
      description: 'instant.payments.description',
      color: 'brand.bitcash.400'
    },
    {
      icon: FaStore,
      title: 'merchant.solutions.title',
      description: 'merchant.solutions.description',
      color: 'brand.bitcash.500'
    },
    {
      icon: FaQrcode,
      title: 'qr.payments.title',
      description: 'qr.payments.description',
      color: 'brand.bitcash.600'
    },
    {
      icon: FaMobileAlt,
      title: 'mobile.app.title',
      description: 'mobile.app.description',
      color: 'brand.bitcash.700'
    }
  ];

  const solutions = [
    {
      icon: FaMoneyBillWave,
      title: 'solutions.real.time.transfers.title',
      description: 'solutions.real.time.transfers.description',
      technical: 'solutions.real.time.transfers.technical',
      color: 'brand.bitcash.500'
    },
    {
      icon: FaShieldAlt,
      title: 'solutions.secure.payments.title',
      description: 'solutions.secure.payments.description',
      technical: 'solutions.secure.payments.technical',
      color: 'brand.bitcash.600'
    },
    {
      icon: FaChartLine,
      title: 'solutions.business.analytics.title',
      description: 'solutions.business.analytics.description',
      technical: 'solutions.business.analytics.technical',
      color: 'brand.bitcash.700'
    }
  ];

  return (
    <Box ref={containerRef} bg={bgGradient} minH="100vh" overflow="hidden">
      <Container maxW="8xl" px={{ base: 4, lg: 0 }}>
        {/* Hero Section */}
        <motion.div style={{ scale: heroScale }}>
          <Flex
            direction="column"
            align="center"
            textAlign="center"
            py={{ base: 20, md: 28 }}
            position="relative"
          >
            <VStack spacing={8} maxW="4xl">
              <Heading
                fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
                bgGradient="linear(to-r, brand.bitcash.500, brand.bitcash.700)"
                bgClip="text"
              >
                {t('cash.hero.title', 'Instant Payments for the Digital Age')}
              </Heading>

              <CryptoMatrix/>

              <ForexTicker/>

              <HStack spacing={6} pt={8}>
                <Button
                  size="lg"
                  colorScheme="green"
                  px={8}
                  h={14}
                  fontSize="lg"
                  onClick={() => router.push('/signup')}
                >
                  {t('cash.hero.get_started', 'Get Started')}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  colorScheme="green"
                  px={8}
                  h={14}
                  fontSize="lg"
                  onClick={() => router.push('/merchants')}
                >
                  {t('hero.merchant_signup', 'For Merchants')}
                </Button>
              </HStack>
            </VStack>

            {/* Payment Demo Preview */}
            <Box
              mt={16}
              w="full"
              maxW="6xl"
              p={8}
              borderRadius="3xl"
              bg={glassCardBg}
              borderColor="brand.bitcash.500"
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
                  <Icon as={FaBolt} boxSize={8} color="brand.bitcash.500" />
                  <Text fontWeight="bold">{t('demo.instant_transfer', 'Transfer Speed')}</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="brand.bitcash.500">
                    &lt; 1s
                  </Text>
                </VStack>
                <VStack
                  p={6}
                  borderRadius="xl"
                  bg={useColorModeValue('white', 'gray.800')}
                  spacing={4}
                >
                  <Icon as={FaGlobe} boxSize={8} color="brand.bitcash.500" />
                  <Text fontWeight="bold">{t('demo.global_reach', 'Countries')}</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="brand.bitcash.500">
                    180+
                  </Text>
                </VStack>
                <VStack
                  p={6}
                  borderRadius="xl"
                  bg={useColorModeValue('white', 'gray.800')}
                  spacing={4}
                >
                  <Icon as={FaStore} boxSize={8} color="brand.bitcash.500" />
                  <Text fontWeight="bold">{t('demo.merchants', 'Active Merchants')}</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="brand.bitcash.500">
                    50k+
                  </Text>
                </VStack>
              </SimpleGrid>
            </Box>
          </Flex>
        </motion.div>

        {/* Features Grid */}
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 4 }}
          spacing={8}
          py={{ base: 20, md: 28 }}
        >
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
                  <Heading size="md">{t(feature.title, 'Feature')}</Heading>
                  <Text color={useColorModeValue('gray.600', 'gray.300')}>
                    {t(feature.description, 'Feature description')}
                  </Text>
                </VStack>
              </Box>
            </motion.div>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default BitCashLanding;