// api/wallet/routes/wallet.js
'use strict';

module.exports = {
  routes: [
    // Public wallet routes
    {
      method: 'GET',
      path: '/wallets/customer/:userId/public',
      handler: 'wallet.publicWallet',
      config: {
        auth: false,
        policies: []
      }
    },
    {
      method: 'GET',
      path: '/wallets/merchant/:userId/public',
      handler: 'wallet.publicWallet',
      config: {
        auth: false,
        policies: []
      }
    },
    // Transfer route
    {
      method: 'POST',
      path: '/wallets/transfer',
      handler: 'wallet.transfer',
      config: {
        policies: []
      }
    },
    // Payment route
    {
      method: 'POST',
      path: '/wallets/payment',
      handler: 'wallet.processPayment',
      config: {
        policies: []
      }
    },
    // Standard CRUD routes
    {
      method: 'GET',
      path: '/wallets',
      handler: 'wallet.find',
    },
    {
      method: 'GET',
      path: '/wallets/:id',
      handler: 'wallet.findOne',
    },
    {
      method: 'POST',
      path: '/wallets', 
      handler: 'wallet.create',
    },
    {
      method: 'PUT',
      path: '/wallets/:id',
      handler: 'wallet.update',
    },
    {
      method: 'DELETE',
      path: '/wallets/:id',
      handler: 'wallet.delete',
    },
    // Deposit route
    {
      method: 'POST',
      path: '/wallets/deposit',
      handler: 'wallet.deposit',
      config: {
        policies: []
      }
    },
    // Withdrawal route
    {
      method: 'POST',
      path: '/wallets/withdraw',
      handler: 'wallet.withdraw',
      config: {
        policies: []
      }
    },
  ]
};