import axiosClient from './axiosClient';
import { API_PREFIX } from '@/constants';
import type { DashboardSummary } from '@/types';

const dashboardApi = {
  summary: (days: number) =>
    axiosClient.get<DashboardSummary>(`${API_PREFIX}/admin/dashboard`, { params: { days } }),
};

export default dashboardApi;
