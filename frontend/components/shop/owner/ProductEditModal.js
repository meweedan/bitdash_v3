import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Box,
  Image,
  Flex,
  IconButton,
  FormErrorMessage,
  HStack,
  Text
} from '@chakra-ui/react';
import { FiUpload, FiX } from 'react-icons/fi';

const ProductEditModal = ({ 
  isOpen, 
  onClose, 
  product,
  onSave 
}) => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    subcategory: '',
    status: 'available',
    specifications: {}
  });
  const [errors, setErrors] = useState({});
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);

  useEffect(() => {
    if (product && product.attributes) {
      setFormData({
        name: product.attributes.name || '',
        description: product.attributes.description || '',
        price: parseFloat(product.attributes.price) || 0,
        stock: parseInt(product.attributes.stock) || 0,
        category: product.attributes.category || '',
        subcategory: product.attributes.subcategory || '',
        status: product.attributes.status || 'available',
        specifications: product.attributes.specifications || {}
      });
      setExistingImages(product.attributes.images?.data || []);
      setNewImages([]);
      setRemovedImageIds([]);
      setErrors({});
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNumberChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [
      ...prev,
      ...files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }))
    ]);
  };

  const removeExistingImage = (imageId) => {
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
    setRemovedImageIds(prev => [...prev, imageId]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      
      // Append basic product data
      const productData = {
        ...formData,
        specifications: typeof formData.specifications === 'string' ? 
          JSON.parse(formData.specifications) : formData.specifications
      };
      
      submitData.append('data', JSON.stringify(productData));

      // Append new images
      newImages.forEach(({ file }) => {
        submitData.append('files.images', file);
      });

      // Include list of removed image IDs
      if (removedImageIds.length > 0) {
        submitData.append('removedImages', JSON.stringify(removedImageIds));
      }

      await onSave(submitData);
      onClose();
    } catch (error) {
      toast({
        title: 'Error updating product',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubcategories = (category) => {
    const subcategories = {
      electronics: [
        { value: 'phones', label: 'Phones & Tablets' },
        { value: 'laptops', label: 'Laptops & Computers' },
        { value: 'audio', label: 'Audio & Headphones' },
        { value: 'accessories', label: 'Accessories' }
      ],
      clothing: [
        { value: 'mens', label: "Men's Clothing" },
        { value: 'womens', label: "Women's Clothing" },
        { value: 'kids', label: "Kids' Clothing" }
      ],
      home: [
        { value: 'furniture', label: 'Furniture' },
        { value: 'kitchen', label: 'Kitchen & Dining' },
        { value: 'decor', label: 'Home Decor' }
      ]
    };
    
    return subcategories[category] || [];
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="xl"
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Product</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {/* Product Images */}
            <FormControl>
              <FormLabel>Product Images</FormLabel>
              <Box
                borderWidth={2}
                borderStyle="dashed"
                borderRadius="md"
                p={4}
                mb={4}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button
                    as="span"
                    leftIcon={<FiUpload />}
                    colorScheme="blue"
                    variant="outline"
                    cursor="pointer"
                    w="full"
                  >
                    Upload Images
                  </Button>
                </label>
              </Box>

              <Flex wrap="wrap" gap={2}>
                {existingImages.map((image) => (
                  <Box key={image.id} position="relative">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${image.attributes.url}`}
                      alt="Product image"
                      boxSize="100px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                    <IconButton
                      icon={<FiX />}
                      size="xs"
                      position="absolute"
                      top={1}
                      right={1}
                      colorScheme="red"
                      onClick={() => removeExistingImage(image.id)}
                    />
                  </Box>
                ))}
                {newImages.map((image, index) => (
                  <Box key={index} position="relative">
                    <Image
                      src={image.preview}
                      alt={`New product image ${index + 1}`}
                      boxSize="100px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                    <IconButton
                      icon={<FiX />}
                      size="xs"
                      position="absolute"
                      top={1}
                      right={1}
                      colorScheme="red"
                      onClick={() => removeNewImage(index)}
                    />
                  </Box>
                ))}
              </Flex>
            </FormControl>

            {/* Basic Information */}
            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel>Product Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={4}
              />
            </FormControl>

            <HStack spacing={4} w="full">
              <FormControl isRequired isInvalid={!!errors.price}>
                <FormLabel>Price (LYD)</FormLabel>
                <NumberInput
                  value={formData.price}
                  onChange={(_, value) => handleNumberChange('price', value)}
                  min={0}
                  precision={2}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors.price}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.stock}>
                <FormLabel>Stock</FormLabel>
                <NumberInput
                  value={formData.stock}
                  onChange={(_, value) => handleNumberChange('stock', value)}
                  min={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors.stock}</FormErrorMessage>
              </FormControl>
            </HStack>

            <HStack spacing={4} w="full">
              <FormControl isRequired isInvalid={!!errors.category}>
                <FormLabel>Category</FormLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Select category"
                >
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="home">Home & Living</option>
                  <option value="books">Books</option>
                  <option value="sports">Sports & Outdoors</option>
                </Select>
                <FormErrorMessage>{errors.category}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Subcategory</FormLabel>
                <Select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  placeholder="Select subcategory"
                  isDisabled={!formData.category}
                >
                  {getSubcategories(formData.category).map(sub => (
                    <option key={sub.value} value={sub.value}>
                      {sub.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="available">Available</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="hidden">Hidden</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Specifications</FormLabel>
              <Textarea
                name="specifications"
                value={
                  typeof formData.specifications === 'object' 
                    ? JSON.stringify(formData.specifications, null, 2)
                    : formData.specifications
                }
                onChange={handleChange}
                placeholder='{"key": "value"}'
                rows={4}
              />
              <Text fontSize="sm" color="gray.500" mt={1}>
                Enter specifications in JSON format
              </Text>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProductEditModal;