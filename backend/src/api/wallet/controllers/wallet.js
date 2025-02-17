'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const rateLimit = require('koa2-ratelimit').RateLimit;

// Transaction limits by type
const TRANSACTION_LIMITS = {
  transfer: {
    min: 1,
    max: 1000,
    dailyMax: 5000,
    monthlyMax: 50000,
    rateLimit: { minutes: 15, max: 10 }  // 10 transfers per 15 minutes
  },
  deposit: {
    min: 1,
    max: 10000,
    dailyMax: 10000,
    monthlyMax: 100000,
    rateLimit: { minutes: 15, max: 5 }   // 5 deposits per 15 minutes
  },
  withdrawal: {
    min: 1,
    max: 5000,
    dailyMax: 5000,
    monthlyMax: 50000,
    rateLimit: { minutes: 15, max: 5 }   // 5 withdrawals per 15 minutes
  },
  payment: {
    min: 1,
    max: 5000,
    dailyMax: 10000,
    monthlyMax: 100000,
    rateLimit: { minutes: 15, max: 20 }  // 20 payments per 15 minutes
  }
};

// Rate limiting middleware setup
const rateLimiters = {};
Object.entries(TRANSACTION_LIMITS).forEach(([type, limits]) => {
  rateLimiters[type] = async (ctx, next) => {
    const limiter = rateLimit.middleware({
      interval: limits.rateLimit.minutes * 60 * 1000,
      max: limits.rateLimit.max,
      message: `Too many ${type} attempts. Please try again later.`,
      prefix: `wallet_${type}_`
    });

    try {
      await limiter(ctx, next);
    } catch (error) {
      ctx.throw(429, error.message);
    }
  };
});

// Helper function to validate transaction limits
const validateTransactionLimits = async (walletId, amount, type, trx = null) => {
  const limits = TRANSACTION_LIMITS[type];
  if (!limits) throw new Error('Invalid transaction type');

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    throw new Error('Invalid amount');
  }

  if (parsedAmount < limits.min || parsedAmount > limits.max) {
    throw new Error(`Amount must be between ${limits.min} and ${limits.max}`);
  }

  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const startOfMonth = new Date(now.setDate(1));

  // Get daily transactions
  const dailyTransactions = await strapi.entityService.findMany('api::transaction.transaction', {
    filters: {
      sender: walletId,
      type,
      createdAt: { $gte: startOfDay },
      status: 'completed'
    },
    transaction: trx
  });

  const dailyTotal = dailyTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
  if (dailyTotal + parsedAmount > limits.dailyMax) {
    throw new Error(`Daily ${type} limit of ${limits.dailyMax} would be exceeded`);
  }

  // Get monthly transactions
  const monthlyTransactions = await strapi.entityService.findMany('api::transaction.transaction', {
    filters: {
      sender: walletId,
      type,
      createdAt: { $gte: startOfMonth },
      status: 'completed'
    },
    transaction: trx
  });

  const monthlyTotal = monthlyTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
  if (monthlyTotal + parsedAmount > limits.monthlyMax) {
    throw new Error(`Monthly ${type} limit of ${limits.monthlyMax} would be exceeded`);
  }

  return parsedAmount;
};

// Helper function to create audit logs
const createAuditLog = async (ctx, action, resourceType, resourceId, oldValues = null, newValues = null, metadata = {}, trx = null) => {
  try {
    const data = {
      action,
      resource_type: resourceType,
      resource_id: resourceId.toString(),
      user: ctx.state.user?.id,
      ip_address: ctx.request.ip,
      old_values: oldValues,
      new_values: newValues,
      metadata: {
        ...metadata,
        userAgent: ctx.request.headers['user-agent'],
        method: ctx.request.method,
        path: ctx.request.path,
        timestamp: new Date()
      },
      severity: metadata.severity || 'medium',
      status: metadata.status || 'success',
      session_id: ctx.state.session_id,
      device_info: {
        userAgent: ctx.request.headers['user-agent'],
        ip: ctx.request.ip,
        headers: ctx.request.headers
      },
      publishedAt: new Date()
    };

    const config = trx ? { data, transaction: trx } : { data };
    await strapi.entityService.create('api::audit-log.audit-log', config);
  } catch (error) {
    console.error('Audit log creation failed:', error);
  }
};

