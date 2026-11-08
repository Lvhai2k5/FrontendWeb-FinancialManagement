import styles from './LineChart.module.css';

export interface ChartSeries {
  name: string;
  color: string;
  values: number[];
}

interface Props {
  labels: string[];
  series: ChartSeries[];
}

const W = 640;
const H = 220;
const PAD = { top: 12, right: 12, bottom: 24, left: 36 };

/** Biểu đồ đường SVG thuần, không phụ thuộc thư viện ngoài. */
export default function LineChart({ labels, series }: Props) {
  const n = labels.length;
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;
  const ticks = [0, 0.5, 1].map((t) => Math.round(max * t));

  return (
    <div className={styles.wrap}>
      <div className={styles.legend}>
        {series.map((s) => (
          <span key={s.name} className={styles.legendItem}>
            <span className={styles.swatch} style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="img" aria-label="Biểu đồ lưu lượng theo ngày">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className={styles.grid} />
            <text x={PAD.left - 6} y={y(t) + 4} textAnchor="end" className={styles.tick}>
              {t}
            </text>
          </g>
        ))}
        {labels.map((l, i) =>
          n <= 8 || i % Math.ceil(n / 8) === 0 ? (
            <text key={l + i} x={x(i)} y={H - 6} textAnchor="middle" className={styles.tick}>
              {l}
            </text>
          ) : null,
        )}
        {series.map((s) => (
          <g key={s.name}>
            <polyline
              fill="none"
              stroke={s.color}
              strokeWidth={2.5}
              strokeLinejoin="round"
              points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
            />
            {s.values.map((v, i) => (
              <circle key={i} cx={x(i)} cy={y(v)} r={3} fill={s.color} />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
