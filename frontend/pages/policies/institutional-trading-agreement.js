import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '@/components/Layout';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  Button,
  useColorModeValue,
  useColorMode,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  UnorderedList,
  OrderedList,
  ListItem,
  Flex,
  Icon,
  Alert,
  AlertIcon,
  Badge,
  Link as ChakraLink
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { FileText, Download, ExternalLink, Shield, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const InstitutionalTradingAgreement = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isRTL = router.locale === 'ar';
  const isDark = colorMode === 'dark';
  
  // Colors and styles
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = 'brand.trade.500';
  const lastUpdated = '2025-02-25'; // Update this date when the agreement changes
  
  return (
    <Layout>
      <Head>
        <title>{t('institutionalTradingAgreement')} | BitTrade</title>
        <meta name="description" content={t('institutionalTradingAgreementDescription')} />
      </Head>
      
      <Container maxW="4xl" py={8} px={{ base: 4, md: 8 }}>
        <VStack spacing={8} align="stretch" dir={isRTL ? 'rtl' : 'ltr'}>
          {/* Header */}
          <Box textAlign="center" mb={6}>
            <Heading size="xl" mb={3}>
              {t('institutionalTradingAgreement', 'Institutional Trading Agreement')}
            </Heading>
            <Text fontSize="md" color="gray.500">
              {t('lastUpdated', 'Last Updated')}: {lastUpdated}
            </Text>
          </Box>

          {/* Agreement Notice */}
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Box>
              <Text fontWeight="medium">
                {t('agreementNotice', 'This is a legally binding agreement.')}
              </Text>
              <Text fontSize="sm">
                {t('agreementDownloadInstructions', 'Please read it carefully before engaging in institutional trading with BitTrade. You can download a copy of this agreement for your records.')}
              </Text>
            </Box>
          </Alert>

          {/* Download Button */}
          <Button 
            leftIcon={<Icon as={Download} />} 
            colorScheme="blue" 
            variant="outline" 
            alignSelf="center"
            mb={4}
          >
            {t('downloadAgreement', 'Download Agreement PDF')}
          </Button>

          {/* Introduction */}
          <Box>
            <Heading size="md" mb={4}>{t('introduction', 'Introduction')}</Heading>
            <Text>
              {t('institutionalIntroduction', 'This Institutional Trading Agreement (the "Agreement") is entered into by and between BitTrade Ltd, a company registered under the laws of [Jurisdiction] with registration number [Registration Number] and having its registered office at [Address] (hereinafter referred to as "BitTrade", "we", "us", or "our"), and the institutional entity identified in the account application (hereinafter referred to as the "Client", "you", or "your").')}
            </Text>
            <Text mt={4}>
              {t('institutionalEffectiveDate', 'This Agreement becomes effective upon the Client\'s acceptance of these terms and the opening of an institutional trading account with BitTrade. By accessing or using our trading services, you acknowledge that you have read, understood, and agree to be bound by all terms and conditions outlined in this Agreement.')}
            </Text>
          </Box>

          {/* Definitions Section */}
          <Box>
            <Heading size="md" mb={4}>{t('definitions', 'Definitions')}</Heading>
            <VStack align="stretch" spacing={3}>
              <Box>
                <Text fontWeight="bold">"Authorized Person"</Text>
                <Text>
                  {t('definitionAuthorizedPerson', 'means any person who is authorized by the Client to act on its behalf with respect to the trading account and whose authority has been communicated to BitTrade.')}
                </Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">"Institutional Trading Account"</Text>
                <Text>
                  {t('definitionInstitutionalAccount', 'means the trading account provided by BitTrade to the Client for the purpose of executing institutional-level trading transactions.')}
                </Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">"Trading Platform"</Text>
                <Text>
                  {t('definitionTradingPlatform', 'means the electronic trading platform(s) provided by BitTrade through which the Client can access market data, execute trades, and manage its account.')}
                </Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">"Financial Instruments"</Text>
                <Text>
                  {t('definitionFinancialInstruments', 'means the tradable assets available on the Trading Platform, including but not limited to foreign exchange (forex) pairs, cryptocurrencies, indices, commodities, and any other instruments offered by BitTrade.')}
                </Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">"Margin"</Text>
                <Text>
                  {t('definitionMargin', 'means the collateral required to be maintained by the Client to secure its trading positions.')}
                </Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">"Trading Day"</Text>
                <Text>
                  {t('definitionTradingDay', 'means a day on which the relevant markets for the traded Financial Instruments are open for trading.')}
                </Text>
              </Box>
            </VStack>
          </Box>

          {/* Main Agreement Sections */}
          <Accordion allowMultiple defaultIndex={[0]} borderColor={borderColor}>
            {/* Section 1: Eligibility */}
            <AccordionItem border="1px" borderRadius="md" mb={3}>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  1. {t('eligibility', 'Eligibility and Account Setup')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack align="stretch" spacing={3}>
                  <Box>
                    <Text fontWeight="bold">1.1 {t('eligibilityCriteria', 'Eligibility Criteria')}</Text>
                    <Text>
                      {t('eligibilityCriteriaContent', 'To qualify for an Institutional Trading Account, the Client must be a legal entity such as a corporation, limited liability company, partnership, trust, fund, or other organizational structure recognized under applicable laws. BitTrade reserves the right to determine, at its sole discretion, whether an entity qualifies as an institutional client.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">1.2 {t('accountApplication', 'Account Application')}</Text>
                    <Text>
                      {t('accountApplicationContent', 'The Client must complete the institutional account application process, which includes providing all requested documentation and information. This may include, but is not limited to:')}
                    </Text>
                    <UnorderedList pl={6} mt={2} spacing={1}>
                      <ListItem>{t('accountApplicationItem1', 'Certificate of incorporation or equivalent')}</ListItem>
                      <ListItem>{t('accountApplicationItem2', 'Corporate bylaws or operating agreement')}</ListItem>
                      <ListItem>{t('accountApplicationItem3', 'Identification documents for all directors, officers, and beneficial owners with 25% or greater ownership')}</ListItem>
                      <ListItem>{t('accountApplicationItem4', 'Corporate resolution authorizing the opening of a trading account')}</ListItem>
                      <ListItem>{t('accountApplicationItem5', 'Audited financial statements for the past two years')}</ListItem>
                      <ListItem>{t('accountApplicationItem6', 'Proof of registered address')}</ListItem>
                    </UnorderedList>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">1.3 {t('authorizedPersons', 'Authorized Persons')}</Text>
                    <Text>
                      {t('authorizedPersonsContent', 'The Client must designate one or more Authorized Persons who will have the authority to operate the account on behalf of the Client. Each Authorized Person must provide identification documentation and complete a verification process as required by BitTrade. The Client is responsible for notifying BitTrade immediately of any changes to the list of Authorized Persons.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">1.4 {t('accountApproval', 'Account Approval')}</Text>
                    <Text>
                      {t('accountApprovalContent', 'BitTrade reserves the right to reject any application or to close any account at its sole discretion, particularly if the Client fails to meet eligibility requirements or if BitTrade is unable to verify the information provided.')}
                    </Text>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            {/* Section 2: Trading Services */}
            <AccordionItem border="1px" borderRadius="md" mb={3}>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  2. {t('tradingServices', 'Trading Services and Facilities')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack align="stretch" spacing={3}>
                  <Box>
                    <Text fontWeight="bold">2.1 {t('tradingPlatform', 'Trading Platform')}</Text>
                    <Text>
                      {t('tradingPlatformContent', 'BitTrade will provide the Client with access to its Trading Platform, through which the Client can execute trades in various Financial Instruments. The Trading Platform may be accessed via desktop applications, web interfaces, mobile applications, or API connections as made available by BitTrade.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">2.2 {t('availableInstruments', 'Available Financial Instruments')}</Text>
                    <Text>
                      {t('availableInstrumentsContent', 'The Client may trade in the Financial Instruments offered by BitTrade, which may include forex pairs, cryptocurrencies, indices, commodities, and other instruments. BitTrade reserves the right to add or remove Financial Instruments from its offering at any time without prior notice.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">2.3 {t('executionServices', 'Execution Services')}</Text>
                    <Text>
                      {t('executionServicesContent', 'BitTrade will execute the Client\'s orders in accordance with its best execution policy. However, BitTrade does not guarantee that an order will be executed at the most favorable price available at the time the order is placed, particularly during periods of high volatility or low liquidity in the markets.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">2.4 {t('api', 'API Access')}</Text>
                    <Text>
                      {t('apiContent', 'BitTrade may provide the Client with API access to the Trading Platform. The Client is responsible for ensuring the security and confidentiality of its API credentials, and for all trading activity conducted through its API connection. BitTrade reserves the right to limit, suspend, or terminate API access without prior notice in case of suspected misuse, abuse, or system impact.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">2.5 {t('tradingHours', 'Trading Hours and System Availability')}</Text>
                    <Text>
                      {t('tradingHoursContent', 'The Trading Platform is generally available 24 hours a day, 5 days a week, with the exception of weekends, holidays, and periods of scheduled or unscheduled maintenance. BitTrade shall not be liable for any losses or damages resulting from system unavailability or downtime.')}
                    </Text>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            {/* Section 3: Margin Requirements */}
            <AccordionItem border="1px" borderRadius="md" mb={3}>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  3. {t('marginRequirements', 'Margin Requirements and Risk Management')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack align="stretch" spacing={3}>
                  <Box>
                    <Text fontWeight="bold">3.1 {t('marginDeposit', 'Margin Deposit')}</Text>
                    <Text>
                      {t('marginDepositContent', 'The Client must maintain sufficient Margin in its account to support its open positions and new trades. The required Margin amount will depend on the Financial Instruments being traded, the size of the positions, and market conditions. BitTrade reserves the right to modify Margin requirements at any time without prior notice, particularly in response to market volatility or specific risk factors.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">3.2 {t('marginCall', 'Margin Call')}</Text>
                    <Text>
                      {t('marginCallContent', 'If the equity in the Client\'s account falls below the required Margin level, BitTrade may issue a Margin Call requiring the Client to deposit additional funds. BitTrade may, but is not obligated to, notify the Client of such Margin Calls. The Client is responsible for monitoring its account and maintaining sufficient Margin at all times, regardless of whether a Margin Call has been issued.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">3.3 {t('liquidation', 'Liquidation')}</Text>
                    <Text>
                      {t('liquidationContent', 'If the Client fails to maintain sufficient Margin in its account, BitTrade reserves the right to liquidate any or all of the Client\'s open positions without prior notice. BitTrade may, at its sole discretion, determine the order and manner of liquidation. The Client shall remain liable for any deficit in its account following such liquidation.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">3.4 {t('riskManagement', 'Risk Management Controls')}</Text>
                    <Text>
                      {t('riskManagementContent', 'BitTrade may implement risk management controls on the Client\'s account, including but not limited to position limits, order size limits, and exposure limits. BitTrade reserves the right to modify these controls at any time without prior notice, particularly in response to market volatility or specific risk factors.')}
                    </Text>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            {/* Section 4: Fees and Commissions */}
            <AccordionItem border="1px" borderRadius="md" mb={3}>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  4. {t('feesCommissions', 'Fees, Commissions, and Charges')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack align="stretch" spacing={3}>
                  <Box>
                    <Text fontWeight="bold">4.1 {t('feeSchedule', 'Fee Schedule')}</Text>
                    <Text>
                      {t('feeScheduleContent', 'The Client agrees to pay all fees, commissions, and charges associated with its trading activities as specified in the Fee Schedule provided by BitTrade. The Fee Schedule may be amended from time to time, with such amendments taking effect immediately upon publication or upon the date specified in the notification to the Client.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">4.2 {t('paymentTerms', 'Payment Terms')}</Text>
                    <Text>
                      {t('paymentTermsContent', 'All fees, commissions, and charges will be automatically deducted from the Client\'s account. The Client is responsible for ensuring that sufficient funds are available in its account to cover these costs. If there are insufficient funds, BitTrade reserves the right to deduct the amount from future deposits or to request immediate payment from the Client.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">4.3 {t('thirdPartyFees', 'Third-Party Fees')}</Text>
                    <Text>
                      {t('thirdPartyFeesContent', 'The Client may incur additional fees from third parties in connection with its trading activities, including but not limited to bank transfer fees, currency conversion fees, and taxes. BitTrade is not responsible for any such third-party fees, and these fees are separate from and in addition to the fees charged by BitTrade.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">4.4 {t('inactivityFees', 'Inactivity Fees')}</Text>
                    <Text>
                      {t('inactivityFeesContent', 'BitTrade may charge inactivity fees on accounts that have been inactive for a specified period of time. The terms and conditions of such inactivity fees will be specified in the Fee Schedule.')}
                    </Text>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            {/* Section 5: Representations and Warranties */}
            <AccordionItem border="1px" borderRadius="md" mb={3}>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  5. {t('representationsWarranties', 'Representations and Warranties')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack align="stretch" spacing={3}>
                  <Box>
                    <Text fontWeight="bold">5.1 {t('clientRepresentations', 'Client Representations')}</Text>
                    <Text>
                      {t('clientRepresentationsContent', 'The Client represents and warrants that:')}
                    </Text>
                    <OrderedList pl={6} mt={2} spacing={1} type="a">
                      <ListItem>{t('clientRepItem1', 'It is duly organized, validly existing, and in good standing under the laws of its jurisdiction of organization')}</ListItem>
                      <ListItem>{t('clientRepItem2', 'It has all necessary power, authority, and capacity to enter into this Agreement and to perform its obligations hereunder')}</ListItem>
                      <ListItem>{t('clientRepItem3', 'The execution and delivery of this Agreement have been duly authorized by all necessary corporate or other action')}</ListItem>
                      <ListItem>{t('clientRepItem4', 'This Agreement constitutes a legal, valid, and binding obligation of the Client, enforceable against the Client in accordance with its terms')}</ListItem>
                      <ListItem>{t('clientRepItem5', 'It has obtained all necessary consents, approvals, and authorizations from any regulatory, governmental, or other authority required in connection with the execution, delivery, and performance of this Agreement')}</ListItem>
                      <ListItem>{t('clientRepItem6', 'All information provided to BitTrade is true, accurate, and complete in all material respects')}</ListItem>
                      <ListItem>{t('clientRepItem7', 'It is entering into this Agreement and all transactions hereunder as principal and not as agent for any other person or entity')}</ListItem>
                      <ListItem>{t('clientRepItem8', 'It has sufficient knowledge, experience, and understanding of the risks involved in trading Financial Instruments')}</ListItem>
                    </OrderedList>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">5.2 {t('continuingObligation', 'Continuing Obligation')}</Text>
                    <Text>
                      {t('continuingObligationContent', 'The Client acknowledges that the representations and warranties contained in this section are continuing obligations and shall be deemed to be repeated each time the Client enters into a transaction with BitTrade. The Client undertakes to notify BitTrade immediately of any changes to the information provided or if any of the representations and warranties becomes untrue, inaccurate, or misleading in any respect.')}
                    </Text>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            {/* Section 6: Liability and Indemnification */}
            <AccordionItem border="1px" borderRadius="md" mb={3}>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  6. {t('liabilityIndemnification', 'Limitation of Liability and Indemnification')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack align="stretch" spacing={3}>
                  <Box>
                    <Text fontWeight="bold">6.1 {t('limitationOfLiability', 'Limitation of Liability')}</Text>
                    <Text>
                      {t('limitationOfLiabilityContent', 'To the maximum extent permitted by applicable law, BitTrade, its directors, officers, employees, agents, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to damages for loss of profits, goodwill, use, data, or other intangible losses, resulting from:')}
                    </Text>
                    <UnorderedList pl={6} mt={2} spacing={1}>
                      <ListItem>{t('liabilityItem1', 'The use or inability to use the Trading Platform or other services provided by BitTrade')}</ListItem>
                      <ListItem>{t('liabilityItem2', 'Unauthorized access to or alteration of the Client\'s transmissions or data')}</ListItem>
                      <ListItem>{t('liabilityItem3', 'Statements or conduct of any third party on the Trading Platform')}</ListItem>
                      <ListItem>{t('liabilityItem4', 'Any other matter relating to the Trading Platform or services provided by BitTrade')}</ListItem>
                      <ListItem>{t('liabilityItem5', 'Market volatility or adverse market conditions')}</ListItem>
                      <ListItem>{t('liabilityItem6', 'System failures, communication failures, delays, or other technical issues')}</ListItem>
                      <ListItem>{t('liabilityItem7', 'Acts or omissions of third parties')}</ListItem>
                    </UnorderedList>
                    <Text mt={2}>
                      {t('liabilityCapContent', 'In no event shall BitTrade\'s total liability to the Client for all damages exceed the amount of fees paid by the Client to BitTrade during the three (3) months immediately preceding the event giving rise to the claim for liability.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">6.2 {t('indemnification', 'Indemnification')}</Text>
                    <Text>
                      {t('indemnificationContent', 'The Client agrees to indemnify, defend, and hold harmless BitTrade, its directors, officers, employees, agents, and affiliates from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys\' fees) arising from or relating to:')}
                    </Text>
                    <UnorderedList pl={6} mt={2} spacing={1}>
                      <ListItem>{t('indemnificationItem1', 'The Client\'s breach of this Agreement')}</ListItem>
                      <ListItem>{t('indemnificationItem2', 'The Client\'s use of the Trading Platform or other services provided by BitTrade')}</ListItem>
                      <ListItem>{t('indemnificationItem3', 'Any act or omission by the Client or its Authorized Persons')}</ListItem>
                      <ListItem>{t('indemnificationItem4', 'Any claim by a third party based on the Client\'s trading activities')}</ListItem>
                    </UnorderedList>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">6.3 {t('forceJazure', 'Force Majeure')}</Text>
                    <Text>
                      {t('forceJazureContent', 'BitTrade shall not be liable for any failure or delay in performance of its obligations under this Agreement due to events beyond its reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, riots, civil unrest, government actions, labor disputes, power failures, internet or communication disruptions, market disruptions, or failures of third-party service providers.')}
                    </Text>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            {/* Section 7: Termination */}
            <AccordionItem border="1px" borderRadius="md" mb={3}>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  7. {t('termination', 'Termination and Suspension')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack align="stretch" spacing={3}>
                  <Box>
                    <Text fontWeight="bold">7.1 {t('terminationByNotice', 'Termination by Notice')}</Text>
                    <Text>
                      {t('terminationByNoticeContent', 'Either party may terminate this Agreement at any time by giving written notice to the other party. Termination shall be effective thirty (30) days after receipt of such notice, unless otherwise specified in the notice.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">7.2 {t('immediateTermination', 'Immediate Termination')}</Text>
                    <Text>
                      {t('immediateTerminationContent', 'BitTrade may terminate this Agreement immediately without prior notice if:')}
                    </Text>
                    <UnorderedList pl={6} mt={2} spacing={1}>
                      <ListItem>{t('immediateTerminationItem1', 'The Client breaches any material provision of this Agreement')}</ListItem>
                      <ListItem>{t('immediateTerminationItem2', 'The Client becomes insolvent, bankrupt, or subject to any similar proceeding')}</ListItem>
                      <ListItem>{t('immediateTerminationItem3', 'The Client engages in any fraudulent, deceptive, or illegal activity')}</ListItem>
                      <ListItem>{t('immediateTerminationItem4', 'BitTrade determines, in its sole discretion, that the Client\'s trading activities pose a risk to BitTrade or other clients')}</ListItem>
                      <ListItem>{t('immediateTerminationItem5', 'Required by applicable law or regulatory authority')}</ListItem>
                    </UnorderedList>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">7.3 {t('suspension', 'Suspension of Services')}</Text>
                    <Text>
                      {t('suspensionContent', 'BitTrade reserves the right to suspend, limit, or restrict the Client\'s access to the Trading Platform or other services at any time and for any reason, including but not limited to maintenance, security concerns, regulatory requirements, or suspected violation of this Agreement. BitTrade will make reasonable efforts to notify the Client of such suspension, but is not required to do so.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">7.4 {t('effectOfTermination', 'Effect of Termination')}</Text>
                    <Text>
                      {t('effectOfTerminationContent', 'Upon termination of this Agreement, all open positions will be closed at the prevailing market rates, all pending orders will be canceled, and the balance of the Client\'s account, after deduction of any applicable fees, charges, or other obligations, will be returned to the Client. The Client shall remain liable for any deficit in its account after such termination.')}
                    </Text>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            {/* Section 8: Confidentiality */}
            <AccordionItem border="1px" borderRadius="md" mb={3}>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  8. {t('confidentiality', 'Confidentiality and Data Protection')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack align="stretch" spacing={3}>
                  <Box>
                    <Text fontWeight="bold">8.1 {t('confidentialInformation', 'Confidential Information')}</Text>
                    <Text>
                      {t('confidentialInformationContent', 'Each party acknowledges that it may receive confidential information from the other party in connection with this Agreement. Each party agrees to maintain the confidentiality of such information and not to disclose it to any third party without the prior written consent of the disclosing party, except as required by law or regulatory authority.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">8.2 {t('dataProtection', 'Data Protection')}</Text>
                    <Text>
                      {t('dataProtectionContent', 'BitTrade will collect, process, and store the Client\'s personal data in accordance with applicable data protection laws and regulations, as described in BitTrade\'s Privacy Policy. By entering into this Agreement, the Client consents to such collection, processing, and storage of its personal data.')}
                    </Text>
                  </Box>
                 <Box>
                    <Text fontWeight="bold">8.3 {t('recordingOfCommunications', 'Recording of Communications')}</Text>
                    <Text>
                      {t('recordingOfCommunicationsContent', 'BitTrade may record telephone conversations, email communications, and other electronic communications between BitTrade and the Client or its Authorized Persons. These recordings may be used as evidence in any dispute between the parties and for compliance purposes. The Client consents to such recording and acknowledges that BitTrade may rely on such recordings in connection with any dispute.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">8.4 {t('intellectualProperty', 'Intellectual Property')}</Text>
                    <Text>
                      {t('intellectualPropertyContent', 'All intellectual property rights in the Trading Platform, including but not limited to copyrights, trademarks, service marks, trade names, software code, icons, logos, characters, layouts, trade secrets, buttons, color scheme, and graphics, are the sole and exclusive property of BitTrade or its licensors. The Client shall not reproduce, modify, adapt, translate, reverse engineer, decompile, disassemble, or create derivative works based on the Trading Platform or any part thereof.')}
                    </Text>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            {/* Section 9: Compliance with Laws */}
            <AccordionItem border="1px" borderRadius="md" mb={3}>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  9. {t('complianceWithLaws', 'Compliance with Laws and Regulations')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack align="stretch" spacing={3}>
                  <Box>
                    <Text fontWeight="bold">9.1 {t('antimonyLaundering', 'Anti-Money Laundering and Counter-Terrorist Financing')}</Text>
                    <Text>
                      {t('antimonyLaunderingContent', 'The Client acknowledges and agrees that BitTrade is required to comply with applicable anti-money laundering and counter-terrorist financing laws and regulations. BitTrade may request additional information from the Client to verify its identity, source of funds, and nature of its business. The Client agrees to provide such information promptly upon request.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">9.2 {t('marketAbuse', 'Market Abuse and Insider Trading')}</Text>
                    <Text>
                      {t('marketAbuseContent', 'The Client shall not use the Trading Platform for any purpose that would constitute market abuse, insider trading, or any other form of market manipulation or illegal conduct. The Client represents and warrants that it is not in possession of any material non-public information that would affect the price of any Financial Instrument when placing an order.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">9.3 {t('taxCompliance', 'Tax Compliance')}</Text>
                    <Text>
                      {t('taxComplianceContent', 'The Client is solely responsible for complying with all applicable tax laws and regulations in its jurisdiction, including but not limited to reporting and paying any taxes arising from its trading activities. BitTrade does not provide tax advice and recommends that the Client consult with a qualified tax professional regarding its specific situation.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">9.4 {t('regulatoryReporting', 'Regulatory Reporting')}</Text>
                    <Text>
                      {t('regulatoryReportingContent', 'The Client acknowledges that BitTrade may be required to report certain information about the Client and its transactions to regulatory authorities. The Client consents to such reporting and agrees to provide any additional information that may be required for such purposes.')}
                    </Text>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            {/* Section 10: Dispute Resolution */}
            <AccordionItem border="1px" borderRadius="md" mb={3}>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  10. {t('disputeResolution', 'Dispute Resolution')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack align="stretch" spacing={3}>
                  <Box>
                    <Text fontWeight="bold">10.1 {t('amicableResolution', 'Amicable Resolution')}</Text>
                    <Text>
                      {t('amicableResolutionContent', 'In the event of any dispute, controversy, or claim arising out of or relating to this Agreement, the parties shall attempt to resolve the matter amicably through good-faith negotiations within thirty (30) days from the date on which either party notifies the other in writing of the dispute.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">10.2 {t('arbitration', 'Arbitration')}</Text>
                    <Text>
                      {t('arbitrationContent', 'If the dispute cannot be resolved amicably, it shall be finally settled by arbitration in accordance with the rules of [Arbitration Association/Institution] by one or more arbitrators appointed in accordance with said rules. The arbitration shall be conducted in [City, Country], and the language of the arbitration shall be English.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">10.3 {t('courtProceedings', 'Court Proceedings')}</Text>
                    <Text>
                      {t('courtProceedingsContent', 'Notwithstanding the foregoing, BitTrade may, at its option, bring legal proceedings against the Client in the courts of any jurisdiction where the Client or its assets are located. The Client irrevocably submits to the jurisdiction of such courts.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">10.4 {t('injunctiveRelief', 'Injunctive Relief')}</Text>
                    <Text>
                      {t('injunctiveReliefContent', 'Nothing in this section shall prevent either party from seeking injunctive or other equitable relief in any court of competent jurisdiction where such relief is necessary to protect its rights pending resolution of the dispute.')}
                    </Text>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            {/* Section 11: General Provisions */}
            <AccordionItem border="1px" borderRadius="md" mb={3}>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  11. {t('generalProvisions', 'General Provisions')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack align="stretch" spacing={3}>
                  <Box>
                    <Text fontWeight="bold">11.1 {t('entireAgreement', 'Entire Agreement')}</Text>
                    <Text>
                      {t('entireAgreementContent', 'This Agreement, together with any annexes, schedules, and documents referenced herein, constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior agreements, understandings, and negotiations, both written and oral, between the parties with respect to the subject matter hereof.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">11.2 {t('amendment', 'Amendment')}</Text>
                    <Text>
                      {t('amendmentContent', 'BitTrade reserves the right to amend this Agreement at any time by providing written notice to the Client. Such amendments shall become effective on the date specified in the notice, which shall be no less than ten (10) business days after the notice is sent. If the Client does not agree with the amended terms, it may terminate this Agreement by providing written notice to BitTrade before the effective date of the amendments. If the Client continues to use the Trading Platform or other services after the effective date of the amendments, it shall be deemed to have accepted the amended terms.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">11.3 {t('assignment', 'Assignment')}</Text>
                    <Text>
                      {t('assignmentContent', 'The Client may not assign or transfer any of its rights or obligations under this Agreement without the prior written consent of BitTrade. BitTrade may assign or transfer its rights and obligations under this Agreement to any affiliated company or to any successor in interest to all or substantially all of BitTrade\'s business or assets without the Client\'s consent.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">11.4 {t('severability', 'Severability')}</Text>
                    <Text>
                      {t('severabilityContent', 'If any provision of this Agreement is held to be invalid, illegal, or unenforceable in any jurisdiction, such provision shall be deemed modified to the minimum extent necessary to make it valid, legal, and enforceable. If such modification is not possible, the relevant provision shall be deemed deleted. Any such modification or deletion shall not affect the validity and enforceability of the rest of this Agreement.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">11.5 {t('waiver', 'No Waiver')}</Text>
                    <Text>
                      {t('waiverContent', 'The failure of either party to enforce any right or provision of this Agreement shall not constitute a waiver of such right or provision. Any waiver of any provision of this Agreement shall be effective only if it is in writing and signed by the waiving party.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">11.6 {t('notices', 'Notices')}</Text>
                    <Text>
                      {t('noticesContent', 'All notices and other communications required or permitted under this Agreement shall be in writing and shall be deemed to have been duly given when delivered in person, or when sent by email, or when sent by courier or registered mail to the address specified in the account application or to such other address as either party may specify in writing.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">11.7 {t('governingLaw', 'Governing Law')}</Text>
                    <Text>
                      {t('governingLawContent', 'This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law principles.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">11.8 {t('languageOfAgreement', 'Language of Agreement')}</Text>
                    <Text>
                      {t('languageOfAgreementContent', 'This Agreement is made in the English language. Any translation into another language is for convenience only and shall not be binding on either party. In the event of any inconsistency between the English version and any translated version, the English version shall prevail.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">11.9 {t('survival', 'Survival')}</Text>
                    <Text>
                      {t('survivalContent', 'The provisions of Sections 5 (Representations and Warranties), 6 (Limitation of Liability and Indemnification), 8 (Confidentiality and Data Protection), 9 (Compliance with Laws and Regulations), 10 (Dispute Resolution), and 11 (General Provisions) shall survive the termination of this Agreement.')}
                    </Text>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            {/* Section 12: Risk Disclosure and Acknowledgment */}
            <AccordionItem border="1px" borderRadius="md" mb={3}>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  12. {t('riskDisclosure', 'Risk Disclosure and Acknowledgment')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack align="stretch" spacing={3}>
                  <Box>
                    <Text fontWeight="bold">12.1 {t('marketRisks', 'Market Risks')}</Text>
                    <Text>
                      {t('marketRisksContent', 'The Client acknowledges and accepts that trading in Financial Instruments involves significant risks, including but not limited to:')}
                    </Text>
                    <UnorderedList pl={6} mt={2} spacing={1}>
                      <ListItem>{t('marketRiskItem1', 'Market volatility and rapid price movements')}</ListItem>
                      <ListItem>{t('marketRiskItem2', 'Liquidity risk, which may affect execution prices and the ability to enter or exit positions')}</ListItem>
                      <ListItem>{t('marketRiskItem3', 'Leverage risk, which can result in losses exceeding the initial investment')}</ListItem>
                      <ListItem>{t('marketRiskItem4', 'Currency risk, when trading in a currency different from the base currency of the account')}</ListItem>
                      <ListItem>{t('marketRiskItem5', 'Counterparty risk, related to the financial stability of BitTrade and its liquidity providers')}</ListItem>
                      <ListItem>{t('marketRiskItem6', 'Operational and technological risks, including system failures and communication disruptions')}</ListItem>
                      <ListItem>{t('marketRiskItem7', 'Regulatory and legal risks, including changes in laws and regulations that may affect trading conditions')}</ListItem>
                    </UnorderedList>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">12.2 {t('noInvestmentAdvice', 'No Investment Advice')}</Text>
                    <Text>
                      {t('noInvestmentAdviceContent', 'BitTrade does not provide investment advice, tax advice, or financial advice of any kind. Any information, news, research, analysis, prices, or other information provided by BitTrade or accessible through the Trading Platform is provided as general market commentary and does not constitute investment advice. BitTrade will not be liable for any loss or damage, including without limitation, any loss of profit, which may arise directly or indirectly from use of or reliance on such information.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">12.3 {t('independentDecision', 'Independent Decision Making')}</Text>
                    <Text>
                      {t('independentDecisionContent', 'The Client acknowledges and agrees that all trading decisions are made independently by the Client or its Authorized Persons. The Client is solely responsible for evaluating the risks and merits of each transaction and for ensuring that it has sufficient knowledge, experience, and resources to engage in such trading activities.')}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">12.4 {t('acknowledgment', 'Acknowledgment and Acceptance of Risks')}</Text>
                    <Text>
                      {t('acknowledgmentContent', 'By entering into this Agreement, the Client acknowledges and accepts all risks associated with trading in Financial Instruments. The Client confirms that it has read and understood the Risk Disclosure Statement provided by BitTrade and agrees to be bound by its terms.')}
                    </Text>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          {/* Acceptance Section */}
          <Box p={6} borderWidth="1px" borderRadius="md" borderColor={borderColor} mt={6} bg={isDark ? 'gray.700' : 'gray.50'}>
            <VStack spacing={4} align="stretch">
              <Heading size="md" color={accentColor}>
                {t('agreementAcceptance', 'Agreement Acceptance')}
              </Heading>
              
              <Text>
                {t('agreementAcceptanceContent', 'By accessing or using BitTrade\'s institutional trading services, or by clicking "I Agree" during the account registration process, the Client acknowledges that it has read, understood, and agrees to be bound by all terms and conditions of this Agreement.')}
              </Text>
              
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <Box>
                  <Text fontWeight="medium">
                    {t('legalBindingWarning', 'This is a legally binding agreement.')}
                  </Text>
                  <Text fontSize="sm">
                    {t('legalBindingContent', 'If you do not understand or agree with any part of this Agreement, you should not proceed with registration or use of our services. We recommend seeking legal advice if you have any questions about the legal implications of this Agreement.')}
                  </Text>
                </Box>
              </Alert>
              
              <HStack spacing={4} mt={4} justify="space-between">
                <Button 
                  leftIcon={<Icon as={Download} />} 
                  variant="outline"
                  colorScheme="blue"
                >
                  {t('downloadAgreement', 'Download PDF')}
                </Button>
                
                <Button 
                  leftIcon={<Icon as={ExternalLink} />} 
                  variant="link"
                  colorScheme="blue"
                  as={ChakraLink}
                  href="/contact"
                >
                  {t('contactUs', 'Contact Us with Questions')}
                </Button>
              </HStack>
            </VStack>
          </Box>

          {/* Additional Resources */}
          <Box mt={8}>
            <Heading size="md" mb={4}>{t('additionalResources', 'Additional Resources')}</Heading>
            <Flex wrap="wrap" gap={4}>
              <ChakraLink as={Link} href="/terms" passHref>
                <Button variant="outline" leftIcon={<Icon as={FileText} />} size="sm">
                  {t('generalTerms', 'General Terms of Service')}
                </Button>
              </ChakraLink>
              
              <ChakraLink as={Link} href="/policies/privacy" passHref>
                <Button variant="outline" leftIcon={<Icon as={Shield} />} size="sm">
                  {t('privacyPolicy', 'Privacy Policy')}
                </Button>
              </ChakraLink>
              
              <ChakraLink as={Link} href="/risk-disclosure" passHref>
                <Button variant="outline" leftIcon={<Icon as={AlertTriangle} />} size="sm">
                  {t('riskDisclosureStatement', 'Risk Disclosure Statement')}
                </Button>
              </ChakraLink>
              
              <ChakraLink as={Link} href="/aml-policy" passHref>
                <Button variant="outline" leftIcon={<Icon as={FileText} />} size="sm">
                  {t('amlPolicy', 'AML/KYC Policy')}
                </Button>
              </ChakraLink>
            </Flex>
          </Box>
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

export default InstitutionalTradingAgreement;