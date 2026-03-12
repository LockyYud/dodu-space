export type NavItem = {
  title: string;
  href: string;
};

export const navigationConfig: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Projects", href: "/projects" },
  { title: "Notes", href: "/blog" },
  { title: "Craft", href: "/craft" },
  { title: "About", href: "/about" },
];
