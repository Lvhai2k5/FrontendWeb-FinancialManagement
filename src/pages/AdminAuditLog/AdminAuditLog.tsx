import { CheckCircle2, Database, Download, RefreshCw, Search, TriangleAlert } from 'lucide-react';
import Badge, { type BadgeTone } from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Pagination from '@/components/common/Pagination';
import StateBlock from '@/components/common/StateBlock';
import StatCard from '@/components/common/StatCard';
import PageHeader from '@/components/layout/PageHeader';
import { ACTION_TYPES, ACTIVITY_STATUS_LABEL } from '@/constants';
import type { ActionType, ActivityStatus } from '@/types';
import { formatDateTime } from '@/utils/formatDate';
import { formatNumber } from '@/utils/formatNumber';
import { useAuditLog } from './useAuditLog';
import table from '@/components/common/Table.module.css';
import styles from './AdminAuditLog.module.css';

const ACTION_TONE: Record<ActionType, BadgeTone> = {
  LOGIN: 'info',
  LOGOUT: 'neutral',
  REGISTER: 'success',
  CREATE: 'success',
  MODIFY: 'primary',
  DELETE: 'danger',
};

export default function AdminAuditLog() {
  const a = useAuditLog();
  const page = a.list.data;
  const stats = a.stats.data;
  const pct = (n: number) => (stats && stats.total > 0 ? `${((n / stats.total) * 100).toFixed(2)}%` : '');

  return (
    <>
      <PageHeader
        title="Nhật ký hoạt động"
        actions={
          <>
            <Button variant="outline" icon={<RefreshCw size={16} />} onClick={a.list.reload}>
              Làm mới
            </Button>
            <Button icon={<Download size={16} />} onClick={a.exportCsv} disabled={!page?.content.length}>
              Xuất CSV (trang này)
            </Button>
          </>
        }
      />

      <div className={table.statGrid}>
        <StatCard label="Tổng bản ghi kiểm toán" value={formatNumber(stats?.total ?? 0)} icon={<Database size={18} />} />
        <StatCard
          label="Thao tác thành công"
          value={formatNumber(stats?.success ?? 0)}
          tone="success"
          icon={<CheckCircle2 size={18} />}
          footer={pct(stats?.success ?? 0)}
        />
        <StatCard
          label="Thao tác thất bại"
          value={formatNumber(stats?.failed ?? 0)}
          tone="danger"
          icon={<TriangleAlert size={18} />}
          footer={pct(stats?.failed ?? 0)}
        />
      </div>

      <div className={table.toolbar}>
        <label className={table.search}>
          <Search size={18} />
          <input
            placeholder="Tìm theo Log ID, người thực hiện, mô tả…"
            value={a.keywordInput}
            onChange={(e) => a.setKeywordInput(e.target.value)}
          />
        </label>
        <select
          className={table.select}
          value={a.actionType}
          onChange={(e) => a.setActionType(e.target.value as ActionType | '')}
          aria-label="Lọc theo hành động"
        >
          <option value="">Tất cả hành động</option>
          {ACTION_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          className={table.select}
          value={a.activityStatus}
          onChange={(e) => a.setActivityStatus(e.target.value as ActivityStatus | '')}
          aria-label="Lọc theo trạng thái"
        >
          <option value="">Tất cả trạng thái</option>
          {(Object.keys(ACTIVITY_STATUS_LABEL) as ActivityStatus[]).map((s) => (
            <option key={s} value={s}>{ACTIVITY_STATUS_LABEL[s]}</option>
          ))}
        </select>
        <input type="date" className={table.select} value={a.from} max={a.to || undefined}
          onChange={(e) => a.setFrom(e.target.value)} aria-label="Từ ngày" />
        <input type="date" className={table.select} value={a.to} min={a.from || undefined}
          onChange={(e) => a.setTo(e.target.value)} aria-label="Đến ngày" />
      </div>

      <div className={table.card}>
        <StateBlock
          loading={a.list.loading && !page}
          error={a.list.error}
          empty={!!page && page.content.length === 0}
          emptyText="Không có bản ghi phù hợp bộ lọc."
          onRetry={a.list.reload}
        />
        {page && page.content.length > 0 && (
          <>
            <div className={table.scroll}>
              <table className={table.table}>
                <thead>
                  <tr>
                    <th>Mã log</th>
                    <th>Thời gian</th>
                    <th>Người thực hiện</th>
                    <th>Hành động</th>
                    <th>Trạng thái</th>
                    <th>Địa chỉ IP</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {page.content.map((log) => (
                    <tr key={log.logId} className={log.activityStatus === 'FAILED' ? table.rowDanger : undefined}>
                      <td className={styles.logId}>#LOG-{log.logId}</td>
                      <td className={table.mono}>{formatDateTime(log.logTime)}</td>
                      <td>
                        <div className={styles.who}>{log.performedPersonName ?? 'Không xác định'}</div>
                        <div className={styles.sub}>
                          {log.performedPersonId !== null ? `#UID-${log.performedPersonId}` : 'unauthenticated'}
                          {log.performedPersonEmail ? ` · ${log.performedPersonEmail}` : ''}
                        </div>
                      </td>
                      <td><Badge tone={ACTION_TONE[log.actionType]}>{log.actionType}</Badge></td>
                      <td>
                        <Badge tone={log.activityStatus === 'SUCCESS' ? 'success' : 'danger'}>
                          {ACTIVITY_STATUS_LABEL[log.activityStatus]}
                        </Badge>
                      </td>
                      <td className={table.mono}>{log.ipAddress}</td>
                      <td className={styles.desc}>{log.activityDescription}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={table.footer}>
              <span>
                Hiển thị {page.content.length} / {formatNumber(page.totalElements)} bản ghi
              </span>
              <Pagination page={page.number} totalPages={page.totalPages} onChange={a.setPage} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
