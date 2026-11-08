import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import authApi from '@/api/authApi';
import { setSessionExpiredHandler, tokenStorage } from '@/api/axiosClient';
import type { AuthSession, LoginPayload } from '@/types';
import { isExpired, parseJwt } from '@/utils/jwt';

export interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  /** Đăng nhập, lưu token, trả về session đọc từ JWT. */
  login: (payload: LoginPayload) => Promise<AuthSession>;
  logout: () => Promise<void>;
  /** Xóa token cục bộ (dùng khi role không phù hợp với cổng đăng nhập). */
  clearSession: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredSession(): AuthSession | null {
  const token = tokenStorage.getAccess();
  if (!token) return null;
  const session = parseJwt(token);
  if (!session) return null;
  // Access token hết hạn nhưng còn refresh token → interceptor sẽ tự refresh khi gọi API.
  if (isExpired(session) && !tokenStorage.getRefresh()) return null;
  return session;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(readStoredSession);

  const clearSession = useCallback(() => {
    tokenStorage.clear();
    setSession(null);
  }, []);

  useEffect(() => {
    setSessionExpiredHandler(clearSession);
    return () => setSessionExpiredHandler(null);
  }, [clearSession]);

  const login = useCallback(async (payload: LoginPayload): Promise<AuthSession> => {
    const res = await authApi.login(payload);
    const parsed = parseJwt(res.data.accessToken);
    if (!parsed) throw new Error('INVALID_TOKEN');
    tokenStorage.save(res.data);
    setSession(parsed);
    return parsed;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.getRefresh();
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // Logout phía server thất bại vẫn xóa token cục bộ.
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({ session, isAuthenticated: session !== null, login, logout, clearSession }),
    [session, login, logout, clearSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
