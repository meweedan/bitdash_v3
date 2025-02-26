// frontend/pages/invest/index.js
import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { InvestPWALanding } from '@/components/PWALanding';  // Fix: import from PWALanding component
import InvestLandingBrowser from '@/components/landing/InvestLandingBrowser';

const CashPage = () => {
  const { isPWA } = usePWA();
  const isBrowser = typeof window !== 'undefined';
  const hostname = isBrowser ? window.location.hostname : '';

  useEffect(() => {
    if (isBrowser && hostname === 'bitdash.app') {
      window.location.href = 'https://invest.bitdash.app';
    }
  }, [hostname, isBrowser]);

  if (hostname === 'bitdash.app') return null;

  return isPWA ? <InvestPWALanding /> : <InvestLandingBrowser />;
};

export default CashPage;