import axios from 'axios';
import useAuthStore from '@/store/authStore.js';

const isProduction = import.meta.env.PROD;

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (isProduction ? '/_/backend/api' : 'http://localhost:3333/api'),
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
