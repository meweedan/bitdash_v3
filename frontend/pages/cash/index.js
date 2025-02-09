// frontend/pages/cash/index.js
import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { BitLandingBrowser } from '@/components/PWALanding';  // Fix: import from PWALanding component
import CashLandingBrowser from '@/components/landing/CashLandingBrowser';

const CashPage = () => {
  const { isPWA } = usePWA();
  const isBrowser = typeof window !== 'undefined';
  const hostname = isBrowser ? window.location.hostname : '';

  useEffect(() => {
    if (isBrowser && hostname === 'bitdash.app') {
      window.location.href = 'https://cash.bitdash.app';
    }
  }, [hostname, isBrowser]);

  if (hostname === 'bitdash.app') return null;

  return isPWA ? <CashPWALanding /> : <CashLandingBrowser />;
};

export default CashPage;