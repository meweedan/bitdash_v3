'use strict';

module.exports = {
  routes: [
    // Standard CRUD Endpoints
    {
      method: 'GET',
      path: '/agents',
      handler: 'agent.find',
      config: { policies: [] }
    },
    {
      method: 'GET',
      path: '/agents/:id',
      handler: 'agent.findOne',
      config: { policies: [] }
    },
    {
      method: 'POST',
      path: '/agents',
      handler: 'agent.create',
      config: { policies: [] }
    },
    {
      method: 'PUT',
      path: '/agents/:id',
      handler: 'agent.update',
      config: { policies: [] }
    },
    {
      method: 'DELETE',
      path: '/agents/:id',
      handler: 'agent.delete',
      config: { policies: [] }
    },

    // Custom Sync Wallet Endpoint
    {
      method: 'POST',
      path: '/agents/:id/sync-wallet',
      handler: 'agent.syncWallet',
      config: {
        policies: [],
        description: 'Sync agent wallet with cash balance'
      }
    },
    {
    method: 'PUT',
    path: '/agents/me/location',
    handler: 'api::agent.agent.updateAgentLocation',
    config: {
    policies: ['global::is-authenticated']
    }
    },
    {
    method: 'GET',
    path: '/agents/nearest',
    handler: 'api::agent.agent.findNearestAgents',
    config: {
    policies: [] // Optional: add authentication if needed
    }
   },
    {
      method: 'GET',
      path: '/agents/map/locations',
      handler: 'agent.findAllLocations',
      config: {
        auth: false,
        policies: ['public-locations']
      }
    }
  ]
};