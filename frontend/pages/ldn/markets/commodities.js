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
  FaGasPump,
  FaWarehouse,
  FaCoins,
  FaShieldAlt,
  FaRegLightbulb,
  FaUniversity,
  FaRegChartBar,
} from 'react-icons/fa';
import { 
  GiOilDrum, 
  GiGoldBar,
  GiCoffeeBeans,
  GiWheat,
  GiWoodBeam
} from 'react-icons/gi';

// Components
import Layout from '@/components/Layout';
import CommodityMarketplace from '@/components/trading/CommodityMarketplace';
import MarketTicker from '@/components/MarketTicker';
import CommodityMatrix from '@/components/trading/CommodityMatrix';

// List of popular commodities to feature
const popularCommodities = [
  { 
    symbol: 'OIL', 
    name: 'Crude Oil', 
    icon: GiOilDrum,
    description: 'The world\'s most actively traded commodity and primary energy source' 
  },
  { 
    symbol: 'GOLD', 
    name: 'Gold', 
    icon: GiGoldBar,
    description: 'Precious metal valued as a store of wealth and hedge against inflation' 
  },
  { 
    symbol: 'NG', 
    name: 'Natural Gas', 
    icon: FaGasPump,
    description: 'Essential fuel for heating, electricity generation, and industrial processes' 
  },
  { 
    symbol: 'WHEAT', 
    name: 'Wheat', 
    icon: GiWheat,
    description: 'Global food staple that serves as a benchmark for agricultural markets' 
  },
  { 
    symbol: 'COFFEE', 
    name: 'Coffee', 
    icon: GiCoffeeBeans,
    description: 'One of the world\'s most popular beverages and widely traded soft commodity' 
  },
  { 
    symbol: 'LUMBER', 
    name: 'Lumber', 
    icon: GiWoodBeam,
    description: 'Essential building material with prices reflecting construction activity' 
  },
];

