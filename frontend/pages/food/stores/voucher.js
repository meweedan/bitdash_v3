import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
  SimpleGrid,
  useColorMode,
  Card,
  CardBody,
  Badge,
  Icon,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Progress,
  Flex,
} from '@chakra-ui/react';
import { FiCreditCard, FiShield, FiTrendingUp, FiClock } from 'react-icons/fi';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { processPayment } from '@/utils/payments';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const CREDIT_PACKAGES = [
  { 
    id: 1, 
    credits: 50, 
    tag: 'Basic', 
    basePrice: 50,
    color: 'blue',
    features: ['Basic rewards', '30-day validity']
  },
  { 
    id: 2, 
    credits: 100, 
    tag: 'Popular', 
    basePrice: 100,
    color: 'green',
    features: ['5% bonus credits', '60-day validity', 'Priority support']
  },
  { 
    id: 3, 
    credits: 200, 
    tag: 'Premium', 
    basePrice: 200,
    color: 'purple',
    features: ['10% bonus credits', '90-day validity', '24/7 support', 'Exclusive deals']
  },
  { 
    id: 4, 
    credits: 500, 
    tag: 'Ultimate', 
    basePrice: 500,
    color: 'gold',
    features: ['15% bonus credits', 'Unlimited validity', 'VIP support', 'Special perks', 'Premium status']
  }
];

const VoucherStore = () => {
  const { t } = useTranslation('common');
  const [isProcessing, setIsProcessing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const toast = useToast();
  const { colorMode } = useColorMode();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        const response = await fetch(
          `${BASE_URL}/api/customer-profiles?filters[users_permissions_user][id][$eq]=${user.id}&populate=*`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        
        const data = await response.json();
        setProfileData(data.data[0]);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const calculateLocalPrice = (basePrice) => {
    const currency = profileData?.attributes?.local_currency || 'USD';
    const exchangeRates = {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      AED: 3.67,
      SAR: 3.75,
    };
    return (basePrice * exchangeRates[currency]).toFixed(2);
  };

  const getCurrencySymbol = (currency) => {
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      AED: 'د.إ',
      SAR: 'ر.س',
    };
    return symbols[currency] || '$';
  };

  const handlePurchase = async (pkg) => {
    setIsProcessing(true);
    try {
      const payment = await processPayment({
        amount: pkg.credits,
        currency: profileData?.attributes?.local_currency || 'USD',
        type: 'voucher',
        itemId: pkg.id
      });

      const stripe = await stripePromise;
      const token = localStorage.getItem('token');

      const sessionResponse = await fetch(`${BASE_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          payment_id: payment.id,
          currency: profileData?.attributes?.local_currency || 'USD',
          amount: pkg.basePrice,
          credits: pkg.credits
        })
      });

      if (!sessionResponse.ok) throw new Error('Failed to create checkout session');
      const { sessionId } = await sessionResponse.json();

      const result = await stripe.redirectToCheckout({ sessionId });
      if (result.error) throw new Error(result.error.message);

    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: t('error'),
        description: error.message,
        status: 'error',
        duration: 5000
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const MotionCard = motion(Card);

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        <Box
          maxW="1200px"
          mx="auto"
          p={8}
          borderRadius="xl"
          boxShadow="xl"
          bg={colorMode === 'dark' ? 'gray.800' : 'white'}
          border="1px solid"
          borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}
        >
          <VStack spacing={8}>
            <Heading size="lg">{t('topUpBitWallet')}</Heading>
            
            {/* Wallet Status Section */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} width="full">
              <Stat
                px={{ base: 4, md: 6 }}
                py="5"
                border="1px solid"
                borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}
                borderRadius="lg"
              >
                <StatLabel>{t('currentBalance')}</StatLabel>
                <StatNumber>
                  {profileData?.attributes?.credit_balance || 0} BITS
                </StatNumber>
                <StatHelpText>
                  ≈ {getCurrencySymbol(profileData?.attributes?.local_currency)}
                  {calculateLocalPrice(profileData?.attributes?.credit_balance || 0)}
                </StatHelpText>
              </Stat>

              <Stat
                px={{ base: 4, md: 6 }}
                py="5"
                border="1px solid"
                borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}
                borderRadius="lg"
              >
                <StatLabel>{t('monthlySpending')}</StatLabel>
                <StatNumber>
                  {profileData?.attributes?.total_spent || 0} BITS
                </StatNumber>
                <Progress value={40} colorScheme="blue" size="sm" mt={2} />
              </Stat>

              <Stat
                px={{ base: 4, md: 6 }}
                py="5"
                border="1px solid"
                borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}
                borderRadius="lg"
              >
                <StatLabel>{t('rewardPoints')}</StatLabel>
                <StatNumber>
                  {Math.floor((profileData?.attributes?.total_spent || 0) * 0.1)}
                </StatNumber>
                <HStack spacing={1}>
                  <Icon as={FiTrendingUp} color="green.500" />
                  <Text color="green.500" fontSize="sm">+10% this month</Text>
                </HStack>
              </Stat>
            </SimpleGrid>

            <Divider />

            {/* Credit Packages */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} width="full">
              {CREDIT_PACKAGES.map((pkg) => (
                <MotionCard
                  key={pkg.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <CardBody>
                    <VStack spacing={4} height="100%">
                      <Badge colorScheme={pkg.color} px={3} py={1} borderRadius="full">
                        {pkg.tag}
                      </Badge>
                      
                      <Heading size="lg">
                        {pkg.credits} BITS
                      </Heading>
                      
                      <Text fontSize="2xl" fontWeight="bold">
                        {getCurrencySymbol(profileData?.attributes?.local_currency)}
                        {calculateLocalPrice(pkg.basePrice)}
                      </Text>

                      <VStack spacing={2} align="start" w="full">
                        {pkg.features.map((feature, index) => (
                          <HStack key={index}>
                            <Icon as={FiClock} color={`${pkg.color}.500`} />
                            <Text fontSize="sm">{feature}</Text>
                          </HStack>
                        ))}
                      </VStack>

                      <Flex mt="auto" w="full">
                        <Button
                          leftIcon={<Icon as={FiCreditCard} />}
                          colorScheme={pkg.color}
                          width="full"
                          onClick={() => handlePurchase(pkg)}
                          isLoading={isProcessing}
                          size="lg"
                        >
                          {t('topUp')}
                        </Button>
                      </Flex>
                    </VStack>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>

            {/* Security Notice */}
            <Box 
              p={4} 
              bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.50'} 
              borderRadius="lg"
              width="full"
            >
              <HStack spacing={3}>
                <Icon as={FiShield} boxSize={6} color="green.500" />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">{t('securePayment')}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {t('securePaymentDesc')}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </VStack>
        </Box>
      </Container>
    </Layout>
  );
};

export default VoucherStore;