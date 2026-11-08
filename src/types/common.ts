/** Shape của Spring Data Page<T> (xem TECH-API.md mục 4). */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // 0-based
  size: number;
}

/** Response lỗi thống nhất do GlobalExceptionHandler sinh ra (TECH-API.md mục 3). */
export interface ApiErrorBody {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface PageParams {
  page: number;
  size: number;
  sort?: string;
}
