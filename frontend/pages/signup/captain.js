// pages/signup/captain.js
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
} from '@chakra-ui/react';
import Layout from '@/components/Layout';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const CaptainSignup = () => {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [formData, setFormData] = useState({
    // User credentials
    email: '',
    password: '',
    confirmPassword: '',

    // Captain fields
    name: '',
    phone: '',
    vehicle_type: 'bike',
    availability_status: 'offline',
    
    // Location component
    location: {
      address: '',
      coordinates: { lat: 0, lng: 0 },
      type: 'Point'
    },
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

    const requiredFields = [
      'name',
      'phone',
      'vehicle_type',
      'location.address'
    ];

    for (const field of requiredFields) {
      const value = field.includes('.') 
        ? field.split('.').reduce((obj, key) => obj?.[key], formData)
        : formData[field];
        
      if (!value) {
        toast({
          title: 'Missing Required Field',
          description: `Please fill in ${field.split('.').pop()}`,
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
      // 1. Create user account
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

      if (!userRes.ok) throw new Error('Failed to create user account');
      const { jwt, user } = await userRes.json();

      // 2. Update user role to Captain (9)
      setProgress(30);
      await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({ role: 9 })
      });

      // 3. Create captain profile
      setProgress(50);
      const captainData = {
        data: {
          name: formData.name,
          phone: formData.phone,
          vehicle_type: formData.vehicle_type,
          availability_status: formData.availability_status,
          location: formData.location,
          users_permissions_user: user.id,
          rating: 5.0,
          earnings: 0.0
        }
      };

      const captainRes = await fetch(`${API_URL}/api/captains`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify(captainData)
      });

      if (!captainRes.ok) throw new Error('Failed to create captain profile');
      const captain = await captainRes.json();

      // 4. Create payout wallet
      setProgress(70);
      const walletData = {
        data: {
          balance: 0,
          currency: 'LYD',
          isActive: true,
          walletId: `CW${Date.now()}${Math.random().toString(36).substr(2, 4)}`.toUpperCase(),
          dailyLimit: 10000,
          monthlyLimit: 50000,
          lastActivity: new Date().toISOString(),
          captain: captain.data.id
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
        const error = await walletRes.json();
        throw new Error(error.error?.message || 'Wallet creation failed');
      }
      const wallet = await walletRes.json();

      // 5. Update captain with wallet reference
      setProgress(90);
      await fetch(`${API_URL}/api/captains/${captain.data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({
          data: {
            wallet: wallet.data.id
          }
        })
      });

      // Success
      setProgress(100);
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast({
        title: 'Success',
        description: 'Captain account created!',
        status: 'success',
        duration: 5000
      });

      router.push('/bsoraa/captain/dashboard');

    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Account creation failed',
        status: 'error',
        duration: 5000
      });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const generateUsername = (email) => {
    const baseUsername = email.split('@')[0];
    return baseUsername.length >= 3 ? baseUsername : `${baseUsername}${Math.random().toString(36).substr(2, 4)}`;
  };

  return (
    <Layout>
      <Head>
        <title>Bsoraa - Become a Delivery Captain</title>
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
              <Heading size="lg">Become a Captain</Heading>
              <Badge colorScheme="green" p={2} borderRadius="full">
                Earn more with Bsoraa!
              </Badge>
            </VStack>

            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                {/* Account Credentials */}
                <Box w="full">
                  <Heading size="sm" mb={4}>Account Details</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Password</FormLabel>
                      <Input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <FormHelperText>Minimum 8 characters</FormHelperText>
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

                {/* Personal Information */}
                <Box w="full">
                  <Heading size="sm" mb={4}>Personal Information</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Full Name</FormLabel>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Phone Number</FormLabel>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Vehicle Type</FormLabel>
                      <Select
                        name="vehicle_type"
                        value={formData.vehicle_type}
                        onChange={handleChange}
                      >
                        <option value="bike">Motorcycle</option>
                        <option value="car">Car</option>
                        <option value="scooter">Scooter</option>
                      </Select>
                    </FormControl>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Location Information */}
                <Box w="full">
                  <Heading size="sm" mb={4}>Location Details</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Operating Address</FormLabel>
                      <Input
                        name="location.address"
                        value={formData.location.address}
                        onChange={handleChange}
                        placeholder="Enter your primary operating area"
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>

                <Button
                  type="submit"
                  colorScheme="green"
                  size="lg"
                  w="full"
                  isLoading={loading}
                  loadingText="Creating Account..."
                >
                  Join as Captain
                </Button>
              </VStack>
            </form>

            <Text textAlign="center">
              Already have an account?{' '}
              <Button
                variant="link"
                colorScheme="green"
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

export default CaptainSignup;