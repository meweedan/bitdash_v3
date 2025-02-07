// api/menu/routes/menu.js
'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/menus',
      handler: 'menu.find',
    },
    {
      method: 'GET',
      path: '/menus/:id',
      handler: 'menu.findOne',
    },
    {
      method: 'POST',
      path: '/menus',
      handler: 'menu.create',
    },
    {
      method: 'PUT',
      path: '/menus/:id',
      handler: 'menu.update',
    },
    {
      method: 'DELETE',
      path: '/menus/:id',
      handler: 'menu.delete',
    },
  ],
};
