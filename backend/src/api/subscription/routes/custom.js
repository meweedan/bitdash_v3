module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/subscriptions/:id/cancel',
      handler: 'api::subscription.subscription.cancel',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: ['api::subscription.subscription.update']
        }
      }
    }
  ]
};