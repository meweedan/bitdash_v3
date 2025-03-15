// pages/signup/merchant.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box,
  Container,
  HStack,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Checkbox,
  Text,
  useToast,
  Divider,
  Badge,
  InputGroup,
  InputLeftAddon,
  SimpleGrid,
  useColorModeValue,
  Progress,
  Select,
} from '@chakra-ui/react';
import Layout from '@/components/Layout';
import RiskDisclosure from '@/components/RiskDisclosure';
import { useTranslation } from 'react-i18next';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const PAYMENT_URL = 'https://Adfaly.bitdash.app';

const MerchantSignup = () => {
  const router = useRouter();
  const [agreedToRiskDisclosure, setAgreedToRiskDisclosure] = useState(false);
  const toast = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Handle risk disclosure acceptance from the modal
  const handleRiskAcceptance = (accepted) => {
    if (accepted) {
      setAgreedToRiskDisclosure(true);
    }
  };


  const [formData, setFormData] = useState({
    // User credentials
    email: '',
    password: '',
    confirmPassword: '',

    // Merchant required fields
    amount: 0,
    currency: 'LYD',
    description: '',
    payment_type: 'fixed',
    expiry: '',

    // Links will be auto-generated based on business name
    callback_url: '',
    success_url: '',
    cancel_url: '',

    // Metadata for business info
    metadata: {
      businessName: '',
      registrationNumber: '',
      address: '',
      phone: '',
      monthlyVolume: 0,
      contact: {
        name: '',
        phone: '',
        email: ''
      }
    },

    // Operator fields
    fullName: '',
    phone: '',
    businessLicense: '',
    taxId: ''
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const generateUrlSafeName = (businessName) => {
    return businessName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name.includes('metadata.')) {
      const [_, parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [parent]: child ? {
            ...prev.metadata[parent],
            [child]: type === 'number' ? parseFloat(value) : value
          } : value
        }
      }));

      // Auto-generate URLs when business name changes
      if (name === 'metadata.businessName') {
        const urlSafeName = generateUrlSafeName(value);
        setFormData(prev => ({
          ...prev,
          metadata: {
            ...prev.metadata,
            businessName: value
          },
          callback_url: `${PAYMENT_URL}/${urlSafeName}/callback`,
          success_url: `${PAYMENT_URL}/${urlSafeName}/success`,
          cancel_url: `${PAYMENT_URL}/${urlSafeName}/cancel`
        }));
      }
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
      'metadata.businessName',
      'fullName',
      'phone',
      'businessLicense',
      'taxId',
    ];

    for (const field of requiredFields) {
      const value = field.split('.').reduce((obj, key) => obj?.[key], formData);
      if (!value) {
        toast({
          title: 'Missing Required Field',
          description: `Please fill in ${field.split('.').pop().replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          status: 'error'
        });
        return false;
      }
    }

    if (formData.payment_type === 'fixed' && !formData.amount) {
      toast({
        title: 'Amount Required',
        description: 'Fixed payment type requires an amount',
        status: 'error'
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
      // 1. Create user account
      setProgress(20);
      const userRes = await fetch(`${API_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.email.split('@')[0],
          email: formData.email,
          password: formData.password,
        })
      });

      if (!userRes.ok) throw new Error('Failed to create user account');
      const { jwt, user } = await userRes.json();

      // 2. Update user role to Merchant (8)
      setProgress(40);
      await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({ role: 8 })
      });

      // 3. Create operator
      setProgress(60);
      const operatorData = {
        data: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          businessLicense: formData.businessLicense,
          taxId: formData.taxId,
          businessType: 'merchant',
          status: 'Pending',
          dateJoined: new Date().toISOString(),
          verificationStatus: false,
          users_permissions_user: user.id,
          publishedAt: new Date().toISOString()
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

      if (!operatorRes.ok) throw new Error('Failed to create operator profile');
      const operator = await operatorRes.json();

      // 4. Create merchant profile with publishedAt
      setProgress(80);
      const merchantData = {
        data: {
          amount: formData.payment_type === 'fixed' ? parseFloat(formData.amount) : null,
          currency: 'LYD',
          description: formData.metadata.businessName,
          status: 'active',
          payment_type: formData.payment_type,
          link_id: `M${Date.now()}`,
          callback_url: formData.callback_url,
          success_url: formData.success_url,
          cancel_url: formData.cancel_url,
          metadata: formData.metadata,
          operator: operator.data.id,
          users_permissions_user: user.id,
          publishedAt: new Date().toISOString()
        }
      };

      console.log('Sending merchant data:', JSON.stringify(merchantData, null, 2));

      const merchantRes = await fetch(`${API_URL}/api/merchants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify(merchantData)
      });

      if (!merchantRes.ok) {
        const errorData = await merchantRes.json();
        console.error('Full merchant error:', {
          status: merchantRes.status,
          data: errorData
        });
        throw new Error('Failed to create merchant profile');
      }

      const merchant = await merchantRes.json();

      // 5. Create wallet and update relationships
setProgress(90);
const walletData = {
  data: {
    balance: 0,
    currency: 'LYD',
    isActive: true,
    walletId: `W${Date.now()}`,
    dailyLimit: 5000,
    monthlyLimit: 50000,
    lastActivity: new Date().toISOString(),
    merchant: merchant.data.id,  // Link to merchant
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
  console.error('Wallet creation error:', error);
  throw new Error('Failed to create wallet');
}
const wallet = await walletRes.json();

// Update all relationships in parallel
await Promise.all([
  // Update operator with merchant reference
  fetch(`${API_URL}/api/operators/${operator.data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`
    },
    body: JSON.stringify({
      data: {
        merchants: merchant.data.id
      }
    })
  }),

  // Update merchant with wallet reference
  fetch(`${API_URL}/api/merchants/${merchant.data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`
    },
    body: JSON.stringify({
      data: {
        wallet: wallet.data.id,
        operator: operator.data.id
      }
    })
  })
]);

      // Success!
      setProgress(100);
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast({
        title: 'Success',
        description: 'Merchant account created successfully!',
        status: 'success',
        duration: 5000
      });

      router.push('/dashboard');

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
        <title>BitCash - Merchant Signup</title>
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
              <Heading size="lg">Create Merchant Account</Heading>
              <Badge colorScheme="blue" p={2} borderRadius="full">
                1.5% Transaction Fee
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
                      <FormLabel>Business Name</FormLabel>
                      <Input
                        name="metadata.businessName"
                        value={formData.metadata.businessName}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Full Name</FormLabel>
                      <Input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Registration Number</FormLabel>
                      <Input
                        name="metadata.registrationNumber"
                        value={formData.metadata.registrationNumber}
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

                    <FormControl isRequired>
                      <FormLabel>Monthly Volume</FormLabel>
                      <InputGroup>
                        <InputLeftAddon>LYD</InputLeftAddon>
                        <Input
                          name="metadata.monthlyVolume"
                          type="number"
                          value={formData.metadata.monthlyVolume}
                          onChange={handleChange}
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Business Address</FormLabel>
                      <Input
                        name="metadata.address"
                        value={formData.metadata.address}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Payment Settings */}
                <Box w="full">
                  <Heading size="sm" mb={4}>Payment Settings</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Payment Type</FormLabel>
                      <Select
                        name="payment_type"
                        value={formData.payment_type}
                        onChange={handleChange}
                      >
                        <option value="fixed">Fixed Amount</option>
                        <option value="variable">Variable Amount </option>
                        </Select>
                    </FormControl>

                    {formData.payment_type === 'fixed' && (
                      <FormControl isRequired>
                        <FormLabel>Fixed Amount</FormLabel>
                        <InputGroup>
                          <InputLeftAddon>LYD</InputLeftAddon>
                          <Input
                            name="amount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.amount}
                            onChange={handleChange}
                          />
                        </InputGroup>
                      </FormControl>
                    )}

                    <FormControl>
                      <FormLabel>Expiry Date (Optional)</FormLabel>
                      <Input
                        name="expiry"
                        type="datetime-local"
                        value={formData.expiry}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Contact Details */}
                <Box w="full">
                  <Heading size="sm" mb={4}>Contact Details</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Contact Person Name</FormLabel>
                      <Input
                        name="metadata.contact.name"
                        value={formData.metadata.contact.name}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Contact Phone</FormLabel>
                      <Input
                        name="metadata.contact.phone"
                        value={formData.metadata.contact.phone}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Contact Email</FormLabel>
                      <Input
                        name="metadata.contact.email"
                        type="email"
                        value={formData.metadata.contact.email}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>

                <FormControl isRequired>
                  <HStack spacing={2} align="center">
                    <Checkbox
                      isChecked={agreedToRiskDisclosure}
                      onChange={(e) => setAgreedToRiskDisclosure(e.target.checked)}
                      colorScheme="blue"
                    >
                      <Text fontSize="sm">
                        {t('agreeToRiskDisclosure', 'I have read and agree to the Risk Disclosure Statement')}
                      </Text>
                    </Checkbox>
                    
                    <RiskDisclosure 
                      platform="BitCash" 
                      accountType="merchant" 
                      onAccept={handleRiskAcceptance}
                    />
                  </HStack>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  w="full"
                  isLoading={loading}
                  loadingText="Creating Account..."
                >
                  Create Merchant Account
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

export default MerchantSignup;