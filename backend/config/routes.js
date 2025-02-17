module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/upload/files/:id',
      handler: 'upload.findOne',
      config: {
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/upload/files',
      handler: 'upload.find',
      config: {
        auth: false
      }
    }
  ]
};