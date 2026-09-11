"use client";

import { motion, useReducedMotion } from "framer-motion";
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

const SIZE = 260;
const R = SIZE / 2;
const SPINS = 4;

export function SpinWheel({
  clusters,
  activeIds,
  target,
  onRest,
  className,
}: {
  clusters: Cluster[];
  /** Cụm của chu kỳ hiện tại. Cụm ngoài chu kỳ làm mờ và không bao giờ dừng
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
  const active = new Set(activeIds);

  useEffect(() => {
    if (!target) return;
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
  }, [target, clusters, slice]);

  return (
    <div
      className={cn("relative mx-auto", className)}
      style={{ width: SIZE, height: SIZE }}
    >
      <div
        aria-hidden
        className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1 border-x-8 border-t-[14px] border-x-transparent border-t-primary"
      />
      <motion.div
        animate={{ rotate: angle }}
        transition={
          reduced ? { duration: 0 } : { duration: 2.6, ease: [0.16, 1, 0.3, 1] }
        }
        // Câu hỏi chỉ hiện sau khi bánh xe dừng — khoảng lặng đó là phần đắt
        // nhất của hiệu ứng, nên nó do onAnimationComplete quyết định.
        onAnimationComplete={() => {
          if (target) onRest?.();
        }}
        style={{ width: SIZE, height: SIZE }}
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
            const mid = ((i * slice + slice / 2 - 90) * Math.PI) / 180;
            return (
              <g key={cluster.id}>
                <path
                  d={sectorPath(i * slice, (i + 1) * slice)}
                  className={cn(
                    "stroke-background",
                    on
                      ? i % 2 === 0
                        ? "fill-primary/25"
                        : "fill-primary/10"
                      : "fill-muted",
                  )}
                  strokeWidth={2}
                  opacity={on ? 1 : 0.45}
                />
                <text
                  x={R + Math.cos(mid) * R * 0.68}
                  y={R + Math.sin(mid) * R * 0.68}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={22}
                  opacity={on ? 1 : 0.35}
                >
                  {cluster.emoji}
                </text>
              </g>
            );
          })}
          <circle
            cx={R}
            cy={R}
            r={R * 0.16}
            className="fill-background stroke-border"
            strokeWidth={2}
          />
        </svg>
      </motion.div>
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
