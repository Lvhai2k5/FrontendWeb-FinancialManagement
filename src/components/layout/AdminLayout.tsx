import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LifeBuoy, LogOut, ShieldCheck, Users } from 'lucide-react';
import logo from '@/assets/logo.png';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useSupportBadge } from './useSupportBadge';
import styles from './AdminLayout.module.css';

const NAV = [
  { to: ROUTES.adminDashboard, label: 'Dashboard & Tổng quan', icon: LayoutDashboard, end: true },
  { to: ROUTES.adminAccounts, label: 'Quản lý Tài khoản', icon: Users, end: false },
  { to: ROUTES.adminSupport, label: 'Trung tâm Hỗ trợ', icon: LifeBuoy, end: false, badge: true },
  { to: ROUTES.adminAudit, label: 'Nhật ký Kiểm toán', icon: ShieldCheck, end: false },
] as const;

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const pending = useSupportBadge();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <img src={logo} alt="" className={styles.logo} />
          <div>
            <div className={styles.brandName}>FinNest</div>
            <div className={styles.brandSub}>Admin Console</div>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Điều hướng quản trị">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {'badge' in item && pending > 0 && <span className={styles.badge}>{pending}</span>}
            </NavLink>
          ))}
        </nav>

        <button className={styles.logout} onClick={handleLogout}>
          <LogOut size={18} />
          Đăng xuất
        </button>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
