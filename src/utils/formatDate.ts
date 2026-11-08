const pad = (n: number): string => String(n).padStart(2, '0');

export function formatDateTime(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** "5 phút trước", "3 giờ trước"... */
export function formatRelative(iso: string | null, now: Date = new Date()): string {
  if (!iso) return '';
  const diffSec = Math.max(0, Math.floor((now.getTime() - new Date(iso).getTime()) / 1000));
  if (diffSec < 60) return 'Vừa xong';
  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min} phút trước`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour} giờ trước`;
  return `${Math.floor(hour / 24)} ngày trước`;
}

/** yyyy-MM-dd → nhãn trục biểu đồ "dd/MM". */
export function formatShortDate(isoDate: string): string {
  const [, m, d] = isoDate.split('-');
  return m && d ? `${d}/${m}` : isoDate;
}
