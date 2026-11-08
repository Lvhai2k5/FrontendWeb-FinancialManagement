import axiosClient from './axiosClient';
import { API_PREFIX } from '@/constants';
import type { LoginPayload, RegisterPayload, TokenPair } from '@/types';

const base = `${API_PREFIX}/auth`;

const authApi = {
  login: (data: LoginPayload) => axiosClient.post<TokenPair>(`${base}/login`, data),
  register: (data: RegisterPayload) => axiosClient.post<void>(`${base}/register`, data),
  logout: (refreshToken: string) => axiosClient.post<void>(`${base}/logout`, { refreshToken }),
};

export default authApi;
