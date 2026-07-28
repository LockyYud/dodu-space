import type { BandHistory } from "@/lib/ielts/schema";

/**
 * Minimal dependency-free SVG line chart of overall band over time.
 * Theme-aware via currentColor + CSS variables. Server-renderable (no hooks).
 */
export function BandChart({ history }: { history: BandHistory[] }) {
  // Oldest → newest, only rows with an overall band.
  const points = history
    .filter((h) => typeof h.overall === "number")
    .slice()
    .reverse()
    .map((h) => ({ date: h.date, value: h.overall as number }));

  if (points.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Chưa có dữ liệu band. Thêm một mock test để bắt đầu vẽ biểu đồ.
      </p>
    );
  }

  const W = 640;
  const H = 200;
  const pad = { top: 16, right: 16, bottom: 28, left: 28 };
  const yMin = 4;
  const yMax = 9;
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const x = (i: number) =>
    pad.left +
    (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
  const y = (v: number) =>
    pad.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH;

  const path = points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`,
    )
    .join(" ");

  const yTicks = [4, 5, 6, 7, 8, 9];

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full min-w-[420px] text-primary"
        role="img"
        aria-label="Biểu đồ band overall theo thời gian"
      >
        {/* grid + y labels */}
        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={pad.left}
              x2={W - pad.right}
              y1={y(t)}
              y2={y(t)}
              className="stroke-border"
              strokeWidth={1}
              strokeDasharray={t === 7 ? "0" : "3 3"}
              opacity={t === 7 ? 0.6 : 0.35}
            />
            <text
              x={pad.left - 6}
              y={y(t) + 3}
              textAnchor="end"
              className="fill-muted-foreground"
              fontSize={10}
            >
              {t}
            </text>
          </g>
        ))}
        {/* target band 7 marker label */}
        <text
          x={W - pad.right}
          y={y(7) - 4}
          textAnchor="end"
          className="fill-muted-foreground"
          fontSize={9}
        >
          mục tiêu 7.0
        </text>
        {/* line */}
        <path d={path} fill="none" stroke="currentColor" strokeWidth={2} />
        {/* dots + x labels */}
        {points.map((p, i) => (
          <g key={p.date}>
            <circle cx={x(i)} cy={y(p.value)} r={3} fill="currentColor" />
            <text
              x={x(i)}
              y={H - 8}
              textAnchor="middle"
              className="fill-muted-foreground"
              fontSize={9}
            >
              {p.date.slice(5)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
