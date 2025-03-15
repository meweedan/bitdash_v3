// frontend/pages/utlubha/index.js
import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { UtlubhaPWALanding } from '@/components/PWALanding';
import UtlubhaLandingBrowser from '@/components/landing/UtlubhaLandingBrowser';

const UtlubhaPage = () => {
  const { isPWA } = usePWA();
  const isBrowser = typeof window !== 'undefined';
  const hostname = isBrowser ? window.location.hostname : '';

  useEffect(() => {
    if (isBrowser && hostname === 'bitdash.app') {
      window.location.href = 'https://utlubha.bitdash.app';
    }
  }, [hostname, isBrowser]);

  if (hostname === 'bitdash.app') return null;

  return isPWA ? <UtlubhaPWALanding /> : <UtlubhaLandingBrowser />;
};

export default UtlubhaPage;