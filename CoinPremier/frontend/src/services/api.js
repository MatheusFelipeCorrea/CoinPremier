import axios from 'axios';
import useAuthStore from '@/store/authStore.js';

const isProduction = import.meta.env.PROD;
const productionApiBase = '/_/backend/api';

function resolveBaseURL() {
  const configuredBaseURL = import.meta.env.VITE_API_URL?.trim();

  if (!isProduction) {
    return configuredBaseURL || 'http://localhost:3333/api';
  }

  if (!configuredBaseURL) {
    return productionApiBase;
  }

  try {
    const resolvedURL = new URL(configuredBaseURL, window.location.origin);

    if (resolvedURL.hostname === 'localhost' || resolvedURL.hostname === '127.0.0.1') {
      return productionApiBase;
    }
  } catch {
    return productionApiBase;
  }

  return configuredBaseURL;
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
