import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Headset, ShieldAlert, Users } from 'lucide-react';
import Badge from '@/components/common/Badge';
import LineChart from '@/components/common/LineChart';
import StateBlock from '@/components/common/StateBlock';
import StatCard from '@/components/common/StatCard';
import PageHeader from '@/components/layout/PageHeader';
import { ROUTES } from '@/constants';
import { formatNumber } from '@/utils/formatNumber';
import { formatRelative } from '@/utils/formatDate';
import { RANGE_OPTIONS, useDashboard } from './useDashboard';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const d = useDashboard();
  const s = d.data;

  return (
    <>
      <PageHeader
        title="Tổng quan hệ thống"
        actions={
          <div className={styles.range} role="tablist" aria-label="Khoảng thời gian">
            {RANGE_OPTIONS.map((o) => (
              <button
                key={o.days}
                role="tab"
                aria-selected={d.days === o.days}
                className={`${styles.rangeBtn} ${d.days === o.days ? styles.rangeOn : ''}`}
                onClick={() => d.setDays(o.days)}
              >
                {o.label}
              </button>
            ))}
          </div>
        }
      />

      <StateBlock loading={d.loading && !s} error={d.error} onRetry={d.reload} />

      {s && (
        <>
          <div className={styles.stats}>
            <StatCard
              label="Tổng số tài khoản"
              value={formatNumber(s.accounts.total)}
              icon={<Users size={18} />}
              footer={
                <>
                  <span>Active: <b>{formatNumber(s.accounts.active)}</b></span>
                  <span>Khóa: <b className={styles.danger}>{formatNumber(s.accounts.inactive)}</b></span>
                </>
              }
            />
            <StatCard
              label="Tickets chờ xử lý"
              value={formatNumber(s.tickets.submitted + s.tickets.viewed)}
              unit="phiếu"
              tone="info"
              icon={<Headset size={18} />}
              footer={
                <>
                  <span>Chờ: <b>{s.tickets.submitted}</b></span>
                  <span>Đang xem: <b>{s.tickets.viewed}</b></span>
                </>
              }
            />
            <StatCard
              label="Danh mục chạm ngưỡng"
              value={formatNumber(s.warningCategories)}
              unit="danh mục"
              tone="warning"
              icon={<AlertTriangle size={18} />}
              footer="Chạm ngưỡng cảnh báo / khẩn cấp"
            />
            <StatCard
              label="Đăng nhập thất bại (24h)"
              value={formatNumber(s.failedLogins24h)}
              unit="lượt"
              tone="danger"
              icon={<ShieldAlert size={18} />}
              footer="Theo ActivityLog Login/Failed"
            />
          </div>

          <div className={styles.grid}>
            <section className={styles.panel}>
              <h2 className={styles.panelTitle}>Đăng ký &amp; Bảo mật</h2>
              {d.labels.length === 0 ? (
                <StateBlock empty emptyText="Chưa có dữ liệu trong khoảng này." />
              ) : (
                <LineChart
                  labels={d.labels}
                  series={[
                    { name: 'Tài khoản mới', color: '#2563eb', values: d.newAccounts },
                    { name: 'Đăng nhập thất bại', color: '#dc2626', values: d.failedLogins },
                  ]}
                />
              )}
              <div className={styles.quick}>
                <Link to={ROUTES.adminAccounts} className={styles.quickItem}>
                  Quản lý tài khoản <ArrowRight size={16} />
                </Link>
                <Link to={ROUTES.adminSupport} className={styles.quickItem}>
                  Xử lý phiếu hỗ trợ <ArrowRight size={16} />
                </Link>
                <Link to={ROUTES.adminAudit} className={styles.quickItem}>
                  Tra cứu nhật ký <ArrowRight size={16} />
                </Link>
              </div>
            </section>

            <section className={styles.panel}>
              <h2 className={styles.panelTitle}>Nhật ký hoạt động gần đây</h2>
              {s.recentLogs.length === 0 ? (
                <StateBlock empty emptyText="Chưa có hoạt động." />
              ) : (
                <ul className={styles.timeline}>
                  {s.recentLogs.map((log) => (
                    <li key={log.logId} className={`${styles.log} ${log.activityStatus === 'FAILED' ? styles.logFail : ''}`}>
                      <div className={styles.logTop}>
                        <span className={styles.logId}>#LOG-{log.logId}</span>
                        <span className={styles.logTime}>{formatRelative(log.logTime)}</span>
                      </div>
                      <div className={styles.logDesc}>{log.activityDescription}</div>
                      <div className={styles.logMeta}>
                        <Badge tone={log.activityStatus === 'FAILED' ? 'danger' : 'primary'}>{log.actionType}</Badge>
                        <span>{log.performedPersonName ?? 'Không xác định'} · {log.ipAddress}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <Link to={ROUTES.adminAudit} className={styles.more}>
                Mở nhật ký đầy đủ <ArrowRight size={16} />
              </Link>
            </section>
          </div>
        </>
      )}
    </>
  );
}
