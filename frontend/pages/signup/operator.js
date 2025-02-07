// pages/signup/index.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Layout from '@/components/Layout';
import Image from 'next/image';
import useSubdomain from '@/hooks/useSubdomain';
import { validateEmail, validatePhone } from '@/utils/validation';
import { SUBSCRIPTION_PLANS, getPlanById } from '@/config/subscriptionConfig';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Container,
  Heading,
  VStack,
  HStack,
  IconButton,
  Tooltip,
  AspectRatio,
  FormErrorMessage,
  Text,
  Progress,
  Badge,
} from '@chakra-ui/react';
import { QuestionOutlineIcon, CheckIcon } from '@chakra-ui/icons';

const PLATFORM_CONFIG = {
  menu: {
    type: 'Operator',
    roleId: 3,
    route: '/menu/operator/dashboard',
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://menu.bitdash.app',
  },
  auto: {
    type: 'Dealer',
    roleId: 5,
    route: '/auto/dealer/dashboard',
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://auto.bitdash.app',
  },
  stock: {
    type: 'Trader',
    roleId: 6,
    route: '/stock/dashboard',
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://stock.bitdash.app',
  },
};

const StepIndicator = ({ currentStep, totalSteps }) => (
  <HStack spacing={4} justify="center" mb={8}>
    {Array.from({ length: totalSteps }, (_, i) => (
      <Box
        key={i}
        w={3}
        h={3}
        borderRadius="full"
        bg={i + 1 <= currentStep ? 'blue.500' : 'gray.200'}
        transition="all 0.2s"
      />
    ))}
  </HStack>
);

const SubscriptionPlanCard = ({ plan, isSelected, onSelect }) => (
  <Box
    borderWidth="1px"
    borderRadius="xl"
    p={6}
    cursor="pointer"
    onClick={onSelect}
    borderColor={isSelected ? 'blue.500' : 'gray.200'}
    transition="all 0.2s"
    _hover={{
      transform: 'translateY(-2px)',
      shadow: 'md',
    }}
    position="relative"
    width="full"
    maxW="300px"
  >
    {plan.popular && (
      <Badge
        colorScheme="blue"
        position="absolute"
        top={-3}
        right={4}
        px={3}
        py={1}
        borderRadius="full"
      >
        Most Popular
      </Badge>
    )}

    <VStack spacing={4} align="stretch">
      <Heading size="md">
        {plan.name}
      </Heading>
      <Text fontSize="sm" color="gray.600">{plan.description}</Text>
      <Box py={2}>
        <Text fontSize="3xl" fontWeight="bold">
          ${plan.monthlyPrice}
          <Text as="span" fontSize="sm" fontWeight="normal" color="gray.600"> /month</Text>
        </Text>
        <Text fontSize="sm" color="green.500" mt={1}>First month free</Text>
      </Box>
      <VStack align="start" spacing={3}>
        {plan.features.map((feature, index) => (
          <HStack key={index} spacing={3} align="start">
            <CheckIcon color="green.500" mt={1} />
            <Text fontSize="sm">{feature}</Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
  </Box>
);

const FormField = ({ label, name, type = "text", value, onChange, error, helpText }) => (
  <FormControl isRequired isInvalid={error}>
    <HStack mb={2} align="center" justify="space-between">
      <FormLabel mb={0}>{label}</FormLabel>
      <Tooltip label={helpText} hasArrow placement="top">
        <IconButton
          icon={<QuestionOutlineIcon />}
          size="sm"
          variant="ghost"
          aria-label={`Help for ${label}`}
        />
      </Tooltip>
    </HStack>
    <Input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      border="1px solid"
      borderColor={error ? "red.300" : "gray.200"}
      _hover={{ borderColor: error ? "red.400" : "gray.300" }}
      _focus={{ 
        borderColor: error ? "red.500" : "blue.500",
        boxShadow: `0 0 0 1px ${error ? "red.500" : "blue.500"}`
      }}
    />
    {error && <FormErrorMessage>{error}</FormErrorMessage>}
  </FormControl>
);

export default function Signup() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const { platform } = useSubdomain();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('standard');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    businessLicense: '',
    taxId: '',
    restaurantName: '',
    restaurantAddress: '',
    restaurantDescription: '',
    dealershipName: '',
    dealershipAddress: '',
    companyName: '',
    warehouseAddress: '',
  });

  const [errors, setErrors] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'email':
        error = validateEmail(value) ? '' : 'Invalid email address';
        break;
      case 'phone':
        error = validatePhone(value) ? '' : 'Invalid phone number';
        break;
      default:
        error = value.trim() ? '' : 'This field is required';
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, logo: 'Logo must be less than 5MB' }));
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = () => {
    const fieldsToValidate = {
      1: ['email', 'password', 'fullName', 'phone', 'businessLicense', 'taxId'],
      2: platform === 'menu' ? ['restaurantName', 'restaurantAddress'] :
         platform === 'auto' ? ['dealershipName', 'dealershipAddress'] :
         ['companyName', 'warehouseAddress']
    };

    const currentFields = fieldsToValidate[step] || [];
    const newErrors = {};
    let isValid = true;

    currentFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    } else {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const createSubscription = async (jwt, operatorId) => {
    const plan = getPlanById(selectedPlan);
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30);

    const subscriptionRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          operator: operatorId,
          tier: selectedPlan,
          status: 'trial',
          commission_rate: platform === 'auto' ? 5.0 : 
                         platform === 'stock' ? 3.0 : 
                         plan.commission_rate,
          monthly_fee: platform === 'menu' ? plan.monthlyPrice : 0,
          start_date: new Date().toISOString(),
          end_date: trialEndDate.toISOString(),
          currency: 'USD',
          auto_renew: true,
          payment_status: 'trial',
          trial_ends_at: trialEndDate.toISOString(),
          publishedAt: new Date().toISOString()
        }
      }),
    });

    if (!subscriptionRes.ok) {
      const error = await subscriptionRes.json();
      console.error('Subscription creation error:', error);
      throw new Error('Failed to create subscription');
    }

    return subscriptionRes.json();
  };

