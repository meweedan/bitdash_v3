// backend/src/api/customer-profile/routes/custom.js
module.exports = {
  routes: [
    // Public profile route
    {
      method: 'GET',
      path: '/customers/:profileId/public',
      handler: 'customer-profile.getPublicProfile',
      config: {
        auth: false,
        policies: ['is-public-profile']
      }
    },
    // Generate/Get QR code
    {
      method: 'GET',
      path: '/customers/:id/qr',
      handler: 'customer-profile.generateWalletQR',
      config: {
        policies: []
      }
    },
    // Verify customer wallet
    {
      method: 'POST',
      path: '/customers/:id/verify-wallet',
      handler: 'customer-profile.verifyWallet',
      config: {
        policies: []
      }
    },
    // Get wallet balance
    {
      method: 'GET',
      path: '/customers/:id/balance',
      handler: 'customer-profile.getWalletBalance',
      config: {
        policies: []
      }
    },
    // Get transactions
    {
      method: 'GET',
      path: '/customers/:id/transactions',
      handler: 'customer-profile.getTransactions',
      config: {
        policies: []
      }
    }
  ]
};