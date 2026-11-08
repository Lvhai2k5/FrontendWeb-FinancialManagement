import { Link } from 'react-router-dom';
import { Smartphone } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';
import { ROUTES } from '@/constants';
import styles from './UserNotice.module.css';

/** Hiển thị khi tài khoản không phải Admin cố vào khu vực quản trị web. */
export default function UserNotice() {
  return (
    <AuthLayout badge="Thông báo">
      <div className={styles.box}>
        <Smartphone size={40} className={styles.icon} />
        <h1 className={styles.title}>Khu vực dành cho quản trị viên</h1>
        <p className={styles.text}>
          Tài khoản người dùng quản lý tài chính gia đình trên ứng dụng di động FinNest. Trang web hiện chỉ dành cho
          quản trị viên hệ thống.
        </p>
        <Link to={ROUTES.home}>Về trang chủ</Link>
      </div>
    </AuthLayout>
  );
}
