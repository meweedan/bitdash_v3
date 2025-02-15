// components/shop/ShopPaymentGenerator.js
import React, { useState } from 'react';
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
  useClipboard,
  PinInput,
  PinInputField
} from "@chakra-ui/react";
import { QRCodeCanvas } from "qrcode.react";
import { useMutation } from '@tanstack/react-query';
import { FiCopy, FiShare2, FiSun, FiMoon } from 'react-icons/fi';

const ShopPaymentGenerator = ({ 
  shopData, 
  orderId,
  total,
  isOpen, 
  onClose,
  onSuccess 
}) => {
  const [pin, setPin] = useState('');
  const [paymentLink, setPaymentLink] = useState(null);
  const [isQRDarkMode, setIsQRDarkMode] = useState(false);
  const toast = useToast();
  const { colorMode } = useColorMode();
  const { hasCopied, onCopy } = useClipboard(paymentLink?.url || '');

  // Frontend base URL
  const frontendUrl = 'https://cash.bitdash.app';

  // Generate unique link ID using shop name and order ID
  const businessName = shopData?.data?.[0]?.attributes?.shopName?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'shop';

  const createPaymentLink = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token is missing');
      }

      // Generate unique link ID
      const linkId = `${businessName}-${orderId}-${Date.now()}`.toUpperCase();
      
      // Calculate expiry (24 hours from now)
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 24);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment-links`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              data: {
                amount: parseFloat(total),
                currency: 'LYD',
                merchant: shopData.data[0].id,
                status: 'active',
                payment_type: 'fixed',
                pin: data.pin,
                link_id: linkId,
                order: orderId,
                expiry: expiry.toISOString(),
                description: `Payment for order #${orderId}`,
                success_url: `${frontendUrl}/payments/success`,
                cancel_url: `${frontendUrl}/payments/cancel`,
                metadata: {
                  businessName: shopData.data[0].attributes.shopName,
                  merchantId: shopData.data[0].id,
                  orderId: orderId,
                  createdAt: new Date().toISOString(),
                  linkType: 'order',
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
      onSuccess && onSuccess(data);
      toast({
        title: 'Payment Link Created',
        description: 'QR code is ready to be shared with customer',
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
    if (!pin || pin.length !== 6 || isNaN(pin)) {
      toast({
        title: 'Invalid PIN',
        description: 'Please enter your 6-digit merchant PIN',
        status: 'error',
        duration: 3000
      });
      return;
    }

    createPaymentLink.mutate({ pin });
  };

  const handleShare = async () => {
    if (paymentLink?.url) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Payment Link',
            text: `Pay ${businessName} - ${total} LYD`,
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
      foreground: colorMode === 'dark' ? '#E2E8F0' : '#1A202C'
    };
  };

  const qrColors = getQRCodeColors();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="xl"
      closeOnOverlayClick={!paymentLink}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Generate Payment Link
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {!paymentLink ? (
            <VStack spacing={4}>
              <Text>Amount: {total} LYD</Text>
              <Text>Order #{orderId}</Text>
              
              <FormControl>
                <FormLabel>Enter your merchant PIN</FormLabel>
                <HStack justify="center">
                  <PinInput 
                    otp 
                    size="lg" 
                    value={pin} 
                    onChange={setPin}
                  >
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                </HStack>
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
              
              <VStack spacing={2}>
                <Text fontWeight="bold">
                  {total} LYD
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Order #{orderId}
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
                >
                  Share
                </Button>
              </HStack>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ShopPaymentGenerator;