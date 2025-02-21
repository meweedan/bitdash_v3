module.exports = {
  '0 */1 * * *': async () => {  // Runs every 1 hour
    await strapi
      .service('api::exchange-rate.custom-exchange-rate')
      .fetchHistoricalCryptoAndMetalRates();
  }
};