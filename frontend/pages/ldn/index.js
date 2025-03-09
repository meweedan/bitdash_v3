// frontend/pages/trade/index.js
import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { LDNPWALanding } from '@/components/PWALanding';  // Fix: import from PWALanding component
import LDNLandingBrowser from '@/components/landing/LDNLandingBrowser';

const CashPage = () => {
  const { isPWA } = usePWA();
  const isBrowser = typeof window !== 'undefined';
  const hostname = isBrowser ? window.location.hostname : '';

  useEffect(() => {
    if (isBrowser && hostname === 'bitdash.app') {
      window.location.href = 'https://ldn.bitdash.app';
    }
  }, [hostname, isBrowser]);

  if (hostname === 'bitdash.app') return null;

  return isPWA ? <LDNPWALanding /> : <LDNLandingBrowser />;
};

export default CashPage;