import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useDisclosure } from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import {
  Box,
  Container,
  Grid,
  GridItem,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  IconButton,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Icon,
  Flex,
  useToast,
  Spinner,
  Badge,
  Divider,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Portal,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import {
  FiDollarSign,
  FiCreditCard,
  FiSettings,
  FiDownload,
  FiLink,
  FiTrendingUp,
  FiMapPin,
  FiMail,
  FiPlus,
  FiPhone,
  FiMenu,
  FiCopy,
  FiShare2,
  FiMoreVertical,
} from 'react-icons/fi';
import { FaQrcode } from 'react-icons/fa';

// Import your existing components
import TransactionsList from '@/components/cash/merchant/TransactionsList';
import PaymentLinksList from '@/components/cash/merchant/PaymentLinksList';
import WalletBalance from '@/components/cash/WalletBalance';
import PaymentLinkGenerator from '@/components/cash/merchant/PaymentLinkGenerator';
import QRCodeModal from '@/components/cash/merchant/QRCodeModal';
import BusinessDetailsCard from '@/components/cash/merchant/BusinessDetailsCard';

const MerchantDashboard = () => {
  const router = useRouter();
  const toast = useToast();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const accentColor = useColorModeValue('blue.500', 'blue.300');

  // Tab state for mobile
  const [activeTab, setActiveTab] = useState('overview');

  // Modals and drawers
  const {
    isOpen: isPaymentLinkOpen,
    onOpen: onPaymentLinkOpen,
    onClose: onPaymentLinkClose
  } = useDisclosure();

  const {
    isOpen: isQRCodeOpen,
    onOpen: onQRCodeOpen,
    onClose: onQRCodeClose
  } = useDisclosure();

  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose
  } = useDisclosure();

  // Fetch merchant data with your API structure
  const { data: merchantData, isLoading } = useQuery({
    queryKey: ['merchantData'],
    queryFn: async () => {
      const userId = JSON.parse(localStorage.getItem('user'))?.id;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/merchants?populate=*&filters[users_permissions_user][id][$eq]=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch merchant data');
      const data = await response.json();
      return data.data[0];
    },
    enabled: !!isAuthenticated,
  });

  // Export transactions mutation
  const exportTransactions = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/merchants/export`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Export failed');
      return response.blob();
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast({
        title: 'Export Successful',
        status: 'success',
        duration: 3000
      });
    }
  });

  const merchant = merchantData?.attributes || {};

  // Mobile-optimized header
  const DashboardHeader = () => (
    <VStack spacing={4} w="full" align="stretch">
      <Flex justify="space-between" align="center">
        <HStack spacing={4}>
          <Avatar
            src={merchant?.logo?.data?.attributes?.url ? 
              `${process.env.NEXT_PUBLIC_BACKEND_URL}${merchant.logo.data.attributes.url}` : 
              undefined}
            name={merchant.businessName}
            size={isMobile ? "md" : "lg"}
          />
          <VStack align="start" spacing={0}>
            <Heading size={isMobile ? "md" : "lg"}>{merchant.businessName}</Heading>
            <Badge colorScheme={
              merchant.verificationStatus === 'verified' ? 'green' : 
              merchant.verificationStatus === 'pending' ? 'yellow' : 'red'
            }>
              {merchant.verificationStatus}
            </Badge>
          </VStack>
        </HStack>
        
        {isMobile ? (
          <IconButton
            icon={<FiMenu />}
            variant="ghost"
            onClick={onMenuOpen}
            aria-label="Menu"
          />
        ) : (
          <HStack spacing={3}>
            <Button
              leftIcon={<FiLink />}
              colorScheme="blue"
              onClick={onPaymentLinkOpen}
            >
              Create Payment Link
            </Button>
            <IconButton
              icon={<FiSettings />}
              variant="ghost"
              onClick={() => router.push('/settings')}
              aria-label="Settings"
            />
          </HStack>
        )}
      </Flex>

      {/* Mobile tab navigation */}
      {isMobile && (
        <Tabs 
          isFitted 
          variant="enclosed" 
          onChange={(index) => setActiveTab(['overview', 'transactions', 'links'][index])}
        >
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Transactions</Tab>
            <Tab>Links</Tab>
          </TabList>
        </Tabs>
      )}
    </VStack>
  );

  // Mobile-optimized stats grid
  const StatsGrid = () => (
    <SimpleGrid 
      columns={{ base: 2, md: 4 }} 
      spacing={4}
      w="full"
    >
      <WalletBalance
        type="merchant"
        walletId={merchant?.wallet?.data?.id}
        currency={merchant.currency}
      />
      
      <StatCard
        label="Today's Sales"
        value={merchant?.metadata?.todaySales || 0}
        prefix={merchant.currency}
        icon={FiTrendingUp}
        color="green"
      />
      
      <StatCard
        label="Active Links"
        value={merchant?.payment_links?.data?.filter(
          link => link.attributes.status === 'active'
        ).length || 0}
        icon={FiLink}
        color="blue"
      />
      
      <StatCard
        label="Success Rate"
        value={(merchant?.metadata?.successRate || 0).toFixed(1)}
        suffix="%"
        icon={FiCreditCard}
        color="purple"
      />
    </SimpleGrid>
  );

  return (
    <Layout>
      <Head>
        <title>{merchant.businessName || 'Merchant'} Dashboard | BitCash</title>
      </Head>

      <Container maxW="1400px" px={3} py={4}>
        {isLoading ? (
          <Flex justify="center" align="center" h="200px">
            <Spinner size="xl" color={accentColor} />
          </Flex>
        ) : (
          <VStack spacing={6} align="stretch">
            <DashboardHeader />
            <StatsGrid />

            {/* Mobile view */}
            {isMobile ? (
              <Box>
                {activeTab === 'overview' && (
                  <BusinessDetailsCard merchant={merchant} />
                )}
                {activeTab === 'transactions' && (
                  <TransactionsList
                    merchantId={merchantData?.id}
                    currency={merchant.currency}
                    mobileView={true}
                  />
                )}
                {activeTab === 'links' && (
                  <PaymentLinksList
                    merchantId={merchantData?.id}
                    currency={merchant.currency}
                    mobileView={true}
                    onQRCode={onQRCodeOpen}
                  />
                )}
              </Box>
            ) : (
              /* Desktop view */
              <Grid templateColumns="3fr 1fr" gap={6}>
                <GridItem>
                  <VStack spacing={6} align="stretch">
                    <DashboardCard
                      title="Recent Transactions"
                      action={
                        <Button
                          leftIcon={<FiDownload />}
                          size="sm"
                          onClick={() => exportTransactions.mutate()}
                          isLoading={exportTransactions.isLoading}
                        >
                          Export
                        </Button>
                      }
                    >
                      <TransactionsList
                        merchantId={merchantData?.id}
                        currency={merchant.currency}
                        limit={10}
                      />
                    </DashboardCard>
                  </VStack>
                </GridItem>

                <GridItem>
                  <VStack spacing={6} align="stretch">
                    <BusinessDetailsCard merchant={merchant} />
                    <DashboardCard
                      title="Active Payment Links"
                      action={
                        <Button
                          size="sm"
                          onClick={onPaymentLinkOpen}
                          leftIcon={<FiPlus />}
                        >
                          New Link
                        </Button>
                      }
                    >
                      <PaymentLinksList
                        merchantId={merchantData?.id}
                        currency={merchant.currency}
                        onQRCode={onQRCodeOpen}
                      />
                    </DashboardCard>
                  </VStack>
                </GridItem>
              </Grid>
            )}
          </VStack>
        )}

        {/* Modals and Drawers */}
        <PaymentLinkGenerator
          merchantData={merchantData}
          isOpen={isPaymentLinkOpen}
          onClose={onPaymentLinkClose}
          currency={merchant.currency}
        />

        <QRCodeModal
          isOpen={isQRCodeOpen}
          onClose={onQRCodeClose}
          data={merchantData}
        />

        <MobileMenu
          isOpen={isMenuOpen}
          onClose={onMenuClose}
          onPaymentLinkOpen={onPaymentLinkOpen}
          onExport={() => exportTransactions.mutate()}
          isExporting={exportTransactions.isLoading}
        />
      </Container>
    </Layout>
  );
};

// Enhanced mobile menu
const MobileMenu = ({ isOpen, onClose, onPaymentLinkOpen, onExport, isExporting }) => (
  <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
    <DrawerOverlay />
    <DrawerContent>
      <DrawerCloseButton />
      <DrawerHeader>Quick Actions</DrawerHeader>
      <DrawerBody>
        <VStack spacing={4}>
          <Button
            leftIcon={<FiLink />}
            w="full"
            colorScheme="blue"
            onClick={() => {
              onClose();
              onPaymentLinkOpen();
            }}
          >
            Create Payment Link
          </Button>
          <Button
            leftIcon={<FiDownload />}
            w="full"
            onClick={() => {
              onClose();
              onExport();
            }}
            isLoading={isExporting}
          >
            Export Transactions
          </Button>
          <Button
            leftIcon={<FiSettings />}
            w="full"
            variant="ghost"
            onClick={() => router.push('/settings')}
          >
            Settings
          </Button>
        </VStack>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);

// Reusable stat card
const StatCard = ({ label, value, prefix, suffix, icon, color }) => (
  <Box
    p={4}
    bg={useColorModeValue('white', 'gray.800')}
    borderRadius="xl"
    boxShadow="sm"
    border="1px solid"
    borderColor={useColorModeValue('gray.100', 'gray.700')}
  >
    <VStack align="start" spacing={2}>
      <Icon as={icon} boxSize={6} color={`${color}.500`} />
      <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
        {label}
      </Text>
      <HStack spacing={1}>
        {prefix && <Text fontSize="sm">{prefix}</Text>}
        <Text fontSize="xl" fontWeight="bold">
          {value}
        </Text>
        {suffix && <Text fontSize="sm">{suffix}</Text>}
      </HStack>
    </VStack>
  </Box>
);

// Reusable dashboard card
const DashboardCard = ({ title, children, action }) => (
  <Box
    bg={useColorModeValue('white', 'gray.800')}
    borderRadius="xl"
    p={4}
    boxShadow="sm"
    border="1px solid"
    borderColor={useColorModeValue('gray.100', 'gray.700')}
  >
    <VStack align="stretch" spacing={4}>
      <Flex justify="space-between" align="center">
        <Heading size="md">{title}</Heading>
        {action}
      </Flex>
      {children}
    </VStack>
  </Box>
);

// PaymentLink actions menu component
const PaymentLinkActions = ({ link, onCopy, onShare, onQR }) => (
  <Menu>
    <MenuButton
      as={IconButton}
      icon={<FiMoreVertical />}
      variant="ghost"
      size="sm"
      aria-label="Actions"
    />
    <MenuList>
      <MenuItem icon={<FiCopy />} onClick={onCopy}>
        Copy Link
      </MenuItem>
      <MenuItem icon={<FiShare2 />} onClick={onShare}>
        Share
      </MenuItem>
      <MenuItem icon={<FaQrcode />} onClick={onQR}>
        Show QR Code
      </MenuItem>
    </MenuList>
  </Menu>
);

// Transaction details modal
const TransactionDetailsModal = ({ isOpen, onClose, transaction }) => {
  const cancelRef = React.useRef();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Transaction Details
          </AlertDialogHeader>

          <AlertDialogBody>
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <Text color="gray.500">Amount</Text>
                <Text fontWeight="bold">
                  {transaction?.amount} {transaction?.currency}
                </Text>
              </HStack>
              
              <HStack justify="space-between">
                <Text color="gray.500">Status</Text>
                <Badge colorScheme={
                  transaction?.status === 'completed' ? 'green' :
                  transaction?.status === 'pending' ? 'yellow' : 'red'
                }>
                  {transaction?.status}
                </Badge>
              </HStack>
              
              <HStack justify="space-between">
                <Text color="gray.500">Reference</Text>
                <Text>{transaction?.reference}</Text>
              </HStack>
              
              <HStack justify="space-between">
                <Text color="gray.500">Fee</Text>
                <Text>{transaction?.fee} {transaction?.currency}</Text>
              </HStack>
              
              <Divider />
              
              <VStack align="stretch" spacing={2}>
                <Text color="gray.500">Metadata</Text>
                <Box 
                  p={2} 
                  bg="gray.50" 
                  borderRadius="md"
                  fontSize="sm"
                  fontFamily="mono"
                >
                  {JSON.stringify(transaction?.metadata, null, 2)}
                </Box>
              </VStack>
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default MerchantDashboard;