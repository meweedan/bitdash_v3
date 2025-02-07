module.exports = {
  routes: [
    // Public Payment Link Route
    {
      method: 'GET',
      path: '/payment-links/:linkId/public',
      handler: 'payment-link.publicPaymentLink',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    // Process payment route
    {
      method: 'POST',
      path: '/payment-links/process',
      handler: 'payment-link.processPayment',
      config: {
        policies: [],
      },
    },
    
    // Create Payment Link
    {
      method: 'POST',
      path: '/payment-links',
      handler: 'payment-link.create',
      config: {
        policies: [],
      },
    },
    
    // Delete Payment Link
    {
      method: 'DELETE',
      path: '/payment-links/:id',
      handler: 'payment-link.delete',
      config: {
        policies: [],
      },
    },
    
    // Find Payment Links (List)
    {
      method: 'GET',
      path: '/payment-links',
      handler: 'payment-link.find',
      config: {
        policies: [],
      },
    },
    
    // Find One Payment Link
    {
      method: 'GET',
      path: '/payment-links/:id',
      handler: 'payment-link.findOne',
      config: {
        policies: [],
      },
    },
    
    // Update Payment Link
    {
      method: 'PUT',
      path: '/payment-links/:id',
      handler: 'payment-link.update',
      config: {
        policies: [],
      },
    }
  ]
};