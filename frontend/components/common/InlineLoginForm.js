import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
  Link,
  useColorMode
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

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
    customer: '/client/dashboard',
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://tazdani.bitdash.app'
  },
  shop: {
    owner: '/owner/dashboard',
    customer: '/customer/dashboard',
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://shop.bitdash.app'
  }
};

const BUSINESS_TYPE_ROUTES = {
  restaurant: { platform: 'food', userType: 'operator' },
  captain: { platform: 'food', userType: 'captain' },
  merchant: { platform: 'cash', userType: 'merchant' },
  agent: { platform: 'cash', userType: 'agent' },
  customer: { platform: 'cash', userType: 'customer' },
  owner: { platform: 'shop', userType: 'owner' },
  client: { platform: 'food', userType: 'customer' },
  customer: { platform: 'shop', userType: 'customer' }
};

const getPlatformFromURL = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('cash')) return 'tazdani';
    if (hostname.includes('food')) return 'bitfood';
    if (hostname.includes('shop')) return 'bitshop';
    
    if (hostname === 'localhost') {
      const path = window.location.pathname;
      if (path.includes('/cash')) return 'tazdani';
      if (path.includes('/food')) return 'bitfood';
      if (path.includes('/shop')) return 'bitshop';
    }
  }
  return 'bitdash';
};

const InlineLoginForm = ({ onLoginSuccess }) => {
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [currentPlatform, setCurrentPlatform] = useState('bitdash');
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  useEffect(() => {
    const platform = getPlatformFromURL();
    setCurrentPlatform(platform);
  }, []);

  const checkWalletExists = async (token, userId) => {
    try {
      const walletResponse = await fetch(
        `${BASE_URL}/api/wallets?filters[users_permissions_user][id][$eq]=${userId}&populate=*`, 
        { 
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (!walletResponse.ok) {
        console.error('Wallet check failed:', await walletResponse.text());
        return false;
      }

      const { data } = await walletResponse.json();
      return data && data.length > 0;
    } catch (error) {
      console.error('Wallet existence check error:', error);
      return false;
    }
  };

  const checkBusinessType = async (token, userId) => {
    try {
      const platform = currentPlatform.replace('bit', '');
      
      if (platform === 'shop') {
        const ownerResponse = await fetch(
          `${BASE_URL}/api/owners?filters[users_permissions_user][id][$eq]=${userId}&populate=*`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (ownerResponse.ok) {
          const { data } = await ownerResponse.json();
          if (data && data.length > 0) {
            return 'owner';
          }
        }
      }

      const responses = await Promise.all([
        fetch(`${BASE_URL}/api/operators?filters[users_permissions_user][id][$eq]=${userId}&populate=*`, 
          { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BASE_URL}/api/owners?filters[users_permissions_user][id][$eq]=${userId}&populate=*`, 
          { headers: { Authorization: `Bearer ${token}` } })
      ]);

      for (const response of responses) {
        if (response.ok) {
          const { data } = await response.json();
          if (data && data.length > 0) {
            if (response.url.includes('/api/owners')) {
              return 'owner';
            }
            return data[0]?.attributes?.businessType;
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Business type check error:', error);
      return null;
    }
  };

  const determineUserType = async (token, userId) => {
    const platform = currentPlatform.replace('bit', '');
    
    if (platform === 'cash') {
      const customerProfileResponse = await fetch(
        `${BASE_URL}/api/customer-profiles?filters[users_permissions_user][id][$eq]=${userId}&populate=*`, 
        { 
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (customerProfileResponse.ok) {
        const { data: customerData } = await customerProfileResponse.json();
        
        if (customerData && customerData.length > 0) {
          const hasWallet = await checkWalletExists(token, userId);
          
          if (hasWallet) {
            return 'customer';
          }
        }
      }
    }

    const businessType = await checkBusinessType(token, userId);
    
    if (businessType && BUSINESS_TYPE_ROUTES[businessType]) {
      const route = BUSINESS_TYPE_ROUTES[businessType];
      if (route.platform === platform) {
        return route.userType;
      }
    }

    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
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
        onLoginSuccess(loginData);
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

  return (
    <VStack spacing={4} as="form" onSubmit={handleLogin}>
      <Text fontSize="lg" fontWeight="bold">
        {t('payment.login_to_complete')}
      </Text>
      <FormControl isRequired>
        <FormLabel>{t('auth.email')}</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.email_placeholder')}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>{t('auth.password')}</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth.password_placeholder')}
        />
      </FormControl>
      <Button
        type="submit"
        colorScheme="blue"
        isLoading={isLoading}
        w="full"
      >
        {t('payment.login_continue')}
      </Button>
      <Text fontSize="sm">
        {t('auth.no_account')}{' '}
        <Link color="blue.500" href="/register">
          {t('auth.register_now')}
        </Link>
      </Text>
    </VStack>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
    },
  });

export default InlineLoginForm;