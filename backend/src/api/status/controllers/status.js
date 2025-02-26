'use strict';

/**
 * Status controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::status.status', ({ strapi }) => ({
  async find(ctx) {
    // Default query parameters
    const { platform = 'all' } = ctx.query;
    
    // Build the query
    let query = {
      filters: {
        $or: [
          { platform: platform },
          { platform: 'all' }
        ]
      },
      sort: { name: 'asc' }
    };
    
    // Execute the query
    const { results, pagination } = await strapi.service('api::status.status').find(query);
    
    // Calculate overall status
    const overallStatus = this.calculateOverallStatus(results);
    
    // Return the results with additional metadata
    return {
      data: results,
      meta: {
        pagination,
        overallStatus,
        lastUpdated: new Date().toISOString()
      }
    };
  },
  
  // Helper to calculate overall system status
  calculateOverallStatus(services) {
    if (services.length === 0) return 'unknown';
    
    const statusPriority = {
      'outage': 3,
      'degraded': 2,
      'maintenance': 1,
      'operational': 0
    };
    
    // Find the highest priority (worst) status
    let worstStatus = 'operational';
    let worstPriority = 0;
    
    services.forEach(service => {
      const priority = statusPriority[service.status] || 0;
      if (priority > worstPriority) {
        worstPriority = priority;
        worstStatus = service.status;
      }
    });
    
    return worstStatus;
  },
  
  // Custom endpoint to get a health summary
  async health(ctx) {
    const { platform = 'all' } = ctx.query;
    
    // Get basic status counts
    const counts = await strapi.db.query('api::status.status').count({
      where: {
        $or: [
          { platform },
          { platform: 'all' }
        ]
      },
      groupBy: ['status']
    });
    
    // Calculate overall health percentage
    const services = await strapi.db.query('api::status.status').findMany({
      where: {
        $or: [
          { platform },
          { platform: 'all' }
        ]
      }
    });
    
    // Simple health calculation (can be made more sophisticated)
    const totalServices = services.length;
    const operationalCount = services.filter(s => s.status === 'operational').length;
    const healthPercentage = totalServices > 0 ? (operationalCount / totalServices * 100).toFixed(2) : 100;
    
    return {
      platform,
      health: parseFloat(healthPercentage),
      status: this.calculateOverallStatus(services),
      counts,
      updatedAt: new Date().toISOString()
    };
  }
}));