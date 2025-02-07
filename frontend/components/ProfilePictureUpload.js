// components/ProfilePictureUpload.js
import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Input,
  VStack,
  Button,
  useToast,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';

const ProfilePictureUpload = ({ user, onUpdateProfile }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const toast = useToast();

  const uploadProfilePicture = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('files', file);
      formData.append('ref', 'api::customer-profile.customer-profile');
      formData.append('refId', user.customer_profile.id);
      formData.append('field', 'avatar');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Profile Picture Updated',
        description: 'Your profile picture has been successfully uploaded',
        status: 'success',
        duration: 3000
      });
      // Optionally call a parent function to update the UI
      onUpdateProfile(data);
    },
    onError: (error) => {
      toast({
        title: 'Upload Failed',
        description: error.message,
        status: 'error',
        duration: 5000
      });
    }
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload a JPEG, PNG, or GIF image',
          status: 'error',
          duration: 3000
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: 'File Too Large',
          description: 'Image must be less than 5MB',
          status: 'error',
          duration: 3000
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadProfilePicture.mutate(selectedFile);
    }
  };

  const currentAvatarUrl = user?.customer_profile?.avatar?.data?.attributes?.url
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${user.customer_profile.avatar.data.attributes.url}`
    : undefined;

  return (
    <VStack spacing={4} align="center">
      <Avatar
        size="2xl"
        name={user?.customer_profile?.fullName || user?.username}
        src={currentAvatarUrl}
      />
      <FormControl>
        <FormLabel>Upload Profile Picture</FormLabel>
        <Input 
          type="file" 
          accept="image/jpeg,image/png,image/gif"
          onChange={handleFileChange}
          variant="filled"
        />
      </FormControl>
      <Button 
        onClick={handleUpload} 
        isLoading={uploadProfilePicture.isLoading}
        colorScheme="blue"
        isDisabled={!selectedFile}
      >
        Upload Picture
      </Button>
    </VStack>
  );
};

export default ProfilePictureUpload;