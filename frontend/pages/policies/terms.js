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
} from '@chakra-ui/react';
import Link from 'next/link';

const Terms = () => {
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
  const serviceDescriptions = {
    bitfund: t('bitfundDesc', 'a proprietary trading platform that provides funding for skilled traders after an evaluation process'),
    bittrade: t('bittradeDesc', 'a forex and cryptocurrency trading platform that allows users to trade various financial instruments'),
    bitstock: t('bitstockDesc', 'an investment platform that offers access to global financial markets and investment opportunities'),
    adfaly: t('adfalyDesc', 'a payment processing service that facilitates financial transactions for individuals and businesses'),
    bitdash: t('bitdashDesc', 'a suite of financial technology services including trading, investing, and payment processing')
  };

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
        <title>{t('termsOfService')} | {getServiceName()}</title>
        <meta name="description" content={t('termsDescription')} />
      </Head>
      
      <Container maxW="4xl" py={10} dir={isRTL ? 'rtl' : 'ltr'}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center" mb={6}>
            <Heading as="h1" size="xl" mb={3}>
              {t('termsOfService', 'Terms of Service')}
            </Heading>
            <Text color="gray.500">
              {t('lastUpdated', 'Last Updated')}: {lastUpdated}
            </Text>
          </Box>
          
          {/* Introduction */}
          <Box>
            <Text mb={4}>
              {t('termsIntro', 'Welcome to')}{' '}
              <Text as="span" fontWeight="bold" color={accentColor}>
                {getServiceName()}{', '}
              </Text>
              {serviceDescriptions[platform]}.{' '}
              {t('termsIntro2', 'These Terms of Service ("Terms") govern your access to and use of our website, mobile applications, and services. By accessing or using our services, you agree to be bound by these Terms. Please read them carefully.')}
            </Text>
            
            <Alert status="info" borderRadius="md" mb={6}>
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">
                  {t('agreementAlert', 'By using our services, you agree to these Terms:')}
                </Text>
                <Text fontSize="sm" mt={1}>
                  {t('agreementDetails', 'If you do not agree with any part of these Terms, you should not use our services. These Terms constitute a legally binding agreement between you and BitDash Ltd.')}
                </Text>
              </Box>
            </Alert>
          </Box>
          
          {/* Main Content */}
          <Accordion allowMultiple defaultIndex={[0]} borderColor={borderColor}>
            {/* Eligibility */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  1. {t('eligibility', 'Eligibility')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Text>
                    {t('eligibilityDesc', 'To use our services, you must:')}
                  </Text>
                  
                  <UnorderedList spacing={2} pl={6}>
                    <ListItem>
                      {t('eligibilityAge', 'Be at least 18 years of age')}
                    </ListItem>
                    <ListItem>
                      {t('eligibilityLegal', 'Have the legal capacity to enter into a binding agreement')}
                    </ListItem>
                    <ListItem>
                      {t('eligibilityResidence', 'Reside in a jurisdiction where our services are available')}
                    </ListItem>
                    <ListItem>
                      {t('eligibilityCompliance', 'Comply with any additional eligibility requirements specific to the services you use')}
                    </ListItem>
                  </UnorderedList>
                  
                  <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                    <Text fontWeight="medium">
                      {t('eligibilityRestricted', 'Restricted Jurisdictions:')}
                    </Text>
                    <Text>
                      {t('eligibilityRestrictedDesc', 'Our services are not available to residents of certain jurisdictions, including but not limited to the United States, Iran, North Korea, Cuba, Syria, and any other country or region subject to comprehensive sanctions. We reserve the right to restrict access from additional jurisdictions at any time.')}
                    </Text>
                  </Box>
                  
                  <Text>
                    {t('eligibilityBusiness', 'If you are using our services on behalf of a business or other entity, you represent and warrant that you have the authority to bind that entity to these Terms. In such cases, "you" and "your" will refer to both you and that entity.')}
                  </Text>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* Account Registration */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  2. {t('accountRegistration', 'Account Registration and Security')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Heading size="sm" mb={2}>
                    {t('accountCreation', 'Account Creation')}
                  </Heading>
                  <Text>
                    {t('accountCreationDesc', 'To access certain features, you may need to create an account. When registering for an account, you must provide accurate, current, and complete information. You agree to update your information as necessary to maintain its accuracy.')}
                  </Text>
                  
                  <Heading size="sm" mb={2}>
                    {t('accountVerification', 'Account Verification')}
                  </Heading>
                  <Text>
                    {t('accountVerificationDesc', 'We may require you to provide additional information and documents to verify your identity in compliance with applicable laws and regulations, including Know Your Customer (KYC) and Anti-Money Laundering (AML) requirements. You agree to cooperate with all requests for verification and to provide accurate and authentic documentation.')}
                  </Text>
                  
                  <Heading size="sm" mb={2}>
                    {t('accountSecurity', 'Account Security')}
                  </Heading>
                  <Text>
                    {t('accountSecurityDesc', 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to:')}
                  </Text>
                  
                  <UnorderedList spacing={2} pl={6}>
                    <ListItem>
                      {t('accountSecurityPassword', 'Create a strong password and keep it confidential')}
                    </ListItem>
                    <ListItem>
                      {t('accountSecurityAccess', 'Not share your account credentials with any third party')}
                    </ListItem>
                    <ListItem>
                      {t('accountSecurityNotify', 'Notify us immediately of any unauthorized access to your account or any other security breach')}
                    </ListItem>
                    <ListItem>
                      {t('accountSecurityLogout', 'Log out from your account at the end of each session when using shared devices')}
                    </ListItem>
                    <ListItem>
                      {t('accountSecurity2FA', 'Enable two-factor authentication (2FA) when available')}
                    </ListItem>
                  </UnorderedList>
                  
                  <Text>
                    {t('accountSecurityLiability', 'We cannot and will not be liable for any loss or damage arising from your failure to comply with these security obligations.')}
                  </Text>
                  
                  <Heading size="sm" mb={2}>
                    {t('accountRestrictions', 'Account Restrictions')}
                  </Heading>
                  <Text>
                    {t('accountRestrictionsDesc', 'We reserve the right to suspend, terminate, or restrict access to your account if:')}
                  </Text>
                  
                  <UnorderedList spacing={2} pl={6}>
                    <ListItem>
                      {t('accountRestrictionsViolation', 'You violate these Terms or any other policies')}
                    </ListItem>
                    <ListItem>
                      {t('accountRestrictionsActivity', 'We detect suspicious or unauthorized activity')}
                    </ListItem>
                    <ListItem>
                      {t('accountRestrictionsLegal', 'We are required to do so by law or regulatory authority')}
                    </ListItem>
                    <ListItem>
                      {t('accountRestrictionsFraud', 'We have reasonable grounds to believe you are engaged in fraudulent or illegal activities')}
                    </ListItem>
                    <ListItem>
                      {t('accountRestrictionsJurisdiction', 'We determine you are accessing our services from a restricted jurisdiction')}
                    </ListItem>
                  </UnorderedList>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* Service-Specific Terms */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  3. {t('serviceSpecificTerms', 'Service-Specific Terms')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  {/* BitFund Terms */}
                  {platform === 'bitfund' || platform === 'bitdash' ? (
                    <Box>
                      <Heading size="sm" mb={2}>
                        {t('bitfundTerms', 'BitFund Trading Evaluation & Funding Terms')}
                      </Heading>
                      <Text mb={3}>
                        {t('bitfundTermsDesc', 'The following terms apply specifically to users of BitFund services:')}
                      </Text>
                      
                      <UnorderedList spacing={2} pl={6} mb={4}>
                        <ListItem>
                          <Text fontWeight="medium">{t('evaluationChallenge', 'Evaluation Challenge:')}</Text>
                          <Text>{t('evaluationChallengeDesc', 'The evaluation challenge is designed to assess your trading skills. Fees paid for evaluation accounts are non-refundable regardless of performance outcome.')}</Text>
                        </ListItem>
                        <ListItem>
                          <Text fontWeight="medium">{t('tradingRules', 'Trading Rules:')}</Text>
                          <Text>{t('tradingRulesDesc', 'You must comply with all trading rules, including maximum drawdown limits, profit targets, and risk management requirements. Violation of any rule may result in immediate disqualification without compensation.')}</Text>
                        </ListItem>
                        <ListItem>
                          <Text fontWeight="medium">{t('profitSharing', 'Profit Sharing:')}</Text>
                          <Text>{t('profitSharingDesc', 'Upon successful completion of the evaluation and funding approval, profits will be shared according to the terms of your specific program. We reserve the right to modify profit-sharing arrangements with prior notice.')}</Text>
                        </ListItem>
                        <ListItem>
                          <Text fontWeight="medium">{t('fundingDisclaimer', 'Funding Disclaimer:')}</Text>
                          <Text>{t('fundingDisclaimerDesc', 'Passing the evaluation does not guarantee funding. We reserve the right to deny funding to any trader at our sole discretion.')}</Text>
                        </ListItem>
                      </UnorderedList>
                    </Box>
                  ) : null}
                  
                  {/* BitTrade Terms */}
                  {platform === 'bittrade' || platform === 'bitdash' ? (
                    <Box>
                      <Heading size="sm" mb={2}>
                        {t('bittradeTerms', 'BitTrade Forex & Crypto Trading Terms')}
                      </Heading>
                      <Text mb={3}>
                        {t('bittradeTermsDesc', 'The following terms apply specifically to users of BitTrade services:')}
                      </Text>
                      
                      <UnorderedList spacing={2} pl={6} mb={4}>
                        <ListItem>
                          <Text fontWeight="medium">{t('tradingRisks', 'Trading Risks:')}</Text>
                          <Text>{t('tradingRisksDesc', 'Trading in forex, cryptocurrencies, and other financial instruments involves significant risk of loss. You should not trade with funds you cannot afford to lose.')}</Text>
                        </ListItem>
                        <ListItem>
                          <Text fontWeight="medium">{t('marginRequirements', 'Margin Requirements:')}</Text>
                          <Text>{t('marginRequirementsDesc', 'You must maintain sufficient margin in your account to support your open positions. If your account equity falls below required margin levels, your positions may be liquidated automatically without prior notice.')}</Text>
                        </ListItem>
                        <ListItem>
                          <Text fontWeight="medium">{t('orderExecution', 'Order Execution:')}</Text>
                          <Text>{t('orderExecutionDesc', 'We do not guarantee that orders will be executed at the requested price. Market volatility, liquidity, and technical factors may affect execution prices.')}</Text>
                        </ListItem>
                        <ListItem>
                          <Text fontWeight="medium">{t('leverageRisk', 'Leverage Risk:')}</Text>
                          <Text>{t('leverageRiskDesc', 'Trading with leverage can significantly increase potential profits, but it also magnifies potential losses. You may lose more than your initial investment.')}</Text>
                        </ListItem>
                      </UnorderedList>
                    </Box>
                  ) : null}
                  
                  {/* BitStock Terms */}
                  {platform === 'bitstock' || platform === 'bitdash' ? (
                    <Box>
                      <Heading size="sm" mb={2}>
                        {t('bitstockTerms', 'BitStock Investment Platform Terms')}
                      </Heading>
                      <Text mb={3}>
                        {t('bitstockTermsDesc', 'The following terms apply specifically to users of BitStock services:')}
                      </Text>
                      
                      <UnorderedList spacing={2} pl={6} mb={4}>
                        <ListItem>
                          <Text fontWeight="medium">{t('investmentRisks', 'Investment Risks:')}</Text>
                          <Text>{t('investmentRisksDesc', 'All investments involve risk, and the value of your investments may decrease. Past performance is not a reliable indicator of future performance.')}</Text>
                        </ListItem>
                        <ListItem>
                          <Text fontWeight="medium">{t('investmentSuitability', 'Investment Suitability:')}</Text>
                          <Text>{t('investmentSuitabilityDesc', 'You are responsible for determining the suitability of any investment based on your financial situation, investment knowledge, and risk tolerance.')}</Text>
                        </ListItem>
                        <ListItem>
                          <Text fontWeight="medium">{t('marketAccess', 'Market Access:')}</Text>
                          <Text>{t('marketAccessDesc', 'Access to certain markets and investment products may be subject to additional eligibility requirements, fees, and restrictions.')}</Text>
                        </ListItem>
                        <ListItem>
                          <Text fontWeight="medium">{t('taxConsiderations', 'Tax Considerations:')}</Text>
                          <Text>{t('taxConsiderationsDesc', 'You are responsible for any taxes on your investments. We do not provide tax advice, and you should consult with a qualified tax professional.')}</Text>
                        </ListItem>
                      </UnorderedList>
                    </Box>
                  ) : null}
                  
                  {/* BitCash Terms */}
                  {platform === 'adfaly' || platform === 'bitdash' ? (
                    <Box>
                      <Heading size="sm" mb={2}>
                        {t('adfalyTerms', 'BitCash Payment Processing Terms')}
                      </Heading>
                      <Text mb={3}>
                        {t('adfalyTermsDesc', 'The following terms apply specifically to users of BitCash services:')}
                      </Text>
                      
                      <UnorderedList spacing={2} pl={6} mb={4}>
                        <ListItem>
                          <Text fontWeight="medium">{t('paymentProcessing', 'Payment Processing:')}</Text>
                          <Text>{t('paymentProcessingDesc', 'We process payments in accordance with applicable laws and regulations. Processing times may vary depending on payment method, recipient bank, and other factors.')}</Text>
                        </ListItem>
                        <ListItem>
                          <Text fontWeight="medium">{t('fees', 'Fees:')}</Text>
                          <Text>{t('feesDesc', 'You agree to pay all applicable fees for using our payment services as outlined in our Fee Schedule. Fees may be deducted from your transaction amount or charged separately to your account.')}</Text>
                        </ListItem>
                        <ListItem>
                          <Text fontWeight="medium">{t('chargebacks', 'Chargebacks and Disputes:')}</Text>
                          <Text>{t('chargebacksDesc', 'As a merchant, you are responsible for all chargebacks, reversals, and disputes related to your transactions. We may hold funds in reserve to cover potential chargebacks.')}</Text>
                        </ListItem>
                        <ListItem>
                          <Text fontWeight="medium">{t('prohibitedTransactions', 'Prohibited Transactions:')}</Text>
                          <Text>{t('prohibitedTransactionsDesc', 'You may not use our payment services for illegal activities, prohibited business types, or transactions that violate our Acceptable Use Policy.')}</Text>
                        </ListItem>
                      </UnorderedList>
                    </Box>
                  ) : null}
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* Fees and Payments */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  4. {t('feesPayments', 'Fees and Payments')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Heading size="sm" mb={2}>
                    {t('feeSchedule', 'Fee Schedule')}
                  </Heading>
                  <Text>
                    {t('feeScheduleDesc', 'You agree to pay all applicable fees for the services you use as specified in our Fee Schedule. The Fee Schedule is available on our website and may be updated from time to time. Changes to the Fee Schedule will be effective upon posting or as otherwise specified.')}
                  </Text>
                  
                  <Heading size="sm" mb={2}>
                    {t('paymentMethods', 'Payment Methods')}
                  </Heading>
                  <Text>
                    {t('paymentMethodsDesc', 'We accept various payment methods, which may include credit/debit cards, bank transfers, and electronic payment systems. Available payment methods may vary depending on your location and the specific service you are using.')}
                  </Text>
                  
                  <Heading size="sm" mb={2}>
                    {t('paymentTerms', 'Payment Terms')}
                  </Heading>
                  <Text>
                    {t('paymentTermsDesc', 'Payments are due at the time of purchase or as otherwise specified for the particular service. For subscription-based services, payments will be charged automatically according to your selected billing cycle. You authorize us to charge the payment method you provide for all applicable fees.')}
                  </Text>
                  
                  <Heading size="sm" mb={2}>
                    {t('refunds', 'Refunds')}
                  </Heading>
                  <Text>
                    {t('refundsDesc', 'Refunds are provided in accordance with our Refund Policy. In general:')}
                  </Text>
                  
                  <UnorderedList spacing={2} pl={6}>
                    <ListItem>
                      {t('refundsSubscription', 'Subscription fees are generally non-refundable for the current billing period')}
                    </ListItem>
                    <ListItem>
                      {t('refundsEvaluation', 'Evaluation challenge fees are non-refundable once the challenge has started')}
                    </ListItem>
                    <ListItem>
                      {t('refundsProcessing', 'Payment processing fees are non-refundable once a transaction has been processed')}
                    </ListItem>
                    <ListItem>
                      {t('refundsExceptions', 'Refunds may be granted at our discretion in exceptional circumstances or as required by law')}
                    </ListItem>
                  </UnorderedList>
                  
                  <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                    <Text fontWeight="medium">
                      {t('taxesTitle', 'Taxes')}
                    </Text>
                    <Text>
                      {t('taxesDesc', 'You are responsible for all taxes, duties, and similar charges applicable to your use of our services. We may collect applicable taxes if required by law, but you remain responsible for any uncollected taxes.')}
                    </Text>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* Intellectual Property */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  5. {t('intellectualProperty', 'Intellectual Property Rights')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Heading size="sm" mb={2}>
                    {t('ourIP', 'Our Intellectual Property')}
                  </Heading>
                  <Text>
                    {t('ourIPDesc', 'All content, features, and functionality of our services, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, software, and the design, selection, and arrangement thereof, are owned by us, our licensors, or other providers of such material and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.')}
                  </Text>
                  
                  <Heading size="sm" mb={2}>
                    {t('licenseGrant', 'License Grant')}
                  </Heading>
<Text>
                    {t('licenseGrantDesc', 'Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, non-sublicensable license to access and use our services for your personal or internal business purposes. This license does not include any resale or commercial use of our services or their contents.')}
                  </Text>
                  
                  <Heading size="sm" mb={2}>
                    {t('restrictions', 'Restrictions')}
                  </Heading>
                  <Text>
                    {t('restrictionsDesc', 'You may not:')}
                  </Text>
                  
                  <UnorderedList spacing={2} pl={6}>
                    <ListItem>
                      {t('restrictionsCopy', 'Copy, modify, or create derivative works based on our services or their content')}
                    </ListItem>
                    <ListItem>
                      {t('restrictionsDownload', 'Download, scrape, or extract data from our services except as expressly permitted')}
                    </ListItem>
                    <ListItem>
                      {t('restrictionsRemove', 'Remove any copyright, trademark, or other proprietary notices')}
                    </ListItem>
                    <ListItem>
                      {t('restrictionsReverse', 'Reverse engineer, decompile, or attempt to discover the source code of our software')}
                    </ListItem>
                    <ListItem>
                      {t('restrictionsFrame', 'Frame or mirror any part of our services without our express written consent')}
                    </ListItem>
                    <ListItem>
                      {t('restrictionsAccess', 'Access our services by any means other than through the interfaces we provide')}
                    </ListItem>
                  </UnorderedList>
                  
                  <Heading size="sm" mb={2}>
                    {t('feedback', 'Feedback')}
                  </Heading>
                  <Text>
                    {t('feedbackDesc', 'If you provide us with feedback or suggestions regarding our services, you hereby grant us a perpetual, irrevocable, worldwide, royalty-free license to use such feedback or suggestions for any purpose without compensation to you.')}
                  </Text>
                  
                  <Heading size="sm" mb={2}>
                    {t('trademarks', 'Trademarks')}
                  </Heading>
                  <Text>
                    {t('trademarksDesc', 'BitDash, BitFund, BitTrade, BitStock, BitCash, and all related names, logos, product and service names, designs, and slogans are trademarks of BitDash Ltd. or its affiliates. You may not use such marks without our prior written permission.')}
                  </Text>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* User Conduct */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  6. {t('userConduct', 'User Conduct')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Text>
                    {t('userConductDesc', 'You agree not to use our services for any purpose that is unlawful or prohibited by these Terms. In particular, you agree not to:')}
                  </Text>
                  
                  <UnorderedList spacing={2} pl={6}>
                    <ListItem>
                      {t('conductViolate', 'Violate any applicable law, regulation, or third-party rights')}
                    </ListItem>
                    <ListItem>
                      {t('conductFraud', 'Engage in fraudulent, deceptive, or manipulative activities')}
                    </ListItem>
                    <ListItem>
                      {t('conductHarm', 'Harm minors in any way')}
                    </ListItem>
                    <ListItem>
                      {t('conductImpersonate', 'Impersonate any person or entity')}
                    </ListItem>
                    <ListItem>
                      {t('conductInterference', 'Interfere with or disrupt our services or servers')}
                    </ListItem>
                    <ListItem>
                      {t('conductHacking', 'Attempt to gain unauthorized access to our systems or user accounts')}
                    </ListItem>
                    <ListItem>
                      {t('conductMalware', 'Introduce viruses, trojans, worms, or other malicious code')}
                    </ListItem>
                    <ListItem>
                      {t('conductAutomate', 'Use automated systems or software to extract data from our services')}
                    </ListItem>
                    <ListItem>
                      {t('conductSpam', 'Send unsolicited communications or spam')}
                    </ListItem>
                    <ListItem>
                      {t('conductMarketManipulation', 'Engage in market manipulation, insider trading, or other prohibited trading practices')}
                    </ListItem>
                    <ListItem>
                      {t('conductMoney', 'Use our services for money laundering, terrorist financing, or other illegal activities')}
                    </ListItem>
                    <ListItem>
                      {t('conductDetrimental', 'Otherwise act in a manner that is detrimental to our interests or the interests of our users')}
                    </ListItem>
                  </UnorderedList>
                  
                  <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                    <Text fontWeight="medium">
                      {t('enforcementTitle', 'Enforcement')}
                    </Text>
                    <Text>
                      {t('enforcementDesc', 'We reserve the right to investigate and take appropriate legal action against anyone who, in our sole discretion, violates this section, including without limitation, removing the offending content, suspending or terminating the account of such violators, and reporting to law enforcement authorities.')}
                    </Text>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* Disclaimers and Limitations */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  7. {t('disclaimers', 'Disclaimers and Limitations of Liability')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Heading size="sm" mb={2}>
                    {t('disclaimersGeneral', 'General Disclaimers')}
                  </Heading>
                  <Text fontWeight="medium">
                    {t('disclaimersUpper', 'OUR SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.')}
                  </Text>
                  <Text>
                    {t('disclaimersGeneral1', 'To the fullest extent permitted by law, we disclaim all warranties, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement. We do not warrant that our services will be uninterrupted, error-free, secure, or free of viruses or other harmful components.')}
                  </Text>
                  
                  <Heading size="sm" mb={2}>
                    {t('noFinancialAdvice', 'No Financial Advice')}
                  </Heading>
                  <Text>
                    {t('noFinancialAdviceDesc', 'The information provided through our services is for general informational purposes only and should not be construed as financial, investment, legal, or tax advice. You should consult with qualified professionals before making any financial decisions or investments.')}
                  </Text>
                  
                  <Heading size="sm" mb={2}>
                    {t('limitationLiability', 'Limitation of Liability')}
                  </Heading>
                  <Text fontWeight="medium">
                    {t('limitationLiabilityUpper', 'TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.')}
                  </Text>
                  <Text>
                    {t('limitationLiabilityDesc1', 'Our total liability to you for any claim arising out of or relating to these Terms or our services, regardless of the form of the action, is limited to the amount paid by you to us for the specific service giving rise to the claim during the six (6) months preceding the claim.')}
                  </Text>
                  <Text>
                    {t('limitationLiabilityDesc2', 'Some jurisdictions do not allow the exclusion of certain warranties or the limitation or exclusion of liability for certain damages. Accordingly, some of the disclaimers and limitations set forth in these Terms may not apply to you.')}
                  </Text>
                  
                  <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                    <Text fontWeight="medium">
                      {t('tradingRisksTitle', 'Trading and Investment Risks')}
                    </Text>
                    <Text>
                      {t('tradingRisksDesc', 'Trading and investing in financial instruments involve significant risk of loss and are not suitable for all investors. Past performance is not indicative of future results. You should consider whether you understand how these instruments work and whether you can afford to take the high risk of losing your money.')}
                    </Text>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* Indemnification */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  8. {t('indemnification', 'Indemnification')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Text>
                    {t('indemnificationDesc', 'You agree to indemnify, defend, and hold harmless BitDash Ltd., its affiliates, officers, directors, employees, agents, licensors, and service providers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys\' fees) arising out of or relating to:')}
                  </Text>
                  
                  <UnorderedList spacing={2} pl={6}>
                    <ListItem>
                      {t('indemnificationViolation', 'Your violation of these Terms or any other policy')}
                    </ListItem>
                    <ListItem>
                      {t('indemnificationContent', 'Your use of our services')}
                    </ListItem>
                    <ListItem>
                      {t('indemnificationRights', 'Your violation of any third-party right, including intellectual property rights')}
                    </ListItem>
                    <ListItem>
                      {t('indemnificationLaws', 'Your violation of any law or regulation')}
                    </ListItem>
                    <ListItem>
                      {t('indemnificationClaims', 'Any claim that your use of our services caused damage to a third party')}
                    </ListItem>
                  </UnorderedList>
                  
                  <Text>
                    {t('indemnificationCooperation', 'This indemnification obligation will survive the termination of these Terms and your use of our services. We reserve the right, at our own expense, to assume the exclusive defense and control of any matter subject to indemnification by you. In such case, you agree to cooperate with our defense of such claim.')}
                  </Text>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* Term and Termination */}
            <AccordionItem border="1px" borderRadius="md" mb={4}>
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  9. {t('termTermination', 'Term and Termination')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Text>
                    {t('termDesc', 'These Terms will remain in full force and effect while you use our services or maintain an account with us.')}
                  </Text>
                  
                  <Heading size="sm" mb={2}>
                    {t('terminationByYou', 'Termination by You')}
                  </Heading>
                  <Text>
                    {t('terminationByYouDesc', 'You may terminate these Terms by closing your account and discontinuing use of all services. If you have a subscription, you may need to cancel it separately according to our cancellation policy.')}
                  </Text>
                  
                  <Heading size="sm" mb={2}>
                    {t('terminationByUs', 'Termination by Us')}
                  </Heading>
                  <Text>
                    {t('terminationByUsDesc', 'We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason, including, without limitation:')}
                  </Text>
                  
                  <UnorderedList spacing={2} pl={6}>
                    <ListItem>
                      {t('terminationByUsViolation', 'If you breach any terms or conditions of these Terms')}
                    </ListItem>
                    <ListItem>
                      {t('terminationByUsLegal', 'If we are required to do so by law or regulatory authority')}
                    </ListItem>
                    <ListItem>
                      {t('terminationByUsFraud', 'If we suspect fraudulent or illegal activities')}
                    </ListItem>
                    <ListItem>
                      {t('terminationByUsHarm', 'If your actions may cause harm to us, our services, or other users')}
                    </ListItem>
                    <ListItem>
                      {t('terminationByUsDiscretion', 'At our sole discretion for any other reason')}
                    </ListItem>
                  </UnorderedList>
                  
                  <Heading size="sm" mb={2}>
                    {t('effectOfTermination', 'Effect of Termination')}
                  </Heading>
                  <Text>
                    {t('effectOfTerminationDesc', 'Upon termination of your account:')}
                  </Text>
                  
                  <UnorderedList spacing={2} pl={6}>
                    <ListItem>
                      {t('effectOfTerminationAccess', 'Your right to access and use our services will immediately cease')}
                    </ListItem>
                    <ListItem>
                      {t('effectOfTerminationData', 'We may delete or archive your account data in accordance with our data retention policies')}
                    </ListItem>
                    <ListItem>
                      {t('effectOfTerminationFunds', 'Any remaining funds in your account will be processed according to our account closure policy')}
                    </ListItem>
                    <ListItem>
                      {t('effectOfTerminationObligations', 'Any outstanding obligations you have to us will remain in effect')}
                    </ListItem>
                  </UnorderedList>
                  
                  <Text>
                    {t('survivalTerms', 'The provisions of these Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.')}
                  </Text>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* General Provisions */}
            <AccordionItem border="1px" borderRadius="md">
              <AccordionButton py={4}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  10. {t('generalProvisions', 'General Provisions')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={6}>
                <VStack spacing={4} align="stretch">
                  <Heading size="sm" mb={2}>
                    {t('governingLaw', 'Governing Law')}
                  </Heading>
                  <Text>
                    {t('governingLawDesc', 'These Terms shall be governed by and construed in accordance with the laws of the United Kingdom, without regard to its conflict of law principles. The United Nations Convention on Contracts for the International Sale of Goods shall not apply to these Terms.')}
                  </Text>
                  
                  <Heading size="sm" mb={2}>
                    {t('disputeResolution', 'Dispute Resolution')}
                  </Heading>
                  <Text>
                    {t('disputeResolutionDesc', 'Any dispute arising out of or in connection with these Terms shall be resolved through:')}
                  </Text>
                  
                  <OrderedList spacing={2} pl={6}>
                    <ListItem>
                      {t('disputeResolutionNegotiation', 'Informal negotiation: We will attempt to resolve any disputes through good-faith negotiations.')}
                    </ListItem>
                    <ListItem>
                      {t('disputeResolutionMediation', 'Mediation: If negotiations fail, either party may initiate mediation by a neutral mediator.')}
                    </ListItem>
                    <ListItem>
                      {t('disputeResolutionArbitration', 'Arbitration: If mediation fails, disputes shall be resolved by binding arbitration in London, United Kingdom, in accordance with the rules of the London Court of International Arbitration.')}
                    </ListItem>
                  </OrderedList>
                  
                  <Text>
                    {t('disputeResolutionClass', 'YOU AND WE AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.')}
                  </Text>
                  
                  <Heading size="sm" mb={2}>
                    {t('entireAgreement', 'Entire Agreement')}
                  </Heading>
                  <Text>
                    {t('entireAgreementDesc', 'These Terms, together with any other agreements or policies referenced herein, constitute the entire agreement between you and us regarding your use of our services and supersede all prior agreements and understandings, whether written or oral.')}
                  </Text>
                  
                  <Heading size="sm" mb={2}>
                    {t('waiver', 'Waiver')}
                  </Heading>
                  <Text>
                    {t('waiverDesc', 'Our failure to enforce any right or provision of these Terms shall not be deemed a waiver of such right or provision. Any waiver of any provision of these Terms will be effective only if it is in writing and signed by us.')}
                  </Text>
                  
                  <Heading size="sm" mb={2}>
                    {t('severability', 'Severability')}
                  </Heading>
                  <Text>
                    {t('severabilityDesc', 'If any provision of these Terms is held to be invalid or unenforceable, such provision shall be struck and the remaining provisions shall be enforced to the fullest extent permitted by law.')}
                  </Text>
                  
                  <Heading size="sm" mb={2}>
                    {t('assignment', 'Assignment')}
                  </Heading>
                  <Text>
                    {t('assignmentDesc', 'You may not assign or transfer these Terms, by operation of law or otherwise, without our prior written consent. We may assign or transfer these Terms, at our sole discretion, without restriction.')}
                  </Text>
                  
                  <Heading size="sm" mb={2}>
                    {t('notices', 'Notices')}
                  </Heading>
                  <Text>
                    {t('noticesDesc', 'We may provide notices to you via email, regular mail, or postings on our website or services. Notices to us should be sent to the contact information provided below.')}
                  </Text>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            
            {/* Contact Information */}
            <Box p={6} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md" mt={8}>
              <Heading size="md" mb={4}>
                {t('contactInformation', 'Contact Information')}
              </Heading>
              <Text>
                {t('contactInfoDesc', 'If you have any questions about these Terms, please contact us at:')}
              </Text>
              <VStack align="flex-start" mt={3} spacing={1}>
                <Text>BitDash Ltd.</Text>
                <Text>123 Financial Street, Tech Tower</Text>
                <Text>London, United Kingdom</Text>
                <Text>Email: legal@bitdash.app</Text>
                <Text>Phone: +44 123 456 7890</Text>
              </VStack>
            </Box>
            
            {/* Acceptance */}
            <Box mt={8} textAlign="center">
              <Text fontWeight="medium">
                {t('acceptanceStatement', 'By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.')}
              </Text>
              <Button
                as={ChakraLink}
                href="/"
                mt={4}
                colorScheme={platform}
                size="lg"
                width={{ base: 'full', md: 'auto' }}
              >
                {t('return', 'Return to Home Page')}
              </Button>
            </Box>
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

export default Terms;