import { useState, useEffect } from 'react';
import { Box, Button, Flex, Heading, SimpleGrid, Spinner, Text, useToast, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const TablesOverview = () => {
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/tables?populate=*`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to load tables');
      const data = await response.json();
      setTables(data.data); // Ensure we use the `data` key from Strapi's response
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load tables.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleAddTable = async () => {
    const tableName = prompt('Enter Table Name');
    if (!tableName) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/tables`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: { name: tableName, status: 'Available' } }),
      });

      if (!response.ok) throw new Error('Failed to create table');
      fetchTables();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

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
        <Heading as="h2" size="lg">Tables</Heading>
        <Button onClick={handleAddTable} colorScheme="green">Add Table</Button>
      </Flex>

      {tables.length === 0 ? (
        <Text>No tables available</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {tables.map(({ id, attributes }) => (
            <Box key={id} p={4} borderWidth="1px" borderRadius="md">
              <Flex justify="space-between">
                <Heading as="h4" size="sm">{attributes.name}</Heading>
                <Button colorScheme="red" size="xs" onClick={() => handleDeleteTable(id)}>Delete</Button>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default TablesOverview;
