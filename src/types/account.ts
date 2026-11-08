import type { AccountRole, AccountStatus, FamilyMemberRole } from './enums';

export interface AccountFamilyInfo {
  familyId: number;
  name: string;
  memberCount: number;
  familyMemberRole: FamilyMemberRole;
}

/** Dòng trong bảng quản lý tài khoản: ghép Account + Person (+ thông tin gia đình để hiển thị). */
export interface AccountSummary {
  accountId: number;
  personId: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  accountRole: AccountRole;
  accountStatus: AccountStatus;
  families: AccountFamilyInfo[];
}

export interface AccountQuery {
  page: number;
  size: number;
  keyword?: string;
  accountRole?: AccountRole;
  accountStatus?: AccountStatus;
}

export interface AccountStats {
  total: number;
  active: number;
  inactive: number;
  admins: number;
}
