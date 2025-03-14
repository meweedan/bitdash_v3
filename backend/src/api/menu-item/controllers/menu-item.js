'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::menu-item.menu-item', ({ strapi }) => ({
  async create(ctx) {
    try {
      // Get the data from the request
      const { data } = ctx.request.body;

      // Validate required fields
      if (!data.name || !data.description || !data.price === undefined || !data.menus) {
        return ctx.badRequest('Missing required fields');
      }

      // Create the menu item
      const entity = await strapi.entityService.create('api::menu-item.menu-item', {
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          menus: data.menus,
          publishedAt: data.publishedAt || new Date().toISOString(),
          ...(data.image && { image: data.image })
        },
        populate: ['image', 'menus']
      });

      // Return the created entity
      return { data: entity };
    } catch (error) {
      console.error('Menu item creation error:', error);
      return ctx.badRequest(error.message);
    }
  },

  async find(ctx) {
    try {
      const { results, pagination } = await strapi.service('api::menu-item.menu-item').find({
        ...ctx.query,
        populate: ['image', 'menus']
      });

      return { data: results, meta: { pagination } };
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },

  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      const entity = await strapi.service('api::menu-item.menu-item').findOne(id, {
        populate: ['image', 'menus']
      });

      if (!entity) {
        return ctx.notFound('Menu item not found');
      }

      return { data: entity };
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },

  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;

      const entity = await strapi.service('api::menu-item.menu-item').update(id, {
        data: {
          ...data,
          publishedAt: data.publishedAt || new Date().toISOString()
        },
        populate: ['image', 'menus']
      });

      return { data: entity };
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },

  async delete(ctx) {
    try {
      const { id } = ctx.params;
      const entity = await strapi.service('api::menu-item.menu-item').delete(id, {
        populate: ['image', 'menus']
      });

      return { data: entity };
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  }
}));