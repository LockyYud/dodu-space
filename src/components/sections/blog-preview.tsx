import Link from "next/link";

import { PostRow } from "@/components/blog/post-row";
import { LocalizedText } from "@/components/custom/localized-text";
import { getBlogPosts } from "@/lib/content/blog";
import { RESEARCH_THREADS } from "@/lib/content/threads";

export async function BlogPreviewSection() {
  const posts = await getBlogPosts();
  const latest = posts.slice(0, 5);
  const ragCount = posts.filter(
    (post) =>
      RESEARCH_THREADS.find((thread) => thread.id === "rag-systems")?.matches(
        post,
      ) === true,
  ).length;

  return (
    <section className="grid gap-8 pb-20 md:grid-cols-12 md:pb-24">
      <div className="flex flex-col gap-3 md:col-span-3">
        <p className="eyebrow">
          <LocalizedText vi="BÀI VIẾT MỚI" en="RECENT WRITING" />
        </p>
        <p className="text-[17px] italic leading-relaxed text-muted-foreground">
          <LocalizedText
            vi={`Ghi chú đọc paper và bài kỹ thuật. ${ragCount} bài trong mạch RAG.`}
            en={`Paper reading notes and engineering posts. ${ragCount} in the RAG thread.`}
          />
        </p>
      </div>

      <div className="flex flex-col md:col-span-9">
        <div className="border-t border-border">
          {latest.map((post) => (
            <PostRow key={post.slug} post={post} />
          ))}
        </div>
        <Link href="/blogs" className="link-action pt-5 text-[17px]">
          <LocalizedText
            vi={`Tất cả ${posts.length} bài, theo mạch →`}
            en={`All ${posts.length} posts, by thread →`}
          />
        </Link>
      </div>
    </section>
  );
}
