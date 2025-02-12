import { useState, useEffect } from 'react';
import { Box, Button, Flex, Heading, SimpleGrid, Spinner, Text, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const MenusOverview = () => {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();

  const fetchMenus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/menus?populate=*`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to load menus');

      const data = await response.json();
      setMenus(data.data || []); // Ensures `menus` is always an array
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load menus.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
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
        <Heading as="h2" size="lg">Menus</Heading>
        <Button onClick={() => router.push('/operator/dashboard/menus/create')} colorScheme="green">
          Add Menu
        </Button>
      </Flex>

      {menus.length === 0 ? (
        <Text>No menus available</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {menus.map((menu) => (
            <Box key={menu.id} p={4} borderWidth="1px" borderRadius="md">
              <Flex justify="space-between">
                <Heading as="h4" size="sm">{menu.attributes.name}</Heading>
                <Flex gap={2}>
                  <Button colorScheme="blue" size="xs" onClick={() => router.push(`/operator/dashboard/menus/edit?id=${menu.id}`)}>Edit</Button>
                  <Button colorScheme="red" size="xs" onClick={() => handleDeleteMenu(menu.id)}>Delete</Button>
                </Flex>
              </Flex>
              <Text mt={2}>{menu.attributes.description}</Text>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default MenusOverview;
