'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::restaurant.restaurant', ({ strapi }) => ({
  async find(ctx) {
    try {
      const entries = await strapi.entityService.findMany('api::restaurant.restaurant', {
        ...ctx.query,
        populate: {
          logo: true,
          menus: {
            populate: {
              items: true // Assuming your menu has an items relation
            }
          },
          tables: true
        }
      });

      console.log('Found restaurants:', entries);

      return {
        data: entries || [],
        meta: {
          pagination: {
            page: ctx.query.page || 1,
            pageSize: ctx.query.pageSize || 25,
            total: entries ? entries.length : 0
          }
        }
      };
    } catch (error) {
      console.error('Restaurant find error:', error);
      ctx.throw(500, error);
    }
  },

  async publicMenu(ctx) {
  try {
    const { id } = ctx.params;

    if (!id) {
      return ctx.badRequest('Restaurant ID is required');
    }

    // Get restaurant with ALL menus and their menu items
    const restaurant = await strapi.entityService.findOne('api::restaurant.restaurant', id, {
      populate: {
        logo: true,
        tables: true,
        menus: {
          populate: {
            menu_items: {
              populate: ['image']
            }
          }
        }
      }
    });

    if (!restaurant) {
      return ctx.notFound('Restaurant not found');
    }

    // Transform the data to match the expected structure
    const transformedData = {
      data: {
        id: restaurant.id,
        attributes: {
          name: restaurant.name,
          description: restaurant.description,
          logo: restaurant.logo ? {
            data: {
              id: restaurant.logo.id,
              attributes: restaurant.logo
            }
          } : null,
          menus: {
            data: restaurant.menus?.map(menu => ({
              id: menu.id,
              attributes: {
                name: menu.name,
                description: menu.description,
                menu_items: {
                  data: menu.menu_items?.map(item => ({
                    id: item.id,
                    attributes: {
                      name: item.name,
                      description: item.description,
                      price: item.price,
                      category: item.category,
                      image: item.image ? {
                        data: {
                          id: item.image.id,
                          attributes: item.image
                        }
                      } : null
                    }
                  })) || []
                }
              }
            })) || []
          },
          tables: {
            data: restaurant.tables?.map(table => ({
              id: table.id,
              attributes: table
            })) || []
          }
        }
      }
    };

    return transformedData;
  } catch (error) {
    console.error('Restaurant publicMenu error:', error);
    return ctx.throw(500, error);
  }
},
  
  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      const entry = await strapi.entityService.findOne('api::restaurant.restaurant', id, {
        populate: {
          logo: true,
          menus: {
            populate: {
              items: true
            }
          },
          tables: true
        }
      });

      if (!entry) {
        return ctx.throw(404, 'Restaurant not found');
      }

      return {
        data: entry
      };
    } catch (error) {
      console.error('Restaurant findOne error:', error);
      ctx.throw(500, error);
    }
  },

  async create(ctx) {
    try {
      const entry = await strapi.entityService.create('api::restaurant.restaurant', {
        data: ctx.request.body.data,
        populate: {
          logo: true,
          menus: {
            populate: {
              items: true
            }
          },
          tables: true
        }
      });

      return {
        data: entry
      };
    } catch (error) {
      console.error('Restaurant create error:', error);
      ctx.throw(500, error);
    }
  },

  async update(ctx) {
    try {
      const { id } = ctx.params;
      const entry = await strapi.entityService.update('api::restaurant.restaurant', id, {
        data: ctx.request.body.data,
        populate: {
          logo: true,
          menus: {
            populate: {
              items: true
            }
          },
          tables: true
        }
      });

      if (!entry) {
        return ctx.throw(404, 'Restaurant not found');
      }

      return {
        data: entry
      };
    } catch (error) {
      console.error('Restaurant update error:', error);
      ctx.throw(500, error);
    }
  },

  async delete(ctx) {
    try {
      const { id } = ctx.params;
      const entry = await strapi.entityService.delete('api::restaurant.restaurant', id);

      if (!entry) {
        return ctx.throw(404, 'Restaurant not found');
      }

      return {
        data: entry
      };
    } catch (error) {
      console.error('Restaurant delete error:', error);
      ctx.throw(500, error);
    }
  }
}));
