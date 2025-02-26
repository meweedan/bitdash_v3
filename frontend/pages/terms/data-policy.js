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
  useColorModeValue,
} from '@chakra-ui/react';

const DataPolicy = () => {
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
      else if (hostname.includes('cash')) setPlatform('bitcash');
      else if (hostname.includes('invest')) setPlatform('bitinvest');
      else setPlatform('bitdash');
    }
  }, []);
  
  // Colors based on platform
  const bgColor = useColorModeValue('white', 'gray.800');
  const accentColor = useColorModeValue(`brand.${platform}.500`, `brand.${platform}.400`);
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Last updated date
  const lastUpdated = "February 26, 2025";

  return (
    <Layout>
      <Head>
        <title>{t('dataPolicy')} | BitDash</title>
        <meta name="description" content={t('dataPolicyDescription')} />
      </Head>
      
      <Container maxW="4xl" py={10} dir={isRTL ? 'rtl' : 'ltr'}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center" mb={6}>
            <Heading as="h1" size="xl" mb={3}>
              {t('dataPolicy', 'Data Collection and Usage Policy')}
            </Heading>
            <Text color="gray.500">
              {t('lastUpdated', 'Last Updated')}: {lastUpdated}
            </Text>
          </Box>
          
          {/* Introduction */}
          <Box>
            <Text mb={4}>
              {t('dataPolicyIntro', 'This Data Collection and Usage Policy explains how we collect, use, process, and share your information across our platforms. By using our services, you consent to our collection and use of your data as described in this policy.')}
            </Text>
            
            <Alert status="info" borderRadius="md" mb={6}>
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">
                  {t('applicableServices', 'This policy applies to all BitDash services, including:')}
                </Text>
                <UnorderedList ml={6} mt={2}>
                  <ListItem>{t('bitfundService', 'BitFund - Proprietary Trading Platform')}</ListItem>
                  <ListItem>{t('bittradeService', 'BitTrade - Forex & Crypto Trading')}</ListItem>
                  <ListItem>{t('bitinvestService', 'BitInvest - Investment Services')}</ListItem>
                  <ListItem>{t('bitcashService', 'BitCash - Payment Processing')}</ListItem>
                </UnorderedList>
              </Box>
            </Alert>
          </Box>
          
          {/* Main Content */}
          <Accordion allowMultiple defaultIndex={[0]} borderColor={borderColor}>
            {/* Information We Collect */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  1. {t('informationWeCollect', 'Information We Collect')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Heading size="sm" mb={2}>
                      {t('informationYouProvide', 'Information You Provide')}
                    </Heading>
                    <UnorderedList spacing={2} pl={6}>
                      <ListItem>
                        <Text fontWeight="medium">{t('accountInfo', 'Account Information:')}</Text>
                        <Text>{t('accountInfoDesc', 'Name, email address, phone number, date of birth, nationality, residential address, and government identification documents.')}</Text>
                      </ListItem>
                      <ListItem>
                        <Text fontWeight="medium">{t('financialInfo', 'Financial Information:')}</Text>
                        <Text>{t('financialInfoDesc', 'Bank account details, payment card information, transaction history, trading activity, and investment preferences.')}</Text>
                      </ListItem>
                      <ListItem>
                        <Text fontWeight="medium">{t('businessInfo', 'Business Information:')}</Text>
                        <Text>{t('businessInfoDesc', 'Company name, registration number, business address, ownership structure, and business contacts (for business accounts).')}</Text>
                      </ListItem>
                      <ListItem>
                        <Text fontWeight="medium">{t('communications', 'Communications:')}</Text>
                        <Text>{t('communicationsDesc', 'Information you provide when contacting customer support, participating in surveys, or communicating with us via email, chat, or other means.')}</Text>
                      </ListItem>
                    </UnorderedList>
                  </Box>
                  
                  <Box>
                    <Heading size="sm" mb={2}>
                      {t('automaticInfo', 'Information We Collect Automatically')}
                    </Heading>
                    <UnorderedList spacing={2} pl={6}>
                      <ListItem>
                        <Text fontWeight="medium">{t('deviceInfo', 'Device Information:')}</Text>
                        <Text>{t('deviceInfoDesc', 'IP address, browser type, operating system, device identifiers, and mobile network information.')}</Text>
                      </ListItem>
                      <ListItem>
                        <Text fontWeight="medium">{t('activityInfo', 'Usage Information:')}</Text>
                        <Text>{t('activityInfoDesc', 'Pages visited, features used, click patterns, trading behavior, time spent on the platform, and other activity data.')}</Text>
                      </ListItem>
                      <ListItem>
                        <Text fontWeight="medium">{t('locationInfo', 'Location Information:')}</Text>
                        <Text>{t('locationInfoDesc', 'General location based on IP address and, if permitted, more precise location data from your mobile device.')}</Text>
                      </ListItem>
                      <ListItem>
                        <Text fontWeight="medium">{t('cookiesInfo', 'Cookies and Similar Technologies:')}</Text>
                        <Text>{t('cookiesInfoDesc', 'Information collected through cookies, web beacons, and similar technologies to personalize your experience and understand usage patterns.')}</Text>
                      </ListItem>
                    </UnorderedList>
                  </Box>
                  
                  <Box>
                    <Heading size="sm" mb={2}>
                      {t('thirdPartyInfo', 'Information from Third Parties')}
                    </Heading>
                    <UnorderedList spacing={2} pl={6}>
                      <ListItem>
                        <Text fontWeight="medium">{t('identityVerification', 'Identity Verification Services:')}</Text>
                        <Text>{t('identityVerificationDesc', 'Information to verify your identity and assess risk, including identity verification results and credit checks (where permitted by law).')}</Text>
                      </ListItem>
                      <ListItem>
                        <Text fontWeight="medium">{t('businessPartners', 'Business Partners:')}</Text>
                        <Text>{t('businessPartnersDesc', 'Information from business partners, such as payment processors, banking partners, and other financial institutions.')}</Text>
                      </ListItem>
                      <ListItem>
                        <Text fontWeight="medium">{t('publicSources', 'Public Sources:')}</Text>
                        <Text>{t('publicSourcesDesc', 'Publicly available information from government sources, public records, and other public sources.')}</Text>
                      </ListItem>
                    </UnorderedList>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* How We Use Your Information */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  2. {t('howWeUseInfo', 'How We Use Your Information')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Text>
                    {t('useInfoIntro', 'We use the information we collect for various purposes, including but not limited to:')}
                  </Text>
                  
                  <UnorderedList spacing={3} pl={6}>
                    <ListItem>
                      <Text fontWeight="medium">{t('provideServices', 'Providing and Improving Our Services:')}</Text>
                      <UnorderedList spacing={1} pl={6}>
                        <ListItem>{t('processTransactions', 'Processing transactions, trades, and payments')}</ListItem>
                        <ListItem>{t('manageAccounts', 'Managing your accounts and facilitating trading activities')}</ListItem>
                        <ListItem>{t('customerSupport', 'Providing customer support and responding to inquiries')}</ListItem>
                        <ListItem>{t('improvingServices', 'Improving and developing new features and services')}</ListItem>
                        <ListItem>{t('personalizeExperience', 'Personalizing your experience across our platforms')}</ListItem>
                      </UnorderedList>
                    </ListItem>
                    
                    <ListItem>
                      <Text fontWeight="medium">{t('securityComplianceTitle', 'Security and Compliance:')}</Text>
                      <UnorderedList spacing={1} pl={6}>
                        <ListItem>{t('verifyIdentity', 'Verifying your identity and preventing fraud')}</ListItem>
                        <ListItem>{t('detectPrevent', 'Detecting and preventing unauthorized access and suspicious activities')}</ListItem>
                        <ListItem>{t('amlKyc', 'Complying with anti-money laundering (AML) and know your customer (KYC) requirements')}</ListItem>
                        <ListItem>{t('riskAssessment', 'Conducting risk assessments and ensuring platform security')}</ListItem>
                        <ListItem>{t('legalObligations', 'Fulfilling our legal and regulatory obligations')}</ListItem>
                      </UnorderedList>
                    </ListItem>
                    
                    <ListItem>
                      <Text fontWeight="medium">{t('communicationTitle', 'Communication and Marketing:')}</Text>
                      <UnorderedList spacing={1} pl={6}>
                        <ListItem>{t('serviceUpdates', 'Sending service-related notices and updates')}</ListItem>
                        <ListItem>{t('marketingCommunications', 'Providing marketing communications about our products and services (with consent where required)')}</ListItem>
                        <ListItem>{t('promotionsOffers', 'Informing you about promotions, events, and special offers')}</ListItem>
                        <ListItem>{t('feedbackSurveys', 'Conducting surveys and collecting feedback')}</ListItem>
                      </UnorderedList>
                    </ListItem>
                    
                    <ListItem>
                      <Text fontWeight="medium">{t('analyticsResearch', 'Analytics and Research:')}</Text>
                      <UnorderedList spacing={1} pl={6}>
                        <ListItem>{t('usageAnalysis', 'Analyzing usage patterns and trends across our platforms')}</ListItem>
                        <ListItem>{t('marketResearch', 'Conducting market research and analyzing user behavior')}</ListItem>
                        <ListItem>{t('developFeatures', 'Developing new features and products based on user preferences')}</ListItem>
                        <ListItem>{t('measureEffectiveness', 'Measuring the effectiveness of our services and marketing efforts')}</ListItem>
                      </UnorderedList>
                    </ListItem>
                  </UnorderedList>
                  
                  <Text mt={2}>
                    {t('specificPlatformUses', 'We may use your information differently depending on which of our platforms you use:')}
                  </Text>
                  
                  <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                    <VStack spacing={3} align="stretch">
                      <Box>
                        <Text fontWeight="bold">{t('bitfundSpecific', 'BitFund')}</Text>
                        <Text>{t('bitfundUses', 'We analyze your trading patterns and performance metrics to evaluate your eligibility for funding, monitor compliance with trading rules, and determine profit-sharing calculations.')}</Text>
                      </Box>
                      
                      <Box>
                        <Text fontWeight="bold">{t('bittradeSpecific', 'BitTrade')}</Text>
                        <Text>{t('bittradeUses', 'We process your trading activity data to execute orders, calculate margin requirements, manage risk exposure, and provide market analysis tools.')}</Text>
                      </Box>
                      
                      <Box>
                        <Text fontWeight="bold">{t('bitinvestSpecific', 'BitInvest')}</Text>
                        <Text>{t('bitinvestUses', 'We analyze your investment preferences and transaction history to provide personalized investment recommendations, portfolio management services, and performance reporting.')}</Text>
                      </Box>
                      
                      <Box>
                        <Text fontWeight="bold">{t('bitcashSpecific', 'BitCash')}</Text>
                        <Text>{t('bitcashUses', 'We process your payment information to facilitate transactions, detect fraudulent activities, and provide merchant payment services and transaction reporting.')}</Text>
                      </Box>
                    </VStack>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* How We Share Information */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  3. {t('howWeShareInfo', 'How We Share Information')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Text>
                    {t('shareInfoIntro', 'We may share your information with the following categories of recipients:')}
                  </Text>
                  
                  <UnorderedList spacing={3} pl={6}>
                    <ListItem>
                      <Text fontWeight="medium">{t('affiliatedCompanies', 'Affiliated Companies:')}</Text>
                      <Text>{t('affiliatedCompaniesDesc', 'We may share your information with other companies within the BitDash group to provide seamless services across our platforms and for the purposes described in this policy.')}</Text>
                    </ListItem>
                    
                    <ListItem>
                      <Text fontWeight="medium">{t('serviceProviders', 'Service Providers:')}</Text>
                      <Text>{t('serviceProvidersDesc', 'We engage third-party service providers to perform functions on our behalf, such as identity verification, payment processing, cloud hosting, data analysis, customer support, and marketing assistance. These providers have access to your information only to perform these tasks on our behalf and are obligated not to disclose or use it for other purposes.')}</Text>
                    </ListItem>
                    
                    <ListItem>
                      <Text fontWeight="medium">{t('financialInstitutions', 'Financial Institutions and Business Partners:')}</Text>
                      <Text>{t('financialInstitutionsDesc', 'We may share information with financial institutions, payment processors, banking partners, and other business partners as necessary to provide our services, process transactions, and fulfill our contractual obligations.')}</Text>
                    </ListItem>
                    
                    <ListItem>
                      <Text fontWeight="medium">{t('legalRequirements', 'Legal Requirements and Protection:')}</Text>
                      <Text>{t('legalRequirementsDesc', 'We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency). We may also disclose your information to protect our rights, privacy, safety, or property, or that of our users or others, and to enforce our terms and policies.')}</Text>
                    </ListItem>
                    
                    <ListItem>
                      <Text fontWeight="medium">{t('businessTransfers', 'Business Transfers:')}</Text>
                      <Text>{t('businessTransfersDesc', 'If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction. We will notify you via email and/or a prominent notice on our website of any change in ownership or uses of your information.')}</Text>
                    </ListItem>
                    
                    <ListItem>
                      <Text fontWeight="medium">{t('withConsent', 'With Your Consent:')}</Text>
                      <Text>{t('withConsentDesc', 'We may share your information with third parties when you have given us your consent to do so.')}</Text>
                    </ListItem>
                  </UnorderedList>
                  
                  <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                    <Heading size="sm" mb={2}>
                      {t('aggregatedAnonymized', 'Aggregated and Anonymized Data')}
                    </Heading>
                    <Text>
                      {t('aggregatedAnonymizedDesc', 'We may share aggregated and anonymized information that does not identify you personally with third parties for industry analysis, demographic profiling, marketing, and other business purposes. This information cannot be used to identify you individually.')}
                    </Text>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* Data Security */}
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
                    {t('dataSecurityIntro', 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, accidental loss, alteration, disclosure, or destruction. These measures include:')}
                  </Text>
                  
                  <UnorderedList spacing={2} pl={6}>
                    <ListItem>
                      <Text fontWeight="medium">{t('encryption', 'Encryption:')}</Text>
                      <Text>{t('encryptionDesc', 'We use industry-standard encryption technologies to protect sensitive data during transmission and storage.')}</Text>
                    </ListItem>
                    
                    <ListItem>
                      <Text fontWeight="medium">{t('accessControls', 'Access Controls:')}</Text>
                      <Text>{t('accessControlsDesc', 'We restrict access to your information to authorized personnel only, based on the principle of least privilege.')}</Text>
                    </ListItem>
                    
                    <ListItem>
                      <Text fontWeight="medium">{t('secureFacilities', 'Secure Facilities:')}</Text>
                      <Text>{t('secureFacilitiesDesc', 'Our data centers and physical facilities are protected by appropriate security measures.')}</Text>
                    </ListItem>
                    
                    <ListItem>
                      <Text fontWeight="medium">{t('regularAudits', 'Regular Audits:')}</Text>
                      <Text>{t('regularAuditsDesc', 'We conduct regular security assessments and audits to ensure the effectiveness of our security measures.')}</Text>
                    </ListItem>
                    
                    <ListItem>
                      <Text fontWeight="medium">{t('incidentResponse', 'Incident Response:')}</Text>
                      <Text>{t('incidentResponseDesc', 'We have procedures in place to handle any suspected data security breach and will notify you and applicable regulators of breaches as required by law.')}</Text>
                    </ListItem>
                  </UnorderedList>
                  
                  <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                    <Text fontWeight="medium">
                      {t('securityDisclaimer', 'Important Security Notice:')}
                    </Text>
                    <Text>
                      {t('securityDisclaimerDesc', 'While we implement the security measures described above, no method of transmission over the Internet or electronic storage is 100% secure. Therefore, we cannot guarantee absolute security. You are responsible for maintaining the confidentiality of your account credentials and for any activities that occur under your account.')}
                    </Text>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* Your Rights and Choices */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  5. {t('yourRights', 'Your Rights and Choices')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Text>
                    {t('yourRightsIntro', 'Depending on your location, you may have certain rights regarding your personal information, including:')}
                  </Text>
                  
                  <UnorderedList spacing={3} pl={6}>
                    <ListItem>
                      <Text fontWeight="medium">{t('accessRight', 'Right to Access:')}</Text>
                      <Text>{t('accessRightDesc', 'You may request access to the personal information we hold about you.')}</Text>
                    </ListItem>
                    
                    <ListItem>
                      <Text fontWeight="medium">{t('correctionRight', 'Right to Correction:')}</Text>
                      <Text>{t('correctionRightDesc', 'You may request that we rectify inaccurate or incomplete personal information.')}</Text>
                    </ListItem>
                    
                    <ListItem>
                      <Text fontWeight="medium">{t('deletionRight', 'Right to Deletion:')}</Text>
                      <Text>{t('deletionRightDesc', 'You may request the deletion of your personal information in certain circumstances.')}</Text>
                    </ListItem>
                    
                    <ListItem>
                      <Text fontWeight="medium">{t('restrictionRight', 'Right to Restriction:')}</Text>
                      <Text>{t('restrictionRightDesc', 'You may request that we restrict the processing of your personal information in certain circumstances.')}</Text>
                    </ListItem>
                    
                    <ListItem>
                      <Text fontWeight="medium">{t('portabilityRight', 'Right to Data Portability:')}</Text>
                      <Text>{t('portabilityRightDesc', 'You may request a copy of your personal information in a structured, commonly used, and machine-readable format.')}</Text>
                    </ListItem>
                    
                    <ListItem>
                      <Text fontWeight="medium">{t('objectRight', 'Right to Object:')}</Text>
                      <Text>{t('objectRightDesc', 'You may object to the processing of your personal information in certain circumstances.')}</Text>
                    </ListItem>
                    
                    <ListItem>
                      <Text fontWeight="medium">{t('consentRight', 'Right to Withdraw Consent:')}</Text>
                      <Text>{t('consentRightDesc', 'You may withdraw your consent at any time where we rely on consent as the legal basis for processing.')}</Text>
                    </ListItem>
                  </UnorderedList>
                  
                  <Text>
                    {t('exerciseRights', 'To exercise these rights, please contact us at privacy@bitdash.app. We will respond to your request within the timeframe required by applicable law. Please note that certain information may be exempt from such requests in some circumstances, such as if we need to keep the information for legal compliance purposes or to protect our legitimate business interests.')}
                  </Text>
                  
                  <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                    <Heading size="sm" mb={2}>
                      {t('marketingPreferences', 'Marketing Preferences')}
                    </Heading>
                    <Text>
                      {t('marketingPreferencesDesc', 'You can opt out of receiving marketing communications from us by following the unsubscribe instructions included in our marketing emails or by contacting us directly. Please note that even if you opt out of marketing communications, we will still send you transactional and service-related messages.')}
                    </Text>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* International Data Transfers */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  6. {t('internationalTransfers', 'International Data Transfers')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Text>
                    {t('internationalTransfersIntro', 'We operate globally and may transfer your personal information to countries or territories other than the one in which you reside. These countries may have data protection laws that differ from those in your country.')}
                  </Text>
                  
                  <Text>
                    {t('safeguardsDesc', 'When we transfer your personal information to other countries, we implement appropriate safeguards to ensure that your information receives an adequate level of protection, such as:')}
                  </Text>
                  
                  <UnorderedList spacing={2} pl={6}>
                    <ListItem>
                      <Text>{t('standardContractualClauses', 'Standard Contractual Clauses approved by relevant data protection authorities')}</Text>
                    </ListItem>
                    <ListItem>
                      <Text>{t('bindingCorporateRules', 'Binding Corporate Rules for transfers within our corporate group')}</Text>
                    </ListItem>
                    <ListItem>
                      <Text>{t('consentMechanisms', 'Consent mechanisms where appropriate')}</Text>
                    </ListItem>
                    <ListItem>
                      <Text>{t('otherLegalFrameworks', 'Other legal frameworks and agreements that ensure adequate protection')}</Text>
                    </ListItem>
                  </UnorderedList>
                  
                  <Text>
                    {t('transferQuery', 'You can contact us for more information about the specific safeguards we have implemented to protect your personal information during international transfers.')}
                  </Text>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* Data Retention */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  7. {t('dataRetention', 'Data Retention')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Text>
                    {t('dataRetentionIntro', 'We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law. The criteria we use to determine the retention period include:')}
                  </Text>
                  
                  <UnorderedList spacing={2} pl={6}>
                    <ListItem>
                      <Text>{t('activeAccount', 'How long you maintain an active account with us')}</Text>
                    </ListItem>
                    <ListItem>
                      <Text>{t('legalObligationsRetention', 'Legal obligations, such as anti-money laundering regulations that require retention of certain records')}</Text>
                    </ListItem>
                    <ListItem>
                      <Text>{t('contractualObligations', 'Contractual obligations that require us to retain data for a certain period')}</Text>
                    </ListItem>
                    <ListItem>
                      <Text>{t('disputeResolution', 'Whether the information is needed for dispute resolution or to prevent fraud and abuse')}</Text>
                    </ListItem>
                  </UnorderedList>
                  
                  <Text>
                    {t('dataRetentionSpecific', 'Specific retention periods may vary depending on the type of data and the platform you use:')}
                  </Text>
                  
                  <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                    <VStack spacing={3} align="stretch">
                      <Box>
                        <Text fontWeight="bold">{t('accountInfo', 'Account Information')}</Text>
                        <Text>{t('accountInfoRetention', 'We retain your account information for as long as your account is active and for a period thereafter to comply with legal and regulatory obligations.')}</Text>
                      </Box>
                      
                      <Box>
                        <Text fontWeight="bold">{t('transactionInfo', 'Transaction Information')}</Text>
                        <Text>{t('transactionInfoRetention', 'We typically retain transaction records for at least five years to comply with financial regulations, tax requirements, and audit purposes.')}</Text>
                      </Box>
                      
                      <Box>
                        <Text fontWeight="bold">{t('communicationsInfo', 'Communications')}</Text>
                        <Text>{t('communicationsInfoRetention', 'We may retain your communications with us for up to three years to handle any disputes or claims and to improve our customer service.')}</Text>
                      </Box>
                      
                      <Box>
                        <Text fontWeight="bold">{t('usageData', 'Usage Data')}</Text>
<Text>{t('usageDataRetention', 'We may retain usage data for up to two years to analyze trends, improve our services, and enhance user experience.')}</Text>
                      </Box>
                    </VStack>
                  </Box>
                  
                  <Text>
                    {t('dataRetentionEnd', 'When we no longer need to retain your personal information, we will securely delete or anonymize it. If it is not possible to delete or anonymize your information, we will isolate it from any further processing until deletion is possible.')}
                  </Text>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* Children's Privacy */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  8. {t('childrensPrivacy', "Children's Privacy")}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Text>
                    {t('childrensPrivacyIntro', 'Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18 without verification of parental consent, we will take steps to remove that information from our servers.')}
                  </Text>
                  
                  <Text>
                    {t('childrensPrivacyNotify', 'If you believe we might have any information from or about a child under 18, please contact us at privacy@bitdash.app.')}
                  </Text>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* Updates to this Policy */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  9. {t('policyUpdates', 'Updates to this Policy')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Text>
                    {t('policyUpdatesIntro', 'We may update this Data Collection and Usage Policy from time to time to reflect changes in our practices, services, or applicable laws. We will notify you of any material changes by posting the updated policy on our website or by other means as required by law.')}
                  </Text>
                  
                  <Text>
                    {t('policyUpdatesNotice', 'We will provide notice in advance of the effective date of any significant changes. Your continued use of our services after the effective date of the revised policy constitutes your acceptance of the changes. We encourage you to review this policy periodically to stay informed about how we collect, use, and protect your information.')}
                  </Text>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* Contact Us */}
            <AccordionItem border="1px" borderRadius="md">
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  10. {t('contactUs', 'Contact Us')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Text>
                    {t('contactUsIntro', 'If you have any questions, concerns, or requests regarding this Data Collection and Usage Policy or our privacy practices, please contact us at:')}
                  </Text>
                  
                  <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                    <VStack spacing={2} align="stretch">
                      <Text fontWeight="bold">{t('dataProtectionOfficer', 'Data Protection Officer')}</Text>
                      <Text>BitDash Ltd.</Text>
                      <Text>123 Financial Street, Tech Tower</Text>
                      <Text>London, United Kingdom</Text>
                      <Text>Email: privacy@bitdash.app</Text>
                      <Text>Phone: +44 123 456 7890</Text>
                    </VStack>
                  </Box>
                  
                  <Text>
                    {t('contactUsResponse', 'We will respond to your inquiry within 30 days or as required by applicable law.')}
                  </Text>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </VStack>
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default DataPolicy;