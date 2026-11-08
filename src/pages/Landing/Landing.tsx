import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import logo from '@/assets/logo.png';
import hero from '@/assets/hero.jpg';
import { ROUTES } from '@/constants';
import styles from './Landing.module.css';

export default function Landing() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to={ROUTES.home} className={styles.brand}>
          <img src={logo} alt="" className={styles.logo} />
          <span>
            Fin<span className={styles.accent}>Nest</span>
          </span>
        </Link>
        <nav className={styles.actions}>
          <Link to={ROUTES.login} className={styles.loginBtn}>
            Đăng nhập
          </Link>
          <Link to={ROUTES.register} className={styles.registerBtn}>
            Đăng ký
          </Link>
        </nav>
      </header>

      <main className={styles.main}>
        <span className={styles.pill}>
          <span className={styles.dot} />
          Đồng hành vun đắp tổ ấm yêu thương
        </span>
        <h1 className={styles.title}>Hệ thống quản lý tài chính cá nhân và gia đình</h1>
        <p className={styles.sub}>
          Chăm sóc tổ ấm, gìn giữ chi tiêu và vun vén tương lai vững vàng cho mọi thành viên trong gia đình.
        </p>
        <div className={styles.cta}>
          <Link to={ROUTES.register} className={styles.primaryCta}>
            Bắt đầu miễn phí <ArrowRight size={18} />
          </Link>
          <Link to={ROUTES.login} className={styles.secondaryCta}>
            Tôi đã có tài khoản
          </Link>
        </div>

        <div className={styles.heroFrame}>
          <img src={hero} alt="Gia đình cùng xem ngân sách trên máy tính bảng" className={styles.hero} />
        </div>
      </main>
    </div>
  );
}
