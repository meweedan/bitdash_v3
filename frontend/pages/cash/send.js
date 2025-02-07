// pages/pay/send.js
import { useState } from 'react';
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
  Select,
  NumberInput,
  NumberInputField,
  FormControl,
  FormLabel,
  FormHelperText,
  useColorMode,
  Avatar,
  AvatarGroup,
  Divider,
  useToast
} from '@chakra-ui/react';
import { 
  ArrowLeft,
  Search,
  Users,
  Clock,
  Star,
  QrCode
} from 'lucide-react';

import Layout from '@/components/Layout';
import QRScanner from '@/components/QRScanner';

const SendMoney = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const toast = useToast();
  const [isQRVisible, setQRVisible] = useState(false);

  // Recent recipients example data
  const recentRecipients = [
    { id: 1, name: 'Sarah Ahmed', image: null, number: '+201234567890' },
    { id: 2, name: 'Mohamed Ali', image: null, number: '+201234567891' },
    { id: 3, name: 'Nour Hassan', image: null, number: '+201234567892' }
  ];

  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // API call would go here
      toast({
        title: 'Money Sent Successfully',
        status: 'success',
        duration: 5000
      });
      router.push('/pay/app/dashboard');
    } catch (error) {
      toast({
        title: 'Failed to Send Money',
        description: error.message,
        status: 'error',
        duration: 5000
      });
    }
  };

  return (
    <Layout>
      <Container maxW="container.md" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack>
            <Button
              variant="ghost"
              leftIcon={<ArrowLeft />}
              onClick={() => router.back()}
            >
              Back
            </Button>
            <Heading size="lg">Send Money</Heading>
          </HStack>

          {/* Recent Recipients */}
          <Box 
            p={6} 
            bg={isDark ? 'gray.800' : 'white'} 
            rounded="xl" 
            shadow="lg"
          >
            <HStack justify="space-between" mb={4}>
              <Heading size="sm">Recent Recipients</Heading>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<Users />}
                onClick={() => router.push('/pay/contacts')}
              >
                All Contacts
              </Button>
            </HStack>
            
            <HStack spacing={4} overflowX="auto" py={2}>
              {recentRecipients.map((recipient) => (
                <VStack 
                  key={recipient.id}
                  spacing={2}
                  cursor="pointer"
                  onClick={() => setRecipient(recipient.number)}
                >
                  <Avatar name={recipient.name} src={recipient.image} />
                  <Text fontSize="sm" noOfLines={1}>
                    {recipient.name}
                  </Text>
                </VStack>
              ))}
            </HStack>
          </Box>

          {/* Send Money Form */}
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
                <FormLabel>Recipient</FormLabel>
                <Input
                  placeholder="Phone number or email"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
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

              <Divider />

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="full"
                isDisabled={!recipient || !amount}
              >
                Send Money
              </Button>
            </VStack>
          </Box>

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
            onScan={(data) => {
              setRecipient(data);
              setQRVisible(false);
            }}
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

export default SendMoney;