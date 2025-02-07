export const PLATFORMS = {
  menu: {
    name: 'BitMenu',
    role: 3,  // ID for Operator role
    endpoint: '/api/restaurants',
    entityName: 'restaurant',
    steps: ['Account', 'Profile', 'Subscription', 'Restaurant Details']
  },
  auto: {
    name: 'BitAuto',
    role: 5,  // ID for Dealer role
    endpoint: '/api/auto-dealers',
    entityName: 'auto_dealer',
    steps: ['Account', 'Profile', 'Dealership Details']
  },
  stock: {
    name: 'BitStock',
    role: 6,  // ID for Trader role
    endpoint: '/api/traders',
    entityName: 'trader',
    steps: ['Account', 'Profile', 'Company Details']
  }
};