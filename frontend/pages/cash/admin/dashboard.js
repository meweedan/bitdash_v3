import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import GlassCard from '@/components/GlassCard';
import AdvancedForexChart from '@/components/cash/AdvancedForexChart';

import {
  Box,
  Container,
  VStack,
  HStack,
  SimpleGrid,
  useColorModeValue,
  Text,
  Spinner,
  useToast,
  Alert,
  AlertIcon,
  Badge,
  Flex,
  Heading,
  Button,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';

import {
  RefreshCw,
  Activity,
  Settings,
  ChevronDown,
  DollarSign,
  LineChart,
} from 'lucide-react';

const MarketDataAdmin = () => {
  const router = useRouter();
  const toast = useToast();
  const { user, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPair, setSelectedPair] = useState('USD/EUR');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');

  // Fetch rates data
  const { data: ratesData, isLoading, refetch } = useQuery({
    queryKey: ['exchangeRates'],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/exchange-rates?sort=timestamp:desc&pagination[limit]=100`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch rates');
      return response.json();
    }
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!authLoading && !isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'Admin access required',
        status: 'error',
        duration: 5000
      });
      router.push('/cash');
    }
  }, [authLoading, isAuthenticated, isAdmin]);

  const runDataFetcher = async () => {
    setIsRunning(true);
    try {
      const response = await fetch('/api/admin/fetch-market-data', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to run data fetcher');
      }
      
      toast({
        title: 'Success',
        description: 'Market data fetch initiated',
        status: 'success'
      });

      setTimeout(refetch, 5000);

    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error'
      });
    } finally {
      setIsRunning(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <Flex justify="center" align="center" minH="100vh">
          <Spinner />
        </Flex>
      </Layout>
    );
  }

  const metrics = {
    totalPairs: ratesData?.data?.length || 0,
    updatedToday: ratesData?.data?.filter(rate => 
      new Date(rate.attributes.timestamp).toDateString() === new Date().toDateString()
    ).length || 0,
    totalVolume: ratesData?.data?.reduce((sum, rate) => 
      sum + (parseFloat(rate.attributes.volume) || 0), 0
    ) || 0
  };

  return (
    <Layout>
      <Head>
        <title>Market Data Admin | BitCash</title>
      </Head>

      <Container maxW="1200px" py={6}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Flex justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Heading size="lg">Market Data Admin</Heading>
              <Text color="gray.500">Manage exchange rates and market data</Text>
            </VStack>

            <HStack spacing={4}>
              <Button onClick={onOpen} leftIcon={<LineChart />}>
                View Chart
              </Button>
              <Button
                leftIcon={<RefreshCw />}
                onClick={runDataFetcher}
                isLoading={isRunning}
                loadingText="Running..."
                colorScheme="blue"
              >
                Update Market Data
              </Button>
            </HStack>
          </Flex>

          {/* Metrics */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <GlassCard>
              <Stat p={4}>
                <StatLabel>Total Pairs</StatLabel>
                <StatNumber>{metrics.totalPairs}</StatNumber>
                <StatHelpText>Active trading pairs</StatHelpText>
              </Stat>
            </GlassCard>

            <GlassCard>
              <Stat p={4}>
                <StatLabel>Updated Today</StatLabel>
                <StatNumber>{metrics.updatedToday}</StatNumber>
                <StatHelpText>Pairs updated in last 24h</StatHelpText>
              </Stat>
            </GlassCard>

            <GlassCard>
              <Stat p={4}>
                <StatLabel>Total Volume</StatLabel>
                <StatNumber>{metrics.totalVolume.toLocaleString()}</StatNumber>
                <StatHelpText>Across all pairs</StatHelpText>
              </Stat>
            </GlassCard>
          </SimpleGrid>

          {/* Recent Updates */}
          <GlassCard p={6}>
            <VStack align="stretch" spacing={4}>
              <Heading size="md">Recent Updates</Heading>
              <SimpleGrid columns={1} spacing={4}>
                {ratesData?.data?.slice(0, 5).map((rate) => (
                  <Box key={rate.id} p={4} bg={bgColor} borderRadius="lg" shadow="sm">
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text fontWeight="bold">
                        {rate.attributes.from_currency}/{rate.attributes.to_currency}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {new Date(rate.attributes.timestamp).toLocaleString()}
                      </Text>
                    </Flex>
                    
                    <SimpleGrid columns={2} spacing={4}>
                      <Text>Rate: {rate.attributes.rate}</Text>
                      <Text>Volume: {rate.attributes.volume?.toLocaleString()}</Text>
                      <Text>High: {rate.attributes.high_rate}</Text>
                      <Text>Low: {rate.attributes.low_rate}</Text>
                    </SimpleGrid>
                  </Box>
                ))}
              </SimpleGrid>
            </VStack>
          </GlassCard>
        </VStack>

        {/* Chart Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Market Chart</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <AdvancedForexChart />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Layout>
  );
};

export default MarketDataAdmin;