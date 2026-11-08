import type { AccountRole } from './enums';

export interface LoginPayload {
  username: string;
  password: string;
}

/** Cặp token trả về từ POST /api/v1/auth/login và /refresh (TECH-AUTH.md mục 2–3). */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
}

/** Thông tin đọc từ payload JWT: sub (userId), role, exp. */
export interface AuthSession {
  userId: string;
  role: AccountRole;
  exp: number;
}
