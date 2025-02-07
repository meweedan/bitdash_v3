// frontend/pages/auto/index.js
import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { AutoPWALanding } from '@/components/PWALanding';  // Fix: import from PWALanding component
import AutoLandingBrowser from '@/components/landing/AutoLandingBrowser';

const AutoPage = () => {
  const { isPWA } = usePWA();
  const isBrowser = typeof window !== 'undefined';
  const hostname = isBrowser ? window.location.hostname : '';

  useEffect(() => {
    if (isBrowser && hostname === 'bitdash.app') {
      window.location.href = 'https://auto.bitdash.app';
    }
  }, [hostname, isBrowser]);

  if (hostname === 'bitdash.app') return null;

  return isPWA ? <AutoPWALanding /> : <AutoLandingBrowser />;
};

export default AutoPage;