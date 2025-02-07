// components/contacts/SearchResults.js
import {
  VStack,
  HStack,
  Text,
  Avatar,
  Box,
  Spinner,
  Button,
  useColorModeValue,
  Divider
} from '@chakra-ui/react';
import { FiUserPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useContacts } from '@/hooks/useContacts';

const MotionBox = motion(Box);

const SearchResults = ({ results, isLoading, onSelect }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const { addContact } = useContacts();
  
  const handleAddContact = async (user) => {
    try {
      await addContact.mutateAsync({
        profileId: user.id
      });
      toast({
        title: 'Contact added',
        status: 'success'
      });
    } catch (error) {
      toast({
        title: 'Failed to add contact',
        description: error.message,
        status: 'error'
      });
    }
  };

  if (isLoading) {
    return (
      <VStack py={8}>
        <Spinner />
        <Text color="gray.500">Searching...</Text>
      </VStack>
    );
  }

  if (!results?.length) {
    return (
      <VStack py={8} color="gray.500">
        <Text>No results found</Text>
      </VStack>
    );
  }

  return (
    <VStack spacing={3} align="stretch">
      {results.map(user => (
        <MotionBox
          key={user.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Box
            p={4}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <HStack justify="space-between">
              <HStack spacing={4}>
                <Avatar 
                  size="md" 
                  name={user.attributes.fullName}
                />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="medium">
                    {user.attributes.fullName}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {user.attributes.phone}
                  </Text>
                </VStack>
              </HStack>
              <HStack>
                <Button
                  leftIcon={<FiUserPlus />}
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    // Add to contacts logic here
                  }}
                >
                  Add
                </Button>
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={() => onSelect(user)}
                >
                  Send
                </Button>
              </HStack>
            </HStack>
          </Box>
        </MotionBox>
      ))}
    </VStack>
  );
};

export default SearchResults;