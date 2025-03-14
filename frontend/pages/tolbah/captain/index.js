// pages/bsoraa/captain/index.js
import { useState, useEffect } from 'react';
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
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  useColorMode,
} from '@chakra-ui/react';
import {
  Navigation,
  Clock,
  DollarSign,
  Star,
  ChevronRight
} from 'lucide-react';

import Layout from '@/components/Layout';

const DriverHome = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [isOnline, setIsOnline] = useState(false);

  const todayStats = {
    deliveries: 8,
    earnings: 280,
    rating: 4.8,
    onlineHours: 6.5
  };

  const activeTask = {
    id: 'T123',
    restaurant: 'Pizza Palace',
    customer: 'Ahmed M.',
    status: 'pickup',
    estimatedTime: '15 min'
  };

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Online Status */}
          <Box
            p={6}
            bg={isDark ? 'gray.800' : 'white'}
            rounded="xl"
            shadow="lg"
          >
            <HStack justify="space-between">
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color="gray.500">Driver Status</Text>
                <Text fontSize="lg" fontWeight="bold">
                  {isOnline ? 'Online' : 'Offline'}
                </Text>
              </VStack>
              <Switch
                size="lg"
                isChecked={isOnline}
                onChange={(e) => setIsOnline(e.target.checked)}
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
              <StatLabel>Deliveries</StatLabel>
              <StatNumber>{todayStats.deliveries}</StatNumber>
              <StatHelpText>Today's completed orders</StatHelpText>
            </Stat>

            <Stat
              p={6}
              bg={isDark ? 'gray.800' : 'white'}
              rounded="xl"
              shadow="lg"
            >
              <StatLabel>Earnings</StatLabel>
              <StatNumber>{todayStats.earnings} LYD</StatNumber>
              <StatHelpText>Today's earnings</StatHelpText>
            </Stat>

            <Stat
              p={6}
              bg={isDark ? 'gray.800' : 'white'}
              rounded="xl"
              shadow="lg"
            >
              <StatLabel>Rating</StatLabel>
              <StatNumber>{todayStats.rating}</StatNumber>
              <StatHelpText>Average rating</StatHelpText>
            </Stat>

            <Stat
              p={6}
              bg={isDark ? 'gray.800' : 'white'}
              rounded="xl"
              shadow="lg"
            >
              <StatLabel>Online Hours</StatLabel>
              <StatNumber>{todayStats.onlineHours}h</StatNumber>
              <StatHelpText>Time online today</StatHelpText>
            </Stat>
          </SimpleGrid>

          {/* Active Task */}
          {activeTask && (
            <Box
              p={6}
              bg={isDark ? 'gray.800' : 'white'}
              rounded="xl"
              shadow="lg"
            >
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Active Delivery</Heading>
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">{activeTask.restaurant}</Text>
                    <Text color="gray.500">Order for {activeTask.customer}</Text>
                    <Badge colorScheme="blue">{activeTask.status}</Badge>
                  </VStack>
                  <VStack align="end" spacing={1}>
                    <Text color="gray.500">Estimated Time</Text>
                    <Text fontWeight="bold">{activeTask.estimatedTime}</Text>
                    <Button
                      size="sm"
                      rightIcon={<ChevronRight />}
                      onClick={() => router.push(`/bsoraa/captain/tasks/${activeTask.id}`)}
                    >
                      View Details
                    </Button>
                  </VStack>
                </HStack>
              </VStack>
            </Box>
          )}

          {/* Quick Actions */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Button
              size="lg"
              leftIcon={<Navigation />}
              onClick={() => router.push('/bsoraa/captain/dashboard')}
            >
              Open Navigation
            </Button>
            <Button
              size="lg"
              leftIcon={<Clock />}
              variant="outline"
              onClick={() => router.push('/bsoraa/captain/dashboard')}
            >
              View Dashboard
            </Button>
          </SimpleGrid>
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

export default DriverHome;