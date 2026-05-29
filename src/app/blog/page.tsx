import { permanentRedirect } from "next/navigation";

export default async function BlogPage() {
  permanentRedirect("/blogs");
}
