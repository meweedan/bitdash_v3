"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

const PROFIT_MARGINS = {
  LYD: { buy: 0.04, sell: 0.04, market_multiplier: 1.5 },
  EGP: { buy: 0.05, sell: 0.025, market_multiplier: 1.4 },
  CRYPTO: { buy: 0.02, sell: 0.015, market_multiplier: 1.2 },
  METALS: { buy: 0.02, sell: 0.015, market_multiplier: 1.2 }
};

module.exports = createCoreController("api::exchange-rate.exchange-rate", ({ strapi }) => ({
  // Existing methods remain the same
  async find(ctx) {
    const { query } = ctx;
    const rates = await strapi.entityService.findMany("api::exchange-rate.exchange-rate", query);
    return this.transformResponse(rates);
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const rate = await strapi.entityService.findOne("api::exchange-rate.exchange-rate", id, ctx.query);
    return this.transformResponse(rate);
  },

  async create(ctx) {
    if (!ctx.state.user || ctx.state.user.role.type !== "admin") {
      return ctx.unauthorized("Only admins can add exchange rates.");
    }

    const { data } = ctx.request.body;
    const rate = await strapi.entityService.create("api::exchange-rate.exchange-rate", { data });
    return this.transformResponse(rate);
  },

  async update(ctx) {
    if (!ctx.state.user || ctx.state.user.role.type !== "admin") {
      return ctx.unauthorized("Only admins can update exchange rates.");
    }

    const { id } = ctx.params;
    const { data } = ctx.request.body;
    const rate = await strapi.entityService.update("api::exchange-rate.exchange-rate", id, { data });
    return this.transformResponse(rate);
  },

  async delete(ctx) {
    if (!ctx.state.user || ctx.state.user.role.type !== "admin") {
      return ctx.unauthorized("Only admins can delete exchange rates.");
    }

    const { id } = ctx.params;
    const deletedRate = await strapi.entityService.delete("api::exchange-rate.exchange-rate", id);
    return this.transformResponse(deletedRate);
  },

  async latestRates(ctx) {
    try {
      const { base } = ctx.query;

      const rates = await strapi.entityService.findMany("api::exchange-rate.exchange-rate", {
        filters: {
          $or: [
            { from_currency: base },
            { to_currency: base }
          ]
        },
        sort: { timestamp: "desc" },
        limit: 10
      });

      return this.transformResponse(rates);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async fetchHistoricalData(ctx) {
    try {
      const { base, quote, days = 30 } = ctx.query;

      // Validate input
      if (!base || !quote) {
        return ctx.badRequest('Base and quote currencies are required');
      }

      // Fetch historical data from multiple sources
      let historicalRates = [];

      // Cryptocurrency rates
      if (['BTC', 'ETH', 'USDT'].includes(base) || ['BTC', 'ETH', 'USDT'].includes(quote)) {
        historicalRates = await fetchCryptoHistoricalData(base, quote);
      } 
      // Metals rates
      else if (['XAU', 'XAG'].includes(base) || ['XAU', 'XAG'].includes(quote)) {
        historicalRates = await fetchMetalHistoricalData(base, quote);
      } 
      // Forex rates
      else {
        historicalRates = await fetchForexHistoricalData(base, quote);
      }

      // Apply profit margins
      const processedRates = historicalRates.map(rate => {
        const margin = PROFIT_MARGINS[base] || PROFIT_MARGINS.CRYPTO;
        const marketRate = rate.rate * margin.market_multiplier;

        return {
          from_currency: base,
          to_currency: quote,
          rate: marketRate,
          open_rate: rate.open * margin.market_multiplier,
          high_rate: rate.high * margin.market_multiplier,
          low_rate: rate.low * margin.market_multiplier,
          buy_price: marketRate * (1 + margin.buy),
          sell_price: marketRate * (1 - margin.sell),
          timestamp: rate.timestamp,
          source: rate.source,
          volume: rate.volume || 0
        };
      });

      // Bulk create or update rates
      await Promise.all(processedRates.map(async (rate) => {
        await strapi.entityService.create('api::exchange-rate.exchange-rate', { data: rate });
      }));

      return this.transformResponse(processedRates);
    } catch (error) {
      console.error('Error fetching historical rates:', error);
      ctx.throw(500, `Error fetching historical rates: ${error.message}`);
    }
  },

  async historical(ctx) {
    try {
      const { base, quote, days = 30 } = ctx.query;

      // Validate input
      if (!base || !quote) {
        return ctx.badRequest('Base and quote currencies are required');
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));

      const rates = await strapi.entityService.findMany("api::exchange-rate.exchange-rate", {
        filters: {
          $or: [
            {
              from_currency: base,
              to_currency: quote,
              timestamp: {
                $between: [startDate, endDate]
              }
            },
            {
              from_currency: quote,
              to_currency: base,
              timestamp: {
                $between: [startDate, endDate]
              }
            }
          ]
        },
        sort: { timestamp: 'asc' },
        limit: 500
      });

      // Log if no rates found
      if (rates.length === 0) {
        console.warn(`No rates found for ${base}-${quote} between ${startDate} and ${endDate}`);
        return this.transformResponse([], { 
          pagination: { page: 1, pageSize: 0, total: 0 } 
        });
      }

      const processedRates = rates.map((rate) => ({
        timestamp: rate.timestamp,
        date: new Date(rate.timestamp).toISOString(),
        open: rate.open_rate || rate.rate,
        high: rate.high_rate || rate.rate,
        low: rate.low_rate || rate.rate,
        close: rate.rate,
        volume: rate.volume || 0,
      }));

      return this.transformResponse(processedRates);
    } catch (error) {
      console.error('Historical rates error:', error);
      ctx.throw(500, `Error fetching historical rates: ${error.message}`);
    }
  }
}));

// Helper functions for fetching historical data
async function fetchCryptoHistoricalData(base, quote) {
  const apiKey = process.env.ALPHA_VANTAGE_KEY;
  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${base}&to_currency=${quote}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch crypto data');
    }

    const data = await response.json();
    const exchangeRate = data['Realtime Currency Exchange Rate'];

    return [{
      rate: parseFloat(exchangeRate['5. Exchange Rate']),
      open: parseFloat(exchangeRate['5. Exchange Rate']),
      high: parseFloat(exchangeRate['5. Exchange Rate']) * 1.01,
      low: parseFloat(exchangeRate['5. Exchange Rate']) * 0.99,
      timestamp: new Date(),
      source: 'Alpha Vantage',
      volume: 0
    }];
  } catch (error) {
    console.error('Crypto data fetch error:', error);
    return [];
  }
}

