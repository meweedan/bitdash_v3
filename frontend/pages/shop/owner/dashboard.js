// pages/shop/owner/dashboard.js
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  Icon,
  Flex,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Alert,
  AlertIcon,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@chakra-ui/react';
import { 
  FiPackage, 
  FiDollarSign,
  FiEdit2,
  FiEye,
  FiArchive,
  FiSettings 
} from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Head from 'next/head';

export default function OwnerDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const [selectedTab, setSelectedTab] = useState(0);
  const bgColor = useColorModeValue('white', 'gray.800');

  const { data, isLoading, error } = useQuery({
    queryKey: ['owner', user?.id],
    queryFn: async () => {
      console.log('Fetching owner data for user:', user?.id);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/owners?` +
        `populate=*` +
        `&filters[users_permissions_user][id][$eq]=${user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch owner data');
      }

      const data = await response.json();
      console.log('Raw owner data:', data);

      return data.data.results[0];
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <Layout>
        <Container maxW="container.xl" py={6}>
          <VStack spacing={6}>
            <Skeleton height="100px" w="full" />
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
              <Skeleton height="150px" />
              <Skeleton height="150px" />
              <Skeleton height="150px" />
            </SimpleGrid>
          </VStack>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container maxW="container.xl" py={6}>
          <Alert status="error">
            <AlertIcon />
            {error.message}
          </Alert>
        </Container>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <Container maxW="container.xl" py={6}>
          <Alert status="error">
            <AlertIcon />
            No owner profile found for this user
          </Alert>
        </Container>
      </Layout>
    );
  }

  const shopItems = data.shop_items || [];
  const wallet = data.wallet || {};
  const logoUrl = data.logo?.url ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${data.logo.url}` : null;

  return (
    <Layout>
      <Head>
        <title>{data.shopName} - Dashboard</title>
      </Head>

      <Container maxW="container.xl" py={6}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Box bg={bgColor} p={6} borderRadius="xl" boxShadow="sm">
            <HStack spacing={4}>
              <Avatar size="xl" src={logoUrl} name={data.shopName} />
              <VStack align="start" spacing={1}>
                <Heading size="lg">{data.shopName}</Heading>
                <Badge colorScheme={data.verificationStatus === 'verified' ? 'green' : 'yellow'}>
                  {data.verificationStatus.toUpperCase()}
                </Badge>
                <Text color="gray.500">Wallet ID: {wallet.walletId}</Text>
              </VStack>
            </HStack>
          </Box>

          {/* Stats */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Stat bg={bgColor} p={6} borderRadius="xl" boxShadow="sm">
              <StatLabel>Balance</StatLabel>
              <StatNumber>{wallet.balance?.toFixed(2) || '0.00'} LYD</StatNumber>
              <Text fontSize="sm" color="gray.500">Daily Limit: {wallet.dailyLimit} LYD</Text>
            </Stat>

            <Stat bg={bgColor} p={6} borderRadius="xl" boxShadow="sm">
              <StatLabel>Products</StatLabel>
              <StatNumber>{shopItems.length}</StatNumber>
              <Text fontSize="sm" color="gray.500">
                {shopItems.filter(item => item.status === 'available').length} Active
              </Text>
            </Stat>

            <Stat bg={bgColor} p={6} borderRadius="xl" boxShadow="sm">
              <StatLabel>Rating</StatLabel>
              <StatNumber>{data.rating?.toFixed(1) || '0.0'}/5.0</StatNumber>
            </Stat>
          </SimpleGrid>

          {/* Main Content */}
          <Box bg={bgColor} borderRadius="xl" boxShadow="sm" overflow="hidden">
            <Tabs>
              <TabList px={4}>
                <Tab>Products</Tab>
                <Tab>Settings</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Product</Th>
                        <Th>Price</Th>
                        <Th>Stock</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {shopItems.map((item) => (
                        <Tr key={item.id}>
                          <Td>
                            <HStack>
                              {item.images?.[0] && (
                                <Image
                                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.images[0].url}`}
                                  alt={item.name}
                                  boxSize="40px"
                                  objectFit="cover"
                                  borderRadius="md"
                                />
                              )}
                              <Text>{item.name}</Text>
                            </HStack>
                          </Td>
                          <Td>{item.price} LYD</Td>
                          <Td>{item.stock}</Td>
                          <Td>
                            <Badge colorScheme={item.status === 'available' ? 'green' : 'red'}>
                              {item.status}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <IconButton
                                icon={<FiEdit2 />}
                                size="sm"
                                onClick={() => router.push(`/shop/owner/products/${item.id}/edit`)}
                              />
                              <IconButton
                                icon={<FiEye />}
                                size="sm"
                                onClick={() => router.push(`/shop/${data.shopName}/${item.id}`)}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TabPanel>

                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Box p={4} borderRadius="lg" borderWidth="1px">
                      <Heading size="md" mb={4}>Theme</Heading>
                      <Box p={4} borderRadius="md" bg={data.theme?.colors?.primary || 'blue.500'}>
                        <Text color={data.theme?.colors?.text || 'white'}>Theme Preview</Text>
                      </Box>
                    </Box>

                    <Box p={4} borderRadius="lg" borderWidth="1px">
                      <Heading size="md" mb={4}>Location</Heading>
                      <Text>{data.location?.address || 'No address set'}</Text>
                      <Text>{data.location?.city || 'No city set'}</Text>
                    </Box>
                  </SimpleGrid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </VStack>
      </Container>
    </Layout>
  );
}