import type { AccountRole, AuthSession } from '@/types';

function isRole(value: unknown): value is AccountRole {
  return value === 'ADMIN' || value === 'USER';
}

/**
 * Đọc payload JWT (chỉ để hiển thị/điều hướng phía client — Backend mới là nơi xác thực thật).
 * Trả null nếu token hỏng hoặc thiếu field.
 */
export function parseJwt(token: string): AuthSession | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const json = decodeURIComponent(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
        .split('')
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    );
    const data = JSON.parse(json) as { sub?: unknown; role?: unknown; exp?: unknown };
    if (typeof data.sub !== 'string' || !isRole(data.role) || typeof data.exp !== 'number') return null;
    return { userId: data.sub, role: data.role, exp: data.exp };
  } catch {
    return null;
  }
}

export function isExpired(session: AuthSession, now: number = Date.now()): boolean {
  return session.exp * 1000 <= now;
}
