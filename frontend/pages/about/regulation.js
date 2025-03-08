import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Stack,
  Icon,
  useColorMode,
  useBreakpointValue,
  Divider,
  HStack,
  VStack,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  Alert,
  AlertIcon,
  Button,
  Link
} from '@chakra-ui/react';
import { FaShieldAlt, FaCheckCircle, FaFileAlt, FaGlobeAmericas, FaLock, FaUniversity } from 'react-icons/fa';
import Head from 'next/head';
import Layout from '@/components/Layout';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'about'])),
    },
  };
}

export default function Regulation() {
  const { t } = useTranslation(['common', 'about']);
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  // Responsive settings
  const headingSize = useBreakpointValue({ base: 'xl', md: '2xl' });
  const subheadingSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const textSize = useBreakpointValue({ base: 'sm', md: 'md' });
  
  // Regulatory Licenses
  const regulatoryLicenses = [
    {
      region: t('about:regulation.licenses.uk.region', 'United Kingdom'),
      authority: t('about:regulation.licenses.uk.authority', 'Financial Conduct Authority (FCA)'),
      licenseNumber: 'FRN: 123456',
      description: t('about:regulation.licenses.uk.description', 'Our FCA license allows us to provide investment services, payment processing, and electronic money issuance throughout the United Kingdom.'),
      icon: FaUniversity,
      coverageAreas: [
        t('about:regulation.coverageAreas.investment', 'Investment Services'),
        t('about:regulation.coverageAreas.payment', 'Payment Processing'),
        t('about:regulation.coverageAreas.electronic', 'Electronic Money Issuance')
      ]
    },
    {
      region: t('about:regulation.licenses.eu.region', 'European Union'),
      authority: t('about:regulation.licenses.eu.authority', 'Cyprus Securities and Exchange Commission (CySEC)'),
      licenseNumber: 'License No: 987/65',
      description: t('about:regulation.licenses.eu.description', 'Our CySEC license enables BitDash to offer regulated investment services across all European Economic Area (EEA) member states under MiFID II passporting rules.'),
      icon: FaGlobeAmericas,
      coverageAreas: [
        t('about:regulation.coverageAreas.brokerage', 'Brokerage Services'),
        t('about:regulation.coverageAreas.portfolio', 'Portfolio Management'),
        t('about:regulation.coverageAreas.investment', 'Investment Advice')
      ]
    },
    {
      region: t('about:regulation.licenses.australia.region', 'Australia'),
      authority: t('about:regulation.licenses.australia.authority', 'Australian Securities and Investments Commission (ASIC)'),
      licenseNumber: 'AFSL: 654321',
      description: t('about:regulation.licenses.australia.description', 'Our ASIC license permits BitDash to provide financial services including trading in derivatives and foreign exchange in Australia.'),
      icon: FaFileAlt,
      coverageAreas: [
        t('about:regulation.coverageAreas.derivatives', 'Derivatives Trading'),
        t('about:regulation.coverageAreas.forex', 'Foreign Exchange'),
        t('about:regulation.coverageAreas.securities', 'Securities Trading')
      ]
    },
    {
      region: t('about:regulation.licenses.singapore.region', 'Singapore'),
      authority: t('about:regulation.licenses.singapore.authority', 'Monetary Authority of Singapore (MAS)'),
      licenseNumber: 'CMS License: XXX-XXXXX',
      description: t('about:regulation.licenses.singapore.description', 'BitDash holds a Capital Markets Services license from MAS, allowing us to deal in securities and provide custodial services for digital assets in Singapore.'),
      icon: FaShieldAlt,
      coverageAreas: [
        t('about:regulation.coverageAreas.securities', 'Securities Dealing'),
        t('about:regulation.coverageAreas.digitalAssets', 'Digital Asset Custody'),
        t('about:regulation.coverageAreas.advising', 'Advising on Investments')
      ]
    }
  ];
  
  // Compliance Frameworks
  const complianceFrameworks = [
    {
      name: t('about:regulation.frameworks.aml.name', 'Anti-Money Laundering (AML)'),
      description: t('about:regulation.frameworks.aml.description', 'Our comprehensive AML program follows global standards including risk assessment, customer due diligence, transaction monitoring, and suspicious activity reporting.'),
      procedures: [
        t('about:regulation.frameworks.aml.procedures.kyc', 'Know Your Customer (KYC) verification'),
        t('about:regulation.frameworks.aml.procedures.monitoring', 'Continuous transaction monitoring'),
        t('about:regulation.frameworks.aml.procedures.screening', 'Sanctions and PEP screening'),
        t('about:regulation.frameworks.aml.procedures.reporting', 'Suspicious activity reporting')
      ]
    },
    {
      name: t('about:regulation.frameworks.data.name', 'Data Protection and Privacy'),
      description: t('about:regulation.frameworks.data.description', 'BitDash maintains strict data protection standards in compliance with GDPR, CCPA, and other relevant privacy regulations across our operating jurisdictions.'),
      procedures: [
        t('about:regulation.frameworks.data.procedures.consent', 'Transparent consent mechanisms'),
        t('about:regulation.frameworks.data.procedures.management', 'Secure data management practices'),
        t('about:regulation.frameworks.data.procedures.rights', 'User data access and deletion rights'),
        t('about:regulation.frameworks.data.procedures.breach', 'Data breach notification protocols')
      ]
    },
    {
      name: t('about:regulation.frameworks.security.name', 'Information Security'),
      description: t('about:regulation.frameworks.security.description', 'Our information security framework is aligned with ISO 27001 standards, ensuring protection of customer data and company systems through robust policies and controls.'),
      procedures: [
        t('about:regulation.frameworks.security.procedures.encryption', 'End-to-end encryption'),
        t('about:regulation.frameworks.security.procedures.authentication', 'Multi-factor authentication'),
        t('about:regulation.frameworks.security.procedures.audits', 'Regular security audits'),
        t('about:regulation.frameworks.security.procedures.controls', 'Access control mechanisms')
      ]
    }
  ];
  
  // Client Protection Measures
  const protectionMeasures = [
    {
      title: t('about:regulation.protection.funds.title', 'Segregated Client Funds'),
      description: t('about:regulation.protection.funds.description', 'All client funds are held in segregated accounts separate from company operational funds, ensuring client assets are protected and not used for company operations.'),
      icon: FaLock
    },
    {
      title: t('about:regulation.protection.insurance.title', 'Professional Indemnity Insurance'),
      description: t('about:regulation.protection.insurance.description', 'BitDash maintains comprehensive insurance coverage to protect against operational risks, professional liability, and cyber threats.'),
      icon: FaShieldAlt
    },
    {
      title: t('about:regulation.protection.schemes.title', 'Investor Compensation Schemes'),
      description: t('about:regulation.protection.schemes.description', 'As a regulated entity, BitDash participates in investor compensation schemes in applicable jurisdictions, providing additional protection for eligible clients.'),
      icon: FaUniversity
    }
  ];

  return (
    <>
      <Head>
        <title>{t('about:regulation.pageTitle', 'Regulation & Compliance | BitDash')}</title>
        <meta name="description" content={t('about:regulation.metaDescription', 'Learn about BitDash\'s regulatory framework, licenses, and compliance standards that ensure secure and transparent financial services.')} />
      </Head>
      
      <Layout>
      <Box 
        w="full" 
        position="relative"
        overflow="hidden"
      >
        {/* Hero Section */}
        <Box 
          position="relative"
          py={16}
        > 
          <Container maxW="container.xl" position="relative" zIndex={1}>
            <Stack spacing={8} align={{ base: "center", md: "flex-start" }} textAlign={{ base: "center", md: "left" }}>
              <VStack spacing={3} align={{ base: "center", md: "flex-start" }}>
                <Heading 
                  as="h1" 
                  size={headingSize} 
                  fontWeight="bold"
                  bgGradient={isDark ? 
                    "linear(to-r, brand.bitdash.400, brand.stocks.400)" : 
                    "linear(to-r, brand.bitdash.600, brand.stocks.600)"
                  }
                  bgClip="text"
                >
                  {t('about:regulation.title', 'Integrity & Compliance')}
                </Heading>
              </VStack>
              
              <Text 
                fontSize={textSize} 
                maxW="2xl" 
                color={isDark ? "gray.300" : "gray.700"}
              >
                {t('about:regulation.introduction', 'At BitDash, regulatory compliance forms the foundation of everything we do. We operate within a robust regulatory framework to ensure the highest standards of security, transparency, and client protection across all our services.')}
              </Text>
            </Stack>
          </Container>
        </Box>
        
        {/* Regulatory Licenses Section */}
        <Box py={16}>
          <Container maxW="container.xl">
            <VStack spacing={12} align="stretch">
              <VStack spacing={3} textAlign="center" maxW="3xl" mx="auto">
                <Heading 
                  as="h2" 
                  size={subheadingSize} 
                  color={isDark ? "white" : "gray.800"}
                >
                  {t('about:regulation.licensesTitle', 'Our Regulatory Licenses')}
                </Heading>
                <Text 
                  fontSize={textSize} 
                  color={isDark ? "gray.300" : "gray.700"}
                >
                  {t('about:regulation.licensesDesc', 'BitDash maintains licenses with respected financial authorities worldwide. These licenses ensure our operations meet stringent regulatory requirements in each jurisdiction.')}
                </Text>
              </VStack>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                {regulatoryLicenses.map((license, index) => (
                  <Box 
                    key={index}
                    bg={isDark ? "gray.800" : "white"}
                    p={6}
                    borderRadius="lg"
                    boxShadow="md"
                    transition="all 0.3s"
                    _hover={{
                      transform: "translateY(-5px)",
                      boxShadow: "lg"
                    }}
                  >
                    <VStack align="start" spacing={4}>
                      <HStack>
                        <Icon 
                          as={license.icon} 
                          w={8} 
                          h={8} 
                          color={isDark ? "brand.bitdash.400" : "brand.bitdash.500"} 
                        />
                        <VStack align="start" spacing={0}>
                          <Heading 
                            as="h3" 
                            size="md" 
                            color={isDark ? "white" : "gray.800"}
                          >
                            {license.region}
                          </Heading>
                          <Text 
                            fontSize="sm" 
                            color={isDark ? "brand.bitdash.400" : "brand.bitdash.600"}
                            fontWeight="medium"
                          >
                            {license.licenseNumber}
                          </Text>
                        </VStack>
                      </HStack>
                      
                      <Divider borderColor={isDark ? "gray.700" : "gray.200"} />
                      
                      <Text 
                        fontSize="sm" 
                        color={isDark ? "gray.400" : "gray.600"}
                        fontWeight="medium"
                      >
                        {license.authority}
                      </Text>
                      
                      <Text 
                        fontSize={textSize} 
                        color={isDark ? "gray.300" : "gray.700"}
                      >
                        {license.description}
                      </Text>
                      
                      <Box w="full">
                        <Text 
                          fontSize="sm" 
                          fontWeight="medium" 
                          mb={2}
                          color={isDark ? "white" : "gray.800"}
                        >
                          {t('about:regulation.coverageTitle', 'Coverage Areas')}:
                        </Text>
                        <List spacing={1}>
                          {license.coverageAreas.map((area, idx) => (
                            <ListItem 
                              key={idx} 
                              fontSize="sm" 
                              color={isDark ? "gray.300" : "gray.700"}
                              display="flex"
                              alignItems="center"
                            >
                              <ListIcon 
                                as={FaCheckCircle} 
                                color={isDark ? "green.400" : "green.500"} 
                                fontSize="xs"
                              />
                              {area}
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
              
              <Alert 
                status="info" 
                bg={isDark ? "blue.900" : "blue.50"} 
                color={isDark ? "white" : "gray.800"}
                borderRadius="md"
              >
                <AlertIcon color={isDark ? "blue.200" : "blue.500"} />
                <Text fontSize="sm">
                  {t('about:regulation.licensesDisclaimer', 'The regulatory coverage may vary by jurisdiction. Services available to you depend on your country of residence. Please contact our compliance team for details specific to your location.')}
                </Text>
              </Alert>
            </VStack>
          </Container>
        </Box>
        
        {/* Compliance Frameworks */}
        <Box py={16}>
          <Container maxW="container.xl">
            <VStack spacing={12} align="stretch">
              <VStack spacing={3} textAlign="center" maxW="3xl" mx="auto">
                <Heading 
                  as="h2" 
                  size={subheadingSize} 
                  color={isDark ? "white" : "gray.800"}
                >
                  {t('about:regulation.frameworksTitle', 'Compliance Frameworks')}
                </Heading>
                <Text 
                  fontSize={textSize} 
                  color={isDark ? "gray.300" : "gray.700"}
                >
                  {t('about:regulation.frameworksDesc', 'BitDash implements comprehensive compliance frameworks that meet or exceed industry standards and regulatory requirements. These frameworks are regularly reviewed and updated to address emerging requirements.')}
                </Text>
              </VStack>
              
              <Accordion allowMultiple defaultIndex={[0]}>
                {complianceFrameworks.map((framework, index) => (
                  <AccordionItem 
                    key={index}
                    bg={isDark ? "gray.700" : "white"}
                    mb={4}
                    border="none"
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="sm"
                  >
                    <h3>
                      <AccordionButton 
                        py={4} 
                        px={6}
                        _hover={{ bg: isDark ? "gray.600" : "gray.50" }}
                      >
                        <Box flex="1" textAlign="left" fontWeight="medium" color={isDark ? "white" : "gray.800"}>
                          {framework.name}
                        </Box>
                        <AccordionIcon color={isDark ? "brand.bitdash.400" : "brand.bitdash.500"} />
                      </AccordionButton>
                    </h3>
                    <AccordionPanel pb={4} px={6} bg={isDark ? "gray.700" : "white"}>
                      <VStack align="start" spacing={4}>
                        <Text 
                          fontSize={textSize} 
                          color={isDark ? "gray.300" : "gray.700"}
                        >
                          {framework.description}
                        </Text>
                        
                        <Box w="full">
                          <Text 
                            fontSize="sm" 
                            fontWeight="medium" 
                            mb={2}
                            color={isDark ? "white" : "gray.800"}
                          >
                            {t('about:regulation.keyProcedures', 'Key Procedures')}:
                          </Text>
                          <List spacing={1}>
                            {framework.procedures.map((procedure, idx) => (
                              <ListItem 
                                key={idx} 
                                fontSize="sm" 
                                color={isDark ? "gray.300" : "gray.700"}
                                display="flex"
                                alignItems="center"
                              >
                                <ListIcon 
                                  as={FaCheckCircle} 
                                  color={isDark ? "green.400" : "green.500"} 
                                  fontSize="xs"
                                />
                                {procedure}
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </VStack>
          </Container>
        </Box>
        
        {/* Client Protection Measures */}
        <Box py={16}>
          <Container maxW="container.xl">
            <VStack spacing={12} align="stretch">
              <VStack spacing={3} textAlign="center" maxW="3xl" mx="auto">
                <Heading 
                  as="h2" 
                  size={subheadingSize} 
                  color={isDark ? "white" : "gray.800"}
                >
                  {t('about:regulation.protectionTitle', 'Client Protection Measures')}
                </Heading>
                <Text 
                  fontSize={textSize} 
                  color={isDark ? "gray.300" : "gray.700"}
                >
                  {t('about:regulation.protectionDesc', 'Your security is our priority. BitDash implements rigorous measures to protect client assets and personal information beyond standard regulatory requirements.')}
                </Text>
              </VStack>
              
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                {protectionMeasures.map((measure, index) => (
                  <Box 
                    key={index}
                    bg={isDark ? "gray.800" : "white"}
                    p={6}
                    borderRadius="lg"
                    boxShadow="md"
                    height="100%"
                    transition="all 0.3s"
                    _hover={{
                      transform: "translateY(-5px)",
                      boxShadow: "lg"
                    }}
                  >
                    <VStack spacing={4} height="100%">
                      <Icon 
                        as={measure.icon} 
                        w={10} 
                        h={10} 
                        color={isDark ? "brand.bitdash.400" : "brand.bitdash.500"} 
                      />
                      <Heading 
                        as="h3" 
                        size="sm" 
                        textAlign="center"
                        color={isDark ? "white" : "gray.800"}
                      >
                        {measure.title}
                      </Heading>
                      <Text 
                        fontSize="sm" 
                        textAlign="center"
                        color={isDark ? "gray.300" : "gray.700"}
                        flex="1"
                      >
                        {measure.description}
                      </Text>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
              
              <Box 
                p={6}
                borderRadius="lg"
                mt={8}
              >
                <VStack spacing={4}>
                  <Heading 
                    as="h3" 
                    size="sm" 
                    textAlign="center"
                    color={isDark ? "white" : "gray.800"}
                  >
                    {t('about:regulation.questionsTitle', 'Have Questions About Our Regulatory Compliance?')}
                  </Heading>
                  <Text 
                    fontSize="sm" 
                    textAlign="center"
                    color={isDark ? "gray.300" : "gray.700"}
                  >
                    {t('about:regulation.questionsDesc', 'Our compliance team is available to address any questions regarding our regulatory status, licenses, or security measures.')}
                  </Text>
                  <Button
                    as={Link}
                    href="/contact"
                    px={8}
                    py={6}
                    height="auto"
                    bg={isDark ? "brand.bitdash.600" : "brand.bitdash.500"}
                    color="white"
                    _hover={{
                      bg: isDark ? "brand.bitdash.500" : "brand.bitdash.600",
                      textDecoration: "none"
                    }}
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    {t('about:regulation.contactCompliance', 'Contact Compliance Team')}
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </Container>
        </Box>
        
        {/* Document Downloads Section */}
        <Box py={16}>
          <Container maxW="container.xl">
            <VStack spacing={8} align="stretch">
              <VStack spacing={3} textAlign="center" maxW="3xl" mx="auto">
                <Heading 
                  as="h2" 
                  size={subheadingSize} 
                  color={isDark ? "white" : "gray.800"}
                >
                  {t('about:regulation.documentsTitle', 'Regulatory Documents')}
                </Heading>
                <Text 
                  fontSize={textSize} 
                  color={isDark ? "gray.300" : "gray.700"}
                >
                  {t('about:regulation.documentsDesc', 'Access our regulatory documentation, policies, and disclosure statements. These documents provide detailed information about our operations, terms of service, and compliance measures.')}
                </Text>
              </VStack>
              
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                <Box 
                  as={Link}
                  href="/documents/terms-of-service.pdf"
                  p={5}
                  bg={isDark ? "gray.700" : "white"}
                  borderRadius="lg"
                  boxShadow="sm"
                  transition="all 0.3s"
                  _hover={{
                    textDecoration: "none",
                    transform: "translateY(-3px)",
                    boxShadow: "md",
                    bg: isDark ? "gray.600" : "gray.50"
                  }}
                  textAlign="center"
                >
                  <Icon 
                    as={FaFileAlt} 
                    w={8} 
                    h={8} 
                    mx="auto" 
                    mb={3}
                    color={isDark ? "brand.bitdash.400" : "brand.bitdash.500"} 
                  />
                  <Text 
                    fontWeight="medium" 
                    fontSize="sm"
                    color={isDark ? "white" : "gray.800"}
                  >
                    {t('about:regulation.documents.terms', 'Terms of Service')}
                  </Text>
                </Box>
                
                <Box 
                  as={Link}
                  href="/documents/privacy-policy.pdf"
                  p={5}
                  bg={isDark ? "gray.700" : "white"}
                  borderRadius="lg"
                  boxShadow="sm"
                  transition="all 0.3s"
                  _hover={{
                    textDecoration: "none",
                    transform: "translateY(-3px)",
                    boxShadow: "md",
                    bg: isDark ? "gray.600" : "gray.50"
                  }}
                  textAlign="center"
                >
                  <Icon 
                    as={FaLock} 
                    w={8} 
                    h={8} 
                    mx="auto" 
                    mb={3}
                    color={isDark ? "brand.bitdash.400" : "brand.bitdash.500"} 
                  />
                  <Text 
                    fontWeight="medium" 
                    fontSize="sm"
                    color={isDark ? "white" : "gray.800"}
                  >
                    {t('about:regulation.documents.privacy', 'Privacy Policy')}
                  </Text>
                </Box>
                
                <Box 
                  as={Link}
                  href="/documents/aml-policy.pdf"
                  p={5}
                  bg={isDark ? "gray.700" : "white"}
                  borderRadius="lg"
                  boxShadow="sm"
                  transition="all 0.3s"
                  _hover={{
                    textDecoration: "none",
                    transform: "translateY(-3px)",
                    boxShadow: "md",
                    bg: isDark ? "gray.600" : "gray.50"
                  }}
                  textAlign="center"
                >
                  <Icon 
                    as={FaShieldAlt} 
                    w={8} 
                    h={8} 
                    mx="auto" 
                    mb={3}
                    color={isDark ? "brand.bitdash.400" : "brand.bitdash.500"} 
                  />
                  <Text 
                    fontWeight="medium" 
                    fontSize="sm"
                    color={isDark ? "white" : "gray.800"}
                  >
                    {t('about:regulation.documents.aml', 'AML Policy')}
                  </Text>
                </Box>
                
                <Box 
                  as={Link}
                  href="/documents/risk-disclosure.pdf"
                  p={5}
                  bg={isDark ? "gray.700" : "white"}
                  borderRadius="lg"
                  boxShadow="sm"
                  transition="all 0.3s"
                  _hover={{
                    textDecoration: "none",
                    transform: "translateY(-3px)",
                    boxShadow: "md",
                    bg: isDark ? "gray.600" : "gray.50"
                  }}
                  textAlign="center"
                >
                  <Icon 
                    as={FaFileAlt} 
                    w={8} 
                    h={8} 
                    mx="auto" 
                    mb={3}
                    color={isDark ? "brand.bitdash.400" : "brand.bitdash.500"} 
                  />
                  <Text 
                    fontWeight="medium" 
                    fontSize="sm"
                    color={isDark ? "white" : "gray.800"}
                  >
                    {t('about:regulation.documents.risk', 'Risk Disclosure')}
                  </Text>
                </Box>
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>
      </Box>
      </Layout>
    </>
  );
}