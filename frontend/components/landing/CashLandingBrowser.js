import { useRef } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
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
  Divider,
  Code,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react';
import { ArrowRight } from 'phosphor-react/dist';
import { 
  FaCode, 
  FaServer, 
  FaShieldAlt, 
  FaGlobe,
  FaMoneyBillWave,
  FaLock,
  FaExchangeAlt,
  FaBitcoin,
  FaIndustry,
  FaMobileAlt,
  FaRegChartBar,
  FaBalanceScale
} from 'react-icons/fa';
import { MdCheckCircle } from 'react-icons/md';

import ParallaxSection from '@/components/ParallaxSection';
import GradientHeading from '@/components/GradientHeading';
import ScrollProgress from '@/components/ScrollProgress';
import GlassCard from '@/components/GlassCard';
import LocationsPreview from '@/components/landing/LocationsPreview';
import CryptoMatrix from '@/components/CryptoMatrix';

const BitCashLanding = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const containerRef = useRef(null);

  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const bgGradient = useColorModeValue(
    'linear(to-b, gray.50 0%, white 100%)',
    'linear(to-b, gray.900 0%, black 100%)'
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothScroll = useSpring(scrollYProgress, {
    mass: 0.1,
    stiffness: 100,
    damping: 20
  });

  const heroScale = useTransform(smoothScroll, [0, 1], [1, 0.92]);

  const enterpriseSolutions = [
    {
      icon: FaServer,
      title: 'bitcash.solutions.scalable.title',
      description: 'bitcash.solutions.scalable.description',
      technical: 'bitcash.solutions.scalable.technical'
    },
    {
      icon: FaShieldAlt,
      title: 'bitcash.solutions.security.title',
      description: 'bitcash.solutions.security.description',
      technical: 'bitcash.solutions.security.technical'
    },
    {
      icon: FaCode,
      title: 'bitcash.solutions.api.title',
      description: 'bitcash.solutions.api.description',
      technical: 'bitcash.solutions.api.technical'
    }
  ];

  const sectionFeatures = [
    {
      icon: FaGlobe,
      title: 'bitcash.features.global.title',
      description: 'bitcash.features.global.description',
      color: 'green.500'
    },
    {
      icon: FaLock,
      title: 'bitcash.features.security.title',
      description: 'bitcash.features.security.description',
      color: 'red.500'
    },
    {
      icon: FaBitcoin,
      title: 'bitcash.features.crypto.title',
      description: 'bitcash.features.crypto.description',
      color: 'blue.500'
    },
    {
      icon: FaIndustry,
      title: 'bitcash.features.enterprise.title',
      description: 'bitcash.features.enterprise.description',
      color: 'purple.500'
    }
  ];

  const platformHighlights = [
    {
      icon: FaMobileAlt,
      title: 'bitcash.highlights.mobile.title',
      description: 'bitcash.highlights.mobile.description'
    },
    {
      icon: FaBalanceScale,
      title: 'bitcash.highlights.regulatory.title',
      description: 'bitcash.highlights.regulatory.description'
    }
  ];

  const mt5Integration = {
    features: [
      {
        icon: FaExchangeAlt,
        title: 'bitcash.mt5.trading.title',
        description: 'bitcash.mt5.trading.description'
      },
      {
        icon: FaRegChartBar,
        title: 'bitcash.mt5.charts.title',
        description: 'bitcash.mt5.charts.description'
      }
    ],
    technicalHighlights: [
      'bitcash.mt5.tech.websocket',
      'bitcash.mt5.tech.latency',
      'bitcash.mt5.tech.multiAsset'
    ]
  };

  return (
      <Box 
        ref={containerRef} 
        bg={bgGradient} 
        maxW="100%" 
        overflow="hidden"
      >
        <Head>
          <title>BitCash | Reimagining Libya's Finances</title>
          <meta name="description" content="Payment solution built for Libyans, by Libyans" />
        </Head>

        <ScrollProgress scrollYProgress={smoothScroll} />

        <Container maxW="8xl" px={{ base: 4, lg: 0 }}>
          <ParallaxSection>
            <motion.div style={{ scale: heroScale }}>
              <Flex 
                direction="column" 
                align="center" 
                textAlign="center" 
                py={{ base: 16, md: 24 }}
              >
                <VStack spacing={6} maxW="4xl">
                  <GradientHeading 
                    fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
                  >
                    {t('bitcash.hero.title')}
                  </GradientHeading>

                  <Text 
                    fontSize={{ base: 'lg', md: 'xl' }} 
                    color={useColorModeValue('gray.600', 'gray.300')}
                    maxW="2xl"
                  >
                    {t('bitcash.hero.subtitle')}
                  </Text>

                  <HStack spacing={4} pt={8}>
                    <Button
                      size="lg"
                      colorScheme="blue"
                      rightIcon={<ArrowRight />}
                      onClick={() => router.push('/signup')}
                    >
                      {t('bitcash.hero.cta.signup')}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => router.push('/enterprise')}
                    >
                      {t('bitcash.hero.cta.enterprise')}
                    </Button>
                  </HStack>
                </VStack>

                <Box mt={12} w="full" maxW="5xl">
                  <GlassCard p={6} borderRadius="2xl">
                    <CryptoMatrix 
                      columns={{ base: 4, md: 6 }} 
                      spacing={{ base: 2, md: 4 }} 
                    />
                  </GlassCard>
                </Box>
              </Flex>
            </motion.div>
          </ParallaxSection>

          {/* Platform Features */}
          <ParallaxSection>
            <SimpleGrid 
              columns={[1, 2, 4]} 
              spacing={6} 
              py={{ base: 16, md: 24 }}
            >
              {sectionFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard p={6} h="full">
                    <VStack align="start" spacing={4}>
                      <Icon 
                        as={feature.icon} 
                        boxSize={10} 
                        color={feature.color} 
                      />
                      <Heading size="md">{t(feature.title)}</Heading>
                      <Text color={useColorModeValue('gray.600', 'gray.300')}>
                        {t(feature.description)}
                      </Text>
                    </VStack>
                  </GlassCard>
                </motion.div>
              ))}
            </SimpleGrid>
          </ParallaxSection>

          <ParallaxSection>
            {/* New Locations TabPanel */}
              <Box 
                bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.400')}
                borderRadius="xl"
                height="600px" 
                overflow="hidden"
              >
                <LocationsPreview />
              </Box>
          </ParallaxSection>

          {/* Platform Highlights */}
          <ParallaxSection>
            <Flex 
              direction={{ base: 'column', md: 'row' }}
              justify="space-between"
              align="center"
              py={{ base: 24, md: 12 }}
              gap={8}
            >
              {platformHighlights.map((highlight, index) => (
                <GlassCard 
                  key={index} 
                  p={6}
                >
                  <VStack align="start" spacing={4}>
                    <Icon 
                      as={highlight.icon} 
                      boxSize={10} 
                      color={useColorModeValue('blue.500', 'blue.300')} 
                    />
                    <Heading size="md">{t(highlight.title)}</Heading>
                    <Text color={useColorModeValue('gray.600', 'gray.300')}>
                      {t(highlight.description)}
                    </Text>
                  </VStack>
                </GlassCard>
              ))}
            </Flex>
          </ParallaxSection>

          {/* Loading Animation */}
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>

          {/* Enterprise Solutions Section */}
          <ParallaxSection>
            <VStack spacing={12} py={24} align="center">
              <VStack textAlign="center" maxW="3xl">
                <Heading size="2xl">{t('bitcash.enterprise.title')}</Heading>
                <Text fontSize="xl" color="gray.500">
                  {t('bitcash.enterprise.subtitle')}
                </Text>
              </VStack>

              <SimpleGrid columns={[1, 3]} spacing={8}>
                {enterpriseSolutions.map((solution, index) => (
                  <GlassCard key={index} p={6}>
                    <VStack spacing={4} align="start">
                      <Icon as={solution.icon} boxSize={10} color="blue.400" />
                      <Heading size="md">{t(solution.title)}</Heading>
                      <Text>{t(solution.description)}</Text>
                      <Code colorScheme="blue" p={2} borderRadius="md">
                        {t(solution.technical)}
                      </Code>
                    </VStack>
                  </GlassCard>
                ))}
              </SimpleGrid>
            </VStack>
          </ParallaxSection>

          {/* MT5 Trading Platform Integration */}
          <ParallaxSection>
            <VStack spacing={12} py={24} align="center">
              <VStack textAlign="center" maxW="3xl">
                <Heading size="2xl">{t('bitcash.mt5.title')}</Heading>
                <Text fontSize="xl" color="gray.500">
                  {t('bitcash.mt5.subtitle')}
                </Text>
              </VStack>

              <SimpleGrid columns={[1, 2]} spacing={8}>
                {mt5Integration.features.map((feature, index) => (
                  <GlassCard key={index} p={6}>
                    <VStack spacing={4} align="start">
                      <Icon as={feature.icon} boxSize={10} color="green.400" />
                      <Heading size="md">{t(feature.title)}</Heading>
                      <Text>{t(feature.description)}</Text>
                    </VStack>
                  </GlassCard>
                ))}
              </SimpleGrid>

              <VStack spacing={4} w="full" maxW="3xl">
                <Heading size="lg">{t('bitcash.mt5.tech.title')}</Heading>
                <List spacing={3} w="full">
                  {mt5Integration.technicalHighlights.map((highlight, index) => (
                    <ListItem key={index} display="flex" alignItems="center">
                      <ListIcon as={MdCheckCircle} color="green.500" />
                      <Text>{t(highlight)}</Text>
                    </ListItem>
                  ))}
                </List>
              </VStack>
            </VStack>
          </ParallaxSection>

          {/* Agent Recruitment Section */}
          <ParallaxSection>
            <VStack spacing={12} py={24} align="center">
              <VStack textAlign="center" maxW="3xl">
                <Heading size="2xl">{t('bitcash.agent.title')}</Heading>
                <Text fontSize="xl" color="gray.500">
                  {t('bitcash.agent.subtitle')}
                </Text>
              </VStack>

              <GlassCard p={8} maxW="4xl" w="full">
                <VStack spacing={6} align="start">
                  <HStack spacing={4} align="center">
                    <Icon as={FaMoneyBillWave} boxSize={10} color="green.500" />
                    <Heading size="md">{t('bitcash.agent.earnMore')}</Heading>
                  </HStack>

                  <SimpleGrid columns={[1, 2]} spacing={4}>
                    <VStack align="start" spacing={3}>
                      <List spacing={3}>
                        <ListItem display="flex" alignItems="center">
                          <ListIcon as={MdCheckCircle} color="green.500" />
                          {t('bitcash.agent.services.cash')}
                        </ListItem>
                        <ListItem display="flex" alignItems="center">
                          <ListIcon as={MdCheckCircle} color="green.500" />
                          {t('bitcash.agent.services.fx')}
                        </ListItem>
                        <ListItem display="flex" alignItems="center">
                          <ListIcon as={MdCheckCircle} color="green.500" />
                          {t('bitcash.agent.services.crypto')}
                        </ListItem>
                      </List>
                    </VStack>
                    <VStack align="start" spacing={3}>
                      <List spacing={3}>
                        <ListItem display="flex" alignItems="center">
                          <ListIcon as={MdCheckCircle} color="green.500" />
                          {t('bitcash.agent.benefits.commission')}
                        </ListItem>
                        <ListItem display="flex" alignItems="center">
                          <ListIcon as={MdCheckCircle} color="green.500" />
                          {t('bitcash.agent.benefits.training')}
                        </ListItem>
                        <ListItem display="flex" alignItems="center">
                          <ListIcon as={MdCheckCircle} color="green.500" />
                          {t('bitcash.agent.benefits.support')}
                        </ListItem>
                      </List>
                    </VStack>
                  </SimpleGrid>

                  <Divider my={4} />

                  <VStack w="full" spacing={4}>
                    <Text fontWeight="bold" fontSize="lg">
                      {t('bitcash.agent.cta.question')}
                    </Text>
                    <HStack spacing={4} w="full" justify="center">
                      <Button 
                        colorScheme="blue" 
                        size="lg" 
                        rightIcon={<ArrowRight />}
                        onClick={() => router.push('/signup/operator')}
                      >
                        {t('bitcash.agent.cta.apply')}
                      </Button>
                      <Button 
                        variant="outline" 
                        colorScheme="blue" 
                        size="lg"
                        onClick={() => router.push('/agent-info')}
                      >
                        {t('bitcash.agent.cta.learnMore')}
                      </Button>
                    </HStack>
                  </VStack>
                  </VStack>
              </GlassCard>
              </VStack>
          </ParallaxSection>
        </Container>
      </Box>
  );
};

export default BitCashLanding;