const handleSubmit = async () => {
  if (!validateStep()) return;
  
  setLoading(true);
  setProgress(0);

  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    // 1. Create user
    setProgress(20);
    const userRes = await fetch(`${BASE_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: formData.email.split('@')[0],
        email: formData.email,
        password: formData.password,
      }),
    });

    if (!userRes.ok) {
      const error = await userRes.json();
      throw new Error(error.error?.message || 'Registration failed');
    }
    const { jwt, user } = await userRes.json();

    // 2. Set user role
    setProgress(40);
    await fetch(`${BASE_URL}/api/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        role: PLATFORM_CONFIG[platform].roleId,
      }),
    });

    // 3. Create operator profile
    setProgress(60);
    const operatorRes = await fetch(`${BASE_URL}/api/operators`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          businessLicense: formData.businessLicense,
          taxId: formData.taxId,
          businessType: platform === 'menu' ? 'restaurant' : 
                      platform === 'auto' ? 'dealer' : 'trader',
          status: 'Pending',
          dateJoined: new Date().toISOString(),
          verificationStatus: false,
          users_permissions_user: user.id,
          publishedAt: new Date().toISOString()
        }
      }),
    });

    if (!operatorRes.ok) throw new Error('Failed to create operator profile');
    const operator = await operatorRes.json();

    // 4. Platform specific setup
    setProgress(70);
    if (platform === 'menu') {
      let restaurant;
      let subscription;

      try {
        // 1. Upload logo if exists
        let logoId = null;
        if (logoFile) {
          const formData = new FormData();
          formData.append('files', logoFile);
          const uploadRes = await fetch(`${BASE_URL}/api/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${jwt}` },
            body: formData,
          });
          if (uploadRes.ok) {
            const uploadedFiles = await uploadRes.json();
            logoId = uploadedFiles[0].id;
          }
        }

        // 2. Create restaurant
        const restaurantRes = await fetch(`${BASE_URL}/api/restaurants`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            data: {
              name: formData.restaurantName,
              description: formData.restaurantDescription || '',
              address: formData.restaurantAddress,
              logo: logoId,
              operator: operator.data.id,
              users_permissions_user: user.id,
              custom_colors: {},
              qr_settings: {},
              publishedAt: new Date().toISOString()
            }
          }),
        });

        if (!restaurantRes.ok) {
          const error = await restaurantRes.json();
          console.error('Restaurant creation error:', error);
          throw new Error('Failed to create restaurant');
        }

        restaurant = await restaurantRes.json();

        // 3. Create subscription
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 30);

        const subscriptionRes = await fetch(`${BASE_URL}/api/subscriptions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            data: {
              operator: operator.data.id,
              restaurant: restaurant.data.id,
              users_permissions_user: user.id,
              tier: selectedPlan || 'standard',
              monthly_fee: getPlanById(selectedPlan)?.monthlyPrice || 80,
              commission_rate: 2.5,
              status: 'active',
              start_date: startDate.toISOString(),
              end_date: endDate.toISOString(),
              trial_ends_at: endDate.toISOString(),
              payment_status: 'trial',
              auto_renew: true,
              publishedAt: startDate.toISOString()
            }
          }),
        });

        if (!subscriptionRes.ok) {
          const error = await subscriptionRes.json();
          console.error('Subscription creation error:', error);
          throw new Error('Failed to create subscription');
        }

        subscription = await subscriptionRes.json();

        // 4. Update all relationships in parallel
        await Promise.all([
          // Update operator with restaurant and subscription
          fetch(`${BASE_URL}/api/operators/${operator.data.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({
              data: {
                restaurant: restaurant.data.id,
                subscription: subscription.data.id,
              }
            }),
          }),

          // Update restaurant with subscription
          fetch(`${BASE_URL}/api/restaurants/${restaurant.data.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({
              data: {
                operator: operator.data.id,
                subscription: subscription.data.id
              }
            }),
          }),

          // Update user with restaurant
          fetch(`${BASE_URL}/api/users/${user.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({
              restaurant: restaurant.data.id
            }),
          })
        ]);

        console.log('Created relationships:', {
          userId: user.id,
          operatorId: operator.data.id,
          restaurantId: restaurant.data.id,
          subscriptionId: subscription.data.id
        });

      } catch (error) {
        console.error('Error in restaurant/subscription setup:', error);
        throw error;
      }

      } else if (platform === 'auto') {
  const dealerRes = await fetch(`${BASE_URL}/api/auto-dealers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      data: {
        dealershipName: formData.dealershipName,
        dealershipAddress: formData.dealershipAddress,
        status: 'pending',
        operator: operator.data.id,
        commission_rate: 5.0, // Fixed 5% commission
        specializations: 'general',
        availableFinancing: false,
        insuranceProvider: false,
        salesHistory: {},
        certifications: {},
        publishedAt: new Date().toISOString()
      }
    }),
  });

  if (!dealerRes.ok) {
    console.error('Dealer creation error:', await dealerRes.json());
    throw new Error('Failed to create dealer profile');
  }

  const dealer = await dealerRes.json();

  // Update operator with dealer reference
  await fetch(`${BASE_URL}/api/operators/${operator.data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      data: {
        auto_dealer: dealer.data.id
      }
    }),
  });
}
else if (platform === 'stock') {
  const traderRes = await fetch(`${BASE_URL}/api/traders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      data: {
        companyName: formData.companyName,
        warehouseAddress: formData.warehouseAddress,
        status: 'pending',
        operator: operator.data.id,
        commission_rate: 3.0, // Fixed 3% commission
        tradingVolume: 0,
        rating: 0,
        inventoryTypes: {},
        certifications: {},
        publishedAt: new Date().toISOString()
      }
    }),
  });

  if (!traderRes.ok) {
    console.error('Trader creation error:', await traderRes.json());
    throw new Error('Failed to create trader profile');
  }

  const trader = await traderRes.json();

  // Update operator with trader reference
  await fetch(`${BASE_URL}/api/operators/${operator.data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      data: {
        trader: trader.data.id
      }
    }),
  });
}

      // Success
      setProgress(100);
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(user));

      toast({
        title: 'Success!',
        description: platform === 'menu' ? 
          'Registration successful! Your 30-day free trial has started.' : 
          'Registration successful!',
        status: 'success',
        duration: 5000,
      });

      // Redirect to dashboard
      if (process.env.NODE_ENV === 'development') {
        router.push(PLATFORM_CONFIG[platform].route);
      } else {
        window.location.href = `${PLATFORM_CONFIG[platform].baseUrl}${PLATFORM_CONFIG[platform].route}`;
      }

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Registration failed',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!platform) return null;

  return (
    <Layout>
      <Head>
        <title>{platform === 'menu' ? 'BitMenu' : platform === 'auto' ? 'BitAuto' : 'BitStock'} - Sign Up</title>
      </Head>

      <Container maxW="container.lg" py={10}>
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

        <StepIndicator 
          currentStep={step} 
          totalSteps={platform === 'menu' ? 3 : 2} 
        />

        <Box
          borderRadius="xl"
          borderColor="gray.200"
          p={8}
          backdropFilter="blur(20px)"
          bg="rgba(255, 255, 255, 0.1)"
          boxShadow="xl"
        >
          <VStack spacing={6} align="stretch">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <>
                <Heading size="lg" mb={6} align="center">Basic Information</Heading>
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  helpText="Enter your business email address"
                />
                <FormField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  helpText="At least 8 characters"
                />
                <FormField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  helpText="Your legal full name"
                />
                <FormField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  helpText="Business contact number"
                />
                <FormField
                  label="Business License"
                  name="businessLicense"
                  value={formData.businessLicense}
                  onChange={handleChange}
                  error={errors.businessLicense}
                  helpText="Your business license number"
                />
                <FormField
                  label="Tax ID"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleChange}
                  error={errors.taxId}
                  helpText="Your tax identification number"
                />
              </>
            )}

            {/* Step 2: Platform Specific Information */}
            {step === 2 && (
              <>
                <Heading size="lg" mb={6} align="center">
                  {platform === 'menu' ? 'Restaurant Information' :
                   platform === 'auto' ? 'Dealership Information' :
                   'Company Information'}
                </Heading>

                {platform === 'menu' && (
                  <>
                    <FormField
                      label="Restaurant Name"
                      name="restaurantName"
                      value={formData.restaurantName}
                      onChange={handleChange}
                      error={errors.restaurantName}
                      helpText="Official restaurant name"
                    />
                    <FormField
                      label="Restaurant Description"
                      name="restaurantDescription"
                      type="textarea" // Using textarea for longer text
                      value={formData.restaurantDescription}
                      onChange={handleChange}
                      error={errors.restaurantDescription}
                      helpText="Describe your restaurant (optional)"
                      required={false}
                    />
                    <FormField
                      label="Restaurant Address"
                      name="restaurantAddress"
                      value={formData.restaurantAddress}
                      onChange={handleChange}
                      error={errors.restaurantAddress}
                      helpText="Physical location of restaurant"
                    />
                    <FormControl>
                      <HStack mb={2} align="center" justify="space-between">
                        <FormLabel mb={0}>Restaurant Logo</FormLabel>
                        <Tooltip label="Upload your restaurant logo (max 5MB)" hasArrow>
                          <IconButton
                            icon={<QuestionOutlineIcon />}
                            size="sm"
                            variant="ghost"
                          />
                        </Tooltip>
                      </HStack>
                      {logoPreview && (
                        <AspectRatio ratio={1} maxW="100px" mb={3}>
                          <Image
                            src={logoPreview}
                            alt="Logo preview"
                            layout="fill"
                            objectFit="contain"
                          />
                        </AspectRatio>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        p={2}
                      />
                      {errors.logo && (
                        <FormErrorMessage>{errors.logo}</FormErrorMessage>
                      )}
                    </FormControl>
                  </>
                )}

                {platform === 'auto' && (
                  <>
                    <Text fontSize="lg" color="blue.600" mb={4}>
                      Commission Rate: 5% per transaction
                    </Text>
                    <FormField
                      label="Dealership Name"
                      name="dealershipName"
                      value={formData.dealershipName}
                      onChange={handleChange}
                      error={errors.dealershipName}
                      helpText="Official dealership name"
                    />
                    <FormField
                      label="Dealership Address"
                      name="dealershipAddress"
                      value={formData.dealershipAddress}
                      onChange={handleChange}
                      error={errors.dealershipAddress}
                      helpText="Physical location of dealership"
                    />
                  </>
                )}

                {platform === 'stock' && (
                  <>
                    <Text fontSize="lg" color="blue.600" mb={4}>
                      Commission Rate: 3% per transaction
                    </Text>
                    <FormField
                      label="Company Name"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      error={errors.companyName}
                      helpText="Official company name"
                    />
                    <FormField
                      label="Warehouse Address"
                      name="warehouseAddress"
                      value={formData.warehouseAddress}
                      onChange={handleChange}
                      error={errors.warehouseAddress}
                      helpText="Primary warehouse location"
                    />
                  </>
                )}
              </>
            )}

            {/* Step 3: Subscription Selection (BitMenu only) */}
            {step === 3 && platform === 'menu' && (
              <>
                <Heading size="lg" mb={2} align="center">Choose Your Plan</Heading>
                <Text mb={6} align="center">Start with a 30-day free trial</Text>
                
                <VStack spacing={5}>
                  {SUBSCRIPTION_PLANS.map(plan => (
                    <SubscriptionPlanCard
                      key={plan.id}
                      plan={plan}
                      isSelected={selectedPlan === plan.id}
                      onSelect={() => setSelectedPlan(plan.id)}
                    />
                  ))}
                </VStack>
              </>
            )}

            {/* Navigation Buttons */}
            <HStack justify="space-between" mt={8}>
              {step > 1 && (
                <Button
                  variant="ghost"
                  onClick={() => setStep(prev => prev - 1)}
                  isDisabled={loading}
                >
                  Back
                </Button>
              )}
              
              <Button
                colorScheme="blue"
                size="lg"
                ml="auto"
                onClick={step < (platform === 'menu' ? 3 : 2) ? handleNextStep : handleSubmit}
                isLoading={loading}
                loadingText="Creating Account..."
              >
                {step < (platform === 'menu' ? 3 : 2) ? 'Next' : 'Create Account'}
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}