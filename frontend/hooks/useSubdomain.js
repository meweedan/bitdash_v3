// hooks/useSubdomain.js
import { useState, useEffect } from 'react';

export default function useSubdomain() {
  const [platform, setPlatform] = useState('utlubha'); // Default to Utlubha

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // For development
      if (window.location.hostname === 'localhost' || window.location.hostname.includes('vercel.app')) {
        const pathParts = window.location.pathname.split('/');
        const platformFromPath = pathParts.find(part => ['Adfaly', 'utlubha'].includes(part));
        setPlatform(platformFromPath || 'trade');
        return;
      }

      // For production
      const subdomain = window.location.hostname.split('.')[0];
      if (['Adfaly', 'utlubha'].includes(subdomain)) {
        setPlatform(subdomain);
      } else {
        setPlatform('utlubha');
      }
    }
  }, []);

  return { platform };
}