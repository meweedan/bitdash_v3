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
      avatar: '/avatars/1.jpg'
    },
    {
      name: t('testimonial_2_name'),
      role: t('testimonial_2_role'),
      content: t('testimonial_2_content'),
      avatar: '/avatars/2.jpg'
    },
    {
      name: t('testimonial_3_name'),
      role: t('testimonial_3_role'),
      content: t('testimonial_3_content'),
      avatar: '/avatars/3.jpg'
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
      <Box
        position="relative"
        height={headerHeight}
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          overflow="hidden"
          pointerEvents="none"
        >
          {[...Array(20)].map((_, i) => (
            <MotionBox
              key={i}
              position="absolute"
              left={`${Math.random() * 100}%`}
              top={`${Math.random() * 100}%`}
              width={`${Math.random() * 5 + 2}px`}
              height={`${Math.random() * 5 + 2}px`}
              borderRadius="full"
              animate={{
                y: [0, 100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </Box>

        <Container maxW="8xl" h="full">
          <Grid
            templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
            gap={{ base: 8, lg: 16 }}
            h="full"
            alignItems="center"
          >
            <VStack
              align={{ base: 'center', lg: 'start' }}
              spacing={8}
              textAlign={{ base: 'center', lg: 'left' }}
            >
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Badge
                  colorScheme="blue"
                  px={4}
                  py={2}
                  borderRadius="full"
                  fontSize={{ base: 'md', lg: 'lg' }}
                  textTransform="none"
                >
                  {t('hero_badge')}
                </Badge>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Heading
                  fontSize={{ base: '4xl', md: '5xl', lg: '7xl' }}
                  fontWeight="black"
                  lineHeight="shorter"
                  bgGradient={`linear(to-r, blue.500, purple.500 ${gradientPosition}%, blue.500)`}
                  bgClip="text"
                  style={{ backgroundSize: '200% auto' }}
                >
                  {t('hero_title')}
                </Heading>
              </MotionBox>

              <MotionText
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                fontSize={{ base: 'lg', md: 'xl' }}
                color="gray.500"
                maxW="600px"
              >
                {t('hero_description')}
              </MotionText>

              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                w="full"
                maxW="500px"
              >
                <InputGroup size="lg">
                  <InputLeftElement>
                    <Search />
                  </InputLeftElement>
                  <Input
                    placeholder={t('search_placeholder')}
                    bg={isDark ? 'gray.800' : 'white'}
                    borderRadius="xl"
                    borderWidth={2}
                    _focus={{
                      borderColor: 'blue.500',
                      boxShadow: 'xl'
                    }}
                  />
                  <Button
                    position="absolute"
                    right={2}
                    top={2}
                    colorScheme="blue"
                    zIndex={2}
                    display={{ base: 'none', md: 'flex' }}
                  >
                    {t('search_button')}
                  </Button>
                </InputGroup>
              </MotionBox>

              <Wrap spacing={4} justify={{ base: 'center', lg: 'start' }}>
                {stats.slice(0, 3).map((stat, index) => (
                  <WrapItem key={index}>
                    <MotionBox
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                    >
                      <HStack
                        spacing={2}
                        p={2}
                        borderRadius="lg"
                        bg={isDark ? 'whiteAlpha.100' : 'blackAlpha.50'}
                      >
                        <stat.icon size={20} />
                        <Text>{stat.value}</Text>
                      </HStack>
                    </MotionBox>
                  </WrapItem>
                ))}
              </Wrap>
            </VStack>

            <Box
              display={{ base: 'none', lg: 'block' }}
              position="relative"
              height="100%"
            >
              <MarketplaceAnimation />
            </Box>
          </Grid>
        </Container>
      </Box>

      <Box py={20}>
        <Container maxW="8xl">
          <VStack spacing={16}>
            <Heading textAlign="center" size="2xl">
              {t('marketplace_title')}
            </Heading>
            <MarketplacePreview />
          </VStack>
        </Container>
      </Box>

      <Box py={20} bg={isDark ? 'gray.900' : 'gray.50'}>
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
        py={20} 
        bg={isDark ? 'gray.900' : 'gray.50'}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="7xl" position="relative" zIndex={2}>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={16} alignItems="center">
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <VStack align="start" spacing={8}>
                <Badge
                  colorScheme="blue"
                  px={4}
                  py={2}
                  borderRadius="full"
                  fontSize="md"
                >
                  {t('start_selling_badge')}
                </Badge>
                <Heading size="2xl">
                  {t('start_selling_title')}
                </Heading>
                <Text color="gray.500" fontSize="xl">
                  {t('start_selling_description')}
                </Text>
                <HStack spacing={4}>
                  <Button
                    size="lg"
                    colorScheme="blue"
                    rightIcon={<ChevronRight />}
                  >
                    {t('create_store_button')}
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    rightIcon={<ChevronRight />}
                  >
                    {t('learn_more_button')}
                  </Button>
                </HStack>
              </VStack>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Grid templateColumns="repeat(2, 1fr)" gap={8}>
                {[
                  {
                    icon: Clock,
                    title: t('quick_setup_title'),
                    description: t('quick_setup_description')
                  },
                  {
                    icon: Shield,
                    title: t('secure_payments_title'),
                    description: t('secure_payments_description')
                  },
                  {
                    icon: Globe,
                    title: t('reach_customers_title'),
                    description: t('reach_customers_description')
                  },
                  {
                    icon: Heart,
                    title: t('customer_support_title'),
                    description: t('customer_support_description')
                  }
                ].map((item, index) => (
                  <Card
                    key={index}
                    bg={isDark ? 'gray.800' : 'white'}
                    height="full"
                    _hover={{ transform: 'translateY(-5px)' }}
                    transition="all 0.2s"
                  >
                    <CardBody>
                      <VStack spacing={4}>
                        <Box
                          p={3}
                          borderRadius="lg"
                          bg={isDark ? 'blue.900' : 'blue.50'}
                        >
                          <item.icon size={24} color={isDark ? '#90CDF4' : '#2B6CB0'} />
                        </Box>
                        <Heading size="sm" textAlign="center">
                          {item.title}
                        </Heading>
                        <Text color="gray.500" fontSize="sm" textAlign="center">
                          {item.description}
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </Grid>
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
              <Text color="gray.500" fontSize="xl" mt={4}>
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

            <Wrap spacing={4} justify="center" pt={8}>
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
                    bg={isDark ? 'gray.800' : 'gray.100'}
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