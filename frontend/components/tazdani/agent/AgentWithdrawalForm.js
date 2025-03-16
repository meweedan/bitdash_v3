import { useState } from 'react';
import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Button,
  NumberInput,
  NumberInputField,
  useToast,
  Text,
  Box,
  Avatar,
  Badge,
  PinInput,
  PinInputField,
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Input,
  Spinner,
  FormHelperText,
  useColorModeValue,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { QrCode } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import QRScanner from '@/components/QRScanner';

const AgentWithdrawalForm = ({ 
  agentData, 
  customerData: initialCustomerData, 
  onClose, 
  onComplete 
}) => {
  const [localCustomerData, setLocalCustomerData] = useState(initialCustomerData || null);
  const [isQRVisible, setQRVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [amount, setAmount] = useState('');
  const [customerPin, setCustomerPin] = useState('');
  const [agentPin, setAgentPin] = useState('');
  const toast = useToast();
  const queryClient = useQueryClient();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  // Customer search query
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', searchQuery],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customer-profiles?` +
        `filters[$or][0][fullName][$contains]=${searchQuery}&` +
        `filters[$or][1][phone][$contains]=${searchQuery}&` +
        `populate[wallet]=*`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!res.ok) throw new Error('Failed to fetch customers');
      return res.json();
    },
    enabled: searchQuery.length > 2,
    onError: (error) => {
      toast({
        title: 'Search Error',
        description: error.message,
        status: 'error',
        duration: 5000
      });
    }
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
      
      setLocalCustomerData(data.data);
      setQRVisible(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error'
      });
    }
  };

  const withdrawalMutation = useMutation({
    mutationFn: async ({ amount, customerPin, agentPin }) => {
      if (!localCustomerData?.attributes?.wallet?.data?.id) {
        throw new Error('Invalid customer wallet');
      }

      // First verify customer PIN
      const pinResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customer-profiles/verify-pin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            customerId: localCustomerData.id,
            pin: customerPin
          })
        }
      );

      if (!pinResponse.ok) {
        throw new Error('Invalid customer PIN');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            data: {
              amount: parseFloat(amount),
              type: 'withdrawal',
              currency: 'LYD',
              status: 'completed',
              sender: localCustomerData.attributes.wallet.data.id,
              receiver: agentData.data.attributes.wallet.data.id,
              agent: agentData.data.id,
              reference: `WIT${Date.now()}`,
              metadata: {
                customerName: localCustomerData.attributes.fullName,
                customerPhone: localCustomerData.attributes.phone,
                agentCashBalanceBefore: agentData.data.attributes.cashBalance,
                agentCashBalanceAfter: agentData.data.attributes.cashBalance + parseFloat(amount)
              }
            }
          })
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Withdrawal failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['agent']);
      if (onComplete) onComplete('withdrawal');
      setLocalCustomerData(null);
      setAmount('');
      setCustomerPin('');
      setAgentPin('');
      onClose();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !customerPin || !agentPin) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error'
      });
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Amount must be greater than zero',
        status: 'error'
      });
      return;
    }

    if (parseFloat(amount) > agentData.data.attributes.cashBalance) {
      toast({
        title: 'Error',
        description: 'Insufficient cash balance',
        status: 'error'
      });
      return;
    }

    withdrawalMutation.mutate({ amount, customerPin, agentPin });
  };

  return (
    <>
      {!localCustomerData ? (
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Find Customer</FormLabel>
            <Input
              placeholder="Search by name or phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              mb={2}
            />
            <FormHelperText>
              <Button 
                variant="link" 
                size="sm"
                leftIcon={<QrCode />}
                onClick={() => setQRVisible(true)}
              >
                Scan QR Code Instead
              </Button>
            </FormHelperText>
          </FormControl>

          {/* Loading State */}
          {isLoading && <Spinner />}

          {/* Search Results */}
          <VStack spacing={2} w="full" maxH="300px" overflowY="auto">
            {customers?.data?.map((customer) => (
              <Box
                key={customer.id}
                p={4}
                bg={isDark ? 'gray.700' : 'gray.50'}
                borderRadius="md"
                cursor="pointer"
                _hover={{ bg: isDark ? 'gray.600' : 'gray.100' }}
                onClick={() => setLocalCustomerData(customer)}
                w="full"
              >
                <HStack>
                  <Avatar name={customer.attributes.fullName} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">{customer.attributes.fullName}</Text>
                    <Text fontSize="sm" color="gray.500">{customer.attributes.phone}</Text>
                    {customer.attributes.wallet?.data?.attributes?.walletId && (
                      <Text fontSize="xs" color="gray.500">
                        Wallet: {customer.attributes.wallet.data.attributes.walletId}
                      </Text>
                    )}
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        </VStack>
      ) : (
        <form onSubmit={handleSubmit}>
          <VStack spacing={6}>
            <Box
              p={4}
              bg={isDark ? 'green.900' : 'green.50'}
              borderRadius="md"
              w="full"
            >
              <HStack justify="space-between">
                <HStack>
                  <Avatar name={localCustomerData.attributes.fullName} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">{localCustomerData.attributes.fullName}</Text>
                    <Text fontSize="sm" color="gray.500">{localCustomerData.attributes.phone}</Text>
                    {localCustomerData.attributes.wallet?.data?.attributes?.walletId && (
                      <Text fontSize="xs" color="gray.500">
                        Wallet: {localCustomerData.attributes.wallet.data.attributes.walletId}
                      </Text>
                    )}
                  </VStack>
                </HStack>
                <Badge colorScheme="green">Selected</Badge>
              </HStack>
            </Box>

            <FormControl isRequired>
              <FormLabel>Amount (LYD)</FormLabel>
              <NumberInput min={1} max={agentData.data.attributes.cashBalance}>
                <NumberInputField
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </NumberInput>
            </FormControl>

            {parseFloat(amount) > agentData.data.attributes.cashBalance && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                Insufficient cash balance
              </Alert>
            )}

            <FormControl isRequired>
              <FormLabel>Customer's PIN</FormLabel>
              <HStack justify="center">
                <PinInput
                  value={customerPin}
                  onChange={setCustomerPin}
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

            <FormControl isRequired>
              <FormLabel>Your PIN</FormLabel>
              <HStack justify="center">
                <PinInput
                  value={agentPin}
                  onChange={setAgentPin}
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

            <HStack w="full" spacing={4} pt={4}>
              <Button 
                flex={1} 
                onClick={() => {
                  setLocalCustomerData(null);
                  setSearchQuery('');
                }}
              >
                Change Customer
              </Button>
              <Button
                flex={1}
                type="submit"
                colorScheme="blue"
                isLoading={withdrawalMutation.isLoading}
                loadingText="Processing..."
                isDisabled={
                  !amount || 
                  customerPin.length !== 6 || 
                  agentPin.length !== 6 ||
                  parseFloat(amount) > agentData.data.attributes.cashBalance
                }
              >
                Confirm Withdrawal
              </Button>
            </HStack>
          </VStack>
        </form>
      )}

      {/* QR Scanner Modal */}
      {isQRVisible && (
        <Modal
          isOpen={true}
          onClose={() => setQRVisible(false)}
          size="full"
          isCentered
        >
          <ModalOverlay />
          <ModalContent bg="transparent">
            <ModalCloseButton color="white" />
            <ModalBody p={0}>
              <QRScanner
                onScan={handleQRScan}
                onClose={() => setQRVisible(false)}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default AgentWithdrawalForm;