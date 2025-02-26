import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Flex,
  Icon,
  List,  // Make sure to import List
  ListItem,
  ListIcon,
  Divider,
  Badge,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Alert,
  AlertIcon,
  useBreakpointValue,
  Progress,
  Stack
} from '@chakra-ui/react';
import {
  FaChartLine,
  FaTrophy,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
  FaMoneyBillWave,
  FaInfoCircle,
  FaArrowRight,
  FaArrowLeft,
  FaChevronRight,
  FaBars
} from 'react-icons/fa';
import Layout from '@/components/Layout';

// Challenge data - in production you would fetch this from an API or CMS
const challengeData = {
  'standard-challenge': {
    title: 'Standard Challenge',
    amount: '$10,000',
    fee: '$99',
    duration: '30 days',
    profitTarget: '8%',
    maxLoss: '5%',
    color: 'brand.bitfund.400',
    description: 'Perfect for beginners and those looking to start their funded trading journey. The Standard Challenge provides an accessible entry point with reasonable profit targets.',
    benefits: [
      'Low barrier to entry',
      'Generous 30-day evaluation period',
      'Achievable 8% profit target',
      '80/20 profit split upon success',
      'Suitable for all trading styles'
    ],
    statsList: [
      { label: 'Daily Drawdown', value: '2%' },
      { label: 'Maximum Drawdown', value: '5%' },
      { label: 'Minimum Trading Days', value: '10 days' },
      { label: 'Positions Over Weekend', value: 'Not Allowed' },
      { label: 'Trading During News', value: 'Restricted' },
      { label: 'Maximum Leverage', value: '1:30' }
    ]
  },
  'professional-challenge': {
    title: 'Professional Challenge',
    amount: '$50,000',
    fee: '$249',
    duration: '60 days',
    profitTarget: '10%',
    maxLoss: '8%',
    color: 'brand.bitfund.500',
    description: 'Designed for intermediate traders who have demonstrated consistent profitability. The Professional Challenge provides a significant capital boost with reasonable targets.',
    benefits: [
      'Substantial $50,000 capital allocation',
      'Extended 60-day evaluation window',
      'Higher 10% profit target with reasonable risk parameters',
      '80/20 profit split upon success',
      'Access to premium trader support'
    ],
    statsList: [
      { label: 'Daily Drawdown', value: '3%' },
      { label: 'Maximum Drawdown', value: '8%' },
      { label: 'Minimum Trading Days', value: '15 days' },
      { label: 'Positions Over Weekend', value: 'Not Allowed' },
      { label: 'Trading During News', value: 'Restricted' },
      { label: 'Maximum Leverage', value: '1:30' }
    ]
  },
  'elite-challenge': {
    title: 'Elite Challenge',
    amount: '$100,000',
    fee: '$499',
    duration: '60 days',
    profitTarget: '12%',
    maxLoss: '10%',
    color: 'brand.bitfund.600',
    description: 'Created for experienced traders seeking significant capital. The Elite Challenge offers a substantial account size with balanced profit targets and risk parameters.',
    benefits: [
      'Major $100,000 capital allocation',
      'Comprehensive 60-day evaluation period',
      'Balanced 12% profit target with flexible risk parameters',
      '80/20 profit split upon success',
      'Priority support and advanced analytics'
    ],
    statsList: [
      { label: 'Daily Drawdown', value: '4%' },
      { label: 'Maximum Drawdown', value: '10%' },
      { label: 'Minimum Trading Days', value: '15 days' },
      { label: 'Positions Over Weekend', value: 'Not Allowed' },
      { label: 'Trading During News', value: 'Restricted' },
      { label: 'Maximum Leverage', value: '1:30' }
    ]
  },
  'institutional-challenge': {
    title: 'Institutional Challenge',
    amount: '$200,000',
    fee: '$999',
    duration: '90 days',
    profitTarget: '15%',
    maxLoss: '12%',
    color: 'brand.bitfund.700',
    description: 'The pinnacle offering for elite traders. The Institutional Challenge provides institutional-grade capital with extended evaluation periods for maximum flexibility.',
    benefits: [
      'Institutional-level $200,000 capital allocation',
      'Extended 90-day evaluation period',
      'Ambitious 15% profit target with professional risk parameters',
      '80/20 profit split upon success',
      'VIP support, custom analytics, and one-on-one mentoring'
    ],
    statsList: [
      { label: 'Daily Drawdown', value: '5%' },
      { label: 'Maximum Drawdown', value: '12%' },
      { label: 'Minimum Trading Days', value: '20 days' },
      { label: 'Positions Over Weekend', value: 'Not Allowed' },
      { label: 'Trading During News', value: 'Restricted' },
      { label: 'Maximum Leverage', value: '1:30' }
    ]
  }
};

