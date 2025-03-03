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
  Select,
  HStack,
  Icon
} from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';
import { FaMoneyBillWave, FaChartLine, FaUniversity, FaExchangeAlt } from 'react-icons/fa';

// Platform routes mapping for all financial platforms
const PLATFORM_ROUTES = {
  cash: {
    merchant: '/merchant/dashboard',
    agent: '/agent/dashboard',
    customer: '/client/dashboard',
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://cash.bitdash.app'
  },
  fund: {
    prop_trader: '/fund/challenger/dashboard',
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://fund.bitdash.app'
  },
  invest: {
    investor: '/investor/dashboard',
    institutional_client: '/institutional/dashboard',
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://invest.bitdash.app'
  },
  trade: {
    retail_trader: '/trader/dashboard',
    ib: '/broker/dashboard',
    institutional_client: '/institutional/dashboard',
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://trade.bitdash.app'
  }
};

// Platform profile endpoints
const PROFILE_ENDPOINTS = {
  cash: {
    merchant: '/api/merchants',
    agent: '/api/agents',
    customer: '/api/customer-profiles'
  },
  fund: {
    prop_trader: '/api/prop-traders'
  },
  invest: {
    investor: '/api/investors',
    institutional_client: '/api/institutional-clients'
  },
  trade: {
    retail_trader: '/api/retail-traders',
    ib: '/api/introducing-brokers',
    institutional_client: '/api/institutional-clients'
  }
};

// Platform icons
const PLATFORM_ICONS = {
  cash: FaMoneyBillWave,
  fund: FaChartLine,
  invest: FaUniversity,
  trade: FaExchangeAlt
};

const getPlatformFromURL = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('cash')) return 'cash';
    if (hostname.includes('fund')) return 'fund';
    if (hostname.includes('invest')) return 'invest';
    if (hostname.includes('trade')) return 'trade';
    
    if (hostname === 'localhost') {
      const path = window.location.pathname;
      if (path.includes('/cash')) return 'cash';
      if (path.includes('/fund')) return 'fund';
      if (path.includes('/invest')) return 'invest';
      if (path.includes('/trade')) return 'trade';
    }
  }
  return 'cash'; // Default to cash for fallback
};

