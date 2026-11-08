import { useState } from 'react';
import dashboardApi from '@/api/dashboardApi';
import { useAsync } from '@/hooks/useAsync';
import { formatShortDate } from '@/utils/formatDate';

export const RANGE_OPTIONS = [
  { days: 1, label: 'Hôm nay' },
  { days: 7, label: '7 ngày qua' },
  { days: 30, label: '30 ngày' },
] as const;

export function useDashboard() {
  const [days, setDays] = useState<number>(7);
  const state = useAsync(() => dashboardApi.summary(days).then((r) => r.data), [days]);

  const chart = state.data?.chart ?? [];
  const labels = chart.map((p) => formatShortDate(p.date));
  const newAccounts = chart.map((p) => p.newAccounts);
  const failedLogins = chart.map((p) => p.failedLogins);

  return { days, setDays, ...state, labels, newAccounts, failedLogins };
}
