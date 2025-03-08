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
  Badge,
  Avatar,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Link,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { FaLinkedin, FaTwitter, FaQuoteLeft } from 'react-icons/fa';
import Head from 'next/head';
import Layout from '@/components/Layout';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'about'])),
    },
  };
}

export default function OurTeam() {
  const { t } = useTranslation(['common', 'about']);
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  // Responsive settings
  const headingSize = useBreakpointValue({ base: 'xl', md: '2xl' });
  const subheadingSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const textSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const teamGridColumns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 });
  
  // Team data - Leadership
  const leadershipTeam = [
    {
      name: "Sarah Johnson",
      title: t('about:team.titles.ceo', 'Chief Executive Officer'),
      image: "/team/ceo.jpg",
      bio: t('about:team.bios.ceo', 'With over 20 years of experience in fintech, Sarah has led BitDash from a startup to a global financial platform.'),
      linkedin: "https://linkedin.com/in/sarahjohnson",
      twitter: "https://twitter.com/sarahjohnson"
    },
    {
      name: "David Chen",
      title: t('about:team.titles.cto', 'Chief Technology Officer'),
      image: "/team/cto.jpg",
      bio: t('about:team.bios.cto', 'David oversees our technical strategy and innovation. Previously led engineering at major tech companies.'),
      linkedin: "https://linkedin.com/in/davidchen",
      twitter: "https://twitter.com/davidchen"
    },
    {
      name: "Michael Rodriguez",
      title: t('about:team.titles.cfo', 'Chief Financial Officer'),
      image: "/team/cfo.jpg",
      bio: t('about:team.bios.cfo', 'Michael brings deep expertise in financial operations and strategic growth from his 15 years in global banking.'),
      linkedin: "https://linkedin.com/in/michaelrodriguez",
      twitter: "https://twitter.com/michaelrodriguez"
    },
    {
      name: "Aisha Patel",
      title: t('about:team.titles.coo', 'Chief Operating Officer'),
      image: "/team/coo.jpg",
      bio: t('about:team.bios.coo', 'Aisha leads our global operations and expansion strategy, focusing on efficiency and customer experience.'),
      linkedin: "https://linkedin.com/in/aishapatel",
      twitter: "https://twitter.com/aishapatel"
    }
  ];
  
  // Team data - Technology
  const techTeam = [
    {
      name: "Alex Morgan",
      title: t('about:team.titles.headEng', 'Head of Engineering'),
      image: "/team/head-eng.jpg",
      bio: t('about:team.bios.headEng', 'Alex leads our engineering teams with a focus on scalable architecture and performance optimization.')
    },
    {
      name: "Jun Tanaka",
      title: t('about:team.titles.cybersec', 'Cybersecurity Director'),
      image: "/team/cybersec.jpg",
      bio: t('about:team.bios.cybersec', 'Jun manages our security infrastructure, ensuring the highest standards of data protection.')
    },
    {
      name: "Rachel Kim",
      title: t('about:team.titles.productDir', 'Product Director'),
      image: "/team/product.jpg",
      bio: t('about:team.bios.productDir', 'Rachel drives product vision and development across our platforms, focusing on user experience.')
    },
    {
      name: "Omar Hassan",
      title: t('about:team.titles.aiLead', 'AI Research Lead'),
      image: "/team/ai-lead.jpg",
      bio: t('about:team.bios.aiLead', 'Omar leads AI innovation at BitDash, developing intelligent solutions for financial analytics.')
    }
  ];
  
  // Team data - Business
  const businessTeam = [
    {
      name: "Emma Taylor",
      title: t('about:team.titles.marketing', 'Marketing Director'),
      image: "/team/marketing.jpg",
      bio: t('about:team.bios.marketing', 'Emma oversees our global marketing strategy, brand development, and customer acquisition.')
    },
    {
      name: "Carlos Mendez",
      title: t('about:team.titles.salesDir', 'Global Sales Director'),
      image: "/team/sales.jpg",
      bio: t('about:team.bios.salesDir', 'Carlos leads our worldwide sales operations, focusing on institutional partnerships and growth.')
    },
    {
      name: "Priya Singh",
      title: t('about:team.titles.customerExp', 'Customer Experience Head'),
      image: "/team/customer.jpg",
      bio: t('about:team.bios.customerExp', 'Priya ensures excellent service across all customer touchpoints and support channels.')
    },
    {
      name: "Thomas Mueller",
      title: t('about:team.titles.bizDev', 'Business Development Lead'),
      image: "/team/bizdev.jpg",
      bio: t('about:team.bios.bizDev', 'Thomas identifies and develops strategic partnerships to expand BitDash services globally.')
    }
  ];
  
  // Testimonials
  const testimonials = [
    {
      quote: t('about:team.testimonials.quote1', "Working at BitDash means being at the cutting edge of fintech innovation. We're empowered to push boundaries and create solutions that truly impact people's financial lives."),
      author: "Jamie Lee",
      position: t('about:team.titles.frontendDev', "Frontend Developer"),
      image: "/team/employee1.jpg"
    },
    {
      quote: t('about:team.testimonials.quote2', "The collaborative culture here is unlike anywhere I've worked before. Everyone has a voice, and leadership truly values diverse perspectives."),
      author: "Marcus Wilson",
      position: t('about:team.titles.dataScientist', "Data Scientist"),
      image: "/team/employee2.jpg"
    },
    {
      quote: t('about:team.testimonials.quote3', "BitDash encourages continuous learning and professional growth. I've had opportunities to take on challenging projects that have significantly expanded my skill set."),
      author: "Sophia Chen",
      position: t('about:team.titles.projectManager', "Project Manager"),
      image: "/team/employee3.jpg"
    }
  ];

  return (
    <>
      <Head>
        <title>{t('about:team.pageTitle', 'Our Team | BitDash')}</title>
        <meta name="description" content={t('about:team.metaDescription', 'Meet the talented team behind BitDash. Our leadership and experts are dedicated to revolutionizing financial technology worldwide.')} />
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
          py={16}
        >
          <Container maxW="container.xl" position="relative" zIndex={1}>
            <Stack spacing={8} align={{ base: "center", md: "flex-start" }} textAlign={{ base: "center", md: "left" }}>
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
                  {t('about:team.title', 'Driven by Excellence')}
                </Heading>
              </VStack>
              
              <Text 
                fontSize={textSize} 
                maxW="2xl" 
                color={isDark ? "gray.300" : "gray.700"}
              >
                {t('about:team.introduction', 'Our team brings together experts in finance, technology, and customer experience. United by our mission to transform financial services, we work collaboratively to build innovative solutions that empower our users worldwide.')}
              </Text>
            </Stack>
          </Container>
        </Box>
        
        {/* Leadership Team Section */}
        <Box py={16}>
          <Container maxW="container.xl">
            <VStack spacing={12}>
              <VStack spacing={3} textAlign="center">
                <Heading 
                  as="h2" 
                  size={subheadingSize} 
                  color={isDark ? "white" : "gray.800"}
                >
                  {t('about:team.leadershipTitle', 'Our Leadership')}
                </Heading>
                <Text 
                  fontSize={textSize} 
                  color={isDark ? "gray.300" : "gray.700"}
                  maxW="2xl"
                >
                  {t('about:team.leadershipDesc', 'Meet the experienced professionals guiding BitDash\'s vision and growth. Our executive team combines expertise from finance, technology, and global business.')}
                </Text>
              </VStack>
              
              <SimpleGrid columns={teamGridColumns} spacing={8} w="full">
                {leadershipTeam.map((member, index) => (
                  <Box 
                    key={index} 
                    borderRadius="lg"
                    overflow="hidden"
                    bg={isDark ? "gray.800" : "white"}
                    boxShadow="md"
                    transition="all 0.3s"
                    _hover={{
                      transform: "translateY(-5px)",
                      boxShadow: "lg"
                    }}
                  >
                    <Box position="relative" height="280px">
                      <Image
                        src={member.image}
                        alt={`${member.name}, ${member.title}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        style={{ objectFit: 'cover' }}
                        priority={index < 2}
                      />
                    </Box>
                    <VStack p={5} align="start" spacing={3}>
                      <Heading as="h3" size="md" color={isDark ? "white" : "gray.800"}>
                        {member.name}
                      </Heading>
                      <Text 
                        fontSize="sm" 
                        fontWeight="medium" 
                        color={isDark ? "brand.bitdash.400" : "brand.bitdash.600"}
                      >
                        {member.title}
                      </Text>
                      <Text 
                        fontSize={textSize} 
                        color={isDark ? "gray.300" : "gray.700"}
                        noOfLines={3}
                      >
                        {member.bio}
                      </Text>
                      <HStack spacing={3} pt={2}>
                        <Link href={member.linkedin} isExternal aria-label={`${member.name} LinkedIn`}>
                          <Icon 
                            as={FaLinkedin} 
                            w={5} 
                            h={5} 
                            color={isDark ? "blue.400" : "blue.600"}
                            transition="all 0.3s"
                            _hover={{ transform: "scale(1.2)" }}
                          />
                        </Link>
                        <Link href={member.twitter} isExternal aria-label={`${member.name} Twitter`}>
                          <Icon 
                            as={FaTwitter} 
                            w={5} 
                            h={5} 
                            color={isDark ? "blue.400" : "blue.500"}
                            transition="all 0.3s"
                            _hover={{ transform: "scale(1.2)" }}
                          />
                        </Link>
                      </HStack>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>
        
        {/* Department Teams */}
        <Box py={16}>
          <Container maxW="container.xl">
            <VStack spacing={10}>
              <Heading 
                as="h2" 
                size={subheadingSize} 
                color={isDark ? "white" : "gray.800"}
                textAlign="center"
              >
                {t('about:team.departmentsTitle', 'Meet Our Experts')}
              </Heading>
              
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
                    {t('about:team.tabs.technology', 'Technology')}
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
                    {t('about:team.tabs.business', 'Business & Operations')}
                  </Tab>
                </TabList>
                
                <TabPanels>
                  {/* Technology Team */}
                  <TabPanel px={0}>
                    <SimpleGrid columns={teamGridColumns} spacing={6}>
                      {techTeam.map((member, index) => (
                        <Box 
                          key={index} 
                          p={5} 
                          borderRadius="lg"
                          bg={isDark ? "gray.700" : "white"}
                          boxShadow="sm"
                          transition="all 0.3s"
                          _hover={{
                            transform: "translateY(-3px)",
                            boxShadow: "md"
                          }}
                        >
                          <VStack spacing={4}>
                            <Avatar 
                              size="xl" 
                              name={member.name} 
                              src={member.image}
                              border="3px solid"
                              borderColor={isDark ? "brand.bitdash.400" : "brand.bitdash.500"}
                            />
                            <VStack spacing={1}>
                              <Heading as="h3" size="sm" color={isDark ? "white" : "gray.800"}>
                                {member.name}
                              </Heading>
                              <Text 
                                fontSize="xs" 
                                fontWeight="medium" 
                                color={isDark ? "brand.bitdash.400" : "brand.bitdash.600"}
                              >
                                {member.title}
                              </Text>
                            </VStack>
                            <Text 
                              fontSize="sm" 
                              color={isDark ? "gray.300" : "gray.700"}
                              textAlign="center"
                              noOfLines={3}
                            >
                              {member.bio}
                            </Text>
                          </VStack>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </TabPanel>
                  
                  {/* Business Team */}
                  <TabPanel px={0}>
                    <SimpleGrid columns={teamGridColumns} spacing={6}>
                      {businessTeam.map((member, index) => (
                        <Box 
                          key={index} 
                          p={5} 
                          borderRadius="lg"
                          bg={isDark ? "gray.700" : "white"}
                          boxShadow="sm"
                          transition="all 0.3s"
                          _hover={{
                            transform: "translateY(-3px)",
                            boxShadow: "md"
                          }}
                        >
                          <VStack spacing={4}>
                            <Avatar 
                              size="xl" 
                              name={member.name} 
                              src={member.image}
                              border="3px solid"
                              borderColor={isDark ? "brand.bitdash.400" : "brand.bitdash.500"}
                            />
                            <VStack spacing={1}>
                              <Heading as="h3" size="sm" color={isDark ? "white" : "gray.800"}>
                                {member.name}
                              </Heading>
                              <Text 
                                fontSize="xs" 
                                fontWeight="medium" 
                                color={isDark ? "brand.bitdash.400" : "brand.bitdash.600"}
                              >
                                {member.title}
                              </Text>
                            </VStack>
                            <Text 
                              fontSize="sm" 
                              color={isDark ? "gray.300" : "gray.700"}
                              textAlign="center"
                              noOfLines={3}
                            >
                              {member.bio}
                            </Text>
                          </VStack>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          </Container>
        </Box>
        
        {/* Employee Testimonials */}
        <Box py={16}>
          <Container maxW="container.lg">
            <VStack spacing={10}>
              <VStack spacing={3} textAlign="center">
                <Heading 
                  as="h2" 
                  size={subheadingSize} 
                  color={isDark ? "white" : "gray.800"}
                >
                  {t('about:team.testimonialsTitle', 'Our Culture')}
                </Heading>
                <Text 
                  fontSize={textSize} 
                  color={isDark ? "gray.300" : "gray.700"}
                  maxW="2xl"
                >
                  {t('about:team.testimonialsDesc', 'At BitDash, we foster a culture of innovation, collaboration, and continuous learning. Hear directly from our team members about what makes working here special.')}
                </Text>
              </VStack>
              
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                {testimonials.map((testimonial, index) => (
                  <Box 
                    key={index}
                    bg={isDark ? "gray.800" : "white"}
                    p={6}
                    borderRadius="lg"
                    boxShadow="md"
                    position="relative"
                    _before={{
                      content: '""',
                      position: "absolute",
                      top: "-10px",
                      left: "30px",
                      width: "20px",
                      height: "20px",
                      bg: isDark ? "gray.800" : "white",
                      transform: "rotate(45deg)",
                      zIndex: 0
                    }}
                  >
                    <VStack spacing={4}>
                      <Icon 
                        as={FaQuoteLeft} 
                        color={isDark ? "brand.bitdash.400" : "brand.bitdash.500"} 
                        w={8} 
                        h={8} 
                        opacity={0.7}
                      />
                      <Text 
                        fontSize="sm" 
                        color={isDark ? "gray.300" : "gray.700"}
                        fontStyle="italic"
                      >
                        {testimonial.quote}
                      </Text>
                      <HStack spacing={4} w="full" pt={2}>
                        <Avatar 
                          size="md" 
                          name={testimonial.author} 
                          src={testimonial.image} 
                        />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold" fontSize="sm" color={isDark ? "white" : "gray.800"}>
                            {testimonial.author}
                          </Text>
                          <Text fontSize="xs" color={isDark ? "gray.400" : "gray.600"}>
                            {testimonial.position}
                          </Text>
                        </VStack>
                      </HStack>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>
        
        {/* Join Our Team */}
        <Box py={16}>
          <Container maxW="container.xl">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems="center">
              <Box position="relative" height={{ base: "300px", md: "400px" }}>
                <Image
                  src="/team/office.jpg"
                  alt={t('about:team.officeImageAlt', 'BitDash modern office space')}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{
                    objectFit: 'cover',
                    borderRadius: '1rem'
                  }}
                />
              </Box>
              
              <Stack spacing={6}>
                <Heading 
                  as="h2" 
                  size={subheadingSize} 
                  color={isDark ? "white" : "gray.800"}
                >
                  {t('about:team.joinTitle', 'Join Our Team')}
                </Heading>
                
                <Text fontSize={textSize} color={isDark ? "gray.300" : "gray.700"}>
                  {t('about:team.joinDesc1', 'We\'re constantly looking for talented individuals to join our diverse and growing team. At BitDash, you\'ll work on challenging projects in a collaborative environment while developing innovative solutions that impact millions of users worldwide.')}
                </Text>
                
                <Text fontSize={textSize} color={isDark ? "gray.300" : "gray.700"}>
                  {t('about:team.joinDesc2', 'We offer competitive compensation, continuous learning opportunities, flexible work arrangements, and a supportive, inclusive culture. Check our careers page for current openings or send your resume to careers@bitdash.com.')}
                </Text>
                
                <Wrap spacing={4} pt={2}>
                  <WrapItem>
                    <Badge px={3} py={1} borderRadius="full" colorScheme="brand.crypto" fontSize="sm">
                      {t('about:team.benefits.remote', 'Remote-Friendly')}
                    </Badge>
                  </WrapItem>
                  <WrapItem>
                    <Badge px={3} py={1} borderRadius="full" colorScheme="brand.forex" fontSize="sm">
                      {t('about:team.benefits.development', 'Professional Development')}
                    </Badge>
                  </WrapItem>
                  <WrapItem>
                    <Badge px={3} py={1} borderRadius="full" colorScheme="brand.stocks" fontSize="sm">
                      {t('about:team.benefits.health', 'Health Benefits')}
                    </Badge>
                  </WrapItem>
                  <WrapItem>
                    <Badge px={3} py={1} borderRadius="full" colorScheme="brand.cash" fontSize="sm">
                      {t('about:team.benefits.equity', 'Equity Options')}
                    </Badge>
                  </WrapItem>
                </Wrap>
                
                <Link
                  href="/contact/careers"
                  w="fit-content"
                  px={6}
                  py={3}
                  bg={isDark ? "brand.bitdash.600" : "brand.bitdash.500"}
                  color="white"
                  fontWeight="medium"
                  borderRadius="full"
                  _hover={{
                    bg: isDark ? "brand.bitdash.500" : "brand.bitdash.600",
                    transform: "translateY(-2px)",
                    boxShadow: "md"
                  }}
                  transition="all 0.3s"
                  mt={2}
                >
                  {t('about:team.viewOpenings', 'View Current Openings')}
                </Link>
              </Stack>
            </SimpleGrid>
          </Container>
        </Box>
      </Box>
      </Layout>
    </>
  );
}