export const PLATFORMS = {
  food: {
    name: 'BitFood',
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
  stocks: {
    name: 'BitStocks',
    role: 6,  // ID for Trader role
    endpoint: '/api/traders',
    entityName: 'trader',
    steps: ['Account', 'Profile', 'Company Details']
  },
  shop: {
    name: 'BitShop',
    role: 10,  // ID for Shopkeeper role
    endpoint: '/api/shops',
    entityName: 'shop',
    steps: ['Account', 'Profile', 'Shop Details']
    },
  work: {
    name: 'BitWork',
    role: 11, // ID for Employers
    endpoint: '/api/employer',
    entityName: 'employer',
    steps: ['Account', 'Profile', 'Company Name']
  },
  ride: {
    name: 'BitRide',
    role: 9,  // ID for Driver role
    endpoint: '/api/captains',
    entityName: 'driver',
    steps: ['Account', 'Profile', 'Vehicle Details']    
  }
};