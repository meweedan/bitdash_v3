'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::challenge.challenge', ({ strapi }) => ({
  /**
   * Custom "cancel" method that cancels a challenge if it has a Stripe product.
   */
  async cancel(ctx) {
    const { id } = ctx.params;

    try {
      // Find the challenge
      const challenge = await strapi.entityService.findOne('api::challenge.challenge', id, {
        populate: ['prop-trader'],
      });

      if (!challenge) {
        return ctx.notFound('Challenge not found');
      }

      // If this challenge has a Stripe product ID, cancel it in Stripe
      if (challenge.stripeProductId && process.env.STRIPE_SECRET_KEY) {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        try {
          await stripe.subscriptions.cancel(challenge.stripeProductId);
        } catch (stripeError) {
          console.error('Stripe cancellation error:', stripeError);
        }
      }

      // Update the challenge in Strapi (set status to cancelled, end_date to now)
      const updatedChallenge = await strapi.entityService.update('api::challenge.challenge', id, {
        data: {
          status: 'cancelled',
          end_date: new Date(),
        },
      });

      return {
        data: updatedChallenge,
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },
}));
