module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/tables',
      handler: 'table.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/tables',
      handler: 'table.find',
    },
    {
      method: 'GET',
      path: '/tables/:id',
      handler: 'table.findOne',
    },
    {
      method: 'PUT',
      path: '/tables/:id',
      handler: 'table.update',
    },
    {
      method: 'DELETE',
      path: '/tables/:id',
      handler: 'table.delete',
    },
  ]
};