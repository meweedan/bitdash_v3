// pages/login.js

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

/** Domain-based routes for each platform. */
const PLATFORM_ROUTES = {
  food: {
    operator: '/operator/dashboard',
    captain: '/captain/dashboard',
    customer: '/customer/dashboard',
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

/** Return bitshop, bitfood, or bitcash. */
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

/** Chakra UI brand colors. */
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

/** Check if user has a wallet => 'customer' on bitcash. */
async function checkWalletExists(BASE_URL, token, userId) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/wallets?filters[users_permissions_user][id][$eq]=${userId}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (!res.ok) return false;
    const json = await res.json();
    return json.data?.length > 0;
  } catch {
    return false;
  }
}

/** Check if user is an owner in bitshop. */
async function checkBitshopOwner(BASE_URL, token, userId) {
  const res = await fetch(
    `${BASE_URL}/api/owners?filters[user][id][$eq]=${userId}&populate=*`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  if (!res.ok) return false;
  const json = await res.json();
  return json.data?.length > 0; // If user is found in owners => owner
}

/** Check if user has a certain profile in /api/operators, /api/agents, etc. */
async function checkProfileType(BASE_URL, token, userId, endpoint) {
  try {
    const url = `${BASE_URL}${endpoint}?filters[user][id][$eq]=${userId}&populate=*`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) return false;
    const json = await res.json();
    return json.data?.length > 0;
  } catch {
    return false;
  }
}

/**
 * Main logic: 
 * If bitshop => if owners => 'owner', else => 'customer'
 * If bitcash => if wallet => 'customer', else check 'merchant' or 'agent', fallback => 'customer'
 * If bitfood => check 'operator' or 'captain', fallback => 'customer'
 * If bitdash => fallback => 'customer'
 */
async function determineUserType(BASE_URL, token, userId, currentPlatform) {
  const platform = currentPlatform.replace('bit', '');

  switch (platform) {
    case 'shop':
      if (await checkBitshopOwner(BASE_URL, token, userId)) {
        return 'owner';
      }
      return 'customer';
    case 'cash': {
      // check wallet => 'customer'
      if (await checkWalletExists(BASE_URL, token, userId)) return 'customer';
      // else operator => 'merchant'
      const merchant = await checkProfileType(BASE_URL, token, userId, '/api/operators');
      if (merchant) return 'merchant';
      // else agent => 'agent'
      const agent = await checkProfileType(BASE_URL, token, userId, '/api/agents');
      if (agent) return 'agent';
      return 'customer';
    }
    case 'food': {
      // operator => 'operator'
      const operator = await checkProfileType(BASE_URL, token, userId, '/api/operators');
      if (operator) return 'operator';
      // captain => 'captain'
      const captain = await checkProfileType(BASE_URL, token, userId, '/api/captains');
      if (captain) return 'captain';
      return 'customer';
    }
    default:
      return 'customer';
  }
}

/** Actually route the user. */
function handleRedirect(router, currentPlatform, userType) {
  const rawPlatform = currentPlatform.replace('bit', '');
  const cfg = PLATFORM_ROUTES[rawPlatform];
  if (!cfg) {
    router.push('/');
    return;
  }
  // fallback to 'customer' if unknown
  const route = cfg[userType] || cfg.customer;
  if (process.env.NODE_ENV === 'development') {
    router.push(route);
  } else {
    window.location.href = `${cfg.baseUrl}${route}`;
  }
}

export default function LoginPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const toast = useToast();
  const { colorMode } = useColorMode();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [currentPlatform, setCurrentPlatform] = useState('bitdash');
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const isDark = colorMode === 'dark';
  const colors = getColorScheme(currentPlatform, isDark);

  // On mount, detect platform & check existing login
  useEffect(() => {
    setCurrentPlatform(getPlatformFromURL());
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Basic styles
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
    _hover: { borderColor: colors.hover },
    _focus: { borderColor: colors.hover }
  };
  const buttonStyles = {
    variant: currentPlatform.includes('bit') ? `${currentPlatform}-solid` : 'bitdash-solid',
    bg: colors.button,
    color: 'white',
    _hover: { bg: colors.hover, transform: 'translateY(-2px)' },
    _active: { transform: 'translateY(0)' },
    transition: 'all 0.2s',
    _disabled: {
      bg: colors.button + '80',
      _hover: { bg: colors.button + '80' }
    }
  };

  async function checkAuth() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      setIsLoading(false);
      return;
    }
    try {
      const userObj = JSON.parse(userStr);
      if (!userObj?.id) {
        setIsLoading(false);
        return;
      }
      const userType = await determineUserType(BASE_URL, token, userObj.id, currentPlatform);
      const finalType = userType || 'customer';
      handleRedirect(router, currentPlatform, finalType);
    } catch (err) {
      console.error('Auth check error:', err);
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
      const res = await fetch(`${BASE_URL}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'Login failed');
      }
      const loginData = await res.json();
      localStorage.setItem('token', loginData.jwt);
      localStorage.setItem('user', JSON.stringify(loginData.user));

      const userType = await determineUserType(BASE_URL, loginData.jwt, loginData.user.id, currentPlatform);
      const finalType = userType || 'customer';
      handleRedirect(router, currentPlatform, finalType);

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
    if (e.key === 'Enter') {
      handleLogin();
    }
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