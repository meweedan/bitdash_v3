'use strict';

/**
 * Status router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
  routes: [
    // Default find route with public policy
    {
      method: 'GET',
      path: '/status',
      handler: 'status.find',
      config: {
        policies: ['api::status.public-status']
      }
    },
    
    // Default findOne route with public policy
    {
      method: 'GET',
      path: '/status/:id',
      handler: 'status.findOne',
      config: {
        policies: ['api::status.public-status']
      }
    },
    
    // Custom health endpoint with public policy
    {
      method: 'GET',
      path: '/status/health',
      handler: 'status.health',
      config: {
        policies: ['api::status.public-status']
      }
    },
    
    // Explicitly public endpoint with a different path
    {
      method: 'GET',
      path: '/public/status',
      handler: 'status.find',
      config: {
        policies: ['api::status.public-status']
      }
    },
    
    // Protected admin routes require authentication
    {
      method: 'POST',
      path: '/status',
      handler: 'status.create',
      config: {
        policies: ['admin::isAuthenticatedAdmin']
      }
    },
    {
      method: 'PUT',
      path: '/status/:id',
      handler: 'status.update',
      config: {
        policies: ['admin::isAuthenticatedAdmin']
      }
    },
    {
      method: 'DELETE',
      path: '/status/:id',
      handler: 'status.delete',
      config: {
        policies: ['admin::isAuthenticatedAdmin']
      }
    }
  ]
};