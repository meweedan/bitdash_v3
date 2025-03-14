// frontend/pages/tolbah/index.js
import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { TolbahPWALanding } from '@/components/PWALanding';
import TolbahLandingBrowser from '@/components/landing/TolbahLandingBrowser';

const TolbahPage = () => {
  const { isPWA } = usePWA();
  const isBrowser = typeof window !== 'undefined';
  const hostname = isBrowser ? window.location.hostname : '';

  useEffect(() => {
    if (isBrowser && hostname === 'bitdash.app') {
      window.location.href = 'https://tolbah.bitdash.app';
    }
  }, [hostname, isBrowser]);

  if (hostname === 'bitdash.app') return null;

  return isPWA ? <TolbahPWALanding /> : <TolbahLandingBrowser />;
};

export default TolbahPage;