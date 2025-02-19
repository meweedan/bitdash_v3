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
  useColorMode
} from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';

/**
 * Platform route definitions: food, cash, shop
 * - The userType keys must match the ones we decide in code
 */
const PLATFORM_ROUTES = {
  food: {
    operator: '/operator/dashboard',
    customer: '/customer/dashboard',
    captain: '/captain/dashboard',
    baseUrl:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://food.bitdash.app'
  },
  cash: {
    merchant: '/merchant/dashboard',
    agent: '/agent/dashboard',
    customer: '/client/dashboard',
    baseUrl:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://cash.bitdash.app'
  },
  shop: {
    owner: '/owner/dashboard',
    customer: '/customer/dashboard',
    baseUrl:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://shop.bitdash.app'
  }
};

/** 
 * For each platform (food, cash, shop), we have endpoints 
 * that define user profiles: owners, captains, etc.
 */
const PROFILE_ENDPOINTS = {
  food: {
    operator: '/api/operators',
    captain: '/api/captains',
    customer: '/api/customer-profiles'
  },
  cash: {
    merchant: '/api/operators',
    agent: '/api/agents',
    customer: '/api/customer-profiles'
  },
  shop: {
    owner: '/api/owners',
    customer: '/api/customer-profiles'
  }
};

/** 
 * Figure out if we are on bitfood, bitcash, or bitshop 
 * or fallback to bitdash 
 */
function getPlatformFromURL() {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('cash')) return 'bitcash';
    if (hostname.includes('food')) return 'bitfood';
    if (hostname.includes('shop')) return 'bitshop';

    // dev usage
    if (hostname === 'localhost') {
      const path = window.location.pathname;
      if (path.includes('/cash')) return 'bitcash';
      if (path.includes('/food')) return 'bitfood';
      if (path.includes('/shop')) return 'bitshop';
    }
  }
  return 'bitdash';
}

/** 
 * Return brand color sets
 */
function getColorScheme(platform, isDark) {
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
    bitdash: {
      bg: isDark ? 'whiteAlpha.50' : 'gray.50',
      text: isDark ? 'gray.200' : 'gray.800',
      button: 'brand.bitdash.500',
      hover: 'brand.bitdash.600',
      border: 'brand.bitdash.500'
    }
  };
  return colorSchemes[platform] || colorSchemes.bitdash;
}

