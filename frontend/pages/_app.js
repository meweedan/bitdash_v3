// pages/_app.js
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import '../styles/globals.css';
import theme from '../styles/theme';
import { CartProvider } from '@/contexts/CartContext';
import { ShopCartProvider } from '@/contexts/ShopCartContext';
import { PaymentProvider } from '@/contexts/PaymentContext';
import InstallPWA from '@/components/InstallPWA';
import FlowingLines from '@/components/FlowingShawl';
import { CurrencyProvider } from '@/contexts/CurrencyContext';

function MyApp({ Component, pageProps }) {
  const { locale } = useRouter();
  const isRTL = locale === 'ar';

  // Create React Query client
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 30000,
      },
    },
  }));

  if (typeof window !== 'undefined') {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }

  const customTheme = extendTheme({
    ...theme,
    direction: isRTL ? 'rtl' : 'ltr',
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={customTheme}>
          <CurrencyProvider>
              <PaymentProvider>
                <FlowingLines />
                <InstallPWA />
                <CartProvider>
                  <ShopCartProvider>
                    <ColorModeScript initialColorMode={customTheme.config.initialColorMode} />
                    <Component {...pageProps} />
                  </ShopCartProvider>
                </CartProvider>
              </PaymentProvider>
          </CurrencyProvider>
      </ChakraProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}

export default appWithTranslation(MyApp);