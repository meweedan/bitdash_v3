module.exports = {
  routes: [
    // Standard CRUD Endpoints
    {
      method: 'GET',
      path: '/merchants',
      handler: 'merchant.find',
      config: { 
        policies: [],
        description: 'List all merchants'
      }
    },
    {
      method: 'GET',
      path: '/merchants/:id',
      handler: 'merchant.findOne',
      config: { 
        policies: [],
        description: 'Get a specific merchant by ID'
      }
    },
    {
      method: 'POST',
      path: '/merchants',
      handler: 'merchant.create',
      config: { 
        policies: ['global::is-authenticated'],
        description: 'Create a new merchant'
      }
    },
    {
      method: 'PUT',
      path: '/merchants/:id',
      handler: 'merchant.update',
      config: { 
        policies: ['global::is-authenticated'],
        description: 'Update an existing merchant'
      }
    },
    {
      method: 'DELETE',
      path: '/merchants/:id',
      handler: 'merchant.delete',
      config: { 
        policies: ['global::is-authenticated', 'is-merchant-owner'],
        description: 'Delete a merchant'
      }
    },

    // Custom Location Routes
    {
      method: 'GET',
      path: '/merchants/nearest',
      handler: 'merchant.findNearestMerchants',
      config: {
        policies: [],
        description: 'Find nearest merchants based on coordinates'
      }
    },
    {
      method: 'GET',
      path: '/merchants/map/locations',
      handler: 'merchant.findAllLocations',
      config: {
        auth: false,
        policies: ['public-locations'],
        description: 'Get all merchant locations for mapping'
      }
    },
    {
      method: 'PUT',
      path: '/merchants/me/location',
      handler: 'merchant.updateMerchantLocation',
      config: {
        policies: ['global::is-authenticated'],
        description: 'Update merchant\'s current location'
      }
    },

    // Merchant Verification Routes
    {
      method: 'GET',
      path: '/merchants/verification-status',
      handler: 'merchant.getVerificationStatus',
      config: {
        policies: ['global::is-authenticated'],
        description: 'Get merchant\'s verification status'
      }
    },
    {
      method: 'POST',
      path: '/merchants/submit-verification',
      handler: 'merchant.submitVerification',
      config: {
        policies: ['global::is-authenticated'],
        description: 'Submit merchant verification documents'
      }
    },

    // Wallet and Financial Routes
    {
      method: 'POST',
      path: '/merchants/:id/sync-wallet',
      handler: 'merchant.syncWallet',
      config: {
        policies: ['global::is-authenticated'],
        description: 'Sync merchant wallet with current balance'
      }
    },
    {
      method: 'GET',
      path: '/merchants/me/balance',
      handler: 'merchant.getBalance',
      config: {
        policies: ['global::is-authenticated'],
        description: 'Get current merchant wallet balance'
      }
    },

    // Payment Link Routes
    {
      method: 'GET',
      path: '/merchants/me/payment-links',
      handler: 'merchant.getPaymentLinks',
      config: {
        policies: ['global::is-authenticated'],
        description: 'Get merchant\'s payment links'
      }
    },
    {
      method: 'POST',
      path: '/merchants/me/payment-links',
      handler: 'merchant.createPaymentLink',
      config: {
        policies: ['global::is-authenticated'],
        description: 'Create a new payment link'
      }
    },

    // Transaction Routes
    {
      method: 'GET',
      path: '/merchants/me/transactions',
      handler: 'merchant.getTransactions',
      config: {
        policies: ['global::is-authenticated'],
        description: 'Get merchant\'s transaction history'
      }
    },

    // Settings Routes
    {
      method: 'GET',
      path: '/merchants/me/settings',
      handler: 'merchant.getSettings',
      config: {
        policies: ['global::is-authenticated'],
        description: 'Get merchant account settings'
      }
    },
    {
      method: 'PUT',
      path: '/merchants/me/settings',
      handler: 'merchant.updateSettings',
      config: {
        policies: ['global::is-authenticated'],
        description: 'Update merchant account settings'
      }
    }
  ]
};