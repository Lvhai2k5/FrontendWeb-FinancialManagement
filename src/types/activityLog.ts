import type { ActionType, ActivityStatus } from './enums';

/** ActivityLog (BUSINESS-REQUIREMENTS 5.8) + tên/email người thực hiện để hiển thị. */
export interface ActivityLog {
  logId: number;
  actionType: ActionType;
  activityStatus: ActivityStatus;
  activityDescription: string;
  ipAddress: string;
  logTime: string; // ISO
  performedPersonId: number | null;
  performedPersonName: string | null;
  performedPersonEmail: string | null;
}

export interface ActivityLogQuery {
  page: number;
  size: number;
  sort?: string;
  keyword?: string;
  actionType?: ActionType;
  activityStatus?: ActivityStatus;
  from?: string; // yyyy-MM-dd
  to?: string;
}

export interface ActivityLogStats {
  total: number;
  success: number;
  failed: number;
}
