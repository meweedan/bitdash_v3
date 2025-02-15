import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Stack, 
  Text, 
  Link,
  IconButton,
  VStack,
  HStack,
  useDisclosure,
  useColorMode,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { 
  Search, 
  LogOut, 
  PackageSearch, 
  Camera,
  Menu,
  ExternalLink,
  Info,
  Mail,
  Shield,
  FileText,
  Car,
  DollarSign,
  ShoppingBag,
  BarChart,
  Utensils,
  Warehouse,
  Store
} from 'lucide-react';
import RestaurantLookup from './RestaurantLookup';
import { FiArrowRightCircle, FiUser, FiLink, FiUsers, FiLock } from 'react-icons/fi';
import { LuScanLine } from "react-icons/lu";

const Footer = () => {
  const router = useRouter();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  const menuDisclosure = useDisclosure();
  const searchDisclosure = useDisclosure();
  const trackingDisclosure = useDisclosure();
  const scannerDisclosure = useDisclosure();

  const [isPWA, setIsPWA] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [platform, setPlatform] = useState('main');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname.includes('food')) setPlatform('food');
      else if (hostname.includes('auto')) setPlatform('auto');
      else if (hostname.includes('stock')) setPlatform('stock');
      else if (hostname.includes('eats')) setPlatform('eats');
      else if (hostname.includes('cash')) setPlatform('cash');
      else setPlatform('main');

      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInPWA = window.navigator.standalone || isStandalone;
      setIsPWA(isInPWA);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const mobileMenuItems = {
    main: [
      { label: 'About Us', href: '/about', icon: Info },
      { label: 'Privacy', href: '/privacy', icon: Shield },
      { label: 'Terms', href: '/terms', icon: FileText },
    ],
    food: [
      { label: 'Browse Menus', href: '/browse', icon: Search },
      { label: 'Track Order', href: '/order-tracking', icon: PackageSearch },
      { label: 'Privacy', href: '/privacy', icon: Shield },
    ],
    auto: [
      { label: 'Browse Cars', href: '/auto/browse', icon: Car },
      { label: 'Dealers', href: '/auto/dealers', icon: Store },
      { label: 'Privacy', href: '/privacy', icon: Shield },
    ],
    stock: [
      { label: 'Market', href: '/stock/market', icon: BarChart },
      { label: 'Inventory', href: '/stock/inventory', icon: Warehouse },
      { label: 'Privacy', href: '/privacy', icon: Shield },
    ],
    cash: [
      { label: 'Transfer Money', href: '/client/transfer', icon: FiArrowRightCircle },
      { label: 'Dashboard', href: '/client/dashboard', icon: DollarSign },
      { label: 'Profile', href: '/profile/[clientName]', icon: FiUser },
    ],
    eats: [
      { label: 'Order Food', href: '/eats/order', icon: Utensils },
      { label: 'Dashboard', href: '/eats/customer/dashboard', icon: FiUser },
      { label: 'Track', href: '/eats/order-tracking', icon: PackageSearch },
      { label: 'Pay', href: '/eats/bitcash', icon: DollarSign },
    ]
  };

  const getPWANavItems = (isLoggedIn) => {
    const navItems = {
      food: [
        { label: 'Operators', action: 'search', icon: Search, color: 'blue.500' },
        { label: 'Track Orders', action: 'tracking', icon: PackageSearch, color: 'blue.400' },
        { label: 'Scanner', action: 'scan', icon: Camera, color: 'blue.300' },
      ],
      auto: [
        { label: 'Dealers', action: 'dealers', icon: Store, color: 'blue.500' },
        { label: 'Listings', action: 'listings', icon: Car, color: 'blue.400' },
        { label: 'My Cars', action: 'mycars', icon: ShoppingBag, color: 'blue.300' },
      ],
      stock: [
        { label: 'Market', action: 'market', icon: BarChart, color: 'blue.500' },
        { label: 'Trades', action: 'trades', icon: DollarSign, color: 'blue.400' },
        { label: 'Inventory', action: 'inventory', icon: Warehouse, color: 'blue.300' },
      ],
      cash: [
        { label: 'Transfer', action: 'transfer', icon: FiArrowRightCircle, color: 'blue.500' },
        { label: 'Dashboard', href: 'dashboard', icon: DollarSign, color: 'blue.400' },
        { label: 'Profile', action: 'publicProfile', icon: FiUser, color: 'blue.200' },
      ],
      eats: [
        { label: 'Order', action: 'order', icon: Utensils, color: 'blue.400' },
        { label: 'Track', action: 'orderTracking', icon: PackageSearch, color: 'blue.300' },
        { label: 'Pay', action: 'pay', icon: DollarSign, color: 'blue.200' }, 
      ]
    };
    
    const items = navItems[platform] || [];
    if (isLoggedIn) {
      items.push({ label: 'Logout', action: 'logout', icon: LogOut, color: 'red.500' });
    }
    return items;
  };

  const handlePWAAction = async (action) => {
    switch (action) {
      case 'search':
      case 'dealers':
      case 'market':
        searchDisclosure.onOpen();
        break;
      case 'scan':
        setScanning(true);
        scannerDisclosure.onOpen();
        break;
      case 'tracking':
      case 'listings':
      case 'trades':
        trackingDisclosure.onOpen();
        break;
      case 'mycars':
      case 'inventory':
        router.push(`/${platform}/dashboard`);
        break;
      case 'logout':
        handleLogout();
        break;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    router.push('/login');
  };

  const handleTrackOrder = () => {
    if (!orderNumber) {
      setError('Please enter an order number');
      return;
    }
    router.push(`/order-tracking/${orderNumber}`);
  };

  const QRScanner = dynamic(() => import('./QRScanner'), { ssr: false });

  const bgColor = isDark ? 'rgba(17, 17, 17, 0.9)' : 'rgba(255, 255, 255, 0.9)';

  return (
    <>
      <Box height={isPWA ? "130px" : "80px"} />
      
      {/* Desktop Footer */}
      <Box
        as="footer"
        display={{ base: 'none', md: 'flex' }}
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        height="60px"
        borderTopWidth="1px"
        borderColor={isDark ? 'whiteAlpha.200' : 'gray.200'}
        bg={bgColor}
        backdropFilter="blur(10px)"
        zIndex={100}
      >
        <Container maxW="container.xl" h="100%">
          <Stack
            direction="row"
            justify="space-between"
            align="center"
            h="100%"
          >
            <HStack spacing={4}>
              <Link 
                href="https://bitdash.app" 
                isExternal
                color={isDark ? 'whiteAlpha.700' : 'gray.600'}
                fontSize="sm"
                _hover={{ textDecoration: 'none', color: 'blue.500' }}
              >
                Powered by BitDash™
              </Link>              
            </HStack>
            <HStack spacing={2}>
              {mobileMenuItems[platform].map((item) => (
                <Link
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  _hover={{ textDecoration: 'none', color: 'blue.500' }}
                >
                  {item.label}
                </Link>
              ))}
            </HStack>
          </Stack>
        </Container>
      </Box>

      {/* Mobile Footer */}
      <Box
        as="footer"
        display={{ base: 'flex', md: 'none' }}
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        height={isPWA ? "100px" : "70px"}
        borderTopWidth="1px"
        borderColor={isDark ? 'whiteAlpha.200' : 'gray.200'}
        bg={bgColor}
        backdropFilter="blur(10px)"
        zIndex={100}
      >
        <VStack w="100%" spacing={0}>
          {isPWA ? (
            <HStack 
              justify="space-around" 
              w="100%" 
              h="100%" 
              px={4}
              pb={2}
              pt={2}
            >
              {getPWANavItems(isLoggedIn).map((item) => (
                <VStack
                  key={item.action}
                  spacing={1}
                  flex={1}
                  onClick={() => handlePWAAction(item.action)}
                  cursor="pointer"
                  pt={1}
                  transform="translateY(-8px)"
                >
                  <IconButton
                    icon={<item.icon size={24} />}
                    variant="ghost"
                    aria-label={item.label}
                    color={item.color}
                  />
                  <Text 
                    fontSize="xs"
                    transform="translateY(-4px)"
                    color={item.color}
                  >
                    {item.label}
                  </Text>
                </VStack>
              ))}
            </HStack>
          ) : (
            <HStack justify="space-between" w="100%" px={4} h="60px">
               <Link 
                  href="https://bitdash.app" 
                  isExternal
                  _hover={{ textDecoration: 'none', color: 'blue.500' }}
                >
                  Powered by BitDash™
              </Link>              
              <IconButton
                icon={<Menu size={24} />}
                variant="ghost"
                onClick={menuDisclosure.onOpen}
                aria-label="Menu"
              />
            </HStack>
          )}
        </VStack>
      </Box>

      {/* Drawers */}
      <Drawer
        placement="bottom"
        onClose={searchDisclosure.onClose}
        isOpen={searchDisclosure.isOpen}
      >
        <DrawerOverlay />
        <DrawerContent maxH="100%" borderTopRadius="20px">
          <DrawerHeader borderBottomWidth="1px">
            {platform === 'food' ? 'Find Restaurants' : 
             platform === 'auto' ? 'Find Dealers' : 
             'Browse Market'}
          </DrawerHeader>
          <DrawerBody>
            <RestaurantLookup onClose={searchDisclosure.onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Drawer
        placement="bottom"
        onClose={menuDisclosure.onClose}
        isOpen={menuDisclosure.isOpen}
      >
        <DrawerOverlay />
        <DrawerContent borderTopRadius="20px">
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody py={4}>
            <VStack spacing={4}>
              {mobileMenuItems[platform].map((item) => (
                <HStack
                  key={item.href}
                  w="100%"
                  px={4}
                  py={2}
                  onClick={() => {
                    router.push(item.href);
                    menuDisclosure.onClose();
                  }}
                  cursor="pointer"
                  _hover={{ bg: 'gray.100' }}
                  borderRadius="md"
                >
                  <item.icon size={20} />
                  <Text>{item.label}</Text>
                  <ExternalLink size={16} style={{ marginLeft: 'auto' }} />
                </HStack>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Drawer
        placement="bottom"
        onClose={trackingDisclosure.onClose}
        isOpen={trackingDisclosure.isOpen}
      >
        <DrawerOverlay />
        <DrawerContent borderTopRadius="20px">
          <DrawerHeader borderBottomWidth="1px">
            {platform === 'food' ? 'Track Order' : 
             platform === 'auto' ? 'Vehicle Listings' : 
             'Trade History'}
          </DrawerHeader>
          <DrawerBody py={4}>
            <FormControl isRequired isInvalid={!!error}>
              <FormLabel>
                {platform === 'food' ? 'Order Number' : 
                 platform === 'auto' ? 'Search Listings' : 
                 'Search Trades'}
              </FormLabel>
              <Input
                value={orderNumber}
                onChange={(e) => {
                  setOrderNumber(e.target.value);
                  setError('');
                }}
                placeholder={
                  platform === 'food' ? 'Enter your order number' : 
                  platform === 'auto' ? 'Search vehicle listings' : 
                  'Search trade history'
                }
              />
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
            <Button
              mt={4}
              colorScheme="blue"
              onClick={handleTrackOrder}
              isFullWidth
            >
              {platform === 'food' ? 'Track Order' : 
               platform === 'auto' ? 'Search Listings' : 
               'Search Trades'}
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* QR Scanner Drawer */}
      <Drawer
        placement="bottom"
        onClose={() => {
          setScanning(false);
          scannerDisclosure.onClose();
        }}
        isOpen={scannerDisclosure.isOpen}
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent>
          {scannerDisclosure.isOpen && (
            <QRScanner
              isOpen={scannerDisclosure.isOpen}
              onClose={scannerDisclosure.onClose}
            />
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Footer;