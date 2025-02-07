// frontend/pages/stock/index.js
import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { StockPWALanding } from '@/components/PWALanding';  // Fix: import from PWALanding component
import StockLandingBrowser from '@/components/landing/StockLandingBrowser';

const StockPage = () => {
  const { isPWA } = usePWA();
  const isBrowser = typeof window !== 'undefined';
  const hostname = isBrowser ? window.location.hostname : '';

  useEffect(() => {
    if (isBrowser && hostname === 'bitdash.app') {
      window.location.href = 'https://stock.bitdash.app';
    }
  }, [hostname, isBrowser]);

  if (hostname === 'bitdash.app') return null;

  return isPWA ? <StockPWALanding /> : <StockLandingBrowser />;
};

export default StockPage;