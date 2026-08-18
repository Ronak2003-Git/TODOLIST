import axios from 'axios';

const TOKEN_KEY = 'cusat-todolist-auth';

export const tokenStore = {
  get() {
    try { return JSON.parse(localStorage.getItem(TOKEN_KEY)); } catch { return null; }
  },
  set(tokens) { localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens)); },
  clear() { localStorage.removeItem(TOKEN_KEY); },
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8018/api',
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const tokens = tokenStore.get();
  if (tokens?.access) config.headers.Authorization = `Bearer ${tokens.access}`;
  return config;
});

export function getApiError(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data;
  if (typeof data?.detail === 'string') return data.detail;
  if (data && typeof data === 'object') {
    const [field, messages] = Object.entries(data)[0] || [];
    if (messages) return `${field ? `${field}: ` : ''}${Array.isArray(messages) ? messages[0] : messages}`;
  }
  return fallback;
}

export default api;
