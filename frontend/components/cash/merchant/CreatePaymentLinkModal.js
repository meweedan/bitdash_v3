// components/pay/merchant/CreatePaymentLinkModal.js
import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Input,
  Button,
  FormControl,
  FormLabel,
  Select,
  useToast
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CreatePaymentLinkModal = ({ isOpen, onClose, merchantData }) => {
  const [formData, setFormData] = useState({
    amount: '',
    pin: '',
    description: '',
    expiryHours: '24'
  });
  const toast = useToast();
  const queryClient = useQueryClient();

  const createLink = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment-links`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            data: {
              amount: parseFloat(data.amount),
              currency: 'LYD',
              description: data.description,
              merchant: merchantData.id,
              status: 'active',
              expiry: new Date(Date.now() + (parseInt(data.expiryHours) * 60 * 60 * 1000)).toISOString(),
              link_id: `LINK${Date.now()}${Math.random().toString(36).substr(2, 4)}`.toUpperCase(),
              pin: data.pin
            }
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create payment link');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['paymentLinks']);
      toast({
        title: 'Success',
        description: 'Payment link created successfully',
        status: 'success',
        duration: 3000
      });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000
      });
    }
  });

  const handleSubmit = () => {
    if (!formData.amount || !formData.pin) {
      toast({
        title: 'Error',
        description: 'Amount and PIN are required',
        status: 'error',
        duration: 3000
      });
      return;
    }
    createLink.mutate(formData);
  };

  const handleClose = () => {
    setFormData({
      amount: '',
      pin: '',
      description: '',
      expiryHours: '24'
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Payment Link</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={6}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Amount (LYD)</FormLabel>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>PIN</FormLabel>
              <Input
                type="password"
                value={formData.pin}
                onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                maxLength={6}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Expiry</FormLabel>
              <Select
                value={formData.expiryHours}
                onChange={(e) => setFormData({ ...formData, expiryHours: e.target.value })}
              >
                <option value="24">24 hours</option>
                <option value="48">48 hours</option>
                <option value="72">72 hours</option>
                <option value="168">1 week</option>
              </Select>
            </FormControl>

            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={createLink.isLoading}
              w="full"
            >
              Create Payment Link
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};


export default CreatePaymentLinkModal;