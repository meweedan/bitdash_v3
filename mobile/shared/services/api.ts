import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ApiConfig {
  baseURL: string;
  appName: 'bitcash' | 'bitfood' | 'bitride' | 'bitshop';
  timeout?: number;
}

export class ApiService {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = {
      timeout: 10000,
      ...config
    };
  }

  private async getHeaders() {
    const token = await AsyncStorage.getItem(`${this.config.appName}_token`);
    return {
      'Content-Type': 'application/json',
      'X-App-Name': this.config.appName,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get<T>(`${this.config.baseURL}${endpoint}`, {
        headers,
        params,
        timeout: this.config.timeout
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    try {
      const headers = await this.getHeaders();
      const response = await axios.post<T>(`${this.config.baseURL}${endpoint}`, data, {
        headers,
        timeout: this.config.timeout
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: unknown) {
    console.error(`[${this.config.appName.toUpperCase()}] API Error:`, error);
    // Add more sophisticated error handling
  }
}

// Factory functions for each app
export const createBitCashApi = () => new ApiService({
  appName: 'bitcash',
  baseURL: 'https://api.bitdash.com/cash'
});

export const createBitFoodApi = () => new ApiService({
  appName: 'bitfood',
  baseURL: 'https://api.bitdash.com/food'
});

export const createBitRideApi = () => new ApiService({
  appName: 'bitride',
  baseURL: 'https://api.bitdash.com/ride'
});

export const createBitShopApi = () => new ApiService({
  appName: 'bitshop',
  baseURL: 'https://api.bitdash.com/shop'
});