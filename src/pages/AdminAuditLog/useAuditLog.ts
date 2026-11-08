import { useState } from 'react';
import activityLogApi from '@/api/activityLogApi';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import type { ActionType, ActivityStatus } from '@/types';
import { downloadCsv } from '@/utils/csv';
import { formatDateTime } from '@/utils/formatDate';

export function useAuditLog() {
  const [keywordInput, setKeywordInput] = useState('');
  const [actionType, setActionType] = useState<ActionType | ''>('');
  const [activityStatus, setActivityStatus] = useState<ActivityStatus | ''>('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(0);
  const keyword = useDebounce(keywordInput.trim());

  const list = useAsync(
    () =>
      activityLogApi
        .list({
          page,
          size: DEFAULT_PAGE_SIZE,
          sort: 'logTime,desc',
          keyword: keyword || undefined,
          actionType: actionType || undefined,
          activityStatus: activityStatus || undefined,
          from: from || undefined,
          to: to || undefined,
        })
        .then((r) => r.data),
    [page, keyword, actionType, activityStatus, from, to],
  );
  const stats = useAsync(() => activityLogApi.stats().then((r) => r.data), []);

  /** Đổi bộ lọc thì quay về trang đầu. */
  const withReset = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(0);
  };

  const exportCsv = () => {
    const rows = list.data?.content ?? [];
    downloadCsv(
      `activity-log-trang-${page + 1}.csv`,
      ['logId', 'logTime', 'performedPersonId', 'performedPerson', 'actionType', 'activityStatus', 'ipAddress', 'activityDescription'],
      rows.map((l) => [
        l.logId,
        formatDateTime(l.logTime),
        l.performedPersonId,
        l.performedPersonName,
        l.actionType,
        l.activityStatus,
        l.ipAddress,
        l.activityDescription,
      ]),
    );
  };

  return {
    keywordInput, setKeywordInput: withReset(setKeywordInput),
    actionType, setActionType: withReset(setActionType),
    activityStatus, setActivityStatus: withReset(setActivityStatus),
    from, setFrom: withReset(setFrom),
    to, setTo: withReset(setTo),
    page, setPage, list, stats, exportCsv,
  };
}
