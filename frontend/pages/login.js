import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Input, 
  FormControl, 
  FormLabel, 
  Heading, 
  Text, 
  VStack, 
  useToast, 
  useColorMode, 
  Spinner 
} from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';

const PLATFORM_ROUTES = {
  food: {
    operator: '/operator/dashboard',
    customer: '/customer/dashboard',
    captain: '/captain/dashboard',
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://food.bitdash.app'
  },
  cash: {
    merchant: '/merchant/dashboard',
    agent: '/agent/dashboard',
    client: '/client/dashboard',
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://cash.bitdash.app'
  },
  // work: {
  //   employer: '/employer/dashboard',
  //   employee: '/employee/dashboard',
  //   baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://work.bitdash.app'
  // },
  // ride : {
  //   captain: '/captain/dashboard',
  //   client: '/client/dashboard',
  //   baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://ride.bitdash.app'
  // },
  shop: {
    owner: '/owner/dashboard',
    customer: '/customer/dashboard',
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://shop.bitdash.app'
  }
};

const PROFILE_ENDPOINTS = {
  food: {
    operator: '/api/operators',
    customer: '/api/customer-profiles',
    captain: '/api/captains'
  },
  cash: {
    merchant: '/api/operators',
    agent: '/api/agents',
    client: '/api/customer-profiles'
  },
  // work: {
  //   employer: '/api/employers',
  //   employee: '/api/employees'
  // },
  // ride : {
  //   captain: '/api/captains',
  //   client: '/api/customer-profiles'
  // },
  shop: {
    owner: '/api/owners',
    customer: '/api/customer-profiles'
    }
};

const BUSINESS_TYPE_ROUTES = {
  restaurant: { platform: 'food', userType: 'operator' },
  captain: { platform: 'food', userType: 'captain' },
  merchant: { platform: 'cash', userType: 'merchant' },
  agent: { platform: 'cash', userType: 'agent' },
  customer: { platform: 'cash', userType: 'customer' },
  // employer: { platform: 'work', userType: 'employer' },
  // employee: { platform: 'work', userType: 'employee' },
  owner: { platform: 'shop', userType: 'owner' },
  client: { platform: 'food', userType: 'customer' },
  customer: { platform: 'shop', userType: 'customer' },
  // customer: { platform: 'ride', userType: 'customer' },
};

const getPlatformFromURL = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('cash')) return 'bitcash';
    if (hostname.includes('food')) return 'bitfood';
    if (hostname.includes('shop')) return 'bitshop';
    // if (hostname.includes('ride')) return 'bitride';
    // if (hostname.includes('work')) return 'bitwork';
    
    if (hostname === 'localhost') {
      const path = window.location.pathname;
      if (path.includes('/cash')) return 'bitcash';
      if (path.includes('/food')) return 'bitfood';
      if (path.includes('/shop')) return 'bitshop';
      // if (path.includes('/ride')) return 'bitride';
      // if (path.includes('/work')) return 'bitwork';
    }
  }
  return 'bitdash';
};

const getColorScheme = (platform, isDark) => {
  const colorSchemes = {
    bitcash: {
      bg: isDark ? 'whiteAlpha.50' : 'gray.50',
      text: isDark ? 'brand.bitcash.400' : 'brand.bitcash.600',
      button: 'brand.bitcash.500',
      hover: 'brand.bitcash.600',
      border: 'brand.bitcash.500'
    },
    bitfood: {
      bg: isDark ? 'whiteAlpha.50' : 'gray.50',
      text: isDark ? 'brand.bitfood.400' : 'brand.bitfood.600',
      button: 'brand.bitfood.500',
      hover: 'brand.bitfood.600',
      border: 'brand.bitfood.500'
    },
    bitshop: {
      bg: isDark ? 'whiteAlpha.50' : 'gray.50',
      text: isDark ? 'brand.bitshop.400' : 'brand.bitshop.600',
      button: 'brand.bitshop.500',
      hover: 'brand.bitshop.600',
      border: 'brand.bitshop.500'
    },
    // bitride: {
    //   bg: isDark ? 'whiteAlpha.50' : 'gray.50',
    //   text: isDark ? 'brand.bitride.400' : 'brand.bitride.600',
    //   button: 'brand.bitride.500',
    //   hover: 'brand.bitride.600',
    //   border: 'brand.bitride.500'
    // },
    // bitwork: {
    //   bg: isDark ? 'whiteAlpha.50' : 'gray.50',
    //   text: isDark ? 'brand.bitwork.400' : 'brand.bitwork.600',
    //   button: 'brand.bitwork.500',
    //   hover: 'brand.bitwork.600',
    //   border: 'brand.bitwork.500'
    // },
    bitdash: {
      bg: isDark ? 'whiteAlpha.50' : 'gray.50',
      text: isDark ? 'gray.200' : 'gray.800',
      button: 'brand.bitdash.500',
      hover: 'brand.bitdash.600',
      border: 'brand.bitdash.500'
    }
  };

  return colorSchemes[platform] || colorSchemes.bitdash;
};

