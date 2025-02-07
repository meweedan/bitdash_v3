module.exports = {
  async testEndpoints(ctx) {
    try {
      // 1. Get restaurant
      const restaurant = await strapi.entityService.findMany('api::restaurant.restaurant', {
        populate: ['menus', 'tables']
      });

      // 2. Get menu items
      const menuItems = await strapi.entityService.findMany('api::menu-item.menu-item', {
        populate: ['menu']
      });

      // 3. Create a test order
      const order = await strapi.entityService.create('api::order.order', {
        data: {
          items: [
            {
              menuItemId: menuItems[0].id,
              quantity: 1
            }
          ],
          total: menuItems[0].price,
          status: 'pending',
          table: restaurant[0].tables[0].id
        }
      });

      return {
        success: true,
        data: {
          restaurant: restaurant[0],
          menuItems,
          order
        }
      };
    } catch (error) {
      return ctx.throw(500, error.message);
    }
  }
};