// Helper function to validate PIN
const validatePin = async (profileId, pin, trx = null) => {
  const profile = await strapi.entityService.findOne(
    'api::customer-profile.customer-profile',
    profileId,
    { 
      populate: ['wallet'],
      transaction: trx 
    }
  );

  if (!profile) {
    throw new Error('Profile not found');
  }

  if (!profile.wallet_pin) {
    throw new Error('PIN not set');
  }

  if (profile.wallet_status !== 'active') {
    throw new Error('Wallet is not active');
  }

  const providedPin = parseInt(pin, 10);
  if (isNaN(providedPin) || profile.wallet_pin !== providedPin) {
    throw new Error('Invalid PIN');
  }

  return profile;
};

// Helper function to validate wallets
const validateWallets = async (senderId, receiverId, type, trx = null) => {
  if (senderId === receiverId) {
    throw new Error('Cannot transfer to same wallet');
  }

  const [senderWallet, receiverWallet] = await Promise.all([
    strapi.entityService.findOne('api::wallet.wallet', senderId, {
      populate: ['customer', 'merchant', 'agent'],
      transaction: trx
    }),
    strapi.entityService.findOne('api::wallet.wallet', receiverId, {
      populate: ['customer', 'merchant', 'agent'],
      transaction: trx
    })
  ]);

  if (!senderWallet || !receiverWallet) {
    throw new Error('One or more wallets not found');
  }

  if (!senderWallet.isActive || !receiverWallet.isActive) {
    throw new Error('One or more wallets are inactive');
  }

  // Validate wallet types based on transaction type
  if (type === 'payment' && !receiverWallet.merchant) {
    throw new Error('Recipient must be a merchant wallet for payments');
  }

  if (type === 'deposit' && !receiverWallet.customer) {
    throw new Error('Recipient must be a customer wallet for deposits');
  }

  if (type === 'withdrawal' && (!senderWallet.customer || !receiverWallet.agent)) {
    throw new Error('Invalid wallet types for withdrawal');
  }

  return { senderWallet, receiverWallet };
};

