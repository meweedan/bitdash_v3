module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/restaurants',
      handler: 'restaurant.find',
    },
    {
      method: 'GET',
      path: '/restaurants/:id',
      handler: 'restaurant.findOne',
    },
    {
      method: 'POST',
      path: '/restaurants',
      handler: 'restaurant.create',
    },
    {
      method: 'PUT',
      path: '/restaurants/:id',
      handler: 'restaurant.update',
    },
    {
      method: 'DELETE',
      path: '/restaurants/:id',
      handler: 'restaurant.delete',
    },
    {
      method: 'GET',
      path: '/restaurants/:id/public-menu',
      handler: 'restaurant.publicMenu',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};