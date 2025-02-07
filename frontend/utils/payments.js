// utils/payments.js
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const processPayment = async ({ amount, currency, type, itemId }) => {
  const token = localStorage.getItem('token');
  
  try {
    // Create payment record
    const paymentResponse = await fetch(`${BASE_URL}/api/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          amount,
          currency,
          type,
          status: 'pending',
          item: itemId
        }
      })
    });

    if (!paymentResponse.ok) {
      const error = await paymentResponse.json();
      throw new Error(error.message || 'Payment processing failed');
    }

    const payment = await paymentResponse.json();
    return payment.data;
  } catch (error) {
    console.error('Payment processing error:', error);
    throw error;
  }
};

export const updateUserBalance = async (userId, newBalance) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`${BASE_URL}/api/customer-profiles/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          credit_balance: newBalance
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update balance');
    }

    return await response.json();
  } catch (error) {
    console.error('Balance update error:', error);
    throw error;
  }
};