const ChallengePage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { type } = router.query;
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Responsive adjustments
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const headingSize = useBreakpointValue({ 
    base: "xl", 
    md: "2xl", 
    lg: "3xl" 
  });
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Find the selected challenge
  useEffect(() => {
    if (type && challengeData[type]) {
      setChallenge(challengeData[type]);
    } else if (type) {
      // Handle invalid challenge type
      router.push('/challenge');
    }
    setLoading(false);
  }, [type, router]);

  // Handle Stripe checkout
  const handleCheckout = () => {
    // Redirect to signup page with challenge info
    router.push({
      pathname: '/signup/challenger',
      query: { challenge: type }
    });
  };
  
  if (loading) {
    return (
      <Layout>
        <Container maxW="6xl" py={8}>
          <Box textAlign="center" py={20}>
            <Progress size="xs" isIndeterminate colorScheme="blue" />
            <Text mt={4}>Loading challenge details...</Text>
          </Box>
        </Container>
      </Layout>
    );
  }
  
  if (!challenge) {
    return (
      <Layout>
        <Container maxW="6xl" py={8}>
          <Box textAlign="center" py={20}>
            <Heading>Challenge not found</Heading>
            <Text mt={4}>The challenge you're looking for doesn't exist.</Text>
            <Button 
              mt={8}
              colorScheme="blue"
              leftIcon={<FaArrowLeft />}
              onClick={() => router.push('/challenge')}
            >
              Back to Challenges
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{challenge.title} | BitFund</title>
      </Head>
      
      <Box 
        bg={useColorModeValue('gray.50', 'gray.900')}
        minH="100vh"
        py={12}
      >
        <Container maxW="6xl">
          {/* Navigation Link */}
          <Link href="/challenge" passHref>
            <Button
              as="a"
              variant="ghost"
              leftIcon={<FaArrowLeft />}
              mb={8}
              size="sm"
            >
              {t('backToChallenges', 'Back to Challenges')}
            </Button>
          </Link>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Challenge Header */}
            <motion.div variants={itemVariants}>
              <Flex 
                direction={{ base: 'column', md: 'row' }}
                align={{ base: 'center', md: 'flex-start' }}
                justify="space-between"
                mb={10}
              >
                <Box mb={{ base: 6, md: 0 }} textAlign={{ base: 'center', md: 'left' }}>
                  <Heading 
                    as="h1" 
                    size={headingSize}
                    bgGradient={`linear(to-r, ${challenge.color}, brand.bitfund.600)`}
                    bgClip="text"
                  >
                    {challenge.title}
                  </Heading>
                  <Text 
                    fontSize={{ base: "md", md: "lg", lg: "xl" }}
                    mt={3}
                    maxW="2xl"
                    opacity={0.8}
                  >
                    {challenge.description}
                  </Text>
                </Box>
                
                <Box 
                  bg={cardBg}
                  p={6}
                  borderRadius="xl"
                  shadow="md"
                  textAlign="center"
                  minW={{ base: 'full', sm: '280px' }}
                  maxW={{ base: 'full', md: '300px' }}
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Text fontSize="lg" fontWeight="medium" mb={1}>Account Size</Text>
                  <Heading 
                    size="2xl" 
                    color={challenge.color} 
                    mb={4}
                  >
                    {challenge.amount}
                  </Heading>
                  <Divider mb={4} />
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="medium">One-time Fee:</Text>
                    <Text>{challenge.fee}</Text>
                  </HStack>
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="medium">Duration:</Text>
                    <Text>{challenge.duration}</Text>
                  </HStack>
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="medium">Profit Target:</Text>
                    <Text>{challenge.profitTarget}</Text>
                  </HStack>
                  <HStack justify="space-between" mb={4}>
                    <Text fontWeight="medium">Maximum Loss:</Text>
                    <Text>{challenge.maxLoss}</Text>
                  </HStack>
                  <Button
                    colorScheme="blue"
                    size="lg"
                    width="full"
                    onClick={handleCheckout}
                    rightIcon={<FaArrowRight />}
                    mb={3}
                  >
                    Start Challenge
                  </Button>
                  <Text fontSize="sm" opacity={0.7}>
                    Islamic accounts available
                  </Text>
                </Box>
              </Flex>
            </motion.div>
            
            {/* Challenge Details */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={10}>
              <motion.div variants={itemVariants}>
                <Box
                  bg={cardBg}
                  p={6}
                  borderRadius="xl"
                  shadow="md"
                  borderWidth="1px"
                  borderColor={borderColor}
                  height="full"
                >
                  <Flex align="center" mb={6}>
                    <Icon as={FaTrophy} color={challenge.color} boxSize={6} mr={3} />
                    <Heading size="md">Challenge Benefits</Heading>
                  </Flex>
                  
                  {/* Fixed: Wrapped ListItem components in a List component */}
                  <List spacing={3}>
                    {challenge.benefits.map((benefit, index) => (
                      <ListItem key={index} display="flex" alignItems="center">
                        <ListIcon as={FaCheckCircle} color="green.500" />
                        <Text>{benefit}</Text>
                      </ListItem>
                    ))}
                  </List>
                  
                  <Alert status="info" mt={6} borderRadius="md">
                    <AlertIcon />
                    <Box fontSize="sm">
                      <Text fontWeight="medium">80/20 Profit Split</Text>
                      <Text>After successfully passing the challenge, you'll receive 80% of all trading profits.</Text>
                    </Box>
                  </Alert>
                </Box>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Box
                  bg={cardBg}
                  p={6}
                  borderRadius="xl"
                  shadow="md"
                  borderWidth="1px"
                  borderColor={borderColor}
                  height="full"
                >
                  <Flex align="center" mb={6}>
                    <Icon as={FaShieldAlt} color={challenge.color} boxSize={6} mr={3} />
                    <Heading size="md">Trading Rules and Parameters</Heading>
                  </Flex>
                  
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                    {challenge.statsList.map((stat, index) => (
                      <Stat key={index} bg={useColorModeValue('gray.50', 'gray.700')} p={3} borderRadius="md">
                        <StatLabel fontSize="xs">{stat.label}</StatLabel>
                        <StatNumber fontSize="lg">{stat.value}</StatNumber>
                      </Stat>
                    ))}
                  </SimpleGrid>
                  
                  <Text fontSize="sm" mt={6} opacity={0.8}>
                    All trading rules are designed to encourage responsible risk management while allowing flexibility to implement your trading strategy.
                  </Text>
                </Box>
              </motion.div>
            </SimpleGrid>
            
            {/* Challenge Process */}
            <motion.div variants={itemVariants}>
              <Box
                bg={cardBg}
                p={8}
                borderRadius="xl"
                shadow="md"
                borderWidth="1px"
                borderColor={borderColor}
                mb={10}
              >
                <Heading size="lg" mb={6} textAlign="center">
                  The Challenge Process
                </Heading>
                
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
                  {[
                    {
                      title: 'Registration',
                      icon: FaMoneyBillWave,
                      description: 'Pay the one-time fee and get immediate access to your evaluation account'
                    },
                    {
                      title: 'Challenge Phase',
                      icon: FaChartLine,
                      description: `Trade within the rules and hit the ${challenge.profitTarget} profit target within ${challenge.duration}`
                    },
                    {
                      title: 'Verification Phase',
                      icon: FaShieldAlt,
                      description: 'Complete a second, similar evaluation to prove consistency in your trading'
                    },
                    {
                      title: 'Funded Account',
                      icon: FaTrophy,
                      description: 'Receive your funded account with real capital and start earning 80% of the profits'
                    }
                  ].map((step, index) => (
                    <Box key={index} textAlign="center">
                      <Flex 
                        w={14} 
                        h={14} 
                        bg={challenge.color} 
                        color="white" 
                        borderRadius="full" 
                        align="center" 
                        justify="center"
                        mx="auto"
                        mb={4}
                      >
                        <Icon as={step.icon} boxSize={6} />
                      </Flex>
                      <Heading size="md" mb={2}>{step.title}</Heading>
                      <Text fontSize="sm">{step.description}</Text>
                      
                      {index < 3 && (
                        <Box display={{ base: 'none', md: 'block' }}>
                          <Icon as={FaChevronRight} position="absolute" right="-10px" top="50px" />
                        </Box>
                      )}
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            </motion.div>
            
            {/* Islamic Trading Accounts */}
            <motion.div variants={itemVariants}>
              <Box
                bg={cardBg}
                p={8}
                borderRadius="xl"
                shadow="md"
                borderWidth="1px"
                borderColor={borderColor}
                mb={10}
              >
                <Flex 
                  direction={{ base: 'column', md: 'row' }}
                  align={{ base: 'center', md: 'flex-start' }}
                >
                  <Box 
                    bg="green.50" 
                    p={5} 
                    borderRadius="xl" 
                    color="green.800" 
                    mr={{ base: 0, md: 8 }} 
                    mb={{ base: 6, md: 0 }}
                    minW="200px"
                    textAlign="center"
                  >
                    <Heading size="md" mb={2}>
                      Islamic Accounts Available
                    </Heading>
                    <Text>Sharia-Compliant</Text>
                    <Badge colorScheme="green" mt={2} py={1} px={2}>No Swap Fees</Badge>
                  </Box>
                  
                  <Box>
                    <Heading size="md" mb={4}>
                      Trading in Compliance with Islamic Finance Principles
                    </Heading>
                    <Text mb={4}>
                      BitFund offers fully Sharia-compliant trading accounts that adhere to Islamic finance principles.
                      Our Islamic accounts feature:
                    </Text>
                    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                      <List spacing={2}>
                        <ListItem display="flex">
                          <ListIcon as={FaCheckCircle} color="green.500" mt={1} />
                          <Text>No interest (riba) charges</Text>
                        </ListItem>
                        <ListItem display="flex">
                          <ListIcon as={FaCheckCircle} color="green.500" mt={1} />
                          <Text>No overnight swap fees</Text>
                        </ListItem>
                      </List>
                      <List spacing={2}>
                        <ListItem display="flex">
                          <ListIcon as={FaCheckCircle} color="green.500" mt={1} />
                          <Text>Immediate trade execution</Text>
                        </ListItem>
                        <ListItem display="flex">
                          <ListIcon as={FaCheckCircle} color="green.500" mt={1} />
                          <Text>Transparent fee structure</Text>
                        </ListItem>
                      </List>
                    </SimpleGrid>
                  </Box>
                </Flex>
              </Box>
            </motion.div>
            
            {/* CTA Section */}
            <motion.div variants={itemVariants}>
              <Box
                bg={challenge.color}
                p={{ base: 6, md: 10 }}
                borderRadius="xl"
                color="white"
                textAlign="center"
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top="-50px"
                  right="-50px"
                  width="200px"
                  height="200px"
                  borderRadius="full"
                  bg="whiteAlpha.100"
                />
                
                <Box
                  position="absolute"
                  bottom="-30px"
                  left="-30px"
                  width="150px"
                  height="150px"
                  borderRadius="full"
                  bg="whiteAlpha.100"
                />
                
                <VStack spacing={6} position="relative" zIndex={1}>
                  <Heading size={{ base: "lg", md: "xl" }}>
                    Ready to Start Your Trading Career?
                  </Heading>
                  <Text fontSize={{ base: "md", md: "lg" }} maxW="2xl">
                    Join thousands of traders who have successfully secured funding through BitFund challenges. 
                    Begin your journey to becoming a funded trader today.
                  </Text>
                  <Button
                    size="lg"
                    colorScheme="whiteAlpha"
                    rightIcon={<FaArrowRight />}
                    onClick={handleCheckout}
                    _hover={{
                      transform: 'translateY(-2px)',
                      shadow: 'lg'
                    }}
                    px={8}
                  >
                    Start {challenge.title} Now
                  </Button>
                </VStack>
              </Box>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    </Layout>
  );
};

export async function getStaticPaths() {
  const paths = Object.keys(challengeData).map(type => ({
    params: { type }
  }));
  
  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ locale, params }) {
  // Validate that the challenge exists
  const validChallenge = !!challengeData[params.type];
  
  if (!validChallenge) {
    return {
      notFound: true
    };
  }
  
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default ChallengePage;