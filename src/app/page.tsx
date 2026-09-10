import { BlogPreviewSection } from "@/components/sections/blog-preview";
import { FeaturedProjectsSection } from "@/components/sections/featured-projects";
import { HeroSection } from "@/components/sections/hero";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <BlogPreviewSection />
      <FeaturedProjectsSection />
    </div>
  );
}
