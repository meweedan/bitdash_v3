// api/shop-item/controllers/shop-item.js
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::shop-item.shop-item', ({ strapi }) => ({
  // Find all items (with proper authorization)
  async find(ctx) {
    const { query } = ctx;
    const entity = await strapi.service('api::shop-item.shop-item').find(query);
    const sanitizedResults = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedResults);
  },

  // Find one item by ID (with proper authorization)
  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;
    const entity = await strapi.service('api::shop-item.shop-item').findOne(id, query);
    const sanitizedResults = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedResults);
  },

  // Create item (with proper authorization)
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // Verify owner
    const owner = await strapi.entityService.findOne('api::owner.owner', data.owner, {
      populate: ['user']
    });

    if (owner.user.id !== ctx.state.user.id) {
      return ctx.unauthorized('You are not authorized to create items for this shop');
    }
    
    const entity = await strapi.service('api::shop-item.shop-item').create({ data });
    const sanitizedResults = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedResults);
  },

  // Update item (with proper authorization)
  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;

    // Ensure user can only update their own items
    const existingItem = await strapi.entityService.findOne('api::shop-item.shop-item', id, {
      populate: ['owner.user']
    });

    if (existingItem.owner.user.id !== ctx.state.user.id) {
      return ctx.unauthorized('You are not authorized to update this item');
    }

    const entity = await strapi.service('api::shop-item.shop-item').update(id, { data });
    const sanitizedResults = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedResults);
  },

  // Delete item (with proper authorization)
  async delete(ctx) {
    const { id } = ctx.params;

    // Ensure user can only delete their own items
    const existingItem = await strapi.entityService.findOne('api::shop-item.shop-item', id, {
      populate: ['owner.user']
    });

    if (existingItem.owner.user.id !== ctx.state.user.id) {
      return ctx.unauthorized('You are not authorized to delete this item');
    }

    const entity = await strapi.service('api::shop-item.shop-item').delete(id);
    const sanitizedResults = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedResults);
  },

  // Public item endpoint (no authorization required)
  async publicItem(ctx) {
    try {
      const { id } = ctx.params;

      const item = await strapi.entityService.findOne('api::shop-item.shop-item', id, {
        populate: {
          images: true,
          owner: {
            populate: ['logo', 'location']
          },
          reviews: {
            populate: ['customer_profile']
          }
        }
      });

      if (!item) {
        return ctx.notFound('Item not found');
      }

      if (item.status !== 'available') {
        return ctx.notFound('Item not available');
      }

      // Remove sensitive data
      const sanitizedItem = {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        images: item.images,
        category: item.category,
        subcategory: item.subcategory,
        specifications: item.specifications,
        rating: item.rating,
        reviews: item.reviews,
        owner: {
          id: item.owner.id,
          shopName: item.owner.shopName,
          logo: item.owner.logo,
          location: item.owner.location?.showOnPublicPage ? item.owner.location : null,
          rating: item.owner.rating
        }
      };

      return this.transformResponse(sanitizedItem);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  // Public search endpoint
  async search(ctx) {
    try {
      const { query } = ctx;
      
      // Build search criteria
      const filters = {
        status: 'available',
        ...(query.category && { category: query.category }),
        ...(query.subcategory && { subcategory: query.subcategory }),
        ...(query.price_min && { price: { $gte: query.price_min } }),
        ...(query.price_max && { price: { $lte: query.price_max } }),
        ...(query.search && {
          $or: [
            { name: { $containsi: query.search } },
            { description: { $containsi: query.search } }
          ]
        })
      };

      const items = await strapi.entityService.findMany('api::shop-item.shop-item', {
        filters,
        populate: {
          images: true,
          owner: {
            populate: ['logo']
          }
        },
        sort: query.sort || { createdAt: 'desc' },
        pagination: {
          page: query.page || 1,
          pageSize: query.pageSize || 12
        }
      });

      // Sanitize items
      const sanitizedItems = items.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        images: item.images,
        category: item.category,
        subcategory: item.subcategory,
        rating: item.rating,
        owner: {
          id: item.owner.id,
          shopName: item.owner.shopName,
          logo: item.owner.logo
        }
      }));

      return this.transformResponse(sanitizedItems);
    } catch (error) {
      ctx.throw(500, error);
    }
  }
}));