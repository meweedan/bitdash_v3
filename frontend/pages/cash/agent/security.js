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
  List,
  ListItem,
  ListIcon,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Image,
  SlideFade,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Badge,
} from '@chakra-ui/react';

// Chakra UI Icons
import {
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
  LockIcon,
  ArrowForwardIcon,
} from '@chakra-ui/icons';

// Layout component
import Layout from '@/components/Layout';

// Import custom icons (these would normally be from react-icons)
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

function Security() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  // Colors & UI
  const cardBg = useColorModeValue('white', 'gray.800');
  const accentColor = useColorModeValue('brand.cash.600', 'brand.cash.400');
  const accentBg = useColorModeValue('brand.bitcash.50', 'brand.bitcash.900');
  const softShadow = useColorModeValue('lg', 'dark-lg');

  return (
    <Layout>
      <Box 
        minH="100vh" 
        py={16}
      >
        <Container maxW="7xl">
          <SlideFade in offsetY="20px">
            <VStack spacing={4} textAlign="center" mb={10}>
              <Badge colorScheme="red" fontSize="md" p={2} borderRadius="md">
                {t('security.badge', 'Security & Compliance')}
              </Badge>
              <Heading 
                fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                color={accentColor}
              >
                {t('security.heading', 'BitCash Agent Network Security Protocols')}
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg' }} maxW="800px">
                {t('security.subheading', 'How we ensure the integrity, security, and compliance of our agent network')}
              </Text>
            </VStack>
          </SlideFade>
          
          {/* Main Content */}
          <SlideFade in offsetY="30px">
            <Box 
              bg={cardBg} 
              p={{ base: 6, md: 8 }} 
              borderRadius="xl" 
              boxShadow={softShadow}
              mb={8}
            >
              <Tabs isFitted colorScheme="green" variant="enclosed">
                <TabList mb="1em">
                  <Tab>{t('security.tabs.blockchain', 'Blockchain Security')}</Tab>
                  <Tab>{t('security.tabs.agent', 'Agent Verification')}</Tab>
                  <Tab>{t('security.tabs.fraud', 'Fraud Prevention')}</Tab>
                </TabList>
                <TabPanels>
                  {/* Blockchain Security Tab */}
                  <TabPanel>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} alignItems="center">
                      <Box>
                        <Heading size="lg" mb={4} color={accentColor}>
                          {t('security.blockchain.heading', 'Blockchain Technology')}
                        </Heading>
                        <Text mb={4}>
                          {t('security.blockchain.intro', 'BitCash leverages secure blockchain technology to create a transparent, immutable record of all transactions processed through our agent network.')}
                        </Text>
                        
                        <List spacing={3} mb={4}>
                          <ListItem>
                            <HStack alignItems="start">
                              <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
                              <Box>
                                <Text fontWeight="bold">
                                  {t('security.blockchain.feature1.title', 'Immutable Transaction Records')}
                                </Text>
                                <Text fontSize="sm">
                                  {t('security.blockchain.feature1.description', 'Once recorded on our blockchain, transaction details cannot be altered or tampered with, ensuring complete audit trail integrity.')}
                                </Text>
                              </Box>
                            </HStack>
                          </ListItem>
                          
                          <ListItem>
                            <HStack alignItems="start">
                              <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
                              <Box>
                                <Text fontWeight="bold">
                                  {t('security.blockchain.feature2.title', 'Cryptographic Verification')}
                                </Text>
                                <Text fontSize="sm">
                                  {t('security.blockchain.feature2.description', 'Each transaction is cryptographically signed and verified, preventing unauthorized modifications or fraudulent entries.')}
                                </Text>
                              </Box>
                            </HStack>
                          </ListItem>
                          
                          <ListItem>
                            <HStack alignItems="start">
                              <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
                              <Box>
                                <Text fontWeight="bold">
                                  {t('security.blockchain.feature3.title', 'Real-time Consensus')}
                                </Text>
                                <Text fontSize="sm">
                                  {t('security.blockchain.feature3.description', 'Our distributed ledger technology ensures that all nodes in the network agree on the validity of transactions before they are confirmed.')}
                                </Text>
                              </Box>
                            </HStack>
                          </ListItem>
                          
                          <ListItem>
                            <HStack alignItems="start">
                              <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
                              <Box>
                                <Text fontWeight="bold">
                                  {t('security.blockchain.feature4.title', 'Digital Receipts')}
                                </Text>
                                <Text fontSize="sm">
                                  {t('security.blockchain.feature4.description', 'Both agents and customers receive cryptographically secure digital receipts for every transaction, providing indisputable proof of service.')}
                                </Text>
                              </Box>
                            </HStack>
                          </ListItem>
                        </List>
                      </Box>
                      
                      <Flex justifyContent="center">
                        <Flex 
                          w={{ base: "200px", md: "300px" }} 
                          h={{ base: "200px", md: "300px" }} 
                          bg={accentBg} 
                          borderRadius="full" 
                          justifyContent="center" 
                          alignItems="center"
                        >
                            <Icon as={BlockchainIcon} boxSize={24} color={accentColor} />
                        </Flex>
                      </Flex>
                    </SimpleGrid>
                  </TabPanel>
                  
                  {/* Agent Verification Tab */}
                  <TabPanel>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} alignItems="center">
                      <Box>
                        <Heading size="lg" mb={4} color={accentColor}>
                          {t('security.verification.heading', 'Agent Verification Process')}
                        </Heading>
                        <Text mb={4}>
                          {t('security.verification.intro', 'We maintain the highest standards for our agent network through a comprehensive verification and monitoring system.')}
                        </Text>
                        
                        <List spacing={3} mb={4}>
                          <ListItem>
                            <HStack alignItems="start">
                              <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
                              <Box>
                                <Text fontWeight="bold">
                                  {t('security.verification.step1.title', 'Identity Verification')}
                                </Text>
                                <Text fontSize="sm">
                                  {t('security.verification.step1.description', 'Multi-factor identity verification including government-issued photo ID and biometric verification for all agent applicants.')}
                                </Text>
                              </Box>
                            </HStack>
                          </ListItem>
                          
                          <ListItem>
                            <HStack alignItems="start">
                              <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
                              <Box>
                                <Text fontWeight="bold">
                                  {t('security.verification.step2.title', 'Business Documentation')}
                                </Text>
                                <Text fontSize="sm">
                                  {t('security.verification.step2.description', 'For business locations, we verify business registration, licensing, proof of address, and operational history.')}
                                </Text>
                              </Box>
                            </HStack>
                          </ListItem>
                          
                          <ListItem>
                            <HStack alignItems="start">
                              <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
                              <Box>
                                <Text fontWeight="bold">
                                  {t('security.verification.step3.title', 'Background Checks')}
                                </Text>
                                <Text fontSize="sm">
                                  {t('security.verification.step3.description', 'Comprehensive background screening for criminal history, financial records, and previous business activities.')}
                                </Text>
                              </Box>
                            </HStack>
                          </ListItem>
                          
                          <ListItem>
                            <HStack alignItems="start">
                              <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
                              <Box>
                                <Text fontWeight="bold">
                                  {t('security.verification.step4.title', 'Mandatory Training')}
                                </Text>
                                <Text fontSize="sm">
                                  {t('security.verification.step4.description', 'All agents must complete and pass our compliance, security, and anti-fraud training program before activation.')}
                                </Text>
                              </Box>
                            </HStack>
                          </ListItem>
                          
                          <ListItem>
                            <HStack alignItems="start">
                              <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
                              <Box>
                                <Text fontWeight="bold">
                                  {t('security.verification.step5.title', 'Ongoing Monitoring')}
                                </Text>
                                <Text fontSize="sm">
                                  {t('security.verification.step5.description', 'Regular performance reviews, customer feedback analysis, and mystery shopping audits to ensure continuous compliance.')}
                                </Text>
                              </Box>
                            </HStack>
                          </ListItem>
                        </List>
                      </Box>
                      
                      <Flex justifyContent="center">
                        <Box 
                          w={{ base: "250px", md: "350px" }} 
                          h={{ base: "250px", md: "350px" }} 
                          bg={accentBg} 
                          borderRadius="xl" 
                          p={6}
                          position="relative"
                          overflow="hidden"
                        >
                          <Icon as={SecurityIcon} position="absolute" opacity={0.1} boxSize={64} right={-5} bottom={-5} />
                          <VStack spacing={4} align="start">
                            <Badge colorScheme="green">Step 1</Badge>
                            <Text fontWeight="bold">Application Review</Text>
                            <Divider />
                            
                            <Badge colorScheme="blue">Step 2</Badge>
                            <Text fontWeight="bold">Document Verification</Text>
                            <Divider />
                            
                            <Badge colorScheme="purple">Step 3</Badge>
                            <Text fontWeight="bold">Background Screening</Text>
                            <Divider />
                            
                            <Badge colorScheme="orange">Step 4</Badge>
                            <Text fontWeight="bold">Security Training</Text>
                            <Divider />
                            
                            <Badge colorScheme="red">Step 5</Badge>
                            <Text fontWeight="bold">Final Approval</Text>
                          </VStack>
                        </Box>
                      </Flex>
                    </SimpleGrid>
                  </TabPanel>
                  
                  {/* Fraud Prevention Tab */}
                  <TabPanel>
                    <VStack spacing={6} align="stretch">
                      <Heading size="lg" mb={2} color={accentColor}>
                        {t('security.fraud.heading', 'Comprehensive Fraud Prevention')}
                      </Heading>
                      <Text mb={4}>
                        {t('security.fraud.intro', 'BitCash maintains a zero-tolerance policy for fraudulent activities with a multi-layered approach to detect, prevent, and address potential threats.')}
                      </Text>
                      
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <Box
                          bg={accentBg}
                          p={5}
                          borderRadius="lg"
                          borderLeft="4px solid"
                          borderColor={accentColor}
                        >
                          <Heading size="md" mb={3}>
                            {t('security.fraud.detection.heading', 'Fraud Detection Systems')}
                          </Heading>
                          <List spacing={3}>
                            <ListItem>
                              <HStack>
                                <ListIcon as={CheckCircleIcon} color="green.500" />
                                <Text>{t('security.fraud.detection.feature1', 'AI-powered transaction monitoring')}</Text>
                              </HStack>
                            </ListItem>
                            <ListItem>
                              <HStack>
                                <ListIcon as={CheckCircleIcon} color="green.500" />
                                <Text>{t('security.fraud.detection.feature2', 'Behavior analysis algorithms')}</Text>
                              </HStack>
                            </ListItem>
                            <ListItem>
                              <HStack>
                                <ListIcon as={CheckCircleIcon} color="green.500" />
                                <Text>{t('security.fraud.detection.feature3', 'Pattern recognition systems')}</Text>
                              </HStack>
                            </ListItem>
                            <ListItem>
                              <HStack>
                                <ListIcon as={CheckCircleIcon} color="green.500" />
                                <Text>{t('security.fraud.detection.feature4', 'Location verification technology')}</Text>
                              </HStack>
                            </ListItem>
                            <ListItem>
                              <HStack>
                                <ListIcon as={CheckCircleIcon} color="green.500" />
                                <Text>{t('security.fraud.detection.feature5', '24/7 security operations center')}</Text>
                              </HStack>
                            </ListItem>
                          </List>
                        </Box>
                        
                        <Box
                          bg={accentBg}
                          p={5}
                          borderRadius="lg"
                          borderLeft="4px solid"
                          borderColor={accentColor}
                        >
                          <Heading size="md" mb={3}>
                            {t('security.fraud.prevention.heading', 'Preventative Measures')}
                          </Heading>
                          <List spacing={3}>
                            <ListItem>
                              <HStack>
                                <ListIcon as={CheckCircleIcon} color="green.500" />
                                <Text>{t('security.fraud.prevention.feature1', 'Transaction limits and velocity controls')}</Text>
                              </HStack>
                            </ListItem>
                            <ListItem>
                              <HStack>
                                <ListIcon as={CheckCircleIcon} color="green.500" />
                                <Text>{t('security.fraud.prevention.feature2', 'Multi-factor authentication requirements')}</Text>
                              </HStack>
                            </ListItem>
                            <ListItem>
                              <HStack>
                                <ListIcon as={CheckCircleIcon} color="green.500" />
                                <Text>{t('security.fraud.prevention.feature3', 'Real-time transaction verification')}</Text>
                              </HStack>
                            </ListItem>
                            <ListItem>
                              <HStack>
                                <ListIcon as={CheckCircleIcon} color="green.500" />
                                <Text>{t('security.fraud.prevention.feature4', 'Agent education and awareness programs')}</Text>
                              </HStack>
                            </ListItem>
                            <ListItem>
                              <HStack>
                                <ListIcon as={CheckCircleIcon} color="green.500" />
                                <Text>{t('security.fraud.prevention.feature5', 'Customer verification protocols')}</Text>
                              </HStack>
                            </ListItem>
                          </List>
                        </Box>
                      </SimpleGrid>
                      
                      <Alert 
                        status="error" 
                        variant="solid" 
                        borderRadius="md" 
                        mt={4}
                      >
                        <AlertIcon />
                        <Box>
                          <AlertTitle>{t('security.fraud.zeroTolerance.title', 'Zero Tolerance Policy')}</AlertTitle>
                          <AlertDescription>
                            {t('security.fraud.zeroTolerance.description', 'Any agent found engaging in fraudulent activities will be immediately suspended, permanently removed from our network, and reported to relevant authorities. We are committed to maintaining the highest standards of integrity across our platform.')}
                          </AlertDescription>
                        </Box>
                      </Alert>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </SlideFade>
          
          {/* Additional Security Measures */}
          <SlideFade in offsetY="30px">
            <Box 
              bg={cardBg} 
              p={{ base: 6, md: 8 }} 
              borderRadius="xl" 
              boxShadow={softShadow}
              mb={8}
            >
              <Heading size="lg" mb={6} color={accentColor}>
                {t('security.additional.heading', 'Additional Security Measures')}
              </Heading>
              
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <Box p={5} bg={accentBg} borderRadius="lg">
                  <Flex
                    w={12}
                    h={12}
                    bg="brand.cash.400"
                    color="white"
                    borderRadius="full"
                    justifyContent="center"
                    alignItems="center"
                    mb={4}
                  >
                    <LockIcon boxSize={6} />
                  </Flex>
                  <Heading size="md" mb={2}>
                    {t('security.additional.kyc.title', 'Customer KYC')}
                  </Heading>
                  <Text fontSize="sm">
                    {t('security.additional.kyc.description', 'All customers must complete Know Your Customer verification before processing transactions above threshold limits.')}
                  </Text>
                </Box>
                
                <Box p={5} bg={accentBg} borderRadius="lg">
                  <Flex
                    w={12}
                    h={12}
                    bg="brand.cash.400"
                    color="white"
                    borderRadius="full"
                    justifyContent="center"
                    alignItems="center"
                    mb={4}
                  >
                    <InfoIcon boxSize={6} />
                  </Flex>
                  <Heading size="md" mb={2}>
                    {t('security.additional.audits.title', 'Regular Audits')}
                  </Heading>
                  <Text fontSize="sm">
                    {t('security.additional.audits.description', 'Mystery shoppers and surprise compliance audits maintain network integrity and ensure consistent adherence to protocols.')}
                  </Text>
                </Box>
                
                <Box p={5} bg={accentBg} borderRadius="lg">
                  <Flex
                    w={12}
                    h={12}
                    bg="brand.cash.400"
                    color="white"
                    borderRadius="full"
                    justifyContent="center"
                    alignItems="center"
                    mb={4}
                  >
                    <WarningIcon boxSize={6} />
                  </Flex>
                  <Heading size="md" mb={2}>
                    {t('security.additional.reporting.title', 'Incident Reporting')}
                  </Heading>
                  <Text fontSize="sm">
                    {t('security.additional.reporting.description', 'Secure channels for customers and agents to report suspicious activities with timely investigation processes.')}
                  </Text>
                </Box>
              </SimpleGrid>
            </Box>
          </SlideFade>
          
          {/* Compliance Framework */}
          <SlideFade in offsetY="30px">
            <Box 
              bg={cardBg} 
              p={{ base: 6, md: 8 }} 
              borderRadius="xl" 
              boxShadow={softShadow}
              mb={8}
            >
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} alignItems="center">
                <Box>
                  <Heading size="lg" mb={4} color={accentColor}>
                    {t('security.compliance.heading', 'Regulatory Compliance Framework')}
                  </Heading>
                  <Text mb={4}>
                    {t('security.compliance.intro', 'BitCash maintains strict adherence to all applicable financial regulations, AML policies, and industry standards.')}
                  </Text>
                  
                  <List spacing={3}>
                    <ListItem>
                      <HStack>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        <Text>{t('security.compliance.feature1', 'Anti-Money Laundering (AML) compliance')}</Text>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        <Text>{t('security.compliance.feature2', 'Counter-Terrorist Financing (CTF) protocols')}</Text>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        <Text>{t('security.compliance.feature3', 'Regulatory reporting infrastructure')}</Text>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        <Text>{t('security.compliance.feature4', 'Regular third-party security audits')}</Text>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        <Text>{t('security.compliance.feature5', 'Transaction monitoring and reporting')}</Text>
                      </HStack>
                    </ListItem>
                  </List>
                </Box>
                
                <Flex justifyContent="center">
                  <Box 
                    p={6} 
                    bg={accentBg} 
                    borderRadius="xl" 
                    maxW="md"
                  >
                    <Heading size="md" mb={4} textAlign="center">
                      {t('security.compliance.certifications.heading', 'Certifications & Standards')}
                    </Heading>
                    <SimpleGrid columns={2} spacing={4}>
                      <Box p={4} bg={cardBg} borderRadius="lg" textAlign="center">
                        <Text fontWeight="bold">ISO 27001</Text>
                        <Text fontSize="xs">Information Security</Text>
                      </Box>
                      <Box p={4} bg={cardBg} borderRadius="lg" textAlign="center">
                        <Text fontWeight="bold">PCI DSS</Text>
                        <Text fontSize="xs">Payment Data Security</Text>
                      </Box>
                      <Box p={4} bg={cardBg} borderRadius="lg" textAlign="center">
                        <Text fontWeight="bold">GDPR</Text>
                        <Text fontSize="xs">Data Protection</Text>
                      </Box>
                      <Box p={4} bg={cardBg} borderRadius="lg" textAlign="center">
                        <Text fontWeight="bold">SOC 2</Text>
                        <Text fontSize="xs">Security Controls</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                </Flex>
              </SimpleGrid>
            </Box>
          </SlideFade>
          
          {/* CTA Section */}
          <SlideFade in offsetY="30px">
            <Box 
              bg="brand.cash.600" 
              color="white" 
              p={{ base: 6, md: 8 }} 
              borderRadius="xl" 
              boxShadow={softShadow}
              mb={8}
              textAlign="center"
            >
              <Heading size="lg" mb={4}>
                {t('security.cta.heading', 'Our Commitment to Security')}
              </Heading>
              <Text maxW="2xl" mx="auto" mb={6}>
                {t('security.cta.description', 'BitCash is committed to maintaining the highest standards of security, integrity, and compliance across our agent network. Our multi-layered approach protects agents, customers, and the overall financial ecosystem.')}
              </Text>
              <Button 
                variant="bitcash-solid" 
                size="lg"
                onClick={() => router.push('/signup/agent')}
                rightIcon={<ArrowForwardIcon />}
              >
                {t('security.cta.button', 'Apply to Become an Agent')}
              </Button>
            </Box>
          </SlideFade>
          
          <Flex justifyContent="center" mt={10}>
            <Button 
              variant="link" 
              color={accentColor}
              onClick={() => router.push('/agents')}
            >
              {t('security.backButton', 'Back to Agent Information')}
            </Button>
          </Flex>
        </Container>
      </Box>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default Security;