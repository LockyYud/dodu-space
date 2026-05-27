import { BlogPageClient } from "@/components/blog/blog-page-client";
import { getBlogPosts } from "@/lib/content/blog";

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return <BlogPageClient posts={posts} />;
}
