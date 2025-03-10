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
  useDisclosure,
  useColorModeValue,
  HStack,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Divider,
  Portal
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
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
  
  // Always show announcements for these platforms
  const showAnnouncements = platform === 'ldn' || platform === 'cash';

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
      name: 'Adfaaly',
      image: '/adfaaly.png',
      mobileImage: '/adfaaly.png',
      href: 'https://adfaaly.bitdash.app/',
      color: 'brand.adfaaly'
    },
    {
      name: 'LDN Prime Markets',
      image: '/ldn.png',
      mobileImage: '/ldn.png',
      href: 'https://ldn.bitdash.app/',
      color: 'brand.ldn'
    }, 
  ];

  const getPlatformFromURL = () => {
    // Check for localhost development
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      
      // More specific checks to avoid partial matches
      if (hostname.includes('adfaaly.bitdash') || hostname === 'adfaaly.localhost') return 'adfaaly';
      if (hostname.includes('ldn.bitdash') || hostname === 'ldn.localhost') return 'ldn';
      
      // Also check URL path for local development
      const pathname = window.location.pathname;
      if (pathname.startsWith('/adfaaly')) return 'adfaaly';
      if (pathname.startsWith('/ldn')) return 'ldn';
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
          { name: t('Careers', 'Careers'), path: '/contact/careers' },
          { name: t('Offices', 'Offices'), path: '/contact/offices' },
        ]
      },
    ];
  };
  
  // Platform-specific menu items 
  const getPlatformMenuItems = () => {
    if (platform === 'ldn') { // Forex
      return [
        { 
          name: t('analysis', 'Analysis'), 
          path: '/ldn/analysis',
          submenu: [
            { name: t('economicCalendar', 'Economic Calendar'), path: '/ldn/analysis/economic-calendar' },
            { name: t('marketSentiment', 'Market Sentiment'), path: '/ldn/analysis/sentiment' },
            { name: t('forex:forexNews"', 'Forex News'), path: '/ldn/analysis/news' },
          ]
        },
        { 
          name: t('education', 'Education'), 
          path: '/ldn/education',
          submenu: [
            { name: t('tradingGuides', 'Trading Guides'), path: '/ldn/education/guides' },
            { name: t('webinars', 'Webinars'), path: '/ldn/education/webinars' },
            { name: t('strategyResources', 'Strategy Resources'), path: '/ldn/education/strategies' },
          ]
        },
      ];
    } else if (platform === 'adfaaly') { // Cash
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
  
  return (
    <Flex
      as="nav"
      direction="column"
      position="sticky"
      top="0"
      width="100%"
      zIndex={999}
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
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  position="relative"
                  width={{ base: "140px", md: "190px" }}
                  height="50px"
                  p={3}
                  _hover={{
                    boxShadow: "lg",
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
        w="full"
        dir={isRTL ? 'rtl' : 'ltr'}
        backdropFilter="blur(10px)"
        transition="all 0.3s ease"
        {...scrolledStyles}
      >
        <Flex
          maxW="1400px"
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
            spacing={{ base: 3, lg: 2 }}
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
                        px={2}
                        py={2}
                        borderRadius="md"
                        _hover={{ bg: isDark ? 'whiteAlpha.100' : 'blackAlpha.50' }}
                        cursor="pointer"
                      >
                        <HStack spacing={1} height="100%">
                          <Link href={item.path} passHref>
                            <Text 
                              fontSize="lg"
                              fontWeight="600"
                              color={isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
                            >
                              {item.name}
                            </Text>
                          </Link>
                          <Icon 
                            as={FaChevronDown} 
                            boxSize={2.5} 
                            color={isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
                          />
                        </HStack>
                      </Box>
                    </PopoverTrigger>
                    <Portal>
                      <PopoverContent 
                        bg={isDark ? "gray.800" : "white"}
                        borderColor={isDark ? "gray.700" : "gray.200"}
                        boxShadow="lg"
                        p={1}
                        minW="180px"
                        maxW="220px"
                        borderRadius="md"
                        _focus={{ boxShadow: "lg" }}
                      >
                        <PopoverArrow bg={isDark ? "gray.800" : "white"} />
                        <PopoverBody p={0}>
                          <VStack align="stretch" spacing={0}>
                            {item.submenu.map((subItem, idx) => (
                              <Link key={subItem.name} href={subItem.path} passHref>
                                <Box
                                  p={2}
                                  borderRadius="md"
                                  _hover={{ 
                                    bg: isDark ? "gray.700" : "gray.50",
                                    color: `brand.${platform}.500`
                                  }}
                                  transition="all 0.2s"
                                >
                                  <Text fontSize="sm" fontWeight="500">
                                    {subItem.name}
                                  </Text>
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
                      px={2}
                      py={2}
                      borderRadius="md"
                      _hover={{ bg: isDark ? 'whiteAlpha.100' : 'blackAlpha.50' }}
                      cursor="pointer"
                    >
                      <Text 
                        fontSize="sm"
                        fontWeight="600"
                        color={isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
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
                px={2}
                py={2}
                borderRadius="md"
                _hover={{ bg: isDark ? 'whiteAlpha.100' : 'blackAlpha.50' }}
                cursor="pointer"
                onClick={() => setShowPlatforms(!showPlatforms)}
              >
                <HStack spacing={1}>
                  <Text 
                    fontSize="lg"
                    fontWeight="600"
                    color={isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
                  >
                    {t('ourSolutions', 'Our Solutions')}
                  </Text>
                  <Icon 
                    as={FaChevronDown} 
                    boxSize={2.5} 
                    color={isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
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
          <HStack display={{ base: 'flex', lg: 'none'}} spacing={2}>
            <Box>
              <LanguageSwitcher />
            </Box>

            <IconButton
              onClick={toggleColorMode}
              variant={`${platform}-outline`}
              size="md"
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
              icon={isOpen ? <CloseIcon boxSize={3} /> : <HamburgerIcon boxSize={5} />}
              variant={`${platform}-outline`}
              size="md"
              borderRadius="full"
              color={isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
              aria-label="Toggle Navigation"
              onClick={onToggle}
            />
          </HStack>
        </Flex>
      </Flex>

      {/* Mobile Menu */}
      <Collapse in={isOpen} animateOpacity>
        <Box
          position="absolute"
          width="100%"
          bg={isDark ? "rgba(13, 17, 23, 0.97)" : "rgba(255, 255, 255, 0.97)"}
          backdropFilter="blur(10px)"
          py={3}
          px={4}
          textAlign="left"
          boxShadow="lg"
          zIndex="1000"
          maxH="80vh"
          overflowY="auto"
        >
          {!isMainDomain() && (
            <>
              <HStack align="stretch" spacing={2} mb={4}>
                {isLoggedIn ? (
                  <>
                    <Button 
                      leftIcon={<FaUser size={14} />}
                      variant={`${platform}-outline`}
                      w="full"
                      borderRadius="full"
                      color={isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
                      onClick={() => {
                        router.push('/login');
                        onClose();
                      }}
                      _hover={{ bg: isDark ? 'whiteAlpha.200' : 'blackAlpha.100' }}
                    >
                      {t('myAccount', 'My Account')}
                    </Button>
                    <Button
                      leftIcon={<FaSignOutAlt size={14} />}
                      variant={`${platform}-outline`}
                      w="full"
                      borderRadius="full"
                      color="red.400"
                      onClick={() => {
                        handleLogout();
                        onClose();
                      }}
                      _hover={{ bg: isDark ? 'whiteAlpha.200' : 'blackAlpha.100' }}
                    >
                      {t('logout', 'Logout')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      leftIcon={<FaSignInAlt size={14} />}
                      variant={`${platform}-outline`}
                      w="full"
                      borderRadius="full"
                      color={isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
                      onClick={() => {
                        router.push('/login');
                        onClose();
                      }}
                      _hover={{ bg: isDark ? 'whiteAlpha.200' : 'blackAlpha.100' }}
                    >
                      {t('login', 'Login')}
                    </Button>
                    <Button 
                      leftIcon={<FaUserPlus size={14} />}
                      w="full"
                      borderRadius="full"
                      variant={`${platform}-outline`}
                      color="white"
                      bg={`brand.${platform}.500`}
                      _hover={{ bg: buttonBgHover }}
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
              <Divider mb={4} borderColor={isDark ? "gray.700" : "gray.200"} />
            </>
          )}

          <VStack align="stretch" spacing={2}>
            {/* Display menu items based on domain */}
            {menuItems.map((item) => (
              <Box key={item.name}>
                {item.submenu && item.submenu.length > 0 ? (
                  <>
                    <Text
                      fontSize="sm"
                      fontWeight="600"
                      color={isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
                      py={2}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      onClick={() => {
                        // Navigate to the path on click
                        router.push(item.path);
                        onClose();
                      }}
                      cursor="pointer"
                    >
                      {item.name}
                      <Icon as={FaChevronDown} boxSize={3} />
                    </Text>
                    <VStack align="stretch" mt={1} mb={3} spacing={1} pl={3}>
                      {item.submenu.map((subItem) => (
                        <Link key={subItem.name} href={subItem.path} passHref>
                          <Text
                            fontSize="xs"
                            py={1.5}
                            fontWeight="500"
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
                  </>
                ) : (
                  <Link href={item.path} passHref>
                    <Text
                      fontWeight="600"
                      color={isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
                      py={2}
                      onClick={onClose}
                    >
                      {item.name}
                    </Text>
                  </Link>
                )}
                <Divider borderColor={isDark ? "gray.700" : "gray.200"} opacity={0.5} />
              </Box>
            ))}
            
            {/* Our Solutions Section - only if we have platforms to show */}
            {platforms.length > 0 && (
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  py={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  color={isDark ? `brand.${platform}.400` : `brand.${platform}.600`}
                  onClick={() => setShowPlatforms(!showPlatforms)}
                  cursor="pointer"
                >
                  {t('ourSolutions', 'Our Solutions')}
                  <Icon 
                    as={FaChevronDown} 
                    boxSize={3}
                    transform={showPlatforms ? 'rotate(180deg)' : 'rotate(0deg)'}
                    transition="transform 0.3s ease"
                  />
                </Text>
              </Box>
            )}
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