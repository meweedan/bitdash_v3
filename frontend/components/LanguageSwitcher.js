import { useRouter } from 'next/router';
import { Box, HStack, Text, useBreakpointValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const languageOptions = [
  { code: 'ar', fullName: 'العربية', shortName: 'AR', flag: '🇱🇾' },
  { code: 'en', fullName: 'English', shortName: 'EN', flag: '🇬🇧' },
];

const LanguageSwitcher = () => {
  const router = useRouter();
  const { locale } = router;

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
        minWidth="50px"
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
        {languageOptions.map(({ code, shortName, flag }) => (
          <Box
            key={code}
            onClick={() => changeLanguage(code)}
            cursor="pointer"
            flex="1"
            pt={2}
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
              {code === locale ? flag : flag}
            </Text>
          </Box>
        ))}
      </HStack>
    </Box>
  );
};

export default LanguageSwitcher;