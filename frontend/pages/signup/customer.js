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
  Image,
  Avatar
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import Head from 'next/head';

const ROLES = {
  CUSTOMER: 4,
};

const formStyles = {
  position: "relative",
  maxW: "500px",
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

export default function CustomerSignup() {
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
    allergies: '',
    dietary_preferences: '',
    wallet_pin: '',
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
          role: ROLES.CUSTOMER
        })
      });

      const userData = await userResponse.json();
      if (!userResponse.ok) {
        throw new Error(userData.error?.message || t('registrationFailed'));
      }

      // 2. Create customer profile with wallet creation
      const profilePayload = {
        data: {
          fullName: formData.fullName,
          phone: formData.phone,
          wallet_pin: parseInt(formData.wallet_pin),
          allergies: formData.allergies ? formData.allergies.split(',').map(item => item.trim()) : [],
          dietary_preferences: formData.dietary_preferences ? formData.dietary_preferences.split(',').map(item => item.trim()) : [],
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

      // 3. Upload avatar if selected
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
          const errorData = await avatarUploadResponse.json();
          console.warn('Avatar upload failed:', errorData);
          // Non-critical error, continue with registration
        }
      }

      // 4. Update user with profile relation
      const updateUserResponse = await fetch(`${BASE_URL}/api/users/${userData.user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userData.jwt}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer_profile: profileData.data.id,
          role: ROLES.CUSTOMER
        })
      });

      if (!updateUserResponse.ok) {
        throw new Error(t('userUpdateFailed'));
      }

      // Store auth data
      localStorage.setItem('token', userData.jwt);
      localStorage.setItem('user', JSON.stringify({
        ...userData.user,
        role: ROLES.CUSTOMER,
        customer_profile: profileData.data
      }));

      toast({
        title: t('success'),
        description: t('registrationSuccessful'),
        status: 'success'
      });

      const hostname = window.location.hostname;
      if (hostname === 'menu.bitdash.app') {
        router.push('/menu/customer/dashboard');
      } else if (hostname === 'cash.bitdash.app') {
        router.push('/cash/client/dashboard');
      }

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

  return (
    <Layout>
      <Head>
        <title>{t('signup')} | BitDash</title>
      </Head>
      <Box {...formStyles}>
        <VStack spacing={8}>
          <Heading 
            as="h1" 
            size="lg" 
            color={isDark ? 'white' : 'gray.800'}
            textAlign="center"
          >
            {t('createAccount')}
          </Heading>

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
                  p={2}
                  mask
                  size="lg"
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

              {/* Optional Preferences */}
              <Accordion allowToggle w="full">
                <AccordionItem border="none">
                  <AccordionButton 
                    _hover={{ bg: 'transparent' }}
                    p={0}
                    color="blue.400"
                  >
                    <Box flex="1" textAlign="left">
                      {t('additionalPreferences')}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <VStack spacing={4}>
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
                          Optional: Upload a profile picture (max 5MB)
                        </FormHelperText>
                      </FormControl>

                      <FormControl>
                        <FormLabel>{t('allergies')}</FormLabel>
                        <Input
                          name="allergies"
                          value={formData.allergies}
                          onChange={handleInputChange}
                          placeholder={t('allergiesPlaceholder')}
                          {...inputStyles}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>{t('dietaryPreferences')}</FormLabel>
                        <Input
                          name="dietary_preferences"
                          value={formData.dietary_preferences}
                          onChange={handleInputChange}
                          placeholder={t('dietaryPreferencesPlaceholder')}
                          {...inputStyles}
                        />
                      </FormControl>
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="full"
                isLoading={loading}
                loadingText={t('creatingAccount')}
                mt={4}
              >
                {t('createAccount')}
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