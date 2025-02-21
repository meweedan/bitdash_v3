import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box, Container, VStack, HStack, Heading, Text, Button, SimpleGrid, 
  Skeleton, Badge, Avatar, useColorModeValue, Stat, StatLabel, StatNumber,
  Icon, Flex, useToast, Tabs, TabList, TabPanels, Tab, TabPanel,
  Table, Thead, Tbody, Tr, Th, Td, Image, IconButton, Alert, AlertIcon, AlertTitle, AlertDescription,
  Progress
} from '@chakra-ui/react';
import { 
  FiPackage, FiDollarSign, FiShoppingBag, FiTrendingUp, FiSettings,
  FiPlusCircle, FiEdit2, FiEye, FiArchive
} from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { motion } from 'framer-motion';

const MotionStat = motion(Stat);

const OwnerDashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const [selectedTab, setSelectedTab] = useState(0);

  const { 
    data: ownerData,
    isLoading: isOwnerLoading,
    error: ownerError,
    refetch: refetchOwner
  } = useQuery({
    queryKey: ['owner', user?.id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/owners?` +
        `populate[users_permissions_user]=*` +
        `&populate[wallet]=*` +
        `&populate[shop_items][populate]=images` +
        `&populate[logo]=*` +
        `&populate[coverImage]=*` +
        `&populate[orders]=*` +
        `&filters[users_permissions_user][id][$eq]=${user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('API Error:', error);
        throw new Error(error.error?.message || 'Failed to fetch owner data');
      }

      const data = await response.json();
      console.log('Raw owner data:', data);
      
      if (!data?.data?.results?.[0]) {
        throw new Error('No owner profile found');
      }

      return data.data.results[0];
    },
    enabled: !!user?.id
  });

  if (isOwnerLoading) {
    return (
      <Layout>
        <Container maxW="container.xl" py={6}>
          <VStack spacing={6}>
            <Skeleton height="100px" w="full" />
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} w="full">
              <Skeleton height="150px" />
              <Skeleton height="150px" />
              <Skeleton height="150px" />
              <Skeleton height="150px" />
            </SimpleGrid>
          </VStack>
        </Container>
      </Layout>
    );
  }

  if (ownerError) {
    return (
      <Layout>
        <Container maxW="container.xl" py={6}>
          <Alert status="error" flexDirection="column" alignItems="start" gap={2}>
            <AlertIcon />
            <AlertTitle>Error Loading Shop Data</AlertTitle>
            <AlertDescription>
              {ownerError.message}
              {process.env.NODE_ENV === 'development' && (
                <Box mt={2} p={2} bg="gray.100" borderRadius="md">
                  <Text fontWeight="bold">Debug Info:</Text>
                  <Text>User ID: {user?.id}</Text>
                  <Text>Has Token: {!!localStorage.getItem('token')}</Text>
                </Box>
              )}
            </AlertDescription>
          </Alert>
        </Container>
      </Layout>
    );
  }

  if (!ownerData) return null;

  const shopItems = ownerData.shop_items || [];
  const wallet = ownerData.wallet || {};
  const logoUrl = ownerData.logo?.url 
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${ownerData.logo.url}` 
    : null;

  return (
    <Layout>
      <Head>
        <title>{ownerData.shopName} - Dashboard</title>
      </Head>
      
      <Container maxW="container.xl" py={6}>
        <VStack spacing={6} align="stretch">
          {/* Header with Shop Info */}
          <Flex 
            p={6}
            bg={bgColor}
            borderRadius="xl"
            boxShadow="sm"
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
            gap={4}
          >
            <HStack spacing={4}>
              <Avatar
                size="xl"
                name={ownerData.shopName}
                src={logoUrl}
              />
              <VStack align="start" spacing={1}>
                <Heading size="lg">{ownerData.shopName}</Heading>
                <Badge colorScheme={ownerData.verificationStatus === 'verified' ? 'green' : 'yellow'}>
                  {ownerData.verificationStatus.toUpperCase()}
                </Badge>
                <Text color="gray.500">Wallet ID: {wallet.walletId || 'N/A'}</Text>
              </VStack>
            </HStack>
            
            <HStack spacing={2}>
              <Button
                leftIcon={<FiPlusCircle />}
                colorScheme="blue"
                onClick={() => router.push('/shop/owner/add-item')}
              >
                Add New Item
              </Button>
              <Button
                leftIcon={<FiSettings />}
                variant="outline"
                onClick={() => setSelectedTab(4)}
              >
                Settings
              </Button>
            </HStack>
          </Flex>

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <MotionStat
              p={6}
              bg={bgColor}
              borderRadius="xl"
              boxShadow="sm"
              whileHover={{ scale: 1.02 }}
            >
              <StatLabel>Available Balance</StatLabel>
              <StatNumber fontSize="2xl">
                {wallet.balance?.toFixed(2) || '0.00'} {wallet.currency || 'LYD'}
              </StatNumber>
              <Text fontSize="sm" color="gray.500">Daily Limit: {wallet.dailyLimit?.toLocaleString()} LYD</Text>
            </MotionStat>

            <MotionStat
              p={6}
              bg={bgColor}
              borderRadius="xl"
              boxShadow="sm"
              whileHover={{ scale: 1.02 }}
            >
              <StatLabel>Total Products</StatLabel>
              <StatNumber>{shopItems.length}</StatNumber>
              <Text fontSize="sm" color="gray.500">
                {shopItems.filter(item => item.status === 'available').length} Active
              </Text>
            </MotionStat>

            <MotionStat
              p={6}
              bg={bgColor}
              borderRadius="xl"
              boxShadow="sm"
              whileHover={{ scale: 1.02 }}
            >
              <StatLabel>Total Orders</StatLabel>
              <StatNumber>{ownerData.orders?.length || 0}</StatNumber>
            </MotionStat>

            <MotionStat
              p={6}
              bg={bgColor}
              borderRadius="xl"
              boxShadow="sm"
              whileHover={{ scale: 1.02 }}
            >
              <StatLabel>Shop Rating</StatLabel>
              <StatNumber>{ownerData.rating?.toFixed(1) || '0.0'}/5.0</StatNumber>
            </MotionStat>
          </SimpleGrid>

          {/* Main Content Tabs */}
          <Box bg={bgColor} borderRadius="xl" boxShadow="sm" overflow="hidden">
            <Tabs index={selectedTab} onChange={setSelectedTab}>
              <TabList px={4}>
                <Tab><Icon as={FiTrendingUp} mr={2} /> Overview</Tab>
                <Tab><Icon as={FiPackage} mr={2} /> Products</Tab>
                <Tab><Icon as={FiShoppingBag} mr={2} /> Orders</Tab>
                <Tab><Icon as={FiSettings} mr={2} /> Settings</Tab>
              </TabList>

              <TabPanels>
                {/* Overview Tab */}
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Box bg={bgColor} p={4} borderRadius="lg" boxShadow="sm">
                      <Heading size="md" mb={4}>Low Stock Items</Heading>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Product</Th>
                            <Th isNumeric>Stock</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {shopItems
                            .filter(item => item.stock < 10)
                            .map(item => (
                              <Tr key={item.id}>
                                <Td>{item.name}</Td>
                                <Td isNumeric color={item.stock < 5 ? 'red.500' : 'orange.500'}>
                                  {item.stock}
                                </Td>
                              </Tr>
                            ))
                          }
                        </Tbody>
                      </Table>
                    </Box>

                    <Box bg={bgColor} p={4} borderRadius="lg" boxShadow="sm">
                      <Heading size="md" mb={4}>Recent Orders</Heading>
                      {/* Add Orders List Component Here */}
                    </Box>
                  </SimpleGrid>
                </TabPanel>

                {/* Products Tab */}
                <TabPanel>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Product</Th>
                        <Th>Category</Th>
                        <Th isNumeric>Price</Th>
                        <Th isNumeric>Stock</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {shopItems.map((item) => (
                        <Tr key={item.id}>
                          <Td>
                            <HStack>
                              <Image
                                src={item.images?.[0]?.url 
                                  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.images[0].url}`
                                  : '/placeholder.png'
                                }
                                alt={item.name}
                                boxSize="40px"
                                objectFit="cover"
                                borderRadius="md"
                              />
                              <Text>{item.name}</Text>
                            </HStack>
                          </Td>
                          <Td>{item.category}</Td>
                          <Td isNumeric>{item.price} LYD</Td>
                          <Td isNumeric>{item.stock}</Td>
                          <Td>
                            <Badge
                              colorScheme={
                                item.status === 'available' ? 'green' :
                                item.status === 'out_of_stock' ? 'red' : 'gray'
                              }
                            >
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
                                onClick={() => router.push(`/${ownerData.shopName}/${item.name}`)}
                              />
                              <IconButton
                                icon={<FiArchive />}
                                size="sm"
                                colorScheme={item.status === 'available' ? 'red' : 'green'}
                                onClick={() => {
                                  // Toggle item status
                                }}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TabPanel>

                {/* Orders Tab */}
                <TabPanel>
                  {/* Add Orders Component Here */}
                </TabPanel>

                {/* Settings Tab */}
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Box bg={bgColor} p={4} borderRadius="lg" boxShadow="sm">
                      <Heading size="md" mb={4}>Shop Theme</Heading>
                      <Box p={4} borderRadius="md" bg={ownerData.theme?.colors?.primary}>
                        <Text color={ownerData.theme?.colors?.text}>
                          Theme Preview
                        </Text>
                      </Box>
                    </Box>

                    <Box bg={bgColor} p={4} borderRadius="lg" boxShadow="sm">
                      <Heading size="md" mb={4}>Shop Settings</Heading>
                      <VStack align="stretch" spacing={4}>
                        <Text>Location: {ownerData.location?.address || 'Not set'}</Text>
                        <Text>Categories: {ownerData.categories?.length || 0} configured</Text>
                        <Progress value={ownerData.verificationStatus === 'verified' ? 100 : 50} />
                      </VStack>
                    </Box>
                  </SimpleGrid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>

          {/* Social Links */}
          <Box bg={bgColor} borderRadius="xl" boxShadow="sm" p={6}>
            <Heading size="md" mb={4}>Social Media Links</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
              {Object.entries(ownerData.social_links || {}).map(([platform, link]) => (
                <Box key={platform} p={4} borderRadius="lg" borderWidth="1px">
                  <Text fontWeight="bold" textTransform="capitalize">{platform}</Text>
                  <Text noOfLines={1} color="gray.500">{link || 'Not set'}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* Business Documents */}
          {ownerData.businessDocuments?.length > 0 && (
            <Box bg={bgColor} borderRadius="xl" boxShadow="sm" p={6}>
              <Heading size="md" mb={4}>Business Documents</Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                {ownerData.businessDocuments.map((doc, index) => (
                  <Box 
                    key={index}
                    p={4}
                    borderRadius="lg"
                    borderWidth="1px"
                    cursor="pointer"
                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_BACKEND_URL}${doc.url}`, '_blank')}
                  >
                    <Text noOfLines={1}>{doc.name}</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* Security Settings */}
          <Box bg={bgColor} borderRadius="xl" boxShadow="sm" p={6}>
            <Heading size="md" mb={4}>Security Settings</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box p={4} borderRadius="lg" borderWidth="1px">
                <Text fontWeight="bold">Wallet PIN</Text>
                <Text>••••••</Text>
                <Button size="sm" mt={2} variant="outline">
                  Change PIN
                </Button>
              </Box>
              <Box p={4} borderRadius="lg" borderWidth="1px">
                <Text fontWeight="bold">Daily Transaction Limit</Text>
                <Text>{wallet.dailyLimit?.toLocaleString()} LYD</Text>
                <Button size="sm" mt={2} variant="outline">
                  Adjust Limit
                </Button>
              </Box>
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>
    </Layout>
  );
};

export default OwnerDashboard;