// frontend/pages/food/operator/dashboard/menu-items/[id]/edit.js
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
  Select,
  NumberInput,
  NumberInputField,
  HStack,
  Image,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';

export default function EditMenuItem() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menus, setMenus] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    menus: [], // Array of menu IDs
    image: null
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Fetch menus first
        const menusResponse = await fetch(`${BASE_URL}/api/menus`, {
          headers: { 
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!menusResponse.ok) {
          throw new Error('Failed to fetch menus');
        }

        const menusData = await menusResponse.json();
        setMenus(menusData.data || []);

        // Fetch menu item with proper populate structure
        const itemResponse = await fetch(
          `${BASE_URL}/api/menu-items/${id}?populate[menus]=true&populate[image]=true`, 
          {
            headers: { 
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (itemResponse.status === 404) {
          throw new Error('Menu item not found');
        }

        if (!itemResponse.ok) {
          const errorData = await itemResponse.json();
          throw new Error(errorData?.error?.message || 'Failed to fetch menu item');
        }

        const itemData = await itemResponse.json();
        
        if (!itemData?.data?.attributes) {
          throw new Error('Invalid menu item data received');
        }

        const { attributes } = itemData.data;
        setFormData({
          name: attributes.name || '',
          description: attributes.description || '',
          price: attributes.price?.toString() || '',
          category: attributes.category || '',
          menus: attributes.menus?.data?.map(menu => menu.id) || [],
          image: attributes.image?.data?.attributes?.url || null
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, BASE_URL, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/menu-items/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            menus: formData.menus // Will be handled by Strapi's relation handler
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || 'Failed to update menu item');
      }

      toast({
        title: 'Success',
        description: 'Menu item updated successfully',
        status: 'success',
        duration: 3000
      });

      router.push('/operator/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
          <Spinner size="xl" />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box maxW="700px" mx="auto" p={8}>
          <Alert 
            status="error" 
            variant="subtle" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            textAlign="center" 
            height="200px"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Error Loading Menu Item
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              {error}
            </AlertDescription>
            <Button
              mt={4}
              onClick={() => router.push('/operator/dashboard')}
              colorScheme="red"
              size="sm"
            >
              Back to Dashboard
            </Button>
          </Alert>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box maxW="700px" mx="auto" p={8}>
        <VStack spacing={8} align="stretch">
          <Heading textAlign="center">Edit Menu Item</Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter item name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Price</FormLabel>
                <NumberInput min={0}>
                  <NumberInputField
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="Enter price"
                  />
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Category</FormLabel>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Enter category"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Menu</FormLabel>
                <Select
                  value={formData.menus[0] || ''} // Take first menu since UI shows single select
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    menus: e.target.value ? [e.target.value] : [] 
                  }))}
                >
                  <option value="">Select menu</option>
                  {menus.map(menu => (
                    <option key={menu.id} value={menu.id}>
                      {menu.attributes?.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter item description"
                />
              </FormControl>

              {formData.image && (
                <Box>
                  <Text mb={2}>Current Image:</Text>
                  <Image
                    src={`${BASE_URL}${formData.image}`}
                    alt="Menu Item"
                    maxH="200px"
                    objectFit="cover"
                    fallback={
                      <Box h="200px" bg="gray.200" display="flex" alignItems="center" justifyContent="center">
                        <Text color="gray.500">No image available</Text>
                      </Box>
                    }
                  />
                </Box>
              )}

              <HStack spacing={4} width="full">
                <Button
                  onClick={() => router.push('/operator/dashboard')}
                  width="full"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  isLoading={loading}
                >
                  Save Changes
                </Button>
              </HStack>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Layout>
  );
}

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};