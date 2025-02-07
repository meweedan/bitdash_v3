// pages/bitstock/index.js
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import {
  Box,
  Container,
  VStack,
  Text,
  Button,
  Heading,
  useColorMode,
  Grid,
  GridItem,
  SimpleGrid,
  HStack,
  Icon,
} from '@chakra-ui/react';
import {
  TrendingUp,
  Package,
  BarChart3,
  Bot,
  ArrowRight,
  CheckCircle,
  ShoppingBag,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { StockFlowAnimation } from '@/components/StockFlowAnimation'; // You'll need to create this

const FeatureHighlight = ({ icon: Icon, title, description }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <VStack 
      align="start" 
      spacing={4}
      p={6}
      rounded="xl"
      borderWidth="1px"
      borderColor={isDark ? 'gray.700' : 'gray.200'}
      _hover={{ borderColor: 'blue.500', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
    >
      <Icon size={24} className="text-blue-500" />
      <Box>
        <Text fontWeight="bold" mb={2}>{title}</Text>
        <Text color={isDark ? 'gray.400' : 'gray.600'} fontSize="sm">
          {description}
        </Text>
      </Box>
    </VStack>
  );
};

const StockLandingBrowser = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const features = [
    {
      icon: AlertCircle,
      title: 'Predictive Alerts',
      description: 'Get early warnings about potential surplus stock before it becomes an issue'
    },
    {
      icon: RefreshCw,
      title: 'Stock Exchange',
      description: 'Trade surplus inventory with verified businesses in your network'
    },
    {
      icon: Bot,
      title: 'AI Analytics',
      description: 'Smart insights to optimize your inventory levels and reduce waste'
    },
    {
      icon: BarChart3,
      title: 'Real-time Tracking',
      description: 'Monitor stock levels, turnover rates, and market prices live'
    }
  ];

  return (
    <>
      <Head>
        <title>BitStock</title>
      </Head>
        <Container maxW="1500px" p={4}>
          {/* Hero Section */}
          <Box>
            <Container>
              <Grid alignItems="center">
                <GridItem>
                  <StockFlowAnimation />
                  <VStack spacing={8}>
                    <Heading as="h1" size="2xl" lineHeight="shorter">
                      Transform Surplus Stock into Profit
                    </Heading>
                    <Text fontSize="xl">
                      AI-powered platform connecting businesses to trade surplus inventory,
                      reduce waste, and maximize profits through real-time market insights
                    </Text>
                    <HStack>
                      <Button
                        size="md"
                        colorScheme="blue"
                        rightIcon={<ArrowRight />}
                        onClick={() => router.push('/signup')}
                      >
                        Join Network
                      </Button>
                      <Button
                        leftIcon={<FaWhatsapp />}
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => {
                          window.open("https://api.whatsapp.com/send?phone=00447538636207", "_blank");
                        }}
                        size="sm"
                      >
                        Schedule Demo
                      </Button>
                    </HStack>
                    <HStack spacing={3} pt={4}>
                      {[
                        'No upfront costs',
                        'Verified network',
                        'Secure transactions'
                      ].map((text, index) => (
                        <HStack key={index} color={isDark ? 'gray.400' : 'gray.600'}>
                          <Icon as={CheckCircle} className="text-green-500" />
                          <Text fontSize="sm">{text}</Text>
                        </HStack>
                      ))}
                    </HStack>
                  </VStack>
                </GridItem>
              </Grid>
            </Container>
          </Box>

          {/* Features Section */}
          <Box py={20}>
            <Container maxW="7xl">
              <VStack spacing={16}>
                <VStack spacing={4} textAlign="center" maxW="2xl">
                  <Heading>Intelligent Stock Management</Heading>
                  <Text fontSize="lg" color={isDark ? 'gray.400' : 'gray.600'}>
                    Everything you need to optimize inventory and maximize profits
                  </Text>
                </VStack>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
                  {features.map((feature, index) => (
                    <FeatureHighlight key={index} {...feature} />
                  ))}
                </SimpleGrid>
              </VStack>
            </Container>
          </Box>

          {/* Statistics Section */}
          <Box>
            <Container>
              <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={16} alignItems="center">
                <GridItem order={{ base: 2, lg: 1 }}>
                  <SimpleGrid columns={2} gap={8}>
                    {[
                      { number: '60%', label: 'Waste Reduction' },
                      { number: '40%', label: 'Cost Savings' },
                      { number: '2.5K', label: 'Monthly Trades' },
                      { number: '500+', label: 'Active Businesses' }
                    ].map((stat, index) => (
                      <VStack key={index} align="start">
                        <Text fontSize="4xl" fontWeight="bold" color="blue.500">
                          {stat.number}
                        </Text>
                        <Text color={isDark ? 'gray.400' : 'gray.600'}>{stat.label}</Text>
                      </VStack>
                    ))}
                  </SimpleGrid>
                </GridItem>
                <GridItem order={{ base: 1, lg: 2 }}>
                  <VStack align="start" spacing={6}>
                    <Heading size="lg">
                      Real Results for Growing Businesses
                    </Heading>
                    <Text color={isDark ? 'gray.400' : 'gray.600'}>
                      Join hundreds of successful businesses that are transforming their
                      excess inventory into opportunity. Our platform delivers measurable
                      improvements in stock efficiency and bottom-line results.
                    </Text>
                    <Button
                      variant="link"
                      colorScheme="blue"
                      rightIcon={<ArrowRight />}
                      onClick={() => router.push('/case-studies')}
                    >
                      View Success Stories
                    </Button>
                  </VStack>
                </GridItem>
              </Grid>
            </Container>
          </Box>

          {/* CTA Section */}
          <Box py={24}>
            <Container maxW="3xl" textAlign="center">
              <VStack spacing={8}>
                <Heading>Ready to Optimize Your Stock?</Heading>
                <Text fontSize="lg" color={isDark ? 'gray.400' : 'gray.600'}>
                  Join the intelligent stock management revolution. Start trading
                  surplus inventory efficiently and boost your bottom line.
                </Text>
                <HStack spacing={4}>
                  <Button
                    size="lg"
                    colorScheme="blue"
                    rightIcon={<ArrowRight />}
                    onClick={() => router.push('/signup')}
                  >
                    Join Network
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    onClick={() => router.push('/pricing')}
                  >
                    View Pricing
                  </Button>
                </HStack>
              </VStack>
            </Container>
          </Box>
        </Container>
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

export default StockLandingBrowser;