import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '@/api/authApi';
import { ROUTES } from '@/constants';
import { getErrorMessage } from '@/utils/errorMessage';
import { isEmail, isPhone, isValidPassword, passwordStrength } from '@/utils/validators';

interface FormValues {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
}

type FormErrors = Partial<Record<keyof FormValues | 'agree', string>>;

const INITIAL: FormValues = { name: '', username: '', email: '', phone: '', password: '', confirm: '' };

export function useRegister() {
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>(INITIAL);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const strength = useMemo(() => passwordStrength(values.password), [values.password]);

  const setField = (key: keyof FormValues, value: string) => setValues((v) => ({ ...v, [key]: value }));

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!values.name.trim()) e.name = 'Vui lòng nhập họ và tên.';
    if (!values.username.trim()) e.username = 'Vui lòng nhập tên tài khoản.';
    if (!isEmail(values.email)) e.email = 'Email không hợp lệ.';
    if (!isPhone(values.phone)) e.phone = 'Số điện thoại không hợp lệ.';
    if (!isValidPassword(values.password)) e.password = 'Tối thiểu 8 ký tự, gồm chữ và số.';
    if (values.confirm !== values.password) e.confirm = 'Mật khẩu xác nhận không khớp.';
    if (!agree) e.agree = 'Bạn cần đồng ý điều khoản để tiếp tục.';
    return e;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    setServerError(null);
    try {
      await authApi.register({
        username: values.username.trim(),
        password: values.password,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.replace(/\s/g, ''),
      });
      navigate(ROUTES.login, { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err, 'Đăng ký thất bại.'));
    } finally {
      setSubmitting(false);
    }
  };

  return { values, setField, agree, setAgree, errors, strength, submitting, serverError, handleSubmit };
}