module.exports = createCoreController('api::wallet.wallet', ({ strapi }) => ({
  // Start of controller methods
  async publicWallet(ctx) {
    try {
      const { userId, userType } = ctx.params;

      if (!userId || !userType) {
        return ctx.badRequest('User ID and type are required');
      }

      let wallet;
      let profile;

      if (userType === 'customer') {
        const customerProfiles = await strapi.entityService.findMany('api::customer-profile.customer-profile', {
          filters: {
            users_permissions_user: userId
          },
          populate: ['wallet']
        });

        if (!customerProfiles?.length) {
          return ctx.notFound('Customer profile not found');
        }

        profile = customerProfiles[0];
        wallet = profile.wallet;
      } else if (userType === 'merchant') {
        const merchants = await strapi.entityService.findMany('api::merchant.merchant', {
          filters: {
            users_permissions_user: userId
          },
          populate: ['wallet']
        });

        if (!merchants?.length) {
          return ctx.notFound('Merchant profile not found');
        }

        profile = merchants[0];
        wallet = profile.wallet;
      } else {
        return ctx.badRequest('Invalid user type');
      }

      if (!wallet) {
        return ctx.notFound('Wallet not found');
      }

      await createAuditLog(ctx, 'wallet_accessed', 'wallet', wallet.id, null, null, {
        userType,
        userId,
        profileId: profile.id
      });

      return {
        data: {
          id: wallet.id,
          attributes: {
            balance: wallet.balance,
            currency: wallet.currency,
            walletId: wallet.walletId,
            lastActivity: wallet.lastActivity
          }
        }
      };

    } catch (error) {
      console.error('Public Wallet error:', error);
      await createAuditLog(ctx, 'wallet_access_failed', 'wallet', ctx.params.userId, null, null, {
        error: error.message,
        severity: 'high',
        status: 'failure'
      });
      return ctx.throw(500, error);
    }
  },

  async transfer(ctx) {
    await rateLimiters.transfer(ctx, () => Promise.resolve());

    const trx = await strapi.db.transaction();
    
    try {
      const { senderId, recipientId, amount, pin, note } = ctx.request.body;

      if (!senderId || !recipientId || !amount || !pin) {
        return ctx.badRequest('Missing required fields');
      }

      // Validate wallets and get details
      const { senderWallet, receiverWallet } = await validateWallets(senderId, recipientId, 'transfer', trx);

      // Validate transaction limits
      const parsedAmount = await validateTransactionLimits(senderId, amount, 'transfer', trx);

      // Validate PIN
      await validatePin(senderWallet.customer.id, pin, trx);

      // Validate balance
      if (senderWallet.balance < parsedAmount) {
        throw new Error('Insufficient balance');
      }

      // Generate unique reference
      const reference = `TRF${Date.now()}${Math.random().toString(36).substr(2, 4)}`;

      // Create audit log for transfer initiation
      await createAuditLog(
        ctx,
        'transfer_initiated',
        'wallet',
        senderId,
        { balance: senderWallet.balance },
        { amount: parsedAmount },
        { recipientId, reference },
        trx
      );

      // Update wallet balances
      const [updatedSender, updatedReceiver] = await Promise.all([
        strapi.entityService.update('api::wallet.wallet', senderId, {
          data: {
            balance: senderWallet.balance - parsedAmount,
            lastActivity: new Date()
          },
          transaction: trx
        }),
        strapi.entityService.update('api::wallet.wallet', recipientId, {
          data: {
            balance: receiverWallet.balance + parsedAmount,
            lastActivity: new Date()
          },
          transaction: trx
        })
      ]);

      // Create transaction record
      const transaction = await strapi.entityService.create('api::transaction.transaction', {
        data: {
          amount: parsedAmount,
          currency: 'LYD',
          type: 'transfer',
          sender: senderId,
          receiver: recipientId,
          status: 'completed',
          fee: 0,
          reference,
          metadata: {
            note,
            ip: ctx.request.ip,
            userAgent: ctx.request.headers['user-agent']
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: new Date()
        },
        transaction: trx
      });

      // Create audit log for completed transfer
      await createAuditLog(
        ctx,
        'transfer_completed',
        'transaction',
        transaction.id,
        null,
        {
          reference,
          senderNewBalance: updatedSender.balance,
          recipientNewBalance: updatedReceiver.balance
        },
        { note },
        trx
      );

      await trx.commit();

      return {
        data: {
          transaction,
          senderBalance: updatedSender.balance,
          recipientBalance: updatedReceiver.balance
        }
      };

    } catch (error) {
      await trx.rollback();
      await createAuditLog(
        ctx,
        'transfer_failed',
        'wallet',
        ctx.request.body.senderId,
        null,
        null,
        {
          error: error.message,
          amount: ctx.request.body.amount,
          recipientId: ctx.request.body.recipientId,
          severity: 'high',
          status: 'failure'
        }
      );
      return ctx.badRequest(error.message);
    }
  },

  async deposit(ctx) {
    await rateLimiters.deposit(ctx, () => Promise.resolve());

    const trx = await strapi.db.transaction();
    
    try {
      const { customerId, agentId, amount, pin } = ctx.request.body;

      if (!customerId || !agentId || !amount || !pin) {
        return ctx.badRequest('Missing required fields');
      }

      // Validate wallets and get details
      const { senderWallet, receiverWallet } = await validateWallets(agentId, customerId, 'deposit', trx);

      // Validate transaction limits
      const parsedAmount = await validateTransactionLimits(customerId, amount, 'deposit', trx);

      // Validate PIN
      await validatePin(receiverWallet.customer.id, pin, trx);

      // Validate agent status
      const agent = await strapi.entityService.findOne(
        'api::agent.agent', 
        agentId, 
        { 
          populate: ['operator', 'wallet'],
          transaction: trx 
        }
      );

      if (!agent || agent.status !== 'active') {
        throw new Error('Agent is not active or not found');
      }

      // Generate unique reference
      const reference = `DEP${Date.now()}${Math.random().toString(36).substr(2, 4)}`;

      // Create audit log for deposit initiation
      await createAuditLog(
        ctx,
        'deposit_initiated',
        'wallet',
        customerId,
        { balance: receiverWallet.balance },
        { amount: parsedAmount },
        { agentId, reference },
        trx
      );

      // Update customer wallet and agent cash balance
      const [updatedCustomerWallet, updatedAgent] = await Promise.all([
        strapi.entityService.update('api::wallet.wallet', customerId, {
          data: {
            balance: receiverWallet.balance + parsedAmount,
            lastActivity: new Date()
          },
          transaction: trx
        }),
        strapi.entityService.update('api::agent.agent', agentId, {
          data: {
            cashBalance: agent.cashBalance + parsedAmount
          },
          transaction: trx
        })
      ]);

      // Sync agent's wallet with cash balance
      if (agent.wallet) {
        await strapi.entityService.update(
          'api::wallet.wallet',
          agent.wallet.id,
          {
            data: {
              balance: updatedAgent.cashBalance,
              lastActivity: new Date()
            },
            transaction: trx
          }
        );
      }

      // Create transaction record
      const transaction = await strapi.entityService.create('api::transaction.transaction', {
        data: {
          amount: parsedAmount,
          currency: 'LYD',
          type: 'deposit',
          sender: agentId,
          receiver: customerId,
          agent: agentId,
          status: 'completed',
          fee: 0,
          reference,
          metadata: {
            agentId,
            customerId: receiverWallet.customer.id,
            ip: ctx.request.ip,
            userAgent: ctx.request.headers['user-agent']
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: new Date()
        },
        transaction: trx
      });

      // Create audit log for completed deposit
      await createAuditLog(
        ctx,
        'deposit_completed',
        'transaction',
        transaction.id,
        null,
        {
          amount: parsedAmount,
          reference,
          customerNewBalance: updatedCustomerWallet.balance,
          agentNewBalance: updatedAgent.cashBalance
        },
        null,
        trx
      );

      await trx.commit();

      return {
        data: {
          transaction,
          customerBalance: updatedCustomerWallet.balance,
          agentCashBalance: updatedAgent.cashBalance
        }
      };

    } catch (error) {
      await trx.rollback();
      await createAuditLog(
        ctx,
        'deposit_failed',
        'wallet',
        ctx.request.body.customerId,
        null,
        null,
        {
          error: error.message,
          amount: ctx.request.body.amount,
          agentId: ctx.request.body.agentId,
          severity: 'high',
          status: 'failure'
        }
      );
      return ctx.badRequest(error.message);
    }
  },
  async withdraw(ctx) {
    await rateLimiters.withdrawal(ctx, () => Promise.resolve());

    const trx = await strapi.db.transaction();
    
    try {
      const { customerId, agentId, amount, pin } = ctx.request.body;

      if (!customerId || !agentId || !amount || !pin) {
        return ctx.badRequest('Missing required fields');
      }

      // Validate wallets and get details
      const { senderWallet, receiverWallet } = await validateWallets(customerId, agentId, 'withdrawal', trx);

      // Validate transaction limits
      const parsedAmount = await validateTransactionLimits(customerId, amount, 'withdrawal', trx);

      // Validate PIN
      await validatePin(senderWallet.customer.id, pin, trx);

      // Validate agent status and cash balance
      const agent = await strapi.entityService.findOne(
        'api::agent.agent', 
        agentId, 
        { 
          populate: ['operator', 'wallet'],
          transaction: trx 
        }
      );

      if (!agent || agent.status !== 'active') {
        throw new Error('Agent is not active or not found');
      }

      // Validate agent has enough cash
      if (agent.cashBalance < parsedAmount) {
        throw new Error('Agent does not have sufficient cash balance');
      }

      // Validate customer has enough balance
      if (senderWallet.balance < parsedAmount) {
        throw new Error('Insufficient balance');
      }

      // Generate unique reference
      const reference = `WDR${Date.now()}${Math.random().toString(36).substr(2, 4)}`;

      // Create audit log for withdrawal initiation
      await createAuditLog(
        ctx,
        'withdrawal_initiated',
        'wallet',
        customerId,
        { balance: senderWallet.balance },
        { amount: parsedAmount },
        { agentId, reference },
        trx
      );

      // Update customer wallet and agent cash balance
      const [updatedCustomerWallet, updatedAgent] = await Promise.all([
        strapi.entityService.update('api::wallet.wallet', customerId, {
          data: {
            balance: senderWallet.balance - parsedAmount,
            lastActivity: new Date()
          },
          transaction: trx
        }),
        strapi.entityService.update('api::agent.agent', agentId, {
          data: {
            cashBalance: agent.cashBalance - parsedAmount
          },
          transaction: trx
        })
      ]);

      // Sync agent's wallet with cash balance
      if (agent.wallet) {
        await strapi.entityService.update(
          'api::wallet.wallet',
          agent.wallet.id,
          {
            data: {
              balance: updatedAgent.cashBalance,
              lastActivity: new Date()
            },
            transaction: trx
          }
        );
      }

      // Create transaction record
      const transaction = await strapi.entityService.create('api::transaction.transaction', {
        data: {
          amount: parsedAmount,
          currency: 'LYD',
          type: 'withdrawal',
          sender: customerId,
          receiver: agentId,
          agent: agentId,
          status: 'completed',
          fee: 0,
          reference,
          metadata: {
            agentId,
            customerId: senderWallet.customer.id,
            ip: ctx.request.ip,
            userAgent: ctx.request.headers['user-agent']
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: new Date()
        },
        transaction: trx
      });

      // Create audit log for completed withdrawal
      await createAuditLog(
        ctx,
        'withdrawal_completed',
        'transaction',
        transaction.id,
        null,
        {
          amount: parsedAmount,
          reference,
          customerNewBalance: updatedCustomerWallet.balance,
          agentNewBalance: updatedAgent.cashBalance
        },
        null,
        trx
      );

      await trx.commit();

      return {
        data: {
          transaction,
          customerBalance: updatedCustomerWallet.balance,
          agentCashBalance: updatedAgent.cashBalance
        }
      };

    } catch (error) {
      await trx.rollback();
      await createAuditLog(
        ctx,
        'withdrawal_failed',
        'wallet',
        ctx.request.body.customerId,
        null,
        null,
        {
          error: error.message,
          amount: ctx.request.body.amount,
          agentId: ctx.request.body.agentId,
          severity: 'high',
          status: 'failure'
        }
      );
      return ctx.badRequest(error.message);
    }
  },
  async processPayment(ctx) {
    await rateLimiters.payment(ctx, () => Promise.resolve());
    const trx = await strapi.db.transaction();
    
    try {
      const { senderId, merchantId, amount, pin, paymentLinkId } = ctx.request.body;

      if (!senderId || !merchantId || !amount || !pin) {
        return ctx.badRequest('Missing required fields');
      }

      // Validate wallets and get details
      const { senderWallet, receiverWallet } = await validateWallets(senderId, merchantId, 'payment', trx);

      // Validate transaction limits
      const parsedAmount = await validateTransactionLimits(senderId, amount, 'payment', trx);

      // Validate PIN
      await validatePin(senderWallet.customer.id, pin, trx);

      // Validate balance
      if (senderWallet.balance < parsedAmount) {
        throw new Error('Insufficient balance');
      }

      // Validate payment link if provided
      if (paymentLinkId) {
        const paymentLink = await strapi.entityService.findOne(
          'api::payment-link.payment-link',
          paymentLinkId,
          { 
            populate: ['merchant'],
            transaction: trx
          }
        );

        if (!paymentLink) {
          throw new Error('Payment link not found');
        }

        if (paymentLink.status !== 'active') {
          throw new Error('Payment link is not active');
        }

        if (paymentLink.expiry && new Date(paymentLink.expiry) < new Date()) {
          throw new Error('Payment link has expired');
        }

        // Verify payment amount for fixed payment links
        if (paymentLink.payment_type === 'fixed' && paymentLink.amount !== parsedAmount) {
          throw new Error('Invalid payment amount for fixed payment link');
        }

        // Verify merchant matches payment link
        if (paymentLink.merchant.id.toString() !== receiverWallet.merchant.id.toString()) {
          throw new Error('Payment link does not match merchant');
        }
      }

      // Generate unique reference
      const reference = `PAY${Date.now()}${Math.random().toString(36).substr(2, 4)}`;

      // Create audit log for payment initiation
      await createAuditLog(
        ctx,
        'payment_initiated',
        'wallet',
        senderId,
        { balance: senderWallet.balance },
        { amount: parsedAmount },
        { 
          merchantId,
          paymentLinkId,
          reference 
        },
        trx
      );

      // Update wallet balances
      const [updatedSender, updatedReceiver] = await Promise.all([
        strapi.entityService.update('api::wallet.wallet', senderId, {
          data: {
            balance: senderWallet.balance - parsedAmount,
            lastActivity: new Date()
          },
          transaction: trx
        }),
        strapi.entityService.update('api::wallet.wallet', merchantId, {
          data: {
            balance: receiverWallet.balance + parsedAmount,
            lastActivity: new Date()
          },
          transaction: trx
        })
      ]);

      // Update payment link status if provided
      if (paymentLinkId) {
        await strapi.entityService.update(
          'api::payment-link.payment-link',
          paymentLinkId,
          {
            data: {
              status: 'completed',
              updatedAt: new Date()
            },
            transaction: trx
          }
        );
      }

      // Create transaction record
      const transaction = await strapi.entityService.create('api::transaction.transaction', {
        data: {
          amount: parsedAmount,
          currency: 'LYD',
          type: 'payment',
          sender: senderId,
          receiver: merchantId,
          merchant: receiverWallet.merchant.id,
          payment_link: paymentLinkId,
          status: 'completed',
          fee: 0,
          reference,
          metadata: {
            ip: ctx.request.ip,
            userAgent: ctx.request.headers['user-agent'],
            paymentLinkDetails: paymentLinkId ? {
              type: 'payment_link',
              id: paymentLinkId
            } : null
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: new Date()
        },
        transaction: trx
      });

      // Create audit log for completed payment
      await createAuditLog(
        ctx,
        'payment_completed',
        'transaction',
        transaction.id,
        null,
        {
          amount: parsedAmount,
          reference,
          customerNewBalance: updatedSender.balance,
          merchantNewBalance: updatedReceiver.balance
        },
        { paymentLinkId },
        trx
      );

      await trx.commit();

      return {
        data: {
          transaction,
          customerBalance: updatedSender.balance,
          merchantBalance: updatedReceiver.balance
        }
      };

    } catch (error) {
      await trx.rollback();
      await createAuditLog(
        ctx,
        'payment_failed',
        'wallet',
        ctx.request.body.senderId,
        null,
        null,
        {
          error: error.message,
          amount: ctx.request.body.amount,
          merchantId: ctx.request.body.merchantId,
          paymentLinkId: ctx.request.body.paymentLinkId,
          severity: 'high',
          status: 'failure'
        }
      );
      return ctx.badRequest(error.message);
    }
  }
}));