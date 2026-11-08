/** Entity SupportTicket chỉ có `content` — lấy dòng đầu làm tiêu đề hiển thị. */
export function ticketTitle(content: string, max = 80): string {
  const first = content.trim().split('\n')[0] ?? '';
  return first.length > max ? `${first.slice(0, max - 1)}…` : first;
}

export function ticketCode(id: number): string {
  return `#TK-${id}`;
}
