'use strict';

/**
 * Status service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::status.status', ({ strapi }) => ({
  // Add automated health check capability
  async checkHealth(serviceName) {
    try {
      const service = await strapi.db.query('api::status.status').findOne({
        where: { name: serviceName }
      });
      
      if (!service) {
        return { error: 'Service not found' };
      }
      
      // Implement service-specific health checks here
      let isHealthy = true;
      let details = {};
      
      switch (serviceName) {
        case 'Trading API':
          // Check MT5 connection or your trading API
          // isHealthy = await this.checkTradingApiHealth();
          break;
          
        case 'Web Dashboard':
          // Simple check - if this code is running, web is up
          isHealthy = true;
          break;
          
        case 'Authentication':
          // Check auth service - maybe try a test auth
          // isHealthy = await this.checkAuthServiceHealth();
          break;
          
        case 'Payment Gateway':
          // Check payment provider connection
          // isHealthy = await this.checkPaymentGatewayHealth();
          break;
          
        default:
          // Default simple check
          isHealthy = true;
      }
      
      // Update the status based on the health check
      await strapi.db.query('api::status.status').update({
        where: { id: service.id },
        data: {
          status: isHealthy ? 'operational' : 'degraded',
          // Update last_incident if there's a new problem
          last_incident: !isHealthy ? new Date() : service.last_incident
        }
      });
      
      return {
        service: serviceName,
        healthy: isHealthy,
        details
      };
    } catch (error) {
      console.error(`Health check failed for ${serviceName}:`, error);
      return { error: error.message };
    }
  },
  
  // Method to check all services
  async checkAllServices() {
    const services = await strapi.db.query('api::status.status').findMany();
    const results = [];
    
    for (const service of services) {
      const result = await this.checkHealth(service.name);
      results.push(result);
    }
    
    return results;
  },
  
  // Calculate uptime percentage based on incidents
  async updateUptimeStats() {
    const services = await strapi.db.query('api::status.status').findMany();
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    for (const service of services) {
      // You'd typically pull this from a more detailed incident log
      // This is a simplified example
      const incidents = await strapi.db.query('api::incident.incident').findMany({
        where: {
          service: service.id,
          createdAt: { $gte: thirtyDaysAgo }
        }
      });
      
      // Calculate downtime in minutes
      let downtime = 0;
      incidents.forEach(incident => {
        const start = new Date(incident.start_time);
        const end = incident.end_time ? new Date(incident.end_time) : now;
        downtime += (end - start) / (1000 * 60); // Convert to minutes
      });
      
      // Calculate uptime percentage
      const totalMinutes = 30 * 24 * 60; // 30 days in minutes
      const uptimePercentage = 100 - (downtime / totalMinutes * 100);
      
      // Update the service
      await strapi.db.query('api::status.status').update({
        where: { id: service.id },
        data: {
          uptime: Math.max(0, Math.min(100, uptimePercentage.toFixed(2)))
        }
      });
    }
  }
}));