// frontend/pages/stock/index.js
import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { StockPWALanding } from '@/components/PWALanding';  // Fix: import from PWALanding component
import StocskLandingBrowser from '@/components/landing/StocksLandingBrowser';

const CashPage = () => {
  const { isPWA } = usePWA();
  const isBrowser = typeof window !== 'undefined';
  const hostname = isBrowser ? window.location.hostname : '';

  useEffect(() => {
    if (isBrowser && hostname === 'bitdash.app') {
      window.location.href = 'https://stocks.bitdash.app';
    }
  }, [hostname, isBrowser]);

  if (hostname === 'bitdash.app') return null;

  return isPWA ? <StocskPWALanding /> : <StocksLandingBrowser />;
};

export default CashPage;