import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useDeposit } from '@/hooks/useDeposit';
import Layout from '@/components/Layout';
import QRScanner from '@/components/QRScanner';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  NumberInput,
  NumberInputField,
  FormControl,
  Badge,
  FormLabel,
  FormHelperText,
  useColorMode,
  Avatar,
  Spinner,
  PinInputField,
  PinInput,
  useToast,
  useColorModeValue,
  Divider
} from '@chakra-ui/react';
import { ArrowLeft, QrCode } from 'lucide-react';

const DepositPage = () => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const toast = useToast();
  const { user } = useAuth();
  const [isQRVisible, setQRVisible] = useState(false);
  const [isPreloadedCustomer, setIsPreloadedCustomer] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [amount, setAmount] = useState('');
  const [customerPin, setCustomerPin] = useState('');

  // Deposit hook
  const depositMutation = useDeposit({
    onSuccess: () => {
      refetchAgent();
      toast({
        title: 'Success',
        description: 'Deposit completed successfully',
        status: 'success',
        duration: 3000
      });
      router.push('/agent/dashboard');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000
      });
    }
  });

  // Handle pre-loaded customer from QR or public profile
  useEffect(() => {
    const { customerId, customerName, customerPhone } = router.query;
    
    if (customerId && customerName && customerPhone) {
      const prepopulatedCustomer = {
        id: customerId,
        attributes: {
          fullName: decodeURIComponent(customerName),
          phone: decodeURIComponent(customerPhone)
        }
      };
      
      setSelectedCustomer(prepopulatedCustomer);
      setSearchQuery(decodeURIComponent(customerName));
      setIsPreloadedCustomer(true);
    }
  }, [router.query]);

  // Fetch agent wallet data
  const { 
    data: agentData,
    isLoading: isAgentLoading,
    refetch: refetchAgent
    } = useQuery({
    queryKey: ['agentData', user?.id],
    queryFn: async () => {
        const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agents?filters[users_permissions_user][id][$eq]=${user.id}&populate=*`,
        {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
        );
        if (!response.ok) throw new Error('Failed to fetch agent data');
        const data = await response.json();
        return data.data[0]; // Assuming Strapi v4 response format
    },
    enabled: !!user?.id,
    refetchInterval: 10000
    });

  // Fetch customers
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', searchQuery],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customer-profiles?filters[$or][0][fullName][$contains]=${searchQuery}&filters[$or][1][phone][$contains]=${searchQuery}`
      );
      if (!res.ok) throw new Error('Failed to fetch customers');
      return res.json();
    },
    enabled: searchQuery.length > 2 && !isPreloadedCustomer
  });

  const handleQRScan = async (result) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customer-profiles/${result}?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) throw new Error('Invalid customer QR code');
      const data = await response.json();
      setSelectedCustomer(data.data);
      setQRVisible(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error'
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCustomer || !amount || !customerPin) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000
      });
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Amount must be greater than zero',
        status: 'error',
        duration: 3000
      });
      return;
    }

    depositMutation.mutate({ 
      customerId: selectedCustomer.id,
      amount,
      customerPin
    });
  };

  return (
    <Layout>
      <Head>
        <title>Cash Deposit | tazdani</title>
      </Head>

      <Container maxW="container.md" py={8}>
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between">
            <Button
              variant="ghost"
              leftIcon={<ArrowLeft />}
              onClick={() => router.back()}
            >
              Back
            </Button>
            {isAgentLoading ? (
              <Spinner size="sm" />
            ) : (
              <Text fontWeight="bold">
                Cash Balance: {agentData?.attributes?.cashBalance?.toLocaleString() || 0} LYD
              </Text>
            )}
          </HStack>

          {/* Customer Search Section */}
          <Box 
            p={6} 
            bg={isDark ? 'gray.800' : 'white'} 
            rounded="xl" 
            shadow="lg"
          >
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Find Customer</FormLabel>
                <Input
                  placeholder="Search by name or phone"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FormHelperText>
                  <Button 
                    variant="link" 
                    size="sm"
                    leftIcon={<QrCode />}
                    onClick={() => setQRVisible(true)}
                  >
                    Scan QR Code
                  </Button>
                </FormHelperText>
              </FormControl>

              {isLoading && <Spinner />}

              {/* Selected customer */}
              {selectedCustomer && (
                <Box
                  p={4}
                  bg={isDark ? 'green.900' : 'green.50'}
                  borderRadius="md"
                  w="full"
                >
                  <HStack justify="space-between">
                    <HStack>
                      <Avatar name={selectedCustomer.attributes.fullName} />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">{selectedCustomer.attributes.fullName}</Text>
                        <Text fontSize="sm" color="gray.500">{selectedCustomer.attributes.phone}</Text>
                      </VStack>
                    </HStack>
                    <Badge colorScheme="green">Selected</Badge>
                  </HStack>
                </Box>
              )}

              {/* Customer search results */}
              {!selectedCustomer && customers?.data?.map((customer) => (
                <Box
                  key={customer.id}
                  p={4}
                  bg={isDark ? 'gray.700' : 'gray.50'}
                  borderRadius="md"
                  cursor="pointer"
                  _hover={{ bg: isDark ? 'gray.600' : 'gray.100' }}
                  onClick={() => setSelectedCustomer(customer)}
                  w="full"
                >
                  <HStack>
                    <Avatar name={customer.attributes.fullName} />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold">{customer.attributes.fullName}</Text>
                      <Text fontSize="sm" color="gray.500">{customer.attributes.phone}</Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </Box>

          {/* Deposit Form */}
          {selectedCustomer && (
            <Box 
              as="form"
              onSubmit={handleSubmit}
              p={6} 
              bg={isDark ? 'gray.800' : 'white'} 
              rounded="xl" 
              shadow="lg"
            >
              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel>Amount (LYD)</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Customer PIN</FormLabel>
                  <HStack justify="center">
                    <PinInput 
                      value={customerPin}
                      onChange={setCustomerPin}
                      type="number"
                      mask
                      size="lg"
                    >
                      {[...Array(6)].map((_, i) => (
                        <PinInputField
                          key={i}
                          fontSize="xl"
                          borderColor={useColorModeValue('gray.200', 'gray.600')}
                          _focus={{
                            borderColor: 'blue.400',
                            boxShadow: `0 0 0 1px ${useColorModeValue('blue.400', 'blue.300')}`
                          }}
                          _hover={{
                            borderColor: useColorModeValue('gray.300', 'gray.500')
                          }}
                        />
                      ))}
                    </PinInput>
                  </HStack>
                </FormControl>

                <Divider />

                <Button
                  type="submit"
                  colorScheme="green"
                  size="lg"
                  w="full"
                  isLoading={depositMutation.isLoading}
                  isDisabled={!amount || customerPin.length !== 6}
                >
                  Complete Deposit
                </Button>
              </VStack>
            </Box>
          )}
        </VStack>

        {/* QR Scanner */}
        {isQRVisible && (
          <QRScanner
            isOpen={isQRVisible}
            onClose={() => setQRVisible(false)}
            onScan={handleQRScan}
          />
        )}
      </Container>
    </Layout>
  );
};

export default DepositPage;