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
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChatIcon } from '@chakra-ui/icons';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Logo from '@/components/Logo';
import { FaSignInAlt, FaUserPlus, FaUser, FaSignOutAlt, FaWhatsapp, FaTelegram } from 'react-icons/fa';
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
  const accentColor = `brand.${platform}.700`;
  
  // Always show announcements for these platforms
  const showAnnouncements = platform === 'bittrade' || platform === 'bitinvest' || platform === 'bitfund' || platform === 'bitcash';

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
      name: 'BitTrade',
      image: '/trade.png',
      mobileImage: '/trade.png',
      href: 'https://trade.bitdash.app/',
    },
    {
      name: 'BitCash',
      image: '/cash.png',
      mobileImage: '/cash.png',
      href: 'https://cash.bitdash.app/',
    },
    {
      name: 'BitFund',
      image: '/fund.png',
      mobileImage: '/fund.png',
      href: 'https://fund.bitdash.app/',
    },
    {
      name: 'BitInvest',
      image: '/invest.png',
      mobileImage: '/invest.png',
      href: 'https://invest.bitdash.app/',
    },
  ];

  const bgColor = useColorModeValue(
    platform === 'bitcash' ? 'brand.bitcash.500' : 
    platform === 'bitinvest' ? 'brand.bitinvest.500' :
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
      if (hostname.includes('fund.bitdash') || hostname === 'fund.localhost') return 'bitfund';
      if (hostname.includes('trade.bitdash') || hostname === 'trade.localhost') return 'bittrade';
      if (hostname.includes('invest.bitdash') || hostname === 'invest.localhost') return 'bitinvest';
      
      // Also check URL path for local development
      const pathname = window.location.pathname;
      if (pathname.startsWith('/cash')) return 'bitcash';
      if (pathname.startsWith('/fund')) return 'bitfund';
      if (pathname.startsWith('/trade')) return 'bittrade';
      if (pathname.startsWith('/invest')) return 'bitinvest';
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
  
  return (
    <Flex
      as="nav"
      direction="column"
      position="sticky"
      top="0"
      width="100%"
      backdropFilter="blur(40px)"
      zIndex={999}
    >
      {/* Solutions Menu - Desktop */}
      <Box 
        display={{ base: 'none', lg: 'block' }}
        w="full"
        transition="all 0.3s ease"
        h={showPlatforms ? 'auto' : '0'}
        overflow="hidden"
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
                _hover={{bg : isDark ? `brand.${platform}.700` : `brand.${platform}.700`}}
              >
                <Image 
                  src={platform.image}
                  width={120}
                  height={180}
                  priority={true}
                  style={{ objectFit: 'contain' }}
                />
              </VStack>
            </a>
          ))}
        </HStack>
      </Box>

      <Flex
        direction="row"
        justify="space-between"
        align="center"
        p={4}
        w="full"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Logo */}
        <Box width={{ base: '110px', md: '120px' }}>
          <Link href="/" passHref>
            <Box display="block">
              <Logo />
            </Box>
          </Link>
        </Box>

        {/* Desktop Center Menu */}
        <HStack 
          spacing={{ base: 'none', lg: '110' }}
          display={{ base: 'none', lg: 'flex' }}
          position="relative"
        >
          <Link href="/services" passHref>
            <Text
              fontSize="lg"
              fontWeight="bold"
              cursor="pointer"
              color={isDark ? `brand.${platform}.400` : `brand.${platform}.700`}
            >
              {t('servicesMenu')}
            </Text>
          </Link>
          
          <Link href="/about" passHref>
            <Text
              fontSize="lg"
              fontWeight="bold"
              cursor="pointer"
              color={isDark ? `brand.${platform}.400` : `brand.${platform}.700`}
            >
              {t('aboutUs')}
            </Text>
          </Link>

          <Link href="/contact" passHref>
            <Text
              fontSize="lg"
              fontWeight="bold"
              cursor="pointer"
              color={isDark ? `brand.${platform}.400` : `brand.${platform}.700`}
            >
              {t('contactUs')}
            </Text>
          </Link>
          
          <Box position="relative">
            <Text
              fontSize="lg"
              fontWeight="bold"
              cursor="pointer"
              color={isDark ? `brand.${platform}.400` : `brand.${platform}.700`}
              onClick={() => setShowPlatforms(!showPlatforms)}
            >
              {t('ourSolutions')}
            </Text>
          </Box>
        </HStack>

        {/* Desktop Controls */}
        <Flex 
          display={{ base: 'none', lg: 'flex' }} 
          align="center" 
          gap={4}
        >
          <LanguageSwitcher 
            color={isDark ? `brand.${platform}.400` : `brand.${platform}.700`}
            sx={{
              '.chakra-select__wrapper::after': { display: 'none' },
              select: {
                width: '80px',
                fontSize: '16px',
                height: '40px',
                border: 'none',
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
            size="lg"
            _hover={{bg : isDark ? `brand.${platform}.700` : `brand.${platform}.700`}}
          />

          <IconButton
            icon={<FaWhatsapp size={24} />}
            variant={`${platform}-outline`}
            onClick={() => window.open("https://api.whatsapp.com/send?phone=00447538636207", "_blank")}
            aria-label="WhatsApp"
            size="lg"
            _hover={{bg : isDark ? `brand.${platform}.700` : `brand.${platform}.700`}}
          />

          <IconButton
            icon={<FaTelegram size={24} />}
            variant={`${platform}-outline`}
            onClick={() => window.open("https://t.me/BitDashSupport", "_blank")}
            aria-label="WhatsApp"
            size="lg"
            _hover={{bg : isDark ? `brand.${platform}.700` : `brand.${platform}.700`}}
          />

          {/* Only show auth buttons if not on main domain */}
          {!isMainDomain() && (
            <>
              {isLoggedIn ? (
                <>
                  <Button 
                    leftIcon={<FaUser size={20} />} 
                    size="lg"
                    variant={`${platform}-outline`}
                    onClick={() => router.push('/login')}
                    _hover={{bg : isDark ? `brand.${platform}.700` : `brand.${platform}.700`}}
                  >
                    {t('myAccount')}
                  </Button>
                  <Button
                    leftIcon={<FaSignOutAlt size={20} />}
                    onClick={handleLogout}
                    size="lg"
                    variant={`${platform}-outline`}
                    colorScheme="red"
                  >
                    {t('logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    leftIcon={<FaSignInAlt size={20} />}
                    size="lg"
                    _hover={{bg : isDark ? `brand.${platform}.700` : `brand.${platform}.700`}}
                    variant={`${platform}-outline`}
                    color={isDark ? `brand.${platform}.400` : `brand.${platform}.400`}
                    onClick={() => router.push('/login')}
                  >
                    {t('login')}
                  </Button>
                  <Button 
                    leftIcon={<FaUserPlus size={20} />}
                    size="lg"
                    variant={`${platform}-solid`}
                    color={{bg : isDark ? 'white' : 'black'}}
                    onClick={() => router.push('/signup')}
                    _hover={{bg : isDark ? `brand.${platform}.700` : `brand.${platform}.700`}}
                  >
                    {t('signup')}
                  </Button>
                </>
              )}
            </>
          )}
        </Flex>

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

          {!isMainDomain() && (
            <>
              {isLoggedIn ? (
                <>
                  <IconButton
                    as={Link}
                    href="/login"
                    icon={<FaUser />}
                    aria-label={t('myAccount')}
                    variant={`${platform}-outline`}
                    color={isDark ? `brand.${platform}.400` : `brand.${platform}.700`}
                    size="sm"
                  />
                  <IconButton
                    onClick={handleLogout}
                    icon={<FaSignOutAlt />}
                    aria-label={t('logout')}
                    variant={`${platform}-outline`}
                    colorScheme="red"
                    size="sm"
                  />
                </>
              ) : (
                <>
                  <IconButton
                    as={Link}
                    href="/login"
                    icon={<FaSignInAlt />}
                    aria-label={t('login')}
                    variant={`${platform}-outline`}
                    color={isDark ? `brand.${platform}.400` : `brand.${platform}.700`}
                    size="sm"
                  />
                  <IconButton
                    as={Link}
                    href="/signup"
                    icon={<FaUserPlus />}
                    aria-label={t('signup')}
                    variant={`${platform}-outline`}
                    color={isDark ? `brand.${platform}.400` : `brand.${platform}.700`}
                    size="sm"
                  />
                </>
              )}
            </>
          )}

          <IconButton
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            variant={`${platform}-outline`}
            aria-label="Toggle Navigation"
            onClick={onToggle}
            size="sm"
          />
        </HStack>
      </Flex>

      {/* Mobile Menu */}
      <Collapse in={isOpen} animateOpacity>
        <Box
          position="fixed"
          width="100%"
          bg={isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)'}
          p={2}
          textAlign="center"
          boxShadow="3xl"
          zIndex="1000"
        >
          {/* Navigation Links */}
          <SimpleGrid columns={5} w="full" mb={2}>           
            <MenuItems href="/services" color={isDark ? `brand.${platform}.400` : `brand.${platform}.700`} onClick={onClose}>{t('servicesMenu')}</MenuItems>
            <MenuItems href="/about" color={isDark ? `brand.${platform}.400` : `brand.${platform}.700`} onClick={onClose}>{t('aboutUs')}</MenuItems>
            <MenuItems href="/contact" color={isDark ? `brand.${platform}.400` : `brand.${platform}.700`} onClick={onClose}>{t('contactUs')}</MenuItems>
            <IconButton
              icon={<FaWhatsapp />}
              variant={`${platform}-outline`}
              color={`brand.${platform}.400`}
              onClick={() => {
                window.open("https://api.whatsapp.com/send?phone=00447538636207", "_blank");
                onClose();
              }}
            >
            </IconButton>
            <IconButton
              icon={<FaTelegram />}
              variant={`${platform}-outline`}
              onClick={() => window.open("https://t.me/BitDashSupport", "_blank")}
              color={`brand.${platform}.400`}
            >
            </IconButton>
          </SimpleGrid>

          {/* Platforms Row */}
          <Flex 
            justify="space-between" 
            align="center" 
            px={4} 
            w="full" 
            overflowX="auto"
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
                <Box
                  onClick={onClose}
                  textAlign="center"
                  p={2}
                  borderRadius="md"
                  minW="60px"
                >
                  <Image
                    src={platform.mobileImage}
                    alt={platform.name}
                    width={80}
                    height={50}
                    priority={true}
                    style={{ 
                      margin: '0 auto',
                      objectFit: 'contain'
                    }}
                  />
                </Box>
              </a>
            ))}
          </Flex>
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