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
  FaBitcoin,
  FaEthereum,
  FaWallet,
  FaShieldAlt,
  FaRegLightbulb,
  FaUniversity,
  FaRegChartBar,
} from 'react-icons/fa';

// Components
import Layout from '@/components/Layout';
import CryptoMarketplace from '@/components/trading/CryptoMarketplace';
import MarketTicker from '@/components/MarketTicker';
import CryptoMatrix from '@/components/CryptoMatrix';

// List of popular cryptocurrencies to feature
const popularCryptos = [
  { 
    symbol: 'BTC', 
    name: 'Bitcoin', 
    icon: FaBitcoin,
    description: 'The original cryptocurrency and largest by market capitalization' 
  },
  { 
    symbol: 'ETH', 
    name: 'Ethereum', 
    icon: FaEthereum,
    description: 'Blockchain platform for decentralized applications and smart contracts' 
  },
  { 
    symbol: 'BNB', 
    name: 'Binance Coin', 
    description: 'Native token of the Binance exchange and BNB Chain ecosystem' 
  },
  { 
    symbol: 'XRP', 
    name: 'Ripple', 
    description: 'Digital payment protocol for fast, low-cost international transfers' 
  },
  { 
    symbol: 'ADA', 
    name: 'Cardano', 
    description: 'Proof-of-stake blockchain platform with focus on sustainability' 
  },
  { 
    symbol: 'SOL', 
    name: 'Solana', 
    description: 'High-performance blockchain supporting thousands of transactions per second' 
  },
];

