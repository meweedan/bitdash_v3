// api/agents/process-transaction.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, customerId, type, pin } = req.body.data;
  const agentId = req.user.id; // Assuming auth middleware sets this

  try {
    // Start transaction
    const trx = await strapi.db.transaction();
    
    try {
      // 1. Fetch agent and validate
      const agent = await strapi.db.query('api::agent.agent')
        .findOne({ 
          where: { users_permissions_user: agentId },
          populate: ['wallet']
        });

      if (!agent || agent.status !== 'active') {
        throw new Error('Invalid or inactive agent');
      }

      // 2. Fetch customer wallet
      const customerWallet = await strapi.db.query('api::wallet.wallet')
        .findOne({ 
          where: { 'customer.users_permissions_user': customerId },
          populate: ['customer']
        });

      if (!customerWallet) {
        throw new Error('Customer wallet not found');
      }

      // 3. Validate PIN for withdrawals
      if (type === 'withdrawal') {
        const customer = await strapi.db.query('api::customer-profile.customer-profile')
          .findOne({ where: { users_permissions_user: customerId } });

        if (customer.wallet_pin !== parseInt(pin)) {
          throw new Error('Invalid PIN');
        }
      }

      // 4. Check balances
      if (type === 'withdrawal') {
        if (customerWallet.balance < amount) {
          throw new Error('Insufficient customer balance');
        }
        if (agent.cashBalance < amount) {
          throw new Error('Insufficient agent cash balance');
        }
      }

      // 5. Check daily limits
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayTransactions = await strapi.db.query('api::transaction.transaction')
        .count({
          where: {
            agent: agent.id,
            createdAt: { $gte: todayStart },
            status: 'completed'
          }
        });

      const todayAmount = todayTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      if (todayAmount + amount > agent.dailyTransactionLimit) {
        throw new Error('Agent daily limit exceeded');
      }

      // 6. Create transaction record
      const transaction = await strapi.db.query('api::transaction.transaction')
        .create({
          data: {
            amount,
            fee: 0, // Agents don't charge fees
            currency: 'LYD',
            type,
            status: 'completed',
            sender: type === 'withdrawal' ? customerWallet.id : agent.wallet.id,
            receiver: type === 'withdrawal' ? agent.wallet.id : customerWallet.id,
            agent: agent.id,
            reference: `AG${Date.now()}${Math.random().toString(36).substr(2, 4)}`.toUpperCase()
          },
          transaction: trx
        });

      // 7. Update balances
      const customerNewBalance = type === 'withdrawal' 
        ? customerWallet.balance - amount
        : customerWallet.balance + amount;

      await strapi.db.query('api::wallet.wallet').update({
        where: { id: customerWallet.id },
        data: {
          balance: customerNewBalance,
          lastActivity: new Date()
        },
        transaction: trx
      });

      const agentNewCashBalance = type === 'withdrawal'
        ? agent.cashBalance - amount
        : agent.cashBalance + amount;

      await strapi.db.query('api::agent.agent').update({
        where: { id: agent.id },
        data: { cashBalance: agentNewCashBalance },
        transaction: trx
      });

      // Commit transaction
      await trx.commit();

      return res.json({
        amount,
        type,
        transactionId: transaction.id,
        reference: transaction.reference
      });

    } catch (error) {
      // Rollback transaction on error
      await trx.rollback();
      throw error;
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}