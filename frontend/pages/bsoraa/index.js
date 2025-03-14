// frontend/pages/bsoraa/index.js
import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { BsoraaPWALanding } from '@/components/BsoraaPWALanding';
import BsoraaLandingBrowser from '@/components/landing/BsoraaLandingBrowser';

const BsoraaPage = () => {
  const { isPWA } = usePWA();
  const isBrowser = typeof window !== 'undefined';
  const hostname = isBrowser ? window.location.hostname : '';

  useEffect(() => {
    if (isBrowser && hostname === 'bitdash.app') {
      window.location.href = 'https://bsoraa.bitdash.app';
    }
  }, [hostname, isBrowser]);

  if (hostname === 'bitdash.app') return null;

  return isPWA ? <BsoraaPWALanding /> : <BsoraaLandingBrowser />;
};

export default BsoraaPage;