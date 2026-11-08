export function formatNumber(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value);
}

export function formatCurrency(value: number): string {
  return `${formatNumber(value)} ₫`;
}
