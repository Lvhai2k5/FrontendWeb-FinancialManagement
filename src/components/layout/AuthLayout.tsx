import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';
import { ROUTES } from '@/constants';
import styles from './AuthLayout.module.css';

interface Props {
  badge: string;
  children: ReactNode;
  /** Panel giới thiệu bên trái (chỉ trang đăng nhập). */
  aside?: ReactNode;
  wide?: boolean;
}

export default function AuthLayout({ badge, children, aside, wide = false }: Props) {
  return (
    <div className={styles.page}>
      <div className={`${styles.card} ${aside ? styles.split : ''} ${wide ? styles.wide : ''}`}>
        {aside && <section className={styles.aside}>{aside}</section>}
        <section className={styles.form}>
          <div className={styles.brandRow}>
            <Link to={ROUTES.home} className={styles.brand}>
              <img src={logo} alt="" className={styles.logo} />
              <span>
                <strong className={styles.name}>FinNest</strong>
                <span className={styles.tag}>Hệ thống quản lý tài chính tổ ấm</span>
              </span>
            </Link>
            <span className={styles.pill}>{badge}</span>
          </div>
          {children}
        </section>
      </div>
    </div>
  );
}
