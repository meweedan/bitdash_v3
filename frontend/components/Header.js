import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Text,
  Button,
  IconButton,
  useColorMode,
  Collapse,
  VStack,
  SimpleGrid,
  useDisclosure,
  useColorModeValue,
  HStack,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Container,
  Divider
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChatIcon, PhoneIcon, ChevronDownIcon } from '@chakra-ui/icons';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Logo from '@/components/Logo';
import { FaSignInAlt, FaUserPlus, FaUser, FaSignOutAlt, FaWhatsapp, FaTelegram, FaChevronDown } from 'react-icons/fa';
import AnnouncementBanner from './AnnouncementBanner';

export default function Header() {
  const { t, i18n } = useTranslation('common');
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const { isOpen, onToggle, onClose } = useDisclosure();
  const router = useRouter();
  const isRTL = i18n.language === 'ar' || i18n.language === 'he';
  const [showPlatforms, setShowPlatforms] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [platform, setPlatform] = useState('bitdash');
  const accentColor = `brand.${platform}.400`;
  
  // Always show announcements for these platforms
  const showAnnouncements = platform === 'forex' || platform === 'stock' || platform === 'crypto' || platform === 'cash';

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    router.push('/login');
  };

  // Main BitDash domain custom header
  const isMainDomain = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      // Check if it's the main domain without subdomains
      return hostname === 'bitdash.app' || hostname === 'www.bitdash.app' || hostname === 'localhost';
    }
    return false;
  };

  const platforms = [
     {
      name: 'Cash by BitDash',
      image: '/cash.png',
      mobileImage: '/cash.png',
      href: 'https://cash.bitdash.app/',
    },
    {
      name: 'Forex by BitDash',
      image: '/forex.png',
      mobileImage: '/forex.png',
      href: 'https://forex.bitdash.app/',
    }, 
    {
      name: 'Stock by BitDash',
      image: '/stock.png',
      mobileImage: '/stock.png',
      href: 'https://stock.bitdash.app/',
    },
     {
      name: 'Crypto by BitDash',
      image: '/crypto.png',
      mobileImage: '/crypto.png',
      href: 'https://crypto.bitdash.app/',
    }
  ];

  const bgColor = useColorModeValue(
    platform === 'bitcash' ? 'brand.bitcash.500' : 
    platform === 'bitstock' ? 'brand.bitstock.500' :
    platform === 'bittrade' ? 'brand.bittrade.500' :
    platform === 'bitfund' ? 'brand.bitfund.500' :
    'gray.50',
    'gray.900'
  );

  const getPlatformFromURL = () => {
    // Check for localhost development
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      
      // More specific checks to avoid partial matches
      if (hostname.includes('cash.bitdash') || hostname === 'cash.localhost') return 'bitcash';
      if (hostname.includes('crypto.bitdash') || hostname === 'crypto.localhost') return 'bitfund';
      if (hostname.includes('forex.bitdash') || hostname === 'forex.localhost') return 'bittrade';
      if (hostname.includes('stock.bitdash') || hostname === 'stock.localhost') return 'bitstock';
      
      // Also check URL path for local development
      const pathname = window.location.pathname;
      if (pathname.startsWith('/cash')) return 'bitcash';
      if (pathname.startsWith('/crypto')) return 'bitfund';
      if (pathname.startsWith('/forex')) return 'bittrade';
      if (pathname.startsWith('/stock')) return 'bitstock';
    }
    return 'bitdash'; // Default platform
  };

  useEffect(() => {
    const detected = getPlatformFromURL();
    console.log('Detected platform:', detected);
    setPlatform(detected);
  }, []);

  const MenuItems = ({ href, children, onClick }) => (
    <Link href={href} passHref>
      <Text
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontWeight="bold"
        px={4}
        py={2}
        _hover={{bg : isDark ? `brand.${platform}.700` : `brand.${platform}.700`}}
        textAlign="center"
        onClick={onClick}
        w="full"
      >
        {children}
      </Text>
    </Link>
  );
  
  // Main menu items (LDN style)
  const mainMenuItems = [
    { 
      name: 'Platforms', 
      path: '/platforms',
      submenu: [
        { name: 'MT5 Platform', path: '/platforms/mt5' },
        { name: 'Web Trader', path: '/platforms/web-trader' },
        { name: 'Mobile Apps', path: '/platforms/mobile' },
      ]
    },
    { 
      name: 'Funding', 
      path: '/funding',
      submenu: [
        { name: 'Deposit Methods', path: '/funding/deposit' },
        { name: 'Withdrawals', path: '/funding/withdrawal' },
        { name: 'Payment FAQ', path: '/funding/faq' },
      ]
    },
    { 
      name: 'About', 
      path: '/about',
      submenu: [
        { name: 'Company Profile', path: '/about/profile' },
        { name: 'Regulation', path: '/about/regulation' },
        { name: 'Contact Us', path: '/about/contact' },
      ]
    },
  ];

  // Platform-specific menu items for mobile
  const getPlatformMenuItems = () => {
    if (platform === 'bitfund') { // Crypto
      return [
        { 
          name: 'Exchange', 
          path: '/crypto/exchange',
          submenu: [
            { name: 'Spot Trading', path: '/crypto/exchange/spot' },
            { name: 'Futures', path: '/crypto/exchange/futures' },
            { name: 'Options', path: '/crypto/exchange/options' },
          ]
        },
        { 
          name: 'Markets', 
          path: '/crypto/markets',
          submenu: [
            { name: 'Top Coins', path: '/crypto/markets/top-coins' },
            { name: 'Market Cap', path: '/crypto/markets/market-cap' },
            { name: 'New Listings', path: '/crypto/markets/new-listings' },
          ]
        },
        { 
          name: 'Earn', 
          path: '/crypto/earn',
          submenu: [
            { name: 'Staking', path: '/crypto/earn/staking' },
            { name: 'Yield Farming', path: '/crypto/earn/yield' },
            { name: 'Savings', path: '/crypto/earn/savings' },
          ]
        },
      ];
    } else if (platform === 'bitstock') { // Stock
      return [
        { 
          name: 'Invest', 
          path: '/stock/invest',
          submenu: [
            { name: 'Stocks', path: '/stock/invest/stocks' },
            { name: 'ETFs', path: '/stock/invest/etfs' },
            { name: 'IPOs', path: '/stock/invest/ipos' },
          ]
        },
        { 
          name: 'Research', 
          path: '/stock/research',
          submenu: [
            { name: 'Market News', path: '/stock/research/news' },
            { name: 'Analyst Ratings', path: '/stock/research/ratings' },
            { name: 'Screener', path: '/stock/research/screener' },
          ]
        },
        { 
          name: 'Portfolio', 
          path: '/stock/portfolio',
          submenu: [
            { name: 'My Holdings', path: '/stock/portfolio/holdings' },
            { name: 'Performance', path: '/stock/portfolio/performance' },
            { name: 'Dividends', path: '/stock/portfolio/dividends' },
          ]
        },
      ];
    } else if (platform === 'bittrade') { // Forex
      return [
        { 
          name: 'Trading', 
          path: '/forex/trading',
          submenu: [
            { name: 'Currency Pairs', path: '/forex/trading/currency-pairs' },
            { name: 'Commodities', path: '/forex/trading/commodities' },
            { name: 'Indices', path: '/forex/trading/indices' },
          ]
        },
        { 
          name: 'Analysis', 
          path: '/forex/analysis',
          submenu: [
            { name: 'Economic Calendar', path: '/forex/analysis/economic-calendar' },
            { name: 'Market Sentiment', path: '/forex/analysis/sentiment' },
            { name: 'Technical Tools', path: '/forex/analysis/technical' },
          ]
        },
        { 
          name: 'Education', 
          path: '/forex/education',
          submenu: [
            { name: 'Trading Guides', path: '/forex/education/guides' },
            { name: 'Webinars', path: '/forex/education/webinars' },
            { name: 'Strategy Resources', path: '/forex/education/strategies' },
          ]
        },
      ];
    } else if (platform === 'bitcash') { // Cash
      return [
        { 
          name: 'Payments', 
          path: '/cash/payments',
          submenu: [
            { name: 'Send Money', path: '/cash/payments/send' },
            { name: 'Request Money', path: '/cash/payments/request' },
            { name: 'Pay Bills', path: '/cash/payments/bills' },
          ]
        },
        { 
          name: 'Cards', 
          path: '/cash/cards',
          submenu: [
            { name: 'Virtual Cards', path: '/cash/cards/virtual' },
            { name: 'Physical Cards', path: '/cash/cards/physical' },
            { name: 'Card Settings', path: '/cash/cards/settings' },
          ]
        },
        { 
          name: 'Banking', 
          path: '/cash/banking',
          submenu: [
            { name: 'Accounts', path: '/cash/banking/accounts' },
            { name: 'Statements', path: '/cash/banking/statements' },
            { name: 'Savings', path: '/cash/banking/savings' },
          ]
        },
      ];
    } else {
      return mainMenuItems; // Default menu items
    }
  };
  
  return (
    <Flex
      as="nav"
      direction="column"
      position="sticky"
      top="0"
      backdropFilter="blur(90px)"
      width="100%"
      zIndex={999}
    >

      {/* Solutions Menu - Desktop */}
      <Box 
        display={{ base: 'none', lg: 'block' }}
        w="full"
        transition="all 0.3s ease"
        h={showPlatforms ? 'auto' : '0'}
        overflow="hidden"
        bg={isDark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.8)"}
        backdropFilter="blur(10px)"
      >
        <HStack 
          spacing={10} 
          py={6} 
          px={8}
          justify="center"
          align="center"
        >
          {platforms.map((platform) => (
            <a 
              key={platform.href}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <VStack
                spacing={5}
                align="center"
                transition="transform 0.2s"
                _hover={{ transform: 'translateY(-5px)' }}
              >
                {/* Fixed size container with consistent dimensions */}
                <Box position="relative" width="180px" height="60px">
                  <Image 
                    src={platform.image}
                    alt={platform.name}
                    fill
                    priority={true}
                    style={{ 
                      objectFit: 'contain',
                      objectPosition: 'center'
                    }}
                  />
                </Box>
              </VStack>
            </a>
          ))}
        </HStack>
      </Box>

      {/* Main Navigation Bar */}
      <Flex
        direction="row"
        justify="space-between"
        align="center"
        p={4}
        w="full"
        dir={isRTL ? 'rtl' : 'ltr'}
        bg={isDark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.8)"}
        backdropFilter="blur(10px)"
      >
        {/* Logo - Using the display from first version */}
        <Box width={{ base: '110px', md: '150px' }}>
          <Link href="/" passHref>
            <Box display="block">
              <Logo />
            </Box>
          </Link>
        </Box>

        {/* Desktop Main Menu - LDN Style */}
        <HStack 
          spacing={6}
          display={{ base: 'none', lg: 'flex' }}
          position="relative"
        >
          {getPlatformMenuItems().map ((item) => (
            <Popover key={item.name} trigger="hover" placement="bottom-start">
              <PopoverTrigger>
                <Box>
                  <HStack 
                    spacing={1} 
                    cursor="pointer" 
                    _hover={{ color: `brand.${platform}.500` }}
                  >
                    <Link href={item.path} passHref>
                      <Text 
                        fontWeight="bold" 
                        fontSize="xl"
                        color={isDark ? `brand.${platform}.400` : `brand.${platform}.700`}
                      >
                        {item.name}
                      </Text>
                    </Link>
                    <Icon as={FaChevronDown} boxSize={3} color={isDark ? `brand.${platform}.400` : `brand.${platform}.700`} />
                  </HStack>
                </Box>
              </PopoverTrigger>
              <PopoverContent 
                bg={isDark ? "gray.800" : "white"}
                borderColor={isDark ? "gray.700" : "gray.200"}
                boxShadow="xl"
                p={2}
                minW="200px"
                _focus={{ boxShadow: "xl" }}
              >
                <PopoverArrow bg={isDark ? "gray.800" : "white"} />
                <PopoverBody p={0}>
                  <VStack align="stretch" spacing={0}>
                    {item.submenu && item.submenu.map((subItem) => (
                      <Link key={subItem.name} href={subItem.path} passHref>
                        <Text
                          p={3}
                          fontWeight="bold" 
                          fontSize="xl"
                          _hover={{ 
                            bg: isDark ? "gray.700" : "gray.50",
                            color: `brand.${platform}.500`
                          }}
                        >
                          {subItem.name}
                        </Text>
                      </Link>
                    ))}
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          ))}
          
          {/* Our Solutions Button */}
          <Box position="relative">
            <HStack 
              spacing={1} 
              cursor="pointer" 
              _hover={{ color: `brand.${platform}.500` }}
              onClick={() => setShowPlatforms(!showPlatforms)}
            >
              <Text 
                fontWeight="bold" 
                fontSize="xl"
                color={isDark ? `brand.${platform}.400` : `brand.${platform}.700`}
              >
                {t('ourSolutions')}
              </Text>
              <Icon as={FaChevronDown} boxSize={3} color={isDark ? `brand.${platform}.400` : `brand.${platform}.700`} />
            </HStack>
          </Box>
        </HStack>

        {/* Desktop Controls */}
        <HStack spacing={3} display={{ base: 'none', lg: 'flex' }}>
          <LanguageSwitcher 
            color={isDark ? `brand.${platform}.400` : `brand.${platform}.400`}
            sx={{
              '.chakra-select__wrapper::after': { display: 'none' },
              select: {
                width: '80px',
                fontSize: '16px',
                height: '40px',
                border: '1px solid',
                borderColor: isDark ? 'gray.700' : 'gray.200',
                borderRadius: 'md',
              }
            }}
          />

          <IconButton
            onClick={toggleColorMode}
            variant={`${platform}-outline`}
            aria-label="Toggle Theme"
            icon={isDark ? 
              <svg viewBox="0 0 24 24" width="24px" height="24px"><path fill="currentColor" d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/></svg>
              : <svg viewBox="0 0 24 24" width="24px" height="24px"><path fill="currentColor" d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/></svg>
            }
            _hover={{bg : isDark ? `brand.${platform}.700` : `brand.${platform}.700`}}
          />

          <IconButton
            icon={<FaWhatsapp size={20} />}
            variant={`${platform}-outline`}
            onClick={() => window.open("https://api.whatsapp.com/send?phone=00447538636207", "_blank")}
            aria-label="WhatsApp"
            _hover={{bg : isDark ? `brand.${platform}.700` : `brand.${platform}.700`}}
          />

          <IconButton
            icon={<FaTelegram size={20} />}
            variant={`${platform}-outline`}
            onClick={() => window.open("https://t.me/BitDashSupport", "_blank")}
            aria-label="Telegram"
            _hover={{bg : isDark ? `brand.${platform}.700` : `brand.${platform}.700`}}
          />

          {/* Only show auth buttons if not on main domain */}
          {!isMainDomain() && (
            <>
              {isLoggedIn ? (
                <>
                  <Button 
                    leftIcon={<FaUser size={16} />} 
                    size="md"
                    variant={`${platform}-outline`}
                    onClick={() => router.push('/dashboard')}
                    _hover={{bg : isDark ? `brand.${platform}.700` : `brand.${platform}.700`}}
                  >
                    {t('myAccount')}
                  </Button>
                  <Button
                    leftIcon={<FaSignOutAlt size={16} />}
                    onClick={handleLogout}
                    size="md"
                    variant={`${platform}-outline`}
                    colorScheme="red"
                  >
                    {t('logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    leftIcon={<FaSignInAlt size={16} />}
                    size="md"
                    variant={`${platform}-outline`}
                    color={isDark ? `brand.${platform}.400` : `brand.${platform}.400`}
                    onClick={() => router.push('/login')}
                    _hover={{bg : isDark ? `brand.${platform}.700` : `brand.${platform}.700`}}
                  >
                    {t('login')}
                  </Button>
                  <Button 
                    leftIcon={<FaUserPlus size={16} />}
                    size="md"
                    variant={`${platform}-solid`}
                    color={isDark ? 'white' : 'white'}
                    bg={`brand.${platform}.600`}
                    onClick={() => router.push('/signup')}
                    _hover={{bg : `brand.${platform}.700`}}
                  >
                    {t('signup')}
                  </Button>
                </>
              )}
            </>
          )}
        </HStack>

        {/* Mobile Controls - From pasted item 2 */}
        <HStack display={{ base: 'flex', lg: 'none'}} spacing={2}>
          <Box>
            <LanguageSwitcher 
              sx={{
                '.chakra-select__wrapper::after': {
                  display: 'none'
                },
                select: {
                  width: '70px',
                  fontSize: '14px',
                  height: '32px',
                  bg: isDark ? 'whiteAlpha.100' : 'blackAlpha.50',
                  border: 'none',
                  paddingInlineEnd: '4px',
                  paddingInlineStart: '4px',
                }
              }}
            />
          </Box>

          <IconButton
            onClick={toggleColorMode}
            variant={`${platform}-outline`}
            color={isDark ? `brand.${platform}.400` : `brand.${platform}.700`}
            aria-label="Toggle Theme"
            icon={isDark ? <svg viewBox="0 0 24 24" width="20px" height="20px"><path fill="currentColor" d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/></svg>
                : <svg viewBox="0 0 24 24" width="20px" height="20px"><path fill="currentColor" d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/></svg>}
            size="sm"
          />

          <IconButton
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            variant={`${platform}-outline`}
            aria-label="Toggle Navigation"
            onClick={onToggle}
            size="sm"
          />
        </HStack>
      </Flex>

      {/* Mobile Menu with Platform-Specific Items */}
      <Collapse in={isOpen} animateOpacity>
        <Box
          position="absolute"
          width="100%"
          bg={isDark ? "black" : "white"}
          py={4}
          px={6}
          textAlign="left"
          boxShadow="lg"
          zIndex="1000"
          borderTop="1px solid"
          borderColor={isDark ? "gray.700" : "gray.200"}
          maxH="80vh"
          overflowY="auto"
        >
          {!isMainDomain() && (
            <HStack align="stretch" spacing={3}>
              {isLoggedIn ? (
                <>
                  <Button 
                    leftIcon={<FaUser />}
                    variant={`${platform}-outline`}
                    w="full"
                    onClick={() => {
                      router.push('/dashboard');
                      onClose();
                    }}
                  >
                    {t('myAccount')}
                  </Button>
                  <Button 
                    leftIcon={<FaSignOutAlt />}
                    colorScheme="red"
                    variant="outline"
                    w="full"
                    onClick={() => {
                      handleLogout();
                      onClose();
                    }}
                  >
                    {t('logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    leftIcon={<FaSignInAlt />}
                    variant={`${platform}-outline`}
                    w="full"
                    onClick={() => {
                      router.push('/login');
                      onClose();
                    }}
                  >
                      {t('login')}
                    </Button>
                    <Button 
                      leftIcon={<FaUserPlus />}
                      bg={`brand.${platform}.600`}
                      color="white"
                      _hover={{ bg: `brand.${platform}.700` }}
                      w="full"
                      onClick={() => {
                        router.push('/signup');
                        onClose();
                      }}
                    >
                      {t('signup')}
                    </Button>
                  </>
                )}
              </HStack>
            )}
          <VStack align="stretch" spacing={4}>
            {getPlatformMenuItems().map ((item) => (
              <Box key={item.name}>
                <Link href={item.path} passHref>
                  <Text
                    fontWeight="bold"
                    py={2}
                    borderBottom="1px solid"
                    borderColor={isDark ? "gray.700" : "gray.200"}
                    color={isDark ? `brand.${platform}.400` : `brand.${platform}.700`}
                  >
                    {item.name}
                  </Text>
                </Link>
                {item.submenu && (
                  <VStack align="stretch" mt={2} pl={4} spacing={1}>
                    {item.submenu.map((subItem) => (
                      <Link key={subItem.name} href={subItem.path} passHref>
                        <Text
                          py={1}
                          fontSize="sm"
                          _hover={{
                            color: `brand.${platform}.500`
                          }}
                          onClick={onClose}
                        >
                          {subItem.name}
                        </Text>
                      </Link>
                    ))}
                  </VStack>
                )}
              </Box>
            ))}
            
            {/* Our Solutions Section */}
            <Box>
              <Text
                fontWeight="bold"
                py={2}
                borderBottom="1px solid"
                borderColor={isDark ? "gray.700" : "gray.200"}
                color={isDark ? `brand.${platform}.400` : `brand.${platform}.700`}
                onClick={() => setShowPlatforms(!showPlatforms)}
                cursor="pointer"
              >
                {t('ourSolutions')}
              </Text>
              <Flex 
                mt={4}  // Increased from 2
                justify="center"  // Changed from space-between
                align="center" 
                px={2}  // Reduced from 4
                w="full" 
                gap={4}  // Added gap between items
                overflowX="auto"
                flexWrap="wrap"  // Allow wrapping on smaller screens
                css={{
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  },
                  scrollbarWidth: 'none'
                }}
              >
                {platforms.map((platform) => (
                  <a 
                    key={platform.href}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <VStack spacing={2}>  // Added spacing
                      <Text fontSize="xl" fontWeight="bold" color={isDark ? "brand.bitdash.400" : "brand.bitdash.700"}>
                        {platform.name.split(' ')[0]}
                      </Text>
                    </VStack>
                  </a>
                ))}
              </Flex>
            </Box>
          </VStack>
        </Box>
      </Collapse>

      {/* Add the announcement banner with debug logging */}
      {showAnnouncements && (
        <>
          {console.log(`Rendering announcement banner for platform: ${platform}`)}
          <AnnouncementBanner platform={platform} />
        </>
      )}
    </Flex>
  );
}