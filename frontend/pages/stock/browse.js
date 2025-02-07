import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';
import {
  Box, Container, VStack, Text, Button,
  useColorMode, Heading, Stack, Table, Thead,
  Tbody, Tr, Th, Td, Badge, IconButton,
  Menu, MenuButton, MenuList, MenuItem,
  Flex, SimpleGrid, Icon,
  useToast, Skeleton, HStack
} from '@chakra-ui/react';
import {
  MoreVertical, Eye, Edit, Trash2, Download,
  Package, ArrowUpRight, ArrowDownRight, Plus, 
  AlertTriangle, DollarSign
} from 'lucide-react';
import Head from 'next/head';

const StockTable = ({ stocks, onView, onEdit, onDelete }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const { t } = useTranslation('common');

  return (
    <Box
      overflowX="auto"
      bg={isDark ? 'gray.800' : 'white'}
      rounded="xl"
      shadow="lg"
    >
      <Table>
        <Thead>
          <Tr>
            <Th>{t('title')}</Th>
            <Th>{t('price')}</Th>
            <Th>{t('quantity')}</Th>
            <Th>{t('status')}</Th>
            <Th>{t('operator')}</Th>
            <Th>{t('movement')}</Th>
            <Th>{t('actions')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {stocks.map((stock) => {
            const attributes = stock.attributes || {};
            const operatorData = attributes.operator?.data?.attributes;
            return (
              <Tr key={stock.id}>
                <Td>
                  <Text fontWeight="medium">{attributes.title}</Text>
                </Td>
                <Td>
                  <Text>
                    {new Intl.NumberFormat('en-US').format(attributes.price || 0)} LYD
                  </Text>
                </Td>
                <Td>
                  <Text
                    color={attributes.quantity > 10 ? "green.500" : "orange.500"}
                    fontWeight="medium"
                  >
                    {attributes.quantity}
                  </Text>
                </Td>
                <Td>
                  <Badge
                    colorScheme={attributes.status === 'available' ? 'green' : 'red'}
                    rounded="full"
                    px={2}
                  >
                    {attributes.status}
                  </Badge>
                </Td>
                <Td>{operatorData?.name || '-'}</Td>
                <Td>
                  <HStack>
                    <Icon
                      as={attributes.metadata?.movement === 'up' ? ArrowUpRight : ArrowDownRight}
                      color={attributes.metadata?.movement === 'up' ? "green.500" : "red.500"}
                    />
                    <Text>{attributes.metadata?.movement || t('stable')}</Text>
                  </HStack>
                </Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<MoreVertical size={16} />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem 
                        icon={<Eye size={16} />} 
                        onClick={() => onView(stock.id)}
                      >
                        {t('viewDetails')}
                      </MenuItem>
                      <MenuItem 
                        icon={<Edit size={16} />} 
                        onClick={() => onEdit(stock.id)}
                      >
                        {t('edit')}
                      </MenuItem>
                      <MenuItem icon={<Download size={16} />}>
                        {t('exportData')}
                      </MenuItem>
                      <MenuItem 
                        icon={<Trash2 size={16} />} 
                        onClick={() => onDelete(stock.id)}
                        color="red.500"
                      >
                        {t('delete')}
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

const StockBrowse = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const toast = useToast();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stocks?populate=*`
      );
      const data = await response.json();
      
      if (data.data) {
        setStocks(Array.isArray(data.data) ? data.data : []);
      } else {
        setStocks([]);
      }
    } catch (error) {
      console.error('Error fetching stocks:', error);
      toast({
        title: t('error'),
        description: t('failedToLoadStocks'),
        status: 'error',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    router.push(`/stock/${id}`);
  };

  const handleEdit = (id) => {
    router.push(`/stock/edit/${id}`);
  };

  const handleDelete = async (id) => {
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
        
        fetchStocks();
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

  const StockStats = () => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const stats = [
      {
        label: t('totalStockItems'),
        value: stocks.length,
        icon: Package,
        color: 'blue'
      },
      {
        label: t('availableItems'),
        value: stocks.filter(s => s.attributes?.status === 'available').length,
        icon: Package,
        color: 'green'
      },
      {
        label: t('lowStockItems'),
        value: stocks.filter(s => (s.attributes?.quantity || 0) <= 10).length,
        icon: AlertTriangle,
        color: 'orange'
      },
      {
        label: t('totalValue'),
        value: new Intl.NumberFormat('en-US').format(
          stocks.reduce((sum, stock) => 
            sum + ((stock.attributes?.price || 0) * (stock.attributes?.quantity || 0)), 0)
        ) + ' LYD',
        icon: DollarSign,
        color: 'purple'
      }
    ];

    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {stats.map((stat, index) => (
          <Box
            key={index}
            bg={isDark ? 'gray.800' : 'white'}
            p={6}
            rounded="xl"
            shadow="lg"
          >
            <Stack spacing={4}>
              <Icon as={stat.icon} boxSize={8} color={`${stat.color}.500`} />
              <Stack spacing={2}>
                <Text fontSize="sm" color="gray.500">{stat.label}</Text>
                <Heading size="lg" color={`${stat.color}.500`}>{stat.value}</Heading>
              </Stack>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>
    );
  };

  return (
    <>
      <Head>
        <title>{t('bitstock')} - {t('browseInventory')}</title>
      </Head>
      <Layout>
        <Container maxW="8xl" py={12}>
          <Stack spacing={8}>
            <Flex justify="space-between" align="center">
              <Heading size="lg">{t('stockInventory')}</Heading>
              <Button
                colorScheme="blue"
                leftIcon={<Plus size={20} />}
                onClick={() => router.push('/stock/new')}
              >
                {t('addNewStock')}
              </Button>
            </Flex>

            <StockStats />

            {loading ? (
              <Stack spacing={4}>
                {Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} height="60px" rounded="xl" />
                ))}
              </Stack>
            ) : stocks.length > 0 ? (
              <StockTable
                stocks={stocks}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <VStack py={12} spacing={4}>
                <Text fontSize="xl" color="gray.500">
                  {t('noStocksFound')}
                </Text>
                <Button
                  colorScheme="blue"
                  leftIcon={<Plus size={20} />}
                  onClick={() => router.push('/stock/new')}
                >
                  {t('addFirstStockItem')}
                </Button>
              </VStack>
            )}
          </Stack>
        </Container>
      </Layout>
    </>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default StockBrowse;