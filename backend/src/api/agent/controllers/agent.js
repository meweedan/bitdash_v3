'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::agent.agent', ({ strapi }) => ({
  // Standard CRUD operations are inherited automatically

  // Custom sync-wallet endpoint
  async syncWallet(ctx) {
    try {
      const { id } = ctx.params;
      
      // Find agent with wallet populated
      const agent = await strapi.entityService.findOne(
        'api::agent.agent',
        id,
        { populate: ['wallet'] }
      );

      if (!agent) {
        return ctx.notFound('Agent not found');
      }

      // Create wallet if it doesn't exist
      if (!agent.wallet) {
        const newWallet = await strapi.entityService.create('api::wallet.wallet', {
          data: {
            balance: agent.cashBalance,
            agent: agent.id,
            lastActivity: new Date()
          }
        });
        
        await strapi.entityService.update('api::agent.agent', id, {
          data: { wallet: newWallet.id }
        });
        
        return ctx.send({
          success: true,
          message: 'Wallet created and synced',
          balance: newWallet.balance
        });
      }

      // Update existing wallet
      const updatedWallet = await strapi.entityService.update(
        'api::wallet.wallet',
        agent.wallet.id,
        { data: { balance: agent.cashBalance } }
      );

      return ctx.send({
        success: true,
        message: 'Wallet synced',
        balance: updatedWallet.balance
      });

    } catch (error) {
      console.error('Wallet sync error:', error);
      return ctx.throw(500, 'Wallet synchronization failed');
    }
  },
   // Haversine formula for distance calculation
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  async findNearestAgents(ctx) {
  try {
    const { latitude, longitude, radius = 10 } = ctx.query;

    // Convert radius to kilometers
    const radiusInKm = parseFloat(radius);

    // Fetch all agents with location
    const agents = await strapi.entityService.findMany('api::agent.agent', {
      filters: {
        status: 'active',
        location: { $notNull: true }
      },
      populate: { 
        location: true, 
        operator: {
          fields: ['fullName']
        }
      }
    });

    // Manual distance calculation
    const formattedAgents = agents
      .map(agent => {
        if (!agent.location?.coordinates?.lat || !agent.location?.coordinates?.lng) return null;

        const distance = this.calculateDistance(
          parseFloat(latitude), 
          parseFloat(longitude), 
          agent.location.coordinates.lat, 
          agent.location.coordinates.lng
        );

        return distance <= radiusInKm ? {
          id: agent.id,
          name: agent.operator?.fullName || 'Agent',
          address: agent.location?.address,
          latitude: agent.location.coordinates.lat,
          longitude: agent.location.coordinates.lng,
          distance
        } : null;
      })
      .filter(Boolean) // Remove null entries
      .sort((a, b) => a.distance - b.distance);

    return ctx.send({
      data: formattedAgents
    });
  } catch (error) {
    console.error('Nearest agents error:', error);
    return ctx.throw(500, 'Error finding nearest agents');
  }
},


    async findAllLocations(ctx) {
  try {
    // Fetch Agents with pagination
    const agents = await strapi.entityService.findMany('api::agent.agent', {
      filters: { 
        status: 'active',
      },
      populate: { 
        location: true, 
        operator: {
          fields: ['fullName']
        },
        ratingScore: true
      }
    });

    // Format response - only include agents with valid locations
    const formattedLocations = agents
      .filter(agent => agent.location && agent.location.coordinates)
      .map(agent => ({
        id: `agent-${agent.id}`,
        name: agent.operator?.fullName || 'Adfaaly Agent',
        type: 'agent',
        latitude: agent.location.coordinates.lat,
        longitude: agent.location.coordinates.lng,
        address: agent.location.address || '',
        rating: agent.ratingScore || 0
      }));

    return {
      data: formattedLocations,
      meta: {
        total: formattedLocations.length
      }
    };

  } catch (error) {
    console.error('Find all locations error:', error);
    return ctx.badRequest('Something went wrong');
  }
},

  // Add input validation
  async updateAgentLocation(ctx) {
    try {
      const { id } = ctx.state.user;
      const { address, coordinates } = ctx.request.body;

      // Validate coordinates
      if (!coordinates?.latitude || !coordinates?.longitude) {
        return ctx.badRequest('Invalid coordinates');
      }

      // Validate latitude and longitude ranges
      if (coordinates.latitude < -90 || coordinates.latitude > 90 ||
          coordinates.longitude < -180 || coordinates.longitude > 180) {
        return ctx.badRequest('Invalid coordinate ranges');
      }

      const agent = await strapi.entityService.findMany('api::agent.agent', {
        filters: { users_permissions_user: id },
        populate: { users_permissions_user: true }
      });

      if (!agent || agent.length === 0) {
        return ctx.notFound('Agent not found');
      }

      const updatedAgent = await strapi.entityService.update('api::agent.agent', agent[0].id, {
        data: {
          location: {
            address,
            coordinates: {
              lat: coordinates.latitude,
              lng: coordinates.longitude
            },
            type: 'Point'
          },
          lastLocationUpdate: new Date()
        }
      });

      return ctx.send({
        data: {
          location: updatedAgent.location,
          lastUpdate: updatedAgent.lastLocationUpdate
        }
      });
    } catch (error) {
      return ctx.throw(500, 'Failed to update location');
    }
  }
}));