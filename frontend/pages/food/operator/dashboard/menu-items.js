import { useState, useEffect } from 'react';
import { Box, Button, Flex, Heading, SimpleGrid, Spinner, Text, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const MenuItemsOverview = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();

  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/menu-items?populate=*`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to load menu items');

      const data = await response.json();
      setMenuItems(data.data || []); // Ensures `menuItems` is always an array
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load menu items.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading as="h2" size="lg">Menu Items</Heading>
        <Button onClick={() => router.push('/operator/dashboard/menu-items/create')} colorScheme="green">
          Add Menu Item
        </Button>
      </Flex>

      {menuItems.length === 0 ? (
        <Text>No menu items available</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {menuItems.map((item) => (
            <Box key={item.id} p={4} borderWidth="1px" borderRadius="md">
              <Flex justify="space-between">
                <Heading as="h4" size="sm">{item.attributes.name}</Heading>
                <Flex gap={2}>
                  <Button colorScheme="blue" size="xs" onClick={() => router.push(`/operator/dashboard/menu-items/edit?id=${item.id}`)}>Edit</Button>
                  <Button colorScheme="red" size="xs" onClick={() => handleDeleteMenuItem(item.id)}>Delete</Button>
                </Flex>
              </Flex>
              <Text mt={2}>{item.attributes.description}</Text>
              <Text mt={2}><strong>Price:</strong> ${item.attributes.price}</Text>
              <Text mt={2}><strong>Category:</strong> {item.attributes.category}</Text>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default MenuItemsOverview;
