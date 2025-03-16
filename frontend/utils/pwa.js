// utils/pwa.js
export const checkIsPWA = () => {
  if (typeof window !== 'undefined') {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone || // iOS detection
      document.referrer.includes('android-app://')
    );
  }
  return false;
};

export const getPlatformInfo = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname.toLowerCase();

    if (hostname.includes('food')) {
      return {
        name: 'BitFood',
        platform: 'food',
        description: 'Digital menus and ordering solution'
      };
    }
    if (hostname.includes('cash')) {
      return {
        name: 'tazdani',
        platform: 'cash',
        description: 'Digital payments and remittance system'
      };
    }
    if (hostname.includes('shop')) {
      return {
        name: 'BitShop',
        platform: 'shop',
        description: 'E-commerce and online store platform'
      };
    }
  }

  // Default fallback: main domain
  return {
    name: 'BitDash',
    platform: 'main',
    description: 'Smart solutions, tailored for startups.'
  };
};