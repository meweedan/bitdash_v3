import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Box, HStack, Text, useBreakpointValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useColorModeValue, useColorMode } from '@chakra-ui/react';

const languageOptions = [
  { code: 'ar', fullName: 'العربية', shortName: 'AR', flag: '🇱🇾' },
  { code: 'en', fullName: 'English', shortName: 'EN', flag: '🇬🇧' },
];

const LanguageSwitcher = () => {
  const router = useRouter();
  const { locale } = router;
 const [platform, setPlatform] = useState('bitdash');

  // Get current platform based on URL/hostname
  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname.includes('stocks')) setPlatform('stocks');
    else if (hostname.includes('cash')) setPlatform('cash');
    else if (hostname.includes('forex')) setPlatform('forex');
    else if (hostname.includes('crypto')) setPlatform('crypto');
    
    // For local development
    if (hostname === 'localhost') {
      const path = window.location.pathname;
      if (path.includes('/stocks')) setPlatform('stocks');
      if (path.includes('/cash')) setPlatform('cash');
      if (path.includes('/forex')) setPlatform('forex');
      if (path.includes('/crypto')) setPlatform('crypto');
    }
  }, []);

  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  

  const changeLanguage = (newLocale) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <Box position="relative" zIndex="dropdown" width="auto">
      <HStack 
        spacing={0}
        borderRadius="md"
        position="relative"
        width="auto"
      >
        {/* Background Slider */}
        <motion.div
          initial={false}
          animate={{
            x: locale === 'ar' ? 0 : '100%',
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            position: 'absolute',
            width: '50%',
            height: '100%',
            borderRadius: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(4px)',
            zIndex: 0,
          }}
        />

        {/* Language Options */}
        {languageOptions.map(({ code, shortName }) => (
          <Box
            key={code}
            onClick={() => changeLanguage(code)}
            cursor="pointer"
            flex="1"
            pt={2}
            color={isDark ? `brand.${platform}.400` : `brand.${platform}.700`}
            p={2} 
            textAlign="center"
            position="relative"
            zIndex={1}
            fontWeight="bold"
            fontSize="xl"
            style={{
              direction: code === 'ar' ? 'rtl' : 'ltr',
            }}
          >
            <Text>
              {code === locale ? shortName : shortName}
            </Text>
          </Box>
        ))}
      </HStack>
    </Box>
  );
};

export default LanguageSwitcher;