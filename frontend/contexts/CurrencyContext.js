// contexts/CurrencyContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { REGIONS, CURRENCY_CONFIG, getRegionByCountry, getDefaultCurrencyForRegion } from '@/config/currencyConfig';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [currentRegion, setCurrentRegion] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const convertPrice = (priceUSD, targetCurrency = currentCurrency) => {
    if (!exchangeRates[targetCurrency]) return priceUSD;
    return (priceUSD * exchangeRates[targetCurrency]).toFixed(
      CURRENCY_CONFIG[targetCurrency]?.decimal_digits || 2
    );
  };

  const formatPrice = (amount, currency = currentCurrency) => {
    const config = CURRENCY_CONFIG[currency];
    if (!config) return `${amount}`;

    return `${config.symbol}${Number(amount).toFixed(config.decimal_digits)}`;
  };

  const value = {
    currentCurrency,
    currentRegion,
    exchangeRates,
    loading,
    convertPrice,
    formatPrice,
    CURRENCY_CONFIG
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};