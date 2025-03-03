// services/product.js
module.exports = {
  getChallengeDetails: () => {
    return {
      'standard-challenge': {
        name: 'Standard Challenge',
        description: 'Perfect for beginners starting their prop trading journey',
        price: 99,
        account_size: 10000,
        profit_target: 8,
        max_drawdown: 5,
        daily_drawdown: 2,
        duration_days: 30,
        badge: 'blue'
      },
      'professional-challenge': {
        name: 'Professional Challenge',
        description: 'For experienced traders looking for a larger capital allocation',
        price: 199,
        account_size: 50000,
        profit_target: 10,
        max_drawdown: 8,
        daily_drawdown: 2,
        duration_days: 60,
        badge: 'purple'
      },
      'elite-challenge': {
        name: 'Elite Challenge',
        description: 'For professional traders with proven track records',
        price: 299,
        account_size: 100000,
        profit_target: 12,
        max_drawdown: 10,
        daily_drawdown: 2,
        duration_days: 60,
        badge: 'orange'
      },
      'super-challenge': {
        name: 'Super Challenge',
        description: 'Our highest tier for elite traders seeking maximum capital',
        price: 599,
        account_size: 200000,
        profit_target: 15,
        max_drawdown: 12,
        daily_drawdown: 3,
        duration_days: 90,
        badge: 'red'
      }
    };
  },

  createStripeCheckoutSession: async (challengeId, userId) => {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { strapi } = require('@strapi/strapi');
    
    const challengeDetails = module.exports.getChallengeDetails();
    
    if (!challengeDetails[challengeId]) {
      throw new Error('Invalid challenge selected');
    }
    
    const challenge = challengeDetails[challengeId];
    
    try {
      // Create a Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
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
            },
            unit_amount: challenge.price * 100 // Convert to cents for Stripe
          },
          quantity: 1
        }],
        metadata: {
          challenge_id: challengeId,
          user_id: userId
        },
        success_url: `${process.env.FRONTEND_URL}/fund/challenger/dashboard?success=true&challenge=${challengeId}`,
        cancel_url: `${process.env.FRONTEND_URL}/fund/challenger/dashboard`
      });

      return { sessionId: session.id };
    } catch (error) {
      console.error('Stripe session creation error:', error);
      throw new Error(`Failed to create payment session: ${error.message}`);
    }
  },

  // Process successful payment webhook from Stripe
  handleStripeWebhook: async (event) => {
    if (event.type !== 'checkout.session.completed') {
      return { received: true };
    }

    const { strapi } = require('@strapi/strapi');
    const session = event.data.object;
    
    // Extract data from session
    const { challenge_id, user_id } = session.metadata;
    
    try {
      // Create the challenge in the database
      await module.exports.createChallenge(user_id, challenge_id, session.payment_intent);
      
      return { success: true };
    } catch (error) {
      console.error('Challenge creation error:', error);
      throw new Error(`Failed to create challenge after payment: ${error.message}`);
    }
  },

  // Create a challenge in the database
  createChallenge: async (userId, challengeId, paymentIntentId) => {
    const { strapi } = require('@strapi/strapi');
    const challengeDetails = module.exports.getChallengeDetails();
    
    if (!challengeDetails[challengeId]) {
      throw new Error('Invalid challenge type');
    }

    const details = challengeDetails[challengeId];
    const now = new Date();
    const endDate = new Date(now.getTime() + (details.duration_days * 24 * 60 * 60 * 1000));

    const challenge = await strapi.entityService.create('api::challenge.challenge', {
      data: {
        type: challengeId,
        name: details.name,
        price: details.price,
        account_size: details.account_size,
        profit_target: details.profit_target,
        max_drawdown: details.max_drawdown,
        daily_drawdown: details.daily_drawdown,
        duration_days: details.duration_days,
        start_date: now,
        end_date: endDate,
        status: 'active',
        payment_id: paymentIntentId,
        user: userId
      }
    });

    return challenge;
  },

  getUserChallenges: async (userId) => {
    const { strapi } = require('@strapi/strapi');
    
    const challenges = await strapi.entityService.findMany('api::challenge.challenge', {
      filters: {
        user: userId
      },
      sort: { created_at: 'desc' }
    });

    return challenges || [];
  },

  getChallengeById: async (challengeId) => {
    const { strapi } = require('@strapi/strapi');
    
    return strapi.entityService.findOne('api::challenge.challenge', challengeId, {
      populate: ['user']
    });
  },

  updateChallengeStatus: async (challengeId, status, metrics = {}) => {
    const { strapi } = require('@strapi/strapi');
    
    const validStatuses = ['active', 'completed', 'failed', 'expired', 'pending'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid challenge status');
    }

    const challenge = await strapi.entityService.update('api::challenge.challenge', challengeId, {
      data: {
        status,
        current_profit: metrics.profit || 0,
        current_drawdown: metrics.drawdown || 0,
        last_updated: new Date(),
        ...metrics
      }
    });

    return challenge;
  }
};