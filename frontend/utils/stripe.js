// utils/stripe.js
import Stripe from 'stripe';
import { getPlanStripePriceId } from '@/config/subscriptionConfig';
import { verify } from 'jsonwebtoken';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const verifyToken = async (token) => {
  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Invalid token');
  }
};

export const createCheckoutSession = async ({
  platform,
  tier,
  currency = 'usd',
  successUrl,
  cancelUrl,
  customerEmail,
  metadata = {}
}) => {
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
    currency: currency.toLowerCase(),
    customer_email: customerEmail,
    metadata: {
      platform,
      tier,
      ...metadata
    },
    allow_promotion_codes: true,
  });

  return session;
};

export { stripe };