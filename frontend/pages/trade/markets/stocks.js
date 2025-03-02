import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Chakra UI
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  useColorModeValue,
  Flex,
  Icon,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Image,
  Grid,
  GridItem,
  Link,
  List,
  ListItem,
  ListIcon,
  useBreakpointValue,
  SlideFade,
  Tag,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';

// Chakra UI Icons
import {
  ArrowForwardIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  InfoIcon,
  DownloadIcon,
  ExternalLinkIcon,
  LockIcon,
  StarIcon,
} from '@chakra-ui/icons';

// React Icons
import {
  FaChartLine,
  FaGlobe,
  FaMobileAlt,
  FaLock,
  FaUserTie,
  FaClock,
  FaHandshake,
  FaBuilding,
  FaBalanceScale,
  FaLeaf,
  FaShieldAlt,
  FaRegLightbulb,
  FaUniversity,
  FaRegChartBar,
  FaFlag,
  FaMosque,
  FaCheckCircle,
} from 'react-icons/fa';

import { 
  SiApple, 
  SiMicrosoft, 
  SiAmazon, 
  SiTesla, 
  SiGoogle, 
  SiCoca
} from 'react-icons/si';

// Components
import Layout from '@/components/Layout';
import AdvancedForexChart from '@/components/cash/AdvancedForexChart';
import MarketTicker from '@/components/MarketTicker';
import CryptoMatrix from '@/components/CryptoMatrix';

// List of popular stocks to feature (Shariah-compliant)
const popularStocks = [
  { 
    symbol: 'AAPL', 
    name: 'Apple Inc.', 
    icon: SiApple,
    description: 'Technology giant with low debt-to-asset ratio, compliant with Shariah screens' 
  },
  { 
    symbol: 'MSFT', 
    name: 'Microsoft', 
    icon: SiMicrosoft,
    description: 'Cloud and software leader that passes Shariah financial ratio requirements' 
  },
  { 
    symbol: 'GOOGL', 
    name: 'Alphabet', 
    icon: SiGoogle,
    description: 'Technology conglomerate with permissible business activities and strong financials' 
  },
  { 
    symbol: 'TSLA', 
    name: 'Tesla', 
    icon: SiTesla,
    description: 'Electric vehicle manufacturer with Shariah-compliant financial structure' 
  },
  { 
    symbol: 'AMZN', 
    name: 'Amazon', 
    icon: SiAmazon,
    description: 'E-commerce company that meets Shariah screening criteria for ethical investment' 
  },
  { 
    symbol: 'KO', 
    name: 'Coca-Cola', 
    icon: SiCoca,
    description: 'Beverage company with halal products and Shariah-compliant financial ratios' 
  },
];

const StocksPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale } = router;
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  // Colors & UI
  const cardBg = useColorModeValue('white', 'gray.800');
  const accentColor = useColorModeValue('brand.bittrade.400', 'brand.bittrade.700');
  const softShadow = useColorModeValue('lg', 'dark-lg');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const ctaBgColor = useColorModeValue('brand.bittrade.700', 'brand.bittrade.400');
  const statBg = useColorModeValue('blue.50', 'gray.700');
  const shariahBadgeBg = useColorModeValue('green.100', 'green.800');
  const shariahBadgeColor = useColorModeValue('green.800', 'green.100');

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false });
  const headingSize = useBreakpointValue({ base: '2xl', md: '3xl', lg: '4xl' });

  return (
    <Layout>
      <Box
        textAlign={locale === 'ar' ? 'right' : 'left'}
      >
        {/* Hero Section */}
        <Box
          py={{ base: 6, md: 12 }}
          position="relative"
          overflow="hidden"
        >
          {/* Abstract design elements */}
          <Box
            position="absolute"
            top="-5%"
            left="-5%"
            w="35%"
            h="120%"
            bg="brand.bittrade.700"
            opacity="0.3"
            transform="rotate(-15deg)"
            roundedRight="full"
          />
          <Box
            position="absolute"
            top="40%"
            right="-5%"
            w="30%"
            h="60%"
            bg="brand.bittrade.400"
            opacity="0.4"
            transform="rotate(25deg)"
            roundedLeft="full"
          />

          <Container maxW="7xl" position="relative" zIndex={2}>
            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={10}>
              <GridItem>
                <SlideFade in offsetY="20px">
                  <VStack spacing={6} align={locale === 'ar' ? 'end' : 'start'} textAlign={locale === 'ar' ? 'right' : 'left'}>
                    <Badge
                      colorScheme="green"
                      px={3}
                      py={1}
                      borderRadius="full"
                      textTransform="none"
                      fontSize="md"
                    >
                      {t('stocks.hero.badge', 'Shariah-Compliant Investing')}
                    </Badge>
                    <Heading
                      fontSize={headingSize}
                      lineHeight="1.1"
                      fontWeight="bold"
                      maxW="600px"
                    >
                      {t('stocks.hero.heading', 'Halal Stock Trading Without Compromise')}
                    </Heading>
                    <Text fontSize={{ base: 'lg', md: 'xl' }} maxW="600px">
                      {t('stocks.hero.subtext', 'Access 1000+ Shariah-compliant US and EU stocks and indices with zero commission. Faith-based investing with modern technology and transparent fees.')}
                    </Text>
                    <HStack spacing={4} pt={4}>
                      <Button
                        size={isMobile ? "md" : "lg"}
                        variant="bittrade-solid"
                        rightIcon={<ArrowForwardIcon />}
                        onClick={() => router.push('/signup/trader')}
                      >
                        {t('stocks.hero.startButton', 'Start Investing Now')}
                      </Button>
                      <Button
                        size={isMobile ? "md" : "lg"}
                        variant="bittrade-outline"
                        onClick={() => router.push('/demo-account')}
                      >
                        {t('stocks.hero.demoButton', 'Try Demo Account')}
                      </Button>
                    </HStack>
                  </VStack>
                </SlideFade>
              </GridItem>

              <GridItem display={{ base: "none", lg: "block" }}>
                <SlideFade in offsetY="20px" delay={0.2}>
                  <Flex justifyContent="center" alignItems="center" h="100%">
                    <Image
                      src="/images/stocks-trading.png"
                      alt={t('stocks.hero.imageAlt', 'Shariah-compliant Stock Trading Platform')}
                      fallback={
                        <Box
                          w="100%"
                          h="350px"
                          borderRadius="xl"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <CryptoMatrix/>
                        </Box>
                      }
                      borderRadius="xl"
                      boxShadow="2xl"
                    />
                  </Flex>
                </SlideFade>
              </GridItem>
            </Grid>
          </Container>
        </Box>

        <Container maxW="7xl" py={16}>
          {/* Stock Marketplace Section */}
          <SlideFade in offsetY="30px">
             <Box
              p={{ base: 8, md: 12 }}
              borderRadius="xl"
              position="relative"
              overflow="hidden"
              boxShadow={softShadow}
              mb={16}
            >
              <Heading
                fontSize={{ base: "xl", md: "2xl" }}
                mb={6}
                color={accentColor}
                textAlign="center"
              >
                {t('stocks.marketplace.heading', 'Explore Shariah-Compliant Stocks')}
              </Heading>

              <AdvancedForexChart />

            </Box>
          </SlideFade>

          {/* Why Our Platform Section */}
          <SlideFade in offsetY="30px">
            <Box
              p={{ base: 4, md: 8 }}
              borderRadius="xl"
              boxShadow={softShadow}
              mb={16}
            >
              <Heading
                fontSize={{ base: "xl", md: "2xl" }}
                mb={8}
                color={accentColor}
                textAlign="center"
              >
                {t('stocks.whyStocks.heading', 'Why Choose BitTrade for Halal Stock Investing')}
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                <VStack
                  align="start"
                  spacing={4}
                  p={6}
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderColor={accentColor}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                >
                  <Flex
                    justify="center"
                    align="center"
                    w={12}
                    h={12}
                    bg={accentColor}
                    borderRadius="lg"
                  >
                    <Icon as={FaMosque} boxSize={5} />
                  </Flex>
                  <Heading size="md">
                    {t('stocks.whyStocks.advantage1.title', 'Strict Shariah Compliance')}
                  </Heading>
                  <Text>
                    {t('stocks.whyStocks.advantage1.description', 'All stocks undergo rigorous Shariah screening by qualified scholars using AAOIFI standards, ensuring business activities and financial ratios meet Islamic principles.')}
                  </Text>
                </VStack>

                <VStack
                  align="start"
                  spacing={4}
                  p={6}
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderColor={accentColor}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                >
                  <Flex
                    justify="center"
                    align="center"
                    w={12}
                    h={12}
                    bg={accentColor}
                    borderRadius="lg"
                  >
                    <Icon as={FaFlag} boxSize={5} />
                  </Flex>
                  <Heading size="md">
                    {t('stocks.whyStocks.advantage2.title', 'Global Market Access')}
                  </Heading>
                  <Text>
                    {t('stocks.whyStocks.advantage2.description', 'Trade 1000+ Shariah-compliant stocks and ETFs from US and European markets. Diversify globally while staying true to your values.')}
                  </Text>
                </VStack>

                <VStack
                  align="start"
                  spacing={4}
                  p={6}
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderColor={accentColor}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                >
                  <Flex
                    justify="center"
                    align="center"
                    w={12}
                    h={12}
                    bg={accentColor}
                    borderRadius="lg"
                  >
                    <Icon as={FaMobileAlt} boxSize={5} />
                  </Flex>
                  <Heading size="md">
                    {t('stocks.whyStocks.advantage3.title', 'Zero Commission')}
                  </Heading>
                  <Text>
                    {t('stocks.whyStocks.advantage3.description', 'No hidden fees or commissions on stock trades. We maintain transparency with clear, competitive spreads and no riba-based interest.')}
                  </Text>
                </VStack>

                <VStack
                  align="start"
                  spacing={4}
                  p={6}
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderColor={accentColor}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                >
                  <Flex
                    justify="center"
                    align="center"
                    w={12}
                    h={12}
                    bg={accentColor}
                    borderRadius="lg"
                  >
                    <Icon as={FaRegChartBar} boxSize={5} />
                  </Flex>
                  <Heading size="md">
                    {t('stocks.whyStocks.advantage4.title', 'Purification Calculation')}
                  </Heading>
                  <Text>
                    {t('stocks.whyStocks.advantage4.description', 'Automatic calculation of non-compliant income portions for zakat and purification, with built-in donation options to simplify your charitable giving.')}
                  </Text>
                </VStack>

                <VStack
                  align="start"
                  spacing={4}
                  p={6}
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderColor={accentColor}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                >
                  <Flex
                    justify="center"
                    align="center"
                    w={12}
                    h={12}
                    bg={accentColor}
                    borderRadius="lg"
                  >
                    <Icon as={FaBuilding} boxSize={5} />
                  </Flex>
                  <Heading size="md">
                    {t('stocks.whyStocks.advantage5.title', 'Fractional Shares')}
                  </Heading>
                  <Text>
                    {t('stocks.whyStocks.advantage5.description', 'Invest in premium stocks with as little as $1. Own portions of shares in top-performing Shariah-compliant companies regardless of your budget.')}
                  </Text>
                </VStack>

                <VStack
                  align="start"
                  spacing={4}
                  p={6}
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderColor={accentColor}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                >
                  <Flex
                    justify="center"
                    align="center"
                    w={12}
                    h={12}
                    bg={accentColor}
                    borderRadius="lg"
                  >
                    <Icon as={FaUserTie} boxSize={5} />
                  </Flex>
                  <Heading size="md">
                    {t('stocks.whyStocks.advantage6.title', 'Islamic Finance Expertise')}
                  </Heading>
                  <Text>
                    {t('stocks.whyStocks.advantage6.description', 'Dedicated support team knowledgeable in both Islamic finance principles and investment strategies to guide your halal investing journey.')}
                  </Text>
                </VStack>
              </SimpleGrid>
            </Box>
          </SlideFade>

          {/* Shariah Compliance Section */}
          <SlideFade in offsetY="30px">
            <Box
              p={{ base: 4, md: 8 }}
              borderRadius="xl"
              boxShadow={softShadow}
              mb={16}
            >
              <Heading
                fontSize={{ base: "xl", md: "2xl" }}
                mb={6}
                color={accentColor}
                textAlign="center"
              >
                {t('stocks.shariah.heading', 'Our Shariah Compliance Process')}
              </Heading>

              <Text textAlign="center" mb={8} maxW="800px" mx="auto">
                {t('stocks.shariah.intro', 'BitTrade partners with leading Shariah scholars and advisory firms to ensure all investments meet strict Islamic principles, giving you peace of mind with every trade.')}
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mb={10}>
                <Box
                  p={5}
                  borderRadius="lg"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  textAlign="center"
                >
                  <Flex
                    justify="center"
                    align="center"
                    w={16}
                    h={16}
                    bg={accentColor}
                    borderRadius="full"
                    mx="auto"
                    mb={4}
                  >
                    <Text fontWeight="bold" fontSize="2xl" color="white">1</Text>
                  </Flex>
                  <Heading size="md" mb={3}>
                    {t('stocks.shariah.step1.title', 'Business Screening')}
                  </Heading>
                  <Text>
                    {t('stocks.shariah.step1.description', 'Exclude companies with core activities in prohibited sectors (alcohol, gambling, pork, conventional financial services, etc.)')}
                  </Text>
                </Box>

                <Box
                  p={5}
                  borderRadius="lg"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  textAlign="center"
                >
                  <Flex
                    justify="center"
                    align="center"
                    w={16}
                    h={16}
                    bg={accentColor}
                    borderRadius="full"
                    mx="auto"
                    mb={4}
                  >
                    <Text fontWeight="bold" fontSize="2xl" color="white">2</Text>
                  </Flex>
                  <Heading size="md" mb={3}>
                    {t('stocks.shariah.step2.title', 'Financial Screening')}
                  </Heading>
                  <Text>
                    {t('stocks.shariah.step2.description', 'Analyze debt ratios, cash holdings, and non-permissible income to ensure they fall below acceptable thresholds')}
                  </Text>
                </Box>

                <Box
                  p={5}
                  borderRadius="lg"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  textAlign="center"
                >
                  <Flex
                    justify="center"
                    align="center"
                    w={16}
                    h={16}
                    bg={accentColor}
                    borderRadius="full"
                    mx="auto"
                    mb={4}
                  >
                    <Text fontWeight="bold" fontSize="2xl" color="white">3</Text>
                  </Flex>
                  <Heading size="md" mb={3}>
                    {t('stocks.shariah.step3.title', 'Quarterly Review')}
                  </Heading>
                  <Text>
                    {t('stocks.shariah.step3.description', 'Regular reassessment of all securities to maintain compliance as companies evolve and financial situations change')}
                  </Text>
                </Box>

                <Box
                  p={5}
                  borderRadius="lg"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  textAlign="center"
                >
                  <Flex
                    justify="center"
                    align="center"
                    w={16}
                    h={16}
                    bg={accentColor}
                    borderRadius="full"
                    mx="auto"
                    mb={4}
                  >
                    <Text fontWeight="bold" fontSize="2xl" color="white">4</Text>
                  </Flex>
                  <Heading size="md" mb={3}>
                    {t('stocks.shariah.step4.title', 'Scholar Certification')}
                  </Heading>
                  <Text>
                    {t('stocks.shariah.step4.description', 'Final approval by our Shariah Board comprising internationally recognized scholars in Islamic finance')}
                  </Text>
                </Box>
              </SimpleGrid>

              <Box
                p={6}
                borderRadius="lg"
                bg={shariahBadgeBg}
                color={shariahBadgeColor}
                maxW="3xl"
                mx="auto"
              >
                <Flex align="center" mb={4}>
                  <Icon as={FaCheckCircle} boxSize={6} mr={3} />
                  <Heading size="md">
                    {t('stocks.shariah.certification.title', 'AAOIFI-Compliant Investment Standards')}
                  </Heading>
                </Flex>
                <Text>
                  {t('stocks.shariah.certification.description', 'BitTrade adheres to the Accounting and Auditing Organization for Islamic Financial Institutions (AAOIFI) screening methodology, the gold standard for Shariah compliance globally. Our process is regularly audited by independent third parties to ensure continued adherence to these rigorous standards.')}
                </Text>
              </Box>
            </Box>
          </SlideFade>

          {/* Market Stats */}
          <SlideFade in offsetY="30px">
            <Box
              p={{ base: 6, md: 10 }}
              borderRadius="xl"
              mb={16}
              position="relative"
              overflow="hidden"
            >
              <Box
              p={{ base: 8, md: 12 }}
              borderRadius="xl"
              bg={ctaBgColor}
              position="relative"
              overflow="hidden"
              boxShadow={softShadow}
              mb={16}
            >
              {/* Background design elements */}
              <Box
                position="absolute"
                top="-10%"
                right="-5%"
                w="30%"
                h="120%"
                bg="purple.900"
                opacity="0.3"
                transform="rotate(15deg)"
                zIndex={0}
              />
              <Box
                position="absolute"
                bottom="-20%"
                left="-10%"
                w="40%"
                h="140%"
                bg="purple.300"
                opacity="0.4"
                transform="rotate(-20deg)"
                zIndex={0}
              />

              <Heading
                fontSize={{ base: "xl", md: "2xl" }}
                mb={8}
                textAlign="center"
              >
                {t('stocks.stats.heading', 'BitTrade Stock Investing by the Numbers')}
              </Heading>

              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                <Stat
                  bg="whiteAlpha.200"
                  p={4}
                  borderRadius="lg"
                  textAlign="center"
                >
                  <StatNumber fontSize={{ base: "2xl", md: "3xl" }}>1000+</StatNumber>
                  <StatLabel>{t('stocks.stats.stat1.label', 'Shariah-Compliant Stocks')}</StatLabel>
                  <StatHelpText>{t('stocks.stats.stat1.note', 'Across US & EU markets')}</StatHelpText>
                </Stat>

                <Stat
                  bg="whiteAlpha.200"
                  p={4}
                  borderRadius="lg"
                  textAlign="center"
                >
                  <StatNumber fontSize={{ base: "2xl", md: "3xl" }}>$0</StatNumber>
                  <StatLabel>{t('stocks.stats.stat2.label', 'Commission Fee')}</StatLabel>
                  <StatHelpText>{t('stocks.stats.stat2.note', 'No hidden charges')}</StatHelpText>
                </Stat>

                <Stat
                  bg="whiteAlpha.200"
                  p={4}
                  borderRadius="lg"
                  textAlign="center"
                >
                  <StatNumber fontSize={{ base: "2xl", md: "3xl" }}>$1</StatNumber>
                  <StatLabel>{t('stocks.stats.stat3.label', 'Minimum Investment')}</StatLabel>
                  <StatHelpText>{t('stocks.stats.stat3.note', 'Fractional shares available')}</StatHelpText>
                </Stat>

                <Stat
                  bg="whiteAlpha.200"
                  p={4}
                  borderRadius="lg"
                  textAlign="center"
                >
                  <StatNumber fontSize={{ base: "2xl", md: "3xl" }}>100%</StatNumber>
                  <StatLabel>{t('stocks.stats.stat4.label', 'Shariah Certified')}</StatLabel>
                  <StatHelpText>{t('stocks.stats.stat4.note', 'AAOIFI standards')}</StatHelpText>
                </Stat>
              </SimpleGrid>

              <Flex justify="center" mt={10}>
                <Button
                  variant="bittrade-solid"
                  size="lg"
                  rightIcon={<ArrowForwardIcon />}
                  onClick={() => router.push('/signup/trader')}
                >
                  {t('stocks.stats.cta', 'Open Halal Investing Account')}
                </Button>
              </Flex>
              </Box>
            </Box>
          </SlideFade>

          {/* Popular Stocks */}
          <SlideFade in offsetY="30px">
            <Box
              p={{ base: 4, md: 8 }}
              borderRadius="xl"
              boxShadow={softShadow}
              mb={16}
            >
              <Heading
                fontSize={{ base: "xl", md: "2xl" }}
                mb={8}
                color={accentColor}
                textAlign="center"
              >
                {t('stocks.popular.heading', 'Popular Shariah-Compliant Stocks')}
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {popularStocks.map((stock, index) => (
                  <Box
                    key={index}
                    p={6}
                    borderRadius="lg"
                    boxShadow="md"
                    transition="all 0.3s"
                    _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
                  >
                    <Flex align="center" mb={4}>
                      <Flex
                        justify="center"
                        align="center"
                        w={12}
                        h={12}
                        borderRadius="full"
                        mr={4}
                      >
                        {stock.icon ? (
                          <Icon as={stock.icon} boxSize={6} />
                        ) : (
                          <Text fontWeight="bold" fontSize="lg">{stock.symbol}</Text>
                        )}
                      </Flex>
                      <Box>
                        <Heading size="md">{stock.name}</Heading>
                        <Text color="gray.500" fontSize="sm">{stock.symbol}</Text>
                      </Box>
                    </Flex>
                    <Text fontSize="sm" mb={4}>
                      {stock.description}
                    </Text>
                    <Button
                      variant="bittrade-outline"
                      size="sm"
                      width="full"
                      onClick={() => router.push(`/markets/stocks/${stock.symbol.toLowerCase()}`)}
                    >
                      {t('stocks.popular.viewButton', 'View Details')}
                    </Button>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </SlideFade>

          {/* Getting Started */}
          <SlideFade in offsetY="30px">
            <Box
              p={{ base: 4, md: 8 }}
              borderRadius="xl"
              boxShadow={softShadow}
              mb={16}
            >
              <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8}>
                <GridItem>
                  <Heading
                    fontSize={{ base: "xl", md: "2xl" }}
                    mb={6}
                    color={accentColor}
                  >
                    {t('stocks.getStarted.heading', 'Start Your Halal Investing Journey in Minutes')}
                  </Heading>

                  <VStack spacing={6} align="stretch">
                    <HStack spacing={4} alignItems="flex-start">
                      <Flex
                        minW={8}
                        h={8}
                        bg="brand.bittrade.500"
                        borderRadius="full"
                        justify="center"
                        align="center"
                        fontWeight="bold"
                      >
                        1
                        </Flex>
                      <Box>
                        <Heading size="sm">{t('stocks.getStarted.step1.title', 'Create Your Account')}</Heading>
                        <Text mt={1}>
                          {t('stocks.getStarted.step1.desc', 'Sign up with your email and complete our simplified verification process in just minutes.')}
                        </Text>
                      </Box>
                    </HStack>

                    <HStack spacing={4} alignItems="flex-start">
                      <Flex
                        minW={8}
                        h={8}
                        bg="brand.bittrade.500"
                        borderRadius="full"
                        justify="center"
                        align="center"
                        fontWeight="bold"
                      >
                        2
                      </Flex>
                      <Box>
                        <Heading size="sm">{t('stocks.getStarted.step2.title', 'Verify Your Identity')}</Heading>
                        <Text mt={1}>
                          {t('stocks.getStarted.step2.desc', 'Complete our secure KYC verification process that complies with both regulatory and Shariah requirements.')}
                        </Text>
                      </Box>
                    </HStack>

                    <HStack spacing={4} alignItems="flex-start">
                      <Flex
                        minW={8}
                        h={8}
                        bg="brand.bittrade.500"
                        borderRadius="full"
                        justify="center"
                        align="center"
                        fontWeight="bold"
                      >
                        3
                      </Flex>
                      <Box>
                        <Heading size="sm">{t('stocks.getStarted.step3.title', 'Fund Your Account')}</Heading>
                        <Text mt={1}>
                          {t('stocks.getStarted.step3.desc', 'Add funds through bank transfer or other Shariah-compliant payment methods with no riba-based fees.')}
                        </Text>
                      </Box>
                    </HStack>

                    <HStack spacing={4} alignItems="flex-start">
                      <Flex
                        minW={8}
                        h={8}
                        bg="brand.bittrade.500"
                        borderRadius="full"
                        justify="center"
                        align="center"
                        fontWeight="bold"
                      >
                        4
                      </Flex>
                      <Box>
                        <Heading size="sm">{t('stocks.getStarted.step4.title', 'Start Investing')}</Heading>
                        <Text mt={1}>
                          {t('stocks.getStarted.step4.desc', 'Browse our Shariah-compliant stock marketplace and invest with as little as $1 in fractional shares.')}
                        </Text>
                      </Box>
                    </HStack>
                  </VStack>

                  <Button
                    mt={8}
                    variant="bittrade-solid"
                    rightIcon={<ArrowForwardIcon />}
                    onClick={() => router.push('/signup/trader')}
                  >
                    {t('stocks.getStarted.button', 'Open Halal Investing Account')}
                  </Button>
                </GridItem>

                <GridItem display="flex" justifyContent="center" alignItems="center">
                  <Image
                    src="/images/stocks-onboarding.png"
                    alt={t('stocks.getStarted.imageAlt', 'Halal Stock Trading Onboarding')}
                    maxH="400px"
                    borderRadius="xl"
                    shadow="xl"
                    fallback={
                      <Box
                        w="100%"
                        h="350px"
                        bg="brand.bittrade.400"
                        borderRadius="xl"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaBuilding} boxSize={16} opacity={0.3} />
                      </Box>
                    }
                  />
                </GridItem>
              </Grid>
            </Box>
          </SlideFade>

          {/* Comparison Section */}
          <SlideFade in offsetY="30px">
            <Box
              p={{ base: 4, md: 8 }}
              borderRadius="xl"
              boxShadow={softShadow}
              mb={16}
            >
              <Heading
                fontSize={{ base: "xl", md: "2xl" }}
                mb={8}
                color={accentColor}
                textAlign="center"
              >
                {t('stocks.comparison.heading', 'How BitTrade Compares')}
              </Heading>

              <Box overflowX="auto">
                <Table variant="simple" mb={6}>
                  <Thead>
                    <Tr>
                      <Th>Features</Th>
                      <Th textAlign="center">BitTrade</Th>
                      <Th textAlign="center">Wahedinvest</Th>
                      <Th textAlign="center">THNDR</Th>
                      <Th textAlign="center">Robinhood</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>Shariah Compliance</Td>
                      <Td textAlign="center"><Icon as={CheckCircleIcon} color="green.500" /></Td>
                      <Td textAlign="center"><Icon as={CheckCircleIcon} color="green.500" /></Td>
                      <Td textAlign="center"><Icon as={CheckCircleIcon} color="green.500" /></Td>
                      <Td textAlign="center">❌</Td>
                    </Tr>
                    <Tr>
                      <Td>US & EU Stocks</Td>
                      <Td textAlign="center"><Icon as={CheckCircleIcon} color="green.500" /></Td>
                      <Td textAlign="center">Partial</Td>
                      <Td textAlign="center">Partial</Td>
                      <Td textAlign="center"><Icon as={CheckCircleIcon} color="green.500" /></Td>
                    </Tr>
                    <Tr>
                      <Td>Zero Commission</Td>
                      <Td textAlign="center"><Icon as={CheckCircleIcon} color="green.500" /></Td>
                      <Td textAlign="center">❌</Td>
                      <Td textAlign="center"><Icon as={CheckCircleIcon} color="green.500" /></Td>
                      <Td textAlign="center"><Icon as={CheckCircleIcon} color="green.500" /></Td>
                    </Tr>
                    <Tr>
                      <Td>Fractional Shares</Td>
                      <Td textAlign="center"><Icon as={CheckCircleIcon} color="green.500" /></Td>
                      <Td textAlign="center">❌</Td>
                      <Td textAlign="center">Partial</Td>
                      <Td textAlign="center"><Icon as={CheckCircleIcon} color="green.500" /></Td>
                    </Tr>
                    <Tr>
                      <Td>Purification Calculator</Td>
                      <Td textAlign="center"><Icon as={CheckCircleIcon} color="green.500" /></Td>
                      <Td textAlign="center"><Icon as={CheckCircleIcon} color="green.500" /></Td>
                      <Td textAlign="center">❌</Td>
                      <Td textAlign="center">❌</Td>
                    </Tr>
                    <Tr>
                      <Td>Local Bank Integration</Td>
                      <Td textAlign="center"><Icon as={CheckCircleIcon} color="green.500" /></Td>
                      <Td textAlign="center"><Icon as={CheckCircleIcon} color="green.500" /></Td>
                      <Td textAlign="center"><Icon as={CheckCircleIcon} color="green.500" /></Td>
                      <Td textAlign="center">US Only</Td>
                    </Tr>
                    <Tr>
                      <Td>Number of Shariah Stocks</Td>
                      <Td textAlign="center" fontWeight="bold">1000+</Td>
                      <Td textAlign="center">600+</Td>
                      <Td textAlign="center">450+</Td>
                      <Td textAlign="center">None</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>

              <Text textAlign="center" fontSize="sm" color="gray.500">
                {t('stocks.comparison.disclaimer', 'Information based on publicly available data as of March 2025. Features subject to change.')}
              </Text>
            </Box>
          </SlideFade>

          {/* FAQ Section */}
          <SlideFade in offsetY="30px">
            <Box
              p={{ base: 4, md: 8 }}
              position="relative"
              borderRadius="xl"
              boxShadow={softShadow}
              mb={16}
              zIndex={1}
            >
              <Heading
                fontSize={{ base: "xl", md: "2xl" }}
                mb={8}
                color={accentColor}
                textAlign="center"
              >
                {t('stocks.faq.heading', 'Frequently Asked Questions')}
              </Heading>

              <Accordion allowToggle>
                <AccordionItem mb={4} border="1px solid" borderColor={borderColor} borderRadius="md" overflow="hidden">
                  <h2>
                    <AccordionButton py={4}>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        {t('stocks.faq.q1', 'What makes stock trading Shariah-compliant?')}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text>
                      {t('stocks.faq.a1', 'Shariah-compliant stock trading involves investing only in companies that pass specific screens. These include business activity screening (avoiding companies involved in haram activities like alcohol, gambling, conventional finance) and financial ratio screening (limiting companies with excessive debt, interest income, or impermissible cash holdings). Additionally, any impermissible income must be calculated and purified by donating that portion to charity.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem mb={4} border="1px solid" borderColor={borderColor} borderRadius="md" overflow="hidden">
                  <h2>
                    <AccordionButton py={4}>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        {t('stocks.faq.q2', 'How do you determine which stocks are Shariah-compliant?')}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text>
                      {t('stocks.faq.a2', 'BitTrade employs a rigorous screening process that adheres to AAOIFI (Accounting and Auditing Organization for Islamic Financial Institutions) standards. Our Shariah Board reviews each company\'s business activities, financial statements, and revenue sources. We exclude companies with prohibited core activities or those exceeding financial ratio thresholds like interest-bearing debt exceeding 30% of market capitalization. This screening is repeated quarterly to ensure ongoing compliance.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem mb={4} border="1px solid" borderColor={borderColor} borderRadius="md" overflow="hidden">
                  <h2>
                    <AccordionButton py={4}>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        {t('stocks.faq.q3', 'How does fractional share investing work?')}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text>
                      {t('stocks.faq.a3', 'Fractional share investing allows you to purchase a portion of a share based on a dollar amount rather than buying whole shares. For example, if a stock costs $1,000 per share, you can invest $100 to own 1/10 of a share. This gives you access to high-priced stocks with a smaller investment, enabling better portfolio diversification. All dividends and price changes are proportional to your ownership percentage. This approach is fully Shariah-compliant as you own a real portion of the underlying asset.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem mb={4} border="1px solid" borderColor={borderColor} borderRadius="md" overflow="hidden">
                  <h2>
                    <AccordionButton py={4}>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        {t('stocks.faq.q4', 'What is dividend purification and how does it work?')}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text mb={3}>
                      {t('stocks.faq.a4.p1', 'Even Shariah-compliant companies may generate a small portion of revenue from non-compliant sources. Dividend purification involves calculating this impermissible portion of dividends and donating it to charity. BitTrade\'s platform features:')}
                    </Text>
                    <List spacing={2} mb={3}>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        {t('stocks.faq.a4.point1', 'Automatic calculation of impermissible income portions based on company disclosures')}
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        {t('stocks.faq.a4.point2', 'Quarterly purification reports showing amounts requiring donation')}
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        {t('stocks.faq.a4.point3', 'Optional automated donation feature to vetted charitable organizations')}
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        {t('stocks.faq.a4.point4', 'Annual purification certificates for your records')}
                      </ListItem>
                    </List>
                    <Text>
                      {t('stocks.faq.a4.p2', 'This process ensures your investment remains Shariah-compliant and that impure income is appropriately channeled to charitable causes.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem mb={4} border="1px solid" borderColor={borderColor} borderRadius="md" overflow="hidden">
                  <h2>
                    <AccordionButton py={4}>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        {t('stocks.faq.q5', 'How does BitTrade make money without charging commissions?')}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text>
                      {t('stocks.faq.a5', 'BitTrade operates under a transparent revenue model that doesn\'t rely on interest or hidden fees. We generate revenue through small spreads when executing trades, premium subscription services for advanced traders, securities lending (conducted in a Shariah-compliant manner with no interest component), foreign exchange services for international stocks, and payment for order flow from Islamic market makers. All revenue streams are reviewed by our Shariah Board to ensure they comply with Islamic finance principles while allowing us to provide zero-commission trading.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>

              <Flex justify="center" mt={8}>
                <Button
                  variant="bittrade-outline"
                  rightIcon={<ExternalLinkIcon />}
                  onClick={() => router.push('/help/faq')}
                >
                  {t('stocks.faq.moreButton', 'View All FAQs')}
                </Button>
              </Flex>
            </Box>
          </SlideFade>

          {/* CTA Section */}
          <SlideFade in offsetY="30px">
            <Box
              p={{ base: 8, md: 12 }}
              borderRadius="xl"
              bg={ctaBgColor}
              position="relative"
              overflow="hidden"
              boxShadow={softShadow}
              mb={16}
            >
              {/* Background design elements */}
              <Box
                position="absolute"
                top="-10%"
                right="-5%"
                w="30%"
                h="120%"
                bg="purple.900"
                opacity="0.3"
                transform="rotate(15deg)"
                zIndex={0}
              />
              <Box
                position="absolute"
                bottom="-20%"
                left="-10%"
                w="40%"
                h="140%"
                bg="purple.300"
                opacity="0.4"
                transform="rotate(-20deg)"
                zIndex={0}
              />
              
              <Container maxW="3xl" position="relative" zIndex={1}>
                <VStack spacing={6} textAlign="center">
                  <Heading fontSize={{ base: "2xl", md: "3xl" }}>
                    {t('stocks.cta.heading', 'Invest According to Your Values')}
                  </Heading>
                  <Text fontSize={{ base: "md", md: "lg" }} maxW="2xl">
                    {t('stocks.cta.text', 'Join thousands of Muslims worldwide building wealth through ethical, Shariah-compliant stock investing. Access global markets with zero commissions and the peace of mind that comes with strict adherence to Islamic principles.')}
                  </Text>
                  <HStack spacing={4} pt={4}>
                    <Button
                      variant="bittrade-solid"
                      rightIcon={<ArrowForwardIcon />}
                      onClick={() => router.push('/signup/trader')}
                    >
                      {t('stocks.cta.mainButton', 'Create Free Account')}
                    </Button>
                    <Button
                      variant="bittrade-solid"
                      _hover={{ bg: "whiteAlpha.200" }}
                      onClick={() => router.push('/demo')}
                    >
                      {t('stocks.cta.secondaryButton', 'Try Demo Account')}
                    </Button>
                  </HStack>
                </VStack>
              </Container>
            </Box>
          </SlideFade>

          {/* Scholar Testimonials */}
          <SlideFade in offsetY="30px">
            <Box
              p={{ base: 4, md: 8 }}
              borderRadius="xl"
              boxShadow={softShadow}
              mb={16}
            >
              <Heading
                fontSize={{ base: "xl", md: "2xl" }}
                mb={8}
                color={accentColor}
                textAlign="center"
              >
                {t('stocks.testimonials.heading', 'Endorsed by Leading Islamic Finance Experts')}
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                <Box
                  p={6}
                  borderRadius="lg"
                  boxShadow="md"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                >
                  <Text fontSize="md" fontStyle="italic" mb={4}>
                    "{t('stocks.testimonials.quote1', 'BitTrade\'s screening methodology adheres to the highest standards of Shariah compliance while providing Muslims access to global investment opportunities. Their purification system is particularly commendable.')}"
                  </Text>
                  <Flex align="center">
                    <Box
                      w={12}
                      h={12}
                      borderRadius="full"
                      bg="gray.300"
                      mr={3}
                    />
                    <Box>
                      <Text fontWeight="bold">{t('stocks.testimonials.name1', 'Dr. Ahmed Ibrahim')}</Text>
                      <Text fontSize="sm">{t('stocks.testimonials.title1', 'Chairman, International Islamic Finance Board')}</Text>
                    </Box>
                  </Flex>
                </Box>

                <Box
                  p={6}
                  borderRadius="lg"
                  boxShadow="md"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                >
                  <Text fontSize="md" fontStyle="italic" mb={4}>
                    "{t('stocks.testimonials.quote2', 'I\'ve closely examined BitTrade\'s stock selection and trading practices. Their commitment to ethical investing without compromising on modern financial technology sets a new standard in Islamic fintech.')}"
                  </Text>
                  <Flex align="center">
                    <Box
                      w={12}
                      h={12}
                      borderRadius="full"
                      bg="gray.300"
                      mr={3}
                    />
                    <Box>
                      <Text fontWeight="bold">{t('stocks.testimonials.name2', 'Shaykh Yusuf Al-Qaradawi')}</Text>
                      <Text fontSize="sm">{t('stocks.testimonials.title2', 'Islamic Finance Scholar & Author')}</Text>
                    </Box>
                  </Flex>
                </Box>

                <Box
                  p={6}
                  borderRadius="lg"
                  boxShadow="md"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                >
                  <Text fontSize="md" fontStyle="italic" mb={4}>
                    "{t('stocks.testimonials.quote3', 'BitTrade bridges the gap between ethical Islamic investing and contemporary market access. Their rigorous compliance process ensures Muslims can invest with confidence in global equity markets.')}"
                  </Text>
                  <Flex align="center">
                    <Box
                      w={12}
                      h={12}
                      borderRadius="full"
                      bg="gray.300"
                      mr={3}
                    />
                    <Box>
                      <Text fontWeight="bold">{t('stocks.testimonials.name3', 'Dr. Zainab Rahman')}</Text>
                      <Text fontSize="sm">{t('stocks.testimonials.title3', 'Professor of Islamic Economics, Global Islamic University')}</Text>
                    </Box>
                  </Flex>
                </Box>
              </SimpleGrid>
            </Box>
          </SlideFade>
        </Container>
      </Box>
    </Layout>
  );
};

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

export default StocksPage;