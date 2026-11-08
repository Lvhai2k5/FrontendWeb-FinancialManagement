import type { ActionType, ActivityStatus, TicketStatus } from '@/types';

export const API_PREFIX = '/api/v1';

export const STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
} as const;

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  userNotice: '/web-for-admin',
  adminDashboard: '/admin',
  adminAccounts: '/admin/accounts',
  adminSupport: '/admin/support',
  adminAudit: '/admin/audit-log',
} as const;

export const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  DRAFT: 'Nháp',
  SUBMITTED: 'Chờ xử lý',
  VIEWED: 'Đang xem',
  RESPONDED: 'Đã phản hồi',
};

export const ACTION_TYPES: ActionType[] = ['LOGIN', 'LOGOUT', 'REGISTER', 'CREATE', 'MODIFY', 'DELETE'];
export const ACTIVITY_STATUS_LABEL: Record<ActivityStatus, string> = {
  SUCCESS: 'Thành công',
  FAILED: 'Thất bại',
};

export const DEFAULT_PAGE_SIZE = 20;
