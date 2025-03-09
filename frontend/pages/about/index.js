import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import NextLink from 'next/link';
import Image from 'next/image';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Stack,
  VStack,
  HStack,
  Icon,
  useColorMode,
  useBreakpointValue,
  Badge,
  Card,
  CardBody,
  Divider,
  Link
} from '@chakra-ui/react';
import { FaBuilding, FaUsers, FaShieldAlt, FaGlobeAmericas, FaChartLine, FaArrowRight } from 'react-icons/fa';
import Head from 'next/head';
import Layout from '@/components/Layout';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'about'])),
    },
  };
}

export default function AboutIndex() {
  const { t, i18n } = useTranslation(['common', 'about']);
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const isRTL = i18n.language === 'ar' || i18n.language === 'he';
  
  // Responsive settings
  const headingSize = useBreakpointValue({ base: 'xl', md: '2xl' });
  const subheadingSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const textSize = useBreakpointValue({ base: 'sm', md: 'md' });
  
  // About page sections data
  const aboutSections = [
    {
      id: 'company-profile',
      title: t('about:sections.profile.title', 'Company Profile'),
      description: t('about:sections.profile.description'),
      icon: FaBuilding,
      href: '/about/profile'
    },
    {
      id: 'team',
      title: t('about:sections.team.title', 'Our Team'),
      description: t('about:sections.team.description'),
      icon: FaUsers,
      href: '/about/team'
    },
    {
      id: 'regulation',
      title: t('about:sections.regulation.title', 'Regulation & Compliance'),
      description: t('about:sections.regulation.description', 'Discover our commitment to regulatory compliance and security across all operations.'),
      icon: FaShieldAlt,
      href: '/about/regulation'
    }
  ];
  
  // Company stats
  const companyStats = [
    {
      value: '2014',
      label: t('about:stats.founded', 'Founded'),
    },
    {
      value: '500K+',
      label: t('about:stats.clients', 'Global Clients'),
    },
    {
      value: '35+',
      label: t('about:stats.countries', 'Countries'),
    },
    {
      value: '24/7',
      label: t('about:stats.support', 'Customer Support'),
    }
  ];

  return (
    <>
      <Head>
        <title>{t('about:pageTitle', 'About BitDash | Our Story, Team and Values')}</title>
        <meta 
          name="description" 
          content={t('about:metaDescription', 'Learn about BitDash, our mission to transform financial services, our leadership team, and our commitment to innovation and customer success.')}
        />
      </Head>
      
      <Layout>
      <Box w="full" position="relative" overflow="hidden">
        {/* Hero Section */}
        <Box 
          position="relative"
          py={16}
        >
          
          <Container maxW="container.xl" position="relative" zIndex={1}>
            <Stack 
              spacing={8} 
              align={{ base: "center", md: "flex-start" }} 
              textAlign={{ base: "center", md: "left" }}
              direction={{ base: "column", lg: "row" }}
              justify="space-between"
            >
              <VStack 
                spacing={6} 
                align={{ base: "center", md: "flex-start" }}
                maxW={{ base: "100%", lg: "50%" }}
              >
                <VStack spacing={3} align={{ base: "center", md: "flex-start" }}>
                  <Heading 
                    as="h1" 
                    size={headingSize} 
                    fontWeight="bold"
                    bgGradient={isDark ? 
                      "linear(to-r, brand.bitdash.400, brand.stocks.400)" : 
                      "linear(to-r, brand.bitdash.600, brand.stocks.600)"
                    }
                    bgClip="text"
                  >
                    {t('about:title', 'Transforming Financial Services')}
                  </Heading>
                </VStack>
                
                <Text 
                  fontSize={textSize} 
                  color={isDark ? "gray.300" : "gray.700"}
                >
                  {t('about:introduction', 'Founded in 2014, BitDash is on a mission to make financial services more accessible, transparent, and efficient. We combine innovative technology with deep financial expertise to deliver solutions that empower individuals and institutions worldwide.')}
                </Text>
                
                <HStack spacing={4} wrap="wrap">
                  <Button
                    as={NextLink}
                    href="/about/profile"
                    bg={isDark ? "brand.bitdash.600" : "brand.bitdash.500"}
                    color="white"
                    _hover={{
                      bg: isDark ? "brand.bitdash.500" : "brand.bitdash.600",
                    }}
                    size="md"
                    borderRadius="full"
                  >
                    {t('about:learnMore', 'Learn More')}
                  </Button>
                  
                  <Button
                    as={NextLink}
                    href="/contact"
                    variant="outline"
                    borderColor={isDark ? "brand.bitdash.400" : "brand.bitdash.500"}
                    color={isDark ? "brand.bitdash.400" : "brand.bitdash.500"}
                    _hover={{
                      bg: isDark ? "whiteAlpha.100" : "brand.bitdash.50",
                    }}
                    size="md"
                    borderRadius="full"
                  >
                    {t('about:contactUs', 'Contact Us')}
                  </Button>
                </HStack>
              </VStack>
              
              <Box 
                position="relative" 
                width={{ base: "100%", lg: "45%" }} 
                height={{ base: "300px", md: "400px" }}
                mt={{ base: 8, lg: 0 }}
              >
                <Image
                  src="/about/hero-image.jpg"
                  alt={t('about:heroImageAlt', 'BitDash team members collaborating')}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  style={{
                    objectFit: 'cover',
                    borderRadius: '1rem'
                  }}
                  priority
                />
              </Box>
            </Stack>
          </Container>
        </Box>
        
        {/* Stats Section */}
        <Box py={8}>
          <Container maxW="container.xl">
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
              {companyStats.map((stat, index) => (
                <Card
                  key={index}
                  bg={isDark ? 'gray.800' : 'white'}
                  boxShadow="sm"
                  borderRadius="lg"
                  p={6}
                  align="center"
                >
                  <VStack>
                    <Heading size="xl" color={isDark ? 'brand.bitdash.300' : 'brand.bitdash.600'}>
                      {stat.value}
                    </Heading>
                    <Text color={isDark ? 'gray.400' : 'gray.600'}>
                      {stat.label}
                    </Text>
                  </VStack>
                </Card>
              ))}
            </SimpleGrid>
          </Container>
        </Box>
        
        {/* Mission & Vision Section */}
        <Box py={16}>
          <Container maxW="container.xl">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems="center">
              <VStack align="start" spacing={6}>
                <Heading 
                  as="h2" 
                  size={subheadingSize} 
                  color={isDark ? "white" : "gray.800"}
                >
                  {t('about:mission.title', 'Our Mission')}
                </Heading>
                
                <Text fontSize={textSize} color={isDark ? "gray.300" : "gray.700"}>
                  {t('about:mission.description', 'BitDash is committed to democratizing access to financial services through technology. We believe that everyone deserves access to transparent, efficient, and secure financial tools that help them achieve their goals.')}
                </Text>
                
                <Divider borderColor={isDark ? "gray.700" : "gray.200"} />
                
                <Heading 
                  as="h2" 
                  size={subheadingSize} 
                  color={isDark ? "white" : "gray.800"}
                >
                  {t('about:vision.title', 'Our Vision')}
                </Heading>
                
                <Text fontSize={textSize} color={isDark ? "gray.300" : "gray.700"}>
                  {t('about:vision.description')}
                </Text>
              </VStack>
              
              <Box position="relative" height={{ base: "300px", md: "400px" }}>
                <Image
                  src="/about/mission-vision.jpg"
                  alt={t('about:missionImageAlt', 'BitDash mission and vision illustration')}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{
                    objectFit: 'cover',
                    borderRadius: '1rem'
                  }}
                />
              </Box>
            </SimpleGrid>
          </Container>
        </Box>
        
        {/* Core Values Section */}
        <Box py={16}>
          <Container maxW="container.xl">
            <VStack spacing={12} align="stretch">
              <VStack spacing={3} textAlign="center">
                <Heading 
                  as="h2" 
                  size={subheadingSize} 
                  color={isDark ? "white" : "gray.800"}
                >
                  {t('about:values.title', 'Our Core Values')}
                </Heading>
                <Text 
                  fontSize={textSize} 
                  color={isDark ? "gray.300" : "gray.700"}
                  maxW="3xl"
                  mx="auto"
                >
                  {t('about:values.description', 'These principles guide everything we do at BitDash, from product development to customer service.')}
                </Text>
              </VStack>
              
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                <Card
                  bg={isDark ? 'gray.800' : 'white'}
                  boxShadow="sm"
                  borderRadius="lg"
                  p={6}
                  transition="all 0.3s"
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "md"
                  }}
                >
                  <CardBody>
                    <VStack spacing={4} align="start">
                      <Box
                        p={3}
                        borderRadius="full"
                        bg={isDark ? 'whiteAlpha.100' : 'brand.bitdash.50'}
                        color={isDark ? 'brand.bitdash.400' : 'brand.bitdash.600'}
                      >
                        <Icon as={FaShieldAlt} boxSize={6} />
                      </Box>
                      <Heading size="md" color={isDark ? "white" : "gray.800"}>
                        {t('about:values.security.title', 'Security & Trust')}
                      </Heading>
                      <Text color={isDark ? "gray.300" : "gray.700"}>
                        {t('about:values.security.description')}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
                
                <Card
                  bg={isDark ? 'gray.800' : 'white'}
                  boxShadow="sm"
                  borderRadius="lg"
                  p={6}
                  transition="all 0.3s"
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "md"
                  }}
                >
                  <CardBody>
                    <VStack spacing={4} align="start">
                      <Box
                        p={3}
                        borderRadius="full"
                        bg={isDark ? 'whiteAlpha.100' : 'brand.bitdash.50'}
                        color={isDark ? 'brand.bitdash.400' : 'brand.bitdash.600'}
                      >
                        <Icon as={FaGlobeAmericas} boxSize={6} />
                      </Box>
                      <Heading size="md" color={isDark ? "white" : "gray.800"}>
                        {t('about:values.accessibility.title', 'Accessibility')}
                      </Heading>
                      <Text color={isDark ? "gray.300" : "gray.700"}>
                        {t('about:values.accessibility.description', 'We design our products to be accessible to everyone, regardless of their financial background, technical knowledge, or geographic location.')}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
                
                <Card
                  bg={isDark ? 'gray.800' : 'white'}
                  boxShadow="sm"
                  borderRadius="lg"
                  p={6}
                  transition="all 0.3s"
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "md"
                  }}
                >
                  <CardBody>
                    <VStack spacing={4} align="start">
                      <Box
                        p={3}
                        borderRadius="full"
                        bg={isDark ? 'whiteAlpha.100' : 'brand.bitdash.50'}
                        color={isDark ? 'brand.bitdash.400' : 'brand.bitdash.600'}
                      >
                        <Icon as={FaChartLine} boxSize={6} />
                      </Box>
                      <Heading size="md" color={isDark ? "white" : "gray.800"}>
                        {t('about:values.innovation.title', 'Innovation')}
                      </Heading>
                      <Text color={isDark ? "gray.300" : "gray.700"}>
                        {t('about:values.innovation.description', 'We continuously explore new technologies and approaches to improve our products and services, staying ahead of market trends and customer needs.')}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>
        
        {/* About Sections */}
        <Box py={16}>
          <Container maxW="container.xl">
            <VStack spacing={12} align="stretch">
              <Heading 
                as="h2" 
                size={subheadingSize} 
                color={isDark ? "white" : "gray.800"}
                textAlign="center"
              >
                {t('about:exploreMore', 'Explore More About BitDash')}
              </Heading>
              
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                {aboutSections.map((section) => (
                  <Card
                    key={section.id}
                    bg={isDark ? 'gray.700' : 'white'}
                    boxShadow="sm"
                    borderRadius="lg"
                    overflow="hidden"
                    transition="all 0.3s"
                    _hover={{
                      transform: "translateY(-5px)",
                      boxShadow: "md"
                    }}
                  >
                    <CardBody>
                      <VStack spacing={6} align="start" h="100%">
                        <Box
                          p={3}
                          borderRadius="full"
                          bg={isDark ? 'whiteAlpha.100' : 'brand.bitdash.50'}
                          color={isDark ? 'brand.bitdash.400' : 'brand.bitdash.600'}
                        >
                          <Icon as={section.icon} boxSize={6} />
                        </Box>
                        <Heading size="md" color={isDark ? "white" : "gray.800"}>
                          {section.title}
                        </Heading>
                        <Text color={isDark ? "gray.300" : "gray.700"} flex={1}>
                          {section.description}
                        </Text>
                        <Link 
                          as={NextLink}
                          href={section.href}
                          color={isDark ? 'brand.bitdash.400' : 'brand.bitdash.600'}
                          fontWeight="medium"
                          display="flex"
                          alignItems="center"
                        >
                          {t('about:learnMore', 'Learn More')}
                          <Icon as={FaArrowRight} ml={2} boxSize={3} />
                        </Link>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
              
              <Box 
                bg={isDark ? "whiteAlpha.100" : "brand.bitdash.50"} 
                p={6} 
                borderRadius="lg"
                mt={4}
                textAlign="center"
              >
                <VStack spacing={4}>
                  <Heading size="md">{t('about:careers.title', 'Join Our Team')}</Heading>
                  <Text maxW="2xl" mx="auto" color={isDark ? "gray.300" : "gray.700"}>
                    {t('about:careers.description')}
                  </Text>
                  <Button
                    as={NextLink}
                    href="/contact/careers"
                    variant="bitdash-outline"
                    size="md"
                    borderRadius="full"
                  >
                    {t('about:viewCareers', 'View Career Opportunities')}
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </Container>
        </Box>
      </Box>
      </Layout>
    </>
  );
}