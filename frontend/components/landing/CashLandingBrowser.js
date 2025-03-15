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
import AgentLocator from '../adfaly/customer/AgentLocator';

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
      color: 'brand.Adfaly.400'
    },
    {
      icon: FaStore,
      title: 'merchant.solutions.title',
      description: 'merchant.solutions.description',
      color: 'brand.Adfaly.500'
    },
    {
      icon: FaQrcode,
      title: 'qr.payments.title',
      description: 'qr.payments.description',
      color: 'brand.Adfaly.600'
    },
    {
      icon: FaMobileAlt,
      title: 'mobile.app.title',
      description: 'mobile.app.description',
      color: 'brand.Adfaly.700'
    }
  ];

  const solutions = [
    {
      icon: FaMoneyBillWave,
      title: 'solutions.real.time.transfers.title',
      description: 'solutions.real.time.transfers.description',
      technical: 'solutions.real.time.transfers.technical',
      color: 'brand.Adfaly.500'
    },
    {
      icon: FaShieldAlt,
      title: 'solutions.secure.payments.title',
      description: 'solutions.secure.payments.description',
      technical: 'solutions.secure.payments.technical',
      color: 'brand.Adfaly.600'
    },
    {
      icon: FaChartLine,
      title: 'solutions.business.analytics.title',
      description: 'solutions.business.analytics.description',
      technical: 'solutions.business.analytics.technical',
      color: 'brand.Adfaly.700'
    }
  ];

  return (
    <Box ref={containerRef} bg={bgGradient} overflow="hidden">
      <Container maxW="8xl" pt={8}>
        {/* Hero Section */}
        <motion.div style={{ scale: heroScale }}>
          <Flex
            direction="column"
            align="center"
            textAlign="center"
            position="relative"
          >
            <VStack spacing={8} maxW="4xl">
              <Heading
                fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
                bgGradient="linear(to-r, brand.Adfaly.500, brand.Adfaly.700)"
                bgClip="text"
              >
                {t('cash.hero.title', 'Instant Payments for the Digital Age')}
              </Heading>

              <CryptoMatrix/>

              <HStack spacing={2} pt={2}>
                <Button
                  variant="outline"
                  colorScheme="green"
                  h={14}
                  onClick={() => router.push('/merchants')}
                >
                  {t('hero.merchant_signup', 'For Merchants')}
                </Button>
                <Button
                  variant="outline"
                  colorScheme="green"
                  h={14}
                  onClick={() => router.push('/agents')}
                >
                  {t('hero.agent_signup', 'For Agents')}
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
              borderColor="brand.Adfaly.500"
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
                  <Icon as={FaBolt} boxSize={8} color="brand.Adfaly.500" />
                  <Text fontWeight="bold">{t('demo.instant_transfer', 'Transfer Speed')}</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="brand.Adfaly.500">
                    &lt; 1s
                  </Text>
                </VStack>
                <VStack
                  p={6}
                  borderRadius="xl"
                  bg={useColorModeValue('white', 'gray.800')}
                  spacing={4}
                >
                  <Icon as={FaGlobe} boxSize={8} color="brand.Adfaly.500" />
                  <Text fontWeight="bold">{t('demo.global_reach', 'Countries')}</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="brand.Adfaly.500">
                    180+
                  </Text>
                </VStack>
                <VStack
                  p={6}
                  borderRadius="xl"
                  bg={useColorModeValue('white', 'gray.800')}
                  spacing={4}
                >
                  <Icon as={FaStore} boxSize={8} color="brand.Adfaly.500" />
                  <Text fontWeight="bold">{t('demo.merchants', 'Active Merchants')}</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="brand.Adfaly.500">
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
          mb={8}
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
                  <Heading
                    bgGradient="linear(to-r, brand.Adfaly.500, brand.Adfaly.700)"
                    bgClip="text"
                  >
                {t(feature.title, 'Feature')}
                </Heading>
                  <Text
                    bgGradient="linear(to-r, brand.Adfaly.500, brand.Adfaly.700)"
                    bgClip="text"
                  >
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