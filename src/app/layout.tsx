import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import {
  CommandPalette,
  type CommandPaletteItem,
} from "@/components/custom/command-palette";
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
      href: n.href,
      group: "Pages" as const,
    })),
    ...projects.slice(0, 8).map((p) => ({
      id: `project:${p.slug}`,
      title: p.title,
      href: `/projects/${p.slug}`,
      group: "Projects" as const,
    })),
    ...posts.slice(0, 8).map((p) => ({
      id: `note:${p.slug}`,
      title: p.title,
      href: `/blog/${p.slug}`,
      group: "Notes" as const,
    })),
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <Header />
            <main className="mx-auto min-h-[calc(100svh-3.5rem)] max-w-4xl px-4 py-10">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <CommandPalette items={items} />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
