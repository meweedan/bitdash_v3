import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Chakra UI
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  useColorModeValue,
  Flex,
  Icon,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputLeftAddon,
  Select,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Textarea,
  Image,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Skeleton,
  SkeletonCircle,
  SlideFade,
  Tooltip,
  Stack,
  useClipboard,
} from '@chakra-ui/react';

// Chakra UI Icons
import {
  ArrowForwardIcon,
  CheckCircleIcon,
  CopyIcon,
  DownloadIcon,
  EmailIcon,
  LinkIcon,
  QuestionIcon,
  RepeatIcon,
  ViewIcon,
} from '@chakra-ui/icons';

// Framer Motion
import { motion } from 'framer-motion';

// Layout component
import Layout from '@/components/Layout';

// Mock QR code component (in a real implementation, this would use a QR code generation library)
const QRCode = ({ value, size = 200 }) => (
  <Box
    width={`${size}px`}
    height={`${size}px`}
    borderRadius="md"
    p={4}
    position="relative"
    overflow="hidden"
  >
    <Box 
      position="absolute" 
      top="10%" 
      left="10%" 
      right="10%" 
      bottom="10%" 
      borderRadius="md"
      bg="gray.200"
      backgroundImage="repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)"
    />
    <Image
      src="/images/qr-code-placeholder.png"
      alt="QR Code"
      fallback={
        <Box 
          width="100%" 
          height="100%" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          borderWidth={1}
          borderColor="gray.300"
          borderRadius="md"
        >
          <Text fontSize="sm" color="gray.500">QR Code Preview</Text>
        </Box>
      }
      objectFit="contain"
      width="100%"
      height="100%"
    />
    <Box
      position="absolute"
      bottom="15%"
      left="50%"
      transform="translateX(-50%)"
      bg="brand.cash.500"
      fontSize="xs"
      fontWeight="bold"
      px={2}
      py={1}
      borderRadius="full"
    >
      BitCash
    </Box>
  </Box>
);

// Demo steps
const steps = [
  { title: 'Sign Up', description: 'Create your merchant account' },
  { title: 'Setup', description: 'Configure your payment settings' },
  { title: 'Create', description: 'Generate payment links and QR codes' },
  { title: 'Share', description: 'Share with your customers' },
];

