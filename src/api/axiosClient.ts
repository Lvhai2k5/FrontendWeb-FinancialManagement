import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { API_PREFIX, STORAGE_KEYS } from '@/constants';
import type { TokenPair } from '@/types';

// Rỗng = gọi cùng origin (dev dùng proxy của Vite). Production đặt VITE_API_BASE_URL = URL backend.
const baseURL: string = import.meta.env.VITE_API_BASE_URL ?? '';

const axiosClient: AxiosInstance = axios.create({ baseURL, timeout: 15000 });

export const tokenStorage = {
  getAccess: (): string | null => localStorage.getItem(STORAGE_KEYS.accessToken),
  getRefresh: (): string | null => localStorage.getItem(STORAGE_KEYS.refreshToken),
  save: (tokens: TokenPair): void => {
    localStorage.setItem(STORAGE_KEYS.accessToken, tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.refreshToken, tokens.refreshToken);
  },
  clear: (): void => {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
  },
};

/** Gọi khi refresh thất bại → AuthContext đăng ký handler để đưa người dùng về trang đăng nhập. */
let onSessionExpired: (() => void) | null = null;
export function setSessionExpiredHandler(handler: (() => void) | null): void {
  onSessionExpired = handler;
}

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

// Nhiều request 401 cùng lúc chỉ gọi refresh 1 lần.
let refreshing: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefresh();
  if (!refreshToken) throw new Error('NO_REFRESH_TOKEN');
  // Dùng axios thuần (không qua interceptor) để tránh vòng lặp vô hạn.
  const res = await axios.post<TokenPair>(`${baseURL}${API_PREFIX}/auth/refresh`, { refreshToken });
  tokenStorage.save(res.data);
  return res.data.accessToken;
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const isAuthCall = original?.url?.includes('/auth/') ?? false;

    if (error.response?.status === 401 && original && !original._retried && !isAuthCall) {
      original._retried = true;
      try {
        refreshing ??= refreshAccessToken().finally(() => {
          refreshing = null;
        });
        const newToken = await refreshing;
        original.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(original);
      } catch {
        tokenStorage.clear();
        onSessionExpired?.();
      }
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
