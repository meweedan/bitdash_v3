// api/menu/services/menu.js
'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::menu.menu', ({ strapi }) => ({
  // Define custom services here if needed

  async findByRestaurant(restaurantId) {
    return strapi.entityService.findMany('api::menu.menu', {
      filters: { restaurant: restaurantId },
      populate: ['menu_items'], // Populate menu items if required
    });
  },
}));
