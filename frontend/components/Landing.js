import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  Button, 
  useColorMode, 
  Container,
  Flex,
  Circle,
  Icon,
  HStack,
  Grid,
  GridItem,
  SimpleGrid,
  Image,
  Divider,
  Center,
  Badge,
  useBreakpointValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link
} from '@chakra-ui/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import PWALanding from './PWALanding';
import { 
  ArrowRight, 
  Users, 
  CheckCircle,
  Shield,
  Globe,
  CreditCard,
  Key,
  LineChart,
  BarChart2,
  TrendingUp,
  Layers,
  Clock,
  Award,
  Lock,
  Database,
  Server,
  Terminal,
  ChevronRight,
  ArrowRightCircle,
  Zap,
  BookOpen,
  Info,
  DollarSign,
  PlayCircle,
  Download,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { FaWhatsapp, FaRegFile, FaRegCreditCard, FaHandHoldingUsd, FaBalanceScale, FaFileContract, FaMosque, FaChartLine, FaExchangeAlt, FaUniversity, FaShieldAlt, FaChevronRight, FaBitcoin, FaDollarSign, FaChartBar, FaCoins, FaUser } from 'react-icons/fa';

const checkIsPWA = () => {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone ||
    document.referrer.includes('android-app://')
  );
};

const MotionBox = motion(Box);
const ChakraBox = motion(Box);

// Custom parallax component
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

const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};


// Fade in animation variant
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
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

  // Main Hero Section
  // Updated HeroSection with i18n
