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

      // Fetch historical rates
      const rates = await strapi.entityService.findMany("api::exchange-rate.exchange-rate", {
        filters: {
          from_currency: base,
          to_currency: quote,
          timestamp: {
            $between: [startDate, endDate]
          }
        },
        sort: { timestamp: 'asc' },
        populate: {
          high_rate: true,
          low_rate: true,
          open_rate: true
        }
      });

      // Process rates for candlestick format
      const processedRates = rates.map(rate => ({
        timestamp: rate.timestamp,
        date: new Date(rate.timestamp).toISOString(),
        open: rate.open_rate || rate.rate,
        high: rate.high_rate || rate.rate,
        low: rate.low_rate || rate.rate,
        close: rate.rate,
        volume: rate.volume || 0
      }));

      return this.transformResponse(processedRates);
    } catch (error) {
      ctx.throw(500, error);
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
