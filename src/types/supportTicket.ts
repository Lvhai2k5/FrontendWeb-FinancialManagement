import type { TicketStatus } from './enums';

/** SupportTicket (BUSINESS-REQUIREMENTS 5.7) + thông tin người gửi để hiển thị. */
export interface SupportTicket {
  supportTicketId: number;
  content: string;
  noteOfRespondent: string | null;
  createdPersonId: number;
  answeredPersonId: number | null;
  ticketStatus: TicketStatus;
  createdPersonName: string;
  createdPersonEmail: string;
  /** ISO. Hiện Backend trả null vì entity SupportTicket chưa lưu thời điểm tạo. */
  createdAt: string | null;
}

export interface SupportTicketQuery {
  page: number;
  size: number;
  keyword?: string;
  ticketStatus?: TicketStatus;
}

/** Số phiếu theo từng trạng thái (cho tab lọc + badge sidebar). */
export interface SupportTicketCounts {
  all: number;
  submitted: number;
  viewed: number;
  responded: number;
}

export interface RespondTicketPayload {
  noteOfRespondent: string;
}
