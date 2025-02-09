const { i18n } = require('./next-i18next.config');

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /^https:\/\/tile\.openstreetmap\.org\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'map-tiles',
        expiration: {
          maxEntries: 1000,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  i18n,
  trailingSlash: true,

  images: {
    unoptimized: true,
    domains: ['bitdash-backend.onrender.com']
  },

  // Subdomain redirects
  async redirects() {
    return [
      {
        source: '/food',
        has: [{ type: 'host', value: 'bitdash.app' }],
        destination: 'https://food.bitdash.app',
        permanent: true
      },
      {
        source: '/shop',
        has: [{ type: 'host', value: 'bitdash.app' }],
        destination: 'https://shop.bitdash.app',
        permanent: true
      },
      {
        source: '/ride',
        has: [{ type: 'host', value: 'bitdash.app' }],
        destination: 'https://ride.bitdash.app',
        permanent: true
      },
      {
        source: '/cash',
        has: [{ type: 'host', value: 'bitdash.app' }],
        destination: 'https://cash.bitdash.app',
        permanent: true
      },
      {
        source: '/work',
        has: [{ type: 'host', value: 'bitdash.app' }],
        destination: 'https://work.bitdash.app',
        permanent: true
      }
    ];
  },

  webpack: (config, { isServer, dev }) => {
    // Existing aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-qr-reader': 'react-qr-reader-es6',
    };

    // Fallbacks for client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        canvas: false,
        net: false,
        tls: false,
        'canvas-prebuilt': false,
      };

      // Handle worker-loader for maplibre-gl without filename
      config.module.rules.push({
        test: /maplibre-gl.*\.worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: {
            publicPath: '/_next/',
          },
        },
      });
    }

    // Production optimizations
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: false,
            vendors: false,
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                // get the name. E.g. node_modules/packageName/not/this/part.js
                // or node_modules/packageName
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                )?.[1];
                return packageName ? `npm.${packageName.replace('@', '')}` : null;
              },
              chunks: 'all',
            },
          },
        },
      };
    }

    return config;
  },

  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  }
};

module.exports = withPWA(nextConfig);