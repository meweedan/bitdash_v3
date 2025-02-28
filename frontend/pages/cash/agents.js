import React, { useEffect } from 'react';
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
  useBreakpointValue,
  List,
  ListItem,
  ListIcon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  SlideFade,
  Image,
  Badge,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  chakra,
  Link,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';

// Chakra UI Icons
import {
  ArrowForwardIcon,
  CheckCircleIcon,
  DownloadIcon,
  PhoneIcon,
  LockIcon,
  StarIcon,
  InfoIcon,
  TimeIcon,
  ChevronRightIcon,
  SmallAddIcon,
} from '@chakra-ui/icons';

// Framer Motion
import { motion } from 'framer-motion';

// Layout (assuming you have a default Layout component)
import Layout from '@/components/Layout';

// Import extra icons (would normally come from react-icons)
const BlockchainIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 3L18 6L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 3L6 6L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 21L18 18L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 21L6 18L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 18H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SecurityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// This data would normally come from translation files or API
// Here we're setting up the structure to be translation-friendly
const getAgentFAQData = (t) => [
  {
    question: t('agents.faq.q1', 'What is required to become a BitCash agent?'),
    answer: t('agents.faq.a1', 'To become a BitCash agent, you need: 1) A registered business with physical location or verification as an individual agent, 2) Valid identification documents, 3) Proof of address, 4) Completion of our compliance training, and 5) Initial operating float. Our thorough verification process ensures network security.'),
  },
  {
    question: t('agents.faq.q2', 'How does BitCash ensure security for agents and customers?'),
    answer: t('agents.faq.a2', 'BitCash employs blockchain technology for transaction verification and immutable record-keeping. All agents undergo thorough verification, regular audits, and ongoing compliance monitoring. Our platform features real-time fraud detection, transaction limits, two-factor authentication, and 24/7 security monitoring to protect both agents and customers.'),
  },
  {
    question: t('agents.faq.q3', 'What are the income opportunities for BitCash agents?'),
    answer: t('agents.faq.a3', 'BitCash agents earn through multiple revenue streams: 1) Transaction commissions (1.2% on cash deposits, 0.8% on withdrawals), 2) New customer referral bonuses, 3) Volume-based monthly incentives, and 4) Special promotions. High-performing agents can earn $500-$3,000 monthly depending on location, transaction volume, and agent tier level.'),
  },
  {
    question: t('agents.faq.q4', 'How does agent onboarding and training work?'),
    answer: t('agents.faq.a4', 'After acceptance, new agents undergo a comprehensive onboarding process: 1) In-person or virtual compliance and operations training, 2) Anti-fraud and security protocols, 3) Customer service best practices, 4) Platform and app technical training, and 5) Float management education. Ongoing refresher courses and updates are provided regularly.'),
  },
  {
    question: t('agents.faq.q5', 'What ongoing support do BitCash agents receive?'),
    answer: t('agents.faq.a5', 'BitCash provides continuous support including: 1) Dedicated agent success managers, 2) 24/7 technical helpdesk, 3) Marketing materials and signage, 4) Regular business development workshops, 5) Real-time transaction monitoring, 6) Float management assistance, and 7) Community forums to share best practices with other agents.'),
  },
  {
    question: t('agents.faq.q6', 'How are agent transactions verified and secured?'),
    answer: t('agents.faq.a6', 'BitCash transactions are secured through our blockchain-based verification system. Each transaction requires multi-factor authentication, is cryptographically signed, and permanently recorded in our distributed ledger. Agents receive instant confirmation of all transactions, and both agents and customers get digital receipts for all activities.'),
  },
  {
    question: t('agents.faq.q7', 'What are the different agent tier levels?'),
    answer: t('agents.faq.a7', 'BitCash offers three agent tiers: 1) Standard Agents handle basic transactions with lower limits, 2) Premium Agents receive higher transaction limits and preferential commission rates after 3 months of good performance, and 3) Super Agents can manage sub-agent networks and receive additional passive income from their network activity.'),
  },
  {
    question: t('agents.faq.q8', 'How does BitCash prevent fraudulent activity in the agent network?'),
    answer: t('agents.faq.a8', 'We employ a comprehensive anti-fraud strategy: 1) Advanced KYC for all agents, 2) AI-powered transaction monitoring, 3) Regular mystery shopping audits, 4) Geolocation verification for transactions, 5) Behavior analysis to detect suspicious patterns, 6) Customer feedback systems, and 7) Immediate investigation of any reported issues with zero tolerance for fraudulent activity.'),
  },
];

const MotionBox = motion(Box);

function AgentsPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    // Set direction for RTL or LTR
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  // Color & size references
  const bgGradient = useColorModeValue(
    'linear(to-b, gray.50, white)',
    'linear(to-b, gray.900, gray.800)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const accentColor = useColorModeValue('brand.bitcash.600', 'brand.bitcash.400');
  const accentBg = useColorModeValue('brand.bitcash.400', 'brand.bitcash.700');
  const headingSize = useBreakpointValue({ base: '2xl', md: '3xl', lg: '4xl' });
  const sectionPadding = useBreakpointValue({ base: 8, md: 16 });
  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const softShadow = useColorModeValue('lg', 'dark-lg');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Layout>
      <Box 
        minH="100vh" 
        textAlign={locale === 'ar' ? 'right' : 'left'}
      >
        {/* HERO SECTION */}
        <Box 
          py={{ base: 16, md: 24 }}
          overflow="hidden"
          position="relative"
        >
          {/* Abstract design elements */}
          <Box 
            position="absolute" 
            top="-10%" 
            left="-5%" 
            w="35%" 
            h="120%" 
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
            opacity="0.2" 
            transform="rotate(25deg)" 
            roundedLeft="full" 
          />
          
          <Container maxW="7xl" position="relative" zIndex={2}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={10} alignItems="center">
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
                    {t('agents.hero.badge', 'Become a Financial Access Point')}
                  </Badge>
                  <Heading 
                    fontSize={headingSize}
                    lineHeight="1.1"
                    fontWeight="bold"
                    maxW="600px"
                  >
                    {t('agents.hero.heading', 'Empower Your Community & Grow Your Business')}
                  </Heading>
                  <Text fontSize={{ base: 'lg', md: 'xl' }} maxW="600px">
                    {t('agents.hero.subtext', 'Join the BitCash Agent Network to offer essential financial services from your location. Create new revenue streams while helping your community access digital finance.')}
                  </Text>
                  <HStack spacing={4} pt={2}>
                    <Button
                      size={buttonSize}
                      variant="bitcash-solid"
                      rightIcon={<ArrowForwardIcon />}
                      onClick={() => router.push('/signup/agent')}
                    >
                      {t('agents.hero.applyButton', 'Apply Now')}
                    </Button>
                    <Button
                      size={buttonSize}
                      variant="bitcash-outline"
                      onClick={() => router.push('/agent/calculator')}
                    >
                      {t('agents.hero.calculatorButton', 'Earnings Calculator')}
                    </Button>
                  </HStack>
                  
                  <HStack spacing={8} pt={4}>
                    <VStack align={locale === 'ar' ? 'end' : 'start'} spacing={0}>
                      <Text fontWeight="bold" fontSize="3xl">7,500+</Text>
                      <Text fontSize="sm">{t('agents.hero.stats.agents', 'Active agents')}</Text>
                    </VStack>
                    <VStack align={locale === 'ar' ? 'end' : 'start'} spacing={0}>
                      <Text fontWeight="bold" fontSize="3xl">$30M+</Text>
                      <Text fontSize="sm">{t('agents.hero.stats.volume', 'Monthly volume')}</Text>
                    </VStack>
                    <VStack align={locale === 'ar' ? 'end' : 'start'} spacing={0}>
                      <Text fontWeight="bold" fontSize="3xl">96%</Text>
                      <Text fontSize="sm">{t('agents.hero.stats.retention', 'Agent retention')}</Text>
                    </VStack>
                  </HStack>
                </VStack>
              </SlideFade>
              
              <SlideFade in offsetY="20px" delay={0.2}>
                <Box 
                  borderRadius="xl" 
                  overflow="hidden" 
                  boxShadow="2xl"
                  height={{ base: "300px", md: "400px" }}
                  my={{ base: 6, lg: 0 }}
                  position="relative"
                >
                  <Image 
                    src="/images/agent-hero.jpg" 
                    alt={t('agents.hero.image.alt', 'BitCash agent serving a customer')} 
                    fallback={
                      <Box 
                        bg="brand.bitcash.400" 
                        width="100%" 
                        height="100%" 
                        display="flex" 
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text fontWeight="bold">
                          {t('agents.hero.image.placeholder', 'BitCash Agent Network')}
                        </Text>
                      </Box>
                    }
                    objectFit="cover"
                    width="100%"
                    height="100%"
                  />
                  <Box 
                    position="absolute" 
                    bottom={0} 
                    left={0} 
                    right={0} 
                    bg="rgba(0,0,0,0.6)" 
                    p={4}
                  >
                    <Text fontWeight="bold">
                      {t('agents.hero.image.caption', 'Trusted financial services at convenient locations')}
                    </Text>
                  </Box>
                </Box>
              </SlideFade>
            </SimpleGrid>
          </Container>
        </Box>

        <Container maxW="7xl" py={16}>
          {/* VALUE PROPOSITION SECTION */}
          <SlideFade in offsetY="30px">
            <VStack textAlign="center" spacing={4} mb={12}>
              <Heading 
                fontSize={{ base: 'xl', md: '2xl' }} 
                color="brand.bitcash.400"
              >
                {t('agents.valueProp.heading', 'The BitCash Agent Network Advantage')}
              </Heading>
              <Text fontSize={{ base: 'lg', md: 'xl' }} maxW="800px">
                {t('agents.valueProp.subtext', 'Our blockchain-powered platform connects reliable agents with customers who need financial services.')}
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mb={16}>
              <MotionBox 
                whileHover={{ y: -5 }}
                p={6} 
                bg={cardBg} 
                borderRadius="xl" 
                boxShadow={softShadow}
                borderTop="4px solid"
                borderColor="brand.bitcash.400"
              >
                <VStack spacing={4} align="stretch">
                  <Flex 
                    w={12} 
                    h={12} 
                    bg="brand.bitcash.400" 
                    color="brand.bitcash.600" 
                    borderRadius="lg" 
                    align="center" 
                    justify="center"
                  >
                    <Icon as={LocationIcon} boxSize={6} />
                  </Flex>
                  <Heading size="md">
                    {t('agents.valueProp.prop1.title', 'Growing Network')}
                  </Heading>
                  <Text>
                    {t('agents.valueProp.prop1.description', 'Join our expanding network of trusted outlets in high-traffic locations and busy commercial areas providing essential financial services.')}
                  </Text>
                </VStack>
              </MotionBox>

              <MotionBox 
                whileHover={{ y: -5 }}
                p={6} 
                bg={cardBg} 
                borderRadius="xl" 
                boxShadow={softShadow}
                borderTop="4px solid"
                borderColor="brand.bitcash.400"
              >
                <VStack spacing={4} align="stretch">
                  <Flex 
                    w={12} 
                    h={12} 
                    bg="brand.bitcash.400" 
                    color="brand.bitcash.600" 
                    borderRadius="lg" 
                    align="center" 
                    justify="center"
                  >
                    <Icon as={BlockchainIcon} boxSize={6} />
                  </Flex>
                  <Heading size="md">
                    {t('agents.valueProp.prop2.title', 'Blockchain Security')}
                  </Heading>
                  <Text>
                    {t('agents.valueProp.prop2.description', 'Every transaction is secured by blockchain technology, providing transparent, immutable records and real-time verification for complete trust and security.')}
                  </Text>
                </VStack>
              </MotionBox>

              <MotionBox 
                whileHover={{ y: -5 }}
                p={6} 
                bg={cardBg} 
                borderRadius="xl" 
                boxShadow={softShadow}
                borderTop="4px solid"
                borderColor="brand.bitcash.400"
              >
                <VStack spacing={4} align="stretch">
                  <Flex 
                    w={12} 
                    h={12} 
                    bg="brand.bitcash.400" 
                    color="brand.bitcash.600" 
                    borderRadius="lg" 
                    align="center" 
                    justify="center"
                  >
                    <Icon as={SecurityIcon} boxSize={6} />
                  </Flex>
                  <Heading size="md">
                    {t('agents.valueProp.prop3.title', 'Zero Tolerance')}
                  </Heading>
                  <Text>
                    {t('agents.valueProp.prop3.description', 'Our comprehensive anti-fraud systems and strict verification processes ensure network integrity with zero tolerance for fraudulent activities.')}
                  </Text>
                </VStack>
              </MotionBox>

              <MotionBox 
                whileHover={{ y: -5 }}
                p={6} 
                bg={cardBg} 
                borderRadius="xl" 
                boxShadow={softShadow}
                borderTop="4px solid"
                borderColor="brand.bitcash.400"
              >
                <VStack spacing={4} align="stretch">
                  <Flex 
                    w={12} 
                    h={12} 
                    bg="brand.bitcash.400" 
                    color="brand.bitcash.600" 
                    borderRadius="lg" 
                    align="center" 
                    justify="center"
                  >
                    <Icon as={StarIcon} boxSize={6} />
                  </Flex>
                  <Heading size="md">
                    {t('agents.valueProp.prop4.title', 'Dual Opportunities')}
                  </Heading>
                  <Text>
                    {t('agents.valueProp.prop4.description', 'Opportunities for established businesses to add new revenue streams and for motivated individuals to build rewarding service-oriented careers.')}
                  </Text>
                </VStack>
              </MotionBox>
            </SimpleGrid>
          </SlideFade>

          {/* HOW IT WORKS */}
          <SlideFade in offsetY="30px">
            <Box mb={16}>
              <VStack textAlign="center" spacing={4} mb={8}>
                <Heading 
                  fontSize={{ base: 'xl', md: '2xl' }} 
                  color="brand.bitcash.400"
                >
                  {t('agents.howItWorks.heading', 'How the BitCash Agent Network Works')}
                </Heading>
                <Text fontSize={{ base: 'lg', md: 'xl' }} maxW="800px">
                  {t('agents.howItWorks.subtext', 'A streamlined process connecting customers with trusted financial access points')}
                </Text>
              </VStack>
              
              <Tabs 
                variant="soft-rounded" 
                colorScheme="green" 
                isFitted
                mt={8}
              >
                <TabList mb="1em">
                  <Tab>{t('agents.howItWorks.tabs.forAgents', 'For Agents')}</Tab>
                  <Tab>{t('agents.howItWorks.tabs.forCustomers', 'For Customers')}</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
                      <VStack 
                        bg={cardBg} 
                        p={6} 
                        borderRadius="lg" 
                        boxShadow={softShadow}
                        spacing={4}
                      >
                        <Flex 
                          w={12} 
                          h={12} 
                          bg="brand.bitcash.400" 
                          borderRadius="full" 
                          align="center" 
                          justify="center"
                          fontWeight="bold"
                          fontSize="xl"
                        >
                          1
                        </Flex>
                        <Heading size="md" textAlign="center">
                          {t('agents.howItWorks.agents.step1.title', 'Verify Identity')}
                        </Heading>
                        <Text textAlign="center">
                          {t('agents.howItWorks.agents.step1.description', 'Verify customer identity with app-based scanning or physical ID before processing any transaction.')}
                        </Text>
                      </VStack>
                      
                      <VStack 
                        bg={cardBg} 
                        p={6} 
                        borderRadius="lg" 
                        boxShadow={softShadow}
                        spacing={4}
                      >
                        <Flex 
                          w={12} 
                          h={12} 
                          bg="brand.bitcash.400" 
                          borderRadius="full" 
                          align="center" 
                          justify="center"
                          fontWeight="bold"
                          fontSize="xl"
                        >
                          2
                        </Flex>
                        <Heading size="md" textAlign="center">
                          {t('agents.howItWorks.agents.step2.title', 'Process Request')}
                        </Heading>
                        <Text textAlign="center">
                          {t('agents.howItWorks.agents.step2.description', 'Process deposit, withdrawal, or merchant settlement request through the BitCash Agent app.')}
                        </Text>
                      </VStack>
                      
                      <VStack 
                        bg={cardBg} 
                        p={6} 
                        borderRadius="lg" 
                        boxShadow={softShadow}
                        spacing={4}
                      >
                        <Flex 
                          w={12} 
                          h={12} 
                          bg="brand.bitcash.400" 
                          borderRadius="full" 
                          align="center" 
                          justify="center"
                          fontWeight="bold"
                          fontSize="xl"
                        >
                          3
                        </Flex>
                        <Heading size="md" textAlign="center">
                          {t('agents.howItWorks.agents.step3.title', 'Secure Confirmation')}
                        </Heading>
                        <Text textAlign="center">
                          {t('agents.howItWorks.agents.step3.description', 'Receive blockchain-secured confirmation of the completed transaction in real-time.')}
                        </Text>
                      </VStack>
                      
                      <VStack 
                        bg={cardBg} 
                        p={6} 
                        borderRadius="lg" 
                        boxShadow={softShadow}
                        spacing={4}
                      >
                        <Flex 
                          w={12} 
                          h={12} 
                          bg="brand.bitcash.400" 
                          
                          borderRadius="full" 
                          align="center" 
                          justify="center"
                          fontWeight="bold"
                          fontSize="xl"
                        >
                          4
                        </Flex>
                        <Heading size="md" textAlign="center">
                          {t('agents.howItWorks.agents.step4.title', 'Earn Commission')}
                        </Heading>
                        <Text textAlign="center">
                          {t('agents.howItWorks.agents.step4.description', 'Commissions are automatically calculated and credited to your agent account.')}
                        </Text>
                      </VStack>
                    </SimpleGrid>
                  </TabPanel>
                  
                  <TabPanel>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
                      <VStack 
                        bg={cardBg} 
                        p={6} 
                        borderRadius="lg" 
                        boxShadow={softShadow}
                        spacing={4}
                      >
                        <Flex 
                          w={12} 
                          h={12} 
                          bg="brand.bitcash.400" 
                          
                          borderRadius="full" 
                          align="center" 
                          justify="center"
                          fontWeight="bold"
                          fontSize="xl"
                        >
                          1
                        </Flex>
                        <Heading size="md" textAlign="center">
                          {t('agents.howItWorks.customers.step1.title', 'Locate Agent')}
                        </Heading>
                        <Text textAlign="center">
                          {t('agents.howItWorks.customers.step1.description', 'Find the nearest BitCash agent via the app map or look for the BitCash logo at local businesses.')}
                        </Text>
                      </VStack>
                      
                      <VStack 
                        bg={cardBg} 
                        p={6} 
                        borderRadius="lg" 
                        boxShadow={softShadow}
                        spacing={4}
                      >
                        <Flex 
                          w={12} 
                          h={12} 
                          bg="brand.bitcash.400" 
                          
                          borderRadius="full" 
                          align="center" 
                          justify="center"
                          fontWeight="bold"
                          fontSize="xl"
                        >
                          2
                        </Flex>
                        <Heading size="md" textAlign="center">
                          {t('agents.howItWorks.customers.step2.title', 'Verify Identity')}
                        </Heading>
                        <Text textAlign="center">
                          {t('agents.howItWorks.customers.step2.description', 'Present valid ID and complete verification for secure transaction processing.')}
                        </Text>
                      </VStack>
                      
                      <VStack 
                        bg={cardBg} 
                        p={6} 
                        borderRadius="lg" 
                        boxShadow={softShadow}
                        spacing={4}
                      >
                        <Flex 
                          w={12} 
                          h={12} 
                          bg="brand.bitcash.400" 
                          
                          borderRadius="full" 
                          align="center" 
                          justify="center"
                          fontWeight="bold"
                          fontSize="xl"
                        >
                          3
                        </Flex>
                        <Heading size="md" textAlign="center">
                          {t('agents.howItWorks.customers.step3.title', 'Request Service')}
                        </Heading>
                        <Text textAlign="center">
                          {t('agents.howItWorks.customers.step3.description', 'Deposit cash, withdraw funds, or complete merchant settlement transactions.')}
                        </Text>
                      </VStack>
                      
                      <VStack 
                        bg={cardBg} 
                        p={6} 
                        borderRadius="lg" 
                        boxShadow={softShadow}
                        spacing={4}
                      >
                        <Flex 
                          w={12} 
                          h={12} 
                          bg="brand.bitcash.400" 
                          
                          borderRadius="full" 
                          align="center" 
                          justify="center"
                          fontWeight="bold"
                          fontSize="xl"
                        >
                          4
                        </Flex>
                        <Heading size="md" textAlign="center">
                          {t('agents.howItWorks.customers.step4.title', 'Receive Confirmation')}
                        </Heading>
                        <Text textAlign="center">
                          {t('agents.howItWorks.customers.step4.description', 'Get instant digital confirmation and receipt of your completed transaction.')}
                        </Text>
                      </VStack>
                    </SimpleGrid>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </SlideFade>
          
          {/* COMMISSION STRUCTURE */}
<SlideFade in offsetY="30px">
  <Box 
    mb={16} 
    p={8} 
    bg={cardBg} 
    borderRadius="xl" 
    boxShadow={softShadow}
    borderLeft="4px solid"
    borderColor="brand.bitcash.400"
  >
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems="center">
      <Box>
        <Heading 
          fontSize={{ base: 'xl', md: '2xl' }} 
          mb={4} 
          color="brand.bitcash.600"
        >
          {t('agents.commissions.heading', 'Transparent Commission Structure')}
        </Heading>
        <Text mb={6}>
          {t('agents.commissions.subtext', 'Earn competitive commissions on every transaction with our transparent, tiered structure. As you grow, your commission rates can increase based on performance and volume.')}
        </Text>
        
        <List spacing={4} mb={6}>
          <ListItem>
            <HStack>
              <ListIcon as={SmallAddIcon} color="brand.bitcash.400" />
              <Text>{t('agents.commissions.benefit1', 'Weekly commission payouts directly to your account')}</Text>
            </HStack>
          </ListItem>
          <ListItem>
            <HStack>
              <ListIcon as={SmallAddIcon} color="brand.bitcash.400" />
              <Text>{t('agents.commissions.benefit2', 'Performance bonuses for top-tier agents')}</Text>
            </HStack>
          </ListItem>
          <ListItem>
            <HStack>
              <ListIcon as={SmallAddIcon} color="brand.bitcash.400" />
              <Text>{t('agents.commissions.benefit3', 'New customer acquisition rewards')}</Text>
            </HStack>
          </ListItem>
          <ListItem>
            <HStack>
              <ListIcon as={SmallAddIcon} color="brand.bitcash.400" />
              <Text>{t('agents.commissions.benefit4', 'Monthly volume-based incentive programs')}</Text>
            </HStack>
          </ListItem>
        </List>
        
        <Button variant="bitcash-outline" onClick={() => router.push('/agent/calculator')}>
          {t('agents.commissions.calculatorButton', 'Calculate Your Potential Earnings')}
        </Button>
      </Box>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <Stat 
          bg={cardBg} 
          p={5} 
          borderRadius="lg" 
          boxShadow="md"
          borderLeft="4px solid" 
          borderColor="brand.bitcash.400"
        >
          <StatLabel fontSize="lg">{t('agents.commissions.deposit', 'Cash Deposits')}</StatLabel>
          <StatNumber fontSize="3xl" color="green.500">1.2%</StatNumber>
          <StatHelpText>{t('agents.commissions.depositExplainer', 'Of transaction amount')}</StatHelpText>
        </Stat>
        
        <Stat 
          bg={cardBg} 
          p={5} 
          borderRadius="lg" 
          boxShadow="md"
          borderLeft="4px solid" 
          borderColor="brand.bitcash.400"
        >
          <StatLabel fontSize="lg">{t('agents.commissions.withdrawal', 'Cash Withdrawals')}</StatLabel>
          <StatNumber fontSize="3xl" color="green.500">0.8%</StatNumber>
          <StatHelpText>{t('agents.commissions.withdrawalExplainer', 'Of transaction amount')}</StatHelpText>
        </Stat>
        
        <Stat 
          bg={cardBg} 
          p={5} 
          borderRadius="lg" 
          boxShadow="md"
          borderLeft="4px solid" 
          borderColor="brand.bitcash.400"
        >
          <StatLabel fontSize="lg">{t('agents.commissions.merchantPay', 'Merchant Settlements')}</StatLabel>
          <StatNumber fontSize="3xl" color="green.500">0.5%</StatNumber>
          <StatHelpText>{t('agents.commissions.merchantExplainer', 'Of settlement amount')}</StatHelpText>
        </Stat>
        
        <Stat 
          bg={cardBg} 
          p={5} 
          borderRadius="lg" 
          boxShadow="md"
          borderLeft="4px solid" 
          borderColor="brand.bitcash.400"
        >
          <StatLabel fontSize="lg">{t('agents.commissions.newCustomer', 'New Customer Bonus')}</StatLabel>
          <StatNumber fontSize="3xl" color="green.500">$2.50</StatNumber>
          <StatHelpText>{t('agents.commissions.newCustomerExplainer', 'Per verified new customer')}</StatHelpText>
        </Stat>
      </SimpleGrid>
    </SimpleGrid>
  </Box>
</SlideFade>

{/* SECURITY & COMPLIANCE */}
<SlideFade in offsetY="30px">
  <Box mb={16}>
    <Grid 
      templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }}
      gap={8}
    >
      <GridItem colSpan={{ base: 1, lg: 1 }}>
        <Box 
          p={6} 
          bg={cardBg} 
          borderRadius="xl" 
          boxShadow={softShadow}
          height="100%"
        >
          <Flex 
            w={12} 
            h={12} 
            bg="brand.bitcash.400" 
            color="brand.bitcash.600" 
            borderRadius="lg" 
            align="center" 
            justify="center"
            mb={4}
          >
            <LockIcon boxSize={6} />
          </Flex>
          <Heading 
            fontSize="xl" 
            mb={4} 
            color="brand.bitcash.600"
          >
            {t('agents.security.heading', 'Security & Compliance First')}
          </Heading>
          <Text>
            {t('agents.security.description', 'At BitCash, security and compliance are non-negotiable. Our comprehensive approach combines advanced technology with strict policies to ensure the integrity of our agent network.')}
          </Text>
          <Button 
            mt={6} 
            rightIcon={<ChevronRightIcon />} 
            variant="link" 
            color="brand.bitcash.400"
            onClick={() => router.push('/agent/security')}
          >
            {t('agents.security.learnMore', 'Learn about our security protocols')}
          </Button>
        </Box>
      </GridItem>
      
      <GridItem colSpan={{ base: 1, lg: 2 }}>
        <Box 
          p={6} 
          bg={cardBg} 
          borderRadius="xl" 
          boxShadow={softShadow}
        >
          <Heading 
            fontSize="xl" 
            mb={5} 
            pb={2}
            borderBottom="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            {t('agents.security.measures.heading', 'Our Multi-layered Security Approach')}
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <VStack align="start" spacing={1}>
              <HStack>
                <Icon as={SecurityIcon} color="brand.bitcash.400" />
                <Text fontWeight="bold">{t('agents.security.measures.blockchain', 'Blockchain Technology')}</Text>
              </HStack>
              <Text fontSize="sm" ml={8}>{t('agents.security.measures.blockchainDesc', 'Immutable transaction records and cryptographic verification for all activities')}</Text>
            </VStack>
            
            <VStack align="start" spacing={1}>
              <HStack>
                <TimeIcon color="brand.bitcash.400" />
                <Text fontWeight="bold">{t('agents.security.measures.monitoring', 'Real-time Monitoring')}</Text>
              </HStack>
              <Text fontSize="sm" ml={8}>{t('agents.security.measures.monitoringDesc', 'AI-powered transaction analysis to detect and prevent suspicious activities')}</Text>
            </VStack>
            
            <VStack align="start" spacing={1}>
              <HStack>
                <InfoIcon color="brand.bitcash.400" />
                <Text fontWeight="bold">{t('agents.security.measures.verification', 'Strict Verification')}</Text>
              </HStack>
              <Text fontSize="sm" ml={8}>{t('agents.security.measures.verificationDesc', 'Thorough KYC and background checks for all agents before approval')}</Text>
            </VStack>
            
            <VStack align="start" spacing={1}>
              <HStack>
                <CheckCircleIcon color="brand.bitcash.400" />
                <Text fontWeight="bold">{t('agents.security.measures.compliance', 'Compliance Training')}</Text>
              </HStack>
              <Text fontSize="sm" ml={8}>{t('agents.security.measures.complianceDesc', 'Mandatory anti-fraud and compliance training for all network members')}</Text>
            </VStack>
          </SimpleGrid>
          
          <Box 
            mt={6} 
            p={4} 
            bg="red.50" 
            borderRadius="md" 
            borderLeft="4px solid red.500"
          >
            <Text fontWeight="bold" color="red.900">
              {t('agents.security.zeroTolerance.heading', 'Zero Tolerance for Fraudulent Activity')}
            </Text>
            <Text fontSize="sm" color="red.800">
              {t('agents.security.zeroTolerance.description', 'BitCash maintains a zero-tolerance policy for fraudulent or malicious activities. Any agent found engaging in suspicious behavior will be immediately suspended pending investigation, with permanent removal and possible legal action for confirmed violations.')}
            </Text>
          </Box>
        </Box>
      </GridItem>
    </Grid>
  </Box>
