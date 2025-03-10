import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  useColorMode,
  useColorModeValue,
  Container,
  Flex,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Link as ChakraLink,
  Alert,
  AlertIcon,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ListItem,
  UnorderedList,
  Divider,
  useDisclosure
} from '@chakra-ui/react';
import { AlertTriangle, ExternalLink, Shield, Info, AlertCircle } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

const RiskDisclosure = ({ platform, accountType, onAccept, isRequired = true }) => {
  const { t } = useTranslation('common');
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hasReadDocument, setHasReadDocument] = useState(false);
  const [platformKey, setPlatformKey] = useState(null);
  const isRTL = router.locale === 'ar';
  
  // Refs for scrolling detection
  const modalBodyRef = useRef(null);
  
  // Colors
  const accentColor = useColorModeValue(`brand.${platformKey}.500`, `brand.${platformKey}.400`);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  useEffect(() => {
    if (platform) {
      // Extract platform key (e.g., 'trade' from BitTrade)
      const key = platform.toLowerCase().replace('bit', '');
      setPlatformKey(key);
    }
  }, [platform]);
  
  // Reset read status when modal opens
  useEffect(() => {
    if (isOpen) {
      setHasReadDocument(false);
    }
  }, [isOpen]);

  // Handle scroll event to check if user has reached the bottom
  const handleScroll = () => {
    if (!modalBodyRef.current || !isRequired) return;
    
    const { scrollTop, scrollHeight, clientHeight } = modalBodyRef.current;
    // Check if user has scrolled to bottom (with a small buffer)
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setHasReadDocument(true);
    }
  };

  const handleAccept = () => {
    if (isRequired && !hasReadDocument) {
      return;
    }
    
    if (onAccept) {
      onAccept(true); // Always return true since we're removing the checkbox
    }
    onClose();
  };

  // Platform-specific risk sections
  const getRisks = () => {
    // Common risks for all platforms
    const commonRisks = [
      {
        title: t('marketRisk.title', 'Market Risk'),
        content: t('marketRisk.content', 'Financial markets can be volatile and prices of financial instruments may rise or fall rapidly. This volatility can result in significant losses of your invested capital in a short period of time.')
      },
      {
        title: t('operationalRisk.title', 'Operational Risk'),
        content: t('operationalRisk.content', 'System failures, network disruptions, and other operational issues may affect your ability to execute transactions or access your account. While we maintain robust systems, no electronic platform can guarantee 100% uptime or security.')
      },
      {
        title: t('thirdPartyRisk.title', 'Third-Party Risk'),
        content: t('thirdPartyRisk.content', 'Your funds may be held with third-party institutions. We select our partners with care, but we cannot guarantee their continued solvency or security measures.')
      },
      {
        title: t('cyberRisk.title', 'Cybersecurity Risk'),
        content: t('cyberRisk.content', 'Despite our security measures, we cannot guarantee complete protection against cybersecurity threats. You should take appropriate measures to secure your account and personal information.')
      },
      {
        title: t('regulatoryRisk.title', 'Regulatory and Legal Risk'),
        content: t('regulatoryRisk.content', 'Changes in laws, regulations, or tax policies may adversely affect the value of your investments or the operation of our platforms. These changes can occur in any jurisdiction relevant to your activities.')
      }
    ];
    
    // Platform-specific risks
    const platformRisks = {
      ldn: [
        {
          title: t('leverageRisk.title', 'Leverage Risk'),
          content: t('leverageRisk.content', 'Trading with leverage can significantly increase potential profits, but it also magnifies potential losses. You may lose more than your initial investment and be required to deposit additional funds to maintain your positions or cover losses.')
        },
        {
          title: t('marginCallRisk.title', 'Margin Call and Liquidation Risk'),
          content: t('marginCallRisk.content', 'If your account equity falls below required margin levels, your positions may be liquidated automatically without prior notice. Market volatility may result in rapid liquidation at unfavorable prices.')
        },
        {
          title: t('forexRisk.title', 'Foreign Exchange Risk'),
          content: t('forexRisk.content', 'Foreign exchange markets can be highly volatile. Significant changes in currency exchange rates may occur in very short periods of time, which can result in substantial losses.')
        },
        {
          title: t('cryptoVolatilityRisk.title', 'Cryptocurrency Volatility Risk'),
          content: t('cryptoVolatilityRisk.content', 'Cryptocurrencies often experience significant price volatility. The value of cryptocurrency instruments may decrease substantially in a short period, potentially resulting in complete loss of invested capital.')
        }
      ],
      adfaaly: [
        {
          title: t('paymentProcessingRisk.title', 'Payment Processing Risk'),
          content: t('paymentProcessingRisk.content', 'Transactions may be delayed, rejected, or reversed due to compliance checks, technical issues, or third-party payment processor policies beyond our control.')
        },
        {
          title: t('fxConversionRisk.title', 'Currency Conversion Risk'),
          content: t('fxConversionRisk.content', 'When transacting in multiple currencies, exchange rate fluctuations may affect the final amount received or paid. Additional fees may apply to currency conversions.')
        },
        {
          title: t('fraudRisk.title', 'Fraud and Chargeback Risk'),
          content: t('fraudRisk.content', 'For merchants, payments received may be subject to chargebacks or reversals in cases of fraud, customer disputes, or regulatory actions. Maintain proper documentation of all transactions.')
        },
        {
          title: t('complianceRisk.title', 'Compliance Risk'),
          content: t('complianceRisk.content', 'Payment services are subject to strict regulatory requirements. Your account may be limited, suspended, or closed if your activities raise compliance concerns or violate our terms of service.')
        }
      ]
    };
    
    // Combine common risks with platform-specific risks
    return [...commonRisks, ...(platformRisks[platformKey] || [])];
  };

  // Get account-specific disclaimers
  const getAccountTypeDisclaimers = () => {
    if (!accountType || !platformKey) return [];
    
    const disclaimers = {
      ldn: {
        retail: [
          t('tradingIsRisky', 'Trading in financial instruments carries a high level of risk and may not be suitable for all investors. You should carefully consider your investment objectives, level of experience, and risk appetite.'),
          t('leverageWarning', 'Trading on margin with leverage means you may lose more than your initial deposit. Make sure you fully understand the risks involved and if necessary, seek independent financial advice.')
        ],
        'introducing-broker': [
          t('introducingBrokerWarning', 'As an Introducing Broker, you are responsible for properly representing our services to clients. Misrepresenting products or making guaranteed return promises is strictly prohibited.'),
          t('clientLossWarning', 'Your clients may experience losses when trading. You must ensure all referred clients understand the risks associated with trading our products.')
        ],
        institutional: [
          t('institutionalWarning', 'Even with advanced trading tools and infrastructure, institutional trading carries significant risks. Market disruptions, liquidity events, and system failures can impact operations.'),
          t('dueDigenceReminder', 'Your organization should conduct thorough due diligence and risk assessment before utilizing our services.')
        ]
      },
      adfaaly: {
        merchant: [
          t('merchantWarning', 'Payment processing involves compliance with complex regulations. Your account may be subject to holds or reserves based on your business type, transaction volume, or risk profile.'),
          t('chargebackRisk', 'You bear the financial responsibility for chargebacks and payment disputes. Maintain proper documentation and clear refund policies to mitigate these risks.')
        ],
        agent: [
          t('agentWarning', 'As a payment agent, you must comply with all applicable laws regarding money transfer, anti-money laundering, and know-your-customer requirements.'),
          t('agentLiabilityWarning', 'You may be held liable for facilitating fraudulent transactions. Always verify the identity of your customers and the legitimacy of transactions.')
        ],
        customer: [
          t('paymentWarning', 'Electronic payments may be subject to processing delays, technical issues, or security concerns. Always verify transaction details before confirming.'),
          t('unauthorizedTransactionWarning', 'Protect your account credentials. You may be responsible for unauthorized transactions if you fail to keep your authentication methods secure.')
        ]
      }
    };
    
    return disclaimers[platformKey]?.[accountType] || [];
  };

  return (
    <>
      <Button
        onClick={onOpen}
        variant="contained"
        leftIcon={<Icon as={isRequired ? AlertTriangle : Info} />}
      >
        {t('viewRiskDisclosure', 'View Risk Disclosure')}
      </Button>

      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        size="xl" 
        scrollBehavior="inside"
        isCentered
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent 
          bg={bgColor} 
          borderColor={borderColor}
          borderWidth="1px"
          borderRadius="xl"
          mx={4}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <ModalHeader borderBottomWidth="1px" borderColor={borderColor}>
            <Flex align="center">
              <Icon as={AlertTriangle} color={accentColor} mr={2} />
              <Text>
                {t('riskDisclosureTitle', 'Risk Disclosure Statement')}
                {platform && ` - ${platform}`}
              </Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody 
            py={4} 
            ref={modalBodyRef} 
            onScroll={handleScroll}
            maxH="60vh" // Enforce a max height to ensure scrolling
          >
            <VStack spacing={6} align="stretch">
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <Text>
                  {t('riskWarning', 'This document outlines significant risks associated with our services. Please read carefully before proceeding.')}
                </Text>
              </Alert>
              
              {/* Introduction */}
              <Text>
                {t('riskIntroduction', 'The following disclosure outlines the main risks associated with using our platform and services. This is not an exhaustive list of all risks involved. You should carefully consider whether our services are suitable for you in light of your financial resources, experience, objectives, and other relevant circumstances.')}
              </Text>
              
              {/* General risk statement */}
              <Box p={4} bg={isDark ? 'gray.700' : 'gray.50'} borderRadius="md">
                <Text fontWeight="bold">
                  {t('generalRiskStatement', 'General Risk Statement:')}
                </Text>
                <Text mt={2}>
                  {t('generalRiskDescription', 'Financial activities involve significant risk. You may lose some or all of your invested capital or deposited funds. Past performance is not indicative of future results. You should not engage in financial activities with money you cannot afford to lose. If you have any doubts, you should seek independent financial advice.')}
                </Text>
              </Box>
              
              {/* Platform-specific disclaimer */}
              {platformKey && (
                <Box p={4} bg={isDark ? `brand.${platformKey}.900` : `brand.${platformKey}.50`} borderRadius="md">
                  <Text fontWeight="bold">
                    {t(`${platformKey}SpecificRisk.title`, `${platform} Specific Risk Statement:`)}
                  </Text>
                  <Text mt={2}>
                    {t(`${platformKey}SpecificRisk.content`, {
                      ldn: 'Trading in forex, cryptocurrencies, and other leveraged products carries a high level of risk and may not be suitable for all investors. Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite.',
                      adfaaly: 'Payment processing services involve risks related to compliance, fraud, and operational issues. Merchants and agents face additional risks related to chargebacks, regulatory requirements, and handling of client funds.'
                    }[platformKey] || 'This platform involves financial risks that you should fully understand before proceeding.')}
                  </Text>
                </Box>
              )}
              
              {/* Account-specific disclaimers */}
              {getAccountTypeDisclaimers().length > 0 && (
                <Box>
                  <Heading size="sm" mb={2}>
                    {t('accountSpecificRisks', 'Account-Specific Considerations:')}
                  </Heading>
                  <UnorderedList spacing={2} pl={4}>
                    {getAccountTypeDisclaimers().map((disclaimer, index) => (
                      <ListItem key={index}>{disclaimer}</ListItem>
                    ))}
                  </UnorderedList>
                </Box>
              )}
              
              {/* Detailed risks */}
              <Heading size="sm" mb={2}>
                {t('detailedRisks', 'Detailed Risk Factors:')}
              </Heading>
              
              <Accordion allowToggle>
                {getRisks().map((risk, index) => (
                  <AccordionItem key={index} border="1px" borderColor={borderColor} borderRadius="md" mb={2}>
                    <AccordionButton>
                      <Box flex="1" textAlign={isRTL ? "right" : "left"}>
                        <Flex align="center">
                          <Icon as={AlertCircle} color={accentColor} boxSize={4} mr={2} />
                          <Text fontWeight="medium">{risk.title}</Text>
                        </Flex>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      {risk.content}
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <Divider />
              
              {/* No guarantee section */}
              <Box>
                <Heading size="sm" mb={2}>
                  {t('noGuarantee.title', 'No Guarantee of Returns:')}
                </Heading>
                <Text>
                  {t('noGuarantee.content', 'We do not guarantee any profit or particular rate of return. Any examples, testimonials, or performance figures shown are for illustrative purposes only and do not represent guarantees of similar results.')}
                </Text>
              </Box>
              
              {/* Capacity and compliance */}
              <Box>
                <Heading size="sm" mb={2}>
                  {t('capacityAndCompliance.title', 'Your Capacity and Compliance:')}
                </Heading>
                <Text>
                  {t('capacityAndCompliance.content', 'By using our services, you represent that you have the knowledge and experience to make your own evaluation of the merits and risks of using our services and that you are not relying on us for advice. You also represent that your use of our services complies with all applicable laws and regulations in your jurisdiction.')}
                </Text>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
            <Button 
              variant="outline" 
              mr={3} 
              onClick={onClose}
            >
              {t('close', 'Close')}
            </Button>
            <Button 
              colorScheme={platformKey || "blue"} 
              onClick={handleAccept}
              isDisabled={isRequired && !hasReadDocument}
              leftIcon={<Icon as={Shield} />}
            >
              {isRequired && !hasReadDocument ? (
                <Tooltip hasArrow label={t('scrollToAccept', 'Please review the entire document first')}>
                  <span>{t('acceptRisks', 'Accept & Continue')}</span>
                </Tooltip>
              ) : (
                t('acceptRisks', 'Accept & Continue')
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RiskDisclosure;