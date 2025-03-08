// frontend/pages/crypto/index.js
import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { CryptoPWALanding } from '@/components/PWALanding';  // Fix: import from PWALanding component
import CryptoLandingBrowser from '@/components/landing/CryptoLandingBrowser';

const CryptoPage = () => {
  const { isPWA } = usePWA();
  const isBrowser = typeof window !== 'undefined';
  const hostname = isBrowser ? window.location.hostname : '';

  useEffect(() => {
    if (isBrowser && hostname === 'bitdash.app') {
      window.location.href = 'https://crypto.bitdash.app';
    }
  }, [hostname, isBrowser]);

  if (hostname === 'bitdash.app') return null;

  return isPWA ? <CryptoPWALanding /> : <CryptoLandingBrowser />;
};

export default CryptoPage;