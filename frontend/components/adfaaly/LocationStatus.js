// components/pay/LocationStatus.js
import {
  VStack,
  HStack,
  Text,
  Switch,
  Button,
  useToast,
  Badge,
  Box
} from '@chakra-ui/react';
import { MapPin, Clock } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

const LocationStatus = ({ location, status, onStatusChange }) => {
  const { token } = useAuth();
  const toast = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusToggle = async () => {
    setIsUpdating(true);
    try {
      const newStatus = status === 'active' ? 'inactive' : 'active';
      await onStatusChange(newStatus);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const formatOperatingHours = (hours) => {
    if (!hours) return 'Not set';
    return `${hours.open} - ${hours.close}`;
  };

  return (
    <VStack spacing={4} align="stretch">
      {/* Status Toggle */}
      <HStack justify="space-between">
        <Text>Location Status</Text>
        <Switch
          isChecked={status === 'active'}
          onChange={handleStatusToggle}
          isDisabled={isUpdating}
          colorScheme="green"
        />
      </HStack>

      {/* Location Details */}
      <Box p={3} bg="gray.50" borderRadius="md">
        <HStack spacing={3}>
          <MapPin size={18} />
          <Text fontSize="sm">
            {location?.address || 'Location not set'}
          </Text>
        </HStack>
      </Box>

      {/* Operating Hours */}
      <Box p={3} bg="gray.50" borderRadius="md">
        <HStack spacing={3}>
          <Clock size={18} />
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" fontWeight="medium">
              Operating Hours
            </Text>
            <Text fontSize="sm">
              {formatOperatingHours(location?.operatingHours)}
            </Text>
          </VStack>
        </HStack>
      </Box>

      {/* Status Indicators */}
      <HStack spacing={2} mt={2}>
        <Badge 
          colorScheme={status === 'active' ? 'green' : 'red'}
          variant="subtle"
          px={2}
        >
          {status === 'active' ? 'ONLINE' : 'OFFLINE'}
        </Badge>
        {location?.verified && (
          <Badge colorScheme="blue" variant="subtle" px={2}>
            VERIFIED
          </Badge>
        )}
      </HStack>
    </VStack>
  );
};

export default LocationStatus;