import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  Text, 
  Button, 
  Input, 
  FormControl, 
  FormLabel, 
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  useColorMode,
  HStack,
  IconButton,
  useClipboard
} from "@chakra-ui/react";
import { QRCodeCanvas } from "qrcode.react";
import { useMutation } from '@tanstack/react-query';
import { FiCopy, FiShare2, FiSun, FiMoon } from 'react-icons/fi';

const PaymentLinkGenerator = ({ 
  merchantData, 
  isOpen, 
  onClose 
}) => {
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [paymentLink, setPaymentLink] = useState(null);
  const [isQRDarkMode, setIsQRDarkMode] = useState(false);
  const toast = useToast();
  const { colorMode } = useColorMode();
  const { hasCopied, onCopy } = useClipboard(paymentLink?.url || '');

  // Ensure environment variables are defined
  const frontendUrl = 'https://tazdani.bitdash.app';
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!backendUrl) {
    console.error('Missing backend URL');
    return null;
  }

  // Get business name, defaulting to a safe URL-friendly string
  const businessName = merchantData?.attributes?.metadata?.businessName 
    ? merchantData.attributes.metadata.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')
    : 'merchant';

  const createPaymentLink = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token is missing');
      }

      if (!merchantData || !merchantData.id) {
        throw new Error('Invalid merchant information');
      }

      // Generate unique link ID
      const linkId = `${businessName}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`.toUpperCase();
      
      // Calculate expiry (24 hours from now)
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 24);

      try {
        const response = await fetch(
          `${backendUrl}/api/payment-links`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              data: {
                amount: parseFloat(data.amount),
                currency: 'LYD',
                merchant: merchantData.id,
                status: 'active',
                payment_type: 'fixed',
                pin: data.pin,
                link_id: linkId,
                expiry: expiry.toISOString(),
                description: `Payment to ${merchantData.attributes.metadata.businessName}`,
                success_url: `${frontendUrl}/payments/success`,
                cancel_url: `${frontendUrl}/payments/cancel`,
                metadata: {
                  businessName: merchantData.attributes.metadata.businessName,
                  merchantId: merchantData.id,
                  createdAt: new Date().toISOString(),
                  merchantPhone: merchantData.attributes.phone,
                  merchantEmail: merchantData.attributes.email,
                  linkType: 'qr',
                  platform: 'web'
                }
              }
            })
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to create payment link');
        }

        const responseData = await response.json();
        
        // Construct full payment URL
        const fullUrl = `${frontendUrl}/${businessName}/${linkId}`;
        
        return {
          ...responseData.data,
          url: fullUrl
        };
      } catch (error) {
        console.error('Payment Link Creation Error:', error);
        throw new Error(error.message || 'Failed to create payment link');
      }
    },
    onSuccess: (data) => {
      setPaymentLink(data);
      toast({
        title: 'Payment Link Created',
        description: 'QR code is ready to be scanned',
        status: 'success',
        duration: 3000
      });
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

  const handleGenerateLink = () => {
    // Validation
    if (!amount || !pin) {
      toast({
        title: 'Validation Error',
        description: 'Please enter both amount and PIN',
        status: 'error',
        duration: 3000
      });
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount greater than 0',
        status: 'error',
        duration: 3000
      });
      return;
    }

    if (pin.length !== 6 || isNaN(pin)) {
      toast({
        title: 'Invalid PIN',
        description: 'PIN must be 6 digits',
        status: 'error',
        duration: 3000
      });
      return;
    }

    // Generate payment link
    createPaymentLink.mutate({ amount, pin });
  };

  const handleShare = async () => {
    if (paymentLink?.url) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Payment Link',
            text: `Pay ${businessName} - ${paymentLink.attributes.amount} LYD`,
            url: paymentLink.url
          });
        } catch (error) {
          console.error('Share failed:', error);
          onCopy();
          toast({
            title: 'Link Copied',
            description: 'Payment link copied to clipboard instead',
            status: 'success',
            duration: 2000
          });
        }
      } else {
        onCopy();
        toast({
          title: 'Link Copied',
          description: 'Payment link copied to clipboard',
          status: 'success',
          duration: 2000
        });
      }
    }
  };

  const resetForm = () => {
    setAmount('');
    setPin('');
    setPaymentLink(null);
  };

  // Determine QR code colors based on dark mode and user preference
  const getQRCodeColors = () => {
    if (isQRDarkMode) {
      return {
        background: colorMode === 'dark' ? '#1A202C' : '#000000',
        foreground: colorMode === 'dark' ? '#E2E8F0' : '#FFFFFF'
      };
    }
    return {
      background: colorMode === 'dark' ? '#2D3748' : '#FFFFFF',
      foreground: colorMode === 'dark' ? '#000000' : '#1179BE'
    };
  };

  const qrColors = getQRCodeColors();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="xl" 
      closeOnOverlayClick={!paymentLink}
      closeOnEsc={!paymentLink}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text 
            bgGradient={
              colorMode === 'dark' 
                ? "linear(to-r, gray.100, gray.300)" 
                : "linear(to-r, gray.700, gray.900)"
            }
            bgClip="text"
            fontWeight="bold"
          >
            Generate Payment Link
          </Text>
        </ModalHeader>
        <ModalCloseButton isDisabled={paymentLink && true} />
        <ModalBody pb={6}>
          {!paymentLink ? (
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Amount (LYD)</FormLabel>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Merchant PIN</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter 6-digit PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={6}
                />
              </FormControl>

              <Button
                colorScheme="blue"
                onClick={handleGenerateLink}
                isLoading={createPaymentLink.isLoading}
                width="full"
              >
                Generate Payment Link
              </Button>
            </VStack>
          ) : (
            <VStack spacing={4} align="center">
              <Box 
                p={4} 
                borderWidth={2} 
                borderRadius="xl" 
                borderColor={colorMode === 'dark' ? 'whiteAlpha.300' : 'blackAlpha.200'}
                boxShadow="md"
              >
                <QRCodeCanvas
                  value={paymentLink.url}
                  size={250}
                  level="H"
                  bgColor={qrColors.background}
                  fgColor={qrColors.foreground}
                  style={{
                    borderRadius: '16px',
                    border: `4px solid ${colorMode === 'dark' ? '#2D3748' : '#E2E8F0'}`
                  }}
                />
              </Box>
              
              <VStack spacing={2} align="center">
                <Text fontWeight="bold">
                  {parseFloat(paymentLink.attributes.amount).toLocaleString()} LYD
                </Text>
                
                <Text 
                  fontSize="sm" 
                  color="gray.500" 
                  textAlign="center"
                  maxWidth="300px"
                  noOfLines={2}
                >
                  {paymentLink.url}
                </Text>
              </VStack>

              <HStack spacing={4}>
                <IconButton
                  icon={isQRDarkMode ? <FiSun /> : <FiMoon />}
                  onClick={() => setIsQRDarkMode(!isQRDarkMode)}
                  variant="outline"
                  aria-label="Toggle QR Code Theme"
                />
                <IconButton
                  icon={<FiCopy />}
                  onClick={onCopy}
                  variant="outline"
                  aria-label="Copy Link"
                  colorScheme={hasCopied ? 'green' : 'gray'}
                />
                <Button
                  leftIcon={<FiShare2 />}
                  onClick={handleShare}
                  colorScheme="blue"
                  variant="solid"
                >
                  Share
                </Button>
              </HStack>

              <Button 
                variant="outline" 
                onClick={resetForm}
                width="full"
                mt={2}
              >
                Generate New Link
              </Button>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PaymentLinkGenerator;