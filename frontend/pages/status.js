// pages/status.js
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Flex,
  Badge,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
  useTheme,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  useColorMode,
  Skeleton
} from '@chakra-ui/react';
import {
  Server,
  Database,
  Globe,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  RefreshCw,
  Calendar,
  TrendingUp,
  TrendingDown,
  Shield,
  Send,
  Wifi
} from 'lucide-react';
import Layout from '@/components/Layout';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionStat = motion(Stat);

// Helper function to determine the brand key from subdomain
const getBrandKeyFromSubdomain = (hostname) => {
  if (!hostname) return 'bitdash';
  
  try {
    // For domains like "fund.bitdash.app"
    if (hostname.includes('.') && hostname.split('.').length >= 3) {
      const subdomain = hostname.split('.')[0];
      
      if (subdomain === 'crypto') return 'crypto';
      if (subdomain === 'cash') return 'cash';
      if (subdomain === 'ldn') return 'ldn';
      if (subdomain === 'stocks') return 'stocks';
    }
  } catch (e) {
    console.error("Error parsing subdomain:", e);
  }
  
  // Default fallback
  return 'bitdash';
};

// Get appropriate icon component
const getIconComponent = (iconName) => {
  switch (iconName) {
    case 'Server': return Server;
    case 'Globe': return Globe;
    case 'Database': return Database;
    case 'Send': return Send;
    case 'Wifi': return Wifi;
    case 'Shield': return Shield;
    default: return Server;
  }
};

