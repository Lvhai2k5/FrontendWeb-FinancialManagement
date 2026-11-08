import { Link } from 'react-router-dom';
import { ArrowRight, AtSign, Lock, LockKeyhole, Mail, Phone, UserRound } from 'lucide-react';
import Button from '@/components/common/Button';
import TextField from '@/components/common/TextField';
import AuthLayout from '@/components/layout/AuthLayout';
import { ROUTES } from '@/constants';
import { useRegister } from './useRegister';
import styles from './Register.module.css';

export default function Register() {
  const f = useRegister();
  const { values, errors, strength } = f;

  return (
    <AuthLayout badge="Cổng đăng ký bảo mật" wide>
      <div>
        <h1 className={styles.title}>Tạo tài khoản mới</h1>
        <p className={styles.sub}>Bắt đầu hành trình quản lý tài chính an tâm và minh bạch cho tổ ấm.</p>
      </div>

      <form className={styles.form} onSubmit={f.handleSubmit} noValidate>
        <div className={styles.grid}>
          <TextField label="Họ và tên" required icon={<UserRound size={18} />} placeholder="Nguyễn Văn An"
            value={values.name} error={errors.name} onChange={(e) => f.setField('name', e.target.value)} />
          <TextField label="Tên tài khoản" required icon={<AtSign size={18} />} placeholder="annguyen2024"
            autoComplete="username" value={values.username} error={errors.username}
            onChange={(e) => f.setField('username', e.target.value)} />
          <TextField label="Email đăng ký" required type="email" icon={<Mail size={18} />}
            placeholder="an.nguyen@example.com" value={values.email} error={errors.email}
            onChange={(e) => f.setField('email', e.target.value)} />
          <TextField label="Số điện thoại" required type="tel" icon={<Phone size={18} />} placeholder="0912 345 678"
            value={values.phone} error={errors.phone} onChange={(e) => f.setField('phone', e.target.value)} />
          <TextField label="Mật khẩu" required type="password" revealable icon={<Lock size={18} />}
            placeholder="Tối thiểu 8 ký tự" autoComplete="new-password" value={values.password}
            error={errors.password} onChange={(e) => f.setField('password', e.target.value)} />
          <TextField label="Xác nhận mật khẩu" required type="password" revealable icon={<LockKeyhole size={18} />}
            placeholder="Nhập lại mật khẩu" autoComplete="new-password" value={values.confirm}
            error={errors.confirm} onChange={(e) => f.setField('confirm', e.target.value)} />
        </div>

        <div className={styles.strength}>
          <div className={styles.strengthHead}>
            <span>Độ mạnh mật khẩu:</span>
            <span>{values.password ? strength.label : 'Chưa nhập'}</span>
          </div>
          <div className={styles.bars}>
            {[1, 2, 3, 4].map((n) => (
              <span key={n} className={`${styles.bar} ${values.password && strength.score >= n ? styles.barOn : ''}`} />
            ))}
          </div>
          <p className={styles.hint}>Gợi ý: 8+ ký tự · chữ hoa &amp; số · ký tự đặc biệt</p>
        </div>

        <label className={styles.agree}>
          <input type="checkbox" checked={f.agree} onChange={(e) => f.setAgree(e.target.checked)} />
          <span>Tôi đồng ý với Điều khoản dịch vụ &amp; Chính sách bảo mật của FinNest.</span>
        </label>
        {errors.agree && <p className={styles.error}>{errors.agree}</p>}
        {f.serverError && (
          <p className={styles.serverError} role="alert">
            {f.serverError}
          </p>
        )}

        <Button type="submit" variant="dark" size="lg" block loading={f.submitting}>
          Tạo tài khoản ngay <ArrowRight size={18} />
        </Button>
      </form>

      <p className={styles.switch}>
        Đã có tài khoản? <Link to={ROUTES.login}>Đăng nhập ngay</Link>
      </p>
    </AuthLayout>
  );
}
