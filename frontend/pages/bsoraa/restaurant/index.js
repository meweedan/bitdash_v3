// pages/eats/restaurant/index.js
import { useState } from 'react';
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
  Switch,
  SimpleGrid,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorMode,
} from '@chakra-ui/react';
import {
  ClipboardList,
  Settings,
  DollarSign,
  Users,
  ShoppingBag,
  ChevronRight
} from 'lucide-react';

import Layout from '@/components/Layout';

const RestaurantHome = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [isOpen, setIsOpen] = useState(true);

  const todayStats = {
    orders: 45,
    revenue: 2800,
    customers: 38,
    avgOrderValue: 62
  };

  const pendingOrders = [
    {
      id: 'O789',
      customer: 'Mohammed K.',
      items: ['Chicken Shawarma', 'Hummus'],
      total: 85,
      time: '10 min ago'
    },
    // Add more orders...
  ];

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Restaurant Status */}
          <Box
            p={6}
            bg={isDark ? 'gray.800' : 'white'}
            rounded="xl"
            shadow="lg"
          >
            <HStack justify="space-between">
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color="gray.500">Restaurant Status</Text>
                <Text fontSize="lg" fontWeight="bold">
                  {isOpen ? 'Open for Orders' : 'Closed'}
                </Text>
              </VStack>
              <Switch
                size="lg"
                isChecked={isOpen}
                onChange={(e) => setIsOpen(e.target.checked)}
                colorScheme="green"
              />
            </HStack>
          </Box>

          {/* Today's Stats */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <Stat
              p={6}
              bg={isDark ? 'gray.800' : 'white'}
              rounded="xl"
              shadow="lg"
            >
              <StatLabel>Orders</StatLabel>
              <StatNumber>{todayStats.orders}</StatNumber>
              <StatHelpText>Total orders today</StatHelpText>
            </Stat>

            <Stat
              p={6}
              bg={isDark ? 'gray.800' : 'white'}
              rounded="xl"
              shadow="lg"
            >
              <StatLabel>Revenue</StatLabel>
              <StatNumber>{todayStats.revenue} LYD</StatNumber>
              <StatHelpText>Today's earnings</StatHelpText>
            </Stat>

            <Stat
              p={6}
              bg={isDark ? 'gray.800' : 'white'}
              rounded="xl"
              shadow="lg"
            >
              <StatLabel>New Customers</StatLabel>
              <StatNumber>{todayStats.customers}</StatNumber>
              <StatHelpText>First-time orders</StatHelpText>
            </Stat>

            <Stat
              p={6}
              bg={isDark ? 'gray.800' : 'white'}
              rounded="xl"
              shadow="lg"
            >
              <StatLabel>Avg. Order Value</StatLabel>
              <StatNumber>{todayStats.avgOrderValue} LYD</StatNumber>
              <StatHelpText>Per order today</StatHelpText>
            </Stat>
          </SimpleGrid>

          {/* Quick Actions */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Button
              size="lg"
              height="100px"
              leftIcon={<ClipboardList />}
              onClick={() => router.push('/eats/restaurant/orders')}
              colorScheme="blue"
            >
              Manage Orders
            </Button>
            <Button
              size="lg"
              height="100px"
              leftIcon={<ShoppingBag />}
              onClick={() => router.push('/eats/restaurant/menu')}
              colorScheme="green"
            >
              Menu Management
            </Button>
            <Button
              size="lg"
              height="100px"
              leftIcon={<Settings />}
              onClick={() => router.push('/eats/restaurant/dashboard')}
              variant="outline"
            >
              Restaurant Settings
            </Button>
          </SimpleGrid>

          {/* Pending Orders */}
          <Box
            p={6}
            bg={isDark ? 'gray.800' : 'white'}
            rounded="xl"
            shadow="lg"
          >
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <Heading size="md">Pending Orders</Heading>
                <Button
                  variant="ghost"
                  rightIcon={<ChevronRight />}
                  onClick={() => router.push('/eats/restaurant/orders')}
                >
                  View All
                </Button>
              </HStack>

              <VStack spacing={4} align="stretch">
                {pendingOrders.map((order) => (
                  <Box
                    key={order.id}
                    p={4}
                    bg={isDark ? 'gray.700' : 'gray.50'}
                    rounded="lg"
                  >
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">Order #{order.id}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {order.items.join(', ')}
                        </Text>
                        <Badge>{order.time}</Badge>
                      </VStack>
                      <VStack align="end" spacing={1}>
                        <Text fontWeight="bold">{order.total} LYD</Text>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => router.push(`/eats/restaurant/orders?id=${order.id}`)}
                        >
                          Process Order
                        </Button>
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
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

export default RestaurantHome;