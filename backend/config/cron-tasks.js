module.exports = {
  /**
   * Health check cron job that runs every 5 minutes
   */
  healthChecks: {
    task: ({ strapi }) => {
      strapi.service('api::status.status').checkAllServices();
    },
    options: {
      rule: '*/5 * * * *', // Every 5 minutes
    },
  },
  
  /**
   * Update uptime statistics daily
   */
  uptimeStats: {
    task: ({ strapi }) => {
      strapi.service('api::status.status').updateUptimeStats();
    },
    options: {
      rule: '0 0 * * *', // Once a day at midnight
    },
  },
};