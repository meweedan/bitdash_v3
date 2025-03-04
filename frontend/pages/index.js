// pages/index.js
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';

// Subdomain landings
import MainLanding from '@/components/Landing';
import CashLandingBrowser from '@/components/landing/CashLandingBrowser';
import StockLandingBrowser from '@/components/landing/StockLandingBrowser';
import FundLandingBrowser from '@/components/landing/FundLandingBrowser';
import TradeLandingBrowser from '@/components/landing/TradeLandingBrowser';

export default function HomePage() {
  const { t } = useTranslation('common');
  const [platform, setPlatform] = useState(null);

  useEffect(() => {
    // 1) Detect subdomain by checking window.location.hostname
    const hostname = window.location.hostname.toLowerCase();

    if (hostname.includes('cash.')) {
      setPlatform('cash');
    } else if (hostname.includes('fund.')) {
      setPlatform('fund');
    } else if (hostname.includes('trade.')) {
      setPlatform('trade');
    } else if (hostname.includes('stock.')) {
      setPlatform('stock');
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
      case 'fund':
        return {
          title: t('fund.title', 'BitFund'),
          favicon: '/fund-icons/favicon.ico',
          manifest: '/manifests/fund-manifest.json',
        };
      case 'trade':
        return {
          title: t('trade.title', 'BitTrade'),
          favicon: '/trade-icons/favicon.ico',
          manifest: '/manifests/trade-manifest.json',
        };
      case 'stock':
      return {
        title: t('stock.title', 'bitstock'),
        favicon: '/stock-icons/favicon.ico',
        manifest: '/manifests/stock-manifest.json',
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
      case 'fund':
        return <FundLandingBrowser />;
      case 'stock':
        return <StockLandingBrowser />;
      case 'trade':
        return <TradeLandingBrowser />;
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