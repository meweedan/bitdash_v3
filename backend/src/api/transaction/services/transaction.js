'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::transaction.transaction', ({ strapi }) => ({
  async processTransaction(transactionId) {
    const trx = await strapi.db.connection.transaction();
    
    try {
      const transaction = await strapi.entityService.findOne('api::transaction.transaction', transactionId, {
        populate: ['sender', 'receiver']
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      switch (transaction.type) {
        case 'transfer':
          await this.processTransfer(transaction, trx);
          break;
        case 'deposit':
          await this.processDeposit(transaction, trx);
          break;
        case 'withdrawal':
          await this.processWithdrawal(transaction, trx);
          break;
        default:
          throw new Error('Invalid transaction type');
      }

      await trx.commit();
      
      // Send notifications
      await this.sendTransactionNotifications(transaction);
      
      return transaction;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  },

  async processTransfer(transaction, trx) {
    const { sender, receiver, amount } = transaction;
    
    // Update sender's balance
    await strapi.entityService.update('api::wallet.wallet', sender.id, {
      data: {
        balance: sender.balance - amount,
        lastActivity: new Date()
      },
      transaction: trx
    });

    // Update receiver's balance
    await strapi.entityService.update('api::wallet.wallet', receiver.id, {
      data: {
        balance: receiver.balance + amount,
        lastActivity: new Date()
      },
      transaction: trx
    });

    // Update transaction status
    await strapi.entityService.update('api::transaction.transaction', transaction.id, {
      data: { status: 'completed' },
      transaction: trx
    });
  },

  async processDeposit(transaction, trx) {
    const { receiver, amount } = transaction;

    await strapi.entityService.update('api::wallet.wallet', receiver.id, {
      data: {
        balance: receiver.balance + amount,
        lastActivity: new Date()
      },
      transaction: trx
    });

    await strapi.entityService.update('api::transaction.transaction', transaction.id, {
      data: { status: 'completed' },
      transaction: trx
    });
  },

  async processWithdrawal(transaction, trx) {
    const { sender, amount } = transaction;

    await strapi.entityService.update('api::wallet.wallet', sender.id, {
      data: {
        balance: sender.balance - amount,
        lastActivity: new Date()
      },
      transaction: trx
    });

    await strapi.entityService.update('api::transaction.transaction', transaction.id, {
      data: { status: 'completed' },
      transaction: trx
    });
  },

  async sendTransactionNotifications(transaction) {
    const { type, amount, currency, sender, receiver } = transaction;
    
    const createNotification = async (userId, title, message) => {
      await strapi.entityService.create('api::notification.notification', {
        data: {
          type: 'transaction',
          title,
          message,
          recipient: userId
        }
      });
    };

    switch (type) {
      case 'transfer':
        await Promise.all([
          createNotification(
            sender.customer,
            'Transfer Sent',
            `You sent ${amount} ${currency} to wallet ${receiver.walletId}`
          ),
          createNotification(
            receiver.customer,
            'Transfer Received',
            `You received ${amount} ${currency} from wallet ${sender.walletId}`
          )
        ]);
        break;
      case 'deposit':
        await createNotification(
          receiver.customer,
          'Deposit Received',
          `Your wallet was credited with ${amount} ${currency}`
        );
        break;
      case 'withdrawal':
        await createNotification(
          sender.customer,
          'Withdrawal Processed',
          `You withdrew ${amount} ${currency} from your wallet`
        );
        break;
    }
  }
}));