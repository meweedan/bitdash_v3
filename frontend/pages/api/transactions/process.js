// api/transactions/process.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { linkId, pin, type } = req.body.data;
  const customerId = req.user.id; // Assuming auth middleware sets this

  try {
    // Start transaction
    const trx = await strapi.db.transaction();
    
    try {
      // 1. Fetch and validate payment link
      const paymentLink = await strapi.db.query('api::payment-link.payment-link')
        .findOne({ 
          where: { link_id: linkId, status: 'active' },
          populate: ['merchant.wallet']
        });

      if (!paymentLink) {
        throw new Error('Invalid or expired payment link');
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

      // 3. Validate PIN
      const customer = await strapi.db.query('api::customer-profile.customer-profile')
        .findOne({ 
          where: { users_permissions_user: customerId }
        });

      if (customer.wallet_pin !== parseInt(pin)) {
        throw new Error('Invalid PIN');
      }

      // 4. Check balance
      if (customerWallet.balance < paymentLink.amount) {
        throw new Error('Insufficient balance');
      }

      // 5. Check daily limit
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayTransactions = await strapi.db.query('api::transaction.transaction')
        .count({
          where: {
            sender: customerWallet.id,
            createdAt: { $gte: todayStart },
            status: 'completed'
          }
        });

      const todayAmount = todayTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      if (todayAmount + paymentLink.amount > customerWallet.dailyLimit) {
        throw new Error('Daily limit exceeded');
      }

      // 6. Calculate fee
      const feeConfig = await strapi.db.query('api::fee-config.fee-config').findOne();
      const fee = (paymentLink.amount * feeConfig.transfer_fee_percentage) / 100;

      // 7. Create transaction record
      const transaction = await strapi.db.query('api::transaction.transaction')
        .create({
          data: {
            amount: paymentLink.amount,
            fee,
            currency: paymentLink.currency,
            type: 'transfer',
            status: 'completed',
            sender: customerWallet.id,
            receiver: paymentLink.merchant.wallet.id,
            reference: `PAY${Date.now()}${Math.random().toString(36).substr(2, 4)}`.toUpperCase()
          },
          transaction: trx
        });

      // 8. Update balances
      await strapi.db.query('api::wallet.wallet').update({
        where: { id: customerWallet.id },
        data: {
          balance: customerWallet.balance - paymentLink.amount - fee,
          lastActivity: new Date()
        },
        transaction: trx
      });

      await strapi.db.query('api::wallet.wallet').update({
        where: { id: paymentLink.merchant.wallet.id },
        data: {
          balance: paymentLink.merchant.wallet.balance + paymentLink.amount,
          lastActivity: new Date()
        },
        transaction: trx
      });

      // 9. Update payment link status
      await strapi.db.query('api::payment-link.payment-link').update({
        where: { id: paymentLink.id },
        data: { status: 'completed' },
        transaction: trx
      });

      // Commit transaction
      await trx.commit();

      return res.json({
        amount: paymentLink.amount,
        currency: paymentLink.currency,
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