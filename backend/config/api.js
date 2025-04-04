module.exports = {
  rest: {
    prefix: '/api',
    defaultLimit: 25,
    maxLimit: 100,
    withCount: true,
  },
    webhook: {
    enabled: true,
    resolve: './src/api/webhook'
  },
};