</SlideFade>

{/* TESTIMONIALS */}
<SlideFade in offsetY="30px">
  <Box mb={16}>
    <Heading 
      fontSize={{ base: 'xl', md: '2xl' }} 
      color="brand.bitcash.400"
      textAlign="center"
      mb={8}
    >
      {t('agents.testimonials.heading', 'What Our Agents Are Saying')}
    </Heading>
    
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
      <MotionBox 
        whileHover={{ y: -5 }}
        p={6} 
        bg={cardBg} 
        borderRadius="xl" 
        boxShadow={softShadow}
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          top: -4,
          left: 8,
          borderWidth: 8,
          borderStyle: 'solid',
          borderColor: `transparent transparent ${useColorModeValue('white', 'gray.800')} transparent`,
        }}
      >
        <HStack mb={4}>
          <Icon as={StarIcon} color="yellow.400" boxSize={5} />
          <Icon as={StarIcon} color="yellow.400" boxSize={5} />
          <Icon as={StarIcon} color="yellow.400" boxSize={5} />
          <Icon as={StarIcon} color="yellow.400" boxSize={5} />
          <Icon as={StarIcon} color="yellow.400" boxSize={5} />
        </HStack>
        <Text fontStyle="italic" mb={4}>
          {t('agents.testimonials.testimonial1.content', '"The BitCash platform has transformed my grocery store. We now serve 30-40 financial transactions daily, earning additional income while bringing in new customers who often purchase from our store as well."')}
        </Text>
        <HStack mt={6}>
          <Box 
            w={12} 
            h={12} 
            borderRadius="full" 
            bg="brand.bitcash.400"
            overflow="hidden"
          >
            <Image 
              src="/images/testimonial-1.jpg" 
              alt="Agent"
              fallback={<Box bg="brand.bitcash.400" w="100%" h="100%" />}
            />
          </Box>
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold">
              {t('agents.testimonials.testimonial1.name', 'David Chen')}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {t('agents.testimonials.testimonial1.location', 'Grocery Store Owner, Singapore')}
            </Text>
          </VStack>
        </HStack>
      </MotionBox>
      
      <MotionBox 
        whileHover={{ y: -5 }}
        p={6} 
        bg={cardBg} 
        borderRadius="xl" 
        boxShadow={softShadow}
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          top: -4,
          left: 8,
          borderWidth: 8,
          borderStyle: 'solid',
          borderColor: `transparent transparent ${useColorModeValue('white', 'gray.800')} transparent`,
        }}
      >
        <HStack mb={4}>
          <Icon as={StarIcon} color="yellow.400" boxSize={5} />
          <Icon as={StarIcon} color="yellow.400" boxSize={5} />
          <Icon as={StarIcon} color="yellow.400" boxSize={5} />
          <Icon as={StarIcon} color="yellow.400" boxSize={5} />
          <Icon as={StarIcon} color="yellow.400" boxSize={5} />
        </HStack>
        <Text fontStyle="italic" mb={4}>
          {t('agents.testimonials.testimonial2.content', '"I started as an individual agent and now operate a network of six locations. The blockchain verification gives customers confidence, and the security measures protect everyone. I am proud to provide this essential service."')}
        </Text>
        <HStack mt={6}>
          <Box 
            w={12} 
            h={12} 
            borderRadius="full" 
            bg="brand.bitcash.400"
            overflow="hidden"
          >
            <Image 
              src="/images/testimonial-2.jpg" 
              alt="Agent"
              fallback={<Box bg="brand.bitcash.400" w="100%" h="100%" />}
            />
          </Box>
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold">
              {t('agents.testimonials.testimonial2.name', 'Amina Okafor')}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {t('agents.testimonials.testimonial2.location', 'Super Agent, Lagos')}
            </Text>
          </VStack>
        </HStack>
      </MotionBox>
      
      <MotionBox 
        whileHover={{ y: -5 }}
        p={6} 
        bg={cardBg} 
        borderRadius="xl" 
        boxShadow={softShadow}
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          top: -4,
          left: 8,
          borderWidth: 8,
          borderStyle: 'solid',
          borderColor: `transparent transparent ${useColorModeValue('white', 'gray.800')} transparent`,
        }}
      >
        <HStack mb={4}>
          <Icon as={StarIcon} color="yellow.400" boxSize={5} />
          <Icon as={StarIcon} color="yellow.400" boxSize={5} />
          <Icon as={StarIcon} color="yellow.400" boxSize={5} />
          <Icon as={StarIcon} color="yellow.400" boxSize={5} />
          <Icon as={StarIcon} color="yellow.400" boxSize={5} />
        </HStack>
        <Text fontStyle="italic" mb={4}>
          {t('agents.testimonials.testimonial3.content', '"As a young entrepreneur, becoming a BitCash agent has given me a stable income and respect in my community. The training was excellent, and the app makes transactions simple. I am earning about $900 monthly in commissions."')}
        </Text>
        <HStack mt={6}>
          <Box 
            w={12} 
            h={12} 
            borderRadius="full" 
            bg="brand.bitcash.400"
            overflow="hidden"
          >
            <Image 
              src="/images/testimonial-3.jpg" 
              alt="Agent"
              fallback={<Box bg="brand.bitcash.400" w="100%" h="100%" />}
            />
          </Box>
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold">
              {t('agents.testimonials.testimonial3.name', 'Carlos Mendez')}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {t('agents.testimonials.testimonial3.location', 'Individual Agent, Mexico City')}
            </Text>
          </VStack>
        </HStack>
      </MotionBox>
    </SimpleGrid>
  </Box>
