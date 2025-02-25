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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { 
  FaChartLine,
  FaTrophy,
  FaUniversity,
  FaGlobeAmericas,
  FaShieldAlt,
  FaMoneyBillWave,
  FaBalanceScale,
  FaDesktop,
  FaUsers,
  FaLaptopCode,
  FaCertificate,
  FaMapMarkerAlt
} from 'react-icons/fa';
import TradingMatrix from '../TradingMatrix';
import MarketTicker from '../MarketTicker';
import TradingPerformanceChart from '../TradingPerformanceChart';

const BitFundLanding = () => {
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

  const challengeTypes = [
    {
      title: 'Standard Challenge',
      amount: '$10,000',
      fee: '$99',
      duration: '30 days',
      profitTarget: '8%',
      maxLoss: '5%',
      color: 'brand.bitfund.400'
    },
    {
      title: 'Professional Challenge',
      amount: '$50,000',
      fee: '$249',
      duration: '60 days',
      profitTarget: '10%',
      maxLoss: '8%',
      color: 'brand.bitfund.500'
    },
    {
      title: 'Elite Challenge',
      amount: '$100,000',
      fee: '$499',
      duration: '60 days',
      profitTarget: '12%',
      maxLoss: '10%',
      color: 'brand.bitfund.600'
    },
    {
      title: 'Institutional Challenge',
      amount: '$200,000',
      fee: '$999',
      duration: '90 days',
      profitTarget: '15%',
      maxLoss: '12%',
      color: 'brand.bitfund.700'
    }
  ];

  const tradingRules = [
    {
      title: 'Maximum Daily Loss',
      rule: 'Cannot exceed 2% of initial account balance',
      description: 'If your daily loss exceeds 2% of your initial account balance, your challenge will be terminated.'
    },
    {
      title: 'Maximum Total Loss',
      rule: 'Varies by challenge type (5-12%)',
      description: 'Your account will be terminated if your total loss exceeds the maximum allowed percentage.'
    },
    {
      title: 'Holding Positions',
      rule: 'No overnight holding on Fridays',
      description: 'All positions must be closed before the market closes on Friday to avoid weekend gap risk.'
    },
    {
      title: 'Trading Hours',
      rule: 'Trading allowed during market hours only',
      description: 'Trading is only permitted during official market hours of the respective exchanges.'
    },
    {
      title: 'News Trading',
      rule: 'No trading during major economic announcements',
      description: 'Trading is not allowed 10 minutes before and after major economic announcements.'
    },
    {
      title: 'Profit Split',
      rule: '80/20 in favor of the trader',
      description: 'After passing the challenge, you receive 80% of profits while BitFund retains 20%.'
    }
  ];

  const officeLocations = [
    {
      city: 'New York',
      address: '350 Fifth Avenue, Suite 4000, New York, NY 10118',
      phone: '+1 (212) 555-7890',
      email: 'nyc@bitfund.com'
    },
    {
      city: 'London',
      address: '30 St Mary Axe, London, EC3A 8BF, United Kingdom',
      phone: '+44 20 1234 5678',
      email: 'london@bitfund.com'
    },
    {
      city: 'Singapore',
      address: '10 Marina Boulevard, Marina Bay Financial Centre, Singapore 018983',
      phone: '+65 6123 4567',
      email: 'singapore@bitfund.com'
    },
    {
      city: 'Dubai',
      address: 'Emirates Towers, Sheikh Zayed Road, Dubai, United Arab Emirates',
      phone: '+971 4 123 4567',
      email: 'dubai@bitfund.com'
    }
  ];

  const features = [
    {
      icon: FaChartLine,
      title: 'advanced.trading.platform.title',
      description: 'advanced.trading.platform.description',
      color: 'brand.bitfund.400'
    },
    {
      icon: FaTrophy,
      title: 'performance.based.funding.title',
      description: 'performance.based.funding.description',
      color: 'brand.bitfund.500'
    },
    {
      icon: FaBalanceScale,
      title: 'fair.evaluation.title',
      description: 'fair.evaluation.description',
      color: 'brand.bitfund.600'
    },
    {
      icon: FaUsers,
      title: 'trader.community.title',
      description: 'trader.community.description',
      color: 'brand.bitfund.700'
    }
  ];

  const licenseInfo = [
    {
      authority: 'Financial Conduct Authority (FCA)',
      license: 'FRN: 123456',
      country: 'United Kingdom'
    },
    {
      authority: 'Securities and Exchange Commission (SEC)',
      license: 'Reg No: SEC-12345-X',
      country: 'United States'
    },
    {
      authority: 'Monetary Authority of Singapore (MAS)',
      license: 'CMS License No. CMS12345',
      country: 'Singapore'
    },
    {
      authority: 'Dubai Financial Services Authority (DFSA)',
      license: 'F12345',
      country: 'UAE'
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
                bgGradient="linear(to-r, brand.bitfund.500, brand.bitfund.700)"
                bgClip="text"
              >
                {t('prop.hero.title', 'Fund Your Trading Career')}
              </Heading>
              <Text fontSize={{ base: 'xl', md: '2xl' }} opacity={0.8} maxW="3xl">
                {t('prop.hero.subtitle', 'Unlock capital up to $200,000 by proving your trading skills')}
              </Text>

              <TradingMatrix />

              <MarketTicker />

              <TradingPerformanceChart />

              <HStack spacing={6} pt={8}>
                <Button
                  size="lg"
                  colorScheme="blue"
                  px={8}
                  h={14}
                  fontSize="lg"
                  onClick={() => router.push('/signup')}
                >
                  {t('prop.hero.get_started', 'Start Challenge')}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  colorScheme="blue"
                  px={8}
                  h={14}
                  fontSize="lg"
                  onClick={() => router.push('/learn')}
                >
                  {t('hero.learn_more', 'Learn More')}
                </Button>
              </HStack>
            </VStack>

            {/* Stats Preview */}
            <Box
              mt={16}
              w="full"
              maxW="6xl"
              p={8}
              borderRadius="3xl"
              bg={glassCardBg}
              borderColor="brand.bitfund.500"
              borderWidth={2}
              boxShadow="xl"
            >
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                <VStack
                  p={6}
                  borderRadius="xl"
                  bg={useColorModeValue('white', 'gray.800')}
                  spacing={4}
                >
                  <Icon as={FaLaptopCode} boxSize={8} color="brand.bitfund.500" />
                  <Text fontWeight="bold">{t('demo.challenge_pass_rate', 'Pass Rate')}</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="brand.bitfund.500">
                    12.5%
                  </Text>
                </VStack>
                <VStack
                  p={6}
                  borderRadius="xl"
                  bg={useColorModeValue('white', 'gray.800')}
                  spacing={4}
                >
                  <Icon as={FaGlobeAmericas} boxSize={8} color="brand.bitfund.500" />
                  <Text fontWeight="bold">{t('demo.global_traders', 'Active Traders')}</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="brand.bitfund.500">
                    12k+
                  </Text>
                </VStack>
                <VStack
                  p={6}
                  borderRadius="xl"
                  bg={useColorModeValue('white', 'gray.800')}
                  spacing={4}
                >
                  <Icon as={FaMoneyBillWave} boxSize={8} color="brand.bitfund.500" />
                  <Text fontWeight="bold">{t('demo.capital_allocated', 'Capital Allocated')}</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="brand.bitfund.500">
                    $450M+
                  </Text>
                </VStack>
              </SimpleGrid>
            </Box>
          </Flex>
        </motion.div>

        {/* Features Grid */}
        <Box mt={24}>
          <Heading
            textAlign="center"
            mb={12}
            fontSize={{ base: '3xl', md: '4xl' }}
            bgGradient="linear(to-r, brand.bitfund.500, brand.bitfund.700)"
            bgClip="text"
          >
            {t('prop.why.choose.us', 'Why Choose BitFund')}
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mb={16}>
            {features.map((feature, index) => (
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
                      {t(feature.title, 'Feature')}
                    </Heading>
                    <Text>
                      {t(feature.description, 'Feature description')}
                    </Text>
                  </VStack>
                </Box>
              </motion.div>
            ))}
          </SimpleGrid>
        </Box>
        
        {/* Challenge Types */}
        <Box mt={24}>
          <Heading
            textAlign="center"
            mb={12}
            fontSize={{ base: '3xl', md: '4xl' }}
            bgGradient="linear(to-r, brand.bitfund.500, brand.bitfund.700)"
            bgClip="text"
          >
            {t('prop.challenge.types', 'Account Challenge Types')}
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mb={16}>
            {challengeTypes.map((challenge, index) => (
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
                  borderColor={challenge.color}
                  borderWidth={2}
                  _hover={{
                    transform: 'translateY(-5px)',
                    boxShadow: 'xl'
                  }}
                  transition="all 0.3s ease"
                >
                  <VStack align="center" spacing={6}>
                    <Heading size="md" color={challenge.color}>
                      {challenge.title}
                    </Heading>
                    <Text fontSize="3xl" fontWeight="bold" color={challenge.color}>
                      {challenge.amount}
                    </Text>
                    <VStack spacing={3} align="start" w="full">
                      <Flex justify="space-between" w="full">
                        <Text fontWeight="medium">Fee:</Text>
                        <Text>{challenge.fee}</Text>
                      </Flex>
                      <Flex justify="space-between" w="full">
                        <Text fontWeight="medium">Duration:</Text>
                        <Text>{challenge.duration}</Text>
                      </Flex>
                      <Flex justify="space-between" w="full">
                        <Text fontWeight="medium">Profit Target:</Text>
                        <Text>{challenge.profitTarget}</Text>
                      </Flex>
                      <Flex justify="space-between" w="full">
                        <Text fontWeight="medium">Max Loss:</Text>
                        <Text>{challenge.maxLoss}</Text>
                      </Flex>
                    </VStack>
                    <Button 
                      colorScheme="blue" 
                      w="full"
                      onClick={() => router.push(`/challenge/${challenge.title.toLowerCase().replace(' ', '-')}`)}
                    >
                      Select
                    </Button>
                  </VStack>
                </Box>
              </motion.div>
            ))}
          </SimpleGrid>
        </Box>
        
        {/* Trading Rules */}
        <Box mt={24}>
          <Heading
            textAlign="center"
            mb={12}
            fontSize={{ base: '3xl', md: '4xl' }}
            bgGradient="linear(to-r, brand.bitfund.500, brand.bitfund.700)"
            bgClip="text"
          >
            {t('prop.trading.rules', 'Trading Rules')}
          </Heading>
          
          <Box
            bg={glassCardBg}
            borderRadius="xl"
            borderColor="brand.bitfund.500"
            borderWidth={2}
            boxShadow="xl"
            overflow="hidden"
          >
            <Accordion allowToggle>
              {tradingRules.map((rule, index) => (
                <AccordionItem key={index} border="none">
                  <AccordionButton py={4} px={6} _hover={{ bg: 'whiteAlpha.200' }}>
                    <Box flex="1" textAlign="left">
                      <Text fontWeight="bold" fontSize="lg">{rule.title}</Text>
                    </Box>
                    <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                      {rule.rule}
                    </Badge>
                    <AccordionIcon ml={4} />
                  </AccordionButton>
                  <AccordionPanel pb={4} px={6} bg={useColorModeValue('gray.50', 'whiteAlpha.50')}>
                    <Text>{rule.description}</Text>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        </Box>
        
        {/* Licensing and Regulation */}
        <Box mt={24}>
          <Heading
            textAlign="center"
            mb={12}
            fontSize={{ base: '3xl', md: '4xl' }}
            bgGradient="linear(to-r, brand.bitfund.500, brand.bitfund.700)"
            bgClip="text"
          >
            {t('prop.licensing', 'Licensing & Regulation')}
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={16}>
            <Box
              p={8}
              bg={glassCardBg}
              borderRadius="xl"
              borderColor="brand.bitfund.500"
              borderWidth={2}
              boxShadow="xl"
            >
              <VStack align="start" spacing={6}>
                <Flex align="center">
                  <Icon as={FaCertificate} boxSize={8} color="brand.bitfund.500" mr={4} />
                  <Heading size="md" color="brand.bitfund.500">
                    {t('prop.regulatory.compliance', 'Regulatory Compliance')}
                  </Heading>
                </Flex>
                <Text>
                  BitFund operates with full regulatory compliance across multiple jurisdictions, 
                  ensuring the highest standards of transparency and security for our traders.
                </Text>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Regulatory Authority</Th>
                      <Th>License Number</Th>
                      <Th>Jurisdiction</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {licenseInfo.map((license, index) => (
                      <Tr key={index}>
                        <Td>{license.authority}</Td>
                        <Td>{license.license}</Td>
                        <Td>{license.country}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </VStack>
            </Box>
            
            <Box
              p={8}
              bg={glassCardBg}
              borderRadius="xl"
              borderColor="brand.bitfund.500"
              borderWidth={2}
              boxShadow="xl"
            >
              <VStack align="start" spacing={6}>
                <Flex align="center">
                  <Icon as={FaMapMarkerAlt} boxSize={8} color="brand.bitfund.500" mr={4} />
                  <Heading size="md" color="brand.bitfund.500">
                    {t('prop.global.offices', 'Global Offices')}
                  </Heading>
                </Flex>
                <Text>
                  With offices in key financial centers around the world, BitFund provides localized 
                  support and maintains a strong global presence.
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={6} w="full">
                  {officeLocations.map((office, index) => (
                    <GridItem key={index}>
                      <VStack align="start" spacing={2}>
                        <Text fontWeight="bold" color="brand.bitfund.500">{office.city}</Text>
                        <Text fontSize="sm">{office.address}</Text>
                        <Text fontSize="sm">{office.phone}</Text>
                        <Text fontSize="sm">{office.email}</Text>
                      </VStack>
                    </GridItem>
                  ))}
                </Grid>
              </VStack>
            </Box>
          </SimpleGrid>
        </Box>
        
        {/* Call to Action */}
        <Box
          mt={24}
          mb={16}
          p={12}
          borderRadius="2xl"
          bg="brand.bitfund.600"
          color="white"
          textAlign="center"
        >
          <VStack spacing={6}>
            <Heading size="xl">
              {t('prop.cta.title', 'Ready to Prove Your Trading Skills?')}
            </Heading>
            <Text fontSize="lg" maxW="2xl">
              {t('prop.cta.description', 'Join thousands of traders who have successfully secured funding through BitFund challenges. Start your journey to becoming a funded trader today.')}
            </Text>
            <Button
              size="lg"
              colorScheme="whiteAlpha"
              px={8}
              h={14}
              fontSize="lg"
              onClick={() => router.push('/signup')}
            >
              {t('prop.cta.button', 'Begin Challenge Now')}
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default BitFundLanding;