// components/shop/owner/WelcomeModal.js
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  HStack,
  Text,
  Box,
  Icon,
  useColorModeValue,
  Progress,
  Input,
  useToast,
  Flex,
  Heading,
  Badge,
} from '@chakra-ui/react';
import {
  FiPlus,
  FiUpload,
  FiGrid,
  FiShoppingBag,
  FiDownload,
  FiArrowRight,
} from 'react-icons/fi';
import Papa from 'papaparse';

const WelcomeModal = ({ isOpen, onClose, shopId }) => {
  const [step, setStep] = useState('options');
  const [csvFile, setCsvFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const toast = useToast();
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleCsvUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setCsvFile(file);
      setStep('csv-preview');
      
      // Parse CSV preview
      Papa.parse(file, {
        header: true,
        preview: 5, // Show first 5 rows
        complete: function(results) {
          console.log("CSV Preview:", results.data);
        }
      });
    }
  };

  const importProducts = async () => {
    if (!csvFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      Papa.parse(csvFile, {
        header: true,
        complete: async function(results) {
          const total = results.data.length;
          let processed = 0;

          for (const product of results.data) {
            // Create product in chunks
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-items`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                data: {
                  name: product.name,
                  description: product.description,
                  price: parseFloat(product.price),
                  stock: parseInt(product.stock),
                  category: product.category,
                  subcategory: product.subcategory,
                  shop_owner: shopId,
                  status: 'available'
                }
              })
            });

            processed++;
            setUploadProgress((processed / total) * 100);
          }

          toast({
            title: 'Import Complete',
            description: `Successfully imported ${processed} products`,
            status: 'success',
            duration: 5000
          });

          onClose();
        },
        error: function(error) {
          throw new Error(error);
        }
      });
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: error.message,
        status: 'error',
        duration: 5000
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      ['name', 'description', 'price', 'stock', 'category', 'subcategory'],
      ['Example Product', 'Product description', '99.99', '100', 'electronics', 'phones']
    ];
    
    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'bitshop_product_template.csv';
    link.click();
  };

  const renderStep = () => {
    switch (step) {
      case 'options':
        return (
          <VStack spacing={6} w="full">
            <Heading size="md">Welcome to BitShop!</Heading>
            <Text textAlign="center" color="gray.500">
              Let's get your shop up and running. How would you like to add your products?
            </Text>

            <VStack spacing={4} w="full">
              <Box
                as="button"
                onClick={() => onClose('/shop/owner/products/new')}
                p={6}
                bg={cardBg}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                w="full"
                _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                transition="all 0.2s"
              >
                <HStack spacing={4}>
                  <Icon as={FiPlus} boxSize={6} color="blue.500" />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">Add Products Manually</Text>
                    <Text fontSize="sm" color="gray.500">
                      Create products one by one with detailed information
                    </Text>
                  </VStack>
                </HStack>
              </Box>

              <Box
                as="button"
                onClick={() => setStep('csv-upload')}
                p={6}
                bg={cardBg}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                w="full"
                _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                transition="all 0.2s"
              >
                <HStack spacing={4}>
                  <Icon as={FiUpload} boxSize={6} color="green.500" />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">Import from CSV</Text>
                    <Text fontSize="sm" color="gray.500">
                      Bulk import products using a spreadsheet
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </VStack>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClose()}
            >
              I'll do this later
            </Button>
          </VStack>
        );

      case 'csv-upload':
        return (
          <VStack spacing={6} w="full">
            <VStack spacing={2}>
              <Heading size="md">Import Products</Heading>
              <Text textAlign="center" color="gray.500">
                Upload a CSV file with your product information
              </Text>
            </VStack>

            <Box
              borderWidth={2}
              borderStyle="dashed"
              borderRadius="lg"
              p={8}
              w="full"
              textAlign="center"
            >
              <Input
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                display="none"
                id="csv-upload"
              />
              <label htmlFor="csv-upload">
                <VStack spacing={4} cursor="pointer">
                  <Icon as={FiUpload} boxSize={8} color="blue.500" />
                  <Text fontWeight="medium">
                    Click to upload or drag and drop
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    CSV files only
                  </Text>
                </VStack>
              </label>
            </Box>

            <HStack>
              <Button
                leftIcon={<FiDownload />}
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
              >
                Download Template
              </Button>
            </HStack>

            <Button variant="ghost" onClick={() => setStep('options')}>
              Back to options
            </Button>
          </VStack>
        );

      case 'csv-preview':
        return (
          <VStack spacing={6} w="full">
            <VStack spacing={2}>
              <Heading size="md">Review Import</Heading>
              <Text textAlign="center" color="gray.500">
                Ready to import {csvFile?.name}
              </Text>
            </VStack>

            {isUploading && (
              <Box w="full">
                <Progress
                  value={uploadProgress}
                  size="sm"
                  colorScheme="blue"
                  hasStripe
                  isAnimated
                />
                <Text mt={2} fontSize="sm" textAlign="center">
                  Importing products... {Math.round(uploadProgress)}%
                </Text>
              </Box>
            )}

            <HStack spacing={4}>
              <Button
                colorScheme="blue"
                leftIcon={<FiArrowRight />}
                onClick={importProducts}
                isLoading={isUploading}
              >
                Start Import
              </Button>
              <Button variant="ghost" onClick={() => setStep('csv-upload')}>
                Back
              </Button>
            </HStack>
          </VStack>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      size="lg"
    >
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalBody py={8}>
          {renderStep()}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WelcomeModal;