function escapeCell(value: string | number | null): string {
  const s = value === null ? '' : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Tải file CSV (có BOM để Excel đọc đúng tiếng Việt). */
export function downloadCsv(filename: string, header: string[], rows: Array<Array<string | number | null>>): void {
  const lines = [header, ...rows].map((r) => r.map(escapeCell).join(','));
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