</SlideFade>

{/* FAQ SECTION */}
<SlideFade in offsetY="30px">
  <Box mb={16} position="relative">
    <Heading 
      fontSize={{ base: 'xl', md: '2xl' }} 
      mb={4}
      textAlign="center"
      color="brand.bitcash.600"
    >
      {t('agents.faq.heading', 'Frequently Asked Questions')}
    </Heading>

    <Accordion allowToggle>
      {getAgentFAQData(t).map((faq, idx) => (
        <AccordionItem
          key={idx}
          mb={4}
          bg={cardBg}
          border="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          borderRadius="lg"
          overflow="hidden"
          boxShadow="sm"
          _hover={{ boxShadow: "md" }}
        >
          {({ isExpanded }) => (
            <>
              <h2>
                <AccordionButton 
                  p={5} 
                  _expanded={{ bg: useColorModeValue('brand.bitcash.400', 'brand.bitcash.700') }}
                  _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                >
                  <Box
                    flex="1"
                    textAlign="left"
                    fontWeight="medium"
                    fontSize={{ base: 'md', md: 'lg' }}
                  >
                    <HStack>
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRightIcon color="brand.bitcash.400" boxSize={5} />
                      </motion.div>
                      <Text>{faq.question}</Text>
                    </HStack>
                  </Box>
                </AccordionButton>
              </h2>
              <AccordionPanel pb={6} px={5}>
                <Text fontSize="md">{faq.answer}</Text>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  </Box>
</SlideFade>

{/* CTA SECTION */}
<SlideFade in offsetY="30px">
  <Box
    mb={16}
    p={{ base: 8, md: 12 }}
    borderRadius="xl"
    bg="brand.bitcash.700"
    position="relative"
    overflow="hidden"
    boxShadow="2xl"
  >
    {/* Abstract design elements */}
    <Box 
      position="absolute" 
      bottom="-10%" 
      right="-5%" 
      w="30%" 
      h="120%" 
      bg="brand.bitcash.400" 
      opacity="0.2" 
      transform="rotate(-15deg)" 
      roundedLeft="full" 
    />
    
    <VStack spacing={6} position="relative" zIndex={2}>
      <Heading 
        fontSize={{ base: 'xl', md: '2xl' }}
        textAlign="center"
      >
        {t('agents.cta.heading', 'Join the BitCash Agent Network Today')}
      </Heading>
      <Text 
        fontSize={{ base: 'md', md: 'lg' }} 
        textAlign="center"
        maxW="800px"
      >
        {t('agents.cta.subtext', 'Become part of the financial revolution by providing essential services to your community while building a rewarding business opportunity for yourself.')}
      </Text>
      
      <SimpleGrid 
        columns={{ base: 1, md: 1 }} 
        mt={4} 
        w="full" 
        maxW="900px"
      >
        <VStack 
          p={5} 
          borderRadius="lg" 
          spacing={3}
          transition="all 0.3s"
          _hover={{ transform: "translateY(-5px)", bg: "whiteAlpha.300" }}
        >
          <Text fontWeight="bold" fontSize="lg">
            {t('agents.cta.option1.title', 'Become a BitCash Agent')}
          </Text>
          <Text fontSize="sm" textAlign="center">
            {t('agents.cta.option1.description', 'Add a new revenue stream to your existing business')}
          </Text>
          <Button 
            variant="bitcash-solid"
            size="sm" 
            mt={2}
            onClick={() => router.push('/signup/agent')}
          >
            {t('agents.cta.option1.button', 'Register as Agent')}
          </Button>
        </VStack>
      </SimpleGrid>
    </VStack>
  </Box>
</SlideFade>
</Container>
</Box>
</Layout>
  )
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default AgentsPage;