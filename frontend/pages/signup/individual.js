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
  Textarea,
  Alert,
  AlertIcon,
  Divider,
  Radio,
  RadioGroup,
  Stack
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import Head from 'next/head';

const ROLES = {
  INVESTOR: 9, // Adjust this to match your actual investor role ID
};

const RISK_PREFERENCES = [
  { value: 'conservative', label: 'Conservative (Lower risk, stable returns)' },
  { value: 'moderate', label: 'Moderate (Balanced risk and returns)' },
  { value: 'aggressive', label: 'Aggressive (Higher risk, potential for higher returns)' }
];

const INVESTMENT_PERIODS = [
  { value: 3, label: '3 months minimum' },
  { value: 6, label: '6 months minimum' },
  { value: 12, label: '12 months minimum' },
  { value: 24, label: '24 months or longer' }
];

const formStyles = {
  position: "relative",
  maxW: "600px",
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

export default function IndividualInvestorSignup() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const toast = useToast();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    wallet_pin: '',
    taxID: '',
    investorType: 'individual',
    riskPreference: 'moderate',
    minimumInvestmentPeriod: 3,
    expectedInvestment: '',
    returnExpectation: '',
    investmentGoals: '',
    priorExperience: '',
    preferredPaymentMethod: JSON.stringify({
      bankTransfer: true,
      crypto: false
    }),
    bankDetails: '',
    cryptoAddress: '',
    agreedToTerms: false,
    accreditedInvestor: false,
    avatar: null
  });

  const [previewAvatar, setPreviewAvatar] = useState(null);

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

  const validateForm = () => {
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
    
    if (!formData.agreedToTerms) {
      toast({
        title: t('error'),
        description: t('mustAgreeToTerms'),
        status: 'error'
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
          role: ROLES.INVESTOR
        })
      });

      const userData = await userResponse.json();
      if (!userResponse.ok) {
        throw new Error(userData.error?.message || t('registrationFailed'));
      }

      // 2. Create investor profile
      const investorPayload = {
        data: {
          users_permissions_user: userData.user.id,
          status: 'pending',
          investorType: formData.investorType,
          totalInvestment: 0,
          availableCapital: 0,
          allocatedCapital: 0,
          riskPreference: formData.riskPreference,
          returnExpectation: parseFloat(formData.returnExpectation) || 0,
          minimumInvestmentPeriod: parseInt(formData.minimumInvestmentPeriod),
          kycVerified: false,
          accreditedInvestor: formData.accreditedInvestor,
          profitShareRatio: 20, // Default profit share ratio
          taxID: formData.taxID,
          preferredPaymentMethod: formData.preferredPaymentMethod,
          investmentPerformance: JSON.stringify({
            totalReturn: 0,
            annualizedReturn: 0,
            maxDrawdown: 0,
            successRate: 0
          }),
          agreedToTerms: formData.agreedToTerms,
          publishedAt: new Date().toISOString()
        }
      };

      const investorResponse = await fetch(`${BASE_URL}/api/investors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.jwt}`
        },
        body: JSON.stringify(investorPayload)
      });

      const investorData = await investorResponse.json();
      if (!investorResponse.ok) {
        throw new Error(t('investorProfileCreationFailed'));
      }

      // 3. Create wallet for the investor
      const walletPayload = {
        data: {
          balance: 0,
          currency: 'USD',
          isActive: true,
          walletId: `INV-${userData.user.id}-${Date.now()}`,
          wallet_type: 'investor',
          dailyLimit: 50000, // Higher limits for investors
          monthlyLimit: 200000,
          investor: investorData.data.id
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

      // 4. Upload avatar if selected
      if (formData.avatar) {
        const avatarFormData = new FormData();
        avatarFormData.append('files', formData.avatar);
        avatarFormData.append('ref', 'api::investor.investor');
        avatarFormData.append('refId', investorData.data.id);
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

      // 5. Update investor with wallet relation
      await fetch(`${BASE_URL}/api/investors/${investorData.data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.jwt}`
        },
        body: JSON.stringify({
          data: {
            wallets: [walletData.data.id]
          }
        })
      });

      toast({
        title: t('success'),
        description: t('investorRegistrationSuccessful'),
        status: 'success',
        duration: 5000
      });

      // Store auth data
      localStorage.setItem('token', userData.jwt);
      localStorage.setItem('user', JSON.stringify({
        ...userData.user,
        role: ROLES.INVESTOR,
        investor: investorData.data
      }));

      // Redirect to dashboard after successful registration
      router.push('/investor/dashboard');

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

  return (
    <Layout>
      <Head>
        <title>{t('investorSignup')} | BitInvest</title>
      </Head>
      <Box {...formStyles}>
        <VStack spacing={8}>
          <Heading 
            as="h1" 
            size="lg" 
            color={isDark ? 'white' : 'gray.800'}
            textAlign="center"
            bgGradient="linear(to-r, brand.bitinvest.400, brand.bitinvest.600)"
            bgClip="text"
          >
            {t('becomeAnInvestor')}
          </Heading>

          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Text fontSize="sm">
              {t('investorMinDeposit', 'Individual investors can start with as little as $150.')}
            </Text>
          </Alert>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={6}>
              {/* Account Credentials */}
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

              {/* Personal Info */}
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

              {/* Contact Info */}
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

              {/* Security */}
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

              {/* Tax ID (Optional) */}
              <FormControl>
                <FormLabel>{t('taxID')} ({t('optional')})</FormLabel>
                <Input
                  name="taxID"
                  value={formData.taxID}
                  onChange={handleInputChange}
                  placeholder={t('enterTaxID')}
                  size="lg"
                  {...inputStyles}
                />
                <FormHelperText>
                  {t('taxIDHelper', 'Your tax identification number for reporting purposes')}
                </FormHelperText>
              </FormControl>

              {/* Investor Specific Information */}
              <FormControl isRequired>
                <FormLabel>{t('riskPreference')}</FormLabel>
                <RadioGroup 
                  name="riskPreference" 
                  value={formData.riskPreference}
                  onChange={(value) => setFormData(prev => ({ ...prev, riskPreference: value }))}
                >
                  <Stack direction="column" spacing={3}>
                    {RISK_PREFERENCES.map(risk => (
                      <Radio key={risk.value} value={risk.value} colorScheme="blue">
                        {risk.label}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </FormControl>

              {/* Investment Period */}
              <FormControl isRequired>
                <FormLabel>{t('minimumInvestmentPeriod')}</FormLabel>
                <RadioGroup 
                  name="minimumInvestmentPeriod" 
                  value={formData.minimumInvestmentPeriod.toString()}
                  onChange={(value) => setFormData(prev => ({ ...prev, minimumInvestmentPeriod: parseInt(value) }))}
                >
                  <Stack direction="column" spacing={3}>
                    {INVESTMENT_PERIODS.map(period => (
                      <Radio key={period.value} value={period.value.toString()} colorScheme="blue">
                        {period.label}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
                <FormHelperText>
                  {t('investmentPeriodHelper', 'Longer investment periods may receive preferential allocation to top traders')}
                </FormHelperText>
              </FormControl>

              {/* Expected Investment */}
              <FormControl>
                <FormLabel>{t('expectedInvestment')} ({t('optional')})</FormLabel>
                <Select
                  name="expectedInvestment"
                  value={formData.expectedInvestment}
                  onChange={handleInputChange}
                  size="lg"
                  {...inputStyles}
                >
                  <option value="">{t('selectAmount')}</option>
                  <option value="150-1000">$150 - $1,000</option>
                  <option value="1001-10000">$1,001 - $10,000</option>
                  <option value="10001-50000">$10,001 - $50,000</option>
                  <option value="50001-100000">$50,001 - $100,000</option>
                  <option value="100001+">$100,001+</option>
                </Select>
                <FormHelperText>
                  {t('expectedInvestmentHelper', 'This helps us prepare suitable trader allocations')}
                </FormHelperText>
              </FormControl>

              {/* Return Expectation */}
              <FormControl>
                <FormLabel>{t('returnExpectation')} ({t('optional')})</FormLabel>
                <Input
                  name="returnExpectation"
                  value={formData.returnExpectation}
                  onChange={handleInputChange}
                  placeholder={t('enterExpectedAnnualReturn')}
                  size="lg"
                  type="number"
                  {...inputStyles}
                />
                <FormHelperText>
                  {t('returnExpectationHelper', 'What percentage annual return are you aiming for?')}
                </FormHelperText>
              </FormControl>

              {/* Investment Goals */}
              <FormControl>
                <FormLabel>{t('investmentGoals')} ({t('optional')})</FormLabel>
                <Textarea
                  name="investmentGoals"
                  value={formData.investmentGoals}
                  onChange={handleInputChange}
                  placeholder={t('describeInvestmentGoals')}
                  size="lg"
                  {...inputStyles}
                />
              </FormControl>

              {/* Prior Experience */}
              <FormControl>
                <FormLabel>{t('priorExperience')} ({t('optional')})</FormLabel>
                <Select
                  name="priorExperience"
                  value={formData.priorExperience}
                  onChange={handleInputChange}
                  size="lg"
                  {...inputStyles}
                >
                  <option value="">{t('selectExperience')}</option>
                  <option value="none">{t('noExperience')}</option>
                  <option value="stocks">{t('stocksExperience')}</option>
                  <option value="forex">{t('forexExperience')}</option>
                  <option value="crypto">{t('cryptoExperience')}</option>
                  <option value="multiple">{t('multipleMarkets')}</option>
                  <option value="professional">{t('professionalInvestor')}</option>
                </Select>
              </FormControl>

              {/* Wallet PIN */}
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
                  {t('walletPINRequirement', 'Enter 6-digit PIN for your wallet security')}
                </FormHelperText>
              </FormControl>

              {/* Profile Picture */}
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
                  {t('profilePictureHelper', 'Optional: Upload a profile picture (max 5MB)')}
                </FormHelperText>
              </FormControl>

              <Divider my={2} />

              {/* Accredited Investor */}
              <FormControl>
                <Checkbox
                  name="accreditedInvestor"
                  isChecked={formData.accreditedInvestor}
                  onChange={handleCheckboxChange}
                  colorScheme="blue"
                >
                  <Text>
                    {t('accreditedInvestor', 'I am an accredited investor')}
                    <Tooltip label={t('accreditedInvestorHelper', 'Accredited investors may have access to additional investment opportunities')}>
                      <InfoIcon ml={2} />
                    </Tooltip>
                  </Text>
                </Checkbox>
              </FormControl>

              {/* Terms and Conditions */}
              <FormControl isRequired>
                <Checkbox
                  name="agreedToTerms"
                  isChecked={formData.agreedToTerms}
                  onChange={handleCheckboxChange}
                  colorScheme="blue"
                >
                  <Text fontSize="sm">
                    {t('investorTermsAgreement', 'I agree to the')} {' '}
                    <ChakraLink color="blue.400" href="/terms/investor-agreement" target="_blank">
                      {t('investorAgreementTerms')}
                    </ChakraLink>
                    {' '} {t('andThe')} {' '}
                    <ChakraLink color="blue.400" href="/terms/privacy-policy" target="_blank">
                      {t('privacyPolicy')}
                    </ChakraLink>
                  </Text>
                </Checkbox>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="full"
                isLoading={loading}
                loadingText={t('creatingAccount')}
                mt={4}
              >
                {t('createInvestorAccount')}
              </Button>

              <Text textAlign="center">
                {t('haveAccount')}{' '}
                <Link href="/login" passHref>
                  <ChakraLink color="blue.400">
                    {t('login')}
                  </ChakraLink>
                </Link>
              </Text>
            </VStack>
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