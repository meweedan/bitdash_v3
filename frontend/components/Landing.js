import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  Button, 
  useColorMode, 
  Link, 
  Grid,
  Container,
  Flex,
  Spinner,
  chakra,
  Select,
  Badge,
  Center,
  SimpleGrid,
  Circle,
  shouldForwardProp,
  Icon,
  HStack,
  Divider,
  IconButton,
  Image
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { motion, isValidMotionProp, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import PWALanding from './PWALanding';
import { 
  ArrowRight, 
  Users, 
  Clock, 
  CheckCircle,
  TrendingUp, 
  Shield,
  Smartphone,
  Menu as MenuIcon,
  Car,
  Package,
  BarChart3,
  ShoppingCart,
  Coffee,
  ChefHat,
  Bell,
  QrCode,
  ArrowDown,
  ForkKnifeCrossed,
  Scan
} from 'lucide-react';
import { FaWhatsapp,   FaMoneyBillWave, } from 'react-icons/fa';
import Hero from './Hero';

const checkIsPWA = () => {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone ||
    document.referrer.includes('android-app://')
  );
};

const MotionBox = motion(Box);
const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

const ServiceCard = ({ description, delay, image }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <ChakraBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      p={0}  // Changed from p={8}
      borderRadius="2xl"
      boxShadow="xl"
      position="relative"
      overflow="hidden"
      bg={isDark ? 'whiteAlpha.100' : 'white'}
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        bgGradient: 'linear(to-r, #0a60a3, #67bdfd)',
        transform: 'scaleX(0)',
        transition: 'transform 0.3s ease',
      }}
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: '2xl',
        _before: {
          transform: 'scaleX(1)',
        }
      }}
    >
      {/* Image first */}
      {image && (
        <Box
          position="float"
          overflow="hidden"
        >
          <Image
            src={image}
            w="full"
            h="full"
            objectFit="cover"
          />
        </Box>
      )}

      {/* Content below image */}
      <VStack spacing={4} align="start" p={6}>
        <Text
          color={isDark ? 'gray.400' : 'gray.600'}
          lineHeight="tall"
        >
          {description}
        </Text>
      </VStack>
    </ChakraBox>
  );
};

const StepCard = ({ icon: IconComponent, title, content, delay }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <ChakraBox
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      p={6}
      borderRadius="xl"
      boxShadow="lg"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: '2xl',
      }}
    >
      <VStack spacing={4} align="flex-start">
        <HStack spacing={4}>
          <Icon 
            as={IconComponent} 
            boxSize={6} 
            color={isDark ? 'white' : '#0a60a3'} 
          />
        </HStack>
        <Text
          fontWeight="semibold"
          fontSize="lg"
          color={isDark ? 'white' : 'gray.800'}
        >
          {title}
        </Text>
        <Text
          color={isDark ? 'gray.400' : 'gray.600'}
          lineHeight="tall"
        >
          {content}
        </Text>
      </VStack>
    </ChakraBox>
  );
};

