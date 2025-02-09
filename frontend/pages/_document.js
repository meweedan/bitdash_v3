// _document.js
import { Html, Head, Main, NextScript } from 'next/document';
import { ColorModeScript } from '@chakra-ui/react';
import theme from '../styles/theme';

export default function Document() {
  const getMetadata = () => {
    // At build time, window is undefined. Adjust for runtime behavior dynamically.
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

    if (hostname.includes('auto')) {
      return {
        title: 'BitAuto',
        description: 'Automotive dealership management system',
      };
    }
    if (hostname.includes('food')) {
      return {
        title: 'BitFood',
        description: 'Digital menu and ordering system',
      };
    }
    if (hostname.includes('stock')) {
      return {
        title: 'BitStock',
        description: 'Stock management and inventory control',
      };
    }
    if (hostname.includes('cash')) {
      return {
        title: 'BitCash',
        description: 'Payment processing, international remittance and instant transfers',
      };
    }
    return {
      title: 'BitDash',
      description: 'Smart solutions, tailored for startups.',
    };
  };

  // Default metadata until runtime logic executes.
  const metadata = getMetadata();

  return (
    <Html lang="en">
      <Head>
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1, maximum-scale=1, minimal-ui"
        />        
        <meta name="application-name" content={metadata.title} />
        <meta name="description" content={metadata.description} />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={metadata.title} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#000000" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Platform-specific icons */}
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-167x167.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
      </Head>
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
