import { BlogCard } from "@/components/blog/blog-card";
import { getBlogPosts } from "@/lib/content/blog";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Notes</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Research notes, experiments, and system write-ups.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
