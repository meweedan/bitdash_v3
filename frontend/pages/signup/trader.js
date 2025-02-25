import { useState } from 'react';
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
  Heading,
  useColorMode,
  FormHelperText,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Checkbox,
  Textarea,
  Alert,
  AlertIcon,
  Divider,
  Stack,
  Flex,
  Icon,
  InputGroup,
  InputLeftAddon,
  InputRightAddon
} from '@chakra-ui/react';
import { FaLock, FaUser, FaChartLine } from 'react-icons/fa';
import Head from 'next/head';

const TRADING_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'professional', label: 'Professional' }
];

const ACCOUNT_TYPES = [
  { value: 'demo', label: 'Demo' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
  { value: 'vip', label: 'VIP' }
];

const FEE_DISCOUNT_TIERS = [
  { value: 'tier1', label: 'Tier 1' },
  { value: 'tier2', label: 'Tier 2' },
  { value: 'tier3', label: 'Tier 3' },
  { value: 'tier4', label: 'Tier 4' },
  { value: 'tier5', label: 'Tier 5' }
];

const formStyles = {
  position: "relative",
  maxW: "800px",
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
  _hover: { borderColor: "whiteAlpha.400" },
  _focus: { borderColor: "blue.400", bg: "rgba(255, 255, 255, 0.08)" }
};

export default function TraderSignup() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const toast = useToast();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const accentColor = useColorMode().colorMode === 'dark' ? 'blue.300' : 'blue.500';
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  const [formData, setFormData] = useState({
    // Account credentials
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Trader Profile
    tradingLevel: 'beginner',
    accountType: 'standard',
    tradingSince: '', // Expected format: YYYY-MM-DD
    leverageLimit: '100',
    feeDiscountTier: 'tier1',
    monthlyTradingGoal: '',
    notes: '',
    // Terms and Agreement
    agreedToTerms: false
  });

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

  const nextTab = () => {
    if (validateCurrentTab()) {
      setCurrentTab(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevTab = () => {
    setCurrentTab(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const validateCurrentTab = () => {
    // Tab 0: Account Credentials
    if (currentTab === 0) {
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
    // Tab 1: Trader Profile
    else if (currentTab === 1) {
      if (!formData.tradingSince) {
        toast({
          title: t('error'),
          description: t('tradingSinceRequired') || 'Trading Since date is required',
          status: 'error'
        });
        return false;
      }
      if (!formData.leverageLimit || isNaN(formData.leverageLimit)) {
        toast({
          title: t('error'),
          description: t('invalidLeverage'),
          status: 'error'
        });
        return false;
      }
    }
    // Tab 2: Terms & Agreement
    else if (currentTab === 2) {
      if (!formData.agreedToTerms) {
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
    if (!validateCurrentTab()) return;

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
          confirmed: true, // Adjust based on your flow
          blocked: false,
          // Use the default role for retail traders (usually 'authenticated' role)
          role: 1
        })
      });
      const userData = await userResponse.json();
      if (!userResponse.ok) {
        throw new Error(userData.error?.message || t('registrationFailed'));
      }

      // 2. Create retail trader profile
      const retailPayload = {
        data: {
          users_permissions_user: userData.user.id,
          status: 'pending',
          tradingLevel: formData.tradingLevel,
          accountType: formData.accountType,
          tradingSince: formData.tradingSince ? new Date(formData.tradingSince).toISOString() : null,
          leverageLimit: parseInt(formData.leverageLimit) || 100,
          feeDiscountTier: formData.feeDiscountTier,
          monthlyTradingGoal: parseFloat(formData.monthlyTradingGoal) || 0,
          notes: formData.notes,
          agreedToTerms: formData.agreedToTerms
        }
      };

      const retailResponse = await fetch(`${BASE_URL}/api/retail-traders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.jwt}`
        },
        body: JSON.stringify(retailPayload)
      });
      const retailData = await retailResponse.json();
      if (!retailResponse.ok) {
        throw new Error(t('retailProfileCreationFailed'));
      }

      toast({
        title: t('success'),
        description: t('retailRegistrationSubmitted'),
        status: 'success',
        duration: 5000
      });

      router.push('/retail/registration-confirmation');
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

  // Tab 0: Account Credentials
  const renderAccountTab = () => (
    <VStack spacing={6} align="stretch">
      <Heading size="md" color={isDark ? 'gray.300' : 'gray.700'}>
        <Flex align="center">
          <Icon as={FaUser} mr={2} color={accentColor} />
          {t('accountCredentials')}
        </Flex>
      </Heading>
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
        <FormHelperText>{t('usernameForLogin')}</FormHelperText>
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
        <FormHelperText>{t('primaryAdminEmail')}</FormHelperText>
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
          <FormHelperText>{t('passwordRequirements')}</FormHelperText>
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
        <Button colorScheme="blue" size="lg" onClick={nextTab} width="full">
          {t('next')}
        </Button>
      </Box>
    </VStack>
  );

  // Tab 1: Trader Profile
  const renderProfileTab = () => (
    <VStack spacing={6} align="stretch">
      <Heading size="md" color={isDark ? 'gray.300' : 'gray.700'}>
        <Flex align="center">
          <Icon as={FaChartLine} mr={2} color={accentColor} />
          {t('traderProfile')}
        </Flex>
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl isRequired>
          <FormLabel>{t('tradingLevel')}</FormLabel>
          <Input
            as="select"
            name="tradingLevel"
            value={formData.tradingLevel}
            onChange={handleInputChange}
            size="lg"
            {...inputStyles}
          >
            {TRADING_LEVELS.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </Input>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>{t('accountType')}</FormLabel>
          <Input
            as="select"
            name="accountType"
            value={formData.accountType}
            onChange={handleInputChange}
            size="lg"
            {...inputStyles}
          >
            {ACCOUNT_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Input>
        </FormControl>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl isRequired>
          <FormLabel>{t('tradingSince')}</FormLabel>
          <Input
            name="tradingSince"
            type="date"
            value={formData.tradingSince}
            onChange={handleInputChange}
            size="lg"
            {...inputStyles}
          />
          <FormHelperText>{t('tradingSinceHelper')}</FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>{t('leverageLimit')}</FormLabel>
          <InputGroup size="lg">
            <Input
              name="leverageLimit"
              type="number"
              value={formData.leverageLimit}
              onChange={handleInputChange}
              placeholder="100"
              {...inputStyles}
            />
            <InputRightAddon>:1</InputRightAddon>
          </InputGroup>
          <FormHelperText>{t('leverageLimitHelper')}</FormHelperText>
        </FormControl>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl isRequired>
          <FormLabel>{t('feeDiscountTier')}</FormLabel>
          <Input
            as="select"
            name="feeDiscountTier"
            value={formData.feeDiscountTier}
            onChange={handleInputChange}
            size="lg"
            {...inputStyles}
          >
            {FEE_DISCOUNT_TIERS.map(tier => (
              <option key={tier.value} value={tier.value}>
                {tier.label}
              </option>
            ))}
          </Input>
        </FormControl>
        <FormControl>
          <FormLabel>{t('monthlyTradingGoal')}</FormLabel>
          <InputGroup size="lg">
            <InputLeftAddon>$</InputLeftAddon>
            <Input
              name="monthlyTradingGoal"
              type="number"
              value={formData.monthlyTradingGoal}
              onChange={handleInputChange}
              placeholder={t('enterAmount')}
              {...inputStyles}
            />
            <InputRightAddon>USD</InputRightAddon>
          </InputGroup>
          <FormHelperText>{t('monthlyTradingGoalHelper')}</FormHelperText>
        </FormControl>
      </SimpleGrid>
      <FormControl>
        <FormLabel>{t('notes')}</FormLabel>
        <Textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder={t('optionalNotes')}
          size="lg"
          {...inputStyles}
        />
      </FormControl>
      <HStack justify="space-between" pt={4}>
        <Button variant="outline" onClick={prevTab}>
          {t('back')}
        </Button>
        <Button colorScheme="blue" onClick={nextTab}>
          {t('next')}
        </Button>
      </HStack>
    </VStack>
  );

  // Tab 2: Terms and Agreement
  const renderTermsTab = () => (
    <VStack spacing={6} align="stretch">
      <Heading size="md" color={isDark ? 'gray.300' : 'gray.700'}>
        <Flex align="center">
          <Icon as={FaLock} mr={2} color={accentColor} />
          {t('termsAndAgreement')}
        </Flex>
      </Heading>
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              {t('termsOfService')}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text fontSize="sm">{t('termsContent')}</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              {t('dataPolicy')}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text fontSize="sm">{t('dataPolicyContent')}</Text>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Checkbox
        name="agreedToTerms"
        isChecked={formData.agreedToTerms}
        onChange={handleCheckboxChange}
        colorScheme="blue"
      >
        {t('agreeToTerms')}
      </Checkbox>
      <HStack justify="space-between" pt={4}>
        <Button variant="outline" onClick={prevTab}>
          {t('back')}
        </Button>
        <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading}>
          {t('submit')}
        </Button>
      </HStack>
    </VStack>
  );

  return (
    <Layout>
      <Head>
        <title>{t('retailTraderSignup')}</title>
      </Head>
      <Box sx={formStyles}>
        <form onSubmit={handleSubmit}>
          {currentTab === 0 && renderAccountTab()}
          {currentTab === 1 && renderProfileTab()}
          {currentTab === 2 && renderTermsTab()}
        </form>
      </Box>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  };
}
