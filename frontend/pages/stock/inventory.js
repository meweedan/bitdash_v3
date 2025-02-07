import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';
import Head from 'next/head';
import {
  Box, Container, SimpleGrid, VStack, HStack, Text,
  Image, Badge, Spinner, Input, Select,
  useColorMode, useToast, Flex, Heading,
  Avatar, Stack, IconButton
} from '@chakra-ui/react';
import { Search, Package, DollarSign, SortAsc, SortDesc } from 'lucide-react';

const InventoryPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stocks?populate[0]=images&populate[1]=operator&populate[2]=customer_profile`
      );
      const data = await response.json();
      setInventory(data.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: t('error'),
        description: t('failedToLoadInventory'),
        status: 'error',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'green';
      case 'sold':
        return 'blue';
      case 'expired':
        return 'red';
      default:
        return 'gray';
    }
  };

  const filteredInventory = inventory
    .filter(item => {
      const matchesSearch = item.attributes.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
        item.attributes.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a.attributes[sortField];
      const bValue = b.attributes[sortField];
      return sortOrder === 'asc' 
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    });

  const handleItemClick = (id) => {
    router.push(`/stock/${id}`);
  };

  return (
    <>
      <Head>
        <title>Inventory</title>
      </Head>
      <Layout>
        <Container maxW="7xl" py={4} px={4}>
          <VStack spacing={4} align="stretch">
            <Heading size="lg" mb={2}>Inventory</Heading>

            {/* Mobile-friendly search, sort, and filters */}
            <Stack 
              direction={{ base: 'column', md: 'row' }} 
              spacing={4}
              w="full"
            >
              <Input
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                flex={{ base: '1', md: '2' }}
              />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                flex="1"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="expired">Expired</option>
              </Select>
              <Select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                flex="1"
              >
                <option value="title">Sort by Title</option>
                <option value="price">Sort by Price</option>
                <option value="quantity">Sort by Quantity</option>
                <option value="createdAt">Sort by Date</option>
              </Select>
              <IconButton
                icon={sortOrder === 'asc' ? <SortAsc /> : <SortDesc />}
                onClick={() => setSortOrder(
                  sortOrder === 'asc' ? 'desc' : 'asc'
                )}
                aria-label="Toggle sort order"
              />
            </Stack>

            {loading ? (
              <Box textAlign="center" py={10}>
                <Spinner size="xl" />
              </Box>
            ) : (
              <SimpleGrid 
                columns={{ base: 1, md: 2, lg: 3 }} 
                spacing={4}
                w="full"
              >
                {filteredInventory.map((item) => (
                  <Box
                    key={item.id}
                    bg={isDark ? 'gray.700' : 'white'}
                    shadow="md"
                    rounded="lg"
                    overflow="hidden"
                    cursor="pointer"
                    onClick={() => handleItemClick(item.id)}
                    _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    <Box position="relative">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${
                          item.attributes.images?.data?.[0]?.attributes?.url
                        }`}
                        alt={item.attributes.title}
                        h="200px"
                        w="full"
                        objectFit="cover"
                        fallback={
                          <Box h="200px" bg="gray.200" />
                        }
                      />
                      <Badge
                        position="absolute"
                        top={2}
                        right={2}
                        colorScheme={getStatusColor(item.attributes.status)}
                        px={2}
                        py={1}
                        rounded="md"
                      >
                        {item.attributes.status}
                      </Badge>
                    </Box>

                    <VStack p={4} align="stretch" spacing={3}>
                      <Text 
                        fontWeight="bold" 
                        fontSize={{ base: "md", md: "lg" }}
                        noOfLines={1}
                      >
                        {item.attributes.title}
                      </Text>
                      
                      <Stack 
                        direction={{ base: 'column', sm: 'row' }}
                        spacing={{ base: 2, sm: 4 }}
                      >
                        <HStack>
                          <DollarSign size={16} />
                          <Text fontWeight="semibold">
                            {Number(item.attributes.price).toFixed(2)} LYD
                          </Text>
                        </HStack>
                        <HStack>
                          <Package size={16} />
                          <Text color="gray.500">
                            Qty: {item.attributes.quantity}
                          </Text>
                        </HStack>
                      </Stack>

                      <Text 
                        noOfLines={2} 
                        color="gray.500" 
                        fontSize="sm"
                        display={{ base: 'none', sm: 'block' }}
                      >
                        {item.attributes.description}
                      </Text>

                      {item.attributes.operator?.data && (
                        <HStack spacing={2}>
                          <Avatar
                            size="sm"
                            name={item.attributes.operator.data.attributes?.name}
                            src={item.attributes.operator.data.attributes?.avatar?.data?.attributes?.url}
                          />
                          <Text 
                            fontSize="sm" 
                            color="gray.500"
                            noOfLines={1}
                          >
                            {item.attributes.operator.data.attributes?.name}
                          </Text>
                        </HStack>
                      )}
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </VStack>
        </Container>
      </Layout>
    </>
  );
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default InventoryPage;