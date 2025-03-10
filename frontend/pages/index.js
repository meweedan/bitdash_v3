// pages/index.js
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/Layout';

// Subdomain landings
import MainLanding from '@/components/Landing';
import CashLandingBrowser from '@/components/landing/CashLandingBrowser';
import LDNLandingBrowser from '@/components/landing/LDNLandingBrowser';

export default function HomePage() {
  const { t } = useTranslation('common');
  const [platform, setPlatform] = useState(null);

  useEffect(() => {
    // 1) Detect subdomain by checking window.location.hostname
    const hostname = window.location.hostname.toLowerCase();

    if (hostname.includes('adfaaly.')) {
      setPlatform('adfaaly');
    } else if (hostname.includes('ldn.')) {
      setPlatform('ldn');
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
      case 'adfaaly':
        return {
          title: t('adfaaly.title', 'Adfaaly'),
          favicon: '/adfaaly-icons/favicon.ico',
          manifest: '/manifests/adfaaly-manifest.json',
        };
      case 'ldn':
        return {
          title: t('trade.title', 'LDN Prime Markets'),
          favicon: '/ldn-icons/favicon.ico',
          manifest: '/manifests/ldn-manifest.json',
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
      case 'adfaaly':
        return <CashLandingBrowser />;
      case 'ldn':
        return <LDNLandingBrowser />;
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