async function fetchMetalHistoricalData(base, quote) {
  const apiKey = process.env.ALPHA_VANTAGE_KEY;
  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${base}&to_currency=${quote}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch metal data');
    }

    const data = await response.json();
    const exchangeRate = data['Realtime Currency Exchange Rate'];

    return [{
      rate: parseFloat(exchangeRate['5. Exchange Rate']),
      open: parseFloat(exchangeRate['5. Exchange Rate']),
      high: parseFloat(exchangeRate['5. Exchange Rate']) * 1.01,
      low: parseFloat(exchangeRate['5. Exchange Rate']) * 0.99,
      timestamp: new Date(),
      source: 'Alpha Vantage',
      volume: 0
    }];
  } catch (error) {
    console.error('Metal data fetch error:', error);
    return [];
  }
}

async function fetchForexHistoricalData(base, quote) {
  const apiKey = process.env.ALPHA_VANTAGE_KEY;
  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${base}&to_currency=${quote}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch forex data');
    }

    const data = await response.json();
    const exchangeRate = data['Realtime Currency Exchange Rate'];

    return [{
      rate: parseFloat(exchangeRate['5. Exchange Rate']),
      open: parseFloat(exchangeRate['5. Exchange Rate']),
      high: parseFloat(exchangeRate['5. Exchange Rate']) * 1.01,
      low: parseFloat(exchangeRate['5. Exchange Rate']) * 0.99,
      timestamp: new Date(),
      source: 'Alpha Vantage',
      volume: 0
    }];
  } catch (error) {
    console.error('Forex data fetch error:', error);
    return [];
  }
}