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
  Pill,
  Plus,
  MoreVertical,
  TrendingUp,
  DollarSign,
  Users,
  Bell,
  Eye,
  MessageCircle
} from 'lucide-react';

export default function StockDashboard() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [userData, setUserData] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      // First get the operator data
      const operatorResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/operators/me?populate[stock_trader][populate]=*`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!operatorResponse.ok) throw new Error('Failed to fetch operator data');

      const operatorData = await operatorResponse.json();

      // Verify this is a stock trader
      if (operatorData.businessType !== 'stock') {
        throw new Error('Unauthorized access');
      }

      // Get the stock trader data
      const traderResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stock-traders/${operatorData.stock_trader.id}?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!traderResponse.ok) throw new Error('Failed to fetch stock trader data');

      const traderData = await traderResponse.json();
      setUserData(traderData.data);

      // Now fetch stocks and inquiries
      await fetchStocks(token, traderData.data.id);
      await fetchInquiries(token, traderData.data.id);
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: t('error'),
        description: error.message,
        status: 'error',
        duration: 3000,
      });
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchStocks = async (token) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stocks?populate=*&filters[operator][id]=${userData.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setStocks(data.data || []);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const fetchInquiries = async (token) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stock-inquiries?populate=*&filters[operator][id]=${userData.id}`,
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
      label: t('activeStocks'),
      value: stocks.length,
      icon: Pill,
    },
    {
      label: t('totalViews'),
      value: stocks.reduce((acc, s) => acc + s.attributes.views, 0),
      icon: Eye,
    },
    {
      label: t('inquiries'),
      value: inquiries.length,
      icon: MessageCircle,
    },
    {
      label: t('conversionRate'),
      value: `${((inquiries.length / stocks.reduce((acc, s) => acc + s.attributes.views, 0)) * 100).toFixed(1)}%`,
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
              <Heading size="lg">{t('stockDashboard')}</Heading>
              <Text color="gray.500">{userData?.business_name}</Text>
            </VStack>
            <Button
              leftIcon={<Plus />}
              colorScheme="blue"
              onClick={() => router.push('/stock/stocks/create')}
            >
              {t('addStock')}
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
              <Tab>{t('stocks')}</Tab>
              <Tab>{t('inquiries')}</Tab>
              <Tab>{t('analytics')}</Tab>
            </TabList>

            <TabPanels>
              {/* Stocks Panel */}
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                  {stocks.map((stock) => (
                    <Box
                      key={stock.id}
                      borderWidth="1px"
                      borderRadius="lg"
                      overflow="hidden"
                      bg={isDark ? 'gray.800' : 'white'}
                    >
                      <Image
                        src={stock.attributes.images.data[0]?.attributes.url || '/stock-placeholder.jpg'}
                        alt={stock.attributes.title}
                        h="200px"
                        w="full"
                        objectFit="cover"
                      />
                      <Box p={4}>
                        <VStack align="stretch" spacing={2}>
                          <Heading size="md">{stock.attributes.title}</Heading>
                          <HStack justify="space-between">
                            <Text fontWeight="bold" color="blue.500">
                              {stock.attributes.price} LYD
                            </Text>
                            <Badge colorScheme={stock.attributes.status === 'available' ? 'green' : 'red'}>
                              {stock.attributes.status}
                            </Badge>
                          </HStack>
                          <HStack spacing={4}>
                            <Text fontSize="sm" color="gray.500">
                              <Eye size={16} /> {stock.attributes.views}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              <MessageCircle size={16} /> {stock.attributes.inquiries?.data?.length || 0}
                            </Text>
                          </HStack>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/stock/stocks/${stock.id}/edit`)}
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
                            {inquiry.attributes.stock.data.attributes.title}
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