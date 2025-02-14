// pages/index.js
import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Grid,
  GridItem,
  SimpleGrid,
  Icon,
  Card,
  CardBody,
  Flex,
  useColorModeValue,
  Divider,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Store,
  Wallet,
  TrendingUp,
  CreditCard,
  BarChart3,
  Percent,
  Package,
  ShoppingBag,
  ChevronRight,
  Globe,
  Truck,
  Shield,
} from 'lucide-react';
import MarketplacePreview from '@/components/MarketplacePreview';

const MotionBox = motion(Box);

const ShopLandingPage = () => {
  const bgAccent = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  const features = [
    {
      title: 'Pay-as-you-grow',
      description: 'Only 5% commission on sales. No subscription fees, no hidden costs.',
      icon: Percent,
      color: 'blue.500'
    },
    {
      title: 'Instant Payments',
      description: 'Get paid instantly with BitCash digital wallet integration.',
      icon: Wallet,
      color: 'green.500'
    },
    {
      title: 'Growth Tools',
      description: 'Built-in analytics, inventory management, and marketing tools.',
      icon: TrendingUp,
      color: 'purple.500'
    }
  ];

  const benefits = [
    {
      title: 'Nationwide Delivery',
      description: 'Integrated delivery network covering all of Libya',
      icon: Truck
    },
    {
      title: 'Secure Platform',
      description: 'Advanced security and fraud prevention',
      icon: Shield
    },
    {
      title: 'Global Reach',
      description: 'Expand your business beyond local markets',
      icon: Globe
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Container maxW="8xl" pt={20} pb={20}>
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={16} alignItems="center">
          <GridItem>
            <VStack align="start" spacing={8}>
              <Badge
                colorScheme="blue"
                px={3}
                py={1}
                borderRadius="full"
                textTransform="none"
                fontSize="md"
              >
                Start your online store today
              </Badge>
              
              <Heading
                fontSize={{ base: '4xl', lg: '6xl' }}
                fontWeight="bold"
                lineHeight="shorter"
              >
                Your Business,{' '}
                <Text 
                  as="span"
                  bgGradient="linear(to-r, blue.400, blue.600)"
                  bgClip="text"
                >
                  Our Platform
                </Text>
              </Heading>

              <Text fontSize={{ base: 'lg', lg: 'xl' }} color="gray.500">
                Launch your online store with zero subscription fees.
                Pay only 5% when you make a sale.
              </Text>

              <HStack spacing={4}>
                <Button
                  size="lg"
                  colorScheme="blue"
                  rightIcon={<ChevronRight />}
                  px={8}
                  h={14}
                >
                  Start Selling
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  colorScheme="blue"
                  h={14}
                >
                  Watch Demo
                </Button>
              </HStack>

              <Grid templateColumns="repeat(3, 1fr)" gap={8} w="full" pt={8}>
                <VStack align="start">
                  <Text fontSize="3xl" fontWeight="bold" color="blue.500">
                    0 LYD
                  </Text>
                  <Text color="gray.500">Monthly Fee</Text>
                </VStack>
                <VStack align="start">
                  <Text fontSize="3xl" fontWeight="bold" color="blue.500">
                    5%
                  </Text>
                  <Text color="gray.500">Commission</Text>
                </VStack>
                <VStack align="start">
                  <Text fontSize="3xl" fontWeight="bold" color="blue.500">
                    10K+
                  </Text>
                  <Text color="gray.500">Active Stores</Text>
                </VStack>
              </Grid>
            </VStack>
          </GridItem>

          <GridItem display={{ base: 'none', lg: 'block' }}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <MarketplacePreview />
            </MotionBox>
          </GridItem>
        </Grid>
      </Container>

      {/* Core Features */}
      <Box py={20}>
        <Container maxW="8xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {features.map((feature, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  h="full"
                  border="1px solid"
                  borderColor={borderColor}
                  boxShadow="lg"
                  _hover={{ transform: 'translateY(-5px)' }}
                  transition="transform 0.2s"
                >
                  <CardBody>
                    <VStack align="start" spacing={6}>
                      <Flex
                        w={12}
                        h={12}
                        color="white"
                        rounded="lg"
                        justify="center"
                        align="center"
                      >
                        <Icon as={feature.icon} boxSize={6} />
                      </Flex>
                      <VStack align="start" spacing={2}>
                        <Heading size="md">{feature.title}</Heading>
                        <Text color="gray.500">{feature.description}</Text>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* How it Works */}
      <Box py={20}>
        <Container maxW="8xl">
          <VStack spacing={16}>
            <VStack spacing={4}>
              <Heading size="2xl">How BitShop Works</Heading>
              <Text color="gray.500" fontSize="lg" maxW="2xl" textAlign="center">
                Start selling online in three simple steps
              </Text>
            </VStack>

            <Grid 
              templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} 
              gap={8}
              position="relative"
            >
              {[
                {
                  title: 'Create Your Store',
                  description: 'Sign up and set up your online store in minutes',
                  icon: Store,
                  step: '1'
                },
                {
                  title: 'Add Products',
                  description: 'Upload your products and set your prices',
                  icon: Package,
                  step: '2'
                },
                {
                  title: 'Start Selling',
                  description: 'Receive orders and grow your business',
                  icon: ShoppingBag,
                  step: '3'
                }
              ].map((step, index) => (
                <Card
                  key={index}
                  position="relative"
                  h="full"
                >
                  <CardBody>
                    <VStack spacing={6} align="start">
                      <Flex
                        w={12}
                        h={12}
                        color="white"
                        rounded="full"
                        justify="center"
                        align="center"
                        fontSize="xl"
                        fontWeight="bold"
                      >
                        {step.step}
                      </Flex>
                      <VStack align="start" spacing={4}>
                        <Heading size="md">{step.title}</Heading>
                        <Text color="gray.500">{step.description}</Text>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Platform Benefits */}
      <Box py={20}>
        <Container maxW="8xl">
          <VStack spacing={16}>
            <VStack spacing={4}>
              <Heading size="2xl">Why Choose BitShop</Heading>
              <Text color="gray.500" fontSize="lg" maxW="2xl" textAlign="center">
                Everything you need to succeed online
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
              {benefits.map((benefit, index) => (
                <Card
                  key={index}
                  border="1px solid"
                  borderColor={borderColor}
                  _hover={{ transform: 'translateY(-5px)' }}
                  transition="transform 0.2s"
                >
                  <CardBody>
                    <VStack spacing={6}>
                      <Icon as={benefit.icon} boxSize={8} color="blue.500" />
                      <VStack spacing={2}>
                        <Heading size="md">{benefit.title}</Heading>
                        <Text color="gray.500" textAlign="center">
                          {benefit.description}
                        </Text>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20}>
        <Container maxW="4xl" textAlign="center">
          <VStack spacing={8}>
            <VStack spacing={4}>
              <Heading size="2xl">
                Start Selling Online Today
              </Heading>
              <Text fontSize="xl" color="gray.500">
                No monthly fees, no setup costs. Pay only when you make a sale.
              </Text>
            </VStack>

            <Card p={8} w="full" variant="outline">
              <CardBody>
                <VStack spacing={6}>
                  <Heading size="lg" color="blue.500">5% Commission</Heading>
                  <Text>On successful sales only</Text>
                  <Button
                    size="lg"
                    colorScheme="blue"
                    rightIcon={<ChevronRight />}
                    px={8}
                    w={{ base: 'full', md: 'auto' }}
                  >
                    Create Your Store
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default ShopLandingPage;