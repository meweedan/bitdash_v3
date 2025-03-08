import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Stack,
  VStack,
  HStack,
  useColorMode,
  useBreakpointValue,
  Badge,
  InputGroup,
  Input,
  InputLeftElement,
  Button,
  Divider,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  Icon,
  Link,
  Skeleton,
  Alert,
  AlertIcon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react';
import { FaSearch, FaMapMarkerAlt, FaBriefcase, FaLaptopCode, FaChartLine, FaHeadset, FaUsers, FaUpload, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import Head from 'next/head';
import Layout from '@/components/Layout';

// Get server-side translations
export async function getServerSideProps({ locale }) {
  try {
    // Fetch careers data from Strapi API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/careers?populate=*&locale=${locale}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'careers'])),
        initialCareers: data.data || [],
        apiError: null
      },
    };
  } catch (error) {
    console.error('Error fetching careers data:', error);
    
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'careers'])),
        initialCareers: [],
        apiError: error.message
      },
    };
  }
}

// Career types with icons for filtering
const careerTypes = [
  { id: 'all', label: 'All Departments', icon: FaUsers },
  { id: 'engineering', label: 'Engineering', icon: FaLaptopCode },
  { id: 'business', label: 'Business', icon: FaChartLine },
  { id: 'customer-service', label: 'Customer Service', icon: FaHeadset },
  { id: 'operations', label: 'Operations', icon: FaBriefcase }
];

// Locations for filtering
const locations = [
  { id: 'all', label: 'All Locations' },
  { id: 'london', label: 'London' },
  { id: 'singapore', label: 'Singapore' },
  { id: 'new-york', label: 'New York' },
  { id: 'dubai', label: 'Dubai' },
  { id: 'sydney', label: 'Sydney' },
  { id: 'remote', label: 'Remote' }
];

