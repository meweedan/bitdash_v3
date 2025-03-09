import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Stack,
  Icon,
  useColorMode,
  useBreakpointValue,
  Divider,
  HStack,
  VStack,
  Badge
} from '@chakra-ui/react';
import { FaBriefcase, FaGlobeAmericas, FaHandshake, FaShieldAlt } from 'react-icons/fa';
import Head from 'next/head';
import Layout from '@/components/Layout';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'about'])),
    },
  };
}

export default function CompanyProfile() {
  const { t } = useTranslation(['common', 'about']);
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  // Responsive settings
  const headingSize = useBreakpointValue({ base: 'xl', md: '2xl' });
  const subheadingSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const textSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const statGridColumns = useBreakpointValue({ base: 1, md: 2, lg: 4 });
  const historyGridColumns = useBreakpointValue({ base: 1, md: 2 });
  
  // Stats data
  const companyStats = [
    { 
      value: '2019', 
      label: t('about:founded', 'Founded'),
      icon: FaBriefcase
    },
    { 
      value: '35+', 
      label: t('about:countries', 'Countries'),
      icon: FaGlobeAmericas
    },
    { 
      value: '500K+', 
      label: t('about:clients', 'Clients'),
      icon: FaHandshake
    },
    { 
      value: '100%', 
      label: t('about:regulated', 'Regulated'),
      icon: FaShieldAlt
    }
  ];
  
  // Company history milestones
  const companyHistory = [
    {
      year: '2019',
      title: t('about:milestones.foundation.title', 'Company Foundation'),
      description: t('about:milestones.foundation.desc', 'BitDash was founded with a vision to transform the financial technology landscape.')
    },
    {
      year: '2020',
      title: t('about:milestones.expansion.title', 'Global Expansion'),
      description: t('about:milestones.expansion.desc', 'Expanded operations to 15 countries across Europe and Asia.')
    },
    {
      year: '2023',
      title: t('about:milestones.platform.title', 'Multi-Asset Platform'),
      description: t('about:milestones.platform.desc', 'Launched our integrated multi-asset platform covering forex, stocks, and cryptocurrencies.')
    },
    {
      year: '2025',
      title: t('about:milestones.payments.title', 'Cash Solutions'),
      description: t('about:milestones.payments.desc', 'Introduced our revolutionary payments solution, transforming everyday banking.')
    }
  ];

  // Licenses and regulatory information
  const licenses = [
    {
      region: t('about:licenses.uk.region', 'Saint Vincent and Grenadines'),
      authority: 'Financial Services Authority (FSA)',
      number: 'FRN: 123456'
    },
    {
      region: t('about:licenses.eu.region', 'European Union'),
      authority: 'Cyprus Securities and Exchange Commission (CySEC)',
      number: 'License No: 987/65'
    },
    {
      region: t('about:licenses.aus.region', 'Australia'),
      authority: 'Australian Securities and Investments Commission (ASIC)',
      number: 'AFSL: 654321'
    }
  ];

  return (
    <>
      <Head>
        <title>{t('about:pageTitle', 'Company Profile | BitDash')}</title>
        <meta name="description" content={t('about:metaDescription', 'Learn about BitDash, our history, mission, and regulatory status in the global financial technology landscape.')} />
      </Head>
      
      <Layout>
        <Box 
            w="full" 
            position="relative"
            overflow="hidden"
        >
            {/* Hero Section */}
            <Box 
            position="relative"
            py={20}
            >
            
            <Container maxW="container.xl" position="relative" zIndex={1}>
                <Stack spacing={8} align="center" textAlign="center">
                <VStack spacing={3}>
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
                    {t('about:title', 'Pioneering Financial Technology')}
                    </Heading>
                </VStack>
                
                <Text 
                    fontSize={textSize} 
                    maxW="3xl" 
                    color={isDark ? "gray.300" : "gray.700"}
                >
                    {t('about:introduction', 'BitDash is a leading fintech company offering integrated trading, investment, and payment solutions. Our mission is to empower users with accessible financial tools that help them achieve their financial goals with confidence.')}
                </Text>
                </Stack>
            </Container>
            </Box>
            
            {/* Stats Section */}
            <Box py={10}>
            <Container maxW="container.xl">
                <SimpleGrid columns={statGridColumns} spacing={8} my={8}>
                {companyStats.map((stat, index) => (
                    <Box 
                    key={index} 
                    p={6} 
                    bg={isDark ? "gray.800" : "white"} 
                    borderRadius="lg" 
                    boxShadow="md" 
                    textAlign="center"
                    transition="all 0.3s"
                    _hover={{
                        transform: "translateY(-5px)",
                        boxShadow: "lg"
                    }}
                    >
                    <VStack spacing={3}>
                        <Icon 
                        as={stat.icon} 
                        w={10} 
                        h={10} 
                        color={isDark ? "brand.bitdash.400" : "brand.bitdash.500"} 
                        />
                        <Text 
                        fontSize="3xl" 
                        fontWeight="bold"
                        color={isDark ? "white" : "gray.800"}
                        >
                        {stat.value}
                        </Text>
                        <Text 
                        fontSize={textSize} 
                        color={isDark ? "gray.400" : "gray.600"}
                        >
                        {stat.label}
                        </Text>
                    </VStack>
                    </Box>
                ))}
                </SimpleGrid>
            </Container>
            </Box>
            
            {/* About Us Section */}
            <Box py={16}>
            <Container maxW="container.xl">
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10} alignItems="center">
                <Box position="relative" height={{ base: "300px", md: "400px" }}>
                    <Image
                    src="/about-company.jpg"
                    alt={t('about:imageAlt', 'BitDash office with team members collaborating')}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{
                        objectFit: 'cover',
                        borderRadius: '1rem'
                    }}
                    priority
                    />
                </Box>
                
                <Stack spacing={6}>
                    <Heading 
                    as="h2" 
                    size={subheadingSize} 
                    color={isDark ? "white" : "gray.800"}
                    >
                    {t('about:aboutUs.title', 'Who We Are')}
                    </Heading>
                    
                    <Text fontSize={textSize} color={isDark ? "gray.300" : "gray.700"}>
                    {t('about:aboutUs.paragraph1', 'BitDash was founded with a clear vision: to democratize access to financial markets and services for everyone. What began as a small fintech startup has grown into a global company with offices in major financial hubs around the world.')}
                    </Text>
                    
                    <Text fontSize={textSize} color={isDark ? "gray.300" : "gray.700"}>
                    {t('about:aboutUs.paragraph2', 'Our multi-platform approach combines trading, investment, and payment solutions under one ecosystem, all powered by our proprietary technology and backed by stringent security measures. We believe that financial tools should be accessible, transparent, and easy to use for everyone, regardless of their background or experience.')}
                    </Text>
                    
                    <HStack 
                    spacing={4} 
                    pt={4} 
                    wrap="wrap" 
                    justify={{ base: "center", md: "flex-start" }}
                    >
                    <Badge 
                        px={3} 
                        py={1} 
                        borderRadius="full" 
                        colorScheme="brand.forex" 
                        fontSize={textSize}
                    >
                        {t('about:values.innovation', 'Innovation')}
                    </Badge>
                    <Badge 
                        px={3} 
                        py={1} 
                        borderRadius="full" 
                        colorScheme="brand.stocks" 
                        fontSize={textSize}
                    >
                        {t('about:values.integrity', 'Integrity')}
                    </Badge>
                    <Badge 
                        px={3} 
                        py={1} 
                        borderRadius="full" 
                        colorScheme="brand.crypto" 
                        fontSize={textSize}
                    >
                        {t('about:values.accessibility', 'Accessibility')}
                    </Badge>
                    <Badge 
                        px={3} 
                        py={1} 
                        borderRadius="full" 
                        colorScheme="brand.cash" 
                        fontSize={textSize}
                    >
                        {t('about:values.security', 'Security')}
                    </Badge>
                    </HStack>
                </Stack>
                </SimpleGrid>
            </Container>
            </Box>
            
            {/* History Timeline */}
            <Box py={16}>
            <Container maxW="container.xl">
                <Stack spacing={10} align="center">
                <Stack spacing={3} textAlign="center" maxW="3xl">
                    <Heading 
                    as="h2" 
                    size={subheadingSize} 
                    color={isDark ? "white" : "gray.800"}
                    >
                    {t('about:history.title', 'Our Journey')}
                    </Heading>
                    <Text 
                    fontSize={textSize} 
                    color={isDark ? "gray.300" : "gray.700"}
                    >
                    {t('about:history.subtitle', 'Discover key milestones in our evolution from a small startup to a global financial technology leader.')}
                    </Text>
                </Stack>
                
                <SimpleGrid columns={historyGridColumns} spacing={8} w="full">
                    {companyHistory.map((milestone, index) => (
                    <Box 
                        key={index} 
                        p={6} 
                        bg={isDark ? "gray.800" : "white"} 
                        borderRadius="lg" 
                        boxShadow="md"
                        position="relative"
                        _before={index % 2 === 0 ? {
                        content: '""',
                        position: "absolute",
                        top: "50%",
                        right: "-5px",
                        width: "10px",
                        height: "10px",
                        bg: isDark ? "brand.bitdash.400" : "brand.bitdash.500",
                        borderRadius: "full",
                        transform: "translateY(-50%)",
                        display: { base: "none", md: "block" }
                        } : {
                        content: '""',
                        position: "absolute",
                        top: "50%",
                        left: "-5px",
                        width: "10px",
                        height: "10px",
                        bg: isDark ? "brand.bitdash.400" : "brand.bitdash.500",
                        borderRadius: "full",
                        transform: "translateY(-50%)",
                        display: { base: "none", md: "block" }
                        }}
                    >
                        <VStack align="start" spacing={3}>
                        <Badge 
                            colorScheme="brand.bitdash" 
                            px={2} 
                            py={1} 
                            borderRadius="md" 
                            fontSize={textSize}
                        >
                            {milestone.year}
                        </Badge>
                        <Text 
                            fontWeight="bold" 
                            fontSize={subheadingSize}
                            color={isDark ? "white" : "gray.800"}
                        >
                            {milestone.title}
                        </Text>
                        <Text fontSize={textSize} color={isDark ? "gray.300" : "gray.700"}>
                            {milestone.description}
                        </Text>
                        </VStack>
                    </Box>
                    ))}
                </SimpleGrid>
                </Stack>
            </Container>
            </Box>
            
            {/* Regulatory and Licenses */}
            <Box py={16}>
            <Container maxW="container.xl">
                <Stack spacing={10}>
                <Stack spacing={3} textAlign="center" maxW="3xl" mx="auto">
                    <Heading 
                    as="h2" 
                    size={subheadingSize} 
                    color={isDark ? "white" : "gray.800"}
                    >
                    {t('about:regulatory.title', 'Regulatory Status')}
                    </Heading>
                    <Text 
                    fontSize={textSize} 
                    color={isDark ? "gray.300" : "gray.700"}
                    >
                    {t('about:regulatory.subtitle', 'BitDash operates with full regulatory compliance across multiple jurisdictions. Our licenses ensure that we meet the highest standards of financial service operation.')}
                    </Text>
                </Stack>
                
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                    {licenses.map((license, index) => (
                    <Box 
                        key={index} 
                        p={6} 
                        bg={isDark ? "gray.700" : "white"} 
                        borderRadius="lg" 
                        boxShadow="md"
                        transition="all 0.3s"
                        _hover={{
                        transform: "translateY(-5px)",
                        boxShadow: "lg"
                        }}
                    >
                        <VStack align="start" spacing={4}>
                        <Icon 
                            as={FaShieldAlt} 
                            w={8} 
                            h={8} 
                            color={isDark ? "brand.bitdash.400" : "brand.bitdash.500"} 
                        />
                        <Text 
                            fontWeight="bold" 
                            fontSize={textSize}
                            color={isDark ? "white" : "gray.800"}
                        >
                            {license.region}
                        </Text>
                        <Divider borderColor={isDark ? "gray.600" : "gray.200"} />
                        <VStack align="start" spacing={1}>
                            <Text fontSize={textSize} color={isDark ? "gray.300" : "gray.700"}>
                            {license.authority}
                            </Text>
                            <Text 
                            fontSize="sm" 
                            fontWeight="medium" 
                            color={isDark ? "brand.bitdash.400" : "brand.bitdash.600"}
                            >
                            {license.number}
                            </Text>
                        </VStack>
                        </VStack>
                    </Box>
                    ))}
                </SimpleGrid>
                
                <Box 
                    mt={6} 
                    p={6} 
                    borderRadius="lg" 
                    boxShadow="md"
                >
                    <Text fontSize="sm" color={isDark ? "gray.400" : "gray.600"} textAlign="center">
                    {t('about:regulatory.disclaimer', 'The services offered by BitDash may be subject to different regulations depending on your country of residence. Please ensure that you are aware of and comply with any relevant laws in your jurisdiction before using our services.')}
                    </Text>
                </Box>
                </Stack>
            </Container>
            </Box>
        </Box>
      </Layout>
    </>
  );
}