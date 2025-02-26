'use strict';

/**
 * `public-status` policy
 * Allows public access to service status information 
 * while restricting sensitive operations
 */

module.exports = (policyContext, config, { strapi }) => {
  // Get request information
  const { method, path } = policyContext.request;
  
  // Allow GET requests to specific routes
  if (method === 'GET') {
    // Public routes that are always accessible
    const publicPaths = [
      '/api/status', 
      '/api/status/health',
      '/api/public/status'
    ];
    
    // Check if the current path starts with any of the public paths
    const isPublicPath = publicPaths.some(route => {
      // Exact match or path with query parameters
      return path === route || path.startsWith(`${route}?`);
    });
    
    if (isPublicPath) {
      return true;
    }
    
    // Allow access to specific status IDs
    if (/^\/api\/status\/\d+$/.test(path)) {
      return true;
    }
  }
  
  // For non-GET methods or non-public paths, require authentication
  // This delegates to the default authentication policy
  return strapi.auth.authenticate(policyContext);
};