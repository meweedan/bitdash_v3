import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
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
  Grid,
  GridItem,
  Divider,
  Image,
  List,
  ListItem,
  ListIcon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { 
  FaShieldAlt,
  FaChartLine,
  FaGlobeAmericas,
  FaMobileAlt,
  FaLock,
  FaMoneyBillWave,
  FaUser,
  FaUserTie,
  FaDesktop,
  FaLaptopCode,
  FaBitcoin,
  FaEthereum,
  FaCheckCircle,
  FaAward,
  FaUniversity,
  FaHandshake,
  FaClock,
  FaHeadset,
  FaRegCreditCard,
  FaToolbox,
  FaTimes,
  FaPhoneAlt
} from 'react-icons/fa';
import ForexPairDisplay from '../trading/ForexPairDisplay';
import CryptoMarketplace from '../trading/CryptoMarketplace';
import TradingPlatformPreview from '../trading/TradingPlatformPreview';

const TradeLandingBrowser = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const containerRef = useRef(null);
  
  const bgGradient = useColorModeValue(
    'linear(to-b, blue.50, white)',
    'linear(to-b, gray.900, black)'
  );
  
  const glassCardBg = useColorModeValue('whiteAlpha.900', 'whiteAlpha.100');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(
    useSpring(scrollYProgress, {
      mass: 0.1,
      stiffness: 100,
      damping: 20
    }),
    [0, 1],
    [1, 0.92]
  );

  // Main trading products
  const tradingProducts = [
    {
      icon: FaGlobeAmericas,
      title: 'Forex',
      description: 'Trade 80+ currency pairs with tight spreads starting from 0.1 pips and leverage up to 1:500',
      highlights: ['Major, Minor & Exotic Pairs', 'Institutional-grade liquidity', 'Advanced charting tools'],
      color: 'brand.tradebrowser.400'
    },
    {
      icon: FaBitcoin,
      title: 'Cryptocurrencies',
      description: 'Access 50+ cryptocurrencies with institutional liquidity and competitive fees',
      highlights: ['BTC, ETH, SOL, ADA & more', '24/7 trading availability', 'Cold storage security'],
      color: 'brand.tradebrowser.500'
    },
    {
      icon: FaChartLine,
      title: 'Indices & Stocks',
      description: 'Diversify with global indices and stocks from US, EU, and Asian markets',
      highlights: ['0% commission on stocks', 'Fractional shares available', 'Extended market hours'],
      color: 'brand.tradebrowser.600'
    },
    {
      icon: FaMoneyBillWave,
      title: 'Commodities',
      description: 'Trade gold, silver, oil and other commodities with competitive pricing',
      highlights: ['Spot & futures contracts', 'Low margin requirements', 'Hedge against inflation'],
      color: 'brand.tradebrowser.700'
    }
  ];

  // Platform features
  const platformFeatures = [
    {
      icon: FaDesktop,
      title: 'Advanced Trading Platforms',
      description: 'Trade on our proprietary platform, MetaTrader 5, or via robust API solutions',
      color: 'brand.tradebrowser.400'
    },
    {
      icon: FaLock,
      title: 'Bank-Grade Security',
      description: 'Funds held in segregated accounts with multi-layer security protocols',
      color: 'brand.tradebrowser.500'
    },
    {
      icon: FaMobileAlt,
      title: 'Mobile Trading',
      description: 'Trade anytime, anywhere with our award-winning mobile applications',
      color: 'brand.tradebrowser.600'
    },
    {
      icon: FaHeadset,
      title: '24/7 Support',
      description: 'Dedicated customer support in multiple languages via chat, email, and phone',
      color: 'brand.tradebrowser.700'
    }
  ];

  // Regulatory information
  const regulatoryInfo = [
    {
      authority: 'Financial Conduct Authority (FCA)',
      license: 'Reference No. 612025',
      country: 'United Kingdom',
      logo: '/images/regulatory/fca-logo.png'
    },
    {
      authority: 'Cyprus Securities and Exchange Commission (CySEC)',
      license: 'License No. 250/14',
      country: 'Cyprus',
      logo: '/images/regulatory/cysec-logo.png'
    },
    {
      authority: 'Australian Securities and Investments Commission (ASIC)',
      license: 'AFSL No. 417727',
      country: 'Australia',
      logo: '/images/regulatory/asic-logo.png'
    },
    {
      authority: 'Dubai Financial Services Authority (DFSA)',
      license: 'License No. F003456',
      country: 'UAE',
      logo: '/images/regulatory/dfsa-logo.png'
    }
  ];

  // Account types
  const accountTypes = [
    {
      name: 'Standard',
      minDeposit: '$100',
      spread: 'From 1.0 pips',
      leverage: 'Up to 1:200',
      features: ['100+ trading instruments', '24/5 support', 'Standard execution'],
      ideal: 'Beginner traders',
      color: 'brand.tradebrowser.400'
    },
    {
      name: 'Premium',
      minDeposit: '$1,000',
      spread: 'From 0.5 pips',
      leverage: 'Up to 1:300',
      features: ['100+ trading instruments', '24/5 dedicated support', 'Priority execution'],
      ideal: 'Active traders',
      color: 'brand.tradebrowser.500',
      popular: true
    },
    {
      name: 'Professional',
      minDeposit: '$10,000',
      spread: 'From 0.1 pips',
      leverage: 'Up to 1:500',
      features: ['All available instruments', '24/7 personal account manager', 'Ultra-fast execution'],
      ideal: 'Professional traders',
      color: 'brand.tradebrowser.600'
    },
    {
      name: 'Institutional',
      minDeposit: '$50,000',
      spread: 'Raw spreads',
      leverage: 'Customized',
      features: ['All available instruments', 'API trading', 'Custom solutions'],
      ideal: 'Institutions & funds',
      color: 'brand.tradebrowser.700'
    }
  ];

  return (
    <Box ref={containerRef} bg={bgGradient} overflow="hidden">
      <Container maxW="8xl" pt={8}>
        {/* Hero Section */}
        <motion.div style={{ scale: heroScale }}>
          <Flex
            direction="column"
            align="center"
            textAlign="center"
            position="relative"
          >
            <VStack spacing={8} maxW="4xl">
              <Heading
                fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
                bgGradient="linear(to-r, brand.tradebrowser.500, brand.tradebrowser.700)"
                bgClip="text"
              >
                {t('trade.hero.title', 'Trade with Confidence')}
              </Heading>
              <Text fontSize={{ base: 'xl', md: '2xl' }} opacity={0.8} maxW="3xl">
                {t('trade.hero.subtitle', 'Global markets, institutional-grade technology, regulated for your protection')}
              </Text>

              <HStack spacing={6} pt={8}>
                <Button
                  size="lg"
                  colorScheme="blue"
                  px={8}
                  h={14}
                  fontSize="lg"
                  onClick={() => router.push('/signup')}
                >
                  {t('trade.hero.get_started', 'Open Account')}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  colorScheme="blue"
                  px={8}
                  h={14}
                  fontSize="lg"
                  onClick={() => router.push('/demo')}
                >
                  {t('hero.try_demo', 'Try Demo')}
                </Button>
              </HStack>
            </VStack>

            {/* Regulatory Badges */}
            <Flex
              mt={12}
              justify="center"
              align="center"
              wrap="wrap"
              gap={6}
            >
              {regulatoryInfo.map((reg, index) => (
                <Box
                  key={index}
                  p={4}
                  bg={useColorModeValue('white', 'gray.800')}
                  borderRadius="md"
                  boxShadow="sm"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  minW="180px"
                  h="80px"
                >
                  {/* Placeholder for regulatory logo */}
                  <VStack spacing={1}>
                    <Text fontWeight="bold" fontSize="sm">
                      {reg.authority.split(' ')[0]}
                    </Text>
                    <Text fontSize="xs">{reg.license}</Text>
                  </VStack>
                </Box>
              ))}
            </Flex>

            {/* Main Trading Instruments Live Panel */}
            <Box
              mt={16}
              w="full"
              maxW="6xl"
              borderRadius="3xl"
              bg={glassCardBg}
              borderColor="brand.tradebrowser.500"
              borderWidth={2}
              boxShadow="xl"
              overflow="hidden"
            >
              <Tabs variant="soft-rounded" colorScheme="blue" p={6}>
                <TabList mb={6} justifyContent="center">
                  <Tab>Forex</Tab>
                  <Tab>Crypto</Tab>
                  <Tab>Platform</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <ForexPairDisplay />
                  </TabPanel>
                  <TabPanel>
                    <CryptoMarketplace />
                  </TabPanel>
                  <TabPanel>
                    <TradingPlatformPreview />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Flex>
        </motion.div>

        {/* Trading Products */}
        <Box mt={24}>
          <Heading
            textAlign="center"
            mb={12}
            fontSize={{ base: '3xl', md: '4xl' }}
            bgGradient="linear(to-r, brand.tradebrowser.500, brand.tradebrowser.700)"
            bgClip="text"
          >
            {t('trade.products.title', 'Trading Products')}
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mb={16}>
            {tradingProducts.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Box
                  p={8}
                  h="full"
                  bg={glassCardBg}
                  borderRadius="xl"
                  borderColor={product.color}
                  borderWidth={2}
                  _hover={{
                    transform: 'translateY(-5px)',
                    boxShadow: 'xl'
                  }}
                  transition="all 0.3s ease"
                >
                  <VStack align="start" spacing={6}>
                    <Icon as={product.icon} boxSize={12} color={product.color} />
                    <Heading size="md" color={product.color}>
                      {product.title}
                    </Heading>
                    <Text>
                      {product.description}
                    </Text>
                    <List spacing={2} w="full">
                      {product.highlights.map((highlight, idx) => (
                        <ListItem key={idx} display="flex" alignItems="center">
                          <ListIcon as={FaCheckCircle} color={product.color} />
                          <Text fontSize="sm">{highlight}</Text>
                        </ListItem>
                      ))}
                    </List>
                    <Button
                      variant="outline"
                      colorScheme="blue"
                      size="sm"
                      w="full"
                      onClick={() => router.push(`/markets/${product.title.toLowerCase()}`)}
                    >
                      Explore {product.title}
                    </Button>
                  </VStack>
                </Box>
              </motion.div>
            ))}
          </SimpleGrid>
        </Box>
        
        {/* Platform Features */}
        <Box mt={24}>
          <Heading
            textAlign="center"
            mb={12}
            fontSize={{ base: '3xl', md: '4xl' }}
            bgGradient="linear(to-r, brand.tradebrowser.500, brand.tradebrowser.700)"
            bgClip="text"
          >
            {t('trade.platform.title', 'Why Choose TradeBrowser')}
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mb={16}>
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
                  <VStack align="start" spacing={6}>
                    <Icon as={feature.icon} boxSize={12} color={feature.color} />
                    <Heading size="md" color={feature.color}>
                      {feature.title}
                    </Heading>
                    <Text>
                      {feature.description}
                    </Text>
                  </VStack>
                </Box>
              </motion.div>
            ))}
          </SimpleGrid>
        </Box>
        
        {/* Account Types */}
        <Box mt={24}>
          <Heading
            textAlign="center"
            mb={12}
            fontSize={{ base: '3xl', md: '4xl' }}
            bgGradient="linear(to-r, brand.tradebrowser.500, brand.tradebrowser.700)"
            bgClip="text"
          >
            {t('trade.accounts.title', 'Account Types')}
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mb={16}>
            {accountTypes.map((account, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Box
                  p={8}
                  h="full"
                  bg={glassCardBg}
                  borderRadius="xl"
                  borderColor={account.color}
                  borderWidth={2}
                  position="relative"
                  _hover={{
                    transform: 'translateY(-5px)',
                    boxShadow: 'xl'
                  }}
                  transition="all 0.3s ease"
                >
                  {account.popular && (
                    <Badge
                      position="absolute"
                      top="-10px"
                      right="20px"
                      colorScheme="blue"
                      fontSize="sm"
                      py={1}
                      px={3}
                      borderRadius="full"
                    >
                      Most Popular
                    </Badge>
                  )}
                  <VStack align="center" spacing={6}>
                    <Heading size="md" color={account.color}>
                      {account.name}
                    </Heading>
                    <VStack spacing={3} align="start" w="full">
                      <Flex justify="space-between" w="full">
                        <Text fontWeight="medium">Min Deposit:</Text>
                        <Text>{account.minDeposit}</Text>
                      </Flex>
                      <Flex justify="space-between" w="full">
                        <Text fontWeight="medium">Spread:</Text>
                        <Text>{account.spread}</Text>
                      </Flex>
                      <Flex justify="space-between" w="full">
                        <Text fontWeight="medium">Leverage:</Text>
                        <Text>{account.leverage}</Text>
                      </Flex>
                      <Divider my={2} />
                      <Text fontWeight="medium">Features:</Text>
                      <List spacing={1} w="full">
                        {account.features.map((feature, idx) => (
                          <ListItem key={idx} display="flex" alignItems="center">
                            <ListIcon as={FaCheckCircle} color={account.color} />
                            <Text fontSize="sm">{feature}</Text>
                          </ListItem>
                        ))}
                      </List>
                      <Divider my={2} />
                      <Flex justify="space-between" w="full">
                        <Text fontWeight="medium">Ideal for:</Text>
                        <Text>{account.ideal}</Text>
                      </Flex>
                    </VStack>
                    <Button 
                      colorScheme="blue" 
                      w="full"
                      onClick={() => router.push(`/account/${account.name.toLowerCase()}`)}
                    >
                      Open Account
                    </Button>
                  </VStack>
                </Box>
              </motion.div>
            ))}
          </SimpleGrid>
        </Box>
        
        {/* Regulatory Details */}
        <Box mt={24}>
          <Heading
            textAlign="center"
            mb={12}
            fontSize={{ base: '3xl', md: '4xl' }}
            bgGradient="linear(to-r, brand.tradebrowser.500, brand.tradebrowser.700)"
            bgClip="text"
          >
            {t('trade.regulatory.title', 'Regulated & Trusted Globally')}
          </Heading>
          
          <Box
            p={8}
            bg={glassCardBg}
            borderRadius="xl"
            borderColor="brand.tradebrowser.500"
            borderWidth={2}
            boxShadow="xl"
          >
            <Flex 
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="space-between"
              mb={8}
            >
              <VStack align={{ base: "center", md: "start" }} mb={{ base: 6, md: 0 }}>
                <Heading size="lg" color="brand.tradebrowser.500">
                  {t('trade.regulatory.subtitle', 'Your Security is Our Priority')}
                </Heading>
                <Text maxW="xl">
                  {t('trade.regulatory.description', 'TradeBrowser is regulated by leading financial authorities across multiple jurisdictions, ensuring a secure and compliant trading environment for all clients.')}
                </Text>
              </VStack>
              
              <Icon 
                as={FaShieldAlt} 
                boxSize={{ base: 16, md: 24 }} 
                color="brand.tradebrowser.400" 
                opacity={0.8}
              />
            </Flex>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {regulatoryInfo.map((reg, index) => (
                <Flex 
                  key={index} 
                  bg={useColorModeValue('white', 'gray.700')}
                  p={4}
                  borderRadius="md"
                  boxShadow="sm"
                  align="center"
                >
                  <Box 
                    w="60px" 
                    h="60px" 
                    mr={4} 
                    bg="gray.100" 
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FaUniversity} boxSize={6} color="gray.500" />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">{reg.authority}</Text>
                    <Text fontSize="sm">{reg.license}</Text>
                    <Text fontSize="xs" color="gray.500">{reg.country}</Text>
                  </VStack>
                </Flex>
              ))}
            </SimpleGrid>
            
            <Wrap mt={8} spacing={4} justify="center">
              <WrapItem>
                <Tag size="lg" colorScheme="blue" borderRadius="full">
                  Segregated Client Funds
                </Tag>
              </WrapItem>
              <WrapItem>
                <Tag size="lg" colorScheme="blue" borderRadius="full">
                  Negative Balance Protection
                </Tag>
              </WrapItem>
              <WrapItem>
                <Tag size="lg" colorScheme="blue" borderRadius="full">
                  SSL Encryption
                </Tag>
              </WrapItem>
              <WrapItem>
                <Tag size="lg" colorScheme="blue" borderRadius="full">
                  Two-Factor Authentication
                </Tag>
              </WrapItem>
              <WrapItem>
                <Tag size="lg" colorScheme="blue" borderRadius="full">
                  Full Transaction History
                </Tag>
              </WrapItem>
            </Wrap>
          </Box>
        </Box>
        
        {/* Call to Action */}
        <Box
          mt={24}
          mb={16}
          p={12}
          borderRadius="2xl"
          bg="brand.tradebrowser.600"
          color="white"
          textAlign="center"
        >
          <VStack spacing={6}>
            <Heading size="xl">
              {t('trade.cta.title', 'Ready to Start Trading?')}
            </Heading>
            <Text fontSize="lg" maxW="2xl">
              {t('trade.cta.description', 'Join thousands of traders worldwide who trust TradeBrowser for their forex and cryptocurrency trading needs.')}
            </Text>
            <HStack spacing={4}>
              <Button
                size="lg"
                colorScheme="whiteAlpha"
                px={8}
                h={14}
                fontSize="lg"
                leftIcon={<FaUser />}
                onClick={() => router.push('/signup')}
              >
                {t('trade.cta.button', 'Open Account')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                colorScheme="whiteAlpha"
                px={8}
                h={14}
                fontSize="lg"
                leftIcon={<FaPhoneAlt />}
                onClick={() => router.push('/contact')}
              >
                {t('trade.cta.contact', 'Contact Us')}
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default TradeLandingBrowser;