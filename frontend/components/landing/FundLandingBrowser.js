import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
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
  useBreakpointValue,
  Stack,
  Divider,
  TableContainer,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure
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
  FaMapMarkerAlt,
  FaBars,
  FaLanguage
} from 'react-icons/fa';
import MarketTicker from '@/components/MarketTicker';
import AdvancedForexChart from '@/components/cash/AdvancedForexChart';

const BitFundLanding = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const containerRef = useRef(null);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { locale } = router;
  
  // Set the HTML dir attribute based on language
  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);
  
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

  // Responsive adjustments
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });
  const buttonHeight = useBreakpointValue({ base: 12, md: 14 });
  const headingSize = useBreakpointValue({ 
    base: "2xl", 
    sm: "3xl",
    md: "4xl", 
    lg: "6xl", 
    xl: "7xl" 
  });
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const statsColumns = useBreakpointValue({ base: 1, sm: 3 });
  const featureColumns = useBreakpointValue({ base: 1, md: 2, lg: 4 });
  const licenseColumns = useBreakpointValue({ base: 1, md: 2 });
  const officeColumns = useBreakpointValue({ base: 1, md: 2 });
  const padding = useBreakpointValue({ base: 4, md: 8 });
  const spacing = useBreakpointValue({ base: 4, md: 8 });

  const challengeTypes = [
   {
      title: 'Standard Challenge',
      amount: '$10,000',
      fee: '$99',
      duration: '30 days',
      profitTarget: '8%',
      maxLoss: '5%',
      dailyDrawdown: '2%',
      color: 'brand.bitfund.400',
      badge: 'blue',
      description: 'Perfect for beginners starting their prop trading journey'
    },
    {
      title: 'Professional Challenge',
      amount: '$50,000',
      fee: '$199',
      duration: '60 days',
      profitTarget: '10%',
      maxLoss: '8%',
      dailyDrawdown: '2%',
      color: 'brand.bitfund.500',
      badge: 'purple',
      description: 'For experienced traders looking for a larger capital allocation'
    },
    {
      title: 'Elite Challenge',
      amount: '$100,000',
      fee: '$299',
      duration: '60 days',
      profitTarget: '12%',
      maxLoss: '10%',
      dailyDrawdown: '2%',
      color: 'brand.bitfund.600',
      badge: 'orange',
      description: 'For professional traders with proven track records'
    },
    {
      title: 'Super Challenge',
      amount: '$200,000',
      fee: '$599',
      duration: '90 days',
      profitTarget: '15%',
      maxLoss: '12%',
      dailyDrawdown: '3%',
      color: 'brand.bitfund.700',
      badge: 'red',
      description: 'Our highest tier for elite traders seeking maximum capital'
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
    <Box 
      ref={containerRef} 
      bg={bgGradient} 
      overflow="hidden" 
      minH="100vh" 
      textAlign={locale === 'ar' ? 'right' : 'left'}
    >
      <Container maxW="8xl" pt={{ base: 4, md: 8 }} px={{ base: 4, md: 8 }}>
        {/* Hero Section */}
        <motion.div style={{ scale: heroScale }}>
          <Flex
            direction="column"
            align="center"
            textAlign="center"
            position="relative"
          >
            <VStack spacing={{ base: 4, md: 8 }} maxW="4xl">
              <Heading
                fontSize={headingSize}
                bgGradient="linear(to-r, brand.bitfund.500, brand.bitfund.700)"
                bgClip="text"
                lineHeight="1.2"
                textAlign="center"
                px={{ base: 2, md: 0 }}
              >
                {t('prop.hero.title', 'Fund Your Trading Career')}
              </Heading>
              <Text fontSize={{ base: "lg", md: "xl", lg: "2xl" }} opacity={0.8} maxW="3xl" px={{ base: 2, md: 0 }}>
                {t('prop.hero.subtitle', 'Unlock capital up to $200,000 by proving your trading skills')}
              </Text>

              <Box w="full" overflowX="auto" px={{ base: 0, md: 4 }}>
                <MarketTicker />
              </Box>

              <Box w="full" overflowX="auto" px={{ base: 0, md: 4 }}>
                <AdvancedForexChart />              
              </Box>

              <Stack 
                direction={{ base: "column", sm: "row" }} 
                spacing={{ base: 4, md: 6 }} 
                pt={{ base: 4, md: 8 }}
                w={{ base: "full", sm: "auto" }}
                flexDirection={locale === 'ar' && { sm: 'row-reverse' }}
              >
                <Button
                  size={buttonSize}
                  colorScheme="blue"
                  px={{ base: 4, md: 8 }}
                  h={buttonHeight}
                  fontSize={{ base: "md", md: "lg" }}
                  w={{ base: "full", sm: "auto" }}
                  onClick={() => router.push('/signup')}
                >
                  {t('prop.hero.get_started', 'Start Challenge')}
                </Button>
                <Button
                  size={buttonSize}
                  variant="outline"
                  colorScheme="blue"
                  px={{ base: 4, md: 8 }}
                  h={buttonHeight}
                  fontSize={{ base: "md", md: "lg" }}
                  w={{ base: "full", sm: "auto" }}
                  onClick={() => router.push('/learn')}
                >
                  {t('hero.learn_more', 'Learn More')}
                </Button>
              </Stack>
            </VStack>

            {/* Stats Preview */}
            <Box
              mt={{ base: 8, md: 16 }}
              w="full"
              maxW="6xl"
              p={{ base: 4, md: 8 }}
              borderRadius={{ base: "xl", md: "3xl" }}
              bg={glassCardBg}
              borderColor="brand.bitfund.500"
              borderWidth={2}
              boxShadow="xl"
            >
              <SimpleGrid columns={statsColumns} spacing={{ base: 4, md: 8 }}>
                <VStack
                  p={{ base: 4, md: 6 }}
                  borderRadius="xl"
                  bg={useColorModeValue('white', 'gray.800')}
                  spacing={4}
                >
                  <Icon as={FaLaptopCode} boxSize={{ base: 6, md: 8 }} color="brand.bitfund.500" />
                  <Text fontWeight="bold">{t('demo.challenge_pass_rate', 'Pass Rate')}</Text>
                  <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="brand.bitfund.500">
                    12.5%
                  </Text>
                </VStack>
                <VStack
                  p={{ base: 4, md: 6 }}
                  borderRadius="xl"
                  bg={useColorModeValue('white', 'gray.800')}
                  spacing={4}
                >
                  <Icon as={FaGlobeAmericas} boxSize={{ base: 6, md: 8 }} color="brand.bitfund.500" />
                  <Text fontWeight="bold">{t('demo.global_traders', 'Active Traders')}</Text>
                  <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="brand.bitfund.500">
                    12k+
                  </Text>
                </VStack>
                <VStack
                  p={{ base: 4, md: 6 }}
                  borderRadius="xl"
                  bg={useColorModeValue('white', 'gray.800')}
                  spacing={4}
                >
                  <Icon as={FaMoneyBillWave} boxSize={{ base: 6, md: 8 }} color="brand.bitfund.500" />
                  <Text fontWeight="bold">{t('demo.capital_allocated', 'Capital Allocated')}</Text>
                  <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="brand.bitfund.500">
                    $450M+
                  </Text>
                </VStack>
              </SimpleGrid>
            </Box>
          </Flex>
        </motion.div>

        {/* Features Grid */}
        <Box mt={{ base: 12, md: 24 }}>
          <Heading
            textAlign="center"
            mb={{ base: 6, md: 12 }}
            fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
            bgGradient="linear(to-r, brand.bitfund.500, brand.bitfund.700)"
            bgClip="text"
            px={{ base: 2, md: 0 }}
          >
            {t('prop.why.choose.us', 'Why Choose BitFund')}
          </Heading>
          
          <SimpleGrid columns={featureColumns} spacing={spacing} mb={{ base: 8, md: 16 }}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Box
                  p={{ base: 4, md: 8 }}
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
                  <VStack align="start" spacing={{ base: 3, md: 6 }}>
                    <Icon as={feature.icon} boxSize={{ base: 8, md: 12 }} color={feature.color} />
                    <Heading size={{ base: "sm", md: "md" }} color={feature.color}>
                      {t(feature.title, 'Feature')}
                    </Heading>
                    <Text fontSize={{ base: "sm", md: "md" }}>
                      {t(feature.description, 'Feature description')}
                    </Text>
                  </VStack>
                </Box>
              </motion.div>
            ))}
          </SimpleGrid>
        </Box>
        
        {/* Challenge Types */}
        <Box mt={{ base: 12, md: 24 }}>
          <Heading
            textAlign="center"
            mb={{ base: 6, md: 12 }}
            fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
            bgGradient="linear(to-r, brand.bitfund.500, brand.bitfund.700)"
            bgClip="text"
            px={{ base: 2, md: 0 }}
          >
            {t('prop.challenge.types', 'Account Challenge Types')}
          </Heading>
          
          <SimpleGrid columns={featureColumns} spacing={spacing} mb={{ base: 8, md: 16 }}>
            {challengeTypes.map((challenge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Box
                  p={{ base: 4, md: 8 }}
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
                  <VStack align="center" spacing={{ base: 3, md: 6 }}>
                    <Heading size={{ base: "sm", md: "md" }} color={challenge.color}>
                      {challenge.title}
                    </Heading>
                    <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color={challenge.color}>
                      {challenge.amount}
                    </Text>
                    <VStack spacing={{ base: 2, md: 3 }} align="start" w="full">
                      <Flex justify="space-between" w="full" flexDirection={locale === 'ar' ? 'row-reverse' : 'row'}>
                        <Text fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>{t('challenge.fee', 'Fee')}:</Text>
                        <Text fontSize={{ base: "sm", md: "md" }}>{challenge.fee}</Text>
                      </Flex>
                      <Flex justify="space-between" w="full" flexDirection={locale === 'ar' ? 'row-reverse' : 'row'}>
                        <Text fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>{t('challenge.duration', 'Duration')}:</Text>
                        <Text fontSize={{ base: "sm", md: "md" }}>{challenge.duration}</Text>
                      </Flex>
                      <Flex justify="space-between" w="full" flexDirection={locale === 'ar' ? 'row-reverse' : 'row'}>
                        <Text fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>{t('challenge.profit_target', 'Profit Target')}:</Text>
                        <Text fontSize={{ base: "sm", md: "md" }}>{challenge.profitTarget}</Text>
                      </Flex>
                      <Flex justify="space-between" w="full" flexDirection={locale === 'ar' ? 'row-reverse' : 'row'}>
                        <Text fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>{t('challenge.max_loss', 'Max Loss')}:</Text>
                        <Text fontSize={{ base: "sm", md: "md" }}>{challenge.maxLoss}</Text>
                      </Flex>
                    </VStack>
                    <Button 
                      colorScheme="blue" 
                      w="full"
                      size={{ base: "sm", md: "md" }}
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
        <Box mt={{ base: 12, md: 24 }}>
          <Heading
            textAlign="center"
            mb={{ base: 6, md: 12 }}
            fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
            bgGradient="linear(to-r, brand.bitfund.500, brand.bitfund.700)"
            bgClip="text"
            px={{ base: 2, md: 0 }}
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
            <Accordion allowToggle zIndex={1}>
              {tradingRules.map((rule, index) => (
                <AccordionItem key={index} border="none">
                  <AccordionButton py={{ base: 3, md: 4 }} px={{ base: 3, md: 6 }} _hover={{ bg: 'whiteAlpha.200' }}>
                    <Box flex="1" textAlign="left">
                      <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }}>{rule.title}</Text>
                    </Box>
                    <Badge colorScheme="blue" fontSize={{ base: "xs", md: "md" }} px={3} py={1} display={{ base: "none", md: "block" }}>
                      {rule.rule}
                    </Badge>
                    <AccordionIcon ml={4} />
                  </AccordionButton>
                  <AccordionPanel pb={4} px={{ base: 3, md: 6 }} bg={useColorModeValue('gray.50', 'whiteAlpha.50')}>
                    <Text fontSize={{ base: "sm", md: "md" }}>{rule.description}</Text>
                    <Badge colorScheme="blue" fontSize="xs" px={2} py={1} mt={2} display={{ base: "inline-flex", md: "none" }}>
                      {rule.rule}
                    </Badge>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        </Box>
        
        {/* Licensing and Regulation */}
        <Box mt={{ base: 12, md: 24 }}>
          <Heading
            textAlign="center"
            mb={{ base: 6, md: 12 }}
            fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
            bgGradient="linear(to-r, brand.bitfund.500, brand.bitfund.700)"
            bgClip="text"
            px={{ base: 2, md: 0 }}
          >
            {t('prop.licensing', 'Licensing & Regulation')}
          </Heading>
          
          <SimpleGrid columns={licenseColumns} spacing={spacing} mb={{ base: 8, md: 16 }}>
            <Box
              p={{ base: 4, md: 8 }}
              bg={glassCardBg}
              borderRadius="xl"
              borderColor="brand.bitfund.500"
              borderWidth={2}
              boxShadow="xl"
            >
              <VStack align="start" spacing={{ base: 3, md: 6 }}>
                <Flex align="center">
                  <Icon as={FaCertificate} boxSize={{ base: 6, md: 8 }} color="brand.bitfund.500" mr={4} />
                  <Heading size={{ base: "sm", md: "md" }} color="brand.bitfund.500">
                    {t('prop.regulatory.compliance', 'Regulatory Compliance')}
                  </Heading>
                </Flex>
                <Text fontSize={{ base: "sm", md: "md" }}>
                  BitFund operates with full regulatory compliance across multiple jurisdictions, 
                  ensuring the highest standards of transparency and security for our traders.
                </Text>
                <TableContainer w="full" overflowX="auto">
                  <Table variant="simple" size={{ base: "sm", md: "sm" }}>
                    <Thead>
                      <Tr>
                        <Th fontSize={{ base: "xs", md: "sm" }}>Regulatory Authority</Th>
                        <Th fontSize={{ base: "xs", md: "sm" }}>License Number</Th>
                        <Th fontSize={{ base: "xs", md: "sm" }}>Jurisdiction</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {licenseInfo.map((license, index) => (
                        <Tr key={index}>
                          <Td fontSize={{ base: "xs", md: "sm" }}>{license.authority}</Td>
                          <Td fontSize={{ base: "xs", md: "sm" }}>{license.license}</Td>
                          <Td fontSize={{ base: "xs", md: "sm" }}>{license.country}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </VStack>
            </Box>
            
            <Box
              p={{ base: 4, md: 8 }}
              bg={glassCardBg}
              borderRadius="xl"
              borderColor="brand.bitfund.500"
              borderWidth={2}
              boxShadow="xl"
            >
              <VStack align="start" spacing={{ base: 3, md: 6 }}>
                <Flex align="center">
                  <Icon as={FaMapMarkerAlt} boxSize={{ base: 6, md: 8 }} color="brand.bitfund.500" mr={4} />
                  <Heading size={{ base: "sm", md: "md" }} color="brand.bitfund.500">
                    {t('prop.global.offices', 'Global Offices')}
                  </Heading>
                </Flex>
                <Text fontSize={{ base: "sm", md: "md" }}>
                  With offices in key financial centers around the world, BitFund provides localized 
                  support and maintains a strong global presence.
                </Text>
                <Grid templateColumns={`repeat(${officeColumns}, 1fr)`} gap={{ base: 4, md: 6 }} w="full">
                  {officeLocations.map((office, index) => (
                    <GridItem key={index}>
                      <VStack align="start" spacing={{ base: 1, md: 2 }}>
                        <Text fontWeight="bold" color="brand.bitfund.500" fontSize={{ base: "sm", md: "md" }}>{office.city}</Text>
                        <Text fontSize={{ base: "xs", md: "sm" }}>{office.address}</Text>
                        <Text fontSize={{ base: "xs", md: "sm" }}>{office.phone}</Text>
                        <Text fontSize={{ base: "xs", md: "sm" }}>{office.email}</Text>
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
          mt={{ base: 12, md: 24 }}
          mb={{ base: 8, md: 16 }}
          p={{ base: 6, md: 12 }}
          borderRadius={{ base: "xl", md: "2xl" }}
          bg="brand.bitfund.600"
          color="white"
          textAlign="center"
        >
          <VStack spacing={{ base: 4, md: 6 }}>
            <Heading size={{ base: "lg", md: "xl" }} px={{ base: 2, md: 0 }}>
              {t('prop.cta.title', 'Ready to Prove Your Trading Skills?')}
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }} maxW="2xl" px={{ base: 2, md: 0 }}>
              {t('prop.cta.description', 'Join thousands of traders who have successfully secured funding through BitFund challenges. Start your journey to becoming a funded trader today.')}
            </Text>
            <Button
              size={buttonSize}
              colorScheme="whiteAlpha"
              px={{ base: 4, md: 8 }}
              h={buttonHeight}
              fontSize={{ base: "md", md: "lg" }}
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