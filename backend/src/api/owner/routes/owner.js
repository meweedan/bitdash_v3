module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/owners',
      handler: 'owner.find',
    },
    {
      method: 'GET',
      path: '/owners/:id',
      handler: 'owner.findOne',
    },
    {
      method: 'POST',
      path: '/owners',
      handler: 'owner.create',
    },
    {
      method: 'PUT',
      path: '/owners/:id',
      handler: 'owner.update',
    },
    {
      method: 'DELETE',
      path: '/owners/:id',
      handler: 'owner.delete',
    },
    {
      method: 'GET',
      path: '/owners/:id/public-shop',
      handler: 'owner.publicShop',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/owners/:id/stats',
      handler: 'owner.getShopStats',
      config: {
        auth: true,
        policies: ['is-owner']
      }
    }
  ],
};