// lib/axios.js
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

export default strapiAxios;