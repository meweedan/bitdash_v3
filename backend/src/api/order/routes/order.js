module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/orders',
      handler: 'order.find',
    },
    {
      method: 'GET',
      path: '/orders/:id',
      handler: 'order.findOne',
    },
    {
      method: 'POST',
      path: '/orders',
      handler: 'order.create',
    },
    {
      method: 'PUT',
      path: '/orders/:id',
      handler: 'order.update',
    },
    {
      method: 'DELETE',
      path: '/orders/:id',
      handler: 'order.delete',
    },
  ],
};
