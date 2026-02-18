import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthResponse } from '../types';

const STORAGE_KEY = 'java-ecommerce-auth';

export interface StoredAuth {
  accessToken: string;
  refreshToken: string;
  user: AuthResponse['user'];
}

export const authStorage = {
  get(): StoredAuth | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  },
  set(value: StoredAuth) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  },
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const stored = authStorage.get();
  if (stored?.accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${stored.accessToken}`;
  }
  return config;
});

let refreshing: Promise<string> | null = null;

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const stored = authStorage.get();

    if (
      error.response?.status === 401 &&
      stored?.refreshToken &&
      !original._retry &&
      !original.url?.includes('/auth/')
    ) {
      original._retry = true;
      try {
        if (!refreshing) {
          refreshing = axios
            .post<AuthResponse>(`${api.defaults.baseURL}/auth/refresh`, {
              refreshToken: stored.refreshToken
            })
            .then((res) => {
              authStorage.set({
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken,
                user: res.data.user
              });
              return res.data.accessToken;
            })
            .finally(() => {
              refreshing = null;
            });
        }
        const newToken = await refreshing;
        if (original.headers) original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        authStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
