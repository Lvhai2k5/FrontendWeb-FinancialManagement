import { Lock, LockOpen, RefreshCw, Search, ShieldCheck, UserCheck, Users } from 'lucide-react';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Pagination from '@/components/common/Pagination';
import StateBlock from '@/components/common/StateBlock';
import StatCard from '@/components/common/StatCard';
import PageHeader from '@/components/layout/PageHeader';
import { formatNumber } from '@/utils/formatNumber';
import { useAccounts, type AccountTab } from './useAccounts';
import table from '@/components/common/Table.module.css';
import styles from './AdminAccounts.module.css';

export default function AdminAccounts() {
  const a = useAccounts();
  const stats = a.stats.data;
  const page = a.list.data;

  const tabs: Array<{ key: AccountTab; label: string; count?: number }> = [
    { key: 'all', label: 'Tất cả', count: stats?.total },
    { key: 'active', label: 'Đang hoạt động', count: stats?.active },
    { key: 'inactive', label: 'Đang bị khóa', count: stats?.inactive },
    { key: 'admin', label: 'Quản trị viên', count: stats?.admins },
  ];

  const locking = a.target?.accountStatus === 'ACTIVE';

  return (
    <>
      <PageHeader
        title="Quản lý Tài khoản"
        subtitle={stats ? `${formatNumber(stats.total)} tài khoản` : undefined}
      />

      <div className={table.statGrid}>
        <StatCard label="Tổng người dùng" value={formatNumber(stats?.total ?? 0)} icon={<Users size={18} />} />
        <StatCard label="Đang hoạt động" value={formatNumber(stats?.active ?? 0)} tone="success" icon={<UserCheck size={18} />} />
        <StatCard label="Tài khoản bị khóa" value={formatNumber(stats?.inactive ?? 0)} tone="danger" icon={<Lock size={18} />} />
        <StatCard label="Quản trị viên" value={formatNumber(stats?.admins ?? 0)} tone="info" icon={<ShieldCheck size={18} />} />
      </div>

      <div className={styles.tabs} role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={a.tab === t.key}
            className={`${styles.tab} ${a.tab === t.key ? styles.tabOn : ''}`}
            onClick={() => a.changeTab(t.key)}
          >
            {t.label}
            {t.count !== undefined && <span className={styles.count}>{formatNumber(t.count)}</span>}
          </button>
        ))}
      </div>

      <div className={table.toolbar}>
        <label className={table.search}>
          <Search size={18} />
          <input
            placeholder="Tìm theo username, họ tên, email hoặc số điện thoại…"
            value={a.keywordInput}
            onChange={(e) => a.changeKeyword(e.target.value)}
          />
        </label>
        <Button variant="outline" icon={<RefreshCw size={16} />} onClick={a.list.reload} aria-label="Làm mới">
          Làm mới
        </Button>
      </div>

      <div className={table.card}>
        <StateBlock
          loading={a.list.loading && !page}
          error={a.list.error}
          empty={!!page && page.content.length === 0}
          emptyText="Không có tài khoản phù hợp."
          onRetry={a.list.reload}
        />
        {page && page.content.length > 0 && (
          <>
            <div className={table.scroll}>
              <table className={table.table}>
                <thead>
                  <tr>
                    <th>Account / Person ID</th>
                    <th>Người dùng</th>
                    <th>Liên hệ</th>
                    <th>Vai trò</th>
                    <th>Tổ ấm (Family)</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {page.content.map((acc) => (
                    <tr key={acc.accountId}>
                      <td>
                        <div className={styles.id}>#ACC-{acc.accountId}</div>
                        <div className={styles.sub}>#PER-{acc.personId}</div>
                      </td>
                      <td>
                        <div className={styles.person}>
                          {acc.avatar ? (
                            <img src={acc.avatar} alt="" className={styles.avatar} />
                          ) : (
                            <span className={styles.avatar}>{acc.name.slice(0, 1).toUpperCase()}</span>
                          )}
                          <div>
                            <div className={styles.name}>{acc.name}</div>
                            <div className={styles.sub}>@{acc.username}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>{acc.email}</div>
                        <div className={styles.sub}>{acc.phone}</div>
                      </td>
                      <td>
                        <div className={styles.roles}>
                          <Badge tone={acc.accountRole === 'ADMIN' ? 'primary' : 'neutral'}>{acc.accountRole}</Badge>
                          {[...new Set(acc.families.map((f) => f.familyMemberRole))].map((r) => (
                            <Badge key={r} tone="info">{r}</Badge>
                          ))}
                        </div>
                      </td>
                      <td>
                        {acc.families.length === 0 ? (
                          <span className={styles.sub}>Chưa ghép hộ</span>
                        ) : (
                          acc.families.map((f) => (
                            <div key={f.familyId}>
                              {f.name}
                              <span className={styles.sub}> #FAM-{f.familyId} · {f.memberCount} TV</span>
                            </div>
                          ))
                        )}
                      </td>
                      <td>
                        <Badge dot tone={acc.accountStatus === 'ACTIVE' ? 'success' : 'danger'}>
                          {acc.accountStatus}
                        </Badge>
                      </td>
                      <td>
                        {acc.accountRole === 'ADMIN' ? (
                          <span className={styles.sub}>Bảo vệ</span>
                        ) : acc.accountStatus === 'ACTIVE' ? (
                          <Button size="sm" variant="danger" icon={<Lock size={14} />} onClick={() => a.requestToggle(acc)}>
                            Khóa
                          </Button>
                        ) : (
                          <Button size="sm" variant="success" icon={<LockOpen size={14} />} onClick={() => a.requestToggle(acc)}>
                            Mở khóa
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={table.footer}>
              <span>
                Hiển thị {page.number * page.size + 1} – {page.number * page.size + page.content.length} /{' '}
                {formatNumber(page.totalElements)}
              </span>
              <Pagination page={page.number} totalPages={page.totalPages} onChange={a.setPage} />
            </div>
          </>
        )}
      </div>

      <Modal
        open={!!a.target}
        title={locking ? 'Khóa tài khoản?' : 'Mở khóa tài khoản?'}
        onClose={a.cancelToggle}
        footer={
          <>
            <Button variant="outline" onClick={a.cancelToggle} disabled={a.acting}>
              Hủy
            </Button>
            <Button variant={locking ? 'danger' : 'primary'} loading={a.acting} onClick={a.confirmToggle}>
              {locking ? 'Khóa tài khoản' : 'Mở khóa'}
            </Button>
          </>
        }
      >
        <p>
          {locking
            ? 'Tài khoản sẽ chuyển sang Inactive và không thể đăng nhập.'
            : 'Tài khoản sẽ chuyển sang Active và đăng nhập lại được.'}{' '}
          Thao tác được ghi vào nhật ký hoạt động.
        </p>
        {a.target && (
          <p className={styles.modalTarget}>
            <b>{a.target.name}</b> (@{a.target.username})
          </p>
        )}
        {a.actionError && <p className={styles.modalError}>{a.actionError}</p>}
      </Modal>
    </>
  );
}
