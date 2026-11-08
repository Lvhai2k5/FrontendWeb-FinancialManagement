import { Link } from 'react-router-dom';
import AuthLayout from '@/components/layout/AuthLayout';
import { ROUTES } from '@/constants';

export default function NotFound() {
  return (
    <AuthLayout badge="404">
      <div style={{ textAlign: 'center', display: 'grid', gap: 12 }}>
        <h1>Không tìm thấy trang</h1>
        <p style={{ color: 'var(--text-muted)' }}>Đường dẫn bạn truy cập không tồn tại.</p>
        <Link to={ROUTES.home}>Về trang chủ</Link>
      </div>
    </AuthLayout>
  );
}
