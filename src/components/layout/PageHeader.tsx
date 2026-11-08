import type { ReactNode } from 'react';
import styles from './PageHeader.module.css';

interface Props {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: Props) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <div className={styles.sub}>{subtitle}</div>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
