// config/currencyConfig.js
export const REGIONS = {
  NORTH_AMERICA: {
    countries: ['US', 'CA'],
    currencies: ['USD', 'CAD'],
    defaultCurrency: 'USD'
  },
  EUROPE: {
    countries: ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'IE'],
    currencies: ['EUR', 'GBP'],
    defaultCurrency: 'EUR'
  },
  MIDDLE_EAST: {
    countries: ['AE', 'SA', 'QA', 'BH', 'KW', 'OM'],
    currencies: ['AED', 'SAR'],
    defaultCurrency: 'AED'
  },
  AFRICA: {
    countries: ['EG', 'MA', 'ZA', 'NG'],
    currencies: ['EGP', 'MAD', 'ZAR', 'NGN'],
    defaultCurrency: 'EGP'
  },
  ASIA_PACIFIC: {
    countries: ['JP', 'KR', 'SG', 'AU', 'NZ'],
    currencies: ['JPY', 'KRW', 'SGD', 'AUD', 'NZD'],
    defaultCurrency: 'SGD'
  }
};

export const CURRENCY_CONFIG = {
  USD: {
    symbol: '$',
    name: 'US Dollar',
    decimal_digits: 2,
    stripe_currency: 'usd'
  },
  EUR: {
    symbol: '€',
    name: 'Euro',
    decimal_digits: 2,
    stripe_currency: 'eur'
  },
  GBP: {
    symbol: '£',
    name: 'British Pound',
    decimal_digits: 2,
    stripe_currency: 'gbp'
  },
  AED: {
    symbol: 'د.إ',
    name: 'UAE Dirham',
    decimal_digits: 2,
    stripe_currency: 'aed'
  },
  SAR: {
    symbol: '﷼',
    name: 'Saudi Riyal',
    decimal_digits: 2,
    stripe_currency: 'sar'
  },
  // Add other currencies as needed
};

// Helper functions
export const getRegionByCountry = (countryCode) => {
  return Object.entries(REGIONS).find(([_, region]) => 
    region.countries.includes(countryCode)
  )?.[0];
};

export const getDefaultCurrencyForRegion = (region) => {
  return REGIONS[region]?.defaultCurrency;
};

export const isValidCurrencyForRegion = (currency, region) => {
  return REGIONS[region]?.currencies.includes(currency);
};