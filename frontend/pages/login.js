import { useState, useEffect } from 'react';
import { Box, Button, Input, FormControl, FormLabel, Heading, Text, VStack, useToast, useColorMode, Spinner } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';
import useSubdomain from '@/hooks/useSubdomain';

const PLATFORM_ROUTES = {
  food: {
    operator: '/food/operator/dashboard',
    customer: '/food/customer/dashboard',
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://food.bitdash.app'
  },
  eats: {
    captain: '/eats/captain/dashboard',
    customer: '/eats/customer/dashboard',
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://eats.bitdash.app'
  },
  cash: {
    merchant: '/cash/merchant/dashboard',
    agent: '/cash/agent/dashboard',
    client: '/cash/client/dashboard',
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://cash.bitdash.app'
  }
};

const PROFILE_ENDPOINTS = {
  food: {
    operator: '/api/operators',
    customer: '/api/customer-profiles'
  },
  eats: {
    captain: '/api/captains',
    customer: '/api/customer-profiles'
  },
  cash: {
    merchant: '/api/operators',
    agent: '/api/agents',
    client: '/api/customer-profiles'
  }
};

const BUSINESS_TYPE_ROUTES = {
  restaurant: { platform: 'food', userType: 'operator' },
  trader: { platform: 'stock', userType: 'trader' },
  merchant: { platform: 'cash', userType: 'merchant' },
  agent: { platform: 'cash', userType: 'agent' },
  captain: { platform: 'eats', userType: 'captain' }
};

const formStyles = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { base: "90%", sm: "400px" },
  maxWidth: "400px",
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
  _focus: {
    borderColor: "blue.400",
    bg: "rgba(255, 255, 255, 0.08)",
  }
};

const buttonStyles = {
  bg: "blue.500",
  color: "white",
  _hover: {
    bg: "blue.600",
    transform: 'translateY(-2px)'
  },
  _active: { bg: "blue.700" },
  transition: "all 0.2s"
};

const LoginPage = () => {
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { colorMode } = useColorMode();
  const { platform } = useSubdomain();
  const isDark = colorMode === 'dark';
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const hostname = window.location.hostname;
    console.log('Current hostname:', hostname);
    console.log('Detected platform:', platform);
  }, [platform]);

  const handleRedirect = (userType) => {
    const platformConfig = PLATFORM_ROUTES[platform];
    if (!platformConfig || !platformConfig[userType]) return;

    const route = platformConfig[userType];
    
    if (process.env.NODE_ENV === 'development') {
      router.push(route);
    } else {
      window.location.href = `${platformConfig.baseUrl}${route}`;
    }
  };

  const checkBusinessType = async (token, userId) => {
    const hostname = window.location.hostname;
    const isEats = hostname.includes('eats.');

    if (isEats) {
      console.log('Checking captain profile...');
      const response = await fetch(
        `${BASE_URL}/api/captains?filters[users_permissions_user][id][$eq]=${userId}&populate=*`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        const { data } = await response.json();
        console.log('Captain profile response:', data);
        if (data?.[0]) return 'captain';
      }
      return null;
    }

    const response = await fetch(
      `${BASE_URL}/api/operators?filters[users_permissions_user][id][$eq]=${userId}&populate=*`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.ok) return null;

    const { data } = await response.json();
    if (!data?.[0]?.attributes?.businessType) return null;

    return data[0].attributes.businessType;
  };

  const checkProfileType = async (token, userId, endpoint) => {
    const response = await fetch(
      `${BASE_URL}${endpoint}?filters[users_permissions_user][id][$eq]=${userId}&populate=*`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.ok) return false;
    const { data } = await response.json();
    return data?.[0] ? true : false;
  };

  const determineUserType = async (token, userId) => {
    const hostname = window.location.hostname;
    const currentPlatform = hostname.includes('eats.') ? 'eats' : platform;
    console.log('Current hostname:', hostname);
    console.log('Platform from hook:', platform);
    console.log('Using platform:', currentPlatform);

    const businessType = await checkBusinessType(token, userId);
    console.log('Business type:', businessType);
    
    if (businessType && BUSINESS_TYPE_ROUTES[businessType]) {
      const route = BUSINESS_TYPE_ROUTES[businessType];
      if (route.platform === currentPlatform) {
        return route.userType;
      }
      return null;
    }

    const platformEndpoints = PROFILE_ENDPOINTS[currentPlatform];
    if (!platformEndpoints) return null;

    for (const [userType, endpoint] of Object.entries(platformEndpoints)) {
      if (await checkProfileType(token, userId, endpoint)) {
        return userType;
      }
    }

    return null;
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

  useEffect(() => {
    checkAuth();
  }, [platform]);

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
      
      <Box {...formStyles}>
        <VStack spacing={6}>
          <Heading as="h1" size="lg" color={isDark ? 'white' : 'gray.800'}>
            {t('login')}
          </Heading>

          <FormControl isRequired>
            <FormLabel color={isDark ? 'white' : 'gray.700'}>{t('email')}</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              {...inputStyles}
              color={isDark ? 'white' : 'gray.800'}
              placeholder={t('email')}
              disabled={isLoading}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel color={isDark ? 'white' : 'gray.700'}>{t('password')}</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              {...inputStyles}
              color={isDark ? 'white' : 'gray.800'}
              placeholder={t('password')}
              disabled={isLoading}
            />
          </FormControl>

          <Button 
            width="100%" 
            {...buttonStyles} 
            onClick={handleLogin}
            mt={4}
            disabled={isLoading}
            _disabled={{
              bg: "gray.500",
              cursor: "not-allowed",
              _hover: { bg: "gray.500" }
            }}
          >
            {isLoading ? <Spinner size="sm" /> : t('login')}
          </Button>

          <VStack spacing={2}>
            <Text fontSize="sm" color={isDark ? 'white' : 'gray.600'}>
              {t('noAccount')} {" "}
              <Button 
                variant="link" 
                color="blue.400" 
                onClick={() => router.push('/signup')}
                disabled={isLoading}
                _hover={{
                  color: 'blue.300',
                  textDecoration: 'underline'
                }}
              >
                {t('signup')}
              </Button>
            </Text>
            
            <Button
              variant="link"
              onClick={() => router.push('/forgot-password')}
              color="blue.400"
              _hover={{
                color: 'blue.300',
                textDecoration: 'underline'
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