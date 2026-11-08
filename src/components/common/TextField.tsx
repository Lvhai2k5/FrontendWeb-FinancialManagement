import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './TextField.module.css';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  icon?: ReactNode;
  error?: string;
  /** Hiện nút ẩn/hiện mật khẩu (khi type="password"). */
  revealable?: boolean;
  rightLabel?: ReactNode;
}

export default function TextField({ label, icon, error, revealable, rightLabel, type = 'text', required, ...rest }: Props) {
  const id = useId();
  const [shown, setShown] = useState(false);
  const inputType = revealable && shown ? 'text' : type;

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.req}> *</span>}
        </label>
        {rightLabel}
      </div>
      <div className={`${styles.control} ${error ? styles.hasError : ''}`}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input id={id} className={styles.input} type={inputType} aria-invalid={!!error} {...rest} />
        {revealable && (
          <button
            type="button"
            className={styles.reveal}
            onClick={() => setShown((v) => !v)}
            aria-label={shown ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {shown ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
