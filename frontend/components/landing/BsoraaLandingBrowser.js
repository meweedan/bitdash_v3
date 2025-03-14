import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  Badge,
  useColorMode,
  Grid,
  GridItem,
  Divider,
  Image,
  List,
  ListItem,
  ListIcon,
  Circle,
  Link,
  Wrap,
  WrapItem,
  useBreakpointValue,
  Center
} from '@chakra-ui/react';
import { 
  FaUtensils,
  FaShoppingBasket,
  FaMobileAlt,
  FaLock,
  FaTruck,
  FaUserFriends,
  FaQrcode,
  FaCheckCircle,
  FaStore,
  FaHeadset,
  FaWhatsapp,
  FaWallet,
  FaHandHoldingHeart,
  FaClock,
  FaApple,
  FaAndroid
} from 'react-icons/fa';
import { 
  ArrowRight, 
  CheckCircle, 
  Download,
  ExternalLink,
  Shield,
  MapPin,
  Clock,
  Truck
} from 'lucide-react';

const DeliveryLandingPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const containerRef = useRef(null);
  const MotionBox = motion(Box);
  const { locale } = router;
  const isRTL = locale === 'ar';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  // For responsive design
  const isMobile = useBreakpointValue({ base: true, md: false });
  const heroImageSize = useBreakpointValue({ base: "100%", md: "90%" });
  const headingSize = useBreakpointValue({ base: "4xl", md: "5xl", lg: "6xl" });
  const glassCardBg = useColorModeValue('whiteAlpha.900', 'whiteAlpha.400');
  const headingColor = useColorModeValue('brand.bsoraa.700', 'brand.bsoraa.400');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const accentColor = '#ff914d'; // Primary orange color for Bsoraa

  // Parallax component
  const ParallaxBox = ({ children, offset = 100, ...rest }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "end start"]
    });
    
    const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
    
    return (
      <MotionBox
        ref={ref}
        style={{ y }}
        {...rest}
      >
        {children}
      </MotionBox>
    );
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  // Main service offerings
  const serviceOfferings = [
    {
      icon: FaUtensils,
      title: t('services.food.title', 'Food Delivery'),
      description: t('services.food.description', 'Order from your favorite restaurants and get hot, fresh meals delivered to your doorstep in minutes'),
      highlights: [
        t('services.food.highlight1', 'Thousands of restaurant options'), 
        t('services.food.highlight2', 'Real-time order tracking'), 
        t('services.food.highlight3', 'Contactless delivery available')
      ],
      color: accentColor,
      image: '/images/food-delivery.png'
    },
    {
      icon: FaShoppingBasket,
      title: t('services.grocery.title', 'Grocery Delivery'),
      description: t('services.grocery.description', 'Shop for fresh produce, pantry essentials, and household items with same-day delivery'),
      highlights: [
        t('services.grocery.highlight1', 'Fresh and quality products'), 
        t('services.grocery.highlight2', 'Wide selection of stores'), 
        t('services.grocery.highlight3', 'Scheduled delivery options')
      ],
      color: accentColor,
      image: '/images/grocery-delivery.png'
    },
    {
      icon: FaQrcode,
      title: t('services.qrorder.title', 'QR Table Ordering'),
      description: t('services.qrorder.description', 'Scan, order, and pay directly from your table at participating restaurants'),
      highlights: [
        t('services.qrorder.highlight1', 'No app download required'), 
        t('services.qrorder.highlight2', 'Contactless ordering experience'), 
        t('services.qrorder.highlight3', 'Integrated payment solutions')
      ],
      color: accentColor,
      image: '/images/qr-ordering.png'
    },
    {
      icon: FaStore,
      title: t('services.retail.title', 'Retail Items'),
      description: t('services.retail.description', 'Shop electronics, essentials, gifts and more from local stores with fast delivery'),
      highlights: [
        t('services.retail.highlight1', 'Wide variety of products'), 
        t('services.retail.highlight2', 'Local store partnerships'), 
        t('services.retail.highlight3', 'Same-day delivery options')
      ],
      color: accentColor,
      image: '/images/retail-delivery.png'
    }
  ];

  // Platform features
  const platformFeatures = [
    {
      icon: FaLock,
      title: t('platform.features.security.title', 'Secure Payments'),
      description: t('platform.features.security.description', 'Multiple secure payment options with encrypted transactions'),
      color: accentColor,
      image: '/images/secure-payment.png'
    },
    {
      icon: FaTruck,
      title: t('platform.features.delivery.title', 'Fast Delivery'),
      description: t('platform.features.delivery.description', 'Optimized routes ensure your orders arrive quickly and efficiently'),
      color: accentColor,
      image: '/images/fast-delivery.png'
    },
    {
      icon: FaMobileAlt,
      title: t('platform.features.mobile.title', 'User-Friendly App'),
      description: t('platform.features.mobile.description', 'Intuitive mobile experience for browsing and ordering on the go'),
      color: accentColor,
      image: '/images/mobile-app.png'
    },
    {
      icon: FaHeadset,
      title: t('platform.features.support.title', '24/7 Support'),
      description: t('platform.features.support.description', 'Customer service available around the clock to assist with any issues'),
      color: accentColor,
      image: '/images/customer-support.png'
    }
  ];

  // Partner benefits
  const partnerBenefits = [
    {
      icon: FaStore,
      title: t('partners.benefits.visibility.title', 'Increased Visibility'),
      description: t('partners.benefits.visibility.description', 'Reach new customers and expand your market presence through our platform')
    },
    {
      icon: FaWallet,
      title: t('partners.benefits.revenue.title', 'New Revenue Streams'),
      description: t('partners.benefits.revenue.description', 'Boost sales with delivery and takeout options without additional overhead')
    },
    {
      icon: FaQrcode,
      title: t('partners.benefits.qr.title', 'QR Table Ordering'),
      description: t('partners.benefits.qr.description', 'Streamline in-restaurant service with our contactless ordering system')
    },
    {
      icon: FaUserFriends,
      title: t('partners.benefits.customers.title', 'Customer Insights'),
      description: t('partners.benefits.customers.description', 'Access valuable data on ordering patterns and customer preferences')
    }
  ];

  // Customer types
  const customerTypes = [
    {
      name: t('customers.individual.title', 'Individual'),
      description: t('customers.individual.description', 'Perfect for personal food and grocery deliveries'),
      features: [
        t('customers.individual.feature1', 'No minimum order'), 
        t('customers.individual.feature2', 'Fast delivery'), 
        t('customers.individual.feature3', 'Personalized recommendations')
      ],
      color: accentColor
    },
    {
      name: t('customers.family.title', 'Family'),
      description: t('customers.family.description', 'Great for households with regular grocery and meal needs'),
      features: [
        t('customers.family.feature1', 'Family meal deals'), 
        t('customers.family.feature2', 'Scheduled weekly deliveries'), 
        t('customers.family.feature3', 'Special discounts')
      ],
      color: accentColor,
      popular: true
    },
    {
      name: t('customers.business.title', 'Business'),
      description: t('customers.business.description', 'Tailored solutions for offices and corporate events'),
      features: [
        t('customers.business.feature1', 'Bulk ordering options'), 
        t('customers.business.feature2', 'Corporate accounts'), 
        t('customers.business.feature3', 'Catering services')
      ],
      color: accentColor
    }
  ];

  // Feature highlights with images
  const featureHighlights = [
    {
      title: t('highlights.delivery.title', 'Free Delivery'),
      description: t('highlights.delivery.description', 'On your first three orders'),
      image: '/images/free-delivery.png'
    },
    {
      title: t('highlights.products.title', '10,000+ Items'),
      description: t('highlights.products.description', 'From local and chain stores'),
      image: '/images/many-products.png'
    },
    {
      title: t('highlights.time.title', '30-Minute Delivery'),
      description: t('highlights.time.description', 'For nearby restaurants and stores'),
      image: '/images/fast-time.png'
    }
  ];

  // Service features
  const serviceFeatures = [
    {
      icon: Truck,
      title: t('features.tracking.title', 'Real-Time Tracking'),
      description: t('features.tracking.description', 'Follow your delivery from store to door with live GPS tracking')
    },
    {
      icon: Shield,
      title: t('features.contactless.title', 'Contactless Delivery'),
      description: t('features.contactless.description', 'Options for safe, contactless drop-off at your preferred location')
    },
    {
      icon: MapPin,
      title: t('features.local.title', 'Local Businesses'),
      description: t('features.local.description', 'Support your community by ordering from local shops and restaurants')
    },
    {
      icon: Clock,
      title: t('features.scheduled.title', 'Scheduled Orders'),
      description: t('features.scheduled.description', 'Plan ahead with scheduled deliveries for your convenience')
    }
  ];

  // Steps to start using
  const serviceSteps = [
    {
      number: "1",
      title: t('steps.step1.title', 'Download'),
      description: t('steps.step1.description', 'Get our app on iOS or Android and create an account')
    },
    {
      number: "2",
      title: t('steps.step2.title', 'Browse & Order'),
      description: t('steps.step2.description', 'Select from thousands of restaurants, grocery stores, and retail shops')
    },
    {
      number: "3",
      title: t('steps.step3.title', 'Enjoy'),
      description: t('steps.step3.description', 'Track your order and receive it at your doorstep')
    }
  ];

  return (
  <Box ref={containerRef} dir={isRTL ? 'rtl' : 'ltr'}>
    {/* Hero Section */}
    <Box 
        as="section" 
        position="relative"
        p={{ base: 18, md: 20 }}
      >
        {/* Background elements */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex={0}
          overflow="hidden"
        >
          {/* Background pattern */}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            opacity={0.05}
            bgImage="url('/images/pattern-dots.png')"
            bgSize="30px"
          />
          
          {/* Illustration elements */}
          <Box
            position="absolute"
            bottom="0"
            right="0"
            width={{ base: "80%", md: "50%" }}
            height="90%"
            opacity={0.8}
            zIndex={1}
          >
            <Image 
              src="/images/delivery-illustration.png"
              alt="Delivery illustration"
              width="100%"
              height="100%"
              objectFit="contain"
              objectPosition="bottom right"
            />
          </Box>
        </Box>

        <Container maxW="container.xl" position="relative" zIndex="2">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 1, lg: 10 }} alignItems="center" mt={{ base: 18, md: 20 }}>
            <GridItem>
              <MotionBox
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <VStack spacing={6} align="flex-start">
                  <Heading
                    as="h1"
                    fontSize={headingSize}
                    fontWeight="bold"
                    lineHeight="1.2"
                    color={isDark ? "white" : "gray.800"}
                  >
                    {t('hero.title', 'Your One-Stop Delivery Solution')}
                  </Heading>
                  
                  <Text
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="medium"
                    maxW="550px"
                    color={isDark ? "gray.300" : "gray.600"}
                  >
                    {t('hero.description', 'From restaurant meals to groceries and retail items, Bsoraa delivers it all to your doorstep. Fast, reliable, and contactless.')}
                  </Text>
                  
                  <HStack spacing={4} pt={2}>
                    <Button
                      size="lg"
                      variant="bsoraa-outline"
                      onClick={() => router.push('/signup')}
                    >
                      {t('hero.get_started', 'Get Started')}
                    </Button>
                    
                    <Button
                      variant="bsoraa-outline"
                      borderColor={accentColor}
                      color={accentColor}
                      size="lg"
                      leftIcon={<Download />}
                      onClick={() => router.push('/download')}
                    >
                      {t('hero.download_app', 'Download App')}
                    </Button>
                  </HStack>
                </VStack>
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Feature Highlights */}
      <Box py={10}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {featureHighlights.map((feature, idx) => (
              <Box
                key={idx}
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                height="100%"
                _hover={{
                  transform: 'translateY(-5px)',
                  boxShadow: 'lg'
                }}
                transition="all 0.3s ease"
              >
                <Grid 
                  templateColumns="120px 1fr"
                  gap={4}
                  p={4}
                  alignItems="center"
                >
                  <Center>
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      maxH="80px"
                      objectFit="contain"
                    />
                  </Center>
                  <Box>
                    <Heading size="md" mb={1} color={accentColor}>
                      {feature.title}
                    </Heading>
                    <Text fontSize="sm" color={textColor}>
                      {feature.description}
                    </Text>
                  </Box>
                </Grid>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Container maxW="container.xl" pt={{ base: 10, md: 20 }}>
        {/* Service Features Section */}
        <Box as="section" position="relative">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 10, lg: 16 }} alignItems="center">
            <GridItem order={{ base: 2, lg: 1 }}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                {/* Feature Cards */}
                {serviceFeatures.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    delay={index * 0.1}
                  />
                ))}
              </SimpleGrid>
            </GridItem>
            
            <GridItem order={{ base: 1, lg: 2 }}>
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <VStack align={{ base: "center", lg: "flex-start" }} textAlign={{ base: "center", lg: "left" }}>
                  <Image 
                    src="/images/delivery-app-screen.png" 
                    alt={t('features.image.alt', 'Delivery App Screenshot')}
                    width={{ base: "300px", md: "400px" }}
                    as={motion.img}
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  />        
                </VStack>
              </MotionBox>
            </GridItem>
          </Grid>
        </Box>
        
        {/* Main Services Showcase */}
        <Box mb={24} pt={{ base: 10, md: 20 }}>
          <Heading
            textAlign="center"
            mb={6}
            fontSize={{ base: '3xl', md: '4xl' }}
            color={accentColor}
          >
            {t('services.title', 'Our Services')}
          </Heading>
          
          <Text
            textAlign="center"
            mb={12}
            fontSize={{ base: 'md', md: 'lg' }}
            color={textColor}
            maxW="800px"
            mx="auto"
          >
            {t('services.description', 'From fresh meals to groceries and everyday essentials, Bsoraa delivers everything you need with speed and reliability.')}
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mb={16}>
            {serviceOfferings.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Box
                  p={8}
                  h="full"
                  bg={glassCardBg}
                  borderRadius="xl"
                  borderColor={service.color}
                  borderWidth={2}
                  _hover={{
                    transform: 'translateY(-5px)',
                    boxShadow: 'xl'
                  }}
                  transition="all 0.3s ease"
                >
                  <VStack align="center" spacing={6}>
                    <Icon as={service.icon} boxSize={10} color={accentColor} />
                    <Heading size="md" color={service.color} textAlign="center">
                      {service.title}
                    </Heading>
                    <Text textAlign="center" fontSize="sm">
                      {service.description}
                    </Text>
                    <List spacing={2} alignSelf="flex-start">
                      {service.highlights.map((highlight, idx) => (
                        <ListItem key={idx} display="flex" alignItems="flex-start">
                          <ListIcon as={CheckCircle} color={accentColor} mt={1} />
                          <Text fontSize="sm">{highlight}</Text>
                        </ListItem>
                      ))}
                    </List>
                  </VStack>
                </Box>
              </motion.div>
            ))}
          </SimpleGrid>
        </Box>
        
        {/* QR Ordering Section */}
        <Box as="section" py={{ base: 16, md: 24 }} position="relative" zIndex={1}>
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 10, lg: 16 }} alignItems="center">
            <GridItem>
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <VStack spacing={6} align={{ base: "center", lg: "flex-start" }} textAlign={{ base: "center", lg: "left" }}>
                  <Heading
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight="bold"
                    color={accentColor}
                  >
                    {t('qr.title', 'QR Table Ordering')}
                  </Heading>
                  
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color={textColor}
                    maxW="600px"
                  >
                    {t('qr.subtitle', 'A contactless dining experience that revolutionizes how customers order in restaurants')}
                  </Text>
                  
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color={textColor}
                    maxW="600px"
                  >
                    {t('qr.description', 'Customers scan a QR code at their table to view the menu, place orders, and pay directly from their phones. No app download required, just a seamless web experience that enhances dining for everyone.')}
                  </Text>
                  
                  <Button
                  variant="bsoraa-outline"
                    size="lg"
                    rightIcon={<ArrowRight />}
                    onClick={() => router.push('/qr-ordering')}
                  >
                    {t('qr.learn_more', 'Learn More')}
                  </Button>
                </VStack>
              </MotionBox>
            </GridItem>
            
            <GridItem>
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={scaleUp}
              >
                <Image 
                  src="/images/qr-ordering-screen.png" 
                  alt={t('qr.imageAlt', 'QR Ordering System')}
                  width="100%"
                />
              </MotionBox>
            </GridItem>
          </Grid>
        </Box>
        
        {/* Platform Features */}
        <Box mb={24}>
          <Heading
            textAlign="center"
            mb={12}
            fontSize={{ base: '3xl', md: '4xl' }}
            color={accentColor}
          >
            {t('platform.title', 'Why Choose Bsoraa')}
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mb={16}>
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
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
                  <VStack align="center" spacing={6}>
                    <Image 
                      src={feature.image}
                      alt={feature.title}
                      height="80px"
                      objectFit="contain"
                    />
                    <Heading size="md" color={feature.color} textAlign="center">
                      {feature.title}
                    </Heading>
                    <Text textAlign="center">
                      {feature.description}
                    </Text>
                  </VStack>
                </Box>
              </motion.div>
            ))}
          </SimpleGrid>
        </Box>
        
        {/* Become a Partner Section */}
        <Box mb={24}>
          <Heading
            textAlign="center"
            mb={12}
            fontSize={{ base: '3xl', md: '4xl' }}
            color={accentColor}
          >
            {t('partners.title', 'Partner With Bsoraa')}
          </Heading>
          
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={16} alignItems="center">
            <GridItem order={{ base: 2, lg: 1 }}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                {partnerBenefits.map((benefit, idx) => (
                  <PartnerBenefitCard
                    key={idx}
                    icon={benefit.icon}
                    title={benefit.title}
                    description={benefit.description}
                    delay={idx * 0.1}
                  />
                ))}
              </SimpleGrid>
            </GridItem>
            
            <GridItem order={{ base: 1, lg: 2 }}>
              <VStack spacing={6} align={{ base: "center", lg: "flex-start" }} textAlign={{ base: "center", lg: "left" }}>
                <Heading
                  fontSize={{ base: "2xl", md: "3xl" }}
                  color={accentColor}
                >
                  {t('partners.subtitle', 'Grow Your Business With Us')}
                </Heading>
                <Text fontSize="lg" color={textColor}>
                  {t('partners.description1', 'Join our network of restaurants, grocery stores, and retailers to reach more customers and increase your revenue.')}
                </Text>
                <Text fontSize="lg" color={textColor}>
                  {t('partners.description2', 'Our platform provides the technology, logistics, and customer base to help your business thrive in the digital marketplace.')}
                </Text>
                <Button
                variant="bsoraa-outline"
                  _hover={{ bg: "#E86C00" }}
                  px={8}
                  size="lg"
                  onClick={() => router.push('/become-partner')}
                >
                  {t('partners.register', 'Register Your Business')}
                </Button>
              </VStack>
            </GridItem>
          </Grid>
        </Box>

        {/* Customer Types Section */}
        <Box mb={24}>
          <Heading
            textAlign="center"
            mb={6}
            fontSize={{ base: '3xl', md: '4xl' }}
            color={accentColor}
          >
            {t('customers.title', 'Solutions For Everyone')}
          </Heading>
          
          <Text
            textAlign="center"
            mb={12}
            fontSize={{ base: 'md', md: 'lg' }}
            color={textColor}
            maxW="800px"
            mx="auto"
          >
            {t('customers.description', 'Whether you\'re ordering for yourself, your family, or your business, we have tailored solutions to meet your needs.')}
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {customerTypes.map((type, index) => (
              <Box
                key={index}
                position="relative"
                borderRadius="xl"
                overflow="hidden"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                p={6}
                _hover={{
                  transform: 'translateY(-5px)',
                  boxShadow: 'xl'
                }}
                transition="all 0.3s ease"
              >
                {type.popular && (
                  <Badge
                    position="absolute"
                    top={0}
                    right={0}
                    m={4}
                    px={3}
                    py={1}
                    colorScheme="orange"
                    borderRadius="full"
                    textTransform="uppercase"
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    {t('customers.popular', 'Popular')}
                  </Badge>
                )}
                
                <VStack spacing={4} align="flex-start">
                  <Heading size="md" color={type.color}>{type.name}</Heading>
                  <Text fontSize="sm" color={textColor}>{type.description}</Text>
                  
                  <Divider />
                  
                  <List spacing={3} w="full">
                    {type.features.map((feature, idx) => (
                      <ListItem key={idx} display="flex">
                        <ListIcon as={FaCheckCircle} color={accentColor} mt={1} />
                        <Text fontSize="sm">{feature}</Text>
                      </ListItem>
                    ))}
                  </List>
                  
                  <Button
                    mt={4}
                    w="full"
                    colorScheme={type.popular ? "orange" : "gray"}
                    variant={type.popular ? "solid" : "outline"}
                    onClick={() => router.push(`/signup?plan=${type.name.toLowerCase()}`)}
                  >
                    {t('customers.select', 'Select')}
                  </Button>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Mobile App Section */}
        <Box mt={24}>
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} 
                alignItems="center" 
                gap={{ base: 8, lg: 12 }}>
            <GridItem>
              <VStack align={{ base: "center", lg: "flex-start" }} 
                      spacing={{ base: 4, md: 8 }} 
                      textAlign={{ base: "center", lg: "left" }}
                      px={{ base: 4, lg: 8 }}>
                <Heading
                  fontSize={{ base: "xl", md: "3xl" }}
                  fontWeight="bold"
                  color={accentColor}
                >
                  {t('mobileApp.title', 'DOWNLOAD BSORAA APP')}
                </Heading>
                                    
                <Text
                  fontSize={{ base: "sm", md: "lg" }}
                  color={textColor}
                  fontWeight="bold"
                >
                  {t('mobileApp.subtitle', 'YOUR FAVORITE FOOD AND ESSENTIALS, ONE TAP AWAY.')}
                </Text>

                <Text fontSize={{ base: "sm", md: "lg" }} color={textColor}>
                  {t('mobileApp.description', 'Browse restaurants and stores, track your orders in real-time, and enjoy exclusive mobile-only deals and discounts. Get everything you need delivered with just a few taps.')}
                </Text>

                <HStack spacing={4} mt={{ base: 2, md: 4 }} zIndex={1}>
                  <Link
                  onClick={() => {
                      router.push("https://apps.apple.com/app");
                      }}
                  >
                  <Image 
                    src="/images/app-store.png" 
                    alt="App Store" 
                    height={{ base: "40px", md: "50px" }}
                    cursor="pointer"
                    transition="transform 0.3s ease"
                    _hover={{ transform: "scale(1.05)" }}
                  />
                  </Link>
                  <Link
                  onClick={() => {
                      router.push("https://play.google.com/store/apps");
                      }}
                  >
                  <Image 
                    src="/images/google-play.png" 
                    alt="Google Play" 
                    height={{ base: "40px", md: "50px" }}
                    cursor="pointer"
                    transition="transform 0.3s ease"
                    _hover={{ transform: "scale(1.05)" }}
                  />
                  </Link>
                </HStack>
              </VStack>
            </GridItem>
                            
            <GridItem display="flex" justifyContent={{ base: "center", lg: "flex-end" }}>
              <Box 
                position="relative"
                height={{ base: "auto", md: "500px", lg: "600px" }}
                width={{ base: "auto", md: "auto" }}
                maxWidth={{ base: "300px", md: "300px", lg: "320px" }}
                overflow="hidden"
                borderRadius="xl"
                boxShadow="2xl"
                my={{ base: 8, lg: 0 }}
                zIndex={1}
              >
                <Image 
                  src="/images/app-screen.png" 
                  alt={t('mobileApp.imageAlt', 'Mobile App Screenshot')}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  objectPosition="center"
                />
              </Box>
            </GridItem>
          </Grid>
        </Box>

        {/* Steps to Start Section */}
        <Box mb={24}>
          <VStack spacing={16}>
              <Text 
                color={accentColor} 
                fontWeight="bold" 
                mb={3}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {t('steps.subtitle', 'Getting Started')}
              </Text>
              
              <Heading
                fontWeight="bold"
                color={isDark ? "white" : "gray.800"}
                mb={5}
              >
                {t('steps.title', 'Start Using Bsoraa in 3 Simple Steps')}
              </Heading>
              
              <Text
                color={textColor}
                textAlign="center"
                maxW="800px"
              >
                {t('steps.description', 'It\'s easy to get started with Bsoraa. Just follow these simple steps and you\'ll be enjoying delicious food and convenient deliveries in no time.')}
              </Text>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} width="full">
              {serviceSteps.map((step, index) => (
                <StepCard
                  key={index}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </SimpleGrid>
            
            <Button
            variant="bsoraa-outline"
              onClick={() => router.push('/signup')}
              rightIcon={<ArrowRight />}
              size="lg"
              px={8}
            >
              {t('steps.cta', 'Download Our App Now')}
            </Button>
          </VStack>
        </Box>
                
        {/* CTA Section */}
        <Box as="section" py={{ base: 16, md: 24 }}>
          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Flex
              direction="column"
              align="center"
              textAlign="center"
              py={{ base: 10, md: 16 }}
              px={{ base: 6, md: 10 }}
              color={isDark ? "white" : "gray.800"}
              position="relative"
              overflow="hidden"
            >
              {/* Decorative top border */}
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                height="6px"
                bg={accentColor}
              />
              
              <VStack spacing={8} maxW="3xl" position="relative" zIndex="1">
                <Text 
                  color={accentColor} 
                  fontWeight="bold" 
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  {t('cta.subtitle', 'Ready to Order?')}
                </Text>
                
                <Heading
                  fontSize={{ base: "3xl", md: "4xl" }}
                  fontWeight="bold"
                  color={isDark ? "white" : "gray.800"}
                >
                  {t('cta.title', 'Delicious Food & Essential Items at Your Doorstep')}
                </Heading>
                
                <Text 
                  fontSize="lg" 
                  color={textColor}
                  maxW="2xl"
                >
                  {t('cta.description', 'Join thousands of satisfied customers who trust Bsoraa for all their delivery needs. Download our app today and experience the convenience.')}
                </Text>
                
                <HStack spacing={6} pt={4} wrap="wrap" justify="center">
                  <Button
                    bg={accentColor}
                    color="white"
                    variant="bsoraa-outline"
                    _hover={{ bg: "#E86C00" }}
                    size="lg"
                    px={8}
                    rightIcon={<ArrowRight />}
                    onClick={() => router.push('/signup')}
                  >
                    {t('cta.primaryButton', 'Create Your Account')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    borderColor={accentColor}
                    color={accentColor}
                    _hover={{ borderColor: "#E86C00", color: "#E86C00" }}
                    size="lg"
                    px={8}
                    leftIcon={<FaWhatsapp />}
                    onClick={() => window.open("https://api.whatsapp.com/send?phone=YOURNUMBERHERE", "_blank")}
                  >
                    {t('cta.secondaryButton', 'Contact Support')}
                  </Button>
                </HStack>
              </VStack>
            </Flex>
          </MotionBox>
        </Box>
      </Container>

      {/* Footer Legal Notices */}
      <Box 
        as="section" 
        py={10} 
        borderTop="1px solid"
        borderColor={isDark ? "gray.700" : "gray.200"}
      >
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            <Heading size="md" color={accentColor}>
              {t('legal.title', 'Bsoraa')}
            </Heading>
            
            <Text fontSize="sm" color={textColor} lineHeight="tall">
              {t('legal.description', 'Bsoraa is a comprehensive food and grocery delivery platform that also offers retail item delivery and QR table ordering services. Our mission is to make life more convenient by bringing your favorite meals, essential groceries, and everyday items straight to your doorstep.')}
            </Text>
            
            <Divider borderColor={isDark ? "gray.700" : "gray.200"} />
            
            <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8}>
              <GridItem>
                <VStack align="flex-start" spacing={4}>
                  <Heading size="sm" color={isDark ? "white" : "gray.800"}>
                    {t('legal.coverage.title', 'Service Coverage')}
                  </Heading>
                  
                  <Text fontSize="sm" color={textColor} lineHeight="tall">
                    {t('legal.coverage.content', 'Currently available in select cities with plans for rapid expansion. Check our app to see if delivery is available in your area. New locations added regularly.')}
                  </Text>
                </VStack>
              </GridItem>
              
              <GridItem>
                <VStack align="flex-start" spacing={4}>
                  <Heading size="sm" color={isDark ? "white" : "gray.800"}>
                    {t('legal.hours.title', 'Operating Hours')}
                  </Heading>
                  
                  <Text fontSize="sm" color={textColor} lineHeight="tall">
                    {t('legal.hours.content', 'Most services available 24/7, though individual restaurant and store hours may vary. QR ordering available during restaurant operating hours.')}
                  </Text>
                </VStack>
              </GridItem>
            </Grid>
            
            <Wrap spacing={4}>
              {[
                'legal.links.privacy',
                'legal.links.terms',
                'legal.links.about',
                'legal.links.careers',
                'legal.links.help',
                'legal.links.contact'
              ].map((key, idx) => (
                <WrapItem key={idx}>
                  <Link 
                    href={`/${t(key).toLowerCase().replace(/\s+/g, '-')}`}
                    fontSize="xs"
                    color={textColor}
                    _hover={{ color: accentColor }}
                    zIndex={1}
                  >
                    {t(key)}
                  </Link>
                </WrapItem>
              ))}
            </Wrap>
            
            <Text fontSize="xs" color={textColor} textAlign="center" mt={4}>
              {t('legal.copyright', '© 2025 Bsoraa. All rights reserved.')}
            </Text>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

// Component for Feature Cards
const FeatureCard = ({ icon, title, description, delay }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const accentColor = '#FF7D1A';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Flex
        direction="column"
        p={6}
        borderRadius="lg"
        boxShadow="md"
        height="full"
        bg={isDark ? "gray.700" : "white"}
        transition="all 0.3s"
        _hover={{
          transform: 'translateY(-5px)',
          boxShadow: 'lg'
        }}
      >
        <Circle
          size="40px"
          bg={accentColor}
          color="white"
          mb={4}
        >
          <Icon as={icon} boxSize={4} />
        </Circle>
        
        <Heading as="h3" size="sm" mb={3} fontWeight="bold">
          {title}
        </Heading>
        
        <Text fontSize="sm" color={isDark ? "gray.300" : "gray.600"}>
          {description}
        </Text>
      </Flex>
    </motion.div>
  );
};

// Component for Partner Benefit Cards
const PartnerBenefitCard = ({ icon, title, description, delay }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const accentColor = '#FF7D1A';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Flex
        direction="column"
        p={6}
        borderRadius="lg"
        boxShadow="md"
        height="full"
        bg={isDark ? "gray.700" : "white"}
        transition="all 0.3s"
        _hover={{
          transform: 'translateY(-5px)',
          boxShadow: 'lg'
        }}
      >
        <Circle
          size="50px"
          bg={accentColor}
          color="white"
          mb={4}
        >
          <Icon as={icon} boxSize={5} />
        </Circle>
        
        <Heading as="h3" size="md" mb={3} fontWeight="bold">
          {title}
        </Heading>
        
        <Text fontSize="sm" color={isDark ? "gray.300" : "gray.600"}>
          {description}
        </Text>
      </Flex>
    </motion.div>
  );
};

// Component for Step Cards
const StepCard = ({ number, title, description, delay }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const accentColor = '#FF7D1A';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <VStack spacing={6} align="center" textAlign="center">
        <Flex
          alignItems="center"
          justifyContent="center"
          w="100px"
          h="100px"
          borderRadius="full"
          boxShadow="xl"
          position="relative"
          bg={isDark ? "gray.800" : "white"}
          _after={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: "full",
            border: "2px dashed",
            borderColor: accentColor,
            opacity: 0.5,
            transform: "scale(1.1)"
          }}
        >
          <Text
            fontSize="4xl"
            fontWeight="bold"
            color={accentColor}
          >
            {number}
          </Text>
        </Flex>
        
        <Heading size="md" textAlign="center">{title}</Heading>
        
        <Text textAlign="center" color={isDark ? "gray.300" : "gray.600"}>
          {description}
        </Text>
      </VStack>
    </motion.div>
  );
};

export default DeliveryLandingPage;