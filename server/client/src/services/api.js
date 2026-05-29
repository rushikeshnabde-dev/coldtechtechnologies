import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'https://coldtechtechnologies.onrender.com/api';

export const api = axios.create({
  baseURL: API,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

// Auto-clear stale session when server returns 401 (e.g. after in-memory DB restart)
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      const msg = err.response?.data?.message || '';
      if (msg === 'User not found' || msg === 'Invalid or expired token') {
        // Clear stored auth so user gets redirected to login
        localStorage.removeItem('coldtech_auth');
        delete api.defaults.headers.common.Authorization;
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);
