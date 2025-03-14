'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::menu.menu', ({ strapi }) => ({
  // Utility function to fetch user's restaurant
  async getUserRestaurant(user) {
    const userData = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id: user.id },
      populate: { operator: { populate: { restaurant: true } } }
    });

    if (!userData?.operator?.restaurant?.id) {
      throw new Error('User does not have an associated restaurant');
    }

    return userData.operator.restaurant.id;
  },

  // Create a new menu
  async create(ctx) {
    const { user } = ctx.state;
    if (!user) return ctx.unauthorized('No authorization provided');

    try {
      const restaurantId = await this.getUserRestaurant(user);

      // Get the data from the request
      const { data } = ctx.request.body;

      // Create menu with Strapi's entity service
      const entity = await strapi.entityService.create('api::menu.menu', {
        data: {
          ...data,
          restaurant: restaurantId,
          publishedAt: new Date().toISOString()
        },
        populate: ['restaurant', 'menu_items']
      });

      // Update restaurant with menu reference
      await strapi.entityService.update('api::restaurant.restaurant', restaurantId, {
        data: {
          menu: entity.id
        }
      });

      return { data: entity };
    } catch (error) {
      console.error('Menu creation error:', error);
      return ctx.badRequest('An error occurred while creating the menu.', { error });
    }
  },

  // Find menus for the current user's restaurant
  async find(ctx) {
    const { user } = ctx.state;
    if (!user) return ctx.unauthorized('No authorization provided');

    try {
      const restaurantId = await this.getUserRestaurant(user);

      const entities = await strapi.entityService.findMany('api::menu.menu', {
        filters: {
          restaurant: restaurantId
        },
        populate: ['menu_items', 'restaurant']
      });

      return { data: entities };
    } catch (error) {
      console.error('Error fetching menus:', error);
      return ctx.badRequest('An error occurred while fetching menus.', { error });
    }
  },

  // Find a single menu, ensuring it belongs to the user's restaurant
  async findOne(ctx) {
    const { user } = ctx.state;
    const { id } = ctx.params;
    if (!user) return ctx.unauthorized('No authorization provided');

    try {
      const restaurantId = await this.getUserRestaurant(user);
      const entity = await strapi.entityService.findOne('api::menu.menu', id, {
        populate: ['menu_items', 'restaurant']
      });

      if (!entity || entity.restaurant.id !== restaurantId) {
        return ctx.notFound('Menu not found');
      }

      return { data: entity };
    } catch (error) {
      console.error('Error fetching menu:', error);
      return ctx.badRequest('An error occurred while fetching the menu.', { error });
    }
  },

  // Update a menu
  async update(ctx) {
  const { user } = ctx.state;
  const { id } = ctx.params;
  
  if (!user) return ctx.unauthorized('No authorization provided');

  try {
    // Verify user's restaurant ownership
    const userData = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id: user.id },
      populate: { operator: { populate: { restaurant: true } } }
    });

    if (!userData?.operator?.restaurant?.id) {
      return ctx.forbidden('User does not have a restaurant');
    }

    const restaurantId = userData.operator.restaurant.id;

    // Find the existing menu
    const existingMenu = await strapi.entityService.findOne('api::menu.menu', id, {
      populate: { restaurant: true }
    });

    // Ensure the menu belongs to the user's restaurant
    if (!existingMenu || existingMenu.restaurant.id !== restaurantId) {
      return ctx.notFound('Menu not found');
    }

    // Prepare update data
    const { data } = ctx.request.body;
    const sanitizedData = {
      name: data.name || existingMenu.name,
      description: data.description || existingMenu.description,
      restaurant: restaurantId
    };

    // Update menu
    const updatedMenu = await strapi.entityService.update('api::menu.menu', id, {
      data: sanitizedData,
      populate: { restaurant: true }
    });

    return { data: updatedMenu };
  } catch (error) {
    console.error('Menu update error:', error);
    return ctx.badRequest('Failed to update menu', { error: error.message });
  }
},

  // Delete a menu
  async delete(ctx) {
    const { user } = ctx.state;
    const { id } = ctx.params;
    if (!user) return ctx.unauthorized('No authorization provided');

    try {
      const restaurantId = await this.getUserRestaurant(user);
      const existingMenu = await strapi.entityService.findOne('api::menu.menu', id, {
        populate: ['restaurant']
      });

      if (!existingMenu || existingMenu.restaurant.id !== restaurantId) {
        return ctx.notFound('Menu not found');
      }

      const deletedMenu = await strapi.entityService.delete('api::menu.menu', id);

      // Update restaurant to remove menu reference
      await strapi.entityService.update('api::restaurant.restaurant', restaurantId, {
        data: {
          menu: null
        }
      });

      return { data: deletedMenu };
    } catch (error) {
      console.error('Error deleting menu:', error);
      return ctx.badRequest('An error occurred while deleting the menu.', { error });
    }
  },
}));