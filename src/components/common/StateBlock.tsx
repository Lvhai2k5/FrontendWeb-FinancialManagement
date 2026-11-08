import { AlertTriangle, Inbox } from 'lucide-react';
import Button from './Button';
import styles from './StateBlock.module.css';

interface Props {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyText?: string;
  onRetry?: () => void;
}

/** Hiển thị trạng thái Đang tải / Lỗi / Trống. Trả null khi không thuộc trạng thái nào (render dữ liệu). */
export default function StateBlock({ loading, error, empty, emptyText = 'Không có dữ liệu.', onRetry }: Props) {
  if (loading) {
    return (
      <div className={styles.box} role="status">
        <span className={styles.spinner} aria-hidden />
        <p>Đang tải dữ liệu…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.box} role="alert">
        <AlertTriangle size={28} className={styles.errIcon} />
        <p>{error}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Thử lại
          </Button>
        )}
      </div>
    );
  }
  if (empty) {
    return (
      <div className={styles.box}>
        <Inbox size={28} />
        <p>{emptyText}</p>
      </div>
    );
  }
  return null;
}
