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
  Image,
  Select,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { FiUpload } from 'react-icons/fi';
import Layout from '@/components/Layout';

const CATEGORIES = [
  'Starter',
  'Main Course',
  'Dessert',
  'Beverage',
  'Side',
  'Special'
];

export default function CreateMenuItem() {
  const { t } = useTranslation('common');
  const [selectedMenu, setSelectedMenu] = useState('');
  const router = useRouter();
  const toast = useToast();
  const [menuItem, setMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Course'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // Fetch user data and validate menu access
  useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me?populate[restaurant][populate]=menus`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch user data');


      const data = await response.json();
      setUserData(data);

      if (data.restaurant?.menus && data.restaurant.menus.length > 0) {
        setSelectedMenu(data.restaurant.menus[0].id);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/login');
    }
  };

  checkAuth();
}, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        title: t('error'),
        description: t('imageUploadFailed'),
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  const token = localStorage.getItem('token');
  if (!token) {
    toast({
      title: t('error'),
      description: t('unauthorized'),
      status: 'error',
      duration: 3000,
    });
    setIsLoading(false);
    return;
  }

  try {
    let imageId = null;

    // 1. Upload image if exists
    if (imageFile) {
      const formData = new FormData();
      formData.append('files', imageFile);

      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const uploadData = await uploadResponse.json();
      imageId = uploadData[0].id;
    }

   // 2. Create and publish menu item with correct data structure
    const menuItemData = {
      data: {
        name: menuItem.name,
        description: menuItem.description,
        price: parseFloat(menuItem.price),
        category: menuItem.category,
        menus: [selectedMenu],
        publishedAt: new Date().toISOString()
      }
    };

    if (imageId) {
      menuItemData.data.image = imageId;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/menu-items`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuItemData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to create menu item');
    }

    toast({
      title: t('success'),
      description: t('menuItemCreated'),
      status: 'success',
      duration: 3000,
    });
    
    router.push('/operator/dashboard');
  } catch (error) {
    console.error('Menu item creation error:', error);
    toast({
      title: t('error'),
      description: error.message || t('menuItemCreationFailed'),
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
          <Heading textAlign="center">{t('createMenuItem')}</Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel>{t('itemName')}</FormLabel>
                <Input
                  value={menuItem.name}
                  onChange={(e) => setMenuItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t('enterItemName')}
                  bg="whiteAlpha.50"
                  borderColor="whiteAlpha.300"
                  _hover={{ borderColor: "whiteAlpha.400" }}
                  _focus={{ borderColor: "blue.400", bg: "whiteAlpha.100" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>{t('description')}</FormLabel>
                <Textarea
                  value={menuItem.description}
                  onChange={(e) => setMenuItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t('enterItemDescription')}
                  bg="whiteAlpha.50"
                  borderColor="whiteAlpha.300"
                  _hover={{ borderColor: "whiteAlpha.400" }}
                  _focus={{ borderColor: "blue.400", bg: "whiteAlpha.100" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>{t('menu')}</FormLabel>
                <Select
                  value={selectedMenu}
                  onChange={(e) => setSelectedMenu(e.target.value)}
                  bg="whiteAlpha.50"
                  borderColor="whiteAlpha.300"
                  _hover={{ borderColor: "whiteAlpha.400" }}
                  _focus={{ borderColor: "blue.400", bg: "whiteAlpha.100" }}
                >
                  {userData?.restaurant?.menus?.map(menu => (
                    <option key={menu.id} value={menu.id}>
                      {menu.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>{t('price')}</FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  value={menuItem.price}
                  onChange={(e) => setMenuItem(prev => ({ ...prev, price: e.target.value }))}
                  placeholder={t('enterPrice')}
                  bg="whiteAlpha.50"
                  borderColor="whiteAlpha.300"
                  _hover={{ borderColor: "whiteAlpha.400" }}
                  _focus={{ borderColor: "blue.400", bg: "whiteAlpha.100" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t('category')}</FormLabel>
                <Select
                  value={menuItem.category}
                  onChange={(e) => setMenuItem(prev => ({ ...prev, category: e.target.value }))}
                  bg="whiteAlpha.50"
                  borderColor="whiteAlpha.300"
                  _hover={{ borderColor: "whiteAlpha.400" }}
                  _focus={{ borderColor: "blue.400", bg: "whiteAlpha.100" }}
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {t(category.toLowerCase().replace(' ', '_'))}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>{t('image')}</FormLabel>
                <Button 
                  as="label" 
                  leftIcon={<FiUpload />} 
                  cursor="pointer" 
                  width="full"
                  bg="whiteAlpha.50"
                  borderColor="whiteAlpha.300"
                  _hover={{ bg: "whiteAlpha.100" }}
                >
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {imagePreview ? t('changeImage') : t('uploadImage')}
                </Button>
                {imagePreview && (
                  <Box mt={4} position="relative">
                    <Image
                      src={imagePreview}
                      alt={t('preview')}
                      borderRadius="md"
                      maxH="200px"
                      objectFit="cover"
                    />
                  </Box>
                )}
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