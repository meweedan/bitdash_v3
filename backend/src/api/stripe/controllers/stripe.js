'use strict';

module.exports = {
  async createCheckoutSession(ctx) {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { planId } = ctx.request.body;

    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: planId === 'standard' ? 'Standard Plan' : 'Premium Plan',
              description: planId === 'standard' ? '2.5% commission' : '1.5% commission'
            },
            unit_amount: planId === 'standard' ? 8000 : 11000,
            recurring: { interval: 'month' }
          },
          quantity: 1
        }],
        success_url: `${process.env.FRONTEND_URL}/menu/operator/dashboard?success=true`,
        cancel_url: `${process.env.FRONTEND_URL}/menu/operator/dashboard`
      });

      ctx.send({ sessionId: session.id });
    } catch (error) {
      ctx.throw(400, error.message);
    }
  }
};