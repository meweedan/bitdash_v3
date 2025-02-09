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
  InputLeftAddon,
  SimpleGrid,
  useColorModeValue,
  Progress,
  FormHelperText,
  Select,
  Textarea,
  Stack,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';

import Layout from '@/components/Layout';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const ShopOwnerSignup = () => {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [categoryInput, setCategoryInput] = useState('');

  const [formData, setFormData] = useState({
    // User credentials
    email: '',
    password: '',
    confirmPassword: '',

    // Shop Info
    shopName: '',
    description: '',
    categories: [],
    logo: null,
    coverImage: null,

    // Owner Info
    fullName: '',
    phone: '',
    businessLicense: '',
    taxId: '',

    // Location
    address: '',
    city: '',
    coordinates: {
      lat: 0,
      lng: 0
    },

    // Business Details
    registrationNumber: '',
    businessType: 'retail',
    operatingHours: {
      open: '09:00',
      close: '21:00'
    },

    // Wallet Settings
    walletPin: '',
    currency: 'LYD',
    isActive: true,
    dailyLimit: 10000,
    monthlyLimit: 200000,
    walletStatus: 'pending_verification'
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (name.includes('.')) {
      // Handle nested objects (location, operatingHours)
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

  const handleCategoryAdd = (e) => {
    if (e.key === 'Enter' && categoryInput.trim()) {
      e.preventDefault();
      if (!formData.categories.includes(categoryInput.trim())) {
        setFormData(prev => ({
          ...prev,
          categories: [...prev.categories, categoryInput.trim()]
        }));
      }
      setCategoryInput('');
    }
  };

  const handleCategoryRemove = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat !== category)
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.email.includes('@')) {
      toast({ title: 'Invalid email', status: 'error' });
      return false;
    }

    if (formData.password.length < 8) {
      toast({ title: 'Password too short', status: 'error' });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'Passwords do not match', status: 'error' });
      return false;
    }

    if (formData.walletPin.length !== 6) {
      toast({ title: 'Wallet PIN must be 6 digits', status: 'error' });
      return false;
    }

    const requiredFields = [
      'email',
      'password',
      'shopName',
      'fullName',
      'phone',
      'businessLicense',
      'taxId',
      'address',
      'registrationNumber'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast({
          title: 'Missing Required Field',
          description: `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          status: 'error'
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 1. Create user
      setProgress(20);
      const userRes = await fetch(`${API_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: generateUsername(formData.email),
          email: formData.email,
          password: formData.password,
        })
      });

      if (!userRes.ok) {
        const error = await userRes.json();
        throw new Error(error.error?.message || 'Registration failed');
      }

      const { jwt, user } = await userRes.json();

      // 2. Create shop owner profile
      setProgress(40);
      const shopOwnerData = {
        data: {
          user: user.id,
          shopName: formData.shopName,
          description: formData.description,
          categories: formData.categories,
          fullName: formData.fullName,
          phone: formData.phone,
          businessLicense: formData.businessLicense,
          taxId: formData.taxId,
          location: {
            address: formData.address,
            city: formData.city,
            coordinates: formData.coordinates
          },
          businessType: formData.businessType,
          operatingHours: formData.operatingHours,
          verificationStatus: 'pending',
          rating: 0
        }
      };

      const shopOwnerRes = await fetch(`${API_URL}/api/shop-owners`, {
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

      const shopOwner = await shopOwnerRes.json();

      // 3. Create wallet
      setProgress(70);
      const walletData = {
        data: {
          balance: 0,
          currency: formData.currency,
          isActive: formData.isActive,
          walletId: `SW${Date.now()}${Math.random().toString(36).substr(2, 4)}`.toUpperCase(),
          dailyLimit: formData.dailyLimit,
          monthlyLimit: formData.monthlyLimit,
          lastActivity: new Date().toISOString(),
          shop_owner: shopOwner.data.id
        }
      };

      const walletRes = await fetch(`${API_URL}/api/wallets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify(walletData)
      });

      if (!walletRes.ok) {
        throw new Error('Failed to create wallet');
      }

      // 4. Update shop owner with wallet reference
      setProgress(90);
      await fetch(`${API_URL}/api/shop-owners/${shopOwner.data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({
          data: {
            wallet: walletRes.data.id
          }
        })
      });

      // Success
      setProgress(100);
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast({
        title: 'Success',
        description: 'Your shop account has been created successfully',
        status: 'success',
        duration: 5000
      });

      router.push('/shop/dashboard');

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

  const generateUsername = (email) => {
    return `${email.split('@')[0]}_${Math.random().toString(36).substr(2, 4)}`;
  };

   return (
    <Layout>
      <Head>
        <title>BitShop - Store Owner Signup</title>
      </Head>

      <Container maxW="container.md" py={8}>
        {loading && (
          <Progress 
            value={progress} 
            size="xs" 
            colorScheme="bitshop" 
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
                  <Heading size="sm" mb={4}>Account Credentials</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
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
                </Box>

                <Divider />

                {/* Wallet Setup */}
                <Box w="full">
                  <Heading size="sm" mb={4}>Wallet Setup</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Wallet PIN</FormLabel>
                      <Input
                        name="walletPin"
                        type="password"
                        maxLength={6}
                        value={formData.walletPin}
                        onChange={handleChange}
                        placeholder="6-digit PIN"
                      />
                      <FormHelperText>
                        Create a 6-digit PIN for your BitCash wallet
                      </FormHelperText>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Daily Transaction Limit</FormLabel>
                      <InputGroup>
                        <InputLeftAddon>LYD</InputLeftAddon>
                        <Input
                          name="dailyLimit"
                          type="number"
                          value={formData.dailyLimit}
                          onChange={handleChange}
                          disabled
                        />
                      </InputGroup>
                      <FormHelperText>Default: 10,000 LYD</FormHelperText>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Monthly Transaction Limit</FormLabel>
                      <InputGroup>
                        <InputLeftAddon>LYD</InputLeftAddon>
                        <Input
                          name="monthlyLimit"
                          type="number"
                          value={formData.monthlyLimit}
                          onChange={handleChange}
                          disabled
                        />
                      </InputGroup>
                      <FormHelperText>Default: 200,000 LYD</FormHelperText>
                    </FormControl>
                  </SimpleGrid>
                </Box>

                <Button
                  type="submit"
                  variant="bitshop-solid"
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
              Already have an account?{' '}
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