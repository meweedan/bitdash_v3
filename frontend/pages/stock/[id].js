// pages/stock/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';
import {
  Box, Container, VStack, HStack, Text, Button,
  useColorMode, Heading, Stack, Badge, IconButton,
  useToast, Image, SimpleGrid, Stat, StatLabel,
  StatNumber, StatHelpText, StatArrow, Divider,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Table, Tbody, Tr, Td, Skeleton, Progress, Icon,
  Menu, MenuButton, MenuList, MenuItem
} from '@chakra-ui/react';
import {
  Edit, Trash2, Share2, Download, Package,
  ArrowUpRight, ArrowDownRight, ShoppingCart,
  MessageSquare, Clock, MoreVertical, ChevronLeft,
  TrendingUp, BarChart2, DollarSign, AlertTriangle
} from 'lucide-react';
import Head from 'next/head';

const StockDetailSkeleton = () => (
  <Stack spacing={8}>
    <Skeleton height="400px" rounded="xl" />
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
      {Array(4).fill(0).map((_, i) => (
        <Skeleton key={i} height="100px" rounded="xl" />
      ))}
    </SimpleGrid>
    <Skeleton height="200px" rounded="xl" />
  </Stack>
);

const StockDetail = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const toast = useToast();
  const { id } = router.query;
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchStockDetails();
    }
  }, [id]);

  const fetchStockDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stocks/${id}?populate=*`
      );
      const data = await response.json();

      if (data.data) {
        setStock(data.data);
      } else {
        setStock(null);
      }
    } catch (error) {
      console.error('Error fetching stock details:', error);
      toast({
        title: t('error'),
        description: t('failedToLoadStockDetails'),
        status: 'error',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t('confirmDeleteStock'))) {
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stocks/${id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        toast({
          title: t('success'),
          description: t('stockDeletedSuccessfully'),
          status: 'success',
          duration: 3000
        });
        
        router.push('/stock/browse');
      } catch (error) {
        console.error('Error deleting stock:', error);
        toast({
          title: t('error'),
          description: t('failedToDeleteStock'),
          status: 'error',
          duration: 3000
        });
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container maxW="8xl" py={12}>
          <StockDetailSkeleton />
        </Container>
      </Layout>
    );
  }

  if (!stock) {
    return (
      <Layout>
        <Container maxW="8xl" py={12}>
          <VStack spacing={4}>
            <Text fontSize="xl" color="gray.500">
              {t('stockNotFound')}
            </Text>
            <Button
              leftIcon={<ChevronLeft size={20} />}
              onClick={() => router.push('/stock/browse')}
            >
              {t('backToStocks')}
            </Button>
          </VStack>
        </Container>
      </Layout>
    );
  }

  const s = stock.attributes;

  return (
    <>
      <Head>
        <title>{s.title} - BitStock</title>
      </Head>
      <Layout>
        <Container maxW="8xl" py={12}>
          <Stack spacing={8}>
            {/* Header */}
            <Stack 
              direction={{ base: 'column', md: 'row' }} 
              justify="space-between"
              align={{ base: 'start', md: 'center' }}
              spacing={4}
            >
              <Stack direction="row" align="center" spacing={4}>
                <Button
                  variant="ghost"
                  leftIcon={<ChevronLeft size={20} />}
                  onClick={() => router.push('/stock/browse')}
                >
                  {t('back')}
                </Button>
                <Heading size="lg">{s.title}</Heading>
                <Badge
                  colorScheme={s.status === 'available' ? 'green' : 'red'}
                  fontSize="sm"
                  px={3}
                  py={1}
                  rounded="full"
                >
                  {s.status.toUpperCase()}
                </Badge>
              </Stack>
              
              <HStack spacing={2}>
                <Button
                  leftIcon={<Edit size={20} />}
                  onClick={() => router.push(`/stock/edit/${id}`)}
                >
                  {t('edit')}
                </Button>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<MoreVertical size={20} />}
                  />
                  <MenuList>
                    <MenuItem icon={<Share2 size={16} />}>
                      {t('share')}
                    </MenuItem>
                    <MenuItem icon={<Download size={16} />}>
                      {t('exportData')}
                    </MenuItem>
                    <MenuItem 
                      icon={<Trash2 size={16} />}
                      color="red.500"
                      onClick={handleDelete}
                    >
                      {t('delete')}
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            </Stack>

            {/* Main Content */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
              {/* Left Column */}
              <Stack spacing={6}>
                <Box
                  bg={isDark ? 'gray.800' : 'white'}
                  rounded="xl"
                  overflow="hidden"
                  shadow="lg"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${s.images?.data?.[0]?.attributes?.url}`}
                    alt={s.title}
                    objectFit="cover"
                    w="full"
                    h="400px"
                    fallback={<Box w="full" h="400px" bg="gray.200" />}
                  />
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Stat
                    bg={isDark ? 'gray.800' : 'white'}
                    p={6}
                    rounded="xl"
                    shadow="lg"
                  >
                    <StatLabel>{t('currentPrice')}</StatLabel>
                    <StatNumber>{new Intl.NumberFormat('en-US').format(s.price)} LYD</StatNumber>
                    {s.metadata?.priceChange && (
                      <StatHelpText>
                        <StatArrow 
                          type={s.metadata.priceChange > 0 ? 'increase' : 'decrease'} 
                        />
                        {Math.abs(s.metadata.priceChange)}%
                      </StatHelpText>
                    )}
                  </Stat>

                  <Stat
                    bg={isDark ? 'gray.800' : 'white'}
                    p={6}
                    rounded="xl"
                    shadow="lg"
                  >
                    <StatLabel>{t('quantity')}</StatLabel>
                    <StatNumber>{s.quantity}</StatNumber>
                    <StatHelpText color={s.quantity > 10 ? 'green.500' : 'orange.500'}>
                      {s.quantity > 10 ? t('inStock') : t('lowStock')}
                    </StatHelpText>
                  </Stat>
                </SimpleGrid>

                <Box
                  bg={isDark ? 'gray.800' : 'white'}
                  p={6}
                  rounded="xl"
                  shadow="lg"
                >
                  <VStack align="stretch" spacing={4}>
                    <Heading size="md">{t('stockDetails')}</Heading>
                    <Table variant="simple">
                      <Tbody>
                        <Tr>
                          <Td fontWeight="medium">{t('operator')}</Td>
                          <Td>{s.operator?.data?.attributes?.name || '-'}</Td>
                        </Tr>
                        <Tr>
                          <Td fontWeight="medium">{t('status')}</Td>
                          <Td>
                            <Badge
                              colorScheme={s.status === 'available' ? 'green' : 'red'}
                            >
                              {s.status}
                            </Badge>
                          </Td>
                        </Tr>
                        <Tr>
                          <Td fontWeight="medium">{t('movement')}</Td>
                          <Td>
                            <HStack>
                              <Icon
                                as={s.metadata?.movement === 'up' ? ArrowUpRight : ArrowDownRight}
                                color={s.metadata?.movement === 'up' ? "green.500" : "red.500"}
                              />
                              <Text>{s.metadata?.movement || 'Stable'}</Text>
                            </HStack>
                          </Td>
                        </Tr>
                        {Object.entries(s.metadata || {}).map(([key, value]) => (
                          key !== 'movement' && (
                            <Tr key={key}>
                              <Td fontWeight="medium">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </Td>
                              <Td>{value}</Td>
                            </Tr>
                          )
                        ))}
                      </Tbody>
                    </Table>
                  </VStack>
                </Box>
              </Stack>

              {/* Right Column */}
              <Stack spacing={6}>
                <Box
                  bg={isDark ? 'gray.800' : 'white'}
                  p={6}
                  rounded="xl"
                  shadow="lg"
                >
                  <VStack align="stretch" spacing={4}>
                    <Heading size="md">{t('description')}</Heading>
                    <Text>{s.description}</Text>
                  </VStack>
                </Box>

                <Box
                  bg={isDark ? 'gray.800' : 'white'}
                  p={6}
                  rounded="xl"
                  shadow="lg"
                >
                  <VStack align="stretch" spacing={4}>
                    <Heading size="md">{t('stockLevel')}</Heading>
                    <Progress 
                      value={(s.quantity / (s.metadata?.maxQuantity || 100)) * 100} 
                      colorScheme={s.quantity > 10 ? "green" : "orange"}
                      rounded="full"
                      size="lg"
                    />
                    <HStack justify="space-between">
                      <Text color="gray.500">{t('current')}: {s.quantity}</Text>
                      <Text color="gray.500">
                        {t('max')}: {s.metadata?.maxQuantity || 100}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>

                {/* Additional sections can be added here */}
                <Box
                  bg={isDark ? 'gray.800' : 'white'}
                  p={6}
                  rounded="xl"
                  shadow="lg"
                >
                  <Tabs variant="soft-rounded">
                    <TabList>
                      <Tab>{t('orders')}</Tab>
                      <Tab>{t('messages')}</Tab>
                      <Tab>{t('history')}</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        <Text color="gray.500">{t('noOrdersYet')}</Text>
                      </TabPanel>
                      <TabPanel>
                        <Text color="gray.500">{t('noMessagesYet')}</Text>
                      </TabPanel>
                      <TabPanel>
                        <Text color="gray.500">{t('noHistoryYet')}</Text>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </Box>
              </Stack>
            </SimpleGrid>
          </Stack>
        </Container>
      </Layout>
    </>
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default StockDetail;