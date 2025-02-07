import React from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Image,
  useColorMode,
  Container,
  Icon,
  SimpleGrid,
  Card,
  CardBody
} from '@chakra-ui/react';
import { Search, ShoppingBag, Clock, BellRing, Package, BarChart2, Car, Tool, DollarSign } from 'lucide-react';

// Menu PWA Landing
const MenuPWALanding = () => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const features = [
    { icon: Search, title: 'Browse Menus', description: 'Explore local restaurants' },
    { icon: ShoppingBag, title: 'Easy Ordering', description: 'Order with just a few taps' },
    { icon: Clock, title: 'Real-time Tracking', description: 'Track your order status' },
    { icon: BellRing, title: 'Notifications', description: 'Get updates on your order' }
  ];

  return (
    <Box 
      minH="100vh" 
      pt={20}
    >
      <Container maxW="container.lg">
        <VStack spacing={8} align="center" pb={20}>
          <Image
            src="/menu-logo.png"
            alt="BitMenu"
            w="150px"
            h="150px"
            objectFit="contain"
          />
          <Heading size="2xl" color="green.500">BitMenu</Heading>
          <Text fontSize="xl" textAlign="center" color={isDark ? 'gray.400' : 'gray.600'}>
            Your digital menu and ordering solution
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full" pt={8}>
            {features.map((feature, index) => (
              <Card key={index}>
                <CardBody>
                  <VStack align="center" spacing={4}>
                    <Icon as={feature.icon} boxSize={8} color="green.500" />
                    <Heading size="md">{feature.title}</Heading>
                    <Text textAlign="center">{feature.description}</Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

// Auto PWA Landing
const AutoPWALanding = () => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const features = [
    { icon: Car, title: 'Vehicle Listings', description: 'Browse available vehicles' },
    { icon: Tool, title: 'Service Tracking', description: 'Monitor maintenance status' },
    { icon: Package, title: 'Parts Inventory', description: 'Check parts availability' },
    { icon: DollarSign, title: 'Price Quotes', description: 'Get instant price quotes' }
  ];

  return (
    <Box 
      minH="100vh" 
      pt={20}
    >
      <Container maxW="container.lg">
        <VStack spacing={8} align="center" pb={20}>
          <Image
            src="/auto-logo.png"
            alt="BitAuto"
            w="150px"
            h="150px"
            objectFit="contain"
          />
          <Heading size="2xl" color="blue.500">BitAuto</Heading>
          <Text fontSize="xl" textAlign="center" color={isDark ? 'gray.400' : 'gray.600'}>
            Complete automotive management solution
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full" pt={8}>
            {features.map((feature, index) => (
              <Card key={index}>
                <CardBody>
                  <VStack align="center" spacing={4}>
                    <Icon as={feature.icon} boxSize={8} color="blue.500" />
                    <Heading size="md">{feature.title}</Heading>
                    <Text textAlign="center">{feature.description}</Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

// Stock PWA Landing
const StockPWALanding = () => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const features = [
    { icon: BarChart2, title: 'Market Analysis', description: 'Real-time market data' },
    { icon: Package, title: 'Inventory Management', description: 'Track stock levels' },
    { icon: DollarSign, title: 'Financial Reports', description: 'Generate detailed reports' },
    { icon: BellRing, title: 'Alert System', description: 'Get stock notifications' }
  ];

  return (
    <Box 
      minH="100vh" 
      pt={20}
    >
      <Container maxW="container.lg">
        <VStack spacing={8} align="center" pb={20}>
          <Image
            src="/stock-logo.png"
            alt="BitStock"
            w="150px"
            h="150px"
            objectFit="contain"
          />
          <Heading size="2xl" color="orange.500">BitStock</Heading>
          <Text fontSize="xl" textAlign="center" color={isDark ? 'gray.400' : 'gray.600'}>
            Intelligent stock and inventory control
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full" pt={8}>
            {features.map((feature, index) => (
              <Card key={index}>
                <CardBody>
                  <VStack align="center" spacing={4}>
                    <Icon as={feature.icon} boxSize={8} color="orange.500" />
                    <Heading size="md">{feature.title}</Heading>
                    <Text textAlign="center">{feature.description}</Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

// PWA Layout Component
const PWALayout = ({ children }) => {
  const router = useRouter();
  const { isPWA } = usePWA();
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

  useEffect(() => {
    if (isPWA && router.pathname === '/') {
      switch(hostname) {
        case 'menu.bitdash.app':
          router.replace('/menu');
          break;
        case 'auto.bitdash.app':
          router.replace('/auto');
          break;
        case 'stock.bitdash.app':
          router.replace('/stock');
          break;
        default:
          router.replace('/');
      }
    }
  }, [isPWA, router, hostname]);

  return children;
};

export { MenuPWALanding, AutoPWALanding, StockPWALanding, PWALayout };