module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/webhook/stripe',
      handler: 'webhook.stripe',
      config: {
        auth: false,
        policies: [],
        middlewares: []
      }
    }
  ]
};