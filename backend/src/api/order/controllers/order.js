'use strict';

const getTierCommissionRate = async (restaurantId) => {
  // Get restaurant subscription tier
  const restaurant = await strapi.entityService.findOne('api::restaurant.restaurant', restaurantId, {
    populate: ['subscription']
  });

  // Default to free tier (4%) if no subscription found
  if (!restaurant?.subscription) {
    return 0.04;
  }

  // Commission rates by tier
  const rates = {
    free: 0.04,
    basic: 0.025,
    premium: 0.02,
    pro: 0.015
  };

  return rates[restaurant.subscription.tier] || 0.04;
};

const calculateCommission = (total, commissionRate) => {
  return Number((total * commissionRate).toFixed(2));
};

module.exports = {
  async find(ctx) {
    try {
      console.log('Find query filters:', ctx.query.filters);
      
      const orders = await strapi.entityService.findMany('api::order.order', {
        filters: ctx.query.filters,
        populate: {
          order_items: {
            populate: ['menu_item']
          },
          tables: true,
          customer_profile: true,
          operators: true,
          restaurant: true
        },
        sort: { createdAt: 'desc' }
      });

      console.log(`Found ${orders.length} orders`);
      return { data: orders };
    } catch (error) {
      console.error('Order find error:', error);
      ctx.throw(500, error);
    }
  },

  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      
      const order = await strapi.entityService.findOne('api::order.order', id, {
        populate: {
          order_items: {
            populate: ['menu_item']
          },
          tables: true,
          customer_profile: true,
          operators: true,
          restaurant: true
        }
      });

      if (!order) {
        return ctx.notFound('Order not found');
      }

      return { data: order };
    } catch (error) {
      console.error('Order findOne error:', error);
      ctx.throw(500, error);
    }
  },

  async create(ctx) {
    try {
      const { data } = ctx.request.body;
      console.log('Received order data:', JSON.stringify(data, null, 2));

      // Validate required fields
      if (!data.total || !data.payment_method || !data.restaurant) {
        return ctx.badRequest('Missing required fields (total, payment_method, or restaurant)');
      }

      // Calculate commission
      const commissionRate = await getTierCommissionRate(data.restaurant);
      const commission = calculateCommission(data.total, commissionRate);

      // Extract order items
      const orderItems = data.order_items || [];
      delete data.order_items;

      // Prepare base order data with correct relation syntax
      const orderData = {
        status: data.status || 'pending',
        restaurant: data.restaurant,
        total: Number(data.total),
        commission_amount: commission,
        commission_rate: commissionRate,
        payment_method: data.payment_method,
        notes: data.notes || '',
        publishedAt: new Date(),
        guest_info: data.guest_info || null,
        // Fix tables relation syntax
        tables: data.tables?.connect || undefined
      };

      // Handle tables
      if (data.tables?.connect?.length) {
        orderData.tables = data.tables.connect;
      }

      // Handle customer profile
      if (data.customer_profile?.connect?.length) {
        orderData.customer_profile = data.customer_profile.connect[0];
      }

      console.log('Creating order with data:', JSON.stringify(orderData, null, 2));

      // Create the base order
      const order = await strapi.entityService.create('api::order.order', {
        data: orderData
      });

      // Create order items
      if (orderItems.length > 0) {
        const orderItemPromises = orderItems.map(item =>
          strapi.entityService.create('api::order-item.order-item', {
            data: {
              order: order.id,
              menu_item: item.menu_item.connect[0],
              quantity: Number(item.quantity),
              unit_price: Number(item.unit_price),
              subtotal: Number(item.subtotal),
              special_instructions: item.special_instructions || '',
              status: 'pending',
              modifications: item.modifications || null
            }
          })
        );

        await Promise.all(orderItemPromises);
      }

      // Fetch the complete order with all relations
      const populatedOrder = await strapi.entityService.findOne('api::order.order', order.id, {
        populate: {
          order_items: {
            populate: ['menu_item']
          },
          tables: true,
          customer_profile: true,
          restaurant: true,
          operators: true
        }
      });

      // Handle WebSocket notifications
      if (strapi.io && populatedOrder.operators?.length) {
        populatedOrder.operators.forEach(operator => {
          strapi.io.to(`operator_${operator.id}`).emit('newOrder', { order: populatedOrder });
        });
      }

      return { data: populatedOrder };

    } catch (error) {
      console.error('Order creation error:', error);
      return ctx.badRequest(error.message);
    }
  },

  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;

      // Get existing order
      const existingOrder = await strapi.entityService.findOne('api::order.order', id, {
        populate: ['restaurant', 'order_items']
      });

      if (!existingOrder) {
        return ctx.notFound('Order not found');
      }

      let updateData = {
        status: data.status,
        payment_method: data.payment_method,
        guest_info: data.guest_info,
        notes: data.notes,
      };

      // Recalculate commission if total is being updated
      if (data.total) {
        const commissionRate = await getTierCommissionRate(existingOrder.restaurant.id);
        const commission = calculateCommission(Number(data.total), commissionRate);
        
        updateData = {
          ...updateData,
          total: Number(data.total),
          commission_amount: commission,
          commission_rate: commissionRate,
        };
      }

      // Filter out undefined values
      Object.keys(updateData).forEach(key => 
        updateData[key] === undefined && delete updateData[key]
      );

      // Handle order items updates if provided
      if (data.order_items) {
        // Delete existing order items
        for (const item of existingOrder.order_items) {
          await strapi.entityService.delete('api::order-item.order-item', item.id);
        }

        // Create new order items
        const orderItemPromises = data.order_items.map(item =>
          strapi.entityService.create('api::order-item.order-item', {
            data: {
              order: id,
              menu_item: { connect: [Number(item.menu_item)] },
              quantity: Number(item.quantity),
              unit_price: Number(item.unit_price),
              subtotal: Number(item.subtotal),
              special_instructions: item.special_instructions || '',
              status: updateData.status || existingOrder.status,
              modifications: item.modifications || null
            }
          })
        );

        await Promise.all(orderItemPromises);
      }

      console.log('Updating order with data:', JSON.stringify(updateData, null, 2));

      // Update the order
      const updatedOrder = await strapi.entityService.update('api::order.order', id, {
        data: updateData,
        populate: {
          order_items: {
            populate: ['menu_item']
          },
          tables: true,
          customer_profile: true,
          operators: true,
          restaurant: true
        }
      });

      // Handle WebSocket notifications
      if (strapi.io && updatedOrder.operators?.length) {
        updatedOrder.operators.forEach(operator => {
          strapi.io.to(`operator_${operator.id}`).emit('orderUpdated', { order: updatedOrder });
        });
      }

      return { data: updatedOrder };

    } catch (error) {
      console.error('Order update error:', error);
      return ctx.badRequest(error.message);
    }
  },

  async delete(ctx) {
    try {
      const { id } = ctx.params;

      // Get the order with its items before deletion
      const order = await strapi.entityService.findOne('api::order.order', id, {
        populate: ['order_items', 'operators']
      });

      if (!order) {
        return ctx.notFound('Order not found');
      }

      // Delete all associated order items first
      for (const item of order.order_items) {
        await strapi.entityService.delete('api::order-item.order-item', item.id);
      }

      // Delete the order
      const deletedOrder = await strapi.entityService.delete('api::order.order', id);

      // Handle WebSocket notifications
      if (strapi.io && order.operators?.length) {
        order.operators.forEach(operator => {
          strapi.io.to(`operator_${operator.id}`).emit('orderDeleted', { 
            orderId: id,
            order: deletedOrder 
          });
        });
      }

      return { data: deletedOrder };
    } catch (error) {
      console.error('Order deletion error:', error);
      return ctx.badRequest(error.message);
    }
  }
};