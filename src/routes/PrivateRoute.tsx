import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import type { AccountRole } from '@/types';

interface Props {
  /** Role được phép vào. Frontend chặn chỉ để UX tốt — Backend mới là bảo mật thật. */
  allowedRoles: AccountRole[];
  redirectTo: string;
}

export default function PrivateRoute({ allowedRoles, redirectTo }: Props) {
  const { session } = useAuth();
  const location = useLocation();

  if (!session) return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  if (!allowedRoles.includes(session.role)) return <Navigate to={ROUTES.userNotice} replace />;
  return <Outlet />;
}
