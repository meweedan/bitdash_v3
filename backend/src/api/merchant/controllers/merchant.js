'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const crypto = require('crypto');

module.exports = createCoreController('api::merchant.merchant', ({ strapi }) => ({
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

  // Find Nearest Merchants
  async findNearestMerchants(ctx) {
    try {
      const { latitude, longitude, radius = 10 } = ctx.query;

      // Convert radius to kilometers
      const radiusInKm = parseFloat(radius);

      // Fetch all merchants with location
      const merchants = await strapi.entityService.findMany('api::merchant.merchant', {
        filters: {
          status: 'active',
          location: { $notNull: true }
        },
        populate: { 
          location: true, 
          contact: true 
        }
      });

      // Manual distance calculation
      const formattedMerchants = merchants
        .map(merchant => {
          if (!merchant.location?.coordinates?.lat || !merchant.location?.coordinates?.lng) return null;

          const distance = this.calculateDistance(
            parseFloat(latitude), 
            parseFloat(longitude), 
            merchant.location.coordinates.lat, 
            merchant.location.coordinates.lng
          );

          return distance <= radiusInKm ? {
            id: merchant.id,
            name: merchant.businessName,
            address: merchant.location?.address,
            latitude: merchant.location.coordinates.lat,
            longitude: merchant.location.coordinates.lng,
            distance,
            businessType: merchant.businessType
          } : null;
        })
        .filter(Boolean) // Remove null entries
        .sort((a, b) => a.distance - b.distance);

      return ctx.send({
        data: formattedMerchants
      });
    } catch (error) {
      console.error('Nearest merchants error:', error);
      return ctx.throw(500, 'Error finding nearest merchants');
    }
  },

  // Get All Locations for Mapping
  async findAllLocations(ctx) {
    try {
      const merchants = await strapi.entityService.findMany('api::merchant.merchant', {
        filters: { 
          status: 'active',
          verificationStatus: 'verified'
        },
        populate: { 
          location: true, 
          contact: true 
        }
      });

      const formattedLocations = merchants
        .filter(merchant => merchant.location?.coordinates)
        .map(merchant => ({
          id: `merchant-${merchant.id}`,
          name: merchant.businessName,
          type: 'merchant',
          latitude: merchant.location.coordinates.lat,
          longitude: merchant.location.coordinates.lng,
          address: merchant.location.address || '',
          businessType: merchant.businessType
        }));

      return {
        data: formattedLocations,
        meta: {
          total: formattedLocations.length
        }
      };
    } catch (error) {
      console.error('Find all merchant locations error:', error);
      return ctx.badRequest('Something went wrong');
    }
  },

  // Update Merchant Location
  async updateMerchantLocation(ctx) {
    try {
      const { id } = ctx.state.user.merchant;
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

      const updatedMerchant = await strapi.entityService.update('api::merchant.merchant', id, {
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
          location: updatedMerchant.location,
          lastUpdate: updatedMerchant.lastLocationUpdate
        }
      });
    } catch (error) {
      console.error('Update merchant location error:', error);
      return ctx.throw(500, 'Failed to update location');
    }
  },

  // Get Verification Status
  async getVerificationStatus(ctx) {
    try {
      const { id } = ctx.state.user.merchant;
      const merchant = await strapi.entityService.findOne('api::merchant.merchant', id, {
        fields: ['verificationStatus']
      });

      return ctx.send({
        verificationStatus: merchant.verificationStatus
      });
    } catch (error) {
      console.error('Verification status error:', error);
      return ctx.throw(500, 'Error retrieving verification status');
    }
  },

  // Submit Verification Documents
  async submitVerification(ctx) {
    try {
      const { id } = ctx.state.user.merchant;
      const { documents } = ctx.request.body;

      // Validate documents
      if (!documents || !Array.isArray(documents) || documents.length === 0) {
        return ctx.badRequest('Invalid or missing verification documents');
      }

      const updatedMerchant = await strapi.entityService.update('api::merchant.merchant', id, {
        data: {
          verificationStatus: 'pending',
          verificationDocuments: documents
        }
      });

      return ctx.send({
        message: 'Verification documents submitted successfully',
        status: updatedMerchant.verificationStatus
      });
    } catch (error) {
      console.error('Submit verification error:', error);
      return ctx.throw(500, 'Failed to submit verification documents');
    }
  },

  // Sync Wallet
  async syncWallet(ctx) {
    try {
      const { id } = ctx.params;
      
      // Find merchant with wallet populated
      const merchant = await strapi.entityService.findOne(
        'api::merchant.merchant',
        id,
        { populate: ['wallet'] }
      );

      if (!merchant) {
        return ctx.notFound('Merchant not found');
      }

      // Calculate total balance from transactions or other sources
      const totalBalance = await this.calculateMerchantBalance(merchant.id);

      // Create wallet if it doesn't exist
      if (!merchant.wallet) {
        const newWallet = await strapi.entityService.create('api::wallet.wallet', {
          data: {
            balance: totalBalance,
            merchant: merchant.id,
            lastActivity: new Date()
          }
        });
        
        await strapi.entityService.update('api::merchant.merchant', id, {
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
        merchant.wallet.id,
        { data: { balance: totalBalance } }
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

  // Calculate Merchant Balance (example implementation)
  async calculateMerchantBalance(merchantId) {
    try {
      // Fetch total successful transactions
      const transactions = await strapi.entityService.findMany('api::transaction.transaction', {
        filters: {
          merchant: merchantId,
          status: 'successful'
        }
      });

      // Sum up transaction amounts
      return transactions.reduce((total, transaction) => total + transaction.amount, 0);
    } catch (error) {
      console.error('Balance calculation error:', error);
      return 0;
    }
  },

  // Get Merchant Balance
  async getBalance(ctx) {
    try {
      const { id } = ctx.state.user.merchant;
      
      const wallet = await strapi.entityService.findOne('api::wallet.wallet', id, {
        filters: { merchant: id }
      });

      return ctx.send({
        balance: wallet?.balance || 0
      });
    } catch (error) {
      console.error('Get balance error:', error);
      return ctx.throw(500, 'Failed to retrieve balance');
    }
  },

  // Get Payment Links
  async getPaymentLinks(ctx) {
    try {
      const { id } = ctx.state.user.merchant;
      
      const paymentLinks = await strapi.entityService.findMany('api::payment-link.payment-link', {
        filters: { merchant: id },
        sort: { createdAt: 'desc' }
      });

      return ctx.send({
        data: paymentLinks
      });
    } catch (error) {
      console.error('Get payment links error:', error);
      return ctx.throw(500, 'Failed to retrieve payment links');
    }
  },

  // Create Payment Link
  async createPaymentLink(ctx) {
    try {
      const { id } = ctx.state.user.merchant;
      const { 
        amount, 
        currency, 
        description, 
        expiresAt 
      } = ctx.request.body;

      // Generate unique payment link
      const uniqueCode = crypto.randomBytes(16).toString('hex');

      const paymentLink = await strapi.entityService.create('api::payment-link.payment-link', {
        data: {
          merchant: id,
          amount,
          currency,
          description,
          uniqueCode,
          expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
          status: 'active'
        }
      });

      return ctx.created({
        data: paymentLink,
        link: `${process.env.FRONTEND_URL}/${uniqueCode}`
      });
    } catch (error) {
      console.error('Create payment link error:', error);
      return ctx.throw(500, 'Failed to create payment link');
    }
  },

  // Get Transactions
  async getTransactions(ctx) {
    try {
      const { id } = ctx.state.user.merchant;
      const { page = 1, pageSize = 20 } = ctx.query;

      const transactions = await strapi.entityService.findMany('api::transaction.transaction', {
        filters: { merchant: id },
        sort: { createdAt: 'desc' },
        start: (page - 1) * pageSize,
        limit: pageSize,
        populate: ['payment_link', 'wallet']
      });

      const total = await strapi.entityService.count('api::transaction.transaction', {
        filters: { merchant: id }
      });

      return ctx.send({
        data: transactions,
        meta: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      });
    } catch (error) {
      console.error('Get transactions error:', error);
      return ctx.throw(500, 'Failed to retrieve transactions');
    }
  },

  // Get Merchant Settings
  async getSettings(ctx) {
    try {
      const { id } = ctx.state.user.merchant;
      
      const merchant = await strapi.entityService.findOne('api::merchant.merchant', id, {
        populate: ['settings']
      });

      return ctx.send({
        data: merchant.settings || {}
      });
    } catch (error) {
      console.error('Get settings error:', error);
      return ctx.throw(500, 'Failed to retrieve merchant settings');
    }
  },

  // Update Merchant Settings
  async updateSettings(ctx) {
    try {
      const { id } = ctx.state.user.merchant;
      const settingsUpdate = ctx.request.body;

      const updatedMerchant = await strapi.entityService.update('api::merchant.merchant', id, {
        data: {
          settings: settingsUpdate
        }
      });

      return ctx.send({
        data: updatedMerchant.settings
      });
    } catch (error) {
      console.error('Update settings error:', error);
      return ctx.throw(500, 'Failed to update merchant settings');
    }
  }
}));