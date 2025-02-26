// pages/admin/dashboard.js
import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Skeleton,
  Badge,
  Avatar,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Flex,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Alert,
  AlertIcon,
  Progress,
  Divider,
  Tooltip,
  Wrap,
  WrapItem,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  InputGroup,
  Input,
  InputRightElement,
  FormControl,
  FormLabel,
  Card,
  CardBody,
  useColorMode,
  Spinner
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import {
  FiUsers,
  FiDatabase,
  FiAward,
  FiDollarSign,
  FiActivity,
  FiSettings,
  FiRefreshCw,
  FiCreditCard,
  FiServer,
  FiAlertCircle,
  FiCheckCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiSearch,
  FiChevronDown,
  FiClock,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSend,
  FiFilter,
  FiFileText,
  FiGrid,
  FiList,
  FiLogOut,
  FiBarChart2,
  FiGlobe,
  FiShield,
  FiLock,
  FiUnlock,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionStat = motion(Stat);

// Get platform colors from theme key
const getPlatformColors = (platformKey) => {
  switch (platformKey) {
    case 'bitfund':
      return { primary: '#5c87cb', secondary: '#305896' };
    case 'bitcash':
      return { primary: '#56bba5', secondary: '#7bcfbd' };
    case 'bittrade':
      return { primary: '#59c6c6', secondary: '#38a4a4' };
    case 'bitinvest':
      return { primary: '#cfa872', secondary: '#efba72' };
    default:
      return { primary: '#67bdfd', secondary: '#67bdfd' }; // bitdash
  }
};

// Platform management options
const platformOptions = [
  { value: 'all', label: 'All Platforms' },
  { value: 'bitdash', label: 'BitDash' },
  { value: 'bitfund', label: 'BitFund' },
  { value: 'bitcash', label: 'BitCash' },
  { value: 'bittrade', label: 'BitTrade' },
  { value: 'bitinvest', label: 'BitInvest' }
];

// Loading skeleton component
const DashboardSkeleton = () => (
  <VStack spacing={6} w="full">
    <Skeleton height="100px" w="full" borderRadius="xl" />
    <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6} w="full">
      <Skeleton height="150px" borderRadius="xl" />
      <Skeleton height="150px" borderRadius="xl" />
      <Skeleton height="150px" borderRadius="xl" />
      <Skeleton height="150px" borderRadius="xl" />
    </SimpleGrid>
    <Skeleton height="300px" w="full" borderRadius="xl" />
    <Skeleton height="400px" w="full" borderRadius="xl" />
  </VStack>
);

// Login modal component
const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const { t } = useTranslation(['admin', 'common']);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Authentication failed');
      }

      // Store the JWT token
      localStorage.setItem('adminToken', data.jwt);
      localStorage.setItem('adminUser', JSON.stringify(data.user));

      toast({
        title: t('admin:login.success'),
        status: 'success',
        duration: 3000,
      });

      onLogin(data);
      onClose();
    } catch (error) {
      setError(error.message);
      toast({
        title: t('admin:login.error'),
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader>{t('admin:login.title')}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleLogin}>
          <ModalBody pb={6}>
            {error && (
              <Alert status="error" mb={4} borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>{t('admin:login.email')}</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bitdash.app"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>{t('admin:login.password')}</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" type="submit" isLoading={isLoading}>
              {t('admin:login.submit')}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

const AdminDashboard = () => {
  const { t } = useTranslation(['admin', 'common']);
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { colorMode } = useColorMode();
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [adminUser, setAdminUser] = useState(null);
  const [adminToken, setAdminToken] = useState('');
  const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
  const { isOpen: isApiModalOpen, onOpen: onApiModalOpen, onClose: onApiModalClose } = useDisclosure();
  const [selectedApi, setSelectedApi] = useState(null);
  const [apiEndpoints, setApiEndpoints] = useState([]);
  const [filteredEndpoints, setFilteredEndpoints] = useState([]);

  // Colors and styles
  const isDark = colorMode === 'dark';
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const subtleBg = useColorModeValue('gray.50', 'gray.700');
  const platformColors = getPlatformColors(selectedPlatform === 'all' ? 'bitdash' : selectedPlatform);

  // Check if user is logged in
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    const storedUser = localStorage.getItem('adminUser');

    if (storedToken && storedUser) {
      setAdminToken(storedToken);
      setAdminUser(JSON.parse(storedUser));
    } else {
      onLoginOpen();
    }
  }, [onLoginOpen]);

  // Handle successful login
  const handleLoginSuccess = (data) => {
    setAdminToken(data.jwt);
    setAdminUser(data.user);
  };

  // Fetch API endpoints from Strapi Content-Type API
  const { 
    data: contentTypes,
    isLoading: isLoadingContentTypes,
    error: contentTypesError 
  } = useQuery({
    queryKey: ['content-types'],
    queryFn: async () => {
      // This endpoint will get content types from Strapi
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/content-types`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch content types');
      }
      
      return response.json();
    },
    enabled: !!adminToken,
    onSuccess: (data) => {
      // Transform content types into API endpoints
      const endpoints = Object.keys(data).map(key => {
        const contentType = data[key];
        return {
          name: contentType.displayName || contentType.singularName || key,
          apiId: contentType.apiID || key,
          endpoint: `/api/${contentType.apiID || key}`,
          description: contentType.description || '',
          // Assign an icon based on the name
          icon: getIconForContentType(contentType.apiID || contentType.singularName || key)
        };
      });
      
      setApiEndpoints(endpoints);
      setFilteredEndpoints(endpoints);
    },
    onError: (error) => {
      console.error('Error fetching content types:', error);
      // If the token is expired or invalid, open login modal
      if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setAdminToken('');
        setAdminUser(null);
        onLoginOpen();
      }
    }
  });

  // Function to assign icons based on API name
  const getIconForContentType = (apiName) => {
    const apiNameLower = apiName.toLowerCase();
    
    if (apiNameLower.includes('user')) return FiUsers;
    if (apiNameLower.includes('wallet')) return FiCreditCard;
    if (apiNameLower.includes('transaction')) return FiDollarSign;
    if (apiNameLower.includes('auth')) return FiLock;
    if (apiNameLower.includes('customer')) return FiUsers;
    if (apiNameLower.includes('merchant')) return FiDollarSign;
    if (apiNameLower.includes('status')) return FiActivity;
    if (apiNameLower.includes('notification')) return FiSend;
    if (apiNameLower.includes('exchange')) return FiRefreshCw;
    if (apiNameLower.includes('trader')) return FiAward;
    if (apiNameLower.includes('broker')) return FiServer;
    
    // Default icon
    return FiDatabase;
  };

  // Fetch service status from public API
  const { 
    data: statusData, 
    isLoading: isLoadingStatus,
    error: statusError
  } = useQuery({
    queryKey: ['service-status', selectedPlatform],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public/status?platform=${selectedPlatform}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch status');
      return response.json();
    },
    enabled: true // Always fetch status, even if not logged in
  });

  // Fetch statistics for selected platform
  const {
    data: statsData,
    isLoading: isLoadingStats,
    error: statsError
  } = useQuery({
    queryKey: ['platform-stats', selectedPlatform],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/stats?platform=${selectedPlatform}`,
        {
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch platform statistics');
      return response.json();
    },
    enabled: !!adminToken
  });

  // Handle search for API endpoints
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEndpoints(apiEndpoints);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredEndpoints(
        apiEndpoints.filter(
          endpoint => 
            endpoint.name.toLowerCase().includes(query) ||
            endpoint.endpoint.toLowerCase().includes(query) ||
            endpoint.description.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, apiEndpoints]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminToken('');
    setAdminUser(null);
    
    toast({
      title: t('admin:logout.success'),
      status: 'info',
      duration: 3000,
    });
    
    onLoginOpen();
  };

  // Open API details modal
  const openApiDetails = (endpoint) => {
    setSelectedApi(endpoint);
    onApiModalOpen();
  };

  // Calculate stats
const statusStats = useMemo(() => {
  if (!statusData?.data || !Array.isArray(statusData.data)) {
    return { operational: 0, degraded: 0, outage: 0, maintenance: 0 };
  }
  
  return statusData.data.reduce((acc, service) => {
    // Check if service and attributes exist before accessing status
    const status = service?.attributes?.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, { operational: 0, degraded: 0, outage: 0, maintenance: 0 });
}, [statusData]);

  // Loading state
  if (!adminToken && !isLoginOpen) {
    return (
      <Layout>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8} align="center" justify="center" h="50vh">
            <Spinner size="xl" color="blue.500" />
            <Text>Loading admin dashboard...</Text>
          </VStack>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{t('admin:pageTitle')} | BitDash</title>
      </Head>

      <Box 
        py={{ base: 4, md: 8 }}
        position="relative"
        bg={isDark ? 'gray.900' : 'gray.50'}
        minH="100vh"
      >
        <Container maxW="8xl" px={{ base: 2, md: 6 }}>
          {/* Header Section */}
          <Flex 
            justify="space-between" 
            align="center"
            mb={8}
            flexDir={{ base: 'column', md: 'row' }}
            gap={{ base: 4, md: 0 }}
          >
            <VStack align={{ base: 'center', md: 'flex-start' }}>
              <Heading 
                size="xl"
                bgGradient={`linear(to-r, ${platformColors.primary}, ${platformColors.secondary})`}
                bgClip="text"
              >
                {t('admin:dashboard.title')}
              </Heading>
              <Text color="gray.500">{t('admin:dashboard.subtitle')}</Text>
            </VStack>

            <HStack spacing={4}>
              {adminUser && (
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<FiChevronDown />}
                    variant="outline"
                  >
                    <HStack>
                      <Avatar 
                        size="xs" 
                        name={adminUser.username || adminUser.email} 
                        bg="blue.500"
                      />
                      <Text>{adminUser.username || adminUser.email}</Text>
                    </HStack>
                  </MenuButton>
                  <MenuList>
                    <MenuItem icon={<FiSettings />}>
                      {t('admin:account.settings')}
                    </MenuItem>
                    <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                      {t('admin:account.logout')}
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}

              <Select
                onChange={(e) => setSelectedPlatform(e.target.value)}
                value={selectedPlatform}
                width={{ base: 'full', md: '200px' }}
              >
                {platformOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </HStack>
          </Flex>

          {/* Stats Overview */}
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6} mb={8}>
            <MotionStat
              p={6}
              bg={cardBg}
              borderRadius="xl"
              boxShadow="md"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <StatLabel fontSize="sm" color="gray.500">
                {t('admin:stats.totalUsers')}
              </StatLabel>
              <StatNumber fontSize="3xl" fontWeight="bold" color={platformColors.primary}>
                {isLoadingStatus ? (
                <Skeleton height="1.5rem" width="80px" />
                ) : (
                `${((statusStats.operational / (statusData?.data?.length || 1)) * 100).toFixed(0)}%`
                )}
              </StatNumber>
              <HStack mt={2}>
                {!isLoadingStats && statsData?.usersTrend > 0 ? (
                  <Icon as={FiTrendingUp} color="green.500" />
                ) : (
                  <Icon as={FiTrendingDown} color="red.500" />
                )}
                <StatHelpText mb={0}>
                  {isLoadingStats ? (
                    <Skeleton height="1rem" width="60px" />
                  ) : (
                    `${Math.abs(statsData?.usersTrend || 0).toFixed(1)}% ${statsData?.usersTrend > 0 ? t('admin:stats.increase') : t('admin:stats.decrease')}`
                  )}
                </StatHelpText>
              </HStack>
            </MotionStat>

            <MotionStat
              p={6}
              bg={cardBg}
              borderRadius="xl"
              boxShadow="md"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <StatLabel fontSize="sm" color="gray.500">
                {t('admin:stats.transactions')}
              </StatLabel>
              <StatNumber fontSize="3xl" fontWeight="bold" color={platformColors.primary}>
                {isLoadingStats ? (
                  <Skeleton height="1.5rem" width="80px" />
                ) : (
                  statsData?.transactionsCount?.toLocaleString() || '0'
                )}
              </StatNumber>
              <HStack mt={2}>
                <Icon as={FiActivity} color="blue.500" />
                <StatHelpText mb={0}>
                  {isLoadingStats ? (
                    <Skeleton height="1rem" width="60px" />
                  ) : (
                    t('admin:stats.last24h', { count: statsData?.transactions24h || 0 })
                  )}
                </StatHelpText>
              </HStack>
            </MotionStat>

            <MotionStat
              p={6}
              bg={cardBg}
              borderRadius="xl"
              boxShadow="md"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <StatLabel fontSize="sm" color="gray.500">
                {t('admin:stats.revenue')}
              </StatLabel>
              <StatNumber fontSize="3xl" fontWeight="bold" color={platformColors.primary}>
                {isLoadingStats ? (
                  <Skeleton height="1.5rem" width="80px" />
                ) : (
                  `$${(statsData?.totalRevenue || 0).toLocaleString()}`
                )}
              </StatNumber>
              <HStack mt={2}>
                {!isLoadingStats && statsData?.revenueTrend > 0 ? (
                  <Icon as={FiTrendingUp} color="green.500" />
                ) : (
                  <Icon as={FiTrendingDown} color="red.500" />
                )}
                <StatHelpText mb={0}>
                  {isLoadingStats ? (
                    <Skeleton height="1rem" width="60px" />
                  ) : (
                    `${Math.abs(statsData?.revenueTrend || 0).toFixed(1)}% ${statsData?.revenueTrend > 0 ? t('admin:stats.increase') : t('admin:stats.decrease')}`
                  )}
                </StatHelpText>
              </HStack>
            </MotionStat>

            <MotionStat
              p={6}
              bg={cardBg}
              borderRadius="xl"
              boxShadow="md"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <StatLabel fontSize="sm" color="gray.500">
                {t('admin:stats.systemHealth')}
              </StatLabel>
              <StatNumber fontSize="3xl" fontWeight="bold" color={
                isLoadingStatus ? platformColors.primary :
                statusStats.operational / (statusData?.data?.length || 1) > 0.9 ? 'green.500' :
                statusStats.degraded > 0 ? 'orange.500' :
                statusStats.outage > 0 ? 'red.500' : platformColors.primary
              }>
                {isLoadingStatus ? (
                  <Skeleton height="1.5rem" width="80px" />
                ) : (
                  `${((statusStats.operational / (statusData?.data?.length || 1)) * 100).toFixed(0)}%`
                )}
              </StatNumber>
              <HStack mt={2}>
                <Icon as={
                  isLoadingStatus ? FiActivity :
                  statusStats.operational === (statusData?.data?.length || 0) ? FiCheckCircle :
                  statusStats.outage > 0 ? FiAlertCircle :
                  FiActivity
                } color={
                  isLoadingStatus ? 'blue.500' :
                  statusStats.operational === (statusData?.data?.length || 0) ? 'green.500' :
                  statusStats.outage > 0 ? 'red.500' :
                  'orange.500'
                } />
                <StatHelpText mb={0}>
                  {isLoadingStatus ? (
                    <Skeleton height="1rem" width="60px" />
                  ) : statusStats.operational === (statusData?.data?.length || 0) ? (
                    t('admin:stats.allOperational')
                  ) : statusStats.outage > 0 ? (
                    t('admin:stats.serviceOutages', { count: statusStats.outage })
                  ) : (
                    t('admin:stats.serviceDegraded', { count: statusStats.degraded })
                  )}
                </StatHelpText>
              </HStack>
            </MotionStat>
          </SimpleGrid>

          {/* Main Content Area */}
          <Tabs variant="soft-rounded" colorScheme="blue" mb={8}>
            <TabList mb={4} overflowX="auto" whiteSpace="nowrap" py={2}>
              <Tab><Icon as={FiServer} mr={2} /> {t('admin:tabs.apis')}</Tab>
              <Tab><Icon as={FiUsers} mr={2} /> {t('admin:tabs.users')}</Tab>
              <Tab><Icon as={FiDollarSign} mr={2} /> {t('admin:tabs.transactions')}</Tab>
              <Tab><Icon as={FiActivity} mr={2} /> {t('admin:tabs.status')}</Tab>
              <Tab><Icon as={FiSettings} mr={2} /> {t('admin:tabs.settings')}</Tab>
            </TabList>

            <TabPanels>
              {/* APIs Tab */}
              <TabPanel px={0}>
                <Card bg={cardBg} shadow="md" borderRadius="xl">
                  <CardBody>
                    <VStack spacing={6} align="stretch">
                      <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={4}>
                        <Heading size="md">{t('admin:apis.title')}</Heading>
                        <InputGroup maxW={{ base: 'full', md: '300px' }}>
                          <Input
                            placeholder={t('admin:apis.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <InputRightElement>
                            <Icon as={FiSearch} color="gray.400" />
                          </InputRightElement>
                        </InputGroup>
                      </Flex>

                      {isLoadingContentTypes ? (
                        <VStack spacing={4} align="stretch">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Skeleton key={i} height="60px" borderRadius="md" />
                          ))}
                        </VStack>
                      ) : contentTypesError ? (
                        <Alert status="error" borderRadius="md">
                          <AlertIcon />
                          {t('admin:apis.error')}
                          <Button size="sm" ml={4} onClick={onLoginOpen}>
                            {t('admin:login.retry')}
                          </Button>
                        </Alert>
                      ) : (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                          {filteredEndpoints.map((endpoint, index) => (
                            <Card 
                              key={index} 
                              bg={subtleBg} 
                              variant="outline" 
                              _hover={{ shadow: 'md' }}
                              transition="all 0.2s"
                              cursor="pointer"
                              onClick={() => openApiDetails(endpoint)}
                            >
                              <CardBody>
                                <HStack spacing={3} mb={2}>
                                  <Icon as={endpoint.icon} boxSize={5} color={platformColors.primary} />
                                  <Heading size="sm">{endpoint.name}</Heading>
                                </HStack>
                                <Text fontSize="sm" color="gray.500" mb={2} noOfLines={2}>
                                  {endpoint.description || t('admin:apis.noDescription')}
                                </Text>
                                <Text fontSize="xs" color="gray.500" fontFamily="monospace">
                                  {endpoint.endpoint}
                                </Text>
                              </CardBody>
                            </Card>
                          ))}
                        </SimpleGrid>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Users Tab */}
              <TabPanel px={0}>
                {/* Users tab content here */}
                <Card bg={cardBg} shadow="md" borderRadius="xl">
                  <CardBody>
                    <VStack spacing={6} align="stretch">
                      <Heading size="md" mb={4}>{t('admin:users.title')}</Heading>
                      
                      {/* User management coming soon message */}
                      <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        {t('admin:transactions.comingSoon')}
                      </Alert>
                    </VStack>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Status Tab */}
              <TabPanel px={0}>
                <Card bg={cardBg} shadow="md" borderRadius="xl">
                  <CardBody>
                    <VStack spacing={6} align="stretch">
                      <Flex justify="space-between" align="center" mb={4}>
                        <Heading size="md">{t('admin:status.title')}</Heading>
                        <Button 
                          leftIcon={<FiRefreshCw />} 
                          size="sm" 
                          colorScheme="blue"
                          variant="outline"
                          isLoading={isLoadingStatus}
                          onClick={() => queryClient.invalidateQueries(['service-status'])}
                        >
                          {t('admin:status.refresh')}
                        </Button>
                      </Flex>

                      {isLoadingStatus ? (
                        <VStack spacing={4} align="stretch">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Skeleton key={i} height="60px" borderRadius="md" />
                          ))}
                        </VStack>
                      ) : statusError ? (
                        <Alert status="error" borderRadius="md">
                          <AlertIcon />
                          {t('admin:status.error')}
                        </Alert>
                      ) : (
                        <>
                          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={6}>
                            <Stat bg={subtleBg} p={4} borderRadius="md">
                              <HStack spacing={2}>
                                <Icon as={FiCheckCircle} color="green.500" />
                                <StatLabel>{t('admin:status.operational')}</StatLabel>
                              </HStack>
                              <StatNumber>{statusStats.operational}</StatNumber>
                            </Stat>
                            <Stat bg={subtleBg} p={4} borderRadius="md">
                              <HStack spacing={2}>
                                <Icon as={FiActivity} color="orange.500" />
                                <StatLabel>{t('admin:status.degraded')}</StatLabel>
                              </HStack>
                              <StatNumber>{statusStats.degraded}</StatNumber>
                            </Stat>
                            <Stat bg={subtleBg} p={4} borderRadius="md">
                              <HStack spacing={2}>
                                <Icon as={FiAlertCircle} color="red.500" />
                                <StatLabel>{t('admin:status.outage')}</StatLabel>
                              </HStack>
                              <StatNumber>{statusStats.outage}</StatNumber>
                            </Stat>
                            <Stat bg={subtleBg} p={4} borderRadius="md">
                              <HStack spacing={2}>
                                <Icon as={FiClock} color="purple.500" />
                                <StatLabel>{t('admin:status.maintenance')}</StatLabel>
                              </HStack>
                              <StatNumber>{statusStats.maintenance}</StatNumber>
                            </Stat>
                          </SimpleGrid>

                          <Box overflowX="auto">
                            <Table variant="simple" size="sm">
                              <Thead>
                                <Tr>
                                  <Th>{t('admin:status.service')}</Th>
                                  <Th>{t('admin:status.status')}</Th>
                                  <Th>{t('admin:status.uptime')}</Th>
                                  <Th>{t('admin:status.lastIncident')}</Th>
                                  <Th>{t('admin:status.actions')}</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {statusData?.data && Array.isArray(statusData.data) ? (
                                statusData.data.map((service) => (
                                    <Tr key={service.id}>
                                    <Td>
                                        <HStack>
                                        <Icon 
                                            as={getIconForContentType(service.attributes?.icon || '')} 
                                            color={
                                            service.attributes?.status === 'operational' ? 'green.500' :
                                            service.attributes?.status === 'degraded' ? 'orange.500' :
                                            service.attributes?.status === 'outage' ? 'red.500' : 'purple.500'
                                            }
                                        />
                                        <Text>{service.attributes?.name}</Text>
                                        </HStack>
                                    </Td>
                                    <Td>
                                        <Badge
                                        colorScheme={
                                            service.attributes?.status === 'operational' ? 'green' :
                                            service.attributes?.status === 'degraded' ? 'orange' :
                                            service.attributes?.status === 'outage' ? 'red' : 'purple'
                                        }
                                        textTransform="capitalize"
                                        >
                                        {service.attributes?.status || 'unknown'}
                                        </Badge>
                                    </Td>
                                    <Td>{service.attributes?.uptime || 0}%</Td>
                                    <Td>
                                        {service.attributes?.last_incident 
                                        ? new Date(service.attributes.last_incident).toLocaleDateString() 
                                        : t('admin:status.none')}
                                    </Td>
                                    <Td>
                                        <HStack spacing={1}>
                                        <IconButton
                                            aria-label={t('admin:status.edit')}
                                            icon={<FiEdit size={14} />}
                                            size="xs"
                                            variant="ghost"
                                        />
                                        <IconButton
                                            aria-label={t('admin:status.delete')}
                                            icon={<FiTrash2 size={14} />}
                                            size="xs"
                                            variant="ghost"
                                        />
                                        </HStack>
                                    </Td>
                                    </Tr>
                                ))
                                ) : (
                                <Tr>
                                    <Td colSpan={5} textAlign="center">
                                    {t('admin:status.noData')}
                                    </Td>
                                </Tr>
                                )}
                              </Tbody>
                            </Table>
                          </Box>
                        </>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Settings Tab */}
              <TabPanel px={0}>
                <Card bg={cardBg} shadow="md" borderRadius="xl">
                  <CardBody>
                    <VStack spacing={6} align="stretch">
                      <Heading size="md" mb={4}>{t('admin:settings.title')}</Heading>
                      
                      {/* Settings management coming soon message */}
                      <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        {t('admin:settings.comingSoon')}
                      </Alert>
                    </VStack>
                  </CardBody>
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Box>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={onLoginClose}
        onLogin={handleLoginSuccess}
      />

      {/* API Details Modal */}
      {selectedApi && (
        <Modal isOpen={isApiModalOpen} onClose={onApiModalClose} size="xl">
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent>
            <ModalHeader>
              <HStack>
                <Icon as={selectedApi.icon} color={platformColors.primary} />
                <Text>{selectedApi.name}</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontWeight="medium">{t('admin:apis.endpoint')}</Text>
                  <HStack
                    bg={subtleBg}
                    p={2}
                    borderRadius="md"
                    fontFamily="monospace"
                    fontSize="sm"
                    overflow="hidden"
                  >
                    <Text isTruncated>{`${process.env.NEXT_PUBLIC_BACKEND_URL}${selectedApi.endpoint}`}</Text>
                    <IconButton
                      icon={<FiCopy />}
                      aria-label="Copy URL"
                      size="xs"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BACKEND_URL}${selectedApi.endpoint}`);
                        toast({
                          title: t('admin:apis.copied'),
                          status: 'success',
                          duration: 2000,
                        });
                      }}
                    />
                  </HStack>
                </Box>

                <Divider />

                <Box>
                  <Text fontWeight="medium" mb={2}>{t('admin:apis.description')}</Text>
                  <Text>{selectedApi.description || t('admin:apis.noDescription')}</Text>
                </Box>

                <Divider />

                <Box>
                  <Text fontWeight="medium" mb={2}>{t('admin:apis.actions')}</Text>
                  <HStack spacing={4}>
                    <Button
                      leftIcon={<FiEye />}
                      onClick={() => {
                        window.open(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/content-manager/collection-types${selectedApi.endpoint.replace('/api', '')}`, '_blank');
                      }}
                    >
                      {t('admin:apis.viewInAdmin')}
                    </Button>
                    <Button
                      leftIcon={<FiFileText />}
                      onClick={() => {
                        window.open(`${process.env.NEXT_PUBLIC_BACKEND_URL}${selectedApi.endpoint}?populate=*`, '_blank');
                      }}
                    >
                      {t('admin:apis.viewData')}
                    </Button>
                  </HStack>
                </Box>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['admin', 'common'])),
    },
  };
}

export default AdminDashboard;