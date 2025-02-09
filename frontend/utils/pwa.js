// utils/pwa.js
export const checkIsPWA = () => {
  if (typeof window !== 'undefined') {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone || // iOS
      document.referrer.includes('android-app://')
    );
  }
  return false;
};

export const getPlatformInfo = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('auto')) {
      return {
        name: 'BitAuto',
        platform: 'auto',
        description: 'Automotive dealership management system'
      };
    }
    if (hostname.includes('food')) {
      return {
        name: 'BitFood',
        platform: 'food',
        description: 'Digital menu and ordering system'
      };
    }
    if (hostname.includes('cash')) {
      return {
        name: 'BitCash',
        platform: 'cash',
        description: 'Digital payments and remittance system'
      };
    }
    if (hostname.includes('eats')) {
      return {
        name: 'BitEats',
        platform: 'eats',
        description: 'Food and groceries ordering system'
      };
    }
    if (hostname.includes('stock')) {
      return {
        name: 'BitStock',
        platform: 'stock',
        description: 'Stock management and inventory control'
      };
    }
  }
  return {
    name: 'BitDash',
    platform: 'main',
    description: 'Smart solutions, tailored for startups.'
  };
};