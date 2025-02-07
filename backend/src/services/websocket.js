'use strict';

module.exports = {
  // Emit event to all operators of a restaurant
  emitToOperators: async (operatorIds, eventName, data) => {
    try {
      if (!strapi.io) return;

      operatorIds.forEach(operatorId => {
        strapi.io.to(`operator_${operatorId}`).emit(eventName, data);
      });
    } catch (error) {
      console.error('Error emitting to operators:', error);
    }
  },

  // Emit event to a customer
  emitToCustomer: async (customerProfileId, eventName, data) => {
    try {
      if (!strapi.io) return;
      
      strapi.io.to(`customer_${customerProfileId}`).emit(eventName, data);
    } catch (error) {
      console.error('Error emitting to customer:', error);
    }
  },

  // Get all pending orders for an operator
  getPendingOrders: async (operatorId) => {
    try {
      return await strapi.db.query('api::order.order').findMany({
        where: {
          status: 'pending',
          operators: {
            id: operatorId
          }
        },
        populate: {
          menu_items: {
            populate: ['image']
          },
          tables: true,
          customer_profile: true
        }
      });
    } catch (error) {
      console.error('Error getting pending orders:', error);
      return [];
    }
  },

  // Get order history for a customer
  getCustomerOrders: async (customerProfileId) => {
    try {
      return await strapi.db.query('api::order.order').findMany({
        where: {
          customer_profile: customerProfileId
        },
        populate: {
          menu_items: {
            populate: ['image']
          },
          tables: true,
          operators: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Error getting customer orders:', error);
      return [];
    }
  }
};