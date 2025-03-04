// hooks/useSubdomain.js
import { useState, useEffect } from 'react';

export default function useSubdomain() {
  const [platform, setPlatform] = useState('trade'); // Default to trade

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // For development
      if (window.location.hostname === 'localhost' || window.location.hostname.includes('vercel.app')) {
        const pathParts = window.location.pathname.split('/');
        const platformFromPath = pathParts.find(part => ['fund', 'trade', 'stock', 'cash'].includes(part));
        setPlatform(platformFromPath || 'trade');
        return;
      }

      // For production
      const subdomain = window.location.hostname.split('.')[0];
      if (['fund', 'trade', 'stock', 'cash'].includes(subdomain)) {
        setPlatform(subdomain);
      } else {
        setPlatform('trade');
      }
    }
  }, []);

  return { platform };
}