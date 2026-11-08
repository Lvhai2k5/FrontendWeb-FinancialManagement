import { ArrowRight, CheckCircle2, MessageSquareText, RefreshCw, Search, Send, UserRound } from 'lucide-react';
import Badge, { type BadgeTone } from '@/components/common/Badge';
import Button from '@/components/common/Button';
import StateBlock from '@/components/common/StateBlock';
import PageHeader from '@/components/layout/PageHeader';
import { TICKET_STATUS_LABEL } from '@/constants';
import type { TicketStatus } from '@/types';
import { formatDateTime, formatRelative } from '@/utils/formatDate';
import { ticketCode, ticketTitle } from '@/utils/ticket';
import { useSupport, type TicketTab } from './useSupport';
import styles from './AdminSupport.module.css';

const STATUS_TONE: Record<TicketStatus, BadgeTone> = {
  DRAFT: 'neutral',
  SUBMITTED: 'warning',
  VIEWED: 'info',
  RESPONDED: 'success',
};

export default function AdminSupport() {
  const s = useSupport();
  const c = s.counts.data;
  const t = s.selected;

  const tabs: Array<{ key: TicketTab; label: string; count?: number }> = [
    { key: 'all', label: 'Tất cả', count: c?.all },
    { key: 'SUBMITTED', label: TICKET_STATUS_LABEL.SUBMITTED, count: c?.submitted },
    { key: 'VIEWED', label: TICKET_STATUS_LABEL.VIEWED, count: c?.viewed },
    { key: 'RESPONDED', label: TICKET_STATUS_LABEL.RESPONDED, count: c?.responded },
  ];

  return (
    <>
      <PageHeader
        title="Trung tâm Hỗ trợ"
        subtitle={
          <span className={styles.flow}>
            Quy trình: <Badge tone="warning">Submitted</Badge> <ArrowRight size={14} />{' '}
            <Badge tone="info">Viewed</Badge> <ArrowRight size={14} /> <Badge tone="success">Responded</Badge>
          </span>
        }
        actions={
          <Button variant="outline" icon={<RefreshCw size={16} />} onClick={() => { s.list.reload(); s.counts.reload(); }}>
            Làm mới
          </Button>
        }
      />

      <div className={styles.layout}>
        {/* Danh sách phiếu */}
        <section className={styles.listPane}>
          <label className={styles.search}>
            <Search size={16} />
            <input
              placeholder="Tìm nội dung phiếu, người gửi…"
              value={s.keywordInput}
              onChange={(e) => s.setKeywordInput(e.target.value)}
            />
          </label>
          <div className={styles.tabs} role="tablist">
            {tabs.map((x) => (
              <button
                key={x.key}
                role="tab"
                aria-selected={s.tab === x.key}
                className={`${styles.tab} ${s.tab === x.key ? styles.tabOn : ''}`}
                onClick={() => s.setTab(x.key)}
              >
                {x.label}
                {x.count !== undefined && <span className={styles.count}>{x.count}</span>}
              </button>
            ))}
          </div>

          <StateBlock
            loading={s.list.loading && !s.list.data}
            error={s.list.error}
            empty={!!s.list.data && s.tickets.length === 0}
            emptyText="Không có phiếu hỗ trợ."
            onRetry={s.list.reload}
          />
          <ul className={styles.items}>
            {s.tickets.map((tk) => (
              <li key={tk.supportTicketId}>
                <button
                  className={`${styles.item} ${t?.supportTicketId === tk.supportTicketId ? styles.itemOn : ''}`}
                  onClick={() => s.select(tk)}
                >
                  <div className={styles.itemTop}>
                    <span className={styles.code}>{ticketCode(tk.supportTicketId)}</span>
                    <Badge tone={STATUS_TONE[tk.ticketStatus]} dot>{TICKET_STATUS_LABEL[tk.ticketStatus]}</Badge>
                    <span className={styles.ago}>{formatRelative(tk.createdAt)}</span>
                  </div>
                  <div className={styles.itemTitle}>{ticketTitle(tk.content)}</div>
                  <div className={styles.itemWho}>
                    <UserRound size={13} /> {tk.createdPersonName} <span>#UID-{tk.createdPersonId}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Chi tiết + phản hồi */}
        <section className={styles.detailPane}>
          {!t ? (
            <div className={styles.placeholder}>
              <MessageSquareText size={34} />
              <p>Chọn một phiếu ở danh sách bên trái để xem và phản hồi.</p>
            </div>
          ) : (
            <>
              <div className={styles.detailHead}>
                <span className={styles.code}>{ticketCode(t.supportTicketId)}</span>
                <Badge tone={STATUS_TONE[t.ticketStatus]} dot>{TICKET_STATUS_LABEL[t.ticketStatus]}</Badge>
              </div>
              <h2 className={styles.detailTitle}>{ticketTitle(t.content, 140)}</h2>

              <dl className={styles.meta}>
                <div><dt>Người gửi</dt><dd>{t.createdPersonName} <span>#UID-{t.createdPersonId}</span></dd></div>
                <div><dt>Email liên lạc</dt><dd>{t.createdPersonEmail}</dd></div>
                <div><dt>Thời gian gửi</dt><dd>{formatDateTime(t.createdAt)}</dd></div>
              </dl>

              <div className={styles.bubble}>
                <div className={styles.bubbleHead}>{t.createdPersonName}</div>
                <p className={styles.content}>{t.content}</p>
              </div>

              {t.ticketStatus === 'RESPONDED' ? (
                <div className={styles.answered}>
                  <div className={styles.answeredHead}>
                    <CheckCircle2 size={18} /> Đã phản hồi
                    {t.answeredPersonId !== null && <span> · bởi #UID-{t.answeredPersonId}</span>}
                  </div>
                  <p className={styles.content}>{t.noteOfRespondent}</p>
                </div>
              ) : (
                <div className={styles.reply}>
                  <h3 className={styles.replyTitle}>
                    Nội dung phản hồi <span>(noteOfRespondent)</span>
                  </h3>
                  <textarea
                    className={styles.textarea}
                    rows={6}
                    placeholder="Nhập biên bản giải quyết khiếu nại / phản hồi cho người dùng…"
                    value={s.note}
                    onChange={(e) => s.setNote(e.target.value)}
                    disabled={t.ticketStatus === 'DRAFT'}
                  />
                  {s.error && <p className={styles.error} role="alert">{s.error}</p>}
                  <div className={styles.replyActions}>
                    <p className={styles.hint}>
                      Gửi phản hồi sẽ chuyển phiếu sang <b>Responded</b> và ghi nhật ký hoạt động.
                    </p>
                    <Button icon={<Send size={16} />} loading={s.submitting} onClick={s.respond}
                      disabled={t.ticketStatus === 'DRAFT'}>
                      Gửi phản hồi &amp; Đóng phiếu
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}
