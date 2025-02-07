module.exports = [
  'strapi::errors',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: ['*'],
      origin: [
        'https://menu.bitdash.app', 
        'https://stock.bitdash.app', 
        'https://auto.bitdash.app', 
        'https://cash.bitdash.app',
        'https://shop.bitdash.app',
        'https://food.bitdash.app',
        'https://ride.bitdash.app',
        'https://eats.bitdash.app',
        'http://localhost:3000', 
        'https://bitdash-backend.onrender.com'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      credentials: true,
      keepHeaderOnError: true
    }
  },
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:', '*'],
          'img-src': ["'self'", 'data:', 'blob:', '*'],
          'media-src': ["'self'", 'data:', 'blob:', '*'],
          'upgradeInsecureRequests': null,
        },
      },
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];