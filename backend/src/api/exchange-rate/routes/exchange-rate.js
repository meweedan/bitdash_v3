module.exports = {
  routes: [
    {
      method: "GET",
      path: "/exchange-rates",
      handler: "exchange-rate.find",
      config: {
        auth: false, // Public access
      },
    },
    {
      method: "GET",
      path: "/exchange-rates/:id",
      handler: "exchange-rate.findOne",
      config: {
        auth: false, // Public access
      },
    },
    {
      method: "POST",
      path: "/exchange-rates",
      handler: "exchange-rate.create",
      config: {
        auth: { scope: ["admin"] }, // Admin-only
      },
    },
    {
      method: "PUT",
      path: "/exchange-rates/:id",
      handler: "exchange-rate.update",
      config: {
        auth: { scope: ["admin"] }, // Admin-only
      },
    },
    {
      method: "DELETE",
      path: "/exchange-rates/:id",
      handler: "exchange-rate.delete",
      config: {
        auth: { scope: ["admin"] }, // Admin-only
      },
    },
    {
      method: "GET",
      path: "/exchange-rates/historical",
      handler: "exchange-rate.historical",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/exchange-rates/latest",
      handler: "exchange-rate.latestRates",
      config: {
        auth: false, // Public access for real-time rates
      },
    }, 
    {
    method: 'GET',
      path: '/exchange-rates/fetch-historical',
      handler: 'exchange-rate.fetchHistoricalData',
      config: {
        auth: false
      }
    }
  ]
};