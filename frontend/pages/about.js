import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
  SimpleGrid,
  Flex,
  Icon,
  Badge,
  Circle,
  useColorMode,
  Button,
  HStack,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import {
  Flag,
  Users,
  Building2,
  ChevronRight,
  ArrowRight,
  Car,
  PackageSearch,
  Store,
  BarChart3,
  Globe,
  Timer,
  Network,
  Rocket,
  LineChart,
  TrendingDown,
} from 'lucide-react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionText = motion(Text);

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: (i) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: i * 0.2, duration: 0.5 }
  })
};

const slideIn = {
  hidden: { x: -60, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
};

const AboutPage = () => {
  const { t } = useTranslation('common');
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [activeStory, setActiveStory] = useState(0);

  const colors = {
    primary: '#1179be',
    secondary: '#0099FF',
    accent: '#003366',
    glass: isDark ? 'rgba(0, 102, 204, 0.1)' : 'rgba(0, 102, 204, 0.05)',
    text: isDark ? '#FFFFFF' : '#1A365D',
    subtext: isDark ? '#A0AEC0' : '#4A5568',
  };

  const missionStats = [
    {
      number: '1st',
      label: t('libyanSaaS'),
      description: t('firstLibyanSaaSDescription'),
      icon: Flag
    },
    {
      number: '3',
      label: t('integratedPlatforms'),
      description: t('platformSynergyDescription'),
      icon: Network
    },
    {
      number: '100%',
      label: t('libyanTalent'),
      description: t('localTalentDescription'),
      icon: Users
    }
  ];

  const storySteps = [
    {
      icon: Building2,
      title: t('establishBitMenu'),
      description: t('bitMenuStory'),
      year: '2023',
      platform: 'BitMenu'
    },
    {
      icon: Car,
      title: t('launchBitAuto'),
      description: t('bitAutoStory'),
      year: '2024 Q1',
      platform: 'BitAuto'
    },
    {
      icon: PackageSearch,
      title: t('launchBitStock'),
      description: t('bitStockStory'),
      year: '2024 Q1',
      platform: 'BitStock'
    },
    {
      icon: Rocket,
      title: t('regionalExpansion'),
      description: t('expansionStory'),
      year: '2024 Q2+',
      platform: 'BitDash'
    }
  ];

  const impactMetrics = {
    digital: [
      { 
        number: '50K+', 
        label: t('digitalTransactions'),
        icon: LineChart
      },
      { 
        number: '30%', 
        label: t('paperReduction'),
        icon: TrendingDown
      }
    ],
    economic: [
      { 
        number: '$2M+', 
        label: t('processedValue'),
        icon: BarChart3
      },
      { 
        number: '500+', 
        label: t('jobsCreated'),
        icon: Users
      }
    ],
    social: [
      { 
        number: '5', 
        label: t('citiesTransformed'),
        icon: Globe
      },
      { 
        number: '10K+', 
        label: t('livesImpacted'),
        icon: Users
      }
    ]
  };

  // const platformMetrics = {
  //   bitmenus: [
  //     { number: '50K+', label: t('ordersProcessed') },
  //     { number: '15+', label: t('citiesReached') }
  //   ],
  //   bitauto: [
  //     { number: '5K+', label: t('vehiclesListed') },
  //     { number: '5+', label: t('citiesCovered') }
  //   ],
  //   bittrade: [
  //     { number: '500K+', label: t('tradingVolume') },
  //     { number: '10+', label: t('categories') }
  //   ]
  // };

  return (
    <Layout>
      <Head>
        <title>{t('aboutBitDash')}</title>
        <link href="/favicon.ico" rel="icon"/>
      </Head>
      <Container maxW="8xl">
        <VStack spacing={12}>
          {/* Hero Section */}
          <MotionBox
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            w="full"
          >
          </MotionBox>

          {/* Mission Stats */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
            {missionStats.map((stat, index) => (
              <MotionBox
                key={index}
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                custom={index}
                whileHover={{ y: -10 }}
              >
                <VStack
                  bg={colors.glass}
                  borderRadius="2xl"
                  p={8}
                  h="full"
                  justify="center"
                  boxShadow="xl"
                  position="relative"
                  overflow="hidden"
                >
                  <Circle
                    size="100px"
                    bg={`${colors.primary}15`}
                    mb={4}
                  >
                    <Icon as={stat.icon} boxSize={10} color={colors.primary} />
                  </Circle>
                  <Text fontSize="4xl" fontWeight="bold" color={colors.primary}>
                    {stat.number}
                  </Text>
                  <Text fontSize="xl" fontWeight="medium" color={colors.text}>
                    {stat.label}
                  </Text>
                  <Text color={colors.subtext} textAlign="center">
                    {stat.description}
                  </Text>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>

          {/* Evolution Timeline */}
          <MotionBox
            variants={slideIn}
            initial="hidden"
            animate="visible"
            w="full"
          >
            <Box
              w="full"
              bg={colors.glass}
              backdropFilter="blur(10px)"
              borderRadius="2xl"
              p={8}
              boxShadow="xl"
            >
              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
                {storySteps.map((step, index) => (
                  <MotionBox
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    cursor="pointer"
                    onClick={() => setActiveStory(index)}
                    position="relative"
                  >
                    <VStack
                      spacing={4}
                      bg={activeStory === index ? `${colors.primary}15` : 'transparent'}
                      p={6}
                      borderRadius="xl"
                      transition="all 0.3s"
                    >
                      <Circle
                        size="60px"
                        bg={activeStory === index ? colors.primary : colors.glass}
                        color={activeStory === index ? 'white' : colors.primary}
                      >
                        <Icon as={step.icon} boxSize={6} />
                      </Circle>
                      <Badge
                        color={colors.primary}
                        bg={`${colors.primary}15`}
                      >
                        {step.year}
                      </Badge>
                      <Text fontWeight="bold" fontSize="lg" color={colors.text}>
                        {step.title}
                      </Text>
                      <Text textAlign="center" fontSize="sm" color={colors.subtext}>
                        {step.description}
                      </Text>
                    </VStack>
                  </MotionBox>
                ))}
              </SimpleGrid>
            </Box>
          </MotionBox>

          {/* Impact Metrics */}
          <VStack spacing={12} w="full">
            <Heading
              fontSize={{ base: '3xl', md: '4xl' }}
              textAlign="center"
              color={colors.text}
            >
              {t('measurableImpact')}
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              {Object.entries(impactMetrics).map(([category, metrics], index) => (
                <MotionBox
                  key={category}
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -5 }}
                  custom={index}
                >
                  <VStack
                    bg={colors.glass}
                    borderRadius="xl"
                    p={8}
                    spacing={6}
                    height="full"
                  >
                    <Heading size="md" color={colors.text} textTransform="capitalize">
                      {t(`impact.${category}`)}
                    </Heading>
                    {metrics.map((metric, idx) => (
                      <VStack key={idx} spacing={2}>
                        <Icon as={metric.icon} color={colors.primary} boxSize={6} />
                        <Text fontSize="3xl" fontWeight="bold" color={colors.primary}>
                          {metric.number}
                        </Text>
                        <Text color={colors.subtext} textAlign="center">
                          {metric.label}
                        </Text>
                      </VStack>
                    ))}
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>

          {/* Platform Metrics
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
            {Object.entries(platformMetrics).map(([platform, metrics], index) => (
              <MotionBox
                key={platform}
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                custom={index}
                whileHover={{ y: -5 }}
              >
                <VStack
                  bg={colors.glass}
                  borderRadius="xl"
                  p={8}
                  spacing={6}
                  height="full"
                >
                  <Heading size="md" color={colors.text} textTransform="capitalize">
                    {platform}
                  </Heading>
                  {metrics.map((metric, idx) => (
                    <VStack key={idx} spacing={2}>
                      <Text fontSize="3xl" fontWeight="bold" color={colors.primary}>
                        {metric.number}
                      </Text>
                      <Text color={colors.subtext} textAlign="center">
                        {metric.label}
                      </Text>
                    </VStack>
                  ))}
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid> */}

          {/* Enhanced CTA */}
          <MotionBox
            variants={scaleIn}
            initial="hidden"
            animate="visible"
          >
            <VStack spacing={6}>
              <Heading size="lg" textAlign="center" color={colors.text}>
                {t('joinTransformation')}
              </Heading>
              <Button
                size="lg"
                bg={colors.primary}
                color="white"
                _hover={{
                  bg: colors.secondary,
                  transform: 'translateY(-2px)',
                  boxShadow: '2xl'
                }}
                px={16}
                py={8}
                fontSize="2xl"
                rightIcon={<ArrowRight />}
              >
                {t('transformWithUs')}
              </Button>
            </VStack>
          </MotionBox>
        </VStack>
      </Container>
    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default AboutPage;