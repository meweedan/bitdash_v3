'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const QRCode = require('qrcode');

module.exports = createCoreController('api::customer-profile.customer-profile', ({ strapi }) => ({
 // Keep the default CRUD actions
 async find(ctx) {
   const { data, meta } = await super.find(ctx);
   return { data, meta };
 },

 async findOne(ctx) {
   const { data } = await super.findOne(ctx);
   return { data };
 },

 async create(ctx) {
  try {
    // Start transaction
    const trx = await strapi.db.transaction();

    try {
      // 1. Create customer profile with existing logic
      const profile = await super.create(ctx);

      // 2. Create associated wallet
      const walletData = {
        data: {
          balance: 0,
          currency: 'LYD',
          isActive: true,
          walletId: `CW${Date.now()}`,
          dailyLimit: 5000,
          monthlyLimit: 50000,
          lastActivity: new Date().toISOString(),
          customer: profile.data.id
        }
      };

      const wallet = await strapi.entityService.create('api::wallet.wallet', walletData);

      // 3. Update profile with wallet reference and status
      await strapi.entityService.update('api::customer-profile.customer-profile', profile.data.id, {
        data: {
          wallet: wallet.id,
          wallet_status: 'active'
        }
      });

      await trx.commit();

      // Return created profile with wallet
      return {
        data: {
          ...profile.data,
          attributes: {
            ...profile.data.attributes,
            wallet: {
              data: wallet
            }
          }
        }
      };

    } catch (error) {
      await trx.rollback();
      throw error;
    }
  } catch (error) {
    ctx.throw(500, error);
  }
},

 async update(ctx) {
   const { data } = await super.update(ctx);
   return { data };
 },

 async delete(ctx) {
   const { data } = await super.delete(ctx);
   return { data };
 },

 // Custom actions
 async getProfile(ctx) {
   const { id } = ctx.params;
   const { user } = ctx.state;

   try {
     const profile = await strapi.entityService.findOne('api::customer-profile.customer-profile', id, {
       populate: ['wallet', 'transactions', 'wallet_qr_code', 'users_permissions_user']
     });

     if (!profile) {
       return ctx.notFound('Profile not found');
     }

     // Check if user is authorized to view this profile
     if (profile.users_permissions_user.id !== user.id) {
       return ctx.forbidden('Not authorized to view this profile');
     }

     return {
       data: profile
     };
   } catch (error) {
     return ctx.badRequest('Failed to fetch profile');
   }
 },

 async generateWalletQR(ctx) {
   const { id } = ctx.params;
   const { user } = ctx.state;

   try {
     const profile = await strapi.entityService.findOne('api::customer-profile.customer-profile', id, {
       populate: ['wallet', 'users_permissions_user']
     });

     if (!profile) {
       return ctx.notFound('Profile not found');
     }

     // Check authorization
     if (profile.users_permissions_user.id !== user.id) {
       return ctx.forbidden('Not authorized');
     }

     // Generate QR data
     const qrData = {
       profileId: profile.id,
       walletId: profile.wallet?.id,
       type: 'customer'
     };

     // Generate QR code
     const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData));

     // Update profile with QR code
     const updatedProfile = await strapi.entityService.update('api::customer-profile.customer-profile', id, {
       data: {
         wallet_qr_code: qrCodeDataUrl
       }
     });

     return {
       data: {
         qrCode: qrCodeDataUrl
       }
     };
   } catch (error) {
     return ctx.badRequest('Failed to generate QR code');
   }
 },

 async getPublicProfile(ctx) {
  try {
    const { profileId } = ctx.params;

    const profile = await strapi.entityService.findOne('api::customer-profile.customer-profile', profileId, {
      populate: ['wallet_qr_code']
    });

    if (!profile) {
      return ctx.notFound('Profile not found');
    }

    // Return only public information
    return {
      data: {
        id: profile.id,
        attributes: {
          fullName: profile.fullName,
          wallet_status: profile.wallet_status,
          wallet_qr_code: profile.wallet_qr_code,
          walletId: profile.wallet?.walletId // For transfers
        }
      }
    };
  } catch (error) {
    return ctx.badRequest('Failed to fetch public profile');
  }
},

async generateWalletQR(ctx) {
  try {
    const { id } = ctx.params;
    const { user } = ctx.state;

    const profile = await strapi.entityService.findOne('api::customer-profile.customer-profile', id, {
      populate: ['wallet', 'users_permissions_user']
    });

    if (!profile) {
      return ctx.notFound('Profile not found');
    }

    // Check authorization
    if (profile.users_permissions_user.id !== user.id) {
      return ctx.forbidden('Not authorized');
    }

    // Generate unique wallet link (similar to payment links)
    const walletLink = `${process.env.FRONTEND_URL}/cash/to/${profile.wallet.walletId}`;

    // Generate QR code
    const QRCode = require('qrcode');
    const qrCode = await QRCode.toDataURL(walletLink);

    // Save QR code to profile
    await strapi.entityService.update('api::customer-profile.customer-profile', id, {
      data: {
        wallet_qr_code: qrCode
      }
    });

    return {
      data: {
        qrCode,
        walletLink
      }
    };
  } catch (error) {
    return ctx.badRequest('Failed to generate wallet QR');
  }
},

async verifyWallet(ctx) {
  try {
    const { id } = ctx.params;
    const { pin } = ctx.request.body;

    const profile = await strapi.entityService.findOne('api::customer-profile.customer-profile', id, {
      populate: ['wallet']
    });

    if (!profile) {
      return ctx.notFound('Profile not found');
    }

    // Verify PIN and wallet status
    const isValidPin = profile.wallet_pin === parseInt(pin);
    const isActiveWallet = profile.wallet_status === 'active';

    if (!isValidPin || !isActiveWallet) {
      return ctx.badRequest('Invalid PIN or inactive wallet');
    }

    return {
      data: {
        verified: true,
        wallet: {
          id: profile.wallet.id,
          status: profile.wallet_status
        }
      }
    };
  } catch (error) {
    return ctx.badRequest('Wallet verification failed');
  }
},

 async getTransactions(ctx) {
   const { id } = ctx.params;
   const { user } = ctx.state;

   try {
     const profile = await strapi.entityService.findOne('api::customer-profile.customer-profile', id, {
       populate: ['wallet', 'users_permissions_user']
     });

     if (!profile || profile.users_permissions_user.id !== user.id) {
       return ctx.forbidden('Not authorized');
     }

     const transactions = await strapi.entityService.findMany('api::transaction.transaction', {
       filters: {
         $or: [
           { sender: profile.wallet?.id },
           { receiver: profile.wallet?.id }
         ]
       },
       sort: { createdAt: 'desc' },
       populate: ['sender', 'receiver', 'merchant', 'agent']
     });

     return {
       data: transactions
     };
   } catch (error) {
     return ctx.badRequest('Failed to fetch transactions');
   }
 },

 async updateWalletStatus(ctx) {
   const { id } = ctx.params;
   const { status } = ctx.request.body;
   const { user } = ctx.state;

   try {
     const profile = await strapi.entityService.findOne('api::customer-profile.customer-profile', id, {
       populate: ['users_permissions_user']
     });

     if (!profile || profile.users_permissions_user.id !== user.id) {
       return ctx.forbidden('Not authorized');
     }

     const updatedProfile = await strapi.entityService.update('api::customer-profile.customer-profile', id, {
       data: {
         wallet_status: status
       }
     });

     return {
       data: updatedProfile
     };
   } catch (error) {
     return ctx.badRequest('Failed to update wallet status');
   }
 },

 async getWalletBalance(ctx) {
   const { id } = ctx.params;
   const { user } = ctx.state;

   try {
     const profile = await strapi.entityService.findOne('api::customer-profile.customer-profile', id, {
       populate: ['wallet', 'users_permissions_user']
     });

     if (!profile || profile.users_permissions_user.id !== user.id) {
       return ctx.forbidden('Not authorized');
     }

     return {
       data: {
         balance: profile.wallet?.balance || 0,
         currency: profile.wallet?.currency || 'LYD',
         walletId: profile.wallet?.id
       }
     };
   } catch (error) {
     return ctx.badRequest('Failed to fetch wallet balance');
   }
 },

 async verifyPin(ctx) {
   const { id } = ctx.params;
   const { pin } = ctx.request.body;
   const { user } = ctx.state;

   try {
     const profile = await strapi.entityService.findOne('api::customer-profile.customer-profile', id, {
       populate: ['users_permissions_user']
     });

     if (!profile || profile.users_permissions_user.id !== user.id) {
       return ctx.forbidden('Not authorized');
     }

     return {
       data: {
         valid: profile.wallet_pin === parseInt(pin)
       }
     };
   } catch (error) {
     return ctx.badRequest('Failed to verify PIN');
   }
 }
}));