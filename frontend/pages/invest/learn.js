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
} from '@chakra-ui/react';

// Chakra UI Icons
import {
  ArrowForwardIcon,
  ArrowDownIcon,
  InfoIcon,
  CheckCircleIcon,
  StarIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons';

// Framer Motion
import { motion, AnimatePresence } from 'framer-motion';

// Layout (assuming you have a default Layout component)
import Layout from '@/components/Layout';

const FAQ_DATA = [
  {
    question: 'What makes gold a good hedge?',
    answer:
      'Gold has historically maintained its value over time. During economic turbulence or market downturns, gold prices often rise, providing a safety net for investors looking to preserve capital and hedge against inflation.',
  },
  {
    question: 'How do ETFs and indices help diversify my portfolio?',
    answer:
      'ETFs and indices let you invest in many companies or assets at once. This spreads your risk across numerous holdings, reducing reliance on any single stock’s performance and offering stable, long-term growth potential.',
  },
  {
    question: 'Why invest in NYSE, LSE, or FTSE stocks?',
    answer:
      'Major global exchanges like the NYSE (US) and LSE/FTSE (UK) list well-established companies with global reach. Investing in these markets exposes you to mature economies, world-leading brands, and stable dividend payers.',
  },
  {
    question: 'Is investing risky?',
    answer:
      'Yes, all investments carry some risk, including the possibility of losing your principal. However, diversifying across multiple asset classes (gold, ETFs, stocks) and maintaining a long-term outlook can mitigate some of that risk.',
  },
  {
    question: 'What does BitStock offer?',
    answer:
      'BitStock is a user-friendly platform that helps you buy gold, invest in top ETFs, and trade stocks from major global exchanges. We provide transparent fees, real-time market data, and educational resources to guide your journey.',
  },
  {
    question: 'Are there any hidden fees?',
    answer:
      'No. Our fee structure is fully transparent. You’ll see any commissions or spreads before placing a trade. We don’t charge hidden administrative costs or sneaky markups.',
  },
  {
    question: 'How can I learn more about investing?',
    answer:
      'Beyond this page, our platform offers tutorials, webinars, and a knowledge base. From beginner-friendly guides on “How to buy gold” to advanced articles on portfolio rebalancing, we support your ongoing education.',
  },
  {
    question: 'What if I have more questions?',
    answer:
      'Feel free to contact our support team any time or explore our community forum where you can discuss strategies with other BitStock users.',
  },
];

function LearnPage() {
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
    'linear(to-b, blue.50, white)',
    'linear(to-b, gray.900, black)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const accentColor = useColorModeValue('brand.bitstock.400', 'brand.bitstock.700');
  const headingSize = useBreakpointValue({ base: '2xl', md: '3xl', lg: '4xl' });
  const sectionPadding = useBreakpointValue({ base: 8, md: 16 });
  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' });

  return (
    <Layout>
      <Box bg={bgGradient} overflow="hidden" textAlign={locale === 'ar' ? 'right' : 'left'}>
        <Container maxW="7xl" pt={{ base: 4, md: 4 }} px={{ base: 4, md: 2 }}>
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
                  bgGradient="linear(to-r, brand.bitstock.500, brand.bitstock.700)"
                  bgClip="text"
                  lineHeight="1.2"
                >
                  Expand Your Financial Horizons
                </Heading>
                <Text fontSize={{ base: 'lg', md: 'xl' }} opacity={0.8} maxW="3xl">
                  Discover how investing in gold, ETFs, and global stocks (NYSE, LSE, FTSE) can pave the way to financial freedom. Gain confidence, build wealth, and secure your future.
                </Text>
              </VStack>
            </Flex>
          </SlideFade>

          {/* WHY DIVERSIFY */}
          <SlideFade in offsetY="30px">
            <Box mt={sectionPadding} p={{ base: 6, md: 10 }} bg={cardBg} borderRadius="xl" boxShadow="xl">
              <Heading fontSize={{ base: '2xl', md: '3xl' }} mb={{ base: 4, md: 8 }} color={accentColor}>
                Why Diversify Your Investments?
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg' }} mb={6}>
                Diversification is key to managing risk. By holding various asset classes—gold for stability, ETFs for broad market exposure, and global stocks for growth—your portfolio can better withstand market swings.
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={6}>
                <VStack align="start" spacing={4}>
                  <HStack>
                    <ArrowForwardIcon color="brand.bitstock.500" boxSize={6} />
                    <Heading size="md">Gold & Precious Metals</Heading>
                  </HStack>
                  <Text fontSize="sm">
                    Gold is a time-tested store of value and a hedge against inflation. Adding gold or other precious metals can help reduce volatility.
                  </Text>
                  <Divider />
                  <HStack>
                    <ArrowForwardIcon color="brand.bitstock.500" boxSize={6} />
                    <Heading size="md">ETFs & Indices</Heading>
                  </HStack>
                  <Text fontSize="sm">
                    ETFs (like SPY) or indices (like FTSE 100) let you invest in many stocks at once, lowering the risk of single-company shocks.
                  </Text>
                </VStack>

                <VStack align="start" spacing={4}>
                  <HStack>
                    <ArrowForwardIcon color="brand.bitstock.500" boxSize={6} />
                    <Heading size="md">NYSE & LSE Stocks</Heading>
                  </HStack>
                  <Text fontSize="sm">
                    Leading companies from the New York and London Stock Exchanges can deliver robust returns and stable dividends.
                  </Text>
                  <Divider />
                  <HStack>
                    <ArrowForwardIcon color="brand.bitstock.500" boxSize={6} />
                    <Heading size="md">Long-Term Growth</Heading>
                  </HStack>
                  <Text fontSize="sm">
                    Combining multiple asset types helps smooth out returns and positions you for sustained wealth-building over time.
                  </Text>
                </VStack>
              </SimpleGrid>

              <Box
                p={6}
                bg={useColorModeValue('blue.50', 'blue.900')}
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="brand.bitstock.500"
              >
                <Heading size="md" mb={3} color="brand.bitstock.500">
                  Key Advantages of a Diversified Portfolio
                </Heading>
                <List spacing={3}>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="brand.bitstock.500" />
                    Lower overall volatility and risk
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="brand.bitstock.500" />
                    Potential for steady, compounding returns
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="brand.bitstock.500" />
                    Protection against single-market downturns
                  </ListItem>
                </List>
              </Box>
            </Box>
          </SlideFade>

          {/* LONG-TERM WEALTH */}
          <SlideFade in offsetY="30px">
            <Box mt={sectionPadding} p={{ base: 6, md: 10 }} bg={cardBg} borderRadius="xl" boxShadow="xl">
              <Heading fontSize={{ base: '2xl', md: '3xl' }} mb={{ base: 4, md: 8 }} color={accentColor}>
                Aim for Long-Term Wealth & Financial Freedom
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg' }} mb={8}>
                True financial freedom often stems from a disciplined, long-term approach. By consistently investing in gold, ETFs, and well-chosen international stocks (NYSE, LSE, FTSE), you build a foundation for lasting growth.
              </Text>

              <Box
                p={6}
                bg={useColorModeValue('blue.50', 'blue.900')}
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="brand.bitstock.500"
              >
                <Heading size="md" mb={3} color="brand.bitstock.500">
                  Simple Strategy Tips
                </Heading>
                <List spacing={3}>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="brand.bitstock.500" />
                    Define clear goals (e.g., retirement, generational wealth)
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="brand.bitstock.500" />
                    Rebalance periodically—don’t let one asset overshadow the rest
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="brand.bitstock.500" />
                    Keep an eye on major economic trends but avoid panic-selling
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="brand.bitstock.500" />
                    Utilize professional research or consult advisors when needed
                  </ListItem>
                </List>
              </Box>
            </Box>
          </SlideFade>

          {/* FAQ SECTION */}
          <SlideFade in offsetY="30px">
            <Box mt={sectionPadding}  position="relative" zIndex={1} mb={{ base: 8, md: 16 }}>
              <Heading
                fontSize={{ base: '2xl', md: '3xl' }}
                mb={{ base: 6, md: 10 }}
                textAlign="center"
                color={accentColor}
              >
                Frequently Asked Questions
              </Heading>

              <Accordion allowToggle>
                {FAQ_DATA.map((faq, idx) => (
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

          {/* CTA Section */}
          <SlideFade in offsetY="30px">
            <Box
              mt={{ base: 12, md: 24 }}
              mb={{ base: 8, md: 16 }}
              p={{ base: 6, md: 12 }}
              borderRadius={{ base: 'xl', md: '2xl' }}
              bg="brand.bitstock.600"
              color="white"
              textAlign="center"
            >
              <VStack spacing={{ base: 4, md: 6 }}>
                <Heading size={{ base: 'lg', md: 'xl' }}>
                  Ready to Begin Your Investment Journey?
                </Heading>
                <Text fontSize={{ base: 'md', md: 'lg' }} maxW="2xl">
                  Grow your wealth by diversifying with gold, ETFs, and international stocks. Our platform supports you every step of the way.
                </Text>
                <HStack spacing={4}>
                  <Button
                    rightIcon={<ArrowForwardIcon />}
                    size={buttonSize}
                    variant="bitstock-solid"
                    onClick={() => router.push('/signup')}
                  >
                    Open an Account
                  </Button>
                  <Button
                    size={buttonSize}
                    variant="bitstock-outline"
                    colorScheme="brand.bitstock"
                    onClick={() => router.push('/contact')}
                  >
                    Contact Us
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

export default LearnPage;
