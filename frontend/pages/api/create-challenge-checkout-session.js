// pages/api/create-challenge-checkout-session.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { challengeType, price, userId, customerId } = req.body;

    // Get challenge details from your config
    const challengeDetails = {
      name: `${challengeType.charAt(0).toUpperCase() + challengeType.slice(1)} Challenge`,
      price: price
    };

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: challengeDetails.name,
              description: `Trading Challenge - ${challengeDetails.name}`,
            },
            unit_amount: price * 100, // convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/signup/challenger?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/signup/challenger?canceled=true`,
      metadata: {
        userId,
        customerId,
        challengeType
      }
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
}