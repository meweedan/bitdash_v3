// Path: ./src/api/career/controllers/career.js
// Extended controller for careers with additional functionality

'use strict';

/**
 * career controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::career.career', ({ strapi }) => ({
  // Extend the default find method to allow filtering
  async find(ctx) {
    // Call the default find implementation
    const { data, meta } = await super.find(ctx);
    
    return { data, meta };
  },
  
  // Add a custom featured jobs endpoint
  async featured(ctx) {
    // Set default pagination if not provided
    const { page = 1, pageSize = 3 } = ctx.query;

    // Find featured jobs
    const featuredJobs = await strapi.entityService.findMany('api::career.career', {
      filters: { featuredJob: true },
      sort: { createdAt: 'desc' },
      populate: '*',
      pagination: {
        page,
        pageSize
      }
    });
    
    // Return the sanitized data
    const sanitizedData = await this.sanitizeOutput(featuredJobs, ctx);
    
    return { 
      data: sanitizedData,
      meta: {
        pagination: {
          page,
          pageSize,
          total: await strapi.entityService.count('api::career.career', {
            filters: { featuredJob: true }
          })
        }
      }
    };
  },
  
  // Add a custom endpoint to get jobs by department
  async byDepartment(ctx) {
    const { department } = ctx.params;
    const { page = 1, pageSize = 10 } = ctx.query;
    
    // Validate department parameter
    if (!department) {
      return ctx.badRequest('Department parameter is required');
    }
    
    // Find jobs by department
    const jobs = await strapi.entityService.findMany('api::career.career', {
      filters: { department },
      sort: { createdAt: 'desc' },
      populate: '*',
      pagination: {
        page,
        pageSize
      }
    });
    
    // Return the sanitized data
    const sanitizedData = await this.sanitizeOutput(jobs, ctx);
    
    return { 
      data: sanitizedData,
      meta: {
        pagination: {
          page,
          pageSize,
          total: await strapi.entityService.count('api::career.career', {
            filters: { department }
          })
        }
      }
    };
  },
  
  // Add a custom endpoint to search jobs
  async search(ctx) {
    const { query, department, location } = ctx.query;
    const { page = 1, pageSize = 10 } = ctx.query;
    
    // Build filters
    const filters = {};
    
    // Add text search filter if query is provided
    if (query) {
      filters.$or = [
        { title: { $containsi: query } },
        { shortDescription: { $containsi: query } },
        { description: { $containsi: query } }
      ];
    }
    
    // Add department filter if provided
    if (department && department !== 'all') {
      filters.department = department;
    }
    
    // Add location filter if provided
    if (location && location !== 'all') {
      filters.location = location;
    }
    
    // Find jobs with filters
    const jobs = await strapi.entityService.findMany('api::career.career', {
      filters,
      sort: { createdAt: 'desc' },
      populate: '*',
      pagination: {
        page,
        pageSize
      }
    });
    
    // Return the sanitized data
    const sanitizedData = await this.sanitizeOutput(jobs, ctx);
    
    return { 
      data: sanitizedData,
      meta: {
        pagination: {
          page,
          pageSize,
          total: await strapi.entityService.count('api::career.career', {
            filters
          })
        }
      }
    };
  }
}));