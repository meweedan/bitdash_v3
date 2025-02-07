'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const crypto = require('crypto');

module.exports = createCoreController('api::table.table', ({ strapi }) => ({

  // Create a new table
  async create(ctx) {
    try {
      const { data } = ctx.request.body;
      const user = ctx.state.user;

      if (!data || !data.name || !data.restaurant) {
        return ctx.badRequest('Name and restaurant are required');
      }

      const timestamp = Date.now();
      const random = crypto.randomBytes(8).toString('hex');
      const QR = `TABLE_${timestamp}_${random}`;

      const entity = await strapi.entityService.create('api::table.table', {
        data: {
          name: data.name,
          description: data.description || '',
          restaurant: data.restaurant,
          QR,
          users_permissions_user: user.id,
          publishedAt: new Date()
        },
      });

      return {
        data: await this.sanitizeOutput(entity, ctx)
      };
    } catch (error) {
      console.error('Create table error:', error);
      return ctx.badRequest('Table creation failed', { error: error.message });
    }
  },

  // Generate QR code for a table
  async generateQR(ctx) {
    try {
      const { id } = ctx.params;
      
      // Fetch table with restaurant details
      const table = await strapi.entityService.findOne('api::table.table', id, {
        populate: ['restaurant']
      });

      if (!table) {
        return ctx.notFound('Table not found');
      }

      const baseUrl = process.env.FRONTEND_URL || 'https://bitdash.app';
      const menuUrl = `${baseUrl}/menus/menu/${table.restaurant?.id}?table=${table.id}`;

      // If QR code not present, create a new one
      if (!table.QR) {
        const timestamp = Date.now();
        const random = crypto.randomBytes(8).toString('hex');
        const QR = `TABLE_${timestamp}_${random}`;

        await strapi.entityService.update('api::table.table', id, { data: { QR } });
      }

      return {
        data: {
          menuUrl,
          id: table.id,
          QR: table.QR
        }
      };
    } catch (error) {
      console.error('QR generation error:', error);
      return ctx.badRequest('Failed to generate QR code');
    }
  },
   async findOne(ctx) {
    const { id } = ctx.params;
    try {
      const table = await strapi.db.query('api::table.table').findOne({
        where: { id },
        populate: ['restaurant', 'restaurant.menus', 'restaurant.menus.items']
      });

      if (!table) {
        return ctx.notFound('Table not found');
      }
      return table;
    } catch (error) {
      console.error('Error in findOne:', error);
      ctx.internalServerError('An error occurred');
    }
  },

  // Delete a table
  async delete(ctx) {
    try {
      const { id } = ctx.params;

      // Check if the table exists
      const existingTable = await strapi.entityService.findOne('api::table.table', id, {
        populate: ['restaurant', 'restaurant.users_permissions_user']
      });

      if (!existingTable) {
        return ctx.notFound('Table not found');
      }

      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized('You must be logged in to delete tables');
      }

      // Delete the table entity
      const deletedTable = await strapi.entityService.delete('api::table.table', id);
      return {
        data: deletedTable,
        meta: { message: 'Table deleted successfully' }
      };
    } catch (error) {
      console.error('Table deletion error:', error);
      return ctx.internalServerError('An error occurred while processing your request', { details: error.message });
    }
  }

}));