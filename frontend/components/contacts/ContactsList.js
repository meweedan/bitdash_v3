// components/contacts/ContactsList.js
import {
  VStack,
  HStack,
  Text,
  Avatar,
  IconButton,
  SimpleGrid,
  Box,
  Divider,
  useColorModeValue,
  Button
} from '@chakra-ui/react';
import { FiStar, FiCamera, FiPlus, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useContacts } from '@/hooks/useContacts';

const MotionBox = motion(Box);

const ContactsList = ({ 
  contacts, 
  onSelect, 
  onScanQR, 
  showFavoritesOnly = false 
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const { toggleFavorite } = useContacts();
  
  const handleToggleFavorite = async (contact) => {
    try {
      await toggleFavorite.mutateAsync({
        contactId: contact.id,
        isFavorite: !contact.attributes.favorite
      });
    } catch (error) {
      toast({
        title: 'Failed to update favorite',
        status: 'error'
      });
    }
  };

  const quickActions = [
    {
      icon: FiCamera,
      label: 'Scan QR',
      action: onScanQR,
      color: 'blue.500'
    },
    {
      icon: FiPlus,
      label: 'Add New',
      action: () => {},
      color: 'green.500'
    }
  ];

  return (
    <VStack spacing={6} align="stretch">
      {/* Quick Actions */}
      <SimpleGrid columns={2} spacing={4}>
        {quickActions.map(({ icon: Icon, label, action, color }) => (
          <MotionBox
            key={label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              w="full"
              h="24"
              bg={bgColor}
              border="1px"
              borderColor={borderColor}
              borderRadius="lg"
              onClick={action}
              display="flex"
              flexDir="column"
              gap={2}
            >
              <Icon size={24} color={color} />
              <Text>{label}</Text>
            </Button>
          </MotionBox>
        ))}
      </SimpleGrid>

      {/* Recent Contacts */}
      {!showFavoritesOnly && (
        <>
          <HStack justify="space-between">
            <Text fontWeight="medium">Recent</Text>
            <IconButton
              icon={<FiClock />}
              variant="ghost"
              size="sm"
            />
          </HStack>
          <SimpleGrid columns={{ base: 3, sm: 4 }} spacing={4}>
            {contacts?.filter(c => c.attributes.last_transfer)
              .slice(0, 4)
              .map(contact => (
                <MotionBox
                  key={contact.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  cursor="pointer"
                  onClick={() => onSelect(contact.attributes.contact_profile.data)}
                >
                  <VStack>
                    <Avatar 
                      size="lg" 
                      name={contact.attributes.contact_profile.data.attributes.fullName} 
                    />
                    <Text 
                      fontSize="sm" 
                      fontWeight="medium"
                      textAlign="center"
                      noOfLines={1}
                    >
                      {contact.attributes.nickname || 
                       contact.attributes.contact_profile.data.attributes.fullName}
                    </Text>
                  </VStack>
                </MotionBox>
              ))}
          </SimpleGrid>
        </>
      )}

      {/* All or Favorite Contacts */}
      <VStack spacing={2} align="stretch">
        <Text fontWeight="medium">
          {showFavoritesOnly ? 'Favorites' : 'All Contacts'}
        </Text>
        {contacts?.filter(c => !showFavoritesOnly || c.attributes.favorite)
          .map(contact => (
            <MotionBox
              key={contact.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <HStack 
                p={4}
                bg={bgColor}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                cursor="pointer"
                onClick={() => onSelect(contact.attributes.contact_profile.data)}
                justify="space-between"
              >
                <HStack>
                  <Avatar 
                    size="md" 
                    name={contact.attributes.contact_profile.data.attributes.fullName}
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium">
                      {contact.attributes.nickname || 
                       contact.attributes.contact_profile.data.attributes.fullName}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {contact.attributes.contact_profile.data.attributes.phone}
                    </Text>
                  </VStack>
                </HStack>
                <IconButton
                  icon={<FiStar />}
                  variant="ghost"
                  color={contact.attributes.favorite ? 'yellow.400' : 'gray.400'}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Toggle favorite logic here
                  }}
                />
              </HStack>
            </MotionBox>
          ))}
      </VStack>
    </VStack>
  );
};

export default ContactsList;