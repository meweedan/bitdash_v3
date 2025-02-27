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
  Divider
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import RiskDisclosure from '@/components/RiskDisclosure';
import Link from 'next/link';
import Head from 'next/head';

const ROLES = {
  IB: 8, // Adjust this to match your actual introducing broker role ID
};

const IB_TYPES = [
  { value: 'individual', label: 'Individual' },
  { value: 'corporate', label: 'Corporate/Company' },
  { value: 'affiliate', label: 'Online Affiliate' }
];

const COMMISSION_PLANS = [
  { value: 'standard', label: 'Standard (30% Commission)' },
  { value: 'premium', label: 'Premium (40% Commission, minimum 5 active clients)' },
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

export default function IBSignup() {
  const { t } = useTranslation('common');
  const [agreedToRiskDisclosure, setAgreedToRiskDisclosure] = useState(false);
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
    ibType: 'individual',
    companyName: '',
    companyRegistrationNumber: '',
    website: '',
    commissionPlan: 'standard',
    paymentMethod: 'bank_transfer',
    bankDetails: '',
    cryptoAddress: '',
    marketingExperience: '',
    expectedClients: '',
    agreedToTerms: false,
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

  const handleRiskAcceptance = (accepted) => {
    if (accepted) {
      setAgreedToRiskDisclosure(true);
    }
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
    
    if (formData.ibType === 'corporate' && (!formData.companyName || !formData.companyRegistrationNumber)) {
      toast({
        title: t('error'),
        description: t('companyInfoRequired'),
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

  const generateReferralCode = () => {
    // Generate a random alphanumeric string for referral code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
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
          confirmed: false, // Set to false as IBs may need approval
          blocked: false,
          role: ROLES.IB
        })
      });

      const userData = await userResponse.json();
      if (!userResponse.ok) {
        throw new Error(userData.error?.message || t('registrationFailed'));
      }

      // 2. Create IB profile
      const ibPayload = {
        data: {
          users_permissions_user: userData.user.id,
          status: 'pending',
          ibType: formData.ibType,
          companyName: formData.companyName,
          companyRegistrationNumber: formData.companyRegistrationNumber,
          website: formData.website,
          referralCode: generateReferralCode(),
          commissionPlan: formData.commissionPlan,
          commissionRate: formData.commissionPlan === 'standard' ? 30 : 40,
          minimumCommissionPayout: 100,
          totalReferrals: 0,
          activeClients: 0,
          totalCommissionEarned: 0,
          unpaidCommission: 0,
          kycVerified: false,
          preferredPayoutMethod: formData.paymentMethod,
          payoutFrequency: 'monthly',
          paymentDetails: JSON.stringify({
            bankDetails: formData.bankDetails,
            cryptoAddress: formData.cryptoAddress
          }),
          marketingPermissions: JSON.stringify({
            canUseLogos: true,
            canPublishRates: true,
            limitedContent: true
          }),
          performanceMetrics: JSON.stringify({
            conversionRate: 0,
            avgClientValue: 0,
            retentionRate: 0
          }),
          agreedToTerms: formData.agreedToTerms,
          notes: formData.marketingExperience,
          publishedAt: new Date().toISOString()
        }
      };

      const ibResponse = await fetch(`${BASE_URL}/api/introducing-brokers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.jwt}`
        },
        body: JSON.stringify(ibPayload)
      });

      const ibData = await ibResponse.json();
      if (!ibResponse.ok) {
        throw new Error(t('ibProfileCreationFailed'));
      }

      // 3. Create wallet for the IB
      const walletPayload = {
        data: {
          balance: 0,
          currency: 'USD',
          isActive: true,
          walletId: `IB-${userData.user.id}-${Date.now()}`,
          wallet_type: 'broker',
          dailyLimit: 10000, // Higher limits for IBs
          monthlyLimit: 100000,
          introducing_broker: ibData.data.id
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
        avatarFormData.append('ref', 'api::introducing-broker.introducing-broker');
        avatarFormData.append('refId', ibData.data.id);
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

      // 5. Update IB with wallet relation
      await fetch(`${BASE_URL}/api/introducing-brokers/${ibData.data.id}`, {
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

      toast({
        title: t('success'),
        description: t('ibRegistrationSuccessful'),
        status: 'success',
        duration: 5000
      });

      // Store auth data
      localStorage.setItem('token', userData.jwt);
      localStorage.setItem('user', JSON.stringify({
        ...userData.user,
        role: ROLES.IB,
        introducing_broker: ibData.data
      }));

      // Redirect to dashboard after successful registration
      router.push('/ib/dashboard');

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
        <title>{t('ibSignup')} | BitTrade</title>
      </Head>
      <Box {...formStyles}>
        <VStack spacing={8}>
          <Heading 
            as="h1" 
            size="lg" 
            color={isDark ? 'white' : 'gray.800'}
            textAlign="center"
            bgGradient="linear(to-r, brand.bittrade.400, brand.bittrade.600)"
            bgClip="text"
          >
            {t('becomeIntroducingBroker')}
          </Heading>

          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Text fontSize="sm">
              {t('ibAccountReviewNotice', 'Your IB application will be reviewed by our team before approval. This typically takes 1-2 business days.')}
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

              {/* Personal/Company Info */}
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

              {/* IB Specific Information */}
              <FormControl isRequired>
                <FormLabel>{t('ibType')}</FormLabel>
                <Select
                  name="ibType"
                  value={formData.ibType}
                  onChange={handleInputChange}
                  size="lg"
                  {...inputStyles}
                >
                  {IB_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Conditional Company Information */}
              {formData.ibType === 'corporate' && (
                <>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                    <FormControl isRequired>
                      <FormLabel>{t('companyName')}</FormLabel>
                      <Input
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder={t('enterCompanyName')}
                        size="lg"
                        {...inputStyles}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>{t('registrationNumber')}</FormLabel>
                      <Input
                        name="companyRegistrationNumber"
                        value={formData.companyRegistrationNumber}
                        onChange={handleInputChange}
                        placeholder={t('enterRegistrationNumber')}
                        size="lg"
                        {...inputStyles}
                      />
                    </FormControl>
                  </SimpleGrid>
                </>
              )}

              {/* Website (Optional) */}
              <FormControl>
                <FormLabel>{t('website')} ({t('optional')})</FormLabel>
                <Input
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder={t('enterWebsite')}
                  size="lg"
                  {...inputStyles}
                />
              </FormControl>

              {/* Commission Plan */}
              <FormControl isRequired>
                <FormLabel>{t('commissionPlan')}</FormLabel>
                <Select
                  name="commissionPlan"
                  value={formData.commissionPlan}
                  onChange={handleInputChange}
                  size="lg"
                  {...inputStyles}
                >
                  {COMMISSION_PLANS.map(plan => (
                    <option key={plan.value} value={plan.value}>
                      {plan.label}
                    </option>
                  ))}
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
                  {t('Enter 6-digit PIN for your wallet security')}
                </FormHelperText>
              </FormControl>

              {/* Payment Method */}
              <FormControl isRequired>
                <FormLabel>{t('preferredPayoutMethod')}</FormLabel>
                <Select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  size="lg"
                  {...inputStyles}
                >
                  <option value="bank_transfer">{t('bankTransfer')}</option>
                  <option value="crypto">{t('cryptocurrency')}</option>
                  <option value="internal_transfer">{t('internalTransfer')}</option>
                </Select>
              </FormControl>

              {/* Conditional Payment Details */}
              {formData.paymentMethod === 'bank_transfer' && (
                <FormControl>
                  <FormLabel>{t('bankDetails')}</FormLabel>
                  <Textarea
                    name="bankDetails"
                    value={formData.bankDetails}
                    onChange={handleInputChange}
                    placeholder={t('enterBankDetailsForCommission')}
                    size="lg"
                    {...inputStyles}
                  />
                </FormControl>
              )}

              {formData.paymentMethod === 'crypto' && (
                <FormControl>
                  <FormLabel>{t('cryptoAddress')}</FormLabel>
                  <Input
                    name="cryptoAddress"
                    value={formData.cryptoAddress}
                    onChange={handleInputChange}
                    placeholder={t('enterCryptoAddress')}
                    size="lg"
                    {...inputStyles}
                  />
                </FormControl>
              )}

              {/* Marketing Experience */}
              <FormControl>
                <FormLabel>{t('marketingExperience')}</FormLabel>
                <Textarea
                  name="marketingExperience"
                  value={formData.marketingExperience}
                  onChange={handleInputChange}
                  placeholder={t('describeMarketingExperience')}
                  size="lg"
                  {...inputStyles}
                />
              </FormControl>

              {/* Expected Clients */}
              <FormControl>
                <FormLabel>{t('expectedClients')}</FormLabel>
                <Select
                  name="expectedClients"
                  value={formData.expectedClients}
                  onChange={handleInputChange}
                  size="lg"
                  {...inputStyles}
                >
                  <option value="1-5">1-5 {t('clients')}</option>
                  <option value="6-20">6-20 {t('clients')}</option>
                  <option value="21-50">21-50 {t('clients')}</option>
                  <option value="50+">50+ {t('clients')}</option>
                </Select>
              </FormControl>

              {/* Profile Picture */}
              <FormControl>
                <FormLabel>{t('profilePicture')}</FormLabel>
                <HStack spacing={4} align="center">
                  {previewAvatar && (
                    <Avatar 
                      size="lg" 
                      src={previewAvatar} 
                      name={formData.fullName || formData.companyName}
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
                  {t('profilePictureHelper', 'Optional: Upload a profile picture or company logo (max 5MB)')}
                </FormHelperText>
              </FormControl>

              <Divider my={2} />

              {/* Terms and Conditions */}
              <FormControl isRequired>
                <Checkbox
                  name="agreedToTerms"
                  isChecked={formData.agreedToTerms}
                  onChange={handleCheckboxChange}
                  colorScheme="blue"
                  size="lg"
                >
                  <Text fontSize="sm">
                    {t('ibTermsAgreement', 'I agree to the')} {' '}
                    <ChakraLink color="blue.400" href="/policies/ib-agreement" target="_blank">
                      {t('ibAgreementTerms')}
                    </ChakraLink>
                    {' '} {t('andThe')} {' '}
                    <ChakraLink color="blue.400" href="/policies/privacy" target="_blank">
                      {t('privacyPolicy')}
                    </ChakraLink>
                  </Text>
                </Checkbox>
              </FormControl>

              <FormControl isRequired>
                <HStack spacing={2} align="center">
                  <Checkbox
                    isChecked={agreedToRiskDisclosure}
                    onChange={(e) => setAgreedToRiskDisclosure(e.target.checked)}
                    colorScheme="blue"
                  >
                    <Text fontSize="sm">
                      {t('agreeToRiskDisclosure', 'I have read and agree to the Risk Disclosure Statement')}
                    </Text>
                  </Checkbox>
                  
                  <RiskDisclosure 
                    platform="BitTrade" 
                    accountType="ib" 
                    onAccept={handleRiskAcceptance}
                  />
                </HStack>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="full"
                isLoading={loading}
                loadingText={t('submittingApplication')}
                mt={4}
              >
                {t('submitIBApplication')}
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