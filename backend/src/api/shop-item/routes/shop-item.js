module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/shop-items',
      handler: 'shop-item.find',
      config: {
        auth: {
          scope: ['api::shop-item.shop-item.find']
        }
      }
    },
    {
      method: 'GET',
      path: '/shop-items/:id',
      handler: 'shop-item.findOne',
      config: {
        auth: {
          scope: ['api::shop-item.shop-item.findOne']
        }
      }
    },
    {
      method: 'POST',
      path: '/shop-items',
      handler: 'shop-item.create',
      config: {
        auth: {
          scope: ['api::shop-item.shop-item.create']
        }
      }
    },
    {
      method: 'PUT',
      path: '/shop-items/:id',
      handler: 'shop-item.update',
      config: {
        auth: {
          scope: ['api::shop-item.shop-item.update']
        },
        policies: ['is-item-owner']
      }
    },
    {
      method: 'DELETE',
      path: '/shop-items/:id',
      handler: 'shop-item.delete',
      config: {
        auth: {
          scope: ['api::shop-item.shop-item.delete']
        },
        policies: ['is-item-owner']
      }
    },
    {
      method: 'GET',
      path: '/shop-items/:id/public',
      handler: 'shop-item.publicItem',
      config: {
        auth: false,
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'GET',
      path: '/shop-items/search',
      handler: 'shop-item.search',
      config: {
        auth: false,
        policies: [],
        middlewares: []
      }
    }
  ]
};