const HeroSection = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const parallaxOffset = useBreakpointValue({ base: 30, md: 100 });
  
  return (
    <Box 
      as="section" 
      position="relative"
      pt={{ base: 18, md: 20 }}
      pb={{ base: 32, md: 48 }}
      overflow="hidden"
    >
      {/* Background image */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
      >
        <Image
          src="/images/background-image.png"
          alt={t('alt.backgroundImage')}
          width="100%"
          opacity="0.75"
          height="100%"
          objectFit="cover"
          objectPosition="center"
        />
      </Box>
      <Image
        src="/images/ldn-skyline.png"
        position="absolute"
        alt={t('alt.londonSkyline')}
        opacity="0.25"
        width="100%"
        zIndex={1}
        height="100%"
        objectFit="cover"
        objectPosition="center"
      />
      {/* Hero content */}
      <Container maxW="container.xl" position="relative" zIndex="2">
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 12, lg: 18 }} alignItems="center">
          <GridItem>
            <MotionBox
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <VStack spacing={8} align="flex-start">
                <Heading
                  as="h1"
                  fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                  fontWeight="bold"
                  color="brand.bitdash.700"
                >
                  {t('hero.title')}
                </Heading>
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  color={isDark ? "brand.bitdash.400" : "brand.bitdash.700"}
                >
                  {t('hero.subtitle')}
                </Text>
                <HStack spacing={4} pt={4}>
                  <Button
                    bg="#8b7966"
                    color="white"
                    _hover={{ bg: "#9c7c63" }}
                    size="lg"
                    onClick={() => router.push('/signup')}
                  >
                    {t('hero.getStarted')}
                  </Button>
                  <Button
                    variant="outline"
                    borderColor="#8b7966"
                    color="#8b7966"
                    size="lg"
                    onClick={() => router.push('/demo')}
                  >
                    {t('hero.learnMore')}
                  </Button>
                </HStack>
              </VStack>
            </MotionBox>
          </GridItem>
          
          <GridItem display={{ base: "block", lg: "block" }}>
            <ParallaxBox offset={parallaxOffset}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                position="relative"
              >
                <Image 
                  src="/images/trading-banner.png" 
                  alt={t('alt.tradingPlatform')}
                  borderRadius="xl"
                  width="full"
                />
              </MotionBox>
            </ParallaxBox>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};
  
  // MT5 Platform Section
  const MT5PlatformSection = () => {
    return (
      <Box 
        as="section" 
        py={{ base: 20, md: 32 }} 
        mt={{ base: 10, md: 20 }}
        position="relative"
      >
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={16} alignItems="center">
            <GridItem>
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <VStack spacing={8} align="flex-start">
                  <Heading 
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight="bold"
                    color={isDark ? "white" : "#8b7966"}
                  >
                    MT5: TRADE WIDE RANGE OF MARKETS WITH ONE PLATFORM
                  </Heading>
                  
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color={isDark ? "gray.300" : "gray.600"}
                    fontWeight="bold"
                  >
                    YOUR GO-TO SOLUTION FOR FOREX AND CFD TRADING
                  </Text>
                  
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color={isDark ? "gray.300" : "gray.600"}
                  >
                    MetaTrader 5 is a powerful trading platform that offers a wide range of features and tools for traders of all levels. It is a multi-asset platform that allows traders to trade forex, stocks, and futures from a single platform.
                  </Text>
                  
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color={isDark ? "gray.300" : "gray.600"}
                  >
                    With MetaTrader 5, you can access advanced charting and analysis tools and use algorithmic trading applications such as trading robots and Expert advisors.
                  </Text>
                  
                  <Button
                    bg="#8b7966"
                    color="white"
                    _hover={{ bg: "#9c7c63" }}
                    fontWeight="bold"
                    px={8}
                    onClick={() => router.push('/platform-features')}
                  >
                    Explore Features
                  </Button>
                </VStack>
              </MotionBox>
            </GridItem>
            
            <GridItem>
              <SimpleGrid columns={{ base: 1, md: 1 }}>
                <Image 
                  src="/images/mt5.png" 
                  alt="MT5 Desktop" 
                  borderRadius="md"
                  boxShadow="md"
                />
              </SimpleGrid>
            </GridItem>
          </Grid>
        </Container>
      </Box>
    );
  };
  
  // Account Types Section 
  const AccountTypesSection = () => {
    return (
      <Box as="section" py={20}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Heading
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="bold"
              color={isDark ? "white" : "#8b7966"}
              textAlign="center"
            >
              WHICH ACCOUNT TYPE IS RIGHT FOR YOU?
            </Heading>
            
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8} width="full">
              <GridItem>
                <Flex
                  direction="column"
                  borderRadius="lg"
                  overflow="hidden"
                  height="full"
                  boxShadow="md"
                >
                  <Box bg="#8b7966" p={5} color="white">
                    <Heading size="lg">STANDARD</Heading>
                  </Box>
                  <VStack p={6} spacing={4} align="flex-start" flex="1">
                    <Text fontSize="lg">
                      A STANDARD account is best-suited for traders looking for raw spreads and instant execution.
                    </Text>
                    
                    <VStack spacing={3} align="flex-start" width="full">
                      <HStack>
                        <Icon as={CheckCircle} color="green.500" />
                        <Text>Minimum Deposit: $100</Text>
                      </HStack>
                      <HStack>
                        <Icon as={CheckCircle} color="green.500" />
                        <Text>Spread from 1.8 pips</Text>
                      </HStack>
                      <HStack>
                        <Icon as={CheckCircle} color="green.500" />
                        <Text>Leverage up to 1:400</Text>
                      </HStack>
                      <HStack>
                        <Icon as={CheckCircle} color="green.500" />
                        <Text>MT5 Platform</Text>
                      </HStack>
                    </VStack>
                    
                    <Button 
                      mt="auto" 
                      bg="brand.bitdash.400" 
                      color="white"
                      _hover={{ bg: "brand.bitdash.700" }} 
                      size="lg" 
                      width="full"
                    >
                      Open Standard Account
                    </Button>
                  </VStack>
                </Flex>
              </GridItem>
              
              <GridItem>
                <Flex
                  direction="column"
                  borderRadius="lg"
                  overflow="hidden"
                  height="full"
                  boxShadow="md"
                >
                  <Box bg="#b8a28b" p={5} color="white">
                    <Heading size="lg">PRO</Heading>
                  </Box>
                  <VStack p={6} spacing={4} align="flex-start" flex="1">
                    <Text fontSize="lg">
                      A PRO account is best-suited for traders looking for raw spreads and instant execution.
                    </Text>
                    
                    <VStack spacing={3} align="flex-start" width="full">
                      <HStack>
                        <Icon as={CheckCircle} color="green.500" />
                        <Text>Minimum Deposit: $1,000</Text>
                      </HStack>
                      <HStack>
                        <Icon as={CheckCircle} color="green.500" />
                        <Text>Spread from 0.5 pips</Text>
                      </HStack>
                      <HStack>
                        <Icon as={CheckCircle} color="green.500" />
                        <Text>Leverage up to 1:200</Text>
                      </HStack>
                      <HStack>
                        <Icon as={CheckCircle} color="green.500" />
                        <Text>MT5 Platform</Text>
                      </HStack>
                      <HStack>
                        <Icon as={CheckCircle} color="green.500" />
                        <Text>Dedicated Account Manager</Text>
                      </HStack>
                    </VStack>
                    
                     <Button 
                      mt="auto" 
                      bg="brand.bitdash.400" 
                      color="white"
                      _hover={{ bg: "brand.bitdash.700" }} 
                      size="lg" 
                      width="full"
                    >
                      Open Pro Account
                    </Button>
                  </VStack>
                </Flex>
              </GridItem>
            </Grid>
          </VStack>
        </Container>
      </Box>
    );
  };
  
  // Islamic/Shariah Compliant Section
  const IslamicPrinciplesSection = () => {
    const principles = [
      {
        icon: FaMosque,
        title: 'Shariah Compliant',
        description: 'All our products and services adhere strictly to Islamic finance principles, certified by leading Shariah scholars.'
      },
      {
        icon: FaHandHoldingUsd,
        title: 'No Riba (Interest)',
        description: 'Our financial solutions operate without interest, utilizing ethical profit-sharing and fee-based structures.'
      },
      {
        icon: FaBalanceScale,
        title: 'Ethical Investments',
        description: 'We screen all investments to ensure they comply with Islamic values, avoiding prohibited industries.'
      },
      {
        icon: FaFileContract,
        title: 'Transparent Contracts',
        description: 'All agreements are clearly defined with fair terms that avoid uncertainty (gharar) and speculation (maysir).'
      }
    ];
    
    return (
      <Box 
        as="section" 
        py={20} 
        position="relative"
        zIndex="2"
      >
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <MotionBox
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              textAlign="center"
            >
              <Text 
                color="#8b7966" 
                fontWeight="bold" 
                mb={3}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {t('islamicFinanceSubtitle', 'ISLAMIC FINANCE PRINCIPLES')}
              </Text>
              <Heading
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                color={isDark ? "white" : "#8b7966"}
                mb={5}
              >
                {t('islamicFinanceTitle', 'Built On Strong Ethical Foundations')}
              </Heading>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={isDark ? "gray.300" : "gray.600"}
                maxW="3xl"
                mx="auto"
              >
                {t('islamicFinanceDescription', 'BitDash integrates Islamic financial principles into modern financial technology, ensuring all transactions are ethical, transparent, and shariah-compliant.')}
              </Text>
            </MotionBox>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
              {principles.map((principle, idx) => (
                <MotionBox
                  key={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { 
                        duration: 0.6, 
                        delay: idx * 0.1,
                        ease: [0.22, 1, 0.36, 1]
                      }
                    }
                  }}
                >
                  <Flex
                    direction="column"
                    p={8}
                    borderRadius="lg"
                    bg={isDark ? "brand.bitdash.400" : "brand.bitdash.700"}
                    boxShadow="lg"
                    height="full"
                    transition="all 0.3s"
                    _hover={{
                      transform: 'translateY(-8px)',
                      boxShadow: 'xl'
                    }}
                  >
                    <Circle
                      size="56px"
                      bg={isDark ? "gray.800" : "#f5f5f5"}
                      color="#8b7966"
                      mb={6}
                    >
                      <Icon as={principle.icon} boxSize={6} />
                    </Circle>
                    
                    <Heading
                      as="h3"
                      size="md"
                      fontWeight="bold"
                      mb={4}
                      color={isDark ? "white" : "gray.800"}
                    >
                      {principle.title}
                    </Heading>
                    
                    <Text
                      color={isDark ? "gray.300" : "gray.600"}
                      fontSize="md"
                    >
                      {principle.description}
                    </Text>
                  </Flex>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    );
  };
  
  // Same Day Withdrawals Section 
  const WithdrawalsSection = () => {
    return (
      <Box as="section">
        <Container maxW="container.xl">
          <Flex 
            direction={{ base: "column", md: "row" }} 
            align="center" 
            justify="space-between" 
            color="white"
          >
            <VStack align={{ base: "center", md: "flex-start" }} spacing={3} mb={{ base: 6, md: 0 }}>
              <Heading fontSize={{ base: "2xl", md: "3xl" }} textAlign={{ base: "center", md: "left" }}>
                SAME DAY WITHDRAWALS
              </Heading>
              <Text fontSize="lg" maxW="600px" textAlign={{ base: "center", md: "left" }}>
                When you withdraw with us, you'll get your money same day! Far faster than any other competitor. 
                There are no fees for depositing or withdrawing with BitDash.
              </Text>
            </VStack>
            
             <Button 
              mt="auto" 
              variant="bitdash-outline"
              color={isDark ? "brand.bitdash.400" : "brand.bitdash.700"}
              size="lg" 
            >
              JOIN NOW
            </Button>
          </Flex>
        </Container>
      </Box>
    );
  };
  
  // Multi-Platform Section
  // Updated PlatformSection with specific selling points
const PlatformSection = () => {
  const platforms = [
    {
      name: t('platforms.forex.name', 'Forex by BitDash'),
      icon: TrendingUp,
      description: t('platforms.forex.description', 'Revolutionary forex brokerage offering insane perks: zero commission, ultra-tight spreads, and lightning-fast execution speeds that outperform the industry. Trade with institutional-grade tools and leverage up to 1:500.'),
      benefits: [
        t('platforms.forex.benefit1', 'Zero-commission trading with spreads from 0.0 pips'),
        t('platforms.forex.benefit2', 'Advanced MT5 platform with Expert Advisors'),
        t('platforms.forex.benefit3', 'Same-day withdrawals with no processing fees')
      ],
      subdomain: "forex.bitdash.app",
      color: "#8b7966",
      image: "/images/eur.png"
    },
    {
      name: t('platforms.crypto.name', 'Crypto by BitDash'),
      icon: FaBitcoin,
      description: t('platforms.crypto.description', 'Next-generation crypto exchange and DeFi platform with the lowest fees in the industry. Trade 100+ cryptocurrencies, access yield farming opportunities, and participate in upcoming token launches.'),
      benefits: [
        t('platforms.crypto.benefit1', 'Industry-lowest 0.05% trading fees'),
        t('platforms.crypto.benefit2', 'Advanced DeFi staking and yield farming'),
        t('platforms.crypto.benefit3', 'Cold storage security with insurance protection')
      ],
      subdomain: "crypto.bitdash.app",
      color: "#8b7966",
      image: "/images/btc.png"
    },
    {
      name: t('platforms.stock.name', 'Stock by BitDash'),
      icon: FaChartLine,
      description: t('platforms.stock.description', 'Premium investment platform for US and EU stocks with access to exclusive privately-held assets. Fractional shares, zero commissions, and extended trading hours for global markets.'),
      benefits: [
        t('platforms.stock.benefit1', 'Commission-free trading on all stocks'),
        t('platforms.stock.benefit2', 'Exclusive access to pre-IPO and private equity'),
        t('platforms.stock.benefit3', 'Advanced portfolio analysis and tax reporting')
      ],
      subdomain: "stock.bitdash.app",
      color: "#8b7966",
      image: "/images/tsla.png"
    },
    {
      name: t('platforms.cash.name', 'Cash by BitDash'),
      icon: FaRegCreditCard,
      description: t('platforms.cash.description', 'Cutting-edge payment processor leveraging blockchain technology for instant global transfers. Send and receive money via QR codes with zero fees and immediate settlement.'),
      benefits: [
        t('platforms.cash.benefit1', 'Instant transfers via QR code scanning'),
        t('platforms.cash.benefit2', 'Zero-fee global payments using blockchain'),
        t('platforms.cash.benefit3', 'Multi-currency accounts with best-in-market exchange rates')
      ],
      subdomain: "cash.bitdash.app",
      color: "#8b7966",
      image: "/images/usd.png" 
    }
  ];

  return (
    <Box 
      as="section" 
      py={24} 
      position="relative"
      overflow="hidden"
      bg={isDark ? "gray.900" : "gray.50"}
    >
      <Container maxW="container.xl" position="relative">
        <VStack spacing={16}>
          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            textAlign="center"
          >
            <Text 
              color="#8b7966" 
              fontWeight="bold" 
              mb={3}
              textTransform="uppercase"
              letterSpacing="wide"
            >
              {t('platformSection.subtitle', 'REVOLUTIONARY FINANCIAL ECOSYSTEM')}
            </Text>
            <Heading
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              color={isDark ? "brand.bitdash.400" : "brand.bitdash.700"}
              mb={5}
            >
              {t('platformSection.title', 'Our Cutting-Edge Financial Solutions')}
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={isDark ? "gray.300" : "gray.600"}
              maxW="3xl"
              mx="auto"
            >
              {t('platformSection.description', 'Discover our suite of next-generation financial platforms designed to revolutionize how you trade, invest, and transfer money globally.')}
            </Text>
          </MotionBox>
          
          {platforms.map((platform, idx) => (
            <MotionBox
              key={platform.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    duration: 0.7, 
                    delay: idx * 0.15,
                    ease: [0.22, 1, 0.36, 1]
                  }
                }
              }}
            >
              <Grid
                templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
                gap={10}
                bg={isDark ? "gray.800" : "white"}
                p={{ base: 6, md: 10 }}
                borderRadius="xl"
                boxShadow="lg"
                overflow="hidden"
                position="relative"
                borderLeft="4px solid"
                borderColor={platform.color}
              >
                <GridItem>
                  <VStack align="flex-start" spacing={6}>
                    <HStack>
                      <Icon as={platform.icon} boxSize={8} color={platform.color} />
                      <Heading size="lg" color={platform.color}>
                        {platform.name}
                      </Heading>
                    </HStack>
                    
                    <Text fontSize="lg" color={isDark ? "gray.300" : "gray.600"}>
                      {platform.description}
                    </Text>
                    
                    <VStack align="flex-start" spacing={3} mt={4}>
                      {platform.benefits.map((benefit, idx) => (
                        <HStack key={idx} align="flex-start">
                          <Icon as={CheckCircle} color={platform.color} mt={1} />
                          <Text>{benefit}</Text>
                        </HStack>
                      ))}
                    </VStack>
                    
                    <Button
                      mt={4}
                      bg={platform.color}
                      color="white"
                      _hover={{ bg: "#9c7c63" }}
                      px={8}
                      onClick={() => window.open(`https://${platform.subdomain}`, "_blank")}
                      rightIcon={<ArrowRightCircle size={16} />}
                    >
                      {t('platformSection.explore', 'Explore')} {platform.name.split(' ')[0]}
                    </Button>
                  </VStack>
                </GridItem>
                
                <GridItem>
                  <Flex 
                    justifyContent="center" 
                    alignItems="center" 
                    h="full"
                    position="relative"
                  >
                    <Box
                      boxSize={{ base: "200px", md: "300px" }}
                      position="relative"
                      overflow="hidden"
                    >
                      <Image
                        src={platform.image}
                        alt={platform.name}
                        objectFit="contain"
                        width="100%"
                        height="100%"
                      />
                    </Box>
                    <Circle
                      position="absolute"
                      size="350px"
                      bg={platform.color}
                      opacity="0.1"
                      zIndex="0"
                    />
                  </Flex>
                </GridItem>
              </Grid>
            </MotionBox>
          ))}
        </VStack>
      </Container>
    </Box>
  );
};
  
   // Mobile App Section
  const MobileAppSection = () => {
    return (
      <Box as="section">
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={16} alignItems="center">
            <GridItem>
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <VStack align="flex-start" spacing={8}>
                  <Heading
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight="bold"
                    color={isDark ? "brand.bitdash.400" : "brand.bitdash.600"}
                  >
                    DOWNLOAD BITDASH APPLICATION
                  </Heading>
                  
                  <Heading size="md" fontWeight="bold">
                    STAY IN THE KNOW ANYWHERE, ANYTIME.
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      color={isDark ? "brand.bitdash.400" : "brand.bitdash.600"}
                      mb={4}
                    >
                      DOWNLOAD NOW AND TRY OUR DASHBOARD NOW
                    </Text>
                    </Heading>
                    
                    <HStack spacing={2}>
                      <Image 
                        src="/images/app-store.png" 
                        alt="App Store" 
                        width="50%" 
                        cursor="pointer"
                        transition="transform 0.3s ease"
                        _hover={{ transform: "scale(1.05)" }}
                      />
                      <Image 
                        src="/images/google-play.png" 
                        alt="Google Play" 
                        width="50%" 
                        cursor="pointer"
                        transition="transform 0.3s ease"
                        _hover={{ transform: "scale(1.05)" }}
                      />
                    </HStack>
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
                <Box 
                  borderRadius="xl" 
                  overflow="hidden" 
                  boxShadow="2xl"
                  transform="perspective(1000px) rotateY(-5deg) rotateX(5deg)"
                  transition="all 0.5s ease"
                  _hover={{
                    transform: "perspective(1000px) rotateY(0deg) rotateX(0deg)"
                  }}
                >
                  <Image 
                    src="/images/dashboard-screenshot.png" 
                    alt="App Screenshot" 
                    borderRadius="md"
                    width="100%"
                  />
                </Box>
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>
    );
  };
  
  // Partnership Section (IB Program)
  const PartnershipSection = () => {
    return (
      <Box as="section" position="relative">
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity="0.05"
          backgroundSize="cover"
          backgroundPosition="center"
          zIndex="0"
        />
        
        <Container maxW="container.xl" position="relative" zIndex="1">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={12} alignItems="center">
            <GridItem>
              <MotionBox
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <VStack align="flex-start" spacing={6}>
                  <Text color="brand.bitdash.500" fontWeight="bold">
                    Introduce Broker Rewards (BitDash)
                  </Text>
                  
                  <Heading 
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight="bold"
                    color={isDark ? "brand.bitdash.400" : "brand.bitdash.600"}
                  >
                    BECOME A BITDASH PARTNER AND EXPAND YOUR BUSINESS
                  </Heading>
                  
                  <Heading size="md" fontWeight="bold" color={isDark ? "gray.200" : "gray.700"}>
                    THE BITDASH IS A GROWING INDUSTRY WITH AN EVER-EXPANDING REACH.
                  </Heading>
                  
                  <Text fontSize="lg" color={isDark ? "gray.300" : "gray.600"}>
                    We aim to expand the market by offering competitive and constructive partnership programs.
                    We believe that strong partnerships are essential to the growth of the market, and our team is dedicated to developing long-lasting relationships with our partners. 
                    So, what are you waiting for? Choose Partner Program and become a Partner.
                  </Text>
                  
                  <Button
                    variant="bitdash-solid"
                    px={8}
                    size="lg"
                    mt={4}
                  >
                    BECOME AN IB
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
                  src="/images/ib.png" 
                  alt="Partnership Program"
                  borderRadius="xl"
                  boxShadow="2xl"
                  transition="transform 0.5s ease"
                  _hover={{ transform: "scale(1.02)" }}
                />
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>
    );
  };
  
  // Account Opening Steps Section
  const AccountOpeningStepsSection = () => {
    const steps = [
      {
        number: 1,
        title: "Register",
        description: "Choose account type and complete our fast and secure application form"
      },
      {
        number: 2,
        title: "Fund",
        description: "Fund your trading account using a wide range of funding methods"
      },
      {
        number: 3,
        title: "Trade",
        description: "Start trading on your live account & access 100+ instruments"
      }
    ];
    
    return (
      <Box as="section" py={20}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <MotionBox
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              textAlign="center"
            >
              <Heading
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="bold"
                color={isDark ? "brand.bitdash.400" : "brand.bitdash.600"}
              >
                FAST ACCOUNT OPENING IN 3 SIMPLE STEPS
              </Heading>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color={isDark ? "gray.200" : "gray.700"}
                mt={2}
              >
                START TRADING WITH BITDASH
              </Text>
            </MotionBox>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} width="full">
              {steps.map((step, idx) => (
                <MotionBox
                  key={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { 
                        duration: 0.6, 
                        delay: idx * 0.2,
                        ease: [0.22, 1, 0.36, 1]
                      }
                    }
                  }}
                >
                  <VStack spacing={6} align="center">
                    <Flex
                      alignItems="center"
                      justifyContent="center"
                      w="120px"
                      h="120px"
                      borderRadius="full"
                      boxShadow="xl"
                      position="relative"
                      _after={{
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: "full",
                        border: "2px dashed",
                        borderColor: "brand.bitdash.500",
                        opacity: 0.5,
                        transform: "scale(1.1)"
                      }}
                    >
                      <Text
                        fontSize="5xl"
                        fontWeight="bold"
                        bgGradient="linear(to-r, brand.bitdash.400, brand.bitdash.700)"
                        bgClip="text"
                      >
                        {step.number}
                      </Text>
                    </Flex>
                    <Heading size="md" textAlign="center">{step.title}</Heading>
                    <Text textAlign="center" color={isDark ? "gray.300" : "gray.600"}>
                      {step.description}
                    </Text>
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
            
            <Button
              variant="bitdash-solid"
              size="lg"
              px={10}
              fontWeight="bold"
            >
              START TRADING
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  };
  
  // CTA Section with Forex Broker styling
  const CTASection = () => {
    return (
      <Box 
        as="section" 
        py={24} 
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl" position="relative">
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
              borderRadius="xl"
              boxShadow="2xl"
              color={isDark ? "brand.bitdash.400" : "brand.bitdash.700"}
              borderWidth="1px"
              borderColor={isDark ? "gray.700" : "gray.200"}
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
                color={isDark ? "brand.bitdash.400" : "brand.bitdash.700"}
              />
              
              <VStack spacing={8} maxW="3xl" position="relative" zIndex="1">
                <Text 
                  color="brand.bitdash.500" 
                  fontWeight="bold" 
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  {t('ctaSubtitle', 'START YOUR JOURNEY')}
                </Text>
                <Heading
                  fontSize={{ base: "3xl", md: "4xl" }}
                  fontWeight="bold"
                  color={isDark ? "brand.bitdash.400" : "brand.bitdash.700"}
                >
                  {t('ctaTitle', 'Ready to Transform Your Financial Operations?')}
                </Heading>
                
                <Text 
                  fontSize="lg" 
                  color={isDark ? "brand.bitdash.400" : "brand.bitdash.700"}
                  maxW="2xl"
                >
                  {t('ctaText', 'Join leading Islamic financial institutions already leveraging our shariah-compliant fintech ecosystem to streamline operations, reduce costs, and ensure ethical financial practices.')}
                </Text>
                
                <HStack spacing={6} pt={4} wrap="wrap" justify="center">
                  <Button
                    variant="bitdash-solid"
                    size="lg"
                    px={8}
                    rightIcon={<ArrowRightCircle size={18} />}
                    onClick={() => router.push('/signup')}
                  >
                    {t('ctaButton', 'Start Your Free Trial')}
                  </Button>
                  
                  <Button
                    variant="bitdash-outline"
                    size="lg"
                    px={8}
                    leftIcon={<FaWhatsapp size={18} />}
                    onClick={() => window.open("https://api.whatsapp.com/send?phone=00447538636207", "_blank")}
                  >
                    {t('scheduleDemo', 'Schedule Demo')}
                  </Button>
                </HStack>
                
                <Text fontSize="sm" color={isDark ? "gray.400" : "gray.500"} pt={2}>
                  {t('noCredit', 'No credit card required. 30-day free trial with full features and dedicated support.')}
                </Text>
              </VStack>
              
              {/* Decorative elements */}
              <Box
                position="absolute"
                bottom="30px"
                left="30px"
                width="120px"
                height="120px"
                opacity="0.1"
                borderRadius="full"
                bgGradient="linear(to-r, brand.bitdash.400, brand.bitdash.600)"
              />
              
              <Box
                position="absolute"
                top="60px"
                right="40px"
                width="80px"
                height="80px"
                opacity="0.1"
                borderRadius="full"
                bgGradient="linear(to-r, brand.bitdash.600, brand.bitdash.400)"
              />
            </Flex>
          </MotionBox>
        </Container>
      </Box>
    );
  };
  
  // Legal Notices Section
  const LegalNoticesSection = () => {
    return (
      <Box 
        as="section" 
        py={10} 
        borderTop="1px solid"
        borderColor={isDark ? "gray.700" : "gray.200"}
      >
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            <Heading size="md" color={isDark ? "brand.bitdash.400" : "brand.bitdash.600"}>
              Risk Warning & Regulatory Information
            </Heading>
            
            <Text fontSize="sm" color={isDark ? "gray.400" : "gray.600"} lineHeight="tall">
              Contracts for Difference ('CFDs') are complex financial products that are traded on margin. Trading CFDs carries a high level of risk since leverage can work both to your advantage and disadvantage. As a result, CFDs may not be suitable for all investors because you may lose all your invested capital. You should not risk more than you are prepared to lose. Before deciding to trade, you need to ensure that you understand the risks involved taking into account your investment objectives and level of experience. Past performance of CFDs is not a reliable indicator of future results. Most CFDs have no set maturity date. Hence, a CFD position matures on the date you choose to close an existing open position. Seek independent advice, if necessary. Please read our Risk Disclosure Notice in full.
            </Text>
            
            <Divider borderColor={isDark ? "gray.700" : "gray.200"} />
            
            <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8}>
              <GridItem>
                <VStack align="flex-start" spacing={4}>
                  <Heading size="sm" color={isDark ? "white" : "gray.800"}>
                    Licensed and Regulated
                  </Heading>
                  
                  <Text fontSize="sm" color={isDark ? "gray.400" : "gray.600"} lineHeight="tall">
                    BitDash LLC is officially licensed and regulated, holding an International Brokerage License in Saint Vincent and the Grenadines, numbered 1547 LLC. The registered address is Richmond Hill Rd, Kingstown, St. Vincent and the Grenadines, VC0100. BitDash adheres to strict regulatory standards to ensure the highest level of service and protection for our clients.
                  </Text>
                </VStack>
              </GridItem>
              
              <GridItem>
                <VStack align="flex-start" spacing={4}>
                  <Heading size="sm" color={isDark ? "white" : "gray.800"}>
                    Restricted Jurisdictions
                  </Heading>
                  
                  <Text fontSize="sm" color={isDark ? "gray.400" : "gray.600"} lineHeight="tall">
                    BitDash does not provide services to citizens and residents of certain jurisdictions such as United States of America, United Kingdom, Canada, Japan, EU countries, Iran, Israel and North Korea. Before you proceed, please ensure that you are not accessing this website from a restricted jurisdiction.
                  </Text>
                </VStack>
              </GridItem>
            </Grid>
            
            <HStack spacing={4} flexWrap="wrap" zIndex={1}>
              {["Privacy Policy", "AML Policy", "Terms & Conditions", "Security Of Funds", "Risk Disclosure", "Complaints Handling Policy"].map((item, idx) => (
                <Link 
                  key={idx} 
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  fontSize="xs"
                  color={isDark ? "gray.400" : "gray.600"}
                  _hover={{ color: "brand.bitdash.500" }}
                >
                  {item}
                </Link>
              ))}
            </HStack>
          </VStack>
        </Container>
      </Box>
    );
  };

  return (
    <Box>
      <HeroSection />
      <MT5PlatformSection />
      <AccountTypesSection />
      <WithdrawalsSection />
      <IslamicPrinciplesSection />
      <PlatformSection />
      <MobileAppSection />
      <PartnershipSection />
      <AccountOpeningStepsSection />
      <CTASection />
      <LegalNoticesSection />
    </Box>
  );
}