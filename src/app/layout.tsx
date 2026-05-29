import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import {
  CommandPalette,
  type CommandPaletteItem,
} from "@/components/custom/command-palette";
import { LanguageProvider } from "@/components/custom/language-provider";
import { PageTransition } from "@/components/custom/page-transition";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { navigationConfig } from "@/config/navigation";
import { getBlogPosts } from "@/lib/content/blog";
import { getProjects } from "@/lib/content/project";
import { createMetadata } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = createMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [posts, projects] = await Promise.all([getBlogPosts(), getProjects()]);

  const items: CommandPaletteItem[] = [
    ...navigationConfig.map((n) => ({
      id: `page:${n.href}`,
      title: n.title,
      titleEn: n.titleEn,
      href: n.href,
      group: "pages" as const,
    })),
    ...projects.slice(0, 8).map((p) => ({
      id: `project:${p.slug}`,
      title: p.title,
      href: `/projects/${p.slug}`,
      group: "projects" as const,
    })),
    ...posts.slice(0, 8).map((p) => ({
      id: `blog:${p.slug}`,
      title: p.title,
      href: `/blogs/${p.slug}`,
      group: "blogs" as const,
    })),
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <TooltipProvider>
              <Header />
              <main className="mx-auto min-h-[calc(100svh-3.5rem)] w-full max-w-5xl overflow-x-hidden px-4 py-10">
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer />
              <CommandPalette items={items} />
            </TooltipProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
