'use strict';

module.exports = {
  async createCheckoutSession(ctx) {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { challengeId } = ctx.request.body;

    // Challenge configuration
    const challenges = {
      'standard-challenge': {
        name: 'Standard Challenge',
        description: 'Perfect for beginners starting their prop trading journey',
        amount: 9900,  // $99.00 in cents
        metadata: {
          account_size: 10000,
          duration_days: 30,
          profit_target_percent: 8
        }
      },
      'professional-challenge': {
        name: 'Professional Challenge',
        description: 'For experienced traders looking for a larger capital allocation',
        amount: 19900,  // $199.00 in cents
        metadata: {
          account_size: 50000,
          duration_days: 60,
          profit_target_percent: 10
        }
      },
      'elite-challenge': {
        name: 'Elite Challenge',
        description: 'For professional traders with proven track records',
        amount: 29900,  // $299.00 in cents
        metadata: {
          account_size: 100000,
          duration_days: 60,
          profit_target_percent: 12
        }
      },
      'super-challenge': {
        name: 'Super Challenge',
        description: 'Our highest tier for elite traders seeking maximum capital',
        amount: 59900,  // $599.00 in cents
        metadata: {
          account_size: 200000,
          duration_days: 90,
          profit_target_percent: 15
        }
      }
    };

    // Validate challenge exists
    if (!challenges[challengeId]) {
      return ctx.throw(400, 'Invalid challenge selected');
    }

    const challenge = challenges[challengeId];

    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: challenge.name,
              description: challenge.description,
              metadata: challenge.metadata
            },
            unit_amount: challenge.amount
          },
          quantity: 1
        }],
        success_url: `${process.env.FRONTEND_URL}/fund/challenger/dashboard?success=true&challenge=${challengeId}`,
        cancel_url: `${process.env.FRONTEND_URL}/fund/challenger/dashboard`
      });

      ctx.send({ sessionId: session.id });
    } catch (error) {
      ctx.throw(400, error.message);
    }
  }
};