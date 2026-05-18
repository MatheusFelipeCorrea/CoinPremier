import axios from 'axios';
import useAuthStore from '@/store/authStore.js';

const isProduction = import.meta.env.PROD;
const productionApiBase = '/_/backend/api';

function resolveBaseURL() {
  const configuredBaseURL = import.meta.env.VITE_API_URL?.trim();

  // Em produção no Vercel, usa sempre a mesma origem do frontend.
  // Isso evita erros por VITE_API_URL mal configurada.
  if (isProduction) {
    return productionApiBase;
  }

  if (!isProduction) {
    return configuredBaseURL || 'http://localhost:3333/api';
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
