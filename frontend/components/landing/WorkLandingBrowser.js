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
  Badge,
  SimpleGrid,
  Flex,
  Icon,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  TrendingUp,
  Search,
  Network,
  GraduationCap,
  Briefcase,
  ArrowUpRight,
  CheckCircle,
  LineChart,
  PieChart,
  Wallet,
  Clock,
  Shield,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';

const MotionBox = motion(Box);

const WorkLandingBrowser = () => {
  const { colorMode } = useColorMode();
  const [activeTab, setActiveTab] = useState('employers');

  const stats = {
    employers: [
      { value: '500+', label: 'Companies', icon: Building2 },
      { value: '10K+', label: 'Job Posts', icon: Briefcase },
      { value: '95%', label: 'Success Rate', icon: TrendingUp },
    ],
    seekers: [
      { value: '50K+', label: 'Active Users', icon: Users },
      { value: '1000+', label: 'Daily Matches', icon: Network },
      { value: '80%', label: 'Placement Rate', icon: LineChart },
    ],
  };

  const features = {
    employers: [
      {
        title: 'Smart Matching',
        description: 'AI-powered candidate matching based on skills and requirements',
        icon: Search,
      },
      {
        title: 'Analytics Dashboard',
        description: 'Comprehensive insights into posting performance and candidate engagement',
        icon: PieChart,
      },
      {
        title: 'Verified Talent Pool',
        description: 'Access to pre-vetted candidates with verified credentials',
        icon: Shield,
      },
      {
        title: 'Cost Effective',
        description: 'Flexible pricing plans tailored to your hiring needs',
        icon: Wallet,
      },
    ],
    seekers: [
      {
        title: 'Personalized Feed',
        description: 'Curated job recommendations based on your skills and preferences',
        icon: Network,
      },
      {
        title: 'Skill Development',
        description: 'Access to learning resources and career development tools',
        icon: GraduationCap,
      },
      {
        title: 'Quick Apply',
        description: 'One-click application process with saved profiles',
        icon: Clock,
      },
      {
        title: 'Career Growth',
        description: 'Track your applications and professional development',
        icon: TrendingUp,
      },
    ],
  };

  const benefits = {
    employers: [
      'Reduce time-to-hire by 60%',
      'Access verified talent pool',
      'Real-time analytics',
      'Automated screening',
      'Custom workflow integration',
      'Dedicated support',
    ],
    seekers: [
      'Personalized job matches',
      'Skill assessment tools',
      'Application tracking',
      'Professional networking',
      'Career resources',
      'Interview preparation',
    ],
  };

  return (
    <Box>
      {/* Hero Section */}
      <Container maxW="8xl">
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={16} alignItems="center">
          <GridItem>
            <VStack align="start" spacing={8}>
              <Heading
                fontSize={{ base: '4xl', lg: '6xl' }}
                bgGradient="linear(to-r, brand.bitwork.400, brand.bitwork.600)"
                bgClip="text"
                lineHeight="shorter"
              >
                The Future of Career Building and Talent Acquisition
              </Heading>

              <Text fontSize={{ base: 'lg', lg: 'xl' }}>
                Connect with opportunities and talent through our intelligent platform. 
                Streamlined processes for both employers and job seekers.
              </Text>

              <HStack spacing={4}>
                <Button
                  variant="bitwork-solid"
                  size="lg"
                  rightIcon={<ArrowUpRight />}
                >
                  Post a Job
                </Button>
                <Button
                  variant="bitwork-outline"
                  size="lg"
                >
                  Find Jobs
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
              {/* Platform Preview Animation */}
              <Box
                h="500px"
                borderRadius="2xl"
                position="relative"
                overflow="hidden"
              >
                {/* Add platform preview content here */}
              </Box>
            </MotionBox>
          </GridItem>
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box 
        py={20}
      >
        <Container maxW="8xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {stats[activeTab].map((stat, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  borderWidth="1px"
                  borderColor="brand.bitwork.500"
                  borderRadius="xl"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'xl',
                  }}
                  transition="all 0.3s"
                >
                  <CardBody>
                    <VStack spacing={4}>
                      <Icon as={stat.icon} boxSize={8} color="brand.bitwork.500" />
                      <Text fontSize="4xl" fontWeight="bold" color="brand.bitwork.500">
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
            color="brand.bitwork.500"
          >
            {activeTab === 'employers' ? 'For Employers' : 'For Job Seekers'}
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
            {features[activeTab].map((feature, index) => (
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
                    borderColor: 'brand.bitwork.500',
                    transform: 'translateY(-4px)',
                    boxShadow: 'xl',
                  }}
                  transition="all 0.3s"
                >
                  <CardBody>
                    <VStack spacing={4} align="start">
                      <Icon as={feature.icon} boxSize={6} color="brand.bitwork.500" />
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
              {benefits[activeTab].map((benefit, index) => (
                <HStack
                  key={index}
                  spacing={4}
                  p={4}
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor="gray.200"
                  _hover={{
                    borderColor: 'brand.bitwork.500',
                    transform: 'translateX(8px)',
                  }}
                  transition="all 0.3s"
                >
                  <Icon as={CheckCircle} color="brand.bitwork.500" />
                  <Text>{benefit}</Text>
                </HStack>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container>
        <GlassCard
        p={8}
        variant="bitwork"
        textAlign="center">
        <VStack spacing={8} textAlign="center">
          <Heading
            fontSize={{ base: '3xl', lg: '4xl' }}
            // color="brand.bitwork.500"
          >
            Ready to Get Started?
          </Heading>
          <Text fontSize="xl" color="gray.500" maxW="2xl">
            Join thousands of companies and professionals building their future with BitWork
          </Text>
          <HStack spacing={4}>
            <Button
              variant="bitwork-solid"
              size="lg"
              rightIcon={<ArrowUpRight />}
            >
              Post a Job
            </Button>
            <Button
              variant="bitwork-outline"
              size="lg"
            >
              Find Jobs
            </Button>
          </HStack>
        </VStack>
        </GlassCard>
      </Container>
    </Box>
  );
};

export default WorkLandingBrowser;