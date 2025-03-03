import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useTranslation } from 'next-i18next';
import RiskDisclosure from '@/components/RiskDisclosure';
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
  Checkbox,
  Heading,
  useColorMode,
  FormHelperText,
  PinInput,
  PinInputField,
  useColorModeValue,
  Link as ChakraLink,
  Avatar,
  Radio,
  RadioGroup,
  Stack,
  Badge,
  Flex,
  Divider,
  List,
  ListItem,
  ListIcon,
  useSteps,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepTitle,
  StepDescription,
  StepSeparator,
  Icon
} from '@chakra-ui/react';
import { InfoIcon, CheckIcon } from '@chakra-ui/icons';
import { FaChartLine, FaMoneyBillWave, FaTrophy, FaCheck } from 'react-icons/fa';
import Link from 'next/link';
import Head from 'next/head';
import { loadStripe } from '@stripe/stripe-js';

const ROLES = {
  CUSTOMER: 4,
  PROP_TRADER: 13, // Adjust to match your actual prop trader role ID
};

// Challenge types with their details
const CHALLENGE_TYPES = {
  standard: {
    name: 'Standard Challenge',
    price: 99,
    account_size: 10000,
    profit_target: 8,
    max_drawdown: 5,
    daily_drawdown: 2,
    duration: '30 days',
    badge: 'blue',
    description: 'Perfect for beginners starting their prop trading journey'
  },
  pro: {
    name: 'Professional Challenge',
    price: 199,
    account_size: 50000,
    profit_target: 10,
    max_drawdown: 8,
    daily_drawdown: 2,
    duration: '60 days',
    badge: 'purple',
    description: 'For experienced traders looking for a larger capital allocation'
  },
  elite: {
    name: 'Elite Challenge',
    price: 299,
    account_size: 100000,
    profit_target: 12,
    max_drawdown: 10,
    daily_drawdown: 2,
    duration: '60 days',
    badge: 'orange',
    description: 'For professional traders with proven track records'
  },
  super: {
    name: 'Super Challenge',
    price: 599,
    account_size: 200000,
    profit_target: 15,
    max_drawdown: 12,
    daily_drawdown: 3,
    duration: '90 days',
    badge: 'red',
    description: 'Our highest tier for elite traders seeking maximum capital'
  }
};

// Define steps for the signup process
const steps = [
  { title: 'Account Info', description: 'Create your user account' },
  { title: 'Challenge Selection', description: 'Choose your challenge' },
  { title: 'Payment', description: 'Complete payment' },
  { title: 'MT5 Setup', description: 'Get trading credentials' }
];

