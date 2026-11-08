import type { ReactNode } from 'react';
import styles from './Badge.module.css';

export type BadgeTone = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'primary';

interface Props {
  tone?: BadgeTone;
  dot?: boolean;
  children: ReactNode;
}

export default function Badge({ tone = 'neutral', dot = false, children }: Props) {
  return (
    <span className={`${styles.badge} ${styles[tone]}`}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
}