const LoginPage = () => {
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [currentPlatform, setCurrentPlatform] = useState('bitdash');
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const platform = getPlatformFromURL();
    setCurrentPlatform(platform);
    checkAuth();
  }, []);

  const colors = getColorScheme(currentPlatform, isDark);

  const formStyles = {
    maxWidth: "600px",
    mx: "auto",
    mt: 8,
    p: 6,
    borderRadius: "xl",
    bg: colors.bg,
    borderWidth: "0.1px",
    borderColor: colors.border,
    boxShadow: "xl"
  };

  const inputStyles = {
    variant: "filled",
    bg: isDark ? 'whiteAlpha.50' : 'white',
    borderWidth: "1px",
    borderColor: colors.border,
    _hover: {
      borderColor: colors.hover,
    },
    _focus: {
      borderColor: colors.hover,
      boxShadow: `0 0 0 1px ${colors.hover}`,
    }
  };

  const buttonStyles = {
    variant: currentPlatform.includes('bit') ? `${currentPlatform}-solid` : 'bitdash-solid',
    bg: colors.button,
    color: 'white',
    _hover: {
      bg: colors.hover,
      transform: 'translateY(-2px)',
    },
    _active: {
      transform: 'translateY(0)',
    },
    transition: 'all 0.2s',
    // Override any default styles
    _disabled: {
      bg: colors.button + '80', // 80 for opacity
      _hover: { bg: colors.button + '80' }
    }
  };

  const checkBusinessType = async (token, userId) => {
  try {
    console.log('Checking business type for user:', userId);
    console.log('Current platform:', currentPlatform);

    // Specifically for shop platform
    if (currentPlatform === 'bitshop') {
      const ownerResponse = await fetch(
        `${BASE_URL}/api/owners?filters[users_permissions_user][id][$eq]=${userId}&populate=*`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Owner API response status:', ownerResponse.status);

      if (ownerResponse.ok) {
        const { data } = await ownerResponse.json();
        console.log('Owner API data:', data);

        if (data && data.length > 0) {
          console.log('Found owner profile');
          return 'owner';
        }
      }
    }

    // Fallback for other platforms or if owner check fails
    const responses = await Promise.all([
      fetch(`${BASE_URL}/api/operators?filters[users_permissions_user][id][$eq]=${userId}&populate=*`, 
        { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${BASE_URL}/api/owners?filters[users_permissions_user][id][$eq]=${userId}&populate=*`, 
        { headers: { Authorization: `Bearer ${token}` } })
    ]);

    for (const response of responses) {
      console.log(`Response from ${response.url} - status: ${response.status}`);
      
      if (response.ok) {
        const { data } = await response.json();
        console.log('Response data:', data);

        if (data && data.length > 0) {
          // Check if it's a shop owner specifically
          if (response.url.includes('/api/owners')) {
            return 'owner';
          }
          return data[0]?.attributes?.businessType;
        }
      }
    }

    console.log('No business type found');
    return null;
  } catch (error) {
    console.error('Business type check error:', error);
    return null;
  }
};

const checkProfileType = async (token, userId, endpoint) => {
  try {
    const response = await fetch(
      `${BASE_URL}${endpoint}?filters[user][id][$eq]=${userId}&populate=*`,
      { 
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );

    if (!response.ok) {
      console.error('Profile type check failed:', await response.text());
      return false;
    }

    const { data } = await response.json();
    console.log('Profile data:', data);

    return data && data.length > 0;
  } catch (error) {
    console.error('Profile type check error:', error);
    return false;
  }
};

const determineUserType = async (token, userId) => {
  console.log('Determining user type for:', { 
    userId, 
    platform: currentPlatform 
  });

  const platform = currentPlatform.replace('bit', '');
  const businessType = await checkBusinessType(token, userId);
  
  console.log('Business type found:', businessType);

  // Direct match for shop platform
  if (platform === 'shop' && businessType === 'owner') {
    return 'owner';
  }

  if (businessType && BUSINESS_TYPE_ROUTES[businessType]) {
    const route = BUSINESS_TYPE_ROUTES[businessType];
    if (route.platform === platform) {
      console.log('Matched business type route:', route);
      return route.userType;
    }
  }

  const platformEndpoints = PROFILE_ENDPOINTS[platform];
  if (!platformEndpoints) {
    console.log('No platform endpoints found');
    return null;
  }

  for (const [userType, endpoint] of Object.entries(platformEndpoints)) {
    console.log(`Checking profile for userType: ${userType}, endpoint: ${endpoint}`);
    const profileExists = await checkProfileType(token, userId, endpoint);
    if (profileExists) {
      console.log(`Profile found for userType: ${userType}`);
      return userType;
    }
  }

  console.log('No matching user type found');
  return null;
};

  const handleRedirect = (userType) => {
    const platformConfig = PLATFORM_ROUTES[currentPlatform.replace('bit', '')];
    if (!platformConfig || !platformConfig[userType]) return;

    const route = platformConfig[userType];
    
    if (process.env.NODE_ENV === 'development') {
      router.push(route);
    } else {
      window.location.href = `${platformConfig.baseUrl}${route}`;
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || !user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      const userType = await determineUserType(token, user.id);
      if (userType) {
        handleRedirect(userType);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };
  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: t('error'),
        description: t('invalidInput.credentials'),
        status: 'error',
        duration: 2000
      });
      return;
    }

    setIsLoading(true);

    try {
      const loginRes = await fetch(`${BASE_URL}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password }),
      });

      if (!loginRes.ok) {
        const error = await loginRes.json();
        throw new Error(error.error?.message || 'Login failed');
      }

      const loginData = await loginRes.json();
      localStorage.setItem('token', loginData.jwt);
      localStorage.setItem('user', JSON.stringify(loginData.user));

      const userType = await determineUserType(loginData.jwt, loginData.user.id);
      
      if (userType) {
        handleRedirect(userType);
        toast({
          title: t('success'),
          description: t('loginSuccess'),
          status: 'success',
          duration: 2000
        });
      } else {
        throw new Error('Invalid account type for this platform');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: t('error'),
        description: error.message || t('unknownError'),
        status: 'error',
        duration: 3000
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <Layout>
      <Head>
        <title>{t('login')}</title>
      </Head>
      
      <Box {...formStyles} mt="20" p="8">
        <VStack spacing={6}>
          <Heading 
            as="h1" 
            size="lg" 
            color={colors.text}
          >
            {t('login')}
          </Heading>

          <FormControl isRequired>
            <FormLabel color={colors.text}>{t('email')}</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              {...inputStyles}
              color={colors.text}
              placeholder={t('email')}
              disabled={isLoading}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel color={colors.text}>{t('password')}</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              {...inputStyles}
              color={colors.text}
              placeholder={t('password')}
              disabled={isLoading}
            />
          </FormControl>

          <Button 
            width="100%" 
            {...buttonStyles} 
            onClick={handleLogin}
            isLoading={isLoading}
            variant={`${currentPlatform}-solid`}
            bg={colors.button} 
            loadingText={t('loggingIn')}
          >
            {t('login')}
          </Button>

          <VStack spacing={2}>
            <Text color={colors.text}>
              {t('noAccount')} {" "}
              <Button 
                variant="link" 
                color={colors.button}
                onClick={() => router.push('/signup')}
                _hover={{ color: colors.hover }}
              >
                {t('signup')}
              </Button>
            </Text>
            
            <Button
              variant={`${currentPlatform}-outline`}
              onClick={() => router.push('/forgot-password')}
              borderColor={colors.border}
              color={colors.text}
              _hover={{
                bg: colors.button,
                color: 'white'
              }}
            >
              {t('forgotPassword')}
            </Button>
          </VStack>
        </VStack>
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

export default LoginPage;