'use strict';

const Stripe = require('stripe');
const { verify } = require('jsonwebtoken');
// If you have a local function to map plan => priceId
// adjust the import path to match your project
const { getPlanStripePriceId } = require('@/config/subscriptionConfig');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Verify a JWT token
 */
async function verifyToken(token) {
  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Invalid token');
  }
}

/**
 * Create a Stripe subscription checkout session
 */
async function createCheckoutSession({
  platform,
  tier,
  currency = 'usd',
  successUrl,
  cancelUrl,
  customerEmail,
  metadata = {},
}) {
  const priceId = getPlanStripePriceId(platform, tier);
  if (!priceId) {
    throw new Error('Invalid plan selected');
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    allow_promotion_codes: true,
    metadata: {
      platform,
      tier,
      ...metadata,
    },
  });

  return session;
}

module.exports = {
  stripe,
  verifyToken,
  createCheckoutSession,
};