const getColorScheme = (platform, isDark) => {
  const colorSchemes = {
    cash: {
      bg: isDark ? 'whiteAlpha.50' : 'gray.50',
      text: isDark ? 'brand.bitcash.400' : 'brand.bitcash.600',
      button: 'brand.bitcash.500',
      hover: 'brand.bitcash.600',
      border: 'brand.bitcash.500',
      themeKey: 'bitcash'
    },
    fund: {
      bg: isDark ? 'whiteAlpha.50' : 'gray.50',
      text: isDark ? 'brand.bitfund.400' : 'brand.bitfund.600',
      button: 'brand.bitfund.500',
      hover: 'brand.bitfund.600',
      border: 'brand.bitfund.500',
      themeKey: 'bitfund'
    },
    invest: {
      bg: isDark ? 'whiteAlpha.50' : 'gray.50',
      text: isDark ? 'brand.bitinvest.400' : 'brand.bitinvest.600',
      button: 'brand.bitinvest.500',
      hover: 'brand.bitinvest.600',
      border: 'brand.bitinvest.500',
      themeKey: 'bitinvest'
    },
    trade: {
      bg: isDark ? 'whiteAlpha.50' : 'gray.50',
      text: isDark ? 'brand.bittrade.400' : 'brand.bittrade.600',
      button: 'brand.bittrade.500',
      hover: 'brand.bittrade.600',
      border: 'brand.bittrade.500',
      themeKey: 'bittrade'
    }
  };

  return colorSchemes[platform] || colorSchemes.cash;
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
  const [platform, setPlatform] = useState('cash');
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const detectedPlatform = getPlatformFromURL();
    setPlatform(detectedPlatform);
    checkAuth();
  }, []);

  const colors = getColorScheme(platform, isDark);

  const formStyles = {
    maxWidth: "600px",
    mx: "auto",
    mt: 8,
    p: 6,
    borderColor: colors.border,
    backgroundColor: isDark ? 'whiteAlpha.50' : 'white',
    borderRadius: "xl",
    boxShadow: "xl",
    borderWidth: "1px"
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
    }
  };

  const buttonStyles = {
    variant: `${colors.themeKey}-solid`,
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
    _disabled: {
      bg: colors.button + '80',
      _hover: { bg: colors.button + '80' }
    }
  };

  const checkProfileType = async (token, userId, roleType) => {
    // Handle specific profile endpoints based on platform and role type
    const platformConfig = PROFILE_ENDPOINTS[platform];
    if (!platformConfig || !platformConfig[roleType]) {
      console.log(`No endpoint configured for ${platform}:${roleType}`);
      return false;
    }

    try {
      const endpoint = platformConfig[roleType];
      const response = await fetch(
        `${BASE_URL}${endpoint}?filters[users_permissions_user][id][$eq]=${userId}&populate=*`,
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
      return data && data.length > 0;
    } catch (error) {
      console.error('Profile type check error:', error);
      return false;
    }
  };

  const determineUserRole = async (token, user) => {
    // Check user roles from the provided token
    if (!user || !user.roles || user.roles.length === 0) {
      console.log('No roles found for user');
      return null;
    }

    // Map relevant role types for the current platform
    const relevantRoleTypes = {
      cash: ['merchant', 'agent', 'customer'],
      fund: ['prop_trader'],
      invest: ['investor', 'institutional_client'],
      trade: ['retail_trader', 'ib', 'institutional_client']
    };

    // Get platform-specific role types
    const platformRoleTypes = relevantRoleTypes[platform] || [];
    
    // Find matching roles for the current platform
    for (const role of user.roles) {
      if (platformRoleTypes.includes(role.type)) {
        // Verify profile exists for this role type
        const profileExists = await checkProfileType(token, user.id, role.type);
        if (profileExists) {
          return role.type;
        }
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
      // Determine user role for the platform
      const roleType = await determineUserRole(token, user);
      if (roleType) {
        handleRedirect(roleType);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsLoading(false);
    }
  };

  const handleRedirect = (roleType) => {
    // Get platform-specific route configuration
    const platformConfig = PLATFORM_ROUTES[platform];
    
    if (!platformConfig || !platformConfig[roleType]) {
      console.error('Invalid platform config or role type:', platform, roleType);
      return;
    }

    const route = platformConfig[roleType];
    
    if (process.env.NODE_ENV === 'development') {
      router.push(route);
    } else {
      window.location.href = `${platformConfig.baseUrl}${route}`;
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

      // Determine role type for redirection
      const roleType = await determineUserRole(loginData.jwt, loginData.user);
      
      if (roleType) {
        handleRedirect(roleType);
        toast({
          title: t('success'),
          description: t('loginSuccess'),
          status: 'success',
          duration: 2000
        });
      } else {
        throw new Error(`No ${getPlatformName(platform)} account found for this user`);
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

  const getPlatformName = (platform) => {
    const platformNames = {
      cash: 'BitCash',
      fund: 'BitFund',
      invest: 'BitInvest',
      trade: 'BitTrade'
    };
    return platformNames[platform] || 'BitDash';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <Layout>
      <Head>
        <title>{`${getPlatformName(platform)} - ${t('login')}`}</title>
      </Head>
      
      <Box {...formStyles} mt="20" p="8">
        <VStack spacing={6}>
          <HStack>
            <Icon as={PLATFORM_ICONS[platform]} boxSize={8} color={colors.text} />
            <Heading 
              as="h1" 
              size="lg" 
              color={colors.text}
            >
              {getPlatformName(platform)} {t('login')}
            </Heading>
          </HStack>

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
              {t('noAccount')} {" "}
              <Button 
                variant="link" 
                color={colors.button}
                onClick={() => router.push('/signup/choice')}
                _hover={{ color: colors.hover }}
              >
                {t('signup')}
              </Button>
            </Text>
            
            <Button
              variant={`${colors.themeKey}-outline`}
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