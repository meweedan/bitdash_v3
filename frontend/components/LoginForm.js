import React, { useState } from 'react';
import {
  VStack, 
  FormControl, 
  FormLabel, 
  Input, 
  Button, 
  useToast,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
  Box, 
  Select,
  Heading,
  Text,
  FormHelperText
} from '@chakra-ui/react';

const CUSTOMER_ROLE_ID = 4;

const LoginForm = ({ onClose }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    wallet_pin: '',
    local_currency: 'LYD'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Login failed');

      const profileResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customer-profiles?filters[users_permissions_user][id][$eq]=${data.user.id}&populate=*`,
        {
          headers: {
            'Authorization': `Bearer ${data.jwt}`,
          },
        }
      );

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        if (profileData.data?.[0]) {
          localStorage.setItem('customerProfile', JSON.stringify(profileData.data[0]));
          setCurrentUser(profileData.data[0]);
        }
      }

      localStorage.setItem('token', data.jwt);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast({
        title: '🎉 Welcome back!',
        status: 'success',
        duration: 2000
      });

    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  };

  const handleRegister = async () => {
    if (!formData.phone.startsWith('+')) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Must start with country code (e.g., +218)',
        status: 'error',
        duration: 3000
      });
      return;
    }

    try {
      const registerResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.email,
          email: formData.email,
          password: formData.password,
          role: CUSTOMER_ROLE_ID
        })
      });

      const userData = await registerResponse.json();
      if (!registerResponse.ok) throw new Error(userData.error?.message);

      const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customer-profiles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userData.jwt}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            fullName: formData.fullName,
            phone: formData.phone,
            users_permissions_user: userData.user.id,
            wallet_pin: parseInt(formData.wallet_pin),
            local_currency: formData.local_currency,
            credit_balance: 0,
            total_spent: 0,
            wallet_status: 'active',
            allergies: [],
            dietary_preferences: [],
            transaction_history: []
          }
        })
      });

      if (!profileResponse.ok) {
        const error = await profileResponse.json();
        throw new Error(error.error?.message || 'Failed to create profile');
      }

      const profileData = await profileResponse.json();

      localStorage.setItem('token', userData.jwt);
      localStorage.setItem('user', JSON.stringify(userData.user));
      localStorage.setItem('customerProfile', JSON.stringify(profileData.data));
      
      setCurrentUser(profileData.data);

      toast({
        title: '🎉 Account created!',
        status: 'success',
        duration: 2000
      });

    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLoginMode) {
        await handleLogin();
      } else {
        await handleRegister();
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (currentUser) {
    return (
      <Box p={4} bg="whiteAlpha.100" borderRadius="md">
        <VStack spacing={4} align="stretch">
          <Heading size="md">Welcome {currentUser.fullName}! 👋</Heading>
          <Text>{currentUser.phone}</Text>
          <Button colorScheme="blue" onClick={onClose}>
            Continue
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box as="form" onSubmit={handleSubmit} p={4}>
      <Tabs isFitted variant="soft-rounded" index={isLoginMode ? 0 : 1}>
        <TabList mb={4}>
          <Tab onClick={() => setIsLoginMode(true)}>Login</Tab>
          <Tab onClick={() => setIsLoginMode(false)}>Register</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  onChange={handleInputChange}
                />
              </FormControl>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  name="fullName"
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Phone</FormLabel>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    if (e.target.value === '' || e.target.value.startsWith('+')) {
                      handleInputChange(e);
                    }
                  }}
                  placeholder="+218XXXXXXXXX"
                />
                <FormHelperText>Include country code (e.g., +218)</FormHelperText>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Wallet PIN (4 digits)</FormLabel>
                <Input
                  name="wallet_pin"
                  type="number"
                  maxLength={4}
                  pattern="\d{4}"
                  onChange={handleInputChange}
                  placeholder="Enter 4-digit PIN"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Currency</FormLabel>
                <Select
                  name="local_currency"
                  defaultValue="LYD"
                  onChange={handleInputChange}
                >
                  <option value="LYD">LYD</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="AED">AED</option>
                  <option value="BHD">BHD</option>
                  <option value="KWD">KWD</option>
                  <option value="OMR">OMR</option>
                  <option value="QAR">QAR</option>
                  <option value="SAR">SAR</option>
                  <option value="TND">TND</option>
                  <option value="EGP">EGP</option>
                </Select>
              </FormControl>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Button
        mt={4}
        w="full"
        colorScheme="blue"
        type="submit"
        isLoading={isLoading}
      >
        {isLoginMode ? "Login" : "Register"}
      </Button>
    </Box>
  );
};

export default LoginForm;