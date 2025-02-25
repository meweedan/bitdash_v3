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
  Utensils,
  ShopIcon,
  RideIcon,
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
  Scan,
  CarFront,
  Briefcase
} from 'lucide-react';
import { FaWhatsapp,   FaMoneyBillWave, } from 'react-icons/fa';
import Hero from './Hero';
import theme from '@/styles/theme';

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

  const platforms = [
  {
    name: t('bitcash.name'),
    icon: FaMoneyBillWave,
    description: t('bitcash.description'),
    subdomain: "cash.bitdash.app",
    color: "brand.bitcash"
  },
  {
    name: t('bitfund.name'),
    icon: Utensils,
    description: t('bitfund.description'),
    subdomain: "fund.bitdash.app",
    color: "brand.bitfund"
  },
  {
    name: t('bitinvest.name'),
    icon: ShoppingCart,
    description: t('bitinvest.description'),
    subdomain: "invest.bitdash.app",
    color: "brand.bitinvest"
  },
  {
    name: t('bittrade.name'),
    icon: CarFront,
    description: t('bittrade.description'),
    subdomain: "trade.bitdash.app",
    color: "brand.bittrade"
  }
];

const colorAnimation = keyframes`
  0% { color: ${theme.colors.brand.bitdash[400]}; }    
  25% { color: ${theme.colors.brand.bitfund[400]}; }   
  50% { color: ${theme.colors.brand.bitinvest[400]}; }   
  75% { color: ${theme.colors.brand.bittrade[400]}; }   
  100% { color: ${theme.colors.brand.bitcash[400]}; }  
`;

return (
    <Box py={20} overflow="hidden">
      <Container maxW="container.xl">
        <VStack spacing={8}>
          {platforms.map((platform, idx) => (
            <ChakraBox
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              w="full"
              cursor="pointer"
              onClick={() => window.location.href = `https://${platform.subdomain}`}
            >
              <Flex
                direction="row"
                align="center"
                p={6}
                borderRadius="2xl"
                bg={isDark ? 'whiteAlpha.50' : 'white'}
                borderWidth="1px"
                borderColor={isDark ? 'whiteAlpha.100' : 'gray.100'}
                transition="all 0.3s ease"
                _hover={{
                  transform: 'translateX(8px)',
                  bg: isDark ? 'whiteAlpha.100' : 'gray.50',
                  borderColor: `${platform.color}.500`,
                  boxShadow: 'xl'
                }}
              >
                <Circle
                  size="48px"
                  bg={`${platform.color}.400`}
                  color={isDark ? 'white' : 'white'}
                  opacity={0.9}
                  mr={6}
                >
                  <Icon as={platform.icon} boxSize={5} />
                </Circle>

                <VStack align="start" spacing={1} flex={1}>
                  <Heading
                    size="md"
                    fontWeight="semibold"
                    letterSpacing="tight"
                  >
                    {platform.name}
                  </Heading>
                  <Text
                    fontSize="sm"
                    color={isDark ? 'gray.400' : 'gray.600'}
                    letterSpacing="tight"
                  >
                    {platform.description}
                  </Text>
                </VStack>

                <Icon
                  as={ArrowRight}
                  boxSize={5}
                  color={isDark ? 'gray.400' : 'gray.600'}
                  opacity={0.5}
                  transition="all 0.3s ease"
                  transform="translateX(-10px)"
                  _groupHover={{
                    transform: "translateX(0)",
                    opacity: 1,
                    color: `${platform.color}.500`
                  }}
                />
              </Flex>
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
  <Box
    bg={isDark ? 'black' : 'white'}
    minH="100vh"
    overflowX="hidden"
  >
    <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
      <VStack spacing={16} py={20}>
        {/* Hero Content */}
        <VStack spacing={8} textAlign="center" maxW="3xl" mx="auto">
          <Heading
            fontSize={{ base: "4xl", md: "6xl" }}
            fontWeight="bold"
            letterSpacing="tight"
            bgGradient="linear(to-r, #0a60a3, #67bdfd)"
            bgClip="text"
            lineHeight="1.2"
          >
            {t('heroTitle')}
          </Heading>

          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            color={isDark ? 'gray.400' : 'gray.600'}
            maxW="2xl"
            lineHeight="tall"
          >
            {t('ctaDescription')}
          </Text>

          <HStack spacing={8} pt={4}>
            <Text
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              letterSpacing="tight"
            >
              <Text
                as="span"
                bgGradient="linear(to-r, #0a60a3, #67bdfd)"
                bgClip="text"
              >
                15%
              </Text>
              <Text
                as="span"
                fontSize="lg"
                color={isDark ? 'gray.400' : 'gray.600'}
                ml={2}
              >
                {t('stats.averageRoi')}
              </Text>
            </Text>

            <Text
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              letterSpacing="tight"
            >
              <Text
                as="span"
                bgGradient="linear(to-r, #0a60a3, #67bdfd)"
                bgClip="text"
              >
                100+
              </Text>
              <Text
                as="span"
                fontSize="lg"
                color={isDark ? 'gray.400' : 'gray.600'}
                ml={2}
              >
                {t('stats.enterpriseClients')}
              </Text>
            </Text>
          </HStack>

          <Button
            leftIcon={<FaWhatsapp />}
            size="lg"
            variant="bitdash-solid"
            px={8}
            height="60px"
            fontSize="lg"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg'
            }}
            onClick={() => window.open("https://api.whatsapp.com/send?phone=00447538636207", "_blank")}
          >
            {t('scheduleDemo')}
          </Button>
        </VStack>
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