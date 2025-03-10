// frontend/pages/adfaaly/client/transfer.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Input,
  NumberInput,
  Tooltip,
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
  Divider,
  useColorModeValue
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { 
  ArrowLeft,
  Clock,
  Star,
  QrCode
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { useTransfer } from '@/hooks/useTransfer';

import Layout from '@/components/Layout';
import QRScanner from '@/components/QRScanner';

const TransferPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const toast = useToast();
  const { user } = useAuth();
  const [isQRVisible, setQRVisible] = useState(false);
  const [isPreloadedRecipient, setIsPreloadedRecipient] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const transfer = useTransfer();
  const { data: wallet } = useWallet();
  const [note, setNote] = useState('');

  // Pre-load recipient details if redirected from public profile
  useEffect(() => {
    const { recipientId, recipientName, recipientPhone } = router.query;
    
    if (recipientId && recipientName && recipientPhone) {
        const prepopulatedRecipient = {
        id: recipientId,
        attributes: {
            fullName: decodeURIComponent(recipientName),
            phone: decodeURIComponent(recipientPhone)
        }
        };
        
        setRecipient(prepopulatedRecipient);
        setSearchQuery(decodeURIComponent(recipientName));
        setIsPreloadedRecipient(true);  // Add this line
    }
    }, [router.query]);

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
    enabled: searchQuery.length > 2 && !isPreloadedRecipient,
    onError: (error) => {
      toast({
        title: 'Search Error',
        description: error.message,
        status: 'error',
        duration: 5000
      });
    }
  });

  const { 
    data: walletData,
    isLoading: isWalletLoading,
    error: walletError,
    refetch: refetchWallet
    } = useQuery({
    queryKey: ['walletBalance', 'customer', user?.id],
    queryFn: async () => {
        const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallets?populate=*&filters[customer][users_permissions_user][id][$eq]=${user.id}`,
        {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
        );
        if (!response.ok) throw new Error('Failed to fetch wallet');
        return response.json();
    },
    refetchInterval: 10000,
    enabled: !!user?.id,
    retry: 2,
    onError: (error) => {
        toast({
        title: 'Error fetching wallet',
        description: error.message,
        status: 'error',
        duration: 5000
        });
    }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!recipient || !amount || !pin) {
        toast({
            title: 'Error',
            description: 'Please fill in all fields',
            status: 'error',
            duration: 3000
        });
        return;
        }

        const transferAmount = parseFloat(amount);
        
        // Use the wallet data from the query for balance check
        const currentBalance = walletData?.data?.[0]?.attributes?.balance || 0;

        console.log('Transfer validation:', {
        transferAmount,
        currentBalance,
        walletData,
        user: user?.id
        });

        if (transferAmount <= 0) {
        toast({
            title: 'Invalid Amount',
            description: 'Transfer amount must be greater than zero',
            status: 'error',
            duration: 3000
        });
        return;
        }

        if (transferAmount > currentBalance) {
        toast({
            title: 'Insufficient Balance',
            description: `Insufficient funds. Current balance: ${currentBalance.toLocaleString()} LYD`,
            status: 'error',
            duration: 5000
        });
        return;
        }

        transfer.mutate({
        recipientId: recipient.id,
        amount: transferAmount,
        pin
      });
    };


  return (
    <Layout>
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
            {isWalletLoading ? (
              <Spinner size="sm" />
            ) : (
              <Text fontWeight="bold">
                Balance: {walletData?.data?.[0]?.attributes?.balance?.toLocaleString() || 0} LYD
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
                <FormLabel>Find Recipient</FormLabel>
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

              {/* Highlight pre-selected recipient */}
              {recipient && (
                <Box
                  key={recipient.id}
                  p={4}
                  bg={isDark ? 'green.900' : 'green.50'}
                  borderRadius="md"
                  cursor="pointer"
                  w="full"
                >
                  <HStack justify="space-between">
                    <HStack>
                      <Avatar name={recipient.attributes.fullName} />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">{recipient.attributes.fullName}</Text>
                        <Text fontSize="sm" color="gray.500">{recipient.attributes.phone}</Text>
                      </VStack>
                    </HStack>
                    <Badge colorScheme="green">Selected</Badge>
                  </HStack>
                </Box>
              )}

              {/* Existing customer search results */}
              {customers?.data?.map((customer) => (
                <Box
                  key={customer.id}
                  p={4}
                  bg={isDark ? 'gray.700' : 'gray.50'}
                  borderRadius="md"
                  cursor="pointer"
                  _hover={{ bg: isDark ? 'gray.600' : 'gray.100' }}
                  onClick={() => setRecipient(customer)}
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


          {/* Transfer Form */}
          {recipient && (
            <Box 
              as="form"
              onSubmit={handleSubmit}
              p={6} 
              bg={isDark ? 'gray.800' : 'white'} 
              rounded="xl" 
              shadow="lg"
            >
              <VStack spacing={6}>
                <HStack w="full">
                  <Avatar name={recipient.attributes.fullName} />
                  <Text fontWeight="bold">{recipient.attributes.fullName}</Text>
                </HStack>

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

                <FormControl>
                  <FormLabel>Note (Optional)</FormLabel>
                  <Input
                    placeholder="What's this for?"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </FormControl>

                {/* Wallet PIN */}
              <FormControl isRequired>
                  <FormLabel>
                    {t('walletPIN')}
                    <Tooltip label={t('walletPINHelper')}>
                      <InfoIcon ml={2} />
                    </Tooltip>
                  </FormLabel>
                  <HStack justify="center">
                    <PinInput 
                      value={pin}
                      onChange={setPin}
                      type="number"
                      mask
                      size="lg"
                      manageFocus={true}
                      complete={pin.length === 6}
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
                  <FormHelperText>
                    {t('Enter 6-digit PIN for your wallet security')}
                  </FormHelperText>
                </FormControl>

                <Divider />

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  w="full"
                  isLoading={transfer.isLoading}
                  isDisabled={pin.length !== 6 || transfer.isLoading}
                >
                  Send Money
                </Button>
              </VStack>
            </Box>
          )}

          {/* Transfer Info */}
          <Box 
            p={6} 
            bg={isDark ? 'gray.800' : 'white'} 
            rounded="xl" 
            shadow="lg"
          >
            <VStack align="start" spacing={4}>
              <Heading size="sm">Transfer Information</Heading>
              
              <HStack justify="space-between" w="full">
                <HStack>
                  <Clock size={16} />
                  <Text>Processing Time</Text>
                </HStack>
                <Text fontWeight="medium">Instant</Text>
              </HStack>

              <HStack justify="space-between" w="full">
                <HStack>
                  <Star size={16} />
                  <Text>Transfer Fee</Text>
                </HStack>
                <Text fontWeight="medium">Free</Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>

        {/* QR Scanner Modal */}
        {isQRVisible && (
          <QRScanner
            isOpen={isQRVisible}
            onClose={() => setQRVisible(false)}
          />
        )}
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default TransferPage;