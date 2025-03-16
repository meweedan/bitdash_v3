// components/merchant/ProfileEditor.js
import React, { useState, useRef } from 'react';
import { 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Box,
  IconButton,
  useToast
} from '@chakra-ui/react';
import Image from 'next/image';
import { Edit2 } from 'lucide-react';

const ProfileEditor = ({ merchant, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    businessName: merchant?.businessName || '',
    address: merchant?.location?.address || '',
    phone: merchant?.contact?.phone || '',
    logo: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const fileInputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      if (formData.logo) {
        formDataToSend.append('files.logo', formData.logo);
      }
      
      formDataToSend.append('data', JSON.stringify({
        businessName: formData.businessName,
        location: { address: formData.address },
        contact: { phone: formData.phone }
      }));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/merchants/${merchant.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: formDataToSend
        }
      );

      if (!response.ok) throw new Error('Update failed');

      const updatedData = await response.json();
      onUpdate(updatedData);
      onClose();
      toast({
        title: 'Profile Updated',
        status: 'success',
        duration: 3000
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: error.message,
        status: 'error',
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Business Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} as="form" onSubmit={handleSubmit}>
            {/* Logo Upload */}
            <Box position="relative" w="100px" h="100px">
              <Image
                src={formData.logo 
                  ? URL.createObjectURL(formData.logo)
                  : merchant.logo?.data
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${merchant.logo.data.attributes.url}`
                    : '/placeholder-logo.png'
                }
                alt="Business Logo"
                width={100}
                height={100}
                objectFit="cover"
                style={{ borderRadius: '9999px' }}
              />
              <IconButton
                icon={<Edit2 />}
                size="sm"
                position="absolute"
                bottom={0}
                right={0}
                colorScheme="tazdani"
                onClick={() => fileInputRef.current.click()}
              />
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  logo: e.target.files[0]
                }))}
              />
            </Box>

            <FormControl>
              <FormLabel>Business Name</FormLabel>
              <Input
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  businessName: e.target.value
                }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input
                value={formData.address}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  address: e.target.value
                }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  phone: e.target.value
                }))}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="tazdani"
              w="full"
              isLoading={isLoading}
            >
              Save Changes
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProfileEditor;