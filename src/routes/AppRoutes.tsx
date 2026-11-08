import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { ROUTES } from '@/constants';
import AdminAccounts from '@/pages/AdminAccounts/AdminAccounts';
import AdminAuditLog from '@/pages/AdminAuditLog/AdminAuditLog';
import AdminDashboard from '@/pages/AdminDashboard/AdminDashboard';
import AdminSupport from '@/pages/AdminSupport/AdminSupport';
import Landing from '@/pages/Landing/Landing';
import Login from '@/pages/Login/Login';
import NotFound from '@/pages/NotFound/NotFound';
import Register from '@/pages/Register/Register';
import UserNotice from '@/pages/UserNotice/UserNotice';
import PrivateRoute from './PrivateRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<Landing />} />
      <Route path={ROUTES.login} element={<Login />} />
      <Route path={ROUTES.register} element={<Register />} />
      <Route path={ROUTES.userNotice} element={<UserNotice />} />

      <Route element={<PrivateRoute allowedRoles={['ADMIN']} redirectTo={ROUTES.login} />}>
        <Route element={<AdminLayout />}>
          <Route path={ROUTES.adminDashboard} element={<AdminDashboard />} />
          <Route path={ROUTES.adminAccounts} element={<AdminAccounts />} />
          <Route path={ROUTES.adminSupport} element={<AdminSupport />} />
          <Route path={ROUTES.adminAudit} element={<AdminAuditLog />} />
        </Route>
      </Route>

      <Route path="/admin/*" element={<Navigate to={ROUTES.adminDashboard} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
