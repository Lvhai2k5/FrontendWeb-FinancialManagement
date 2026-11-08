import type { ReactNode } from 'react';
import styles from './StatCard.module.css';

interface Props {
  label: string;
  value: ReactNode;
  unit?: string;
  icon: ReactNode;
  tone?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
  footer?: ReactNode;
}

export default function StatCard({ label, value, unit, icon, tone = 'primary', footer }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        <span className={`${styles.icon} ${styles[tone]}`}>{icon}</span>
      </div>
      <div className={styles.value}>
        {value}
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
