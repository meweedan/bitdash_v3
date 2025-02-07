'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::payment-link.payment-link', ({ strapi }) => ({
  async publicPaymentLink(ctx) {
    try {
      const { linkId } = ctx.params;

      if (!linkId) {
        return ctx.badRequest('Payment Link ID is required');
      }

      // Enhanced population to include merchant wallet
      const paymentLinks = await strapi.entityService.findMany('api::payment-link.payment-link', {
        filters: { 
          link_id: linkId,
          status: 'active' // Only return active links
        },
        populate: {
          merchant: {
            populate: {
              logo: true,
              metadata: true,
              wallet: true
            }
          }
        }
      });

      if (!paymentLinks || paymentLinks.length === 0) {
        return ctx.notFound('Payment link not found or inactive');
      }

      const paymentLink = paymentLinks[0];

      // Check expiry
      if (paymentLink.expiry && new Date(paymentLink.expiry) < new Date()) {
        // Auto update expired links
        await strapi.entityService.update('api::payment-link.payment-link', paymentLink.id, {
          data: { status: 'expired' }
        });
        return ctx.badRequest('Payment link has expired');
      }

      const transformedData = {
        data: {
          id: paymentLink.id,
          attributes: {
            amount: paymentLink.amount,
            currency: paymentLink.currency,
            description: paymentLink.description,
            status: paymentLink.status,
            payment_type: paymentLink.payment_type,
            link_id: paymentLink.link_id,
            createdAt: paymentLink.createdAt,
            expiry: paymentLink.expiry,
            merchant: paymentLink.merchant ? {
              data: {
                id: paymentLink.merchant.id,
                attributes: {
                  name: paymentLink.merchant.name,
                  logo: paymentLink.merchant.logo ? {
                    data: {
                      id: paymentLink.merchant.logo.id,
                      attributes: paymentLink.merchant.logo
                    }
                  } : null,
                  metadata: paymentLink.merchant.metadata,
                  wallet: {
                    data: {
                      id: paymentLink.merchant.wallet?.id
                    }
                  }
                }
              }
            } : null
          }
        }
      };

      return transformedData;
    } catch (error) {
      console.error('Public Payment Link error:', error);
      return ctx.throw(500, error);
    }
  },

  async processPayment(ctx) {
    const trx = await strapi.db.transaction();
    
    try {
      const { paymentLinkId, customerPin } = ctx.request.body;
      const { user } = ctx.state;

      if (!paymentLinkId || !customerPin) {
        return ctx.badRequest('Missing payment details');
      }

      // Find payment link with all necessary relations in one query
      const paymentLinks = await strapi.entityService.findMany('api::payment-link.payment-link', {
        filters: { id: paymentLinkId },
        populate: {
          merchant: {
            populate: { 
              wallet: true,
              users_permissions_user: true,
              metadata: true
            }
          }
        },
        transaction: trx
      });

      if (!paymentLinks || paymentLinks.length === 0) {
        await trx.rollback();
        return ctx.notFound('Payment link not found');
      }

      const paymentLink = paymentLinks[0];
      const merchant = paymentLink.merchant;

      // Comprehensive status checks
      if (paymentLink.status !== 'active') {
        await trx.rollback();
        return ctx.badRequest('Payment link is no longer active');
      }

      if (paymentLink.expiry && new Date(paymentLink.expiry) < new Date()) {
        await strapi.entityService.update('api::payment-link.payment-link', paymentLink.id, {
          data: { status: 'expired' },
          transaction: trx
        });
        await trx.rollback();
        return ctx.badRequest('Payment link has expired');
      }

      // PIN validation
      const isPinValid = paymentLink.pin === customerPin || 
                        merchant.merchant_pin === customerPin;

      if (!isPinValid) {
        await trx.rollback();
        return ctx.badRequest('Invalid PIN');
      }

      // Get wallets with transaction
      const [customerProfile, merchantProfile] = await Promise.all([
        strapi.entityService.findOne('plugin::users-permissions.user', user.id, {
          populate: { wallet: true },
          transaction: trx
        }),
        strapi.entityService.findOne('api::merchant.merchant', merchant.id, {
          populate: { wallet: true },
          transaction: trx
        })
      ]);

      if (!customerProfile.wallet || !merchantProfile.wallet) {
        await trx.rollback();
        return ctx.badRequest('Wallet not found');
      }

      // Balance check
      if (customerProfile.wallet.balance < paymentLink.amount) {
        await trx.rollback();
        return ctx.badRequest('Insufficient balance');
      }

      // Process wallet updates
      const [updatedCustomerWallet, updatedMerchantWallet] = await Promise.all([
        strapi.entityService.update('api::wallet.wallet', customerProfile.wallet.id, {
          data: {
            balance: customerProfile.wallet.balance - paymentLink.amount,
            lastActivity: new Date()
          },
          transaction: trx
        }),
        strapi.entityService.update('api::wallet.wallet', merchantProfile.wallet.id, {
          data: {
            balance: merchantProfile.wallet.balance + paymentLink.amount,
            lastActivity: new Date()
          },
          transaction: trx
        })
      ]);

      // Create transactions
      const [customerTransaction, merchantTransaction] = await Promise.all([
        strapi.entityService.create('api::transaction.transaction', {
          data: {
            amount: paymentLink.amount,
            currency: paymentLink.currency,
            type: 'payment',
            status: 'completed',
            wallet: customerProfile.wallet.id,
            payment_link: paymentLink.id,
            merchant: merchant.id,
            description: `Payment to ${merchant.metadata?.businessName || 'merchant'}`,
            metadata: {
              paymentLinkId: paymentLink.id,
              merchantId: merchant.id,
              type: 'customer_payment'
            },
            publishedAt: new Date()
          },
          transaction: trx
        }),
        strapi.entityService.create('api::transaction.transaction', {
          data: {
            amount: paymentLink.amount,
            currency: paymentLink.currency,
            type: 'payment',
            status: 'completed',
            wallet: merchantProfile.wallet.id,
            payment_link: paymentLink.id,
            merchant: merchant.id,
            description: `Payment from customer ${customerProfile.username || customerProfile.email}`,
            metadata: {
              paymentLinkId: paymentLink.id,
              customerId: user.id,
              type: 'merchant_payment'
            },
            publishedAt: new Date()
          },
          transaction: trx
        })
      ]);

      // Update payment link status
      await strapi.entityService.update('api::payment-link.payment-link', paymentLink.id, {
        data: {
          status: 'completed',
          metadata: {
            ...paymentLink.metadata,
            completedAt: new Date().toISOString(),
            customerId: user.id,
            customerTransaction: customerTransaction.id
          }
        },
        transaction: trx
      });

      await trx.commit();

      return {
        data: {
          customerTransaction,
          merchantTransaction,
          customerWalletBalance: updatedCustomerWallet.balance,
          merchantWalletBalance: updatedMerchantWallet.balance
        }
      };
    } catch (error) {
      await trx.rollback();
      console.error('Payment processing error:', error);
      return ctx.internalServerError('Payment processing failed', { error: error.message });
    }
  }
}));