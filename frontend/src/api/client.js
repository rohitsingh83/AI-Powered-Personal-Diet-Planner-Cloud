import axios from 'axios';

// Dynamically use VITE_API_URL in production (Vercel) or fallback to local /api proxy
const rawApiUrl = import.meta.env.VITE_API_URL;
const baseURL = rawApiUrl
  ? `${rawApiUrl.replace(/\/$/, '')}/api`
  : '/api';

const client = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
