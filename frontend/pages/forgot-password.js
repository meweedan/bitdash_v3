import { useState } from 'react';
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

const ForgotPassword = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Error sending reset email');
      }

      setEmailSent(true);
      toast({
        title: t('success'),
        description: t('resetEmailSent'),
        status: 'success',
        duration: 5000,
      });
    } catch (error) {
      console.error('Forgot password error:', error);
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
            <Heading size="lg">{t('forgotPassword')}</Heading>
            
            {emailSent ? (
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                <Text>{t('resetEmailInstructions')}</Text>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>{t('email')}</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('enterEmail')}
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="blue"
                    width="100%"
                    isLoading={isLoading}
                  >
                    {t('sendResetLink')}
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
            )}
          </VStack>
        </Box>
      </Container>
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

export default ForgotPassword;