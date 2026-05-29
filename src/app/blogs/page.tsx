import { BlogPageClient } from "@/components/blog/blog-page-client";
import { getBlogPosts } from "@/lib/content/blog";

export default async function BlogsPage() {
  const posts = await getBlogPosts();
  return <BlogPageClient posts={posts} />;
}
