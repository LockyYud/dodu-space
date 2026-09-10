import Link from "next/link";

import { LocalizedText } from "@/components/custom/localized-text";
import { getBlogPosts } from "@/lib/content/blog";

/**
 * The "Currently" note points at whatever the newest roadmap-ish post is, so
 * the homepage says what I am working on without a second place to update.
 */
async function getCurrentFocusHref() {
  const posts = await getBlogPosts();
  const roadmap = posts.find((post) =>
    (post.tags ?? []).some((tag) => tag === "Roadmap"),
  );
  return roadmap ? `/blogs/${roadmap.slug}` : "/blogs";
}

export async function HeroSection() {
  const focusHref = await getCurrentFocusHref();

  return (
    <section className="grid gap-10 pb-20 pt-16 md:grid-cols-12 md:gap-8 md:pb-28 md:pt-24">
      <div className="flex min-w-0 flex-col gap-8 md:col-span-8">
        <p className="eyebrow eyebrow-accent">
          No. 01 &nbsp;·&nbsp;{" "}
          <LocalizedText vi="AI ENGINEER, HÀ NỘI" en="AI ENGINEER, HANOI" />
        </p>

        <h1 className="max-w-[40ch] text-[2.75rem] leading-[1.05] sm:text-6xl md:text-[4.25rem]">
          <LocalizedText
            vi="Ghi chép về việc xây hệ thống retrieval có thể "
            en="Notes on making retrieval systems that can be "
          />
          <em className="font-light">
            <LocalizedText vi="đo được" en="measured" />
          </em>
          <LocalizedText vi=", không chỉ demo được." en=", not just demoed." />
        </h1>

        <p className="max-w-[38rem] text-xl leading-relaxed text-muted-foreground">
          <LocalizedText
            vi="Tôi xây pipeline RAG và backend phục vụ LLM, và viết ghi chú đọc paper về những kỹ thuật đứng sau chúng: ý tưởng là gì, cái gì thật sự quan trọng khi lên production, và thí nghiệm nào tôi sẽ chạy trước khi tin nó."
            en="I build RAG pipelines and LLM backend services, and I write reading notes on the papers behind them: what the idea is, what actually matters in production, and the experiment I would run before trusting it."
          />
        </p>
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-6 md:col-span-3 md:col-start-10 md:mt-10">
        <p className="eyebrow">
          <LocalizedText vi="ĐANG LÀM" en="CURRENTLY" />
        </p>
        <p className="text-[17px] leading-relaxed text-muted-foreground">
          <LocalizedText
            vi="Dựng bộ đánh giá cho hybrid retrieval và reranking. Mười hai kỹ thuật, một benchmark, theo thứ tự."
            en="Building an evaluation harness for hybrid retrieval and reranking. Twelve techniques, one benchmark, in order."
          />
        </p>
        <Link href={focusHref} className="link-action text-[17px]">
          <LocalizedText vi="Đọc roadmap →" en="Read the roadmap →" />
        </Link>
      </div>
    </section>
  );
}
