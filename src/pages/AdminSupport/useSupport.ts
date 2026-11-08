import { useState } from 'react';
import supportTicketApi from '@/api/supportTicketApi';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import type { SupportTicket, TicketStatus } from '@/types';
import { getErrorMessage } from '@/utils/errorMessage';

export type TicketTab = 'all' | Exclude<TicketStatus, 'DRAFT'>;

export function useSupport() {
  const [tab, setTab] = useState<TicketTab>('all');
  const [keywordInput, setKeywordInput] = useState('');
  const keyword = useDebounce(keywordInput.trim());

  const list = useAsync(
    () =>
      supportTicketApi
        .list({
          page: 0,
          size: DEFAULT_PAGE_SIZE,
          keyword: keyword || undefined,
          ticketStatus: tab === 'all' ? undefined : tab,
        })
        .then((r) => r.data),
    [tab, keyword],
  );
  const counts = useAsync(() => supportTicketApi.counts().then((r) => r.data), []);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  // Bản ticket đã cập nhật cục bộ (sau khi Viewed/Responded) — ưu tiên hơn bản trong list.
  const [overrides, setOverrides] = useState<Record<number, SupportTicket>>({});
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tickets = (list.data?.content ?? []).map((t) => overrides[t.supportTicketId] ?? t);
  const selected = tickets.find((t) => t.supportTicketId === selectedId) ?? null;

  const select = async (ticket: SupportTicket) => {
    setSelectedId(ticket.supportTicketId);
    setNote('');
    setError(null);
    // Submitted → Viewed ngay khi Admin mở phiếu
    if (ticket.ticketStatus === 'SUBMITTED') {
      try {
        const res = await supportTicketApi.markViewed(ticket.supportTicketId);
        setOverrides((o) => ({ ...o, [ticket.supportTicketId]: res.data }));
        counts.reload();
      } catch (err) {
        setError(getErrorMessage(err));
      }
    }
  };

  const respond = async () => {
    if (!selected) return;
    if (!note.trim()) {
      setError('Vui lòng nhập nội dung phản hồi (noteOfRespondent).');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await supportTicketApi.respond(selected.supportTicketId, { noteOfRespondent: note.trim() });
      setOverrides((o) => ({ ...o, [selected.supportTicketId]: res.data }));
      setNote('');
      counts.reload();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    tab, setTab, keywordInput, setKeywordInput, list, counts, tickets,
    selected, select, note, setNote, submitting, error, respond,
  };
}
