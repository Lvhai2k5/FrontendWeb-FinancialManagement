import axiosClient from './axiosClient';
import { API_PREFIX } from '@/constants';
import type { ActivityLog, ActivityLogQuery, ActivityLogStats, Page } from '@/types';

const base = `${API_PREFIX}/admin/activity-logs`;

const activityLogApi = {
  list: (params: ActivityLogQuery) => axiosClient.get<Page<ActivityLog>>(base, { params }),
  stats: () => axiosClient.get<ActivityLogStats>(`${base}/stats`),
};

export default activityLogApi;
