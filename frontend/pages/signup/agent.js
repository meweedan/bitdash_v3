// pages/signup/agent.js
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

const AgentSignup = () => {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [formData, setFormData] = useState({
    // User credentials
    email: '',
    password: '',
    confirmPassword: '',

    // Operator fields (with i18n)
    fullName: '',
    phone: '',
    businessLicense: '',
    taxId: '',
    businessType: 'agent',
    status: 'Pending',
    dateJoined: new Date().toISOString(),
    verificationStatus: false,
    locale: 'en',

    // Agent fields
    businessName: '',
    cashBalance: 0.0,
    agentStatus: 'pending',
    location: {
      address: '',
      coordinates: { lat: 0, lng: 0 },
      type: 'Point'
    },
    operatingHours: {
      open: '09:00',
      close: '17:00'
    },
    dailyTransactionLimit: 10000,
    supportedCurrencies: ['LYD'],
    ratingScore: 0,

    // Bank Details
    bankName: '',
    bankAccountNumber: '',
    swiftCode: '',

    // Wallet fields
    initialBalance: 0,
    currency: 'LYD',
    isActive: true,
    dailyLimit: 10000,
    monthlyLimit: 200000,
    walletStatus: 'active'
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
      'fullName',
      'phone',
      'businessName',
      'businessLicense',
      'taxId',
      'bankName',
      'bankAccountNumber',
      'swiftCode',
      'cashBalance',
      'location.address'
    ];

    for (const field of requiredFields) {
      const value = field.includes('.') 
        ? field.split('.').reduce((obj, key) => obj?.[key], formData)
        : formData[field];
        
      if (!value) {
        toast({
          title: 'Missing Required Field',
          description: `Please fill in ${field.split('.').pop().replace(/([A-Z])/g, ' $1').toLowerCase()}`,
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
      // 1. Create user with agent role (7)
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

      // 2. Update user role to Agent (7)
      setProgress(30);
      await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({ role: 7 })
      });

      // 3. Create operator with i18n support
      setProgress(40);
      const operatorData = {
        data: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          businessLicense: formData.businessLicense,
          taxId: formData.taxId,
          businessType: 'agent',
          status: formData.status,
          dateJoined: formData.dateJoined,
          verificationStatus: formData.verificationStatus,
          users_permissions_user: user.id,
          locale: formData.locale
        }
      };

      const operatorRes = await fetch(`${API_URL}/api/operators`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify(operatorData)
      });

      if (!operatorRes.ok) {
        throw new Error('Failed to create operator profile');
      }

      const operator = await operatorRes.json();

      // 4. Create agent profile
      setProgress(60);
      const agentData = {
        data: {
          cashBalance: parseFloat(formData.cashBalance) || 0.0,
          status: formData.agentStatus,
          location: formData.location,
          operatingHours: formData.operatingHours,
          dailyTransactionLimit: formData.dailyTransactionLimit,
          supportedCurrencies: formData.supportedCurrencies,
          ratingScore: formData.ratingScore,
          operator: operator.data.id,
          users_permissions_user: user.id,
          bankName: formData.bankName,
          bankAccountNumber: formData.bankAccountNumber,
          swiftCode: formData.swiftCode
        }
      };

      const agentRes = await fetch(`${API_URL}/api/agents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify(agentData)
      });

      if (!agentRes.ok) {
        throw new Error('Failed to create agent profile');
      }

      const agent = await agentRes.json();

      // 5. Create wallet
      setProgress(80);
      const walletData = {
        data: {
          balance: parseFloat(formData.initialBalance) || 0,
          currency: formData.currency,
          isActive: formData.isActive,
          walletId: `AW${Date.now()}${Math.random().toString(36).substr(2, 4)}`.toUpperCase(),
          dailyLimit: formData.dailyLimit,
          monthlyLimit: formData.monthlyLimit,
          lastActivity: new Date().toISOString(),
          agent: agent.data.id
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

      const wallet = await walletRes.json();

      // 6. Update operator with agent reference
      setProgress(90);
      await fetch(`${API_URL}/api/operators/${operator.data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({
          data: {
            agents: agent.data.id
          }
        })
      });

      // 7. Update agent with wallet reference
      await fetch(`${API_URL}/api/agents/${agent.data.id}`, {
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
        description: 'Your agent account has been created successfully',
        status: 'success',
        duration: 5000
      });

      router.push('/cash/agent/dashboard');

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
    const baseUsername = email.split('@')[0];
    return baseUsername.length >= 3 ? baseUsername : `${baseUsername}${Math.random().toString(36).substr(2, 4)}`;
  };

  return (
    <Layout>
      <Head>
        <title>BitCash - Agent Signup</title>
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
              <Heading size="lg">Become a BitCash Agent</Heading>
              <Badge colorScheme="blue" p={2} borderRadius="full">
                1% Commission on All Transactions
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

                {/* Business Information */}
                <Box w="full">
                  <Heading size="sm" mb={4}>Business Information</Heading>
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
                      <FormLabel>Business Name</FormLabel>
                      <Input
                        name="businessName"
                        value={formData.businessName}
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
                      <FormLabel>Business License</FormLabel>
                      <Input
                        name="businessLicense"
                        value={formData.businessLicense}
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
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Agent Details */}
                <Box w="full">
                  <Heading size="sm" mb={4}>Agent Details</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Initial Cash Balance</FormLabel>
                      <InputGroup>
                        <InputLeftAddon>LYD</InputLeftAddon>
                        <Input
                          name="cashBalance"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.cashBalance}
                          onChange={handleChange}
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Daily Transaction Limit</FormLabel>
                      <InputGroup>
                        <InputLeftAddon>LYD</InputLeftAddon>
                        <Input
                          name="dailyTransactionLimit"
                          type="number"
                          min="0"
                          value={formData.dailyTransactionLimit}
                          onChange={handleChange}
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Opening Time</FormLabel>
                      <Input
                        name="operatingHours.open"
                        type="time"
                        value={formData.operatingHours.open}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
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

                {/* Location Information */}
                <Box w="full">
                  <Heading size="sm" mb={4}>Location</Heading>
                  <FormControl isRequired>
                    <FormLabel>Operating Address</FormLabel>
                    <Input
                      name="location.address"
                      value={formData.location.address}
                      onChange={handleChange}
                    />
                    <FormHelperText>Physical location where you'll operate</FormHelperText>
                  </FormControl>
                </Box>

                <Divider />

                {/* Bank Information */}
                <Box w="full">
                  <Heading size="sm" mb={4}>Bank Information</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Bank Name</FormLabel>
                      <Input
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Bank Account Number</FormLabel>
                      <Input
                        name="bankAccountNumber"
                        value={formData.bankAccountNumber}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>SWIFT Code</FormLabel>
                      <Input
                        name="swiftCode"
                        value={formData.swiftCode}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Wallet Settings */}
                <Box w="full">
                  <Heading size="sm" mb={4}>Wallet Settings</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel>Daily Limit</FormLabel>
                      <InputGroup>
                        <InputLeftAddon>LYD</InputLeftAddon>
                        <Input
                          name="dailyLimit"
                          type="number"
                          min="0"
                          value={formData.dailyLimit}
                          onChange={handleChange}
                          disabled
                        />
                      </InputGroup>
                      <FormHelperText>Default: 10,000 LYD</FormHelperText>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Monthly Limit</FormLabel>
                      <InputGroup>
                        <InputLeftAddon>LYD</InputLeftAddon>
                        <Input
                          name="monthlyLimit"
                          type="number"
                          min="0"
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
                  colorScheme="blue"
                  size="lg"
                  w="full"
                  isLoading={loading}
                  loadingText="Creating Account..."
                >
                  Create Agent Account
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

export default AgentSignup;