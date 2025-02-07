// pages/auto/dealer/dashboard.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';
import {
  Box,
  Container,
  VStack,
  HStack,
  SimpleGrid,
  Text,
  Button,
  IconButton,
  Heading,
  useColorMode,
  Icon,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Badge,
  Image,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerFooter,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
} from '@chakra-ui/react';
import {
  Car,
  Plus,
  MoreVertical,
  TrendingUp,
  DollarSign,
  Users,
  Bell,
  Eye,
  MessageCircle
} from 'lucide-react';

export default function DealerDashboard() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [userData, setUserData] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    checkAuth();
  }, []);

const checkAuth = async () => {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || !user?.id) {
      router.push('/login');
      return;
    }

    setLoading(true);

    // Fetch operator data using user ID
    const operatorResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/operators?filters[users_permissions_user][id][$eq]=${user.id}&populate[auto_dealer][populate]=*`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!operatorResponse.ok) throw new Error('Failed to fetch operator data');

    const { data: operatorData } = await operatorResponse.json();
    
    if (!operatorData || !operatorData[0]) {
      throw new Error('No operator profile found');
    }

    const operator = operatorData[0];
    console.log('Operator found:', operator);

    // Check business type
    if (operator.attributes.businessType !== 'dealer') {
      const redirectMap = {
        restaurant: 'menu',
        trader: 'stock'
      };

      const platform = redirectMap[operator.attributes.businessType];
      if (platform) {
        const baseUrl = process.env.NODE_ENV === 'development' 
          ? `http://localhost:3000/${platform}/operator/dashboard`
          : `https://${platform}.bitdash.app/${platform}/operator/dashboard`;
        window.location.href = baseUrl;
        return;
      }

      throw new Error('Invalid business type');
    }

    // If auto_dealer exists, fetch its details
    if (operator.attributes.auto_dealer?.data?.id) {
      const dealerId = operator.attributes.auto_dealer.data.id;
      
      // Fetch vehicles
      const vehiclesRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicles?filters[dealer][id][$eq]=${dealerId}&populate=*`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (vehiclesRes.ok) {
        const vehiclesData = await vehiclesRes.json();
        setVehicles(vehiclesData.data || []);
      }

      // Fetch inquiries
      const inquiriesRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicle-inquiries?filters[dealer][id][$eq]=${dealerId}&populate=*`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (inquiriesRes.ok) {
        const inquiriesData = await inquiriesRes.json();
        setInquiries(inquiriesData.data || []);
      }

      setUserData(operator.attributes);
    } else {
      throw new Error('No dealer profile found');
    }

  } catch (error) {
    console.error('Auth error:', error);
    toast({
      title: 'Error',
      description: error.message || 'Authentication failed',
      status: 'error',
      duration: 5000,
    });
    router.push('/login');
  } finally {
    setLoading(false);
  }
};