const CommoditiesPage = () => {
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
  const accentColor = useColorModeValue('brand.forex.400', 'brand.forex.700');
  const softShadow = useColorModeValue('lg', 'dark-lg');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const ctaBgColor = useColorModeValue('brand.forex.700', 'brand.forex.400');
  const statBg = useColorModeValue('blue.50', 'gray.700');

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
            bg="brand.forex.700"
            opacity="0.3"
            transform="rotate(-15deg)"
            roundedRight="full"
          />

          <Container maxW="7xl" position="relative" zIndex={2}>
            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={10}>
              <GridItem>
                <SlideFade in offsetY="20px">
                  <VStack spacing={6} align={locale === 'ar' ? 'end' : 'start'} textAlign={locale === 'ar' ? 'right' : 'left'}>
                    <Heading
                      fontSize={headingSize}
                      lineHeight="1.1"
                      fontWeight="bold"
                      maxW="600px"
                    >
                      {t('commodities.hero.heading', 'Trade Global Commodities on a Professional Platform')}
                    </Heading>
                    <Text fontSize={{ base: 'lg', md: 'xl' }} maxW="600px">
                      {t('commodities.hero.subtext', 'Access energy, metals, and agricultural markets with competitive spreads, advanced tools, and expert insights. Diversify your portfolio with real-world assets.')}
                    </Text>
                    <HStack spacing={4} pt={4}>
                      <Button
                        size={isMobile ? "md" : "lg"}
                        variant="bittrade-solid"
                        rightIcon={<ArrowForwardIcon />}
                        onClick={() => router.push('/signup/trader')}
                      >
                        {t('commodities.hero.startButton', 'Start Trading Now')}
                      </Button>
                      <Button
                        size={isMobile ? "md" : "lg"}
                        variant="bittrade-outline"
                        onClick={() => router.push('/demo-account')}
                      >
                        {t('commodities.hero.demoButton', 'Try Demo Account')}
                      </Button>
                    </HStack>
                  </VStack>
                </SlideFade>
              </GridItem>

              <GridItem display={{ base: "none", lg: "block" }}>
                <SlideFade in offsetY="20px" delay={0.2}>
                  <Flex justifyContent="center" alignItems="center" h="100%">
                    <Image
                      src="/images/commodities-trading.png"
                      alt={t('commodities.hero.imageAlt', 'Commodities Trading Platform')}
                      fallback={
                        <Box
                          w="100%"
                          h="350px"
                          borderRadius="xl"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <CommodityMatrix/>
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
          {/* Commodity Marketplace Section */}
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
                {t('commodities.marketplace.heading', 'Explore Commodity Markets')}
              </Heading>

              <CommodityMarketplace />

            </Box>
          </SlideFade>

          {/* Why Commodities Section */}
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
                {t('commodities.whyCommodities.heading', 'Why Trade Commodities with BitTrade')}
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
                    <Icon as={FaShieldAlt} boxSize={5} />
                  </Flex>
                  <Heading size="md">
                    {t('commodities.whyCommodities.advantage1.title', 'Portfolio Diversification')}
                  </Heading>
                  <Text>
                    {t('commodities.whyCommodities.advantage1.description', 'Commodities often move independently of stocks and bonds, providing valuable diversification and potential inflation protection for your portfolio.')}
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
                    <Icon as={FaGlobe} boxSize={5} />
                  </Flex>
                  <Heading size="md">
                    {t('commodities.whyCommodities.advantage2.title', '25+ Global Commodities')}
                  </Heading>
                  <Text>
                    {t('commodities.whyCommodities.advantage2.description', 'Trade energy products, precious metals, agricultural goods, and industrial metals from the world\'s major exchanges and markets.')}
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
                    {t('commodities.whyCommodities.advantage3.title', 'Advanced Trading Platform')}
                  </Heading>
                  <Text>
                    {t('commodities.whyCommodities.advantage3.description', 'Access live price feeds, customizable charts, technical indicators, and expert analysis from any device, anywhere.')}
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
                    {t('commodities.whyCommodities.advantage4.title', 'Multiple Trading Methods')}
                  </Heading>
                  <Text>
                    {t('commodities.whyCommodities.advantage4.description', 'Trade commodity futures, options, CFDs, or spot markets with flexible leverage options to suit your strategy and risk tolerance.')}
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
                    <Icon as={FaWarehouse} boxSize={5} />
                  </Flex>
                  <Heading size="md">
                    {t('commodities.whyCommodities.advantage5.title', 'Market Analysis')}
                  </Heading>
                  <Text>
                    {t('commodities.whyCommodities.advantage5.description', 'In-depth supply and demand analysis, seasonal trends, geopolitical impact assessments, and fundamental research for informed trading.')}
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
                    {t('commodities.whyCommodities.advantage6.title', 'Expert Support')}
                  </Heading>
                  <Text>
                    {t('commodities.whyCommodities.advantage6.description', 'Our commodities specialists provide personalized guidance, educational resources, and 24/5 support for traders of all experience levels.')}
                  </Text>
                </VStack>
              </SimpleGrid>
            </Box>
          </SlideFade>

          {/* Understanding Commodities Section */}
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
                {t('commodities.understanding.heading', 'Understanding Commodity Trading')}
              </Heading>

              <Text textAlign="center" mb={8} maxW="800px" mx="auto">
                {t('commodities.understanding.intro', 'Commodity markets allow traders to speculate on the price movements of natural resources and raw materials that are the building blocks of the global economy.')}
              </Text>

              <Accordion allowToggle mb={8}>
                <AccordionItem mb={4} border="none" overflow="hidden" borderRadius="md" bg={useColorModeValue('gray.50', 'gray.700')}>
                  <h2>
                    <AccordionButton py={4} _expanded={{ bg: accentColor, color: 'white' }}>
                      <Box flex="1" textAlign="left">
                        <Heading size="sm">{t('commodities.understanding.what.title', 'What are Commodities?')}</Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text mb={4}>
                      {t('commodities.understanding.what.p1', 'Commodities are raw materials or primary agricultural products that can be bought and sold, such as gold, oil, wheat, and coffee. They serve as the building blocks for more complex goods and services in the global economy.')}
                    </Text>
                    <Text>
                      {t('commodities.understanding.what.p2', 'Unlike stocks or bonds, commodities are standardized, meaning that there is little differentiation between a barrel of oil or an ounce of gold regardless of the producer. This standardization allows for efficient global trading on exchanges.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem mb={4} border="none" overflow="hidden" borderRadius="md" bg={useColorModeValue('gray.50', 'gray.700')}>
                  <h2>
                    <AccordionButton py={4} _expanded={{ bg: accentColor, color: 'white' }}>
                      <Box flex="1" textAlign="left">
                        <Heading size="sm">{t('commodities.understanding.markets.title', 'How Commodity Markets Work')}</Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text mb={4}>
                      {t('commodities.understanding.markets.p1', 'Commodity markets operate primarily through futures contracts—agreements to buy or sell a specific amount of a commodity at a predetermined price at a specified time in the future. These contracts help producers and consumers hedge against price volatility.')}
                    </Text>
                    <Text>
                      {t('commodities.understanding.markets.p2', 'Most traders do not intend to take physical delivery of the commodities they trade. Instead, positions are typically closed before the delivery date, with profit or loss determined by price changes during the holding period.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem mb={4} border="none" overflow="hidden" borderRadius="md" bg={useColorModeValue('gray.50', 'gray.700')}>
                  <h2>
                    <AccordionButton py={4} _expanded={{ bg: accentColor, color: 'white' }}>
                      <Box flex="1" textAlign="left">
                        <Heading size="sm">{t('commodities.understanding.types.title', 'Types of Commodities')}</Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text mb={4}>
                      {t('commodities.understanding.types.p1', 'Commodities are generally classified into four main categories:')}
                    </Text>
                    <List spacing={2} mb={4}>
                      <ListItem>
                        <Text fontWeight="bold">
                          {t('commodities.understanding.types.energy', 'Energy:')} 
                        </Text>
                        <Text>
                          {t('commodities.understanding.types.energyDesc', 'Crude oil, natural gas, gasoline, heating oil - Power the global economy and transportation networks.')}
                        </Text>
                      </ListItem>
                      <ListItem>
                        <Text fontWeight="bold">
                          {t('commodities.understanding.types.metals', 'Metals:')} 
                        </Text>
                        <Text>
                          {t('commodities.understanding.types.metalsDesc', 'Gold, silver, copper, platinum - Used in manufacturing, technology, jewelry, and as stores of value.')}
                        </Text>
                      </ListItem>
                      <ListItem>
                        <Text fontWeight="bold">
                          {t('commodities.understanding.types.agriculture', 'Agriculture:')} 
                        </Text>
                        <Text>
                          {t('commodities.understanding.types.agricultureDesc', 'Wheat, corn, soybeans, coffee - Essential food products and inputs for processed goods.')}
                        </Text>
                      </ListItem>
                      <ListItem>
                        <Text fontWeight="bold">
                          {t('commodities.understanding.types.livestock', 'Livestock:')} 
                        </Text>
                        <Text>
                          {t('commodities.understanding.types.livestockDesc', 'Cattle, hogs - Meat products traded on futures markets based on anticipated supply and demand.')}
                        </Text>
                      </ListItem>
                    </List>
                    <Text>
                      {t('commodities.understanding.types.p2', 'Each commodity has unique supply and demand drivers, seasonal patterns, and relationships to economic cycles.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>

              <Flex justify="center" mt={6}>
                <Button
                  variant="outline"
                  colorScheme="blue"
                  rightIcon={<ExternalLinkIcon />}
                  onClick={() => router.push('/education/commodities-basics')}
                >
                  {t('commodities.understanding.learnButton', 'Learn More About Commodity Trading')}
                </Button>
              </Flex>
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
                {t('commodities.stats.heading', 'Commodity Market Statistics')}
              </Heading>

              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                <Stat
                  bg="whiteAlpha.200"
                  p={4}
                  borderRadius="lg"
                  textAlign="center"
                >
                  <StatNumber fontSize={{ base: "2xl", md: "3xl" }}>$20+ Trillion</StatNumber>
                  <StatLabel>{t('commodities.stats.stat1.label', 'Global Market Size')}</StatLabel>
                  <StatHelpText>{t('commodities.stats.stat1.note', 'Annual trading volume')}</StatHelpText>
                </Stat>

                <Stat
                  bg="whiteAlpha.200"
                  p={4}
                  borderRadius="lg"
                  textAlign="center"
                >
                  <StatNumber fontSize={{ base: "2xl", md: "3xl" }}>25+</StatNumber>
                  <StatLabel>{t('commodities.stats.stat2.label', 'Major Commodities')}</StatLabel>
                  <StatHelpText>{t('commodities.stats.stat2.note', 'Available for trading')}</StatHelpText>
                </Stat>

                <Stat
                  bg="whiteAlpha.200"
                  p={4}
                  borderRadius="lg"
                  textAlign="center"
                >
                  <StatNumber fontSize={{ base: "2xl", md: "3xl" }}>0.1%</StatNumber>
                  <StatLabel>{t('commodities.stats.stat3.label', 'Low Commissions')}</StatLabel>
                  <StatHelpText>{t('commodities.stats.stat3.note', 'Competitive pricing')}</StatHelpText>
                </Stat>

                <Stat
                  bg="whiteAlpha.200"
                  p={4}
                  borderRadius="lg"
                  textAlign="center"
                >
                  <StatNumber fontSize={{ base: "2xl", md: "3xl" }}>24/5</StatNumber>
                  <StatLabel>{t('commodities.stats.stat4.label', 'Market Access')}</StatLabel>
                  <StatHelpText>{t('commodities.stats.stat4.note', 'Global trading hours')}</StatHelpText>
                </Stat>
              </SimpleGrid>

              <Flex justify="center" mt={10}>
                <Button
                  variant="bittrade-solid"
                  size="lg"
                  rightIcon={<ArrowForwardIcon />}
                  onClick={() => router.push('/signup/trader')}
                >
                  {t('commodities.stats.cta', 'Open Trading Account')}
                </Button>
              </Flex>
              </Box>
            </Box>
          </SlideFade>

          {/* Popular Commodities */}
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
                {t('commodities.popular.heading', 'Popular Commodities')}
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {popularCommodities.map((commodity, index) => (
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
                        {commodity.icon ? (
                          <Icon as={commodity.icon} boxSize={6} />
                        ) : (
                          <Text fontWeight="bold" fontSize="lg">{commodity.symbol}</Text>
                        )}
                      </Flex>
                      <Box>
                        <Heading size="md">{commodity.name}</Heading>
                        <Text color="gray.500" fontSize="sm">{commodity.symbol}</Text>
                      </Box>
                    </Flex>
                    <Text fontSize="sm" mb={4}>
                      {commodity.description}
                    </Text>
                    <Button
                      variant="bittrade-outline"
                      size="sm"
                      width="full"
                      onClick={() => router.push(`/markets/commodities/${commodity.symbol.toLowerCase()}`)}
                    >
                      {t('commodities.popular.viewButton', 'View Details')}
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
                    {t('commodities.getStarted.heading', 'How to Start Trading Commodities')}
                  </Heading>

                  <VStack spacing={6} align="stretch">
                    <HStack spacing={4} alignItems="flex-start">
                      <Flex
                        minW={8}
                        h={8}
                        bg="brand.forex.500"
                        borderRadius="full"
                        justify="center"
                        align="center"
                        fontWeight="bold"
                      >
                        1
                        </Flex>
                      <Box>
                        <Heading size="sm">{t('commodities.getStarted.step1.title', 'Create Your Account')}</Heading>
                        <Text mt={1}>
                          {t('commodities.getStarted.step1.desc', 'Complete our simple registration process with your email and basic information.')}
                        </Text>
                      </Box>
                    </HStack>

                    <HStack spacing={4} alignItems="flex-start">
                      <Flex
                        minW={8}
                        h={8}
                        bg="brand.forex.500"
                        justify="center"
                        align="center"
                        fontWeight="bold"
                      >
                        2
                      </Flex>
                      <Box>
                        <Heading size="sm">{t('commodities.getStarted.step2.title', 'Verify Your Identity')}</Heading>
                        <Text mt={1}>
                          {t('commodities.getStarted.step2.desc', 'Complete our secure KYC verification process to ensure compliance and account security.')}
                        </Text>
                      </Box>
                    </HStack>

                    <HStack spacing={4} alignItems="flex-start">
                      <Flex
                        minW={8}
                        h={8}
                        bg="brand.forex.500"
                        borderRadius="full"
                        justify="center"
                        align="center"
                        fontWeight="bold"
                      >
                        3
                      </Flex>
                      <Box>
                        <Heading size="sm">{t('commodities.getStarted.step3.title', 'Fund Your Account')}</Heading>
                        <Text mt={1}>
                          {t('commodities.getStarted.step3.desc', 'Deposit funds using bank transfer, credit/debit card, or digital payment methods.')}
                        </Text>
                      </Box>
                    </HStack>

                    <HStack spacing={4} alignItems="flex-start">
                      <Flex
                        minW={8}
                        h={8}
                        bg="brand.forex.500"
                        borderRadius="full"
                        justify="center"
                        align="center"
                        fontWeight="bold"
                      >
                        4
                      </Flex>
                      <Box>
                        <Heading size="sm">{t('commodities.getStarted.step4.title', 'Start Trading')}</Heading>
                        <Text mt={1}>
                          {t('commodities.getStarted.step4.desc', 'Select from our range of commodities, analyze markets, and execute trades on our intuitive platform.')}
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
                    {t('commodities.getStarted.button', 'Open Account Now')}
                  </Button>
                </GridItem>

                <GridItem display="flex" justifyContent="center" alignItems="center">
                  <Image
                    src="/images/commodities-onboarding.png"
                    alt={t('commodities.getStarted.imageAlt', 'Commodities Trading Onboarding')}
                    maxH="400px"
                    borderRadius="xl"
                    shadow="xl"
                    fallback={
                      <Box
                        w="100%"
                        h="350px"
                        bg="brand.forex.400"
                        borderRadius="xl"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaCoins} boxSize={16} opacity={0.3} />
                      </Box>
                    }
                  />
                </GridItem>
              </Grid>
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
                {t('commodities.faq.heading', 'Frequently Asked Questions')}
              </Heading>

              <Accordion allowToggle>
                <AccordionItem mb={4} border="1px solid" borderColor={borderColor} borderRadius="md" overflow="hidden">
                  <h2>
                    <AccordionButton py={4}>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        {t('commodities.faq.q1', 'How do commodity prices affect my investments?')}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text>
                      {t('commodities.faq.a1', 'Commodity prices can affect your investments both directly and indirectly. If you hold commodity futures or ETFs, price changes directly impact their value. Indirectly, commodity price movements can affect the profitability of companies in related sectors (e.g., oil prices affect energy companies). Commodities like gold often move inversely to stocks during market stress, potentially providing portfolio diversification benefits. Understanding these relationships can help create a more resilient investment strategy.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem mb={4} border="1px solid" borderColor={borderColor} borderRadius="md" overflow="hidden">
                  <h2>
                    <AccordionButton py={4}>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        {t('commodities.faq.q2', 'What commodities can I trade on BitTrade?')}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text>
                      {t('commodities.faq.a2', 'BitTrade offers a comprehensive range of over 25 commodities across all major categories. These include energy products (crude oil, natural gas, gasoline), precious metals (gold, silver, platinum), base metals (copper, aluminum, zinc), and agricultural commodities (wheat, corn, coffee, sugar, cotton). Our selection includes the most liquid and widely-traded commodities from global exchanges, giving you diverse opportunities in different market conditions.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem mb={4} border="1px solid" borderColor={borderColor} borderRadius="md" overflow="hidden">
                  <h2>
                    <AccordionButton py={4}>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        {t('commodities.faq.q3', 'What factors influence commodity prices?')}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text>
                      {t('commodities.faq.a3', 'Commodity prices are influenced by a complex mix of factors including supply and demand fundamentals, weather conditions, geopolitical events, currency movements, inflation expectations, and speculative trading. Each commodity has unique drivers—energy prices may respond to OPEC decisions or inventory reports, while agricultural commodities are sensitive to crop yields and harvest forecasts. Our platform provides real-time news and analysis to help you understand these factors when making trading decisions.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem mb={4} border="1px solid" borderColor={borderColor} borderRadius="md" overflow="hidden">
                  <h2>
                    <AccordionButton py={4}>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        {t('commodities.faq.q4', 'How can I manage risk when trading commodities?')}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text mb={3}>
                      {t('commodities.faq.a4.p1', 'Commodity markets can be volatile, making risk management essential. BitTrade offers several tools to help you control risk:')}
                    </Text>
                    <List spacing={2} mb={3}>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        {t('commodities.faq.a4.point1', 'Stop-loss and take-profit orders to automatically exit positions at predetermined levels')}
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        {t('commodities.faq.a4.point2', 'Position sizing tools to help determine appropriate exposure levels')}
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        {t('commodities.faq.a4.point3', 'Margin monitoring to prevent overleveraging')}
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        {t('commodities.faq.a4.point4', 'Real-time price alerts and notifications')}
                      </ListItem>
                    </List>
                    <Text>
                      {t('commodities.faq.a4.p2', 'Additionally, we recommend diversifying across different commodity types and using hedging strategies when appropriate.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem mb={4} border="1px solid" borderColor={borderColor} borderRadius="md" overflow="hidden">
                  <h2>
                    <AccordionButton py={4}>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        {t('commodities.faq.q5', 'How do I get started if I\'m new to commodity trading?')}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text mb={3}>
                      {t('commodities.faq.a5.p1', 'If you\'re new to commodity trading, we recommend this approach:')}
                    </Text>
                    <List spacing={2} mb={3}>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        {t('commodities.faq.a5.step1', 'Start with our educational resources to understand commodity market fundamentals')}
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        {t('commodities.faq.a5.step2', 'Practice with our free demo account to get comfortable with the platform')}
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        {t('commodities.faq.a5.step3', 'Begin with small positions in more stable commodities like gold or oil')}
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        {t('commodities.faq.a5.step4', 'Attend our webinars and market briefings for ongoing education')}
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        {t('commodities.faq.a5.step5', 'Consult with our commodity specialists for personalized guidance')}
                      </ListItem>
                    </List>
                    <Text>
                      {t('commodities.faq.a5.p2', 'Remember to start gradually and focus on understanding the unique characteristics of each commodity market before increasing your exposure.')}
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
                  {t('commodities.faq.moreButton', 'View All FAQs')}
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
                    {t('commodities.cta.heading', 'Start Trading Global Commodities Today')}
                  </Heading>
                  <Text fontSize={{ base: "md", md: "lg" }} maxW="2xl">
                    {t('commodities.cta.text', 'Join thousands of traders accessing energy, metals, and agricultural markets on our secure and professional platform. Diversify your portfolio with real-world assets backed by expert analysis and powerful tools.')}
                  </Text>
                  <HStack spacing={4} pt={4}>
                    <Button
                      variant="bittrade-solid"
                      rightIcon={<ArrowForwardIcon />}
                      onClick={() => router.push('/signup/trader')}
                    >
                      {t('commodities.cta.mainButton', 'Create Free Account')}
                    </Button>
                    <Button
                      variant="bittrade-solid"
                      _hover={{ bg: "whiteAlpha.200" }}
                      onClick={() => router.push('/demo')}
                    >
                      {t('commodities.cta.secondaryButton', 'Try Demo Account')}
                    </Button>
                  </HStack>
                </VStack>
              </Container>
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

export default CommoditiesPage;