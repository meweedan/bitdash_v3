// backend/src/api/auth/routes/auth.js
module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/auth/register',
      handler: 'auth.register',
      config: {
        auth: false,
        policies: [],
        description: 'Register a new user',
        tags: ['Authentication'],
      },
    },
    {
      method: 'POST',
      path: '/auth/login',
      handler: 'auth.login',
      config: {
        auth: false,
        policies: [],
        description: 'Login user',
        tags: ['Authentication'],
      },
    },
  ],
};