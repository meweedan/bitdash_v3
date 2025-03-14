// pages/eats/customer/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  useColorMode,
} from '@chakra-ui/react';
import {
  History,
  MapPin,
  Clock,
  Star,
} from 'lucide-react';

import Layout from '@/components/Layout';

const CustomerHome = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const quickActions = [
    {
      title: 'Order History',
      icon: History,
      path: '/eats/customer/dashboard',
      color: 'blue'
    },
    {
      title: 'Track Order',
      icon: Clock,
      path: '/eats/customer/track',
      color: 'green'
    },
    {
      title: 'Favorites',
      icon: Star,
      path: '/eats/browse?filter=favorites',
      color: 'yellow'
    }
  ];

  const recentOrders = [
    {
      id: 1,
      restaurant: 'Burger House',
      items: ['Double Cheese Burger', 'Fries'],
      date: '2024-01-24',
      status: 'delivered'
    },
    // Add more orders...
  ];

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <Heading size="lg" mb={2}>Welcome Back</Heading>
            <Text color="gray.500">What would you like to eat today?</Text>
          </Box>

          {/* Quick Actions */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {quickActions.map((action, idx) => (
              <Button
                key={idx}
                size="lg"
                height="100px"
                colorScheme={action.color}
                variant="outline"
                leftIcon={<action.icon />}
                onClick={() => router.push(action.path)}
              >
                {action.title}
              </Button>
            ))}
          </SimpleGrid>

          {/* Recent Orders */}
          <Box>
            <Heading size="md" mb={4}>Recent Orders</Heading>
            <VStack
              spacing={4}
              p={6}
              bg={isDark ? 'gray.800' : 'white'}
              rounded="xl"
              shadow="lg"
            >
              {recentOrders.map((order) => (
                <HStack
                  key={order.id}
                  w="full"
                  p={4}
                  bg={isDark ? 'gray.700' : 'gray.50'}
                  rounded="lg"
                  justify="space-between"
                >
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">{order.restaurant}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {order.items.join(', ')}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {order.date}
                    </Text>
                  </VStack>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => router.push(`/eats/customer/track/${order.id}`)}
                  >
                    Track Order
                  </Button>
                </HStack>
              ))}
            </VStack>
          </Box>

          {/* Browse Restaurants */}
          <Box
            p={6}
            bg={isDark ? 'gray.800' : 'white'}
            rounded="xl"
            shadow="lg"
          >
            <VStack spacing={4} align="stretch">
              <Heading size="md">Ready to Order?</Heading>
              <Button
                size="lg"
                colorScheme="blue"
                leftIcon={<MapPin />}
                onClick={() => router.push('/eats/browse')}
              >
                Browse Restaurants Near You
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Layout>
  );
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default CustomerHome;