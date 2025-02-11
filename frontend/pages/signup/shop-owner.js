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
  SimpleGrid,
  useColorModeValue,
  Progress,
  FormErrorMessage,
  Textarea,
  IconButton,
  Stack,
  Select,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff, FiUpload, FiX } from 'react-icons/fi';
import Layout from '@/components/Layout';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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

    // Wallet Security
    walletPin: '',
    confirmWalletPin: '',

    // Business Info
    businessName: '',
    registrationNumber: '',
    taxId: '',
    phone: '',
    address: '',
    city: '',
    businessType: 'retail', // retail, wholesale, manufacturer
    monthlyVolume: 0,

    // Shop Info
    shopName: '',
    description: '',
    categories: [],
    operatingHours: {
      open: '09:00',
      close: '21:00'
    },

    // Contact Info
    contact: {
      name: '',
      phone: '',
      email: ''
    },

    // File uploads
    logo: null,
    coverImage: null,
    businessDocuments: []
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? parseFloat(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value
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
    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.walletPin) {
    newErrors.walletPin = 'Wallet PIN is required';
    } else if (!/^\d{6}$/.test(formData.walletPin)) {
    newErrors.walletPin = 'PIN must be exactly 6 digits';
    }

    if (formData.walletPin !== formData.confirmWalletPin) {
    newErrors.confirmWalletPin = 'PINs do not match';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Business validation
    const requiredFields = [
      'businessName',
      'registrationNumber',
      'taxId',
      'phone',
      'address',
      'shopName',
      'description'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      Object.entries(newErrors).forEach(([field, message]) => {
        toast({
          title: 'Validation Error',
          description: message,
          status: 'error',
          duration: 3000
        });
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Step 1: Create user account with shop owner role
      setProgress(20);
      const userRes = await fetch(`${API_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: 12, // Shop Owner role ID
          confirmed: true
        })
      });

      if (!userRes.ok) {
        const error = await userRes.json();
        throw new Error(error.error?.message || 'Registration failed');
      }

      const { jwt, user } = await userRes.json();
      console.log('Created user:', user);

      // Step 2: Upload media files
      setProgress(40);
      const uploadFile = async (file, field) => {
        if (!file) return null;
        const formData = new FormData();
        formData.append('files', file);
        
        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: formData,
        });
        
        if (!uploadRes.ok) {
          console.error(`Failed to upload ${field}:`, await uploadRes.json());
          throw new Error(`Failed to upload ${field}`);
        }
        const uploadData = await uploadRes.json();
        return uploadData[0].id;
      };

      const [logoId, coverId, ...documentIds] = await Promise.all([
        uploadFile(formData.logo, 'logo'),
        uploadFile(formData.coverImage, 'coverImage'),
        ...formData.businessDocuments.map(doc => uploadFile(doc, 'businessDocuments'))
      ].filter(Boolean));

      // Step 3: Create wallet
      setProgress(60);
      const walletData = {
        data: {
          balance: 0,
          currency: 'LYD',
          isActive: true,
          walletId: `SW${Date.now()}${Math.random().toString(36).substr(2, 4)}`.toUpperCase(),
          dailyLimit: 10000,
          monthlyLimit: 200000,
          lastActivity: new Date().toISOString(),
          wallet_pin: parseInt(formData.walletPin), // Add the PIN
          shop_owner: shopOwner.data.id
        }
        };

      console.log('Creating wallet:', walletData);
      const walletRes = await fetch(`${API_URL}/api/wallets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify(walletData)
      });

      if (!walletRes.ok) {
        console.error('Wallet creation error:', await walletRes.json());
        throw new Error('Failed to create wallet');
      }
      const wallet = await walletRes.json();

      // Step 4: Create shop owner profile
      setProgress(80);
      const shopOwnerData = {
        data: {
          user: user.id,
          shopName: formData.shopName,
          description: formData.description,
          businessName: formData.businessName,
          registrationNumber: formData.registrationNumber,
          taxId: formData.taxId,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          businessType: formData.businessType,
          operatingHours: formData.operatingHours,
          contact: formData.contact,
          verificationStatus: 'pending',
          categories: [],
          rating: 0,
          logo: logoId,
          coverImage: coverId,
          businessDocuments: documentIds,
          wallet: wallet.data.id,
          monthlyVolume: formData.monthlyVolume,
          publishedAt: new Date().toISOString()
        }
      };

      console.log('Creating shop owner:', JSON.stringify(shopOwnerData, null, 2));
      const shopOwnerRes = await fetch(`${API_URL}/api/shop-owners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify(shopOwnerData)
      });

      if (!shopOwnerRes.ok) {
        const errorData = await shopOwnerRes.json();
        console.error('Shop owner creation error:', errorData);
        throw new Error('Failed to create shop owner profile');
      }

      const shopOwner = await shopOwnerRes.json();

      // Step 5: Update relationships
      setProgress(90);
      await Promise.all([
        // Update user with shop owner reference
        fetch(`${API_URL}/api/users/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
          },
          body: JSON.stringify({
            shop_owner: shopOwner.data.id
          })
        }),

        // Update wallet with shop owner reference
        fetch(`${API_URL}/api/wallets/${wallet.data.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
          },
          body: JSON.stringify({
            data: {
              shop_owner: shopOwner.data.id
            }
          })
        })
      ]);

      setProgress(100);
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify({
        ...user,
        role: { id: 12, type: 'shop_owner' }
      }));
      localStorage.setItem('isNewShop', 'true');

      toast({
        title: 'Success!',
        description: 'Your shop has been created successfully',
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
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Username</FormLabel>
                      <Input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Email Address</FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
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
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Confirm Password</FormLabel>
                      <Input
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>

                <Divider />

                <Box w="full">
                <Heading size="md" mb={4}>Wallet Security</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired isInvalid={!!errors.walletPin}>
                    <FormLabel>Wallet PIN (6 digits)</FormLabel>
                    <Input
                        name="walletPin"
                        type="password"
                        maxLength={6}
                        value={formData.walletPin}
                        onChange={handleChange}
                        placeholder="Enter 6-digit PIN"
                    />
                    <FormErrorMessage>{errors.walletPin}</FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={!!errors.confirmWalletPin}>
                    <FormLabel>Confirm PIN</FormLabel>
                    <Input
                        name="confirmWalletPin"
                        type="password"
                        maxLength={6}
                        value={formData.confirmWalletPin}
                        onChange={handleChange}
                        placeholder="Confirm 6-digit PIN"
                    />
                    <FormErrorMessage>{errors.confirmWalletPin}</FormErrorMessage>
                    </FormControl>
                </SimpleGrid>
                </Box>

                {/* Business Information */}
                <Box w="full">
                  <Heading size="md" mb={4}>Business Information</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Business Name</FormLabel>
                      <Input
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Shop Name</FormLabel>
                      <Input
                        name="shopName"
                        value={formData.shopName}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Registration Number</FormLabel>
                      <Input
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Tax ID</FormLabel>
                      <Input
                        name="taxId"
                        value={formData.taxId}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Business Type</FormLabel>
                      <Select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                      >
                        <option value="retail">Retail</option>
                        <option value="wholesale">Wholesale</option>
                        <option value="manufacturer">Manufacturer</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Monthly Volume</FormLabel>
                      <Input
                        name="monthlyVolume"
                        type="number"
                        value={formData.monthlyVolume}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Phone</FormLabel>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Address</FormLabel>
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>City</FormLabel>
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Shop Details */}
                <Box w="full">
                  <Heading size="md" mb={4}>Shop Details</Heading>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                      />
                    </FormControl>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                      <FormControl>
                        <FormLabel>Opening Time</FormLabel>
                        <Input
                          name="operatingHours.open"
                          type="time"
                          value={formData.operatingHours.open}
                          onChange={handleChange}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Closing Time</FormLabel>
                        <Input
                          name="operatingHours.close"
                          type="time"
                          value={formData.operatingHours.close}
                          onChange={handleChange}
                        />
                      </FormControl>
                    </SimpleGrid>
                  </VStack>
                </Box>

                <Divider />

                {/* Contact Information */}
                <Box w="full">
                  <Heading size="md" mb={4}>Contact Information</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Contact Name</FormLabel>
                      <Input
                        name="contact.name"
                        value={formData.contact.name}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Contact Phone</FormLabel>
                      <Input
                        name="contact.phone"
                        value={formData.contact.phone}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Contact Email</FormLabel>
                      <Input
                        name="contact.email"
                        type="email"
                        value={formData.contact.email}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Media Upload */}
                <Box w="full">
                  <Heading size="md" mb={4}>Shop Media</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
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

                    <FormControl gridColumn="1 / -1">
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
                  </SimpleGrid>
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