// pages/signup/employer.js
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
  Textarea
} from '@chakra-ui/react';

import Layout from '@/components/Layout';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const EmployerSignup = () => {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [formData, setFormData] = useState({
    // User credentials
    email: '',
    password: '',
    confirmPassword: '',

    // Company Info
    companyName: '',
    type: 'corporate',
    description: '',
    industry: '',
    size: '',
    website: '',

    // Contact Info
    fullName: '',
    phone: '',
    position: '',

    // Business Details
    registrationNumber: '',
    taxId: '',
    address: '',
    city: '',

    // Wallet Settings
    currency: 'LYD',
    isActive: true,
    dailyLimit: 50000,
    monthlyLimit: 1000000,

    // Subscription
    subscriptionTier: 'standard',
    status: 'active'
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    const requiredFields = [
      'email',
      'password',
      'companyName',
      'fullName',
      'phone',
      'registrationNumber',
      'taxId',
      'address'
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
      // 1. Create user with employer role
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

      // 2. Create company profile
      setProgress(40);
      const companyData = {
        data: {
          name: formData.companyName,
          type: formData.type,
          description: formData.description,
          industry: formData.industry,
          size: formData.size,
          address: formData.address,
          city: formData.city,
          verified: false
        }
      };

      const companyRes = await fetch(`${API_URL}/api/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify(companyData)
      });

      if (!companyRes.ok) {
        throw new Error('Failed to create company profile');
      }

      const company = await companyRes.json();

      // 3. Create employer profile
      setProgress(60);
      const employerData = {
        data: {
          user: user.id,
          company: company.data.id,
          fullName: formData.fullName,
          phone: formData.phone,
          position: formData.position,
          registrationNumber: formData.registrationNumber,
          taxId: formData.taxId,
          verificationStatus: 'pending'
        }
      };

      const employerRes = await fetch(`${API_URL}/api/employers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify(employerData)
      });

      if (!employerRes.ok) {
        throw new Error('Failed to create employer profile');
      }

      const employer = await employerRes.json();

      // 4. Create wallet
      setProgress(80);
      const walletData = {
        data: {
          balance: 0,
          currency: formData.currency,
          isActive: formData.isActive,
          walletId: `EW${Date.now()}${Math.random().toString(36).substr(2, 4)}`.toUpperCase(),
          dailyLimit: formData.dailyLimit,
          monthlyLimit: formData.monthlyLimit,
          lastActivity: new Date().toISOString(),
          employer: employer.data.id
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

      // 5. Create subscription
      setProgress(90);
      const subscriptionData = {
        data: {
          tier: formData.subscriptionTier,
          status: formData.status,
          employer: employer.data.id,
          start_date: new Date().toISOString()
        }
      };

      await fetch(`${API_URL}/api/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify(subscriptionData)
      });

      // Success
      setProgress(100);
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast({
        title: 'Success',
        description: 'Your employer account has been created successfully',
        status: 'success',
        duration: 5000
      });

      router.push('/employer/dashboard');

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
        <title>BitWork - Employer Signup</title>
      </Head>

      <Container maxW="container.md" py={8}>
        {loading && (
          <Progress 
            value={progress} 
            size="xs" 
            colorScheme="bitwork" 
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
              <Heading size="lg">Create Employer Account</Heading>
              <Badge colorScheme="gray" p={2} borderRadius="full">
                Post Jobs & Find Talent
              </Badge>
            </VStack>

            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                {/* Account Credentials */}
                <Box w="full">
                  <Heading size="sm" mb={4}>Account Credentials</Heading>
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

                {/* Company Information */}
                <Box w="full">
                  <Heading size="sm" mb={4}>Company Information</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Company Name</FormLabel>
                      <Input
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Company Type</FormLabel>
                      <Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                      >
                        <option value="corporate">Corporate</option>
                        <option value="sme">SME</option>
                        <option value="startup">Startup</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Industry</FormLabel>
                      <Input
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Company Size</FormLabel>
                      <Select
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                      >
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501+">501+ employees</option>
                      </Select>
                    </FormControl>

                    <FormControl gridColumn="span 2">
                      <FormLabel>Company Description</FormLabel>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Contact Information */}
                <Box w="full">
                  <Heading size="sm" mb={4}>Contact Information</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Full Name</FormLabel>
                      <Input
                        name="fullName"
                        value={formData.fullName}
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

                    <FormControl>
                      <FormLabel>Position</FormLabel>
                      <Input
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Business Details */}
                <Box w="full">
                  <Heading size="sm" mb={4}>Business Details</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
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

                    <FormControl isRequired gridColumn="span 2">
                      <FormLabel>Business Address</FormLabel>
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

                <Button
                  type="submit"
                  variant="bitwork-solid"
                  size="lg"
                  w="full"
                  isLoading={loading}
                  loadingText="Creating Account..."
                >
                  Create Employer Account
                </Button>
              </VStack>
            </form>

            <Text textAlign="center">
              Already have an account?{' '}
              <Button
                variant="link"
                colorScheme="gray"
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

export default EmployerSignup;