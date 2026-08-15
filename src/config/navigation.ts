export type NavItem = {
  title: string;
  titleEn: string;
  href: string;
};

export const navigationConfig: NavItem[] = [
  { title: "Trang chủ", titleEn: "Home", href: "/" },
  { title: "Dự án", titleEn: "Projects", href: "/projects" },
  { title: "Bài viết", titleEn: "Blogs", href: "/blogs" },
  { title: "Craft", titleEn: "Craft", href: "/craft" },
  { title: "Về tôi", titleEn: "About", href: "/about" },
  { title: "CV", titleEn: "Resume", href: "/resume" },
];
