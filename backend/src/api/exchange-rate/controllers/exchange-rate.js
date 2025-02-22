"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::exchange-rate.exchange-rate", ({ strapi }) => ({
  // ✅ Fetch all exchange rates (public access)
  async find(ctx) {
    const { query } = ctx;
    const rates = await strapi.entityService.findMany("api::exchange-rate.exchange-rate", query);
    return this.transformResponse(rates);
  },

  // ✅ Fetch a single exchange rate by ID (public access)
  async findOne(ctx) {
    const { id } = ctx.params;
    const rate = await strapi.entityService.findOne("api::exchange-rate.exchange-rate", id, ctx.query);
    return this.transformResponse(rate);
  },

  // Update other methods similarly
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
},
}));
