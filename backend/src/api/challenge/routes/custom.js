module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/challenges/:id/cancel',
      handler: 'api::challenge.challenge.cancel',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: ['api::challenge.challenge.update']
        }
      }
    }
  ]
};