module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/auth/register',
      handler: 'register.register',
      config: {
        auth: false,
        policies: [],
        description: 'Register a new user',
        tags: ['Authentication'],
      },
    },
  ],
};