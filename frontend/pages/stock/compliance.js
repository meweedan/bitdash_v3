// pages/compliance.js
import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Head from 'next/head';
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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tag,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { 
  FaShieldAlt, 
  FaUserShield, 
  FaLock, 
  FaFileContract, 
  FaBalanceScale, 
  FaGlobe,
  FaPassport,
  FaDatabase,
  FaCheckCircle,
  FaUniversity,
  FaUserTie,
  FaRegCreditCard,
  FaExclamationTriangle,
  FaIdCard,
  FaHandshake,
  FaPiggyBank
} from 'react-icons/fa';
import Layout from '@/components/Layout';

const CompliancePage = () => {
  const { t } = useTranslation(['common', 'compliance']);
  const router = useRouter();
  
  const bgGradient = useColorModeValue(
    'linear(to-b, brand.bitstock.50, white)',
    'linear(to-b, gray.900, black)'
  );
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const subtleCardBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('brand.bitstock.100', 'gray.700');
  
  // Regulatory Bodies & Licenses
  const regulatoryInfo = [
    {
      authority: 'Dubai Financial Services Authority (DFSA)',
      description: 'BitStock is authorized and regulated by the DFSA to provide investment services in the Dubai International Financial Centre (DIFC).',
      license: 'License No. F0099',
      country: 'UAE',
      website: 'https://www.dfsa.ae',
      icon: FaUniversity
    },
    {
      authority: 'Capital Market Authority (CMA)',
      description: 'BitStock holds an investment license from the CMA to operate investment services in the Kingdom of Saudi Arabia.',
      license: 'Authorization No. 23-455',
      country: 'Saudi Arabia',
      website: 'https://cma.org.sa',
      icon: FaUniversity
    },
    {
      authority: 'Financial Regulatory Authority (FRA)',
      description: 'Licensed by Egypt\'s FRA to provide securities brokerage services and investment advice to Egyptian investors.',
      license: 'License No. 12877',
      country: 'Egypt',
      website: 'https://fra.gov.eg',
      icon: FaUniversity
    },
    {
      authority: 'Central Bank of Bahrain (CBB)',
      description: 'BitStock holds an Investment Business Firm License from the CBB to operate in Bahrain.',
      license: 'Investment Business Firm License IBF-235',
      country: 'Bahrain',
      website: 'https://www.cbb.gov.bh',
      icon: FaUniversity
    }
  ];
  
  // Security measures
  const securityMeasures = [
    {
      title: 'Multi-Factor Authentication (MFA)',
      description: 'Mandatory MFA for all account access, with biometric authentication options for mobile users.',
      icon: FaUserShield
    },
    {
      title: 'Asset Segregation',
      description: 'Client funds are held separately from company assets in segregated accounts at tier-1 banks.',
      icon: FaPiggyBank
    },
    {
      title: 'End-to-End Encryption',
      description: '256-bit encryption for all data transmission, with additional layers for financial transactions.',
      icon: FaLock
    },
    {
      title: 'Regular Security Audits',
      description: 'Quarterly penetration testing and security audits by independent cybersecurity firms.',
      icon: FaShieldAlt
    },
    {
      title: 'Investor Protection Insurance',
      description: 'Additional insurance coverage of up to $500,000 per client account against fraud and cybersecurity incidents.',
      icon: FaRegCreditCard
    },
    {
      title: 'Advanced Fraud Detection',
      description: 'AI-powered fraud detection systems monitoring transactions 24/7 for suspicious activities.',
      icon: FaExclamationTriangle
    }
  ];
  
  // Compliance frameworks
  const complianceFrameworks = [
    {
      name: 'Know Your Customer (KYC)',
      description: 'Comprehensive KYC procedures to verify client identity and assess risks.',
      requirements: [
        'Government-issued ID verification',
        'Proof of residence (not older than 3 months)',
        'Additional verification for high-value accounts',
        'Periodic KYC refreshes based on account activity'
      ]
    },
    {
      name: 'Anti-Money Laundering (AML)',
      description: 'Robust AML policies to detect and prevent money laundering activities.',
      requirements: [
        'Ongoing transaction monitoring',
        'Source of funds verification',
        'Suspicious activity reporting',
        'Regular employee AML training'
      ]
    },
    {
      name: 'Counter-Terrorism Financing (CTF)',
      description: 'Processes to prevent financing of terrorism through our platform.',
      requirements: [
        'Screening against global sanctions lists',
        'Enhanced due diligence for high-risk countries',
        'Monitoring of unusual transaction patterns',
        'Cooperation with international CTF initiatives'
      ]
    },
    {
      name: 'Market Conduct',
      description: 'Policies ensuring fair treatment of clients and market integrity.',
      requirements: [
        'Prevention of market manipulation',
        'Insider trading monitoring',
        'Fair pricing and execution',
        'Conflicts of interest management'
      ]
    }
  ];
  
  // Regional compliance features
  const regionalCompliance = [
    {
      region: 'GCC Countries',
      features: [
        'Compliance with GCC Unified AML/CFT Guidelines',
        'Adherence to local Foreign Account Tax Compliance Act (FATCA) requirements',
        'Integration with Gulf KYC Blockchain Consortium',
        'Quarterly reporting to GCC financial authorities'
      ]
    },
    {
      region: 'MENA Region',
      features: [
        'Compliance with Arab Monetary Fund regulatory frameworks',
        'Support for MENA Financial Action Task Force (MENAFATF) standards',
        'Tailored compliance procedures for individual MENA jurisdictions',
        'Regional politically exposed person (PEP) screening'
      ]
    },
    {
      region: 'Shariah Compliance',
      features: [
        'Supervisory board of qualified Shariah scholars',
        'Regular Shariah audits of all investment products',
        'Screening of investments against Shariah principles',
        'Transparency in profit distribution and fee structures'
      ]
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Compliance & Security | BitStock</title>
        <meta name="description" content="Learn about BitStock's comprehensive compliance, regulatory frameworks, and security measures designed to protect MENA and GCC investors." />
      </Head>
      
      <Box bg={bgGradient} minH="100vh">
        <Container maxW="8xl" py={12}>
          {/* Hero Section */}
          <Box textAlign="center" mb={16}>
            <Badge colorScheme="bitstock" fontSize="md" p={2} mb={4}>
              Your Security is Our Priority
            </Badge>
            <Heading
              as="h1"
              fontSize={{ base: '4xl', md: '5xl' }}
              bgGradient="linear(to-r, brand.bitstock.500, brand.bitstock.700)"
              bgClip="text"
              mb={6}
            >
              Compliance & Security
            </Heading>
            <Text fontSize={{ base: 'lg', md: 'xl' }} maxW="3xl" mx="auto" opacity={0.8}>
              BitStock operates with the highest standards of regulation, security, and compliance across the MENA and GCC regions, ensuring your investments are protected at every step.
            </Text>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mt={12}>
              <Card bg={cardBg} shadow="md" borderRadius="lg" borderColor={borderColor} borderWidth="1px">
                <CardBody>
                  <VStack spacing={4}>
                    <Icon as={FaUserShield} boxSize={10} color="brand.bitstock.500" />
                    <Heading size="md">Investor Protection</Heading>
                    <Text>Client funds are segregated and protected with up to $500,000 in additional insurance coverage.</Text>
                  </VStack>
                </CardBody>
              </Card>
              
              <Card bg={cardBg} shadow="md" borderRadius="lg" borderColor={borderColor} borderWidth="1px">
                <CardBody>
                  <VStack spacing={4}>
                    <Icon as={FaBalanceScale} boxSize={10} color="brand.bitstock.500" />
                    <Heading size="md">Full Regulatory Compliance</Heading>
                    <Text>Licensed and regulated by major financial authorities across the MENA and GCC regions.</Text>
                  </VStack>
                </CardBody>
              </Card>
              
              <Card bg={cardBg} shadow="md" borderRadius="lg" borderColor={borderColor} borderWidth="1px">
                <CardBody>
                  <VStack spacing={4}>
                    <Icon as={FaLock} boxSize={10} color="brand.bitstock.500" />
                    <Heading size="md">Advanced Security</Heading>
                    <Text>Multi-layered security infrastructure with encryption, biometrics, and continuous monitoring.</Text>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>
          </Box>
          
          {/* Main Content Tabs */}
          <Tabs variant="soft-rounded" colorScheme="brand.bitstock" size="lg" my={8}>
            <TabList justifyContent="center" mb={8} overflowX="auto" py={2} flexWrap={{ base: "wrap", md: "nowrap" }}>
              <Tab mx={1}><Icon as={FaUniversity} mr={2} /> Regulatory</Tab>
              <Tab mx={1}><Icon as={FaShieldAlt} mr={2} /> Security</Tab>
              <Tab mx={1}><Icon as={FaUserTie} mr={2} /> KYC & AML</Tab>
              <Tab mx={1}><Icon as={FaGlobe} mr={2} /> Regional Compliance</Tab>
              <Tab mx={1}><Icon as={FaFileContract} mr={2} /> Policies</Tab>
            </TabList>
            
            <TabPanels>
              {/* Regulatory Tab */}
              <TabPanel>
                <Card bg={cardBg} shadow="md" borderRadius="lg" mb={12}>
                  <CardBody>
                    <Heading size="lg" mb={8} textAlign="center">Our Regulatory Framework</Heading>
                    
                    <Text fontSize="lg" mb={8}>
                      BitStock operates under the oversight of multiple financial regulatory authorities across the MENA and GCC regions. This multi-jurisdictional approach ensures we maintain the highest standards of compliance while offering seamless investment services across borders.
                    </Text>
                    
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                      {regulatoryInfo.map((regulator, index) => (
                        <Card key={index} bg={subtleCardBg} overflow="hidden">
                          <CardBody>
                            <HStack mb={4}>
                              <Icon as={regulator.icon} boxSize={6} color="brand.bitstock.500" />
                              <Heading size="md">{regulator.authority}</Heading>
                            </HStack>
                            
                            <Text mb={3}>{regulator.description}</Text>
                            
                            <Flex justify="space-between" align="center" mt={4} flexWrap="wrap" gap={2}>
                              <Badge colorScheme="bitstock" p={2}>{regulator.license}</Badge>
                              <HStack>
                                <Badge variant="outline">{regulator.country}</Badge>
                                <Button 
                                  size="sm" 
                                  variant="link" 
                                  colorScheme="bitstock"
                                  onClick={() => window.open(regulator.website, '_blank')}
                                >
                                  Visit Website
                                </Button>
                              </HStack>
                            </Flex>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                    
                    <Box mt={10} p={6} bg={subtleCardBg} borderRadius="lg">
                      <Heading size="md" mb={4}>Investor Compensation Schemes</Heading>
                      <Text mb={4}>
                        In addition to regulatory protections, BitStock participates in the following investor compensation schemes:
                      </Text>
                      <List spacing={3}>
                        <ListItem>
                          <ListIcon as={FaCheckCircle} color="green.500" />
                          DIFC Investor Protection Fund - Up to $250,000 per client
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FaCheckCircle} color="green.500" />
                          Saudi Investor Protection Corporation - Up to SAR 200,000 per client
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FaCheckCircle} color="green.500" />
                          BitStock Additional Insurance Policy - Up to $500,000 coverage against fraud
                        </ListItem>
                      </List>
                    </Box>
                  </CardBody>
                </Card>
              </TabPanel>
              
              {/* Security Tab */}
              <TabPanel>
                <Card bg={cardBg} shadow="md" borderRadius="lg" mb={12}>
                  <CardBody>
                    <Heading size="lg" mb={8} textAlign="center">Our Security Infrastructure</Heading>
                    
                    <Text fontSize="lg" mb={8}>
                      BitStock employs industry-leading security technologies and practices to protect your personal information and investments. Our multi-layered security approach ensures that your assets remain safe at all times.
                    </Text>
                    
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} mb={10}>
                      {securityMeasures.map((measure, index) => (
                        <Card key={index} bg={subtleCardBg} height="100%">
                          <CardBody>
                            <VStack align="start" spacing={4}>
                              <Icon as={measure.icon} boxSize={8} color="brand.bitstock.500" />
                              <Heading size="md">{measure.title}</Heading>
                              <Text>{measure.description}</Text>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                    
                    <Box mt={10} p={6} bg={subtleCardBg} borderRadius="lg">
                      <Heading size="md" mb={4}>Security Certifications & Partnerships</Heading>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <HStack align="start" spacing={4}>
                          <Icon as={FaCheckCircle} color="green.500" mt={1} />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="bold">ISO/IEC 27001 Certified</Text>
                            <Text fontSize="sm">Information security management system certification</Text>
                          </VStack>
                        </HStack>
                        <HStack align="start" spacing={4}>
                          <Icon as={FaCheckCircle} color="green.500" mt={1} />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="bold">PCI DSS Compliant</Text>
                            <Text fontSize="sm">Payment Card Industry Data Security Standard</Text>
                          </VStack>
                        </HStack>
                        <HStack align="start" spacing={4}>
                          <Icon as={FaCheckCircle} color="green.500" mt={1} />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="bold">NIST Cybersecurity Framework</Text>
                            <Text fontSize="sm">Following NIST standards for cybersecurity</Text>
                          </VStack>
                        </HStack>
                        <HStack align="start" spacing={4}>
                          <Icon as={FaCheckCircle} color="green.500" mt={1} />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="bold">Crowdstrike Security Partner</Text>
                            <Text fontSize="sm">Enterprise-grade threat detection and prevention</Text>
                          </VStack>
                        </HStack>
                      </SimpleGrid>
                    </Box>
                  </CardBody>
                </Card>
              </TabPanel>
              
              {/* KYC & AML Tab */}
              <TabPanel>
                <Card bg={cardBg} shadow="md" borderRadius="lg" mb={12}>
                  <CardBody>
                    <Heading size="lg" mb={8} textAlign="center">KYC & AML Framework</Heading>
                    
                    <Text fontSize="lg" mb={8}>
                      BitStock implements comprehensive Know Your Customer (KYC) and Anti-Money Laundering (AML) procedures to ensure the integrity of our platform and comply with international financial regulations.
                    </Text>
                    
                    <Accordion allowMultiple mb={10}>
                      {complianceFrameworks.map((framework, index) => (
                        <AccordionItem key={index} border="1px" borderColor={borderColor} borderRadius="md" mb={4} overflow="hidden">
                          <h2>
                            <AccordionButton bg={subtleCardBg} _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }} py={4}>
                              <Box as="span" flex='1' textAlign='left'>
                                <HStack>
                                  <Icon 
                                    as={
                                      framework.name.includes('KYC') ? FaIdCard : 
                                      framework.name.includes('AML') ? FaExclamationTriangle : 
                                      framework.name.includes('CTF') ? FaShieldAlt : 
                                      FaHandshake
                                    } 
                                    color="brand.bitstock.500" 
                                  />
                                  <Text fontWeight="bold">{framework.name}</Text>
                                </HStack>
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel pb={4}>
                            <Text mb={4}>{framework.description}</Text>
                            <Text fontWeight="medium" mb={2}>Key Requirements:</Text>
                            <List spacing={2} ml={6}>
                              {framework.requirements.map((req, idx) => (
                                <ListItem key={idx}>
                                  <ListIcon as={FaCheckCircle} color="green.500" />
                                  {req}
                                </ListItem>
                              ))}
                            </List>
                          </AccordionPanel>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    
                    <Box p={6} bg={subtleCardBg} borderRadius="lg">
                      <Heading size="md" mb={4}>Our KYC Process</Heading>
                      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                        <VStack>
                          <Box 
                            borderRadius="full" 
                            bg="brand.bitstock.100" 
                            color="brand.bitstock.700"
                            p={4}
                            mb={2}
                          >
                            <Icon as={FaPassport} boxSize={6} />
                          </Box>
                          <Text fontWeight="bold">1. Identity Verification</Text>
                          <Text fontSize="sm" textAlign="center">Upload your government-issued ID and take a selfie for verification</Text>
                        </VStack>
                        
                        <VStack>
                          <Box 
                            borderRadius="full" 
                            bg="brand.bitstock.100" 
                            color="brand.bitstock.700"
                            p={4}
                            mb={2}
                          >
                            <Icon as={FaFileContract} boxSize={6} />
                          </Box>
                          <Text fontWeight="bold">2. Address Verification</Text>
                          <Text fontSize="sm" textAlign="center">Submit proof of residence not older than 3 months</Text>
                        </VStack>
                        
                        <VStack>
                          <Box 
                            borderRadius="full" 
                            bg="brand.bitstock.100" 
                            color="brand.bitstock.700"
                            p={4}
                            mb={2}
                          >
                            <Icon as={FaDatabase} boxSize={6} />
                          </Box>
                          <Text fontWeight="bold">3. Source of Funds</Text>
                          <Text fontSize="sm" textAlign="center">Verify your income source and financial information</Text>
                        </VStack>
                        
                        <VStack>
                          <Box 
                            borderRadius="full" 
                            bg="brand.bitstock.100" 
                            color="brand.bitstock.700"
                            p={4}
                            mb={2}
                          >
                            <Icon as={FaCheckCircle} boxSize={6} />
                          </Box>
                          <Text fontWeight="bold">4. Account Approval</Text>
                          <Text fontSize="sm" textAlign="center">Verification typically completed within 24 hours</Text>
                        </VStack>
                      </SimpleGrid>
                    </Box>
                  </CardBody>
                </Card>
              </TabPanel>
              
              {/* Regional Compliance Tab */}
              <TabPanel>
                <Card bg={cardBg} shadow="md" borderRadius="lg" mb={12}>
                  <CardBody>
                    <Heading size="lg" mb={8} textAlign="center">Regional Compliance</Heading>
                    
                    <Text fontSize="lg" mb={8}>
                      BitStock's compliance framework is specifically tailored to meet the unique regulatory requirements of the MENA and GCC regions, ensuring seamless and compliant investing across borders.
                    </Text>
                    
                    {regionalCompliance.map((region, index) => (
                      <Box 
                        key={index}
                        mb={8}
                        p={6}
                        bg={subtleCardBg}
                        borderRadius="lg"
                        borderLeft="4px solid"
                        borderColor="brand.bitstock.500"
                      >
                        <Heading size="md" mb={4}>{region.region}</Heading>
                        <List spacing={3}>
                          {region.features.map((feature, idx) => (
                            <ListItem key={idx}>
                              <ListIcon as={FaCheckCircle} color="green.500" />
                              {feature}
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    ))}
                    
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mt={10}>
                      <Card bg={useColorModeValue('white', 'gray.700')} shadow="md" borderRadius="lg">
                        <CardBody>
                          <VStack align="start" spacing={4}>
                            <Icon as={FaGlobe} boxSize={8} color="brand.bitstock.500" />
                            <Heading size="md">Cross-Border Compliance</Heading>
                            <Text>
                              Our multi-jurisdictional approach allows you to invest across borders while maintaining full compliance with both your home country regulations and the regulations of the market you're investing in.
                            </Text>
                          </VStack>
                        </CardBody>
                      </Card>
                      
                      <Card bg={useColorModeValue('white', 'gray.700')} shadow="md" borderRadius="lg">
                        <CardBody>
                          <VStack align="start" spacing={4}>
                            <Icon as={FaBalanceScale} boxSize={8} color="brand.bitstock.500" />
                            <Heading size="md">Tax Compliance</Heading>
                            <Text>
                              BitStock provides the necessary tax documentation for all jurisdictions we operate in, helping you maintain tax compliance when investing in global markets from MENA and GCC countries.
                            </Text>
                          </VStack>
                        </CardBody>
                      </Card>
                    </SimpleGrid>
                  </CardBody>
                </Card>
              </TabPanel>
              
              {/* Policies Tab */}
              <TabPanel>
                <Card bg={cardBg} shadow="md" borderRadius="lg" mb={12}>
                  <CardBody>
                    <Heading size="lg" mb={8} textAlign="center">Policies & Documentation</Heading>
                    
                    <Text fontSize="lg" mb={8}>
                      BitStock maintains comprehensive documentation of all our compliance and security policies. These documents are regularly reviewed and updated to ensure they meet the evolving regulatory landscape.
                    </Text>
                    
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={10}>
                      <Box 
                        p={6} 
                        borderRadius="lg" 
                        borderWidth="1px" 
                        borderColor={borderColor} 
                        _hover={{ 
                          borderColor: "brand.bitstock.500",
                          transform: "translateY(-5px)",
                          transition: "all 0.3s ease"
                        }}
                        cursor="pointer"
                        onClick={() => router.push('/policies/privacy')}
                      >
                        <VStack align="start" spacing={4}>
                          <Icon as={FaUserShield} boxSize={6} color="brand.bitstock.500" />
                          <Heading size="md">Privacy Policy</Heading>
                          <Text>Our commitment to protecting your personal information and how we process your data.</Text>
                          <Button variant="link" colorScheme="bitstock" size="sm">Read Policy</Button>
                        </VStack>
                      </Box>
                      
                      <Box 
                        p={6} 
                        borderRadius="lg" 
                        borderWidth="1px" 
                        borderColor={borderColor} 
                        _hover={{ 
                          borderColor: "brand.bitstock.500",
                          transform: "translateY(-5px)",
                          transition: "all 0.3s ease"
                        }}
                        cursor="pointer"
                        onClick={() => router.push('/policies/terms')}
                      >
                        <VStack align="start" spacing={4}>
                          <Icon as={FaFileContract} boxSize={6} color="brand.bitstock.500" />
                          <Heading size="md">Terms of Service</Heading>
                          <Text>The terms and conditions governing your use of BitStock's services and platform.</Text>
                          <Button variant="link" colorScheme="bitstock" size="sm">Read Terms</Button>
                        </VStack>
                      </Box>
                      
                      <Box 
                        p={6} 
                        borderRadius="lg" 
                        borderWidth="1px" 
                        borderColor={borderColor} 
                        _hover={{ 
                          borderColor: "brand.bitstock.500",
                          transform: "translateY(-5px)",
                          transition: "all 0.3s ease"
                        }}
                        cursor="pointer"
                        onClick={() => router.push('/policies/kyc-aml')}
                      >
                        <VStack align="start" spacing={4}>
                          <Icon as={FaIdCard} boxSize={6} color="brand.bitstock.500" />
                          <Heading size="md">KYC & AML Policy</Heading>
                          <Text>Our procedures for customer identity verification and prevention of money laundering.</Text>
                          <Button variant="link" colorScheme="bitstock" size="sm">Read Policy</Button>
                        </VStack>
                      </Box>
                      
                      <Box 
                        p={6} 
                        borderRadius="lg" 
                        borderWidth="1px" 
                        borderColor={borderColor} 
                        _hover={{ 
                          borderColor: "brand.bitstock.500",
                          transform: "translateY(-5px)",
                          transition: "all 0.3s ease"
                        }}
                        cursor="pointer"
                        onClick={() => router.push('/policies/risk')}
                      >
                        <VStack align="start" spacing={4}>
                          <Icon as={FaExclamationTriangle} boxSize={6} color="brand.bitstock.500" />
                          <Heading size="md">Risk Disclosure</Heading>
                          <Text>Important information about the risks associated with investing in financial markets.</Text>
                          <Button variant="link" colorScheme="bitstock" size="sm">Read Disclosure</Button>
                        </VStack>
                      </Box>
                    </SimpleGrid>
                    
                    <Box mt={10} p={6} bg={subtleCardBg} borderRadius="lg">
                      <Heading size="md" mb={4}>Policy Updates & Notifications</Heading>
                      <Text mb={4}>
                        We regularly review and update our policies to ensure they meet the evolving regulatory landscape. When we make significant changes to our policies, we notify our users through:
                      </Text>
                      <List spacing={3}>
                        <ListItem>
                        <ListIcon as={FaCheckCircle} color="green.500" />
                        Email notifications to your registered email address
                        </ListItem>
                        <ListItem>
                        <ListIcon as={FaCheckCircle} color="green.500" />
                        In-app notifications and alerts
                        </ListItem>
                        <ListItem>
                        <ListIcon as={FaCheckCircle} color="green.500" />
                        Website announcements on our login page
                        </ListItem>
                        <ListItem>
                        <ListIcon as={FaCheckCircle} color="green.500" />
                        Updates in our Terms of Service changelog
                        </ListItem>
                        </List>

                        {/* Call to Action */}
                        <Flex justify="center" mt={8}>
                        <Button
                            leftIcon={<FaFileContract />}
                            colorScheme="bitstock"
                            size="lg"
                            onClick={() => router.push('/contact')}
                        >
                            Contact Our Compliance Team
                        </Button>
                        </Flex>
                        </Box>
                        </CardBody>
                        </Card>
                        </TabPanel>
                        </TabPanels>
                        </Tabs>

                        {/* FAQ Section */}
                        <Box mt={16} mb={20}>
                        <Heading
                            textAlign="center"
                            mb={12}
                            fontSize={{ base: '3xl', md: '4xl' }}
                            bgGradient="linear(to-r, brand.bitstock.500, brand.bitstock.700)"
                            bgClip="text"
                        >
                            Frequently Asked Questions
                        </Heading>

                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                            <Card bg={cardBg} shadow="md" borderRadius="lg">
                            <CardBody>
                                <Accordion allowToggle>
                                <AccordionItem border="none" mb={4}>
                                    <h2>
                                    <AccordionButton _hover={{ bg: 'transparent' }}>
                                        <Box as="span" flex='1' textAlign='left' fontWeight="bold">
                                        How are my funds protected at BitStock?
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                    Your funds at BitStock are protected through multiple layers of security. We maintain segregated accounts at tier-1 banks, which means your investment funds are held separately from our operational assets. Additionally, we provide up to $500,000 in insurance coverage per client against fraud and cybersecurity incidents. As a regulated financial institution, we are also members of regional investor compensation schemes.
                                    </AccordionPanel>
                                </AccordionItem>

                                <AccordionItem border="none" mb={4}>
                                    <h2>
                                    <AccordionButton _hover={{ bg: 'transparent' }}>
                                        <Box as="span" flex='1' textAlign='left' fontWeight="bold">
                                        What information do I need to provide for KYC verification?
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                    Our KYC process requires government-issued identification (passport, national ID, or driver's license), proof of residence not older than 3 months (utility bill or bank statement), and information about your source of funds. For high-value accounts, additional verification may be required. All documentation can be submitted through our secure platform, and verification is typically completed within 24 hours.
                                    </AccordionPanel>
                                </AccordionItem>

                                <AccordionItem border="none" mb={4}>
                                    <h2>
                                    <AccordionButton _hover={{ bg: 'transparent' }}>
                                        <Box as="span" flex='1' textAlign='left' fontWeight="bold">
                                        Is BitStock compliant with Shariah principles?
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                    Yes, BitStock offers Shariah-compliant investment options that are overseen by a board of qualified Shariah scholars. Our platform allows you to filter investments that meet Shariah principles, and we conduct regular Shariah audits of all investment products. We maintain transparency in profit distribution and fee structures in accordance with Islamic finance principles.
                                    </AccordionPanel>
                                </AccordionItem>

                                <AccordionItem border="none">
                                    <h2>
                                    <AccordionButton _hover={{ bg: 'transparent' }}>
                                        <Box as="span" flex='1' textAlign='left' fontWeight="bold">
                                        How does BitStock ensure cross-border compliance?
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                    BitStock maintains licenses and authorizations in multiple jurisdictions across the MENA and GCC regions. Our multi-jurisdictional approach ensures that when you invest across borders, you remain compliant with both your home country regulations and the regulations of the market you're investing in. We provide necessary tax documentation for all jurisdictions we operate in and stay updated with the latest regional and international regulatory developments.
                                    </AccordionPanel>
                                </AccordionItem>
                                </Accordion>
                            </CardBody>
                            </Card>

                            <Card bg={cardBg} shadow="md" borderRadius="lg">
                            <CardBody>
                                <Accordion allowToggle>
                                <AccordionItem border="none" mb={4}>
                                    <h2>
                                    <AccordionButton _hover={{ bg: 'transparent' }}>
                                        <Box as="span" flex='1' textAlign='left' fontWeight="bold">
                                        What security measures does BitStock use to protect my account?
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                    BitStock employs multiple security measures including mandatory multi-factor authentication (MFA), biometric verification for mobile users, 256-bit encryption for all data transmission, and AI-powered fraud detection systems. We conduct quarterly security audits and penetration testing by independent cybersecurity firms to ensure our platform remains secure against emerging threats.
                                    </AccordionPanel>
                                </AccordionItem>

                                <AccordionItem border="none" mb={4}>
                                    <h2>
                                    <AccordionButton _hover={{ bg: 'transparent' }}>
                                        <Box as="span" flex='1' textAlign='left' fontWeight="bold">
                                        Which regulatory bodies oversee BitStock's operations?
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                    BitStock is regulated by multiple financial authorities including the Dubai Financial Services Authority (DFSA) in the UAE, the Capital Market Authority (CMA) in Saudi Arabia, the Financial Regulatory Authority (FRA) in Egypt, and the Central Bank of Bahrain (CBB). These regulatory bodies oversee our operations to ensure we maintain the highest standards of financial conduct and client protection.
                                    </AccordionPanel>
                                </AccordionItem>

                                <AccordionItem border="none" mb={4}>
                                    <h2>
                                    <AccordionButton _hover={{ bg: 'transparent' }}>
                                        <Box as="span" flex='1' textAlign='left' fontWeight="bold">
                                        How does BitStock handle my personal data?
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                    BitStock handles your personal data in accordance with our Privacy Policy and applicable data protection regulations. We employ strict data access controls, encryption, and secure storage practices. We only collect information necessary for our services, and we do not sell your personal data to third parties. You can access your data, request corrections, or opt out of certain data processing activities through your account settings.
                                    </AccordionPanel>
                                </AccordionItem>

                                <AccordionItem border="none">
                                    <h2>
                                    <AccordionButton _hover={{ bg: 'transparent' }}>
                                        <Box as="span" flex='1' textAlign='left' fontWeight="bold">
                                        What happens if there's a regulatory change in my country?
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                    BitStock actively monitors regulatory developments across all regions where we operate. If there are regulatory changes in your country that affect our services, we will promptly notify you through email and in-app notifications. Our compliance team works to ensure continuous service while adapting to new requirements. In some cases, we may need to request additional information or documentation from you to comply with new regulations.
                                    </AccordionPanel>
                                </AccordionItem>
                                </Accordion>
                            </CardBody>
                            </Card>
                        </SimpleGrid>
                        </Box>

                        {/* Call to Action Section */}
                        <Box
                        bg={useColorModeValue('brand.bitstock.50', 'gray.800')}
                        borderRadius="xl"
                        p={{ base: 6, md: 10 }}
                        mt={16}
                        mb={8}
                        borderWidth="1px"
                        borderColor={borderColor}
                        >
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems="center">
                            <Box>
                            <Badge colorScheme="bitstock" fontSize="md" p={2} mb={4}>
                                Compliant Investment Solutions
                            </Badge>
                            <Heading mb={4} size="lg">
                                Ready to start investing with confidence?
                            </Heading>
                            <Text fontSize="lg" mb={6}>
                                Open an account today and experience the security and compliance that comes with BitStock's regulated platform. Our team is ready to guide you through every step of the process.
                            </Text>
                            <HStack spacing={4}>
                                <Button 
                                colorScheme="bitstock" 
                                size="lg" 
                                leftIcon={<FaUserTie />}
                                onClick={() => router.push('/signup')}
                                >
                                Open an Account
                                </Button>
                                <Button 
                                variant="outline" 
                                colorScheme="bitstock" 
                                size="lg"
                                leftIcon={<FaHandshake />}
                                onClick={() => router.push('/contact')}
                                >
                                Speak to a Compliance Officer
                                </Button>
                            </HStack>
                            </Box>
                            <Flex justify="center">
                            <Icon
                                as={FaShieldAlt}
                                boxSize={{ base: 24, md: 40 }}
                                color="brand.bitstock.300"
                                opacity={0.8}
                            />
                            </Flex>
                        </SimpleGrid>
                    </Box>
                </Container>
            </Box>
        </Layout>
    );
};

export async function getStaticProps({ locale }) {
return {
props: {
  ...(await serverSideTranslations(locale, ['common', 'compliance'])),
},
};
}

export default CompliancePage;