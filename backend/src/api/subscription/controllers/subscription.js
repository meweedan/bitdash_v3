'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::subscription.subscription', ({ strapi }) => ({
  // Extend the core controller and add custom methods
  async cancel(ctx) {
    const { id } = ctx.params;
    
    try {
      // Find the subscription
      const subscription = await strapi.entityService.findOne('api::subscription.subscription', id, {
        populate: ['operator', 'restaurant']
      });

      if (!subscription) {
        return ctx.notFound('Subscription not found');
      }

      // If subscription has a Stripe subscription ID, cancel it in Stripe
      if (subscription.stripeSubscriptionId && process.env.STRIPE_SECRET_KEY) {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        try {
          await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
        } catch (stripeError) {
          console.error('Stripe cancellation error:', stripeError);
        }
      }

      // Update subscription in Strapi
      const updatedSubscription = await strapi.entityService.update('api::subscription.subscription', id, {
        data: {
          status: 'cancelled',
          end_date: new Date()
        }
      });

      return {
        data: updatedSubscription
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  }
}));