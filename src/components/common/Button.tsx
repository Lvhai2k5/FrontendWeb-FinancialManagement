import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'dark' | 'outline' | 'ghost' | 'danger' | 'success';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  loading?: boolean;
  icon?: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  loading = false,
  icon,
  children,
  disabled,
  className = '',
  type = 'button',
  ...rest
}: Props) {
  const cls = [styles.btn, styles[variant], styles[size], block ? styles.block : '', className].join(' ');
  return (
    <button type={type} className={cls} disabled={disabled || loading} {...rest}>
      {loading ? <span className={styles.spinner} aria-hidden /> : icon}
      {children}
    </button>
  );
}
