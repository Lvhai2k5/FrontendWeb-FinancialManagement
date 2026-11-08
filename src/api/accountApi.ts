import axiosClient from './axiosClient';
import { API_PREFIX } from '@/constants';
import type { AccountQuery, AccountStats, AccountSummary, Page } from '@/types';

const base = `${API_PREFIX}/admin/accounts`;

const accountApi = {
  list: (params: AccountQuery) => axiosClient.get<Page<AccountSummary>>(base, { params }),
  stats: () => axiosClient.get<AccountStats>(`${base}/stats`),
  /** Admin khóa → accountStatus = Inactive (Backend ghi ActivityLog Modify). */
  lock: (accountId: number) => axiosClient.patch<AccountSummary>(`${base}/${accountId}/lock`),
  unlock: (accountId: number) => axiosClient.patch<AccountSummary>(`${base}/${accountId}/unlock`),
};

export default accountApi;
