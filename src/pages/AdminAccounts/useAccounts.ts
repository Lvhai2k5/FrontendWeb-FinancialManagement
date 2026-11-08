import { useState } from 'react';
import accountApi from '@/api/accountApi';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import type { AccountQuery, AccountSummary } from '@/types';
import { getErrorMessage } from '@/utils/errorMessage';

export type AccountTab = 'all' | 'active' | 'inactive' | 'admin';

function tabToFilter(tab: AccountTab): Pick<AccountQuery, 'accountRole' | 'accountStatus'> {
  switch (tab) {
    case 'active':
      return { accountStatus: 'ACTIVE' };
    case 'inactive':
      return { accountStatus: 'INACTIVE' };
    case 'admin':
      return { accountRole: 'ADMIN' };
    default:
      return {};
  }
}

export function useAccounts() {
  const [tab, setTab] = useState<AccountTab>('all');
  const [keywordInput, setKeywordInput] = useState('');
  const [page, setPage] = useState(0);
  const keyword = useDebounce(keywordInput.trim());

  const list = useAsync(
    () =>
      accountApi
        .list({ page, size: DEFAULT_PAGE_SIZE, keyword: keyword || undefined, ...tabToFilter(tab) })
        .then((r) => r.data),
    [page, keyword, tab],
  );
  const stats = useAsync(() => accountApi.stats().then((r) => r.data), []);

  // Khóa / mở khóa: xác nhận bằng modal trước khi gọi API
  const [target, setTarget] = useState<AccountSummary | null>(null);
  const [acting, setActing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const requestToggle = (account: AccountSummary) => {
    setActionError(null);
    setTarget(account);
  };

  const cancelToggle = () => setTarget(null);

  const confirmToggle = async () => {
    if (!target) return;
    setActing(true);
    setActionError(null);
    try {
      if (target.accountStatus === 'ACTIVE') await accountApi.lock(target.accountId);
      else await accountApi.unlock(target.accountId);
      setTarget(null);
      list.reload();
      stats.reload();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setActing(false);
    }
  };

  const changeTab = (t: AccountTab) => {
    setTab(t);
    setPage(0);
  };
  const changeKeyword = (v: string) => {
    setKeywordInput(v);
    setPage(0);
  };

  return {
    tab, changeTab, keywordInput, changeKeyword, page, setPage,
    list, stats,
    target, acting, actionError, requestToggle, cancelToggle, confirmToggle,
  };
}
