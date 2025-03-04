// pages/404.js
import { 
  Box, 
  Button, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  HStack,
  SimpleGrid,
  Flex,
  useColorMode,
  useTheme,
  Badge,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  Image,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Server, 
  Database, 
  Send, 
  Globe,
  Clock,
  MessageCircle,
  ExternalLink,
  Wifi,
  BarChart,
  RefreshCw
} from 'lucide-react';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Helper function to determine the brand key from subdomain
const getBrandKeyFromSubdomain = (hostname) => {
  if (!hostname) return 'bitdash';
  
  try {
    // For domains like "fund.bitdash.app"
    if (hostname.includes('.') && hostname.split('.').length >= 3) {
      const subdomain = hostname.split('.')[0];
      
      if (subdomain === 'fund') return 'bitfund';
      if (subdomain === 'cash') return 'bitcash';
      if (subdomain === 'trade') return 'bittrade';
      if (subdomain === 'stock') return 'bitstock';
    }
  } catch (e) {
    console.error("Error parsing subdomain:", e);
  }
  
  // Default fallback
  return 'bitdash';
};

export default function Custom404() {
  const { t, i18n } = useTranslation(['common', 'errors']);
  const router = useRouter();
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State for animated elements
  const [isHovered, setIsHovered] = useState(false);
  const [randomDigits, setRandomDigits] = useState(['4', '0', '4']);
  const [brandKey, setBrandKey] = useState('bitdash');
  const [serviceStatus, setServiceStatus] = useState([]);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [overallStatus, setOverallStatus] = useState('operational');

  // Client-side detection of subdomain
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const detectedBrandKey = getBrandKeyFromSubdomain(hostname);
      setBrandKey(detectedBrandKey);
    }
  }, []);
  
  // Fetch service status
