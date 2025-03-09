import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
  Text,
  useToast,
  SimpleGrid,
  Tooltip,
  Heading,
  useColorMode,
  FormHelperText,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  PinInput,
  PinInputField,
  useColorModeValue,
  AccordionPanel,
  Link as ChakraLink,
  Checkbox,
  Image,
  Avatar,
  Select,
  Radio,
  RadioGroup,
  Stack,
  Alert,
  AlertIcon,
  Divider,
  Flex,
  Icon,
  Tag,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Progress
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { 
  FaChartLine, 
  FaUserTie, 
  FaGlobe, 
  FaExchangeAlt, 
  FaShieldAlt, 
  FaIdCard, 
  FaInfoCircle, 
  FaLock 
} from 'react-icons/fa';
import Link from 'next/link';
import Head from 'next/head';
import RiskDisclosure from '@/components/RiskDisclosure';

const ROLES = {
  RETAIL_TRADER: 17, // Adjust this to match your actual retail trader role ID
};

const ACCOUNT_TYPES = [
  { value: 'standard', label: 'Standard Account', description: 'For beginner traders with standard spreads and features', minDeposit: 50 },
  { value: 'premium', label: 'Premium Account', description: 'For active traders with tighter spreads and priority support', minDeposit: 1000 },
  { value: 'professional', label: 'Professional Account', description: 'For experienced traders with advanced tools and lowest spreads', minDeposit: 5000 }
];

const TRADING_EXPERIENCE_OPTIONS = [
  { value: 'beginner', label: 'Beginner (Less than 1 year)' },
  { value: 'intermediate', label: 'Intermediate (1-3 years)' },
  { value: 'advanced', label: 'Advanced (3-5 years)' },
  { value: 'professional', label: 'Professional (5+ years)' }
];

