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
  Divider,
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
} from '@chakra-ui/react';

// Chakra UI Icons
import {
  ArrowForwardIcon,
  ArrowDownIcon,
  InfoIcon,
  CheckCircleIcon,
  StarIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
} from '@chakra-ui/icons';

// Framer Motion
import { motion, AnimatePresence } from 'framer-motion';

// Layout (assuming you have a default Layout component)
import Layout from '@/components/Layout';

// FAQ data for merchants
// This data would normally come from translation files or API
// Here we're setting up the structure to be translation-friendly
const getFAQData = (t) => [
  {
    question: t('merchants.faq.q1', 'How do I sign up as a BitCash merchant?'),
    answer: t('merchants.faq.a1', 'Signing up is simple! Click the "Become a Merchant" button, complete the application form with your business details, upload verification documents, and our team will activate your account within 48 hours.'),
  },
  {
    question: t('merchants.faq.q2', 'What fees do merchants pay?'),
    answer: t('merchants.faq.a2', 'BitCash merchants enjoy competitive transaction fees of just 1.5% per successful payment. There are no monthly fees, no setup costs, and no hidden charges. You only pay when you get paid.'),
  },
  {
    question: t('merchants.faq.q3', 'How quickly will I receive payments?'),
    answer: t('merchants.faq.a3', 'All payments are settled instantly to your BitCash merchant wallet. You can withdraw funds at any time to your bank account, use them for business expenses via the BitCash app, or collect cash at any of our agent locations.'),
  },
  {
    question: t('merchants.faq.q4', 'Can I use BitCash for both online and in-person sales?'),
    answer: t('merchants.faq.a4', 'Absolutely! Generate payment links for online sales, invoices, and digital services. For in-person transactions, use our merchant app to create QR codes that customers can scan to pay immediately.'),
  },
  {
    question: t('merchants.faq.q5', 'Is there a limit to how much I can receive?'),
    answer: t('merchants.faq.a5', 'Standard merchant accounts can receive up to $10,000 per day. Need more? Our premium merchant tier offers higher limits and can be activated after 3 months of regular business activity or immediately upon enhanced verification.'),
  },
  {
    question: t('merchants.faq.q6', 'How do customers pay me?'),
    answer: t('merchants.faq.a6', 'Customers can pay using the BitCash app by scanning your QR code, clicking your payment link, or finding your business in the merchant directory. They can fund payments from their BitCash balance, linked bank accounts, or cards.'),
  },
  {
    question: t('merchants.faq.q7', 'Can I issue refunds?'),
    answer: t('merchants.faq.a7', 'Yes, you can issue full or partial refunds for any transaction directly from your merchant dashboard for up to 90 days after the transaction date.'),
  },
  {
    question: t('merchants.faq.q8', 'Do you provide integration support?'),
    answer: t('merchants.faq.a8', 'We offer comprehensive API documentation for integrating BitCash payments into your website or app. Our developer support team is available to help with technical questions and implementation guidance.'),
  },
];

