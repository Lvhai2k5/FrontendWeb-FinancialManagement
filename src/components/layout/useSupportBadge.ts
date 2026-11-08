import { useEffect, useState } from 'react';
import supportTicketApi from '@/api/supportTicketApi';

/** Số phiếu hỗ trợ đang chờ xử lý (Submitted) hiện trên badge sidebar. Lỗi → ẩn badge. */
export function useSupportBadge(): number {
  const [pending, setPending] = useState(0);

  useEffect(() => {
    let cancelled = false;
    supportTicketApi
      .counts()
      .then((res) => {
        if (!cancelled) setPending(res.data.submitted);
      })
      .catch(() => {
        if (!cancelled) setPending(0);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return pending;
}
