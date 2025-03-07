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
  const showAnnouncements = platform === 'forex' || platform === 'stocks' || platform === 'crypto' || platform === 'cash';

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
      name: 'Stocks by BitDash',
      image: '/stocks.png',
      mobileImage: '/stocks.png',
      href: 'https://stocks.bitdash.app/',
    },
     {
      name: 'Crypto by BitDash',
      image: '/crypto.png',
      mobileImage: '/crypto.png',
      href: 'https://crypto.bitdash.app/',
    }
  ];

  const bgColor = useColorModeValue(
    platform === 'cash' ? 'brand.cash.500' : 
    platform === 'stocks' ? 'brand.stocks.500' :
    platform === 'forex' ? 'brand.forex.500' :
    platform === 'crypto' ? 'brand.crypto.500' :
    'gray.50',
    'gray.900'
  );

  const getPlatformFromURL = () => {
    // Check for localhost development
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      
      // More specific checks to avoid partial matches
      if (hostname.includes('cash.bitdash') || hostname === 'cash.localhost') return 'cash';
      if (hostname.includes('crypto.bitdash') || hostname === 'crypto.localhost') return 'crypto';
      if (hostname.includes('forex.bitdash') || hostname === 'forex.localhost') return 'forex';
      if (hostname.includes('stocks.bitdash') || hostname === 'stocks.localhost') return 'stocks';
      
      // Also check URL path for local development
      const pathname = window.location.pathname;
      if (pathname.startsWith('/cash')) return 'cash';
      if (pathname.startsWith('/crypto')) return 'crypto';
      if (pathname.startsWith('/forex')) return 'forex';
      if (pathname.startsWith('/stocks')) return 'stocks';
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
  
  // Main menu items for main domain (bitdash.app)
  const getMainDomainMenuItems = () => {
    return [
      { 
        name: t('aboutUs', 'About Us'),
        path: '/about',
        submenu: [
          { name: t('companyProfile', 'Company Profile'), path: '/about/profile' },
          { name: t('ourTeam', 'Our Team'), path: '/about/team' },
          { name: t('regulation', 'Regulation'), path: '/about/regulation' },
        ]
      },
      { 
        name: t('institutionalServices', 'Institutional Services'),
        path: '/institutional',
        submenu: [
          { name: t('tradingAPI', 'Trading API'), path: '/institutional/api' },
          { name: t('liquidityServices', 'Liquidity Services'), path: '/institutional/liquidity' },
          { name: t('wealthManagement', 'Wealth Management'), path: '/institutional/wealth' },
        ]
      },
      { 
        name: t('contactUs', 'Contact Us'), 
        path: '/contact',
        submenu: [
          { name: t('support', 'Support'), path: '/contact' },
          { name: t('careers', 'Careers'), path: '/contact/careers' },
          { name: t('offices', 'Offices'), path: '/contact/offices' },
        ]
      },
    ];
  };
  
  // Platform-specific menu items 
  const getPlatformMenuItems = () => {
    if (platform === 'crypto') { // Crypto
      return [
        { 
          name: t('exchange', 'Exchange'), 
          path: '/crypto/exchange',
          submenu: [
            { name: t('spotTrading', 'Spot Trading'), path: '/crypto/exchange/spot' },
            { name: t('futures', 'Futures'), path: '/crypto/exchange/futures' },
            { name: t('options', 'Options'), path: '/crypto/exchange/options' },
          ]
        },
        { 
          name: t('markets', 'Markets'), 
          path: '/crypto/markets',
          submenu: [
            { name: t('topCoins', 'Top Coins'), path: '/crypto/markets/top-coins' },
            { name: t('marketCap', 'Market Cap'), path: '/crypto/markets/market-cap' },
            { name: t('newListings', 'New Listings'), path: '/crypto/markets/new-listings' },
          ]
        },
        { 
          name: t('earn', 'Earn'), 
          path: '/crypto/earn',
          submenu: [
            { name: t('staking', 'Staking'), path: '/crypto/earn/staking' },
            { name: t('yieldFarming', 'Yield Farming'), path: '/crypto/earn/yield' },
            { name: t('savings', 'Savings'), path: '/crypto/earn/savings' },
          ]
        },
      ];
    } else if (platform === 'stocks') { // Stock
      return [
        { 
          name: t('invest', 'Invest'), 
          path: '/stocks/invest',
          submenu: [
            { name: t('stocks', 'Stocks'), path: '/stocks/invest/stocks' },
            { name: t('etfs', 'ETFs'), path: '/stocks/invest/etfs' },
            { name: t('ipos', 'IPOs'), path: '/stocks/invest/ipos' },
          ]
        },
        { 
          name: t('research', 'Research'), 
          path: '/stocks/research',
          submenu: [
            { name: t('marketNews', 'Market News'), path: '/stocks/research/news' },
            { name: t('analystRatings', 'Analyst Ratings'), path: '/stocks/research/ratings' },
            { name: t('screener', 'Screener'), path: '/stocks/research/screener' },
          ]
        },
        { 
          name: t('portfolio', 'Portfolio'), 
          path: '/stocks/portfolio',
          submenu: [
            { name: t('myHoldings', 'My Holdings'), path: '/stocks/portfolio/holdings' },
            { name: t('performance', 'Performance'), path: '/stocks/portfolio/performance' },
            { name: t('dividends', 'Dividends'), path: '/stockss/portfolio/dividends' },
          ]
        },
      ];
    } else if (platform === 'forex') { // Forex
      return [
        { 
          name: t('trading', 'Trading'), 
          path: '/forex/trading',
          submenu: [
            { name: t('currencyPairs', 'Currency Pairs'), path: '/forex/trading/currency-pairs' },
            { name: t('commodities', 'Commodities'), path: '/forex/trading/commodities' },
            { name: t('indices', 'Indices'), path: '/forex/trading/indices' },
          ]
        },
        { 
          name: t('analysis', 'Analysis'), 
          path: '/forex/analysis',
          submenu: [
            { name: t('economicCalendar', 'Economic Calendar'), path: '/forex/analysis/economic-calendar' },
            { name: t('marketSentiment', 'Market Sentiment'), path: '/forex/analysis/sentiment' },
            { name: t('technicalTools', 'Technical Tools'), path: '/forex/analysis/technical' },
          ]
        },
        { 
          name: t('education', 'Education'), 
          path: '/forex/education',
          submenu: [
            { name: t('tradingGuides', 'Trading Guides'), path: '/forex/education/guides' },
            { name: t('webinars', 'Webinars'), path: '/forex/education/webinars' },
            { name: t('strategyResources', 'Strategy Resources'), path: '/forex/education/strategies' },
          ]
        },
      ];
    } else if (platform === 'cash') { // Cash
      return [
        { 
          name: t('payments', 'Payments'), 
          path: '/cash/payments',
          submenu: [
            { name: t('sendMoney', 'Send Money'), path: '/cash/payments/send' },
            { name: t('requestMoney', 'Request Money'), path: '/cash/payments/request' },
            { name: t('payBills', 'Pay Bills'), path: '/cash/payments/bills' },
          ]
        },
        { 
          name: t('cards', 'Cards'), 
          path: '/cash/cards',
          submenu: [
            { name: t('virtualCards', 'Virtual Cards'), path: '/cash/cards/virtual' },
            { name: t('physicalCards', 'Physical Cards'), path: '/cash/cards/physical' },
            { name: t('cardSettings', 'Card Settings'), path: '/cash/cards/settings' },
          ]
        },
        { 
          name: t('banking', 'Banking'), 
          path: '/cash/banking',
          submenu: [
            { name: t('accounts', 'Accounts'), path: '/cash/banking/accounts' },
            { name: t('statements', 'Statements'), path: '/cash/banking/statements' },
            { name: t('bankingSavings', 'Savings'), path: '/cash/banking/savings' },
          ]
        },
      ];
    } else {
      return []; // Empty for main domain as we'll handle that separately
    }
  };

  // Determine which menu items to display based on domain
  const menuItems = isMainDomain() ? getMainDomainMenuItems() : getPlatformMenuItems();
  
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
                <Box position="relative" width="200px" height="70px">
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
        <Box width={{ base: '200px', md: '200px' }}>
          <Link href="/" passHref>
            <Box display="block">
              <Logo />
            </Box>
          </Link>
        </Box>

        {/* Desktop Main Menu */}
        <HStack 
          spacing={6}
          display={{ base: 'none', lg: 'flex' }}
          position="relative"
        >
          {/* Display menu items based on domain */}
          {menuItems.map((item) => (
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
          
          {/* Our Solutions Button - Always visible regardless of domain */}
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
                {t('ourSolutions', 'Our Solutions')}
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
                    {t('myAccount', 'My Account')}
                  </Button>
                  <Button
                    leftIcon={<FaSignOutAlt size={16} />}
                    onClick={handleLogout}
                    size="md"
                    variant={`${platform}-outline`}
                    colorScheme="red"
                  >
                    {t('logout', 'Logout')}
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
                    {t('login', 'Login')}
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
                    {t('signup', 'Sign Up')}
                  </Button>
                </>
              )}
            </>
          )}
        </HStack>

        {/* Mobile Controls */}
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
                    {t('myAccount', 'My Account')}
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
                    {t('logout', 'Logout')}
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
                    {t('login', 'Login')}
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
                    {t('signup', 'Sign Up')}
                  </Button>
                </>
              )}
            </HStack>
          )}
          <VStack align="stretch" spacing={4} mt={!isMainDomain() ? 4 : 0}>
            {/* Display menu items based on domain */}
            {menuItems.map((item) => (
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
            
            {/* Our Solutions Section - always present regardless of domain */}
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
                {t('ourSolutions', 'Our Solutions')}
              </Text>
              <Flex 
                mt={4}
                justify="center"
                align="center" 
                px={2}
                w="full" 
                gap={4}
                overflowX="auto"
                flexWrap="wrap"
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
                    <VStack spacing={2}>
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