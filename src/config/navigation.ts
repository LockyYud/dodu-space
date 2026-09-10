export type NavItem = {
  title: string;
  titleEn: string;
  href: string;
};

export const navigationConfig: NavItem[] = [
  { title: "Bài viết", titleEn: "Writing", href: "/blogs" },
  { title: "Dự án", titleEn: "Work", href: "/projects" },
  { title: "Về tôi", titleEn: "About", href: "/about" },
  { title: "CV", titleEn: "CV", href: "/resume" },
];