function MerchantDemo() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale } = router;
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // For stepper navigation
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  // Demo state
  const [businessName, setBusinessName] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(25);
  const [paymentType, setPaymentType] = useState('fixed');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLinkGenerated, setIsLinkGenerated] = useState(false);
  
  // For copy functionality
  const { hasCopied, onCopy } = useClipboard(paymentLink);

  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  // Function to generate payment link and QR code
  const generatePaymentLink = () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Create a mock payment link
      const mockId = Math.random().toString(36).substring(2, 10);
      const link = `https://cash.bitdash.app/${mockId}`;
      setPaymentLink(link);
      setIsLinkGenerated(true);
      setIsGenerating(false);
      onOpen(); // Open the success modal
    }, 1500);
  };

  // Reset form and step
  const resetDemo = () => {
    setBusinessName('');
    setPaymentAmount(25);
    setPaymentType('fixed');
    setPaymentDescription('');
    setPaymentLink('');
    setIsLinkGenerated(false);
    setActiveStep(0);
  };

  // Colors & UI
  const cardBg = useColorModeValue('white', 'gray.800');
  const accentColor = useColorModeValue('brand.cash.600', 'brand.cash.400');
  const accentBg = useColorModeValue('brand.cash.400', 'brand.cash.700');
  const softShadow = useColorModeValue('lg', 'dark-lg');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Layout>
      <Box 
        minH="80vh" 
        display="flex"
        py={6}
      >
        <Container maxW="7xl">
          <SlideFade in offsetY="20px">
            <VStack spacing={4} textAlign="center" mb={10}>
              <Heading 
                fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                color={accentColor}
              >
                {t('merchantDemo.heading', 'See How BitCash Works for Merchants')}
              </Heading>
              <Text fontSize={{ base: 'md', md: 'lg' }} maxW="800px">
                {t('merchantDemo.subheading', 'Follow this interactive demo to learn how easy it is to create payment links and QR codes for your business')}
              </Text>
            </VStack>
          </SlideFade>

          {/* Stepper */}
          <SlideFade in offsetY="30px">
            <Box 
              bg={cardBg} 
              p={{ base: 4, md: 6 }} 
              borderRadius="xl" 
              boxShadow={softShadow}
              mb={8}
            >
              <Stepper
                index={activeStep}
                colorScheme="green"
                size="lg"
                mb={8}
              >
                {steps.map((step, index) => (
                  <Step key={index} onClick={() => setActiveStep(index)} cursor="pointer">
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>
                    <Box flexShrink="0">
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription display={{ base: 'none', md: 'block' }}>{step.description}</StepDescription>
                    </Box>
                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>

              {/* Step Content */}
              <Box p={{ base: 2, md: 4 }}>
                {activeStep === 0 && (
                  <SlideFade in offsetY="20px">
                    <VStack spacing={6} align="stretch">
                      <Heading size="md" color={accentColor}>
                        {t('merchantDemo.step1.heading', 'Create Your Merchant Account')}
                      </Heading>
                      <Text>
                        {t('merchantDemo.step1.description', 'Start by setting up your merchant profile. This information will be used on your payment links and receipts.')}
                      </Text>
                      
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <VStack align="stretch" spacing={4}>
                          <FormControl>
                            <FormLabel>{t('merchantDemo.step1.form.businessName', 'Business Name')}</FormLabel>
                            <Input 
                              value={businessName}
                              onChange={(e) => setBusinessName(e.target.value)}
                              placeholder="Your Business Name"
                            />
                            <FormHelperText>
                              {t('merchantDemo.step1.form.businessNameHelp', 'This will appear on payment links and receipts')}
                            </FormHelperText>
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel>{t('merchantDemo.step1.form.email', 'Email Address')}</FormLabel>
                            <Input 
                              placeholder="yourname@business.com"
                              defaultValue="demo@example.com"
                              isReadOnly
                            />
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel>{t('merchantDemo.step1.form.phone', 'Business Phone')}</FormLabel>
                            <Input 
                              placeholder="+1 (555) 123-4567"
                              defaultValue="+1 (555) 123-4567"
                              isReadOnly
                            />
                          </FormControl>
                        </VStack>
                        
                        <Box
                          p={5}
                          bg={accentBg}
                          borderRadius="md"
                          borderLeft="4px solid"
                          borderColor={accentColor}
                        >
                          <Heading size="sm" mb={4}>
                            {t('merchantDemo.step1.benefits.heading', 'Merchant Benefits')}
                          </Heading>
                          <VStack align="start" spacing={3}>
                            <HStack>
                              <CheckCircleIcon color="green.500" />
                              <Text fontSize="sm">{t('merchantDemo.step1.benefits.benefit1', 'Accept payments online and in-person')}</Text>
                            </HStack>
                            <HStack>
                              <CheckCircleIcon color="green.500" />
                              <Text fontSize="sm">{t('merchantDemo.step1.benefits.benefit2', 'Get paid instantly to your BitCash wallet')}</Text>
                            </HStack>
                            <HStack>
                              <CheckCircleIcon color="green.500" />
                              <Text fontSize="sm">{t('merchantDemo.step1.benefits.benefit3', 'Low transaction fees (1.5%)')}</Text>
                            </HStack>
                            <HStack>
                              <CheckCircleIcon color="green.500" />
                              <Text fontSize="sm">{t('merchantDemo.step1.benefits.benefit4', 'Withdraw funds anytime to your bank or as cash')}</Text>
                            </HStack>
                            <HStack>
                              <CheckCircleIcon color="green.500" />
                              <Text fontSize="sm">{t('merchantDemo.step1.benefits.benefit5', 'Comprehensive sales dashboard and analytics')}</Text>
                            </HStack>
                          </VStack>
                        </Box>
                      </SimpleGrid>
                      
                      <Flex justify="flex-end" mt={4}>
                        <Button
                          rightIcon={<ArrowForwardIcon />}
                          colorScheme="green"
                          onClick={() => setActiveStep(1)}
                          isDisabled={!businessName.trim()}
                        >
                          {t('merchantDemo.common.nextButton', 'Next Step')}
                        </Button>
                      </Flex>
                    </VStack>
                  </SlideFade>
                )}

                {activeStep === 1 && (
                  <SlideFade in offsetY="20px">
                    <VStack spacing={6} align="stretch">
                      <Heading size="md" color={accentColor}>
                        {t('merchantDemo.step2.heading', 'Configure Payment Settings')}
                      </Heading>
                      <Text>
                        {t('merchantDemo.step2.description', 'Set up your payment preferences and default settings. These can be customized for each payment link you create.')}
                      </Text>
                      
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <VStack align="stretch" spacing={4}>
                          <FormControl>
                            <FormLabel>{t('merchantDemo.step2.form.currency', 'Default Currency')}</FormLabel>
                            <Select defaultValue="USD">
                              <option value="LYD">LYD - Libyan Dinar</option>
                              <option value="USD">USD - US Dollar</option>
                            </Select>
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel>{t('merchantDemo.step2.form.paymentMethods', 'Accepted Payment Methods')}</FormLabel>
                            <VStack align="start" spacing={2} pl={4}>
                              <HStack>
                                <CheckCircleIcon color="green.500" />
                                <Text>BitCash Balance</Text>
                              </HStack>
                              <HStack>
                                <CheckCircleIcon color="green.500" />
                                <Text>Debit/Credit Card</Text>
                              </HStack>
                              <HStack>
                                <CheckCircleIcon color="green.500" />
                                <Text>Bank Transfer</Text>
                              </HStack>
                            </VStack>
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel>{t('merchantDemo.step2.form.settlement', 'Settlement Preference')}</FormLabel>
                            <Select defaultValue="instant">
                              <option value="instant">Instant to BitCash Wallet</option>
                              <option value="daily">Daily to Bank Account</option>
                              <option value="weekly">Weekly to Bank Account</option>
                            </Select>
                            <FormHelperText>
                              {t('merchantDemo.step2.form.settlementHelp', 'How you want to receive your funds')}
                            </FormHelperText>
                          </FormControl>
                        </VStack>
                        
                        <Box p={5} borderRadius="md" borderWidth={1} borderColor={borderColor}>
                          <Heading size="sm" mb={4}>
                            {t('merchantDemo.step2.preview.heading', 'Merchant Dashboard Preview')}
                          </Heading>
                          <Box borderRadius="md" overflow="hidden" boxShadow="sm">
                            <Box bg="gray.100" p={3} borderBottomWidth={1} borderColor={borderColor}>
                              <Text fontWeight="bold">{businessName || 'Your Business'} Dashboard</Text>
                            </Box>
                            <SimpleGrid columns={2} spacing={4} p={4} bg="white">
                              <VStack align="start" spacing={1}>
                                <Text fontSize="xs" color="gray.500">Today's Sales</Text>
                                <Text fontWeight="bold">$0.00</Text>
                              </VStack>
                              <VStack align="start" spacing={1}>
                                <Text fontSize="xs" color="gray.500">Available Balance</Text>
                                <Text fontWeight="bold">$0.00</Text>
                              </VStack>
                              <VStack align="start" spacing={1}>
                                <Text fontSize="xs" color="gray.500">Active Payment Links</Text>
                                <Text fontWeight="bold">0</Text>
                              </VStack>
                              <VStack align="start" spacing={1}>
                                <Text fontSize="xs" color="gray.500">Pending Settlements</Text>
                                <Text fontWeight="bold">$0.00</Text>
                              </VStack>
                            </SimpleGrid>
                          </Box>
                        </Box>
                      </SimpleGrid>
                      
                      <Flex justify="space-between" mt={4}>
                        <Button
                          leftIcon={<ArrowForwardIcon transform="rotate(180deg)" />}
                          variant="outline"
                          onClick={() => setActiveStep(0)}
                        >
                          {t('merchantDemo.common.backButton', 'Back')}
                        </Button>
                        <Button
                          rightIcon={<ArrowForwardIcon />}
                          colorScheme="green"
                          onClick={() => setActiveStep(2)}
                        >
                          {t('merchantDemo.common.nextButton', 'Next Step')}
                        </Button>
                      </Flex>
                    </VStack>
                  </SlideFade>
                )}

                {activeStep === 2 && (
                  <SlideFade in offsetY="20px">
                    <VStack spacing={6} align="stretch">
                      <Heading size="md" color={accentColor}>
                        {t('merchantDemo.step3.heading', 'Create Payment Link & QR Code')}
                      </Heading>
                      <Text>
                        {t('merchantDemo.step3.description', 'Generate a customized payment link and QR code that you can share with your customers via email, message, or display in your store.')}
                      </Text>
                      
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <VStack align="stretch" spacing={4}>
                          <FormControl>
                            <FormLabel>{t('merchantDemo.step3.form.type', 'Payment Type')}</FormLabel>
                            <Select 
                              value={paymentType}
                              onChange={(e) => setPaymentType(e.target.value)}
                            >
                              <option value="fixed">{t('merchantDemo.step3.form.typeFixed', 'Fixed Amount')}</option>
                              <option value="variable">{t('merchantDemo.step3.form.typeVariable', 'Customer Enters Amount')}</option>
                            </Select>
                          </FormControl>
                          
                          {paymentType === 'fixed' && (
                            <FormControl>
                              <FormLabel>{t('merchantDemo.step3.form.amount', 'Payment Amount')}</FormLabel>
                              <InputGroup>
                                <InputLeftAddon>$</InputLeftAddon>
                                <NumberInput
                                  value={paymentAmount}
                                  onChange={(valueString) => setPaymentAmount(parseFloat(valueString))}
                                  min={1}
                                  max={10000}
                                  precision={2}
                                  width="100%"
                                >
                                  <NumberInputField borderLeftRadius={0} />
                                  <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                  </NumberInputStepper>
                                </NumberInput>
                              </InputGroup>
                            </FormControl>
                          )}
                          
                          <FormControl>
                            <FormLabel>{t('merchantDemo.step3.form.description', 'Payment Description')}</FormLabel>
                            <Textarea
                              value={paymentDescription}
                              onChange={(e) => setPaymentDescription(e.target.value)}
                              placeholder="Enter a description for this payment"
                              rows={3}
                            />
                            <FormHelperText>
                              {t('merchantDemo.step3.form.descriptionHelp', 'This will appear on the payment page and receipt')}
                            </FormHelperText>
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel>{t('merchantDemo.step3.form.expiry', 'Expiration')}</FormLabel>
                            <Select defaultValue="never">
                              <option value="never">{t('merchantDemo.step3.form.expiryNever', 'Never expires')}</option>
                              <option value="24h">{t('merchantDemo.step3.form.expiry24h', '24 hours')}</option>
                              <option value="7d">{t('merchantDemo.step3.form.expiry7d', '7 days')}</option>
                              <option value="30d">{t('merchantDemo.step3.form.expiry30d', '30 days')}</option>
                              <option value="custom">{t('merchantDemo.step3.form.expiryCustom', 'Custom date')}</option>
                            </Select>
                          </FormControl>
                          
                          <Button
                            mt={2}
                            colorScheme="green"
                            width="full"
                            onClick={generatePaymentLink}
                            isLoading={isGenerating}
                            loadingText={t('merchantDemo.step3.form.generating', 'Generating...')}
                            isDisabled={isLinkGenerated}
                          >
                            {t('merchantDemo.step3.form.generateButton', 'Generate Payment Link & QR Code')}
                          </Button>
                        </VStack>
                        
                        <VStack
                          spacing={4}
                          p={5}
                          bg={accentBg}
                          borderRadius="md"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {isLinkGenerated ? (
                            <QRCode value={paymentLink} size={200} />
                          ) : (
                            <Box
                              width="200px"
                              height="200px"
                              borderWidth={2}
                              borderStyle="dashed"
                              borderColor="gray.300"
                              borderRadius="md"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <VStack>
                                <QuestionIcon boxSize={10} color="gray.400" />
                                <Text textAlign="center" fontSize="sm" color="gray.500" px={4}>
                                  {t('merchantDemo.step3.preview.placeholder', 'Your QR code will appear here')}
                                </Text>
                              </VStack>
                            </Box>
                          )}
                          
                          {isLinkGenerated && (
                            <VStack spacing={2} width="100%">
                              <Text fontWeight="bold">{t('merchantDemo.step3.preview.link', 'Payment Link:')}</Text>
                              <HStack
                                p={2}
                                borderRadius="md"
                                borderWidth={1}
                                borderColor={borderColor}
                                width="100%"
                                justifyContent="space-between"
                              >
                                <Text fontSize="sm" isTruncated maxW="70%">
                                  {paymentLink}
                                </Text>
                                <Tooltip
                                  label={hasCopied ? t('merchantDemo.step3.preview.copied', 'Copied!') : t('merchantDemo.step3.preview.copy', 'Copy')}
                                  closeOnClick={false}
                                >
                                  <Button size="sm" onClick={onCopy} variant="ghost">
                                    <CopyIcon />
                                  </Button>
                                </Tooltip>
                              </HStack>
                              <Text fontSize="sm" textAlign="center">
                                {paymentType === 'fixed' ? (
                                  t('merchantDemo.step3.preview.fixedAmount', 'Fixed amount: ${{amount}}', { amount: paymentAmount.toFixed(2) })
                                ) : (
                                  t('merchantDemo.step3.preview.variableAmount', 'Customer will enter amount')
                                )}
                              </Text>
                            </VStack>
                          )}
                        </VStack>
                      </SimpleGrid>
                      
                      <Flex justify="space-between" mt={4}>
                        <Button
                          leftIcon={<ArrowForwardIcon transform="rotate(180deg)" />}
                          variant="outline"
                          onClick={() => setActiveStep(1)}
                        >
                          {t('merchantDemo.common.backButton', 'Back')}
                        </Button>
                        <Button
                          rightIcon={<ArrowForwardIcon />}
                          colorScheme="green"
                          onClick={() => setActiveStep(3)}
                          isDisabled={!isLinkGenerated}
                        >
                          {t('merchantDemo.common.nextButton', 'Next Step')}
                        </Button>
                      </Flex>
                    </VStack>
                  </SlideFade>
                )}

                {activeStep === 3 && (
                  <SlideFade in offsetY="20px">
                    <VStack spacing={6} align="stretch">
                      <Heading size="md" color={accentColor}>
                        {t('merchantDemo.step4.heading', 'Share Your Payment Link & QR Code')}
                      </Heading>
                      <Text>
                        {t('merchantDemo.step4.description', 'Your payment link and QR code are ready to use! Share them with your customers through various channels.')}
                      </Text>
                      
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <VStack spacing={4} align="stretch">
                          <Heading size="sm" mb={2}>
                            {t('merchantDemo.step4.sharing.heading', 'Sharing Options')}
                          </Heading>
                          
                          <Button
                            leftIcon={<EmailIcon />}
                            colorScheme="blue"
                            width="full"
                            variant="outline"
                          >
                            {t('merchantDemo.step4.sharing.email', 'Share via Email')}
                          </Button>
                          
                          <Button
                            leftIcon={<DownloadIcon />}
                            colorScheme="purple"
                            width="full"
                            variant="outline"
                          >
                            {t('merchantDemo.step4.sharing.download', 'Download QR Code')}
                          </Button>
                          
                          <Button
                            leftIcon={<LinkIcon />}
                            colorScheme="orange"
                            width="full"
                            variant="outline"
                            onClick={onCopy}
                          >
                            {hasCopied ? t('merchantDemo.step4.sharing.copied', 'Link Copied!') : t('merchantDemo.step4.sharing.copy', 'Copy Payment Link')}
                          </Button>
                          
                          <Box
                            p={4}
                            bg={accentBg}
                            borderRadius="md"
                            borderLeft="4px solid"
                            borderColor={accentColor}
                            mt={4}
                          >
                            <Heading size="sm" mb={3}>
                              {t('merchantDemo.step4.tips.heading', 'Tips for Using Payment Links')}
                            </Heading>
                            <VStack align="start" spacing={2}>
                              <HStack>
                                <CheckCircleIcon color="green.500" />
                                <Text fontSize="sm">{t('merchantDemo.step4.tips.tip1', 'Add to your website or social media profiles')}</Text>
                              </HStack>
                              <HStack>
                                <CheckCircleIcon color="green.500" />
                                <Text fontSize="sm">{t('merchantDemo.step4.tips.tip2', 'Print QR code for in-store displays')}</Text>
                              </HStack>
                              <HStack>
                                <CheckCircleIcon color="green.500" />
                                <Text fontSize="sm">{t('merchantDemo.step4.tips.tip3', 'Include in digital invoices or quotes')}</Text>
                              </HStack>
                              <HStack>
                                <CheckCircleIcon color="green.500" />
                                <Text fontSize="sm">{t('merchantDemo.step4.tips.tip4', 'Create different links for different products/services')}</Text>
                              </HStack>
                            </VStack>
                          </Box>
                        </VStack>
                        
                        <VStack spacing={4} align="center">
                          <Heading size="sm" mb={2}>
                            {t('merchantDemo.step4.preview.heading', 'Customer Payment Experience')}
                          </Heading>
                          
                          <Box
                            width="100%"
                            maxW="300px"
                            borderRadius="lg"
                            overflow="hidden"
                            boxShadow="md"
                            borderWidth={1}
                            borderColor={borderColor}
                          >
                            <Box bg="brand.cash.500" p={3}>
                              <Text fontWeight="bold" textAlign="center">BitCash Payment</Text>
                            </Box>
                            <VStack p={4} spacing={4}>
                              <Text fontWeight="bold" textAlign="center">{businessName || 'Your Business'}</Text>
                              {paymentType === 'fixed' && (
                                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                                  ${paymentAmount.toFixed(2)}
                                </Text>
                              )}
                              {paymentDescription && (
                                <Text fontSize="sm" textAlign="center">{paymentDescription}</Text>
                              )}
                              <Button colorScheme="green" width="full">
                                {t('merchantDemo.step4.preview.payButton', 'Pay Now')}
                              </Button>
                              <Text fontSize="xs" color="gray.500" textAlign="center">
                                {t('merchantDemo.step4.preview.secureNote', 'Secure payment powered by BitCash')}
                              </Text>
                            </VStack>
                          </Box>
                          
                          <Text fontSize="sm" fontStyle="italic" textAlign="center" mt={4}>
                            {t('merchantDemo.step4.preview.message', 'This is what your customers will see when they scan the QR code or click the payment link.')}
                            </Text>
                          </VStack>
                        </SimpleGrid>
                        
                        <Flex justify="space-between" mt={4}>
                          <Button
                            leftIcon={<ArrowForwardIcon transform="rotate(180deg)" />}
                            variant="bitcash-outline"
                            onClick={() => setActiveStep(2)}
                          >
                            {t('merchantDemo.common.backButton', 'Back')}
                          </Button>
                          <Button
                            leftIcon={<RepeatIcon />}
                            color="brand.cash.400"
                            onClick={resetDemo}
                          >
                            {t('merchantDemo.step4.restartButton', 'Restart Demo')}
                          </Button>
                        </Flex>
                      </VStack>
                    </SlideFade>
                  )}
                </Box>
              </Box>
            </SlideFade>

            {/* Additional Information */}
            <SlideFade in offsetY="30px">
              <Box 
                bg={cardBg} 
                p={{ base: 6, md: 8 }} 
                borderRadius="xl" 
                boxShadow={softShadow}
                mb={8}
              >
                <Tabs isFitted colorScheme="green" variant="enclosed">
                  <TabList>
                    <Tab>{t('merchantDemo.info.tabs.benefits', 'Benefits')}</Tab>
                    <Tab>{t('merchantDemo.info.tabs.features', 'Features')}</Tab>
                    <Tab>{t('merchantDemo.info.tabs.faq', 'FAQ')}</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                        <Box 
                          p={5} 
                          bg={accentBg} 
                          borderRadius="lg"
                          borderLeft="4px solid"
                          borderColor={accentColor}
                        >
                          <Heading size="md" mb={3}>
                            {t('merchantDemo.info.benefits.benefit1.title', 'Fast Payments')}
                          </Heading>
                          <Text fontSize="sm">
                            {t('merchantDemo.info.benefits.benefit1.description', 'Receive payments instantly in your BitCash wallet, with no processing delays or pending periods.')}
                          </Text>
                        </Box>
                        
                        <Box 
                          p={5} 
                          bg={accentBg} 
                          borderRadius="lg"
                          borderLeft="4px solid"
                          borderColor={accentColor}
                        >
                          <Heading size="md" mb={3}>
                            {t('merchantDemo.info.benefits.benefit2.title', 'Lower Fees')}
                          </Heading>
                          <Text fontSize="sm">
                            {t('merchantDemo.info.benefits.benefit2.description', 'Save money with our competitive 1.5% transaction fee, significantly lower than traditional payment processors.')}
                          </Text>
                        </Box>
                        
                        <Box 
                          p={5} 
                          bg={accentBg} 
                          borderRadius="lg"
                          borderLeft="4px solid"
                          borderColor={accentColor}
                        >
                          <Heading size="md" mb={3}>
                            {t('merchantDemo.info.benefits.benefit3.title', 'Flexible Cash-Out')}
                          </Heading>
                          <Text fontSize="sm">
                            {t('merchantDemo.info.benefits.benefit3.description', 'Withdraw your funds to your bank account or collect cash at any agent location when you need it.')}
                          </Text>
                        </Box>
                      </SimpleGrid>
                    </TabPanel>
                    
                    <TabPanel>
                      <VStack spacing={6} align="stretch">
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                          <HStack align="start" spacing={4}>
                            <Box
                              p={2}
                              bg="brand.cash.400"
                              color="brand.cash.500"
                              borderRadius="md"
                            >
                              <LinkIcon boxSize={5} />
                            </Box>
                            <Box>
                              <Heading size="sm" mb={1}>
                                {t('merchantDemo.info.features.feature1.title', 'Unlimited Payment Links')}
                              </Heading>
                              <Text fontSize="sm">
                                {t('merchantDemo.info.features.feature1.description', 'Create as many payment links as you need for different products, services, or events.')}
                              </Text>
                            </Box>
                          </HStack>
                          
                          <HStack align="start" spacing={4}>
                            <Box
                              p={2}
                              bg="brand.cash.400"
                              color="brand.cash.500"
                              borderRadius="md"
                            >
                              <ViewIcon boxSize={5} />
                            </Box>
                            <Box>
                              <Heading size="sm" mb={1}>
                                {t('merchantDemo.info.features.feature2.title', 'Analytics Dashboard')}
                              </Heading>
                              <Text fontSize="sm">
                                {t('merchantDemo.info.features.feature2.description', 'Track all your payments, view customer insights, and download reports for accounting.')}
                              </Text>
                            </Box>
                          </HStack>
                          
                          <HStack align="start" spacing={4}>
                            <Box
                              p={2}
                              bg="brand.cash.400"
                              color="brand.cash.500"
                              borderRadius="md"
                            >
                              <EmailIcon boxSize={5} />
                            </Box>
                            <Box>
                              <Heading size="sm" mb={1}>
                                {t('merchantDemo.info.features.feature3.title', 'Automated Receipts')}
                              </Heading>
                              <Text fontSize="sm">
                                {t('merchantDemo.info.features.feature3.description', 'Customers automatically receive digital receipts for every transaction via email or SMS.')}
                              </Text>
                            </Box>
                          </HStack>
                          
                          <HStack align="start" spacing={4}>
                            <Box
                              p={2}
                              bg="brand.cash.400"
                              color="brand.cash.500"
                              borderRadius="md"
                            >
                              <CheckCircleIcon boxSize={5} />
                            </Box>
                            <Box>
                              <Heading size="sm" mb={1}>
                                {t('merchantDemo.info.features.feature4.title', 'Secure Platform')}
                              </Heading>
                              <Text fontSize="sm">
                                {t('merchantDemo.info.features.feature4.description', 'Enterprise-grade security with blockchain verification and encryption for all transactions.')}
                              </Text>
                            </Box>
                          </HStack>
                        </SimpleGrid>
                      </VStack>
                    </TabPanel>
                    
                    <TabPanel>
                      <Accordion allowToggle>
                        <AccordionItem mb={3} border="none" borderRadius="md" overflow="hidden" boxShadow="sm">
                          <h2>
                            <AccordionButton bg={accentBg} _expanded={{ bg: accentColor, color: 'white' }}>
                              <Box flex="1" textAlign="left" py={1}>
                                {t('merchantDemo.info.faq.q1', 'How quickly will I receive funds?')}
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel>
                            {t('merchantDemo.info.faq.a1', 'All payments are settled instantly to your BitCash wallet. You can withdraw funds to your bank account (1-2 business days) or collect cash immediately at any BitCash agent location.')}
                          </AccordionPanel>
                        </AccordionItem>
                        
                        <AccordionItem mb={3} border="none" borderRadius="md" overflow="hidden" boxShadow="sm">
                          <h2>
                            <AccordionButton bg={accentBg} _expanded={{ bg: accentColor, color: 'white' }}>
                              <Box flex="1" textAlign="left" py={1}>
                                {t('merchantDemo.info.faq.q2', 'Are there any monthly fees?')}
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel>
                            {t('merchantDemo.info.faq.a2', 'No, BitCash does not charge any monthly fees, setup fees, or hidden costs. You only pay a 1.5% transaction fee when you receive a payment.')}
                          </AccordionPanel>
                        </AccordionItem>
                        
                        <AccordionItem mb={3} border="none" borderRadius="md" overflow="hidden" boxShadow="sm">
                          <h2>
                            <AccordionButton bg={accentBg} _expanded={{ bg: accentColor, color: 'white' }}>
                              <Box flex="1" textAlign="left" py={1}>
                                {t('merchantDemo.info.faq.q3', 'Can I issue refunds to customers?')}
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel>
                            {t('merchantDemo.info.faq.a3', 'Yes, you can issue full or partial refunds directly from your merchant dashboard for up to 90 days after the transaction.')}
                          </AccordionPanel>
                        </AccordionItem>
                        
                        <AccordionItem mb={3} border="none" borderRadius="md" overflow="hidden" boxShadow="sm">
                          <h2>
                            <AccordionButton bg={accentBg} _expanded={{ bg: accentColor, color: 'white' }}>
                              <Box flex="1" textAlign="left" py={1}>
                                {t('merchantDemo.info.faq.q4', 'Do you offer API integration for my website or app?')}
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel>
                            {t('merchantDemo.info.faq.a4', 'Yes, BitCash offers a robust API with documentation and SDKs for major programming languages. Our team can also assist with integration if needed.')}
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </SlideFade>

            {/* CTA Section */}
            <SlideFade in offsetY="30px">
              <Box 
                bg="brand.cash.400" 
                p={{ base: 6, md: 10 }} 
                borderRadius="xl" 
                boxShadow={softShadow}
                mb={8}
                textAlign="center"
              >
                <Heading size="lg" mb={4}>
                  {t('merchantDemo.cta.heading', 'Ready to Start Accepting Payments?')}
                </Heading>
                <Text maxW="2xl" mx="auto" mb={6}>
                  {t('merchantDemo.cta.description', 'Join thousands of businesses using BitCash to accept payments, increase sales, and simplify financial management.')}
                </Text>
                
                <HStack spacing={4} justifyContent="center">
                  <Button 
                    variant="bitcash-solid" 
                    size="lg"
                    onClick={() => router.push('/signup/merchant')}
                    rightIcon={<ArrowForwardIcon />}
                  >
                    {t('merchantDemo.cta.signupButton', 'Sign Up as Merchant')}
                  </Button>
                  
                  <Button 
                    variant="bitcash-solid" 
                    size="lg"
                    onClick={() => router.push('/merchants')}
                  >
                    {t('merchantDemo.cta.learnButton', 'Learn More')}
                  </Button>
                </HStack>
              </Box>
            </SlideFade>
            
            <Flex justifyContent="center">
              <Button 
                variant="link" 
                color={accentColor}
                onClick={() => router.push('/merchants')}
              >
                {t('merchantDemo.backButton', 'Back to Merchant Information')}
              </Button>
            </Flex>
          </Container>
        </Box>

        {/* Success Modal for link generation */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader bg="green.500" borderTopRadius="md">
              {t('merchantDemo.modal.heading', 'Payment Link Created!')}
            </ModalHeader>
            <ModalCloseButton/>
            <ModalBody py={6}>
              <VStack spacing={4}>
                <CheckCircleIcon boxSize={12} color="green.500" />
                <Text fontWeight="bold">
                  {t('merchantDemo.modal.success', 'Your payment link and QR code have been generated successfully.')}
                </Text>
                <Text>
                  {t('merchantDemo.modal.description', 'You can now share this with your customers via email, social media, or by displaying the QR code in your store.')}
                </Text>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="green" mr={3} onClick={onClose}>
                {t('merchantDemo.modal.continueButton', 'Continue')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Layout>
    );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default MerchantDemo;