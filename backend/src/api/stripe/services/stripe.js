module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/stripe/create-checkout-session',
      handler: 'stripe.createCheckoutSession',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
};