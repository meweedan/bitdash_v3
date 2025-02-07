// config/subscriptionConfig.js

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

// Core subscription plans (prices in USD)
export const SUBSCRIPTION_PLANS = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Perfect for small restaurants',
    monthlyPrice: 80,
    yearlyPrice: 880, // 11 months for yearly
    commission_rate: 2.5,
    features: [
      'Up to 5 tables',
      'Basic menu management',
      'QR stands & stickers (paid)',
      'Standard support',
      'Basic analytics',
      'Digital ordering system',
      'Customer feedback collection',
      'Basic table management'
    ],
    color: 'white'
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For growing businesses',
    monthlyPrice: 110,
    yearlyPrice: 1210, // 11 months for yearly
    commission_rate: 1.5,
    features: [
      'Unlimited tables',
      'Advanced menu management',
      'Premium QR stands & stickers included',
      '24/7 Priority support',
      'Advanced analytics tools',
      'Digital ordering system',
      'Early access to new features',
      'Pilot Operator status',
      'Future services preview access',
      'Custom integration options',
      'Priority feature requests',
      'Dedicated account manager'
    ],
    color: 'blue',
    popular: true
  }
];

// ROI comparison pricing
export const PRICING = {
  traditional: {
    monthly: 24000,
    breakdown: {
      waitersSalary: 12000,
      trainingCosts: 2500,
      turnoverExpenses: 5000,
      managementTime: 4500
    }
  },
  poorService: {
    monthly: 15000,
    breakdown: {
      lostCustomers: 6000,
      badReviews: 5000,
      orderMistakes: 2500,
      tableTurnover: 1500
    }
  }
};

// Constants
export const MARKUP_PERCENTAGE = 7.5;
export const YEARLY_DISCOUNT = 15; // 15%

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

// Get plan details
export const getPlanById = (planId) => {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
};

// Get yearly price with discount
export const getYearlyPrice = (monthlyPrice) => {
  return monthlyPrice * 12 * (1 - YEARLY_DISCOUNT / 100);
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

// Get subscription price with currency
export const getSubscriptionPrice = async (planId, targetCurrency = 'USD') => {
  const plan = getPlanById(planId);
  if (!plan) return null;
  
  return getPriceWithCurrency(plan.monthlyPrice, targetCurrency);
};