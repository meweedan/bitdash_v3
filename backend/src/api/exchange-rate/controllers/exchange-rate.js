"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::exchange-rate.exchange-rate", ({ strapi }) => ({
  // ✅ Fetch all exchange rates (public access)
  async find(ctx) {
    const { query } = ctx;
    const rates = await strapi.service("api::exchange-rate.exchange-rate").find(query);
    return this.transformResponse(rates);
  },

  // ✅ Fetch a single exchange rate by ID (public access)
  async findOne(ctx) {
    const { id } = ctx.params;
    const rate = await strapi.service("api::exchange-rate.exchange-rate").findOne(id, ctx.query);
    return this.transformResponse(rate);
  },

  // 🔐 Create a new exchange rate (admin only)
  async create(ctx) {
    if (!ctx.state.user || ctx.state.user.role.type !== "admin") {
      return ctx.unauthorized("Only admins can add exchange rates.");
    }

    const { data } = ctx.request.body;
    const rate = await strapi.service("api::exchange-rate.exchange-rate").create({ data });
    return this.transformResponse(rate);
  },

  // 🔐 Update an existing exchange rate (admin only)
  async update(ctx) {
    if (!ctx.state.user || ctx.state.user.role.type !== "admin") {
      return ctx.unauthorized("Only admins can update exchange rates.");
    }

    const { id } = ctx.params;
    const { data } = ctx.request.body;
    const rate = await strapi.service("api::exchange-rate.exchange-rate").update(id, { data });
    return this.transformResponse(rate);
  },

  // 🔐 Delete an exchange rate (admin only)
  async delete(ctx) {
    if (!ctx.state.user || ctx.state.user.role.type !== "admin") {
      return ctx.unauthorized("Only admins can delete exchange rates.");
    }

    const { id } = ctx.params;
    const deletedRate = await strapi.service("api::exchange-rate.exchange-rate").delete(id);
    return this.transformResponse(deletedRate);
  },

   async historical(ctx) {
  try {
    const { base, quote, days = 30 } = ctx.query;

    // Calculate the date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Fetch historical rates with more comprehensive filtering
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
      limit: 500  // Prevent overwhelming data
    });

    // If no direct rates found, try inverse rates
    if (rates.length === 0) {
      console.warn(`No direct rates found for ${base}-${quote}`);
      return this.transformResponse([], { 
        pagination: { page: 1, pageSize: 0, total: 0 } 
      });
    }

    // Calculate moving averages (simple implementation)
    const processedRates = rates.map((rate, index, array) => {
      const ma20 = index >= 19 
        ? array.slice(index - 19, index + 1).reduce((sum, r) => sum + r.rate, 0) / 20
        : null;
      
      const ma50 = index >= 49
        ? array.slice(index - 49, index + 1).reduce((sum, r) => sum + r.rate, 0) / 50
        : null;

      return {
        timestamp: rate.timestamp,
        date: new Date(rate.timestamp).toISOString(),
        open: rate.open_rate || rate.rate,
        high: rate.high_rate || rate.rate,
        low: rate.low_rate || rate.rate,
        close: rate.rate,
        volume: rate.volume || 0,
        ma20,
        ma50
      };
    });

    return this.transformResponse(processedRates);
  } catch (error) {
    console.error('Historical rates error:', error);
    ctx.throw(500, 'Error fetching historical rates');
  }
},

  // ✅ Public API for latest exchange rates (no auth required)
  async latestRates(ctx) {
    try {
      const rates = await strapi.entityService.findMany("api::exchange-rate.exchange-rate", {
        sort: { timestamp: "desc" },
        pagination: { pageSize: 10 },
      });

      return this.transformResponse(rates);
    } catch (error) {
      ctx.throw(500, error);
    }
  },
}));
