// frontend/utils/env.js
export const isProd = process.env.NODE_ENV === 'production';
export const isDev = process.env.NODE_ENV === 'development';

export const logEnvInfo = () => {
  if (isDev) {
    console.log('Development environment:', {
      backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
      nodeEnv: process.env.NODE_ENV
    });
  }
};