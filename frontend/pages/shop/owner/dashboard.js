import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
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
  useDisclosure,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { 
  FiPackage,
  FiDollarSign,
  FiShoppingBag,
  FiTrendingUp,
  FiSettings,
  FiPlusCircle,
  FiStar,
  FiList,
  FiMessageSquare,
  FiEdit3,
  FiCreditCard,
  FiBox
} from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { motion } from 'framer-motion';

// Import custom components
import AddProductModal from '@/components/shop/owner/AddProductModal';
import CartDrawer from '@/components/shop/owner/CartDrawer';
import OrdersList from '@/components/shop/owner/OrdersList';
import PaymentConfirmationModal from '@/components/shop/owner/PaymentConfirmationModal';
import ProductEditModal from '@/components/shop/owner/ProductEditModal';
import ProductsList from '@/components/shop/owner/ProductsList';
import ReviewsList from '@/components/shop/owner/ReviewsList';
import SalesChart from '@/components/shop/owner/SalesChart';
import ShopPaymentGenerator from '@/components/shop/owner/ShopPaymentGenerator';
import ThemeEditor from '@/components/shop/owner/ThemeEditor';
import TopProductsChart from '@/components/shop/owner/TopProductsChart';
import WelcomeModal from '@/components/shop/owner/WelcomeModal';

const MotionStat = motion(Stat);

const OwnerDashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const { t } = useTranslation(['dashboard', 'common']);
  const bgColor = useColorModeValue('white', 'gray.800');
  
  // Disclosure hooks for modals and drawers
  const {
    isOpen: isAddProductOpen,
    onOpen: onAddProductOpen,
    onClose: onAddProductClose
  } = useDisclosure();
  
  const {
    isOpen: isEditProductOpen,
    onOpen: onEditProductOpen,
    onClose: onEditProductClose
  } = useDisclosure();
  
  const {
    isOpen: isCartOpen,
    onOpen: onCartOpen,
    onClose: onCartClose
  } = useDisclosure();
  
  const {
    isOpen: isPaymentOpen,
    onOpen: onPaymentOpen,
    onClose: onPaymentClose
  } = useDisclosure();
  
  const {
    isOpen: isWelcomeOpen,
    onOpen: onWelcomeOpen,
    onClose: onWelcomeClose
  } = useDisclosure();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);

  // Fetch owner data
  const { 
    data: ownerData,
    isLoading: isOwnerLoading,
    error: ownerError
  } = useQuery({
    queryKey: ['owner', user?.id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/owners?` +
        `populate[user][select][0]=username` +
        `&populate[user][select][1]=email` +
        `&populate[logo][select][0]=url` +
        `&populate[wallet][select][0]=balance` +
        `&populate[wallet][select][1]=walletId` +
        `&filters[user][id][$eq]=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch owner data');
      return response.json();
    },
    enabled: !!user?.id
  });

  // Show welcome modal for first-time users
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcomeModal');
    if (!hasSeenWelcome && ownerData?.data?.[0]) {
      onWelcomeOpen();
      localStorage.setItem('hasSeenWelcomeModal', 'true');
    }
  }, [ownerData]);

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

  if (ownerError || !ownerData?.data?.[0]) {
    return (
      <Layout>
        <Container maxW="container.xl" py={6}>
          <Alert status="error">
            <AlertIcon />
            Failed to load shop data
          </Alert>
        </Container>
      </Layout>
    );
  }

  const owner = ownerData.data[0].attributes;
  const wallet = owner.wallet?.data?.attributes;

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    onEditProductOpen();
  };

  return (
    <Layout>
      <Head>
        <title>Shop Dashboard | {owner.shopName}</title>
      </Head>
      
      <Container maxW="container.xl" py={6}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
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
                name={owner.shopName}
                src={owner.logo?.data?.attributes?.url}
              />
              <VStack align="start" spacing={1}>
                <Heading size="lg">{owner.shopName}</Heading>
                <Badge colorScheme={owner.verificationStatus === 'verified' ? 'green' : 'yellow'}>
                  {owner.verificationStatus.toUpperCase()}
                </Badge>
                <Text color="gray.500">
                  Wallet ID: {wallet?.walletId}
                </Text>
              </VStack>
            </HStack>
            
            <Wrap spacing={2}>
              <WrapItem>
                <Button
                  leftIcon={<FiPlusCircle />}
                  colorScheme="blue"
                  onClick={onAddProductOpen}
                >
                  Add New Product
                </Button>
              </WrapItem>
              <WrapItem>
                <Button
                  leftIcon={<FiCreditCard />}
                  colorScheme="green"
                  variant="outline"
                  onClick={onPaymentOpen}
                >
                  Generate Payment Link
                </Button>
              </WrapItem>
              <WrapItem>
                <Button
                  leftIcon={<FiEdit3 />}
                  onClick={() => setSelectedTab(5)}
                  variant="outline"
                >
                  Edit Theme
                </Button>
              </WrapItem>
            </Wrap>
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
                ${wallet?.balance?.toFixed(2) || '0.00'}
              </StatNumber>
            </MotionStat>

            <MotionStat
              p={6}
              bg={bgColor}
              borderRadius="xl"
              boxShadow="sm"
              whileHover={{ scale: 1.02 }}
            >
              <StatLabel>Total Products</StatLabel>
              <HStack>
                <Icon as={FiBox} />
                <StatNumber>{owner.shop_items?.data?.length || 0}</StatNumber>
              </HStack>
            </MotionStat>

            <MotionStat
              p={6}
              bg={bgColor}
              borderRadius="xl"
              boxShadow="sm"
              whileHover={{ scale: 1.02 }}
            >
              <StatLabel>Shop Rating</StatLabel>
              <HStack>
                <Icon as={FiStar} color="yellow.400" />
                <StatNumber>{owner.rating?.toFixed(1) || '0.0'}/5.0</StatNumber>
              </HStack>
            </MotionStat>

            <MotionStat
              p={6}
              bg={bgColor}
              borderRadius="xl"
              boxShadow="sm"
              whileHover={{ scale: 1.02 }}
            >
              <StatLabel>Total Orders</StatLabel>
              <HStack>
                <Icon as={FiShoppingBag} />
                <StatNumber>{owner.orders?.data?.length || 0}</StatNumber>
              </HStack>
            </MotionStat>
          </SimpleGrid>

          {/* Main Content */}
          <Box bg={bgColor} borderRadius="xl" boxShadow="sm" overflow="hidden">
            <Tabs index={selectedTab} onChange={setSelectedTab} variant="enclosed">
              <TabList px={4}>
                <Tab><Icon as={FiTrendingUp} mr={2} /> Analytics</Tab>
                <Tab><Icon as={FiPackage} mr={2} /> Products</Tab>
                <Tab><Icon as={FiList} mr={2} /> Orders</Tab>
                <Tab><Icon as={FiMessageSquare} mr={2} /> Reviews</Tab>
                <Tab><Icon as={FiDollarSign} mr={2} /> Payments</Tab>
                <Tab><Icon as={FiSettings} mr={2} /> Theme</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <VStack spacing={6}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                      <Box bg={bgColor} p={4} borderRadius="lg" boxShadow="sm">
                        <Heading size="md" mb={4}>Sales Trend</Heading>
                        <SalesChart ownerId={owner.id} />
                      </Box>
                      <Box bg={bgColor} p={4} borderRadius="lg" boxShadow="sm">
                        <Heading size="md" mb={4}>Top Products</Heading>
                        <TopProductsChart ownerId={owner.id} />
                      </Box>
                    </SimpleGrid>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <ProductsList 
                    ownerId={owner.id}
                    onEdit={handleEditProduct}
                    onAdd={onAddProductOpen}
                  />
                </TabPanel>

                <TabPanel>
                  <OrdersList ownerId={owner.id} />
                </TabPanel>

                <TabPanel>
                  <ReviewsList ownerId={owner.id} />
                </TabPanel>

                <TabPanel>
                  <ShopPaymentGenerator ownerId={owner.id} />
                </TabPanel>

                <TabPanel>
                  <ThemeEditor 
                    ownerId={owner.id}
                    currentTheme={owner.theme}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </VStack>
      </Container>

      {/* Modals and Drawers */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={onAddProductClose}
        ownerId={owner.id}
      />
      
      <ProductEditModal
        isOpen={isEditProductOpen}
        onClose={onEditProductClose}
        product={selectedProduct}
      />
      
      <CartDrawer
        isOpen={isCartOpen}
        onClose={onCartClose}
        ownerId={owner.id}
      />
      
      <PaymentConfirmationModal
        isOpen={isPaymentOpen}
        onClose={onPaymentClose}
        ownerId={owner.id}
      />
      
      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={onWelcomeClose}
        ownerName={owner.shopName}
      />
    </Layout>
  );
};

export default OwnerDashboard;