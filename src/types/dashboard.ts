import type { ActivityLog } from './activityLog';
import type { AccountStats } from './account';
import type { SupportTicketCounts } from './supportTicket';

export interface DashboardChartPoint {
  date: string; // yyyy-MM-dd
  newAccounts: number;
  failedLogins: number;
}

/** DTO tổng hợp cho trang Tổng quan Admin — endpoint đề xuất, cần chốt với Backend. */
export interface DashboardSummary {
  accounts: AccountStats;
  tickets: SupportTicketCounts;
  warningCategories: number; // số danh mục chạm amountOfWarning/Emergency
  failedLogins24h: number;
  chart: DashboardChartPoint[];
  recentLogs: ActivityLog[];
}
