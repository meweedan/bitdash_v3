// frontend/pages/adfaly/index.js
import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { AdfalyPWALanding } from '@/components/PWALanding';  // Fix: import from PWALanding component
import CashLandingBrowser from '@/components/landing/CashLandingBrowser';

const CashPage = () => {
  const { isPWA } = usePWA();
  const isBrowser = typeof window !== 'undefined';
  const hostname = isBrowser ? window.location.hostname : '';

  useEffect(() => {
    if (isBrowser && hostname === 'bitdash.app') {
      window.location.href = 'https://adfaly.bitdash.app';
    }
  }, [hostname, isBrowser]);

  if (hostname === 'bitdash.app') return null;

  return isPWA ? <AdfalyPWALanding /> : <CashLandingBrowser />;
};

export default CashPage;