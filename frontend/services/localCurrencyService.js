// frontend/services/localCurrencyService.js
import { api } from './api';

const CURRENCY_CONFIG = {
  USD: { symbol: '$', name: 'US Dollar', rate: 1 },
  EUR: { symbol: '€', name: 'Euro', rate: 0.85 },
  GBP: { symbol: '£', name: 'British Pound', rate: 0.73 },
  AED: { symbol: 'د.إ', name: 'UAE Dirham', rate: 3.67 },
  SAR: { symbol: 'ر.س', name: 'Saudi Riyal', rate: 3.75 },
  // Add more currencies as needed
};

export const localCurrencyService = {
  // Get user's location and set local currency
  async initializeLocalCurrency(customerId) {
    try {
      // Get user's location from browser
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      // Get country from coordinates using reverse geocoding
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=${process.env.NEXT_PUBLIC_GEOCODING_API_KEY}`
      );
      const data = await response.json();
      const country = data.results[0].components.country_code.toUpperCase();

      // Map country to currency code
      const currencyCode = await this.getCurrencyForCountry(country);

      // Update customer profile with local currency
      await api.put(`/customer-profiles/${customerId}`, {
        data: {
          local_currency: currencyCode,
          local_currency_rate: CURRENCY_CONFIG[currencyCode].rate
        }
      });

      return currencyCode;
    } catch (error) {
      console.error('Error setting local currency:', error);
      // Default to USD if location services fail
      return 'USD';
    }
  },

  // Get currency configuration for specific country
  async getCurrencyForCountry(countryCode) {
    // Map of country codes to currency codes
    const COUNTRY_CURRENCY_MAP = {
      US: 'USD',
      GB: 'GBP',
      EU: 'EUR',
      AE: 'AED',
      SA: 'SAR',
      // Add more mappings as needed
    };

    return COUNTRY_CURRENCY_MAP[countryCode] || 'USD';
  },

  // Convert amount to local currency
  convertToLocalCurrency(amount, localCurrency) {
    const config = CURRENCY_CONFIG[localCurrency];
    if (!config) return { amount, symbol: '$' }; // Default to USD

    const convertedAmount = amount * config.rate;
    return {
      amount: convertedAmount.toFixed(2),
      symbol: config.symbol
    };
  },

  // Convert local currency back to BITS
  convertToBits(amount, localCurrency) {
    const config = CURRENCY_CONFIG[localCurrency];
    if (!config) return amount; // Default to same amount if currency not found

    return amount / config.rate;
  },

  // Get currency configuration
  getCurrencyConfig(currencyCode) {
    return CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.USD;
  }
};

export default localCurrencyService;