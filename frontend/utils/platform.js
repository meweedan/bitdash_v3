// utils/platformUtils.js
export const PLATFORMS = {
  FOOD: {
    subdomain: 'food',
    name: 'BitFood',
    role: 'food_operator',
    businessType: 'restaurant',
    displayName: 'Restaurant Platform',
    dashboardPath: '/food/operator/dashboard'
  },
  AUTO: {
    subdomain: 'auto',
    name: 'BitAuto',
    role: 'auto_dealer',
    businessType: 'dealer',
    displayName: 'Auto Dealer Platform',
    dashboardPath: '/auto/dealer/dashboard'
  },
  STOCK: {
    subdomain: 'stock',
    name: 'BitStock',
    role: 'stock_trader',
    businessType: 'trader',
    displayName: 'Inventory Management',
    dashboardPath: '/stock/dashboard'
  }
};

export const getPlatformFromHostname = (hostname) => {
  if (!hostname) return null;
  
  // Extract subdomain
  const subdomain = hostname.split('.')[0];
  
  // Find matching platform
  return Object.values(PLATFORMS).find(p => p.subdomain === subdomain) || null;
};

export const getPlatformFromQuery = (platform) => {
  if (!platform) return null;
  
  return Object.values(PLATFORMS).find(p => p.subdomain === platform) || null;
};

// pages/signup/operator.js - Updated useEffect
useEffect(() => {
  const detectPlatform = () => {
    if (typeof window !== 'undefined') {
      // Try subdomain first
      const hostname = window.location.hostname;
      const platformFromHostname = getPlatformFromHostname(hostname);
      
      if (platformFromHostname) {
        setCurrentPlatform(platformFromHostname);
        return;
      }

      // Try query parameter as fallback
      const platformFromQuery = getPlatformFromQuery(router.query.platform);
      if (platformFromQuery) {
        setCurrentPlatform(platformFromQuery);
        return;
      }

      // If no platform detected, redirect to choice page
      router.push('/signup/choice');
    }
  };

  detectPlatform();
}, [router.query.platform]);