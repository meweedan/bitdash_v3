module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: 'https://bitdash-backend.onrender.com',
  proxy: true,
  app: {
    keys: env.array('APP_KEYS'),
  },
});