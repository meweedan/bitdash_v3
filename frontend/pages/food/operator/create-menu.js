import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';
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
  IconButton,
  Text,
  Flex,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Badge,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { FiUpload } from 'react-icons/fi';

export default function CreateMenu() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();

  const [menu, setMenu] = useState({
    name: '',
    description: '',
    menu_items: [],
  });

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null,
  });

  const [userData, setUserData] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/api/users/me?populate=*`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUserData(data);

        if (id) fetchMenu(token);
      } catch (error) {
        toast({
          title: t('error'),
          description: error.message,
          status: 'error',
          duration: 3000,
        });
      }
    };

    fetchUserData();
  }, [id]);

  const fetchMenu = async (token) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/menus/${id}?populate[menu_items][populate]=*`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch menu');
      const data = await response.json();
      
      setMenu({
        name: data.data.attributes.name,
        description: data.data.attributes.description,
        menu_items: data.data.attributes.menu_items.data.map(item => ({
          id: item.id,
          ...item.attributes,
          image: item.attributes.image?.data?.attributes?.url
        }))
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const menuData = {
    data: {
      name,
      description,
      restaurant: userData.restaurant.id,
      users_permissions_user: userData.id, // Reference the correct user ID
    },
  };

  try {
    const response = await fetch(`${BASE_URL}/api/menus`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuData),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error?.message || 'An error occurred while creating the menu.');
    }

    toast({
      title: t('success'),
      description: t('menuCreated'),
      status: 'success',
      duration: 3000,
    });
    router.push('/food/operator/dashboard');
  } catch (error) {
    console.error('Submit error:', error);
    toast({
      title: t('error'),
      description: error.message,
      status: 'error',
      duration: 3000,
    });
  }
};

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) {
      toast({
        title: t('error'),
        description: t('nameAndPriceRequired'),
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    setMenu(prev => ({
      ...prev,
      menu_items: [
        ...prev.menu_items,
        { ...newItem, id: `temp_${Date.now()}` }
      ]
    }));

    setNewItem({
      name: '',
      description: '',
      price: '',
      category: '',
      image: null,
    });

    setModalOpen(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: t('error'),
        description: t('imageUploadFailed'),
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!itemId) return;

    try {
      if (!itemId.toString().startsWith('temp_')) {
        const token = localStorage.getItem('token');
        await fetch(`${BASE_URL}/api/menu-items/${itemId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setMenu(prev => ({
        ...prev,
        menu_items: prev.menu_items.filter(item => item.id !== itemId)
      }));

      toast({
        title: t('itemRemoved'),
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: error.message,
        status: 'error',
        duration: 3000,
      });
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
        backdropFilter="blur(20px)"
        bg="rgba(255, 255, 255, 0.05)"
        border="1px solid"
        borderColor="whiteAlpha.200"
      >
        <VStack spacing={8} align="stretch">
          <Heading textAlign="center">{id ? t('editMenu') : t('createMenu')}</Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel>{t('menuName')}</FormLabel>
                <Input
                  value={menu.name}
                  onChange={(e) => setMenu(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t('enterMenuName')}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t('description')}</FormLabel>
                <Textarea
                  value={menu.description}
                  onChange={(e) => setMenu(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t('enterMenuDescription')}
                />
              </FormControl>

              <Box w="100%" mt={4}>
                <Flex justifyContent="space-between" alignItems="center" mb={4}>
                  <Heading size="md">{t('menuItems')}</Heading>
                  <Button colorScheme="green" onClick={() => setModalOpen(true)}>
                    {t('addItem')}
                  </Button>
                </Flex>

                <VStack spacing={4} align="stretch">
                  {menu.menu_items.map((item) => (
                    <Box
                      key={item.id}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                    >
                      <Flex justify="space-between" align="start">
                        <Flex gap={4}>
                          {item.image && (
                            <Image
                              src={item.image.startsWith('data:') ? item.image : `${BASE_URL}${item.image}`}
                              alt={item.name}
                              boxSize="60px"
                              objectFit="cover"
                              borderRadius="md"
                            />
                          )}
                          <Box>
                            <Text fontWeight="bold">{item.name}</Text>
                            <Text fontSize="sm" color="gray.500">{item.description}</Text>
                            <Badge mt={1}>{item.category}</Badge>
                          </Box>
                        </Flex>
                        <Flex direction="column" align="flex-end">
                          <Text fontWeight="bold">${item.price}</Text>
                          <IconButton
                            mt={2}
                            size="sm"
                            colorScheme="red"
                            icon={<DeleteIcon />}
                            onClick={() => handleRemoveItem(item.id)}
                            aria-label={t('deleteItem')}
                          />
                        </Flex>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              </Box>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="full"
                mt={6}
                isLoading={isLoading}
              >
                {t('save')}
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('addMenuItem')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>{t('itemName')}</FormLabel>
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t('enterItemName')}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>{t('price')}</FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                  placeholder={t('enterPrice')}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t('category')}</FormLabel>
                <Input
                  value={newItem.category}
                  onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                  placeholder={t('enterCategory')}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t('description')}</FormLabel>
                <Textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t('enterItemDescription')}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t('image')}</FormLabel>
                <Button as="label" leftIcon={<FiUpload />} cursor="pointer" width="full">
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {newItem.image ? t('changeImage') : t('uploadImage')}
                </Button>
                {newItem.image && (
                  <Image
                    src={newItem.image}
                    alt={t('preview')}
                    mt={2}
                    borderRadius="md"
                    maxH="200px"
                    objectFit="cover"
                  />
                )}
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddItem}>
              {t('addItem')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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