function MerchantsPage() {
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
    'linear(to-b, green.50, white)',
    'linear(to-b, gray.900, black)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const accentColor = useColorModeValue('brand.bitcash.600', 'brand.bitcash.400');
  const headingSize = useBreakpointValue({ base: '2xl', md: '3xl', lg: '4xl' });
  const sectionPadding = useBreakpointValue({ base: 8, md: 16 });
  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' });

  return (
    <Layout>
      <Box bg={bgGradient} overflow="hidden" minH="100vh" textAlign={locale === 'ar' ? 'right' : 'left'}>
        <Container maxW="7xl" pt={{ base: 4, md: 8 }} px={{ base: 4, md: 8 }}>
          {/* HERO SECTION */}
          <SlideFade in offsetY="20px">
            <Flex
              direction="column"
              align="center"
              textAlign="center"
              pt={{ base: 12, md: 20 }}
              pb={{ base: 8, md: 16 }}
            >
              <VStack spacing={{ base: 4, md: 8 }} maxW="4xl">
                <Heading
                  fontSize={headingSize}
                  bgGradient="linear(to-r, brand.bitcash.500, brand.bitcash.700)"
                  bgClip="text"
                  lineHeight="1.2"
                >
                  {t('merchants.hero.heading', 'Grow Your Business with BitCash Payments')}
                </Heading>
                <Text fontSize={{ base: 'lg', md: 'xl' }} opacity={0.8} maxW="3xl">
                  {t('merchants.hero.subtext', 'Accept payments online or in person, get paid instantly, and manage your cash flow with ease. Join thousands of merchants transforming their businesses with BitCash.')}
                </Text>
                <HStack spacing={4} pt={4}>
                  <Button
                    size={buttonSize}
                    colorScheme="green"
                    rightIcon={<ArrowForwardIcon />}
                    onClick={() => router.push('/merchants/signup')}
                  >
                    {t('merchants.hero.signupButton', 'Become a Merchant')}
                  </Button>
                  <Button
                    size={buttonSize}
                    variant="bitcash-outline"
                    onClick={() => router.push('/merchants/demo')}
                  >
                    {t('merchants.hero.demoButton', 'See Demo')}
                  </Button>
                </HStack>
              </VStack>
            </Flex>
          </SlideFade>

          {/* MERCHANT BENEFITS */}
          <SlideFade in offsetY="30px">
            <Box mt={sectionPadding} p={{ base: 6, md: 10 }} bg={cardBg} borderRadius="xl" boxShadow="xl">
              <Heading fontSize={{ base: '2xl', md: '3xl' }} mb={{ base: 4, md: 8 }} color={accentColor}>
                {t('merchants.benefits.heading', 'Everything You Need to Accept Payments')}
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg' }} mb={6}>
                {t('merchants.benefits.subtext', 'BitCash gives merchants powerful, flexible payment solutions with the lowest fees in the industry. Whether you run an online store, a physical shop, or provide services, we\'ve got you covered.')}
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={6}>
                <VStack align="start" spacing={4}>
                  <HStack>
                    <ArrowForwardIcon color="brand.bitcash.500" boxSize={6} />
                    <Heading size="md">{t('merchants.benefits.feature1.title', 'Payment Links & QR Codes')}</Heading>
                  </HStack>
                  <Text fontSize="sm">
                    {t('merchants.benefits.feature1.description', 'Generate custom payment links for online sales or dynamic QR codes for in-person transactions. Customers can pay in seconds from their phones.')}
                  </Text>
                  <Divider />
                  <HStack>
                    <ArrowForwardIcon color="brand.bitcash.500" boxSize={6} />
                    <Heading size="md">{t('merchants.benefits.feature2.title', 'Instant Settlement')}</Heading>
                  </HStack>
                  <Text fontSize="sm">
                    {t('merchants.benefits.feature2.description', 'No more waiting days for payments to clear. Receive funds instantly in your BitCash wallet and access your money immediately.')}
                  </Text>
                </VStack>

                <VStack align="start" spacing={4}>
                  <HStack>
                    <ArrowForwardIcon color="brand.bitcash.500" boxSize={6} />
                    <Heading size="md">Flexible Withdrawals</Heading>
                  </HStack>
                  <Text fontSize="sm">
                    Withdraw your earnings to your bank account, collect cash at agent locations, or visit our offices for immediate access to your funds.
                  </Text>
                  <Divider />
                  <HStack>
                    <ArrowForwardIcon color="brand.bitcash.500" boxSize={6} />
                    <Heading size="md">Comprehensive Dashboard</Heading>
                  </HStack>
                  <Text fontSize="sm">
                    Track sales, analyze payment trends, and manage your business with our intuitive merchant dashboard. Export reports for easy accounting.
                  </Text>
                </VStack>
              </SimpleGrid>

              <Box
                p={6}
                bg={useColorModeValue('green.50', 'green.900')}
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="brand.bitcash.500"
              >
                <Heading size="md" mb={3} color="brand.bitcash.500">
                  {t('merchants.benefits.whyChoose.heading', 'Why Businesses Choose BitCash')}
                </Heading>
                <List spacing={3}>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="brand.bitcash.500" />
                    {t('merchants.benefits.whyChoose.reason1', 'Low 1.5% transaction fee with no hidden costs')}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="brand.bitcash.500" />
                    {t('merchants.benefits.whyChoose.reason2', 'Instant access to your funds, no settlement delays')}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="brand.bitcash.500" />
                    {t('merchants.benefits.whyChoose.reason3', 'Multiple withdrawal options for maximum flexibility')}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="brand.bitcash.500" />
                    {t('merchants.benefits.whyChoose.reason4', 'Secure transactions with advanced fraud protection')}
                  </ListItem>
                </List>
              </Box>
            </Box>
          </SlideFade>

          {/* MERCHANT TOOLS */}
          <SlideFade in offsetY="30px">
            <Box mt={sectionPadding} p={{ base: 6, md: 10 }} bg={cardBg} borderRadius="xl" boxShadow="xl">
              <Heading fontSize={{ base: '2xl', md: '3xl' }} mb={{ base: 4, md: 8 }} color={accentColor}>
                Powerful Tools for Every Merchant
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg' }} mb={8}>
                Our merchant platform gives you everything you need to manage payments, track sales, and grow your business—all from one intuitive dashboard.
              </Text>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={8}>
                <Box
                  p={6}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  borderRadius="lg"
                  borderTop="4px solid"
                  borderColor="brand.bitcash.500"
                  transition="all 0.3s"
                  _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
                >
                  <VStack spacing={4} align="start">
                    <Heading size="md" color="brand.bitcash.500">
                      Payment Generation
                    </Heading>
                    <Text fontSize="sm">
                      Create payment links, QR codes, and invoices in seconds. Customize payment details, add descriptions, and set expiration dates.
                    </Text>
                    <Badge colorScheme="green">For All Merchants</Badge>
                  </VStack>
                </Box>

                <Box
                  p={6}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  borderRadius="lg"
                  borderTop="4px solid"
                  borderColor="brand.bitcash.500"
                  transition="all 0.3s"
                  _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
                >
                  <VStack spacing={4} align="start">
                    <Heading size="md" color="brand.bitcash.500">
                      Sales Analytics
                    </Heading>
                    <Text fontSize="sm">
                      Track performance with real-time analytics. Monitor sales trends, customer behavior, and payment methods to optimize your business.
                    </Text>
                    <Badge colorScheme="green">Visual Reports</Badge>
                  </VStack>
                </Box>

                <Box
                  p={6}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  borderRadius="lg"
                  borderTop="4px solid"
                  borderColor="brand.bitcash.500"
                  transition="all 0.3s"
                  _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
                >
                  <VStack spacing={4} align="start">
                    <Heading size="md" color="brand.bitcash.500">
                      Withdrawal Management
                    </Heading>
                    <Text fontSize="sm">
                      Access your funds your way. Schedule automatic withdrawals to your bank or request cash collection at your convenience.
                    </Text>
                    <Badge colorScheme="green">Multiple Options</Badge>
                  </VStack>
                </Box>
              </SimpleGrid>

              <Box
                p={6}
                bg={useColorModeValue('green.50', 'green.900')}
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="brand.bitcash.500"
              >
                <Heading size="md" mb={3} color="brand.bitcash.500">
                  Integration Options
                </Heading>
                <Text mb={4}>
                  Seamlessly integrate BitCash into your existing business systems:
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <HStack p={3} bg={cardBg} borderRadius="md">
                    <CheckCircleIcon color="brand.bitcash.500" />
                    <Text>Developer API for custom integrations</Text>
                  </HStack>
                  <HStack p={3} bg={cardBg} borderRadius="md">
                    <CheckCircleIcon color="brand.bitcash.500" />
                    <Text>E-commerce plugins (Shopify, WooCommerce)</Text>
                  </HStack>
                  <HStack p={3} bg={cardBg} borderRadius="md">
                    <CheckCircleIcon color="brand.bitcash.500" />
                    <Text>POS system compatibility</Text>
                  </HStack>
                  <HStack p={3} bg={cardBg} borderRadius="md">
                    <CheckCircleIcon color="brand.bitcash.500" />
                    <Text>Mobile SDKs for app integration</Text>
                  </HStack>
                </SimpleGrid>
              </Box>
            </Box>
          </SlideFade>

          {/* FAQ SECTION */}
          <SlideFade in offsetY="30px">
            <Box mt={sectionPadding} position="relative" zIndex={1} mb={{ base: 8, md: 16 }}>
              <Heading
                fontSize={{ base: '2xl', md: '3xl' }}
                mb={{ base: 6, md: 10 }}
                textAlign="center"
                color={accentColor}
              >
                {t('merchants.faq.heading', 'Frequently Asked Questions')}
              </Heading>

              <Accordion allowToggle>
                {getFAQData(t).map((faq, idx) => (
                  <AccordionItem
                    key={idx}
                    mb={4}
                    border="1px solid"
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    borderRadius="md"
                    overflow="hidden"
                  >
                    {({ isExpanded }) => (
                      <>
                        <h2>
                          <AccordionButton p={5} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                            <Box
                              flex="1"
                              textAlign="left"
                              fontWeight="medium"
                              fontSize={{ base: 'md', md: 'lg' }}
                            >
                              <HStack>
                                {/* Animate the arrow icon rotation */}
                                <motion.div
                                  animate={{ rotate: isExpanded ? 90 : 0 }}
                                  transition={{ duration: 0.2 }}
                                  style={{ marginRight: '8px' }}
                                >
                                </motion.div>
                                <Text>{faq.question}</Text>
                              </HStack>
                            </Box>
                            {/* We could also hide AccordionIcon, since we have a custom icon */}
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4} px={5} bg={useColorModeValue('gray.50', 'gray.700')}>
                          <Text>{faq.answer}</Text>
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                ))}
              </Accordion>
            </Box>
          </SlideFade>

          {/* MERCHANT SUCCESS SECTION */}
          <SlideFade in offsetY="30px">
            <Box mt={sectionPadding} p={{ base: 6, md: 10 }} bg={cardBg} borderRadius="xl" boxShadow="xl">
              <Heading fontSize={{ base: '2xl', md: '3xl' }} mb={{ base: 4, md: 8 }} color={accentColor} textAlign="center">
                Join Our Growing Merchant Network
              </Heading>
              
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={8}>
                <Box
                  p={6}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  borderRadius="lg"
                  boxShadow="md"
                >
                  <VStack spacing={4}>
                    <Text fontSize="5xl" fontWeight="bold" color="brand.bitcash.500">5,000+</Text>
                    <Text fontWeight="medium">Active Merchants</Text>
                  </VStack>
                </Box>
                
                <Box
                  p={6}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  borderRadius="lg"
                  boxShadow="md"
                >
                  <VStack spacing={4}>
                    <Text fontSize="5xl" fontWeight="bold" color="brand.bitcash.500">$25M+</Text>
                    <Text fontWeight="medium">Monthly Transaction Volume</Text>
                  </VStack>
                </Box>
                
                <Box
                  p={6}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  borderRadius="lg"
                  boxShadow="md"
                >
                  <VStack spacing={4}>
                    <Text fontSize="5xl" fontWeight="bold" color="brand.bitcash.500">98%</Text>
                    <Text fontWeight="medium">Merchant Satisfaction</Text>
                  </VStack>
                </Box>
              </SimpleGrid>
              
              <Text fontSize={{ base: 'md', md: 'lg' }} textAlign="center" mb={8}>
                From small shops to large enterprises, businesses of all sizes trust BitCash for reliable payment processing.
              </Text>
            </Box>
          </SlideFade>

          {/* CTA Section */}
          <SlideFade in offsetY="30px">
            <Box
              mt={{ base: 12, md: 24 }}
              mb={{ base: 8, md: 16 }}
              p={{ base: 6, md: 12 }}
              borderRadius={{ base: 'xl', md: '2xl' }}
              bg="brand.bitcash.600"
              color="white"
              textAlign="center"
            >
              <VStack spacing={{ base: 4, md: 6 }}>
                <Heading size={{ base: 'lg', md: 'xl' }}>
                  {t('merchants.cta.heading', 'Ready to Transform Your Business?')}
                </Heading>
                <Text fontSize={{ base: 'md', md: 'lg' }} maxW="2xl">
                  {t('merchants.cta.subtext', 'Join thousands of successful merchants using BitCash to streamline payments, increase sales, and simplify financial management.')}
                </Text>
                <HStack spacing={4}>
                  <Button
                    rightIcon={<ArrowForwardIcon />}
                    size={buttonSize}
                    colorScheme="green"
                    onClick={() => router.push('/merchants/signup')}
                  >
                    {t('merchants.cta.signupButton', 'Become a Merchant')}
                  </Button>
                  <Button
                    size={buttonSize}
                    variant="outline"
                    color="white"
                    borderColor="white"
                    _hover={{ bg: 'whiteAlpha.200' }}
                    onClick={() => router.push('/merchants/contact')}
                  >
                    {t('merchants.cta.contactButton', 'Contact Sales')}
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </SlideFade>
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

export default MerchantsPage;