const formStyles = {
  position: "relative",
  maxW: "1200px",
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
  borderColor: "whiteAlpha.300",
  _hover: {
    borderColor: "whiteAlpha.400",
  },
  _focus: {
    borderColor: "blue.400",
    bg: "rgba(255, 255, 255, 0.08)",
  }
};

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function ChallengerSignup() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const toast = useToast();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { colorMode } = useColorMode();
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  
  const [loading, setLoading] = useState(false);
  const [agreedToRiskDisclosure, setAgreedToRiskDisclosure] = useState(false);
  const isDark = colorMode === 'dark';

  // FORM DATA
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    wallet_pin: '',
    avatar: null,
    challengeType: 'standard',  // default
    userId: null,
    jwt: null,
    customerId: null,
    propTraderId: null,
    // For storing final MT5 details
    mt5Login: null,
    mt5Password: null,
    mt5Server: null,
  });

  const [previewAvatar, setPreviewAvatar] = useState(null);

  // --------------
  // EVENT HANDLERS
  // --------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRiskAcceptance = (accepted) => {
    if (accepted) {
      setAgreedToRiskDisclosure(true);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: t('error'),
        description: 'Invalid file type. Please upload JPEG, PNG, or GIF.',
        status: 'error'
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: t('error'),
        description: 'File is too large. Maximum size is 5MB.',
        status: 'error'
      });
      return;
    }

    setFormData(prev => ({ ...prev, avatar: file }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => setPreviewAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  // --------------
  // VALIDATIONS
  // --------------
  const validateBasicInfo = () => {
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
    if (!formData.password || formData.password.length < 6) {
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
    if (!formData.fullName || !formData.phone) {
      toast({
        title: t('error'),
        description: t('fillAllRequired'),
        status: 'error'
      });
      return false;
    }
    if (!formData.wallet_pin || formData.wallet_pin.length !== 6) {
      toast({
        title: t('error'),
        description: t('invalidPIN'),
        status: 'error'
      });
      return false;
    }
    if (!agreedToRiskDisclosure) {
      toast({
        title: 'Risk Disclosure Required',
        description: 'You must agree to the risk disclosure before proceeding.',
        status: 'error',
        duration: 3000
      });
      return false;
    }
    return true;
  };

  // --------------
  // STEP CONTROLS
  // --------------
  const goToNextStep = () => {
    setActiveStep((prev) => prev + 1);
  };

  const goToPreviousStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  // -------------------------------------------------------------------
  // STEP 0: REGISTER USER + CREATE CUSTOMER PROFILE + CREATE PROP TRADER
  // -------------------------------------------------------------------
  const registerUser = async () => {
    setLoading(true);

    if (!validateBasicInfo()) {
      setLoading(false);
      return;
    }

    try {
      // 1) Create user with role = PROP_TRADER (instead of 'Customer')
      const userResponse = await fetch(`${BASE_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmed: true,
          blocked: false,
          role: ROLES.PROP_TRADER // <--- Set to 'Prop Trader' now!
        })
      });
      const userData = await userResponse.json();
      if (!userResponse.ok) {
        throw new Error(userData.error?.message || t('registrationFailed'));
      }

      // 2) Create customer profile
      const profilePayload = {
        data: {
          fullName: formData.fullName,
          phone: formData.phone,
          wallet_pin: parseInt(formData.wallet_pin),
          users_permissions_user: userData.user.id,
          wallet_status: 'pending_verification',
          publishedAt: new Date().toISOString()
        }
      };
      const profileResponse = await fetch(`${BASE_URL}/api/customer-profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.jwt}`
        },
        body: JSON.stringify(profilePayload)
      });
      const profileData = await profileResponse.json();
      if (!profileResponse.ok) {
        throw new Error(t('profileCreationFailed'));
      }

      // 3) Upload avatar (optional)
      if (formData.avatar) {
        const avatarFormData = new FormData();
        avatarFormData.append('files', formData.avatar);
        avatarFormData.append('ref', 'api::customer-profile.customer-profile');
        avatarFormData.append('refId', profileData.data.id);
        avatarFormData.append('field', 'avatar');

        const avatarUploadResponse = await fetch(`${BASE_URL}/api/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${userData.jwt}`
          },
          body: avatarFormData
        });
        if (!avatarUploadResponse.ok) {
          console.warn('Avatar upload failed, continuing with registration');
        }
      }

      // 4) Link customer profile to user (not strictly necessary if done in #2)
      await fetch(`${BASE_URL}/api/users/${userData.user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userData.jwt}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ customer_profile: profileData.data.id })
      });

      // 5) Create a "prop-trader" record *immediately* with a placeholder
      //    status "unpaid" or "pending_payment" to indicate we haven't paid yet.
      const propTraderPayload = {
        data: {
          users_permissions_user: userData.user.id,
          status: 'pending_payment', // or "challenge", whichever fits your business logic
          challenge_type: null,      // We haven't chosen yet
          account_size: 0,
          profit_target: 0,
          max_drawdown: 0,
          dailyDrawdownLimit: 0,
          current_balance: 0,
          profit_loss: 0,
          challenge_start_date: null,
          agreedToTerms: true
        }
      };
      const propTraderResponse = await fetch(`${BASE_URL}/api/prop-traders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.jwt}`
        },
        body: JSON.stringify(propTraderPayload)
      });
      const propTraderData = await propTraderResponse.json();
      if (!propTraderResponse.ok) {
        throw new Error('Failed to create Prop Trader record');
      }

      // 6) Store token + user + propTrader IDs in local state or localStorage
      localStorage.setItem('token', userData.jwt);
      setFormData(prev => ({
        ...prev,
        userId: userData.user.id,
        jwt: userData.jwt,
        customerId: profileData.data.id,
        propTraderId: propTraderData.data.id
      }));

      // 7) Move to next step (challenge selection)
      goToNextStep();
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: t('error'),
        description: error.message,
        status: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------
  // STEP 1: CHALLENGE SELECTION -> UPDATE PROP TRADER -> STRIPE
  // -------------------------------------------------------
  const createCheckoutSession = async () => {
    setLoading(true);
    try {
      const token = formData.jwt || localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      const propTraderId = formData.propTraderId;
      if (!propTraderId) {
        throw new Error('Prop Trader record not found. Please retry registration.');
      }

      // 1) Update the existing prop-trader record with the chosen challenge details
      //    so that we know what user is about to pay for
      const challengeDetails = CHALLENGE_TYPES[formData.challengeType];
      const updatePayload = {
        data: {
          status: 'challenge',  // or "pending_payment", "evaluation", etc.
          challenge_type: formData.challengeType,
          account_size: challengeDetails.account_size,
          profit_target: challengeDetails.profit_target,
          max_drawdown: challengeDetails.max_drawdown,
          dailyDrawdownLimit: challengeDetails.daily_drawdown,
          current_balance: challengeDetails.account_size,
          // We only set a start_date if they've paid
          challenge_start_date: null
        }
      };

      const updatePropTraderResp = await fetch(`${BASE_URL}/api/prop-traders?/${propTraderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
      });
      if (!updatePropTraderResp.ok) {
        throw new Error('Failed to update Prop Trader challenge details');
      }

      // 2) Create a Stripe checkout session (one-time payment)
      //    Adjust your backend route as needed
      const response = await fetch(`${BASE_URL}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          planId: formData.challengeType,
          price: challengeDetails.price,
          userId: formData.userId,
          propTraderId: propTraderId
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }
      const { sessionId } = await response.json();
      if (!sessionId) throw new Error('No session ID returned from Stripe');

      // 3) Redirect to Stripe
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw error;

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Error',
        description: error.message,
        status: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------
  // STEP 2: PAYMENT PROCESSING -> VERIFY => CREATE MT5
  // -------------------------------------------------------
  // This runs after user returns from Stripe with success=true
  const completeChallenge = async () => {
    setLoading(true);
    try {
      const token = formData.jwt || localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      const propTraderId = formData.propTraderId;
      if (!propTraderId) {
        throw new Error('Prop Trader record not found. Please retry registration.');
      }

      // 1) Verify the payment
      const verifyResponse = await fetch(
        `${BASE_URL}/api/verify-challenge-payment?session_id=${router.query.session_id}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok || !verifyData.success) {
        throw new Error(verifyData.error || 'Payment verification failed');
      }

      // 2) Payment verified => update the prop trader record (set "start_date", "status=active", etc.)
      const challengeDetails = CHALLENGE_TYPES[formData.challengeType];
      const propTraderUpdateResp = await fetch(`${BASE_URL}/api/prop-traders?/${propTraderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          data: {
            status: 'active', // or "evaluation", "fundedChallenge", etc.
            challenge_start_date: new Date().toISOString()
          }
        })
      });
      if (!propTraderUpdateResp.ok) {
        throw new Error('Failed to update Prop Trader to active');
      }

      // 3) Create the MT5 demo account
      const mt5Response = await fetch(`${BASE_URL}/api/create-mt5-demo-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propTraderId: propTraderId,
          fullName: formData.fullName,
          email: formData.email,
          balance: challengeDetails.account_size
        })
      });
      const mt5Data = await mt5Response.json();
      if (!mt5Response.ok) {
        throw new Error('Failed to create MT5 demo account');
      }

      // 4) Store MT5 credentials and also update the prop-trader record
      await fetch(`${BASE_URL}/api/prop-traders/${propTraderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          data: {
            trading_metrics: {
              mt5_login: mt5Data.login,
              mt5_password: mt5Data.password,
              mt5_server: mt5Data.server
            }
          }
        })
      });

      // 5) Save to local state for display
      setFormData(prev => ({
        ...prev,
        mt5Login: mt5Data.login,
        mt5Password: mt5Data.password,
        mt5Server: mt5Data.server
      }));

      // Go to final step
      setActiveStep(3);

    } catch (error) {
      console.error('Challenge completion error:', error);
      toast({
        title: t('error'),
        description: error.message,
        status: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // -------------
  // FORM SUBMIT
  // -------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeStep === 0) {
      // Register user
      registerUser();
    } else if (activeStep === 1) {
      // Challenge selection => redirect to Stripe
      createCheckoutSession();
    }
  };

  // -------------------------------------
  // LISTEN FOR SUCCESSFUL PAYMENT RETURN
  // -------------------------------------
  useEffect(() => {
    // If user returns from Stripe with ?session_id=...&success=true
    // and we are on Step 2, then finalize
    if (router.query.session_id && router.query.success === 'true' && activeStep === 2) {
      completeChallenge();
    }
  }, [router.query, activeStep]);

  // -------------
  // RENDER STEPS
  // -------------
  // Step 0: Basic Info + Registration
  const renderBasicInfoForm = () => (
    <VStack spacing={6} width="100%">
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
      </FormControl>

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

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
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
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
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

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
        <FormControl isRequired>
          <FormLabel>
            {t('walletPIN')}
            <Tooltip label={t('walletPINHelper')}>
              <InfoIcon ml={2} />
            </Tooltip>
          </FormLabel>
          <PinInput
            value={formData.wallet_pin}
            onChange={(value) => setFormData(prev => ({ ...prev, wallet_pin: value }))}
            type="number"
            mask
            size="lg"
            p={2}
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

          <FormHelperText>
            {t('Enter 6-digit PIN for your wallet security')}
          </FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>{t('profilePicture')}</FormLabel>
          <HStack spacing={4}>
            {previewAvatar && (
              <Avatar
                src={previewAvatar}
                name={formData.fullName}
              />
            )}
            <Input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileChange}
              {...inputStyles}
            />
          </HStack>
          <FormHelperText>
            Optional: Upload a profile picture (max 5MB)
          </FormHelperText>
        </FormControl>
      </SimpleGrid>

      <FormControl isRequired>
        <HStack spacing={2} align="center">
          <Checkbox
            isChecked={agreedToRiskDisclosure}
            onChange={(e) => setAgreedToRiskDisclosure(e.target.checked)}
            colorScheme="blue"
          >
            <Text>
              {t('agreeToRiskDisclosure', 'I have read and agree to the Risk Disclosure Statement')}
            </Text>
          </Checkbox>
          
          <RiskDisclosure 
            platform="BitFund" 
            accountType="challenger" 
            onAccept={handleRiskAcceptance}
          />
        </HStack>
      </FormControl>

      <Button
        colorScheme="blue"
        size="lg"
        w="full"
        isLoading={loading}
        loadingText={t('creatingAccount')}
        mt={4}
        onClick={registerUser}
      >
        {t('continueToChallenge')}
      </Button>
    </VStack>
  );

  // Step 1: Challenge Selection
  const renderChallengeSelection = () => (
    <VStack spacing={6} width="100%">
      <Text>Select your preferred challenge type:</Text>
      
      <RadioGroup onChange={value => setFormData(prev => ({ ...prev, challengeType: value }))} value={formData.challengeType}>
        <Stack direction="column" spacing={4} width="100%">
          {Object.entries(CHALLENGE_TYPES).map(([key, challenge]) => (
            <Box
              key={key}
              borderWidth="2px"
              borderRadius="md"
              p={4}
              borderColor={formData.challengeType === key ? 'blue.400' : 'gray.200'}
              _hover={{ borderColor: 'blue.400' }}
              bg={formData.challengeType === key ? (isDark ? 'rgba(49, 130, 206, 0.1)' : 'blue.50') : ''}
              cursor="pointer"
              onClick={() => setFormData(prev => ({ ...prev, challengeType: key }))}
            >
              <Radio value={key} width="100%" mb={2}>
                <Flex justify="space-between" align="center" width="100%">
                  <Heading size="md">{challenge.name}</Heading>
                  <Badge colorScheme={challenge.badge} fontSize="md" px={2} py={1}>
                    ${challenge.account_size.toLocaleString()}
                  </Badge>
                </Flex>
              </Radio>
              
              <Text color="gray.600" mt={2} mb={3}>{challenge.description}</Text>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">Fee: ${challenge.price}</Text>
                  <Text>Duration: {challenge.duration}</Text>
                </VStack>
                <VStack align="start" spacing={1}>
                  <Text>Profit Target: {challenge.profit_target}%</Text>
                  <Text>Max Drawdown: {challenge.max_drawdown}%</Text>
                </VStack>
              </SimpleGrid>
            </Box>
          ))}
        </Stack>
      </RadioGroup>

      <Divider my={4} />
      
      <Box bg={isDark ? 'gray.700' : 'gray.50'} p={4} borderRadius="md" width="100%">
        <Heading size="sm" mb={3}>Summary</Heading>
        <Flex justify="space-between" mb={2}>
          <Text>Challenge Type:</Text>
          <Text fontWeight="bold">{CHALLENGE_TYPES[formData.challengeType].name}</Text>
        </Flex>
        <Flex justify="space-between">
          <Text>Price:</Text>
          <Text fontWeight="bold">${CHALLENGE_TYPES[formData.challengeType].price}</Text>
        </Flex>
      </Box>
      
      <HStack width="100%" justify="space-between" pt={4}>
        <Button variant="outline" onClick={goToPreviousStep}>
          Back
        </Button>
        <Button
          colorScheme="blue"
          isLoading={loading}
          loadingText="Processing"
          onClick={createCheckoutSession}
        >
          Proceed to Payment
        </Button>
      </HStack>
    </VStack>
  );

  // Step 2: Payment Processing
  const renderPaymentProcessing = () => (
    <VStack spacing={8} width="100%" align="center" py={8}>
      <Heading size="md">Payment Processing</Heading>
      <Text>
        You will be redirected to our secure payment processor to complete your challenge purchase.
      </Text>
      <Text>
        If you have already completed payment and are seeing this screen, please wait a moment while we verify your payment.
      </Text>
      
      <Button
        colorScheme="blue"
        isLoading={loading}
        loadingText="Checking Payment"
        onClick={() => createCheckoutSession()}
      >
        Retry Payment
      </Button>
    </VStack>
  );

  // Step 3: MT5 Account Info
  const renderMT5Info = () => (
    <VStack spacing={8} width="100%" align="center" py={8}>
      <Heading size="md" color="green.500">Challenge Account Created Successfully!</Heading>
      <Icon as={FaChartLine} boxSize={16} color="blue.500" />
      
      <Box borderWidth="1px" borderRadius="md" p={6} width="100%" bg={isDark ? 'gray.700' : 'gray.50'}>
        <Heading size="sm" mb={4}>Your MT5 Demo Account Credentials</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <VStack align="start">
            <Text color="gray.500">Login ID</Text>
            <Text fontWeight="bold" fontSize="lg">{formData.mt5Login}</Text>
          </VStack>
          
          <VStack align="start">
            <Text color="gray.500">Password</Text>
            <Text fontWeight="bold" fontSize="lg">{formData.mt5Password}</Text>
          </VStack>
          
          <VStack align="start">
            <Text color="gray.500">Server</Text>
            <Text fontWeight="bold" fontSize="lg">{formData.mt5Server}</Text>
          </VStack>
          
          <VStack align="start">
            <Text color="gray.500">Account Type</Text>
            <Text fontWeight="bold" fontSize="lg">
              {CHALLENGE_TYPES[formData.challengeType].name}
            </Text>
          </VStack>
        </SimpleGrid>
      </Box>
      
      <List spacing={3} width="100%">
        <ListItem>
          <ListIcon as={FaCheck} color="green.500" />
          Your challenge starts now! You have {CHALLENGE_TYPES[formData.challengeType].duration} to meet the profit target.
        </ListItem>
        <ListItem>
          <ListIcon as={FaCheck} color="green.500" />
          Download MetaTrader 5 and log in with these credentials to start trading.
        </ListItem>
        <ListItem>
          <ListIcon as={FaCheck} color="green.500" />
          Review the trading rules in your dashboard to ensure you meet all requirements.
        </ListItem>
      </List>
      
      <Button
        colorScheme="blue"
        size="lg"
        onClick={() => router.push('/dashboard')}
      >
        Go to Dashboard
      </Button>
    </VStack>
  );

  return (
    <Layout>
      <Head>
        <title>{t('bitfund.challenge.signup')} | BitFund</title>
      </Head>
      
      <Box {...formStyles}>
        <VStack spacing={8}>
          <Heading 
            as="h1" 
            size="lg" 
            color={isDark ? 'white' : 'gray.800'}
            textAlign="center"
            bgGradient="linear(to-r, blue.400, blue.600)"
            bgClip="text"
          >
            {t('bitfund.challenge.title', 'Challenge Account Registration')}
          </Heading>

          <Stepper index={activeStep} width="100%" colorScheme="blue" mb={8}>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<Icon as={FaCheck} />}
                    incomplete={index + 1}
                    active={index + 1}
                  />
                </StepIndicator>
                <Box flexShrink="0">
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>
                <StepSeparator />
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {activeStep === 0 && renderBasicInfoForm()}
            {activeStep === 1 && renderChallengeSelection()}
            {activeStep === 2 && renderPaymentProcessing()}
            {activeStep === 3 && renderMT5Info()}

            {activeStep !== 3 && (
              <Text textAlign="center" mt={6}>
                {t('haveAccount')}{' '}
                <Link href="/login" passHref>
                  <ChakraLink color="blue.400">
                    {t('login')}
                  </ChakraLink>
                </Link>
              </Text>
            )}
          </form>
        </VStack>
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
