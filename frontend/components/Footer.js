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
  BarChart2, 
  Camera,
  Menu,
  ExternalLink,
  Info,
  Shield,
  FileText,
  DollarSign,
  Globe,
  LineChart,
  ArrowUpRight,
  Wallet,
  User,
  Settings,
  HelpCircle,
  Clock,
  TrendingUp,
  Building,
  CreditCard,
  WalletIcon
} from 'lucide-react';
import { FiArrowRightCircle, FiUser, FiUsers, FiLock } from 'react-icons/fi';
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

  const [isPWA, setIsPWA] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [platform, setPlatform] = useState('main');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname.includes('crypto')) setPlatform('crypto');
      else if (hostname.includes('forex')) setPlatform('forex');
      else if (hostname.includes('cash')) setPlatform('cash');
      else if (hostname.includes('stocks')) setPlatform('stocks');
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

  // Get platform-specific color based on the current platform
  const getPlatformColor = (intensity) => {
    switch(platform) {
      case 'cash':
        return `brand.cash.${intensity}`;
      case 'crypto':
        return `brand.crypto.${intensity}`;
      case 'forex':
        return `brand.forex.${intensity}`;
      case 'stocks':
        return `brand.stocks.${intensity}`;
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
    crypto: [
      { label: 'Wallet', href: '/crypto/wallet', icon: WalletIcon },
      { label: 'Crypto Rules', href: '/crypto/rules', icon: FileText },
      { label: 'Tokens', href: '/crypto/tokens', icon: TrendingUp },
      { label: 'FAQ', href: '/crypto/faq', icon: HelpCircle },
    ],
    stocks: [
      { label: 'US Markets', href: '/stocks/us-markets', icon: Globe },
      { label: 'EU Markets', href: '/stocks/eu-markets', icon: Building },
      { label: 'Commodities', href: '/stocks/commodities', icon: TrendingUp },
      { label: 'Portfolio', href: '/stocks/portfolio', icon: BarChart2 },
    ],
    forex: [
      { label: 'Forex Pairs', href: '/forex/pairs', icon: Globe },
      { label: 'Analysis', href: '/trade/analysis', icon: LineChart },
      { label: 'Tools', href: '/trade/tools', icon: Settings },
      { label: 'Charts', href: '/trade/charts', icon: BarChart2 },
    ],
    cash: [
      { label: 'Transfer Money', href: '/cash/client/transfer', icon: FiArrowRightCircle },
      { label: 'Payment Solutions', href: '/cash/solutions', icon: CreditCard },
      { label: 'Business Tools', href: '/cash/business', icon: Building },
      { label: 'Account', href: '/cash/account', icon: User },
    ]
  };

  const getPWANavItems = (isLoggedIn) => {
    // Define navigation items specific to each platform
    const navItems = {
      crypto: [
        { label: 'Dashboard', action: 'dashboard', icon: BarChart2 },
        { label: 'Wallets', action: 'wallets', icon: WalletIcon },
        { label: 'History', action: 'history', icon: Clock },
        { label: 'Account', action: 'account', icon: User },
      ],
      stocks: [
        { label: 'Portfolio', action: 'portfolio', icon: BarChart2 },
        { label: 'Markets', action: 'markets', icon: Globe },
        { label: 'Trade', action: 'stock-trade', icon: ArrowUpRight },
        { label: 'Account', action: 'account', icon: User },
      ],
      forex: [
        { label: 'Trading', action: 'trading', icon: LineChart },
        { label: 'Markets', action: 'markets', icon: Globe },
        { label: 'Analysis', action: 'analysis', icon: BarChart2 },
        { label: 'Account', action: 'account', icon: User },
      ],
      cash: [
        { label: 'Transfer', action: 'transfer', icon: FiArrowRightCircle },
        { label: 'Wallet', action: 'wallet', icon: Wallet },
        { label: 'History', action: 'history', icon: Clock },
        { label: 'Account', action: 'account', icon: User },
      ]
    };

    // Define color intensity for each item
    const colorIntensities = ['500', '600', '400', '700'];
    
    // Get the base items for the current platform
    let items = navItems[platform] || [];
    
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
      crypto: {
        dashboard: '/crypto/dashboard',
        challenges: '/crypto/challenges',
        history: '/crypto/history',
        account: '/crypto/account',
      },
      stocks: {
        portfolio: '/stocks/portfolio',
        markets: '/stocks/markets',
        trade: '/stocks/trade',
        account: '/stocks/account',
      },
      forex: {
        trading: '/forex/platform',
        markets: '/forex/markets',
        analysis: '/forex/analysis',
        account: '/forex/account',
      },
      cash: {
        transfer: 'cash/client/transfer',
        wallet: '/cash/wallet',
        history: '/cash/transactions',
        account: '/cash/client/dashboard',
      }
    };

    // Handle common actions
    if (action === 'logout') {
      handleLogout();
      return;
    }

    // Navigate to platform-specific paths
    const path = platformPaths[platform]?.[action];
    if (path) {
      router.push(path);
    } else {
      // Fallback for actions that need special handling
      switch (action) {
        case 'scan':
          setScanning(true);
          scannerDisclosure.onOpen();
          break;
      }
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
      case 'crypto':
        path = `/crypto/challenge/${trackingNumber}`;
        break;
      case 'stocks':
        path = `/stocks/order/${trackingNumber}`;
        break;
      case 'forex':
        path = `/forex/transaction/${trackingNumber}`;
        break;
      case 'cash':
        path = `/cash/transaction/${trackingNumber}`;
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
      case 'crypto':
        return 'Track Challenge';
      case 'stocks':
        return 'Track Investment Order';
      case 'forex':
        return 'Track Withdrawals and Deposits';
      case 'cash':
        return 'Track Payment';
      default:
        return 'Tracking';
    }
  };

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
                _hover={{ textDecoration: 'none', color: getPlatformColor('500') }}
              >
                Powered by BitDash™
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
                  _hover={{ textDecoration: 'none', color: getPlatformColor('500') }}
                >
                  Powered by BitDash™
              </Link>    
             <IconButton
              icon={<FaWhatsapp />}
              variant={`${platform}-outline`}
              color={`brand.${platform}.400`}
              onClick={() => {window.open("https://api.whatsapp.com/send?phone=00447538636207", "_blank");}}
            >
            </IconButton>
            <IconButton
              icon={<FaTelegram />}
              variant={`${platform}-outline`}
              onClick={() => window.open("https://t.me/BitDashSupport", "_blank")}
              color={`brand.${platform}.400`}
            >
            </IconButton>          
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

      {/* Menu Drawer */}
      <Drawer
        placement="bottom"
        onClose={menuDisclosure.onClose}
        isOpen={menuDisclosure.isOpen}
      >
        <DrawerOverlay />
        <DrawerContent borderTopRadius="20px">
          <DrawerHeader borderBottomWidth="1px">
            {platform === 'crypt' ? 'Crypto Menu' : 
             platform === 'stocks' ? 'Stocks Menu' : 
             platform === 'forex' ? 'Forex Menu' :
             platform === 'cash' ? 'Cash Menu' :
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
                  <ExternalLink size={16} style={{ marginLeft: 'auto' }} />
                </HStack>
              ))}
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
                {platform === 'crypto' ? 'Challenge ID' : 
                 platform === 'stocks' ? 'Order ID' : 
                 platform === 'forex' ? 'Transaction ID' :
                 platform === 'cash' ? 'Payment ID' :
                 'Tracking Number'}
              </FormLabel>
              <Input
                value={trackingNumber}
                onChange={(e) => {
                  setTrackingNumber(e.target.value);
                  setError('');
                }}
                placeholder={
                  platform === 'crypto' ? 'Enter Wallet ID' : 
                  platform === 'stocks' ? 'Enter order ID' : 
                  platform === 'forex' ? 'Enter transaction ID' :
                  platform === 'cash' ? 'Enter payment ID' :
                  'Enter tracking number'
                }
              />
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
            <Button
              mt={4}
              colorScheme={platform === 'cash' ? 'brand.cash.400' : platform}
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
            />
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Footer;