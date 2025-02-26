// frontend/pages/trade/index.js
import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { TradePWALanding } from '@/components/PWALanding';  // Fix: import from PWALanding component
import TradeLandingBrowser from '@/components/landing/TradeLandingBrowser';

const CashPage = () => {
  const { isPWA } = usePWA();
  const isBrowser = typeof window !== 'undefined';
  const hostname = isBrowser ? window.location.hostname : '';

  useEffect(() => {
    if (isBrowser && hostname === 'bitdash.app') {
      window.location.href = 'https://trade.bitdash.app';
    }
  }, [hostname, isBrowser]);

  if (hostname === 'bitdash.app') return null;

  return isPWA ? <TradePWALanding /> : <TradeLandingBrowser />;
};

export default CashPage;