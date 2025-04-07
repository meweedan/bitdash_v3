import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Stack,
  VStack,
  HStack,
  useColorMode,
  useBreakpointValue,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Icon,
  Button,
  Divider,
  Link,
  Card,
  CardBody,
  CardFooter,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaClock, FaExternalLinkAlt, FaDirections } from 'react-icons/fa';
import Head from 'next/head';
import { useState } from 'react';
import Layout from '@/components/Layout';
import dynamic from 'next/dynamic';

const GlobeMap = dynamic(() => import('@/components/GlobeMap'), { ssr: false });

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'contact'])),
    },
  };
}

const OfficesPage = () => {
  const { t, i18n } = useTranslation(['common', 'contact']);
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const isRTL = i18n.language === 'ar' || i18n.language === 'he';
  
  // Responsive settings
  const headingSize = useBreakpointValue({ base: 'xl', md: '2xl' });
  const subheadingSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const textSize = useBreakpointValue({ base: 'sm', md: 'md' });
  
  // State for active office modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeOffice, setActiveOffice] = useState(null);
  
  // Function to open office detail modal
  const openOfficeDetail = (office) => {
    setActiveOffice(office);
    onOpen();
  };
  
  // Office locations data
  const offices = [
    {
      id: 'london',
      name: t('contact:offices.london.name', 'London (Headquarters)'),
      address: t('contact:offices.london.address', '1 Fintech Square, Canary Wharf, London E14 5AB, United Kingdom'),
      phone: '+44 20 7123 4567',
      email: 'london@bitdash.app',
      coordinates: '51.5049,0.0255', // latitude,longitude
      image: '/offices/london.jpg',
      imageAlt: t('contact:offices.london.imageAlt', 'BitDash London headquarters building'),
      timezone: 'GMT',
      hours: t('contact:offices.london.hours', 'Monday-Friday: 9:00 AM - 6:00 PM'),
      teams: [
        t('contact:teams.executive', 'Executive Leadership'),
        t('contact:teams.engineering', 'Engineering'),
        t('contact:teams.finance', 'Finance'),
        t('contact:teams.legal', 'Legal & Compliance')
      ],
      featuredImage: '/offices/london-featured.jpg',
      featuredImageAlt: t('contact:offices.london.featuredImageAlt', 'BitDash London office interior'),
      description: t('contact:offices.london.description', 'Our London headquarters houses our executive leadership team and serves as the primary hub for our European operations. Located in the heart of Canary Wharf, the office features state-of-the-art facilities including collaborative workspaces, a tech lab, and a rooftop terrace with views of the Thames.'),
      virtualTour: 'https://bitdash.app/virtual-tour/london'
    },
    {
      id: 'newyork',
      name: t('contact:offices.newyork.name', 'New York'),
      address: t('contact:offices.newyork.address', '100 Wall Street, Suite 800, New York, NY 10005, USA'),
      phone: '+1 212 555 7890',
      email: 'newyork@bitdash.app',
      coordinates: '40.7048,-74.0051',
      image: '/offices/newyork.jpg',
      imageAlt: t('contact:offices.newyork.imageAlt', 'BitDash New York office'),
      timezone: 'EST (GMT-5)',
      hours: t('contact:offices.newyork.hours', 'Monday-Friday: 8:30 AM - 5:30 PM'),
      teams: [
        t('contact:teams.sales', 'Sales'),
        t('contact:teams.marketing', 'Marketing'),
        t('contact:teams.trading', 'Trading Technology')
      ],
      featuredImage: '/offices/newyork-featured.jpg',
      featuredImageAlt: t('contact:offices.newyork.featuredImageAlt', 'BitDash New York office interior'),
      description: t('contact:offices.newyork.description', 'Located in the heart of Manhattan\'s financial district, our New York office focuses on North American operations and houses our institutional sales team. The office features a modern trading floor design with state-of-the-art technology to support our financial service offerings.'),
      virtualTour: 'https://bitdash.app/virtual-tour/newyork'
    },
    {
      id: 'cairo',
      name: t('contact:offices.cairo.name', 'Cairo'),
      address: t('contact:offices.cairo.address'),
      phone: '+20 10 4123 567',
      email: 'cairo@bitdash.app',
      coordinates: '25.2175,55.2795',
      image: '/offices/cairo.jpg',
      imageAlt: t('contact:offices.cairo.imageAlt', 'BitDash Dubai office'),
      timezone: 'GST (GMT+4)',
      hours: t('contact:offices.cairo.hours', 'Sunday-Thursday: 9:00 AM - 6:00 PM'),
      teams: [
        t('contact:teams.wealth', 'Wealth Management'),
        t('contact:teams.relationship', 'Relationship Management'),
        t('contact:teams.operations', 'Regional Operations')
      ],
      featuredImage: '/offices/cairo-featured.jpg',
      featuredImageAlt: t('contact:offices.cairo.featuredImageAlt'),
      description: t('contact:offices.cairo.description'),
      virtualTour: 'https://bitdash.app/virtual-tour/cairo'
    },
    {
      id: 'istanbul',
      name: t('contact:offices.istanbul.name'),
      address: t('contact:offices.istanbul.address'),
      phone: '+90 (537) 249 72 02',
      email: 'istanbul@bitdash.app',
      coordinates: '-33.8612,151.1982',
      image: '/offices/istanbul.jpg',
      imageAlt: t('contact:offices.sydney.imageAlt', 'BitDash Sydney office'),
      timezone: 'AEST (GMT+10)',
      hours: t('contact:offices.sydney.hours', 'Monday-Friday: 8:30 AM - 5:30 PM'),
      teams: [
        t('contact:teams.product', 'Product'),
        t('contact:teams.customer', 'Customer Success'),
        t('contact:teams.localEngineering', 'Local Engineering')
      ],
      featuredImage: '/offices/sydney-featured.jpg',
      featuredImageAlt: t('contact:offices.sydney.featuredImageAlt', 'BitDash Sydney office interior'),
      description: t('contact:offices.sydney.description', 'Our Sydney office provides a strategic base for our Australian and Pacific operations. The waterfront location offers breathtaking harbor views and serves as home to our regional product and customer success teams. The space is designed to reflect Australia\'s balanced approach to work and lifestyle.'),
      virtualTour: 'https://bitdash.app/virtual-tour/sydney'
    },
    {
      id: 'remote',
      name: t('contact:offices.remote.name', 'Remote Teams'),
      address: t('contact:offices.remote.address', 'Global'),
      email: 'remote@bitdash.com',
      image: '/offices/remote.jpg',
      imageAlt: t('contact:offices.remote.imageAlt', 'BitDash remote worker'),
      teams: [
        t('contact:teams.development', 'Software Development'),
        t('contact:teams.design', 'Design'),
        t('contact:teams.support', 'Customer Support')
      ],
      featuredImage: '/offices/remote-featured.jpg',
      featuredImageAlt: t('contact:offices.remote.featuredImageAlt', 'BitDash remote team collaboration'),
      description: t('contact:offices.remote.description', 'In addition to our physical locations, BitDash proudly supports a global remote workforce. Our remote team members are distributed across multiple time zones, allowing us to provide 24/7 support and development capabilities while fostering a diverse and inclusive culture.'),
    }
  ];
  
  // Regional tabs configuration
  const regions = [
    { id: 'all', label: t('contact:regions.all', 'All Locations') },
    { id: 'europe', label: t('contact:regions.europe', 'Europe'), offices: ['london'] },
    { id: 'americas', label: t('contact:regions.americas', 'Americas'), offices: ['newyork'] },
    { id: 'asia', label: t('contact:regions.asia', 'Asia-Pacific'), offices: ['istanbul'] },
    { id: 'mena', label: t('contact:regions.mena', 'Middle East'), offices: ['cairo'] }
  ];
  
  // State for active region filter
  const [activeRegion, setActiveRegion] = useState('all');
  
  // Filter offices based on active region
  const filteredOffices = activeRegion === 'all' 
    ? offices 
    : offices.filter(office => {
        const region = regions.find(r => r.id === activeRegion);
        return region?.offices?.includes(office.id);
      });

  return (
    <>
      <Head>
        <title>{t('contact:officesPageTitle', 'Global Offices | BitDash')}</title>
        <meta name="description" content={t('contact:officesMetaDescription', 'Discover BitDash\'s global presence with offices in major financial hubs worldwide. Find contact information and details for all our locations.')} />
      </Head>
      <Layout>
      <Box w="full" position="relative" overflow="hidden">
        {/* Hero Section */}
        <Box 
          position="relative"
          py={16}
        > 
          <Container maxW="container.xl" position="relative" zIndex={1}>
            <Stack spacing={8} align="center" textAlign="center">
              <VStack spacing={3}>
                <Heading 
                  as="h1" 
                  size={headingSize} 
                  fontWeight="bold"
                >
                  {t('contact:officesTitle', 'Our Global Offices')}
                </Heading>
              </VStack>
              
              <Text 
                fontSize={textSize} 
                maxW="3xl" 
                color={isDark ? "gray.300" : "gray.700"}
              >
                {t('contact:officesIntroduction', 'BitDash operates from strategic locations around the world, ensuring we can provide localized support and service to our global client base. Our offices are situated in major financial hubs, allowing us to stay connected with financial markets and regulatory developments in key regions.')}
              </Text>
            </Stack>
          </Container>
        </Box>
        
        {/* World Map Section */}
        <Box py={{ base: 8, md: 12 }}>
        <Container maxW={{ base: "container.sm", md: "container.xl" }} px={{ base: 4, md: 8 }}>
            <VStack spacing={{ base: 4, md: 8 }}>
            <Heading 
                as="h2" 
                size={subheadingSize} 
                color={isDark ? "white" : "gray.800"}
                textAlign="center"
            >
                {t('contact:worldPresence', 'Our Worldwide Presence')}
            </Heading>
            
            <Box 
                position="relative" 
                width="100%" 
                height={{ base: "400px", md: "600px", lg: "800px" }}
                borderRadius="lg"
                overflow="hidden"
            >
                <GlobeMap />
            </Box>
            </VStack>
        </Container>
        </Box>

        
        {/* Office Listings Section */}
        <Box py={16}>
          <Container maxW="container.xl">
            <VStack spacing={12} w="full">
              {/* Region Filter Tabs */}
              <Tabs 
                variant="soft-rounded" 
                colorScheme="brand.bitdash" 
                onChange={(index) => setActiveRegion(regions[index].id)}
                align="center"
                w="full"
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
                  {regions.map((region) => (
                    <Tab 
                      key={region.id}
                      mx={2}
                      mb={2}
                      color={isDark ? "gray.300" : "gray.700"}
                      _selected={{ 
                        color: isDark ? "white" : "gray.800",
                        bg: isDark ? "brand.bitdash.900" : "brand.bitdash.100",
                        fontWeight: "medium"
                      }}
                    >
                      {region.label}
                    </Tab>
                  ))}
                </TabList>
                
                <TabPanels>
                  {regions.map((region) => (
                    <TabPanel key={region.id} px={0}>
                      <SimpleGrid 
                        columns={{ base: 1, md: 2, lg: 3 }} 
                        spacing={8}
                        w="full"
                      >
                        {filteredOffices.map((office) => (
                          <Card
                            key={office.id}
                            bg={isDark ? "gray.700" : "white"}
                            boxShadow="md"
                            borderRadius="lg"
                            overflow="hidden"
                            transition="all 0.3s"
                            _hover={{
                              transform: "translateY(-5px)",
                              boxShadow: "lg"
                            }}
                          >
                            <Box position="relative" height="200px">
                              <Image
                                src={office.image}
                                alt={office.imageAlt}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                style={{ objectFit: 'cover' }}
                              />
                              
                              {/* Office name overlay */}
                              <Box
                                position="absolute"
                                bottom={0}
                                left={0}
                                right={0}
                                bg={isDark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)"}
                                backdropFilter="blur(4px)"
                                p={3}
                              >
                                <Text
                                  fontWeight="bold"
                                  color={isDark ? "white" : "gray.800"}
                                >
                                  {office.name}
                                </Text>
                              </Box>
                            </Box>
                            
                            <CardBody>
                              <VStack align="start" spacing={4}>
                                {/* Address */}
                                <HStack align="start" spacing={3}>
                                  <Icon 
                                    as={FaMapMarkerAlt} 
                                    color={isDark ? "brand.bitdash.400" : "brand.bitdash.600"} 
                                    mt={1}
                                  />
                                  <Text fontSize="sm" color={isDark ? "gray.300" : "gray.700"}>
                                    {office.address}
                                  </Text>
                                </HStack>
                                
                                {/* Phone (if available) */}
                                {office.phone && (
                                  <HStack align="start" spacing={3}>
                                    <Icon 
                                      as={FaPhone} 
                                      color={isDark ? "brand.bitdash.400" : "brand.bitdash.600"} 
                                      mt={1}
                                    />
                                    <Text fontSize="sm" color={isDark ? "gray.300" : "gray.700"}>
                                      {office.phone}
                                    </Text>
                                  </HStack>
                                )}
                                
                                {/* Email */}
                                <HStack align="start" spacing={3}>
                                  <Icon 
                                    as={FaEnvelope} 
                                    color={isDark ? "brand.bitdash.400" : "brand.bitdash.600"} 
                                    mt={1}
                                  />
                                  <Text fontSize="sm" color={isDark ? "gray.300" : "gray.700"}>
                                    {office.email}
                                  </Text>
                                </HStack>
                                
                                {/* Hours (if available) */}
                                {office.hours && (
                                  <HStack align="start" spacing={3}>
                                    <Icon 
                                      as={FaClock} 
                                      color={isDark ? "brand.bitdash.400" : "brand.bitdash.600"} 
                                      mt={1}
                                    />
                                    <Text fontSize="sm" color={isDark ? "gray.300" : "gray.700"}>
                                      {office.hours}
                                    </Text>
                                  </HStack>
                                )}
                              </VStack>
                            </CardBody>
                            
                            <CardFooter pt={0} pb={4} px={5}>
                              <Button
                                variant="outline"
                                colorScheme="brand.bitdash"
                                size="sm"
                                w="full"
                                rightIcon={<FaExternalLinkAlt />}
                                onClick={() => openOfficeDetail(office)}
                              >
                                {t('contact:viewOfficeDetails', 'View Details')}
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </SimpleGrid>
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            </VStack>
          </Container>
        </Box>
      </Box>
      
      {/* Office Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent bg={isDark ? "gray.800" : "white"}>
          {activeOffice && (
            <>
              <ModalHeader>{activeOffice.name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <VStack spacing={6} align="stretch">
                  {/* Featured Image */}
                  <Box position="relative" height="250px" borderRadius="md" overflow="hidden">
                    <Image
                      src={activeOffice.featuredImage}
                      alt={activeOffice.featuredImageAlt}
                      fill
                      sizes="100vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>
                  
                  {/* Description */}
                  <Text color={isDark ? "gray.300" : "gray.700"}>
                    {activeOffice.description}
                  </Text>
                  
                  <Divider borderColor={isDark ? "gray.700" : "gray.200"} />
                  
                  {/* Contact Details */}
                  <VStack align="start" spacing={3}>
                    <Heading as="h3" size="sm" color={isDark ? "white" : "gray.800"}>
                      {t('contact:contactDetails', 'Contact Details')}
                    </Heading>
                    
                    {/* Address */}
                    <HStack align="start" spacing={3}>
                      <Icon 
                        as={FaMapMarkerAlt} 
                        color={isDark ? "brand.bitdash.400" : "brand.bitdash.600"} 
                        mt={1}
                      />
                      <Text color={isDark ? "gray.300" : "gray.700"}>
                        {activeOffice.address}
                      </Text>
                    </HStack>
                    
                    {/* Phone (if available) */}
                    {activeOffice.phone && (
                      <HStack align="start" spacing={3}>
                        <Icon 
                          as={FaPhone} 
                          color={isDark ? "brand.bitdash.400" : "brand.bitdash.600"} 
                          mt={1}
                        />
                        <Text color={isDark ? "gray.300" : "gray.700"}>
                          {activeOffice.phone}
                        </Text>
                      </HStack>
                    )}
                    
                    {/* Email */}
                    <HStack align="start" spacing={3}>
                      <Icon 
                        as={FaEnvelope} 
                        color={isDark ? "brand.bitdash.400" : "brand.bitdash.600"} 
                        mt={1}
                      />
                      <Link 
                        href={`mailto:${activeOffice.email}`}
                        color={isDark ? "brand.bitdash.400" : "brand.bitdash.600"}
                        _hover={{ textDecoration: "underline" }}
                      >
                        {activeOffice.email}
                      </Link>
                    </HStack>
                    
                    {/* Hours (if available) */}
                    {activeOffice.hours && (
                      <HStack align="start" spacing={3}>
                        <Icon 
                          as={FaClock} 
                          color={isDark ? "brand.bitdash.400" : "brand.bitdash.600"} 
                          mt={1}
                        />
                        <Text color={isDark ? "gray.300" : "gray.700"}>
                          {activeOffice.hours}
                        </Text>
                      </HStack>
                    )}
                    
                    {/* Timezone (if available) */}
                    {activeOffice.timezone && (
                      <HStack align="start" spacing={3}>
                        <Icon 
                          as={FaGlobe} 
                          color={isDark ? "brand.bitdash.400" : "brand.bitdash.600"} 
                          mt={1}
                        />
                        <Text color={isDark ? "gray.300" : "gray.700"}>
                          {activeOffice.timezone}
                        </Text>
                      </HStack>
                    )}
                  </VStack>
                  
                  {/* Teams */}
                  {activeOffice.teams && (
                    <VStack align="start" spacing={3}>
                      <Heading as="h3" size="sm" color={isDark ? "white" : "gray.800"}>
                        {t('contact:teamsAtLocation', 'Teams at this Location')}
                      </Heading>
                      
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2} w="full">
                        {activeOffice.teams.map((team, index) => (
                          <HStack key={index} spacing={2}>
                            <Box 
                              w={2} 
                              h={2} 
                              borderRadius="full" 
                              bg={isDark ? "brand.bitdash.400" : "brand.bitdash.600"} 
                              mt={1}
                            />
                            <Text color={isDark ? "gray.300" : "gray.700"}>
                              {team}
                            </Text>
                          </HStack>
                        ))}
                      </SimpleGrid>
                    </VStack>
                  )}
                  
                  {/* Action Buttons */}
                  <HStack spacing={4} mt={2}>
                    {activeOffice.coordinates && (
                      <Button
                        as={Link}
                        href={`https://maps.google.com/?q=${activeOffice.coordinates}`}
                        isExternal
                        leftIcon={<FaDirections />}
                        colorScheme="brand.bitdash"
                        size="sm"
                      >
                        {t('contact:getDirections', 'Get Directions')}
                      </Button>
                    )}
                    
                    {activeOffice.virtualTour && (
                      <Button
                        as={Link}
                        href={activeOffice.virtualTour}
                        isExternal
                        leftIcon={<FaExternalLinkAlt />}
                        variant="outline"
                        colorScheme="brand.bitdash"
                        size="sm"
                      >
                        {t('contact:virtualTour', 'Virtual Tour')}
                      </Button>
                    )}
                  </HStack>
                </VStack>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      </Layout>
    </>
  );
};

export default OfficesPage;
