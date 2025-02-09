// frontend/pages/food/index.js
import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { FoodPWALanding } from '@/components/PWALanding';  // Fix: import from PWALanding component
import FoodLandingBrowser from '@/components/landing/FoodLandingBrowser';

const MenuPage = () => {
  const { isPWA } = usePWA();
  const isBrowser = typeof window !== 'undefined';
  const hostname = isBrowser ? window.location.hostname : '';

  useEffect(() => {
    if (isBrowser && hostname === 'bitdash.app') {
      window.location.href = 'https://food.bitdash.app';
    }
  }, [hostname, isBrowser]);

  if (hostname === 'bitdash.app') return null;
  
  return isPWA ? <FoodPWALanding /> : <FoodLandingBrowser />;
};

export default MenuPage;