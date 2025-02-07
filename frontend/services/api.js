// frontend/services/api.js
import axios from 'axios';

// Set base URL for API
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Create Axios instance with base configuration
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token to each request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/** Authentication APIs */
export const authAPI = {
  login: async (identifier, password) => {
    try {
      const { data } = await api.post('/api/auth/local', { identifier, password });
      if (data.jwt && data.user) {
        localStorage.setItem('token', data.jwt);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect based on user account type
        const userType = data.user.accountType;
        window.location.href = userType === 'operator' ? '/menu/operator/dashboard' : '/menu/customer/dashboard';
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  register: async (username, email, password) => {
    try {
      const { data } = await api.post('/api/auth/local/register', { username, email, password });
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
};

/** Menu APIs */
export const menuAPI = {
  fetchMenu: async (restaurantId) => {
    try {
      const { data } = await api.get('/api/menus', {
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
  create: async (menuData) => {
    try {
      const response = await api.post('/api/menus', { data: menuData });
      return response.data;
    } catch (error) {
      console.error('Error creating menu:', error);
      throw error;
    }
  },
  update: async (menuId, menuData) => {
    try {
      const response = await api.put(`/api/menus/${menuId}`, { data: menuData });
      return response.data;
    } catch (error) {
      console.error('Error updating menu:', error);
      throw error;
    }
  },
  delete: async (menuId) => {
    try {
      const response = await api.delete(`/api/menus/${menuId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting menu:', error);
      throw error;
    }
  },
};

/** Fetch Menu by Table ID */
export const fetchMenuByTableId = async (tableId) => {
  try {
    const response = await api.get(`/api/tables/${tableId}?populate=restaurant,restaurant.menus`);
    return response.data;
  } catch (error) {
    console.error('Error fetching menu by table ID:', error);
    throw error;
  }
};

/** Fetch Restaurant with Menu by Table ID */
export const fetchRestaurantWithMenuByTableId = async (tableId) => {
  try {
    const response = await api.get(`/api/restaurants`, {
      params: {
        'filters[tables][id][$eq]': tableId,
        'populate': {
          menus: '*',
          tables: '*',
        },
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurant data:', error);
    throw error;
  }
};

/** Order APIs */
export const orderAPI = {
  createOrder: async (orderData) => {
    try {
      // Validate required fields before making the API call
      const requiredFields = ['status', 'total', 'menu_items', 'tables', 'payment_method'];
      const missingFields = requiredFields.filter(field => !orderData.data[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const response = await api.post('/api/orders', orderData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Order creation error:', error);
      throw error;
    }
  },

  getOrders: async (filters = {}) => {
    try {
      const response = await api.get('/api/orders', {
        params: {
          ...filters,
          'populate[menu_items][populate]': '*',
          'populate[tables]': '*',
          'populate[customer_profile]': '*',
          'sort[0]': 'createdAt:desc',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/api/orders/${orderId}`, {
        data: { status }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
};

/** Restaurant APIs */
export const restaurantAPI = {
  create: async (restaurantData) => {
    try {
      const response = await api.post('/api/restaurants', { data: restaurantData });
      return response.data;
    } catch (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }
  },
  update: async (restaurantId, restaurantData) => {
    try {
      const response = await api.put(`/api/restaurants/${restaurantId}`, { data: restaurantData });
      return response.data;
    } catch (error) {
      console.error('Error updating restaurant:', error);
      throw error;
    }
  },
  delete: async (restaurantId) => {
    try {
      const response = await api.delete(`/api/restaurants/${restaurantId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      throw error;
    }
  },
  get: async (restaurantId) => {
    try {
      const { data } = await api.get(`/api/restaurants/${restaurantId}?populate=*`);
      return data;
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      throw error;
    }
  },
  getAll: async (userId) => {
    try {
      const { data } = await api.get(`/api/restaurants`, {
        params: {
          'filters[users_permissions_user][id][$eq]': userId,
          'populate': '*',
        },
      });
      return data;
    } catch (error) {
      console.error('Error fetching all restaurants for user:', error);
      throw error;
    }
  },
};

/** Table APIs */
export const tableAPI = {
  create: async (tableData) => {
    try {
      const response = await api.post('/api/tables', { data: tableData });
      return response.data;
    } catch (error) {
      console.error('Error creating table:', error);
      throw error;
    }
  },
  update: async (tableId, tableData) => {
    try {
      const response = await api.put(`/api/tables/${tableId}`, { data: tableData });
      return response.data;
    } catch (error) {
      console.error('Error updating table:', error);
      throw error;
    }
  },
  delete: async (tableId) => {
    try {
      const response = await api.delete(`/api/tables/${tableId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting table:', error);
      throw error;
    }
  },
  get: async (tableId) => {
    try {
      const { data } = await api.get(`/api/tables/${tableId}?populate=*`);
      return data;
    } catch (error) {
      console.error('Error fetching table:', error);
      throw error;
    }
  },
  getByRestaurant: async (restaurantId) => {
    try {
      const { data } = await api.get(`/api/tables`, {
        params: {
          'filters[restaurant][id][$eq]': restaurantId,
          'populate': '*',
        },
      });
      return data;
    } catch (error) {
      console.error('Error fetching tables by restaurant:', error);
      throw error;
    }
  },
};

/** User APIs */
export const userAPI = {
  me: async () => {
    try {
      const { data } = await api.get('/api/users/me?populate=*');
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
  update: async (userId, userData) => {
    try {
      const response = await api.put(`/api/users/${userId}`, { data: userData });
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
};

export const fetchMenuById = (id) => {
  // Function implementation
};

export const updateMenu = (menuId, menuData) => {
  // Function implementation
};