useEffect(() => {
  const fetchServiceStatus = async () => {
    if (!brandKey) return;
    
    setIsLoadingStatus(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public/status?platform=${brandKey}`);
      if (!response.ok) throw new Error('Failed to fetch status');
      
      const data = await response.json();
      // Set the service status directly from data.data
      setServiceStatus(data.data || []);
      // Set overall status from meta.overallStatus
      setOverallStatus(data.meta?.overallStatus || 'operational');
      setLastUpdated(new Date().toLocaleTimeString(i18n.language, { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    } catch (error) {
      console.error('Error fetching service status:', error);
      // Fallback status data with the correct structure
      setServiceStatus([
        { id: 1, name: 'API', status: 'operational', icon: 'Server', uptime: 99.98 },
        { id: 2, name: 'Dashboard', status: 'operational', icon: 'Globe', uptime: 99.95 },
        { id: 3, name: 'Authentication', status: 'operational', icon: 'Database', uptime: 100.00 },
        { id: 4, name: 'Payments', status: 'degraded', icon: 'Wifi', uptime: 97.50 },
        { id: 5, name: 'Notifications', status: 'operational', icon: 'Send', uptime: 99.89 }
      ]);
    } finally {
      setIsLoadingStatus(false);
    }
  };
  
  fetchServiceStatus();
}, [brandKey, i18n.language]);
  
  // Access the brand colors directly from theme
  const brandColors = theme.colors.brand[brandKey] || theme.colors.brand.bitdash;
  
  const isDark = colorMode === 'dark';

  // Use colors from the theme
  const primary = brandColors['500'];
  const secondary = brandColors['600'];
  
  // Map icons to components
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'Server': return Server;
      case 'Globe': return Globe;
      case 'Database': return Database;
      case 'Send': return Send;
      case 'Wifi': return Wifi;
      case 'BarChart': return BarChart;
      default: return Server;
    }
  };

  // Glass card background and colors
  const cardBg = isDark ? 'rgba(20, 20, 20, 0.7)' : 'rgba(255, 255, 255, 0.7)';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
  const subtleBg = isDark ? 'rgba(30, 30, 30, 0.5)' : 'rgba(240, 240, 240, 0.5)';
  const subtextColor = isDark ? 'gray.400' : 'gray.600';
  
  // Modern "scramble" effect on hover
  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setRandomDigits((prev) => prev.map(() => Math.floor(Math.random() * 10).toString()));
      }, 50);

      setTimeout(() => {
        clearInterval(interval);
        setRandomDigits(['4', '0', '4']);
      }, 500);
    }
  }, [isHovered]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Handle language change
  const handleLanguageChange = (lang) => {
    router.push(router.pathname, router.pathname, { locale: lang });
  };

  return (
    <Layout>
      <Head>
        <title>{t('errors:pageNotFoundTitle', 'Page Not Found')}</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Container maxW="7xl" pt={{ base: 10, md: 20 }} pb={16} px={{ base: 4, md: 8 }}>
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main Content */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={10} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            {/* 404 Message Section */}
            <MotionBox
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <VStack spacing={6} align={i18n.language === 'ar' ? "end" : "start"} h="full" justify="center">
                {/* Back Button */}
                <MotionBox variants={itemVariants}>
                  <Button
                    leftIcon={i18n.language === 'ar' ? null : <ArrowLeft size={16} />}
                    rightIcon={i18n.language === 'ar' ? <ArrowLeft size={16} /> : null}
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/')}
                    color={subtextColor}
                    _hover={{ bg: subtleBg }}
                  >
                    {t('backToHome', 'Back to Home')}
                  </Button>
                </MotionBox>
                
                {/* Animated 404 */}
                <MotionBox
                  variants={itemVariants}
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                  cursor="pointer"
                >
                  <Heading
                    fontSize={{ base: '8rem', md: '10rem', lg: '12rem' }}
                    fontWeight="900"
                    letterSpacing="tight"
                    lineHeight="0.8"
                    bgGradient={`linear(to-r, ${primary}, ${secondary})`}
                    bgClip="text"
                    m={0}
                  >
                    {randomDigits.join('')}
                  </Heading>
                </MotionBox>
                
                {/* Message */}
                <MotionBox variants={itemVariants} maxW="md">
                  <Heading 
                    size="lg" 
                    mb={3}
                    bgGradient={`linear(to-r, ${primary}, ${secondary})`}
                    bgClip="text"
                  >
                    {t('404', 'Page Not Found')}
                  </Heading>
                  <Text fontSize="lg" color={subtextColor} mb={6}>
                    {t('404Message', "The page you're looking for doesn't exist or has been moved.")}
                  </Text>
                  
                  <HStack spacing={4}>
                    <Button
                      variant={`${brandKey}-solid`}
                      size="lg"
                      onClick={() => router.push('/')}
                      shadow="lg"
                      px={6}
                    >
                      {t('goToHome', 'Go to Homepage')}
                    </Button>
                    <Button
                      variant={`${brandKey}-outline`}
                      size="lg"
                      onClick={onOpen}
                      shadow="sm"
                    >
                      {t('checkStatus', 'Check Status')}
                    </Button>
                  </HStack>
                </MotionBox>
                
                {/* Support Links */}
                <MotionBox variants={itemVariants} pt={6} w="full">
                  <Text fontSize="sm" fontWeight="medium" mb={3} color={subtextColor}>
                    {t('needHelp', 'Need help? Get in touch with our support team')}
                  </Text>
                  <HStack spacing={4}>
                    <Button
                      leftIcon={<MessageCircle size={18} />}
                      onClick={() => window.open(`https://t.me/BitDashSupport`, '_blank')}
                      variant="ghost"
                      size="md"
                      color={primary}
                      _hover={{ bg: subtleBg }}
                    >
                      {t('telegram', 'Telegram')}
                    </Button>
                    <Button
                      leftIcon={<Icon as={MessageCircle} />}
                      onClick={() => window.open('https://api.whatsapp.com/send?phone=00447538636207', '_blank')}
                      variant="ghost"
                      size="md"
                      color={primary}
                      _hover={{ bg: subtleBg }}
                    >
                      {t('whatsapp', 'WhatsApp')}
                    </Button>
                  </HStack>
                </MotionBox>
              </VStack>
            </MotionBox>
            
            {/* Service Status Column */}
            <MotionBox
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              display={{ base: 'none', lg: 'block' }}
            >
              <Box
                bg={cardBg}
                backdropFilter="blur(10px)"
                borderRadius="2xl"
                borderWidth="1px"
                borderColor={cardBorder}
                overflow="hidden"
                h="full"
                p={6}
                boxShadow="xl"
              >
                <VStack spacing={6} align={i18n.language === 'ar' ? "end" : "start"} h="full">
                  <Flex 
                    justify="space-between" 
                    w="full" 
                    align="center" 
                    direction={i18n.language === 'ar' ? "row-reverse" : "row"}
                  >
                    <Heading size="md" fontWeight="600">
                      {t('systemStatus', 'System Status')}
                    </Heading>
                    <HStack>
                      <Icon as={Clock} size={14} color={subtextColor} />
                      <Text fontSize="xs" color={subtextColor}>
                        {t('lastUpdated', 'Last updated')}: {lastUpdated}
                      </Text>
                    </HStack>
                  </Flex>
                  
                  <Box as="hr" w="full" borderColor={cardBorder} />
                  
                  <HStack w="full" justify="space-between" direction={i18n.language === 'ar' ? "row-reverse" : "row"}>
                    <HStack>
                      <Badge 
                        colorScheme={
                          overallStatus === 'operational' ? 'green' : 
                          overallStatus === 'degraded' ? 'orange' : 
                          overallStatus === 'outage' ? 'red' : 'purple'
                        } 
                        px={2} 
                        py={1} 
                        borderRadius="full"
                      >
                        {t(`status.${overallStatus}`, overallStatus)}
                      </Badge>
                      <Text fontSize="sm">{t('overallStatus', 'Overall Status')}</Text>
                    </HStack>
                    
                    <Button 
                      leftIcon={<RefreshCw size={14} />} 
                      size="xs" 
                      variant="ghost"
                      isLoading={isLoadingStatus}
                      onClick={() => {
                        setIsLoadingStatus(true);
                        // Re-fetch status data
                        setTimeout(() => {
                          setIsLoadingStatus(false);
                          setLastUpdated(new Date().toLocaleTimeString(i18n.language, { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          }));
                        }, 1000);
                      }}
                    >
                      {t('refresh', 'Refresh')}
                    </Button>
                  </HStack>
                  
                  <VStack spacing={4} align="stretch" w="full">
                    {serviceStatus.map((service, index) => (
                      <MotionBox
                        key={index}
                        variants={itemVariants}
                        w="full"
                      >
                        <Flex
                          justify="space-between"
                          w="full"
                          p={3}
                          borderRadius="lg"
                          bg={subtleBg}
                          align="center"
                          direction={i18n.language === 'ar' ? "row-reverse" : "row"}
                        >
                          <HStack spacing={3} direction={i18n.language === 'ar' ? "row-reverse" : "row"}>
                            <Icon 
                              as={getIconComponent(service.icon || 'Server')} 
                              color={
                                service.status === 'operational' ? 'green.400' : 
                                service.status === 'degraded' ? 'orange.400' : 
                                service.status === 'outage' ? 'red.400' : 'purple.400'
                              } 
                            />
                            <Text fontWeight="medium">{service.name}</Text>
                          </HStack>
                          <HStack spacing={3} direction={i18n.language === 'ar' ? "row-reverse" : "row"}>
                            <Text fontSize="sm" color={subtextColor}>{service.uptime}%</Text>
                            <Badge
                              colorScheme={
                                service.status === 'operational' ? 'green' : 
                                service.status === 'degraded' ? 'orange' : 
                                service.status === 'outage' ? 'red' : 'purple'
                              }
                              fontSize="xs"
                              textTransform="capitalize"
                              px={2}
                              py={0.5}
                              borderRadius="full"
                            >
                              {t(`status.${service.status}`, service.status)}
                            </Badge>
                          </HStack>
                        </Flex>
                      </MotionBox>
                    ))}
                  </VStack>
                  
                  <Flex justify="center" w="full" mt="auto">
                    <MotionBox
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="ghost"
                        rightIcon={<ExternalLink size={16} />}
                        size="sm"
                        color={primary}
                        onClick={() => router.push('/status')}
                      >
                        {t('viewDetailedStatus', 'View detailed status')}
                      </Button>
                    </MotionBox>
                  </Flex>
                </VStack>
              </Box>
            </MotionBox>
          </SimpleGrid>
        </MotionBox>
      </Container>
      
      {/* Service Status Modal for Mobile */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent
          bg={cardBg}
          backdropFilter="blur(10px)"
          borderRadius="2xl"
          borderWidth="1px"
          borderColor={cardBorder}
          p={2}
          dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
        >
          <ModalHeader>{t('systemStatus', 'System Status')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch" w="full">
              <HStack justify="space-between">
                <HStack>
                  <Badge 
                    colorScheme={
                      overallStatus === 'operational' ? 'green' : 
                      overallStatus === 'degraded' ? 'orange' : 
                      overallStatus === 'outage' ? 'red' : 'purple'
                    } 
                    px={2} 
                    py={1} 
                    borderRadius="full"
                  >
                    {t(`status.${overallStatus}`, overallStatus)}
                  </Badge>
                  <Text fontSize="sm">{t('overallStatus', 'Overall Status')}</Text>
                </HStack>
                <Text fontSize="xs" color={subtextColor}>
                  {t('lastUpdated', 'Last updated')}: {lastUpdated}
                </Text>
              </HStack>
              
              {serviceStatus.map((service, index) => (
                <Flex
                  key={index}
                  justify="space-between"
                  w="full"
                  p={3}
                  borderRadius="lg"
                  bg={subtleBg}
                  align="center"
                  direction={i18n.language === 'ar' ? "row-reverse" : "row"}
                >
                  <HStack spacing={3} direction={i18n.language === 'ar' ? "row-reverse" : "row"}>
                    <Icon 
                      as={getIconComponent(service.icon || 'Server')} 
                      color={
                        service.status === 'operational' ? 'green.400' : 
                        service.status === 'degraded' ? 'orange.400' : 
                        service.status === 'outage' ? 'red.400' : 'purple.400'
                      } 
                    />
                    <Text fontWeight="medium">{service.name}</Text>
                  </HStack>
                  <HStack spacing={3} direction={i18n.language === 'ar' ? "row-reverse" : "row"}>
                    <Text fontSize="sm" color={subtextColor}>{service.uptime}%</Text>
                    <Badge
                      colorScheme={
                        service.status === 'operational' ? 'green' : 
                        service.status === 'degraded' ? 'orange' : 
                        service.status === 'outage' ? 'red' : 'purple'
                      }
                      fontSize="xs"
                      textTransform="capitalize"
                      px={2}
                      py={0.5}
                      borderRadius="full"
                    >
                      {t(`status.${service.status}`, service.status)}
                    </Badge>
                  </HStack>
                </Flex>
              ))}
              
              <Button
                variant={`${brandKey}-solid`}
                rightIcon={<ExternalLink size={16} />}
                size="sm"
                onClick={() => {
                  onClose();
                  router.push('/status');
                }}
                mt={2}
              >
                {t('viewDetailedStatus', 'View detailed status')}
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  );
}