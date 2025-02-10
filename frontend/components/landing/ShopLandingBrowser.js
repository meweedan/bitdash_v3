import React, { useState } from 'react';
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
  useColorMode,
  SimpleGrid,
  Icon,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Store,
  ShoppingBag,
  Truck,
  Package,
  TrendingUp,
  Search,
  Warehouse,
  ArrowUpRight,
  CheckCircle,
  BarChart3,
  Wallet,
  Clock,
  Shield,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import ShopSignupFlow from '@/components/ShopSignupFlow';
import MarketplacePreview from '../MarketplacePreview';

const MotionBox = motion(Box);

const ShopLandingBrowser = () => {
  const { colorMode } = useColorMode();
  const [activeTab, setActiveTab] = useState('sellers');

  const stats = [
    { value: '50K+', label: 'Active Sellers', icon: Store },
    { value: '1M+', label: 'Products', icon: Package },
    { value: '98%', label: 'Delivery Rate', icon: TrendingUp },
  ];

  const features = [
    {
      title: 'Easy Setup',
      description: 'Create your online store in minutes with simple verification',
      icon: Store,
    },
    {
      title: 'BitShop Fulfillment',
      description: 'We handle storage, packaging, and delivery',
      icon: Warehouse,
    },
    {
      title: 'Sales Analytics',
      description: 'Track performance with detailed insights',
      icon: BarChart3,
    },
    {
      title: 'Secure Payments',
      description: 'Integrated with BitCash for instant settlements',
      icon: Wallet,
    },
  ];

  const benefits = [
    'Next-day delivery with BitShop Fulfillment',
    'Access to millions of BitDash users',
    'Real-time inventory tracking',
    'Automated order processing',
    'Multi-warehouse network',
    'Dedicated seller support',
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Container maxW="8xl" pt={8}>
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={16} alignItems="center">
          <GridItem>
            <VStack align="start" spacing={8}>
              <Heading
                fontSize={{ base: '4xl', lg: '6xl' }}
                bgGradient="linear(to-r, brand.bitshop.400, brand.bitshop.600)"
                bgClip="text"
                lineHeight="shorter"
              >
                Turn Your Products into a Thriving Business
              </Heading>

              <Text fontSize={{ base: 'lg', lg: 'xl' }}>
                Start selling online with powerful e-commerce tools and nationwide fulfillment network.
                From setup to delivery, we've got you covered.
              </Text>

              <HStack spacing={4}>
                <Button
                  variant="bitshop-solid"
                  size="lg"
                  rightIcon={<ArrowUpRight />}
                >
                  Start Selling
                </Button>
                <Button
                  variant="bitshop-outline"
                  size="lg"
                >
                  Learn More
                </Button>
              </HStack>
            </VStack>
          </GridItem>

          <GridItem display={{ base: 'none', lg: 'block' }}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Platform Preview */}
              <Box
                borderRadius="2xl"
                position="relative"
                overflow="hidden"
              >
                <MarketplacePreview />
              </Box>
            </MotionBox>
          </GridItem>
        </Grid>
      </Container>

      {/* Shop Flow Animation */}
      <Box py={20}>
        <ShopSignupFlow />
      </Box>

      {/* Stats Section */}
      <Box py={20}>
        <Container maxW="8xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {stats.map((stat, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  borderWidth="1px"
                  borderColor="brand.bitshop.500"
                  borderRadius="xl"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'xl',
                  }}
                  transition="all 0.3s"
                >
                  <CardBody>
                    <VStack spacing={4}>
                      <Icon as={stat.icon} boxSize={8} color="brand.bitshop.500" />
                      <Text fontSize="4xl" fontWeight="bold" color="brand.bitshop.500">
                        {stat.value}
                      </Text>
                      <Text color="gray.500">{stat.label}</Text>
                    </VStack>
                  </CardBody>
                </Card>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="8xl" py={20}>
        <VStack spacing={16}>
          <Heading
            fontSize={{ base: '3xl', lg: '4xl' }}
            textAlign="center"
            color="brand.bitshop.500"
          >
            Everything You Need to Succeed
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
            {features.map((feature, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  h="full"
                  borderWidth="1px"
                  borderColor="gray.200"
                  borderRadius="xl"
                  _hover={{
                    borderColor: 'brand.bitshop.500',
                    transform: 'translateY(-4px)',
                    boxShadow: 'xl',
                  }}
                  transition="all 0.3s"
                >
                  <CardBody>
                    <VStack spacing={4} align="start">
                      <Icon as={feature.icon} boxSize={6} color="brand.bitshop.500" />
                      <Text fontSize="xl" fontWeight="bold">
                        {feature.title}
                      </Text>
                      <Text color="gray.500">
                        {feature.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              </MotionBox>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Benefits Section */}
      <Box py={20}>
        <Container maxW="8xl">
          <VStack spacing={16}>
            <Heading
              fontSize={{ base: '3xl', lg: '4xl' }}
              textAlign="center"
            >
              Key Benefits
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {benefits.map((benefit, index) => (
                <HStack
                  key={index}
                  spacing={4}
                  p={4}
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor="gray.200"
                  _hover={{
                    borderColor: 'brand.bitshop.500',
                    transform: 'translateX(8px)',
                  }}
                  transition="all 0.3s"
                >
                  <Icon as={CheckCircle} color="brand.bitshop.500" />
                  <Text>{benefit}</Text>
                </HStack>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxW="8xl" pb={20}>
        <GlassCard
          p={8}
          variant="bitshop"
          textAlign="center"
        >
          <VStack spacing={8}>
            <Heading
              fontSize={{ base: '3xl', lg: '4xl' }}
            >
              Ready to Start Selling?
            </Heading>
            <Text fontSize="xl" maxW="2xl">
              Join thousands of successful sellers growing their business with BitShop
            </Text>
            <HStack spacing={4}>
              <Button
                variant="bitshop-solid"
                size="lg"
                rightIcon={<ArrowUpRight />}
              >
                Create Store
              </Button>
              <Button
                variant="bitshop-outline"
                size="lg"
              >
                Watch Demo
              </Button>
            </HStack>
          </VStack>
        </GlassCard>
      </Container>
    </Box>
  );
};

export default ShopLandingBrowser;