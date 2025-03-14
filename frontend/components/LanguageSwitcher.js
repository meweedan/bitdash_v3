import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useColorMode } from '@chakra-ui/react';

const languageOptions = [
  { code: 'ar', fullName: 'العربية', shortName: 'AR', flag: '🇸🇦' },
  { code: 'en', fullName: 'English', shortName: 'EN', flag: '🇬🇧' },
];

const LanguageSwitcher = () => {
  const router = useRouter();
  const { locale } = router;
  const [platform, setPlatform] = useState('bitdash');
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  // Get current platform based on URL/hostname
  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname.includes('tolbah')) setPlatform('tolbah');
    else if (hostname.includes('adfaaly')) setPlatform('adfaaly');
    
    // For local development
    if (hostname === 'localhost') {
      const path = window.location.pathname;
      if (path.includes('/adfaaly')) setPlatform('adfaaly');
      if (path.includes('/tolbah')) setPlatform('tolbah');
    }
  }, []);

  const changeLanguage = (newLocale) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  // Generate platform-specific colors
  const accentColor = isDark ? `brand.${platform}.400` : `brand.${platform}.700`;
  const bgColor =  isDark ? `brand.${platform}.400` : `brand.${platform}.700`;
  const activeBgColor = isDark ? 'rgba(40, 40, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)';
  const borderColor = isDark ? `brand.${platform}.400` : `brand.${platform}.700`;

  return (
    <Box 
      position="relative" 
      zIndex="dropdown" 
      width="auto"
      borderRadius="full"
      overflow="hidden"
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      backdropFilter="blur(8px)"
      boxShadow="0 4px 12px rgba(0, 0, 0, 0.08)"
    >
      <Flex 
        position="relative"
        width="90px"
        height="35px"
        align="center"
        justify="space-between"
      >
        {/* Active Background Indicator */}
        <motion.div
          initial={false}
          animate={{
            x: locale === 'ar' ? 0 : '45px', // Half of the container width
          }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 30,
            duration: 0.2
          }}
          style={{
            position: 'absolute',
            width: '45px', // Half of the container width
            height: '32px',
            borderRadius: '100px',
            background: activeBgColor,
            zIndex: 0,
          }}
        />

        {/* Language Options */}
        {languageOptions.map(({ code, shortName }) => (
          <Box
            key={code}
            onClick={() => changeLanguage(code)}
            cursor="pointer"
            width="45px"
            height="100%"
            textAlign="center"
            position="relative"
            zIndex={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            style={{
              direction: shortName === 'ar' ? 'rtl' : 'ltr',
            }}
          >
            <Text
              fontSize="sm"
              fontWeight={locale === code ? "700" : "500"}
              color={locale === code ? accentColor : isDark ? "whiteAlpha.800" : "blackAlpha.700"}
              transition="all 0.2s ease"
            >
              {shortName}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default LanguageSwitcher;