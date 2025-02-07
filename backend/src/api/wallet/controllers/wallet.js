'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::wallet.wallet', ({ strapi }) => ({
  async publicWallet(ctx) {
  try {
    const { userId, userType } = ctx.params;

    if (!userId || !userType) {
      return ctx.badRequest('User ID and type are required');
    }

    let wallet;
    
    if (userType === 'customer') {
      // First find customer profile
      const customerProfiles = await strapi.entityService.findMany('api::customer-profile.customer-profile', {
        filters: {
          users_permissions_user: userId
        },
        populate: ['wallet']
      });

      if (!customerProfiles || customerProfiles.length === 0) {
        return ctx.notFound('Customer profile not found');
      }

      wallet = customerProfiles[0].wallet;
    } else if (userType === 'merchant') {
      // First find merchant profile
      const merchants = await strapi.entityService.findMany('api::merchant.merchant', {
        filters: {
          users_permissions_user: userId
        },
        populate: ['wallet']
      });

      if (!merchants || merchants.length === 0) {
        return ctx.notFound('Merchant profile not found');
      }

      wallet = merchants[0].wallet;
    } else {
      return ctx.badRequest('Invalid user type');
    }

    if (!wallet) {
      return ctx.notFound('Wallet not found');
    }

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
    return ctx.throw(500, error);
  }
},

  async deposit(ctx) {
  const trx = await strapi.db.transaction();
  
  try {
    const { customerId, agentId, amount, pin } = ctx.request.body;

    console.log('Deposit Processing Details:', {
      customerId,
      agentId,
      amount,
      pinProvided: pin ? 'YES' : 'NO'
    });

    // Validate required fields
    if (!customerId || !agentId || !amount || !pin) {
      return ctx.badRequest('Missing required fields');
    }

    // Convert pin to integer
    const providedPin = parseInt(pin, 10);

    // Find agent with its operator
    const agent = await strapi.entityService.findOne(
      'api::agent.agent', 
      agentId, 
      { 
        populate: ['operator', 'wallet'],
        transaction: trx 
      }
    );

    // Validate agent exists
    if (!agent) {
      return ctx.notFound('Agent not found');
    }

    // Validate agent status
    if (agent.status !== 'active') {
      return ctx.badRequest('Agent is not active');
    }

    // Find customer wallet
    const customerWallet = await strapi.entityService.findOne(
      'api::wallet.wallet', 
      customerId, 
      { 
        populate: ['customer'],
        transaction: trx 
      }
    );

    // Find customer profile
    const customer = await strapi.entityService.findOne(
      'api::customer-profile.customer-profile',
      customerWallet.customer.id,
      { 
        populate: ['users_permissions_user', 'wallet'],
        transaction: trx 
      }
    );

    // PIN and wallet status validation
    if (!customer) {
      return ctx.notFound('Customer profile not found');
    }

    if (customer.wallet_pin === undefined || customer.wallet_pin === null) {
      return ctx.badRequest('Wallet PIN is not set');
    }

    if (customer.wallet_pin !== providedPin) {
      return ctx.badRequest('Invalid PIN');
    }

    if (customer.wallet_status !== 'active') {
      return ctx.badRequest('Customer wallet is not active');
    }

    // Generate reference number
    const reference = `DEP${Date.now()}`;
    const parsedAmount = parseFloat(amount);

     // Update customer wallet
    const updatedCustomerWallet = await strapi.entityService.update(
      'api::wallet.wallet', 
      customerId, 
      {
        data: {
          balance: customerWallet.balance + parsedAmount,
          lastActivity: new Date()
        },
        transaction: trx
      }
    );

    // Update agent's cash balance
    const updatedAgent = await strapi.entityService.update(
      'api::agent.agent', 
      agentId, 
      {
        data: {
          cashBalance: agent.cashBalance + parsedAmount
        },
        transaction: trx
      }
    );

    // NEW: Sync agent's wallet with cash balance
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
    };

    // Create transaction record
    const transaction = await strapi.entityService.create(
      'api::transaction.transaction', 
      {
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
            customerId: customer.id 
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: new Date()
        },
        transaction: trx
      }
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
    console.error('Deposit Processing Error:', {
      message: error.message,
      stack: error.stack,
      details: JSON.stringify(error)
    });
    return ctx.throw(500, error);
  }
},

  async withdraw(ctx) {
    const trx = await strapi.db.transaction();
    
    try {
      const { customerId, agentId, amount, pin } = ctx.request.body;

      console.log('Withdrawal Processing Details:', {
        customerId,
        agentId,
        amount,
        pinProvided: pin ? 'YES' : 'NO'
      });

      // Validate required fields
      if (!customerId || !agentId || !amount || !pin) {
        return ctx.badRequest('Missing required fields');
      }

      // Convert pin to integer
      const providedPin = parseInt(pin, 10);

      // Find customer wallet
      const customerWallet = await strapi.entityService.findOne(
        'api::wallet.wallet', 
        customerId, 
        { 
          populate: ['customer'],
          transaction: trx 
        }
      );

      // Find agent
      const agent = await strapi.entityService.findOne(
        'api::agent.agent', 
        agentId, 
        { transaction: trx }
      );

      // Validate wallets and agent exist
      if (!customerWallet) {
        return ctx.notFound('Customer wallet not found');
      }
      if (!agent) {
        return ctx.notFound('Agent not found');
      }

      const parsedAmount = parseFloat(amount);

      // Validate customer has enough balance
      if (customerWallet.balance < parsedAmount) {
        return ctx.badRequest('Insufficient balance');
      }

      // Find customer profile with PIN verification
      const customer = await strapi.entityService.findOne(
        'api::customer-profile.customer-profile',
        customerWallet.customer.id,
        { 
          populate: ['users_permissions_user', 'wallet'],
          transaction: trx 
        }
      );

      // Comprehensive PIN validation
      if (!customer) {
        return ctx.notFound('Customer profile not found');
      }

      if (customer.wallet_pin === undefined || customer.wallet_pin === null) {
        return ctx.badRequest('Wallet PIN is not set. Please set up your wallet PIN.');
      }

      if (customer.wallet_pin !== providedPin) {
        return ctx.badRequest('Invalid PIN');
      }

      // Additional wallet status check
      if (customer.wallet_status !== 'active') {
        return ctx.badRequest('Wallet is not active');
      }

      // Validate agent status and cash balance
      if (!agent || agent.status !== 'active') {
        return ctx.badRequest('Agent is not active');
      }

      // Validate agent has enough cash balance
      if (agent.cashBalance < parsedAmount) {
        return ctx.badRequest('Agent does not have sufficient cash balance');
      }

      // Generate reference number
      const reference = `WDR${Date.now()}`;

      // Update wallet balances
    await Promise.all([
      strapi.entityService.update('api::wallet.wallet', customerId, {
        data: {
          balance: customerWallet.balance - parsedAmount,
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

    // NEW: Sync agent's wallet with cash balance
    const updatedAgent = await strapi.entityService.findOne(
      'api::agent.agent',
      agentId,
      { transaction: trx }
    );
    
    if (updatedAgent.wallet) {
      await strapi.entityService.update(
        'api::wallet.wallet',
        updatedAgent.wallet.id,
        {
          data: {
            balance: updatedAgent.cashBalance,
            lastActivity: new Date()
          },
          transaction: trx
        }
      );
    };

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
            customerId: customer.id 
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: new Date()
        },
        transaction: trx
      });

      await trx.commit();

      return {
        data: {
          transaction,
          customerBalance: customerWallet.balance - parsedAmount,
          agentCashBalance: agent.cashBalance - parsedAmount
        }
      };

    } catch (error) {
      await trx.rollback();
      console.error('Withdrawal Processing Error:', {
        message: error.message,
        stack: error.stack,
        details: JSON.stringify(error)
      });
      return ctx.throw(500, error);
    }
  },

  async transfer(ctx) {
    const trx = await strapi.db.transaction();
    
    try {
      const { senderId, recipientId, amount, pin, note } = ctx.request.body;

      console.log('Transfer Processing Details:', {
        senderId,
        recipientId,
        amount,
        pinProvided: pin ? 'YES' : 'NO'
      });

      // Validate required fields
      if (!senderId || !recipientId || !amount || !pin) {
        return ctx.badRequest('Missing required fields');
      }

      // Convert pin to integer
      const providedPin = parseInt(pin, 10);

      // Get sender and recipient wallets
      const [senderWallet, recipientWallet] = await Promise.all([
        strapi.entityService.findOne('api::wallet.wallet', senderId, { 
          populate: ['customer'],
          transaction: trx 
        }),
        strapi.entityService.findOne('api::wallet.wallet', recipientId, { 
          populate: ['customer'],
          transaction: trx 
        })
      ]);

      // Validate wallets exist
      if (!senderWallet || !recipientWallet) {
        return ctx.notFound('One or more wallets not found');
      }

      // Validate sender has enough balance
      if (senderWallet.balance < amount) {
        return ctx.badRequest('Insufficient balance');
      }

      // Verify PIN for sender's wallet
      if (senderWallet.customer) {
        const customer = await strapi.entityService.findOne(
          'api::customer-profile.customer-profile',
          senderWallet.customer.id,
          { populate: ['users_permissions_user'] }
        );
        
        console.log('Customer PIN Verification:', {
          storedPin: customer.wallet_pin,
          providedPin,
          pinMatch: customer.wallet_pin === providedPin
        });
        
        if (!customer || customer.wallet_pin !== providedPin) {
          return ctx.badRequest('Invalid PIN');
        }
      }

      // Generate reference number
      const reference = `TRF${Date.now()}`;

      // Update wallet balances
      await Promise.all([
        strapi.entityService.update('api::wallet.wallet', senderId, {
          data: {
            balance: senderWallet.balance - amount,
            lastActivity: new Date()
          },
          transaction: trx
        }),
        strapi.entityService.update('api::wallet.wallet', recipientId, {
          data: {
            balance: recipientWallet.balance + parseFloat(amount),
            lastActivity: new Date()
          },
          transaction: trx
        })
      ]);

      // Create transaction record
      const transaction = await strapi.entityService.create('api::transaction.transaction', {
        data: {
          amount,
          currency: 'LYD',
          type: 'transfer',
          sender: senderId,
          receiver: recipientId,
          status: 'completed',
          fee: 0,
          reference,
          metadata: { note },
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: new Date()
        },
        transaction: trx
      });

      await trx.commit();

      return {
        data: {
          transaction,
          senderBalance: senderWallet.balance - amount,
          recipientBalance: recipientWallet.balance + parseFloat(amount)
        }
      };

    } catch (error) {
      await trx.rollback();
      console.error('Transfer error:', {
        message: error.message,
        stack: error.stack,
        details: error
      });
      return ctx.throw(500, error);
    }
  },

  async processPayment(ctx) {
    const trx = await strapi.db.transaction();
    
    try {
      const { senderId, merchantId, amount, pin, paymentLinkId } = ctx.request.body;

      console.log('Payment Processing Full Details:', {
        senderId,
        merchantId,
        amount,
        paymentLinkId,
        pinProvided: pin ? 'YES' : 'NO'
      });

      // Validate required fields
      if (!senderId || !merchantId || !amount || !pin) {
        return ctx.badRequest('Missing required fields');
      }

      // Convert pin to integer for comparison
      const providedPin = parseInt(pin, 10);

      // Get customer and merchant wallets
      const [customerWallet, merchantWallet] = await Promise.all([
        strapi.entityService.findOne('api::wallet.wallet', senderId, { 
          populate: ['customer'],
          transaction: trx 
        }),
        strapi.entityService.findOne('api::wallet.wallet', merchantId, { 
          populate: ['merchant'],
          transaction: trx 
        })
      ]);

      // Validate wallets exist
      if (!customerWallet || !merchantWallet) {
        return ctx.notFound('One or more wallets not found');
      }

      // Verify customer has enough balance
      if (customerWallet.balance < amount) {
        return ctx.badRequest('Insufficient balance');
      }

      // Find customer profile with detailed logging
      const customer = await strapi.entityService.findOne(
        'api::customer-profile.customer-profile',
        customerWallet.customer.id,
        { 
          populate: ['users_permissions_user', 'wallet'],
          transaction: trx 
        }
      );
      
      // Extensive logging for debugging
      console.log('Customer Profile Detailed Verification:', {
        customerId: customer.id,
        walletId: customerWallet.id,
        walletPinExists: customer.wallet_pin !== undefined && customer.wallet_pin !== null,
        providedPin: providedPin,
        storedPin: customer.wallet_pin,
        walletStatus: customer.wallet_status
      });

      // Comprehensive PIN validation
      if (!customer) {
        return ctx.notFound('Customer profile not found');
      }

      if (customer.wallet_pin === undefined || customer.wallet_pin === null) {
        return ctx.badRequest('Wallet PIN is not set. Please set up your wallet PIN.');
      }

      if (customer.wallet_pin !== providedPin) {
        return ctx.badRequest('Invalid PIN');
      }

      // Additional wallet status check
      if (customer.wallet_status !== 'active') {
        return ctx.badRequest('Wallet is not active');
      }

      // Generate reference number
      const reference = `PAY${Date.now()}`;

      // Update wallet balances
      await Promise.all([
        strapi.entityService.update('api::wallet.wallet', senderId, {
          data: {
            balance: customerWallet.balance - amount,
            lastActivity: new Date()
          },
          transaction: trx
        }),
        strapi.entityService.update('api::wallet.wallet', merchantId, {
          data: {
            balance: merchantWallet.balance + parseFloat(amount),
            lastActivity: new Date()
          },
          transaction: trx
        })
      ]);

      // Create transaction record
      const transaction = await strapi.entityService.create('api::transaction.transaction', {
        data: {
          amount,
          currency: 'LYD',
          type: 'payment',
          sender: senderId,
          receiver: merchantId,
          merchant: merchantWallet.merchant.id,
          payment_link: paymentLinkId,
          status: 'completed',
          fee: 0,
          reference,
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: new Date()
        },
        transaction: trx
      });

      await trx.commit();

      return {
        data: {
          transaction,
          customerBalance: customerWallet.balance - amount,
          merchantBalance: merchantWallet.balance + parseFloat(amount)
        }
      };

    } catch (error) {
      await trx.rollback();
      console.error('Payment Processing Error:', {
        message: error.message,
        stack: error.stack,
        details: JSON.stringify(error)
      });
      return ctx.throw(500, error);
    }
  }
}));