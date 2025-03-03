// pages/api/stripe/create-checkout-session.js
import Stripe from 'stripe';
import { getChallengeById } from '@/config/challengeConfig';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      challengeId,
      userId,
      email,
      successUrl = `${process.env.FRONTEND_URL}/fund/challenger/dashboard?success=true&challenge=`,
      cancelUrl = `${process.env.FRONTEND_URL}/fund/challenger/dashboard`,
      customerName,
      referralCode
    } = req.body;

    // Get challenge details
    const challenge = getChallengeById(challengeId);
    if (!challenge) {
      return res.status(400).json({ error: 'Invalid challenge selected' });
    }

    // Create product
    const product = await stripe.products.create({
      name: challenge.name,
      description: challenge.description,
      metadata: {
        challenge_id: challengeId,
        account_size: challenge.account_size,
        profit_target: challenge.profit_target,
        max_drawdown: challenge.max_drawdown,
        daily_drawdown: challenge.daily_drawdown,
        duration_days: challenge.duration_days
      }
    });

    // Create price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: challenge.price * 100, // Convert to cents
      currency: 'usd'
    });

    // Generate a complete success URL with the challenge ID
    const completeSuccessUrl = `${successUrl}${challengeId}`;

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: completeSuccessUrl,
      cancel_url: cancelUrl,
      customer_email: email,
      metadata: {
        userId,
        challengeId,
        referralCode
      },
      payment_intent_data: {
        metadata: {
          userId,
          challengeId,
          referralCode
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