// frontend/pages/ride/index.js
import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { BitLandingBrowser } from '@/components/PWALanding';
import RideLandingBrowser from '@/components/landing/RideLandingBrowser';

const RidePage = () => {
  const { isPWA } = usePWA();
  const isBrowser = typeof window !== 'undefined';
  const hostname = isBrowser ? window.location.hostname : '';

  useEffect(() => {
    if (isBrowser && hostname === 'bitdash.app') {
      window.location.href = 'https://ride.bitdash.app';
    }
  }, [hostname, isBrowser]);

  if (hostname === 'bitdash.app') return null;

  return isPWA ? <RidePWALanding /> : <RideLandingBrowser />;
};

export default RidePage;