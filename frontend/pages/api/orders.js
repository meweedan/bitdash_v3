// api/orders.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { data } = req.body;
    
    // Validate order data
    if (!data.restaurant || !data.order_items || !data.order_items.create?.length) {
      return res.status(400).json({ message: 'Invalid order data' });
    }

    // Validate each order item
    for (const item of data.order_items.create) {
      if (!item.menu_item || !item.quantity || !item.unit_price || !item.subtotal) {
        return res.status(400).json({ 
          message: 'Invalid order item data. Each item must have menu_item, quantity, unit_price, and subtotal'
        });
      }
    }

    // Calculate total from order items to verify
    const calculatedTotal = data.order_items.create.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    if (Math.abs(calculatedTotal - data.total) > 0.01) { // Allow for small floating point differences
      return res.status(400).json({ 
        message: 'Order total does not match sum of item subtotals',
        calculated: calculatedTotal,
        provided: data.total
      });
    }

    // Create order in database with order items
    const order = await strapi.service('api::order.order').create({
      data: {
        ...data,
        publishedAt: new Date(),
      },
      populate: {
        order_items: {
          populate: {
            menu_item: true
          }
        }
      }
    });

    // Handle different payment methods
    switch (data.payment_method) {
      case 'credit':
        // Process account credit payment
        const user = await strapi.plugins['users-permissions'].services.user.fetch(req.user.id);
        if (user.credit_balance < data.total) {
          // If payment fails, we should delete the order
          await strapi.service('api::order.order').delete(order.id);
          return res.status(400).json({ message: 'Insufficient credit balance' });
        }
        
        // Update user's credit balance
        await strapi.plugins['users-permissions'].services.user.edit(req.user.id, {
          credit_balance: user.credit_balance - data.total
        });
        break;

      case 'bitwallet':
        // Handle BitWallet payment processing
        // This could involve generating a QR code for payment
        break;

      case 'cash':
        // Mark order as awaiting cash payment
        await strapi.service('api::order.order').update(order.id, {
          data: { payment_status: 'awaiting_payment' }
        });
        break;
    }

    // Update order items status based on payment
    const orderItemUpdates = order.order_items.map(item => 
      strapi.service('api::order-item.order-item').update(item.id, {
        data: { 
          status: data.payment_method === 'cash' ? 'awaiting_payment' : 'pending'
        }
      })
    );
    await Promise.all(orderItemUpdates);

    // Send order confirmation
    await sendOrderConfirmation(order);

    // Return order with populated relationships
    const populatedOrder = await strapi.service('api::order.order').findOne(order.id, {
      populate: {
        order_items: {
          populate: {
            menu_item: true
          }
        },
        customer_profile: true,
        tables: true
      }
    });

    return res.status(200).json({ data: populatedOrder });

  } catch (error) {
    console.error('Order processing error:', error);
    return res.status(500).json({ 
      message: 'Failed to process order',
      error: error.message 
    });
  }
}

// Helper function to send order confirmation
async function sendOrderConfirmation(order) {
  try {
    // Format order items for notification
    const items = order.order_items.map(item => ({
      name: item.menu_item.name,
      quantity: item.quantity,
      price: item.unit_price,
      subtotal: item.subtotal,
      special_instructions: item.special_instructions
    }));

    // Implement order confirmation notification logic here
    // This could be via email, SMS, or push notification
    
    const notification = {
      orderId: order.id,
      total: order.total,
      items,
      paymentMethod: order.payment_method,
      customerInfo: order.customer_profile || order.guest_info,
      table: order.tables[0]?.name
    };

    // Add your notification sending logic here
    console.log('Sending order confirmation:', notification);

  } catch (error) {
    console.error('Failed to send order confirmation:', error);
    // Don't throw error as this is a non-critical operation
  }
}