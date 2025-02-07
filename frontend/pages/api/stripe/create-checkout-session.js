// pages/api/stripe/create-checkout-session.js
import Stripe from 'stripe';
import { getPlanById } from '@/config/subscriptionConfig';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      planId,
      platform,
      userId,
      operatorId,
      email,
      priceAmount,
      successUrl,
      cancelUrl,
      customerName,
      businessName
    } = req.body;

    // Create or get product
    const product = await stripe.products.create({
      name: `${platform.toUpperCase()} ${planId.toUpperCase()} Plan - ${businessName}`,
      description: `Subscription for ${businessName}`,
    });

    // Create price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(priceAmount * 100), // Convert to cents
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: email,
      metadata: {
        userId,
        operatorId,
        platform,
        planId,
        businessName
      },
      subscription_data: {
        metadata: {
          userId,
          operatorId,
          platform,
          planId,
          businessName
        }
      },
      customer_creation: 'always',
      allow_promotion_codes: true
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe session creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
}