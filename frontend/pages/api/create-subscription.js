// /api/create-subscription
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { priceId, currency, successUrl, cancelUrl } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  try {
    // Verify token and get user
    const user = await verifyToken(token);
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      currency: currency.toLowerCase(),
      customer_email: user.email,
      metadata: {
        userId: user.id,
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(500).json({ error: error.message });
  }
}