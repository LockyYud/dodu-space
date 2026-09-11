"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Cluster, ClusterId } from "@/lib/ielts/daily-prompts";
import { cn } from "@/lib/utils";

/**
 * Vòng quay 12 cụm chủ đề. Xem docs/ielts/DAILY-WRITING.md §3.3.
 *
 * Quay **cụm**, không quay 96 câu: 96 lát cắt thì không đọc được chữ nào. Kết
 * quả do server bốc và truyền xuống qua `target`; ở đây chỉ còn việc quay tới
 * đúng lát đó. Ngẫu nhiên nằm ở server, không phải ở animation.
 */

const SIZE = 288;
const R = SIZE / 2;
const SPINS = 4;
/** Tô mỗi cụm một màu trong 5 tông có sẵn của theme, lặp vòng. */
const CHART_TOKENS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function SpinWheel({
  clusters,
  activeIds,
  target,
  onRest,
  className,
}: {
  clusters: Cluster[];
  /** Cụm của chu kỳ hiện tại. Cụm ngoài chu kỳ mờ đi và không bao giờ dừng
   *  vào — để nhìn thấy được rằng vòng quay có luật, chứ không random mù. */
  activeIds: ClusterId[];
  target: ClusterId | null;
  onRest?: () => void;
  className?: string;
}) {
  const slice = 360 / clusters.length;
  const reduced = useReducedMotion();
  const rotation = useRef(0);
  const [angle, setAngle] = useState(0);
  const [landed, setLanded] = useState<ClusterId | null>(null);
  const active = new Set(activeIds);

  // biome-ignore lint/correctness/useExhaustiveDependencies: onRest đổi mỗi lần render cha; chỉ chạy lại khi đề bài thực sự đổi.
  useEffect(() => {
    if (!target) return;
    setLanded(null);
    const index = clusters.findIndex((c) => c.id === target);
    if (index < 0) return;
    // Kim chỉ ở đỉnh: xoay sao cho tâm lát cắt về đúng 12 giờ.
    const centre = index * slice + slice / 2;
    const landing = (360 - centre) % 360;
    const current = rotation.current % 360;
    const next =
      rotation.current + SPINS * 360 + ((landing - current + 360) % 360);
    rotation.current = next;
    setAngle(next);

    // prefers-reduced-motion: framer-motion nhảy thẳng tới góc đích mà không
    // phát sự kiện onAnimationComplete một cách đáng tin cậy — gọi onRest
    // trực tiếp thay vì chờ một animation không chạy.
    if (reduced) {
      setLanded(target);
      onRest?.();
    }
  }, [target, clusters, slice, reduced]);

  return (
    <div
      className={cn("relative mx-auto", className)}
      style={{ width: SIZE, height: SIZE }}
    >
      <div
        aria-hidden
        className="absolute inset-0 rounded-full bg-gradient-to-b from-primary/10 to-transparent blur-xl"
      />
      {/* Kim chỉ: một cái pin bo tròn, đứng yên trong khi vành xoay bên dưới. */}
      <div
        aria-hidden
        className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-2.5 drop-shadow-md"
      >
        <svg width="22" height="28" viewBox="0 0 22 28">
          <title>Kim chỉ</title>
          <path
            d="M11 28 C11 28 0 15.5 0 11 A11 11 0 1 1 22 11 C22 15.5 11 28 11 28 Z"
            className="fill-primary"
          />
          <circle cx="11" cy="11" r="4" className="fill-background" />
        </svg>
      </div>
      <motion.div
        className="h-full w-full overflow-hidden rounded-full shadow-[0_0_0_6px_var(--color-background),0_0_0_8px_var(--color-border-soft),0_18px_36px_-16px_rgba(0,0,0,0.45)]"
        animate={{ rotate: angle }}
        transition={
          reduced ? { duration: 0 } : { duration: 2.6, ease: [0.16, 1, 0.3, 1] }
        }
        // Câu hỏi chỉ hiện sau khi bánh xe dừng — khoảng lặng đó là phần đắt
        // nhất của hiệu ứng, nên nó do onAnimationComplete quyết định.
        onAnimationComplete={() => {
          if (!target) return;
          setLanded(target);
          onRest?.();
        }}
      >
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width={SIZE}
          height={SIZE}
          role="img"
          aria-label="Vòng quay chủ đề"
        >
          <title>Vòng quay chủ đề</title>
          {clusters.map((cluster, i) => {
            const on = active.size === 0 || active.has(cluster.id);
            const isWinner = landed === cluster.id;
            const mid = ((i * slice + slice / 2 - 90) * Math.PI) / 180;
            const color = CHART_TOKENS[i % CHART_TOKENS.length];
            return (
              <g
                key={cluster.id}
                className={cn(
                  "transition-transform duration-300",
                  isWinner && "scale-[1.04]",
                )}
                style={
                  isWinner ? { transformOrigin: `${R}px ${R}px` } : undefined
                }
              >
                <path
                  d={sectorPath(i * slice, (i + 1) * slice)}
                  className="stroke-background"
                  style={{
                    fill: on ? color : "var(--color-muted)",
                    opacity: on ? (isWinner ? 1 : 0.85) : 0.35,
                  }}
                  strokeWidth={3}
                />
                <text
                  x={R + Math.cos(mid) * R * 0.68}
                  y={R + Math.sin(mid) * R * 0.68}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={24}
                  opacity={on ? 1 : 0.4}
                >
                  {cluster.emoji}
                </text>
              </g>
            );
          })}
          <circle
            cx={R}
            cy={R}
            r={R * 0.17}
            className="fill-background stroke-border"
            strokeWidth={2}
          />
        </svg>
      </motion.div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-background shadow-sm">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
      </div>
    </div>
  );
}

function sectorPath(from: number, to: number): string {
  const a = point(from);
  const b = point(to);
  return `M ${R} ${R} L ${a.x} ${a.y} A ${R} ${R} 0 0 1 ${b.x} ${b.y} Z`;
}

function point(deg: number): { x: number; y: number } {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: R + Math.cos(rad) * R, y: R + Math.sin(rad) * R };
}
