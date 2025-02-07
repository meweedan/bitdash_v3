// services/subscription.js
module.exports = {
  getTierDetails: () => {
    return {
      standard: {
        commission_rate: 2.5,
        monthly_fee: 80
      },
      premium: {
        commission_rate: 1.5,
        monthly_fee: 110
      }
    };
  },

  calculateOrderCommission: async (orderId) => {
    const { strapi } = require('@strapi/strapi');
    
    const order = await strapi.entityService.findOne('api::order.order', orderId, {
      populate: ['restaurant', 'restaurant.subscription']
    });

    if (!order || !order.restaurant) {
      throw new Error('Order or restaurant not found');
    }

    const subscription = order.restaurant.subscription;
    const tierDetails = getTierDetails();
    const commissionRate = subscription ? 
      tierDetails[subscription.tier].commission_rate : 
      tierDetails.free.commission_rate;

    return (order.total * (commissionRate / 100)).toFixed(2);
  },

  createSubscription: async (restaurantId, tier) => {
    const tierDetails = getTierDetails();
    
    if (!tierDetails[tier]) {
      throw new Error('Invalid subscription tier');
    }

    const subscription = await strapi.entityService.create('api::subscription.subscription', {
      data: {
        tier,
        commission_rate: tierDetails[tier].commission_rate,
        monthly_fee: tierDetails[tier].monthly_fee,
        restaurant: restaurantId,
        start_date: new Date(),
        status: 'active'
      }
    });

    return subscription;
  },

  updateSubscription: async (subscriptionId, tier) => {
    const tierDetails = getTierDetails();
    
    if (!tierDetails[tier]) {
      throw new Error('Invalid subscription tier');
    }

    const subscription = await strapi.entityService.update('api::subscription.subscription', subscriptionId, {
      data: {
        tier,
        commission_rate: tierDetails[tier].commission_rate,
        monthly_fee: tierDetails[tier].monthly_fee
      }
    });

    return subscription;
  }
};