import axios, { type InternalAxiosRequestConfig } from 'axios';
import { ROUTES } from '../routes';
import { storage } from '../utils';
import { refreshToken } from './auth/auth';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Adiciona o token de autenticação em todas as requisições
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.url?.includes('/auth/refresh-token')) return config;

  const token = storage.token.getAccessToken();
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

// Intercepta erros 401 e faz refresh automático do token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response?.status === 401;
    const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh-token');

    // Ignora se não for 401, se já tentou refresh ou se for o endpoint de refresh
    if (!isUnauthorized || originalRequest._retry || isRefreshEndpoint) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshTokenValue = storage.token.getRefreshToken();
    if (!refreshTokenValue) {
      storage.token.clearTokens();
      window.location.href = ROUTES.AUTH.SIGN_IN;
      return Promise.reject(error);
    }

    try {
      const { accessToken, refreshToken: newRefreshToken } = await refreshToken({ refreshToken: refreshTokenValue });
      storage.token.setTokens(accessToken, newRefreshToken);

      // Reenvia a requisição original com o novo token
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch {
      storage.token.clearTokens();
      window.location.href = '/auth/sign-in';
      return Promise.reject(error);
    }
  },
);
