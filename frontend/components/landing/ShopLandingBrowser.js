import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Grid,
  Input,
  InputGroup,
  InputLeftElement,
  useColorMode,
  Badge,
  SimpleGrid,
  IconButton,
  useBreakpointValue,
  Flex,
  Avatar,
  Link,
  Wrap,
  WrapItem,
  Card,
  CardBody,
  Image,
  Stat,
  StatNumber,
  useDisclosure,
  StatLabel,
  AspectRatio,
  Divider
} from '@chakra-ui/react';
import { motion, useViewportScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Search,
  ShoppingBag,
  Star,
  ChevronRight,
  Store,
  TrendingUp,
  Shield,
  Globe,
  Menu,
  X,
  DollarSign,
  Users,
  Building,
  Truck,
  Package,
  Heart,
  Clock
} from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MarketplacePreview from '@/components/MarketplacePreview';
import { MarketplaceAnimation } from '@/components/shop/MarketplaceAnimation';

const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionFlex = motion(Flex);

export default function ShopLanding() {
  const { t } = useTranslation('common');
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const { scrollYProgress } = useViewportScroll();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const isMobile = useBreakpointValue({ base: true, md: false });
  const headerHeight = useBreakpointValue({ base: '70vh', md: '85vh' });
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const [gradientPosition, setGradientPosition] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPosition((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Store,
      title: t('feature_store_title'),
      description: t('feature_store_description'),
    },
    {
      icon: Truck,
      title: t('feature_delivery_title'),
      description: t('feature_delivery_description'),
    },
    {
      icon: DollarSign,
      title: t('feature_payments_title'),
      description: t('feature_payments_description'),
    },
    {
      icon: Shield,
      title: t('feature_security_title'),
      description: t('feature_security_description'),
    }
  ];

  const testimonials = [
    {
      name: t('testimonial_1_name'),
      role: t('testimonial_1_role'),
      content: t('testimonial_1_content'),
    },
    {
      name: t('testimonial_2_name'),
      role: t('testimonial_2_role'),
      content: t('testimonial_2_content'),
    },
    {
      name: t('testimonial_3_name'),
      role: t('testimonial_3_role'),
      content: t('testimonial_3_content'),
    }
  ];

  const stats = [
    {
      label: t('stats_products'),
      value: '10K+',
      icon: Package
    },
    {
      label: t('stats_stores'),
      value: '500+',
      icon: Building
    },
    {
      label: t('stats_users'),
      value: '50K+',
      icon: Users
    },
    {
      label: t('stats_cities'),
      value: '15+',
      icon: Globe
    }
  ];

  return (
    <Box overflowX="hidden">      
      <Container 
        maxW="8xl" 
        px={{ base: 4, md: 8 }}
        py={{ base: 6, md: 10 }}
      >

        {/* MarketplacePreview */}
        <Box>
          <MarketplacePreview />
        </Box>
        <Grid 
          templateColumns={{ 
            base: '1fr',
            lg: '1.2fr 0.8fr' 
          }}
          gap={{ base: 8, lg: 16 }}
          alignItems="center"
        >
          {/* Left Content */}
          <VStack
            align={{ base: 'center', lg: 'start' }}
            spacing={{ base: 6, md: 8 }}
            textAlign={{ base: 'center', lg: 'left' }}
          >
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              w="full"
            >
              <Heading
                fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
                fontWeight="black"
                bgGradient="linear(to-r, brand.bitshop.400, brand.bitshop.700)"
                bgClip="text"
                lineHeight="1.2"
              >
                {t('hero_title')}
              </Heading>
              <Text 
                mt={4}
                fontSize={{ base: 'lg', md: 'xl' }}
                color="gray.500"
                maxW={{ base: 'full', lg: '80%' }}
              >
                {t('hero_description')}
              </Text>
            </MotionBox>
          </VStack>

          {/* Right Animation */}
          <Box
            position="relative"
            height={{ base: '300px', md: '400px', lg: '500px' }}
            width="full"
            overflow="hidden"
            borderRadius="2xl"
          >
            <MarketplaceAnimation />
          </Box>
        </Grid>
      </Container>

      

      <Box py={20}>
        <Container maxW="7xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Heading size="2xl">{t('features_title')}</Heading>
              <Text color="gray.500" fontSize="xl" maxW="2xl">
                {t('features_description')}
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
              {features.map((feature, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    height="full"
                    bg={isDark ? 'gray.800' : 'white'}
                    borderRadius="xl"
                    overflow="hidden"
                    boxShadow="xl"
                    _hover={{ transform: 'translateY(-5px)' }}
                    transition="all 0.2s"
                  >
                    <CardBody>
                      <VStack spacing={4} align="start">
                        <Box
                          p={3}
                          borderRadius="lg"
                          bg={isDark ? 'blue.900' : 'blue.50'}
                        >
                          <feature.icon size={24} color={isDark ? '#90CDF4' : '#2B6CB0'} />
                        </Box>
                        <Heading size="md">{feature.title}</Heading>
                        <Text color="gray.500">{feature.description}</Text>
                      </VStack>
                    </CardBody>
                  </Card>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      <Box py={20}>
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={16} alignItems="center">
            <VStack align="start" spacing={8}>
              <Heading size="2xl">{t('testimonials_title')}</Heading>
              <Text color="gray.500" fontSize="xl">
                {t('testimonials_description')}
              </Text>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
                {stats.map((stat, index) => (
                  <MotionBox
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card bg={isDark ? 'gray.800' : 'white'}>
                      <CardBody>
                        <Stat>
                          <HStack spacing={4}>
                            <Box
                              p={3}
                              borderRadius="lg"
                              bg={isDark ? 'blue.900' : 'blue.50'}
                            >
                              <stat.icon size={24} color={isDark ? '#90CDF4' : '#2B6CB0'} />
                            </Box>
                            <Box>
                              <StatLabel>{stat.label}</StatLabel>
                              <StatNumber fontSize="3xl">{stat.value}</StatNumber>
                            </Box>
                          </HStack>
                        </Stat>
                      </CardBody>
                    </Card>
                  </MotionBox>
                ))}
              </SimpleGrid>
            </VStack>

            <SimpleGrid columns={1} spacing={8}>
              {testimonials.map((testimonial, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card bg={isDark ? 'gray.800' : 'white'}>
                    <CardBody>
                      <VStack align="start" spacing={4}>
                        <HStack spacing={4}>
                          <Avatar src={testimonial.avatar} size="md" />
                          <Box>
                            <Text fontWeight="bold">{testimonial.name}</Text>
                            <Text color="gray.500" fontSize="sm">{testimonial.role}</Text>
                          </Box>
                        </HStack>
                        <Text color="gray.500">{testimonial.content}</Text>
                      </VStack>
                      </CardBody>
                  </Card>
                </MotionBox>
              ))}
            </SimpleGrid>
          </SimpleGrid>
        </Container>
      </Box>

      <Box 
        position="relative"
        spacing={20}
        overflow="hidden"
      >
        <Container columns={{ base: 1, lg: 2 }} spacing={20} alignItems="center">
          <Grid>
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <VStack align="start" mb={8}>
                <Heading size="2xl">
                  {t('start_selling_title')}
                </Heading>
              </VStack>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              w="full"
            >
              <SimpleGrid 
                columns={{ base: 1, md: 2 }} 
                spacing={6}
                maxW="7xl"
                mx="auto"
              >
                {[
                  {
                    icon: Clock,
                    title: t('quick_setup_title'),
                    description: t('quick_setup_description'),
                    gradient: 'linear(to-r, blue.400, purple.500)'
                  },
                  {
                    icon: Shield,
                    title: t('secure_payments_title'),
                    description: t('secure_payments_description'),
                    gradient: 'linear(to-r, cyan.400, blue.500)'
                  },
                  {
                    icon: Globe,
                    title: t('reach_customers_title'),
                    description: t('reach_customers_description'),
                    gradient: 'linear(to-r, blue.400, teal.500)'
                  },
                  {
                    icon: Heart,
                    title: t('customer_support_title'),
                    description: t('customer_support_description'),
                    gradient: 'linear(to-r, purple.400, pink.500)'
                  }
                ].map((item, index) => (
                  <MotionBox
                    key={index}
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      backdropFilter="blur(16px)"
                      borderWidth="1px"
                      borderColor={isDark ? 'whiteAlpha.200' : 'gray.200'}
                      borderRadius="2xl"
                      overflow="hidden"
                      boxShadow="xl"
                      position="relative"
                      _before={{
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        bgGradient: item.gradient,
                      }}
                    >
                      <CardBody p={8}>
                        <VStack spacing={6} align="start">
                          <Box
                            p={3}
                            borderRadius="xl"
                            bgGradient="linear(to-r, brand.bitshop.400, brand.bitshop.700)"
                            boxShadow="lg"
                          >
                            <item.icon 
                              size={28} 
                              color="white"
                              style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }}
                            />
                          </Box>
                          <VStack align="start" spacing={2}>
                            <Heading 
                              size="md"
                              bgGradient="linear(to-r, brand.bitshop.400, brand.bitshop.700)"
                              bgClip="text"
                            >
                              {item.title}
                            </Heading>
                            <Text 
                              color={isDark ? 'gray.300' : 'gray.600'}
                              fontSize="md"
                              lineHeight="tall"
                            >
                              {item.description}
                            </Text>
                          </VStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  </MotionBox>
                ))}
              </SimpleGrid>
            </MotionBox>
          </Grid>
        </Container>
      </Box>

      <Box py={20}>
        <Container maxW="3xl" textAlign="center">
          <VStack spacing={8}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Heading size="2xl">{t('cta_title')}</Heading>
              <Text color="gray.500" fontSize="xl">
                {t('cta_description')}
              </Text>
            </MotionBox>
            
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                size="lg"
                colorScheme="blue"
                rightIcon={<ChevronRight />}
                px={8}
              >
                {t('cta_button')}
              </Button>
            </MotionBox>

            <Wrap spacing={4} justify="center">
              {[
                { label: t('support_247'), icon: Clock },
                { label: t('secure_platform'), icon: Shield },
                { label: t('verified_sellers'), icon: Store }
              ].map((item, index) => (
                <WrapItem key={index}>
                  <HStack
                    spacing={2}
                    p={2}
                    borderRadius="lg"
                  >
                    <item.icon size={16} />
                    <Text fontSize="sm">{item.label}</Text>
                  </HStack>
                </WrapItem>
              ))}
            </Wrap>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}