export default function LoginPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const [currentPlatform, setCurrentPlatform] = useState('bitdash');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const colors = getColorScheme(currentPlatform, isDark);

  // On mount, figure out platform
  useEffect(() => {
    const platform = getPlatformFromURL();
    setCurrentPlatform(platform);
    checkAuth();
  }, []);

  // Basic styling
  const formStyles = {
    maxWidth: '600px',
    mx: 'auto',
    mt: 8,
    p: 6,
    borderColor: colors.border
  };

  const inputStyles = {
    variant: 'filled',
    bg: isDark ? 'whiteAlpha.50' : 'white',
    borderWidth: '1px',
    borderColor: colors.border,
    _hover: {
      borderColor: colors.hover
    },
    _focus: {
      borderColor: colors.hover
    }
  };

  const buttonStyles = {
    variant: currentPlatform.includes('bit')
      ? `${currentPlatform}-solid`
      : 'bitdash-solid',
    bg: colors.button,
    color: 'white',
    _hover: {
      bg: colors.hover,
      transform: 'translateY(-2px)'
    },
    _active: {
      transform: 'translateY(0)'
    },
    transition: 'all 0.2s',
    _disabled: {
      bg: colors.button + '80',
      _hover: { bg: colors.button + '80' }
    }
  };

  /** 
   * Check if user has a wallet 
   * (used for bitcash logic, possibly)
   */
  async function checkWalletExists(token, userId) {
    try {
      const res = await fetch(
        `${BASE_URL}/api/wallets?filters[users_permissions_user][id][$eq]=${userId}&populate=*`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (!res.ok) return false;
      const json = await res.json();
      return json?.data && json.data.length > 0;
    } catch (err) {
      console.error('Error checking wallet:', err);
      return false;
    }
  }

  /** 
   * For bitshop, we check owners 
   * If found => 'owner'
   */
  async function checkBitshopOwner(token, userId) {
    const res = await fetch(
      `${BASE_URL}/api/owners?filters[users_permissions_user][id][$eq]=${userId}&populate=*`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) return false;
    const json = await res.json();
    if (json?.data && json.data.length > 0) return true;
    return false;
  }

  /** 
   * Check or create fallback for e.g. 'customer' 
   * in case no advanced record is found
   */
  async function checkProfileType(token, userId, endpoint) {
    try {
      const res = await fetch(
        `${BASE_URL}${endpoint}?filters[users_permissions_user][id][$eq]=${userId}&populate=*`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (!res.ok) {
        console.error('Profile type check fail:', await res.text());
        return false;
      }
      const { data } = await res.json();
      return data && data.length > 0;
    } catch (err) {
      console.error('Profile type check error:', err);
      return false;
    }
  }

  /**
   * Decide userType for the current platform
   * Return e.g. 'owner', 'customer', 'operator', 'merchant', etc.
   * If no special record found, fallback to 'customer'
   */
  async function determineUserType(token, userId) {
    const rawPlatform = currentPlatform.replace('bit', ''); // e.g. 'shop', 'food', 'cash', 'dash'

    // 1) If it's 'shop', check if user is an owner
    if (rawPlatform === 'shop') {
      const isOwner = await checkBitshopOwner(token, userId);
      if (isOwner) return 'owner';
      // fallback => 'customer'
      return 'customer';
    }

    // 2) If it's 'cash'
    if (rawPlatform === 'cash') {
      // check if user has a wallet => if yes => 'customer'
      // or if they exist in operator => 'merchant', or agent => 'agent'
      // We'll keep it simple:
      // if user has a wallet => 'customer'
      const hasWallet = await checkWalletExists(token, userId);
      if (hasWallet) return 'customer';

      // else check if merchant
      const merchantProfile = await checkProfileType(token, userId, '/api/operators');
      if (merchantProfile) return 'merchant';

      // else check if agent
      const agentProfile = await checkProfileType(token, userId, '/api/agents');
      if (agentProfile) return 'agent';

      // fallback => 'customer'
      return 'customer';
    }

    // 3) If it's 'food'
    if (rawPlatform === 'food') {
      // check operator => 'operator'
      const operatorProfile = await checkProfileType(token, userId, '/api/operators');
      if (operatorProfile) return 'operator';

      // check captain => 'captain'
      const captainProfile = await checkProfileType(token, userId, '/api/captains');
      if (captainProfile) return 'captain';

      // else => 'customer'
      return 'customer';
    }

    // 4) If it's 'dash' or unknown => fallback 'customer'
    return 'customer';
  }

  /**
   * After we get userType, we route them to correct dash
   */
  function handleRedirect(userType) {
    const rawPlatform = currentPlatform.replace('bit', '');
    const routes = PLATFORM_ROUTES[rawPlatform];
    if (!routes) {
      // fallback if e.g. bitdash => do something or push '/'
      router.push('/');
      return;
    }

    const dashPath = routes[userType] || routes.customer;
    if (process.env.NODE_ENV === 'development') {
      router.push(dashPath);
    } else {
      window.location.href = `${routes.baseUrl}${dashPath}`;
    }
  }

  async function checkAuth() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      setIsLoading(false);
      return;
    }
    try {
      const user = JSON.parse(userData);
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      const userType = await determineUserType(token, user.id);
      handleRedirect(userType);
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogin() {
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
        body: JSON.stringify({ identifier: email, password })
      });

      if (!loginRes.ok) {
        const error = await loginRes.json();
        throw new Error(error.error?.message || 'Login failed');
      }

      const loginData = await loginRes.json();
      localStorage.setItem('token', loginData.jwt);
      localStorage.setItem('user', JSON.stringify(loginData.user));

      // Now see which userType they belong to
      const userType = await determineUserType(loginData.jwt, loginData.user.id);
      handleRedirect(userType);

      toast({
        title: t('success'),
        description: t('loginSuccess'),
        status: 'success',
        duration: 2000
      });
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
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') handleLogin();
  }

  return (
    <Layout>
      <Head>
        <title>{t('login')}</title>
      </Head>

      <Box {...formStyles} mt="20" p="8">
        <VStack spacing={6}>
          <Heading as="h1" size="lg" color={colors.text}>
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
            loadingText={t('loggingIn')}
          >
            {t('login')}
          </Button>

          <VStack spacing={2}>
            <Text color={colors.text}>
              {t('noAccount')}{' '}
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
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  };
}