import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Lock, Mail } from 'lucide-react';
import hero from '@/assets/hero.jpg';
import Button from '@/components/common/Button';
import TextField from '@/components/common/TextField';
import AuthLayout from '@/components/layout/AuthLayout';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useLogin } from './useLogin';
import styles from './Login.module.css';

function Aside() {
  return (
    <>
      <span className={styles.eyebrow}>Nền tảng quản trị gia đình</span>
      <h2 className={styles.asideTitle}>An tâm tài chính, gắn kết tương lai.</h2>
      <p className={styles.asideText}>
        Thiết lập ngân sách minh bạch, tự động hóa quản lý thu chi và tích lũy thông minh theo thời gian thực.
      </p>
      <img src={hero} alt="" className={styles.asideImg} />
      <ul className={styles.points}>
        <li>
          <CheckCircle2 size={18} /> Hợp nhất số dư và ngân sách đa thành viên trong gia đình
        </li>
        <li>
          <CheckCircle2 size={18} /> Cảnh báo bội chi thông minh khi chạm ngưỡng danh mục
        </li>
      </ul>
    </>
  );
}

export default function Login() {
  const { session } = useAuth();
  const f = useLogin();

  if (session?.role === 'ADMIN') return <Navigate to={ROUTES.adminDashboard} replace />;

  return (
    <AuthLayout badge="Cổng trực tuyến" aside={<Aside />}>
      <div>
        <h1 className={styles.title}>Đăng nhập hệ thống</h1>
        <p className={styles.sub}>Nhập thông tin xác thực để truy cập tài khoản của bạn.</p>
      </div>

      <form className={styles.form} onSubmit={f.handleSubmit} noValidate>
        <TextField
          label="Email hoặc Tên tài khoản"
          icon={<Mail size={18} />}
          placeholder="name@family.com hoặc username"
          autoComplete="username"
          value={f.username}
          onChange={(e) => f.setUsername(e.target.value)}
        />
        <TextField
          label="Mật khẩu"
          type="password"
          revealable
          icon={<Lock size={18} />}
          placeholder="••••••••"
          autoComplete="current-password"
          value={f.password}
          onChange={(e) => f.setPassword(e.target.value)}
        />
        {f.error && (
          <p className={styles.error} role="alert">
            {f.error}
          </p>
        )}
        <Button type="submit" variant="dark" size="lg" block loading={f.submitting}>
          Đăng nhập ngay <ArrowRight size={18} />
        </Button>
      </form>

      <p className={styles.switch}>
        Chưa có tài khoản FinNest? <Link to={ROUTES.register}>Đăng ký ngay</Link>
      </p>
    </AuthLayout>
  );
}
