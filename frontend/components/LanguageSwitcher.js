import { useRouter } from 'next/router';
import { Select, Box } from '@chakra-ui/react';

const languageOptions = [
  { code: 'ar', fullName: 'العربية', shortName: 'AR' },
  { code: 'en', fullName: 'English', shortName: 'EN' },
];

const LanguageSwitcher = () => {
  const router = useRouter();
  const { locale } = router;

  const changeLanguage = (newLocale) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };


  return (
    <Box position="relative" zIndex="dropdown">
      <Select
        value={locale}
        onChange={(e) => changeLanguage(e.target.value)}
        width="auto"
        minWidth="50px"
        fontWeight="bold"
        cursor="pointer"
        border="none"
        _focus={{ boxShadow: 'none' }}
        _hover={{ backgroundColor: 'transparent' }}
        sx={{
          // Hide the default arrow with a custom background image trick
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
          paddingRight: '1rem',
          background: 'none', // Remove default background
          backgroundImage: 'none', // Remove default arrow
        }}
      >
        {languageOptions.map(({ code, fullName, shortName }) => (
          <option
            key={code}
            value={code}
            style={{
              direction: code === 'ar' ? 'rtl' : 'ltr',
            }}
          >
            {code === locale ? shortName : fullName}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default LanguageSwitcher;
