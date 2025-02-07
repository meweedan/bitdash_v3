import { useState } from 'react';
import { 
  Box, 
  Heading, 
  VStack, 
  Input, 
  Textarea, 
  Button, 
  FormControl,
  FormLabel,
  useToast,
  useColorMode 
} from '@chakra-ui/react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import Layout from '../components/Layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

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
  _hover: {
    borderColor: "whiteAlpha.400",
  },
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
  },
  _active: {
    bg: "blue.700",
  }
};

const Contact = () => {
  const { t } = useTranslation('common');
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const toast = useToast();

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch('/api/email/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: t('success'),
          description: t('emailSent'),
          status: 'success',
          duration: 3000,
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToSendEmail'),
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Layout>
        <Head>
        <title>{`${t('contact')}`}</title>
        <link href="/favicon.ico" rel="icon"/>
      </Head>
      <Box {...formStyles}>
        <form onSubmit={handleSubmit}>
          <VStack spacing={6}>
            <Heading as="h1" size="lg" color={isDark ? 'white' : 'gray.800'}>
              {t('contact')}
            </Heading>

            <FormControl isRequired>
              <FormLabel color={isDark ? 'white' : 'gray.700'}>{t('name')}</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('name')}
                {...inputStyles}
                color={isDark ? 'white' : 'gray.800'}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={isDark ? 'white' : 'gray.700'}>{t('email')}</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('email')}
                {...inputStyles}
                color={isDark ? 'white' : 'gray.800'}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={isDark ? 'white' : 'gray.700'}>{t('message')}</FormLabel>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t('message')}
                height="150px"
                {...inputStyles}
                color={isDark ? 'white' : 'gray.800'}
                resize="vertical"
              />
            </FormControl>

            <Button 
              width="100%" 
              {...buttonStyles}
              type="submit"
              isLoading={isSending}
              _hover={{
                ...buttonStyles._hover,
                transform: 'translateY(-2px)',
              }}
              transition="all 0.2s"
            >
              {t('send')}
            </Button>
          </VStack>
        </form>
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

export default Contact;
