import { permanentRedirect } from "next/navigation";

export async function generateStaticParams() {
  return [];
}

type BlogPostPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  permanentRedirect(`/blogs/${slug}`);
}
