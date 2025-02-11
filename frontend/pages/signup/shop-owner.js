// pages/signup/shop-owner.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box,
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
  Divider,
  Badge,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  Progress,
  FormErrorMessage,
  Textarea,
  IconButton,
  Stack,
  AspectRatio,
  Image,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff, FiUpload, FiX } from 'react-icons/fi';
import Layout from '@/components/Layout';

const ShopOwnerSignup = () => {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // User Auth Data
    username: '',
    email: '',
    password: '',
    confirmPassword: '',

    // Shop Owner Data
    shopName: '',
    description: '',
    verificationStatus: 'pending',
    categories: [],

    // File uploads
    logo: null,
    coverImage: null,
    businessDocuments: []
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));
    }
  };

  const handleDocumentsChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      businessDocuments: [...prev.businessDocuments, ...files]
    }));
  };

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      businessDocuments: prev.businessDocuments.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // User validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Shop validation
    if (!formData.shopName) {
      newErrors.shopName = 'Shop name is required';
    }

    if (!formData.description) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Step 1: Create user account
      setProgress(20);
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        provider: 'local',
        confirmed: true, // Auto-confirm for now
        blocked: false,
        role: 3 // Assuming 3 is the shop owner role ID
      };

      const registerRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!registerRes.ok) {
        const error = await registerRes.json();
        throw new Error(error.error?.message || 'Registration failed');
      }

      const { jwt, user } = await registerRes.json();

      // Step 2: Upload media files
      setProgress(40);
      const uploadFile = async (file, field) => {
        if (!file) return null;
        const formData = new FormData();
        formData.append('files', file);
        
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: formData,
        });
        
        if (!uploadRes.ok) throw new Error(`Failed to upload ${field}`);
        const uploadData = await uploadRes.json();
        return uploadData[0].id;
      };

      const logoId = await uploadFile(formData.logo, 'logo');
      const coverId = await uploadFile(formData.coverImage, 'coverImage');
      
      // Upload business documents
      const documentIds = await Promise.all(
        formData.businessDocuments.map(doc => uploadFile(doc, 'businessDocuments'))
      );

      // Step 3: Create shop owner profile
      setProgress(70);
      const shopOwnerData = {
        data: {
          user: user.id,
          shopName: formData.shopName,
          description: formData.description,
          verificationStatus: 'pending',
          categories: [],
          rating: 0,
          logo: logoId,
          coverImage: coverId,
          businessDocuments: documentIds
        }
      };

      const shopOwnerRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shop-owners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify(shopOwnerData)
      });

      if (!shopOwnerRes.ok) {
        throw new Error('Failed to create shop owner profile');
      }

      setProgress(100);
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isNewShop', 'true'); // Flag for showing welcome modal

      toast({
        title: 'Success!',
        description: 'Your shop has been created successfully.',
        status: 'success',
        duration: 5000
      });

      router.push('/shop/owner/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create account',
        status: 'error',
        duration: 5000
      });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Create Your Shop - BitShop</title>
      </Head>

      <Container maxW="container.md" py={8}>
        {loading && (
          <Progress
            value={progress}
            size="xs"
            colorScheme="blue"
            mb={4}
            isAnimated
            hasStripe
          />
        )}

        <Box
          bg={bgColor}
          p={8}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="xl"
        >
          <VStack spacing={6} align="stretch">
            <VStack align="center" spacing={2}>
              <Heading size="lg">Create Your BitShop Store</Heading>
              <Badge colorScheme="blue" p={2} borderRadius="full">
                Start Selling Today
              </Badge>
            </VStack>

            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                {/* Account Credentials */}
                <Box w="full">
                  <Heading size="md" mb={4}>Account Credentials</Heading>
                  <VStack spacing={4}>
                    <FormControl isRequired isInvalid={!!errors.username}>
                      <FormLabel>Username</FormLabel>
                      <Input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                      <FormErrorMessage>{errors.username}</FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={!!errors.email}>
                      <FormLabel>Email Address</FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={!!errors.password}>
                      <FormLabel>Password</FormLabel>
                      <InputGroup>
                        <Input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <InputRightElement>
                          <IconButton
                            icon={showPassword ? <FiEyeOff /> : <FiEye />}
                            variant="ghost"
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={!!errors.confirmPassword}>
                      <FormLabel>Confirm Password</FormLabel>
                      <Input
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                    </FormControl>
                  </VStack>
                </Box>

                <Divider />

                {/* Shop Information */}
                <Box w="full">
                  <Heading size="md" mb={4}>Shop Information</Heading>
                  <VStack spacing={4}>
                    <FormControl isRequired isInvalid={!!errors.shopName}>
                      <FormLabel>Shop Name</FormLabel>
                      <Input
                        name="shopName"
                        value={formData.shopName}
                        onChange={handleChange}
                      />
                      <FormErrorMessage>{errors.shopName}</FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={!!errors.description}>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                      />
                      <FormErrorMessage>{errors.description}</FormErrorMessage>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Shop Logo</FormLabel>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'logo')}
                        display="none"
                        id="logo-upload"
                      />
                      <Button
                        as="label"
                        htmlFor="logo-upload"
                        leftIcon={<FiUpload />}
                        w="full"
                        cursor="pointer"
                      >
                        Upload Logo
                      </Button>
                      {formData.logo && (
                        <Text mt={2} fontSize="sm">
                          Selected: {formData.logo.name}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl>
                      <FormLabel>Cover Image</FormLabel>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'coverImage')}
                        display="none"
                        id="cover-upload"
                      />
                      <Button
                        as="label"
                        htmlFor="cover-upload"
                        leftIcon={<FiUpload />}
                        w="full"
                        cursor="pointer"
                      >
                        Upload Cover Image
                      </Button>
                      {formData.coverImage && (
                        <Text mt={2} fontSize="sm">
                          Selected: {formData.coverImage.name}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl>
                      <FormLabel>Business Documents</FormLabel>
                      <Input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={handleDocumentsChange}
                        display="none"
                        id="documents-upload"
                      />
                      <Button
                        as="label"
                        htmlFor="documents-upload"
                        leftIcon={<FiUpload />}
                        w="full"
                        cursor="pointer"
                      >
                        Upload Documents
                      </Button>
                      {formData.businessDocuments.length > 0 && (
                        <VStack mt={2} align="stretch">
                          {formData.businessDocuments.map((doc, index) => (
                            <Stack
                              key={index}
                              direction="row"
                              align="center"
                              bg="gray.50"
                              p={2}
                              borderRadius="md"
                            >
                              <Text fontSize="sm" flex={1}>
                                {doc.name}
                              </Text>
                              <IconButton
                                icon={<FiX />}
                                size="sm"
                                onClick={() => removeDocument(index)}
                              />
                            </Stack>
                          ))}
                        </VStack>
                      )}
                    </FormControl>
                  </VStack>
                </Box>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  w="full"
                  isLoading={loading}
                  loadingText="Creating Shop..."
                >
                  Create Shop
                </Button>
              </VStack>
            </form>

            <Text textAlign="center">
              Already have a shop?{' '}
              <Button
                variant="link"
                colorScheme="blue"
                onClick={() => router.push('/login')}
              >
                Login
              </Button>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Layout>
  );
};

export default ShopOwnerSignup; 