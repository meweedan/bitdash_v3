// src/api/restaurant/services/restaurant.js
'use strict';

module.exports = {
  async find(query = {}) {
    return strapi.entityService.findMany('api::restaurant.restaurant', {
      ...query,
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
  },

  async findOne(id, query = {}) {
    return strapi.entityService.findOne('api::restaurant.restaurant', id, {
      ...query,
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
  },

  async create(data) {
    return strapi.entityService.create('api::restaurant.restaurant', {
      data,
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
  },

  async update(id, data) {
    return strapi.entityService.update('api::restaurant.restaurant', id, {
      data,
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
  },

  async delete(id) {
    return strapi.entityService.delete('api::restaurant.restaurant', id);
  }
};