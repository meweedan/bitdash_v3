// pages/pay/receive.js
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
  NumberInput,
  NumberInputField,
  FormControl,
  FormLabel,
  useColorMode,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useClipboard,
  useToast,
  Code
} from '@chakra-ui/react';
import { 
  ArrowLeft, 
  Copy, 
  Share2,
  QrCode,
  Link as LinkIcon
} from 'lucide-react';

import Layout from '@/components/Layout';

const ReceiveMoney = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const toast = useToast();
  
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [paymentLink, setPaymentLink] = useState('https://bitpay.me/username');
  const { hasCopied, onCopy } = useClipboard(paymentLink);

  // Generate QR code data
  const qrData = {
    amount,
    note,
    recipient: 'USER_ID', // This would come from auth context
    timestamp: new Date().toISOString()
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Request Money via BitPay',
          text: note ? `Request for ${amount} LYD: ${note}` : `Request for ${amount} LYD`,
          url: paymentLink
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
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
            <Heading size="lg">Receive Money</Heading>
          </HStack>

          {/* Main Content */}
          <Box 
            p={6} 
            bg={isDark ? 'gray.800' : 'white'} 
            rounded="xl" 
            shadow="lg"
          >
            <Tabs isFitted variant="enclosed">
              <TabList mb="1em">
                <Tab>QR Code</Tab>
                <Tab>Payment Link</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <VStack spacing={6}>
                    <FormControl>
                      <FormLabel>Amount (Optional)</FormLabel>
                      <NumberInput min={0}>
                        <NumberInputField
                          placeholder="Enter amount"
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

                    {/* QR Code Display */}
                    <Box
                      w="full"
                      maxW="300px"
                      h="300px"
                      bg={isDark ? 'gray.700' : 'gray.100'}
                      rounded="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <QrCode size={200} />
                    </Box>

                    <Text fontSize="sm" color="gray.500" textAlign="center">
                      Share this QR code to receive money instantly
                    </Text>

                    <HStack spacing={4}>
                      <Button
                        leftIcon={<Share2 />}
                        onClick={handleShare}
                      >
                        Share QR
                      </Button>
                    </HStack>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={6}>
                    <Box 
                      p={4} 
                      bg={isDark ? 'gray.700' : 'gray.100'} 
                      rounded="lg" 
                      w="full"
                    >
                      <HStack justify="space-between">
                        <Text 
                          fontFamily="mono" 
                          fontSize="sm"
                          wordBreak="break-all"
                        >
                          {paymentLink}
                        </Text>
                        <Button
                          size="sm"
                          leftIcon={<Copy />}
                          onClick={onCopy}
                        >
                          {hasCopied ? 'Copied!' : 'Copy'}
                        </Button>
                      </HStack>
                    </Box>

                    <Text fontSize="sm" color="gray.500">
                      Share your payment link to receive money
                    </Text>

                    <VStack spacing={4} w="full">
                      <Button
                        w="full"
                        leftIcon={<Share2 />}
                        onClick={handleShare}
                      >
                        Share Payment Link
                      </Button>
                      <Button
                        w="full"
                        variant="outline"
                        leftIcon={<LinkIcon />}
                        onClick={() => {
                          // Open settings to customize payment link
                          router.push('/cash/settings#payment-link');
                        }}
                      >
                        Customize Link
                      </Button>
                    </VStack>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>

          {/* Info Box */}
          <Box 
            p={6} 
            bg={isDark ? 'gray.800' : 'white'} 
            rounded="xl" 
            shadow="lg"
          >
            <VStack align="start" spacing={4}>
              <Heading size="sm">Receiving Money with BitPay</Heading>
              <VStack align="start" spacing={2}>
                <HStack>
                  <Box w={2} h={2} rounded="full" bg="green.400" />
                  <Text>Instant transfers between BitPay users</Text>
                </HStack>
                <HStack>
                  <Box w={2} h={2} rounded="full" bg="green.400" />
                  <Text>No fees for receiving money</Text>
                </HStack>
                <HStack>
                  <Box w={2} h={2} rounded="full" bg="green.400" />
                  <Text>Safe and secure transactions</Text>
                </HStack>
              </VStack>
            </VStack>
          </Box>
        </VStack>
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

export default ReceiveMoney;