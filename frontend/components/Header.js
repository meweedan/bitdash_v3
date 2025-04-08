import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
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
  useDisclosure,
  useColorModeValue,
  HStack,
  SimpleGrid,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Portal,
  Divider,
  List,
  ListItem,
  Badge
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Logo from '@/components/Logo';
import { FaSignInAlt, FaUserPlus, FaUser, FaSignOutAlt, FaWhatsapp, FaTelegram, FaChevronDown } from 'react-icons/fa';
import AnnouncementBanner from './AnnouncementBanner';
import { motion as motionComponent } from 'framer-motion';
const motion = motionComponent;

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMobileMenus, setOpenMobileMenus] = useState({});

  // Toggle mobile submenu open/close
  const toggleMobileSubmenu = (menuName) => {
    setOpenMobileMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };
  
  // Always show announcements for these platforms
  const showAnnouncements = platform === 'utlubha' || platform === 'tazdani';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      name: 'tazdani',
      image: '/tazdani.png',
      mobileImage: '/tazdani.png',
      href: 'https://tazdani.bitdash.app/',
      color: 'brand.tazdani'
    },
    {
      name: 'utlubha',
      image: '/utlubha.png',
      mobileImage: '/utlubha.png',
      href: 'https://utlubha.bitdash.app/',
      color: 'brand.utlubha'
    }
  ];

  const getPlatformFromURL = () => {
    // Check for localhost development
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      
      // More specific checks to avoid partial matches
      if (hostname.includes('tazdani.bitdash') || hostname === 'tazdani.localhost') return 'tazdani';
      
      // Also check URL path for local development
      const pathname = window.location.pathname;
      if (pathname.startsWith('/tazdani')) return 'tazdani';
    }
    return 'bitdash'; // Default platform
  };

  useEffect(() => {
    const detected = getPlatformFromURL();
    console.log('Detected platform:', detected);
    setPlatform(detected);
  }, []);
  
  // Main menu items for main domain (bitdash.app)
  const getMainDomainMenuItems = () => {
    return [
      { 
        name: t('aboutUs', 'About Us'),
        path: '/about',
        submenu: [
          { name: t('companyProfile', 'Company Profile'), path: '/about/profile' },
          { name: t('ourTeam', 'Our Team'), path: '/about/team' },
          { name: t('team.regulation', 'Regulation'), path: '/about/regulation' },
        ]
      },
      { 
        name: t('contactUs', 'Contact Us'), 
        path: '/contact',
        submenu: [
          { name: t('Offices', 'Offices'), path: '/contact/offices' },
        ]
      },
    ];
  };
  
  // Platform-specific menu items 
  const getPlatformMenuItems = () => {
    if (platform === 'utlubha') { // Forex
      return [
        { 
          name: t('analysis', 'Analysis'), 
          path: '/utlubha/analysis',
          submenu: [
            { name: t('economicCalendar', 'Economic Calendar'), path: '/utlubha/analysis/economic-calendar' },
            { name: t('marketSentiment', 'Market Sentiment'), path: '/utlubha/analysis/sentiment' },
            { name: t('forex:forexNews"', 'Forex News'), path: '/utlubha/analysis/news' },
          ]
        },
        { 
          name: t('education', 'Education'), 
          path: '/utlubha/education',
          submenu: [
            { name: t('tradingGuides', 'Trading Guides'), path: '/utlubha/education/guides' },
            { name: t('webinars', 'Webinars'), path: '/utlubha/education/webinars' },
            { name: t('strategyResources', 'Strategy Resources'), path: '/utlubha/education/strategies' },
          ]
        },
      ];
    } else if (platform === 'tazdani') { // Cash
      return [
        { 
          name: t('payments', 'Payments'), 
          path: '/tazdani/payments',
          submenu: [
            { name: t('sendMoney', 'Send Money'), path: '/tazdani/payments/send' },
            { name: t('requestMoney', 'Request Money'), path: '/tazdani/payments/request' },
            { name: t('payBills', 'Pay Bills'), path: '/tazdani/payments/bills' },
          ]
        },
        { 
          name: t('cards', 'Cards'), 
          path: '/tazdani/cards',
          submenu: [
            { name: t('virtualCards', 'Virtual Cards'), path: '/tazdani/cards/virtual' },
            { name: t('physicalCards', 'Physical Cards'), path: '/tazdani/cards/physical' },
            { name: t('cardSettings', 'Card Settings'), path: '/tazdani/cards/settings' },
          ]
        }
      ];
    } else {
      return []; // Empty for main domain as we'll handle that separately
    }
  };

  // Determine which menu items to display based on domain
  const menuItems = isMainDomain() ? getMainDomainMenuItems() : getPlatformMenuItems();

  // Style configurations
  const headerBg = useColorModeValue(
    isDark ? 'rgba(13, 17, 23, 0.85)' : 'rgba(255, 255, 255, 0.85)',
    isDark ? 'rgba(13, 17, 23, 0.85)' : 'rgba(255, 255, 255, 0.85)'
  );
  
  const accentColor = `brand.${platform}.500`;
  const buttonBgHover = isDark ? `brand.${platform}.700` : `brand.${platform}.500`;
  
  const scrolledStyles = isScrolled ? {
    py: 2,
    boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid',
    borderColor: isDark ? 'gray.800' : 'gray.100',
  } : {
    py: 3,
    boxShadow: 'none',
    borderBottom: 'none',
  };

  // Animation properties for menu items
  const menuItemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 }
  };

  // Detect if the current route is active
  const isActivePath = (path) => {
    if (!path) return false;
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };
  
  // Animation for dropdown
  const dropdownVariants = {
    hidden: { opacity: 0, y: -5, height: 0 },
    visible: { opacity: 1, y: 0, height: 'auto', transition: { duration: 0.2 } }
  };
  
  return (
    <Flex
      as="nav"
      direction="column"
      position="sticky"
      top="0"
      width="100%"
      zIndex={999}
      bg={isDark ? "rgba(13, 17, 23, 0.7)" : "rgba(255, 255, 255, 0.7)"}
    >
      {/* Solutions Menu - Desktop */}
      <Collapse in={showPlatforms} animateOpacity>
        <Box 
          w="full"
          backdropFilter="blur(10px)"
          borderBottom="1px solid"
          borderColor={isDark ? "gray.800" : "gray.100"}
          py={6}
        >
          <Flex 
            maxW="1200px"
            mx="auto"
            px={{ base: 4, md: 6 }}
            justify="center"
            align="center"
            wrap="wrap"
            gap={8}
          >
            {platforms.map((plat) => (
              <a 
                key={plat.href}
                href={plat.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Box
                  as={motion.div}
                  whileHover={{ y: -5, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                  transition={{ duration: 0.2 }}
                  position="relative"
                  width={{ base: "150px", md: "200px" }}
                  height="50px"
                  p={3}
                  borderRadius="md"
                  _hover={{
                    borderColor: `${plat.color}.500`,
                  }}
                >
                  <Image 
                    src={plat.image}
                    alt={plat.name}
                    fill
                    priority={true}
                    style={{ 
                      objectFit: 'contain',
                      objectPosition: 'center'
                    }}
                  />
                </Box>
              </a>
            ))}
          </Flex>
        </Box>
      </Collapse>

      {/* Main Navigation Bar */}
      <Flex
        align="center"
        justify="space-between"
        px={{ base: 4, md: 6 }}
        bg={isDark ? 'gray.900' : 'white'}
        w="full"
        dir={isRTL ? 'rtl' : 'ltr'}
        transition="all 0.3s ease"
        {...scrolledStyles}
      >
        <Flex
          maxW="100%"
          w="full"
          mx="auto"
          justify="space-between"
          align="center"
        >
          {/* Logo */}
          <Box width={{ base: '190px', md: '250px' }} py={1}>
            <Link href="/" passHref>
              <Box display="block">
                <Logo />
              </Box>
            </Link>
          </Box>

          {/* Desktop Main Menu */}
          <HStack 
            spacing={{ base: 3, lg: 20 }}
            display={{ base: 'none', lg: 'flex' }}
            height="100%"
          >
            {/* Menu Items */}
            {menuItems.map((item) => (
              <Box key={item.name}>
                {item.submenu && item.submenu.length > 0 ? (
                  <Popover trigger="hover" placement="bottom-start" gutter={5}>
                    <PopoverTrigger>
                      <Box 
                        as={motion.div}
                        initial="hidden"
                        animate="visible"
                        variants={menuItemVariants}
                        position="relative"
                        px={3}
                        py={2}
                        borderRadius="md"
                        _hover={{ bg: isDark ? 'whiteAlpha.100' : 'blackAlpha.50' }}
                        cursor="pointer"
                        className={isActivePath(item.path) ? 'active-menu-item' : ''}
                        sx={{
                          '&.active-menu-item': {
                            _after: {
                              content: '""',
                              position: 'absolute',
                              bottom: '0',
                              left: '15%',
                              width: '70%',
                              height: '2px',
                              bg: `brand.${platform}.500`,
                              borderRadius: 'full'
                            }
                          }
                        }}
                      >
                        <HStack spacing={1} height="100%">
                          <Link href={item.path} passHref>
                            <Text 
                              fontSize="md"
                              fontWeight="600"
                              color={isActivePath(item.path) 
                                ? `brand.${platform}.500` 
                                : isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
                            >
                              {item.name}
                            </Text>
                          </Link>
                          <Icon 
                            as={ChevronDownIcon} 
                            boxSize={3.5} 
                            color={isActivePath(item.path) 
                              ? `brand.${platform}.500` 
                              : isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
                            transition="transform 0.2s"
                            _groupHover={{ transform: 'rotate(-180deg)' }}
                          />
                        </HStack>
                      </Box>
                    </PopoverTrigger>
                    <Portal>
                      <PopoverContent 
                        as={motion.div}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        bg={isDark ? "gray.800" : "white"}
                        borderColor={isDark ? "gray.700" : "gray.200"}
                        boxShadow="lg"
                        p={2}
                        minW="220px"
                        maxW="280px"
                        borderRadius="md"
                        _focus={{ boxShadow: "lg" }}
                      >
                        <PopoverArrow bg={isDark ? "gray.800" : "white"} />
                        <PopoverBody p={0}>
                          <VStack align="stretch" spacing={0}>
                            {item.submenu.map((subItem, idx) => (
                              <Link key={subItem.name} href={subItem.path} passHref>
                                <Box
                                  p={3}
                                  borderRadius="md"
                                  transition="all 0.2s"
                                  position="relative"
                                  _hover={{ 
                                    bg: isDark ? "gray.700" : "gray.50",
                                    pl: 4
                                  }}
                                  sx={isActivePath(subItem.path) ? {
                                    bg: isDark ? 'whiteAlpha.100' : 'blackAlpha.50',
                                    borderLeft: '3px solid',
                                    borderColor: `brand.${platform}.500`,
                                    pl: 4
                                  } : {}}
                                >
                                  <HStack justify="space-between" align="center">
                                    <Text 
                                      fontSize="sm" 
                                      fontWeight={isActivePath(subItem.path) ? "600" : "500"}
                                      color={isActivePath(subItem.path) ? `brand.${platform}.500` : "inherit"}
                                    >
                                      {subItem.name}
                                    </Text>
                                    {isActivePath(subItem.path) && (
                                      <Icon 
                                        as={ChevronRightIcon} 
                                        color={`brand.${platform}.500`} 
                                        boxSize={4} 
                                      />
                                    )}
                                  </HStack>
                                </Box>
                              </Link>
                            ))}
                          </VStack>
                        </PopoverBody>
                      </PopoverContent>
                    </Portal>
                  </Popover>
                ) : (
                  <Link href={item.path} passHref>
                    <Box 
                      as={motion.div}
                      initial="hidden"
                      animate="visible"
                      variants={menuItemVariants}
                      position="relative"
                      px={3}
                      py={2}
                      borderRadius="md"
                      _hover={{ bg: isDark ? 'whiteAlpha.100' : 'blackAlpha.50' }}
                      cursor="pointer"
                      className={isActivePath(item.path) ? 'active-menu-item' : ''}
                      sx={{
                        '&.active-menu-item': {
                          _after: {
                            content: '""',
                            position: 'absolute',
                            bottom: '0',
                            left: '15%',
                            width: '70%',
                            height: '2px',
                            bg: `brand.${platform}.500`,
                            borderRadius: 'full'
                          }
                        }
                      }}
                    >
                      <Text 
                        fontSize="md"
                        fontWeight="600"
                        color={isActivePath(item.path) 
                          ? `brand.${platform}.500` 
                          : isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
                      >
                        {item.name}
                      </Text>
                    </Box>
                  </Link>
                )}
              </Box>
            ))}
            
            {/* Our Solutions Button - Only if there are platforms to show */}
            {platforms.length > 0 && (
              <Box 
                as={motion.div}
                initial="hidden"
                animate="visible"
                variants={menuItemVariants}
                position="relative"
                px={3}
                py={2}
                borderRadius="md"
                _hover={{ bg: isDark ? 'whiteAlpha.100' : 'blackAlpha.50' }}
                cursor="pointer"
                onClick={() => setShowPlatforms(!showPlatforms)}
                className={showPlatforms ? 'active-menu-item' : ''}
                sx={{
                  '&.active-menu-item': {
                    bg: isDark ? 'whiteAlpha.100' : 'blackAlpha.50',
                    _after: {
                      content: '""',
                      position: 'absolute',
                      bottom: '0',
                      left: '15%',
                      width: '70%',
                      height: '2px',
                      bg: `brand.${platform}.500`,
                      borderRadius: 'full'
                    }
                  }
                }}
              >
                <HStack spacing={1}>
                  <Text 
                    fontSize="md"
                    fontWeight="600"
                    color={showPlatforms 
                      ? `brand.${platform}.500` 
                      : isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
                  >
                    {t('ourSolutions', 'Our Solutions')}
                  </Text>
                  <Icon 
                    as={ChevronDownIcon} 
                    boxSize={3.5} 
                    color={showPlatforms 
                      ? `brand.${platform}.500` 
                      : isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
                    transform={showPlatforms ? 'rotate(180deg)' : 'rotate(0deg)'}
                    transition="transform 0.3s ease"
                  />
                </HStack>
              </Box>
            )}
          </HStack>

          {/* Desktop Controls */}
          <HStack display={{ base: 'none', lg: 'flex' }}>
            <LanguageSwitcher />

            <IconButton
              onClick={toggleColorMode}
              aria-label="Toggle Theme"
              variant={`${platform}-outline`}
              size="md"
              color={isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
              icon={isDark ? 
                <svg viewBox="0 0 24 24" width="18px" height="18px"><path fill="currentColor" d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/></svg>
                : <svg viewBox="0 0 24 24" width="18px" height="18px"><path fill="currentColor" d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/></svg>
              }
              _hover={{ bg: isDark ? 'whiteAlpha.200' : 'blackAlpha.100' }}
            />

            <HStack spacing={2}>
              <IconButton
                icon={<FaWhatsapp size={16} />}
                size="md"
                variant={`${platform}-outline`}
                color={isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
                borderRadius="full"
                onClick={() => window.open("https://api.whatsapp.com/send?phone=00447538636207", "_blank")}
                aria-label="WhatsApp"
                _hover={{ bg: isDark ? 'whiteAlpha.200' : 'blackAlpha.100' }}
              />

              <IconButton
                icon={<FaTelegram size={16} />}
                size="md"
                variant={`${platform}-outline`}
                color={isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
                borderRadius="full"
                onClick={() => window.open("https://t.me/BitDashSupport", "_blank")}
                aria-label="Telegram"
                _hover={{ bg: isDark ? 'whiteAlpha.200' : 'blackAlpha.100' }}
              />
            </HStack>

            {/* Only show auth buttons if not on main domain */}
            {!isMainDomain() && (
              <>
                {isLoggedIn ? (
                  <HStack>
                    <Button 
                      leftIcon={<FaUser size={12} />} 
                      size="sm"
                      variant={`${platform}-outline`}
                      color={isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
                      borderRadius="full"
                      fontSize="md"
                      onClick={() => router.push('/login')}
                      _hover={{ bg: isDark ? 'whiteAlpha.200' : 'blackAlpha.100' }}
                    >
                      {t('myAccount', 'My Account')}
                    </Button>
                    <Button
                      leftIcon={<FaSignOutAlt size={12} />}
                      size="sm"
                      variant={`${platform}-outline`}
                      color="red.400"
                      borderRadius="full"
                      fontSize="md"
                      onClick={handleLogout}
                      _hover={{ bg: isDark ? 'whiteAlpha.200' : 'blackAlpha.100' }}
                    >
                      {t('logout', 'Logout')}
                    </Button>
                  </HStack>
                ) : (
                  <HStack spacing={2}>
                    <Button 
                      leftIcon={<FaSignInAlt size={12} />}
                      size="sm"
                      variant={`${platform}-outline`}
                      borderRadius="full"
                      color={isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
                      fontSize="md"
                      onClick={() => router.push('/login')}
                      _hover={{ bg: isDark ? 'whiteAlpha.200' : 'blackAlpha.100' }}
                    >
                      {t('login', 'Login')}
                    </Button>
                    <Button 
                      leftIcon={<FaUserPlus size={12} />}
                      size="sm"
                      variant={`${platform}-solid`}
                      borderRadius="full"
                      color="white"
                      fontSize="md"
                      bg={`brand.${platform}.500`}
                      _hover={{ bg: buttonBgHover }}
                      onClick={() => router.push('/signup')}
                    >
                      {t('signup', 'Sign Up')}
                    </Button>
                  </HStack>
                )}
              </>
            )}
          </HStack>

          {/* Mobile Controls */}
          <SimpleGrid display={{ base: 'relative', lg: 'none'}} columns={{ base: 1, md: 2 }}>
               
            <IconButton
              mb={2}
              onClick={toggleColorMode}
              variant="ghost"
              borderRadius="full"
              color={isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
              aria-label="Toggle Theme"
              icon={isDark ? 
                <svg viewBox="0 0 24 24" width="18px" height="18px">
                  <path fill="currentColor" d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/>
                </svg>
                : <svg viewBox="0 0 24 24" width="18px" height="18px">
                    <path fill="currentColor" d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/>
                  </svg>
              }
            />

            <IconButton
              mb={2}
              ms={2}
              icon={isOpen ? <CloseIcon boxSize={3} /> : <HamburgerIcon boxSize={5} />}
              variant="ghost"
              borderRadius="full"
              color={isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
              aria-label="Toggle Navigation"
              onClick={onToggle}
            />
             <LanguageSwitcher />
            </SimpleGrid>
        </Flex>
      </Flex>

      {/* Mobile Menu */}
      <Collapse in={isOpen} animateOpacity>
        <Box
          p={4}
          bg={isDark ? 'gray.900' : 'white'}
          borderBottom="1px solid"
          borderColor={isDark ? 'gray.700' : 'gray.200'}
          shadow="md"
        >
          <VStack spacing={1} align="stretch">
            {menuItems.map((item) => (
              <Box key={item.name}>
                {item.submenu && item.submenu.length > 0 ? (
                  <>
                    <Flex
                      py={2}
                      px={3}
                      align="center"
                      justify="space-between"
                      onClick={() => toggleMobileSubmenu(item.name)}
                      cursor="pointer"
                      borderRadius="md"
                      _hover={{ bg: isDark ? 'gray.800' : 'gray.100' }}
                    >
                      <Text fontWeight="semibold">{item.name}</Text>
                      <Icon
                        as={ChevronDownIcon}
                        transition="all .25s ease-in-out"
                        transform={openMobileMenus[item.name] ? 'rotate(180deg)' : ''}
                        w={6}
                        h={6}
                      />
                    </Flex>
                    <Collapse in={openMobileMenus[item.name]} animateOpacity>
                      <Box
                        as={motion.div}
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        pl={4}
                        borderLeft="2px solid"
                        borderColor={isDark ? 'gray.700' : 'gray.200'}
                        ml={3}
                      >
                        {item.submenu.map((subItem) => (
                          <Link key={subItem.name} href={subItem.path} passHref>
                            <Box
                              py={2}
                              px={3}
                              _hover={{ bg: isDark ? 'gray.800' : 'gray.100' }}
                              borderRadius="md"
                              onClick={onClose}
                            >
                              <Text fontSize="sm">{subItem.name}</Text>
                            </Box>
                          </Link>
                        ))}
                      </Box>
                    </Collapse>
                  </>
                ) : (
                  <Link href={item.path} passHref>
                    <Box
                      py={2}
                      px={3}
                      _hover={{ bg: isDark ? 'gray.800' : 'gray.100' }}
                      borderRadius="md"
                      onClick={onClose}
                    >
                      <Text fontWeight="semibold">{item.name}</Text>
                    </Box>
                  </Link>
                )}
              </Box>
            ))}

            {/* Mobile platforms menu */}
            {platforms.length > 0 && (
              <>
                <Flex
                  py={2}
                  px={3}
                  align="center"
                  justify="space-between"
                  onClick={() => toggleMobileSubmenu('solutions')}
                  cursor="pointer"
                  borderRadius="md"
                  _hover={{ bg: isDark ? 'gray.800' : 'gray.100' }}
                >
                  <Text fontWeight="semibold">{t('ourSolutions', 'Our Solutions')}</Text>
                  <Icon
                    as={ChevronDownIcon}
                    transition="all .25s ease-in-out"
                    transform={openMobileMenus['solutions'] ? 'rotate(180deg)' : ''}
                    w={6}
                    h={6}
                  />
                </Flex>
                <Collapse in={openMobileMenus['solutions']} animateOpacity>
                  <Box
                    as={motion.div}
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    pl={4}
                    borderLeft="2px solid"
                    borderColor={isDark ? 'gray.700' : 'gray.200'}
                    ml={3}
                  >
                    {platforms.map((plat) => (
                      <a 
                        key={plat.href}
                        href={plat.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                      >
                        <Box
                          py={2}
                          px={3}
                          mb={2}
                          _hover={{ bg: isDark ? 'gray.800' : 'gray.100' }}
                          borderRadius="md"
                          display="flex"
                          alignItems="center"
                        >
                          <Box 
                            position="relative"
                            width="80px" 
                            height="30px"
                            mr={2}
                          >
                            <Image 
                              src={plat.mobileImage} 
                              alt={plat.name}
                              fill
                              style={{ objectFit: 'contain' }}
                            />
                          </Box>
                        </Box>
                      </a>
                    ))}
                  </Box>
                </Collapse>
              </>
            )}

            {/* Only show auth buttons if not on main domain */}
            {!isMainDomain() && (
              <>
                <Divider my={2} borderColor={isDark ? 'gray.700' : 'gray.200'} />
                {isLoggedIn ? (
                  <VStack spacing={2} align="stretch" py={2}>
                    <Link href="/account" passHref>
                      <Button
                        leftIcon={<FaUser size={14} />}
                        variant={`${platform}-outline`}
                        justifyContent="flex-start"
                        width="full"
                        onClick={onClose}
                      >
                        {t('myAccount', 'My Account')}
                      </Button>
                    </Link>
                    <Button
                      leftIcon={<FaSignOutAlt size={14} />}
                      variant="outline"
                      colorScheme="red"
                      justifyContent="flex-start"
                      width="full"
                      onClick={() => {
                        handleLogout();
                        onClose();
                      }}
                    >
                      {t('logout', 'Logout')}
                    </Button>
                  </VStack>
                ) : (
                  <VStack spacing={2} align="stretch" py={2}>
                    <Link href="/login" passHref>
                      <Button
                        leftIcon={<FaSignInAlt size={14} />}
                        variant={`${platform}-outline`}
                        justifyContent="flex-start"
                        width="full"
                        onClick={onClose}
                      >
                        {t('login', 'Login')}
                      </Button>
                    </Link>
                    <Link href="/signup" passHref>
                      <Button
                        leftIcon={<FaUserPlus size={14} />}
                        variant={`${platform}-solid`}
                        justifyContent="flex-start"
                        width="full"
                        color="white"
                        bg={`brand.${platform}.500`}
                        _hover={{ bg: buttonBgHover }}
                        onClick={onClose}
                      >
                        {t('signup', 'Sign Up')}
                      </Button>
                    </Link>
                  </VStack>
                )}
              </>
            )}

            {/* Contact buttons for mobile */}
            <Divider my={2} borderColor={isDark ? 'gray.700' : 'gray.200'} />
            <HStack spacing={2} justify="center" py={2}>
              <IconButton
                icon={<FaWhatsapp size={18} />}
                colorScheme="whatsapp"
                variant="outline"
                borderRadius="full"
                onClick={() => window.open("https://api.whatsapp.com/send?phone=00447538636207", "_blank")}
                aria-label="WhatsApp"
              />
              <IconButton
                icon={<FaTelegram size={18} />}
                colorScheme="blue"
                variant="outline"
                borderRadius="full"
                onClick={() => window.open("https://t.me/BitDashSupport", "_blank")}
                aria-label="Telegram"
              />
            </HStack>
          </VStack>
        </Box>
      </Collapse>

      {/* Announcement Banner - Only shown for certain platforms */}
      {showAnnouncements && (
        <AnnouncementBanner platform={platform} />
      )}
    </Flex>
  );
}