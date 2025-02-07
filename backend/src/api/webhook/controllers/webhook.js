'use strict';

module.exports = {
  async stripe(ctx) {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const signature = ctx.request.headers['stripe-signature'];
    
    try {
      const event = stripe.webhooks.constructEvent(
        ctx.request.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object;
          const subscriptionId = session.metadata.subscriptionId;

          // Update subscription in Strapi
          await strapi.entityService.update('api::subscription.subscription', subscriptionId, {
            data: {
              status: 'active',
              stripeSubscriptionId: session.subscription
            }
          });
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object;
          
          // Find and cancel subscription in Strapi
          const [strapiSub] = await strapi.entityService.findMany('api::subscription.subscription', {
            filters: { stripeSubscriptionId: subscription.id }
          });

          if (strapiSub) {
            await strapi.entityService.update('api::subscription.subscription', strapiSub.id, {
              data: {
                status: 'cancelled',
                end_date: new Date()
              }
            });
          }
          break;
        }
      }

      ctx.send({ received: true });
    } catch (err) {
      console.error('Webhook error:', err);
      ctx.throw(400, err.message);
    }
  }
};