// Update fetch functions to use passed dealerId
const fetchVehicles = async (token, dealerId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicles?populate=*&filters[dealer][id]=${dealerId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.ok) throw new Error('Failed to fetch vehicles');
    const { data } = await response.json();
    setVehicles(data || []);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    toast({
      title: 'Error',
      description: 'Failed to load vehicles',
      status: 'error',
      duration: 3000,
    });
  }
};


  const fetchInquiries = async (token) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vehicle-inquiries?populate=*&filters[dealer][id]=${userData.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setInquiries(data.data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    }
  };

  const stats = [
    {
      label: t('activeListings'),
      value: vehicles.length,
      icon: Car,
    },
    {
      label: t('totalViews'),
      value: vehicles.reduce((acc, v) => acc + v.attributes.views, 0),
      icon: Eye,
    },
    {
      label: t('inquiries'),
      value: inquiries.length,
      icon: MessageCircle,
    },
    {
      label: t('conversionRate'),
      value: `${((inquiries.length / vehicles.reduce((acc, v) => acc + v.attributes.views, 0)) * 100).toFixed(1)}%`,
      icon: TrendingUp,
    },
  ];

  return (
    <Layout>
      <Container maxW="8xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Flex justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Heading size="lg">{t('dealerDashboard')}</Heading>
              <Text color="gray.500">{userData?.business_name}</Text>
            </VStack>
            <Button
              leftIcon={<Plus />}
              colorScheme="blue"
              onClick={() => router.push('/auto/dealer/vehicles/create')}
            >
              {t('addVehicle')}
            </Button>
          </Flex>

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            {stats.map((stat, index) => (
              <Box
                key={index}
                bg={isDark ? 'gray.800' : 'white'}
                p={6}
                borderRadius="lg"
                shadow="md"
              >
                <VStack align="start" spacing={2}>
                  <Icon as={stat.icon} boxSize={6} color="blue.500" />
                  <Text fontSize="sm" color="gray.500">
                    {stat.label}
                  </Text>
                  <Heading size="lg">{stat.value}</Heading>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>

          {/* Main Content */}
          <Tabs>
            <TabList>
              <Tab>{t('vehicles')}</Tab>
              <Tab>{t('inquiries')}</Tab>
              <Tab>{t('analytics')}</Tab>
            </TabList>

            <TabPanels>
              {/* Vehicles Panel */}
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                  {vehicles.map((vehicle) => (
                    <Box
                      key={vehicle.id}
                      borderWidth="1px"
                      borderRadius="lg"
                      overflow="hidden"
                      bg={isDark ? 'gray.800' : 'white'}
                    >
                      <Image
                        src={vehicle.attributes.images.data[0]?.attributes.url || '/car-placeholder.jpg'}
                        alt={vehicle.attributes.title}
                        h="200px"
                        w="full"
                        objectFit="cover"
                      />
                      <Box p={4}>
                        <VStack align="stretch" spacing={2}>
                          <Heading size="md">{vehicle.attributes.title}</Heading>
                          <HStack justify="space-between">
                            <Text fontWeight="bold" color="blue.500">
                              {vehicle.attributes.price} LYD
                            </Text>
                            <Badge colorScheme={vehicle.attributes.status === 'available' ? 'green' : 'red'}>
                              {vehicle.attributes.status}
                            </Badge>
                          </HStack>
                          <HStack spacing={4}>
                            <Text fontSize="sm" color="gray.500">
                              <Eye size={16} /> {vehicle.attributes.views}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              <MessageCircle size={16} /> {vehicle.attributes.inquiries?.data?.length || 0}
                            </Text>
                          </HStack>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/auto/dealer/vehicles/${vehicle.id}/edit`)}
                          >
                            {t('edit')}
                          </Button>
                        </VStack>
                      </Box>
                    </Box>
                  ))}
                </SimpleGrid>
              </TabPanel>

              {/* Inquiries Panel */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  {inquiries.map((inquiry) => (
                    <Box
                      key={inquiry.id}
                      p={4}
                      borderWidth="1px"
                      borderRadius="lg"
                      bg={isDark ? 'gray.800' : 'white'}
                    >
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold">
                            {inquiry.attributes.name}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {inquiry.attributes.vehicle.data.attributes.title}
                          </Text>
                        </VStack>
                        <Badge colorScheme={inquiry.attributes.status === 'pending' ? 'yellow' : 'green'}>
                          {inquiry.attributes.status}
                        </Badge>
                      </HStack>
                      <Text mt={2}>{inquiry.attributes.message}</Text>
                      <HStack mt={4}>
                        <Button size="sm" colorScheme="blue">
                          {t('reply')}
                        </Button>
                        <Button size="sm" variant="ghost">
                          {t('markAsResolved')}
                        </Button>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </TabPanel>

              {/* Analytics Panel */}
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                  {/* Views Chart */}
                  <Box
                    p={6}
                    borderRadius="lg"
                    bg={isDark ? 'gray.800' : 'white'}
                    shadow="md"
                  >
                    <Heading size="md" mb={4}>{t('viewsOverTime')}</Heading>
                    {/* Add chart component here */}
                  </Box>

                  {/* Inquiries Chart */}
                  <Box
                    p={6}
                    borderRadius="lg"
                    bg={isDark ? 'gray.800' : 'white'}
                    shadow="md"
                  >
                    <Heading size="md" mb={4}>{t('inquiriesOverTime')}</Heading>
                    {/* Add chart component here */}
                  </Box>
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}