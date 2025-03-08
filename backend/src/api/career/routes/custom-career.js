module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/careers/featured',
      handler: 'career.featured',
      config: {
        policies: ['public-career'],
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/careers/department/:department',
      handler: 'career.byDepartment',
      config: {
        policies: ['public-career'],
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/careers/search',
      handler: 'career.search',
      config: {
        policies: ['public-career'],
        auth: false
      }
    }
  ]
};