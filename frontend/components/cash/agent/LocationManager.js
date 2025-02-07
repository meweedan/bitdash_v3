import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Image,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input
} from '@chakra-ui/react';

const LocationManager = ({ initialLocation }) => {
  const toast = useToast();
  const [location, setLocation] = useState(initialLocation);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manualAddress, setManualAddress] = useState('');

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Geolocation Error',
        description: 'Geolocation not supported',
        status: 'error'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          const newLocation = {
            latitude,
            longitude,
            address: data.display_name || 'Unknown Location'
          };

          // Update backend location
          await updateLocation(newLocation);
          
          setLocation(newLocation);
        } catch (error) {
          toast({
            title: 'Location Error',
            description: 'Could not update location',
            status: 'error'
          });
        }
      },
      (error) => {
        toast({
          title: 'Location Error',
          description: error.message,
          status: 'error'
        });
      }
    );
  };

  const updateLocation = async (locationData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/agents/me/location`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            coordinates: {
              latitude: locationData.latitude,
              longitude: locationData.longitude
            },
            address: locationData.address
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update location');
      }
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: error.message,
        status: 'error'
      });
    }
  };

  const handleManualAddressSubmit = async () => {
    try {
      // Geocode address
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualAddress)}`
      );
      const data = await response.json();

      if (data.length === 0) {
        throw new Error('Address not found');
      }

      const { lat, lon } = data[0];
      
      const newLocation = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        address: manualAddress
      };

      await updateLocation(newLocation);
      setLocation(newLocation);
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: 'Geocoding Error',
        description: error.message,
        status: 'error'
      });
    }
  };

  // Static map image generation
  const getStaticMapUrl = () => {
    if (!location?.latitude || !location?.longitude) return null;

    return `https://static.OpenStreetMap.org/staticmap?center=${location.latitude},${location.longitude}&zoom=15&size=400x300&markers=${location.latitude},${location.longitude},red`;
  };

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="space-between">
        <Text fontWeight="bold">Agent Location</Text>
        <HStack>
          <Button onClick={getCurrentLocation} size="sm">
            Update Location
          </Button>
          <Button onClick={() => setIsModalOpen(true)} size="sm">
            Enter Address
          </Button>
        </HStack>
      </HStack>

      {location?.address && (
        <Text color="gray.600">{location.address}</Text>
      )}

      {/* Static Map Image */}
      {getStaticMapUrl() && (
        <Image 
          src={getStaticMapUrl()} 
          alt="Location Map" 
          borderRadius="md"
          objectFit="cover"
        />
      )}

      {/* Manual Address Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Location</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input 
              placeholder="Enter full address"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
            />
            <Button 
              mt={4} 
              onClick={handleManualAddressSubmit}
            >
              Save Location
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default LocationManager;