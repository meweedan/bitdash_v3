// frontend/pages/fund/index.js
import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { FundPWALanding } from '@/components/PWALanding';  // Fix: import from PWALanding component
import FundLandingBrowser from '@/components/landing/FundLandingBrowser';

const CashPage = () => {
  const { isPWA } = usePWA();
  const isBrowser = typeof window !== 'undefined';
  const hostname = isBrowser ? window.location.hostname : '';

  useEffect(() => {
    if (isBrowser && hostname === 'bitdash.app') {
      window.location.href = 'https://fund.bitdash.app';
    }
  }, [hostname, isBrowser]);

  if (hostname === 'bitdash.app') return null;

  return isPWA ? <FundPWALanding /> : <FundLandingBrowser />;
};

export default CashPage;