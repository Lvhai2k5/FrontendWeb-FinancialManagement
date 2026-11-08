import axiosClient from './axiosClient';
import { API_PREFIX } from '@/constants';
import type { Page, RespondTicketPayload, SupportTicket, SupportTicketCounts, SupportTicketQuery } from '@/types';

const base = `${API_PREFIX}/admin/support-tickets`;

const supportTicketApi = {
  list: (params: SupportTicketQuery) => axiosClient.get<Page<SupportTicket>>(base, { params }),
  counts: () => axiosClient.get<SupportTicketCounts>(`${base}/counts`),
  /** Submitted → Viewed khi Admin mở phiếu. */
  markViewed: (id: number) => axiosClient.patch<SupportTicket>(`${base}/${id}/view`),
  /** Viewed → Responded; bắt buộc noteOfRespondent (Backend tự gắn answeredPersonId = admin hiện tại). */
  respond: (id: number, data: RespondTicketPayload) =>
    axiosClient.post<SupportTicket>(`${base}/${id}/respond`, data),
};

export default supportTicketApi;
