import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  OrderedList,
  UnorderedList,
  ListItem,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  Alert,
  AlertIcon,
  Button,
  useColorModeValue,
  Link as ChakraLink,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import Link from 'next/link';

const Privacy = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isRTL = router.locale === 'ar' || router.locale === 'he';
  
  // Platform-specific values
  const [platform, setPlatform] = React.useState('bitdash');
  
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname.includes('fund')) setPlatform('bitfund');
      else if (hostname.includes('trade')) setPlatform('bittrade');
      else if (hostname.includes('cash')) setPlatform('adfaly');
      else if (hostname.includes('stock')) setPlatform('bitstock');
      else setPlatform('bitdash');
    }
  }, []);
  
  // Colors based on platform
  const bgColor = useColorModeValue('white', 'gray.800');
  const accentColor = useColorModeValue(`brand.${platform}.500`, `brand.${platform}.400`);
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Last updated date
  const lastUpdated = "February 26, 2025";
  
  // Platform-specific service descriptions
  const getServiceName = () => {
    switch(platform) {
      case 'bitfund': return 'BitFund';
      case 'bittrade': return 'BitTrade';
      case 'bitstock': return 'BitStock';
      case 'adfaly': return 'BitCash';
      default: return 'BitDash';
    }
  };

  return (
    <Layout>
      <Head>
        <title>{t('privacyPolicy')} | {getServiceName()}</title>
        <meta name="description" content={t('privacyDescription')} />
      </Head>
      
      <Container maxW="4xl" py={10} dir={isRTL ? 'rtl' : 'ltr'}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center" mb={6}>
            <Heading as="h1" size="xl" mb={3}>
              {t('privacyPolicy', 'Privacy Policy')}
            </Heading>
            <Text color="gray.500">
              {t('lastUpdated', 'Last Updated')}: {lastUpdated}
            </Text>
          </Box>
          
          {/* Introduction */}
          <Box>
            <Text mb={4}>
              {t('privacyIntro', 'At')}{' '}
              <Text as="span" fontWeight="bold" color={accentColor}>
                {getServiceName()}
              </Text>
              {', '}
              {t('privacyIntro2', 'we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile applications, and services (collectively, the "Services").')}
            </Text>
            
            <Alert status="info" borderRadius="md" mb={6}>
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">
                  {t('privacyAlert', 'Please read this Privacy Policy carefully.')}
                </Text>
                <Text fontSize="sm" mt={1}>
                  {t('privacyAlertDetails', 'By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy. If you do not agree with our policies and practices, do not use our Services.')}
                </Text>
              </Box>
            </Alert>
          </Box>
          
          {/* Main Content */}
          <Accordion allowMultiple defaultIndex={[0]} borderColor={borderColor}>
            {/* 1. Information We Collect */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  1. {t('infoWeCollect', 'Information We Collect')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Text>
                    {t('infoWeCollectDesc', 'We collect several types of information from and about users of our Services, including:')}
                  </Text>
                  
                  <Heading size="sm" mb={2}>
                    {t('personalInfo', 'Personal Information')}
                  </Heading>
                  <Text>
                    {t('personalInfoDesc', 'When you register for an account, use our Services, or contact us, we may collect the following types of personal information:')}
                  </Text>
                  
                  <UnorderedList spacing={2} pl={6}>
                    <ListItem>
                      <Text fontWeight="medium">{t('identityInfo', 'Identity Information:')}</Text>
                      <Text>{t('identityInfoDesc', 'Name, date of birth, national identification numbers, nationality, signature, and photographs.')}</Text>
                    </ListItem>
                    <ListItem>
                      <Text fontWeight="medium">{t('contactInfo', 'Contact Information:')}</Text>
                      <Text>{t('contactInfoDesc', 'Email address, telephone number, mailing address, and other contact details.')}</Text>
                    </ListItem>
                    <ListItem>
                      <Text fontWeight="medium">{t('financialInfo', 'Financial Information:')}</Text>
                      <Text>{t('financialInfoDesc', 'Bank account details, payment card information, transaction history, and trading data.')}</Text>
                    </ListItem>
                    <ListItem>
                      <Text fontWeight="medium">{t('identityDocs', 'Identity Documents:')}</Text>
                      <Text>{t('identityDocsDesc', 'Copies of government-issued identification documents, proof of address, and other verification documents.')}</Text>
                    </ListItem>
                    <ListItem>
                      <Text fontWeight="medium">{t('employmentInfo', 'Employment Information:')}</Text>
                      <Text>{t('employmentInfoDesc', 'Occupation, employer, income information, and source of funds.')}</Text>
                    </ListItem>
                  </UnorderedList>
                  
                  <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                    <Heading size="sm" mb={2}>
                      {t('sensitiveData', 'Sensitive Personal Data')}
                    </Heading>
                    <Text>
                      {t('sensitiveDataDesc', 'In some cases, we may need to collect sensitive personal data as required by applicable laws and regulations, such as information about political exposure or criminal history for anti-money laundering purposes. We will only collect such information when necessary and with appropriate safeguards.')}
                    </Text>
                  </Box>
                  
                  <Heading size="sm" mb={2}>
                    {t('nonPersonalInfo', 'Non-Personal Information')}
                  </Heading>
                  <Text>
                    {t('nonPersonalInfoDesc', 'We also collect non-personal information about how you interact with our Services:')}
                  </Text>
                  
                  <UnorderedList spacing={2} pl={6}>
                    <ListItem>
                      <Text fontWeight="medium">{t('usageData', 'Usage Data:')}</Text>
                      <Text>{t('usageDataDesc', 'Information about how you use our Services, including pages visited, features used, trading patterns, time spent on pages, and referring URLs.')}</Text>
                    </ListItem>
                    <ListItem>
                      <Text fontWeight="medium">{t('deviceData', 'Device Information:')}</Text>
                      <Text>{t('deviceDataDesc', 'Data about the devices you use to access our Services, such as hardware model, operating system, and browser type.')}</Text>
                    </ListItem>
                    <ListItem>
                      <Text fontWeight="medium">{t('locationData', 'Location Data:')}</Text>
                      <Text>{t('locationDataDesc', 'IP addresses, geolocation data, and other data that helps us determine your approximate location.')}</Text>
                    </ListItem>
                  </UnorderedList>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* 2. How We Use Your Information */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  2. {t('howWeUse', 'How We Use Your Information')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Text>
                    {t('howWeUseDesc', 'We use the information we collect for various purposes, including:')}
                  </Text>
                  <OrderedList spacing={2} pl={6}>
                    <ListItem>
                      <Text>{t('useForService', 'Providing, operating, and maintaining our Services')}</Text>
                    </ListItem>
                    <ListItem>
                      <Text>{t('useForImprove', 'Improving, personalizing, and expanding our Services')}</Text>
                    </ListItem>
                    <ListItem>
                      <Text>{t('useForCommunicate', 'Communicating with you, including for customer service and support')}</Text>
                    </ListItem>
                    <ListItem>
                      <Text>{t('useForSecurity', 'Ensuring the security of our Services and protecting against unauthorized access')}</Text>
                    </ListItem>
                    <ListItem>
                      <Text>{t('useForCompliance', 'Complying with legal obligations and regulatory requirements')}</Text>
                    </ListItem>
                  </OrderedList>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* 3. Sharing and Disclosure */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  3. {t('sharingAndDisclosure', 'Sharing and Disclosure')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Text>
                    {t('sharingDesc', 'We may share your information in the following situations:')}
                  </Text>
                  <UnorderedList spacing={2} pl={6}>
                    <ListItem>
                      <Text>{t('shareWithServiceProviders', 'With third-party service providers who perform services on our behalf')}</Text>
                    </ListItem>
                    <ListItem>
                      <Text>{t('shareForLegal', 'For legal purposes, such as to comply with a subpoena or similar legal process')}</Text>
                    </ListItem>
                    <ListItem>
                      <Text>{t('shareWithAffiliates', 'With our affiliates or in connection with a corporate transaction')}</Text>
                    </ListItem>
                    <ListItem>
                      <Text>{t('shareWithConsent', 'When you have provided your consent')}</Text>
                    </ListItem>
                  </UnorderedList>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* 4. Data Security */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  4. {t('dataSecurity', 'Data Security')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Text>
                    {t('dataSecurityDesc', 'We implement various security measures to protect your information from unauthorized access, disclosure, alteration, or destruction. These measures include encryption, access controls, and secure data storage facilities.')}
                  </Text>
                  <Text>
                    {t('dataSecurityNote', 'While we strive to protect your personal information, no security system is impenetrable.')}
                  </Text>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* 5. Data Retention */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  5. {t('dataRetention', 'Data Retention')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <Text>
                  {t('dataRetentionDesc', 'We retain your information for as long as necessary to fulfill the purposes for which it was collected, to comply with our legal obligations, resolve disputes, and enforce our agreements.')}
                </Text>
              </AccordionPanel>
            </AccordionItem>
            
            {/* 6. Your Rights */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  6. {t('yourRights', 'Your Rights')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Text>
                    {t('yourRightsDesc', 'Depending on your location, you may have the following rights regarding your personal information:')}
                  </Text>
                  <UnorderedList spacing={2} pl={6}>
                    <ListItem>{t('rightAccess', 'Right to access and obtain a copy of your personal data')}</ListItem>
                    <ListItem>{t('rightCorrection', 'Right to request correction or update of your personal data')}</ListItem>
                    <ListItem>{t('rightDeletion', 'Right to request deletion of your personal data')}</ListItem>
                    <ListItem>{t('rightObjection', 'Right to object to or restrict certain processing of your personal data')}</ListItem>
                    <ListItem>{t('rightPortability', 'Right to data portability')}</ListItem>
                  </UnorderedList>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* 7. Changes to This Privacy Policy */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  7. {t('policyChanges', 'Changes to This Privacy Policy')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <Text>
                  {t('policyChangesDesc', 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top.')}
                </Text>
              </AccordionPanel>
            </AccordionItem>
            
            {/* 8. Contact Us */}
            <AccordionItem border="1px" borderRadius="md">
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  8. {t('contactUs', 'Contact Us')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Text>
                    {t('contactUsDesc', 'If you have any questions or concerns about this Privacy Policy, please contact us at:')}
                  </Text>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>{t('department', 'Department')}</Th>
                        <Th>{t('email', 'Email')}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>{t('support', 'Support')}</Td>
                        <Td>
                          <ChakraLink href="mailto:support@example.com" color={accentColor}>
                            support@example.com
                          </ChakraLink>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>{t('privacy', 'Privacy')}</Td>
                        <Td>
                          <ChakraLink href="mailto:privacy@example.com" color={accentColor}>
                            privacy@example.com
                          </ChakraLink>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          
          {/* Footer */}
          <Divider />
          <Text fontSize="sm" color="gray.500" textAlign="center">
            {t('copyright', '© 2025')} {getServiceName()}. {t('allRightsReserved', 'All rights reserved.')}
          </Text>
          
          {/* Back to Home */}
          <Box textAlign="center">
            <Button as={Link} href="/" variant="link" color={accentColor}>
              {t('backToHome', 'Back to Home')}
            </Button>
          </Box>
        </VStack>
      </Container>
    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  };
}

export default Privacy;
