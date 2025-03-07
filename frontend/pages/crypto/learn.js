import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Divider,
  List,
  ListItem,
  ListIcon,
  useBreakpointValue
} from '@chakra-ui/react';
import { 
  FaChartLine,
  FaTrophy,
  FaBalanceScale,
  FaUsers,
  FaMoneyBillWave,
  FaCheck,
  FaMosque,
  FaHandshake,
  FaStar,
  FaArrowRight,
  FaQuestionCircle,
  FaGraduationCap,
  FaShieldAlt
} from 'react-icons/fa';
import Layout from '@/components/Layout';

const LearnPage = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const containerRef = useRef(null);
  const { locale } = router;
  
  // Set the HTML dir attribute based on language
  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);
  
  const bgGradient = useColorModeValue(
    'linear(to-b, blue.50, white)',
    'linear(to-b, gray.900, black)'
  );
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const glassCardBg = useColorModeValue('whiteAlpha.900', 'whiteAlpha.100');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.7]);
  
  // Responsive adjustments
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });
  const buttonHeight = useBreakpointValue({ base: 12, md: 14 });
  const headingSize = useBreakpointValue({ 
    base: "xl", 
    sm: "2xl",
    md: "3xl", 
    lg: "4xl"
  });
  const sectionPadding = useBreakpointValue({ base: 8, md: 16 });
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const featureColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 });
  const padding = useBreakpointValue({ base: 4, md: 8 });
  const spacing = useBreakpointValue({ base: 4, md: 8 });

  const faqItems = [
    {
      question: "What is a proprietary trading firm?",
      answer: "A proprietary trading firm (prop firm) is a company that uses its own capital to trade financial markets. Unlike traditional brokerages that facilitate client trading, prop firms deploy their own funds and employ or partner with skilled traders to generate profits."
    },
    {
      question: "How do prop firm challenges work?",
      answer: "Prop firm challenges are evaluation processes designed to identify skilled traders. Participants trade a simulated account with virtual capital under specific rules and profit targets. Those who successfully meet the criteria qualify to trade live accounts with the firm's real capital, typically sharing profits with the firm."
    },
    {
      question: "What makes BitFund's Islamic accounts different?",
      answer: "BitFund's Islamic accounts are fully Shariah-compliant, meaning they operate without interest (riba), excessive uncertainty (gharar), or gambling elements (maysir). Our accounts have no overnight swap fees or interest charges, ensure immediate settlement of trades, and avoid prohibited assets according to Islamic finance principles."
    },
    {
      question: "What trading instruments can I trade with BitFund?",
      answer: "BitFund offers trading in Shariah-compliant instruments including select forex pairs, commodities like gold and silver, ethical stocks (avoiding industries like alcohol, gambling, and conventional banking), and Sukuk (Islamic bonds). All instruments are carefully vetted for compliance with Islamic finance principles."
    },
    {
      question: "How does BitFund ensure Shariah compliance?",
      answer: "BitFund maintains a Shariah Supervisory Board of qualified scholars who review all trading conditions, accounts, and practices. We undergo regular audits, maintain transparent fee structures without hidden costs, and ensure all operations follow Islamic financial principles including fair risk-sharing and ethical investment."
    },
    {
      question: "What are the profit-sharing arrangements?",
      answer: "After successfully passing the challenge, traders receive 80% of the profits generated from trading BitFund's capital, while BitFund retains 20%. This arrangement follows the Islamic principle of Mudarabah, where one party provides capital and the other provides expertise, with profits shared according to a pre-agreed ratio."
    }
  ];

  const isalmicFeatures = [
    {
      icon: FaMosque,
      title: "Shariah-Compliant Trading",
      description: "All BitFund accounts are structured to be fully compliant with Islamic finance principles, avoiding riba (interest), gharar (excessive uncertainty), and maysir (gambling elements)."
    },
    {
      icon: FaMoneyBillWave,
      title: "No Swap or Interest Charges",
      description: "Our Islamic accounts completely eliminate overnight swap charges and interest, allowing Muslim traders to hold positions without incurring riba-based fees."
    },
    {
      icon: FaHandshake,
      title: "Transparent Profit-Sharing",
      description: "Following the Mudarabah principle, BitFund offers an 80/20 profit-sharing arrangement where traders receive 80% of profits while BitFund provides the capital."
    },
    {
      icon: FaShieldAlt,
      title: "Ethical Instrument Selection",
      description: "Trade with confidence knowing all available instruments have been vetted for Shariah compliance by qualified scholars on our Shariah Supervisory Board."
    },
    {
      icon: FaBalanceScale,
      title: "Fair Evaluation Process",
      description: "Our challenge evaluation process maintains achievable targets while still identifying skilled traders, creating a balanced opportunity for all participants."
    },
    {
      icon: FaUsers,
      title: "Muslim Trader Community",
      description: "Join a growing community of Muslim traders who share strategies and insights while maintaining adherence to Islamic financial principles."
    }
  ];

  const challengeTypes = [
    {
      title: 'Standard Challenge',
      amount: '$10,000',
      fee: '$99',
      duration: '30 days',
      profitTarget: '8%',
      maxLoss: '5%'
    },
    {
      title: 'Professional Challenge',
      amount: '$50,000',
      fee: '$249',
      duration: '60 days',
      profitTarget: '10%',
      maxLoss: '8%'
    },
    {
      title: 'Elite Challenge',
      amount: '$100,000',
      fee: '$499',
      duration: '60 days',
      profitTarget: '12%',
      maxLoss: '10%'
    },
    {
      title: 'Institutional Challenge',
      amount: '$200,000',
      fee: '$999',
      duration: '90 days',
      profitTarget: '15%',
      maxLoss: '12%'
    }
  ];

  return (
    <>
    <Layout>
    <Box 
      ref={containerRef} 
      bg={bgGradient} 
      overflow="hidden" 
      minH="100vh" 
      textAlign={locale === 'ar' ? 'right' : 'left'}
    >
      <Container maxW="7xl" pt={{ base: 4, md: 8 }} px={{ base: 4, md: 8 }}>
        {/* Hero Section */}
        <motion.div style={{ opacity: heroOpacity }}>
          <Flex
            direction="column"
            align="center"
            textAlign="center"
            position="relative"
            pt={{ base: 12, md: 20 }}
            pb={{ base: 8, md: 16 }}
          >
            <VStack spacing={{ base: 4, md: 8 }} maxW="4xl">
              <Heading
                fontSize={headingSize}
                bgGradient="linear(to-r, brand.crypto.500, brand.crypto.700)"
                bgClip="text"
                lineHeight="1.2"
                textAlign="center"
                mb={4}
                px={{ base: 2, md: 0 }}
              >
                Understanding Proprietary Trading & BitFund's Islamic Advantage
              </Heading>
              <Text fontSize={{ base: "lg", md: "xl" }} opacity={0.8} maxW="3xl" px={{ base: 2, md: 0 }}>
                Discover how proprietary trading firms work, how you can access significant capital by proving your skills, and why BitFund's Shariah-compliant approach offers unique advantages for Muslim traders.
              </Text>
            </VStack>
          </Flex>
        </motion.div>

        {/* What is Prop Trading Section */}
        <Box 
          mt={sectionPadding} 
          p={{ base: 6, md: 10 }}
          bg={cardBg}
          borderRadius="xl"
          boxShadow="xl"
        >
          <Heading
            fontSize={{ base: "2xl", md: "3xl" }}
            mb={{ base: 4, md: 8 }}
            color="brand.crypto.600"
          >
            What is Proprietary Trading?
          </Heading>
          
          <Text fontSize={{ base: "md", md: "lg" }} mb={6}>
            Proprietary trading (or "prop trading") refers to a financial firm trading financial instruments with its own money rather than client funds. In traditional prop trading, financial institutions like investment banks or specialized trading firms use their own capital to take positions in various markets, aiming to profit directly rather than earning commissions from client trades.
          </Text>
          
          <Text fontSize={{ base: "md", md: "lg" }} mb={6}>
            Modern prop trading firms have evolved to create a unique model that identifies and funds skilled external traders. These firms evaluate traders through structured challenges and then allocate capital to those who demonstrate consistent profitability while managing risk effectively.
          </Text>
          
          <Box 
            p={6} 
            bg={useColorModeValue("blue.50", "blue.900")} 
            borderRadius="md"
            borderLeft="4px solid" 
            borderColor="brand.crypto.500"
            my={8}
          >
            <Heading size="md" mb={3} color="brand.crypto.500">How Proprietary Trading Firms Work</Heading>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={FaCheck} color="brand.crypto.500" />
                <Text as="span" fontWeight="medium">Capital Provision:</Text> The firm provides trading capital, removing the trader's personal financial risk
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheck} color="brand.crypto.500" />
                <Text as="span" fontWeight="medium">Talent Evaluation:</Text> Firms assess traders through challenges with specific profit targets and risk parameters
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheck} color="brand.crypto.500" />
                <Text as="span" fontWeight="medium">Profit Sharing:</Text> Successful traders receive a significant percentage of the profits they generate
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheck} color="brand.crypto.500" />
                <Text as="span" fontWeight="medium">Risk Management:</Text> Strict rules ensure responsible trading and protect the firm's capital
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheck} color="brand.crypto.500" />
                <Text as="span" fontWeight="medium">Scaling Opportunity:</Text> Consistently profitable traders often gain access to larger capital allocations
              </ListItem>
            </List>
          </Box>
        </Box>

        {/* The Challenge System */}
        <Box 
          mt={sectionPadding} 
          p={{ base: 6, md: 10 }}
          bg={cardBg}
          borderRadius="xl"
          boxShadow="xl"
        >
          <Heading
            fontSize={{ base: "2xl", md: "3xl" }}
            mb={{ base: 4, md: 8 }}
            color="brand.crypto.600"
          >
            The Challenge Evaluation System
          </Heading>
          
          <Text fontSize={{ base: "md", md: "lg" }} mb={6}>
            Prop firm challenges are structured evaluations designed to identify traders who can generate consistent profits while managing risk effectively. At BitFund, our challenge system provides a fair and transparent path to becoming a funded trader.
          </Text>
          
          <SimpleGrid columns={featureColumns} spacing={8} mb={10}>
            {challengeTypes.map((challenge, index) => (
              <Box
                key={index}
                p={{ base: 4, md: 6 }}
                bg={useColorModeValue("gray.50", "gray.700")}
                borderRadius="lg"
                borderWidth="1px"
                borderColor="brand.crypto.400"
                textAlign="center"
              >
                <VStack spacing={4}>
                  <Heading size="md" color="brand.crypto.500">
                    {challenge.title}
                  </Heading>
                  <Text fontSize="2xl" fontWeight="bold" color="brand.crypto.600">
                    {challenge.amount}
                  </Text>
                  <Divider />
                  <VStack spacing={2} align="start" w="full">
                    <Flex justify="space-between" w="full">
                      <Text fontWeight="medium">One-time Fee:</Text>
                      <Text>{challenge.fee}</Text>
                    </Flex>
                    <Flex justify="space-between" w="full">
                      <Text fontWeight="medium">Duration:</Text>
                      <Text>{challenge.duration}</Text>
                    </Flex>
                    <Flex justify="space-between" w="full">
                      <Text fontWeight="medium">Profit Target:</Text>
                      <Text>{challenge.profitTarget}</Text>
                    </Flex>
                    <Flex justify="space-between" w="full">
                      <Text fontWeight="medium">Maximum Loss:</Text>
                      <Text>{challenge.maxLoss}</Text>
                    </Flex>
                  </VStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
          
          <Box 
            p={6} 
            bg={useColorModeValue("green.50", "green.900")} 
            borderRadius="md"
            borderLeft="4px solid" 
            borderColor="green.500"
            mb={6}
          >
            <Heading size="md" mb={3} color="green.600">The Challenge Process</Heading>
            <VStack align="start" spacing={4}>
              <HStack spacing={4} align="start">
                <Flex
                  w={10}
                  h={10}
                  align="center"
                  justify="center"
                  borderRadius="full"
                  bg="green.500"
                  color="white"
                  fontWeight="bold"
                >
                  1
                </Flex>
                <Box>
                  <Text fontWeight="bold">Registration</Text>
                  <Text>Choose your preferred challenge type and complete registration with a one-time fee</Text>
                </Box>
              </HStack>
              
              <HStack spacing={4} align="start">
                <Flex
                  w={10}
                  h={10}
                  align="center"
                  justify="center"
                  borderRadius="full"
                  bg="green.500"
                  color="white"
                  fontWeight="bold"
                >
                  2
                </Flex>
                <Box>
                  <Text fontWeight="bold">Challenge Phase</Text>
                  <Text>Trade a simulated account aiming to reach the profit target while respecting the trading rules</Text>
                </Box>
              </HStack>
              
              <HStack spacing={4} align="start">
                <Flex
                  w={10}
                  h={10}
                  align="center"
                  justify="center"
                  borderRadius="full"
                  bg="green.500"
                  color="white"
                  fontWeight="bold"
                >
                  3
                </Flex>
                <Box>
                  <Text fontWeight="bold">Verification Phase</Text>
                  <Text>Demonstrate consistency by meeting a similar but slightly lower profit target in a second evaluation</Text>
                </Box>
              </HStack>
              
              <HStack spacing={4} align="start">
                <Flex
                  w={10}
                  h={10}
                  align="center"
                  justify="center"
                  borderRadius="full"
                  bg="green.500"
                  color="white"
                  fontWeight="bold"
                >
                  4
                </Flex>
                <Box>
                  <Text fontWeight="bold">Funded Account</Text>
                  <Text>Successful traders receive access to a funded account with real capital and an 80/20 profit-sharing arrangement</Text>
                </Box>
              </HStack>
            </VStack>
          </Box>
          
          <Text fontSize={{ base: "md", md: "lg" }}>
            BitFund's challenge system is designed to be achievable for skilled traders while maintaining the high standards necessary to identify those who can consistently generate profits. Our evaluation targets are carefully calibrated based on market conditions and realistic trading expectations.
          </Text>
        </Box>

        {/* BitFund's Islamic Advantage */}
        <Box 
          mt={sectionPadding} 
          p={{ base: 6, md: 10 }}
          bg={cardBg}
          borderRadius="xl"
          boxShadow="xl"
        >
          <Heading
            fontSize={{ base: "2xl", md: "3xl" }}
            mb={{ base: 4, md: 8 }}
            color="brand.crypto.600"
          >
            The BitFund Islamic Advantage
          </Heading>
          
          <Text fontSize={{ base: "md", md: "lg" }} mb={8}>
            BitFund stands apart from other proprietary trading firms by offering fully Shariah-compliant trading accounts and conditions. Our commitment to Islamic finance principles ensures that Muslim traders can pursue their trading careers without compromising their religious values.
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={10}>
            {isalmicFeatures.map((feature, index) => (
              <HStack 
                key={index} 
                align="start" 
                spacing={4}
                p={5}
                borderRadius="md"
                bg={useColorModeValue("gray.50", "gray.700")}
              >
                <Icon as={feature.icon} boxSize={8} color="brand.crypto.500" />
                <Box>
                  <Heading size="sm" mb={2}>{feature.title}</Heading>
                  <Text fontSize="sm">{feature.description}</Text>
                </Box>
              </HStack>
            ))}
          </SimpleGrid>
          
          <Box 
            p={6} 
            bg={useColorModeValue("purple.50", "purple.900")} 
            borderRadius="md"
            borderLeft="4px solid" 
            borderColor="purple.500"
            mb={8}
          >
            <Heading size="md" mb={3} color="purple.600">Islamic Finance Principles in Trading</Heading>
            <VStack align="start" spacing={4}>
              <Box>
                <Text fontWeight="bold">Prohibition of Riba (Interest)</Text>
                <Text>BitFund eliminates all interest-based transactions, including swap fees for overnight positions, ensuring trades are free from riba.</Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">Avoidance of Gharar (Excessive Uncertainty)</Text>
                <Text>Our trading rules promote clear, transparent conditions and avoid contracts with excessive uncertainty or ambiguity.</Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">Prohibition of Maysir (Gambling)</Text>
                <Text>BitFund emphasizes skill-based trading with proper risk management rather than speculative gambling.</Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">Ethical Asset Selection</Text>
                <Text>We provide access only to instruments that comply with Islamic ethical standards, avoiding prohibited industries.</Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">Fair Profit-Sharing (Mudarabah)</Text>
                <Text>Our 80/20 profit-sharing arrangement follows the Islamic principle of Mudarabah, where one party provides capital and the other provides expertise.</Text>
              </Box>
            </VStack>
          </Box>
          
          <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium" textAlign="center" mb={8}>
            BitFund's services are overseen by a qualified Shariah Supervisory Board that ensures all aspects of our operations remain compliant with Islamic financial principles.
          </Text>
        </Box>

        {/* FAQ Section */}
        <Box mt={sectionPadding} mb={{ base: 8, md: 16 }} zIndex={1}>
          <Heading
            fontSize={{ base: "2xl", md: "3xl" }}
            mb={{ base: 6, md: 10 }}
            textAlign="center"
            color="brand.crypto.600"
          >
            Frequently Asked Questions
          </Heading>
          
          <Accordion allowToggle>
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index}
                mb={4}
                border="1px solid"
                borderColor={useColorModeValue("gray.200", "gray.700")}
                borderRadius="md"
                overflow="hidden"
              >
                <h2>
                  <AccordionButton 
                    p={5}
                    _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
                  >
                    <Box flex="1" textAlign="left" fontWeight="medium" fontSize={{ base: "md", md: "lg" }}>
                      <HStack>
                        <Icon as={FaQuestionCircle} color="brand.crypto.500" mr={2} />
                        <Text>{item.question}</Text>
                      </HStack>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} px={5} bg={useColorModeValue("gray.50", "gray.700")}>
                  <Text>{item.answer}</Text>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>

        {/* Call to Action */}
        <Box
          mt={{ base: 12, md: 24 }}
          mb={{ base: 8, md: 16 }}
          p={{ base: 6, md: 12 }}
          borderRadius={{ base: "xl", md: "2xl" }}
          bg="brand.crypto.600"
          color="white"
          textAlign="center"
        >
          <VStack spacing={{ base: 4, md: 6 }}>
            <Heading size={{ base: "lg", md: "xl" }}>
              Ready to Start Your Shariah-Compliant Trading Journey?
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }} maxW="2xl">
              Join BitFund today and experience the perfect balance of Islamic finance principles and professional trading opportunities. Our challenges provide a clear path to becoming a funded trader while respecting your religious values.
            </Text>
            <HStack spacing={4}>
              <Button
                leftIcon={<FaTrophy />}
                size={buttonSize}
                color="brand.crypto.400"
                px={{ base: 4, md: 8 }}
                h={buttonHeight}
                fontSize={{ base: "md", md: "lg" }}
                onClick={() => router.push('/signup')}
              >
                Start Challenge
              </Button>
              <Button
                leftIcon={<FaGraduationCap />}
                size={buttonSize}
                variant="bitfund-solid"
                color="brand.crypto.400"
                px={{ base: 4, md: 8 }}
                h={buttonHeight}
                fontSize={{ base: "md", md: "lg" }}
                onClick={() => router.push('/contact')}
              >
                Contact Support
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Container>
    </Box>
    </Layout>
    </>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default LearnPage;