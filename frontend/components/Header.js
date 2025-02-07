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
  HStack,
  Icon,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChatIcon } from '@chakra-ui/icons';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from '@/components/Logo';
import { FaSignInAlt, FaUserPlus, FaUser, FaSignOutAlt, FaWhatsapp } from 'react-icons/fa';

const MenuItems = ({ href, children, onClick }) => (
  <Link href={href} passHref>
    <Text
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontWeight="bold"
      px={4}
      py={2}
      _hover={{ color: 'blue.500' }}
      textAlign="center"
      onClick={onClick}
      w="full"
    >
      {children}
    </Text>
  </Link>
);

export default function Header() {
  const { t, i18n } = useTranslation('common');
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const { isOpen, onToggle, onClose } = useDisclosure();
  const router = useRouter();
  const isRTL = i18n.language === 'ar' || i18n.language === 'he';
  const [showPlatforms, setShowPlatforms] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const platforms = [
    {
      image: '/menu.png',
      mobileImage: '/menu.png',
      href: 'https://menu.bitdash.app/',
    },
    {
      image: '/cash.png',
      mobileImage: '/cash.png',
      href: 'https://cash.bitdash.app/',
    },
    {
      image: '/auto.png',
      mobileImage: '/auto.png',
      href: 'https://auto.bitdash.app/',
    },
    {
      image: '/stock.png',
      mobileImage: '/stock.png',
      href: 'https://stock.bitdash.app/',
    },
    {
      image: '/eats.png',
      mobileImage: '/eats.png',
      href: 'https://eats.bitdash.app/',
    }
  ];

  return (
    <Flex
      as="nav"
      direction="column"
      position="sticky"  // Changed from fixed
      top="0"
      width="100%"
      bg={isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'}
      backdropFilter="blur(10px)"
      zIndex={999}
      borderBottom="1px solid"
      borderColor={isDark ? "whiteAlpha.100" : "blackAlpha.100"}
    >
      {/* Solutions Menu - Desktop */}
        <Box 
          display={{ base: 'none', lg: 'block' }}
          w="full"
          bg={isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)'}
          transition="all 0.3s ease"
          h={showPlatforms ? 'auto' : '0'}
          overflow="hidden"
          borderBottom="1px solid"
          borderColor={isDark ? "whiteAlpha.100" : "blackAlpha.100"}
        >
          <HStack 
            spacing={8} 
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
                  spacing={3}
                  align="center"
                  transition="transform 0.2s"
                  _hover={{ transform: 'translateY(-5px)' }}
                >
                  <Image 
                    src={platform.image}
                    alt="platform"
                    width={90}
                    height={120}
                    priority={true}
                    style={{ objectFit: 'contain' }}
                  />
                  <Text 
                    fontSize="sm" 
                    fontWeight="medium"
                    color={isDark ? 'whiteAlpha.900' : 'gray.700'}
                  >
                    {platform.name}
                  </Text>
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
        <Box width={{ base: '120px', md: '180px' }}>
          <Link href="/" passHref>
            <Box display="block">
              <Logo />
            </Box>
          </Link>
        </Box>

        {/* Desktop Center Menu */}
        <HStack 
          spacing={100} 
          display={{ base: 'none', lg: 'flex' }}
          position="relative"
        >
          <Link href="/services" passHref>
            <Text
              fontSize="lg"
              fontWeight="bold"
              _hover={{ color: 'blue.500' }}
              cursor="pointer"
            >
              {t('servicesMenu')}
            </Text>
          </Link>
          
          <Link href="/about" passHref>
            <Text
              fontSize="lg"
              fontWeight="bold"
              _hover={{ color: 'blue.500' }}
              cursor="pointer"
            >
              {t('aboutUs')}
            </Text>
          </Link>
          
          <Box position="relative">
            <Text
              fontSize="lg"
              fontWeight="bold"
              _hover={{ color: 'blue.500' }}
              cursor="pointer"
              onClick={() => setShowPlatforms(!showPlatforms)}
              color={showPlatforms ? 'blue.500' : 'inherit'}
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
            sx={{
              '.chakra-select__wrapper::after': { display: 'none' },
              select: {
                width: '80px',
                fontSize: '16px',
                height: '40px',
                bg: isDark ? 'whiteAlpha.200' : 'blackAlpha.50',
                border: 'none',
                px: 3,
                borderRadius: 'md',
              }
            }}
          />

          <IconButton
            onClick={toggleColorMode}
            variant="solid"
            bg={isDark ? 'whiteAlpha.200' : 'blackAlpha.50'}
            color="blue.500"
            aria-label="Toggle Theme"
            icon={isDark ? 
              <svg viewBox="0 0 24 24" width="24px" height="24px"><path fill="currentColor" d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/></svg>
              : <svg viewBox="0 0 24 24" width="24px" height="24px"><path fill="currentColor" d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/></svg>
            }
            size="lg"
            _hover={{ bg: isDark ? 'whiteAlpha.300' : 'blackAlpha.100' }}
          />

          <IconButton
            icon={<FaWhatsapp size={24} />}
            variant="solid"
            bg={isDark ? 'whiteAlpha.200' : 'blackAlpha.50'}
            color="blue.500"
            onClick={() => window.open("https://api.whatsapp.com/send?phone=00447538636207", "_blank")}
            aria-label="WhatsApp"
            size="lg"
            _hover={{ bg: isDark ? 'whiteAlpha.300' : 'blackAlpha.100' }}
          />

          {isLoggedIn ? (
            <>
              <Button 
                leftIcon={<FaUser size={20} />} 
                size="lg"
                variant="solid"
                bg={isDark ? 'whiteAlpha.200' : 'blackAlpha.50'}
                onClick={() => router.push('/login')}
                _hover={{ bg: isDark ? 'whiteAlpha.300' : 'blackAlpha.100' }}
              >
                {t('myAccount')}
              </Button>
              <Button
                leftIcon={<FaSignOutAlt size={20} />}
                onClick={handleLogout}
                size="lg"
                colorScheme="red"
                variant="solid"
              >
                {t('logout')}
              </Button>
            </>
          ) : (
            <>
              <Button 
                leftIcon={<FaSignInAlt size={20} />}
                size="lg"
                colorScheme="blue"
                variant="solid"
                onClick={() => router.push('/login')}
              >
                {t('login')}
              </Button>
              <Button 
                leftIcon={<FaUserPlus size={20} />}
                size="lg"
                variant="solid"
                bg={isDark ? 'whiteAlpha.200' : 'blackAlpha.50'}
                onClick={() => router.push('/signup')}
                _hover={{ bg: isDark ? 'whiteAlpha.300' : 'blackAlpha.100' }}
              >
                {t('signup')}
              </Button>
            </>
          )}
        </Flex>

        {/* Mobile Controls - Untouched */}
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
            variant="ghost"
            color="#1179be"
            aria-label="Toggle Theme"
            icon={isDark ? <svg viewBox="0 0 24 24" width="20px" height="20px"><path fill="currentColor" d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/></svg>
                : <svg viewBox="0 0 24 24" width="20px" height="20px"><path fill="currentColor" d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/></svg>}
            size="sm"
          />

          {isLoggedIn ? (
            <>
              <IconButton
                as={Link}
                href="/login"
                icon={<FaUser />}
                aria-label={t('myAccount')}
                variant="ghost"
                colorScheme="blue"
                size="sm"
              />
              <IconButton
                onClick={handleLogout}
                icon={<FaSignOutAlt />}
                aria-label={t('logout')}
                variant="ghost"
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
                variant="ghost"
                colorScheme="blue"
                size="sm"
              />
              <IconButton
                as={Link}
                href="/signup"
                icon={<FaUserPlus />}
                aria-label={t('signup')}
                variant="ghost"
                colorScheme="blue"
                size="sm"
              />
            </>
          )}

          <IconButton
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            variant="ghost"
            aria-label="Toggle Navigation"
            onClick={onToggle}
            size="sm"
          />
        </HStack>
      </Flex>

      {/* Mobile Menu - Untouched */}
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
          <SimpleGrid columns={3} w="full">           
            <MenuItems href="/services" onClick={onClose}>{t('servicesMenu')}</MenuItems>
            <MenuItems href="/about" onClick={onClose}>{t('aboutUs')}</MenuItems>
            <Button
              leftIcon={<FaWhatsapp />}
              variant="ghost"
              colorScheme="blue"
              onClick={() => {
                window.open("https://api.whatsapp.com/send?phone=00447538636207", "_blank");
                onClose();
              }}
              size="md"
            >
              <Text>
                {t('Chatbot')}
              </Text>
            </Button>

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
                  p={3}
                  borderRadius="md"
                >
                  <Image
                    src={platform.image}
                    alt="platform"
                    width={90}
                    height={120}
                    priority={true}
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      objectFit: 'contain'
                    }}
                  />
                  <Text mt={2} fontSize="sm" fontWeight="medium">
                    {platform.name}
                  </Text>
                </Box>
              </a>
            ))}
          </SimpleGrid>
        </Box>
      </Collapse>
    </Flex>
  );
}