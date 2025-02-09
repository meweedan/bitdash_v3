// frontend/pages/work/index.js
import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { BitLandingBrowser } from '@/components/PWALanding';  // Fix: import from PWALanding component
import WorkLandingBrowser from '@/components/landing/WorkLandingBrowser';

const WorkPage = () => {
  const { isPWA } = usePWA();
  const isBrowser = typeof window !== 'undefined';
  const hostname = isBrowser ? window.location.hostname : '';

  useEffect(() => {
    if (isBrowser && hostname === 'bitdash.app') {
      window.location.href = 'https://work.bitdash.app';
    }
  }, [hostname, isBrowser]);

  if (hostname === 'bitdash.app') return null;

  return isPWA ? <WorkPWALanding /> : <WorkLandingBrowser />;
};

export default WorkPage;