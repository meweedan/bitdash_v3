module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/owners',
      handler: 'owner.find',
      config: {
        auth: {
          scope: ['api::owner.owner.find']
        }
      }
    },
    {
      method: 'GET',
      path: '/owners/:id',
      handler: 'owner.findOne',
      config: {
        auth: {
          scope: ['api::owner.owner.findOne']
        }
      }
    },
    {
      method: 'POST',
      path: '/owners',
      handler: 'owner.create',
      config: {
        auth: {
          scope: ['api::owner.owner.create']
        }
      }
    },
    {
      method: 'PUT',
      path: '/owners/:id',
      handler: 'owner.update',
      config: {
        auth: {
          scope: ['api::owner.owner.update']
        },
        policies: ['is-owner']
      }
    },
    {
      method: 'DELETE',
      path: '/owners/:id',
      handler: 'owner.delete',
      config: {
        auth: {
          scope: ['api::owner.owner.delete']
        },
        policies: ['is-owner']
      }
    },
    {
      method: 'GET',
      path: '/owners/:id/public-shop',
      handler: 'owner.publicShop',
      config: {
        auth: false,
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'GET',
      path: '/owners/:id/stats',
      handler: 'owner.getShopStats',
      config: {
        auth: {
          scope: ['api::owner.owner.getShopStats']
        },
        policies: ['is-owner']
      }
    }
  ]
};