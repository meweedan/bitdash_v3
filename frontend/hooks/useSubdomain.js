// hooks/useSubdomain.js
import { useState, useEffect } from 'react';

export default function useSubdomain() {
  const [platform, setPlatform] = useState('food'); // Default to food

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // For development
      if (window.location.hostname === 'localhost' || window.location.hostname.includes('vercel.app')) {
        const pathParts = window.location.pathname.split('/');
        const platformFromPath = pathParts.find(part => ['food', 'ride', 'shop', 'cash', 'work'].includes(part));
        setPlatform(platformFromPath || 'food');
        return;
      }

      // For production
      const subdomain = window.location.hostname.split('.')[0];
      if (['food', 'ride', 'shop', 'cash', 'work'].includes(subdomain)) {
        setPlatform(subdomain);
      } else {
        setPlatform('food');
      }
    }
  }, []);

  return { platform };
}