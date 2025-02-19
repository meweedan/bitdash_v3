// pages/index.js
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';

// Subdomain landings
import MainLanding from '@/components/Landing';
import CashLandingBrowser from '@/components/landing/CashLandingBrowser';
import FoodLandingBrowser from '@/components/landing/FoodLandingBrowser';
import ShopLandingBrowser from '@/components/landing/ShopLandingBrowser';

export default function HomePage() {
  const { t } = useTranslation('common');
  const [platform, setPlatform] = useState(null);

  useEffect(() => {
    // 1) Detect subdomain by checking window.location.hostname
    const hostname = window.location.hostname.toLowerCase();

    if (hostname.includes('cash.')) {
      setPlatform('cash');
    } else if (hostname.includes('food.')) {
      setPlatform('food');
    } else if (hostname.includes('shop.')) {
      setPlatform('shop');
    } else if (process.env.NODE_ENV === 'development') {
      // For dev, e.g. http://localhost:3000?platform=cash
      const param = new URLSearchParams(window.location.search).get('platform');
      setPlatform(param || 'main');
    } else {
      // main domain fallback
      setPlatform('main');
    }

    // Debugging: see what we got
    console.log('Subdomain detection => platform:', platform);
  }, [platform]);

  // 2) For each platform, choose a distinct manifest + icons
  const getPlatformMeta = () => {
    switch (platform) {
      case 'cash':
        return {
          title: t('cash.title', 'BitCash'),
          favicon: '/cash-icons/favicon.ico',
          manifest: '/manifests/cash-manifest.json',
        };
      case 'food':
        return {
          title: t('food.title', 'BitFood'),
          favicon: '/food-icons/favicon.ico',
          manifest: '/manifests/food-manifest.json',
        };
      case 'shop':
        return {
          title: t('shop.title', 'BitShop'),
          favicon: '/shop-icons/favicon.ico',
          manifest: '/manifests/shop-manifest.json',
        };
      default:
        return {
          title: t('home', 'BitDash'),
          favicon: '/favicon.ico',
          manifest: '/manifest.json', // fallback for main domain
        };
    }
  };

  const meta = getPlatformMeta();

  // 3) Render subdomain landing
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
        {/* Distinct subdomain icons + manifest */}
        <link rel="icon" href={meta.favicon} />
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