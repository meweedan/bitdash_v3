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
  Image,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  Divider,
  SlideFade,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from '@chakra-ui/react';

// Chakra UI Icons
import {
  CheckCircleIcon,
  ArrowForwardIcon,
  ArrowBackIcon,
  StarIcon,
  InfoIcon,
  PhoneIcon,
} from '@chakra-ui/icons';

// Framer Motion
import { motion } from 'framer-motion';

// Layout component
import Layout from '@/components/Layout';

const MotionBox = motion(Box);

function LearnMore() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  // Colors & UI
  const cardBg = useColorModeValue('white', 'gray.800');
  const accentColor = useColorModeValue('brand.cash.600', 'brand.cash.400');
  const accentBg = useColorModeValue('brand.bitcash.50', 'brand.bitcash.900');
  const softShadow = useColorModeValue('lg', 'dark-lg');

  // Agent journey steps
  const agentJourney = [
    {
      title: t('learnMore.journey.step1.title', 'Application'),
      description: t('learnMore.journey.step1.description', 'Submit your application with required documents and business information.'),
    },
    {
      title: t('learnMore.journey.step2.title', 'Verification'),
      description: t('learnMore.journey.step2.description', 'Our team reviews your application and verifies your identity and business details.'),
    },
    {
      title: t('learnMore.journey.step3.title', 'Training'),
      description: t('learnMore.journey.step3.description', 'Complete comprehensive training on platform usage, security protocols, and compliance.'),
    },
    {
      title: t('learnMore.journey.step4.title', 'Activation'),
      description: t('learnMore.journey.step4.description', 'Receive your agent credentials and set up your initial operating float.'),
    },
    {
      title: t('learnMore.journey.step5.title', 'Launch'),
      description: t('learnMore.journey.step5.description', 'Begin providing financial services and earning commissions in your community.'),
    },
    {
      title: t('learnMore.journey.step6.title', 'Growth'),
      description: t('learnMore.journey.step6.description', 'Build your customer base and potentially upgrade to higher agent tiers over time.'),
    },
  ];

  // Success stories
  const successStories = [
    {
      name: t('learnMore.success.story1.name', 'Sarah - Pharmacy Owner'),
      location: t('learnMore.success.story1.location', 'Jakarta, Indonesia'),
      content: t('learnMore.success.story1.content', 'I added BitCash services to my pharmacy business and now earn an additional $850 per month in commissions. More importantly, the increased foot traffic has boosted my retail sales by 22%.'),
      image: '/images/success-story-1.jpg',
    },
    {
      name: t('learnMore.success.story2.name', 'Michael - Individual Agent'),
      location: t('learnMore.success.story2.location', 'Nairobi, Kenya'),
      content: t('learnMore.success.story2.content', 'Starting as a BitCash agent was the perfect opportunity after university. I now process over 200 transactions weekly and have built a thriving business serving my local area.'),
      image: '/images/success-story-2.jpg',
    },
    {
      name: t('learnMore.success.story3.name', 'Elena - Convenience Store'),
      location: t('learnMore.success.story3.location', 'Mexico City, Mexico'),
      content: t('learnMore.success.story3.content', 'My small store now serves as an essential financial hub for the neighborhood. The BitCash agent program was easy to join, and the ongoing support has been excellent throughout my journey.'),
      image: '/images/success-story-3.jpg',
    },
  ];

  // FAQ items
  const faqItems = [
    {
      question: t('learnMore.faq.q1', 'How long does the application process take?'),
      answer: t('learnMore.faq.a1', 'The typical application process takes 5-10 business days from submission to approval, depending on document verification and background check completion.'),
    },
    {
      question: t('learnMore.faq.q2', 'What is the initial investment required?'),
      answer: t('learnMore.faq.a2', 'The only required investment is your operating float which starts at $500 for individual agents and $1,000 for business locations. There are no franchise fees, equipment costs, or monthly subscription charges.'),
    },
    {
      question: t('learnMore.faq.q3', 'Can I operate as a part-time agent?'),
      answer: t('learnMore.faq.a3', 'Yes, individual agents can operate on a part-time basis with flexible hours. Business locations should maintain consistent service hours that are clearly communicated to customers.'),
    },
    {
      question: t('learnMore.faq.q4', 'What ongoing support does BitCash provide?'),
      answer: t('learnMore.faq.a4', 'BitCash provides comprehensive support including dedicated agent managers, 24/7 technical assistance, marketing materials, training updates, and access to our agent community forum for best practices sharing.'),
    },
    {
      question: t('learnMore.faq.q5', 'How do I manage my operating float?'),
      answer: t('learnMore.faq.a5', 'Your float is managed through the BitCash agent portal where you can monitor balances, request top-ups, and set automated alerts. We also offer float advance options for qualified agents during high-volume periods.'),
    },
  ];

  return (
    <Layout>
      <Box 
        bgGradient={useColorModeValue(
          'linear(to-b, gray.50, white)',
          'linear(to-b, gray.900, gray.800)'
        )} 
        minH="100vh" 
        py={16}
      >
        <Container maxW="7xl">
          <SlideFade in offsetY="20px">
            <VStack spacing={4} textAlign="center" mb={10}>
              <Badge colorScheme="green" fontSize="md" p={2} borderRadius="md">
                {t('learnMore.badge', 'Agent Opportunity')}
              </Badge>
              <Heading 
                fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                color={accentColor}
              >
                {t('learnMore.heading', 'Learn More About Becoming a BitCash Agent')}
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg' }} maxW="800px">
                {t('learnMore.subheading', 'Discover the benefits, requirements, and journey to becoming a successful financial services provider in your community')}
              </Text>
            </VStack>
          </SlideFade>

          {/* Value Proposition */}
          <SlideFade in offsetY="30px">
            <Box 
              bg={cardBg} 
              p={{ base: 6, md: 8 }} 
              borderRadius="xl" 
              boxShadow={softShadow}
              mb={8}
            >
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                <Box>
                  <Heading size="lg" mb={4} color={accentColor}>
                    {t('learnMore.value.heading', 'Why Become a BitCash Agent?')}
                  </Heading>
                  
                  <List spacing={4}>
                    <ListItem>
                      <HStack alignItems="start">
                        <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
                        <Box>
                          <Text fontWeight="bold">
                            {t('learnMore.value.point1.title', 'Additional Revenue Stream')}
                          </Text>
                          <Text fontSize="sm">
                            {t('learnMore.value.point1.description', 'Earn competitive commissions on every transaction, from cash deposits and withdrawals to merchant settlements. High-volume agents earn $500-$3,000 monthly.')}
                          </Text>
                        </Box>
                      </HStack>
                    </ListItem>
                    
                    <ListItem>
                      <HStack alignItems="start">
                        <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
                        <Box>
                          <Text fontWeight="bold">
                            {t('learnMore.value.point2.title', 'Increased Foot Traffic')}
                          </Text>
                          <Text fontSize="sm">
                            {t('learnMore.value.point2.description', 'For existing businesses, BitCash services bring new customers to your location who often make additional purchases, increasing overall revenue by 15-30%.')}
                          </Text>
                        </Box>
                      </HStack>
                    </ListItem>
                    
                    <ListItem>
                      <HStack alignItems="start">
                        <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
                        <Box>
                          <Text fontWeight="bold">
                            {t('learnMore.value.point3.title', 'Low Investment, High Return')}
                          </Text>
                          <Text fontSize="sm">
                            {t('learnMore.value.point3.description', 'Start with just a smartphone and your operating float. No expensive equipment, franchise fees, or monthly charges required.')}
                          </Text>
                        </Box>
                      </HStack>
                    </ListItem>
                    
                    <ListItem>
                      <HStack alignItems="start">
                        <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
                        <Box>
                          <Text fontWeight="bold">
                            {t('learnMore.value.point4.title', 'Community Value')}
                          </Text>
                          <Text fontSize="sm">
                            {t('learnMore.value.point4.description', 'Provide essential financial services to your community, helping people access digital payments, send money, and manage finances conveniently.')}
                          </Text>
                        </Box>
                      </HStack>
                    </ListItem>
                    
                    <ListItem>
                      <HStack alignItems="start">
                        <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
                        <Box>
                          <Text fontWeight="bold">
                            {t('learnMore.value.point5.title', 'Growth Potential')}
                          </Text>
                          <Text fontSize="sm">
                            {t('learnMore.value.point5.description', 'Begin as a standard agent and advance to premium tiers with higher commission rates. Super agents can build networks of sub-agents for additional income.')}
                          </Text>
                        </Box>
                      </HStack>
                    </ListItem>
                  </List>
                </Box>
                
                <Image 
                  src="/images/agent-value.jpg" 
                  alt={t('learnMore.value.imageAlt', 'BitCash agent serving customer')}
                  fallback={
                    <Box 
                      bg="brand.cash.400" 
                      width="100%" 
                      height="100%" 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                      borderRadius="lg"
                    >
                      <Text color="white" fontWeight="bold">
                        {t('learnMore.value.imagePlaceholder', 'Agent Services Image')}
                      </Text>
                    </Box>
                  }
                  objectFit="cover"
                  borderRadius="lg"
                />
              </SimpleGrid>
            </Box>
          </SlideFade>
          
          {/* Requirements Section */}
          <SlideFade in offsetY="30px">
            <Box 
              bg={cardBg} 
              p={{ base: 6, md: 8 }} 
              borderRadius="xl" 
              boxShadow={softShadow}
              mb={8}
            >
              <Heading size="lg" mb={4} color={accentColor} textAlign="center">
                {t('learnMore.requirements.heading', 'Agent Requirements')}
              </Heading>
              
              <Text textAlign="center" mb={8} maxW="3xl" mx="auto">
                {t('learnMore.requirements.description', 'BitCash maintains high standards for our agent network to ensure security and quality service. Here\'s what you need to qualify:')}
              </Text>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                <Box 
                  p={6} 
                  bg={accentBg} 
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderColor={accentColor}
                >
                  <Heading size="md" mb={4}>
                    {t('learnMore.requirements.business.heading', 'For Business Locations')}
                  </Heading>
                  
                  <List spacing={3}>
                    <ListItem>
                      <HStack>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        <Text>{t('learnMore.requirements.business.req1', 'Registered business with physical location')}</Text>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        <Text>{t('learnMore.requirements.business.req2', 'Business registration documents')}</Text>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        <Text>{t('learnMore.requirements.business.req3', 'Tax identification information')}</Text>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        <Text>{t('learnMore.requirements.business.req4', 'Proof of business address')}</Text>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        <Text>{t('learnMore.requirements.business.req5', '$1,000 minimum operating float')}</Text>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        <Text>{t('learnMore.requirements.business.req6', 'Business owner ID and verification')}</Text>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        <Text>{t('learnMore.requirements.business.req7', 'Clean business history record')}</Text>
                      </HStack>
                    </ListItem>
                  </List>
                </Box>
                
                <Box 
                  p={6} 
                  bg={accentBg} 
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderColor={accentColor}
                >
                  <Heading size="md" mb={4}>
                    {t('learnMore.requirements.individual.heading', 'For Individual Agents')}
                  </Heading>
                  
                  <List spacing={3}>
                    <ListItem>
                      <HStack>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        <Text>{t('learnMore.requirements.individual.req1', 'Age 21 or older')}</Text>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        <Text>{t('learnMore.requirements.individual.req2', 'Government-issued photo ID')}</Text>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        <Text>{t('learnMore.requirements.individual.req3', 'Proof of address (utility bill, lease, etc.)')}</Text>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        <Text>{t('learnMore.requirements.individual.req4', 'Bank account information')}</Text>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        <Text>{t('learnMore.requirements.individual.req5', '$500 minimum operating float')}</Text>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        <Text>{t('learnMore.requirements.individual.req6', 'Smartphone with internet access')}</Text>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        <Text>{t('learnMore.requirements.individual.req7', 'Clean background check')}</Text>
                      </HStack>
                    </ListItem>
                  </List>
                </Box>
              </SimpleGrid>
              
              <Text fontSize="sm" mt={6} textAlign="center" color="gray.500">
                {t('learnMore.requirements.note', 'All agents must complete mandatory compliance training, security protocols, and platform usage education before activation.')}
              </Text>
            </Box>
          </SlideFade>
          
          {/* Agent Journey */}
          <SlideFade in offsetY="30px">
            <Box 
              bg={cardBg} 
              p={{ base: 6, md: 8 }} 
              borderRadius="xl" 
              boxShadow={softShadow}
              mb={8}
            >
              <Heading size="lg" mb={6} color={accentColor} textAlign="center">
                {t('learnMore.journey.heading', 'The BitCash Agent Journey')}
              </Heading>
              
              <Grid 
                templateColumns={{ base: "1fr", md: "repeat(6, 1fr)" }}
                gap={4}
              >
                {agentJourney.map((step, index) => (
                  <GridItem key={index}>
                    <MotionBox
                      whileHover={{ y: -5 }}
                      p={4}
                      bg={accentBg}
                      borderRadius="lg"
                      height="full"
                      position="relative"
                      textAlign="center"
                    >
                      <Flex 
                        w={12} 
                        h={12} 
                        bg="brand.cash.400" 
                        color="white" 
                        borderRadius="full" 
                        justifyContent="center" 
                        alignItems="center"
                        mx="auto"
                        mb={3}
                      >
                        <Text fontWeight="bold">{index + 1}</Text>
                      </Flex>
                      <Heading size="sm" mb={2}>
                        {step.title}
                      </Heading>
                      <Text fontSize="sm">
                        {step.description}
                      </Text>
                    </MotionBox>
                  </GridItem>
                ))}
              </Grid>
              
              <Divider my={8} />
              
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <HStack 
                  p={4} 
                  bg={accentBg} 
                  borderRadius="lg"
                  align="start"
                >
                  <Icon as={InfoIcon} color={accentColor} boxSize={5} mt={1} />
                  <Box>
                    <Text fontWeight="bold">
                      {t('learnMore.journey.timing.title', 'Timeframe')}
                    </Text>
                    <Text fontSize="sm">
                      {t('learnMore.journey.timing.description', 'Most agents complete the entire process from application to activation in 2-3 weeks.')}
                    </Text>
                  </Box>
                </HStack>
                
                <HStack 
                  p={4} 
                  bg={accentBg} 
                  borderRadius="lg"
                  align="start"
                >
                  <Icon as={InfoIcon} color={accentColor} boxSize={5} mt={1} />
                  <Box>
                    <Text fontWeight="bold">
                      {t('learnMore.journey.support.title', 'Guided Process')}
                    </Text>
                    <Text fontSize="sm">
                      {t('learnMore.journey.support.description', 'A dedicated agent success manager helps you through each step of the onboarding journey.')}
                    </Text>
                  </Box>
                </HStack>
                
                <HStack 
                  p={4} 
                  bg={accentBg} 
                  borderRadius="lg"
                  align="start"
                >
                  <Icon as={InfoIcon} color={accentColor} boxSize={5} mt={1} />
                  <Box>
                    <Text fontWeight="bold">
                      {t('learnMore.journey.training.title', 'Training')}
                    </Text>
                    <Text fontSize="sm">
                      {t('learnMore.journey.training.description', 'Both in-person and online training options are available to fit your schedule.')}
                    </Text>
                  </Box>
                </HStack>
              </SimpleGrid>
            </Box>
          </SlideFade>
          
          {/* Success Stories */}
          <SlideFade in offsetY="30px">
            <Box 
              bg={cardBg} 
              p={{ base: 6, md: 8 }} 
              borderRadius="xl" 
              boxShadow={softShadow}
              mb={8}
            >
              <Heading size="lg" mb={6} color={accentColor} textAlign="center">
                {t('learnMore.success.heading', 'Agent Success Stories')}
              </Heading>
              
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                {successStories.map((story, index) => (
                  <Card key={index} variant="outline">
                    <CardHeader bg={accentBg} p={4}>
                      <HStack>
                        <Box
                          w={12}
                          h={12}
                          borderRadius="full"
                          overflow="hidden"
                          bg="brand.cash.400"
                        >
                          <Image
                            src={story.image}
                            alt={story.name}
                            fallback={<Box bg="brand.cash.400" w="100%" h="100%" />}
                          />
                        </Box>
                        <Box>
                          <Heading size="sm">{story.name}</Heading>
                          <Text fontSize="xs">{story.location}</Text>
                        </Box>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <Text fontSize="sm">"{story.content}"</Text>
                    </CardBody>
                    <CardFooter pt={0}>
                      <HStack>
                        <Icon as={StarIcon} color="yellow.400" />
                        <Icon as={StarIcon} color="yellow.400" />
                        <Icon as={StarIcon} color="yellow.400" />
                        <Icon as={StarIcon} color="yellow.400" />
                        <Icon as={StarIcon} color="yellow.400" />
                      </HStack>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          </SlideFade>
          
          {/* FAQ Section */}
          <SlideFade in offsetY="30px">
            <Box 
              bg={cardBg} 
              p={{ base: 6, md: 8 }} 
              borderRadius="xl" 
              boxShadow={softShadow}
              mb={8}
            >
              <Heading size="lg" mb={6} color={accentColor} textAlign="center">
                {t('learnMore.faq.heading', 'Frequently Asked Questions')}
              </Heading>
              
              <Accordion allowToggle>
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} mb={4} border="none">
                    <h2>
                      <AccordionButton 
                        bg={accentBg} 
                        borderRadius="md" 
                        _expanded={{ bg: "brand.cash.400", color: "white" }}
                      >
                        <Box flex='1' textAlign='left' py={2}>
                          <Text fontWeight="medium">{item.question}</Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4} pt={4} px={4} bg="gray.50" borderBottomRadius="md">
                      <Text>{item.answer}</Text>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Box>
          </SlideFade>
          
          {/* CTA Section */}
          <SlideFade in offsetY="30px">
            <Box 
              bg="brand.cash.600" 
              color="white" 
              p={{ base: 6, md: 10 }} 
              borderRadius="xl" 
              boxShadow={softShadow}
              mb={8}
              textAlign="center"
            >
              <Heading size="lg" mb={4}>
                {t('learnMore.cta.heading', 'Ready to Start Your BitCash Agent Journey?')}
              </Heading>
              <Text maxW="2xl" mx="auto" mb={6}>
                {t('learnMore.cta.description', 'Join our growing network of agents providing essential financial services, earning competitive commissions, and making a difference in their communities.')}
              </Text>
              
              <HStack spacing={4} justifyContent="center">
                <Button 
                  variant="bitcash-solid" 
                  size="lg"
                  onClick={() => router.push('/signup/agent')}
                  rightIcon={<ArrowForwardIcon />}
                >
                  {t('learnMore.cta.applyButton', 'Apply Now')}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  color="white"
                  borderColor="white"
                  _hover={{ bg: "whiteAlpha.200" }}
                  leftIcon={<PhoneIcon />}
                  onClick={() => router.push('/contact')}
                >
                  {t('learnMore.cta.contactButton', 'Talk to an Advisor')}
                </Button>
              </HStack>
            </Box>
          </SlideFade>
          
          <Flex justifyContent="center">
            <Button 
              variant="link" 
              color={accentColor}
              leftIcon={<ArrowBackIcon />}
              onClick={() => router.push('/agents')}
            >
              {t('learnMore.backButton', 'Back to Agent Information')}
            </Button>
          </Flex>
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

export default LearnMore;