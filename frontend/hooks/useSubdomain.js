// hooks/useSubdomain.js
import { useState, useEffect } from 'react';

export default function useSubdomain() {
  const [platform, setPlatform] = useState('menu'); // Default to menu

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // For development
      if (window.location.hostname === 'localhost' || window.location.hostname.includes('vercel.app')) {
        const pathParts = window.location.pathname.split('/');
        const platformFromPath = pathParts.find(part => ['menu', 'auto', 'stock', 'cash', 'eats'].includes(part));
        setPlatform(platformFromPath || 'menu');
        return;
      }

      // For production
      const subdomain = window.location.hostname.split('.')[0];
      if (['menu', 'auto', 'stock', 'cash', 'eats'].includes(subdomain)) {
        setPlatform(subdomain);
      } else {
        setPlatform('menu');
      }
    }
  }, []);

  return { platform };
}