const StatusPage = () => {
  const { t, i18n } = useTranslation(['common', 'status']);
  const router = useRouter();
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const [brandKey, setBrandKey] = useState('bitdash');
  const [servicesData, setServicesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [incidents, setIncidents] = useState([]);

  // Client-side detection of subdomain
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const detectedBrandKey = getBrandKeyFromSubdomain(hostname);
      setBrandKey(detectedBrandKey);
      setSelectedPlatform(detectedBrandKey);
    }
  }, []);

  const isDark = colorMode === 'dark';
  
  // Access brand colors from theme
  const brandColors = theme.colors.brand[brandKey] || theme.colors.brand.bitdash;
  const primary = brandColors['500'];
  const secondary = brandColors['600'];
  
  // Background colors
  const bgGradient = useColorModeValue(
    `linear(to-br, ${brandColors['50']}, white)`,
    `linear(to-br, gray.900, ${brandColors['900']})`
  );
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const subtleBg = useColorModeValue('gray.50', 'gray.700');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Fetch status data
  const fetchStatusData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public/status?platform=${selectedPlatform}`);
      
      if (!response.ok) throw new Error('Failed to fetch status');
      
      const data = await response.json();
      setServicesData(data);
      setLastUpdated(new Date().toLocaleTimeString(i18n.language, { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
      
      // Fetch mock incidents data
      // In a real app, you would fetch this from your API
      setIncidents([
        {
          id: 1,
          date: new Date().toLocaleDateString(i18n.language),
          title: 'Payment Processing Degradation',
          status: 'resolved',
          affectedServices: ['Payment Gateway'],
          updates: [
            { time: '14:30', message: 'Issue resolved. All payment processing has been restored.' },
            { time: '13:45', message: 'We identified the issue with our payment processor and are implementing a fix.' },
            { time: '13:15', message: 'We are investigating reports of payment processing delays.' }
          ]
        },
        {
          id: 2,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(i18n.language),
          title: 'Authentication Service Maintenance',
          status: 'completed',
          affectedServices: ['Authentication'],
          updates: [
            { time: '03:45', message: 'Maintenance completed successfully.' },
            { time: '03:00', message: 'Scheduled maintenance has begun. Service may be intermittently unavailable.' }
          ]
        }
      ]);
    } catch (error) {
      console.error('Error fetching status data:', error);
      // Set fallback data
      setServicesData({
        data: [
          { id: 1, attributes: { name: 'API', status: 'operational', icon: 'Server', uptime: 99.98 }},
          { id: 2, attributes: { name: 'Dashboard', status: 'operational', icon: 'Globe', uptime: 99.95 }},
          { id: 3, attributes: { name: 'Authentication', status: 'operational', icon: 'Database', uptime: 100.00 }},
          { id: 4, attributes: { name: 'Payment Gateway', status: 'degraded', icon: 'Wifi', uptime: 97.50 }},
          { id: 5, attributes: { name: 'Notifications', status: 'operational', icon: 'Send', uptime: 99.89 }}
        ],
        meta: {
          pagination: { page: 1, pageSize: 25, pageCount: 1, total: 5 },
          overallStatus: 'degraded'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchStatusData();
    // Refresh every 60 seconds
    const interval = setInterval(() => {
      fetchStatusData();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [selectedPlatform, i18n.language]);

  // Calculate aggregated stats
  const statusStats = useMemo(() => {
  if (!servicesData?.data || !Array.isArray(servicesData.data)) {
    return { operational: 0, degraded: 0, outage: 0, maintenance: 0 };
  }
  
  return servicesData.data.reduce((acc, service) => {
    // Access status directly from service, not from service.attributes
    const status = service.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, { operational: 0, degraded: 0, outage: 0, maintenance: 0 });
}, [servicesData]);
  
  // Calculate overall health percentage
  const healthPercentage = useMemo(() => {
  if (!servicesData?.data || !Array.isArray(servicesData.data)) return 100;
  
  const data = servicesData.data;
  if (data.length === 0) return 100;
  
  const operationalCount = statusStats.operational || 0;
  return (operationalCount / data.length) * 100;
}, [servicesData, statusStats]);
  
  // Platform options for filter
  const platformOptions = [
    { value: 'all', label: t('status:allPlatforms', 'All Platforms') },
    { value: 'bitdash', label: 'BitDash' },
    { value: 'bitfund', label: 'BitFund' },
    { value: 'bitcash', label: 'BitCash' },
    { value: 'bittrade', label: 'BitTrade' },
    { value: 'bitstock', label: 'BitStock' }
  ];

  return (
    <Layout>
      <Head>
        <title>{t('status:pageTitle', 'System Status')} | BitDash</title>
      </Head>
      
      <Box
        bg={bgGradient}
        minH="100vh"
        py={{ base: 8, md: 16 }}
        px={{ base: 4, md: 8 }}
      >
        <Container 
          maxW="7xl" 
          dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
        >
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <MotionBox variants={itemVariants}>
              <VStack spacing={4} mb={10} textAlign="center">
                <Heading 
                  as="h1"
                  size="2xl"
                  bgGradient={`linear(to-r, ${primary}, ${secondary})`}
                  bgClip="text"
                >
                  {t('status:pageTitle', 'System Status')}
                </Heading>
                <Text fontSize="lg" maxW="2xl" mx="auto" opacity={0.8}>
                  {t('status:pageDescription', 'Current operational status of all BitDash platforms and services')}
                </Text>
                
                <HStack mt={2}>
                  <Icon as={Clock} size={16} />
                  <Text fontSize="sm">
                    {t('lastUpdated', 'Last updated')}: {lastUpdated || '—'}
                  </Text>
                  <Button 
                    leftIcon={<RefreshCw size={16} />} 
                    size="sm" 
                    variant="ghost"
                    isLoading={isLoading}
                    onClick={fetchStatusData}
                  >
                    {t('refresh', 'Refresh')}
                  </Button>
                </HStack>
              </VStack>
            </MotionBox>
            
            {/* Platform Filter */}
            <MotionBox variants={itemVariants} mb={8}>
              <Flex justify="center">
                <Tabs 
                  variant={`${brandKey}-outline`}
                  colorScheme={brandKey}
                  isLazy
                  onChange={(index) => setSelectedPlatform(platformOptions[index].value)}
                  defaultIndex={platformOptions.findIndex(p => p.value === selectedPlatform)}
                  size={{ base: "sm", md: "md" }}
                >
                  <TabList 
                    overflowX="auto" 
                    py={2}
                    whiteSpace="nowrap"
                    css={{
                      scrollbarWidth: 'none',
                      '::-webkit-scrollbar': { display: 'none' },
                    }}
                  >
                    {platformOptions.map(platform => (
                      <Tab key={platform.value}>{platform.label}</Tab>
                    ))}
                  </TabList>
                </Tabs>
              </Flex>
            </MotionBox>
            
            {/* Status Overview */}
            <MotionBox variants={itemVariants} mb={10}>
              <Box
                bg={cardBg}
                borderRadius="xl"
                boxShadow="lg"
                p={{ base: 4, md: 8 }}
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  h={2}
                  bgGradient={`linear(to-r, ${primary}, ${secondary})`}
                />
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                  <VStack align={i18n.language === 'ar' ? "end" : "start"} spacing={4}>
                    <Flex
                      align="center"
                      direction={i18n.language === 'ar' ? "row-reverse" : "row"}
                    >
                      <Badge 
                        colorScheme={
                          servicesData?.meta?.overallStatus === 'operational' ? 'green' : 
                          servicesData?.meta?.overallStatus === 'degraded' ? 'orange' : 
                          servicesData?.meta?.overallStatus === 'outage' ? 'red' : 'purple'
                        }
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="md"
                        textTransform="capitalize"
                        me={3}
                      >
                        {t(`status.${servicesData?.meta?.overallStatus || 'operational'}`, servicesData?.meta?.overallStatus || 'Operational')}
                      </Badge>
                      <Heading size="lg">
                        {t('status:systemStatus', 'System Status')}
                      </Heading>
                    </Flex>
                    
                    <Text>
                      {servicesData?.meta?.overallStatus === 'operational' 
                        ? t('status:allSystemsOperational', 'All systems are operational')
                        : t('status:someSystemsDegraded', 'Some systems are experiencing issues')}
                    </Text>
                    
                    <HStack spacing={4} pt={2}>
                      <VStack align={i18n.language === 'ar' ? "end" : "start"} spacing={0}>
                        <Text fontSize="sm" color="gray.500">
                          {t('status:operational', 'Operational')}
                        </Text>
                        <Text fontWeight="bold" fontSize="xl">
                          {statusStats.operational || 0}/{servicesData?.data?.length || 0}
                        </Text>
                      </VStack>
                      
                      <Divider orientation="vertical" height="40px" />
                      
                      <VStack align={i18n.language === 'ar' ? "end" : "start"} spacing={0}>
                        <Text fontSize="sm" color="gray.500">
                          {t('status:degraded', 'Degraded')}
                        </Text>
                        <Text fontWeight="bold" fontSize="xl" color="orange.500">
                          {statusStats.degraded || 0}
                        </Text>
                      </VStack>
                      
                      <Divider orientation="vertical" height="40px" />
                      
                      <VStack align={i18n.language === 'ar' ? "end" : "start"} spacing={0}>
                        <Text fontSize="sm" color="gray.500">
                          {t('status:outage', 'Outage')}
                        </Text>
                        <Text fontWeight="bold" fontSize="xl" color="red.500">
                          {statusStats.outage || 0}
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                  
                  <VStack align="center" justify="center">
                    <Box position="relative" width="160px" height="160px">
                      <Flex
                        position="absolute"
                        top={0}
                        left={0}
                        width="100%"
                        height="100%"
                        align="center"
                        justify="center"
                        direction="column"
                      >
                        <Text fontSize="3xl" fontWeight="bold">
                          {healthPercentage.toFixed(1)}%
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {t('status:uptime', 'Uptime')}
                        </Text>
                      </Flex>
                      
                      <CircularProgressIndicator
                        percentage={healthPercentage}
                        color={
                          healthPercentage > 95 ? 'green.400' :
                          healthPercentage > 90 ? 'yellow.400' :
                          healthPercentage > 80 ? 'orange.400' : 'red.400'
                        }
                        size={160}
                        trackColor={isDark ? 'gray.700' : 'gray.100'}
                      />
                    </Box>
                  </VStack>
                </SimpleGrid>
              </Box>
            </MotionBox>
            
            {/* Services Status */}
            <MotionBox variants={itemVariants} mb={10}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
               {isLoading ? (
                // Loading skeletons remain unchanged
                Array(6).fill(0).map((_, i) => (
                    <Skeleton 
                    key={i} 
                    height="140px" 
                    borderRadius="xl" 
                    startColor={isDark ? 'gray.700' : 'gray.100'}
                    endColor={isDark ? 'gray.600' : 'gray.300'}
                    />
                ))
                ) : (
                  // Service cards
                  servicesData?.data?.map(service => (
                    <MotionStat
                    key={service.id}
                    p={6}
                    bg={cardBg}
                    borderRadius="xl"
                    boxShadow="md"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    position="relative"
                    overflow="hidden"
                    >
                    <Box
                        position="absolute"
                        top={0}
                        left={0}
                        width={2}
                        height="100%"
                        bg={
                        service.status === 'operational' ? 'green.400' :
                        service.status === 'degraded' ? 'orange.400' :
                        service.status === 'outage' ? 'red.400' : 'purple.400'
                        }
                    />
                    
                    <Flex 
                        justify="space-between" 
                        mb={4}
                        direction={i18n.language === 'ar' ? "row-reverse" : "row"}
                    >
                        <HStack spacing={3}>
                        <Icon 
                            as={getIconComponent(service.icon)}
                            color={
                            service.status === 'operational' ? 'green.400' :
                            service.status === 'degraded' ? 'orange.400' :
                            service.status === 'outage' ? 'red.400' : 'purple.400'
                            }
                            boxSize={5}
                        />
                        <Text fontWeight="medium" fontSize="lg">
                            {service.name}
                        </Text>
                        </HStack>
                        
                        <Badge
                        colorScheme={
                            service.status === 'operational' ? 'green' :
                            service.status === 'degraded' ? 'orange' :
                            service.status === 'outage' ? 'red' : 'purple'
                        }
                        px={2}
                        py={1}
                        borderRadius="full"
                        textTransform="capitalize"
                        >
                        {t(`status.${service.status}`, service.status)}
                        </Badge>
                    </Flex>
                    
                    <Divider mb={4} />
                    
                    <SimpleGrid columns={2} spacing={4}>
                        <VStack align={i18n.language === 'ar' ? "end" : "start"} spacing={0}>
                        <Text fontSize="sm" color="gray.500">
                            {t('status:uptime', 'Uptime')}
                        </Text>
                        <Text fontWeight="bold" fontSize="md">
                            {typeof service.uptime === 'number' 
                            ? service.uptime.toFixed(2)
                            : service.uptime}%
                        </Text>
                        </VStack>
                        
                        <VStack align={i18n.language === 'ar' ? "end" : "start"} spacing={0}>
                        <Text fontSize="sm" color="gray.500">
                            {t('status:lastIncident', 'Last Incident')}
                        </Text>
                        <Text fontSize="md">
                            {service.last_incident 
                            ? new Date(service.last_incident).toLocaleDateString(i18n.language)
                            : t('status:none', 'None')}
                        </Text>
                        </VStack>
                    </SimpleGrid>
                    </MotionStat>
                ))
                )}
              </SimpleGrid>
            </MotionBox>
            
            {/* Recent Incidents */}
            <MotionBox variants={itemVariants}>
              <Box
                bg={cardBg}
                borderRadius="xl"
                boxShadow="lg"
                p={{ base: 4, md: 8 }}
                position="relative"
                overflow="hidden"
              >
                <Heading size="lg" mb={6}>
                  {t('status:recentIncidents', 'Recent Incidents')}
                </Heading>
                
                {incidents.length === 0 ? (
                  <Flex 
                    direction="column" 
                    align="center" 
                    justify="center" 
                    py={12}
                    bg={subtleBg}
                    borderRadius="lg"
                  >
                    <Icon as={CheckCircle} color="green.400" boxSize={10} mb={4} />
                    <Text fontSize="lg" fontWeight="medium">
                      {t('status:noRecentIncidents', 'No incidents in the last 90 days')}
                    </Text>
                  </Flex>
                ) : (
                  <VStack spacing={6} align="stretch">
                    {incidents.map(incident => (
                      <Box
                        key={incident.id}
                        bg={subtleBg}
                        borderRadius="lg"
                        p={5}
                      >
                        <Flex 
                          justify="space-between" 
                          mb={3}
                          direction={i18n.language === 'ar' ? "row-reverse" : "row"}
                        >
                          <VStack align={i18n.language === 'ar' ? "end" : "start"} spacing={1}>
                            <HStack spacing={2}>
                              <Text fontWeight="medium">{incident.date}</Text>
                              <Badge
                                colorScheme={
                                  incident.status === 'resolved' ? 'green' :
                                  incident.status === 'monitoring' ? 'yellow' :
                                  incident.status === 'investigating' ? 'orange' : 'purple'
                                }
                                textTransform="capitalize"
                              >
                                {incident.status}
                              </Badge>
                            </HStack>
                            <Heading size="md">{incident.title}</Heading>
                          </VStack>
                          
                          <Text fontSize="sm" color="gray.500">
                            {t('status:affectedServices', 'Affected Services')}: {incident.affectedServices.join(', ')}
                          </Text>
                        </Flex>
                        
                        <VStack align="stretch" ps={4} pt={2} ms={i18n.language === 'ar' ? 0 : 4} me={i18n.language === 'ar' ? 4 : 0} borderStartWidth={2} borderColor="gray.300">
                          {incident.updates.map((update, index) => (
                            <Box key={index} pb={4} position="relative">
                              <Box
                                position="absolute"
                                top="0"
                                start="-5px"
                                width="8px"
                                height="8px"
                                borderRadius="full"
                                bg="gray.300"
                              />
                              <HStack 
                                align="flex-start"
                                spacing={3}
                                direction={i18n.language === 'ar' ? "row-reverse" : "row"}
                              >
                                <Text fontSize="sm" fontWeight="bold" color="gray.500">
                                  {update.time}
                                </Text>
                                <Text fontSize="sm">{update.message}</Text>
                              </HStack>
                            </Box>
                          ))}
                        </VStack>
                      </Box>
                    ))}
                  </VStack>
                )}
              </Box>
            </MotionBox>
          </MotionBox>
        </Container>
      </Box>
    </Layout>
  );
};

// Circular progress indicator component
const CircularProgressIndicator = ({ percentage, color, size = 120, trackColor = 'gray.100' }) => {
  // Calculate circle properties
  const radius = size / 2;
  const strokeWidth = size / 15;
  const innerRadius = radius - strokeWidth;
  const circumference = 2 * Math.PI * innerRadius;
  const arc = circumference * (percentage / 100);
  const dashArray = `${arc} ${circumference}`;
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      {/* Background track */}
      <circle
        cx={radius}
        cy={radius}
        r={innerRadius}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      {/* Foreground progress */}
      <circle
        cx={radius}
        cy={radius}
        r={innerRadius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.5s ease' }}
      />
    </svg>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'status'])),
    },
  };
}

export default StatusPage;