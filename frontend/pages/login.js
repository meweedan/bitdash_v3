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
    operator: '/food/operator/dashboard',
    customer: '/food/customer/dashboard',
    captain: '/food/captain/dashboard',
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://food.bitdash.app'
  },
  cash: {
    merchant: '/cash/merchant/dashboard',
    agent: '/cash/agent/dashboard',
    client: '/cash/client/dashboard',
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://cash.bitdash.app'
  },
  work: {
    employer: '/work/employer/dashboard',
    employee: '/work/employee/dashboard',
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://work.bitdash.app'
  },
  ride: {
    captain: '/ride/captain/dashboard',
    client: '/ride/client/dashboard',
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://ride.bitdash.app'
  },
  shop: {
    owner: '/shop/owner/dashboard',
    customer: '/shop/customer/dashboard',
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
  work: {
    employer: '/api/employers',
    employee: '/api/employees'
  },
  ride: {
    captain: '/api/captains',
    client: '/api/customer-profiles'
  },
  shop: {
    owner: '/api/shop-owners',
    customer: '/api/customer-profiles'
  }
};

const BUSINESS_TYPE_ROUTES = {
  restaurant: { platform: 'food', userType: 'operator' },
  captain: { platform: 'food', userType: 'captain' },
  merchant: { platform: 'cash', userType: 'merchant' },
  agent: { platform: 'cash', userType: 'agent' },
  employer: { platform: 'work', userType: 'employer' },
  employee: { platform: 'work', userType: 'employee' },
  shopOwner: { platform: 'shop', userType: 'owner' },
  client: { platform: 'food', userType: 'customer' },
  customer: { platform: 'cash', userType: 'client' },
  clientShop: { platform: 'shop', userType: 'customer' },
  clientRide: { platform: 'ride', userType: 'client' },
  clientCash: { platform: 'cash', userType: 'client' }
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
  const [platform, setPlatform] = useState('bitdash');
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const getPlatformFromURL = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname.includes('cash')) return 'bitcash';
      if (hostname.includes('food')) return 'bitfood';
      if (hostname.includes('shop')) return 'bitshop';
      if (hostname.includes('ride')) return 'bitride';
      if (hostname.includes('work')) return 'bitwork';

      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        const path = window.location.pathname;
        if (path.includes('/cash')) return 'bitcash';
        if (path.includes('/food')) return 'bitfood';
        if (path.includes('/shop')) return 'bitshop';
        if (path.includes('/ride')) return 'bitride';
        if (path.includes('/work')) return 'bitwork';
      }
    }
    return 'bitdash';
  };

  useEffect(() => {
    setPlatform(getPlatformFromURL());
    checkAuth();
  }, []);

  const formStyles = {
    maxWidth: "400px",
    mx: "auto",
    mt: 8,
    p: 6,
    borderRadius: "xl",
    bg: isDark ? 'whiteAlpha.50' : 'gray.50',
    borderWidth: "1px",
    borderColor: isDark ? `brand.${platform}.500` : `brand.${platform}.400`,
    boxShadow: "xl"
  };

  const inputStyles = {
    variant: "filled",
    bg: isDark ? 'whiteAlpha.50' : 'white',
    color: isDark ? `brand.${platform}.500` : `brand.${platform}.700`,
    borderWidth: "1px",
    borderColor: isDark ? `brand.${platform}.500` : `brand.${platform}.400`,
    _hover: {
      borderColor: isDark ? `brand.${platform}.400` : `brand.${platform}.500`,
    },
    _focus: {
      borderColor: isDark ? `brand.${platform}.400` : `brand.${platform}.500`,
      bg: isDark ? 'whiteAlpha.100' : 'white'
    }
  };

  const buttonStyles = {
    variant: `${platform}-outline`,
    color: isDark ? `brand.${platform}.500` : `brand.${platform}.700`,
    _hover: {
      bg: isDark ? `brand.${platform}.500` : `brand.${platform}.400`,
      color: 'white'
    }
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

  const checkBusinessType = async (token, userId) => {
    const response = await fetch(
      `${BASE_URL}/api/operators?filters[users_permissions_user][id][$eq]=${userId}&populate=*`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.ok) return null;

    const { data } = await response.json();
    return data?.[0]?.attributes?.businessType || null;
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
    const platform = currentPlatform.replace('bit', '');
    const businessType = await checkBusinessType(token, userId);
    
    if (businessType && BUSINESS_TYPE_ROUTES[businessType]) {
      const route = BUSINESS_TYPE_ROUTES[businessType];
      if (route.platform === platform) {
        return route.userType;
      }
      return null;
    }

    const platformEndpoints = PROFILE_ENDPOINTS[platform];
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
          <Heading 
            as="h1" 
            size="lg" 
            color={isDark ? `brand.${platform}.500` : `brand.${platform}.700`}
          >
            {t('login')}
          </Heading>

          <FormControl isRequired>
            <FormLabel color={isDark ? `brand.${platform}.500` : `brand.${platform}.700`}>
              {t('email')}
            </FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              {...inputStyles}
              placeholder={t('email')}
              disabled={isLoading}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel color={isDark ? `brand.${platform}.500` : `brand.${platform}.700`}>
              {t('password')}
            </FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              {...inputStyles}
              placeholder={t('password')}
              disabled={isLoading}
            />
          </FormControl>

          <Button 
            width="100%" 
            {...buttonStyles} 
            onClick={handleLogin}
            isLoading={isLoading}
            loadingText={t('loggingIn')}
            _disabled={{
              opacity: 0.6,
              cursor: 'not-allowed',
              _hover: { bg: 'transparent' }
            }}
          >
            {t('login')}
          </Button>

          <VStack spacing={2}>
            <Text color={isDark ? `brand.${platform}.500` : `brand.${platform}.700`}>
              {t('noAccount')} {" "}
              <Button 
                variant="link" 
                color={isDark ? `brand.${platform}.500` : `brand.${platform}.700`}
                onClick={() => router.push('/signup')}
                _hover={{
                  color: isDark ? `brand.${platform}.400` : `brand.${platform}.500`
                }}
              >
                {t('signup')}
              </Button>
            </Text>
            
            <Button
              variant={`${platform}-outline`}
              onClick={() => router.push('/forgot-password')}
              color={isDark ? `brand.${platform}.500` : `brand.${platform}.700`}
              _hover={{
                bg: isDark ? `brand.${platform}.500` : `brand.${platform}.400`,
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