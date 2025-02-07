'use strict';

module.exports = async ({ strapi }) => {
  // Initialize Socket.IO after Strapi server is ready
  strapi.server.httpServer.on('listening', () => {
    // @ts-ignore
    const io = require('socket.io')(strapi.server.httpServer, {
      cors: strapi.config.get('server.io.cors')
    });

    // Attach Socket.io instance to Strapi
    strapi.io = io;

    // Middleware to authenticate socket connections
    io.use(async (socket, next) => {
      try {
        const { token } = socket.handshake.auth;
        if (!token) {
          return next(new Error('Authentication token missing'));
        }

        // Verify JWT token
        const verified = await strapi.plugins['users-permissions'].services.jwt.verify(token);
        socket.user = verified;
        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });

    // Handle socket connections
    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      // Join operator room
      socket.on('joinOperatorRoom', async ({ operatorId }) => {
        try {
          // Verify operator access
          const operator = await strapi.db.query('api::operator.operator').findOne({
            where: { 
              id: operatorId,
              user: socket.user.id 
            }
          });

          if (operator) {
            socket.join(`operator_${operatorId}`);
            console.log(`Operator ${operatorId} joined room`);

            // Send pending orders
            const orders = await strapi.db.query('api::order.order').findMany({
              where: {
                status: 'pending',
                operators: { id: operatorId }
              },
              populate: {
                menu_items: {
                  populate: ['image']
                },
                tables: true,
                customer_profile: true
              }
            });

            socket.emit('pendingOrders', { orders });
          }
        } catch (error) {
          console.error('Join operator room error:', error);
          socket.emit('error', { message: 'Failed to join operator room' });
        }
      });

      // Handle order status updates
      socket.on('updateOrderStatus', async ({ orderId, status }) => {
        try {
          // Update order
          const order = await strapi.db.query('api::order.order').update({
            where: { id: orderId },
            data: { status },
            populate: {
              operators: true,
              customer_profile: true,
              menu_items: {
                populate: ['image']
              },
              tables: true
            }
          });

          if (order) {
            // Notify operators
            order.operators.forEach(operator => {
              io.to(`operator_${operator.id}`).emit('orderUpdated', { order });
            });

            // Notify customer if exists
            if (order.customer_profile) {
              io.to(`customer_${order.customer_profile.id}`).emit('orderStatusChanged', {
                orderId: order.id,
                status: order.status
              });
            }
          }
        } catch (error) {
          console.error('Update order status error:', error);
          socket.emit('error', { message: 'Failed to update order status' });
        }
      });

      // Handle new order creation
      socket.on('createOrder', async (orderData) => {
        try {
          const {
            menu_items,
            table_ids,
            customer_profile_id,
            operator_ids,
            payment_method,
            amount_deducted_from_credit = 0
          } = orderData;

          // Calculate total
          const menuItemsData = await strapi.db.query('api::menu-item.menu-item').findMany({
            where: { id: { $in: menu_items } }
          });

          const total = menuItemsData.reduce((sum, item) => sum + Number(item.price), 0);

          // Create order
          const order = await strapi.db.query('api::order.order').create({
            data: {
              status: 'pending',
              total,
              menu_items,
              tables: table_ids,
              customer_profile: customer_profile_id,
              operators: operator_ids,
              payment_method,
              amount_deducted_from_credit
            },
            populate: {
              operators: true,
              customer_profile: true,
              menu_items: {
                populate: ['image']
              },
              tables: true
            }
          });

          // Notify operators
          operator_ids.forEach(operatorId => {
            io.to(`operator_${operatorId}`).emit('newOrder', { order });
          });

          // Notify customer
          if (customer_profile_id) {
            io.to(`customer_${customer_profile_id}`).emit('orderConfirmed', { order });
          }

          socket.emit('orderCreated', { order });
        } catch (error) {
          console.error('Create order error:', error);
          socket.emit('error', { message: 'Failed to create order' });
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  });

  // Register any additional routes
  if (process.env.NODE_ENV === 'development') {
    const authRoutes = require('../../../frontend/pages/api/auth/routes/register');
    strapi.router.addRoutes(authRoutes);
  }
};