// hooks/usePWA.js
import { useState, useEffect } from 'react';
import { checkIsPWA, getPlatformInfo } from '../utils/pwa';

export const usePWA = () => {
  const [isPWA, setIsPWA] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [platformInfo, setPlatformInfo] = useState(getPlatformInfo());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handlePWACheck = () => {
        setIsPWA(checkIsPWA());
        setPlatformInfo(getPlatformInfo());
      };

      // Check on initial load
      handlePWACheck();

      // Check when display mode changes
      const mediaQuery = window.matchMedia('(display-mode: standalone)');
      mediaQuery.addListener(handlePWACheck);

      // Handle install prompt
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsInstallable(true);
      };

      const handleAppInstalled = () => {
        setIsInstallable(false);
        setDeferredPrompt(null);
        handlePWACheck();
        // Track installation if needed
        console.log(`${platformInfo.name} installed successfully`);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        mediaQuery.removeListener(handlePWACheck);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, [platformInfo.name]);

  const installPWA = async () => {
    if (!deferredPrompt) return false;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      return outcome === 'accepted';
    } catch (error) {
      console.error(`${platformInfo.name} PWA installation failed:`, error);
      return false;
    }
  };

  return {
    isPWA,
    isInstallable,
    installPWA,
    platformInfo
  };
};