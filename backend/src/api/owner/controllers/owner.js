// api/owner/controllers/owner.js
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::owner.owner', ({ strapi }) => ({
  // Find all owners (with proper authorization)
  async find(ctx) {
    const { query } = ctx;
    const entity = await strapi.service('api::owner.owner').find(query);
    const sanitizedResults = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedResults);
  },

  // Find one owner by ID (with proper authorization)
  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;
    const entity = await strapi.service('api::owner.owner').findOne(id, query);
    const sanitizedResults = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedResults);
  },

  // Create owner (with proper authorization)
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // Link with authenticated user
    data.user = ctx.state.user.id;
    
    const entity = await strapi.service('api::owner.owner').create({ data });
    const sanitizedResults = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedResults);
  },

  // Update owner (with proper authorization)
  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;

    // Ensure user can only update their own shop
    const existingOwner = await strapi.service('api::owner.owner').findOne(id, {
      populate: ['user']
    });

    if (existingOwner.user.id !== ctx.state.user.id) {
      return ctx.unauthorized('You are not authorized to update this shop');
    }

    const entity = await strapi.service('api::owner.owner').update(id, { data });
    const sanitizedResults = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedResults);
  },

  // Delete owner (with proper authorization)
  async delete(ctx) {
    const { id } = ctx.params;

    // Ensure user can only delete their own shop
    const existingOwner = await strapi.service('api::owner.owner').findOne(id, {
      populate: ['user']
    });

    if (existingOwner.user.id !== ctx.state.user.id) {
      return ctx.unauthorized('You are not authorized to delete this shop');
    }

    const entity = await strapi.service('api::owner.owner').delete(id);
    const sanitizedResults = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedResults);
  },

  // Public shop endpoint (no authorization required)
  async publicShop(ctx) {
    try {
      const { id } = ctx.params;

      // Fetch shop with all necessary relations
      const shop = await strapi.entityService.findOne('api::owner.owner', id, {
        populate: {
          logo: true,
          coverImage: true,
          shop_items: {
            filters: {
              status: 'available'  // Only show available items
            },
            populate: {
              images: true,
              reviews: {
                populate: ['customer_profile']
              }
            }
          },
          theme: true,
          location: true,
          social_links: true
        }
      });

      if (!shop) {
        return ctx.notFound('Shop not found');
      }

      // Remove sensitive data
      const sanitizedShop = {
        id: shop.id,
        shopName: shop.shopName,
        description: shop.description,
        logo: shop.logo,
        coverImage: shop.coverImage,
        shop_items: shop.shop_items,
        verificationStatus: shop.verificationStatus,
        rating: shop.rating,
        theme: shop.theme,
        location: shop.location?.showOnPublicPage ? shop.location : null,
        social_links: shop.social_links
      };

      return this.transformResponse(sanitizedShop);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  // Find shop by name (public endpoint)
  async findByShopName(ctx) {
    try {
      const { shopName } = ctx.params;

      const shops = await strapi.entityService.findMany('api::owner.owner', {
        filters: {
          shopName: {
            $eq: shopName
          }
        },
        populate: {
          logo: true,
          coverImage: true,
          shop_items: {
            filters: {
              status: 'available'
            },
            populate: {
              images: true,
              reviews: {
                populate: ['customer_profile']
              }
            }
          },
          theme: true,
          location: true,
          social_links: true
        }
      });

      if (!shops.length) {
        return ctx.notFound('Shop not found');
      }

      // Sanitize data
      const sanitizedShop = {
        id: shops[0].id,
        shopName: shops[0].shopName,
        description: shops[0].description,
        logo: shops[0].logo,
        coverImage: shops[0].coverImage,
        shop_items: shops[0].shop_items,
        verificationStatus: shops[0].verificationStatus,
        rating: shops[0].rating,
        theme: shops[0].theme,
        location: shops[0].location?.showOnPublicPage ? shops[0].location : null,
        social_links: shops[0].social_links
      };

      return this.transformResponse(sanitizedShop);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  // Helper method to calculate shop statistics
  async getShopStats(ctx) {
    try {
      const { id } = ctx.params;

      const shop = await strapi.entityService.findOne('api::owner.owner', id, {
        populate: ['shop_items', 'orders']
      });

      if (!shop) {
        return ctx.notFound('Shop not found');
      }

      // Calculate stats
      const stats = {
        totalProducts: shop.shop_items?.length || 0,
        totalOrders: shop.orders?.length || 0,
        totalRevenue: shop.orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0,
        averageRating: shop.rating || 0,
      };

      return stats;
    } catch (error) {
      ctx.throw(500, error);
    }
  }
}));