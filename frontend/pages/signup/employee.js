// pages/signup/employee.js
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
  SimpleGrid,
  useColorModeValue,
  Progress,
  FormHelperText,
  Select,
  Textarea,
  Stack,
  InputGroup,
  InputLeftAddon,
  Tag,
  TagLabel,
  TagCloseButton,
  HStack
} from '@chakra-ui/react';

import Layout from '@/components/Layout';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const EmployeeSignup = () => {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [skillInput, setSkillInput] = useState('');

  const [formData, setFormData] = useState({
    // User credentials
    email: '',
    password: '',
    confirmPassword: '',

    // Personal Info
    fullName: '',
    phone: '',
    address: '',
    city: '',

    // Professional Info
    title: '',
    experience: '0-2',
    education: '',
    skills: [],
    bio: '',

    // Job Preferences
    preferredRoles: [],
    preferredLocations: [],
    minSalary: '',
    workType: 'full-time',
    remoteWork: false,

    // Wallet
    currency: 'LYD',
    walletPin: '',
    walletStatus: 'pending_verification'
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSkillAdd = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, skillInput.trim()]
        }));
      }
      setSkillInput('');
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
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
      'fullName',
      'phone',
      'address',
      'city'
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

      // 2. Create customer profile
      setProgress(50);
      const customerData = {
        data: {
          fullName: formData.fullName,
          phone: formData.phone,
          users_permissions_user: user.id,
          wallet_pin: parseInt(formData.walletPin),
          wallet_status: formData.walletStatus,
          // Job seeker specific fields
          jobPreferences: {
            roles: formData.preferredRoles,
            locations: formData.preferredLocations,
            salary: {
              min: parseFloat(formData.minSalary) || 0,
              currency: 'LYD'
            },
            type: [formData.workType],
            remote: formData.remoteWork
          },
          workExperience: [],
          education: [{
            institution: formData.education,
            degree: '',
            field: '',
            startDate: new Date().toISOString(),
          }],
          skills: formData.skills,
          certifications: []
        }
      };

      const customerRes = await fetch(`${API_URL}/api/customer-profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify(customerData)
      });

      if (!customerRes.ok) {
        throw new Error('Failed to create customer profile');
      }

      const customer = await customerRes.json();

      // 3. Create wallet
      setProgress(80);
      const walletData = {
        data: {
          balance: 0,
          currency: formData.currency,
          isActive: true,
          walletId: `CW${Date.now()}${Math.random().toString(36).substr(2, 4)}`.toUpperCase(),
          customer: customer.data.id
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

      // Success
      setProgress(100);
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast({
        title: 'Success',
        description: 'Your account has been created successfully',
        status: 'success',
        duration: 5000
      });

      router.push('/work/employee/dashboard');

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
        <title>BitWork - Job Seeker Signup</title>
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
              <Heading size="lg">Create Job Seeker Account</Heading>
              <Badge colorScheme="gray" p={2} borderRadius="full">
                Find Your Next Opportunity
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

                {/* Personal Information */}
                <Box w="full">
                  <Heading size="sm" mb={4}>Personal Information</Heading>
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

                {/* Professional Information */}
                <Box w="full">
                  <Heading size="sm" mb={4}>Professional Information</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel>Professional Title</FormLabel>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Software Engineer"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Years of Experience</FormLabel>
                      <Select
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                      >
                        <option value="0-2">0-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="10+">10+ years</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Education</FormLabel>
                      <Input
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        placeholder="Highest degree earned"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Skills</FormLabel>
                      <Input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleSkillAdd}
                        placeholder="Type skill and press Enter"
                      />
                      <FormHelperText>Press Enter to add skills</FormHelperText>
                      <Stack direction="row" mt={2} flexWrap="wrap" spacing={2}>
                        {formData.skills.map((skill) => (
                          <Tag
                            key={skill}
                            size="md"
                            borderRadius="full"
                            variant="solid"
                            colorScheme="bitwork"
                          >
                            <TagLabel>{skill}</TagLabel>
                            <TagCloseButton
                              onClick={() => handleSkillRemove(skill)}
                            />
                          </Tag>
                        ))}
                      </Stack>
                    </FormControl>

                    <FormControl gridColumn="span 2">
                      <FormLabel>Professional Bio</FormLabel>
                      <Textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Brief description of your professional background"
                        rows={3}
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Job Preferences */}
                <Box w="full">
                  <Heading size="sm" mb={4}>Job Preferences</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel>Work Type</FormLabel>
                      <Select
                        name="workType"
                        value={formData.workType}
                        onChange={handleChange}
                      >
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Minimum Expected Salary</FormLabel>
                      <InputGroup>
                        <InputLeftAddon>LYD</InputLeftAddon>
                        <Input
                          name="minSalary"
                          type="number"
                          value={formData.minSalary}
                          onChange={handleChange}
                        />
                      </InputGroup>
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
                  Create Job Seeker Account
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

            <Text textAlign="center" fontSize="sm" color="gray.500">
              Looking to hire?{' '}
              <Button
                variant="link"
                colorScheme="gray"
                size="sm"
                onClick={() => router.push('/signup/employer')}
              >
                Create an Employer Account
              </Button>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Layout>
  );
};

export default EmployeeSignup;