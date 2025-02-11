// components/shop/owner/AddProductModal.js
import React, { useState } from 'react';
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
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
  Select,
  Box,
  Text,
  Image,
  SimpleGrid,
  IconButton,
  useColorModeValue,
  FormErrorMessage,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';
import { FiUpload, FiX } from 'react-icons/fi';

const AddProductModal = ({ isOpen, onClose, onSubmit }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    subcategory: '',
    specifications: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      preview: URL.createObjectURL(file),
      file
    }));
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.description) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be positive';
    }

    if (!formData.stock) {
      newErrors.stock = 'Stock is required';
    } else if (parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Create FormData and append all fields
      const submitData = new FormData();
      submitData.append('data', JSON.stringify({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        subcategory: formData.subcategory,
        specifications: formData.specifications ? JSON.parse(formData.specifications) : {},
        status: 'available'
      }));

      // Append images
      uploadedImages.forEach((image, index) => {
        submitData.append(`files.images`, image.file, image.file.name);
      });

      await onSubmit(submitData);
      handleClose();
    } catch (error) {
      console.error('Error submitting product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      subcategory: '',
      specifications: ''
    });
    setUploadedImages([]);
    setErrors({});
    onClose();
  };

  const getSubcategories = (category) => {
    switch (category) {
      case 'electronics':
        return [
          { value: 'phones', label: 'Phones & Tablets' },
          { value: 'laptops', label: 'Laptops & Computers' },
          { value: 'audio', label: 'Audio & Headphones' },
          { value: 'accessories', label: 'Accessories' },
          { value: 'cameras', label: 'Cameras' },
          { value: 'gaming', label: 'Gaming' }
        ];
      case 'clothing':
        return [
          { value: 'mens', label: "Men's Clothing" },
          { value: 'womens', label: "Women's Clothing" },
          { value: 'kids', label: "Kids' Clothing" },
          { value: 'shoes', label: 'Shoes' },
          { value: 'accessories', label: 'Accessories' }
        ];
      // Add other categories...
      default:
        return [];
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Add New Product</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Product Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.description}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product..."
                  rows={4}
                />
                <FormErrorMessage>{errors.description}</FormErrorMessage>
              </FormControl>

              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl isInvalid={!!errors.price}>
                  <FormLabel>Price</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>LYD</InputLeftAddon>
                    <NumberInput min={0} precision={2} w="full">
                      <NumberInputField
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                      />
                    </NumberInput>
                  </InputGroup>
                  <FormErrorMessage>{errors.price}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.stock}>
                  <FormLabel>Stock</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="0"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormErrorMessage>{errors.stock}</FormErrorMessage>
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl isInvalid={!!errors.category}>
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
              </SimpleGrid>

              <FormControl>
                <FormLabel>Specifications (JSON format)</FormLabel>
                <Textarea
                  name="specifications"
                  value={formData.specifications}
                  onChange={handleChange}
                  placeholder='{"key": "value"}'
                  rows={3}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Product Images</FormLabel>
                <Box
                  borderWidth={2}
                  borderRadius="md"
                  borderStyle="dashed"
                  p={4}
                  textAlign="center"
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
                    >
                      Upload Images
                    </Button>
                  </label>
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    Upload up to 5 images
                  </Text>
                </Box>

                {uploadedImages.length > 0 && (
                  <SimpleGrid columns={3} spacing={4} mt={4}>
                    {uploadedImages.map((image, index) => (
                      <Box key={index} position="relative">
                        <Image
                          src={image.preview}
                          alt={`Product image ${index + 1}`}
                          borderRadius="md"
                          objectFit="cover"
                          w="full"
                          h="100px"
                        />
                        <IconButton
                          icon={<FiX />}
                          size="xs"
                          position="absolute"
                          top={1}
                          right={1}
                          colorScheme="red"
                          onClick={() => removeImage(index)}
                        />
                      </Box>
                    ))}
                  </SimpleGrid>
                )}
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isSubmitting}
              loadingText="Adding Product..."
            >
              Add Product
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddProductModal;