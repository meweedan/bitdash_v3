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
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { 
  Search, 
  LogOut, 
  BarChart2, 
  Camera,
  Menu,
  ExternalLink,
  Info,
  Shield,
  FileText,
  DollarSign,
  Globe,
  ArrowUpRight,
  Wallet,
  User,
  Settings,
  HelpCircle,
  Clock,
  TrendingUp,
  Building,
  CreditCard,
  ShoppingBag,
  MapPin,
  QrCode,
  Send,
  History,
  MoreHorizontal
} from 'lucide-react';
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';

const Footer = () => {
  const router = useRouter();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const isDark = colorMode === 'dark';
  
  const menuDisclosure = useDisclosure();
  const searchDisclosure = useDisclosure();
  const trackingDisclosure = useDisclosure();
  const scannerDisclosure = useDisclosure();
  const contactDisclosure = useDisclosure();

  const [isPWA, setIsPWA] = useState(false);
  const [shouldShowPWAUI, setShouldShowPWAUI] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [platform, setPlatform] = useState('main');
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname.includes('utlubha')) setPlatform('utlubha');
      else if (hostname.includes('tazdani')) setPlatform('tazdani');
      else setPlatform('main');

      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInPWA = window.navigator.standalone || isStandalone;
      setIsPWA(isInPWA);
      
      // Check if device is iOS
      const isIOSDevice = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsIOS(isIOSDevice);
      
      // Show PWA UI on all devices, not just on mobile
      setShouldShowPWAUI(true);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Get platform-specific color based on the current platform
  const getPlatformColor = (intensity) => {
    switch(platform) {
      case 'tazdani':
        return `brand.tazdani.${intensity}`;
      case 'utlubha':
        return `brand.utlubha.${intensity}`;
      default:
        return `blue.${intensity}`;
    }
  };

  const mobileMenuItems = {
    main: [
      { label: 'About Us', href: '/about', icon: Info },
      { label: 'Privacy', href: '/policies/privacy', icon: Shield },
      { label: 'Terms', href: '/policies/terms', icon: FileText },
    ],
    utlubha: [
      { label: 'Order Food', href: '/utlubha/order', icon: ShoppingBag },
      { label: 'Track Order', href: '/utlubha/track', icon: Globe },
      { label: 'Find Restaurants', href: '/utlubha/nearby', icon: MapPin },
      { label: 'Scan QR Menu', href: '/utlubha/scanner', icon: QrCode },
    ],
    tazdani: [
      { label: 'Transfer Money', href: '/tazdani/client/transfer', icon: Send },
      { label: 'Payment Methods', href: '/tazdani/payment-methods', icon: CreditCard },
      { label: 'Find Locations', href: '/tazdani/locations', icon: MapPin },
      { label: 'Account', href: '/tazdani/account', icon: User },
    ]
  };

  const getPWANavItems = (isLoggedIn) => {
    // Define navigation items specific to each platform
    const navItems = {
      utlubha: [
        { label: 'Order', action: 'order', icon: ShoppingBag },
        { label: 'Track', action: 'track', icon: Clock },
        { label: 'Nearby', action: 'nearby', icon: MapPin },
        { label: 'Scan QR', action: 'scanner', icon: QrCode },
      ],
      tazdani: [
        { label: 'Send', action: 'transfer', icon: Send },
        { label: 'Wallet', action: 'wallet', icon: Wallet },
        { label: 'History', action: 'history', icon: History },
        { label: 'Account', action: 'account', icon: User },
      ],
      main: [
        { label: 'Home', action: 'home', icon: User },
        { label: 'Search', action: 'search', icon: Search },
        { label: 'Settings', action: 'settings', icon: Settings },
        { label: 'Help', action: 'help', icon: HelpCircle },
      ]
    };

    // Define color intensity for each item
    const colorIntensities = ['500', '600', '400', '700'];
    
    // Get the base items for the current platform
    let items = navItems[platform] || navItems.main;
    
    // Add colors to each item
    items = items.map((item, index) => {
      return { 
        ...item, 
        color: getPlatformColor(colorIntensities[index]) 
      };
    });
    
    // Add logout button if logged in
    if (isLoggedIn) {
      items.push({ label: 'Logout', action: 'logout', icon: LogOut, color: 'red.500' });
    }
    
    return items;
  };

 const handlePWAAction = async (action) => {
    // Define platform-specific paths
    const platformPaths = {
      utlubha: {
        order: '/utlubha/order',
        track: '/utlubha/track-order',
        nearby: '/utlubha/restaurants',
        scanner: '/utlubha/scanner',
      },
      tazdani: {
        transfer: '/tazdani/client/transfer',
        wallet: '/tazdani/wallet',
        history: '/tazdani/transactions',
        account: '/tazdani/client/dashboard',
      },
      main: {
        home: '/',
        search: '/search',
        settings: '/settings',
        help: '/help',
      }
    };

    // Handle common actions
    if (action === 'logout') {
      handleLogout();
      return;
    }

    if (action === 'contact') {
      contactDisclosure.onOpen();
      return;
    }

    if (action === 'more') {
      menuDisclosure.onOpen();
      return;
    }

    if (action === 'scanner') {
      setScanning(true);
      scannerDisclosure.onOpen();
      return;
    }

    // Navigate to platform-specific paths
    const paths = platformPaths[platform] || platformPaths.main;
    const path = paths[action];
    
    if (path) {
      router.push(path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    router.push('/login');
  };

  const handleTracking = () => {
    if (!trackingNumber) {
      setError('Please enter a tracking number');
      return;
    }

    // Determine where to redirect based on platform
    let path = '';
    switch(platform) {
      case 'utlubha':
        path = `/utlubha/order/${trackingNumber}`;
        break;
      case 'tazdani':
        path = `/tazdani/transaction/${trackingNumber}`;
        break;
      default:
        path = `/tracking/${trackingNumber}`;
    }
    
    router.push(path);
    trackingDisclosure.onClose();
  };

  const QRScanner = dynamic(() => import('./QRScanner'), { ssr: false });

  const bgColor = isDark ? 'rgba(17, 17, 17, 0.9)' : 'rgba(255, 255, 255, 0.9)';

  // Get the drawer title based on platform
  const getDrawerTitle = () => {
    switch(platform) {
      case 'utlubha':
        return 'Track Food Order';
      case 'tazdani':
        return 'Track Payment';
      default:
        return 'Tracking';
    }
  };

  const getContactOptions = () => {
    return (
      <VStack spacing={3} p={2}>
        <Link 
          href="https://api.whatsapp.com/send?phone=00447538636207" 
          isExternal
          w="full"
        >
          <HStack 
            w="full" 
            bg={isDark ? 'whiteAlpha.100' : 'gray.100'} 
            p={3} 
            borderRadius="md"
            _hover={{ bg: isDark ? 'whiteAlpha.200' : 'gray.200' }}
          >
            <FaWhatsapp color="#25D366" size={20} />
            <Text>WhatsApp</Text>
          </HStack>
        </Link>
        <Link 
          href="https://t.me/BitDashSupport" 
          isExternal
          w="full"
        >
          <HStack 
            w="full" 
            bg={isDark ? 'whiteAlpha.100' : 'gray.100'} 
            p={3} 
            borderRadius="md"
            _hover={{ bg: isDark ? 'whiteAlpha.200' : 'gray.200' }}
          >
            <FaTelegram color="#0088cc" size={20} />
            <Text>Telegram</Text>
          </HStack>
        </Link>
      </VStack>
    );
  };

  const getPlatformDescription = () => {
    switch(platform) {
      case 'utlubha':
        return 'Food Delivery & QR Menu';
      case 'tazdani':
        return 'Payment Solutions';
      default:
        return 'Digital Solutions';
    }
  };

  // Calculate the safe area padding for iOS
  const getSafeAreaPadding = () => {
    return isIOS ? "env(safe-area-inset-bottom, 34px)" : "34px";
  };

  return (
    <>
      <Box height={shouldShowPWAUI ? "100px" : "80px"} />
      
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
                _hover={{ textDecoration: 'none', color: getPlatformColor('500') }}
              >
                Powered by BitDash™ — {getPlatformDescription()}
              </Link>        
            </HStack>
            <HStack spacing={4}>
              {mobileMenuItems[platform].slice(0, 3).map((item) => (
                <Link
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  _hover={{ textDecoration: 'none', color: getPlatformColor('500') }}
                  fontSize="sm"
                >
                  {item.label}
                </Link>
              ))}
              <Popover placement="top">
                <PopoverTrigger>
                  <IconButton
                    icon={<HelpCircle size={18} />}
                    variant="ghost"
                    aria-label="Support"
                  />
                </PopoverTrigger>
                <PopoverContent width="200px">
                  <PopoverArrow />
                  <PopoverBody p={0}>
                    {getContactOptions()}
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </HStack>
          </Stack>
        </Container>
      </Box>

      {/* Mobile Footer */}
      <Box
        as="footer"
        display={{ base: 'flex', md: shouldShowPWAUI ? 'flex' : 'none' }}
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        height={shouldShowPWAUI ? "105px" : "60px"}
        paddingBottom={getSafeAreaPadding()}
        marginBottom={isIOS ? "0px" : "10px"}
        borderTopWidth="1px"
        borderColor={isDark ? 'whiteAlpha.200' : 'gray.200'}
        bg={bgColor}
        backdropFilter="blur(10px)"
        zIndex={100}
      >
        <VStack w="100%" spacing={0}>
          {shouldShowPWAUI ? (
            <HStack 
              justify="space-between" 
              w="100%" 
              h="100%" 
              px={2}
              pb={1}
              pt={1}
            >
              {getPWANavItems(isLoggedIn).map((item) => (
                <VStack
                  key={item.action}
                  spacing={1}
                  flex={1}
                  onClick={() => handlePWAAction(item.action)}
                  cursor="pointer"
                >
                  <IconButton
                    icon={<item.icon size={22} />}
                    variant="ghost"
                    aria-label={item.label}
                    color={item.color}
                    size="sm"
                  />
                  <Text 
                    fontSize="xs"
                    color={item.color}
                    fontWeight="medium"
                  >
                    {item.label}
                  </Text>
                </VStack>
              ))}
              
              <VStack
                spacing={1}
                flex={1}
                onClick={() => contactDisclosure.onOpen()}
                cursor="pointer"
              >
                <IconButton
                  icon={<HelpCircle size={22} />}
                  variant="ghost"
                  aria-label="Contact"
                  color={getPlatformColor('300')}
                  size="sm"
                />
                <Text 
                  fontSize="xs"
                  color={getPlatformColor('300')}
                  fontWeight="medium"
                >
                  Support
                </Text>
              </VStack>
            </HStack>
          ) : (
            <HStack justify="space-between" w="100%" px={4} h="60px">
               <Link 
                  href="https://bitdash.app" 
                  isExternal
                  _hover={{ textDecoration: 'none', color: getPlatformColor('500') }}
                >
                  BitDash™ {getPlatformDescription()}
              </Link>    
             
              <HStack>
                <Popover placement="top">
                  <PopoverTrigger>
                    <IconButton
                      icon={<HelpCircle size={20} />}
                      variant="ghost"
                      aria-label="Contact"
                    />
                  </PopoverTrigger>
                  <PopoverContent width="200px">
                    <PopoverArrow />
                    <PopoverBody p={0}>
                      {getContactOptions()}
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
                <IconButton
                  icon={<Menu size={24} />}
                  variant="ghost"
                  onClick={menuDisclosure.onOpen}
                  aria-label="Menu"
                />
              </HStack>
            </HStack>
          )}
        </VStack>
      </Box>

      {/* Contact Drawer */}
      <Drawer
        placement="bottom"
        onClose={contactDisclosure.onClose}
        isOpen={contactDisclosure.isOpen}
      >
        <DrawerOverlay />
        <DrawerContent borderTopRadius="20px">
          <DrawerHeader borderBottomWidth="1px">
            Contact Support
          </DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody py={4}>
            {getContactOptions()}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Menu Drawer */}
      <Drawer
        placement="bottom"
        onClose={menuDisclosure.onClose}
        isOpen={menuDisclosure.isOpen}
      >
        <DrawerOverlay />
        <DrawerContent borderTopRadius="20px">
          <DrawerHeader borderBottomWidth="1px">
            {platform === 'utlubha' ? 'Food Delivery Menu' :
             platform === 'tazdani' ? 'Payment Menu' :
             'Menu'}
          </DrawerHeader>
          <DrawerCloseButton />
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
                  _hover={{ bg: isDark ? 'whiteAlpha.100' : 'gray.100' }}
                  borderRadius="md"
                >
                  <item.icon size={20} />
                  <Text>{item.label}</Text>
                  <Box ml="auto">
                    <ArrowUpRight size={16} />
                  </Box>
                </HStack>
              ))}
              
              <HStack
                w="100%"
                px={4}
                py={2}
                onClick={() => {
                  contactDisclosure.onOpen();
                  menuDisclosure.onClose();
                }}
                cursor="pointer"
                _hover={{ bg: isDark ? 'whiteAlpha.100' : 'gray.100' }}
                borderRadius="md"
              >
                <HelpCircle size={20} />
                <Text>Contact Support</Text>
              </HStack>
              
              {isLoggedIn && (
                <HStack
                  w="100%"
                  px={4}
                  py={2}
                  onClick={() => {
                    handleLogout();
                    menuDisclosure.onClose();
                  }}
                  cursor="pointer"
                  _hover={{ bg: isDark ? 'whiteAlpha.100' : 'gray.100' }}
                  borderRadius="md"
                >
                  <LogOut size={20} color="red" />
                  <Text color="red.500">Logout</Text>
                </HStack>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Tracking Drawer */}
      <Drawer
        placement="bottom"
        onClose={trackingDisclosure.onClose}
        isOpen={trackingDisclosure.isOpen}
      >
        <DrawerOverlay />
        <DrawerContent borderTopRadius="20px">
          <DrawerHeader borderBottomWidth="1px">
            {getDrawerTitle()}
          </DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody py={4}>
            <FormControl isRequired isInvalid={!!error}>
              <FormLabel>
                {platform === 'utlubha' ? 'Order ID' :
                 platform === 'tazdani' ? 'Payment ID' :
                 'Tracking Number'}
              </FormLabel>
              <Input
                value={trackingNumber}
                onChange={(e) => {
                  setTrackingNumber(e.target.value);
                  setError('');
                }}
                placeholder={
                  platform === 'utlubha' ? 'Enter order ID' :
                  platform === 'tazdani' ? 'Enter payment ID' :
                  'Enter tracking number'
                }
              />
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
            <Button
              mt={4}
              colorScheme={platform === 'tazdani' ? 'brand.tazdani' : 'brand.utlubha'}
              onClick={handleTracking}
              isFullWidth
            >
              Track
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
          <DrawerCloseButton 
            position="absolute" 
            top={4} 
            right={4} 
            zIndex={2}
            color="white"
            bg="blackAlpha.600"
          />
          {scannerDisclosure.isOpen && (
            <QRScanner
              isOpen={scannerDisclosure.isOpen}
              onClose={scannerDisclosure.onClose}
              platform={platform}
            />
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Footer;