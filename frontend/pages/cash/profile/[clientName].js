import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Box,
  VStack,
  Heading,
  Text,
  Badge,
  Avatar,
  Flex,
  Spinner,
  Container,
  HStack,
  Button,
  IconButton,
  useToast,
  useColorModeValue,
  NumberInput, 
  NumberInputField, 
  PinInput,
  Divider
} from '@chakra-ui/react';
import { FiUser, FiPhone, FiCreditCard, FiArrowUpRight } from 'react-icons/fi';
import Layout from '@/components/Layout';
import GlassCard from '@/components/GlassCard';

export default function PublicProfile() {
  const router = useRouter();
  const { clientName } = router.query;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!clientName) return;
      
      setLoading(true);
      setError(null);

      try {
        // Try multiple ways to fetch the profile
        const responses = [
          // Try fetching by custom identifier (wallet ID or username)
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customer-profiles?` +
            `filters[wallet_qr_code][$eq]=${clientName}` +
            `&populate[avatar][fields][0]=url` +
            `&populate=*`),
          
          // Try fetching by ID
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customer-profiles/${clientName}?` +
            `populate[avatar][fields][0]=url` +
            `&populate=*`),
          
          // Try fetching by phone or custom field
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customer-profiles?` +
            `filters[$or][0][phone][$eq]=${clientName}` +
            `&filters[$or][1][wallet_qr_code][$eq]=${clientName}` +
            `&populate[avatar][fields][0]=url` +
            `&populate=*`)
        ];


        let response;
        for (const fetchPromise of responses) {
          response = await fetchPromise;
          if (response.ok) break;
        }

        if (!response || !response.ok) {
          throw new Error('Profile not found');
        }

        const jsonData = await response.json();
        
        // Handle different response structures
        const profileData = jsonData.data.length 
          ? jsonData.data[0]  // For filtered responses
          : jsonData.data;    // For direct ID fetch

        if (!profileData) {
          throw new Error('No profile data found');
        }

        console.log('Fetched Profile:', profileData);

        // Validate profile has necessary data
        if (!profileData.attributes) {
          throw new Error('Invalid profile structure');
        }

        setProfile(profileData);
      } catch (err) {
        console.error('Profile Fetch Error:', err);
        setError(err.message);
        toast({
          title: 'Error',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      } finally {
        setLoading(false);
      }
    };

    if (clientName) {
      fetchProfile();
    }
  }, [clientName, toast]);

  if (loading) {
    return (
      <Layout>
        <Flex minH="100vh" justify="center" align="center">
          <Spinner size="xl" thickness="3px" />
        </Flex>
      </Layout>
    );
  }

  if (error || !profile) {
    return (
      <Layout>
        <Flex justify="center" align="center" direction="column" gap={4}>
          <GlassCard p={6}>
            <Heading size="md">Profile Error</Heading>
            <Text color="red.500">{error || 'Failed to load profile'}</Text>
          </GlassCard>
        </Flex>
      </Layout>
    );
  }

  // Safely access nested data
  const attributes = profile.attributes || {};
  const walletData = attributes.wallet?.data?.attributes || {};

  return (
    <Layout>        
      <Head>
        <title>{attributes.fullName} | BitCash Profile</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Container py={8}>
        <GlassCard p={6}>
          <Box 
            bg={bgColor} 
            p={8} 
            borderRadius="xl" 
            borderWidth="1px"
            borderColor={borderColor}
            boxShadow="xl"
          >
            <VStack spacing={6} align="stretch">
              {/* Avatar Section */}
              <Flex justify="center">
                <Avatar
                  size="2xl"
                  name={attributes.fullName || 'User'}
                  src={attributes.avatar?.data 
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${attributes.avatar.data.attributes.url}`
                    : undefined
                  }
                  bg="blue.500"
                  color="white"
                />
              </Flex>

              {/* Profile Status */}
              <Badge 
                colorScheme={attributes.wallet_status === 'active' ? 'green' : 'red'}
                px={3} 
                py={2} 
                borderRadius="full"
                alignSelf="center"
                fontSize="sm"
              >
                {(attributes.wallet_status || 'unknown').toUpperCase()}
              </Badge>

              {/* Main Profile Info */}
              <VStack spacing={3}>
                <Heading size="xl" textAlign="center">
                  {attributes.fullName || 'Unknown User'}
                </Heading>
                <HStack>
                  <FiPhone />
                  <Text fontSize="lg">{attributes.phone || 'No phone'}</Text>
                </HStack>
              </VStack>

              <Divider borderWidth="2px" />

              {/* Wallet Information */}
              <VStack spacing={4} align="stretch">
                <HStack>
                  <FiUser />
                  <Text fontWeight="bold">Customer ID:</Text>
                  <Text>{profile.id}</Text>
                </HStack>
                <VStack spacing={4} align="stretch">
                  <Divider />
                  {/* Add Send Money Button */}
                  <Button
                    colorScheme="blue"
                    size="lg"
                    leftIcon={<FiArrowUpRight />}
                    onClick={() => router.push({
                      pathname: '/cash/client/transfer',
                      query: { 
                        recipientId: profile.id,
                        recipientName: attributes.fullName,
                        recipientPhone: attributes.phone
                      }
                    })}
                    width="full"
                    py={6}
                  >
                    Send Money
                  </Button>
                </VStack>
              </VStack>
            </VStack>
          </Box>
        </GlassCard>
      </Container>
    </Layout>
  );
}

// Add server-side rendering support if needed
export async function getServerSideProps({ params }) {
  return {
    props: {
      initialClientName: params.clientName
    }
  };
}