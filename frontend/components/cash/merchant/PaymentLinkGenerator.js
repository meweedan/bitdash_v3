// components/pay/merchant/PaymentLinkGenerator.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  Text, 
  Button, 
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Flex,
  useColorMode,
  HStack,
  IconButton,
  useClipboard,
  Select,
  Switch,
  InputGroup,
  InputRightElement,
  InputLeftAddon,
  Divider,
  useBreakpointValue,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  Badge,
  Image,
  Collapse
} from "@chakra-ui/react";
import { QRCodeCanvas } from "qrcode.react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FiCopy, 
  FiShare2, 
  FiSun, 
  FiMoon, 
  FiCheck,
  FiX,
  FiClock,
  FiAlertCircle,
  FiLock,
  FiUnlock,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

const PaymentLinkGenerator = ({ 
  merchantData,
  isOpen,
  onClose,
  currency = 'LYD'
}) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    pin: '',
    description: '',
    expiry: '24', // hours
    paymentType: 'fixed',
    requirePin: true,
    allowPartial: false,
    minAmount: '',
    maxAmount: '',
  });
  
  const [errors, setErrors] = useState({});
  const [showPin, setShowPin] = useState(false);
  const [generatedLink, setGeneratedLink] = useState(null);
  const [isQRDarkMode, setIsQRDarkMode] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        amount: '',
        pin: '',
        description: '',
        expiry: '24',
        paymentType: 'fixed',
        requirePin: true,
        allowPartial: false,
        minAmount: '',
        maxAmount: '',
      });
      setGeneratedLink(null);
      setErrors({});
    }
  }, [isOpen]);

  // Create payment link mutation
  const createLinkMutation = useMutation({
    mutationFn: async (data) => {
      if (!merchantData?.id) {
        throw new Error('Invalid merchant data');
      }

      // Generate unique link ID
      const linkId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
      
      // Calculate expiry date
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + parseInt(data.expiry));

      const payload = {
        data: {
          amount: data.paymentType === 'fixed' ? parseFloat(data.amount) : null,
          currency,
          description: data.description,
          merchant: merchantData.id,
          status: 'active',
          payment_type: data.paymentType,
          pin: data.requirePin ? data.pin : null,
          link_id: linkId,
          expiry: expiry.toISOString(),
          metadata: {
            businessName: merchantData.attributes?.businessName,
            merchantId: merchantData.id,
            minAmount: data.paymentType === 'variable' ? parseFloat(data.minAmount) : null,
            maxAmount: data.paymentType === 'variable' ? parseFloat(data.maxAmount) : null,
            allowPartial: data.allowPartial,
            requirePin: data.requirePin,
            createdAt: new Date().toISOString()
          }
        }
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment-links`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create payment link');
      }

      const responseData = await response.json();
      const baseUrl = 'https://cash.bitdash.app';
      const businessPath = merchantData.attributes?.businessName?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'pay';
      
      return {
        ...responseData.data,
        url: `${baseUrl}/${businessPath}/${linkId}`
      };
    },
    onSuccess: (data) => {
      setGeneratedLink(data);
      queryClient.invalidateQueries(['payment-links']);
      toast({
        title: 'Payment Link Created',
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

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (formData.paymentType === 'fixed') {
      if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
        newErrors.amount = 'Please enter a valid amount';
      }
    } else {
      if (!formData.minAmount || isNaN(formData.minAmount) || parseFloat(formData.minAmount) <= 0) {
        newErrors.minAmount = 'Please enter a valid minimum amount';
      }
      if (!formData.maxAmount || isNaN(formData.maxAmount) || parseFloat(formData.maxAmount) <= parseFloat(formData.minAmount)) {
        newErrors.maxAmount = 'Maximum amount must be greater than minimum';
      }
    }

    if (formData.requirePin) {
      if (!formData.pin || formData.pin.length !== 6 || isNaN(formData.pin)) {
        newErrors.pin = 'PIN must be 6 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      createLinkMutation.mutate(formData);
    }
  };

  // Share functionality
  const handleShare = async () => {
    if (generatedLink?.url) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Payment Link',
            text: `Payment request for ${formData.amount} ${currency}`,
            url: generatedLink.url
          });
        } catch (error) {
          console.error('Share failed:', error);
        }
      } else {
        navigator.clipboard.writeText(generatedLink.url);
        toast({
          title: 'Link copied to clipboard',
          status: 'success',
          duration: 2000
        });
      }
    }
  };

  // Handle copying link
  const { hasCopied, onCopy } = useClipboard(generatedLink?.url || '');

  // QR code colors based on mode
  const qrColors = isQRDarkMode ? {
    background: colorMode === 'dark' ? '#1A202C' : '#000000',
    foreground: colorMode === 'dark' ? '#E2E8F0' : '#FFFFFF'
  } : {
    background: colorMode === 'dark' ? '#2D3748' : '#FFFFFF',
    foreground: '#1179BE'
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size={isMobile ? "full" : "xl"}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text 
            bgGradient="linear(to-r, blue.400, blue.600)"
            bgClip="text"
            fontWeight="bold"
          >
            Create Payment Link
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          {!generatedLink ? (
            <Tabs variant="enclosed">
              <TabList>
                <Tab>Basic</Tab>
                <Tab>Advanced</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <VStack spacing={4}>
                    {/* Payment Type Selection */}
                    <FormControl>
                      <FormLabel>Payment Type</FormLabel>
                      <Select
                        value={formData.paymentType}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          paymentType: e.target.value
                        }))}
                      >
                        <option value="fixed">Fixed Amount</option>
                        <option value="variable">Variable Amount</option>
                      </Select>
                    </FormControl>

                    {/* Amount Input(s) */}
                    {formData.paymentType === 'fixed' ? (
                      <FormControl isInvalid={!!errors.amount}>
                        <FormLabel>Amount ({currency})</FormLabel>
                        <InputGroup>
                          <InputLeftAddon>{currency}</InputLeftAddon>
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            value={formData.amount}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              amount: e.target.value
                            }))}
                          />
                        </InputGroup>
                        <FormErrorMessage>{errors.amount}</FormErrorMessage>
                      </FormControl>
                    ) : (
                      <HStack spacing={4}>
                        <FormControl isInvalid={!!errors.minAmount}>
                          <FormLabel>Minimum Amount</FormLabel>
                          <InputGroup>
                            <InputLeftAddon>{currency}</InputLeftAddon>
                            <Input
                              type="number"
                              placeholder="Min"
                              value={formData.minAmount}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                minAmount: e.target.value
                              }))}
                            />
                          </InputGroup>
                          <FormErrorMessage>{errors.minAmount}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.maxAmount}>
                          <FormLabel>Maximum Amount</FormLabel>
                          <InputGroup>
                            <InputLeftAddon>{currency}</InputLeftAddon>
                            <Input
                              type="number"
                              placeholder="Max"
                              value={formData.maxAmount}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                maxAmount: e.target.value
                              }))}
                            />
                          </InputGroup>
                          <FormErrorMessage>{errors.maxAmount}</FormErrorMessage>
                        </FormControl>
                      </HStack>
                    )}

                    {/* Description */}
                    <FormControl>
                      <FormLabel>Description (Optional)</FormLabel>
                      <Input
                        placeholder="Enter description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          description: e.target.value
                        }))}
                      />
                    </FormControl>

                    {/* PIN Input */}
                    <FormControl isInvalid={!!errors.pin}>
                      <FormLabel>Merchant PIN</FormLabel>
                      <InputGroup>
                        <Input
                          type={showPin ? "text" : "password"}
                          placeholder="Enter 6-digit PIN"
                          value={formData.pin}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            pin: e.target.value
                          }))}
                          maxLength={6}
                        />
                        <InputRightElement>
                          <IconButton
                            icon={showPin ? <FiEyeOff /> : <FiEye />}
                            variant="ghost"
                            onClick={() => setShowPin(!showPin)}
                            size="sm"
                          />
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>{errors.pin}</FormErrorMessage>
                    </FormControl>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={4}>
                    {/* Expiry Time */}
                    <FormControl>
                      <FormLabel>Link Expiry</FormLabel>
                      <Select
                        value={formData.expiry}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          expiry: e.target.value
                        }))}
                      >
                        <option value="1">1 hour</option>
                        <option value="24">24 hours</option>
                        <option value="72">3 days</option>
                        <option value="168">7 days</option>
                      </Select>
                    </FormControl>

                    {/* Security Options */}
                    <FormControl>
                      <FormLabel>Security Options</FormLabel>
                      <VStack align="start">
                        <HStack>
                          <Switch
                            isChecked={formData.requirePin}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              requirePin: e.target.checked
                            }))}
                          />
                          <Text>Require PIN for payment</Text>
                        </HStack>
                        
                        {formData.paymentType === 'fixed' && (
                          <HStack>
                            <Switch
                              isChecked={formData.allowPartial}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                allowPartial: e.target.checked
                              }))}
                            />
                            <Text>Allow partial payments</Text>
                          </HStack>
                        )}
                      </VStack>
                    </FormControl>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          ) : (
            <VStack spacing={6} align="center">
              <Box 
                p={4} 
                borderWidth={2} 
                borderRadius="xl" 
                borderColor={colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200'}
                boxShadow="lg"
              >
                <QRCodeCanvas
                  value={generatedLink.url}
                  size={250}
                  level="H"
                  bgColor={qrColors.background}
                  fgColor={qrColors.foreground}
                  style={{
                    borderRadius: '16px',
                    padding: '8px'
                  }}
                  includeMargin
                />
              </Box>

              <VStack spacing={3} align="center">
                <Badge 
                  colorScheme="green" 
                  fontSize="md" 
                  px={3} 
                  py={1} 
                  borderRadius="full"
                >
                  Link Active
                </Badge>

                {formData.paymentType === 'fixed' ? (
                  <Text fontSize="2xl" fontWeight="bold">
                    {parseFloat(formData.amount).toLocaleString()} {currency}
                  </Text>
                ) : (
                  <Text fontSize="lg" color="gray.500">
                    {formData.minAmount} - {formData.maxAmount} {currency}
                  </Text>
                )}

                {formData.description && (
                  <Text color="gray.500" textAlign="center">
                    {formData.description}
                  </Text>
                )}

                <Text fontSize="sm" color="gray.500">
                  Expires in {formData.expiry} hours
                </Text>

                <Box
                  p={3}
                  bg={colorMode === 'dark' ? 'gray.700' : 'gray.50'}
                  borderRadius="lg"
                  w="full"
                  maxW="300px"
                >
                  <Text fontSize="sm" isTruncated>
                    {generatedLink.url}
                  </Text>
                </Box>

                <HStack spacing={4} mt={2}>
                  <IconButton
                    icon={isQRDarkMode ? <FiSun /> : <FiMoon />}
                    onClick={() => setIsQRDarkMode(!isQRDarkMode)}
                    variant="outline"
                    aria-label="Toggle QR Theme"
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
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          {!generatedLink ? (
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isLoading={createLinkMutation.isLoading}
                leftIcon={<FiLock />}
              >
                Generate Secure Link
              </Button>
            </HStack>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => {
                setGeneratedLink(null);
                setFormData({
                  amount: '',
                  pin: '',
                  description: '',
                  expiry: '24',
                  paymentType: 'fixed',
                  requirePin: true,
                  allowPartial: false,
                  minAmount: '',
                  maxAmount: '',
                });
              }}
              w="full"
            >
              Create Another Link
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentLinkGenerator;