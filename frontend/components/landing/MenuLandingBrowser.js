// pages/menu/index.js
import { useRef } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

// Chakra imports
import {
  Box,
  Container,
  VStack,
  Text,
  Button,
  Heading,
  useColorMode,
  Grid,
  GridItem,
  SimpleGrid,
  HStack,
  Badge,
} from '@chakra-ui/react';

// Lucide icons
import {
  QrCode,
  BarChart3,
  Bot,
  MessageSquare,
  Clock,
  ArrowRight,
  CheckCircle,
  XCircle,
  DollarSign,
  Shield,
  TrendingUp,
  Users,
  Utensils,
  Coffee,
  Star,
} from 'lucide-react';

// Component imports
import { SlideInSection } from '@/components/SlideInSection';
import { SurfaceTransition } from '@/components/SurfaceTransition';
import { FBMetric } from '@/components/FBMetric';
import { RestaurantMetrics } from '@/components/RestaurantMetrics';
import { FeatureComparison } from '@/components/FeatureComparison';
import { ParallaxOrderFlow } from '@/components/ParallaxOrderFlow';

const MenuLandingBrowser = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothScroll = useSpring(scrollYProgress, {
    damping: 15,
    stiffness: 30
  });

  // const heroOpacity = useTransform(smoothScroll, [0, 0.2], [1, 0]);
  const heroScale = useTransform(smoothScroll, [0, 0.2], [1, 0.95]);

  const features = [
    {
      icon: QrCode,
      title: t('features.qr.title'),
      description: t('features.qr.description'),
      benefits: [
        t('features.qr.benefit1'),
        t('features.qr.benefit2'),
        t('features.qr.benefit3')
      ]
    },
    {
      icon: Bot,
      title: t('features.ai.title'),
      description: t('features.ai.description'),
      benefits: [
        t('features.ai.benefit1'),
        t('features.ai.benefit2'),
        t('features.ai.benefit3')
      ]
    },
    {
      icon: TrendingUp,
      title: t('features.analytics.title'),
      description: t('features.analytics.description'),
      benefits: [
        t('features.analytics.benefit1'),
        t('features.analytics.benefit2'),
        t('features.analytics.benefit3')
      ]
    },
    {
      icon: Shield,
      title: t('features.security.title'),
      description: t('features.security.description'),
      benefits: [
        t('features.security.benefit1'),
        t('features.security.benefit2'),
        t('features.security.benefit3')
      ]
    }
  ];

  return (
    <Box >
      <Head>
        <title>{t('seo.title')}</title>
        <meta name="description" content={t('seo.description')} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </Head>

      {/* Hero Section with Parallax Effect */}
      <Box
        position="relative"
        overflow="hidden"
      >
        <motion.div
          style={{
            // opacity: heroOpacity,
            scale: heroScale,
            width: '100%',
            position: 'relative'
          }}
        >
          <Container maxW="65%" h="full">
            <Grid
              templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
              gap={{ base: 8, lg: 12 }}
              h="full"
              alignItems="center"
            >
              <GridItem>
                <SlideInSection direction="left">
                  <VStack spacing={8} align="start">
                    <Heading
                      as="h1"
                      fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                      lineHeight="shorter"
                    >
                      {t('hero.title')}
                    </Heading>

                    <Text 
                      fontSize={{ base: "lg", md: "xl" }}
                      color={isDark ? 'gray.400' : 'gray.600'}
                      maxW="xl"
                    >
                      {t('hero.subtitle')}
                    </Text>

                    <HStack 
                      spacing={4} 
                      flexDir={{ base: "column", sm: "row" }}
                      w={{ base: "full", sm: "auto" }}
                    >
                      <Button
                        size="lg"
                        // bg={isDark ? 'gray.100' : 'gray.900'}
                        color={isDark ? 'gray.900' : 'gray.100'}
                        _hover={{
                          bg: isDark ? 'gray.200' : 'gray.800'
                        }}
                        rightIcon={<ArrowRight />}
                        onClick={() => router.push('/signup')}
                        w={{ base: "full", sm: "auto" }}
                      >
                        {t('hero.cta.trial')}
                      </Button>
                      <Button
                        size="lg"
                        variant="ghost"
                        leftIcon={<FaWhatsapp />}
                        onClick={() => {
                          window.open("https://api.whatsapp.com/send?phone=00447538636207", "_blank");
                        }}
                        w={{ base: "full", sm: "auto" }}
                      >
                        {t('hero.cta.demo')}
                      </Button>
                    </HStack>

                    <HStack spacing={6} flexWrap="wrap">
                      {[
                        'hero.benefits.trial',
                        'hero.benefits.noCard',
                        'hero.benefits.onboarding'
                      ].map((text, index) => (
                        <HStack key={index} color={isDark ? 'gray.400' : 'gray.600'}>
                          <CheckCircle size={16} />
                          <Text fontSize="sm">{t(text)}</Text>
                        </HStack>
                      ))}
                    </HStack>
                  </VStack>
                </SlideInSection>
              </GridItem>

                <SlideInSection direction="right">
                  <SurfaceTransition>
                    <ParallaxOrderFlow />
                  </SurfaceTransition>
                </SlideInSection>
            </Grid>
          </Container>
        </motion.div>
      </Box>

      {/* Metrics Section */}
      <Box
        // minH="100vh"
        py={{ base: 20, md: 32 }}
        position="relative"
        // bg={isDark ? 'black' : 'white'}
      >
        <Container maxW="1200px">
          <VStack spacing={20}>
            <VStack spacing={8} textAlign="center">
              <SlideInSection direction="up">
                <Heading
                  fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                  fontWeight="bold"
                >
                  {t('metrics.title')}
                </Heading>
              </SlideInSection>
              
              <SlideInSection direction="up" delay={0.1}>
                <Text 
                  fontSize={{ base: "lg", md: "xl" }}
                  color={isDark ? 'gray.400' : 'gray.600'}
                  maxW="2xl"
                >
                  {t('metrics.subtitle')}
                </Text>
              </SlideInSection>
            </VStack>

            <RestaurantMetrics />
          </VStack>
        </Container>
      </Box>

      {/* Comparison Section */}
      <Box
        // minH="100vh"
        py={{ base: 20, md: 32 }}
      >
        <Container maxW="1200px">
          <VStack spacing={20}>
            <VStack spacing={8} textAlign="center">
              <SlideInSection direction="up">
                <Heading
                  fontSize={{ base: "3xl", md: "4xl" }}
                  fontWeight="bold"
                >
                  {t('comparison.title')}
                </Heading>
              </SlideInSection>
              
              <SlideInSection direction="up" delay={0.1}>
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  color={isDark ? 'gray.400' : 'gray.600'}
                  maxW="2xl"
                >
                  {t('comparison.subtitle')}
                </Text>
              </SlideInSection>
            </VStack>

            <FeatureComparison />
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        // minH="100vh"
        py={{ base: 20, md: 32 }}
        bg={isDark ? 'black' : 'white'}
      >
        <Container maxW="1200px">
          <VStack spacing={20}>
            <VStack spacing={8} textAlign="center">
              <SlideInSection direction="up">
                <Heading
                  fontSize={{ base: "3xl", md: "4xl" }}
                  fontWeight="bold"
                >
                  {t('features.title')}
                </Heading>
              </SlideInSection>
              
              <SlideInSection direction="up" delay={0.1}>
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  color={isDark ? 'gray.400' : 'gray.600'}
                  maxW="2xl"
                >
                  {t('features.subtitle')}
                </Text>
              </SlideInSection>
            </VStack>

            <SimpleGrid 
              columns={{ base: 1, md: 2, lg: 4 }} 
              spacing={8} 
              w="full"
            >
              {features.map((feature, index) => (
                <SlideInSection
                  key={index}
                  direction={['left', 'up', 'down', 'right'][index]}
                  delay={index * 0.1}
                >
                  <SurfaceTransition>
                    <Box
                      p={6}
                      rounded="xl"
                      h="full"
                    >
                      <VStack align="start" spacing={4}>
                        <feature.icon size={32} />
                        <Text fontWeight="bold" fontSize="lg">
                          {feature.title}
                        </Text>
                        <Text color={isDark ? 'gray.400' : 'gray.600'}>
                          {feature.description}
                        </Text>
                        <VStack align="start" spacing={2}>
                          {feature.benefits.map((benefit, idx) => (
                            <HStack key={idx}>
                              <CheckCircle size={16} />
                              <Text fontSize="sm">{benefit}</Text>
                            </HStack>
                          ))}
                        </VStack>
                      </VStack>
                    </Box>
                  </SurfaceTransition>
                </SlideInSection>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
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

export default MenuLandingBrowser;