import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Container,
  Heading,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import Layout from '@/components/Layout';

const ResetPassword = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const toast = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const { code } = router.query;
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    // Verify the reset code is present
    if (code) {
      setIsValid(true);
    }
  }, [code]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: t('error'),
        description: t('passwordsDoNotMatch'),
        status: 'error',
        duration: 5000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          password: password,
          passwordConfirmation: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Error resetting password');
      }

      toast({
        title: t('success'),
        description: t('passwordResetSuccess'),
        status: 'success',
        duration: 5000,
      });

      // Redirect to login after successful reset
      router.push('/login');
    } catch (error) {
      console.error('Reset password error:', error);
      toast({
        title: t('error'),
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValid) {
    return (
      <Layout>
        <Container maxW="lg" py={12}>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Text>{t('invalidResetLink')}</Text>
          </Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxW="lg" py={12}>
        <Box
          p={8}
          borderWidth={1}
          borderRadius="lg"
          boxShadow="xl"
          bg="whiteAlpha.100"
          backdropFilter="blur(10px)"
        >
          <VStack spacing={6}>
            <Heading size="lg">{t('resetPassword')}</Heading>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>{t('newPassword')}</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('enterNewPassword')}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t('confirmPassword')}</FormLabel>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('enterConfirmPassword')}
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="100%"
                  isLoading={isLoading}
                >
                  {t('resetPassword')}
                </Button>

                <Button
                  variant="ghost"
                  width="100%"
                  onClick={() => router.push('/login')}
                >
                  {t('backToLogin')}
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default ResetPassword;