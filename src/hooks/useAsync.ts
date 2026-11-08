import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '@/utils/errorMessage';

export interface AsyncState<T> {
  /** Dữ liệu lần tải thành công gần nhất (giữ lại khi đang tải lại). */
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

interface Settled<T> {
  key: string;
  data: T | null;
  error: string | null;
}

/**
 * Chạy hàm async mỗi khi `deps` đổi (hoặc gọi `reload`); bỏ qua kết quả của lần gọi cũ
 * (tránh race condition). `deps` phải là giá trị serialize được (string/number/boolean).
 */
export function useAsync<T>(fetcher: () => Promise<T>, deps: readonly unknown[]): AsyncState<T> {
  const [tick, setTick] = useState(0);
  const [settled, setSettled] = useState<Settled<T>>({ key: '', data: null, error: null });
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const key = `${tick}|${JSON.stringify(deps)}`;

  useEffect(() => {
    let cancelled = false;
    fetcherRef
      .current()
      .then((res) => {
        if (!cancelled) setSettled({ key, data: res, error: null });
      })
      .catch((e: unknown) => {
        if (!cancelled) setSettled((prev) => ({ key, data: prev.data, error: getErrorMessage(e) }));
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  const loading = settled.key !== key;
  return { data: settled.data, loading, error: loading ? null : settled.error, reload };
}
