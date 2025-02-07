import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Heading,
  VStack,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';

export default function CreateMenu() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const toast = useToast();
  const [menu, setMenu] = useState({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me?populate=restaurant`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error('Failed to fetch user data');

        const data = await response.json();
        setUserData(data);

        if (data.restaurant?.menu) {
          toast({
            title: t('error'),
            description: t('restaurantAlreadyHasMenu'),
            status: 'error',
            duration: 3000,
          });
          router.push('/menu/operator/dashboard');
        }
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem('token');
    if (!token || !userData?.restaurant?.id) {
      toast({
        title: t('error'),
        description: t('noRestaurantFound'),
        status: 'error',
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }

    try {
      // Create menu with specific fields
      const menuPayload = {
        data: {
          name: menu.name,
          description: menu.description || '',
          publishedAt: new Date().toISOString()
        }
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/menus`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuPayload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const error = responseData.error?.details?.message || responseData.error?.message || 'Failed to create menu';
        throw new Error(error);
      }

      toast({
        title: t('success'),
        description: t('menuCreated'),
        status: 'success',
        duration: 3000,
      });
      
      router.push('/menu/operator/dashboard');
    } catch (error) {
      console.error('Menu creation error:', error);
      toast({
        title: t('error'),
        description: error.message || t('menuCreationFailed'),
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Box 
        maxW="700px" 
        mx="auto" 
        p={8} 
        borderRadius="xl" 
        boxShadow="xl"
        bg="whiteAlpha.50"
        backdropFilter="blur(10px)"
        border="1px solid"
        borderColor="whiteAlpha.200"
      >
        <VStack spacing={8} align="stretch">
          <Heading textAlign="center">{t('createMenu')}</Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel>{t('menuName')}</FormLabel>
                <Input
                  value={menu.name}
                  onChange={(e) => setMenu(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t('enterMenuName')}
                  bg="whiteAlpha.50"
                  borderColor="whiteAlpha.300"
                  _hover={{
                    borderColor: "whiteAlpha.400",
                  }}
                  _focus={{
                    borderColor: "blue.400",
                    bg: "whiteAlpha.100",
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>{t('description')}</FormLabel>
                <Textarea
                  value={menu.description}
                  onChange={(e) => setMenu(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t('enterMenuDescription')}
                  bg="whiteAlpha.50"
                  borderColor="whiteAlpha.300"
                  _hover={{
                    borderColor: "whiteAlpha.400",
                  }}
                  _focus={{
                    borderColor: "blue.400",
                    bg: "whiteAlpha.100",
                  }}
                />
              </FormControl>
              <Button 
                type="submit" 
                colorScheme="blue" 
                size="lg" 
                width="full" 
                isLoading={isLoading}
              >
                {t('save')}
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}