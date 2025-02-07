// frontend/pages/menu/index.js
import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { MenuPWALanding } from '@/components/PWALanding';  // Fix: import from PWALanding component
import MenuLandingBrowser from '@/components/landing/MenuLandingBrowser';

const MenuPage = () => {
  const { isPWA } = usePWA();
  const isBrowser = typeof window !== 'undefined';
  const hostname = isBrowser ? window.location.hostname : '';

  useEffect(() => {
    if (isBrowser && hostname === 'bitdash.app') {
      window.location.href = 'https://menu.bitdash.app';
    }
  }, [hostname, isBrowser]);

  if (hostname === 'bitdash.app') return null;
  
  return isPWA ? <MenuPWALanding /> : <MenuLandingBrowser />;
};

export default MenuPage;