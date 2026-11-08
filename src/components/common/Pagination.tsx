import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.css';

interface Props {
  /** 0-based, đúng như Spring Page.number */
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function buildPages(current: number, total: number): Array<number | 'gap'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const set = new Set<number>([0, total - 1, current - 1, current, current + 1]);
  const sorted = [...set].filter((p) => p >= 0 && p < total).sort((a, b) => a - b);
  const out: Array<number | 'gap'> = [];
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    if (i > 0 && prev !== undefined && p - prev > 1) out.push('gap');
    out.push(p);
  });
  return out;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;
  return (
    <nav className={styles.nav} aria-label="Phân trang">
      <button className={styles.btn} disabled={page === 0} onClick={() => onChange(page - 1)} aria-label="Trang trước">
        <ChevronLeft size={16} />
      </button>
      {buildPages(page, totalPages).map((p, i) =>
        p === 'gap' ? (
          <span key={`g${i}`} className={styles.gap}>…</span>
        ) : (
          <button
            key={p}
            className={`${styles.btn} ${p === page ? styles.active : ''}`}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p + 1}
          </button>
        ),
      )}
      <button
        className={styles.btn}
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
        aria-label="Trang sau"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