export default function Landing() {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const [isPWAMode, setIsPWAMode] = useState(false);
  const router = useRouter();
  const isDark = colorMode === 'dark';
  
  useEffect(() => {
    const handlePWACheck = () => {
      setIsPWAMode(checkIsPWA());
    };

    handlePWACheck();
    window.addEventListener('load', handlePWACheck);
    
    // Check for display-mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addListener(handlePWACheck);

    return () => {
      window.removeEventListener('load', handlePWACheck);
      mediaQuery.removeListener(handlePWACheck);
    };
  }, []);

  if (isPWAMode) {
    return <PWALanding />;
  }

  const PlatformSection = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const { t } = useTranslation();
  const router = useRouter();

  const colorAnimation = keyframes`
    0% { color: #245b84; }    
    14% { color: #36739f; }   
    28% { color: #52a4e1; }   
    42% { color: #67bdfd; }   
    56% { color: #70b4e6; }   
    70% { color: #65a6fa; }   
    85% { color: #6a9ce8; }   
    100% { color: #245b84; }  
  `;

  const platforms = [
    {
      name: "BitCash",
      icon: FaMoneyBillWave,
      description: "Revolutionising Libyan Finances",
      subdomain: "cash.bitdash.app",
      // features: ["Digital Menus", "Order Management", "Advanced Analytics"]
    },
    {
      name: "BitFood",
      icon: FoodIcon,
      description: "Revolutionising ordering + dining process",
      subdomain: "food.bitdash.app",
      // features: ["Digital Menus", "Order Management", "Advanced Analytics"]
    },
    {
      name: "BitShop",
      icon: ShopIcon,
      description: "Shopping never felt so easy",
      subdomain: "shop.bitdash.app",
      // features: ["Digital Menus", "Order Management", "Advanced Analytics"]
    },
    {
      name: "BitRide",
      icon: RideIcon,
      description: "Revolutionising transportation",
      subdomain: "ride.bitdash.app",
      // features: ["Digital Menus", "Order Management", "Advanced Analytics"]
    },
    
  ];

  return (
    <Box py={20} overflow="hidden">
      <Container maxW="container.xl">
        <VStack spacing={20}>
          {platforms.map((platform, idx) => (
            <ChakraBox
              key={platform.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              w="full"
              cursor="pointer"
              onClick={() => window.location.href = `https://${platform.subdomain}`}
            >
              <VStack 
                spacing={6} 
                p={10}
                borderRadius="3xl"
                bg={isDark ? 'whiteAlpha.50' : 'gray.50'}
                _hover={{
                  transform: 'scale(1.02)',
                  transition: 'all 0.3s ease'
                }}
              >
                <HStack spacing={4} align="center">
                  <Icon 
                    as={platform.icon} 
                    boxSize={8}
                    animation={`${colorAnimation} 3s infinite linear`}
                  />
                  <Heading
                    fontSize={{ base: "3xl", md: "4xl" }}
                    fontWeight="bold"
                    animation={`${colorAnimation} 3s infinite linear`}
                  >
                    {platform.name}
                  </Heading>
                </HStack>

                <Text
                  fontSize="xl"
                  color={isDark ? 'gray.300' : 'gray.600'}
                  fontWeight="medium"
                >
                  {platform.description}
                </Text>

                {/* <HStack spacing={4} pt={4}>
                  {platform.features.map((feature, fidx) => (
                    <Badge
                      key={fidx}
                      fontSize="sm"
                      colorScheme="blue"
                      variant="subtle"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {feature}
                    </Badge>
                  ))}
                </HStack> */}

                <Icon 
                  as={ArrowRight} 
                  boxSize={6} 
                  transform="translateX(0)"
                  transition="all 0.3s ease"
                  _groupHover={{
                    transform: "translateX(5px)",
                    opacity: 1
                  }}
                />
              </VStack>
            </ChakraBox>
          ))}
        </VStack>
      </Container>
    </Box>
  );
};

  const steps = [
    { 
      icon: ArrowRight, 
      title: 'Seamless Integration',
      content: 'Deploy in under 24 hours with zero disruption to your operations'
    },
    { 
      icon: TrendingUp, 
      title: 'Immediate ROI',
      content: 'See measurable results in your first month of implementation'
    },
    { 
      icon: Shield, 
      title: 'Enterprise Security',
      content: 'Bank-grade security protecting your business data'
    },
    { 
      icon: Users, 
      title: 'Dedicated Support',
      content: '24/7 enterprise support with a dedicated success manager'
    }
  ];

  return (
    <>
      <Box>
        <Hero />
          <Container maxW="container.xl">
              <VStack spacing={4} textAlign="center">
                <Heading
                  textAlign="center"
                  bgGradient="linear(to-r, #0a60a3, #67bdfd)"
                  bgClip="text"
                  fontSize={{ base: "5xl", md: "5xl" }}
                >
                  {t('heroTitle')}
                </Heading>

                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  color={isDark ? 'gray.400' : 'gray.600'}
                  maxW="xl"
                >
                  {t('ctaDescription')}
                </Text>

              <SimpleGrid spacing={6}>
                <HStack spacing={4}>
                  <Text
                    fontSize="4xl"
                    fontWeight="bold"
                    bgGradient="linear(to-r, #0a60a3, #67bdfd)"
                    bgClip="text"
                  >
                    15%
                  </Text>
                  <Text color={isDark ? 'gray.400' : 'gray.600'}>
                    Average ROI
                  </Text>
                  <Text
                    fontSize="4xl"
                    fontWeight="bold"
                    bgGradient="linear(to-r, #0a60a3, #67bdfd)"
                    bgClip="text"
                  >
                    100+
                  </Text>
                  <Text color={isDark ? 'gray.400' : 'gray.600'}>
                    Enterprise Clients
                  </Text>
                </HStack>
              </SimpleGrid>

              <HStack spacing={4}>
                  <Button
                  leftIcon={<FaWhatsapp />}
                  variant="ghost"
                  colorScheme="blue"
                  onClick={() => {
                    window.open("https://api.whatsapp.com/send?phone=00447538636207", "_blank");
                    onClose();
                  }}
                  size="md"
                >
                  {t('scheduleDemo')}
                </Button>
              </HStack>
            </VStack>
          </Container>

        {/* Solutions Section - Using your ServiceCard component */}
        <Box py={20}>
          <Container maxW="container.xl">
            <PlatformSection />
          </Container>
        </Box>

        {/* Implementation Steps - Using your StepCard component */}
        <Box py={20}>
          <Container maxW="container.xl">
            <VStack spacing={16}>
              <Heading
                textAlign="center"
                bgGradient="linear(to-r, #0a60a3, #67bdfd)"
                bgClip="text"
                fontSize={{ base: "3xl", md: "4xl" }}
              >
                {t('valuesText')}
              </Heading>
              <Grid 
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={8}
                w="full"
              >
                {steps.map((step, idx) => (
                  <StepCard
                    key={idx}
                    number={idx + 1}
                    icon={step.icon}
                    title={step.title}
                    content={step.content}
                    delay={idx * 0.1}
                  />
                ))}
              </Grid>
            </VStack>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box py={20}>
          <Container maxW="container.xl">
            <VStack spacing={8} textAlign="center">
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                bgGradient="linear(to-r, #0a60a3, #67bdfd)"
                bgClip="text"
              >
                {t('giveEdgeCompetitors')}
              </Heading>
              <HStack spacing={4}>
                <Button
                  size="lg"
                  colorScheme="blue"
                  rightIcon={<ArrowRight />}
                  bgGradient="linear(to-r, #0a60a3, #67bdfd)"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'xl',
                  }}
                  onClick={() => router.push('/signup')}
                >
                  {t('heroCTA')}
                </Button>
              </HStack>
              <Text fontSize="md" color={isDark ? 'gray.400' : 'gray.600'}>
                {t('commitmentText')}
              </Text>
            </VStack>
          </Container>
        </Box>
      </Box>
    </>
  );
}