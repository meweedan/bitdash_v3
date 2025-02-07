import { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
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
  List,
  ListItem,
  ListIcon,
  Code
} from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import { 
  FaTruck,
  FaStore,
  FaShieldAlt,
  FaRoute,
  FaMoneyBillWave,
  FaMobileAlt,
  FaUtensils,
  FaShoppingBasket,
  FaMapMarkedAlt,
  FaRegChartBar,
  FaHandshake
} from 'react-icons/fa';
import { MdCheckCircle } from 'react-icons/md';

import GradientHeading from '@/components/GradientHeading';
import ScrollProgress from '@/components/ScrollProgress';
import GlassCard from '@/components/GlassCard';
import DeluxeDeliveryFlow from '@/components/DeluxeDeliveryFlow';
import LocationsPreview from '@/components/landing/LocationsPreview';

const MotionBox = motion(Box);

const EatsLandingBrowser = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  const bgGradient = useColorModeValue(
    'linear(to-b, gray.50 0%, white 100%)',
    'linear(to-b, gray.900 0%, black 100%)'
  );

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }, []);

  // Platform features with translations
  const platformFeatures = [
    {
      icon: FaUtensils,
      title: t('services.qrOrderingSystem'),
      description: t('qrOrderingDescription'),
      color: 'green.500'
    },
    {
      icon: FaMoneyBillWave,
      title: t('bitCashIntegration'),
      description: t('paymentProcessing'),
      color: 'blue.500'
    },
    {
      icon: FaShoppingBasket,
      title: t('bitShopDescription'),
      description: t('groceryDelivery'),
      color: 'orange.500'
    },
    {
      icon: FaMapMarkedAlt,
      title: t('liveTracking'),
      description: t('orderTrackDescription'),
      color: 'purple.500'
    }
  ];

  // Delivery features with translations
  const deliveryFeatures = [
    {
      icon: FaTruck,
      title: t('delivery'),
      description: t('services.leftoverStock.features.3'),
      technical: t('services.bitBI.features.3')
    },
    {
      icon: FaShieldAlt,
      title: t('features.security.title'),
      description: t('features.security.benefit1'),
      technical: t('features.security.benefit2')
    },
    {
      icon: FaRoute,
      title: t('features.ai.benefit3'),
      description: t('services.bitBI.features.2'),
      technical: t('features.analytics.benefit3')
    }
  ];

  // Partner benefits with translations
  const partnerBenefits = {
    restaurants: [
      t('accountBenefits.restaurantOwner.0'),
      t('accountBenefits.restaurantOwner.1'),
      t('accountBenefits.restaurantOwner.4')
    ],
    drivers: [
      t('partnerBenefits.drivers.0'),
      t('partnerBenefits.drivers.1'),
      t('partnerBenefits.drivers.2')
    ]
  };

  const SectionContainer = ({ children, py = 20 }) => (
    <Container maxW="8xl" px={{ base: 4, lg: 0 }} py={py}>
      {children}
    </Container>
  );

  return (
    <Box 
      ref={containerRef} 
      minH="100vh"
      overflow="hidden"
    >
      <Head>
        <title>{t('seo.title')}</title>
        <meta name="description" content={t('seo.description')} />
      </Head>

      {/* Hero Section */}
      <Box 
        ref={scrollRef}
        minH="100vh" 
        position="relative"
      >
        <AnimatePresence>
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            position="relative"
            zIndex={2}
          >
            <SectionContainer py={0}>
              <Flex 
                minH="100vh"
                direction="column" 
                align="center" 
                justify="center"
                py={{ base: 16, md: 24 }}
              >
                <VStack spacing={6} maxW="4xl">
                  <GradientHeading 
                    fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
                    textAlign="center"
                  >
                    {t('hero.title')}
                  </GradientHeading>

                  <Text 
                    fontSize={{ base: 'lg', md: 'xl' }} 
                    color={useColorModeValue('gray.600', 'gray.300')}
                    maxW="2xl"
                    textAlign="center"
                  >
                    {t('hero.subtitle')}
                  </Text>

                  <HStack spacing={4} pt={8}>
                    <Button
                      size="lg"
                      colorScheme="blue"
                      rightIcon={<ArrowRight />}
                      onClick={() => router.push('/eats/browse')}
                    >
                      {t('callToActionButton')}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => router.push('/eats/business')}
                    >
                      {t('businessSignup')}
                    </Button>
                  </HStack>
                </VStack>

                <Box mt={12} w="full" maxW="6xl">
                  <Box 
                    position="relative"
                    borderRadius="2xl"
                    overflow="visible"
                    bg="transparent"  
                  >
                    <DeluxeDeliveryFlow />
                  </Box>
                </Box>
              </Flex>
            </SectionContainer>
          </MotionBox>
        </AnimatePresence>
      </Box>

      {/* Features Section */}
      <SectionContainer>
        <SimpleGrid 
          columns={{ base: 1, md: 2, lg: 4 }} 
          spacing={8}
        >
          {platformFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard 
                p={6} 
                h="full"
                transition="all 0.3s ease"
                _hover={{ 
                  transform: 'translateY(-5px)',
                  boxShadow: 'xl'
                }}
              >
                <VStack align="start" spacing={4}>
                  <Icon 
                    as={feature.icon} 
                    boxSize={10} 
                    color={feature.color} 
                  />
                  <Heading size="md">{feature.title}</Heading>
                  <Text color={useColorModeValue('gray.600', 'gray.300')}>
                    {feature.description}
                  </Text>
                </VStack>
              </GlassCard>
            </motion.div>
          ))}
        </SimpleGrid>
      </SectionContainer>

      {/* Business Features */}
      <SectionContainer>
        <VStack spacing={12} align="center">
          <VStack textAlign="center" maxW="3xl">
            <Heading size="2xl">{t('joinTransformation')}</Heading>
            <Text fontSize="xl" color="gray.500">
              {t('platformSynergyDescription')}
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {deliveryFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard p={6}>
                  <VStack spacing={4} align="start">
                    <Icon as={feature.icon} boxSize={10} color="blue.400" />
                    <Heading size="md">{feature.title}</Heading>
                    <Text>{feature.description}</Text>
                    <Code colorScheme="blue" p={2} borderRadius="md">
                      {feature.technical}
                    </Code>
                  </VStack>
                </GlassCard>
              </motion.div>
            ))}
          </SimpleGrid>
        </VStack>
      </SectionContainer>

      {/* Partner Benefits Section */}
      <SectionContainer>
        <VStack spacing={12} align="center">
          <VStack textAlign="center" maxW="3xl">
            <Heading size="2xl">{t('ctaTitle')}</Heading>
            <Text fontSize="xl" color="gray.500">
              {t('cta.subtitle')}
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard p={6}>
                <VStack spacing={4} align="start">
                  <Icon as={FaStore} boxSize={10} color="green.400" />
                  <Heading size="md">{t('forRestaurants')}</Heading>
                  <List spacing={3}>
                    {partnerBenefits.restaurants.map((benefit, index) => (
                      <ListItem key={index} display="flex" alignItems="center">
                        <ListIcon as={MdCheckCircle} color="green.500" />
                        <Text>{benefit}</Text>
                      </ListItem>
                    ))}
                  </List>
                </VStack>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard p={6}>
                <VStack spacing={4} align="start">
                  <Icon as={FaHandshake} boxSize={10} color="blue.400" />
                  <Heading size="md">{t('forDrivers')}</Heading>
                  <List spacing={3}>
                    {partnerBenefits.drivers.map((benefit, index) => (
                      <ListItem key={index} display="flex" alignItems="center">
                        <ListIcon as={MdCheckCircle} color="blue.500" />
                        <Text>{benefit}</Text>
                      </ListItem>
                    ))}
                  </List>
                </VStack>
              </GlassCard>
            </motion.div>
          </SimpleGrid>

          <Button
            size="lg"
            colorScheme="blue"
            rightIcon={<ArrowRight />}
            onClick={() => router.push('/eats/partners/signup')}
          >
            {t('cta.action')}
          </Button>
        </VStack>
      </SectionContainer>
    </Box>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default EatsLandingBrowser;