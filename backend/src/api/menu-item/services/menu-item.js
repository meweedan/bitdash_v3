'use strict';

module.exports = {
  async find(params) {
    return strapi.query('api::menu-item.menu-item').findMany({
      where: params, // Correct usage: Strapi accepts an object with the 'where' condition
      populate: '*', // If you want to populate all fields
    });
  },

  async findOne(id) {
    return strapi.query('api::menu-item.menu-item').findOne({
      where: { id }, // Correct usage: Strapi accepts 'where' as a condition
      populate: '*', // If you want to populate all fields
    });
  },

  async create(data) {
    return strapi.query('api::menu-item.menu-item').create({
      data, // Correct usage: Strapi expects 'data' to be inside an object
    });
  },

  async update(params, data) {
    return strapi.query('api::menu-item.menu-item').update({
      where: { id: params.id }, // Correct usage: Strapi expects 'where' condition for the id
      data, // Correct usage: Pass data as the 'data' field inside an object
    });
  },

  async delete(params) {
    return strapi.query('api::menu-item.menu-item').delete({
      where: { id: params.id }, // Correct usage: Strapi expects 'where' condition for the id
    });
  },
};
