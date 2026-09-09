import type { HowTo, HowToSource } from "@/lib/ielts/howto";

/**
 * Phần "Cách làm" của một ô.
 *
 * Server component, gập bằng `<details>` thuần: mở ra không tốn JS, và mặc định
 * đóng để danh sách vẫn đọc được như một bản kế hoạch.
 *
 * Các bước là văn bản thuần: component này không parse markdown, nên `**...**`
 * trong dữ liệu sẽ hiện ra nguyên dấu sao. Người đã quen thì không
 * bao giờ phải mở; người chưa quen thì không phải đi hỏi ở đâu khác.
 */
export function HowToBlock({
  howTo,
  sources,
  extra,
}: {
  howTo: HowTo;
  sources: HowToSource[];
  /** Dòng riêng cho ô này, ví dụ nhóm lỗi đang lặp nhiều nhất. */
  extra?: React.ReactNode;
}) {
  return (
    <details className="mt-2 w-full">
      <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
        Cách làm
      </summary>
      <div className="mt-2 space-y-2 rounded-lg border border-dashed p-3 text-xs">
        {extra}
        <ol className="list-decimal space-y-1 pl-4">
          {howTo.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        {howTo.pitfall && (
          <p className="text-amber-600 dark:text-amber-400">
            Bẫy hay gặp: {howTo.pitfall}
          </p>
        )}
        {sources.length > 0 && (
          <p className="text-muted-foreground">
            Nguồn:{" "}
            {sources.map((source, index) => (
              <span key={source.url}>
                {index > 0 && " · "}
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2"
                >
                  {source.label}
                </a>
              </span>
            ))}
          </p>
        )}
      </div>
    </details>
  );
}
