
const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::career.career', {
  config: {
    find: {
      policies: ['public-career'],
      auth: false
    },
    findOne: {
      policies: ['public-career'],
      auth: false
    }
  }
});