const CryptoPage = () => {
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
          <Box
            position="absolute"
            top="40%"
            right="-5%"
            w="30%"
            h="60%"
            bg="brand.forex.400"
            opacity="0.4"
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
                      {t('crypto.hero.heading', 'Trade Digital Assets on a Secure, Professional Platform')}
                    </Heading>
                    <Text fontSize={{ base: 'lg', md: 'xl' }} maxW="600px">
                      {t('crypto.hero.subtext', 'Access 50+ cryptocurrencies with competitive spreads, institutional-grade security, and expert market insights. Enter the future of finance today.')}
                    </Text>
                    <HStack spacing={4} pt={4}>
                      <Button
                        size={isMobile ? "md" : "lg"}
                        variant="bittrade-solid"
                        rightIcon={<ArrowForwardIcon />}
                        onClick={() => router.push('/signup/trader')}
                      >
                        {t('crypto.hero.startButton', 'Start Trading Now')}
                      </Button>
                      <Button
                        size={isMobile ? "md" : "lg"}
                        variant="bittrade-outline"
                        onClick={() => router.push('/demo-account')}
                      >
                        {t('crypto.hero.demoButton', 'Try Demo Account')}
                      </Button>
                    </HStack>
                  </VStack>
                </SlideFade>
              </GridItem>

              <GridItem display={{ base: "none", lg: "block" }}>
                <SlideFade in offsetY="20px" delay={0.2}>
                  <Flex justifyContent="center" alignItems="center" h="100%">
                    <Image
                      src="/images/crypto-trading.png"
                      alt={t('crypto.hero.imageAlt', 'Cryptocurrency Trading Platform')}
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
          {/* Crypto Marketplace Section */}
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
                {t('crypto.marketplace.heading', 'Explore Cryptocurrency Markets')}
              </Heading>

              <CryptoMarketplace />

            </Box>
          </SlideFade>

          {/* Why Crypto Section */}
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
                {t('crypto.whyCrypto.heading', 'Why Trade Cryptocurrencies with BitTrade')}
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
                    {t('crypto.whyCrypto.advantage1.title', 'Institutional-Grade Security')}
                  </Heading>
                  <Text>
                    {t('crypto.whyCrypto.advantage1.description', 'Cold storage for 95% of assets, multi-signature wallets, and 24/7 security monitoring to keep your investments safe.')}
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
                    {t('crypto.whyCrypto.advantage2.title', '50+ Cryptocurrencies')}
                  </Heading>
                  <Text>
                    {t('crypto.whyCrypto.advantage2.description', 'Trade major cryptocurrencies like Bitcoin and Ethereum, plus a wide range of promising altcoins and tokens.')}
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
                    {t('crypto.whyCrypto.advantage3.title', 'Trade Anywhere')}
                  </Heading>
                  <Text>
                    {t('crypto.whyCrypto.advantage3.description', 'Access markets 24/7 with our web platform and mobile apps, never miss an opportunity in this fast-moving market.')}
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
                    {t('crypto.whyCrypto.advantage4.title', 'Advanced Trading Tools')}
                  </Heading>
                  <Text>
                    {t('crypto.whyCrypto.advantage4.description', 'Technical analysis indicators, order types, and real-time market data to help you make informed trading decisions.')}
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
                    <Icon as={FaWallet} boxSize={5} />
                  </Flex>
                  <Heading size="md">
                    {t('crypto.whyCrypto.advantage5.title', 'Multiple Payment Options')}
                  </Heading>
                  <Text>
                    {t('crypto.whyCrypto.advantage5.description', 'Fund your account with bank transfers, cards, or digital payments. Withdraw to your bank or crypto wallet.')}
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
                    {t('crypto.whyCrypto.advantage6.title', 'Dedicated Support')}
                  </Heading>
                  <Text>
                    {t('crypto.whyCrypto.advantage6.description', 'Our crypto-knowledgeable support team is available 24/7 to help with any questions or issues.')}
                  </Text>
                </VStack>
              </SimpleGrid>
            </Box>
          </SlideFade>

          {/* Understanding Crypto Section */}
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
                {t('crypto.understanding.heading', 'Understanding Cryptocurrency')}
              </Heading>

              <Text textAlign="center" mb={8} maxW="800px" mx="auto">
                {t('crypto.understanding.intro', 'Cryptocurrencies represent a technological revolution in finance, offering new ways to transfer value, build applications, and rethink traditional financial systems.')}
              </Text>

              <Accordion allowToggle mb={8}>
                <AccordionItem mb={4} border="none" overflow="hidden" borderRadius="md" bg={useColorModeValue('gray.50', 'gray.700')}>
                  <h2>
                    <AccordionButton py={4} _expanded={{ bg: accentColor, color: 'white' }}>
                      <Box flex="1" textAlign="left">
                        <Heading size="sm">{t('crypto.understanding.what.title', 'What is Cryptocurrency?')}</Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text mb={4}>
                      {t('crypto.understanding.what.p1', 'Cryptocurrency is a digital or virtual currency secured by cryptography, making it nearly impossible to counterfeit. Most cryptocurrencies operate on decentralized networks based on blockchain technology—a distributed ledger enforced by a network of computers.')}
                    </Text>
                    <Text>
                      {t('crypto.understanding.what.p2', 'Unlike traditional currencies issued by governments (fiat), cryptocurrencies typically operate independently of central authorities. This decentralization is one of their defining features, offering potential advantages in security, transparency, and resistance to censorship.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem mb={4} border="none" overflow="hidden" borderRadius="md" bg={useColorModeValue('gray.50', 'gray.700')}>
                  <h2>
                    <AccordionButton py={4} _expanded={{ bg: accentColor, color: 'white' }}>
                      <Box flex="1" textAlign="left">
                        <Heading size="sm">{t('crypto.understanding.blockchain.title', 'Blockchain Technology')}</Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text mb={4}>
                      {t('crypto.understanding.blockchain.p1', 'Blockchain is the underlying technology behind most cryptocurrencies. It is a distributed ledger that records all transactions across a network of computers. Each block in the chain contains a number of transactions, and every time a new transaction occurs, a record of it is added to every participant\'s ledger.')}
                    </Text>
                    <Text>
                      {t('crypto.understanding.blockchain.p2', 'This decentralized, transparent nature makes blockchain highly secure and resistant to modification, as altering any block would require consensus from the majority of the network.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem mb={4} border="none" overflow="hidden" borderRadius="md" bg={useColorModeValue('gray.50', 'gray.700')}>
                  <h2>
                    <AccordionButton py={4} _expanded={{ bg: accentColor, color: 'white' }}>
                      <Box flex="1" textAlign="left">
                        <Heading size="sm">{t('crypto.understanding.types.title', 'Types of Cryptocurrencies')}</Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text mb={4}>
                      {t('crypto.understanding.types.p1', 'There are thousands of cryptocurrencies, each with different purposes and technologies:')}
                    </Text>
                    <List spacing={2} mb={4}>
                      <ListItem>
                        <Text fontWeight="bold">
                          {t('crypto.understanding.types.coins', 'Coins:')} 
                        </Text>
                        <Text>
                          {t('crypto.understanding.types.coinsDesc', 'Bitcoin, Litecoin - Primarily designed as digital currencies for transactions.')}
                        </Text>
                      </ListItem>
                      <ListItem>
                        <Text fontWeight="bold">
                          {t('crypto.understanding.types.platforms', 'Platform Tokens:')} 
                        </Text>
                        <Text>
                          {t('crypto.understanding.types.platformsDesc', 'Ethereum, Solana, Cardano - Support decentralized applications and smart contracts.')}
                        </Text>
                      </ListItem>
                      <ListItem>
                        <Text fontWeight="bold">
                          {t('crypto.understanding.types.stablecoins', 'Stablecoins:')} 
                        </Text>
                        <Text>
                          {t('crypto.understanding.types.stablecoinsDesc', 'USDT, USDC - Pegged to stable assets like the US dollar to reduce volatility.')}
                        </Text>
                      </ListItem>
                      <ListItem>
                        <Text fontWeight="bold">
                          {t('crypto.understanding.types.utility', 'Utility Tokens:')} 
                        </Text>
                        <Text>
                          {t('crypto.understanding.types.utilityDesc', 'BNB, LINK - Serve specific functions within their respective ecosystems.')}
                        </Text>
                      </ListItem>
                    </List>
                    <Text>
                      {t('crypto.understanding.types.p2', 'Each type has its own use cases, market dynamics, and investment considerations.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>

              <Flex justify="center" mt={6}>
                <Button
                  variant="outline"
                  colorScheme="blue"
                  rightIcon={<ExternalLinkIcon />}
                  onClick={() => router.push('/education/crypto-basics')}
                >
                  {t('crypto.understanding.learnButton', 'Learn More About Cryptocurrencies')}
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
                {t('crypto.stats.heading', 'Cryptocurrency Market Statistics')}
              </Heading>

              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                <Stat
                  bg="whiteAlpha.200"
                  p={4}
                  borderRadius="lg"
                  textAlign="center"
                >
                  <StatNumber fontSize={{ base: "2xl", md: "3xl" }}>$2.7+ Trillion</StatNumber>
                  <StatLabel>{t('crypto.stats.stat1.label', 'Global Market Cap')}</StatLabel>
                  <StatHelpText>{t('crypto.stats.stat1.note', 'Combined value')}</StatHelpText>
                </Stat>

                <Stat
                  bg="whiteAlpha.200"
                  p={4}
                  borderRadius="lg"
                  textAlign="center"
                >
                  <StatNumber fontSize={{ base: "2xl", md: "3xl" }}>24/7</StatNumber>
                  <StatLabel>{t('crypto.stats.stat2.label', 'Market Access')}</StatLabel>
                  <StatHelpText>{t('crypto.stats.stat2.note', 'Trade anytime')}</StatHelpText>
                </Stat>

                <Stat
                  bg="whiteAlpha.200"
                  p={4}
                  borderRadius="lg"
                  textAlign="center"
                >
                  <StatNumber fontSize={{ base: "2xl", md: "3xl" }}>500M+</StatNumber>
                  <StatLabel>{t('crypto.stats.stat3.label', 'Global Users')}</StatLabel>
                  <StatHelpText>{t('crypto.stats.stat3.note', 'And growing rapidly')}</StatHelpText>
                </Stat>

                <Stat
                  bg="whiteAlpha.200"
                  p={4}
                  borderRadius="lg"
                  textAlign="center"
                >
                  <StatNumber fontSize={{ base: "2xl", md: "3xl" }}>50+</StatNumber>
                  <StatLabel>{t('crypto.stats.stat4.label', 'Cryptocurrencies')}</StatLabel>
                  <StatHelpText>{t('crypto.stats.stat4.note', 'Available on BitTrade')}</StatHelpText>
                </Stat>
              </SimpleGrid>

              <Flex justify="center" mt={10}>
                <Button
                  variant="bittrade-solid"
                  size="lg"
                  rightIcon={<ArrowForwardIcon />}
                  onClick={() => router.push('/signup/trader')}
                >
                  {t('crypto.stats.cta', 'Open Trading Account')}
                </Button>
              </Flex>
              </Box>
            </Box>
          </SlideFade>

          {/* Popular Cryptos */}
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
                {t('crypto.popular.heading', 'Popular Cryptocurrencies')}
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {popularCryptos.map((crypto, index) => (
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
                        {crypto.icon ? (
                          <Icon as={crypto.icon} boxSize={6} />
                        ) : (
                          <Text fontWeight="bold" fontSize="lg">{crypto.symbol}</Text>
                        )}
                      </Flex>
                      <Box>
                        <Heading size="md">{crypto.name}</Heading>
                        <Text color="gray.500" fontSize="sm">{crypto.symbol}</Text>
                      </Box>
                    </Flex>
                    <Text fontSize="sm" mb={4}>
                      {crypto.description}
                    </Text>
                    <Button
                      variant="bittrade-outline"
                      size="sm"
                      width="full"
                      onClick={() => router.push(`/markets/crypto/${crypto.symbol.toLowerCase()}`)}
                    >
                      {t('crypto.popular.viewButton', 'View Details')}
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
                    {t('crypto.getStarted.heading', 'How to Start Trading Crypto in Minutes')}
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
                        <Heading size="sm">{t('crypto.getStarted.step1.title', 'Create Your Account')}</Heading>
                        <Text mt={1}>
                          {t('crypto.getStarted.step1.desc', 'Complete our simple registration process with your email and basic information.')}
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
                        2
                      </Flex>
                      <Box>
                        <Heading size="sm">{t('crypto.getStarted.step2.title', 'Verify Your Identity')}</Heading>
                        <Text mt={1}>
                          {t('crypto.getStarted.step2.desc', 'Complete our secure KYC verification process to ensure the safety of all users.')}
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
                        <Heading size="sm">{t('crypto.getStarted.step3.title', 'Fund Your Account')}</Heading>
                        <Text mt={1}>
                          {t('crypto.getStarted.step3.desc', 'Deposit funds using bank transfer, credit/debit card, or cryptocurrency.')}
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
                        <Heading size="sm">{t('crypto.getStarted.step4.title', 'Start Trading')}</Heading>
                        <Text mt={1}>
                          {t('crypto.getStarted.step4.desc', 'Browse markets, analyze trends, and execute your first trade on our intuitive platform.')}
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
                    {t('crypto.getStarted.button', 'Open Account Now')}
                  </Button>
                </GridItem>

                <GridItem display="flex" justifyContent="center" alignItems="center">
                  <Image
                    src="/images/crypto-onboarding.png"
                    alt={t('crypto.getStarted.imageAlt', 'Crypto Trading Onboarding')}
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
                        <Icon as={FaWallet} boxSize={16} opacity={0.3} />
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
                {t('crypto.faq.heading', 'Frequently Asked Questions')}
              </Heading>

              <Accordion allowToggle>
                <AccordionItem mb={4} border="1px solid" borderColor={borderColor} borderRadius="md" overflow="hidden">
                  <h2>
                    <AccordionButton py={4}>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        {t('crypto.faq.q1', 'Is cryptocurrency trading safe?')}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text>
                      {t('crypto.faq.a1', 'Cryptocurrency trading involves risk, as with any investment. Market volatility can lead to significant price swings. At BitTrade, we implement industry-leading security measures to protect your assets and provide educational resources to help you make informed decisions. We recommend starting with smaller amounts and learning about market dynamics before committing significant capital.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem mb={4} border="1px solid" borderColor={borderColor} borderRadius="md" overflow="hidden">
                  <h2>
                    <AccordionButton py={4}>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        {t('crypto.faq.q2', 'What cryptocurrencies can I trade on BitTrade?')}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text>
                      {t('crypto.faq.a2', 'BitTrade offers over 50 cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), Binance Coin (BNB), Cardano (ADA), Solana (SOL), and many more. We regularly review and add new cryptocurrencies based on market demand, liquidity, and project fundamentals. Visit our Markets page for a complete list of available trading pairs.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem mb={4} border="1px solid" borderColor={borderColor} borderRadius="md" overflow="hidden">
                  <h2>
                    <AccordionButton py={4}>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        {t('crypto.faq.q3', 'What are the fees for crypto trading?')}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text>
                      {t('crypto.faq.a3', 'BitTrade offers competitive fee structures starting at 0.1% per trade. Fees vary based on trading volume and membership tier. We provide volume-based discounts for active traders. There may be additional fees for certain deposit and withdrawal methods. Please refer to our Fees page for detailed information on our current fee structure.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem mb={4} border="1px solid" borderColor={borderColor} borderRadius="md" overflow="hidden">
                  <h2>
                    <AccordionButton py={4}>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        {t('crypto.faq.q4', 'How do I store my cryptocurrencies?')}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text mb={3}>
                      {t('crypto.faq.a4.p1', 'BitTrade provides secure wallet services for all supported cryptocurrencies. We store 95% of assets in cold storage (offline) for maximum security. For active traders, our platform offers hot wallets for immediate access to funds.')}
                    </Text>
                    <Text>
                      {t('crypto.faq.a4.p2', 'While you can store cryptocurrencies on BitTrade, for long-term holding, many users prefer personal wallets. We support withdrawals to external wallets and provide guides on wallet security best practices.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem mb={4} border="1px solid" borderColor={borderColor} borderRadius="md" overflow="hidden">
                  <h2>
                    <AccordionButton py={4}>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        {t('crypto.faq.q5', 'How do I get started with crypto if I\'m completely new?')}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text mb={3}>
                      {t('crypto.faq.a5.p1', 'BitTrade is designed to be beginner-friendly. We recommend these steps for newcomers:')}
                    </Text>
                    <List spacing={2} mb={3}>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        {t('crypto.faq.a5.step1', 'Explore our Learning Center with guides and tutorials')}
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        {t('crypto.faq.a5.step2', 'Open a demo account to practice without risk')}
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        {t('crypto.faq.a5.step3', 'Start with a small investment in established cryptocurrencies')}
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        {t('crypto.faq.a5.step4', 'Utilize our market analysis tools and educational webinars')}
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        {t('crypto.faq.a5.step5', 'Reach out to our support team with any questions')}
                      </ListItem>
                    </List>
                    <Text>
                      {t('crypto.faq.a5.p2', 'Remember that education is key in cryptocurrency trading. Take time to understand the fundamentals before making significant investments.')}
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
                  {t('crypto.faq.moreButton', 'View All FAQs')}
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
                    {t('crypto.cta.heading', 'Start Your Cryptocurrency Journey Today')}
                  </Heading>
                  <Text fontSize={{ base: "md", md: "lg" }} maxW="2xl">
                    {t('crypto.cta.text', 'Join thousands of traders on our secure and professional platform. Access 50+ cryptocurrencies, advanced tools, and expert support to navigate the digital asset revolution.')}
                  </Text>
                  <HStack spacing={4} pt={4}>
                    <Button
                      variant="bittrade-solid"
                      rightIcon={<ArrowForwardIcon />}
                      onClick={() => router.push('/signup/trader')}
                    >
                      {t('crypto.cta.mainButton', 'Create Free Account')}
                    </Button>
                    <Button
                      variant="bittrade-solid"
                      _hover={{ bg: "whiteAlpha.200" }}
                      onClick={() => router.push('/demo')}
                    >
                      {t('crypto.cta.secondaryButton', 'Try our demo')}
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

export default CryptoPage;