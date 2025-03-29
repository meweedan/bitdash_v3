// frontend/pages/tazdani/index.js
import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { TazdaniPWALanding } from '@/components/PWALanding';
import TazdaniLandingBrowser from '@/components/landing/TazdaniLandingBrowser';

const CashPage = () => {
  const { isPWA } = usePWA();
  const isBrowser = typeof window !== 'undefined';
  const hostname = isBrowser ? window.location.hostname : '';

  useEffect(() => {
    if (isBrowser && hostname === 'bitdash.app') {
      window.location.href = 'https://tazdani.bitdash.app';
    }
  }, [hostname, isBrowser]);

  if (hostname === 'bitdash.app') return null;

  return isPWA ? <TazdaniPWALanding /> : <TazdaniLandingBrowser />;
};

export default CashPage;