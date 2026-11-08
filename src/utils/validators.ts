const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(0|\+84)\d{9}$/;

export const isEmail = (v: string): boolean => EMAIL_RE.test(v.trim());
export const isPhone = (v: string): boolean => PHONE_RE.test(v.replace(/\s/g, ''));

export interface PasswordStrength {
  /** 0–4 */
  score: number;
  label: string;
}

/** Độ mạnh mật khẩu cho thanh 4 đoạn ở form đăng ký. */
export function passwordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score += 1;
  const labels = ['Quá yếu', 'Yếu', 'Trung bình', 'Khá mạnh', 'Rất mạnh'];
  return { score, label: labels[score] ?? labels[0] };
}

/** Mật khẩu hợp lệ theo gợi ý form: tối thiểu 8 ký tự, gồm chữ và số. */
export function isValidPassword(password: string): boolean {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}
