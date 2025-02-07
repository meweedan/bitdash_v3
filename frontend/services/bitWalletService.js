// frontend/services/bitWalletService.js
import { api } from './api';

export const bitWalletService = {
  async getBalance(userId) {
    const response = await api.get(`/customer-profiles?filters[users_permissions_user][id][$eq]=${userId}&populate=*`);
    return response.data?.data[0]?.attributes?.credit_balance || 0;
  },

  async processPayment({ amount, customerId, operatorId, description }) {
    const response = await api.post('/payments', {
      data: {
        amount,
        currency: 'LYD',
        type: 'payment',
        status: 'pending',
        customer_profile: customerId,
        operator: operatorId,
        description,
        payment_method: 'bitwallet',
        timestamp: new Date().toISOString()
      }
    });
    return response.data;
  },

  async generateWalletQR(customerId) {
    const timestamp = Date.now();
    const qrData = `bitwallet://customer/${customerId}/${timestamp}`;
    return qrData;
  },

  async verifyTransaction(transactionId) {
    const response = await api.get(`/payments/${transactionId}?populate=*`);
    return response.data;
  },

  async topUpWallet(userId, amount) {
    const response = await api.post('/wallet/topup', {
      data: {
        user_id: userId,
        amount,
        currency: 'LYD'
      }
    });
    return response.data;
  },

  async getTransactionHistory(userId) {
    const response = await api.get(`/payments?filters[customer_profile][users_permissions_user][id][$eq]=${userId}&populate=*&sort[0]=createdAt:desc`);
    return response.data;
  }
};

export default bitWalletService;