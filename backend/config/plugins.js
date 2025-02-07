module.exports = ({ env }) => ({
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
    },
  },
  'i18n': {
    enabled: false,
  },
  'upload': {
    config: {
      provider: 'local',
      actionOptions: {
        upload: {
          enabled: true,
        },
        uploadStream: {
          enabled: true,
        },
        delete: {
          enabled: true,
        },
      },
    },
  },
});
