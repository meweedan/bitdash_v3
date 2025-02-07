import { Box, useColorMode } from '@chakra-ui/react';
import Header from './Header';
import { useTranslation } from 'next-i18next';
import Footer from './Footer';
import { useState, useEffect } from 'react';

const Layout = ({ children }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const { t } = useTranslation('common');
    const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
    <Box backgroundColor={isDark ? 'black' : 'white'} minHeight="10vh" color={isDark ? 'white' : 'black'}>
      <Header />
      <Box as="main" flex="1">
        <main>{children}</main>
      </Box>
    </Box>      
    <Footer />
    </>
  );
};

export default Layout;
