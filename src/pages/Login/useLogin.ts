import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/errorMessage';

export function useLogin() {
  const { login, clearSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const session = await login({ username: username.trim(), password });
      if (session.role === 'ADMIN') {
        navigate(from?.startsWith('/admin') ? from : ROUTES.adminDashboard, { replace: true });
      } else {
        // Người dùng thường dùng ứng dụng di động; web hiện chỉ có khu vực quản trị.
        clearSession();
        navigate(ROUTES.userNotice, { replace: true });
      }
    } catch (err) {
      const msg =
        err instanceof Error && err.message === 'INVALID_TOKEN'
          ? 'Phản hồi đăng nhập không hợp lệ.'
          : getErrorMessage(err, 'Đăng nhập thất bại.');
      setError(msg.includes('401') ? 'Sai tên đăng nhập hoặc mật khẩu.' : msg);
    } finally {
      setSubmitting(false);
    }
  };

  return { username, setUsername, password, setPassword, submitting, error, handleSubmit };
}
