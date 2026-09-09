import Link from "next/link";
import { ErrorList } from "@/components/ielts/error-list";
import { ERROR_RULES, isErrorRule } from "@/lib/ielts/error-rules";
import { RULE_STUDY_HINT } from "@/lib/ielts/howto";
import { toISODate } from "@/lib/ielts/srs";
import { listCards } from "@/server/ielts/errors";

export const dynamic = "force-dynamic";

/**
 * `?rule=` là đường mà ô "Drill ngữ pháp" trên trang Hôm nay trỏ tới: nó chỉ ra
 * nhóm lỗi lặp nhiều nhất, và link này mở đúng những câu đã sai của nhóm đó để
 * người học viết lại. Không có bộ lọc thì lời khuyên "đánh vào nhóm lỗi lặp
 * nhiều nhất" không làm theo được.
 */
export default async function ErrorsPage({
  searchParams,
}: {
  searchParams: Promise<{ rule?: string }>;
}) {
  const { rule } = await searchParams;
  const all = await listCards();
  const active = rule && isErrorRule(rule) ? rule : null;
  const cards = active ? all.filter((card) => card.rule === active) : all;

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {active ? ERROR_RULES[active].label : "Kho lỗi"}
        </h1>
        {active ? (
          <p className="text-sm text-muted-foreground">
            {cards.length} thẻ trong nhóm này. Che phần sửa, tự viết lại từng
            câu, rồi mới so.
            {RULE_STUDY_HINT[active] ? ` Tra: ${RULE_STUDY_HINT[active]}.` : ""}{" "}
            <Link
              href="/ielts/errors"
              className="text-primary underline underline-offset-2"
            >
              Xem tất cả
            </Link>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Toàn bộ lỗi đã lưu. Lỗi sai lặp ≥ 3 lần được đánh dấu "cứng đầu".
          </p>
        )}
      </header>
      <ErrorList cards={cards} today={toISODate()} />
    </section>
  );
}
