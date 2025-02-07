import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';
import MainLanding from '@/components/Landing';
import AutoLandingBrowser from '@/components/landing/AutoLandingBrowser';
import CashLandingBrowser from '@/components/landing/CashLandingBrowser';
import MenuLandingBrowser from '@/components/landing/MenuLandingBrowser';
import StockLandingBrowser from '@/components/landing/StockLandingBrowser';
import EatsLandingBrowser from '@/components/landing/EatsLandingBrowser';
import FoodLandingBrowser from '@/components/landing/FoodLandingBrowser';
import RideLandingBrowser from '@/components/landing/RideLandingBrowser';
import ShopLandingBrowser from '@/components/landing/ShopLandingBrowser';


function HomePage() {
  const { t } = useTranslation('common');
  const [platform, setPlatform] = useState(null);

  useEffect(() => {
    // Get platform from hostname
    const hostname = window.location.hostname;
    
    if (hostname.includes('menu.')) {
      setPlatform('menu');
    } else if (hostname.includes('cash.')) {
    setPlatform('cash');
    } else if (hostname.includes('food.')) {
    setPlatform('food');
    } else if (hostname.includes('ride.')) {
    setPlatform('ride');
    } else if (hostname.includes('shop.')) {
      setPlatform('shop');
    } else if (hostname.includes('eats.')) {
      setPlatform('eats');
    } else if (hostname.includes('auto.')) {
      setPlatform('auto');
    } else if (hostname.includes('stock.')) {
      setPlatform('stock');
    } else if (process.env.NODE_ENV === 'development') {
      // Handle development environment
      const platform = new URLSearchParams(window.location.search).get('platform');
      setPlatform(platform || 'main');
    } else {
      setPlatform('main');
    }
  }, []);

  const getPlatformMeta = () => {
    switch (platform) {
      case 'menu':
        return {
          title: t('menu.title', 'BitMenu'),
          favicon: '/menu-icons/favicon.ico',
          manifest: '/manifests/menu-manifest.json'
        };
      case 'cash':
        return {
          title: t('cash.title', 'BitCash'),
          favicon: '/cash-icons/favicon.ico',
          manifest: '/manifests/cash-manifest.json'
        };
      case 'food':
        return {
          title: t('food.title', 'BitFood'),
          favicon: '/food-icons/favicon.ico',
          manifest: '/manifests/food-manifest.json'
          };
      case 'shop':
        return {
          title: t('shop.title', 'BitShop'),
          favicon: '/shop-icons/favicon.ico',
          manifest: '/manifests/shop-manifest.json'
          };
      case 'ride': 
        return {
        title: t('ride.title', 'BitRide'),
        favicon: '/ride-icons/favicon.ico',
        manifest: '/manifests/ride-manifest.json'
        };
      case 'eats':
        return {
          title: t('eats.title', 'BitEats'),
          favicon: '/eats-icons/favicon.ico',
          manifest: '/manifests/eats-manifest.json'
        };
      case 'auto':
        return {
          title: t('auto.title', 'BitAuto'),
          favicon: '/auto-icons/favicon.ico',
          manifest: '/manifests/auto-manifest.json'
        };
      case 'stock':
        return {
          title: t('stock.title', 'BitStock'),
          favicon: '/stock-icons/favicon.ico',
          manifest: '/manifests/stock-manifest.json'
        };
        
      default:
        return {
          title: t('home', 'BitDash'),
          favicon: '/favicon.ico',
          manifest: '/manifest.json'
        };
    }
  };

  const renderPlatform = () => {
    switch (platform) {
      case 'menu':
        return <MenuLandingBrowser />;
      case 'cash':
          return <CashLandingBrowser />;
      case 'auto':
        return <AutoLandingBrowser />;
      case 'stock':
        return <StockLandingBrowser />;
        case 'food':
          return <FoodLandingBrowser />;
        case 'shop':
          return <ShopLandingBrowser />;
      case 'eats':
        return <EatsLandingBrowser />;
        case 'ride':
          return <RideLandingBrowser />;
        
      default:
        return <MainLanding />;
    }
  };

  const meta = getPlatformMeta();

  return (
    <>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <Layout>
        <Head>
          <title>{meta.title}</title>
          <link rel="icon" href={meta.favicon} />
          <link rel="manifest" href={meta.manifest} />
        </Head>

        {renderPlatform()}
      </Layout>
    </>
  );
}

// Fetching translations for multiple locales
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default HomePage;