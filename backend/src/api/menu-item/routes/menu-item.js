module.exports = {
   routes: [
     {
       method: 'GET',
       path: '/menu-items',
       handler: 'menu-item.find',
       config: {
         auth: false,
         policies: [],
         middlewares: [], 
       }
     },
     {
       method: 'GET',
       path: '/menu-items/:id',
       handler: 'menu-item.findOne',
       config: {
         auth: false,  
         policies: [],
         middlewares: [],
       }
     },
     {
       method: 'POST',
       path: '/menu-items',
       handler: 'menu-item.create',
     },
     {
       method: 'PUT',
       path: '/menu-items/:id',
       handler: 'menu-item.update',
     },
     {
       method: 'DELETE',
       path: '/menu-items/:id',
       handler: 'menu-item.delete',
     }
   ],
};