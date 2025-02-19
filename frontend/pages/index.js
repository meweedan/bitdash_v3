// pages/index.js
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';

// Landing components
import MainLanding from '@/components/Landing';
import CashLandingBrowser from '@/components/landing/CashLandingBrowser';
import FoodLandingBrowser from '@/components/landing/FoodLandingBrowser';
import ShopLandingBrowser from '@/components/landing/ShopLandingBrowser';
// etc.

export default function HomePage() {
  const { t } = useTranslation('common');
  const [platform, setPlatform] = useState(null);

  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname.includes('cash.')) {
      setPlatform('cash');
    } else if (hostname.includes('food.')) {
      setPlatform('food');
    } else if (hostname.includes('shop.')) {
      setPlatform('shop');
    } else if (process.env.NODE_ENV === 'development') {
      // for dev, we can pass ?platform=cash etc.
      const param = new URLSearchParams(window.location.search).get('platform');
      setPlatform(param || 'main');
    } else {
      setPlatform('main');
    }
  }, []);

  // Determine the correct metadata: title, favicon, manifest
  const getPlatformMeta = () => {
    switch (platform) {
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
      default:
        return {
          title: t('home', 'BitDash'),
          favicon: '/favicon.ico',
          manifest: '/manifest.json' // main bitdash
        };
    }
  };

  const meta = getPlatformMeta();

  // Decide which landing to render
  const renderPlatform = () => {
    switch (platform) {
      case 'cash':
        return <CashLandingBrowser />;
      case 'food':
        return <FoodLandingBrowser />;
      case 'shop':
        return <ShopLandingBrowser />;
      default:
        return <MainLanding />;
    }
  };

  return (
    <Layout>
      <Head>
        <title>{meta.title}</title>
        <link rel="icon" href={meta.favicon} />
        {/* Override manifest for each domain */}
        <link rel="manifest" href={meta.manifest} />
      </Head>

      {renderPlatform()}
    </Layout>
  );
}

// i18n
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}