import Link from "next/link";
import { BlogCard } from "@/components/blog/blog-card";
import { AnimatedSection } from "@/components/custom/animated-section";
import { buttonVariants } from "@/lib/button-variants";
import { getBlogPosts } from "@/lib/content/blog";

export async function BlogPreviewSection() {
  const posts = await getBlogPosts();
  const latest = posts.slice(0, 3);

  return (
    <AnimatedSection>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Notes</h2>
        <Link href="/blog" className={buttonVariants({ variant: "ghost" })}>
          View all
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {latest.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </AnimatedSection>
  );
}
