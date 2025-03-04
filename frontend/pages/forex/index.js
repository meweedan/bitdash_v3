// frontend/pages/trade/index.js
import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { ForexPWALanding } from '@/components/PWALanding';  // Fix: import from PWALanding component
import ForexLandingBrowser from '@/components/landing/ForexLandingBrowser';

const CashPage = () => {
  const { isPWA } = usePWA();
  const isBrowser = typeof window !== 'undefined';
  const hostname = isBrowser ? window.location.hostname : '';

  useEffect(() => {
    if (isBrowser && hostname === 'bitdash.app') {
      window.location.href = 'https://forex.bitdash.app';
    }
  }, [hostname, isBrowser]);

  if (hostname === 'bitdash.app') return null;

  return isPWA ? <ForexPWALanding /> : <ForexLandingBrowser />;
};

export default CashPage;