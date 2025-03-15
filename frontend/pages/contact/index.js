import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Container,
  Heading, 
  VStack, 
  HStack,
  Text,
  Input, 
  Textarea, 
  Button, 
  FormControl,
  FormLabel,
  Select,
  useToast,
  useColorMode,
  FormErrorMessage,
  IconButton,
  SimpleGrid,
  Flex,
  Badge,
  Divider,
  useColorModeValue,
  Card,
  CardBody,
  Stack,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import Layout from '@/components/Layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { 
  FaWhatsapp, 
  FaTelegram, 
  FaEnvelope, 
  FaArrowRight, 
  FaLocationArrow,
  FaUserAlt,
  FaInfoCircle,
  FaCheckCircle
} from 'react-icons/fa';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionContainer = motion(Container);

// Platform definitions
const PLATFORMS = {
  Adfaly: { themeKey: 'Adfaly', subdomain: 'Adfaly' },
  Utlubha: { themeKey: 'utlubha', subdomain: 'utlubha' },
  DEFAULT: { themeKey: 'Adfaly', subdomain: 'Adfaly' }, // Default platform
};

// Helper function to detect platform from hostname
const getPlatformFromHostname = (hostname) => {
  if (!hostname) return PLATFORMS.DEFAULT;
  
  // Check for each possible subdomain
  if (hostname.includes('utlubha.')) return PLATFORMS.Utlubha;
  if (hostname.includes('Adfaly.')) return PLATFORMS.Adfaly;
  
  return PLATFORMS.DEFAULT;
};