export default function CareersPage({ initialCareers, apiError }) {
  const { t, i18n } = useTranslation(['common', 'careers']);
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const isRTL = i18n.language === 'ar' || i18n.language === 'he';
  
  // Responsive settings
  const headingSize = useBreakpointValue({ base: 'xl', md: '2xl' });
  const subheadingSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const textSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const valuesGridColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 });
  
  // State for job listings
  const [careers, setCareers] = useState(initialCareers);
  const [filteredCareers, setFilteredCareers] = useState(initialCareers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(apiError);
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  
  // Modal for job application
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Apply filters whenever search or filter criteria change
  useEffect(() => {
    let results = [...careers];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(job => 
        job.attributes.title.toLowerCase().includes(query) || 
        job.attributes.description.toLowerCase().includes(query) ||
        job.attributes.requirements.toLowerCase().includes(query)
      );
    }
    
    // Filter by department
    if (selectedDepartment !== 'all') {
      results = results.filter(job => job.attributes.department === selectedDepartment);
    }
    
    // Filter by location
    if (selectedLocation !== 'all') {
      results = results.filter(job => job.attributes.location === selectedLocation);
    }
    
    setFilteredCareers(results);
  }, [searchQuery, selectedDepartment, selectedLocation, careers]);
  
  // Handle job card click
  const handleJobClick = (job) => {
    setSelectedJob(job);
    onOpen();
  };
  
  // Mock function to handle job application submission
  const handleSubmitApplication = (e) => {
    e.preventDefault();
    // In a real application, this would upload the resume and submit the form data
    alert(t('careers:applicationSuccess', 'Application submitted successfully! We will review your application and contact you soon.'));
    onClose();
  };

  // Company values and benefits that we offer
  const companyValues = [
    {
      title: t('careers:values.innovation.title', 'Innovation'),
      description: t('careers:values.innovation.description', 'We encourage creative thinking and embrace new technologies to solve complex financial challenges.'),
      icon: FaLaptopCode
    },
    {
      title: t('careers:values.collaboration.title', 'Collaboration'),
      description: t('careers:values.collaboration.description', 'We believe in the power of diverse teams working together toward common goals.'),
      icon: FaUsers
    },
    {
      title: t('careers:values.excellence.title', 'Excellence'),
      description: t('careers:values.excellence.description', 'We strive for the highest standards in everything we do, from code quality to customer service.'),
      icon: FaChartLine
    },
    {
      title: t('careers:values.integrity.title', 'Integrity'),
      description: t('careers:values.integrity.description', 'We operate with transparency, ethical practices, and a commitment to doing what\'s right.'),
      icon: FaHeadset
    },
    {
      title: t('careers:values.growth.title', 'Growth'),
      description: t('careers:values.growth.description', 'We invest in our team members\' professional development and personal growth.'),
      icon: FaChartLine
    },
    {
      title: t('careers:values.impact.title', 'Impact'),
      description: t('careers:values.impact.description', 'W\'re committed to making a positive difference in how people manage their finances worldwide.'),
      icon: FaUsers
    }
  ];
  
  // Benefits we offer
  const benefits = {
    professional: [
      t('careers:benefits.professional.development', 'Professional development budget'),
      t('careers:benefits.professional.mentoring', 'Internal mentoring program'),
      t('careers:benefits.professional.conferences', 'Conference attendance opportunities'),
      t('careers:benefits.professional.training', 'Regular training workshops')
    ],
    health: [
      t('careers:benefits.health.insurance', 'Comprehensive health insurance'),
      t('careers:benefits.health.wellness', 'Wellness programs'),
      t('careers:benefits.health.mental', 'Mental health support'),
      t('careers:benefits.health.gym', 'Gym membership subsidy')
    ],
    work: [
      t('careers:benefits.work.flexible', 'Flexible working hours'),
      t('careers:benefits.work.remote', 'Remote work options'),
      t('careers:benefits.work.vacation', 'Generous vacation policy'),
      t('careers:benefits.work.sabbatical', 'Sabbatical program')
    ],
    financial: [
      t('careers:benefits.financial.equity', 'Equity options'),
      t('careers:benefits.financial.retirement', 'Retirement plans'),
      t('careers:benefits.financial.bonus', 'Performance bonuses'),
      t('careers:benefits.financial.assistance', 'Relocation assistance')
    ]
  };

  return (
    <>
      <Head>
        <title>{t('careers:pageTitle', 'Careers at BitDash | Join Our Team')}</title>
        <meta name="description" content={t('careers:metaDescription', 'Explore exciting career opportunities at BitDash. Join our innovative team and help revolutionize the financial technology landscape.')} />
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
                    {t('careers:title', 'Build Your Career at BitDash')}
                  </Heading>
                </VStack>
                
                <Text 
                  fontSize={textSize} 
                  color={isDark ? "gray.300" : "gray.700"}
                >
                  {t('careers:introduction', 'Join our diverse team of innovators, creators, and problem-solvers. At BitDash, you\'ll work on challenging projects that transform how people interact with financial technology worldwide.')}
                </Text>
                
                <HStack spacing={4} wrap="wrap">
                  <Button
                    as="a"
                    href="#openings"
                    px={6}
                    py={6}
                    height="auto"
                    bg={isDark ? "brand.bitdash.600" : "brand.bitdash.500"}
                    color="white"
                    fontWeight="medium"
                    fontSize="sm"
                    borderRadius="full"
                    _hover={{
                      bg: isDark ? "brand.bitdash.500" : "brand.bitdash.600",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.3s ease"
                  >
                    {t('careers:viewOpenings', 'View Current Openings')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    px={6}
                    py={6}
                    height="auto"
                    borderColor={isDark ? "brand.bitdash.600" : "brand.bitdash.500"}
                    color={isDark ? "brand.bitdash.500" : "brand.bitdash.600"}
                    fontWeight="medium"
                    fontSize="sm"
                    borderRadius="full"
                    _hover={{
                      bg: isDark ? "whiteAlpha.100" : "blackAlpha.50",
                      transform: "translateY(-2px)",
                    }}
                    as="a"
                    href="#company-culture"
                    transition="all 0.3s ease"
                  >
                    {t('careers:exploreCulture', 'Explore Our Culture')}
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
                  src="/careers/team-collaboration.jpg"
                  alt={t('careers:heroImageAlt', 'BitDash team members collaborating in a modern office')}
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
        
        {/* Company Culture Section */}
        <Box py={16} id="company-culture">
          <Container maxW="container.xl">
            <VStack spacing={12}>
              <VStack spacing={3} textAlign="center">
                <Heading 
                  as="h2" 
                  size={subheadingSize} 
                  color={isDark ? "white" : "gray.800"}
                >
                  {t('careers:cultureTitle', 'Our Culture & Values')}
                </Heading>
                <Text 
                  fontSize={textSize} 
                  color={isDark ? "gray.300" : "gray.700"}
                  maxW="3xl"
                >
                  {t('careers:cultureDescription', 'At BitDash, our culture is built on collaboration, innovation, and a shared commitment to excellence. Our values guide everything we do and shape the environment where our team thrives.')}
                </Text>
              </VStack>
              
              <SimpleGrid columns={valuesGridColumns} spacing={8} w="full">
                {companyValues.map((value, index) => (
                  <Box 
                    key={index} 
                    bg={isDark ? "gray.800" : "white"}
                    p={6}
                    borderRadius="lg"
                    boxShadow="md"
                    transition="all 0.3s"
                    _hover={{
                      transform: "translateY(-5px)",
                      boxShadow: "lg"
                    }}
                  >
                    <VStack spacing={4} align="start">
                      <Icon 
                        as={value.icon} 
                        w={10} 
                        h={10} 
                        color={isDark ? "brand.bitdash.400" : "brand.bitdash.500"} 
                      />
                      <Heading 
                        as="h3" 
                        size="md" 
                        color={isDark ? "white" : "gray.800"}
                      >
                        {value.title}
                      </Heading>
                      <Text 
                        fontSize={textSize} 
                        color={isDark ? "gray.300" : "gray.700"}
                      >
                        {value.description}
                      </Text>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>
        
        {/* Benefits Section */}
        <Box py={16}>
          <Container maxW="container.xl">
            <VStack spacing={12}>
              <VStack spacing={3} textAlign="center">
                <Heading 
                  as="h2" 
                  size={subheadingSize} 
                  color={isDark ? "white" : "gray.800"}
                >
                  {t('careers:benefitsTitle', 'Benefits & Perks')}
                </Heading>
                <Text 
                  fontSize={textSize} 
                  color={isDark ? "gray.300" : "gray.700"}
                  maxW="3xl"
                >
                  {t('careers:benefitsDescription', 'We believe in taking care of our team members. At BitDash, you\'ll enjoy a comprehensive benefits package designed to support your well-being, professional growth, and work-life balance.')}
                </Text>
              </VStack>
              
              <Tabs 
                variant="soft-rounded" 
                colorScheme="brand.bitdash" 
                align="center" 
                w="full"
                size={useBreakpointValue({ base: "sm", md: "md" })}
              >
                <TabList 
                  mb={8}
                  display="flex"
                  flexWrap="wrap"
                  justifyContent="center"
                  borderBottom="1px solid"
                  borderColor={isDark ? "gray.700" : "gray.200"}
                  pb={4}
                >
                  <Tab 
                    mx={2} 
                    mb={2}
                    color={isDark ? "gray.300" : "gray.700"}
                    _selected={{ 
                      color: isDark ? "white" : "gray.800",
                      bg: isDark ? "brand.bitdash.900" : "brand.bitdash.100",
                      fontWeight: "medium"
                    }}
                  >
                    {t('careers:benefitsTabs.professional', 'Professional Growth')}
                  </Tab>
                  <Tab 
                    mx={2} 
                    mb={2}
                    color={isDark ? "gray.300" : "gray.700"}
                    _selected={{ 
                      color: isDark ? "white" : "gray.800",
                      bg: isDark ? "brand.bitdash.900" : "brand.bitdash.100",
                      fontWeight: "medium"
                    }}
                  >
                    {t('careers:benefitsTabs.health', 'Health & Wellness')}
                  </Tab>
                  <Tab 
                    mx={2} 
                    mb={2}
                    color={isDark ? "gray.300" : "gray.700"}
                    _selected={{ 
                      color: isDark ? "white" : "gray.800",
                      bg: isDark ? "brand.bitdash.900" : "brand.bitdash.100",
                      fontWeight: "medium"
                    }}
                  >
                    {t('careers:benefitsTabs.work', 'Work-Life Balance')}
                  </Tab>
                  <Tab 
                    mx={2} 
                    mb={2}
                    color={isDark ? "gray.300" : "gray.700"}
                    _selected={{ 
                      color: isDark ? "white" : "gray.800",
                      bg: isDark ? "brand.bitdash.900" : "brand.bitdash.100",
                      fontWeight: "medium"
                    }}
                  >
                    {t('careers:benefitsTabs.financial', 'Financial Benefits')}
                  </Tab>
                </TabList>
                
                <TabPanels>
                  {/* Professional Growth Benefits */}
                  <TabPanel>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                      <Box 
                        position="relative" 
                        height={{ base: "250px", md: "100%" }}
                        borderRadius="lg"
                        overflow="hidden"
                      >
                        <Image
                          src="/careers/professional-growth.jpg"
                          alt={t('careers:images.professionalGrowth', 'Professional development at BitDash')}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                      <VStack align="start" spacing={6}>
                        <Heading 
                          as="h3" 
                          size="md" 
                          color={isDark ? "white" : "gray.800"}
                        >
                          {t('careers:benefitsTabs.professional', 'Professional Growth')}
                        </Heading>
                        <Text
                          fontSize={textSize} 
                          color={isDark ? "gray.300" : "gray.700"}
                        >
                          {t('careers:professionalDescription', 'We invest in our team members\' professional development, offering resources and opportunities to expand your skills and advance your career.')}
                        </Text>
                        
                        <VStack align="start" spacing={3} width="full">
                          {benefits.professional.map((benefit, index) => (
                            <HStack key={index} spacing={3} align="start">
                              <Box color={isDark ? "brand.bitdash.400" : "brand.bitdash.500"} mt={1}>
                                <Icon as={FaCheckCircle} boxSize={4} />
                              </Box>
                              <Text fontSize={textSize} color={isDark ? "gray.300" : "gray.700"}>
                                {benefit}
                              </Text>
                            </HStack>
                          ))}
                        </VStack>
                      </VStack>
                    </SimpleGrid>
                  </TabPanel>
                  
                  {/* Health & Wellness Benefits */}
                  <TabPanel>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                      <Box 
                        position="relative" 
                        height={{ base: "250px", md: "100%" }}
                        borderRadius="lg"
                        overflow="hidden"
                      >
                        <Image
                          src="/careers/health-wellness.jpg"
                          alt={t('careers:images.healthWellness', 'Health and wellness programs at BitDash')}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                      <VStack align="start" spacing={6}>
                        <Heading 
                          as="h3" 
                          size="md" 
                          color={isDark ? "white" : "gray.800"}
                        >
                          {t('careers:benefitsTabs.health', 'Health & Wellness')}
                        </Heading>
                        <Text
                          fontSize={textSize} 
                          color={isDark ? "gray.300" : "gray.700"}
                        >
                          {t('careers:healthDescription', 'Your well-being matters. We provide comprehensive programs to support your physical and mental health.')}
                        </Text>
                        
                        <VStack align="start" spacing={3} width="full">
                          {benefits.health.map((benefit, index) => (
                            <HStack key={index} spacing={3} align="start">
                              <Box color={isDark ? "brand.bitdash.400" : "brand.bitdash.500"} mt={1}>
                                <Icon as={FaCheckCircle} boxSize={4} />
                              </Box>
                              <Text fontSize={textSize} color={isDark ? "gray.300" : "gray.700"}>
                                {benefit}
                              </Text>
                            </HStack>
                          ))}
                        </VStack>
                      </VStack>
                    </SimpleGrid>
                  </TabPanel>
                  
                  {/* Work-Life Balance Benefits */}
                  <TabPanel>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                      <Box 
                        position="relative" 
                        height={{ base: "250px", md: "100%" }}
                        borderRadius="lg"
                        overflow="hidden"
                      >
                        <Image
                          src="/careers/work-life.jpg"
                          alt={t('careers:images.workLife', 'Work-life balance at BitDash')}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                      <VStack align="start" spacing={6}>
                        <Heading 
                          as="h3" 
                          size="md" 
                          color={isDark ? "white" : "gray.800"}
                        >
                          {t('careers:benefitsTabs.work', 'Work-Life Balance')}
                        </Heading>
                        <Text
                          fontSize={textSize} 
                          color={isDark ? "gray.300" : "gray.700"}
                        >
                          {t('careers:workDescription', 'We respect your life outside of work and offer flexibility to help you maintain a healthy balance.')}
                        </Text>
                        
                        <VStack align="start" spacing={3} width="full">
                          {benefits.work.map((benefit, index) => (
                            <HStack key={index} spacing={3} align="start">
                              <Box color={isDark ? "brand.bitdash.400" : "brand.bitdash.500"} mt={1}>
                                <Icon as={FaCheckCircle} boxSize={4} />
                              </Box>
                              <Text fontSize={textSize} color={isDark ? "gray.300" : "gray.700"}>
                                {benefit}
                              </Text>
                            </HStack>
                          ))}
                        </VStack>
                      </VStack>
                    </SimpleGrid>
                  </TabPanel>
                  
                  {/* Financial Benefits */}
                  <TabPanel>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                      <Box 
                        position="relative" 
                        height={{ base: "250px", md: "100%" }}
                        borderRadius="lg"
                        overflow="hidden"
                      >
                        <Image
                          src="/careers/financial.jpg"
                          alt={t('careers:images.financial', 'Financial benefits at BitDash')}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                      <VStack align="start" spacing={6}>
                        <Heading 
                          as="h3" 
                          size="md" 
                          color={isDark ? "white" : "gray.800"}
                        >
                          {t('careers:benefitsTabs.financial', 'Financial Benefits')}
                        </Heading>
                        <Text
                          fontSize={textSize} 
                          color={isDark ? "gray.300" : "gray.700"}
                        >
                          {t('careers:financialDescription', 'We offer competitive compensation and benefits to reward your contributions and help you build financial security.')}
                        </Text>
                        
                        <VStack align="start" spacing={3} width="full">
                          {benefits.financial.map((benefit, index) => (
                            <HStack key={index} spacing={3} align="start">
                              <Box color={isDark ? "brand.bitdash.400" : "brand.bitdash.500"} mt={1}>
                                <Icon as={FaCheckCircle} boxSize={4} />
                              </Box>
                              <Text fontSize={textSize} color={isDark ? "gray.300" : "gray.700"}>
                                {benefit}
                              </Text>
                            </HStack>
                          ))}
                        </VStack>
                      </VStack>
                    </SimpleGrid>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          </Container>
        </Box>
        
        {/* Current Openings Section */}
        <Box py={16} id="openings">
          <Container maxW="container.xl">
            <VStack spacing={12} align="stretch">
              <VStack spacing={3} textAlign="center">
                <Heading 
                  as="h2" 
                  size={subheadingSize} 
                  color={isDark ? "white" : "gray.800"}
                >
                  {t('careers:openingsTitle', 'Current Openings')}
                </Heading>
                <Text 
                  fontSize={textSize} 
                  color={isDark ? "gray.300" : "gray.700"}
                  maxW="3xl"
                  mx="auto"
                >
                  {t('careers:openingsDescription', 'Browse our current job opportunities and find your perfect role at BitDash. We\'re looking for talented individuals to join our team across various departments.')}
                </Text>
              </VStack>
              
              {/* Search and Filters */}
              <Box>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  {/* Search Input */}
                  <InputGroup size="md">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaSearch} color={isDark ? "gray.400" : "gray.500"} />
                    </InputLeftElement>
                    <Input
                      placeholder={t('careers:searchPlaceholder', 'Search jobs...')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      bg={isDark ? "gray.700" : "white"}
                      borderRadius="md"
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                  </InputGroup>
                  
                  {/* Department Filter */}
                  <Select
                    placeholder={t('careers:departmentFilter', 'Filter by department')}
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    bg={isDark ? "gray.700" : "white"}
                    borderRadius="md"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {careerTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {t(`careers:departments.${type.id}`, type.label)}
                      </option>
                    ))}
                  </Select>
                  
                  {/* Location Filter */}
                  <Select
                    placeholder={t('careers:locationFilter', 'Filter by location')}
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    bg={isDark ? "gray.700" : "white"}
                    borderRadius="md"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {t(`careers:locations.${location.id}`, location.label)}
                      </option>
                    ))}
                  </Select>
                </SimpleGrid>
              </Box>
              
              {/* Job Listings */}
              <Box>
                {loading ? (
                  <VStack spacing={4}>
                    {[1, 2, 3].map((i) => (
                      <Skeleton 
                        key={i} 
                        height="150px" 
                        width="100%" 
                        borderRadius="lg"
                      />
                    ))}
                  </VStack>
                ) : error ? (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <Text>{t('careers:apiError', 'There was an error loading job listings. Please try again later.')}</Text>
                  </Alert>
                ) : filteredCareers.length === 0 ? (
                  <Box 
                    py={8} 
                    textAlign="center" 
                    bg={isDark ? "gray.700" : "gray.50"} 
                    borderRadius="lg"
                  >
                    <VStack spacing={4}>
                      <Text fontSize="lg" fontWeight="medium" color={isDark ? "white" : "gray.800"}>
                        {t('careers:noJobsFound', 'No jobs matching your criteria')}
                      </Text>
                      <Text fontSize={textSize} color={isDark ? "gray.300" : "gray.600"}>
                        {t('careers:tryAdjusting', 'Try adjusting your filters or search query')}
                      </Text>
                      <Button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedDepartment('all');
                          setSelectedLocation('all');
                        }}
                        variant="outline"
                        colorScheme="brand.bitdash"
                        size="sm"
                      >
                        {t('careers:clearFilters', 'Clear all filters')}
                      </Button>
                    </VStack>
                  </Box>
                ) : (
                  <VStack spacing={4} align="stretch">
                    {filteredCareers.map((job) => (
                      <Box
                        key={job.id}
                        p={6}
                        bg={isDark ? "gray.800" : "white"}
                        borderRadius="lg"
                        boxShadow="md"
                        onClick={() => handleJobClick(job)}
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{
                          transform: "translateY(-2px)",
                          boxShadow: "lg"
                        }}
                      >
                        <HStack justifyContent="space-between" flexWrap="wrap">
                          <VStack align="start" spacing={2} flex="1" minW="250px">
                            <Heading 
                              as="h3" 
                              size="md" 
                              color={isDark ? "white" : "gray.800"}
                            >
                              {job.attributes.title}
                            </Heading>
                            
                            <HStack spacing={4}>
                              <Badge colorScheme="brand.bitdash">
                                {t(`careers:departments.${job.attributes.department}`, 
                                  careerTypes.find(d => d.id === job.attributes.department)?.label || job.attributes.department
                                )}
                              </Badge>
                              
                              <HStack color={isDark ? "gray.400" : "gray.600"} fontSize="sm">
                                <Icon as={FaMapMarkerAlt} />
                                <Text>
                                  {t(`careers:locations.${job.attributes.location}`, 
                                    locations.find(l => l.id === job.attributes.location)?.label || job.attributes.location
                                  )}
                                </Text>
                              </HStack>
                            </HStack>
                          </VStack>
                          
                          <Button
                            variant="outline"
                            colorScheme="brand.bitdash"
                            size="sm"
                            mt={{ base: 4, md: 0 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJobClick(job);
                            }}
                          >
                            {t('careers:viewDetails', 'View Details')}
                          </Button>
                        </HStack>
                        
                        <Divider my={4} borderColor={isDark ? "gray.700" : "gray.200"} />
                        
                        <Text 
                          fontSize="sm" 
                          color={isDark ? "gray.300" : "gray.700"}
                          noOfLines={2}
                        >
                          {job.attributes.shortDescription || job.attributes.description.substring(0, 150) + '...'}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                )}
              </Box>
              
              {/* No Suitable Positions Note */}
              <Box
                p={6}
                borderRadius="lg"
                textAlign="center"
              >
                <VStack spacing={4}>
                  <Text fontWeight="medium" color={isDark ? "white" : "gray.800"}>
                    {t('careers:noSuitablePositions', 'Don\'t see a suitable position?')}
                  </Text>
                  <Text fontSize={textSize} color={isDark ? "gray.300" : "gray.700"}>
                    {t('careers:speculative', 'We\'re always interested in hearing from talented individuals. Send us your CV for future opportunities.')}
                  </Text>
                  <Button
                    as="a"
                    variant="bitdash-solid"
                    href="mailto:careers@bitdash.app"
                    colorScheme="brand.bitdash"
                    leftIcon={<FaPaperPlane />}
                    size="md"
                  >
                    {t('careers:sendCV', 'Send Your CV')}
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </Container>
        </Box>
        
        {/* Application Process */}
        <Box py={16}>
          <Container maxW="container.xl">
            <VStack spacing={10}>
              <VStack spacing={3} textAlign="center">
                <Heading 
                  as="h2" 
                  size={subheadingSize} 
                  color={isDark ? "white" : "gray.800"}
                >
                  {t('careers:processTitle', 'Our Application Process')}
                </Heading>
                <Text 
                  fontSize={textSize} 
                  color={isDark ? "gray.300" : "gray.700"}
                  maxW="3xl"
                >
                  {t('careers:processDescription', 'We\'ve designed a transparent hiring process that helps us get to know you better while giving you insight into our team and how we work.')}
                </Text>
              </VStack>
              
              <Accordion allowToggle width="100%" maxW="3xl" mx="auto">
                <AccordionItem 
                  mb={4} 
                  border="none" 
                  bg={isDark ? "gray.700" : "white"} 
                  borderRadius="lg"
                  overflow="hidden"
                >
                  <h3>
                    <AccordionButton 
                      py={4} 
                      px={6}
                      _hover={{ bg: isDark ? "gray.600" : "gray.50" }}
                    >
                      <HStack flex="1" textAlign="left" spacing={4}>
                        <Text 
                          bg={isDark ? "brand.bitdash.800" : "brand.bitdash.100"} 
                          color={isDark ? "brand.bitdash.200" : "brand.bitdash.800"}
                          borderRadius="full" 
                          w={8} 
                          h={8} 
                          display="flex" 
                          alignItems="center" 
                          justifyContent="center"
                          fontWeight="bold"
                        >
                          1
                        </Text>
                        <Text fontWeight="medium" color={isDark ? "white" : "gray.800"}>
                          {t('careers:process.application.title', 'Application Submission')}
                        </Text>
                      </HStack>
                      <AccordionIcon color={isDark ? "brand.bitdash.400" : "brand.bitdash.500"} />
                    </AccordionButton>
                  </h3>
                  <AccordionPanel pb={4} px={6} bg={isDark ? "gray.700" : "white"}>
                    <Text fontSize={textSize} color={isDark ? "gray.300" : "gray.700"}>
                      {t('careers:process.application.description', 'Submit your application through our careers portal. Include your resume/CV and a brief cover letter explaining why you\'re interested in the role and how your experience aligns with our requirements.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
                
                <AccordionItem 
                  mb={4} 
                  border="none" 
                  bg={isDark ? "gray.700" : "white"} 
                  borderRadius="lg"
                  overflow="hidden"
                >
                  <h3>
                    <AccordionButton 
                      py={4} 
                      px={6}
                      _hover={{ bg: isDark ? "gray.600" : "gray.50" }}
                    >
                      <HStack flex="1" textAlign="left" spacing={4}>
                        <Text 
                          bg={isDark ? "brand.bitdash.800" : "brand.bitdash.100"} 
                          color={isDark ? "brand.bitdash.200" : "brand.bitdash.800"}
                          borderRadius="full" 
                          w={8} 
                          h={8} 
                          display="flex" 
                          alignItems="center" 
                          justifyContent="center"
                          fontWeight="bold"
                        >
                          2
                        </Text>
                        <Text fontWeight="medium" color={isDark ? "white" : "gray.800"}>
                          {t('careers:process.screening.title', 'Initial Screening')}
                        </Text>
                      </HStack>
                      <AccordionIcon color={isDark ? "brand.bitdash.400" : "brand.bitdash.500"} />
                    </AccordionButton>
                  </h3>
                  <AccordionPanel pb={4} px={6} bg={isDark ? "gray.700" : "white"}>
                    <Text fontSize={textSize} color={isDark ? "gray.300" : "gray.700"}>
                      {t('careers:process.screening.description', 'Our recruitment team will review your application and may contact you for a brief phone or video screening to discuss your background and interest in the role.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
                
                <AccordionItem 
                  mb={4} 
                  border="none" 
                  bg={isDark ? "gray.700" : "white"} 
                  borderRadius="lg"
                  overflow="hidden"
                >
                  <h3>
                    <AccordionButton 
                      py={4} 
                      px={6}
                      _hover={{ bg: isDark ? "gray.600" : "gray.50" }}
                    >
                      <HStack flex="1" textAlign="left" spacing={4}>
                        <Text 
                          bg={isDark ? "brand.bitdash.800" : "brand.bitdash.100"} 
                          color={isDark ? "brand.bitdash.200" : "brand.bitdash.800"}
                          borderRadius="full" 
                          w={8} 
                          h={8} 
                          display="flex" 
                          alignItems="center" 
                          justifyContent="center"
                          fontWeight="bold"
                        >
                          3
                        </Text>
                        <Text fontWeight="medium" color={isDark ? "white" : "gray.800"}>
                          {t('careers:process.assessment.title', 'Skills Assessment')}
                        </Text>
                      </HStack>
                      <AccordionIcon color={isDark ? "brand.bitdash.400" : "brand.bitdash.500"} />
                    </AccordionButton>
                  </h3>
                  <AccordionPanel pb={4} px={6} bg={isDark ? "gray.700" : "white"}>
                    <Text fontSize={textSize} color={isDark ? "gray.300" : "gray.700"}>
                      {t('careers:process.assessment.description', 'Depending on the role, you may be asked to complete a skills assessment, technical challenge, or portfolio review to demonstrate your expertise. We design these to be respectful of your time while showcasing your abilities.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
                
                <AccordionItem 
                  mb={4} 
                  border="none" 
                  bg={isDark ? "gray.700" : "white"} 
                  borderRadius="lg"
                  overflow="hidden"
                >
                  <h3>
                    <AccordionButton 
                      py={4} 
                      px={6}
                      _hover={{ bg: isDark ? "gray.600" : "gray.50" }}
                    >
                      <HStack flex="1" textAlign="left" spacing={4}>
                        <Text 
                          bg={isDark ? "brand.bitdash.800" : "brand.bitdash.100"} 
                          color={isDark ? "brand.bitdash.200" : "brand.bitdash.800"}
                          borderRadius="full" 
                          w={8} 
                          h={8} 
                          display="flex" 
                          alignItems="center" 
                          justifyContent="center"
                          fontWeight="bold"
                        >
                          4
                        </Text>
                        <Text fontWeight="medium" color={isDark ? "white" : "gray.800"}>
                          {t('careers:process.interviews.title', 'Team Interviews')}
                        </Text>
                      </HStack>
                      <AccordionIcon color={isDark ? "brand.bitdash.400" : "brand.bitdash.500"} />
                    </AccordionButton>
                  </h3>
                  <AccordionPanel pb={4} px={6} bg={isDark ? "gray.700" : "white"}>
                    <Text fontSize={textSize} color={isDark ? "gray.300" : "gray.700"}>
                      {t('careers:process.interviews.description', 'You\'ll meet with potential team members and leaders through a series of structured interviews. These conversations help us understand your experience, working style, and how you might contribute to our team, while giving you the opportunity to learn more about us.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
                
                <AccordionItem 
                  border="none" 
                  bg={isDark ? "gray.700" : "white"} 
                  borderRadius="lg"
                  overflow="hidden"
                >
                  <h3>
                    <AccordionButton 
                      py={4} 
                      px={6}
                      _hover={{ bg: isDark ? "gray.600" : "gray.50" }}
                    >
                      <HStack flex="1" textAlign="left" spacing={4}>
                        <Text 
                          bg={isDark ? "brand.bitdash.800" : "brand.bitdash.100"} 
                          color={isDark ? "brand.bitdash.200" : "brand.bitdash.800"}
                          borderRadius="full" 
                          w={8} 
                          h={8} 
                          display="flex" 
                          alignItems="center" 
                          justifyContent="center"
                          fontWeight="bold"
                        >
                          5
                        </Text>
                        <Text fontWeight="medium" color={isDark ? "white" : "gray.800"}>
                          {t('careers:process.offer.title', 'Offer & Onboarding')}
                        </Text>
                      </HStack>
                      <AccordionIcon color={isDark ? "brand.bitdash.400" : "brand.bitdash.500"} />
                    </AccordionButton>
                  </h3>
                  <AccordionPanel pb={4} px={6} bg={isDark ? "gray.700" : "white"}>
                    <Text fontSize={textSize} color={isDark ? "gray.300" : "gray.700"}>
                      {t('careers:process.offer.description', 'If there\'s a strong mutual fit, we\'ll extend an offer detailing compensation, benefits, and start date. Once you accept, our onboarding team will guide you through the process of joining BitDash and set you up for success.')}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </VStack>
          </Container>
        </Box>
      </Box>
      
      {/* Job Application Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedJob ? selectedJob.attributes.title : t('careers:jobApplication', 'Job Application')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedJob && (
              <VStack spacing={6} align="stretch">
                <HStack wrap="wrap" spacing={4}>
                  <Badge colorScheme="brand.bitdash">
                    {t(`careers:departments.${selectedJob.attributes.department}`, 
                      careerTypes.find(d => d.id === selectedJob.attributes.department)?.label || selectedJob.attributes.department
                    )}
                  </Badge>
                  
                  <HStack color={isDark ? "gray.400" : "gray.600"} fontSize="sm">
                    <Icon as={FaMapMarkerAlt} />
                    <Text>
                      {t(`careers:locations.${selectedJob.attributes.location}`, 
                        locations.find(l => l.id === selectedJob.attributes.location)?.label || selectedJob.attributes.location
                      )}
                    </Text>
                  </HStack>
                </HStack>
                
                <Divider borderColor={isDark ? "gray.700" : "gray.200"} />
                
                <VStack align="start" spacing={4}>
                  <Heading as="h4" size="sm" color={isDark ? "white" : "gray.800"}>
                    {t('careers:jobDescription', 'Job Description')}
                  </Heading>
                  <Text fontSize={textSize} color={isDark ? "gray.300" : "gray.700"} whiteSpace="pre-line">
                    {selectedJob.attributes.description}
                  </Text>
                </VStack>
                
                <VStack align="start" spacing={4}>
                  <Heading as="h4" size="sm" color={isDark ? "white" : "gray.800"}>
                    {t('careers:requirements', 'Requirements')}
                  </Heading>
                  <Text fontSize={textSize} color={isDark ? "gray.300" : "gray.700"} whiteSpace="pre-line">
                    {selectedJob.attributes.requirements}
                  </Text>
                </VStack>
                
                {selectedJob.attributes.benefits && (
                  <VStack align="start" spacing={4}>
                    <Heading as="h4" size="sm" color={isDark ? "white" : "gray.800"}>
                      {t('careers:specificBenefits', 'Position Benefits')}
                    </Heading>
                    <Text fontSize={textSize} color={isDark ? "gray.300" : "gray.700"} whiteSpace="pre-line">
                      {selectedJob.attributes.benefits}
                    </Text>
                  </VStack>
                )}
                
                <Divider borderColor={isDark ? "gray.700" : "gray.200"} />
                
                <VStack as="form" spacing={4} align="stretch" onSubmit={handleSubmitApplication}>
                  <Heading as="h4" size="sm" color={isDark ? "white" : "gray.800"}>
                    {t('careers:applyNow', 'Apply Now')}
                  </Heading>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>{t('careers:form.fullName', 'Full Name')}</FormLabel>
                      <Input 
                        placeholder={t('careers:form.fullNamePlaceholder', 'Enter your full name')} 
                        bg={isDark ? "gray.700" : "white"}
                      />
                    </FormControl>
                    
                    <FormControl isRequired>
                      <FormLabel>{t('careers:form.email', 'Email Address')}</FormLabel>
                      <Input 
                        type="email" 
                        placeholder={t('careers:form.emailPlaceholder', 'Enter your email')} 
                        bg={isDark ? "gray.700" : "white"}
                      />
                    </FormControl>
                  </SimpleGrid>
                  
                  <FormControl isRequired>
                    <FormLabel>{t('careers:form.phone', 'Phone Number')}</FormLabel>
                    <Input 
                      placeholder={t('careers:form.phonePlaceholder', 'Enter your phone number')} 
                      bg={isDark ? "gray.700" : "white"}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>{t('careers:form.linkedin', 'LinkedIn Profile (Optional)')}</FormLabel>
                    <Input 
                      placeholder={t('careers:form.linkedinPlaceholder', 'https://linkedin.com/in/yourprofile')} 
                      bg={isDark ? "gray.700" : "white"}
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>{t('careers:form.resume', 'Resume/CV')}</FormLabel>
                    <Button
                      leftIcon={<FaUpload />}
                      variant="outline"
                      colorScheme="brand.bitdash"
                      w="full"
                      py={6}
                      as="label"
                      htmlFor="resume-upload"
                      cursor="pointer"
                    >
                      {t('careers:form.resumeUpload', 'Upload Resume/CV (PDF, DOC, DOCX)')}
                    </Button>
                    <Input 
                      id="resume-upload" 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      display="none"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>{t('careers:form.coverLetter', 'Cover Letter or Introduction')}</FormLabel>
                    <Textarea 
                      placeholder={t('careers:form.coverLetterPlaceholder', 'Tell us why you\'re interested in this position and how your experience makes you a good fit.')} 
                      minHeight="150px"
                      bg={isDark ? "gray.700" : "white"}
                    />
                  </FormControl>
                  
                  <Button 
                    type="submit" 
                    colorScheme="brand.bitdash" 
                    size="lg" 
                    leftIcon={<FaPaperPlane />}
                    mt={4}
                  >
                    {t('careers:form.submit', 'Submit Application')}
                  </Button>
                </VStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      </Layout>
    </>
  );
}