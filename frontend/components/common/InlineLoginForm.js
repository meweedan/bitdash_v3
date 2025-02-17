// components/InlineLoginForm.js
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
  Link
} from '@chakra-ui/react';

const InlineLoginForm = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.jwt) {
        localStorage.setItem('token', data.jwt);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLoginSuccess(data);
      } else {
        throw new Error(data.error?.message || t('auth.errors.login_failed'));
      }
    } catch (error) {
      toast({
        title: t('auth.errors.login_error'),
        description: error.message,
        status: 'error',
        duration: 3000,
      });
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

export default InlineLoginForm;