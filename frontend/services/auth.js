// frontend/services/auth.js
import { api } from './api';

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/api/auth/login', credentials);
      if (response.data.jwt) {
        localStorage.setItem('token', response.data.jwt);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/api/auth/register', userData);
      if (response.data.jwt) {
        localStorage.setItem('token', response.data.jwt);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};