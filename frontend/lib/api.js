import axios from 'axios';

const STRAPI_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const strapiAxios = axios.create({
  baseURL: STRAPI_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// No need for request interceptor since we're not handling authentication here

// Add response interceptor for better error handling
strapiAxios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export const api = {
  get: async (endpoint) => {
    try {
      const { data } = await strapiAxios.get(endpoint);
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },

  fetchMenu: async (restaurantId) => {
    try {
      const { data } = await strapiAxios.get('/api/menus', {
        params: {
          'filters[restaurant][id][$eq]': restaurantId,
          'populate': '*',
        },
      });
      return data;
    } catch (error) {
      console.error('Error fetching menu:', error);
      throw error;
    }
  },

  // Add other API methods as needed
};