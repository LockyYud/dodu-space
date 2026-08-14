"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface LearningSource {
  title: string;
  url: string;
  source: string;
  summary?: string;
  level?: string;
}

export function SourceRunner({
  sources,
  onPick,
  onComplete,
}: {
  sources: LearningSource[];
  onPick: (source: LearningSource) => void;
  onComplete: () => void;
}) {
  const [selected, setSelected] = useState<LearningSource | null>(null);
  const [showFrame, setShowFrame] = useState(false);
  const recommended = sources[0];

  function pick(source: LearningSource) {
    setSelected(source);
    setShowFrame(true);
    onPick(source);
  }

  return (
    <div className="space-y-3">
      {!selected ? (
        <div className="space-y-3 rounded-lg border bg-muted/10 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-medium text-primary">
                Nguồn được đề xuất
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{recommended.title}</p>
                <Badge variant="secondary" className="text-[10px]">
                  {recommended.source}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {recommended.summary ||
                  "Phù hợp với phiên hôm nay; chỉ cần làm một nguồn và chốt kết quả."}
              </p>
            </div>
            <Button onClick={() => pick(recommended)}>Bắt đầu nguồn này</Button>
          </div>

          {sources.length > 1 && (
            <details className="border-t pt-3">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                Đổi nguồn khác ({sources.length - 1} lựa chọn)
              </summary>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {sources.slice(1).map((source) => (
                  <button
                    key={source.url}
                    type="button"
                    onClick={() => pick(source)}
                    className="rounded-md border p-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">
                        {source.source}
                      </Badge>
                      {source.level && (
                        <span className="truncate text-[10px] text-muted-foreground">
                          {source.level}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-medium">{source.title}</p>
                  </button>
                ))}
              </div>
            </details>
          )}
        </div>
      ) : (
        <div className="space-y-3 rounded-lg border bg-muted/10 p-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-primary">Đang làm nguồn</p>
              <p className="text-sm font-medium">{selected.title}</p>
              <p className="text-xs text-muted-foreground">
                Giữ timer và bước ghi nhận trong app. Một số nguồn chặn iframe;
                khi đó dùng nút mở nguồn rồi quay lại đây để chốt kết quả.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="xs"
                variant="outline"
                onClick={() => setSelected(null)}
              >
                Đổi nguồn
              </Button>
              <a href={selected.url} target="_blank" rel="noreferrer">
                <Button size="xs" variant="outline">
                  Mở nguồn ↗
                </Button>
              </a>
            </div>
          </div>
          {showFrame && (
            <iframe
              title={`Nguồn học: ${selected.title}`}
              src={selected.url}
              className="h-[480px] w-full rounded-md border bg-background"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
            <p className="text-sm text-muted-foreground">
              Làm xong nguồn này rồi mới ghi kết quả. Không cần điền gì trong
              lúc đang làm.
            </p>
            <Button onClick={onComplete}>Tôi đã làm xong →</Button>
          </div>
        </div>
      )}
    </div>
  );
}
