import axios from 'axios';

export const getBaseURL = () => {
  const metaEnv = (import.meta as any).env;
  if (metaEnv && metaEnv.VITE_API_URL) {
    const url = String(metaEnv.VITE_API_URL).replace(/\/$/, '');
    return url.endsWith('/api') ? url : `${url}/api`;
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDeviceId = (): string => {
  try {
    let id = localStorage.getItem('campusget_device_id');
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      localStorage.setItem('campusget_device_id', id);
    }
    return id;
  } catch {
    return 'client-default';
  }
};

// Request Interceptor: Attach Token & Device ID
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('projectforge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['x-device-id'] = getDeviceId();
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      localStorage.removeItem('projectforge_token');
    }
    return Promise.reject(error);
  }
);

export default api;
