// pages/api/track-order.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { orderNumber } = req.query;

    if (!orderNumber) {
      return res.status(400).json({ message: 'Order number is required' });
    }

    // Fetch order from Strapi with all necessary relations
    const order = await strapi.service('api::order.order').findOne({
      where: { order_number: orderNumber },
      populate: {
        order_items: {
          populate: {
            menu_item: true
          }
        },
        restaurant: true,
        tables: true
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Format order data for frontend
    const formattedOrder = {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method,
      restaurant: {
        id: order.restaurant.id,
        name: order.restaurant.name
      },
      table: order.tables[0]?.name || 'N/A',
      items: order.order_items.map(item => ({
        id: item.id,
        name: item.menu_item.name,
        quantity: item.quantity,
        status: item.status,
        specialInstructions: item.special_instructions,
        unitPrice: item.unit_price,
        subtotal: item.subtotal
      }))
    };

    return res.status(200).json({ data: formattedOrder });

  } catch (error) {
    console.error('Order tracking error:', error);
    return res.status(500).json({ 
      message: 'Failed to track order',
      error: error.message 
    });
  }
}