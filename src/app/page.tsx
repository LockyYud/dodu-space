import { AboutPreviewSection } from "@/components/sections/about-preview";
import { BlogPreviewSection } from "@/components/sections/blog-preview";
import { ContactSection } from "@/components/sections/contact";
import { FeaturedProjectsSection } from "@/components/sections/featured-projects";
import { HeroSection } from "@/components/sections/hero";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <AboutPreviewSection />
      <FeaturedProjectsSection />
      <BlogPreviewSection />
      <ContactSection />
    </div>
  );
}
