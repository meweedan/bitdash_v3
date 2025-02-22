// config/cron-tasks.js
module.exports = {
  '0 */4 * * *': async () => {  // Runs every 4 hours
    await strapi
      .service('api::exchange-rate.exchange-rate-sync')
      .fetchHistoricalRates();
  }
};