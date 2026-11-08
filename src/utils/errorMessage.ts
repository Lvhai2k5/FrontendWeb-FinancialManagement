import axios from 'axios';
import type { ApiErrorBody } from '@/types';

/** Chuyển lỗi axios/bất kỳ thành thông điệp tiếng Việt thân thiện cho người dùng. */
export function getErrorMessage(error: unknown, fallback = 'Đã có lỗi xảy ra, vui lòng thử lại.'): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) return 'Không kết nối được máy chủ. Vui lòng kiểm tra mạng hoặc thử lại sau.';
    const { status, data } = error.response;
    if (status === 403) return 'Bạn không có quyền thực hiện thao tác này.';
    if (status === 404) return 'Không tìm thấy dữ liệu yêu cầu.';
    if (status === 409) return data?.message ?? 'Dữ liệu đã thay đổi, vui lòng tải lại.';
    if (status >= 500) return 'Máy chủ đang gặp sự cố, vui lòng thử lại sau.';
    return data?.message ?? fallback;
  }
  return fallback;
}
