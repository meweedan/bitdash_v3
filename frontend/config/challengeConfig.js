// config/challengeConfig.js

// Currency symbols configuration
export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  GBP: '£',
  AUD: '$',
  CAD: '$',
  CHF: 'CHF',
  NZD: '$',
  RUB: '₽',
  KRW: '₩',
  EGP: 'EGP',
  AED: 'د.إ',
  LYD: 'ل.د',
  SAR: 'ر.س'
};

// Challenge tiers
export const CHALLENGE_PLANS = [
  {
    id: 'standard-challenge',
    name: 'Standard Challenge',
    description: 'Perfect for beginners starting their prop trading journey',
    price: 99,
    account_size: 10000,
    profit_target: 8,
    max_drawdown: 5,
    daily_drawdown: 2,
    duration_days: 30,
    features: [
      'Low barrier to entry',
      'Generous 30-day evaluation period',
      'Achievable 8% profit target',
      '80/20 profit split upon success',
      'Suitable for all trading styles'
    ],
    specs: [
      { label: 'Daily Drawdown', value: '2%' },
      { label: 'Maximum Drawdown', value: '5%' },
      { label: 'Minimum Trading Days', value: '10 days' },
      { label: 'Positions Over Weekend', value: 'Not Allowed' },
      { label: 'Trading During News', value: 'Restricted' },
      { label: 'Maximum Leverage', value: '1:30' }
    ],
    badge: 'blue',
    color: 'brand.crypto.400'
  },
  {
    id: 'professional-challenge',
    name: 'Professional Challenge',
    description: 'For experienced traders looking for a larger capital allocation',
    price: 199,
    account_size: 50000,
    profit_target: 10,
    max_drawdown: 8,
    daily_drawdown: 2,
    duration_days: 60,
    features: [
      'Substantial $50,000 capital allocation',
      'Extended 60-day evaluation window',
      'Higher 10% profit target with reasonable risk parameters',
      '80/20 profit split upon success',
      'Access to premium trader support'
    ],
    specs: [
      { label: 'Daily Drawdown', value: '2%' },
      { label: 'Maximum Drawdown', value: '8%' },
      { label: 'Minimum Trading Days', value: '15 days' },
      { label: 'Positions Over Weekend', value: 'Not Allowed' },
      { label: 'Trading During News', value: 'Restricted' },
      { label: 'Maximum Leverage', value: '1:30' }
    ],
    badge: 'purple',
    color: 'brand.crypto.500',
    popular: true
  },
  {
    id: 'elite-challenge',
    name: 'Elite Challenge',
    description: 'For professional traders with proven track records',
    price: 299,
    account_size: 100000,
    profit_target: 12,
    max_drawdown: 10,
    daily_drawdown: 2,
    duration_days: 60,
    features: [
      'Major $100,000 capital allocation',
      'Comprehensive 60-day evaluation period',
      'Balanced 12% profit target with flexible risk parameters',
      '80/20 profit split upon success',
      'Priority support and advanced analytics'
    ],
    specs: [
      { label: 'Daily Drawdown', value: '2%' },
      { label: 'Maximum Drawdown', value: '10%' },
      { label: 'Minimum Trading Days', value: '15 days' },
      { label: 'Positions Over Weekend', value: 'Not Allowed' },
      { label: 'Trading During News', value: 'Restricted' },
      { label: 'Maximum Leverage', value: '1:30' }
    ],
    badge: 'orange',
    color: 'brand.crypto.600'
  },
  {
    id: 'super-challenge',
    name: 'Super Challenge',
    description: 'Our highest tier for elite traders seeking maximum capital',
    price: 599,
    account_size: 200000,
    profit_target: 15,
    max_drawdown: 12,
    daily_drawdown: 3,
    duration_days: 90,
    features: [
      'Institutional-level $200,000 capital allocation',
      'Extended 90-day evaluation period',
      'Ambitious 15% profit target with professional risk parameters',
      '80/20 profit split upon success',
      'VIP support, custom analytics, and one-on-one mentoring'
    ],
    specs: [
      { label: 'Daily Drawdown', value: '3%' },
      { label: 'Maximum Drawdown', value: '12%' },
      { label: 'Minimum Trading Days', value: '20 days' },
      { label: 'Positions Over Weekend', value: 'Not Allowed' },
      { label: 'Trading During News', value: 'Restricted' },
      { label: 'Maximum Leverage', value: '1:30' }
    ],
    badge: 'red',
    color: 'brand.crypto.700'
  }
];

// Constants
export const MARKUP_PERCENTAGE = 7.5;

// Helper functions
export const roundUp = (num) => Math.ceil(num / 10) * 10;

export const calculateLocalPrice = (basePrice, exchangeRate) => {
  const withMarkup = basePrice * (1 + MARKUP_PERCENTAGE / 100);
  return roundUp(withMarkup * exchangeRate);
};

export const formatPrice = (price) => {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

export const formatPriceWithCurrency = (price, currency = 'USD') => {
  const symbol = CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS.USD;
  return `${symbol}${formatPrice(price)}`;
};

// Exchange Rate Service
export const ExchangeRateService = {
  rates: null,
  lastFetched: null,
  cacheTimeout: 1800000, // 30 minutes

  async getRates() {
    try {
      if (this.rates && this.lastFetched && (Date.now() - this.lastFetched < this.cacheTimeout)) {
        return this.rates;
      }

      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      
      if (!response.ok) throw new Error('Failed to fetch rates');
      
      const data = await response.json();
      
      // Apply markup and round up to nearest whole number
      const ratesWithMarkup = Object.keys(CURRENCY_SYMBOLS).reduce((acc, currency) => {
        const rawRate = currency === 'USD' ? 1 : data.rates[currency];
        // Apply markup and round up
        const rateWithMarkup = rawRate * (1 + MARKUP_PERCENTAGE / 100);
        acc[currency] = Math.ceil(rateWithMarkup);
        return acc;
      }, {});

      this.rates = ratesWithMarkup;
      this.lastFetched = Date.now();
      
      return ratesWithMarkup;
    } catch (error) {
      console.error('Exchange rate fetch error:', error);
      return null;
    }
  }
};

// Get challenge details by ID
export const getChallengeById = (challengeId) => {
  return CHALLENGE_PLANS.find(challenge => challenge.id === challengeId);
};

// Get current currency from localStorage or default
export const getCurrentCurrency = () => {
  if (typeof window === 'undefined') return 'USD';
  return localStorage.getItem('userCurrency') || 'USD';
};

// Get price with currency formatting for any amount
export const getPriceWithCurrency = async (amount, targetCurrency = 'USD') => {
  const rates = await ExchangeRateService.getRates();
  if (!rates) return formatPriceWithCurrency(amount, 'USD');

  const rate = rates[targetCurrency] || 1;
  const convertedAmount = calculateLocalPrice(amount, rate);
  return formatPriceWithCurrency(convertedAmount, targetCurrency);
};

// Get challenge price with currency formatting
export const getChallengePrice = async (challengeId, targetCurrency = 'USD') => {
  const challenge = getChallengeById(challengeId);
  if (!challenge) return null;
  
  return getPriceWithCurrency(challenge.price, targetCurrency);
};