const KNOWLEDGE_LEVEL_OPTIONS = [
  { value: 'basic', label: 'Basic' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' }
];

const formStyles = {
  position: "relative",
  maxW: "700px",
  mx: "auto",
  p: 8,
  borderRadius: "xl",
  boxShadow: "xl",
  backdropFilter: "blur(10px)",
  bg: "rgba(255, 255, 255, 0.05)",
  border: "1px solid",
  borderColor: "whiteAlpha.200"
};

const inputStyles = {
  bg: "rgba(255, 255, 255, 0.05)",
  borderColor: "brand.ldn.400",
  _hover: {
    borderColor: "whiteAlpha.400",
  },
  _focus: {
    borderColor: "brand.ldn.400",
    bg: "rgba(255, 255, 255, 0.08)",
  }
};

export default function TraderSignup() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const toast = useToast();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(25);
  
  const [formData, setFormData] = useState({
    // Account credentials
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Personal info
    fullName: '',
    phone: '',
    dateOfBirth: '',
    country: '',
    city: '',
    address: '',
    postalCode: '',
    
    // Trading preferences
    accountType: 'standard',
    tradingExperience: 'beginner',
    tradingFrequency: 'occasionally',
    riskTolerance: 'moderate',
    
    // Knowledge assessment
    forexKnowledge: 'basic',
    cryptoKnowledge: 'basic',
    leverageKnowledge: 'basic',
    marginKnowledge: 'basic',
    
    // Security
    wallet_pin: '',
    
    // Referral and agree to terms
    referralCode: '',
    agreedToTerms: false,
    agreedToRiskDisclosure: false,
    
    // Avatar
    avatar: null
  });

   // Handle risk disclosure acceptance
  const handleRiskAcceptance = (accepted) => {
    setFormData(prev => ({
      ...prev,
      agreedToRiskDisclosure: accepted
    }));
    
    if (accepted) {
      toast({
        title: 'Risk Disclosure Accepted',
        description: 'You have acknowledged and accepted the risk disclosure statement.',
        status: 'success',
        duration: 3000,
      });
    }
  };

  const [previewAvatar, setPreviewAvatar] = useState(null);
  
  const steps = [
    { title: t('accountSetup'), description: t('createYourLogin') },
    { title: t('personalInfo'), description: t('yourDetails') },
    { title: t('tradingProfile'), description: t('preferences') },
    { title: t('finalizeSetup'), description: t('securityAndTerms') }
  ];

  useEffect(() => {
    // Update progress based on current step
    setProgress((currentStep + 1) * 25);
  }, [currentStep]);

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast({
          title: t('error'),
          description: t('invalidFileType'),
          status: 'error'
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: t('error'),
          description: t('fileTooLarge'),
          status: 'error'
        });
        return;
      }

      // Set form data and create preview
      setFormData(prev => ({
        ...prev,
        avatar: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateCurrentStep = () => {
    // Validate account info (step 0)
    if (currentStep === 0) {
      if (!formData.username || formData.username.length < 3) {
        toast({
          title: t('error'),
          description: t('usernameTooShort'),
          status: 'error'
        });
        return false;
      }
      
      if (!formData.email || !formData.email.includes('@')) {
        toast({
          title: t('error'),
          description: t('invalidEmail'),
          status: 'error'
        });
        return false;
      }
      
      if (!formData.password || formData.password.length < 8) {
        toast({
          title: t('error'),
          description: t('passwordTooShort'),
          status: 'error'
        });
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: t('error'),
          description: t('passwordsDoNotMatch'),
          status: 'error'
        });
        return false;
      }
    }
    
    // Validate personal info (step 1)
    else if (currentStep === 1) {
      if (!formData.fullName) {
        toast({
          title: t('error'),
          description: t('fullNameRequired'),
          status: 'error'
        });
        return false;
      }
      
      if (!formData.phone) {
        toast({
          title: t('error'),
          description: t('phoneRequired'),
          status: 'error'
        });
        return false;
      }
      
      if (!formData.country) {
        toast({
          title: t('error'),
          description: t('countryRequired'),
          status: 'error'
        });
        return false;
      }
    }
    
    // Validate security and terms (step 3)
    else if (currentStep === 3) {
      if (!formData.wallet_pin || formData.wallet_pin.length !== 6) {
        toast({
          title: t('error'),
          description: t('invalidWalletPIN'),
          status: 'error'
        });
        return false;
      }
      
      if (!formData.agreedToTerms || !formData.agreedToRiskDisclosure) {
        toast({
          title: t('error'),
          description: t('mustAgreeToTerms'),
          status: 'error'
        });
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setLoading(true);
    try {
      // 1. Register user
      const userResponse = await fetch(`${BASE_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmed: true,
          blocked: false,
          role: ROLES.RETAIL_TRADER
        })
      });

      const userData = await userResponse.json();
      if (!userResponse.ok) {
        throw new Error(userData.error?.message || t('registrationFailed'));
      }

      // 2. Create retail trader profile
      const retailTraderPayload = {
        data: {
          users_permissions_user: userData.user.id,
          status: 'active',
          tradingLevel: formData.tradingExperience,
          accountType: formData.accountType,
          tradingVolume: 0,
          totalTrades: 0,
          totalProfitLoss: 0,
          winRate: 0,
          tradingSince: new Date().toISOString(),
          leverageLimit: formData.accountType === 'professional' ? 500 : (formData.accountType === 'premium' ? 200 : 100),
          kycVerified: false,
          tradingPreferences: JSON.stringify({
            tradingFrequency: formData.tradingFrequency,
            riskTolerance: formData.riskTolerance,
            forexKnowledge: formData.forexKnowledge,
            cryptoKnowledge: formData.cryptoKnowledge,
            leverageKnowledge: formData.leverageKnowledge,
            marginKnowledge: formData.marginKnowledge
          }),
          tradingMetrics: JSON.stringify({
            sharpeRatio: 0,
            maxDrawdown: 0,
            avgTradeSize: 0,
            avgHoldingTime: 0,
            profitFactor: 0
          }),
          marginLevel: 100,
          marginCallLevel: 80,
          stopOutLevel: 50,
          agreedToTerms: formData.agreedToTerms,
          referredBy: formData.referralCode || null,
          publishedAt: new Date().toISOString()
        }
      };

      const retailTraderResponse = await fetch(`${BASE_URL}/api/retail-traders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.jwt}`
        },
        body: JSON.stringify(retailTraderPayload)
      });

      const retailTraderData = await retailTraderResponse.json();
      if (!retailTraderResponse.ok) {
        throw new Error(t('traderProfileCreationFailed'));
      }

      // 3. Create customer profile
      const customerProfilePayload = {
        data: {
          fullName: formData.fullName,
          phone: formData.phone,
          wallet_pin: parseInt(formData.wallet_pin),
          users_permissions_user: userData.user.id,
          country: formData.country,
          city: formData.city,
          address: formData.address,
          postalCode: formData.postalCode,
          dateOfBirth: formData.dateOfBirth,
          wallet_status: 'active',
          publishedAt: new Date().toISOString()
        }
      };

      const customerProfileResponse = await fetch(`${BASE_URL}/api/customer-profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.jwt}`
        },
        body: JSON.stringify(customerProfilePayload)
      });

      const customerProfileData = await customerProfileResponse.json();
      if (!customerProfileResponse.ok) {
        throw new Error(t('customerProfileCreationFailed'));
      }

       // 4. Update user with retail trader role
        await fetch(`${API_URL}/api/users/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
          },
          body: JSON.stringify({ role: 17 })
        });


      // 5. Create wallet for the trader
      const walletPayload = {
        data: {
          balance: 0,
          currency: 'USD',
          isActive: true,
          walletId: `RT-${userData.user.id}-${Date.now()}`,
          wallet_type: 'trader',
          dailyLimit: 20000, 
          monthlyLimit: 100000,
          retail_trader: retailTraderData.data.id
        }
      };

      const walletResponse = await fetch(`${BASE_URL}/api/wallets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.jwt}`
        },
        body: JSON.stringify(walletPayload)
      });

      const walletData = await walletResponse.json();
      if (!walletResponse.ok) {
        throw new Error(t('walletCreationFailed'));
      }

      // 6. Upload avatar if selected
      if (formData.avatar) {
        const avatarFormData = new FormData();
        avatarFormData.append('files', formData.avatar);
        avatarFormData.append('ref', 'api::customer-profile.customer-profile');
        avatarFormData.append('refId', customerProfileData.data.id);
        avatarFormData.append('field', 'avatar');

        const avatarUploadResponse = await fetch(`${BASE_URL}/api/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${userData.jwt}`
          },
          body: avatarFormData
        });

        if (!avatarUploadResponse.ok) {
          console.warn('Avatar upload failed:', await avatarUploadResponse.json());
          // Non-critical error, continue with registration
        }
      }

      // 7. Update retail trader with wallet relation
      await fetch(`${BASE_URL}/api/retail-traders/${retailTraderData.data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.jwt}`
        },
        body: JSON.stringify({
          data: {
            wallet: walletData.data.id
          }
        })
      });

      // 8. Update user with customer profile relation
      await fetch(`${BASE_URL}/api/users/${userData.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.jwt}`
        },
        body: JSON.stringify({
          customer_profile: customerProfileData.data.id
        })
      });

      toast({
        title: t('success'),
        description: t('accountCreationSuccessful'),
        status: 'success',
        duration: 5000
      });

      // Store auth data
      localStorage.setItem('token', userData.jwt);
      localStorage.setItem('user', JSON.stringify({
        ...userData.user,
        role: ROLES.RETAIL_TRADER,
        retail_trader: retailTraderData.data,
        customer_profile: customerProfileData.data
      }));

      // Redirect to trader dashboard
      router.push('/trader/dashboard');

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: t('error'),
        description: error.message,
        status: 'error',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 0: Account Setup
  const renderAccountStep = () => (
    <VStack spacing={6} align="stretch">
      <Heading size="md" color={useColorModeValue('gray.700', 'gray.300')}>
        <Flex align="center">
          <Icon as={FaIdCard} mr={2} color={accentColor} />
          {t('accountSetup')}
        </Flex>
      </Heading>
      
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <Text fontSize="sm" color="linear(to-r, brand.ldn.500, brand.ldn.700)">
          {t('createTradingAccountInfo')}
        </Text>
      </Alert>
      
      <FormControl isRequired>
        <FormLabel>{t('username')}</FormLabel>
        <Input
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder={t('enterUsername')}
          size="lg"
          {...inputStyles}
        />
        <FormHelperText>
          {t('usernameHelper')}
        </FormHelperText>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>{t('email')}</FormLabel>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder={t('enterEmail')}
          size="lg"
          {...inputStyles}
        />
      </FormControl>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl isRequired>
          <FormLabel>{t('password')}</FormLabel>
          <Input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={t('enterPassword')}
            size="lg"
            {...inputStyles}
          />
          <FormHelperText>
            {t('passwordRequirements')}
          </FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>{t('confirmPassword')}</FormLabel>
          <Input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder={t('confirmPassword')}
            size="lg"
            {...inputStyles}
          />
        </FormControl>
      </SimpleGrid>

      <Box pt={4}>
        <Button
          color="brand.ldn.400"
          variant="bittrade-outline"
          size="lg"
          onClick={nextStep}
          width="full"
        >
          {t('continue')}
        </Button>
      </Box>
    </VStack>
  );

  // Step 1: Personal Information
  const renderPersonalStep = () => (
    <VStack spacing={6} align="stretch">
      <Heading size="md" color={useColorModeValue('gray.700', 'gray.300')}>
        <Flex align="center">
          <Icon as={FaUserTie} mr={2} color={accentColor} />
          {t('personalInformation')}
        </Flex>
      </Heading>
      
      <FormControl isRequired>
        <FormLabel>{t('fullName')}</FormLabel>
        <Input
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder={t('enterFullName')}
          size="lg"
          {...inputStyles}
        />
      </FormControl>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl isRequired>
          <FormLabel>{t('phone')}</FormLabel>
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder={t('enterPhone')}
            size="lg"
            {...inputStyles}
          />
        </FormControl>

        <FormControl>
          <FormLabel>{t('dateOfBirth')}</FormLabel>
          <Input
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            size="lg"
            {...inputStyles}
          />
        </FormControl>
      </SimpleGrid>

      <FormControl isRequired>
        <FormLabel>{t('country')}</FormLabel>
        <Input
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          placeholder={t('enterCountry')}
          size="lg"
          {...inputStyles}
        />
      </FormControl>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl>
          <FormLabel>{t('city')}</FormLabel>
          <Input
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder={t('enterCity')}
            size="lg"
            {...inputStyles}
          />
        </FormControl>

        <FormControl>
          <FormLabel>{t('postalCode')}</FormLabel>
          <Input
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            placeholder={t('enterPostalCode')}
            size="lg"
            {...inputStyles}
          />
        </FormControl>
      </SimpleGrid>

      <FormControl>
        <FormLabel>{t('address')}</FormLabel>
        <Input
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder={t('enterAddress')}
          size="lg"
          {...inputStyles}
        />
      </FormControl>

      <FormControl>
        <FormLabel>{t('profilePicture')}</FormLabel>
        <HStack spacing={4} align="center">
          {previewAvatar && (
            <Avatar 
              size="lg" 
              src={previewAvatar} 
              name={formData.fullName}
            />
          )}
          <Input
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileChange}
            variant="filled"
            size="lg"
            {...inputStyles}
          />
        </HStack>
        <FormHelperText>
          {t('profilePictureHelper')}
        </FormHelperText>
      </FormControl>

      <HStack justify="space-between" pt={4}>
        <Button
          variant="ldn-outline"
          onClick={prevStep}
        >
          {t('back')}
        </Button>
        <Button
          variant="ldn-outline"
          color="brand.ldn.400"
          onClick={nextStep}
        >
          {t('continue')}
        </Button>
      </HStack>
    </VStack>
  );

  // Step 2: Trading Profile
  const renderTradingStep = () => (
    <VStack spacing={6} align="stretch">
      <Heading size="md" color={useColorModeValue('gray.700', 'gray.300')}>
        <Flex align="center">
          <Icon as={FaChartLine} mr={2} color={accentColor} />
          {t('tradingProfile')}
        </Flex>
      </Heading>
      
      <FormControl isRequired>
        <FormLabel>{t('accountType')}</FormLabel>
        <RadioGroup 
          name="accountType" 
          value={formData.accountType}
          onChange={(value) => setFormData(prev => ({ ...prev, accountType: value }))}
        >
          <Stack direction="column" spacing={3}>
            {ACCOUNT_TYPES.map(type => (
              <Box 
                key={type.value} 
                p={3}
                borderWidth="1px"
                borderRadius="md"
                borderColor={formData.accountType === type.value ? accentColor : 'gray.200'}
                cursor="pointer"
                _hover={{ borderColor: accentColor }}
                onClick={() => setFormData(prev => ({ ...prev, accountType: type.value }))}
              >
                <Radio value={type.value} color="brand.ldn.400">
                  <Text fontWeight="bold">{type.label}</Text>
                </Radio>
                <Text ml={6} fontSize="sm" mt={1}>{type.description}</Text>
                <Text ml={6} fontSize="sm" fontWeight="medium" mt={1}>
                  {t('minDeposit')}: ${type.minDeposit}
                </Text>
              </Box>
            ))}
          </Stack>
        </RadioGroup>
      </FormControl>

      <Divider my={2} />

      <FormControl>
        <FormLabel>{t('tradingExperience')}</FormLabel>
        <RadioGroup 
          name="tradingExperience" 
          value={formData.tradingExperience}
          onChange={(value) => setFormData(prev => ({ ...prev, tradingExperience: value }))}
        >
          <Stack direction="column" spacing={2}>
            {TRADING_EXPERIENCE_OPTIONS.map(option => (
              <Radio key={option.value} value={option.value} color="brand.ldn.400">
                {option.label}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </FormControl>

      <FormControl>
        <FormLabel>{t('tradingFrequency')}</FormLabel>
        <RadioGroup 
          name="tradingFrequency" 
          value={formData.tradingFrequency}
          onChange={(value) => setFormData(prev => ({ ...prev, tradingFrequency: value }))}
        >
          <Stack direction="column" spacing={2}>
            <Radio value="rarely" color="brand.ldn.400">{t('rarely')}</Radio>
            <Radio value="occasionally" color="brand.ldn.400">{t('occasionally')}</Radio>
            <Radio value="frequently" color="brand.ldn.400">{t('frequently')}</Radio>
            <Radio value="daily" color="brand.ldn.400">{t('daily')}</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>

      <FormControl>
        <FormLabel>{t('riskTolerance')}</FormLabel>
        <RadioGroup 
          name="riskTolerance" 
          value={formData.riskTolerance}
          onChange={(value) => setFormData(prev => ({ ...prev, riskTolerance: value }))}
        >
          <Stack direction="column" spacing={2}>
            <Radio value="conservative" color="brand.ldn.400">{t('conservative')}</Radio>
            <Radio value="moderate" color="brand.ldn.400">{t('moderate')}</Radio>
            <Radio value="aggressive" color="brand.ldn.400">{t('aggressive')}</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>

      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <Heading size="sm">{t('knowledgeAssessment')}</Heading>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text fontSize="sm" mb={4}>
              {t('knowledgeAssessmentHelper')}
            </Text>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl>
                <FormLabel>{t('forexKnowledge')}</FormLabel>
                <Select
                  name="forexKnowledge"
                  value={formData.forexKnowledge}
                  onChange={handleInputChange}
                  size="md"
                  {...inputStyles}
                >
                  {KNOWLEDGE_LEVEL_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>{t('cryptoKnowledge')}</FormLabel>
                <Select
                  name="cryptoKnowledge"
                  value={formData.cryptoKnowledge}
                  onChange={handleInputChange}
                  size="md"
                  {...inputStyles}
                >
                  {KNOWLEDGE_LEVEL_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>{t('leverageKnowledge')}</FormLabel>
                <Select
                  name="leverageKnowledge"
                  value={formData.leverageKnowledge}
                  onChange={handleInputChange}
                  size="md"
                  {...inputStyles}
                >
                  {KNOWLEDGE_LEVEL_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>{t('marginKnowledge')}</FormLabel>
                <Select
                  name="marginKnowledge"
                  value={formData.marginKnowledge}
                  onChange={handleInputChange}
                  size="md"
                  {...inputStyles}
                >
                  {KNOWLEDGE_LEVEL_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <HStack justify="space-between" pt={4}>
        <Button
          variant="bittrade-outline"
          onClick={prevStep}
        >
          {t('back')}
        </Button>
        <Button
          variant="bittrade-outline"
          color="brand.ldn.400"
          onClick={nextStep}
        >
          {t('continue')}
        </Button>
      </HStack>
    </VStack>
  );

  // Step 3: Finalize Setup
  const renderFinalizeStep = () => (
    <VStack spacing={6} align="stretch">
      <Heading size="md" color={useColorModeValue('gray.700', 'gray.300')}>
        <Flex align="center">
          <Icon as={FaLock} mr={2} color={accentColor} />
          {t('finalizeSetup')}
        </Flex>
      </Heading>
      
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <Text fontSize="sm">
          {t('finalizeAccountInfo')}
        </Text>
      </Alert>

      <FormControl isRequired>
        <FormLabel>{t('walletPIN')}</FormLabel>
        <HStack>
          <PinInput 
            size="lg" 
            otp 
            onChange={(value) => setFormData(prev => ({ ...prev, wallet_pin: value }))}
          >
            <PinInputField {...inputStyles} />
            <PinInputField {...inputStyles} />
            <PinInputField {...inputStyles} />
            <PinInputField {...inputStyles} />
            <PinInputField {...inputStyles} />
            <PinInputField {...inputStyles} />
          </PinInput>
        </HStack>
        <FormHelperText>
          {t('walletPINHelper')}
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>{t('referralCode')}</FormLabel>
        <Input
          name="referralCode"
          value={formData.referralCode}
          onChange={handleInputChange}
          placeholder={t('enterReferralCode')}
          size="lg"
          {...inputStyles}
        />
        <FormHelperText>
          {t('optional')}
        </FormHelperText>
      </FormControl>

      <Box 
        p={4} 
        borderWidth="1px" 
        borderRadius="md" 
        borderColor="gray.200"
      >
        <Heading size="sm" mb={4}>
          <Flex align="center">
            <Icon as={FaInfoCircle} mr={2} color={accentColor} />
            {t('termsAndConditions')}
          </Flex>
        </Heading>
        
        <VStack align="stretch" spacing={4}>
         <FormControl isRequired>
            <HStack spacing={2} align="center">
              <Checkbox
                isChecked={formData.agreedToRiskDisclosure}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  agreedToRiskDisclosure: e.target.checked 
                }))}
                colorScheme="blue"
                // Remove the isDisabled prop entirely
              >
                <Text fontSize="sm">
                  {t('agreeToRiskDisclosure')}
                </Text>
              </Checkbox>
              
              <RiskDisclosure 
                platform="BitTrade" 
                accountType="retail" 
                onAccept={handleRiskAcceptance} 
              />
            </HStack>
          </FormControl>
          <FormControl isRequired>
            <HStack spacing={2} align="center">
              <Checkbox
                isChecked={formData.agreedToTerms}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  agreedToTerms: e.target.checked 
                }))}
                colorScheme="blue"
              >
                <Text fontSize="sm">
                  {t('agreeToTerms')}
                </Text>
              </Checkbox>
              
              {/* Link to Terms & Conditions */}
              <Button
                variant="link"
                onClick={() => window.open('/policies/terms', '_blank')}
                size="sm"
                color={accentColor}
              >
                {t('viewTerms')}
              </Button>
            </HStack>
          </FormControl>
        </VStack>
      </Box>
      
      <HStack justify="space-between" pt={4}>
        <Button
          variant="bittrade-outline"
          onClick={prevStep}
        >
          {t('back')}
        </Button>
        <Button
          color="brand.ldn.400"
          onClick={handleSubmit}
          isLoading={loading}
          loadingText={t('creatingAccount')}
        >
          {t('createAccount')}
        </Button>
      </HStack>
    </VStack>
  );
  
  // Helper for accent color based on color mode
  const accentColor = useColorModeValue('brand.ldn.500', 'brand.ldn.700');
  
  // Progress step indicator
  const renderProgressSteps = () => (
    <Box mb={8}>
      <Progress 
        value={progress} 
        size="sm" 
        color="brand.ldn.400" 
        borderRadius="full" 
        mb={4}
      />
      <SimpleGrid columns={4} spacing={2}>
        {steps.map((step, index) => (
          <Box key={index}>
            <Tooltip label={step.description}>
              <Tag 
                size="md" 
                borderRadius="full"
                variant={currentStep >= index ? "solid" : "outline"}
                colorScheme={currentStep >= index ? "blue" : "gray"}
                cursor="pointer"
                onClick={() => currentStep > index && setCurrentStep(index)}
                opacity={currentStep > index ? 1 : 0.7}
                mb={1}
              >
                {index + 1}
              </Tag>
            </Tooltip>
            <Text 
              fontSize="xs" 
              fontWeight={currentStep === index ? "bold" : "normal"}
              color={currentStep === index ? accentColor : "gray.500"}
            >
              {step.title}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );

  // Render the correct step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return renderAccountStep();
      case 1:
        return renderPersonalStep();
      case 2:
        return renderTradingStep();
      case 3:
        return renderFinalizeStep();
      default:
        return renderAccountStep();
    }
  };

  return (
    <Layout>
      <Head>
        <title>{t('createTradingAccount')} | Forex Trading Platform</title>
        <meta name="description" content={t('createTradingAccountDescription')} />
      </Head>
      
      <Box
      pt={8}
      >
        <Box maxW="5xl" mx="auto" px={4}>
          <VStack spacing={8} align="stretch">
            <Heading textAlign="center">
              {t('createTradingAccount')}
            </Heading>
            
            <Box {...formStyles}>
              <form>
                {renderStep()}
              </form>
            </Box>
            
            <HStack justify="center" spacing={1} pt={4}>
              <Text fontSize="sm" color="gray.500">
                {t('alreadyHaveAccount')}
              </Text>
              <ChakraLink as={Link} href="/login" color={accentColor} fontWeight="medium">
                {t('login')}
              </ChakraLink>
            </HStack>
          </VStack>
        </Box>
      </Box>
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