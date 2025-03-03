// frontend/pages/api/create-challenge-checkout-session.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  console.log('Creating checkout session...');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { challengeType, price, userId, customerId } = req.body;
    
    console.log('Request data:', { challengeType, price, userId, customerId });
    
    // Validate required parameters
    if (!challengeType || !price || !userId || !customerId) {
      console.error('Missing required parameters');
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${challengeType.charAt(0).toUpperCase() + challengeType.slice(1)} Challenge`,
              description: 'Prop Trading Challenge',
            },
            unit_amount: price * 100, // Convert to cents
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

    console.log('Session created:', session.id);
    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Stripe session creation error:', error);
    res.status(500).json({ error: error.message });
  }
}