import axios from 'axios';
import useAuthStore from '@/store/authStore.js';

const productionApiBase = '/_/backend/api';

function resolveBaseURL() {
  const configuredBaseURL = import.meta.env.VITE_API_URL?.trim();
  const hostname = window.location.hostname;
  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';

  if (isLocalHost) {
    return configuredBaseURL || 'http://localhost:3333/api';
  }

  return productionApiBase;
}

const api = axios.create({
  baseURL: resolveBaseURL(),
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
