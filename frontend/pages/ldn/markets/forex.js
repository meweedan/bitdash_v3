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
} from '@chakra-ui/react';

// Chakra UI Icons
import {
  ArrowForwardIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  InfoIcon,
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
  FaEuroSign,
  FaPoundSign,
  FaYenSign,
  FaDollarSign,
} from 'react-icons/fa';

// Components
import Layout from '@/components/Layout';

const popularPairs = [
  { base: 'EUR', quote: 'USD', name: 'Euro / US Dollar' },
  { base: 'GBP', quote: 'USD', name: 'British Pound / US Dollar' },
  { base: 'USD', quote: 'JPY', name: 'US Dollar / Japanese Yen' },
  { base: 'AUD', quote: 'USD', name: 'Australian Dollar / US Dollar' },
  { base: 'USD', quote: 'CAD', name: 'US Dollar / Canadian Dollar' },
  { base: 'USD', quote: 'CHF', name: 'US Dollar / Swiss Franc' },
];

const majorPairs = [
  { base: 'EUR', quote: 'USD', name: 'Euro / US Dollar' },
  { base: 'GBP', quote: 'USD', name: 'British Pound / US Dollar' },
  { base: 'USD', quote: 'JPY', name: 'US Dollar / Japanese Yen' },
  { base: 'USD', quote: 'CHF', name: 'US Dollar / Swiss Franc' },
];

const minorPairs = [
  { base: 'EUR', quote: 'GBP', name: 'Euro / British Pound' },
  { base: 'EUR', quote: 'CHF', name: 'Euro / Swiss Franc' },
  { base: 'EUR', quote: 'JPY', name: 'Euro / Japanese Yen' },
  { base: 'GBP', quote: 'JPY', name: 'British Pound / Japanese Yen' },
];

const exoticPairs = [
  { base: 'USD', quote: 'MXN', name: 'US Dollar / Mexican Peso' },
  { base: 'USD', quote: 'ZAR', name: 'US Dollar / South African Rand' },
  { base: 'USD', quote: 'SGD', name: 'US Dollar / Singapore Dollar' },
  { base: 'USD', quote: 'TRY', name: 'US Dollar / Turkish Lira' },
];

const ForexPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale } = router;
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  // Colors & UI
  const bgGradient = useColorModeValue(
    'linear(to-b, blue.50, white)',
    'linear(to-b, gray.900, gray.800)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const accentColor = useColorModeValue('brand.ldn.400', 'brand.ldn.700');
  const accentBg = useColorModeValue('brand.ldn.400', 'brand.ldn.700');
  const softShadow = useColorModeValue('lg', 'dark-lg');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const statBg = useColorModeValue('blue.50', 'gray.700');

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false });
  const headingSize = useBreakpointValue({ base: '2xl', md: '3xl', lg: '4xl' });

  // Get the correct pairs for the active tab
  const getActivePairs = () => {
    switch (activeTab) {
      case 0: return popularPairs;
      case 1: return majorPairs;
      case 2: return minorPairs;
      case 3: return exoticPairs;
      default: return popularPairs;
    }
  };

  return (
    <Layout>
      <Box
        textAlign={locale === 'ar' ? 'right' : 'left'}
      >
        {/* Hero Section */}
        <Box
          py={{ base: 16, md: 24 }}
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
            bg="brand.ldn.500"
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
            bg="brand.ldn.700"
            opacity="0.2"
            transform="rotate(25deg)"
            roundedLeft="full"
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
                      {t('forex.hero.heading', 'Trade the Global Currency Markets with Confidence')}
                    </Heading>
                    <Text fontSize={{ base: 'lg', md: 'xl' }} maxW="600px">
                      {t('forex.hero.subtext', 'Access 50+ forex pairs with competitive spreads, advanced tools, and expert support. Start trading the largest financial market in the world today.')}
                    </Text>
                    <HStack spacing={4} pt={4}>
                      <Button
                        size={isMobile ? "md" : "lg"}
                        variant="bittrade-solid"
                        rightIcon={<ArrowForwardIcon />}
                        onClick={() => router.push('/signup/trader')}
                      >
                        {t('forex.hero.startButton', 'Start Trading Now')}
                      </Button>
                      <Button
                        size={isMobile ? "md" : "lg"}
                        variant="bittrade-outline"
                        onClick={() => router.push('/demo-account')}
                      >
                        {t('forex.hero.demoButton', 'Try Demo Account')}
                      </Button>
                    </HStack>
                  </VStack>
                </SlideFade>
              </GridItem>

              <GridItem display={{ base: "none", lg: "block" }}>
                <SlideFade in offsetY="20px" delay={0.2}>
                  <Flex justifyContent="center" alignItems="center" h="100%">
                    <Image
                      src="/images/forex-trading.png"
                      alt={t('forex.hero.imageAlt', 'Forex Trading Platform')}
                      fallback={
                        <Box
                          w="100%"
                          h="350px"
                          bg="brand.ldn.400"
                          borderRadius="xl"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon as={FaChartLine} boxSize={20} opacity={0.5} />
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
          {/* Trading Advantages */}
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
                {t('forex.advantages.heading', 'Why Trade Forex with bittrade')}
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                <VStack
                  align="start"
                  spacing={4}
                  p={6}
                  bg="gray.900"
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderColor={accentColor}
                >
                  <Flex
                    justify="center"
                    align="center"
                    w={12}
                    h={12}
                    bg="brand.ldn.500"
                    color="white"
                    borderRadius="lg"
                  >
                    <Icon as={FaGlobe} boxSize={5} />
                  </Flex>
                  <Heading size="md">
                    {t('forex.advantages.advantage1.title', '50+ Currency Pairs')}
                  </Heading>
                  <Text>
                    {t('forex.advantages.advantage1.description', 'Access all major, minor, and exotic forex pairs with competitive spreads starting from 0.8 pips.')}
                  </Text>
                </VStack>

                <VStack
                  align="start"
                  spacing={4}
                  p={6}
                  bg="gray.900"
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderColor={accentColor}
                >
                  <Flex
                    justify="center"
                    align="center"
                    w={12}
                    h={12}
                    bg="brand.ldn.500"
                    color="white"
                    borderRadius="lg"
                  >
                    <Icon as={FaLock} boxSize={5} />
                  </Flex>
                  <Heading size="md">
                    {t('forex.advantages.advantage2.title', 'Advanced Security')}
                  </Heading>
                  <Text>
                    {t('forex.advantages.advantage2.description', 'Trade with confidence knowing your funds are protected by bank-grade encryption and segregated accounts.')}
                  </Text>
                </VStack>

                <VStack
                  align="start"
                  spacing={4}
                  p={6}
                  bg="gray.900"
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderColor={accentColor}
                >
                  <Flex
                    justify="center"
                    align="center"
                    w={12}
                    h={12}
                    bg="brand.ldn.500"
                    color="white"
                    borderRadius="lg"
                  >
                    <Icon as={FaMobileAlt} boxSize={5} />
                  </Flex>
                  <Heading size="md">
                    {t('forex.advantages.advantage3.title', 'Multi-Platform Trading')}
                  </Heading>
                  <Text>
                    {t('forex.advantages.advantage3.description', 'Trade on our web platform, mobile apps, or connect with MetaTrader 4 & 5 for ultimate flexibility.')}
                  </Text>
                </VStack>

                <VStack
                  align="start"
                  spacing={4}
                  p={6}
                  bg="gray.900"
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderColor={accentColor}
                >
                  <Flex
                    justify="center"
                    align="center"
                    w={12}
                    h={12}
                    bg="brand.ldn.500"
                    color="white"
                    borderRadius="lg"
                  >
                    <Icon as={FaUserTie} boxSize={5} />
                  </Flex>
                  <Heading size="md">
                    {t('forex.advantages.advantage4.title', 'Expert Support')}
                  </Heading>
                  <Text>
                    {t('forex.advantages.advantage4.description', 'Get 24/5 support from our team of forex specialists who understand the markets and your needs.')}
                  </Text>
                </VStack>

                <VStack
                  align="start"
                  spacing={4}
                  p={6}
                  bg="gray.900"
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderColor={accentColor}
                >
                  <Flex
                    justify="center"
                    align="center"
                    w={12}
                    h={12}
                    bg="brand.ldn.500"
                    color="white"
                    borderRadius="lg"
                  >
                    <Icon as={FaClock} boxSize={5} />
                  </Flex>
                  <Heading size="md">
                    {t('forex.advantages.advantage5.title', 'Fast Execution')}
                  </Heading>
                  <Text>
                    {t('forex.advantages.advantage5.description', 'Execute trades in milliseconds with our high-speed infrastructure and deep liquidity providers.')}
                  </Text>
                </VStack>

                <VStack
                  align="start"
                  spacing={4}
                  p={6}
                  bg="gray.900"
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderColor={accentColor}
                >
                  <Flex
                    justify="center"
                    align="center"
                    w={12}
                    h={12}
                    bg="brand.ldn.500"
                    color="white"
                    borderRadius="lg"
                  >
                    <Icon as={FaHandshake} boxSize={5} />
                  </Flex>
                  <Heading size="md">
                    {t('forex.advantages.advantage6.title', 'Trading Resources')}
                  </Heading>
                  <Text>
                    {t('forex.advantages.advantage6.description', 'Access daily market analysis, trading signals, educational webinars, and research tools.')}
                  </Text>
                </VStack>
              </SimpleGrid>
            </Box>
          </SlideFade>

          {/* Trading Statistics */}
          <SlideFade in offsetY="30px">
            <Box
              color="white"
              p={{ base: 6, md: 10 }}
              borderRadius="xl"
              mb={16}
              position="relative"
              overflow="hidden"
            >
              {/* Background pattern */}
              <Box
                position="absolute"
                top="0"
                right="0"
                width="40%"
                height="100%"
                opacity="0.1"
                bgImage="url('/images/chart-pattern.png')"
                bgSize="cover"
                bgPosition="center"
              />

              <Heading
                fontSize={{ base: "xl", md: "2xl" }}
                mb={8}
                textAlign="center"
              >
                {t('forex.stats.heading', 'Forex by the Numbers')}
              </Heading>

              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                <Stat
                  bg="whiteAlpha.200"
                  p={4}
                  borderRadius="lg"
                  textAlign="center"
                >
                  <StatNumber fontSize={{ base: "2xl", md: "3xl" }}>6.6 trillion</StatNumber>
                  <StatLabel>{t('forex.stats.stat1.label', 'Daily Forex Volume')}</StatLabel>
                  <StatHelpText>{t('forex.stats.stat1.note', 'Global market (USD)')}</StatHelpText>
                </Stat>

                <Stat
                  bg="whiteAlpha.200"
                  p={4}
                  borderRadius="lg"
                  textAlign="center"
                >
                  <StatNumber fontSize={{ base: "2xl", md: "3xl" }}>0.8 pips</StatNumber>
                  <StatLabel>{t('forex.stats.stat2.label', 'Lowest Spread')}</StatLabel>
                  <StatHelpText>{t('forex.stats.stat2.note', 'EUR/USD average')}</StatHelpText>
                </Stat>

                <Stat
                  bg="whiteAlpha.200"
                  p={4}
                  borderRadius="lg"
                  textAlign="center"
                >
                  <StatNumber fontSize={{ base: "2xl", md: "3xl" }}>24/5</StatNumber>
                  <StatLabel>{t('forex.stats.stat3.label', 'Market Access')}</StatLabel>
                  <StatHelpText>{t('forex.stats.stat3.note', 'Sunday-Friday')}</StatHelpText>
                </Stat>

                <Stat
                  bg="whiteAlpha.200"
                  p={4}
                  borderRadius="lg"
                  textAlign="center"
                >
                  <StatNumber fontSize={{ base: "2xl", md: "3xl" }}>50+</StatNumber>
                  <StatLabel>{t('forex.stats.stat4.label', 'Currency Pairs')}</StatLabel>
                  <StatHelpText>{t('forex.stats.stat4.note', 'Available to trade')}</StatHelpText>
                </Stat>
              </SimpleGrid>

              <Flex justify="center" mt={10}>
                <Button
                  variant="bittrade-solid"
                  size="lg"
                  rightIcon={<ArrowForwardIcon />}
                  onClick={() => router.push('/signup/trader')}
                >
                  {t('forex.stats.cta', 'Open Trading Account')}
                </Button>
              </Flex>
            </Box>
          </SlideFade>

          {/* How to Start */}
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
                    {t('forex.howToStart.heading', 'How to Start Trading in Minutes')}
                  </Heading>

                  <VStack spacing={6} align="stretch">
                    <HStack spacing={4} alignItems="flex-start">
                      <Flex
                        minW={8}
                        h={8}
                        bg="brand.ldn.500"
                        color="white"
                        borderRadius="full"
                        justify="center"
                        align="center"
                        fontWeight="bold"
                      >
                        1
                      </Flex>
                      <VStack align="start" spacing={1}>
                        <Heading size="sm">{t('forex.howToStart.step1.title', 'Create an Account')}</Heading>
                        <Text>{t('forex.howToStart.step1.description', 'Sign up with your email, complete verification, and secure your account.')}</Text>
                      </VStack>
                    </HStack>

                    <HStack spacing={4} alignItems="flex-start">
                      <Flex
                        minW={8}
                        h={8}
                        bg="brand.ldn.500"
                        color="white"
                        borderRadius="full"
                        justify="center"
                        align="center"
                        fontWeight="bold"
                      >
                        2
                      </Flex>
                      <VStack align="start" spacing={1}>
                        <Heading size="sm">{t('forex.howToStart.step2.title', 'Fund Your Account')}</Heading>
                        <Text>{t('forex.howToStart.step2.description', 'Deposit funds via bank transfer, card payment, or electronic wallets.')}</Text>
                      </VStack>
                    </HStack>

                    <HStack spacing={4} alignItems="flex-start">
                      <Flex
                        minW={8}
                        h={8}
                        bg="brand.ldn.500"
                        color="white"
                        borderRadius="full"
                        justify="center"
                        align="center"
                        fontWeight="bold"
                      >
                        3
                      </Flex>
                      <VStack align="start" spacing={1}>
                        <Heading size="sm">{t('forex.howToStart.step3.title', 'Choose Your Platform')}</Heading>
                        <Text>{t('forex.howToStart.step3.description', 'Select your preferred trading platform: web, mobile, or MetaTrader.')}</Text>
                      </VStack>
                    </HStack>

                    <HStack spacing={4} alignItems="flex-start">
                      <Flex
                        minW={8}
                        h={8}
                        bg="brand.ldn.500"
                        color="white"
                        borderRadius="full"
                        justify="center"
                        align="center"
                        fontWeight="bold"
                      >
                        4
                      </Flex>
                      <VStack align="start" spacing={1}>
                        <Heading size="sm">{t('forex.howToStart.step4.title', 'Start Trading')}</Heading>
                        <Text>{t('forex.howToStart.step4.description', 'Select your currency pair, analyze the market, and execute your first trade.')}</Text>
                      </VStack>
                    </HStack>
                  </VStack>

                  <Button
                    mt={8}
                    variant="bittrade-solid"
                    rightIcon={<ArrowForwardIcon />}
                    onClick={() => router.push('/signup/trader')}
                  >
                    {t('forex.howToStart.getStartedButton', 'Get Started Now')}
                  </Button>
                </GridItem>

                <GridItem display={{ base: "none", lg: "block" }}>
                  <Box
                    
                    p={6}
                    borderRadius="xl"
                    h="100%"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                  >
                    <Heading size="md" mb={4} color={accentColor}>
                      {t('forex.traderTips.heading', 'Pro Trader Tips')}
                    </Heading>

                    <List spacing={4}>
                      <ListItem>
                        <HStack alignItems="flex-start">
                          <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
                          <Text>{t('forex.traderTips.tip1', 'Always use stop-loss orders to protect your capital from significant market moves.')}</Text>
                        </HStack>
                      </ListItem>

                      <ListItem>
                        <HStack alignItems="flex-start">
                          <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
                          <Text>{t('forex.traderTips.tip2', 'Consider starting with a demo account to practice without risking real capital.')}</Text>
                        </HStack>
                      </ListItem>

                      <ListItem>
                        <HStack alignItems="flex-start">
                          <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
                          <Text>{t('forex.traderTips.tip3', 'Be aware of major economic releases that can impact currency pairs.')}</Text>
                        </HStack>
                      </ListItem>

                      <ListItem>
                        <HStack alignItems="flex-start">
                          <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
                          <Text>{t('forex.traderTips.tip4', 'Start with major pairs which typically have lower spreads and higher liquidity.')}</Text>
                        </HStack>
                      </ListItem>
                    </List>

                    <Divider my={6} />

                    <Box
                      bg="blue.50"
                      p={4}
                      borderRadius="md"
                      borderLeft="4px solid"
                      borderColor="blue.500"
                    >
                      <Text fontWeight="bold" fontSize="sm" color="blue.700">
                        {t('forex.traderTips.reminder', 'Remember:')}
                      </Text>
                      <Text fontSize="sm" color="blue.700">
                        {t('forex.traderTips.risk', 'Forex trading involves significant risk. Only trade with capital you can afford to lose.')}
                      </Text>
                    </Box>
                  </Box>
                </GridItem>
              </Grid>
            </Box>
          </SlideFade>

          {/* Major Currency Information */}
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
                {t('forex.currencies.heading', 'Major Currencies Overview')}
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                <VStack
                  align="center"
                  spacing={4}
                  p={6}
                  borderRadius="lg"
                  boxShadow="md"
                >
                  <Flex
                    justify="center"
                    align="center"
                    w={16}
                    h={16}
                    bg="blue.100"
                    color="blue.600"
                    borderRadius="full"
                  >
                    <Icon as={FaEuroSign} boxSize={8} />
                  </Flex>
                  <Heading size="md">EUR</Heading>
                  <Text fontWeight="bold">{t('forex.currencies.currency1.name', 'Euro')}</Text>
                  <Text fontSize="sm" textAlign="center">
                    {t('forex.currencies.currency1.description', 'The official currency of the Eurozone, representing 19 of the 27 member states of the European Union.')}
                  </Text>
                </VStack>

                <VStack
                  align="center"
                  spacing={4}
                  p={6}
                  borderRadius="lg"
                  boxShadow="md"
                >
                  <Flex
                    justify="center"
                    align="center"
                    w={16}
                    h={16}
                    bg="blue.100"
                    color="blue.600"
                    borderRadius="full"
                  >
                    <Icon as={FaDollarSign} boxSize={8} />
                  </Flex>
                  <Heading size="md">USD</Heading>
                  <Text fontWeight="bold">{t('forex.currencies.currency2.name', 'US Dollar')}</Text>
                  <Text fontSize="sm" textAlign="center">
                    {t('forex.currencies.currency2.description', 'The world\'s primary reserve currency and the most traded currency in the foreign exchange market.')}
                  </Text>
                </VStack>

                <VStack
                  align="center"
                  spacing={4}
                  p={6}
                  borderRadius="lg"
                  boxShadow="md"
                >
                  <Flex
                    justify="center"
                    align="center"
                    w={16}
                    h={16}
                    bg="blue.100"
                    color="blue.600"
                    borderRadius="full"
                  >
                    <Icon as={FaPoundSign} boxSize={8} />
                  </Flex>
                  <Heading size="md">GBP</Heading>
                  <Text fontWeight="bold">{t('forex.currencies.currency3.name', 'British Pound')}</Text>
                  <Text fontSize="sm" textAlign="center">
                    {t('forex.currencies.currency3.description', 'The official currency of the United Kingdom and one of the strongest currencies in the world.')}
                  </Text>
                </VStack>

                <VStack
                  align="center"
                  spacing={4}
                  p={6}
                  borderRadius="lg"
                  boxShadow="md"
                >
                  <Flex
                    justify="center"
                    align="center"
                    w={16}
                    h={16}
                    bg="blue.100"
                    color="blue.600"
                    borderRadius="full"
                  >
                    <Icon as={FaYenSign} boxSize={8} />
                  </Flex>
                  <Heading size="md">JPY</Heading>
                  <Text fontWeight="bold">{t('forex.currencies.currency4.name', 'Japanese Yen')}</Text>
                  <Text fontSize="sm" textAlign="center">
                    {t('forex.currencies.currency4.description', 'The third most traded currency in the foreign exchange market and a popular safe-haven currency.')}
                  </Text>
                </VStack>
              </SimpleGrid>

              <Flex justify="center" mt={8}>
                <Button
                  variant="outline"
                  colorScheme="blue"
                  rightIcon={<InfoIcon />}
                  onClick={() => router.push('/education/currency-guide')}
                >
                  {t('forex.currencies.learnButton', 'Learn More About Currencies')}
                </Button>
              </Flex>
            </Box>
          </SlideFade>
          
           {/* Education and Resources */}
          <SlideFade in offsetY="30px">
            <Box
              p={{ base: 4, md: 8 }}
              borderRadius="xl"
              boxShadow={softShadow}
              mb={8}
            >
              <Heading
                fontSize={{ base: "xl", md: "2xl" }}
                mb={6}
                color={accentColor}
                textAlign="center"
              >
                {t('forex.education.heading', 'Education & Resources')}
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <VStack
                  spacing={4}
                  p={6}
                  borderRadius="lg"
                  alignItems="flex-start"
                >
                  <Heading size="md">{t('forex.education.resource1.title', 'Forex Trading Guide')}</Heading>
                  <Text fontSize="sm">
                    {t('forex.education.resource1.description', 'Comprehensive guide to forex trading basics, strategies, and market analysis techniques.')}
                  </Text>
                  <Button color="brand.ldn.500" fontWeight="bold" href="/education/forex-guide">
                    {t('forex.education.resource1.link', 'Read the Guide →')}
                  </Button>
                </VStack>

                <VStack
                  spacing={4}
                  p={6}
                  borderRadius="lg"
                  alignItems="flex-start"
                >
                  <Heading size="md">{t('forex.education.resource2.title', 'Weekly Market Analysis')}</Heading>
                  <Text fontSize="sm">
                    {t('forex.education.resource2.description', 'Stay informed with our expert analysis of market trends, major events, and trading opportunities.')}
                  </Text>
                  <Button color="brand.ldn.500" fontWeight="bold" href="/research/market-analysis">
                    {t('forex.education.resource2.link', 'View Analysis →')}
                  </Button>
                </VStack>

                <VStack
                  spacing={4}
                  p={6}
                  borderRadius="lg"
                  alignItems="flex-start"
                >
                  <Heading size="md">{t('forex.education.resource3.title', 'Trading Webinars')}</Heading>
                  <Text fontSize="sm">
                    {t('forex.education.resource3.description', 'Join our live webinars with professional traders covering strategies, risk management, and more.')}
                  </Text>
                  <Button color="brand.ldn.500" fontWeight="bold" href="/education/webinars">
                    {t('forex.education.resource3.link', 'Register Now →')}
                  </Button>
                </VStack>
              </SimpleGrid>
            </Box>
          </SlideFade>

          {/* CTA Section */}
          <SlideFade in offsetY="30px">
            <Box
              p={{ base: 6, md: 12 }}
              borderRadius="xl"
              boxShadow="2xl"
              mb={8}
              bg="brand.ldn.400"
              textAlign="center"
              position="relative"
              overflow="hidden"
            >
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
              {/* Background pattern */}
              <Box
                position="absolute"
                bottom="-50%"
                right="-10%"
                transform="rotate(45deg)"
                w="60%"
                h="200%"
                opacity="0.2"
                borderRadius="full"
              />

              <VStack spacing={6} position="relative" zIndex={2} >
                <Heading size="xl">
                  {t('forex.cta.heading', 'Ready to Trade the Global Currency Markets?')}
                </Heading>
                <Text fontSize={{ base: 'md', md: 'lg' }} maxW="800px">
                  {t('forex.cta.description', 'Join thousands of traders worldwide who trust bittrade for their forex trading. Get started with as little as $100.')}
                </Text>

                <HStack spacing={4} pt={4}>
                  <Button
                    variant="bittrade-solid"
                    rightIcon={<ArrowForwardIcon />}
                    onClick={() => router.push('/signup/trader')}
                  >
                    {t('forex.cta.accountButton', 'Open Live Account')}
                  </Button>
                  <Button
                    variant="bittrade-solid"
                    onClick={() => router.push('/demo')}
                  >
                    {t('forex.cta.demoButton', 'Try Demo Account')}
                  </Button>
                </HStack>

                <Text fontSize="sm" opacity={0.8} mt={4}>
                  {t('forex.cta.disclaimer', 'Forex trading involves significant risk. Only trade with capital you can afford to lose.')}
                </Text>
              </VStack>
            </Box>
          </SlideFade>         
        </Container>
      </Box>
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

export default ForexPage;