const Contact = () => {
  const { t } = useTranslation('common');
  const { colorMode } = useColorMode();
  const [currentPlatform, setCurrentPlatform] = useState(PLATFORMS.DEFAULT); // Initialize with default
  const isDark = colorMode === 'dark';
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const platform = getPlatformFromHostname(window.location.hostname);
      setCurrentPlatform(platform);
      
      // If platform specified in query, use that
      if (router.query.platform) {
        const platformFromQuery = Object.values(PLATFORMS).find(
          p => p.subdomain.toLowerCase() === router.query.platform.toLowerCase()
        );
        if (platformFromQuery) {
          setCurrentPlatform(platformFromQuery);
        }
      }
    }
  }, [router.query]);

  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    inquiryType: 'general',
    platform: 'all',
    message: '' 
  });
  
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Get current theme key safely
  const themeKey = currentPlatform?.themeKey || 'utlubha';
  
  const cardBg = useColorModeValue('white', 'black.800');
  const highlightColor = useColorModeValue(`brand.${themeKey}.500`, `brand.${themeKey}.300`);
  
  const platforms = [
    { value: 'all', label: t('allPlatforms', 'All Platforms') },
    { value: 'Adfaly', label: t('Adfaly', 'Adfaly') },
    { value: 'Utlubha', label: t('Utlubha', 'Utlubha') }
  ];
  
  const contactInfo = [
    { 
      title: t('generalInquiries', 'General Inquiries'), 
      value: 'info@bitdash.app',
      color: 'brand.utlubha.400'
    },
    { 
      title: t('technicalSupport', 'Technical Support'), 
      value: 'help@bitdash.app',
      color: 'brand.utlubha.400'
    },
    { 
      title: t('accountQuestions', 'Account Questions'), 
      value: 'contact@bitdash.app',
      color: 'brand.utlubha.400'
    }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('nameRequired', 'Name is required');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired', 'Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('invalidEmail', 'Invalid email format');
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t('messageRequired', 'Message is required');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('messageTooShort', 'Message is too short');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset alerts
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
    
    if (!validateForm()) {
      toast({
        title: t('formError', 'Form Error'),
        description: t('pleaseFixErrors', 'Please fix the errors in the form'),
        status: 'error',
        duration: 3000,
      });
      return;
    }
    
    setIsSending(true);

    try {
      // Use the API route to send the email
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccessAlert(true);
        
        toast({
          title: t('success', 'Success'),
          description: t('emailSent', 'Your message has been sent successfully. We will contact you soon!'),
          status: 'success',
          duration: 5000,
        });
        
        // Reset the form
        setFormData({ name: '', email: '', inquiryType: 'general', platform: 'all', message: '' });
      } else {
        throw new Error(data.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setShowErrorAlert(true);
      setErrorMessage(error.message);
      
      toast({
        title: t('error', 'Error'),
        description: error.message || t('emailNotSent', 'Failed to send your message. Please try again.'),
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSending(false);
      
      // Scroll to the top to show the alert
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleSocialClick = (link) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Layout>
      <Head>
        <title>{t('contact', 'Contact Us')}</title>
        <link href="/favicon.ico" rel="icon"/>
      </Head>
      
      <Box 
        py={6} 
        position="relative"
        overflow="hidden"
      > 
        <MotionContainer 
          maxW="6xl" 
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          zIndex="1"
        >
          {showSuccessAlert && (
            <Alert
              status="success"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              borderRadius="xl"
              py={6}
              mb={8}
            >
              <AlertIcon boxSize={10} mr={0} mb={4} />
              <AlertTitle fontSize="xl" mb={2}>
                {t('emailSentTitle', 'Message Sent!')}
              </AlertTitle>
              <AlertDescription maxW="md">
                {t('emailSentDescription', 'Thank you for contacting us. We will get back to you as soon as possible.')}
              </AlertDescription>
            </Alert>
          )}

          {showErrorAlert && (
            <Alert
              status="error"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              borderRadius="xl"
              py={6}
              mb={8}
            >
              <AlertIcon boxSize={10} mr={0} mb={4} />
              <AlertTitle fontSize="xl" mb={2}>
                {t('emailErrorTitle', 'Message Not Sent')}
              </AlertTitle>
              <AlertDescription maxW="md">
                {errorMessage || t('emailErrorDescription', 'There was an error sending your message. Please try again or contact us directly.')}
              </AlertDescription>
            </Alert>
          )}
          
          <MotionBox
            variants={fadeIn}
            textAlign="center"
            mb={10}
          >
            <Heading
              fontSize={{ base: "3xl", md: "4xl" }}
              bgGradient={`linear(to-r, brand.${themeKey}.400, brand.${themeKey}.700)`}
              bgClip="text"
              mb={4}
            >
              {t('contactUs', 'Contact Us')}
            </Heading>
          </MotionBox>
          
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
            {/* Contact Form */}
            <MotionBox variants={fadeIn}>
              <Card 
                shadow="xl" 
                borderRadius="xl" 
                overflow="hidden"
                position="relative"
              >
                <Box 
                  position="absolute" 
                  top={0} 
                  left={0} 
                  right={0} 
                  height="8px" 
                  bgGradient={`linear(to-r, brand.${themeKey}.400, brand.${themeKey}.700)`}
                />
                <CardBody p={{ base: 6, md: 8 }}>
                  <VStack spacing={6} align="stretch">
                    <Heading size="md" color={`brand.${themeKey}.700`}>
                      {t('messageUs', "Message Us")}
                    </Heading>
                    
                    <form onSubmit={handleSubmit}>
                      <VStack spacing={5} align="stretch">
                        <FormControl isInvalid={!!errors.name}>
                          <FormLabel>
                            <HStack>
                              <Icon as={FaUserAlt} color={`brand.${themeKey}.700`} />
                              <Text>{t('name', 'Name')}</Text>
                            </HStack>
                          </FormLabel>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={t('yourName', 'Your name')}
                            size="lg"
                          />
                          <FormErrorMessage>{errors.name}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.email}>
                          <FormLabel>
                            <HStack>
                              <Icon as={FaEnvelope} color={`brand.${themeKey}.700`} />
                              <Text>{t('email', 'Email')}</Text>
                            </HStack>
                          </FormLabel>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t('yourEmail', 'Your email address')}
                            size="lg"
                          />
                          <FormErrorMessage>{errors.email}</FormErrorMessage>
                        </FormControl>
                        
                        <HStack align="start" spacing={4}>
                          <FormControl>
                            <FormLabel>
                              <HStack>
                                <Icon as={FaInfoCircle} color={`brand.${themeKey}.700`} />
                                <Text>{t('inquiryType', 'Inquiry Type')}</Text>
                              </HStack>
                            </FormLabel>
                            <Select
                              name="inquiryType"
                              value={formData.inquiryType}
                              onChange={handleChange}
                              size="lg"
                            >
                              <option value="general">{t('general', 'General Inquiry')}</option>
                              <option value="support">{t('support', 'Technical Support')}</option>
                              <option value="account">{t('account', 'Account Help')}</option>
                            </Select>
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel>{t('platform', 'Platform')}</FormLabel>
                            <Select
                              name="platform"
                              value={formData.platform}
                              onChange={handleChange}
                              size="lg"
                            >
                              {platforms.map(platform => (
                                <option key={platform.value} value={platform.value}>
                                  {platform.label}
                                </option>
                              ))}
                            </Select>
                          </FormControl>
                        </HStack>

                        <FormControl isInvalid={!!errors.message}>
                          <FormLabel>
                            <HStack>
                              <Icon as={FaLocationArrow} color={`brand.${themeKey}.700`} />
                              <Text>{t('message', 'Message')}</Text>
                            </HStack>
                          </FormLabel>
                          <Textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder={t('yourMessage', 'Your message here...')}
                            size="lg"
                            minH="150px"
                            resize="vertical"
                          />
                          <FormErrorMessage>{errors.message}</FormErrorMessage>
                        </FormControl>

                        <Button 
                          type="submit"
                          size="lg"
                          variant={`${themeKey}-outline`}
                          isLoading={isSending}
                          loadingText={t('sending', 'Sending...')}
                          rightIcon={<FaArrowRight />}
                          _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg',
                          }}
                          transition="all 0.3s"
                        >
                          {t('sendMessage', 'Send Message')}
                        </Button>
                      </VStack>
                    </form>
                  </VStack>
                </CardBody>
              </Card>
            </MotionBox>
            
            {/* Contact Info and Social */}
            <MotionBox variants={fadeIn}>
              <VStack spacing={8} align="stretch">
                {/* Direct Contact */}
                <Card bg={cardBg} shadow="xl" borderRadius="xl" overflow="hidden">
                  <Box 
                    position="absolute" 
                    top={0} 
                    left={0} 
                    right={0} 
                    height="8px" 
                    bgGradient={`linear(to-r, brand.${themeKey}.400, brand.${themeKey}.600)`}
                  />
                  <CardBody p={{ base: 6, md: 8 }}>
                    <VStack spacing={6} align="stretch">
                      <Heading size="md" color={`brand.${themeKey}.700`}>
                        {t('contactDirectly', "Contact Us Directly")}
                      </Heading>
                      
                      <VStack spacing={4} align="stretch">
                        {contactInfo.map((item, index) => (
                          <MotionFlex
                            key={index}
                            p={4}
                            borderRadius="md"
                            align="center"
                            justify="space-between"
                            cursor="pointer"
                            onClick={() => {
                              navigator.clipboard.writeText(item.value);
                              toast({
                                title: t('emailCopied', 'Email Copied!'),
                                description: `${item.value} ${t('copiedToClipboard', 'copied to clipboard')}`,
                                status: 'success',
                                duration: 2000,
                              });
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            bg={useColorModeValue("gray.50", "gray.700")}
                          >
                            <HStack>
                              <Icon as={FaEnvelope} color={`brand.${themeKey}.700`} boxSize={5} mr={3} />
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="medium">{item.title}</Text>
                                <Text fontSize="sm" opacity={0.8}>{item.value}</Text>
                              </VStack>
                            </HStack>
                            <IconButton
                              icon={<FaArrowRight />}
                              variant="ghost"
                              color={`brand.${themeKey}.700`}
                              size="sm"
                              aria-label={t('copy', 'Copy')}
                            />
                          </MotionFlex>
                        ))}
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
                
                {/* WhatsApp & Telegram Buttons */}
                <Card bg={cardBg} shadow="xl" borderRadius="xl" overflow="hidden">
                  <Box 
                    position="absolute" 
                    top={0} 
                    left={0} 
                    right={0} 
                    height="8px" 
                    bgGradient={`linear(to-r, brand.${themeKey}.400, brand.${themeKey}.600)`}
                  />
                  <CardBody p={{ base: 6, md: 8 }}>
                    <VStack spacing={6} align="stretch">
                      <Heading size="md" color={`brand.${themeKey}.700`}>
                        {t('instantSupport', "Get Instant Support")}
                      </Heading>
                      
                      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                        <Button
                          size="lg"
                          leftIcon={<FaWhatsapp size="20px" />}
                          onClick={() => window.open("https://api.whatsapp.com/send?phone=00447538636207", "_blank")}
                          colorScheme="green"
                          height="60px"
                          _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg',
                          }}
                          transition="all 0.3s"
                        >
                          WhatsApp
                        </Button>
                        
                        <Button
                          size="lg"
                          leftIcon={<FaTelegram size="20px" />}
                          onClick={() => window.open("https://t.me/BitDashSupport", "_blank")}
                          colorScheme="blue"
                          height="60px"
                          _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg',
                          }}
                          transition="all 0.3s"
                        >
                          Telegram
                        </Button>
                      </SimpleGrid>
                      
                      <Text fontSize="sm" textAlign="center" opacity={0.7}>
                        {t('instantSupportDescription', "Our support team is available 24/7 to assist you with any questions or issues")}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
                
                {/* Response Time Card
                <Card bg={cardBg} shadow="xl" borderRadius="xl" overflow="hidden">
                  <Box 
                    position="absolute"
                    top={0} 
                    left={0} 
                    right={0} 
                    height="8px" 
                    bgGradient={`linear(to-r, brand.${themeKey}.400, brand.${themeKey}.600)`}
                  />
                  <CardBody p={6} w="100%">
                    <HStack spacing={4}>
                      <Icon as={FaCheckCircle} color="green.500" boxSize={6} />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium" color={`brand.${themeKey}.700`}>
                          {t('fastResponse', "Fast Response Time")}
                        </Text>
                        <Text fontSize="sm">
                          {t('responseTimeDescription', "We typically respond to all inquiries within 24 hours")}
                        </Text>
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card> */}
              </VStack>
            </MotionBox>
          </SimpleGrid>
        </MotionContainer>
      </Box>
    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default Contact;